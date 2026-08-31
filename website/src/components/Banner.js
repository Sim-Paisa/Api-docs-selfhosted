import React from 'react';

// Centred banner image on a white card.
//
// Replaces a hand-written `<div style={{…}}>` wrapper that used to sit at the top
// of the Getting Started overview. That raw JSX rendered fine but could not be
// opened in the editor, so the alternative was deleting it and losing the
// treatment. As a declared component the visual is preserved exactly and an
// editor can change the image without touching markup.
//
// The white card is deliberate and not themed: the Simpaisa banner artwork needs
// a light ground to read, so it stays white in dark mode too.
export default function Banner({ src, alt = '' }) {
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
        <img src={src} alt={alt} style={{ display: 'block', maxWidth: '100%' }} />
      </span>
    </div>
  );
}
