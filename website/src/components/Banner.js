import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

// Centred banner image on a white card.
//
// Replaces a hand-written `<div style={{…}}>` wrapper that used to sit at the top
// of the Getting Started overview. That raw JSX rendered fine but could not be
// opened in the editor, so the alternative was deleting it and losing the
// treatment. As a declared component the visual is preserved and an editor can
// change the image without touching markup.
//
// The src MUST go through useBaseUrl. Docusaurus rewrites image paths written as
// markdown (`![](/img/x.png)`) to include the site's baseUrl, but a raw <img>
// inside a component bypasses that entirely — which silently 404s the image on
// any deployment served from a subpath, as GitHub Pages is.
//
// The white card is deliberate and not themed: the Simpaisa banner artwork needs
// a light ground to read, so it stays white in dark mode too.
export default function Banner({ src, alt = '' }) {
  const resolved = useBaseUrl(src);
  if (!src) return null;
  return (
    <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
      <span
        style={{
          display: 'inline-block',
          background: '#ffffff',
          padding: '1.5rem 2.5rem',
          borderRadius: '12px',
        }}
      >
        <img src={resolved} alt={alt} style={{ display: 'block', maxWidth: '100%' }} />
      </span>
    </div>
  );
}
