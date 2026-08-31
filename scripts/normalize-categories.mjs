/**
 * Heals `_category_.json` files that Keystatic has written in a shape Docusaurus
 * cannot read.
 *
 * WHY THIS EXISTS
 * Keystatic writes exactly the fields declared in the schema — no more, no less.
 * The sidebar `link` block is optional in Docusaurus (7 of our 26 categories have
 * none), but a Keystatic `fields.object` is always written. So saving a link-less
 * category through the editor emits:
 *
 *     "link": { "type": "doc", "id": "" }
 *
 * ...and Docusaurus fails the build resolving a doc with an empty id. The obvious
 * fix, `fields.conditional`, is worse: it serialises as
 * `{ "discriminant": …, "value": … }` and rejects any object containing other
 * keys, which would rewrite all 19 working categories into a shape the sidebar
 * cannot read. So the schema stays simple and this normaliser fixes the output.
 *
 * WHAT IT DOES  (idempotent)
 *   - link.type === 'doc' with a blank id      -> drop `link` entirely
 *   - link.type === 'generated-index'          -> drop the `id` key (not valid there)
 *   - link absent or already valid             -> untouched
 *
 * USAGE
 *   node scripts/normalize-categories.mjs           # fix in place
 *   node scripts/normalize-categories.mjs --check   # report only, exit 1 if dirty
 *
 * Runs in CI on pushes to draft branches, and again as a check on the pull
 * request so nothing malformed can reach main.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS = join(__dirname, '..', 'website', 'docs');
const CHECK_ONLY = process.argv.includes('--check');

function findCategoryFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) findCategoryFiles(full, out);
    else if (entry === '_category_.json') out.push(full);
  }
  return out;
}

/** Returns { changed, data, reason } without mutating the input. */
function normalize(data) {
  const link = data.link;
  if (link === null || typeof link !== 'object' || Array.isArray(link)) {
    return { changed: false, data };
  }

  if (link.type === 'generated-index') {
    if (!('id' in link)) return { changed: false, data };
    const { id, ...rest } = link;
    return {
      changed: true,
      data: { ...data, link: rest },
      reason: "dropped `id` from a generated-index link (not a valid key there)",
    };
  }

  // Default/`doc` links are only meaningful with a target.
  const id = typeof link.id === 'string' ? link.id.trim() : '';
  if (id === '') {
    const { link: _drop, ...rest } = data;
    return {
      changed: true,
      data: rest,
      reason: 'removed an empty `doc` link that would fail the build',
    };
  }

  return { changed: false, data };
}

let dirty = 0;
const files = findCategoryFiles(DOCS);

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error(`✗ ${relative(DOCS, file)} — invalid JSON: ${err.message}`);
    dirty++;
    continue;
  }

  const { changed, data, reason } = normalize(parsed);
  if (!changed) continue;

  dirty++;
  console.log(`${CHECK_ONLY ? '✗' : '✓'} ${relative(DOCS, file)} — ${reason}`);
  if (!CHECK_ONLY) {
    // Match the two-space indent already used across these files.
    writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  }
}

console.log(
  `\n${files.length} category files scanned, ${dirty} ${
    CHECK_ONLY ? 'needing repair' : 'repaired'
  }.`
);

if (CHECK_ONLY && dirty > 0) {
  console.error(
    '\nRun `node scripts/normalize-categories.mjs` to fix, then commit the result.'
  );
  process.exit(1);
}
