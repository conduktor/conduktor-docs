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
          sidebarPath: require.resolve('./guide_sidebars.js'),
          sidebarCollapsed: true,
          sidebarCollapsible: true,
          routeBasePath: '/guide',
          path: './docs/guide',
          lastVersion: 'current',
          onlyIncludeVersions: ['current'],
          exclude: ['./api/**/*'],
          remarkPlugins: [],
          rehypePlugins: [],
          /*admonitions: {
            keywords: ['product'],  
            extendDefaults: true,},*/
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
          src: '/assets/svgs/logo.svg',
          href: 'https://conduktor.io', 
          target: '_blank',
        },
        items: [
          {
            type: 'search',
            position: 'right',
          },
          {
            label: 'Get started',
            to: 'https://conduktor.io/get-started', 
            position: 'right',
            className: 'navbar-free-trial-button',
          },
          {
            label: 'Home',
            to: '/', 
          },
          {
            label: 'Guide',
            position: 'left',
            to: '/guide',
            activeBaseRegex: `/guide/`,
          },
          {
            label: 'Tutorials',
            position: 'left',
            to: '/guide/tutorials',
            activeBaseRegex: `/docs/guide/tutorials/`,
          },
          {
            label: 'Concepts',
            position: 'left',
            to: '/guide/conduktor-concepts',
            activeBaseRegex: `/docs/guide/conduktor-concepts/`,
          },
          {
            label: 'Resource reference',
            position: 'left',
            to: '/guide/reference',
            activeBaseRegex: `/docs/guide/reference/`,
          },
          {
            label: 'API reference',
            position: 'left',
            href: 'https://developers.conduktor.io',
            target: '_blank',
          },
          {
            label: 'Release notes',
            position: 'left',
            to: '/changelog',
            activeBaseRegex: `/changelog/`,
          },
          {
            label: 'Glossary',
            position: 'left',
            to: '/glossary',
          },
          {
            type: 'dropdown',
            label: 'Support',
            position: 'left',
            items: [
              {
                label: 'Options',
                to: '/guide/support',
              },            
              {
                label: 'Upgrade or migrate',
                to: '/guide/support/upgrade',
              },
              {
                label: 'Version policy',
                to: '/support',
              },
              {
                label: 'Go to support site',
                to: 'https://support.conduktor.io',
                target: '_blank',
                rel: 'noopener noreferrer',
              },
            ],
          },   
        ],
      },
      algolia: {
        appId: process.env.REACT_APP_ALGOLIA_APPLICATION_ID,
        apiKey: process.env.REACT_APP_ALGOLIA_API_KEY, // This should be your search-only API key, not admin key
        indexName: process.env.REACT_APP_ALGOLIA_INDEX,
        contextualSearch: true,
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Conduktor guide',
            items: [
              {
                label: 'Overview',
                to: '/guide',
              },
              {
                label: 'Get started',
                to: '/guide/get-started',
              },
              {
                label: 'Conduktor in production',
                to: 'guide/conduktor-in-production',
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
                target: '_blank',
              },
              {
                label: 'Kafkademy',
                href: 'https://learn.conduktor.io/kafka',
                target: '_blank',
              },
              {
                label: 'Conduktor blog',
                href: 'https://conduktor.io/blog',
                target: '_blank',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Support site',
                href: 'https://support.conduktor.io',
                target: '_blank',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/conduktor',
                target: '_blank',
              },
              {
                label: 'Slack',
                href: 'https://www.conduktor.io/slack',
                target: '_blank',
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
      pages: {
        path: 'src/pages',
      },
      
      colorMode: {
       disableSwitch: false,
       defaultMode: 'light',
      respectPrefersColorScheme: true,
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

    redirects,
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