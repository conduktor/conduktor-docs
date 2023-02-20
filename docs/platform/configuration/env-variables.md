---
sidebar_position: 2
title: Configuration Properties and Environment Variables
description: Starting from Conduktor Platform 1.2.0 input configuration fields can be provided using environment variables.
---

# Configuration Properties and Environment Variables

Jump to:

- [Docker Image Environment Variables](#docker-image-environment-variables)
- [Platform Properties Reference](#platform-properties-reference)

## Docker image environment variables

<!-- prettier-ignore -->
| ENV                               | Since Version | Until Version | Default Value                                                                          |                                                                                                                                                      | 
|-----------------------------------|---------------|---------------|----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`CDK_DEBUG`**                   | 1.0.0         | latest        | `false`                                                                                | Flag to enable platform debug logs. See [log configuration](../troubleshooting/logs-configuration.md) for mor details.                               |
| **`RUN_MODE`**                    | 1.0.2         | latest        | `nano`                                                                                 | Memory presets for the platform see [advanced settings](../installation/hardware.md)                                                                 |
| **`CDK_VOLUME_DIR`**              | 1.0.2         | latest        | `/var/conduktor`                                                                       | Volume directory where Conduktor platform store data **                                                                                              |
| **`CDK_IN_CONF_FILE`**            | 1.0.2         | latest        | [`/opt/conduktor/default-platform-config.yaml`](./introduction.md#configuration-file)) | Conduktor platform configuration file location **                                                                                                    |
| **`CDK_LISTENING_PORT`**          | 1.2.0         | latest        | `8080`                                                                                 | Platform listening port **                                                                                                                           |
| **`CDK_SSL_TRUSTSTORE_PATH`**     | 1.5.0         | latest        | None                                                                                   | Truststore file path used by platform kafka, SSO, S3, ... clients SSL/TLS verification                                                               |
| **`CDK_SSL_TRUSTSTORE_PASSWORD`** | 1.5.0         | latest        | None                                                                                   | Truststore password (optional)                                                                                                                       |
| **`CDK_SSL_TRUSTSTORE_TYPE`**     | 1.5.0         | latest        | `jks`                                                                                  | Truststore type (optional)                                                                                                                           |
| **`CDK_SSL_DEBUG`**               | 1.9.0         | latest        | `false`                                                                                | Enable SSL/TLS debug logs                                                                                                                            |
| **`CDK_HTTP_PROXY_HOST`**         | 1.10.0        | latest        | None                                                                                   | Specify [proxy settings](./http-proxy-configuration.md) that Conduktor Platform should use to access the Internet                                    |
| **`CDK_HTTP_PROXY_PORT`**         | 1.10.0        | latest        | `80`                                                                                   | Specify [proxy settings](./http-proxy-configuration.md) that Conduktor Platform should use to access the Internet                                    |
| **`CDK_HTTP_NON_PROXY_HOSTS`**    | 1.10.0        | latest        | None                                                                                   | Specify [proxy settings](./http-proxy-configuration.md) that Conduktor Platform should use to access the Internet                                    |
| **`CDK_HTTP_PROXY_USERNAME`**     | 1.10.0        | latest        | None                                                                                   | Specify [proxy settings](./http-proxy-configuration.md) that Conduktor Platform should use to access the Internet                                    |
| **`CDK_HTTP_PROXY_PASSWORD`**     | 1.10.0        | latest        | None                                                                                   | Specify [proxy settings](./http-proxy-configuration.md) that Conduktor Platform should use to access the Internet                                    |
| **`CDK_GLOBAL_JAVA_OPTS`**        | 1.10.0        | latest        | None                                                                                   | Custom JAVA_OPTS parameters passed to platform modules.                                                                                              |
| **`CDK_ROOT_LOG_LEVEL`**          | 1.11.0        | latest        | `INFO`                                                                                 | Set the platform global log level (DEBUG, INFO, WARN, ERROR). See [log configuration](../troubleshooting/logs-configuration.md) for mor details.     |
| **`CDK_ROOT_LOG_COLOR`**          | 1.11.0        | latest        | `true`                                                                                 | Enable or disable ANSI colors in logs. See [log configuration](../troubleshooting/logs-configuration.md) for mor details.                            |
| **`CDK_ENABLE_PRODUCT_METRICS`**  | 1.12.0        | latest        | `true`                                                                                 | In order to improve Conduktor Platform, we collect anonymous usage metrics. Set to `false`, this configuration disable all of our metrics collection |

## Platform properties reference

Starting from Conduktor Platform `1.2.0` input configuration fields can be provided using environment variables.

Below shows the mapping of configuration fields in the `platform-config.yaml` to environment variables.

> **Note** : Lists start at index 0 and are provided using `_idx_` syntax.

#### Support of `*_FILE` environment variables

Since release `1.10.0`, setting an environment variable matching `*_FILE` to a file path, the prefixed environment variable will be overridden with the value specified in that file.

For example, setting `CDK_LICENSE_FILE` to `/run/secrets/license` will override `CDK_LICENSE` with the content of the file `/run/secrets/license`.

> Exception: `CDK_IN_CONF_FILE` is not supported

### Global properties

- **`organization.name`** : Your organizations name

  - _Env_ : **`CDK_ORGANIZATION_NAME`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : `"default"`

- **`license`** : Enterprise license key. If not provided, fallback to free plan.
  - _Env_ : **`CDK_LICENSE`** or **`LICENSE_KEY`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

> **Tips** : If you need more that what free plan offer, you can [contact us](https://www.conduktor.io/contact/sales) for a trial license.

- **`platform.fqdn`** : Platform FQDN.
  Could be useful for SSO callback URL when using a reverse proxy.
  The platform will try to guess it automatically using `X-Forwarded-Host` header coming from upstream reverse proxy.

  - _Env_ : **`CDK_PLATFORM_FQDN`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : `"localhost"`

- **`platform.https.cert.path`** : Path to the SSL `certificate` file.

  - _Env_ : **`CDK_PLATFORM_HTTPS_CERT_PATH`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

- **`platform.https.key.path`** : Path to the SSL `private key` file.
  - _Env_ : **`CDK_PLATFORM_HTTPS_KEY_PATH`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

- **`enable_product_metrics`** : In order to improve Conduktor Platform, we collect anonymous usage metrics. Set to `false`, this configuration disable all of our metrics collection
  - _Env_ : **`CDK_ENABLE_PRODUCT_METRICS`**
  - _Mandatory_ : false
  - _Type_ : boolean
  - _Default_ : `true`

### Database properties

See database configuration [documentation](./database) for more info

- **`database.url`** : External Postgresql configuration URL in format `[jdbc:]postgresql://[user[:password]@]netloc[:port][/dbname][?param1=value1&...]`.

  - _Env_ : **`CDK_DATABASE_URL`** (prior to `1.2.0` it was _`PLATFORM_DB_URL`_)
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

- **`database.host`** : External Postgresql server hostname

  - _Env_ : **`CDK_DATABASE_HOST`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

- **`database.port`** : External Postgresql server port

  - _Env_ : **`CDK_DATABASE_PORT`**
  - _Mandatory_ : false
  - _Type_ : int
  - _Default_ : ∅

- **`database.name`** : External Postgresql database name

  - _Env_ : **`CDK_DATABASE_NAME`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

- **`database.username`** : External Postgresql login role

  - _Env_ : **`CDK_DATABASE_USERNAME`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

- **`database.password`** : External Postgresql login password

  - _Env_ : **`CDK_DATABASE_PASSWORD`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

- **`database.connection_timeout`** : External Postgresql connection timeout in seconds.
  - _Env_ : **`CDK_DATABASE_CONNECTIONTIMEOUT`**
  - _Mandatory_ : false
  - _Type_ : int
  - _Default_ : ∅

### Local users properties

Optional local accounts list used to login on conduktor-platform

- **`auth.local-users[].email`** : User login

  - _Env_ : **`CDK_AUTH_LOCAL-USERS_0_EMAIL`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : `"admin@conduktor.io"`

- **`auth.local-users[].password`** : User password
  - _Env_ : **`CDK_AUTH_LOCAL-USERS_0_PASSWORD`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : `"admin"`

### SSO properties

SSO authentication properties (only on enterprise and team plans).
See authentication [documentation](./user-authentication) for snippets

- **`sso.ignoreUntrustedCertificate`** : Disable SSL checks
  - _Env_ : **`SSO_IGNORE-UNTRUSTED-CERTIFICATE`**
  - _Mandatory_ : false
  - _Type_ : boolean
  - _Default_ : `false`
  - _Since_ : `1.3.0`

#### LDAP properties

- **`sso.ldap[].name`** : Ldap connection name

  - _Env_ : **`SSO_LDAP_0_NAME`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`sso.ldap[].server`** : Ldap server host and port
  - _Env_ : **`SSO_LDAP_0_SERVER`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅
  -
- **`sso.ldap[].managerDn`** : Sets the manager DN

  - _Env_ : **`SSO_LDAP_0_MANAGERDN`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`sso.ldap[].managerPassword`** : Sets the manager password

  - _Env_ : **`SSO_LDAP_0_MANAGERPASSWORD`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`sso.ldap[].search-subtree`** : Sets if the subtree should be searched.

  - _Env_ : **`SSO_LDAP_0_SEARCH-SUBTREE`**
  - _Mandatory_ : false
  - _Type_ : boolean
  - _Default_ : `true`
  - _Since_ : `1.5.0`

- **`sso.ldap[].search-base`** : Sets the base DN to search.

  - _Env_ : **`SSO_LDAP_0_SEARCH-BASE`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`sso.ldap[].search-filter`** : Sets the search filter. By default, the filter is set to `(uid={0})` for users using class type `InetOrgPerson`.

  - _Env_ : **`SSO_LDAP_0_SEARCH-FILTER`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : `"(uid={0})"`
  - _Since_ : `1.5.0`

- **`sso.ldap[].search-attributes`** : Sets the attributes list to return. By default, all attributes are returned. Platform search for `uid`, `cn`, `mail`, `email`, `givenName`, `sn`, `displayName` attributes to map into user token.

  - _Env_ : **`SSO_LDAP_0_SEARCH-ATTRIBUTES`**
  - _Mandatory_ : false
  - _Type_ : string array
  - _Default_ : `[]`
  - _Since_ : `1.5.0`

- **`sso.ldap[].groups-enabled`** : Sets if group search is enabled.

  - _Env_ : **`SSO_LDAP_0_GROUPS-ENABLED`**
  - _Mandatory_ : false
  - _Type_ : boolean
  - _Default_ : `false`
  - _Since_ : `1.5.0`

- **`sso.ldap[].groups-subtree`** : Sets if the subtree should be searched.

  - _Env_ : **`SSO_LDAP_0_GROUPS-SUBTREE`**
  - _Mandatory_ : false
  - _Type_ : boolean
  - _Default_ : `true`
  - _Since_ : `1.5.0`

- **`sso.ldap[].groups-base`** : Sets the base DN to search from.

  - _Env_ : **`SSO_LDAP_0_GROUPS-BASE`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`sso.ldap[].groups-filter`** : Sets the group search filter. If using group class type `GroupOfUniqueNames` use the filter `"uniqueMember={0}"`. For group class `GroupOfNames` use `"member={0}"`. By default, the filter is set to `"uniqueMember={0}"`.

  - _Env_ : **`SSO_LDAP_0_GROUPS-FILTER`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : `"uniquemember={0}"`
  - _Since_ : `1.5.0`

- **`sso.ldap[].groups-filter-attribute`** : Sets the name of the user attribute to bind to the group search filter. Defaults to the user’s DN.

  - _Env_ : **`SSO_LDAP_0_GROUPS-FILTER-ATTRIBUTE`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅
  - _Since_ : `1.5.0`

- **`sso.ldap[].groups-attribute`** : Sets the group attribute name. Defaults to `cn`.

  - _Env_ : **`SSO_LDAP_0_GROUPS-ATTRIBUTE`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : `"cn"`
  - _Since_ : `1.5.0`

- **`sso.ldap[].properties`** : Additional properties that will be passed to identity provider context
  - _Env_ : **`SSO_LDAP_0_PROPERTIES`**
  - _Mandatory_ : false
  - _Type_ : dictionary
  - _Default_ : ∅
  - _Since_ : `1.11.0`

#### Oauth2 properties

- **`sso.oauth2[].name`** : Oauth2 connection name

  - _Env_ : **`SSO_OAUTH2_0_NAME`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`sso.oauth2[].default`** : Use as default

  - _Env_ : **`SSO_OAUTH2_0_DEFAULT`**
  - _Mandatory_ : true
  - _Type_ : boolean
  - _Default_ : ∅

- **`sso.oauth2[].client-id`** : Oauth2 client id

  - _Env_ : **`SSO_OAUTH2_0_CLIENT-ID`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`sso.oauth2[].client-secret`** : Oauth2 client secret

  - _Env_ : **`SSO_OAUTH2_0_CLIENT-SECRET`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`sso.oauth2[].openid.issuer`** : Issuer to check on token

  - _Env_ : **`SSO_OAUTH2_0_OPENID_ISSUER`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`sso.oauth2[].scopes`** : Scope to be requested in the client credentials request.

  - _Env_ : **`SSO_OAUTH2_0_SCOPES`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : `[]`

- **`sso.oauth2[].authorization-url`** : Authorization endpoint URL

  - _Env_ : **`SSO_OAUTH2_0_AUTHORIZATION-URL`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

- **`sso.oauth2[].token.url`** : Get token endpoint URL

  - _Env_ : **`SSO_OAUTH2_0_TOKEN_URL`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

- **`sso.oauth2[].token.auth-method`** : Authentication Method
  - _Env_ : **`SSO_OAUTH2_0_TOKEN_AUTH-METHOD`**
  - _Mandatory_ : false
  - _Type_ : string one of : `"CLIENT_SECRET_BASIC"`, `"CLIENT_SECRET_JWT"`, `"CLIENT_SECRET_POST"`, `"NONE"`, `"PRIVATE_KEY_JWT"`, `"TLS_CLIENT_AUTH" `
  - _Default_ : ∅

### Kafka clusters properties

:::info
Configuring **Kafka Clusters, Schema Registry and Kafka Connect** with YAML is **limited**.  
Looking to configure your Kafka Clusters using GitOps processes?  
Contact our [Customer Success](https://www.conduktor.io/contact/support) or give us [feedback](https://product.conduktor.help/c/75-public-apis) on this feature.
:::

:::warning
Please consider the following limitations regarding Kafka Cluster definition:

- This is not GitOps. If you later need to update a cluster defined this way, you **must** update it through the UI
- Some additional properties will interfere with the UI and you won't be able to update them.
  - `ssl.truststore.path` and `ssl.keystore.path` are known to cause issues.   
:::

You can find sample configurations on the [Configuration Snippets](./configuration-snippets.md) page

- **`clusters[].id`** : String used to uniquely identify your Kafka cluster

  - _Env_ : **`CDK_CLUSTERS_0_ID`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`clusters[].name`** : Alias or user-friendly name for your Kafka cluster

  - _Env_ : **`CDK_CLUSTERS_0_NAME`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`clusters[].color`** : Attach a color to associate with your cluster in the UI

  - _Env_ : **`CDK_CLUSTERS_0_COLOR`**
  - _Mandatory_ : false
  - _Type_ : string in hexadecimal format (`#FFFFFF`)
  - _Default_ : random

- **`clusters[].ignoreUntrustedCertificate`** : Skip SSL certificate validation

  - _Env_ : **`CDK_CLUSTERS_0_IGNOREUNTRUSTEDCERTIFICATE`**
  - _Mandatory_ : false
  - _Type_ : boolean
  - _Default_ : `false`

- **`clusters[].bootstrapServers`** : List of host:port for your Kafka brokers separated by coma `,`

  - _Env_ : **`CDK_CLUSTERS_0_BOOTSTRAPSERVERS`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`clusters[].zookeeperServer`** : Zookeeper server url

  - _Env_ : **`CDK_CLUSTERS_0_ZOOKEEPERSERVER`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

- **`clusters[].properties`** : Any cluster configuration properties.

  - _Env_ : **`CDK_CLUSTERS_0_PROPERTIES`**
  - _Mandatory_ : false
  - _Type_ : string where each line is a property
  - _Default_ : ∅
    > **Tips** : To set multi-line properties using environment variable, separate each properties with `\n` like `prop1=value1\nprop3=value3`.

- **`clusters[].jmxScrapePort`** : JMX-exporter port used to scrape kafka broker metrics for monitoring

  - _Env_ : **`CDK_CLUSTERS_0_JMXSCRAPEPORT`**
  - _Mandatory_ : false
  - _Type_ : int
  - _Default_ : `9101`

- **`clusters[].nodeScrapePort`** : Node-exporter port used to scrape kafka host metrics for monitoring
  - _Env_ : **`CDK_CLUSTERS_0_NODESCRAPEPORT`**
  - _Mandatory_ : false
  - _Type_ : int
  - _Default_ : `9100`

### Schema registry properties

- **`clusters[].schemaRegistry.id`** : String used to uniquely identify your schema registry

  - _Env_ : **`CDK_CLUSTERS_0_SCHEMAREGISTRY_ID`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

#### Confluent schema registry properties

- **`clusters[].schemaRegistry.url`** : The schema registry URL

  - _Env_ : **`CDK_CLUSTERS_0_SCHEMAREGISTRY_URL`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`clusters[].schemaRegistry.ignoreUntrustedCertificate`** : Skip SSL certificate validation

  - _Env_ : **`CDK_CLUSTERS_0_SCHEMAREGISTRY_IGNOREUNTRUSTEDCERTIFICATE`**
  - _Mandatory_ : false
  - _Type_ : boolean
  - _Default_ : `false`

- **`clusters[].schemaRegistry.properties`** : Any schema registry configuration parameters

  - _Env_ : **`CDK_CLUSTERS_0_SCHEMAREGISTRY_PROPERTIES`**
  - _Mandatory_ : false
  - _Type_ : string where each line is a property
  - _Default_ : ∅
    > **Tips** : To set multi-line properties using environment variable, separate each properties with `\n` like `prop1=value1\nprop3=value3`.

If you need to authenticate with basic auth, you can use the following properties:

- **`clusters[].schemaRegistry.security.username`** : Basic auth username

  - _Env_ : **`CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_USERNAME`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

- **`clusters[].schemaRegistry.security.password`** : Basic auth password

  - _Env_ : **`CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_PASSWORD`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

If you need to authenticate with bearer auth, you can use the following property:

- **`clusters[].schemaRegistry.security.token`** : Bearer auth token

  - _Env_ : **`CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_TOKEN`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

#### Amazon Glue schema registry properties

- **`clusters[].schemaRegistry.region`** : The Glue schema registry region

  - _Env_ : **`CDK_CLUSTERS_0_SCHEMAREGISTRY_REGION`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅
  - _Since_ : `1.x.x`

- **`clusters[].schemaRegistry.registryName`** : The Glue schema registry name

  - _Env_ : **`CDK_CLUSTERS_0_SCHEMAREGISTRY_REGISTRYNAME`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅
  - _Since_ : `1.x.x`

- **`clusters[].schemaRegistry.amazonSecurity.type`** : Authentication with credentials

  - _Env_ : **`CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_TYPE`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Values_ : `Credentials` | `FromContext` | `FromRole`
  - _Default_ : ∅
  - _Since_ : `1.x.x`

If `amazonSecurity.type` is `Credentials`, you must use the following properties:

- **`clusters[].schemaRegistry.amazonSecurity.accessKeyId`** : Credentials auth access key

  - _Env_ : **`CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_ACCESSKEYID`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅
  - _Since_ : `1.x.x`

- **`clusters[].schemaRegistry.amazonSecurity.secretKey`** : Credentials auth secret key

  - _Env_ : **`CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_SECRETKEY`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅
  - _Since_ : `1.x.x`

If `amazonSecurity.type` is `FromContext`, you must use the following properties:

- **`clusters[].schemaRegistry.amazonSecurity.profile`** : Authentication profile

  - _Env_ : **`CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_PROFILE`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅
  - _Since_ : `1.x.x`

If `amazonSecurity.type` is `FromRole`, you must use the following properties:

- **`clusters[].schemaRegistry.amazonSecurity.role`** : Authentication role

  - _Env_ : **`CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_ROLE`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅
  - _Since_ : `1.x.x`

### Kafka Connect properties

- **`clusters[].kafkaConnects[].id`** : String used to uniquely identify your Kafka Connect

  - _Env_ : **`CDK_CLUSTERS_0_KAFKACONNECTS_0_ID`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`clusters[].kafkaConnects[].url`** : The Kafka connect URL

  - _Env_ : **`CDK_CLUSTERS_0_KAFKACONNECTS_0_URL`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`clusters[].kafkaConnects[].security.username`** : Basic auth username

  - _Env_ : **`CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_USERNAME`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

- **`clusters[].kafkaConnects[].security.username`** : Basic auth password

  - _Env_ : **`CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_PASSWORD`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

### Monitoring properties

- **`monitoring.storage.s3.endpoint`** : External monitoring S3 storage endpoint

  - _Env_ : **`CDK_MONITORING_STORAGE_S3_ENDPOINT`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅
  - _Since_ : `1.5.0`

- **`monitoring.storage.s3.region`** : External monitoring S3 storage region

  - _Env_ : **`CDK_MONITORING_STORAGE_S3_REGION`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅
  - _Since_ : `1.5.0`

- **`monitoring.storage.s3.bucket`** : External monitoring S3 storage bucket name

  - _Env_ : **`CDK_MONITORING_STORAGE_S3_BUCKET`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅
  - _Since_ : `1.5.0`

- **`monitoring.storage.s3.insecure`** : External monitoring S3 storage SSL/TLS check flag

  - _Env_ : **`CDK_MONITORING_STORAGE_S3_INSECURE`**
  - _Mandatory_ : false
  - _Type_ : bool
  - _Default_ : `false`
  - _Since_ : `1.5.0`

- **`monitoring.storage.s3.accessKeyId`** : External monitoring S3 storage access key

  - _Env_ : **`CDK_MONITORING_STORAGE_S3_ACCESSKEYID`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅
  - _Since_ : `1.5.0`

- **`monitoring.storage.s3.secretAccessKey`** : External monitoring S3 storage access key secret
  - _Env_ : **`CDK_MONITORING_STORAGE_S3_SECRETACCESSKEY`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅
  - _Since_ : `1.5.0`
