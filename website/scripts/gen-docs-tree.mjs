// Build a nested navigation tree from website/docs and write it to
// static/admin/docs-tree.json for the Studio sidebar.
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DOCS = join(ROOT, 'docs');
const OUT = join(ROOT, 'static', 'admin', 'docs-tree.json');

const COLLECTIONS = [
  'getting-started',
  'pay-in-apis',
  'pay-out-apis',
  'platform-reference',
  'remittance-apis',
];

function frontmatter(file) {
  const raw = readFileSync(file, 'utf8');
  const out = {};
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (m) {
    for (const line of m[1].split('\n')) {
      const kv = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
      if (kv) out[kv[1]] = kv[2];
    }
  }
  return out;
}

function categoryMeta(dir) {
  try {
    return JSON.parse(readFileSync(join(dir, '_category_.json'), 'utf8'));
  } catch {
    return {};
  }
}

function walk(absDir, collection, relParts) {
  const nodes = [];
  for (const name of readdirSync(absDir)) {
    if (name === '_category_.json') continue;
    const abs = join(absDir, name);
    const isDir = statSync(abs).isDirectory();
    if (isDir) {
      const meta = categoryMeta(abs);
      const children = walk(abs, collection, [...relParts, name]);
      nodes.push({
        type: 'category',
        label: meta.label || name,
        position: meta.position ?? 999,
        children,
      });
    } else if (name.endsWith('.md') || name.endsWith('.mdx')) {
      const base = name.replace(/\.mdx?$/, '');
      // Docusaurus treats folder/index.md as the folder URL — keep "index" in the
      // slug so Decap's nested entry path still matches the file on disk.
      const fm = frontmatter(abs);
      const slug = [...relParts, base].join('/');
      nodes.push({
        type: 'doc',
        label: fm.sidebar_label || base,
        position: fm.sidebar_position ? Number(fm.sidebar_position) : 999,
        collection,
        slug,
      });
    }
  }
  nodes.sort((a, b) => a.position - b.position || a.label.localeCompare(b.label));
  return nodes;
}

const tree = COLLECTIONS.map((c) => {
  const abs = join(DOCS, c);
  const meta = categoryMeta(abs);
  return {
    type: 'category',
    label: meta.label || c,
    position: meta.position ?? 999,
    collection: c,
    children: walk(abs, c, []),
  };
}).sort((a, b) => a.position - b.position);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(tree, null, 2));
console.log(`Wrote ${OUT}`);
