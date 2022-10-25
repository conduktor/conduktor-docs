// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Conduktor Docs',
  tagline: 'Dinosaurs are cool',
  url: 'https://docs.conduktor.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
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

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: 'platform',
          path: './docs/platform',
          lastVersion: 'current',
          onlyIncludeVersions: ['current'],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/conduktor/conduktor-docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
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
          src: 'img/logo.svg',
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
            title: 'Docs',
            items: [
              {
                label: 'Platform',
                to: '/platform',
              },
              {
                label: 'Testing',
                to: '/testing',
              },
              {
                label: 'Desktop',
                to: '/desktop',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Conduktor Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        disableSwitch: true,
      },
    }),
  clientModules: [require.resolve('./_document.js')],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'testing',
        path: './docs/testing',
        routeBasePath: 'testing',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'desktop',
        path: './docs/desktop',
        routeBasePath: 'desktop',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    [
      'docusaurus2-dotenv',
      {
        systemvars: true,
      },
    ],
  ],
}

module.exports = config
