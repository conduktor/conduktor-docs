// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')
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
    [
      '@docusaurus/preset-classic',
      {
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          filename: 'sitemap.xml',
          noIndex: false,
          trailingSlash: true,
        },
      },
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
                html: `<a href="/platform/topic-service">Topic as a Service</a>`,
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
                label: 'Changelog',
                href: 'https://www.conduktor.io/changelog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/conduktor',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/gzTrmjdXdA',
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
  ],
}

module.exports = config
