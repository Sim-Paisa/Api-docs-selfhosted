import React, { useCallback, useEffect, useRef } from 'react';

// Wraps a normal GFM markdown table and makes its columns drag-resizable.
//
// Used from MDX as:
//   <ResizableTable widths={[30, 40, 30]}>
//
//   | Field | Type | Description |
//   | --- | --- | --- |
//   | ... | ... | ... |
//
//   </ResizableTable>
//
// Registered globally in src/theme/MDXComponents.js so pages need no import, and
// declared as a Keystatic wrapper component so editors can insert it from a form.
//
// The markdown table inside is rendered by Docusaurus exactly as it always was —
// this only adds a <colgroup> and drag handles on top, so a page still reads
// correctly if JavaScript never runs.

const MIN_COL_PX = 60;

// Widths arrive in two shapes: the Decap toolbar emits a JSX array
// (widths={[30, 40, 30]}) while Keystatic's text field emits a string
// ("30,40,30"). Accept both so content authored in either editor renders.
function parseWidths(w) {
  const list = Array.isArray(w)
    ? w
    : typeof w === 'string'
      ? w.split(',')
      : [];
  return list.map((n) => Number(String(n).trim())).filter((n) => Number.isFinite(n) && n > 0);
}

export default function ResizableTable({ widths, children }) {
  const wrapRef = useRef(null);
  const dragRef = useRef(null);

  // Apply the authored widths and inject a drag handle into each header cell.
  const setup = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const table = wrap.querySelector('table');
    if (!table) return;

    const headCells = table.querySelectorAll('thead th');
    if (!headCells.length) return;

    // Fixed layout is what makes explicit column widths actually stick.
    table.style.tableLayout = 'fixed';
    table.style.width = '100%';

    // A colgroup is the least invasive way to own column widths without
    // touching the cells Docusaurus rendered.
    let colgroup = table.querySelector('colgroup[data-resizable]');
    if (!colgroup) {
      colgroup = document.createElement('colgroup');
      colgroup.setAttribute('data-resizable', '');
      headCells.forEach(() => colgroup.appendChild(document.createElement('col')));
      table.insertBefore(colgroup, table.firstChild);
    }

    const cols = colgroup.querySelectorAll('col');
    const authored = parseWidths(widths);
    cols.forEach((col, i) => {
      const pct = authored[i];
      col.style.width =
        Number.isFinite(pct) && pct > 0 ? `${pct}%` : `${100 / cols.length}%`;
    });

    headCells.forEach((th, i) => {
      // Never put a handle after the last column — there is nothing to trade with.
      if (i >= headCells.length - 1) return;
      if (th.querySelector('[data-col-handle]')) return;

      th.style.position = 'relative';
      const handle = document.createElement('span');
      handle.setAttribute('data-col-handle', String(i));
      handle.setAttribute('role', 'separator');
      handle.setAttribute('aria-orientation', 'vertical');
      handle.setAttribute('aria-label', `Resize column ${i + 1}`);
      handle.tabIndex = 0;
      Object.assign(handle.style, {
        position: 'absolute',
        top: '0',
        right: '-3px',
        width: '6px',
        height: '100%',
        cursor: 'col-resize',
        userSelect: 'none',
        touchAction: 'none',
        zIndex: '1',
      });
      th.appendChild(handle);
    });
  }, [widths]);

  useEffect(() => {
    setup();
  }, [setup]);

  // Pointer drag: take width from the column on the right so the table total
  // stays at 100% and nothing reflows outside the container.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onPointerDown = (e) => {
      const handle = e.target.closest?.('[data-col-handle]');
      if (!handle) return;
      const table = wrap.querySelector('table');
      const colgroup = table?.querySelector('colgroup[data-resizable]');
      if (!colgroup) return;

      const i = Number(handle.getAttribute('data-col-handle'));
      const cols = colgroup.querySelectorAll('col');
      if (!cols[i] || !cols[i + 1]) return;

      const rect = table.getBoundingClientRect();
      dragRef.current = {
        i,
        startX: e.clientX,
        tableWidth: rect.width,
        leftPct: (cols[i].getBoundingClientRect?.().width ?? 0) / rect.width * 100,
        startLeft: parseFloat(cols[i].style.width) || 0,
        startRight: parseFloat(cols[i + 1].style.width) || 0,
        cols,
      };
      handle.setPointerCapture?.(e.pointerId);
      document.body.style.cursor = 'col-resize';
      e.preventDefault();
    };

    const onPointerMove = (e) => {
      const d = dragRef.current;
      if (!d) return;
      const deltaPct = ((e.clientX - d.startX) / d.tableWidth) * 100;
      const minPct = (MIN_COL_PX / d.tableWidth) * 100;
      let left = d.startLeft + deltaPct;
      let right = d.startRight - deltaPct;
      if (left < minPct || right < minPct) return;
      d.cols[d.i].style.width = `${left}%`;
      d.cols[d.i + 1].style.width = `${right}%`;
    };

    const endDrag = () => {
      if (!dragRef.current) return;
      dragRef.current = null;
      document.body.style.cursor = '';
    };

    // Keyboard parity: arrow keys nudge the boundary 2% at a time.
    const onKeyDown = (e) => {
      const handle = e.target.closest?.('[data-col-handle]');
      if (!handle) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const table = wrap.querySelector('table');
      const cols = table?.querySelectorAll('colgroup[data-resizable] col');
      const i = Number(handle.getAttribute('data-col-handle'));
      if (!cols?.[i] || !cols[i + 1]) return;

      const step = e.key === 'ArrowLeft' ? -2 : 2;
      const left = (parseFloat(cols[i].style.width) || 0) + step;
      const right = (parseFloat(cols[i + 1].style.width) || 0) - step;
      if (left < 5 || right < 5) return;
      cols[i].style.width = `${left}%`;
      cols[i + 1].style.width = `${right}%`;
      e.preventDefault();
    };

    wrap.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    wrap.addEventListener('keydown', onKeyDown);
    return () => {
      wrap.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
      wrap.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="resizable-table"
      style={{ overflowX: 'auto', margin: '1rem 0' }}
    >
      {children}
    </div>
  );
}
