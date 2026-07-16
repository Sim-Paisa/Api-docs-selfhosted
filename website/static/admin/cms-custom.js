/**
 * Typed Decap editor components — Button, Tabs scaffold, Admonition, ResizableTable.
 * Loaded after decap-cms.js. Prefer these over hand-written MDX so round-trips stay clean.
 */
(function () {
  if (typeof CMS === 'undefined') {
    console.error('[cms-custom] CMS global missing — load after decap-cms.js');
    return;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // ---- Button --------------------------------------------------------------
  CMS.registerEditorComponent({
    id: 'button',
    label: 'Button',
    fields: [
      { name: 'label', label: 'Button text', widget: 'string' },
      { name: 'href', label: 'Link (URL or /docs/... path)', widget: 'string' },
      {
        name: 'variant',
        label: 'Style',
        widget: 'select',
        options: ['primary', 'secondary'],
        default: 'primary',
      },
    ],
    pattern:
      /^<Button\s+label="([^"]*)"\s+href="([^"]*)"(?:\s+variant="([^"]*)")?\s*\/>$/,
    fromBlock: function (match) {
      return {
        label: match[1],
        href: match[2],
        variant: match[3] || 'primary',
      };
    },
    toBlock: function (obj) {
      const variant = obj.variant || 'primary';
      return `<Button label="${obj.label || ''}" href="${obj.href || ''}" variant="${variant}" />`;
    },
    toPreview: function (obj) {
      const primary = (obj.variant || 'primary') !== 'secondary';
      return `
        <div style="margin:0.75rem 0">
          <span style="display:inline-block;padding:0.5rem 1.25rem;border-radius:8px;font-weight:700;font-size:15px;background:${
            primary ? '#3578e5' : 'transparent'
          };color:${primary ? '#fff' : '#3578e5'};border:2px solid #3578e5">
            ${esc(obj.label) || 'Button'}
          </span>
          <span style="margin-left:10px;font-size:12px;opacity:0.6">→ ${esc(obj.href) || '(no link)'}</span>
        </div>`;
    },
  });

  // ---- Admonition (:::note / tip / info / warning / danger) ----------------
  CMS.registerEditorComponent({
    id: 'admonition',
    label: 'Admonition',
    fields: [
      {
        name: 'type',
        label: 'Type',
        widget: 'select',
        options: ['note', 'tip', 'info', 'warning', 'danger', 'caution'],
        default: 'info',
      },
      {
        name: 'title',
        label: 'Title (optional)',
        widget: 'string',
        required: false,
        default: '',
      },
      { name: 'body', label: 'Content', widget: 'text' },
    ],
    // Title only on the same line (spaces/tabs — not newlines), so
    // `:::warning\nbody` does not swallow the first body line as a title.
    pattern:
      /^:::(note|tip|info|warning|danger|caution)(?:[ \t]+([^\n]+))?\n([\s\S]*?)\n:::$/,
    fromBlock: function (match) {
      return {
        type: match[1],
        title: match[2] || '',
        body: match[3] == null ? '' : match[3].replace(/^\n/, '').replace(/\n$/, ''),
      };
    },
    toBlock: function (obj) {
      const type = obj.type || 'info';
      const title = (obj.title || '').trim();
      const head = title ? `:::${type} ${title}` : `:::${type}`;
      const body = obj.body == null ? '' : String(obj.body);
      return `${head}\n${body}\n:::`;
    },
    toPreview: function (obj) {
      const type = obj.type || 'info';
      const title = obj.title || type;
      return `
        <div style="border-left:4px solid #3578e5;background:rgba(53,120,229,0.08);padding:0.75rem 1rem;margin:0.75rem 0;border-radius:4px">
          <strong style="text-transform:uppercase;font-size:12px">${esc(title)}</strong>
          <div style="margin-top:0.35rem;white-space:pre-wrap">${esc(obj.body)}</div>
        </div>`;
    },
  });

  // ---- Tabs scaffold (flat — Decap can't nest editor components) -----------
  // Inserts a ready-to-edit <Tabs>/<TabItem> block from a small form.
  CMS.registerEditorComponent({
    id: 'tabs',
    label: 'Tabs',
    fields: [
      { name: 'tab1_label', label: 'Tab 1 label', widget: 'string', default: 'Tab 1' },
      { name: 'tab1_value', label: 'Tab 1 value (id)', widget: 'string', default: 'tab-1' },
      { name: 'tab1_body', label: 'Tab 1 content', widget: 'text', default: 'Content for tab 1' },
      { name: 'tab2_label', label: 'Tab 2 label', widget: 'string', default: 'Tab 2' },
      { name: 'tab2_value', label: 'Tab 2 value (id)', widget: 'string', default: 'tab-2' },
      { name: 'tab2_body', label: 'Tab 2 content', widget: 'text', default: 'Content for tab 2' },
    ],
    pattern:
      /^<Tabs>\s*<TabItem\s+value="([^"]*)"\s+label="([^"]*)">\s*([\s\S]*?)\s*<\/TabItem>\s*<TabItem\s+value="([^"]*)"\s+label="([^"]*)">\s*([\s\S]*?)\s*<\/TabItem>\s*<\/Tabs>$/,
    fromBlock: function (match) {
      return {
        tab1_value: match[1],
        tab1_label: match[2],
        tab1_body: (match[3] || '').trim(),
        tab2_value: match[4],
        tab2_label: match[5],
        tab2_body: (match[6] || '').trim(),
      };
    },
    toBlock: function (obj) {
      return [
        '<Tabs>',
        `<TabItem value="${obj.tab1_value || 'tab-1'}" label="${obj.tab1_label || 'Tab 1'}">`,
        '',
        (obj.tab1_body || '').trim(),
        '',
        '</TabItem>',
        `<TabItem value="${obj.tab2_value || 'tab-2'}" label="${obj.tab2_label || 'Tab 2'}">`,
        '',
        (obj.tab2_body || '').trim(),
        '',
        '</TabItem>',
        '</Tabs>',
      ].join('\n');
    },
    toPreview: function (obj) {
      return `
        <div style="border:1px solid #ccc;border-radius:6px;padding:0.75rem;margin:0.75rem 0">
          <div style="display:flex;gap:8px;margin-bottom:8px">
            <span style="padding:4px 10px;background:#3578e5;color:#fff;border-radius:4px">${esc(
              obj.tab1_label
            )}</span>
            <span style="padding:4px 10px;opacity:0.7">${esc(obj.tab2_label)}</span>
          </div>
          <pre style="white-space:pre-wrap;margin:0;font:13px system-ui">${esc(obj.tab1_body)}</pre>
        </div>`;
    },
  });

  // ---- Resizable table -----------------------------------------------------
  CMS.registerEditorComponent({
    id: 'resizable-table',
    label: 'Resizable table',
    fields: [
      {
        name: 'headers',
        label: 'Column headers (pipe-separated)',
        widget: 'string',
        default: 'Column A | Column B | Column C',
      },
      {
        name: 'widths',
        label: 'Widths % (comma-separated, optional)',
        widget: 'string',
        required: false,
        default: '33,34,33',
      },
      {
        name: 'rows',
        label: 'Rows (one per line, cells pipe-separated)',
        widget: 'text',
        default: 'a1 | b1 | c1\na2 | b2 | c2',
      },
    ],
    pattern:
      /^<ResizableTable(?:\s+widths=\{\[([^\]]*)\]\})?>\s*\n\|([^\n]+)\|\n\|[-| :]+\|\n([\s\S]*?)\n<\/ResizableTable>$/,
    fromBlock: function (match) {
      const widths = (match[1] || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .join(',');
      const headers = (match[2] || '')
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean)
        .join(' | ');
      const rows = (match[3] || '')
        .trim()
        .split('\n')
        .map((line) =>
          line
            .replace(/^\|/, '')
            .replace(/\|$/, '')
            .split('|')
            .map((c) => c.trim())
            .join(' | ')
        )
        .join('\n');
      return { headers, widths, rows };
    },
    toBlock: function (obj) {
      const headers = (obj.headers || '')
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);
      const rows = (obj.rows || '')
        .split('\n')
        .map((line) =>
          line
            .split('|')
            .map((s) => s.trim())
            .filter(Boolean)
        )
        .filter((r) => r.length);
      const widthParts = (obj.widths || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const widthsAttr =
        widthParts.length > 0
          ? ` widths={[${widthParts.map((n) => Number(n) || 0).join(', ')}]}`
          : '';
      const head = `| ${headers.join(' | ')} |`;
      const sep = `| ${headers.map(() => '---').join(' | ')} |`;
      const body = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
      return `<ResizableTable${widthsAttr}>\n\n${head}\n${sep}\n${body}\n\n</ResizableTable>`;
    },
    toPreview: function (obj) {
      const headers = (obj.headers || '')
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);
      const rows = (obj.rows || '')
        .split('\n')
        .map((line) =>
          line
            .split('|')
            .map((s) => s.trim())
            .filter(Boolean)
        )
        .filter((r) => r.length);
      const th = headers.map((h) => `<th>${esc(h)}</th>`).join('');
      const tr = rows
        .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
        .join('');
      return `<table style="width:100%;border-collapse:collapse;margin:0.75rem 0"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
    },
  });

  console.info(
    '[cms-custom] Registered editor components: Button, Admonition, Tabs, ResizableTable'
  );
})();
