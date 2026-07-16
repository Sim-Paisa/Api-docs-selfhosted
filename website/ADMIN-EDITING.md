# Editing the docs from the website (admin guide)

The docs site has a built-in editor at **`/admin/`**
(`https://sim-paisa.github.io/Api-docs-selfhosted/admin/`) — no local dev setup
needed to fix a typo or update an endpoint description. Every change is
tracked in git exactly like a manual pull request.

For a **side-by-side live preview** of the real Docusaurus render, use the
**Studio** at **`/admin/studio.html`** (editor left, built site right).
"Edit this page" on any doc opens the Studio for that entry.

This only works after the one-time OAuth setup in
[`oauth-worker/README.md`](../oauth-worker/README.md) is done.

## Logging in

Open `/admin/` (or Studio) and click **Login with GitHub**. Only GitHub accounts
with write access to the `Sim-Paisa/Api-docs-selfhosted` repo can get past this
screen — merchants and the public see the login button but cannot proceed. To
add or remove an editor, add or remove them as a repo collaborator on GitHub;
there's no separate admin user list to maintain.

## Studio (split-screen preview)

`/admin/studio.html` hosts:

1. **Left** — Decap CMS editor (same `/admin/` app, deep-linked to the page)
2. **Right** — the **actually built** docs site (faithful preview: admonitions,
   Tabs, Button, code styling)

Deep-link format:

```
/admin/studio.html?collection=getting-started&slug=overview
/admin/studio.html?collection=pay-in-apis&slug=pakistan/cards/capture
```

The preview pane auto-refreshes every 30 seconds after a publish/rebuild
(~1–2 min on production, same loop as Keystatic). Use **Refresh preview** to
nudge sooner. Toggle **auto-refresh** off while reading.

Local Studio with instant HMR: add `&previewBase=http://localhost:3000/Api-docs-selfhosted`
(or open Studio from the local Docusaurus host — it auto-detects localhost).

## Making an edit

1. Pick the collection matching the section you want (Getting Started,
   Pay-in APIs, Pay-out APIs, Platform Reference, Remittance APIs), then the
   page — or open Studio from "Edit this page".
2. Edit the fields — most content lives in **Page content**, which is the
   Markdown body. `Sidebar position` / `Sidebar label` control ordering and
   the name shown in the left nav; leave them blank to keep the current
   values.
3. Use the toolbar **+** inserts for structured blocks (do not hand-type MDX
   when a button exists):
   - **Button** — CTA with label, href, primary/secondary
   - **Tabs** — two-tab scaffold (`<Tabs>` / `<TabItem>`)
   - **Admonition** — `:::note` / tip / info / warning / danger / caution
   - **Resizable table** — markdown table wrapped in `<ResizableTable>`
4. Click **Save**. This does *not* go live immediately — it creates a
   **Draft**.

## Draft → In Review → Ready → published

The site uses Decap's *editorial workflow*, visible under the **Editorial
Workflow** tab in the admin sidebar:

- **Draft** — your saved-but-unpublished change. Keep editing freely; nothing
  is public yet.
- **In Review** — move it here when you want someone else to check it before
  it goes live. This opens a pull request on GitHub
  (`Sim-Paisa/Api-docs-selfhosted`, branch `cms/<page-name>`) that anyone can
  review there too.
- **Ready** — approved, waiting to publish.
- **Publish** — merges the PR into `main`. GitHub Actions then rebuilds and
  redeploys the site automatically; the change is live in about 2–3 minutes.
  Studio's preview pane picks it up on the next refresh.

You can also open the PR directly on GitHub if you prefer reviewing diffs
there instead of in the CMS UI — both stay in sync.

## Local authoring loop (instant preview)

Production Studio waits on the build (~1–2 min). For heads-down drafting,
use the local loop — Decap writes files on disk; Docusaurus HMR updates
instantly.

1. In `website/static/admin/config.yml`, **uncomment** `local_backend: true`
   (must stay commented for production OAuth / GitHub commits).
2. From `website/`:

   ```bash
   npm run cms:server
   ```

   (starts `decap-server` from the **repo root** so `website/docs/...` paths resolve)

3. In another terminal, from `website/`:

   ```bash
   npm start
   ```

4. Open Studio:

   ```
   http://localhost:3000/Api-docs-selfhosted/admin/studio.html
   ```

5. When done, **re-comment** `local_backend: true` before committing config
   changes intended for production.

Authoring mode = local loop. Review/preview mode = Studio against the built site.

## Adding images

Use the image field/upload button in the editor. Files are committed to
`website/static/img/uploads/` and referenced automatically — no manual file
handling needed.

## Formatting notes / MDX fidelity

- Decap's **built-in** live preview stays off — it cannot render Docusaurus
  components. Use **Studio** (built site) or the **local loop** instead.
- Prefer toolbar components (Button, Tabs, Admonition, Resizable table) over
  raw JSX so saves don't mangle markup.
- Tabs with more than two items, or unusual JSX, should be edited carefully
  in markdown; Decap is markdown-first and will not become fully MDX-native.
- Don't edit `_category_.json` files here — those control sidebar folder
  structure and are managed directly in git.
- Engineers: run `npm run roundtrip` to check that registered component
  patterns still serialize cleanly across the corpus.

## If something goes wrong

- **Login fails / redirects to an error page**: the OAuth worker isn't
  deployed or its secrets aren't set yet — see `oauth-worker/README.md`.
- **Published change didn't show up**: check the "Deploy Docs" workflow run
  under the repo's **Actions** tab for build errors (most commonly a broken
  internal link, which fails the build on purpose). Studio preview may need a
  manual refresh after deploy finishes.
- **Local CMS won't save**: confirm `local_backend: true` is uncommented and
  `npm run cms:server` is running from the repo root (via that script).
- **Wrong person has access**: remove them as a GitHub collaborator on
  `Sim-Paisa/Api-docs-selfhosted`.
