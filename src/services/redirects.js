const redirects = [
  '@docusaurus/plugin-client-redirects',
  {
    redirects: [
      {
        from: '/platform/navigation/console/conduktor-sql/',
        to: '/guides'
      },
      {
        from: '/learn-apache-kafka-with-conduktor',
        to: '/guides',
      },
      {
        from: '/features/brokers-management',
        to: '/guides',
      },
      {
        from: '/features/consumer-groups-management',
        to: '/guides',
      },
      {
        from: '/features/consuming-data',
        to: '/guides',
      },
      {
        from: '/features/kafka-access-control-list-acl',
        to: '/guides',
      },
      {
        from: '/features/kafka-connect',
        to: '/guides',
      },
      {
        from: '/features/kafka-streams',
        to: '/guides',
      },
      {
        from: '/features/ksqldb',
        to: '/guides',
      },
      {
        from: '/features/monitoring',
        to: '/guides',
      },
      {
        from: '/features/producing-data',
        to: '/guides',
      },
      {
        from: '/features/schema-registry-management',
        to: '/guides',
      },
      {
        from: '/features/topics-management',
        to: '/guides',
      },
      {
        from: '/kafka-cluster-connection/import-export-configurations',
        to: '/guides',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka',
        to: '/guides',
      },
      {
        from: '/kafka-cluster-connection/starting-a-local-kafka-cluster-in-seconds',
        to: '/guides',
      },
      {
        from: '/misc/configuring-conduktor',
        to: '/guides',
      },
      {
        from: '/misc/data-security',
        to: '/guides',
      },
      {
        from: '/misc/faq',
        to: '/guides',
      },
      {
        from: '/misc/internet-troubleshooting',
        to: '/guides',
      },
      {
        from: '/portal/account-management',
        to: '/guides',
      },
      {
        from: '/sign-in-section/install',
        to: '/guides',
      },
      {
        from: '/sign-in-section/licenses-and-activations',
        to: '/guides',
      },
      {
        from: '/sign-in-section/login-troubleshooting',
        to: '/guides',
      },
      {
        from: '/sign-in-section/sign-in',
        to: '/guides',
      },
      {
        from: '/features/consuming-data/advanced-consumer',
        to: '/guides',
      },
      {
        from: '/features/consuming-data/custom-deserializers',
        to: '/guides',
      },
      {
        from: '/features/consuming-data/filtering-and-projecting-data',
        to: '/guides',
      },
      {
        from: '/features/consuming-data/pick-your-format-wisely',
        to: '/guides',
      },
      {
        from: '/features/kafka-access-control-list-acl/acls-advanced-insights',
        to: '/guides',
      },
      {
        from: '/features/kafka-connect/features',
        to: '/guides',
      },
      {
        from: '/features/kafka-connect/how-to-start-with-confluent-cloud-kafka-connect',
        to: '/guides',
      },
      {
        from: '/features/kafka-connect/security',
        to: '/guides',
      },
      {
        from: '/features/ksqldb/connect-conduktor-to-ksqldb-clusters',
        to: '/guides',
      },
      {
        from: '/features/ksqldb/how-to-query-with-ksqldb',
        to: '/guides',
      },
      {
        from: '/features/ksqldb/how-to-start-with-confluent-cloud-ksqldb',
        to: '/guides',
      },
      {
        from: '/features/ksqldb/ksqldb-faq',
        to: '/guides',
      },
      {
        from: '/features/ksqldb/what-to-do-with-ksqldb',
        to: '/guides',
      },
      {
        from: '/features/producing-data/produce-random-data',
        to: '/guides',
      },
      {
        from: '/features/schema-registry-management/avro-tools',
        to: '/guides',
      },
      {
        from: '/features/schema-registry-management/schema-compatibilities',
        to: '/guides',
      },
      {
        from: '/features/topics-management/how-to',
        to: '/guides',
      },
      {
        from: '/features/topics-management/smart-groups',
        to: '/guides',
      },
      {
        from: '/features/topics-management/topic-details',
        to: '/guides',
      },
      {
        from: '/kafka-cluster-connection/import-export-configurations/github-enterprise',
        to: '/guides',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/apache-kafka-wire-compatible-solutions',
        to: '/guides',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/connect-to-amazon-msk',
        to: '/guides',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/connecting-to-a-secure-kafka',
        to: '/guides',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/connecting-to-kafka-running-on-windows-wsl-2',
        to: '/guides',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/connecting-to-kafka-running-under-docker',
        to: '/guides',
      },
      {
        from: '/kafka-cluster-connection/setting-up-a-connection-to-kafka/impossible-connection-setups',
        to: '/guides',
      },
      {
        from: '/portal/account-management/managing-permissions-rbac',
        to: '/guides',
      },
      {
        from: '/sign-in-section/install/linux',
        to: '/guides',
      },
      {
        from: '/sign-in-section/install/mac',
        to: '/guides',
      },
      {
        from: '/sign-in-section/install/update',
        to: '/guides',
      },
      {
        from: '/sign-in-section/install/windows',
        to: '/guides',
      },
      {
        from: '/sign-in-section/licenses-and-activations/offline-licenses',
        to: '/guides',
      },
      {
        from: '/sign-in-section/login-troubleshooting/certificates-faq',
        to: '/guides',
      },
      {
        from: '/sign-in-section/login-troubleshooting/internet-proxy',
        to: '/guides',
      },
      {
        from: '/sign-in-section/sign-in/single-sign-on',
        to: '/guides',
      },
      {
        from: '/features/consuming-data/custom-deserializers/aws-glue-schema-registry',
        to: '/guides',
      },
      {
        from: '/features/consuming-data/custom-deserializers/redhat-apicurio-schema-registry',
        to: '/guides',
      },
      {
        from: '/platform/proxy/features',
        to: '/guides',
      },
      {
        from: '/platform/proxy',
        to: '/guides',
      },
      {
        from: '/platform/proxy/configuration/env-variables',
        to: '/guides',
      },
      {
        from: '/gateway/category/interceptors-catalog/',
        to: '/guides',
      },
      {
        from: '/platform/admin/managing-clusters',
        to: '/guides',
      },
      {
        from: '/platform/configuration',
        to: '/guides',
      },
      {
        from: '/platform/installation',
        to: '/guides',
      },
      {
        from: '/platform/configuration/introduction/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/env-variables/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/configuration-snippets/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/cortex/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/database/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/http-proxy-configuration',
        to: '/guides',
      },
      {
        from: '/platform/configuration/https-configuration/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/ssl-tls-configuration/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/memory-configuration/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/user-authentication/configure-sso/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/user-authentication/local-admin-and-users/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/user-authentication/external-group-sync/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/user-authentication/session-lifetime/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/ldap/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/ldaps',
        to: '/guides',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/generic-oauth2/',
        to: '/guides/',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/azure/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/google/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/amazon-cognito/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/keycloak/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/okta/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/auth0/',
        to: '/guides',
      },
      {
        from: '/platform/configuration/api-overview/',
        to: '/guides',
      },
      {
        from: '/platform/installation/get-started/docker/',
        to: '/guides',
      },
      {
        from: '/platform/installation/get-started/kubernetes/',
        to: '/guides',
      },
      {
        from: '/platform/installation/get-started/aws/',
        to: '/guides',
      },
      {
        from: '/platform/get-started/installation/get-started/AWS_Marketplace/',
        to: '/guides',
      },
      {
        from: '/platform/installation/license-management/',
        to: '/guides',
      },
      {
        from: '/platform/installation/hardware/',
        to: '/guides',
      },
      {
        from: '/platform/installation/Upgrades/',
        to: '/guides/',
      },
      {
        from: '/platform/admin/rbac/',
        to: '/guides',
      },
      {
        from: '/platform/installation/get-started/docker-compose/',
        to: '/guides',
      },
      {
        from: '/platform/navigation/self-serve/getting-started/',
        to: '/guides',
      },
      {
        from: '/platform/get-started/support/data-security/',
        to: '/guides'
      },
      {
        from: '/platform/get-started/installation/get-started/CloudFormation/',
        to: '/guides'
      }
    ],
  },
]

exports.redirects = redirects
