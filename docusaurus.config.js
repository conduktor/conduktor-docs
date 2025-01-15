// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require('prism-react-renderer')
const lightCodeTheme = themes.github
const darkCodeTheme = themes.dracula
const { gtag } = require('./src/services/gtag')
const { analytics } = require('./src/services/analytics')
const { gtm } = require('./src/services/gtm')
const { redirects } = require('./src/services/redirects')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Conduktor Docs',
  tagline: 'Dinosaurs are cool',
  url: 'https://docs.conduktor.io',
  baseUrl: '/',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'conduktor', // Usually your GitHub org/user name.
  projectName: 'conduktor-docs', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Allow mermaid in markdown
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./platform_sidebars.js'),
          sidebarCollapsed: true,
          sidebarCollapsible: true,
          routeBasePath: '/platform',
          path: './docs/platform',
          lastVersion: 'current',
          onlyIncludeVersions: ['current'],
          exclude: ['./api/**/*'],
        },
        theme: {
          customCss: [require.resolve('./src/css/custom.css')],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'Conduktor Docs logo',
          src: 'assets/svgs/logo.svg',
        },
        items: [
          {
            type: 'custom-navbar',
            position: 'left',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Platform',
            items: [
              {
                label: 'Overview',
                to: '/platform',
              },
              {
                label: 'Installation',
                to: '/platform/get-started/installation/hardware',
              },
              {
                label: 'Configuration',
                to: 'platform/get-started/configuration/introduction',
              },
            ],
          },
          {
            title: 'Docs',
            items: [
              {
                label: 'Console',
                to: '/platform',
              },
              {
                label: 'Gateway',
                to: '/gateway',
              },
              {
                label: 'Desktop',
                to: '/desktop',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Changelog',
                href: '/changelog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/conduktor',
              },
              {
                label: 'Slack',
                href: 'https://www.conduktor.io/slack',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Conduktor Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'diff', 'json', 'hcl'],
      },
      colorMode: {
        disableSwitch: true,
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
    }),
  plugins: [
    [
      'docusaurus-plugin-dotenv',
      {
        path: './.env',
        systemvars: true,
      },
    ],
    'docusaurus-plugin-sass',
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'desktop',
        sidebarPath: require.resolve('./desktop_sidebars.js'),
        sidebarCollapsed: true,
        sidebarCollapsible: true,
        routeBasePath: '/desktop',
        exclude: ['./api/**/*'],
        path: './docs/desktop',
        lastVersion: 'current',
        onlyIncludeVersions: ['current'],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'gateway',
        sidebarPath: require.resolve('./gateway_sidebars.js'),
        sidebarCollapsed: true,
        sidebarCollapsible: true,
        routeBasePath: '/gateway',
        exclude: ['./api/**/*'],
        path: './docs/gateway',
        lastVersion: 'current',
        onlyIncludeVersions: ['current'],
      },
    ],
    redirects,
    gtag,
    analytics,
    gtm,
  ],
  stylesheets: ['/css/stitches.css'],
  scripts: [
    {
      src: 'https://cdn-cookieyes.com/client_data/bb65dd08fda6eb81ef9cf1c2/script.js',
      id: 'cookieyes',
      type: 'text/javascript',
    },
    {
      id: 'runllm-widget-script',
      type: 'module',
      src: 'https://widget.runllm.com',
      'runllm-server-address': 'https://api.runllm.com',
      'runllm-assistant-id': '147',
      'runllm-position': 'BOTTOM_RIGHT',
      'runllm-keyboard-shortcut': 'Mod+j',
      version: 'stable',
      'runllm-preset': 'docusaurus',
      'runllm-slack-community-url': 'https://conduktor.io/slack',
      'runllm-name': 'Conduktor',
      'runllm-theme-color': '#005EEC',
      async: true,
    },
  ],
}

module.exports = config
