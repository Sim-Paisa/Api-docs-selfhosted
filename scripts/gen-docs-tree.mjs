// Build a nested navigation tree from website/docs (folders + _category_.json +
// per-file frontmatter) and write it to app/docs-tree.json. The Studio renders
// this as a collapsible parent/child tree, since Keystatic's own collection view
// is a flat list. Regenerated on predev/prebuild.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DOCS = join(process.cwd(), 'website', 'docs');
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

// Walk a directory into an array of nodes (docs + subcategories).
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
    } else if (name.endsWith('.md')) {
      const base = name.replace(/\.md$/, '');
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

writeFileSync(
  join(process.cwd(), 'app', 'docs-tree.json'),
  JSON.stringify(tree, null, 2)
);
console.log('Wrote app/docs-tree.json');
