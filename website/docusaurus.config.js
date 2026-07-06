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

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/Sim-Paisa/Api-docs-selfhosted/tree/main/website/',
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
