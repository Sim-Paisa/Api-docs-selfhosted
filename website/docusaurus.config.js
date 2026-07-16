// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Simpaisa API Documentation',
  tagline: 'Pay-in, pay-out, and remittance APIs for Pakistan, Bangladesh, Nepal, Egypt & Iraq',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // GitHub Pages deployment target.
  url: 'https://sim-paisa.github.io',
  baseUrl: '/Api-docs-selfhosted/',
  organizationName: 'Sim-Paisa',
  projectName: 'Api-docs-selfhosted',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid', '@easyops-cn/docusaurus-search-local'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Scroll bridge so the Studio preview keeps its position across refreshes.
  clientModules: ['./src/clientModules/previewScroll.js'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.js',
          // "Edit this page" opens the side-by-side Studio (Decap editor + live
          // built-site preview). Override with DECAP_STUDIO_URL for local authoring.
          // docPath e.g. "pay-in-apis/pakistan/cards/capture.md" -> collection
          // "pay-in-apis", slug "pakistan/cards/capture".
          editUrl: ({ docPath }) => {
            const noExt = docPath.replace(/\.mdx?$/, '');
            const i = noExt.indexOf('/');
            const collection = i === -1 ? noExt : noExt.slice(0, i);
            const slug = i === -1 ? '' : noExt.slice(i + 1);
            const studio =
              process.env.DECAP_STUDIO_URL ||
              (process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000/Api-docs-selfhosted/admin/studio.html'
                : 'https://sim-paisa.github.io/Api-docs-selfhosted/admin/studio.html');
            return `${studio}?collection=${collection}&slug=${encodeURIComponent(slug)}`;
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'API Docs',
        logo: {
          alt: 'Simpaisa Logo',
          src: 'img/simpaisa-logo.webp',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'apiSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/Sim-Paisa/Api-docs-selfhosted',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {label: 'Getting Started', to: '/docs/getting-started/overview'},
              {label: 'Platform Reference', to: '/docs/platform-reference/webhooks'},
            ],
          },
          {
            title: 'More',
            items: [
              {label: 'GitHub', href: 'https://github.com/Sim-Paisa/Api-docs-selfhosted'},
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Simpaisa. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['java', 'bash', 'json', 'php', 'python'],
      },
    }),
};

export default config;
