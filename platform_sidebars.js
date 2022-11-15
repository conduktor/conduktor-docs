// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  platformSidebar: [
    'index',
    {
      type: 'category',
      label: 'Installation',
      items: [
        {
          type: 'autogenerated',
          dirName: 'installation',
        },
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      items: [
        {
          type: 'autogenerated',
          dirName: 'configuration',
        },
      ],
    },
    {
      type: 'html',
      value: '<hr />',
      defaultStyle: true,
    },
    {
      type: 'category',
      label: 'Console',
      className: 'console',
      items: [
        {
          type: 'autogenerated',
          dirName: 'console',
        },
      ],
    },
    {
      type: 'category',
      label: 'Testing',
      className: 'testing',
      items: [
        {
          type: 'autogenerated',
          dirName: 'testing',
        },
      ],
    },
    {
      type: 'category',
      label: 'Monitoring',
      className: 'monitoring',
      items: [
        {
          type: 'autogenerated',
          dirName: 'monitoring',
        },
      ],
    },
    {
      type: 'category',
      label: 'Data Masking',
      className: 'data-masking',
      items: [
        {
          type: 'autogenerated',
          dirName: 'data-masking',
        },
      ],
    },
    {
      type: 'doc',
      label: 'Topic Analyzer',
      className: 'topic-analyzer',
      id: 'topic-analyzer/index',
    },
    {
      type: 'doc',
      label: 'Topic as a Service',
      className: 'topic-service',
      id: 'topic-service/index',
    },
  ],
}

module.exports = sidebars
