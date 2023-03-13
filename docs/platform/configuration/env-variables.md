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

| ENV | Since Version | Until Version | Default Value |  |
| --- | --- | --- | --- | --- |
| **`CDK_DEBUG`** | 1.0.0 | latest | `false` | Flag to enable platform debug logs. See [log configuration](../troubleshooting/logs-configuration.md) for mor details. |
| **`RUN_MODE`** | 1.0.2 | latest | `nano` | Memory presets for the platform see [advanced settings](../installation/hardware.md) |
| **`CDK_VOLUME_DIR`** | 1.0.2 | latest | `/var/conduktor` | Volume directory where Conduktor platform store data \*\* |
| **`CDK_IN_CONF_FILE`** | 1.0.2 | latest | [`/opt/conduktor/default-platform-config.yaml`](./introduction.md#configuration-file)) | Conduktor platform configuration file location \*\* |
| **`CDK_LISTENING_PORT`** | 1.2.0 | latest | `8080` | Platform listening port \*\* |
| **`CDK_SSL_TRUSTSTORE_PATH`** | 1.5.0 | latest | None | Truststore file path used by platform kafka, SSO, S3, ... clients SSL/TLS verification |
| **`CDK_SSL_TRUSTSTORE_PASSWORD`** | 1.5.0 | latest | None | Truststore password (optional) |
| **`CDK_SSL_TRUSTSTORE_TYPE`** | 1.5.0 | latest | `jks` | Truststore type (optional) |
| **`CDK_SSL_DEBUG`** | 1.9.0 | latest | `false` | Enable SSL/TLS debug logs |
| **`CDK_HTTP_PROXY_HOST`** | 1.10.0 | latest | None | Specify [proxy settings](./http-proxy-configuration.md) that Conduktor Platform should use to access the Internet |
| **`CDK_HTTP_PROXY_PORT`** | 1.10.0 | latest | `80` | Specify [proxy settings](./http-proxy-configuration.md) that Conduktor Platform should use to access the Internet |
| **`CDK_HTTP_NON_PROXY_HOSTS`** | 1.10.0 | latest | None | Specify [proxy settings](./http-proxy-configuration.md) that Conduktor Platform should use to access the Internet |
| **`CDK_HTTP_PROXY_USERNAME`** | 1.10.0 | latest | None | Specify [proxy settings](./http-proxy-configuration.md) that Conduktor Platform should use to access the Internet |
| **`CDK_HTTP_PROXY_PASSWORD`** | 1.10.0 | latest | None | Specify [proxy settings](./http-proxy-configuration.md) that Conduktor Platform should use to access the Internet |
| **`CDK_GLOBAL_JAVA_OPTS`** | 1.10.0 | latest | None | Custom JAVA_OPTS parameters passed to platform modules. |
| **`CDK_ROOT_LOG_LEVEL`** | 1.11.0 | latest | `INFO` | Set the platform global log level (DEBUG, INFO, WARN, ERROR). See [log configuration](../troubleshooting/logs-configuration.md) for mor details. |
| **`CDK_ROOT_LOG_COLOR`** | 1.11.0 | latest | `true` | Enable or disable ANSI colors in logs. See [log configuration](../troubleshooting/logs-configuration.md) for mor details. |

## Platform properties reference

Starting from Conduktor Platform `1.2.0` input configuration fields can be provided using environment variables.

Below shows the mapping of configuration fields in the `platform-config.yaml` to environment variables.

> **Note** : Lists start at index 0 and are provided using `_idx_` syntax.

#### Support of `*_FILE` environment variables

Since release `1.10.0`, setting an environment variable matching `*_FILE` to a file path, the prefixed environment variable will be overridden with the value specified in that file.

For example, setting `CDK_LICENSE_FILE` to `/run/secrets/license` will override `CDK_LICENSE` with the content of the file `/run/secrets/license`.

> Exception: `CDK_IN_CONF_FILE` is not supported

### Global properties

| Property | Description | Environment Variable | Mandatory | Type | Default |
| --- | --- | --- | --- | --- | --- |
| `organization.name`        | Your organization's name | `CDK_ORGANIZATION_NAME`        | true | string | `"default"` |
| `license`                  | Enterprise license key. If not provided, fallback to free plan. | CDK_LICENSE or LICENSE_KEY     | false | string | ∅ |
| `platform.external.url`    | Force Platform external URL. Useful for SSO callback URL when using a reverse proxy. By default, the platform will try to guess it automatically using X-Forwarded-* headers coming from upstream reverse proxy. | `CDK_PLATFORM_EXTERNAL_URL`    | false | string | ∅ |
| `platform.https.cert.path` | Path to the SSL certificate file. | `CDK_PLATFORM_HTTPS_CERT_PATH` | false | string | ∅ |
| `platform.https.key.path`  | Path to the SSL private key file. | `CDK_PLATFORM_HTTPS_KEY_PATH`  | false | string | ∅ |
| `enable_product_metrics`   | In order to improve Conduktor Platform, we collect anonymous usage metrics. Set to `false`, this configuration disable all of our metrics collection. | `CDK_ENABLE_PRODUCT_METRICS`   | false | boolean | `true` |

> **Tips** : If you need more that what free plan offer, you can [contact us](https://www.conduktor.io/contact/sales) for a trial license.

### Database properties

See database configuration [documentation](/platform/configuration/database/) for more info

| Property | Description | Env | Mandatory | Type | Default |
| --- | --- | --- | --- | --- | --- |
| `database.url` | External Postgresql configuration URL | CDK_DATABASE_URL | false | string | ∅ |
|  | in format `[jdbc:]postgresql://[user[:password]@]netloc[:port][/dbname][?param1=value1&amp;...]` |  |  |  |  |
| `database.host` | External Postgresql server hostname | `CDK_DATABASE_HOST` | false | string | ∅ |
| `database.port` | External Postgresql server port | `CDK_DATABASE_PORT` | false | int | ∅ |
| `database.name` | External Postgresql database name | `CDK_DATABASE_NAME` | false | string | ∅ |
| `database.username` | External Postgresql login role | `CDK_DATABASE_USERNAME` | false | string | ∅ |
| `database.password` | External Postgresql login password | `CDK_DATABASE_PASSWORD` | false | string | ∅ |
| `database.connection_timeout` | External Postgresql connection timeout in seconds | `CDK_DATABASE_CONNECTIONTIMEOUT` | false | int | ∅ |

### Local users properties

Optional local accounts list used to login on conduktor-platform

| Property | Description | Env Variable | Mandatory | Type | Default Value |
| --- | --- | --- | --- | --- | --- |
| `auth.local-users[].email` | User login | `CDK_AUTH_LOCAL-USERS_0_EMAIL` | true | string | `"admin@conduktor.io"` |
| `auth.local-users[].password` | User password | `CDK_AUTH_LOCAL-USERS_0_PASSWORD` | true | string | `"admin"` |

### Monitoring properties

| Property | Description | Env | Mandatory | Type | Default | Since |
| --- | --- | --- | --- | --- | --- | --- |
| `monitoring.storage.s3.endpoint` | External monitoring S3 storage endpoint | `CDK_MONITORING_STORAGE_S3_ENDPOINT` | false | string | ∅ | `1.5.0` |
| `monitoring.storage.s3.region` | External monitoring S3 storage region | `CDK_MONITORING_STORAGE_S3_REGION` | false | string | ∅ | `1.5.0` |
| `monitoring.storage.s3.bucket` | External monitoring S3 storage bucket name | `CDK_MONITORING_STORAGE_S3_BUCKET` | true | string | ∅ | `1.5.0` |
| `monitoring.storage.s3.insecure` | External monitoring S3 storage SSL/TLS check flag | `CDK_MONITORING_STORAGE_S3_INSECURE` | false | bool | false | `1.5.0` |
| `monitoring.storage.s3.accessKeyId` | External monitoring S3 storage access key | `CDK_MONITORING_STORAGE_S3_ACCESSKEYID` | true | string | ∅ | `1.5.0` |
| `monitoring.storage.s3.secretAccessKey` | External monitoring S3 storage access key secret | `CDK_MONITORING_STORAGE_S3_SECRETACCESSKEY` | true | string | ∅ | `1.5.0` |

### SSO properties

SSO authentication properties (only on enterprise and team plans). See authentication [documentation](/platform/configuration/user-authentication/) for snippets

| Property | Description | Env | Mandatory | Type | Default | Since |
| --- | --- | --- | --- | --- | --- | --- |
| `sso.ignoreUntrustedCertificate` | Disable SSL checks. | `CDK_SSO_IGNORE-UNTRUSTED-CERTIFICATE` | false | boolean | `false` | `1.3.0` |

#### LDAP properties

| Property | Description | Env | Mandatory | Type | Default | Since |
| --- | --- | --- | --- | --- | --- | --- |
| `sso.ldap[].name` | Ldap connection name | `CDK_SSO_LDAP_0_NAME`                    | true | string | ∅ |  |
| `sso.ldap[].server` | Ldap server host and port | `CDK_SSO_LDAP_0_SERVER`                  | true | string | ∅ |  |
| `sso.ldap[].managerDn` | Sets the manager DN | `CDK_SSO_LDAP_0_MANAGERDN`               | true | string | ∅ |  |
| `sso.ldap[].managerPassword` | Sets the manager password | `CDK_SSO_LDAP_0_MANAGERPASSWORD`         | true | string | ∅ |  |
| `sso.ldap[].search-subtree` | Sets if the subtree should be searched. | `CDK_SSO_LDAP_0_SEARCH-SUBTREE`          | false | boolean | `true` | `1.5.0` |
| `sso.ldap[].search-base` | Sets the base DN to search. | `CDK_SSO_LDAP_0_SEARCH-BASE`             | true | string | ∅ |  |
| `sso.ldap[].search-filter` | Sets the search filter. By default, the filter is set to `(uid={0})` for users using class type `InetOrgPerson`. | `CDK_SSO_LDAP_0_SEARCH-FILTER`           | false | string | `"(uid={0})"` | `1.5.0` |
| `sso.ldap[].search-attributes` | Sets the attributes list to return. By default, all attributes are returned. Platform search for `uid`, `cn`, `mail`, `email`, `givenName`, `sn`, `displayName` attributes to map into user token. | `CDK_SSO_LDAP_0_SEARCH-ATTRIBUTES`       | false | string array | `[]` | `1.5.0` |
| `sso.ldap[].groups-enabled` | Sets if group search is enabled. | `CDK_SSO_LDAP_0_GROUPS-ENABLED`          | false | boolean | `false` | `1.5.0` |
| `sso.ldap[].groups-subtree` | Sets if the subtree should be searched. | `CDK_SSO_LDAP_0_GROUPS-SUBTREE`          | false | boolean | `true` | `1.5.0` |
| `sso.ldap[].groups-base` | Sets the base DN to search from. | `CDK_SSO_LDAP_0_GROUPS-BASE`             | true | string | ∅ |  |
| `sso.ldap[].groups-filter` | Sets the group search filter. If using group class type `GroupOfUniqueNames` use the filter `"uniqueMember={0}"`. For group class `GroupOfNames` use `"member={0}"`. By default, the filter is set to `"uniqueMember={0}"`. | `CDK_SSO_LDAP_0_GROUPS-FILTER`           | false | string | `"uniquemember={0}"` | `1.5.0` |
| `sso.ldap[].groups-filter-attribute` | Sets the name of the user attribute to bind to the group search filter. Defaults to the user’s DN. | `CDK_SSO_LDAP_0_GROUPS-FILTER-ATTRIBUTE` | false | string | ∅ | `1.5.0` |
| `sso.ldap[].groups-attribute` | Sets the group attribute name. Defaults to `cn`. | `CDK_SSO_LDAP_0_GROUPS-ATTRIBUTE`        | false | string | `"cn"` | `1.5.0` |
| `sso.ldap[].properties` | Additional properties that will be passed to identity provider context. | `CDK_SSO_LDAP_0_PROPERTIES`              | false | dictionary | ∅ | `1.11.0` |

#### Oauth2 properties

| Property | Description | Env | Mandatory | Type | Default |
| --- | --- | --- | --- | --- | --- |
| `sso.oauth2[].name` | Oauth2 connection name | `CDK_SSO_OAUTH2_0_NAME`              | true | string | ∅ |
| `sso.oauth2[].default` | Use as default | `CDK_SSO_OAUTH2_0_DEFAULT`           | true | boolean | ∅ |
| `sso.oauth2[].client-id` | Oauth2 client id | `CDK_SSO_OAUTH2_0_CLIENT-ID`         | true | string | ∅ |
| `sso.oauth2[].client-secret` | Oauth2 client secret | `CDK_SSO_OAUTH2_0_CLIENT-SECRET`     | true | string | ∅ |
| `sso.oauth2[].openid.issuer` | Issuer to check on token | `CDK_SSO_OAUTH2_0_OPENID_ISSUER`     | true | string | ∅ |
| `sso.oauth2[].scopes` | Scope to be requested in the client credentials request. | `CDK_SSO_OAUTH2_0_SCOPES`            | true | string | `[]` |
| `sso.oauth2[].authorization-url` | Authorization endpoint URL | `CDK_SSO_OAUTH2_0_AUTHORIZATION-URL` | false | string | ∅ |
| `sso.oauth2[].token.url` | Get token endpoint URL | `CDK_SSO_OAUTH2_0_TOKEN_URL`         | false | string | ∅ |
| `sso.oauth2[].token.auth-method` | Authentication Method | `CDK_SSO_OAUTH2_0_TOKEN_AUTH-METHOD` | false | string one of: `"CLIENT_SECRET_BASIC"`, `"CLIENT_SECRET_JWT"`, `"CLIENT_SECRET_POST"`, `"NONE"`, `"PRIVATE_KEY_JWT"`, `"TLS_CLIENT_AUTH"` | ∅ |

### Kafka clusters properties

:::info Configuring **Kafka Clusters, Schema Registry and Kafka Connect** with YAML is **limited**.  
Looking to configure your Kafka Clusters using GitOps processes?  
Contact our [Customer Success](https://www.conduktor.io/contact/support) or give us [feedback](https://product.conduktor.help/c/75-public-apis) on this feature. :::

:::warning Please consider the following limitations regarding Kafka Cluster definition:

- This is not GitOps. If you later need to update a cluster defined this way, you **must** update it through the UI
- Some additional properties will interfere with the UI and you won't be able to update them.
  - `ssl.truststore.path` and `ssl.keystore.path` are known to cause issues.

You can find sample configurations on the [Configuration Snippets](./configuration-snippets.md) page

| Property | Description | Env | Mandatory | Type | Default |
| --- | --- | --- | --- | --- | --- |
| `clusters[].id` | String used to uniquely identify your Kafka cluster | `CDK_CLUSTERS_0_ID` | true | string | ∅ |
| `clusters[].name` | Alias or user-friendly name for your Kafka cluster | `CDK_CLUSTERS_0_NAME` | true | string | ∅ |
| `clusters[].color` | Attach a color to associate with your cluster in the UI | `CDK_CLUSTERS_0_COLOR` | false | string in hexadecimal format (`#FFFFFF`) | random |
| `clusters[].ignoreUntrustedCertificate` | Skip SSL certificate validation | `CDK_CLUSTERS_0_IGNOREUNTRUSTEDCERTIFICATE` | false | boolean | `false` |
| `clusters[].bootstrapServers` | List of host:port for your Kafka brokers separated by coma `,` | `CDK_CLUSTERS_0_BOOTSTRAPSERVERS` | true | string | ∅ |
| `clusters[].zookeeperServer` | Zookeeper server url | `CDK_CLUSTERS_0_ZOOKEEPERSERVER` | false | string | ∅ |
| `clusters[].properties` | Any cluster configuration properties. | `CDK_CLUSTERS_0_PROPERTIES` | false | string where each line is a property | ∅ |
| `clusters[].jmxScrapePort` | JMX-exporter port used to scrape kafka broker metrics for monitoring | `CDK_CLUSTERS_0_JMXSCRAPEPORT` | false | int | `9101` |
| `clusters[].nodeScrapePort` | Node-exporter port used to scrape kafka host metrics for monitoring | `CDK_CLUSTERS_0_NODESCRAPEPORT` | false | int | `9100` |

### Schema registry properties

| Property | Description | Env | Mandatory | Type | Default |
| --- | --- | --- | --- | --- | --- |
| `clusters[].schemaRegistry.id` | String used to uniquely identify your schema registry | `CDK_CLUSTERS_0_SCHEMAREGISTRY_ID` | true | string | ∅ |
| `clusters[].schemaRegistry.url` | The schema registry URL | `CDK_CLUSTERS_0_SCHEMAREGISTRY_URL` | true | string | ∅ |
| `clusters[].schemaRegistry.ignoreUntrustedCertificate` | Skip SSL certificate validation | `CDK_CLUSTERS_0_SCHEMAREGISTRY_IGNOREUNTRUSTEDCERTIFICATE` | false | boolean | `false` |
| `clusters[].schemaRegistry.properties` | Any schema registry configuration parameters | `CDK_CLUSTERS_0_SCHEMAREGISTRY_PROPERTIES` | false | string where each line is a property | ∅ |

If you need to authenticate with basic auth, you can use the following properties:

| Property | Description | Env | Mandatory | Type | Default |
| --- | --- | --- | --- | --- | --- |
| clusters[].schemaRegistry.security.username | Basic auth username | `CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_USERNAME` | false | string | ∅ |
| clusters[].schemaRegistry.security.password | Basic auth password | `CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_PASSWORD` | false | string | ∅ |

If you need to authenticate with bearer auth, you can use the following property:

| Property | Description | Environment Variable | Mandatory | Type | Default |
| --- | --- | --- | --- | --- | --- |
| `clusters[].schemaRegistry.security.token` | Bearer auth token | `CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_TOKEN` | `false` | string | ∅ |

#### Amazon Glue schema registry properties

| Property | Description | Env | Mandatory | Type | Default | Values | Since |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `clusters[].schemaRegistry.region` | The Glue schema registry region | `CDK_CLUSTERS_0_SCHEMAREGISTRY_REGION` | true | string | ∅ | - | `1.x.x` |
| `clusters[].schemaRegistry.registryName` | The Glue schema registry name | `CDK_CLUSTERS_0_SCHEMAREGISTRY_REGISTRYNAME` | false | string | ∅ | - | `1.x.x` |
| `clusters[].schemaRegistry.amazonSecurity.type` | Authentication with credentials | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_TYPE` | true | string | ∅ | `Credentials`, `FromContext`, `FromRole` | `1.x.x` |

If `amazonSecurity.type` is `Credentials`, you must use the following properties:

| Property | Description | Env | Mandatory | Type | Default | Since |
| --- | --- | --- | --- | --- | --- | --- |
| `clusters[].schemaRegistry.amazonSecurity.accessKeyId` | Credentials auth access key | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_ACCESSKEYID` | true | string | ∅ | `1.x.x` |
| `clusters[].schemaRegistry.amazonSecurity.secretKey` | Credentials auth secret key | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_SECRETKEY` | true | string | ∅ | `1.x.x` |

If `amazonSecurity.type` is `FromContext`, you must use the following properties:

| Property | Description | Env | Mandatory | Type | Default | Since |
| --- | --- | --- | --- | --- | --- | --- |
| `clusters[].schemaRegistry.amazonSecurity.profile` | Authentication profile | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_PROFILE` | false | string | ∅ | `1.x.x` |

If `amazonSecurity.type` is `FromRole`, you must use the following properties:

| Property | Description | Env | Mandatory | Type | Default | Since |
| --- | --- | --- | --- | --- | --- | --- |
| `clusters[].schemaRegistry.amazonSecurity.role` | Authentication role | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_ROLE` | true | string | ∅ | `1.x.x` |

### Kafka Connect properties

| Property | Description | Environment Variable | Mandatory | Type | Default |
| --- | --- | --- | --- | --- | --- |
| `clusters[].kafkaConnects[].id` | String used to uniquely identify your Kafka Connect | `CDK_CLUSTERS_0_KAFKACONNECTS_0_ID` | true | string | ∅ |
| `clusters[].kafkaConnects[].url` | The Kafka connect URL | `CDK_CLUSTERS_0_KAFKACONNECTS_0_URL` | true | string | ∅ |
| `clusters[].kafkaConnects[].security.username` | Basic auth username | `CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_USERNAME` | false | string | ∅ |
| `clusters[].kafkaConnects[].security.password` | Basic auth password | `CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_PASSWORD` | false | string | ∅ |
