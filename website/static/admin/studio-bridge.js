/**
 * Studio ↔ Decap navigation bridge (runs inside the admin iframe).
 * Decap boots asynchronously; the parent asks us to navigate via postMessage
 * and we retry setting the hash until the router lands on the entry.
 */
(function () {
  function entryPath(collection, slug) {
    return `/collections/${collection}/entries/${slug}`;
  }

  function currentPath() {
    return window.location.hash.replace(/^#/, '');
  }

  function navigate(collection, slug) {
    const path = entryPath(collection, slug);
    if (currentPath() === path) {
      ping();
      return;
    }

    const apply = function () {
      window.location.hash = path;
    };

    apply();

    var tries = 0;
    var timer = setInterval(function () {
      if (currentPath() === path || ++tries > 30) {
        clearInterval(timer);
        ping();
      } else {
        apply();
      }
    }, 200);
  }

  function ping() {
    try {
      if (window.parent !== window) {
        window.parent.postMessage(
          { type: 'decap-studio:ready', hash: currentPath() },
          '*'
        );
      }
    } catch (e) {
      /* ignore */
    }
  }

  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.type !== 'decap-studio:navigate') return;
    if (!d.collection || d.slug == null) return;
    navigate(d.collection, d.slug);
  });

  window.addEventListener('hashchange', ping);
  if (document.readyState === 'complete') ping();
  else window.addEventListener('load', ping);
})();
