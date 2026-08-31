import * as React from 'react';
import { config, collection, fields } from '@keystatic/core';
import { wrapper, block } from '@keystatic/core/content-components';

/* ------------------------------------------------------------------ *
 * Component palette
 *
 * Everything an editor can insert lives here, and every entry must also be
 * registered in website/src/theme/MDXComponents.js or the page fails to build.
 *
 * The palette is deliberately fixed — Keystatic rejects raw JSX in the body, so
 * an undeclared component is uneditable. `Raw` (bottom) is the escape hatch that
 * stops that from becoming an engineering bottleneck for every new layout.
 * ------------------------------------------------------------------ */

const ADMONITION_TYPES = ['note', 'tip', 'info', 'warning', 'danger'] as const;

const docusaurusComponents = {
  Tabs: wrapper({
    label: 'Tabs',
    schema: {},
  }),

  TabItem: wrapper({
    label: 'Tab item',
    schema: {
      value: fields.text({ label: 'Value (unique id)' }),
      label: fields.text({ label: 'Label' }),
    },
  }),

  // Renders through Docusaurus's own @theme/Admonition on the site, so a callout
  // authored here is pixel-identical to the `:::note` syntax it replaces.
  Admonition: wrapper({
    label: 'Callout',
    schema: {
      type: fields.select({
        label: 'Style',
        options: ADMONITION_TYPES.map((t) => ({
          label: t[0].toUpperCase() + t.slice(1),
          value: t,
        })),
        defaultValue: 'note',
      }),
      title: fields.text({
        label: 'Title (optional)',
        validation: { isRequired: false },
      }),
    },
  }),

  // CTA button — insert from the editor's "/" menu. ContentView gives a live
  // button-styled preview inside the editor so it reads as a real button.
  Button: block({
    label: 'Button',
    schema: {
      label: fields.text({ label: 'Button text' }),
      href: fields.text({ label: 'Link (URL or /docs/... path)' }),
      variant: fields.select({
        label: 'Style',
        options: [
          { label: 'Primary', value: 'primary' },
          { label: 'Secondary', value: 'secondary' },
        ],
        defaultValue: 'primary',
      }),
    },
    ContentView: (props) => {
      const { label, href, variant } = props.value as {
        label: string;
        href: string;
        variant: string;
      };
      const primary = variant !== 'secondary';
      return (
        <div style={{ margin: '0.75rem 0' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '0.5rem 1.25rem',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 15,
              background: primary ? '#3578e5' : 'transparent',
              color: primary ? '#fff' : '#3578e5',
              border: '2px solid #3578e5',
            }}
          >
            {label || 'Button'}
          </span>
          <span style={{ marginLeft: 10, fontSize: 12, opacity: 0.6 }}>
            → {href || '(no link set)'}
          </span>
        </div>
      );
    },
  }),

  // Wraps an ordinary markdown table and makes its columns drag-resizable on the
  // site. The table itself stays plain GFM, so it degrades cleanly.
  ResizableTable: wrapper({
    label: 'Resizable table',
    schema: {
      widths: fields.text({
        label: 'Column widths (comma-separated %, optional)',
        description: 'e.g. 30,40,30 — leave blank for equal columns',
        validation: { isRequired: false },
      }),
    },
  }),

  // Centred banner image on a white card (top of the Getting Started overview).
  // Declared so the treatment survives as editable content instead of raw JSX.
  Banner: block({
    label: 'Banner image',
    schema: {
      src: fields.text({
        label: 'Image path',
        description: 'e.g. /img/simpaisa-banner.png',
      }),
      alt: fields.text({
        label: 'Alt text',
        validation: { isRequired: false },
      }),
    },
    ContentView: (props) => {
      const { src, alt } = props.value as { src: string; alt: string };
      return (
        <div style={{ textAlign: 'center', margin: '0.75rem 0' }}>
          <span
            style={{
              display: 'inline-block',
              background: '#ffffff',
              padding: '0.75rem 1.5rem',
              borderRadius: 10,
              border: '1px solid #d8dce3',
            }}
          >
            {src ? (
              <img src={src} alt={alt || ''} style={{ display: 'block', maxWidth: 320 }} />
            ) : (
              <span style={{ font: '12px system-ui', color: '#5a6170' }}>(no image set)</span>
            )}
          </span>
        </div>
      );
    },
  }),

  // Escape hatch. See website/src/components/Raw.js for the trust model —
  // it is safe only because publishing requires a reviewed pull request.
  Raw: block({
    label: 'Custom HTML',
    schema: {
      html: fields.text({
        label: 'HTML',
        multiline: true,
        description:
          'Raw HTML, inserted as-is. Reviewed on the pull request before it publishes.',
      }),
    },
    ContentView: (props) => {
      const { html } = props.value as { html: string };
      return (
        <div
          style={{
            border: '1px dashed #b0b6c0',
            borderRadius: 6,
            padding: '0.6rem 0.8rem',
            margin: '0.75rem 0',
            font: '12px ui-monospace, SFMono-Regular, Menlo, monospace',
            whiteSpace: 'pre-wrap',
            opacity: 0.85,
          }}
        >
          <strong style={{ display: 'block', marginBottom: 4, fontSize: 11 }}>
            CUSTOM HTML
          </strong>
          {html?.slice(0, 400) || '(empty)'}
        </div>
      );
    },
  }),
};

/* ------------------------------------------------------------------ *
 * Storage
 *
 * Repo and branch come from the environment so that consolidating onto the live
 * repository is a configuration change, not a code change.
 *
 * `branchPrefix` is the interface half of the review gate: Keystatic will only
 * list and create branches under `draft/`, so an editor cannot navigate to the
 * production branch. The enforcement half is GitHub branch protection on main —
 * Keystatic has no protected-branch detection of its own, so both are required.
 * ------------------------------------------------------------------ */

const storageKind =
  (process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE as 'local' | 'github' | undefined) ??
  (process.env.NODE_ENV === 'production' ? 'github' : 'local');

const repo = (process.env.NEXT_PUBLIC_KEYSTATIC_REPO ??
  'Sim-Paisa/Api-docs-selfhosted') as `${string}/${string}`;

const storage =
  storageKind === 'github'
    ? ({ kind: 'github', repo, branchPrefix: 'draft/' } as const)
    : ({ kind: 'local' } as const);

// Base URL of the rendered Docusaurus site used for the per-entry "Preview"
// action. In the Studio this is replaced by a branch-aware URL; this value is the
// fallback for previewing straight from the entry form.
const previewBase =
  process.env.NEXT_PUBLIC_PREVIEW_BASE ?? 'http://localhost:3002';

/* ------------------------------------------------------------------ *
 * Collections
 * ------------------------------------------------------------------ */

function docsCollection(label: string, folder: string) {
  return collection({
    label,
    path: `website/docs/${folder}/**`,
    slugField: 'sidebar_label',
    format: { contentField: 'body' },
    previewUrl: `${previewBase}/docs/${folder}/{slug}`,
    columns: ['sidebar_label'],
    schema: {
      // Reuses the existing `sidebar_label` front-matter key as the entry name;
      // the slug (filename) is taken from disk and kept on save.
      sidebar_label: fields.slug({
        name: {
          label: 'Sidebar label',
          validation: { isRequired: false },
        },
      }),
      sidebar_position: fields.integer({
        label: 'Sidebar position',
        validation: { isRequired: false },
      }),
      description: fields.text({
        label: 'Meta description (SEO)',
        validation: { isRequired: false },
      }),
      // Present on a handful of pages (e.g. remittance-apis/get-fx-rate).
      // Docusaurus uses it to keep a page out of the sidebar.
      unlisted: fields.checkbox({
        label: 'Unlisted (hidden from navigation)',
        defaultValue: false,
      }),
      body: fields.mdx({
        label: 'Page content',
        extension: 'md',
        components: docusaurusComponents,
        options: {
          image: {
            directory: 'website/static/img',
            publicPath: '/img',
          },
        },
      }),
    },
  });
}

export default config({
  storage,
  ui: {
    brand: { name: 'Simpaisa Docs' },
  },
  collections: {
    'getting-started': docsCollection('Getting Started', 'getting-started'),
    'pay-in-apis': docsCollection('Pay-in APIs', 'pay-in-apis'),
    'pay-out-apis': docsCollection('Pay-out APIs', 'pay-out-apis'),
    'platform-reference': docsCollection('Platform Reference', 'platform-reference'),
    'remittance-apis': docsCollection('Remittance APIs', 'remittance-apis'),

    // ---- Sidebar categories (the 26 `_category_.json` files) ---------------
    //
    // `link` is modelled as a plain object on purpose. Docusaurus treats it as
    // optional (7 of 26 categories have none) but Keystatic always writes every
    // declared field, so saving a link-less category emits `{"type":"doc","id":""}`
    // and breaks the build.
    //
    // `fields.conditional` is NOT the fix: it serialises as
    // `{ discriminant, value }` and rejects objects containing any other key,
    // which would rewrite the 19 working categories into a shape the sidebar
    // cannot read. Instead the shape stays correct-by-default and
    // scripts/normalize-categories.mjs strips the invalid output in CI, before
    // the build check runs.
    'sidebar-categories': collection({
      label: 'Sidebar categories',
      path: 'website/docs/**',
      format: { data: 'json' },
      slugField: 'label',
      columns: ['label', 'position'],
      schema: {
        label: fields.slug({ name: { label: 'Category label' } }),
        position: fields.integer({
          label: 'Position',
          validation: { isRequired: false },
        }),
        link: fields.object(
          {
            type: fields.select({
              label: 'Landing page',
              options: [
                { label: 'An existing page', value: 'doc' },
                { label: 'Auto-generated index', value: 'generated-index' },
              ],
              defaultValue: 'doc',
            }),
            id: fields.text({
              label: 'Target page id',
              description:
                'Only used for "An existing page" — e.g. getting-started/overview. Leave blank for no landing page.',
              validation: { isRequired: false },
            }),
          },
          { label: 'Sidebar link' }
        ),
      },
    }),
  },
});
