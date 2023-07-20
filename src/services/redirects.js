const redirects = [
  '@docusaurus/plugin-client-redirects',
  {
    redirects: [
      {
        from: '/learn-apache-kafka-with-conduktor',
        to: '/desktop/learn-apache-kafka-with-conduktor',
      },
      {
        from: '/features/brokers-management',
        to: '/desktop/features/brokers-management',
      },
      {
        from: '/features/consumer-groups-management',
        to: '/desktop/features/consumer-groups-management',
      },
      {
        from: '/features/consuming-data',
        to: '/desktop/features/consuming-data',
      },
      {
        from: '/features/kafka-access-control-list-acl',
        to: '/desktop/features/kafka-access-control-list-acl',
      },
      {
        from: '/features/kafka-connect',
        to: '/desktop/features/kafka-connect',
      },
      {
        from: '/features/kafka-streams',
        to: '/desktop/features/kafka-streams',
      },
      {
        from: '/features/ksqldb',
        to: '/desktop/features/ksqldb',
      },
      {
        from: '/features/monitoring',
        to: '/desktop/features/monitoring',
      },
      {
        from: '/features/producing-data',
        to: '/desktop/features/producing-data',
      },
      {
        from: '/features/schema-registry-management',
        to: '/desktop/features/schema-registry-management',
      },
      {
        from: '/features/topics-management',
        to: '/desktop/features/topics-management',
      },
      {
        from: '/kafka-cluster-connection/import-export-configurations',
        to: '/desktop/kafka-cluster-connection/import-export',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka',
        to: '/desktop/kafka-cluster-connection/setting-up-a-connection-to-kafka',
      },
      {
        from: '/kafka-cluster-connection/starting-a-local-kafka-cluster-in-seconds',
        to: '/desktop/kafka-cluster-connection/starting-a-local-kafka-cluster-in-seconds',
      },
      {
        from: '/misc/configuring-conduktor',
        to: '/desktop/miscellaneous/configuring-conduktor',
      },
      {
        from: '/misc/data-security',
        to: '/desktop/miscellaneous/data-security',
      },
      {
        from: '/misc/faq',
        to: '/desktop/miscellaneous/faq',
      },
      {
        from: '/misc/internet-troubleshooting',
        to: '/desktop/miscellaneous/internet-troubleshooting',
      },
      {
        from: '/portal/account-management',
        to: '/desktop/account-management',
      },
      {
        from: '/sign-in-section/install',
        to: '/desktop/conduktor-first-steps/install',
      },
      {
        from: '/sign-in-section/licenses-and-activations',
        to: '/desktop/conduktor-first-steps/licenses-and-activations',
      },
      {
        from: '/sign-in-section/login-troubleshooting',
        to: '/desktop/conduktor-first-steps/login-troubleshooting',
      },
      {
        from: '/sign-in-section/sign-in',
        to: '/desktop/conduktor-first-steps/sign-in',
      },
      {
        from: '/features/consuming-data/advanced-consumer',
        to: '/desktop/features/consuming-data/advanced-consumer',
      },
      {
        from: '/features/consuming-data/custom-deserializers',
        to: '/desktop/features/consuming-data/custom-deserializers',
      },
      {
        from: '/features/consuming-data/filtering-and-projecting-data',
        to: '/desktop/features/consuming-data/filtering-and-projecting-data',
      },
      {
        from: '/features/consuming-data/pick-your-format-wisely',
        to: '/desktop/features/consuming-data/pick-your-format-wisely',
      },
      {
        from: '/features/kafka-access-control-list-acl/acls-advanced-insights',
        to: '/desktop/features/kafka-access-control-list-acl/acls-advanced-insights',
      },
      {
        from: '/features/kafka-connect/features',
        to: '/desktop/features/kafka-connect/features',
      },
      {
        from: '/features/kafka-connect/how-to-start-with-confluent-cloud-kafka-connect',
        to: '/desktop/features/kafka-connect/how-to-start-with-confluent-cloud-kafka-connect',
      },
      {
        from: '/features/kafka-connect/security',
        to: '/desktop/features/kafka-connect/security',
      },
      {
        from: '/features/ksqldb/connect-conduktor-to-ksqldb-clusters',
        to: '/desktop/features/ksqldb/connect-conduktor-to-ksqldb-clusters',
      },
      {
        from: '/features/ksqldb/how-to-query-with-ksqldb',
        to: '/desktop/features/ksqldb/how-to-query-with-ksqldb',
      },
      {
        from: '/features/ksqldb/how-to-start-with-confluent-cloud-ksqldb',
        to: '/desktop/features/ksqldb/how-to-start-with-confluent-cloud-ksqldb',
      },
      {
        from: '/features/ksqldb/ksqldb-faq',
        to: '/desktop/features/ksqldb/ksqldb-faq',
      },
      {
        from: '/features/ksqldb/what-to-do-with-ksqldb',
        to: '/desktop/features/ksqldb/what-to-do-with-ksqldb',
      },
      {
        from: '/features/producing-data/produce-random-data',
        to: '/desktop/features/producing-data/produce-random-data',
      },
      {
        from: '/features/schema-registry-management/avro-tools',
        to: '/desktop/features/schema-registry-management/avro-tools',
      },
      {
        from: '/features/schema-registry-management/schema-compatibilities',
        to: '/desktop/features/schema-registry-management/schema-compatibilities',
      },
      {
        from: '/features/topics-management/how-to',
        to: '/desktop/features/topics-management/how-to',
      },
      {
        from: '/features/topics-management/smart-groups',
        to: '/desktop/features/topics-management/smart-groups',
      },
      {
        from: '/features/topics-management/topic-details',
        to: '/desktop/features/topics-management/topic-details',
      },
      {
        from: '/kafka-cluster-connection/import-export-configurations/github-enterprise',
        to: '/desktop/kafka-cluster-connection/import-export/github-enterprise',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/apache-kafka-wire-compatible-solutions',
        to: '/desktop/kafka-cluster-connection/setting-up-a-connection-to-kafka/apache-kafka-wire-compatible-solutions',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/connect-to-amazon-msk',
        to: '/desktop/kafka-cluster-connection/setting-up-a-connection-to-kafka/connect-to-amazon-msk',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/connecting-to-a-secure-kafka',
        to: '/desktop/kafka-cluster-connection/setting-up-a-connection-to-kafka/connecting-to-a-secure-kafka',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/connecting-to-kafka-running-on-windows-wsl-2',
        to: '/desktop/kafka-cluster-connection/setting-up-a-connection-to-kafka/connecting-to-kafka-running-on-windows-wsl-2',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/connecting-to-kafka-running-under-docker',
        to: '/desktop/kafka-cluster-connection/setting-up-a-connection-to-kafka/connecting-to-kafka-running-under-docker',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/impossible-connection-setups',
        to: '/desktop/kafka-cluster-connection/setting-up-a-connection-to-kafka/impossible-connection-setups',
      },
      {
        from: '/portal/account-management/managing-permissions-rbac',
        to: '/desktop/account-management/managing-permissions-rbac',
      },
      {
        from: '/sign-in-section/install/linux',
        to: '/desktop/conduktor-first-steps/install/linux',
      },
      {
        from: '/sign-in-section/install/mac',
        to: '/desktop/conduktor-first-steps/install/mac',
      },
      {
        from: '/sign-in-section/install/update',
        to: '/desktop/conduktor-first-steps/install/update',
      },
      {
        from: '/sign-in-section/install/windows',
        to: '/desktop/conduktor-first-steps/install/windows',
      },
      {
        from: '/sign-in-section/licenses-and-activations/offline-licenses',
        to: '/desktop/conduktor-first-steps/licenses-and-activations/offline-licenses',
      },
      {
        from: '/sign-in-section/login-troubleshooting/certificates-faq',
        to: '/desktop/conduktor-first-steps/login-troubleshooting/certificates-faq',
      },
      {
        from: '/sign-in-section/login-troubleshooting/internet-proxy',
        to: '/desktop/conduktor-first-steps/login-troubleshooting/internet-proxy',
      },
      {
        from: '/sign-in-section/sign-in/single-sign-on',
        to: '/desktop/conduktor-first-steps/sign-in/single-sign-on',
      },
      {
        from: '/features/consuming-data/custom-deserializers/aws-glue-schema-registry',
        to: '/desktop/features/consuming-data/custom-deserializers/aws-glue-schema-registry',
      },
      {
        from: '/features/consuming-data/custom-deserializers/redhat-apicurio-schema-registry',
        to: '/desktop/features/consuming-data/custom-deserializers/redhat-apicurio-schema-registry',
      },
      {
        from: '/platform/proxy/features',
        to: '/gateway',
      },
      {
        from: '/platform/proxy',
        to: '/gateway',
      },
      {
        from: '/platform/proxy/configuration/proxy_security',
        to: '/gateway/configuration/enterprise_proxy_security',
      },
      {
        from: '/platform/proxy/configuration/env-variables',
        to: '/gateway/configuration/env-variables',
      },
      {
        from: '/platform/proxy/installation/installation',
        to: '/gateway/installation/enterprise-install',
      }
    ],
  },
]

exports.redirects = redirects
