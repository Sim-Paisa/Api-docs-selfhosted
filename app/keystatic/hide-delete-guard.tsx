'use client';

import { useEffect } from 'react';

// Keystatic has no config option to remove the per-entry "Delete" action, so this
// soft guard hides it in our hosted admin to prevent accidental page deletion.
// It only targets the toolbar Delete button (accessible name exactly "delete" /
// "delete entry") and explicitly skips anything inside the editor content, so
// block-remove and table "delete row/column" controls keep working.
export default function HideDeleteGuard() {
  useEffect(() => {
    const isEntryDelete = (el: Element) => {
      const name = (el.getAttribute('aria-label') || el.textContent || '')
        .trim()
        .toLowerCase();
      if (name !== 'delete' && name !== 'delete entry') return false;
      // Never touch controls rendered inside the rich-text editor.
      if (el.closest('.ProseMirror, [contenteditable="true"], [role="textbox"]'))
        return false;
      return true;
    };

    const hide = () => {
      document
        .querySelectorAll('button, a[role="button"]')
        .forEach((el) => {
          if (isEntryDelete(el)) (el as HTMLElement).style.display = 'none';
        });
    };

    hide();
    const observer = new MutationObserver(hide);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
