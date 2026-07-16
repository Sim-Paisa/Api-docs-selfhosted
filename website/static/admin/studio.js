/**
 * Split-screen studio: Decap editor (left) + built Docusaurus site (right).
 * Pure-static — no server. Preview refreshes on a 30s loop (same as Keystatic).
 *
 * Deep-link: studio.html?collection=getting-started&slug=overview
 * Optional:  ?previewBase=http://localhost:3000/Api-docs-selfhosted
 */
(function () {
  const params = new URLSearchParams(window.location.search);
  const initCollection = params.get('collection') || 'getting-started';
  const initSlug = params.get('slug') || 'overview';

  const SITE_BASE = '/Api-docs-selfhosted';
  const PROD_PREVIEW = 'https://sim-paisa.github.io' + SITE_BASE;
  const LOCAL_PREVIEW = 'http://localhost:3000' + SITE_BASE;

  function defaultPreviewBase() {
    if (params.get('previewBase')) return params.get('previewBase').replace(/\/$/, '');
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return LOCAL_PREVIEW;
    return PROD_PREVIEW;
  }

  const previewBase = defaultPreviewBase();

  function editorUrl(collection, slug) {
    // Decap nested entries use the relative path as the entry id.
    const entry = slug ? `${collection}/entries/${slug}` : `${collection}`;
    return `./index.html#/collections/${entry}`;
  }

  function previewUrl(collection, slug) {
    // Docusaurus serves folder/index.md as /docs/.../folder (no trailing /index).
    let path = slug ? `${collection}/${slug}` : collection;
    path = path.replace(/\/index$/, '');
    return `${previewBase}/docs/${path}`;
  }

  function parseEditorHash(hash) {
    // #/collections/{collection}/entries/{slug...}
    const m = (hash || '').match(/#\/collections\/([^/]+)\/entries\/(.+)$/);
    if (!m) return null;
    try {
      return { collection: m[1], slug: decodeURIComponent(m[2]) };
    } catch {
      return { collection: m[1], slug: m[2] };
    }
  }

  let target = { collection: initCollection, slug: initSlug };
  let nonce = 0;
  let autoNudge = true;
  let sidebarOpen = true;
  const scrollByPage = {};

  const els = {
    sidebar: document.getElementById('sidebar'),
    editor: document.getElementById('editor'),
    preview: document.getElementById('preview'),
    activeId: document.getElementById('active-id'),
    toggleNav: document.getElementById('toggle-nav'),
    autoRefresh: document.getElementById('auto-refresh'),
    refresh: document.getElementById('refresh'),
  };

  function activeId() {
    return `${target.collection}/${target.slug}`;
  }

  function setTarget(collection, slug, { reloadEditor } = { reloadEditor: true }) {
    target = { collection, slug };
    els.activeId.textContent = activeId();
    if (reloadEditor) els.editor.src = editorUrl(collection, slug);
    bumpPreview();
    highlightTree();
  }

  function bumpPreview() {
    els.preview.src = `${previewUrl(target.collection, target.slug)}?_=${nonce}`;
  }

  function highlightTree() {
    els.sidebar.querySelectorAll('button.doc').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.id === activeId());
    });
  }

  function renderTree(nodes, depth) {
    const frag = document.createDocumentFragment();
    (nodes || []).forEach((node) => {
      if (node.type === 'doc') {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'doc';
        btn.textContent = node.label;
        btn.dataset.id = `${node.collection}/${node.slug}`;
        btn.style.paddingLeft = `${8 + depth * 14}px`;
        btn.addEventListener('click', () => setTarget(node.collection, node.slug));
        frag.appendChild(btn);
      } else {
        const wrap = document.createElement('div');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cat';
        btn.style.paddingLeft = `${8 + depth * 14}px`;
        let open = depth < 1;
        const kids = document.createElement('div');
        kids.hidden = !open;
        kids.appendChild(renderTree(node.children || [], depth + 1));
        btn.textContent = `${open ? '▾' : '▸'} ${node.label}`;
        btn.addEventListener('click', () => {
          open = !open;
          kids.hidden = !open;
          btn.textContent = `${open ? '▾' : '▸'} ${node.label}`;
        });
        wrap.appendChild(btn);
        wrap.appendChild(kids);
        frag.appendChild(wrap);
      }
    });
    return frag;
  }

  // Scroll bridge with the preview iframe (previewScroll client module).
  window.addEventListener('message', (e) => {
    const d = e.data;
    if (!d || typeof d !== 'object') return;
    if (d.type === 'preview:scroll') {
      scrollByPage[activeId()] = Number(d.y) || 0;
    } else if (d.type === 'preview:ready') {
      const y = scrollByPage[activeId()] || 0;
      try {
        els.preview.contentWindow.postMessage({ type: 'preview:restore', y }, '*');
      } catch {
        /* ignore */
      }
    }
  });

  // Follow Decap's hash when the user navigates inside the editor iframe.
  setInterval(() => {
    try {
      const hash = els.editor.contentWindow && els.editor.contentWindow.location.hash;
      const parsed = parseEditorHash(hash);
      if (
        parsed &&
        (parsed.collection !== target.collection || parsed.slug !== target.slug)
      ) {
        setTarget(parsed.collection, parsed.slug, { reloadEditor: false });
      }
    } catch {
      /* cross-origin during OAuth — ignore */
    }
  }, 1500);

  setInterval(() => {
    if (!autoNudge) return;
    nonce += 1;
    bumpPreview();
  }, 30000);

  els.toggleNav.addEventListener('click', () => {
    sidebarOpen = !sidebarOpen;
    els.sidebar.classList.toggle('hidden', !sidebarOpen);
    els.toggleNav.textContent = sidebarOpen ? '⟨ Hide nav' : '☰ Nav';
  });

  els.autoRefresh.addEventListener('change', (e) => {
    autoNudge = e.target.checked;
  });

  els.refresh.addEventListener('click', () => {
    nonce += 1;
    bumpPreview();
  });

  fetch('./docs-tree.json')
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('no tree'))))
    .then((tree) => {
      els.sidebar.innerHTML = '';
      els.sidebar.appendChild(renderTree(tree, 0));
      highlightTree();
    })
    .catch(() => {
      els.sidebar.innerHTML =
        '<p class="empty">Nav tree missing — run <code>npm run gen-tree</code>.</p>';
    });

  setTarget(initCollection, initSlug);
})();
