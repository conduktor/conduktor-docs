const redirects = [
  '@docusaurus/plugin-client-redirects',
  {
    redirects: [
      {
        from: '/platform/navigation/console/conduktor-sql/',
        to: '/guide'
      },
      {
        from: '/learn-apache-kafka-with-conduktor',
        to: '/guide',
      },
      {
        from: '/features/brokers-management',
        to: '/guide',
      },
      {
        from: '/features/consumer-groups-management',
        to: '/guide',
      },
      {
        from: '/features/consuming-data',
        to: '/guide',
      },
      {
        from: '/features/kafka-access-control-list-acl',
        to: '/guide',
      },
      {
        from: '/features/kafka-connect',
        to: '/guide',
      },
      {
        from: '/features/kafka-streams',
        to: '/guide',
      },
      {
        from: '/features/ksqldb',
        to: '/guide',
      },
      {
        from: '/features/monitoring',
        to: '/guide',
      },
      {
        from: '/features/producing-data',
        to: '/guide',
      },
      {
        from: '/features/schema-registry-management',
        to: '/guide',
      },
      {
        from: '/features/topics-management',
        to: '/guide',
      },
      {
        from: '/kafka-cluster-connection/import-export-configurations',
        to: '/guide',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka',
        to: '/guide',
      },
      {
        from: '/kafka-cluster-connection/starting-a-local-kafka-cluster-in-seconds',
        to: '/guide',
      },
      {
        from: '/misc/configuring-conduktor',
        to: '/guide',
      },
      {
        from: '/misc/data-security',
        to: '/guide',
      },
      {
        from: '/misc/faq',
        to: '/guide',
      },
      {
        from: '/misc/internet-troubleshooting',
        to: '/guide',
      },
      {
        from: '/portal/account-management',
        to: '/guide',
      },
      {
        from: '/sign-in-section/install',
        to: '/guide',
      },
      {
        from: '/sign-in-section/licenses-and-activations',
        to: '/guide',
      },
      {
        from: '/sign-in-section/login-troubleshooting',
        to: '/guide',
      },
      {
        from: '/sign-in-section/sign-in',
        to: '/guide',
      },
      {
        from: '/features/consuming-data/advanced-consumer',
        to: '/guide',
      },
      {
        from: '/features/consuming-data/custom-deserializers',
        to: '/guide',
      },
      {
        from: '/features/consuming-data/filtering-and-projecting-data',
        to: '/guide',
      },
      {
        from: '/features/consuming-data/pick-your-format-wisely',
        to: '/guide',
      },
      {
        from: '/features/kafka-access-control-list-acl/acls-advanced-insights',
        to: '/guide',
      },
      {
        from: '/features/kafka-connect/features',
        to: '/guide',
      },
      {
        from: '/features/kafka-connect/how-to-start-with-confluent-cloud-kafka-connect',
        to: '/guide',
      },
      {
        from: '/features/kafka-connect/security',
        to: '/guide',
      },
      {
        from: '/features/ksqldb/connect-conduktor-to-ksqldb-clusters',
        to: '/guide',
      },
      {
        from: '/features/ksqldb/how-to-query-with-ksqldb',
        to: '/guide',
      },
      {
        from: '/features/ksqldb/how-to-start-with-confluent-cloud-ksqldb',
        to: '/guide',
      },
      {
        from: '/features/ksqldb/ksqldb-faq',
        to: '/guide',
      },
      {
        from: '/features/ksqldb/what-to-do-with-ksqldb',
        to: '/guide',
      },
      {
        from: '/features/producing-data/produce-random-data',
        to: '/guide',
      },
      {
        from: '/features/schema-registry-management/avro-tools',
        to: '/guide',
      },
      {
        from: '/features/schema-registry-management/schema-compatibilities',
        to: '/guide',
      },
      {
        from: '/features/topics-management/how-to',
        to: '/guide',
      },
      {
        from: '/features/topics-management/smart-groups',
        to: '/guide',
      },
      {
        from: '/features/topics-management/topic-details',
        to: '/guide',
      },
      {
        from: '/kafka-cluster-connection/import-export-configurations/github-enterprise',
        to: '/guide',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/apache-kafka-wire-compatible-solutions',
        to: '/guide',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/connect-to-amazon-msk',
        to: '/guide',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/connecting-to-a-secure-kafka',
        to: '/guide',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/connecting-to-kafka-running-on-windows-wsl-2',
        to: '/guide',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/connecting-to-kafka-running-under-docker',
        to: '/guide',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/impossible-connection-setups',
        to: '/guide',
      },
      {
        from: '/portal/account-management/managing-permissions-rbac',
        to: '/guide',
      },
      {
        from: '/sign-in-section/install/linux',
        to: '/guide',
      },
      {
        from: '/sign-in-section/install/mac',
        to: '/guide',
      },
      {
        from: '/sign-in-section/install/update',
        to: '/guide',
      },
      {
        from: '/sign-in-section/install/windows',
        to: '/guide',
      },
      {
        from: '/sign-in-section/licenses-and-activations/offline-licenses',
        to: '/guide',
      },
      {
        from: '/sign-in-section/login-troubleshooting/certificates-faq',
        to: '/guide',
      },
      {
        from: '/sign-in-section/login-troubleshooting/internet-proxy',
        to: '/guide',
      },
      {
        from: '/sign-in-section/sign-in/single-sign-on',
        to: '/guide',
      },
      {
        from: '/features/consuming-data/custom-deserializers/aws-glue-schema-registry',
        to: '/guide',
      },
      {
        from: '/features/consuming-data/custom-deserializers/redhat-apicurio-schema-registry',
        to: '/guide',
      },
      {
        from: '/platform/proxy/features',
        to: '/guide',
      },
      {
        from: '/platform/proxy',
        to: '/guide',
      },
      {
        from: '/platform/proxy/configuration/env-variables',
        to: '/guide',
      },
      {
        from: '/gateway/category/interceptors-catalog/',
        to: '/guide',
      },
      {
        from: '/platform/admin/managing-clusters',
        to: '/guide',
      },
      {
        from: '/platform/configuration',
        to: '/guide',
      },
      {
        from: '/platform/installation',
        to: '/guide',
      },
      {
        from: '/platform/configuration/introduction/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/env-variables/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/configuration-snippets/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/cortex/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/database/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/http-proxy-configuration',
        to: '/guide',
      },
      {
        from: '/platform/configuration/https-configuration/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/ssl-tls-configuration/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/memory-configuration/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/user-authentication/configure-sso/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/user-authentication/local-admin-and-users/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/user-authentication/external-group-sync/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/user-authentication/session-lifetime/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/ldap/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/ldaps',
        to: '/guide',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/generic-oauth2/',
        to: '/guide/',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/azure/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/google/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/amazon-cognito/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/keycloak/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/okta/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/auth0/',
        to: '/guide',
      },
      {
        from: '/platform/configuration/api-overview/',
        to: '/guide',
      },
      {
        from: '/platform/installation/get-started/docker/',
        to: '/guide',
      },
      {
        from: '/platform/installation/get-started/kubernetes/',
        to: '/guide',
      },
      {
        from: '/platform/installation/get-started/aws/',
        to: '/guide',
      },
      {
        from: '/platform/get-started/installation/get-started/AWS_Marketplace/',
        to: '/guide',
      },
      {
        from: '/platform/installation/license-management/',
        to: '/guide',
      },
      {
        from: '/platform/installation/hardware/',
        to: '/guide',
      },
      {
        from: '/platform/installation/Upgrades/',
        to: '/guide/',
      },
      {
        from: '/platform/admin/rbac/',
        to: '/guide',
      },
      {
        from: '/platform/installation/get-started/docker-compose/',
        to: '/guide',
      },
      {
        from: '/platform/navigation/self-serve/getting-started/',
        to: '/guide',
      },
      {
        from: '/platform/get-started/support/data-security/',
        to: '/guide'
      },
      {
        from: '/platform/get-started/installation/get-started/CloudFormation/',
        to: '/guide'
      }
    ],
  },
]

exports.redirects = redirects
