const { themes } = require('prism-react-renderer')
const lightCodeTheme = themes.github
const darkCodeTheme = themes.dracula
const { gtag } = require('./src/services/gtag')
const { analytics } = require('./src/services/analytics')
const { gtm } = require('./src/services/gtm')
const { redirects } = require('./src/services/redirects')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Conduktor docs',
  tagline: 'Unlock the potential of your data',
  url: 'https://docs.conduktor.io',
  baseUrl: '/',
  trailingSlash: true,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
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
          sidebarPath: require.resolve('./guides_sidebars.js'),
          sidebarCollapsed: true,
          sidebarCollapsible: true,
          routeBasePath: '/guides',
          path: './docs/guides',
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
          alt: 'Conduktor logo',
          src: 'assets/svgs/logo.svg',
          href: '/', 
        },
        items: [
          {
            label: 'Guides',
            position: 'left',
            to: '/guides',
          },
          {
            label: 'Tutorials',
            position: 'left',
            to: '/tutorials',
          },
          {
            label: 'Concepts',
            position: 'left',
            to: '/guides/conduktor-concepts',
          },
          {
            label: 'Support',
            position: 'left',
            to: 'https://support.conduktor.io',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Conduktor guides',
            items: [
              {
                label: 'Overview',
                to: '/guides',
              },
              {
                label: 'Get started',
                to: '/guides/get-started',
              },
              {
                label: 'Conduktor in production',
                to: 'guides/conduktor-in-production',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Release notes',
                to: '/changelog',
              },
              {
                label: 'API reference',
                href: 'https://developers.conduktor.io',
              },
              {
                label: 'Kafkademy',
                href: 'https://learn.conduktor.io/kafka',
              },
              {
                label: 'Conduktor blog',
                href: 'https://conduktor.io/blog',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Support portal',
                href: 'https://support.conduktor.io',
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
 /*   redirects, */
    gtag,
    analytics,
    gtm,
  ],
  stylesheets: [
    '/css/stitches.css',  
    '/css/custom.css',  
  ],
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
      'runllm-community-url': 'https://conduktor.io/slack',
      'runllm-community-type': 'slack',
      'runllm-disclaimer': 'Answers are not covered by SLA and should be used for reference only. For official support, go to our <a href="https://support.conduktor.io" target="_blank">support portal</a>.',
      'runllm-name': 'Conduktor',
      'runllm-theme-color': '#09343C',
      'runllm-brand-logo' :'https://raw.githubusercontent.com/conduktor/conduktor.io-public/refs/heads/main/logo/dark-green-bg-app.png',
      'runllm-floating-button-text': 'Ask Conduktor',
      async: true,
    },
  ],
}

module.exports = config