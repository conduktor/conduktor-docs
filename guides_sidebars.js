// guides_sidebars.js
module.exports = {
  guidesSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Overview',
    },
    {
      type: 'doc',
      id: 'get-started',
      label: 'Get started',
    },
    {
      type: 'category',
      label: 'Conduktor in production',
      link: { type: 'doc', id: 'conduktor-in-production/index' },
      items: [
        'conduktor-in-production/requirements',
    {
      type: 'category',
      label: 'Deploy artifacts',
      link: { type: 'doc', id: 'conduktor-in-production/deploy-artifacts/index' },
      items: [
        {
          type: 'category',
          label: 'Deploy Gateway',
          link: { type: 'doc', id: 'conduktor-in-production/deploy-artifacts/deploy-gateway/index' },
          items: [
            'conduktor-in-production/deploy-artifacts/deploy-gateway/kubernetes',
            'conduktor-in-production/deploy-artifacts/deploy-gateway/env-variables',
          ],
        },
        {
          type: 'category',
          label: 'Deploy Console',
          link: { type: 'doc', id: 'conduktor-in-production/deploy-artifacts/deploy-console/index' },
          items: [
            'conduktor-in-production/deploy-artifacts/deploy-console/kubernetes',
            'conduktor-in-production/deploy-artifacts/deploy-console/env-variables',
            'conduktor-in-production/deploy-artifacts/deploy-console/sample-config',
          ],
        },
        'conduktor-in-production/deploy-artifacts/deploy-cortex',
      ],
    },
        'conduktor-in-production/monitor/index',
        'conduktor-in-production/manage-licenses/index',
        {
          type: 'category',
          label: 'Automate',
          link: { type: 'doc', id: 'conduktor-in-production/automate/index' },
          items: [
            'conduktor-in-production/automate/api-automation',
            'conduktor-in-production/automate/cli-automation',
            'conduktor-in-production/automate/terraform-automation',
          ],
        },
        {
          type: 'category',
          label: 'Admin',
          link: { type: 'doc', id: 'conduktor-in-production/admin/index' },
          items: [
            'conduktor-in-production/admin/configure-clusters',
          {
            type: 'category',
            label: 'User access',
            link: { type: 'doc', id: 'conduktor-in-production/admin/user-access/index' },
            items: [
              'conduktor-in-production/admin/user-access/configure-sso',
              'conduktor-in-production/admin/user-access/map-external-groups',
              'conduktor-in-production/admin/user-access/local-admin-users',
              'conduktor-in-production/admin/user-access/session-lifetime',
              'conduktor-in-production/admin/user-access/delegated-jwt-auth',                        
            ],
          },
            'conduktor-in-production/admin/set-up-rbac',
            'conduktor-in-production/admin/audit-logs',
            'conduktor-in-production/admin/gw-policies',  
            'conduktor-in-production/admin/data-mask',                
          ],
        },
      ],
    },  
    // Non-clickable section - Concepts
    {
      type: 'html',
      value: '<span class="sidebar-heading">Concepts</span>',
      className: 'sidebar-section-heading',
    },
    {
      type: 'category',
      label: 'Conduktor concepts',
      link: { type: 'doc', id: 'conduktor-concepts/index' },
      items: [
        'conduktor-concepts/chargeback',
        'conduktor-concepts/gw-authen-author',
        'conduktor-concepts/gw-service-accounts',
        'conduktor-concepts/indexing',
        'conduktor-concepts/interceptors',
        'conduktor-concepts/logical-topics',
        'conduktor-concepts/partner-zones',
        'conduktor-concepts/self-service',
        'conduktor-concepts/traffic-control-policies',
        'conduktor-concepts/virtual-clusters',
      ],
    },

    // Non-clickable section - Use cases
    {
      type: 'html',
      value: '<span class="sidebar-heading">Use cases</span>',
      className: 'sidebar-section-heading',
    },
    {
      type: 'category',
      label: 'Apply Chargeback',
      link: { type: 'doc', id: 'use-cases/chargeback/index' },
      items: [],
    },
    {
      type: 'category',
      label: 'Use Self-service',
      link: { type: 'doc', id: 'use-cases/self-service/index' },
      items: [],
    },
    {
      type: 'category',
      label: 'Encrypt Kafka data',
      link: { type: 'doc', id: 'use-cases/encrypt-kafka/index' },
      items: [],
    },
    {
      type: 'category',
      label: 'Share data externally',
      link: { type: 'doc', id: 'use-cases/third-party-data/index' },
      items: [],
    },
        {
      type: 'category',
      label: 'Enforce data quality',
      link: { type: 'doc', id: 'use-cases/enforce-data-quality/index' },
      items: [],
    },
    {
      type: 'category',
      label: 'Perform chaos testing',
      link: { type: 'doc', id: 'use-cases/chaos-testing/index' },
      items: [],
    },
    {
      type: 'category',
      label: 'Apply Traffic Control Policies',
      link: { type: 'doc', id: 'use-cases/apply-traffic-control-policies/index' },
      items: [],
    },
    {
      type: 'category',
      label: 'Manage large messages',
      link: { type: 'doc', id: 'use-cases/manage-large-messages/index' },
      items: [],
    },
    {
      type: 'category',
      label: 'Cache data',
      link: { type: 'doc', id: 'use-cases/cache-data/index' },
      items: [],
    },

    {
      type: 'category',
      label: 'Monitor brokers and apps',
      link: { type: 'doc', id: 'monitor-brokers-apps/index' },
      items: [
        'monitor-brokers-apps/monitor-metrics',
        'monitor-brokers-apps/alerts',
      ],
    },      

    {
      type: 'category',
      label: 'Manage Kafka',
      link: { type: 'doc', id: 'manage-kafka/index' },
      items: [
        {
          type: 'category',
          label: 'Kafka resources',
          
          items: [
            {
              type: 'autogenerated',
              dirName: 'manage-kafka/kafka-resources',
            },
          ],
        },
      ],
    },


    // Non-clickable section - Tutorials
    {
      type: 'html',
      value: '<span class="sidebar-heading">Tutorials</span>',
      className: 'sidebar-section-heading',
    },
    {
      type: 'category',
      label: 'Conduktor tutorials',
      link: { type: 'doc', id: 'tutorials/index' },
      items: [
        'tutorials/self-service-start',
        'tutorials/sni-routing',
        'tutorials/configure-chargeback',
        'tutorials/configure-audit-log-topic',
        'tutorials/reprocess',
        'tutorials/configure-sql',
        'tutorials/custom-deserializers',
        'tutorials/deploy-aws',
      ],
    }, 

    // Non-clickable section - Reference
    {
      type: 'html',
      value: '<span class="sidebar-heading">Reference</span>',
      className: 'sidebar-section-heading',
    },
    {
      type: 'category',
      label: 'Conduktor reference',
      link: { type: 'doc', id: 'reference/index' },
      items: [
        {
          type: 'autogenerated',
          dirName: 'reference',
        },
      ],
    },  

    // Non-clickable section - Support
    {
      type: 'html',
      value: '<span class="sidebar-heading">Support</span>',
      className: 'sidebar-section-heading',
    },
    {
      type: 'category',
      label: 'Support options',
      link: { type: 'doc', id: 'support/index' },
      items: [
        'support/upgrade', 
        'support/version-matrix' 
      ],
    },  
  ],
};