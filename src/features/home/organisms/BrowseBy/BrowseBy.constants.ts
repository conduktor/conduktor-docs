export const products = [
  {
    title: 'Scale',
    icon: '/assets/svgs/guides/scale.svg',
    description: 'Scale your stuff',
    items: [
      [ 'Configuration', '/platform/get-started/configuration/env-variables' ],
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


export const useCases = [
  {
    title: 'Use Cases',
    icon: '/assets/svgs/guides/use-cases.svg',
    description: 'Use cases for Conduktor',
    items: [
      [ 'Configure SQL', 'https://docs.conduktor.io/platform/guides/configure-sql/' ],
      [ 'Configure Chargeback', 'https://docs.conduktor.io/platform/guides/configure-chargeback/' ],
      [ 'Configure Exportable Audit Log', 'https://docs.conduktor.io/platform/guides/configure-audit-log-topic/' ],
      [ 'Configure Custom Deserializers', 'https://docs.conduktor.io/platform/guides/custom-deserializers/' ],
      [ 'Configure SNI Routing', 'https://docs.conduktor.io/gateway/how-to/sni-routing/' ],
      [ 'Configure Failover', 'https://docs.conduktor.io/gateway/how-to/configuring-failover/' ],
    ]
  }
]
