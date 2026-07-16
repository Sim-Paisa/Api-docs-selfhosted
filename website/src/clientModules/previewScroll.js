// Scroll bridge for the Studio's preview pane. The preview iframe is often a
// different origin, so the parent can't read/set its scroll directly — this
// postMessage bridge lets it. Only active when embedded in an iframe (Studio).
export function onRouteDidUpdate() {
  if (typeof window === 'undefined' || window.parent === window) return;
  announceReady();
}

function announceReady() {
  try {
    window.parent.postMessage({ type: 'preview:ready' }, '*');
  } catch {}
}

if (typeof window !== 'undefined' && window.parent !== window) {
  window.addEventListener('message', (e) => {
    const d = e && e.data;
    if (!d || typeof d !== 'object') return;
    if (d.type === 'preview:restore') {
      window.scrollTo(0, Number(d.y) || 0);
    }
  });
  window.addEventListener(
    'scroll',
    () => {
      window.parent.postMessage({ type: 'preview:scroll', y: window.scrollY }, '*');
    },
    { passive: true }
  );
  if (document.readyState === 'complete') announceReady();
  else window.addEventListener('load', announceReady);
}
