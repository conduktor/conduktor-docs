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
          sidebarPath: require.resolve('./platform_sidebars.js'),
          routeBasePath: '/platform',
          path: './docs/platform',
          lastVersion: 'current',
          onlyIncludeVersions: ['current'],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/conduktor/conduktor-docs/',
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
                to: '/platform/installation/hardware',
              },
              {
                label: 'Configuration',
                to: 'platform/configuration/introduction',
              },
            ],
          },
          {
            title: 'Docs',
            items: [
              {
                label: 'Console',
                to: '/platform/console',
              },
              {
                label: 'Testing',
                to: '/platform/testing',
              },
              {
                label: 'Monitoring',
                to: '/platform/monitoring',
              },
            ],
          },
          {
            title: '𝅷',
            items: [
              {
                html: `<a href="/platform/data-masking">Data Masking <span class="badge">soon</span></a>`,
              },
              {
                html: `<a href="/platform/topic-service">Topic as a Service <span class="badge">soon</span></a>`,
              },
              {
                label: 'Conduktor Desktop',
                to: '/desktop',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/conduktor',
              },
              {
                label: 'Discord',
                to: '/',
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
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'desktop',
        path: './docs/desktop',
        routeBasePath: 'desktop',
        sidebarPath: require.resolve('./desktop_sidebars.js'),
      },
    ],
    [
      'docusaurus2-dotenv',
      {
        systemvars: true,
      },
    ],
  ],
  clientModules: [require.resolve('./loader.js')],
}

module.exports = config
