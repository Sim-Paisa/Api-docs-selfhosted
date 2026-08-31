# Deploying to Cloudflare

Two things get deployed, and they are independent:

| | What | Where |
|---|---|---|
| **Docs site** | the public documentation | Cloudflare **Pages** |
| **Editor** | the Keystatic admin + Studio | Cloudflare **Workers** |

Both fit inside free tiers that permit commercial use, which is the reason for
moving off Vercel: its Hobby plan forbids commercial use, so hosting the editor
there means $20/seat/month against a $0 budget.

---

## Already verified

Measured on this repository, not assumed:

| Check | Result |
|---|---|
| Next.js 14 → 16 upgrade | compiles clean, all 4 routes intact, no app code changes needed |
| `opennextjs-cloudflare build` | succeeds, produces `.open-next/worker.js` |
| Worker upload size | **1.08 MiB gzipped** against a **3 MiB** free-tier limit |
| Bindings | `ASSETS` and `WORKER_SELF_REFERENCE` resolve correctly |

The remaining steps all need credentials, which is why they are a runbook rather
than a script.

---

## 1. Docs site → Cloudflare Pages

Connect the repository in the Cloudflare dashboard (Workers & Pages → Create →
Pages → Connect to Git) with:

| Setting | Value |
|---|---|
| Root directory | `website` |
| Build command | `npm ci && npm run build` |
| Output directory | `build` |
| Environment variable | `DOCS_BASE_URL` = `/` |

`docusaurus.config.js` reads `DOCS_BASE_URL`/`DOCS_URL` from the environment, so
the same config serves both this and the existing GitHub Pages deployment at its
subpath. Nothing needs editing.

Pages then builds **every branch** to `<branch-alias>.<project>.pages.dev`, which
is what gives editors a preview of unpublished work. Cloudflare lowercases the
branch and replaces non-alphanumeric runs with hyphens, so `draft/my-change` is
served at `draft-my-change.<project>.pages.dev`.

Afterwards set two things so the rest of the system finds it:

- `NEXT_PUBLIC_PAGES_PROJECT` on the editor — the Studio builds preview URLs from it
- a repository variable `PREVIEW_SERVICE_URL` — turns the PR comment's plain file
  list into clickable preview links

Free tier: 500 builds/month, unlimited bandwidth and seats.

---

## 2. Editor → Cloudflare Workers

```bash
npx wrangler login          # interactive, one time

npx wrangler secret put KEYSTATIC_SECRET
npx wrangler secret put KEYSTATIC_GITHUB_CLIENT_ID
npx wrangler secret put KEYSTATIC_GITHUB_CLIENT_SECRET

npm run cf:deploy           # builds through OpenNext, then deploys
```

`NEXT_PUBLIC_*` values are inlined into the client bundle at build time, so they
are **not** secrets and must be present in the build environment rather than set
with `wrangler secret`:

```
NEXT_PUBLIC_KEYSTATIC_STORAGE=github
NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=<app slug>
NEXT_PUBLIC_KEYSTATIC_REPO=Sim-Paisa/Api-docs-selfhosted
NEXT_PUBLIC_PAGES_PROJECT=<pages project name>
```

### GitHub App

The existing app points at the trial repository. Either install it on
`Sim-Paisa/Api-docs-selfhosted` as well, or create a fresh one. Either way its
**Callback URL** must become:

```
https://<worker-subdomain>.workers.dev/api/keystatic/github/oauth/callback
```

Sign-in fails with a redirect mismatch until that matches exactly.

---

## 3. Only after Cloudflare is confirmed working

Delete `.github/workflows/deploy-docs.yml` in the Keystatic trial repository and
**revoke the Vercel token it uses**. That token is a full-account credential
stored as a repository secret, readable by anyone with write access — which is
every editor you onboard. Do it in this order or the trial deploy breaks first.

---

## Why Workers rather than Vercel

- **Cost.** Vercel Hobby forbids commercial use; Workers' free tier permits it.
  At a hard $0 budget this decides it on its own.
- **Cold starts.** The Vercel deployment was measured taking **8.4s** on the
  first request after idle, then ~0.5s warm. For an editor opened a few times a
  day that first hit reads as a broken page. Workers start from a V8 isolate
  rather than a container, so there is no comparable pause.
- **One vendor fewer.** The docs OAuth Worker already runs on this account.

---

## If OpenNext ever becomes a problem

The fallback is porting the host shell to Astro — `@keystatic/astro` and
`@astrojs/cloudflare` are both first-party and need no adapter shim. It is
roughly nine files of shell; `keystatic.config.tsx`, the component palette and
the content are untouched. Not needed today, but it is the escape route if a
future Next.js release outpaces the adapter.
