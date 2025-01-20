export const products = [
  {
    title: 'Scale',
    description: 'Scale your stuff',
    items: [
      [ 'Configuration', '/platform/get-started/configuration/env-variables', '/assets/svgs/guides/configuration.svg' ],
      [ 'RBAC', '/platform/navigation/settings/rbac' ],
      [ 'Self-service Quickstart', 'https://docs.conduktor.io/platform/guides/self-service-quickstart/' ],
      [ 'Kafka Resource Management', 'https://docs.conduktor.io/platform/navigation/console/' ],
      [ 'Monitoring & Alerting', 'https://docs.conduktor.io/platform/navigation/monitoring/' ],
      [ 'Traffic Control Policies', 'https://docs.conduktor.io/gateway/category/traffic-control-policies/' ],
    ]    
  },
  {
    title: 'Shield',
    icon: '/assets/svgs/guides/shield.svg',
    description: 'Shield your stuff',
    items: [
      [ 'Encryption', 'https://docs.conduktor.io/gateway/category/encryption/' ],
      [ 'Audit', 'https://docs.conduktor.io/gateway/interceptors/data-security/audit/' ],
      [ 'Data Masking', 'https://docs.conduktor.io/gateway/interceptors/data-security/data-masking/' ],
      [ 'Dynamic Header Injection', 'https://docs.conduktor.io/gateway/interceptors/data-security/dynamic-header-injection/' ],
    ]
  },
  {
    title: 'Exchange',
    icon: '/assets/svgs/guides/exchange.svg',
    description: 'Exchange your stuff',
    items: [
      [ 'Third-Party Data Sharing', 'https://docs.conduktor.io/platform/data-sharing' ],
      [ 'Partner Zones', 'https://docs.conduktor.io/platform/concepts/partner-zones/' ]
    ]
  },
]

