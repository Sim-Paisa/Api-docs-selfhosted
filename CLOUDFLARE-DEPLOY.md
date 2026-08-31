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

---

## Where this actually stands

| Piece | State |
|---|---|
| Docs site | **live** — https://simpaisa-docs.pages.dev |
| Pages project | `simpaisa-docs`, **direct upload** (no Git connection) |
| `PAGES_PROJECT` repo variable | set, so PR comments emit preview links |
| Editor Worker | **not deployed** — blocked on the GitHub App (see below) |
| Account | `b0691534d99d6bf7ca4e3b1a3400ad98`, workers.dev subdomain `mohammad-omar` |

### Two corrections to what this document used to say

**The GitHub App is a prerequisite, not a final step.** Next.js evaluates the
Keystatic route module while collecting route config, and `makeRouteHandler`
throws there if the GitHub credentials are absent. So the editor cannot even
*build* without them:

```
Missing required config in Keystatic API setup when using the 'github' storage mode:
  - clientId, clientSecret, secret
```

There is no ordering problem, though: the Worker URL is fully predictable from
the account subdomain plus the name in `wrangler.jsonc`, so the app can be
created before the Worker exists.

**A direct-upload Pages project cannot be converted to Git-connected.** The site
is live now, but Cloudflare will not build branches for it, because nothing is
watching the repository. Branch previews need one of the two routes below.

---

## Branch previews: pick one

Preview builds per branch are the reason for using Pages at all, so this is not
optional.

**A — Git-connected project (recommended).** Delete `simpaisa-docs` and recreate
it through the dashboard with *Connect to Git*. Cloudflare then builds every
branch by itself. The name and therefore the URL can stay the same.

**B — keep direct upload and deploy from CI.** Requires a Cloudflare API token
as a repository secret. That is the same weakness this project already objected
to in the Vercel setup: anyone with write access can push a workflow that prints
a secret, and every editor has write access. Narrow the token to Pages:Edit if
you take this route — it shrinks the blast radius but does not remove it.

A is better on both counts: no credential in the repository, and no build
minutes spent on GitHub Actions.

## 1. Docs site → Cloudflare Pages

**Link:** https://dash.cloudflare.com/?to=/:account/pages/new/provider/github

Choose the **Pages** path deliberately. Cloudflare now steers new projects toward
Workers static assets, and that is the wrong tool here: Workers gives preview URLs
keyed on a version hash, while Pages gives a *deterministic* branch alias. The
Studio's preview links and the PR comment are both built by transforming a branch
name into a hostname, so they only work on Pages.

| Setting | Value |
|---|---|
| Repository | `Sim-Paisa/Api-docs-selfhosted` |
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

**Link:** https://dash.cloudflare.com/?to=/:account/workers-and-pages/create

Pick **Import a repository**. This uses Workers Builds, which builds and deploys
on Cloudflare's side whenever `main` moves.

Prefer this over `wrangler deploy` from a laptop. `wrangler login` needs an
interactive browser handoff, and what it leaves behind is a full deploy
credential sitting on one person's machine — so deploys silently depend on who
last logged in. Git-connected builds have neither problem.

| Setting | Value |
|---|---|
| Repository | `Sim-Paisa/Api-docs-selfhosted` |
| Root directory | `/` (repo root — the editor lives at the top level) |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx opennextjs-cloudflare deploy` |

`wrangler.jsonc` at the repo root supplies the name, bindings and compatibility
flags, so nothing else needs configuring.

### Two kinds of variable, and the difference matters

They live in **different dashboard screens**, and putting one in the other's
place fails in a way that is annoying to diagnose.

**Build variables** — Worker → Settings → Build → Variables. `NEXT_PUBLIC_*`
values are inlined into the client bundle by the compiler, so they must exist
*while the build runs*. Setting them as runtime secrets leaves them `undefined`
in the browser, and the admin then loads but cannot see the repository:

```
NEXT_PUBLIC_KEYSTATIC_STORAGE=github
NEXT_PUBLIC_KEYSTATIC_REPO=Sim-Paisa/Api-docs-selfhosted
NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=<app slug>
NEXT_PUBLIC_PAGES_PROJECT=<pages project name from step 1>
```

**Runtime secrets** — Worker → Settings → Variables and Secrets → *Encrypt*.
These are read by server code on each request and must never reach the client
bundle:

```
KEYSTATIC_SECRET                 (generate: see below)
KEYSTATIC_GITHUB_CLIENT_ID
KEYSTATIC_GITHUB_CLIENT_SECRET
```

Generate the signing secret locally and paste the output:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### GitHub App — do this first

`Sim-Paisa` is a personal account, not an organisation, so the app is created
under personal settings. This link prefills every field, including the callback:

https://github.com/settings/apps/new?name=Simpaisa+Docs+Editor&description=Keystatic+editor+for+the+Simpaisa+API+documentation.&url=https%3A%2F%2Fsimpaisa-docs-editor.mohammad-omar.workers.dev&callback_urls%5B%5D=https%3A%2F%2Fsimpaisa-docs-editor.mohammad-omar.workers.dev%2Fapi%2Fkeystatic%2Fgithub%2Foauth%2Fcallback&request_oauth_on_install=true&public=false&webhook_active=false&contents=write&pull_requests=write

It requests only **Contents: write** and **Pull requests: write** — enough to
commit to a draft branch and open a pull request, and nothing else. Deliberately
not *Workflows: write*, so a compromised editor session cannot rewrite CI.

After creating it: generate a client secret, then install the app on
`Sim-Paisa/Api-docs-selfhosted`. That yields the three values the build needs.

The callback must match the deployed Worker exactly or sign-in fails with a
redirect mismatch. It is
`https://simpaisa-docs-editor.mohammad-omar.workers.dev/api/keystatic/github/oauth/callback`
because `wrangler.jsonc` names the Worker `simpaisa-docs-editor` and the account
subdomain is `mohammad-omar`. Rename either and this must change too.

### If you would rather deploy from the terminal after all

`wrangler` is installed and working here; only its browser login is blocked. A
scoped API token avoids that:

**Link:** https://dash.cloudflare.com/profile/api-tokens → *Edit Cloudflare
Workers* template. Then `CLOUDFLARE_API_TOKEN=<token> npm run cf:deploy`.

This is the fallback, not the default — it reintroduces the laptop credential
that Git-connected builds exist to remove.

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
