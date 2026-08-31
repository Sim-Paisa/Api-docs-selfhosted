'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import tree from '../docs-tree.json';

type Node = {
  type: 'category' | 'doc';
  label: string;
  collection?: string;
  slug?: string;
  children?: Node[];
};

// Two ways to preview an unpublished draft, in order of preference.
//
// 1. PREVIEW_SERVICE — a Docusaurus dev server per branch (see preview-service/).
//    Instant (~0.44s) and fully faithful. Needs a host to run on.
// 2. PAGES_PROJECT — Cloudflare Pages builds every branch to a deterministic
//    alias, `<branch-slug>.<project>.pages.dev`. Costs 60–90s per change but
//    needs no server at all.
//
// Setting NEXT_PUBLIC_PREVIEW_SERVICE later upgrades preview from (2) to (1)
// without a code change.
const PREVIEW_SERVICE = (process.env.NEXT_PUBLIC_PREVIEW_SERVICE ?? '').replace(/\/$/, '');
const PAGES_PROJECT = process.env.NEXT_PUBLIC_PAGES_PROJECT ?? '';

// Cloudflare lowercases branch names and replaces every non-alphanumeric run with
// a hyphen, so `draft/my-change` is served at `draft-my-change.<project>.pages.dev`.
function branchAlias(branch: string) {
  return branch.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const IS_GITHUB =
  (process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE ??
    (process.env.NODE_ENV === 'production' ? 'github' : 'local')) === 'github';

// Local mode edits files on disk, so a plain dev server on this machine already
// reflects saves instantly — no branch routing involved.
const LOCAL_PREVIEW = (
  process.env.NEXT_PUBLIC_PREVIEW_BASE ?? 'http://localhost:3002'
).replace(/\/$/, '');

const DEFAULT_BRANCH = process.env.NEXT_PUBLIC_KEYSTATIC_BRANCH ?? 'draft/main';

function editorUrl(branch: string, collection: string, slug: string) {
  const item = `collection/${collection}/item/${encodeURIComponent(slug)}`;
  return IS_GITHUB ? `/keystatic/branch/${branch}/${item}` : `/keystatic/${item}`;
}

function previewUrl(branch: string, collection: string, slug: string) {
  const path = `/docs/${collection}/${slug}`.replace(/\/index$/, '');
  if (!IS_GITHUB) return `${LOCAL_PREVIEW}${path}`;
  if (PREVIEW_SERVICE) return `${PREVIEW_SERVICE}/${branch}${path}`;
  if (PAGES_PROJECT) return `https://${branchAlias(branch)}.${PAGES_PROJECT}.pages.dev${path}`;
  return `${LOCAL_PREVIEW}${path}`;
}

/**
 * Keystatic's GitHub-mode routes carry the branch, and branch names contain
 * slashes (`draft/my-change`), so match greedily up to `/collection/`.
 *   /keystatic/branch/draft/my-change/collection/pay-in-apis/item/overview
 */
function parseEditorPath(pathname: string) {
  const withBranch = pathname.match(
    /\/keystatic\/branch\/(.+?)\/collection\/([^/]+)\/item\/(.+)$/
  );
  if (withBranch) {
    return {
      branch: withBranch[1],
      collection: withBranch[2],
      slug: safeDecode(withBranch[3]),
    };
  }
  const local = pathname.match(/\/collection\/([^/]+)\/item\/(.+)$/);
  if (local) {
    return { branch: null, collection: local[1], slug: safeDecode(local[2]) };
  }
  return null;
}

function safeDecode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function TreeNode({
  node,
  active,
  onSelect,
  depth,
}: {
  node: Node;
  active: string;
  onSelect: (c: string, s: string) => void;
  depth: number;
}) {
  const [open, setOpen] = useState(depth < 1);
  const pad = 8 + depth * 14;

  if (node.type === 'doc') {
    const id = `${node.collection}/${node.slug}`;
    const isActive = id === active;
    return (
      <button
        onClick={() => onSelect(node.collection!, node.slug!)}
        style={{
          display: 'block', width: '100%', textAlign: 'left',
          padding: '4px 8px', paddingLeft: pad, border: 'none',
          background: isActive ? '#3578e5' : 'transparent',
          color: isActive ? '#fff' : 'inherit', borderRadius: 5,
          cursor: 'pointer', font: '13px system-ui, sans-serif',
        }}
      >
        {node.label}
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'block', width: '100%', textAlign: 'left',
          padding: '4px 8px', paddingLeft: pad, border: 'none',
          background: 'transparent', color: 'inherit', cursor: 'pointer',
          fontWeight: 700, font: '13px system-ui, sans-serif', opacity: 0.85,
        }}
      >
        {open ? '▾' : '▸'} {node.label}
      </button>
      {open &&
        node.children?.map((c, i) => (
          <TreeNode key={i} node={c} active={active} onSelect={onSelect} depth={depth + 1} />
        ))}
    </div>
  );
}

function StudioInner() {
  const params = useSearchParams();
  const initCollection = params.get('collection') ?? 'getting-started';
  const initSlug = params.get('slug') ?? 'overview';
  const initBranch = params.get('branch') ?? DEFAULT_BRANCH;

  const [branch, setBranch] = useState(initBranch);
  const [target, setTarget] = useState({ collection: initCollection, slug: initSlug });
  const [editorSrc, setEditorSrc] = useState(
    editorUrl(initBranch, initCollection, initSlug)
  );
  // Manual refresh only. Hot reload pushes content changes on its own; a timed
  // reload would fight the HMR socket and throw away scroll position.
  const [reloadKey, setReloadKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const editorRef = useRef<HTMLIFrameElement>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  const activeId = `${target.collection}/${target.slug}`;
  const scrollByPage = useRef<Record<string, number>>({});
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  // Scroll bridge: the docs site reports its scroll position and announces when
  // it is ready, so the preview stays pegged where the editor was reading.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { type?: string; y?: number };
      if (!d || typeof d !== 'object') return;
      if (d.type === 'preview:scroll') {
        scrollByPage.current[activeIdRef.current] = Number(d.y) || 0;
      } else if (d.type === 'preview:ready') {
        const y = scrollByPage.current[activeIdRef.current] || 0;
        previewRef.current?.contentWindow?.postMessage({ type: 'preview:restore', y }, '*');
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Follow the editor: when the user navigates inside Keystatic — including
  // switching branches — mirror it into the preview.
  useEffect(() => {
    const id = setInterval(() => {
      try {
        const path = editorRef.current?.contentWindow?.location?.pathname;
        if (!path) return;
        const parsed = parseEditorPath(path);
        if (!parsed) return;
        if (parsed.branch && parsed.branch !== branch) setBranch(parsed.branch);
        if (parsed.collection !== target.collection || parsed.slug !== target.slug) {
          setTarget({ collection: parsed.collection, slug: parsed.slug });
        }
      } catch {
        /* cross-origin during OAuth — ignore */
      }
    }, 1500);
    return () => clearInterval(id);
  }, [branch, target]);

  const select = (collection: string, slug: string) => {
    setEditorSrc(editorUrl(branch, collection, slug));
    setTarget({ collection, slug });
  };

  const bar: React.CSSProperties = {
    display: 'flex', gap: 12, alignItems: 'center', padding: '8px 12px',
    borderBottom: '1px solid rgba(128,128,128,0.3)', font: '13px system-ui, sans-serif',
  };
  const btn: React.CSSProperties = {
    padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(128,128,128,0.5)',
    background: 'transparent', color: 'inherit', cursor: 'pointer', font: '13px system-ui',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={bar}>
        <button style={btn} onClick={() => setSidebarOpen((o) => !o)} title="Toggle navigation">
          {sidebarOpen ? '⟨ Hide nav' : '☰ Nav'}
        </button>
        <strong>Studio</strong>
        {IS_GITHUB && (
          <span
            title="Preview shows this draft, not the published site"
            style={{
              padding: '2px 8px', borderRadius: 999, fontSize: 12,
              background: 'rgba(53,120,229,0.12)', color: '#3578e5',
              font: '12px ui-monospace, monospace',
            }}
          >
            {branch}
          </span>
        )}
        <span style={{ opacity: 0.7 }}>{activeId}</span>
        <span style={{ flex: 1 }} />
        <span style={{ opacity: 0.55, fontSize: 12 }}>
          {PREVIEW_SERVICE
            ? 'preview updates as you save'
            : 'preview rebuilds ~1–2 min after each save'}
        </span>
        <button
          style={{ ...btn, borderColor: '#3578e5', background: '#3578e5', color: '#fff' }}
          onClick={() => setReloadKey((n) => n + 1)}
          title="Force a reload — only needed if the preview server was still starting"
        >
          Reload preview
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {sidebarOpen && (
          <div
            style={{
              width: 250, overflowY: 'auto',
              borderRight: '1px solid rgba(128,128,128,0.3)', padding: 8,
            }}
          >
            {(tree as unknown as Node[]).map((n, i) => (
              <TreeNode key={i} node={n} active={activeId} onSelect={select} depth={0} />
            ))}
          </div>
        )}
        <iframe
          ref={editorRef}
          title="editor"
          src={editorSrc}
          style={{ flex: 1, border: 'none', borderRight: '1px solid rgba(128,128,128,0.3)' }}
        />
        <iframe
          ref={previewRef}
          key={`${branch}:${activeId}:${reloadKey}`}
          title="preview"
          src={previewUrl(branch, target.collection, target.slug)}
          style={{ flex: 1, border: 'none' }}
        />
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading studio…</div>}>
      <StudioInner />
    </Suspense>
  );
}
