import React from 'react';

// CTA button used from MDX as <Button label="..." href="..." variant="primary" />.
// Registered globally in src/theme/MDXComponents.js so pages need no import.
// Uses Infima button classes so it matches the Docusaurus theme automatically.
export default function Button({ label, href, variant = 'primary', children }) {
  const text = label ?? children;
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <a
        className={`button button--${variant} button--lg`}
        href={href}
        {...(href && /^https?:\/\//.test(href)
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {text}
      </a>
    </div>
  );
}
