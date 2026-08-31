/**
 * Makes the docs corpus openable in the Keystatic editor.
 *
 * WHY
 * The editor is stricter than the renderer: it rejects raw MDX imports and raw
 * JSX/HTML that Docusaurus renders happily. A page containing either cannot be
 * opened at all, so this is a prerequisite for editors touching those pages —
 * not a cosmetic cleanup.
 *
 * WHAT IT CHANGES  (idempotent — safe to re-run)
 *   1. Removes `import Tabs from '@theme/Tabs'` / `TabItem` lines. They are
 *      redundant now that both are registered globally in
 *      website/src/theme/MDXComponents.js, and the editor cannot parse them.
 *   2. Rewrites the hand-written banner <div> wrapper on the overview page as
 *      <Banner src alt />. The earlier trial deleted this block outright and lost
 *      the white card; as a declared component the visual is preserved and an
 *      editor can change it.
 *   3. Drops stray `<br />` tags, which the editor also rejects. Markdown's own
 *      paragraph breaks already produce the spacing.
 *
 * WHAT IT DOES NOT TOUCH
 * `:::note` admonitions are left exactly as they are. They render correctly and
 * converting them to <Admonition> is a separate, larger content decision.
 *
 * USAGE
 *   node scripts/prepare-corpus-for-editor.mjs           # apply
 *   node scripts/prepare-corpus-for-editor.mjs --check   # report only, exit 1 if work remains
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS = join(__dirname, '..', 'website', 'docs');
const CHECK_ONLY = process.argv.includes('--check');

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.md') || entry.endsWith('.mdx')) out.push(full);
  }
  return out;
}

/** The exact wrapper written by hand on the overview page. */
const BANNER_BLOCK =
  /<div style=\{\{textAlign: 'center'\}\}>\s*\n+\s*<div style=\{\{display: 'inline-block'[^}]*\}\}>\s*\n+\s*!\[([^\]]*)\]\(([^)]+)\)\s*\n+\s*<\/div>\s*\n+\s*<\/div>/;

const transforms = [
  {
    name: 'removed redundant @theme import',
    apply: (text) =>
      text.replace(
        /^import\s+(?:Tabs|TabItem)\s+from\s+'@theme\/(?:Tabs|TabItem)';[ \t]*\r?\n/gm,
        ''
      ),
  },
  {
    name: 'converted banner wrapper to <Banner />',
    apply: (text) =>
      text.replace(BANNER_BLOCK, (_m, alt, src) => `<Banner src="${src}" alt="${alt}" />`),
  },
  {
    name: 'dropped stray <br /> tag',
    apply: (text) => text.replace(/[ \t]*<br\s*\/?>[ \t]*/gi, ''),
  },
];

let touched = 0;
const files = walk(DOCS);

for (const file of files) {
  const original = readFileSync(file, 'utf8');
  let text = original;
  const applied = [];

  for (const t of transforms) {
    const next = t.apply(text);
    if (next !== text) {
      applied.push(t.name);
      text = next;
    }
  }

  // Collapse the blank-line run an import block leaves behind, but only
  // immediately after front matter, so body spacing is left alone.
  text = text.replace(/^(---\r?\n[\s\S]*?\r?\n---\r?\n)\r?\n{2,}/, '$1\n');

  if (text === original) continue;

  touched++;
  console.log(`${CHECK_ONLY ? '✗' : '✓'} ${relative(DOCS, file)} — ${applied.join('; ')}`);
  if (!CHECK_ONLY) writeFileSync(file, text, 'utf8');
}

console.log(
  `\n${files.length} pages scanned, ${touched} ${CHECK_ONLY ? 'still needing prep' : 'updated'}.`
);

if (CHECK_ONLY && touched > 0) {
  console.error('\nRun `node scripts/prepare-corpus-for-editor.mjs` and commit the result.');
  process.exit(1);
}
