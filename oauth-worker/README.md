# OAuth proxy for the docs admin (Decap CMS)

Decap CMS logs admins in with GitHub, but GitHub's OAuth token exchange needs a
client secret — something that can never live in a static site served from
GitHub Pages. This tiny Cloudflare Worker is the one piece of server-side glue
that makes GitHub login work. It holds no data and does nothing except:

1. `GET /auth` — redirect to GitHub's authorize screen
2. `GET /callback` — swap the returned code for an access token and hand it to
   the Decap admin UI

It costs nothing on Cloudflare's free tier (100k requests/day) and needs no
server maintenance.

## One-time setup

### 1. Create a GitHub OAuth App
GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
- **Homepage URL**: `https://sim-paisa.github.io/Api-docs-selfhosted/`
- **Authorization callback URL**: `https://<your-worker-subdomain>.workers.dev/callback`
  (you'll get the exact worker URL after step 2 — come back and fill this in)

Save the generated **Client ID** and **Client Secret**.

### 2. Deploy the worker
From this folder:

```bash
npm install -g wrangler   # if not already installed
npx wrangler login        # authorize with your (free) Cloudflare account
npx wrangler deploy
```

Wrangler prints the deployed URL, e.g. `https://simpaisa-docs-oauth.<you>.workers.dev`.
Go back to step 1 and set the OAuth App's callback URL to
`https://simpaisa-docs-oauth.<you>.workers.dev/callback`.

### 3. Set the secrets
```bash
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```
(paste the values from step 1 when prompted — they're stored encrypted by
Cloudflare, never committed to git)

### 4. Point the CMS at the worker
In `website/static/admin/config.yml`, set:
```yaml
backend:
  base_url: https://simpaisa-docs-oauth.<you>.workers.dev
```
Commit and push. That's the last piece — `/admin/` on the live site will now
be able to complete GitHub login.

## Who can log in

Anyone can reach `/admin/` and see the login screen, but Decap only grants
access to GitHub accounts with **write access to the `Sim-Paisa/Api-docs-selfhosted`
repo**. Merchants and the public have no path past login. To add or remove an
editor, add or remove them as a GitHub collaborator on the repo — there is no
separate user database to manage.
