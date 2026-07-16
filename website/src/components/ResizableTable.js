import React, { useEffect, useRef } from 'react';

/**
 * Wraps a markdown table and adds drag handles on column borders.
 *
 *   <ResizableTable widths={[30, 40, 30]}>
 *
 *   | A | B | C |
 *   |---|---|---|
 *   | 1 | 2 | 3 |
 *
 *   </ResizableTable>
 *
 * widths is optional (%). Authors can also insert via the Decap "Resizable table" toolbar.
 */
export default function ResizableTable({ widths, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const table = root.querySelector('table');
    if (!table) return;

    table.classList.add('resizable-table');
    table.style.tableLayout = 'fixed';
    table.style.width = '100%';

    const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
    if (!headerRow) return;
    const cells = Array.from(headerRow.children);
    if (cells.length === 0) return;

    // Ensure a colgroup so percentage widths stick while dragging.
    let colgroup = table.querySelector('colgroup');
    if (!colgroup) {
      colgroup = document.createElement('colgroup');
      cells.forEach(() => colgroup.appendChild(document.createElement('col')));
      table.insertBefore(colgroup, table.firstChild);
    }
    const cols = Array.from(colgroup.querySelectorAll('col'));
    const initial =
      Array.isArray(widths) && widths.length === cols.length
        ? widths.map(Number)
        : cols.map(() => 100 / cols.length);
    cols.forEach((col, i) => {
      col.style.width = `${initial[i]}%`;
    });

    const cleanups = [];
    cells.forEach((th, i) => {
      if (i === cells.length - 1) return;
      th.style.position = 'relative';
      const handle = document.createElement('span');
      handle.className = 'rt-handle';
      handle.title = 'Drag to resize column';
      th.appendChild(handle);

      let startX = 0;
      let startLeft = 0;
      let startRight = 0;

      const onMove = (e) => {
        const dx = e.clientX - startX;
        const parentWidth = table.getBoundingClientRect().width || 1;
        const deltaPct = (dx / parentWidth) * 100;
        let left = startLeft + deltaPct;
        let right = startRight - deltaPct;
        const min = 8;
        if (left < min) {
          right -= min - left;
          left = min;
        }
        if (right < min) {
          left -= min - right;
          right = min;
        }
        cols[i].style.width = `${left}%`;
        cols[i + 1].style.width = `${right}%`;
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.body.classList.remove('rt-resizing');
      };

      const onDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        startX = e.clientX;
        startLeft = parseFloat(cols[i].style.width) || initial[i];
        startRight = parseFloat(cols[i + 1].style.width) || initial[i + 1];
        document.body.classList.add('rt-resizing');
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      };

      handle.addEventListener('mousedown', onDown);
      cleanups.push(() => {
        handle.removeEventListener('mousedown', onDown);
        handle.remove();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [widths, children]);

  return (
    <div className="resizable-table-wrap" ref={ref}>
      {children}
    </div>
  );
}
