# Editing the docs from the website (admin guide)

The docs site has a built-in editor at **`/admin/`**
(`https://sim-paisa.github.io/Api-docs-selfhosted/admin/`) — no local dev setup
needed to fix a typo or update an endpoint description. Every change is
tracked in git exactly like a manual pull request.

This only works after the one-time OAuth setup in
[`oauth-worker/README.md`](../oauth-worker/README.md) is done.

## Logging in

Open `/admin/` and click **Login with GitHub**. Only GitHub accounts with
write access to the `Sim-Paisa/Api-docs-selfhosted` repo can get past this screen —
merchants and the public see the login button but cannot proceed. To add or
remove an editor, add or remove them as a repo collaborator on GitHub; there's
no separate admin user list to maintain.

## Making an edit

1. Pick the collection matching the section you want (Getting Started,
   Pay-in APIs, Pay-out APIs, Platform Reference, Remittance APIs), then the
   page.
2. Edit the fields — most content lives in **Page content**, which is the
   Markdown body. `Sidebar position` / `Sidebar label` control ordering and
   the name shown in the left nav; leave them blank to keep the current
   values.
3. Click **Save**. This does *not* go live immediately — it creates a
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

You can also open the PR directly on GitHub if you prefer reviewing diffs
there instead of in the CMS UI — both stay in sync.

## Adding images

Use the image field/upload button in the editor. Files are committed to
`website/static/img/uploads/` and referenced automatically — no manual file
handling needed.

## Formatting notes

- The CMS live preview is turned off because the docs use Docusaurus-specific
  Markdown (admonitions like `:::note`, `<Tabs>` components) that the CMS
  can't render accurately. Check how a page looks by opening the merged PR's
  deployed preview, or by pulling the branch locally and running
  `npm start` in `website/`.
- Don't edit `_category_.json` files here — those control sidebar folder
  structure and are managed directly in git.

## If something goes wrong

- **Login fails / redirects to an error page**: the OAuth worker isn't
  deployed or its secrets aren't set yet — see `oauth-worker/README.md`.
- **Published change didn't show up**: check the "Deploy Docs" workflow run
  under the repo's **Actions** tab for build errors (most commonly a broken
  internal link, which fails the build on purpose).
- **Wrong person has access**: remove them as a GitHub collaborator on
  `Sim-Paisa/Api-docs-selfhosted`.
