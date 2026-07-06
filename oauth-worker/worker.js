// GitHub OAuth proxy for Decap CMS, deployed as a Cloudflare Worker.
//
// GitHub Pages only serves static files, so it cannot complete an OAuth token
// exchange (that requires a client secret, which must never reach the browser).
// This worker is the minimal server-side hop Decap needs:
//   GET /auth      -> redirect the admin to GitHub's authorize screen
//   GET /callback  -> exchange the returned code for an access token, then hand
//                     it back to the Decap admin window via postMessage
//
// Setup: see README.md in this folder.

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const SCOPE = 'repo,user';

function randomState() {
  return crypto.randomUUID();
}

function renderCallbackPage(status, payload) {
  // Decap listens for a window.postMessage with this exact message format.
  const message = JSON.stringify(`authorization:github:${status}:${JSON.stringify(payload)}`);
  return `<!doctype html>
<html><body>
<script>
(function() {
  function receiveMessage(e) {
    window.opener.postMessage(
      ${message},
      e.origin
    );
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body></html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/auth') {
      const state = randomState();
      const redirectUri = `${url.origin}/callback`;
      const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
      authorizeUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authorizeUrl.searchParams.set('redirect_uri', redirectUri);
      authorizeUrl.searchParams.set('scope', SCOPE);
      authorizeUrl.searchParams.set('state', state);

      const response = Response.redirect(authorizeUrl.toString(), 302);
      const headers = new Headers(response.headers);
      headers.append('Set-Cookie', `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=/`);
      return new Response(null, { status: 302, headers });
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const cookie = request.headers.get('Cookie') || '';
      const expectedState = cookie.match(/oauth_state=([^;]+)/)?.[1];

      if (!code || !state || state !== expectedState) {
        return new Response('Invalid OAuth state', { status: 400 });
      }

      const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const tokenData = await tokenResponse.json();

      if (tokenData.error || !tokenData.access_token) {
        return new Response(renderCallbackPage('error', { message: tokenData.error_description || 'OAuth failed' }), {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      return new Response(renderCallbackPage('success', { token: tokenData.access_token, provider: 'github' }), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};
