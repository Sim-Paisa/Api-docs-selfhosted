/**
 * MDX/component fidelity harness for the Decap corpus.
 *
 * Replays the fromBlock → toBlock serializers for registered editor components
 * over every docs/*.md file and reports:
 *   - blocks that round-trip byte-identically (good)
 *   - blocks that match a pattern but drift on serialize (bad)
 *   - raw JSX / admonitions that aren't covered by a registered component (warn)
 *
 * Exit 0 if no drift; exit 1 if any registered block fails round-trip.
 *
 * Usage: node scripts/roundtrip-mdx.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS = join(__dirname, '..', 'docs');

// Mirror of cms-custom.js serializers (keep in sync when changing components).
const components = [
  {
    id: 'button',
    pattern:
      /<Button\s+label="([^"]*)"\s+href="([^"]*)"(?:\s+variant="([^"]*)")?\s*\/>/g,
    fromBlock: (m) => ({
      label: m[1],
      href: m[2],
      variant: m[3] || 'primary',
    }),
    toBlock: (obj) =>
      `<Button label="${obj.label || ''}" href="${obj.href || ''}" variant="${
        obj.variant || 'primary'
      }" />`,
  },
  {
    id: 'admonition',
    pattern:
      /:::(note|tip|info|warning|danger|caution)(?:[ \t]+([^\n]+))?\n([\s\S]*?)\n:::/g,
    fromBlock: (m) => ({
      type: m[1],
      title: m[2] || '',
      body: m[3] == null ? '' : m[3],
    }),
    toBlock: (obj) => {
      const type = obj.type || 'info';
      const title = (obj.title || '').trim();
      const head = title ? `:::${type} ${title}` : `:::${type}`;
      return `${head}\n${obj.body == null ? '' : obj.body}\n:::`;
    },
  },
  {
    id: 'tabs-2',
    pattern:
      /<Tabs>\s*<TabItem\s+value="([^"]*)"\s+label="([^"]*)">\s*([\s\S]*?)\s*<\/TabItem>\s*<TabItem\s+value="([^"]*)"\s+label="([^"]*)">\s*([\s\S]*?)\s*<\/TabItem>\s*<\/Tabs>/g,
    fromBlock: (m) => ({
      tab1_value: m[1],
      tab1_label: m[2],
      tab1_body: (m[3] || '').trim(),
      tab2_value: m[4],
      tab2_label: m[5],
      tab2_body: (m[6] || '').trim(),
    }),
    toBlock: (obj) =>
      [
        '<Tabs>',
        `<TabItem value="${obj.tab1_value}" label="${obj.tab1_label}">`,
        '',
        obj.tab1_body,
        '',
        '</TabItem>',
        `<TabItem value="${obj.tab2_value}" label="${obj.tab2_label}">`,
        '',
        obj.tab2_body,
        '',
        '</TabItem>',
        '</Tabs>',
      ].join('\n'),
  },
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) walk(abs, out);
    else if (name.endsWith('.md') || name.endsWith('.mdx')) out.push(abs);
  }
  return out;
}

function normalize(s) {
  return s.replace(/\r\n/g, '\n').trim();
}

const files = walk(DOCS);
let ok = 0;
let drift = 0;
let uncoveredTabs = 0;
let uncoveredJsx = 0;
const driftSamples = [];

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const rel = relative(DOCS, file);

  for (const c of components) {
    const re = new RegExp(c.pattern.source, c.pattern.flags);
    let m;
    while ((m = re.exec(raw)) !== null) {
      const original = m[0];
      const rebuilt = c.toBlock(c.fromBlock(m));
      if (normalize(original) === normalize(rebuilt)) {
        ok += 1;
      } else {
        drift += 1;
        if (driftSamples.length < 12) {
          driftSamples.push({
            file: rel,
            id: c.id,
            original: normalize(original).slice(0, 200),
            rebuilt: normalize(rebuilt).slice(0, 200),
          });
        }
      }
    }
  }

  // Tabs with ≠2 TabItems aren't covered by the 2-tab editor component.
  const tabBlocks = raw.match(/<Tabs>[\s\S]*?<\/Tabs>/g) || [];
  for (const block of tabBlocks) {
    const n = (block.match(/<TabItem\b/g) || []).length;
    if (n !== 2) uncoveredTabs += 1;
  }

  // Raw JSX tags that aren't Button / Tabs / TabItem / ResizableTable.
  const jsx = raw.match(/<\/?[A-Z][A-Za-z0-9]*\b[^>]*>/g) || [];
  for (const tag of jsx) {
    if (!/\/?(Button|Tabs|TabItem|ResizableTable)\b/.test(tag)) {
      uncoveredJsx += 1;
    }
  }
}

console.log('Decap MDX round-trip harness');
console.log('----------------------------');
console.log(`Files scanned:          ${files.length}`);
console.log(`Registered blocks OK:   ${ok}`);
console.log(`Registered blocks DRIFT:${drift}`);
console.log(`Tabs with ≠2 items:     ${uncoveredTabs} (author via raw markdown)`);
console.log(`Other raw JSX tags:     ${uncoveredJsx} (residual MDX gap)`);

if (driftSamples.length) {
  console.log('\nDrift samples:');
  for (const s of driftSamples) {
    console.log(`\n[${s.id}] ${s.file}`);
    console.log('  original:', s.original.replace(/\n/g, '\\n'));
    console.log('  rebuilt: ', s.rebuilt.replace(/\n/g, '\\n'));
  }
}

if (drift > 0) {
  process.exitCode = 1;
} else {
  console.log('\nAll matched registered blocks round-trip cleanly.');
}
