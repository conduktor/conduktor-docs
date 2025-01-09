const redirects = [
  '@docusaurus/plugin-client-redirects',
  {
    redirects: [
      {
        from: '/platform/navigation/console/conduktor-sql/',
        to: '/platform/guides/configure-sql/'
      },
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
        from: '/platform/proxy/configuration/env-variables',
        to: '/gateway/configuration/env-variables',
      },
      {
        from: '/gateway/category/interceptors-catalog/',
        to: '/gateway/category/interceptor-catalog/',
      },
      {
        from: '/platform/admin/managing-clusters',
        to: '/platform/navigation/settings/managing-clusters',
      },
      {
        from: '/platform/configuration',
        to: '/platform/category/configuration/',
      },
      {
        from: '/platform/installation',
        to: '/platform/category/installation/',
      },
      {
        from: '/platform/configuration/introduction/',
        to: '/platform/get-started/configuration/introduction/',
      },
      {
        from: '/platform/configuration/env-variables/',
        to: '/platform/get-started/configuration/env-variables/',
      },
      {
        from: '/platform/configuration/configuration-snippets/',
        to: '/platform/get-started/configuration/configuration-snippets/',
      },
      {
        from: '/platform/configuration/cortex/',
        to: '/platform/get-started/configuration/cortex/',
      },
      {
        from: '/platform/configuration/database/',
        to: '/platform/get-started/configuration/database/',
      },
      {
        from: '/platform/configuration/http-proxy-configuration',
        to: '/platform/get-started/configuration/http-proxy-configuration/',
      },
      {
        from: '/platform/configuration/https-configuration/',
        to: '/platform/get-started/configuration/https-configuration/',
      },
      {
        from: '/platform/configuration/ssl-tls-configuration/',
        to: '/platform/get-started/configuration/ssl-tls-configuration/',
      },
      {
        from: '/platform/configuration/memory-configuration/',
        to: '/platform/get-started/configuration/memory-configuration/',
      },
      {
        from: '/platform/configuration/user-authentication/configure-sso/',
        to: '/platform/category/configure-sso/',
      },
      {
        from: '/platform/configuration/user-authentication/local-admin-and-users/',
        to: '/platform/get-started/configuration/user-authentication/local-admin-and-users/',
      },
      {
        from: '/platform/configuration/user-authentication/external-group-sync/',
        to: '/platform/get-started/configuration/user-authentication/external-group-sync/',
      },
      {
        from: '/platform/configuration/user-authentication/session-lifetime/',
        to: '/platform/get-started/configuration/user-authentication/session-lifetime/',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/ldap/',
        to: '/platform/get-started/configuration/user-authentication/SSO/ldap/',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/ldaps',
        to: '/platform/get-started/configuration/user-authentication/SSO/ldaps',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/generic-oauth2/',
        to: '/platform/get-started/configuration/user-authentication/SSO/generic-oauth2/',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/azure/',
        to: '/platform/get-started/configuration/user-authentication/SSO/azure/',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/google/',
        to: '/platform/get-started/configuration/user-authentication/SSO/google/',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/amazon-cognito/',
        to: '/platform/get-started/configuration/user-authentication/SSO/amazon-cognito/',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/keycloak/',
        to: '/platform/get-started/configuration/user-authentication/SSO/keycloak/',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/okta/',
        to: '/platform/get-started/configuration/user-authentication/SSO/okta/',
      },
      {
        from: '/platform/configuration/user-authentication/SSO/auth0/',
        to: '/platform/get-started/configuration/user-authentication/SSO/auth0/',
      },
      {
        from: '/platform/configuration/api-overview/',
        to: '/platform/reference/api-reference/',
      },
      {
        from: '/platform/installation/get-started/docker/',
        to: '/platform/get-started/installation/get-started/docker/',
      },
      {
        from: '/platform/installation/get-started/kubernetes/',
        to: '/platform/get-started/installation/get-started/kubernetes/',
      },
      {
        from: '/platform/installation/get-started/aws/',
        to: '/platform/get-started/installation/get-started/AWS/',
      },
      {
        from: '/platform/get-started/installation/get-started/AWS_Marketplace/',
        to: '/platform/get-started/installation/get-started/aws-marketplace-and-cloudformation/',
      },
      {
        from: '/platform/installation/license-management/',
        to: '/platform/get-started/installation/license-management/',
      },
      {
        from: '/platform/installation/hardware/',
        to: '/platform/get-started/installation/hardware/',
      },
      {
        from: '/platform/installation/Upgrades/',
        to: '/platform/get-started/installation/upgrading/',
      },
      {
        from: '/platform/admin/rbac/',
        to: '/platform/navigation/settings/rbac/',
      },
      {
        from: '/platform/installation/get-started/docker-compose/',
        to: '/platform/get-started/installation/get-started/docker/',
      },
      {
        from: '/platform/navigation/self-serve/getting-started/',
        to: '/platform/navigation/self-serve/',
      },
      {
        from: '/platform/get-started/support/data-security/',
        to: '/platform/get-started/support/data-privacy/'
      },
      {
        from: '/platform/get-started/installation/get-started/CloudFormation/',
        to: '/platform/get-started/installation/get-started/aws-marketplace-and-cloudformation/'
      }
    ],
  },
]

exports.redirects = redirects
