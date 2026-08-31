# Preview service

Instant, faithful preview of unpublished draft branches.

## Why this exists

`docusaurus build` takes 60–90 seconds and publishes. `docusaurus start` recompiles
only the page you touched — **measured at 0.44s on this corpus** (median of three
timed edits, range 0.43–0.57s, on Windows over OneDrive, which is the worst case) —
and it is 100% faithful, because it *is* Docusaurus rendering the real page with
the real theme, sidebar and navbar.

Nothing about that needed inventing. The only reason preview was slow is that the
dev server ran on an engineer's laptop. This service is that dev server, somewhere
editors can reach.

## How it works

```
GET /draft/my-change/docs/getting-started/overview
     │
     ├─ is a dev server running for branch `draft/my-change`?
     │     no  → git worktree for the branch (node_modules shared, so no install)
     │           `docusaurus start` on a free port, DOCS_BASE_URL=/draft/my-change/
     │     yes → reuse it, mark it recently used
     │
     └─ proxy the request, and the hot-reload websocket, to that server
```

A poll loop fast-forwards each live worktree to its remote head every few seconds,
so a Keystatic save appears in the preview about a second later — no rebuild, no
deploy. Servers idle out after `PREVIEW_IDLE_MINUTES` so the box only carries
active drafts.

## Running it

```bash
npm install
PREVIEW_REPO_URL=https://<token>@github.com/<org>/<repo>.git npm start
# → preview service on :4000 (branches under "draft/")
```

Or with Docker, which is how it is meant to run:

```bash
docker build -t simpaisa-docs-preview .
docker run -d --name docs-preview -p 4000:4000 \
  -e PREVIEW_REPO_URL=https://<token>@github.com/<org>/<repo>.git \
  -e PREVIEW_PUBLIC_ORIGIN=http://docs-preview.internal:4000 \
  -v docs-preview-cache:/app/.cache \
  simpaisa-docs-preview
```

Then point the Studio at it:

```
NEXT_PUBLIC_PREVIEW_SERVICE=http://docs-preview.internal:4000
```

and set the same value as the `PREVIEW_SERVICE_URL` repository variable so pull
requests get live preview links in their review comment.

### First boot is the slow one

The first request for a branch pays a clone plus a Docusaurus cold start — minutes,
not seconds. Everything after that is sub-second. Two things make this a non-issue
in practice:

- **Warm the shared install once.** Put a completed `website/node_modules` at
  `PREVIEW_SHARED_MODULES` (the mounted `.cache` volume). Each new worktree
  symlinks it instead of running `npm ci`.
- **Wake it early.** The Studio requests the preview as soon as it opens, so the
  server is warming while the editor is still reading the page.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | Port this service listens on |
| `PREVIEW_REPO_URL` | — | Clone URL. Needs read access to the docs repo |
| `PREVIEW_BRANCH_PREFIX` | `draft/` | Only branches under this prefix are served |
| `PREVIEW_IDLE_MINUTES` | `45` | Shut a branch's server down after this long unused |
| `PREVIEW_POLL_SECONDS` | `3` | How often to check each branch for new commits |
| `PREVIEW_BASE_PORT` | `4100` | First port used for per-branch dev servers |
| `PREVIEW_SHARED_MODULES` | `./.cache/node_modules` | Warm install shared by all worktrees |
| `PREVIEW_PUBLIC_ORIGIN` | `http://localhost:$PORT` | Origin editors reach this on |

`GET /_status` reports which branches are live, their head commit, and how long
each has been idle.

## Security posture

**This runs development servers. Do not put it on the public internet.**

It is designed for one small internal VM behind the VPN. That is not a compromise
forced by the budget — an editing surface for merchant-facing payments
documentation that is unreachable from outside the company is the better posture,
and it happens to also cost nothing beyond capacity you already own.

Two guards are built in: only branches matching `PREVIEW_BRANCH_PREFIX` are ever
served, and branch names are validated against `^[\w./-]+$` with `..` rejected, so
a request cannot walk out of the worktree directory. Neither is a substitute for
keeping it off the open internet.
