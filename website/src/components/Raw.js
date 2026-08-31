import React from 'react';

// Escape hatch for layout the declared component palette doesn't cover.
//
// Keystatic's editor rejects raw JSX/HTML in the body, which would otherwise mean
// every new layout need (a two-column block, an embed, a styled callout) requires
// an engineer to declare a new component first. That reinstates the exact
// engineering bottleneck this project exists to remove. This block gives editors
// a way through without one.
//
//   <Raw html="<div class='row'>…</div>" />
//
// TRUST MODEL — read before widening this.
// The markup is injected as-is. That is safe here only because of three things
// that must all stay true:
//   1. Only repo collaborators can author it (GitHub App, write access required).
//   2. Every change lands via pull request with a required review before publish.
//   3. The required build check runs on that PR, so malformed markup fails there
//      rather than in production.
// If any of those three is removed, this component has to be sanitised or dropped.
export default function Raw({ html, children }) {
  const markup = typeof html === 'string' ? html : '';
  if (!markup) return <>{children ?? null}</>;
  return <div className="raw-block" dangerouslySetInnerHTML={{ __html: markup }} />;
}
