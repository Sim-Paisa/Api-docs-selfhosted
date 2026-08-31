/**
 * Branch preview service — instant, faithful Docusaurus preview for draft branches.
 *
 * WHY
 * A `docusaurus build` takes 60–90s. A `docusaurus start` dev server recompiles
 * only the page you touched — measured at 0.44s on this corpus — and it is 100%
 * faithful because it *is* Docusaurus rendering the real page, with the real
 * theme, sidebar and navbar. The only thing standing between us and instant
 * preview is that the dev server has to live somewhere an editor can reach.
 * This is that somewhere.
 *
 * HOW
 *   GET /draft/my-change/docs/getting-started/overview
 *        │
 *        ├─ ensure a dev server exists for branch `draft/my-change`
 *        │    · git worktree for the branch (node_modules shared, so no install)
 *        │    · `docusaurus start` on a free port with DOCS_BASE_URL=/<branch>/
 *        └─ proxy the request (and the HMR websocket) to it
 *
 * A poll loop fast-forwards each worktree to its remote head, so a Keystatic save
 * lands in the preview about a second later via hot reload — no rebuild, no deploy.
 * Servers idle out after IDLE_MINUTES so a box only carries active drafts.
 *
 * DEPLOY
 * Designed for one small internal VM behind the VPN — see README.md. That keeps
 * it at zero marginal cost and keeps the editor off the public internet, which is
 * the right posture for merchant-facing payments documentation.
 *
 * This is a development server. Do not expose it publicly.
 */
import { createServer } from 'node:http';
import { spawn, execFile } from 'node:child_process';
import { existsSync, mkdirSync, symlinkSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { connect } from 'node:net';
import httpProxy from 'http-proxy';

const execFileAsync = promisify(execFile);

const CFG = {
  /** Bare-ish clone that every worktree branches from. */
  repoDir: resolve(process.env.PREVIEW_REPO_DIR ?? './.cache/repo'),
  repoUrl: process.env.PREVIEW_REPO_URL ?? '',
  /** Where per-branch worktrees are created. */
  workDir: resolve(process.env.PREVIEW_WORK_DIR ?? './.cache/worktrees'),
  /** A warm node_modules symlinked into each worktree so spin-up skips install. */
  sharedModules: resolve(
    process.env.PREVIEW_SHARED_MODULES ?? './.cache/node_modules'
  ),
  port: Number(process.env.PORT ?? 4000),
  basePort: Number(process.env.PREVIEW_BASE_PORT ?? 4100),
  idleMs: Number(process.env.PREVIEW_IDLE_MINUTES ?? 45) * 60_000,
  pollMs: Number(process.env.PREVIEW_POLL_SECONDS ?? 3) * 1000,
  branchPrefix: process.env.PREVIEW_BRANCH_PREFIX ?? 'draft/',
  bootTimeoutMs: Number(process.env.PREVIEW_BOOT_TIMEOUT_SECONDS ?? 300) * 1000,
};

/** branch -> { port, proc, lastUsed, ready, booting, head } */
const servers = new Map();
const proxy = httpProxy.createProxyServer({ ws: true, xfwd: true });

proxy.on('error', (err, _req, res) => {
  if (res && !res.headersSent && res.writeHead) {
    res.writeHead(502, { 'content-type': 'text/plain' });
    res.end(`preview upstream error: ${err.message}\n`);
  }
});

const log = (...a) => console.log(new Date().toISOString(), ...a);

async function git(cwd, ...args) {
  const { stdout } = await execFileAsync('git', args, { cwd, maxBuffer: 1 << 24 });
  return stdout.trim();
}

function portFree(port) {
  return new Promise((res) => {
    const sock = connect(port, '127.0.0.1');
    sock.on('connect', () => (sock.destroy(), res(false)));
    sock.on('error', () => res(true));
  });
}

async function nextPort() {
  for (let p = CFG.basePort; p < CFG.basePort + 200; p++) {
    if ([...servers.values()].some((s) => s.port === p)) continue;
    if (await portFree(p)) return p;
  }
  throw new Error('no free port for a preview server');
}

function waitForListening(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((res, rej) => {
    const tick = () => {
      const sock = connect(port, '127.0.0.1');
      sock.on('connect', () => (sock.destroy(), res()));
      sock.on('error', () => {
        sock.destroy();
        if (Date.now() > deadline) rej(new Error(`timed out waiting on :${port}`));
        else setTimeout(tick, 500);
      });
    };
    tick();
  });
}

/** Only ever serve branches under the configured prefix. */
function isAllowedBranch(branch) {
  return (
    branch.startsWith(CFG.branchPrefix) &&
    /^[\w./-]+$/.test(branch) &&
    !branch.includes('..')
  );
}

async function ensureRepo() {
  if (existsSync(join(CFG.repoDir, '.git'))) return;
  if (!CFG.repoUrl) throw new Error('PREVIEW_REPO_URL is not set');
  mkdirSync(CFG.repoDir, { recursive: true });
  log('cloning', CFG.repoUrl);
  await execFileAsync('git', ['clone', CFG.repoUrl, CFG.repoDir]);
}

async function ensureWorktree(branch) {
  const dir = join(CFG.workDir, branch.replace(/[/]/g, '__'));
  if (existsSync(dir)) return dir;
  mkdirSync(CFG.workDir, { recursive: true });
  await git(CFG.repoDir, 'fetch', 'origin', branch);
  await git(CFG.repoDir, 'worktree', 'add', '--force', dir, `origin/${branch}`);

  // Share one warm install rather than paying `npm ci` per branch.
  const target = join(dir, 'website', 'node_modules');
  if (existsSync(CFG.sharedModules) && !existsSync(target)) {
    try {
      symlinkSync(CFG.sharedModules, target, 'junction');
    } catch (err) {
      log('warning: could not link shared node_modules —', err.message);
    }
  }
  return dir;
}

async function startServer(branch) {
  const dir = await ensureWorktree(branch);
  const port = await nextPort();
  const basePath = `/${branch}/`;

  const siteDir = join(dir, 'website');

  // Run the Docusaurus CLI through this Node binary rather than the `npx` shim.
  // Node refuses to spawn `.cmd` files directly on Windows since the fix for
  // CVE-2024-27980 (`spawn EINVAL`), and `shell: true` would work but puts a
  // shell in the path of a branch name. Calling the CLI entry point is portable
  // and keeps the argument list literal.
  const cli = join(
    siteDir,
    'node_modules',
    '@docusaurus',
    'core',
    'bin',
    'docusaurus.mjs'
  );
  if (!existsSync(cli)) {
    throw new Error(
      `Docusaurus CLI not found at ${cli} — is PREVIEW_SHARED_MODULES warmed?`
    );
  }

  log(`starting dev server for ${branch} on :${port}`);
  const proc = spawn(
    process.execPath,
    [cli, 'start', '--port', String(port), '--host', '127.0.0.1', '--no-open'],
    {
      cwd: siteDir,
      env: {
        ...process.env,
        DOCS_BASE_URL: basePath,
        DOCS_URL: process.env.PREVIEW_PUBLIC_ORIGIN ?? `http://localhost:${CFG.port}`,
        BROWSER: 'none',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  );
  proc.stdout?.on('data', (d) => process.stdout.write(`[${branch}] ${d}`));
  proc.stderr?.on('data', (d) => process.stderr.write(`[${branch}] ${d}`));
  // Without this, a spawn failure surfaces as an unhandled 'error' event and
  // takes the whole service down instead of just this branch.
  proc.on('error', (err) => {
    log(`dev server for ${branch} failed to start: ${err.message}`);
    servers.delete(branch);
  });
  proc.on('exit', (code) => {
    log(`dev server for ${branch} exited (${code})`);
    servers.delete(branch);
  });

  const entry = { port, proc, dir, lastUsed: Date.now(), ready: false, head: null };
  servers.set(branch, entry);

  await waitForListening(port, CFG.bootTimeoutMs);
  entry.ready = true;
  entry.head = await git(dir, 'rev-parse', 'HEAD').catch(() => null);
  log(`dev server for ${branch} ready on :${port}`);
  return entry;
}

const booting = new Map();
async function ensureServer(branch) {
  const existing = servers.get(branch);
  if (existing?.ready) {
    existing.lastUsed = Date.now();
    return existing;
  }
  if (booting.has(branch)) return booting.get(branch);

  const p = startServer(branch).finally(() => booting.delete(branch));
  booting.set(branch, p);
  return p;
}

/** Fast-forward each live worktree; the dev server hot-reloads the change. */
async function pollBranches() {
  for (const [branch, s] of servers) {
    if (!s.ready) continue;
    try {
      await git(s.dir, 'fetch', 'origin', branch);
      const remote = await git(s.dir, 'rev-parse', `origin/${branch}`);
      if (remote !== s.head) {
        await git(s.dir, 'reset', '--hard', remote);
        s.head = remote;
        log(`${branch} -> ${remote.slice(0, 8)} (hot reload)`);
      }
    } catch (err) {
      log(`poll failed for ${branch}: ${err.message}`);
    }
  }
}

function reapIdle() {
  const now = Date.now();
  for (const [branch, s] of servers) {
    if (now - s.lastUsed <= CFG.idleMs) continue;
    log(`reaping idle server for ${branch}`);
    try {
      s.proc.kill();
    } catch {}
    servers.delete(branch);
    // Leave the worktree in place — respinning it is cheap and avoids a re-clone.
  }
}

/** `/draft/foo/docs/x` -> { branch: 'draft/foo', rest: '/docs/x' } */
function splitBranch(url) {
  const parts = url.split('/').filter(Boolean);
  if (parts.length < 2) return null;
  const branch = `${parts[0]}/${parts[1]}`;
  if (!isAllowedBranch(branch)) return null;
  return { branch, rest: `/${parts.slice(2).join('/')}` };
}

const server = createServer(async (req, res) => {
  if (req.url === '/_status') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify(
        {
          branches: [...servers.entries()].map(([b, s]) => ({
            branch: b,
            port: s.port,
            ready: s.ready,
            head: s.head?.slice(0, 8) ?? null,
            idleSeconds: Math.round((Date.now() - s.lastUsed) / 1000),
          })),
        },
        null,
        2
      )
    );
    return;
  }

  const split = splitBranch(req.url ?? '/');
  if (!split) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end(
      `Preview service.\n\nUse /${CFG.branchPrefix}<name>/docs/<collection>/<slug>\n`
    );
    return;
  }

  try {
    const s = await ensureServer(split.branch);
    proxy.web(req, res, { target: `http://127.0.0.1:${s.port}` });
  } catch (err) {
    res.writeHead(503, { 'content-type': 'text/plain' });
    res.end(`preview for ${split.branch} is not ready: ${err.message}\n`);
  }
});

// Hot reload rides a websocket; without this the preview would never update.
server.on('upgrade', async (req, socket, head) => {
  const split = splitBranch(req.url ?? '/');
  if (!split) return socket.destroy();
  try {
    const s = await ensureServer(split.branch);
    proxy.ws(req, socket, head, { target: `http://127.0.0.1:${s.port}` });
  } catch {
    socket.destroy();
  }
});

await ensureRepo();
setInterval(pollBranches, CFG.pollMs);
setInterval(reapIdle, 60_000);

server.listen(CFG.port, () => {
  log(`preview service on :${CFG.port} (branches under "${CFG.branchPrefix}")`);
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    log('shutting down; stopping dev servers');
    for (const s of servers.values()) {
      try {
        s.proc.kill();
      } catch {}
    }
    process.exit(0);
  });
}
