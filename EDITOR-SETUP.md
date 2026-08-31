# Editor setup — Keystatic, review gate, and preview

How the docs get edited and published, and what still needs configuring on
GitHub and Cloudflare. Companion to `website/ADMIN-EDITING.md`, which is the
day-to-day guide for editors.

---

## The loop

```
editor opens /studio
   ├─ left  — Keystatic, formatted editing, confined to draft/* branches
   ├─ right — the branch, rendered by the real Docusaurus build
   ├─ "Create pull request"
   │     ├─ CI comments the preview links
   │     └─ CI runs the build as a required check
   ├─ reviewer reads the rendered page and approves
   └─ merge to main → published
```

Two properties worth stating plainly, because they are the point of the whole
setup: **an editor cannot publish without review**, and **a broken link cannot
reach production silently**.

---

---

## Live URLs

| What | Where |
|---|---|
| Editor (Keystatic + Studio) | https://simpaisa-docs-editor.mohammad-omar.workers.dev/studio |
| Keystatic admin directly | https://simpaisa-docs-editor.mohammad-omar.workers.dev/keystatic |
| Docs site | https://simpaisa-docs.pages.dev |

Both are deployed and verified. Editors sign in with their own GitHub account
through the **Simpaisa Docs Editor** app — there is no shared password, and each
editor's commits are attributed to them.

Anyone who needs access has to be a collaborator on
`Sim-Paisa/Api-docs-selfhosted` **and** be covered by the app installation.
Removing someone from the repository removes their editor access; there is no
second place to revoke.

## What still needs doing (needs an account, not code)

These are deliberately not automated — each one changes a live system.

1. **Branch protection on `main`.** Require a pull request, one approval, and
   tick **`build`** under required status checks. The rule does nothing without
   that named check: a PR whose build failed will otherwise merge cleanly.
2. **Branch previews.** The `simpaisa-docs` Pages project exists and serves
   production, but it was created as a *direct upload* project, so Cloudflare is
   not watching the repository and will not build draft branches. Direct-upload
   projects cannot be converted — recreate it through the dashboard with
   *Connect to Git* (root `website`, build `npm ci && npm run build`, output
   `build`, `DOCS_BASE_URL=/`). The name and URL can stay the same. Until then
   the preview links in PR comments will 404.
3. **Revoke the Vercel token** and delete `.github/workflows/deploy-docs.yml` in
   the Keystatic trial repo — **after** Pages is confirmed working, or the trial
   deploy breaks. That token is a full-account credential readable by every
   collaborator, so this should not wait long.
4. **Install the Keystatic GitHub App** on this repository, and set the four
   `KEYSTATIC_*` values from `.env.example` wherever the editor is hosted.

---

## Preview: two modes, one switch

| Mode | Latency | Needs |
|---|---|---|
| Cloudflare Pages branch build | 60–90s | nothing but the Pages project |
| `preview-service/` | ~0.5s | a small host to run a container |

The Studio prefers the preview service when `NEXT_PUBLIC_PREVIEW_SERVICE` is
set and falls back to Pages otherwise, so moving from one to the other is a
config change rather than a code change. See `preview-service/README.md`.

A dev server is not a production build: search is not indexed and
`onBrokenLinks: 'throw'` does not fire. That is exactly why the pull-request
build check is required rather than advisory.

---

## Running it locally

```bash
# editor on :3001
NEXT_PUBLIC_KEYSTATIC_STORAGE=local npm run dev

# docs on :3002
cd website && npm start -- --port 3002
```

Open <http://localhost:3001/studio>. In local mode Keystatic writes straight to
disk and Docusaurus hot-reloads, so preview is instant. Local mode does not
commit, so there are no branches or pull requests in this mode.

---

## Housekeeping scripts

| Script | What it does |
|---|---|
| `scripts/prepare-corpus-for-editor.mjs` | Makes pages openable in the editor — strips redundant `@theme` imports, converts the banner wrapper to `<Banner />`, drops stray `<br />`. Idempotent; `--check` reports without writing. |
| `scripts/normalize-categories.mjs` | Repairs `_category_.json` files the editor writes in a shape Docusaurus cannot read. Runs in CI; `--check` fails the build instead of writing. |
| `scripts/gen-docs-tree.mjs` | Regenerates the Studio's navigation tree. Runs automatically before build. |

---

## The component palette

Editors can insert `Tabs`, `Admonition`, `Button`, `ResizableTable`, `Banner`,
and `Raw`. Every one of them must stay registered in
`website/src/theme/MDXComponents.js`, or pages using it fail to build.

`Raw` takes raw HTML and exists so that a layout nobody anticipated does not
require an engineer. It is safe **only** because publishing requires a reviewed
pull request and a passing build — if either of those is ever removed, `Raw`
needs sanitising or dropping.

Existing `:::note` admonitions are untouched and render correctly. They will
read as plain text in the editor until someone converts them to `<Admonition>`,
which is a content decision, not a blocker.

---

## Two traps this deployment actually hit

Both produced a plausible-looking success rather than an error, so they are
worth knowing about before someone rebuilds by hand.

**Never build this from Git Bash on Windows.** MSYS rewrites a value of `/` into
the Git installation path, so `DOCS_BASE_URL=/` silently produced a site whose
every URL began `/C:/Users/.../Git/`. Docusaurus printed `[SUCCESS]` and exited
0. Build from PowerShell, or export `MSYS_NO_PATHCONV=1`.

**Never pipe a secret into `wrangler secret put` from PowerShell 5.1.** It
prepends a UTF-8 BOM to the first write, so the stored value gains a leading
`﻿`. The deploy succeeds and sign-in then fails against a client ID that
looks correct in every dashboard. Use `wrangler secret bulk <file.json>` with an
ASCII, LF, BOM-free file — or set the values in the Cloudflare dashboard.
