/**
 * Start decap-server with cwd = repo root so config paths like
 * `website/docs/...` resolve correctly (GitHub backend uses the same paths).
 */
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..', '..');

console.log(`Starting decap-server from ${repoRoot}`);
console.log('Remember: uncomment `local_backend: true` in static/admin/config.yml');

const child = spawn('npx', ['--yes', 'decap-server'], {
  cwd: repoRoot,
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => process.exit(code ?? 0));
