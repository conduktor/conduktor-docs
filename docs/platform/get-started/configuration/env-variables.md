---
sidebar_position: 3
title: Configuration Properties & Environment Variables
description: Starting from Conduktor Console 1.2.0 input configuration fields can be provided using environment variables.
---

# Configuration Properties and Environment Variables

- [Configuration Properties and Environment Variables](#configuration-properties-and-environment-variables)
  - [Docker image environment variables](#docker-image-environment-variables)
  - [Platform properties reference](#platform-properties-reference)
      - [Support of shell expansion in YAML configuration file](#support-of-shell-expansion-in-yaml-configuration-file)
      - [Support of `-_FILE` environment variables](#support-of-_file-environment-variables)
      - [Global properties](#global-properties)
      - [Database properties](#database-properties)
      - [Session Lifetime Properties](#session-lifetime-properties)
      - [Local users properties](#local-users-properties)
      - [Monitoring properties](#monitoring-properties)
        - [Console Configuration for Cortex](#console-configuration-for-cortex)
      - [Cortex Configuration](#cortex-configuration)
      - [SSO properties](#sso-properties)
        - [LDAP properties](#ldap-properties)
        - [Oauth2 properties](#oauth2-properties)
      - [Kafka clusters properties](#kafka-clusters-properties)
      - [Kafka vendor specific properties](#kafka-vendor-specific-properties)
        - [Confluent Cloud](#confluent-cloud)
        - [Aiven](#aiven-)
        - [Conduktor Gateway](#conduktor-gateway)
      - [Schema registry properties](#schema-registry-properties)
        - [Amazon Glue schema registry properties](#amazon-glue-schema-registry-properties)
      - [Kafka Connect properties](#kafka-connect-properties)
      - [ksqlDB properties](#ksqldb-properties)
      - [Indexer properties](#indexer-properties)

## Docker image environment variables

| Environment Variable | Since Version | Until Version | Default Value                                                                        |                                                                                                                                                                                                      |
| --- |---------------| --- |--------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`CDK_DEBUG`** | 1.0.0         | latest | `false`                                                                              | Flag to enable platform debug logs. See [log configuration](../troubleshooting/logs-configuration.md) for more details.                                                                               |
| **`CDK_VOLUME_DIR`** | 1.0.2         | latest | `/var/conduktor`                                                                     | Volume directory where Conduktor Console store data                                                                                                                                       |
| **`CDK_IN_CONF_FILE`** | 1.0.2         | latest | [`/opt/conduktor/default-platform-config.yaml`](introduction.md#configuration-file)) | Conduktor Console configuration file location                                                                                                                                              |
| **`CDK_LISTENING_PORT`** | 1.2.0         | latest | `8080`                                                                               | Platform listening port                                                                                                                                                                         |
| **`CDK_SSL_TRUSTSTORE_PATH`** | 1.5.0         | latest | None                                                                                 | Truststore file path used by platform Kafka, SSO, S3, ... clients SSL/TLS verification                                                                                                               |
| **`CDK_SSL_TRUSTSTORE_PASSWORD`** | 1.5.0         | latest | None                                                                                 | Truststore password (optional)                                                                                                                                                                       |
| **`CDK_SSL_TRUSTSTORE_TYPE`** | 1.5.0         | latest | `jks`                                                                                | Truststore type (optional)                                                                                                                                                                           |
| **`CDK_SSL_DEBUG`** | 1.9.0         | latest | `false`                                                                              | Enable SSL/TLS debug logs                                                                                                                                                                            |
| **`CDK_HTTP_PROXY_HOST`** | 1.10.0        | latest | None                                                                                 | Specify [proxy settings](http-proxy-configuration.md) that Conduktor Console should use to access the Internet                                                                                      |
| **`CDK_HTTP_PROXY_PORT`** | 1.10.0        | latest | `80`                                                                                 | Specify [proxy settings](http-proxy-configuration.md) that Conduktor Console should use to access the Internet                                                                                      |
| **`CDK_HTTP_NON_PROXY_HOSTS`** | 1.10.0        | latest | None                                                                                 | Specify [proxy settings](http-proxy-configuration.md) that Conduktor Console should use to access the Internet                                                                                      |
| **`CDK_HTTP_PROXY_USERNAME`** | 1.10.0        | latest | None                                                                                 | Specify [proxy settings](http-proxy-configuration.md) that Conduktor Console should use to access the Internet                                                                                      |
| **`CDK_HTTP_PROXY_PASSWORD`** | 1.10.0        | latest | None                                                                                 | Specify [proxy settings](http-proxy-configuration.md) that Conduktor Console should use to access the Internet                                                                                      |
| **`CDK_GLOBAL_JAVA_OPTS`** | 1.10.0        | latest | None                                                                                 | Custom JAVA_OPTS parameters passed to platform modules.                                                                                                                                              |
| **`CDK_ROOT_LOG_LEVEL`** | 1.11.0        | latest | `INFO`                                                                               | Set the platform global log level (DEBUG, INFO, WARN, ERROR). See [log configuration](../troubleshooting/logs-configuration.md) for more details.                                                     |
| **`CDK_ROOT_LOG_COLOR`** | 1.11.0        | latest | `true`                                                                               | Enable or disable ANSI colors in logs. See [log configuration](../troubleshooting/logs-configuration.md) for more details.                                                                            |
| **`CDK_ONBOARDING_MODE`** | 1.14.0        | latest | `auto`                                                                               | Specify whether to start Conduktor with the onboarding wizard enabled. Accepted values: `auto`, `never`, `always`. Defaults to `auto`  that will start onboarding when no configuration is provided. |
| **`PROXY_BUFFER_SIZE`** | 1.16.0        | latest | `8k`                                                                                 | Tune internal Nginx `proxy_buffer_size`.                                                                                                                                                             |
| **`CONSOLE_MEMORY_OPTS`** | 1.18.0        | latest | `-XX:+UseContainerSupport -XX:MaxRAMPercentage=80`                                   | Configure memory Java options for Console module. See [memory setup page](memory-configuration.md) for more details                                                                                  |
| **`CDK_PLUGINS_DIR`** | 1.22.0        | latest | `/opt/conduktor/plugins`                                                             | Volume directory for Custom Deserializers                                                                                                                                                    |

## Platform properties reference

Starting from Conduktor Console `1.2.0` input configuration fields can be provided using environment variables.

Below shows the mapping of configuration fields in the `platform-config.yaml` to environment variables.

:::note
Lists start at index 0 and are provided using `_idx_` syntax.
:::

#### Support of shell expansion in yaml configuration file

Console support shell expansion for environment variable and home tilde `~` in YAML configuration file. 
This is useful if you have to use custom environment variables in your configuration.

For example, you can use the following syntax to use environment variables in your configuration file:
```yaml

database:
  url: "jdbc:postgresql://${DB_LOGIN}:${DB_PWD}@${DB_HOST}:${DB_PORT:-5432}/${DB_NAME}"
```
with the following environment variables:
- `DB_LOGIN`: `usr`
- `DB_PWD`: `pwd`
- `DB_HOST`: `some_host`
- `DB_NAME`: `cdk`

It will be expanded into the following configuration before being parsed by Console:
```yaml
database:
  url: "jdbc:postgresql://usr:pwd@some_host:5432/cdk"
```
:::note
If you want to escape the shell expansion in YAML file, you can use the following syntax: `$$`.
For example, if you want `admin.password` to be `secret$123`, you should set `admin.password: "secret$$123"`.

Also note that values provided using environment variables will not be expended by Console.
So for example, if you use `CDK_ADMIN_PASSWORD` to set password like `secret$123`, it will be set as is. 
:::

#### Support of `*_FILE` environment variables

Since release `1.10.0`, setting an environment variable matching `*_FILE` to a file path, the prefixed environment variable will be overridden with the value specified in that file.

For example, setting `CDK_LICENSE_FILE` to `/run/secrets/license` will override `CDK_LICENSE` with the content of the file `/run/secrets/license`.

:::warning
Exception: `CDK_IN_CONF_FILE` is not supported
:::

### Global properties

| Property | Description | Environment Variable | Mandatory | Type | Default |
| --- | --- | --- | --- | --- | --- |
| `organization.name` | Your organization's name | `CDK_ORGANIZATION_NAME` | true | string | `"default"` |
| `admin.email` | Your organization's root administrator account email | `CDK_ADMIN_EMAIL` | true | string | ∅ |
| `admin.password` | Your organization's root administrator account password | `CDK_ADMIN_PASSWORD` | true | string | ∅ |
| `license` | Enterprise license key. If not provided, fallback to free plan. | CDK_LICENSE or LICENSE_KEY | false | string | ∅ |
| `platform.external.url` | Force Platform external URL. Useful for SSO callback URL when using a reverse proxy. By default, the platform will try to guess it automatically using X-Forwarded-\* headers coming from upstream reverse proxy. | `CDK_PLATFORM_EXTERNAL_URL` | false | string | ∅ |
| `platform.https.cert.path` | Path to the SSL certificate file. | `CDK_PLATFORM_HTTPS_CERT_PATH` | false | string | ∅ |
| `platform.https.key.path` | Path to the SSL private key file. | `CDK_PLATFORM_HTTPS_KEY_PATH` | false | string | ∅ |
| `enable_product_metrics` | In order to improve Conduktor Console, we collect anonymous usage metrics. Set to `false`, this configuration disable all of our metrics collection. | `CDK_ENABLE_PRODUCT_METRICS` | false | boolean | `true` |

:::tip
If you need more than what the free plan offers, you can [contact us](https://www.conduktor.io/contact/sales) for a trial license.
:::

### Database properties

See database configuration [documentation](../database) for more info

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

### Session Lifetime Properties

Optional properties for configuring [session lifetime](../user-authentication/session-lifetime).

| Property | Description | Env Variable | Mandatory | Type | Default Value |
| --- | --- | --- | --- | --- | --- |
| `auth.sessionLifetime` | Max session lifetime in seconds | `CDK_AUTH_SESSIONLIFETIME` | false | int | 259200 |
| `auth.idleTimeout` | Max idle session time in seconds (access token lifetime). Should be lower than `auth.sessionLifetime` | `CDK_AUTH_IDLETIMEOUT` | false | int | 259200 |

### Local users properties

Optional local accounts list used to log on Console

| Property | Description | Env Variable | Mandatory | Type | Default Value |
| --- | --- | --- | --- | --- | --- |
| `auth.local-users[].email` | User login | `CDK_AUTH_LOCAL-USERS_0_EMAIL` | true | string | `"admin@conduktor.io"` |
| `auth.local-users[].password` | User password | `CDK_AUTH_LOCAL-USERS_0_PASSWORD` | true | string | `"admin"` |

### Monitoring properties
:::caution
Starting with version 1.18.0, if you want to benefit from our Monitoring capabilities (dashboard and alerts), you need to deploy a new image along with Console.

Before 1.18:
- `conduktor/conduktor-platform:1.17.3` or below

Starting with 1.18:
- `conduktor/conduktor-console:1.18.0` or above
and
- `conduktor/conduktor-console-cortex:1.18.0` or above

:::

This new image is based on [Cortex](https://github.com/cortexproject/cortex) and preconfigured to run with Console.
Cortex is a custom implementation of Prometheus used in several production systems including Amazon Managed Service for Prometheus (AMP).

You can choose to not deploy `conduktor/conduktor-console-cortex` (Cortex) image. In this case, you will not be able to access to the following pages anymore:
![](assets/monitoring-disabled.png)

The configuration is split in 2 chapters: 
- Console Configuration for Cortex `conduktor/conduktor-console`
- Cortex Configuration `conduktor/conduktor-console-cortex`

#### Console Configuration for Cortex

First, we need to configure Console to connect to Cortex services.
Cortex ports are configured like this by default:
- Query port 9009
- Alert Manager port 9010

| Property                                  | Description                                    | Env                                        | Mandatory | Type   | Default | Since    |
|-------------------------------------------|------------------------------------------------|--------------------------------------------|-----------|--------|---------|----------|
| `monitoring.cortex-url`                   | Cortex Search Query URL with port 9009         | `CDK_MONITORING_CORTEX-URL`                | true      | string | ∅       | `1.18.0` |
| `monitoring.alert-manager-url`            | Cortex Alert Manager URL with port 9010        | `CDK_MONITORING_ALERT-MANAGER-URL`         | true      | string | ∅       | `1.18.0` |
| `monitoring.callback-url`                 | Console API                                    | `CDK_MONITORING_CALLBACK-URL`              | true      | string | ∅       | `1.18.0` |
| `monitoring.notifications-callback-url`    | Where the Slack notification should redirect   | `CDK_MONITORING_NOTIFICATIONS-CALLBACK-URL`| true      | string | ∅       | `1.18.0` |
| `monitoring.clusters-refresh-interval`    | Refresh rate in seconds for metrics (Optional) | `CDK_MONITORING_CLUSTERS-REFRESH-INTERVAL` | false     | int    | 60      | `1.18.0` |

### Cortex Configuration

See [Cortex configuration page](../cortex/) for more info

### SSO properties

SSO authentication properties (only on enterprise and team plans). See [authentication documentation](/platform/category/configure-sso/) for snippets.

| Property | Description | Env | Mandatory | Type | Default | Since |
| --- | --- | --- | --- | --- | --- | --- |
| `sso.ignoreUntrustedCertificate` | Disable SSL checks. | `CDK_SSO_IGNOREUNTRUSTEDCERTIFICATE` | false | boolean | `false` | `1.3.0`  |
| `sso.trustedCertificates`        | SSL public certificates for SSO authentication (LDAPS and Oauth2) as PEM format. | `CDK_SSO_TRUSTEDCERTIFICATES`        | false     | string  | ∅       | `1.14.0` |

#### LDAP properties

| Property | Description | Env | Mandatory | Type | Default | Since |
| --- | --- | --- | --- | --- | --- | --- |
| `sso.ldap[].name` | Ldap connection name | `CDK_SSO_LDAP_0_NAME` | true | string | ∅ |  |
| `sso.ldap[].server` | Ldap server host and port | `CDK_SSO_LDAP_0_SERVER` | true | string | ∅ |  |
| `sso.ldap[].managerDn` | Sets the manager DN | `CDK_SSO_LDAP_0_MANAGERDN` | true | string | ∅ |  |
| `sso.ldap[].managerPassword` | Sets the manager password | `CDK_SSO_LDAP_0_MANAGERPASSWORD` | true | string | ∅ |  |
| `sso.ldap[].search-subtree` | Sets if the subtree should be searched. | `CDK_SSO_LDAP_0_SEARCH-SUBTREE` | false | boolean | `true` | `1.5.0` |
| `sso.ldap[].search-base` | Sets the base DN to search. | `CDK_SSO_LDAP_0_SEARCH-BASE` | true | string | ∅ |  |
| `sso.ldap[].search-filter` | Sets the search filter. By default, the filter is set to `(uid={0})` for users using class type `InetOrgPerson`. | `CDK_SSO_LDAP_0_SEARCH-FILTER` | false | string | `"(uid={0})"` | `1.5.0` |
| `sso.ldap[].search-attributes` | Sets the attributes list to return. By default, all attributes are returned. Platform search for `uid`, `cn`, `mail`, `email`, `givenName`, `sn`, `displayName` attributes to map into user token. | `CDK_SSO_LDAP_0_SEARCH-ATTRIBUTES` | false | string array | `[]` | `1.5.0` |
| `sso.ldap[].groups-enabled` | Sets if group search is enabled. | `CDK_SSO_LDAP_0_GROUPS-ENABLED` | false | boolean | `false` | `1.5.0` |
| `sso.ldap[].groups-subtree` | Sets if the subtree should be searched. | `CDK_SSO_LDAP_0_GROUPS-SUBTREE` | false | boolean | `true` | `1.5.0` |
| `sso.ldap[].groups-base` | Sets the base DN to search from. | `CDK_SSO_LDAP_0_GROUPS-BASE` | true | string | ∅ |  |
| `sso.ldap[].groups-filter` | Sets the group search filter. If using group class type `GroupOfUniqueNames` use the filter `"uniqueMember={0}"`. For group class `GroupOfNames` use `"member={0}"`. By default, the filter is set to `"uniqueMember={0}"`. | `CDK_SSO_LDAP_0_GROUPS-FILTER` | false | string | `"uniquemember={0}"` | `1.5.0` |
| `sso.ldap[].groups-filter-attribute` | Sets the name of the user attribute to bind to the group search filter. Defaults to the user’s DN. | `CDK_SSO_LDAP_0_GROUPS-FILTER-ATTRIBUTE` | false | string | ∅ | `1.5.0` |
| `sso.ldap[].groups-attribute` | Sets the group attribute name. Defaults to `cn`. | `CDK_SSO_LDAP_0_GROUPS-ATTRIBUTE` | false | string | `"cn"` | `1.5.0` |
| `sso.ldap[].properties` | Additional properties that will be passed to identity provider context. | `CDK_SSO_LDAP_0_PROPERTIES` | false | dictionary | ∅ | `1.11.0` |

#### Oauth2 properties

| Property                                 | Description                                              | Env                                         | Mandatory | Type                                                                                                                                         | Default |
|------------------------------------------|----------------------------------------------------------|---------------------------------------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------|---------|
| `sso.oauth2[].name`                      | Oauth2 connection name                                   | `CDK_SSO_OAUTH2_0_NAME`                     | true      | string                                                                                                                                       | ∅       |
| `sso.oauth2[].default`                   | Use as default                                           | `CDK_SSO_OAUTH2_0_DEFAULT`                  | true      | boolean                                                                                                                                      | ∅       |
| `sso.oauth2[].client-id`                 | Oauth2 client id                                         | `CDK_SSO_OAUTH2_0_CLIENT-ID`                | true      | string                                                                                                                                       | ∅       |
| `sso.oauth2[].client-secret`             | Oauth2 client secret                                     | `CDK_SSO_OAUTH2_0_CLIENT-SECRET`            | true      | string                                                                                                                                       | ∅       |
| `sso.oauth2[].openid.issuer`             | Issuer to check on token                                 | `CDK_SSO_OAUTH2_0_OPENID_ISSUER`            | true      | string                                                                                                                                       | ∅       |
| `sso.oauth2[].scopes`                    | Scope to be requested in the client credentials request. | `CDK_SSO_OAUTH2_0_SCOPES`                   | true      | string                                                                                                                                       | `[]`    |
| `sso.oauth2[].groups-claim `             | Configure Group Claims                                   | `CDK_SSO_OAUTH2_0_GROUPS-CLAIM`             | false     | string                                                                                                                                       | ∅       |
| `sso.oauth2[].allow-unsigned-id-tokens ` | Allow unsigned ID tokens                                 | `CDK_SSO_OAUTH2_0_ALLOW-UNSIGNED-ID-TOKENS` | false     | boolean                                                                                                                                      | false   |
| `sso.oauth2[].preferred-jws-algorithm `  | Configure preferred JWS algorithm                        | `CDK_SSO_OAUTH2_0_PREFERRED-JWS-ALGORITHM`  | false     | string one of: "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "ES256", "ES256K", "ES384", "ES512", "PS256", "PS384", "PS512", "EdDSA" | ∅       |
| `sso.oauth2-logout `                     | Sets if central IdP logout should be called              | `CDK_SSO_OAUTH2LOGOUT`                      | false     | boolean                                                                                                                                      | true    |

### Kafka clusters properties

For more information on configuring your Kafka clusters using GitOps processes, see [GitOps: Managing Cluster Configurations](configuration-snippets.md#gitops-managing-cluster-configurations).

You can find sample configurations on the [Configuration Snippets](configuration-snippets.md) page

| Property | Description | Env | Mandatory | Type | Default |
| --- | --- | --- | --- | --- | --- |
| `clusters[].id` | String used to uniquely identify your Kafka cluster | `CDK_CLUSTERS_0_ID` | true | string | ∅ |
| `clusters[].name` | Alias or user-friendly name for your Kafka cluster | `CDK_CLUSTERS_0_NAME` | true | string | ∅ |
| `clusters[].color` | Attach a color to associate with your cluster in the UI | `CDK_CLUSTERS_0_COLOR` | false | string in hexadecimal format (`#FFFFFF`) | random |
| `clusters[].ignoreUntrustedCertificate` | Skip SSL certificate validation | `CDK_CLUSTERS_0_IGNOREUNTRUSTEDCERTIFICATE` | false | boolean | `false` |
| `clusters[].bootstrapServers` | List of host:port for your Kafka brokers separated by coma `,` | `CDK_CLUSTERS_0_BOOTSTRAPSERVERS` | true | string | ∅ |
| `clusters[].zookeeperServer` | Zookeeper server url | `CDK_CLUSTERS_0_ZOOKEEPERSERVER` | false | string | ∅ |
| `clusters[].properties` | Any cluster configuration properties. | `CDK_CLUSTERS_0_PROPERTIES` | false | string where each line is a property | ∅ |
| `clusters[].jmxScrapePort` | JMX-exporter port used to scrape Kafka broker metrics for monitoring | `CDK_CLUSTERS_0_JMXSCRAPEPORT` | false | int | `9101` |
| `clusters[].nodeScrapePort` | Node-exporter port used to scrape Kafka host metrics for monitoring | `CDK_CLUSTERS_0_NODESCRAPEPORT` | false | int | `9100` |

### Kafka vendor specific properties

Note that you do not need to set any of these additional properties to use the core features of the Console. However, by setting them you can get additional benefits such as managing service accounts and ACLs through Conduktor.

#### Confluent Cloud

Note you need only set [Kafka cluster properties](#kafka-clusters-properties) to use the core features of Console. Setting these additional properties will enable you to manage Confluent Cloud service accounts, API keys and ACLs.

| Property | Description | Env | Mandatory | Type | Default | Values | Since |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `clusters[].kafkaFlavor.type` | Kafka flavor type indicating the cluster is Confluent Cloud | `CDK_CLUSTERS_0_KAFKAFLAVOR_TYPE` | false | string | ∅ | `Confluent`, `Aiven`, `Gateway` | `1.19.x` |
| `clusters[].kafkaFlavor.key` | Confluent Cloud API Key | `CDK_CLUSTERS_0_KAFKAFLAVOR_KEY` | true | string | ∅ | - | `1.19.x` |
| `clusters[].kafkaFlavor.secret` | Confluent Cloud API Secret | `CDK_CLUSTERS_0_KAFKAFLAVOR_SECRET` | true | string | ∅ | - | `1.19.x` |
| `clusters[].kafkaFlavor.confluentEnvironmentId` | Confluent Environment Id | `CDK_CLUSTERS_0_KAFKAFLAVOR_CONFLUENTENVIRONMENTID` | true | string | ∅ | - | `1.19.x` |
| `clusters[].kafkaFlavor.confluentClusterId` | Confluent Cluster Id | `CDK_CLUSTERS_0_KAFKAFLAVOR_CONFLUENTCLUSTERID` | true | string | ∅ | - | `1.19.x` |

#### Aiven 

Note you need only set [Kafka cluster properties](#kafka-clusters-properties) to use the core features of Console. Setting these additional properties will enable you to manage Aiven service accounts and ACLs.

| Property | Description | Env | Mandatory | Type | Default | Values | Since |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `clusters[].kafkaFlavor.type` | Kafka flavor type indicating the cluster is Aiven | `CDK_CLUSTERS_0_KAFKAFLAVOR_TYPE` | false | string | ∅ | `Confluent`, `Aiven`, `Gateway` | `1.19.x` |
| `clusters[].kafkaFlavor.apiToken` | Aiven API token | `CDK_CLUSTERS_0_KAFKAFLAVOR_APITOKEN` | true | string | ∅ | - | `1.19.x` |
| `clusters[].kafkaFlavor.project` | Aiven project | `CDK_CLUSTERS_0_KAFKAFLAVOR_PROJECT` | true | string | ∅ | - | `1.19.x` |
| `clusters[].kafkaFlavor.serviceName` | Aiven service name | `CDK_CLUSTERS_0_KAFKAFLAVOR_SERVICENAME` | true | string | ∅ | - | `1.19.x` |

#### Conduktor Gateway

Configuring Gateway properties will enable you to deploy and manage interceptors on your virtual clusters.

| Property | Description | Env | Mandatory | Type | Default | Values | Since |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `clusters[].kafkaFlavor.type` | Kafka flavor type indicating the cluster is Gateway | `CDK_CLUSTERS_0_KAFKAFLAVOR_TYPE` | false | string | ∅ | `Confluent`, `Aiven`, `Gateway` | `1.19.x` |
| `clusters[].kafkaFlavor.url` | Gateway endpoint URL | `CDK_CLUSTERS_0_KAFKAFLAVOR_URL` | true | string | ∅ | - | `1.19.x` |
| `clusters[].kafkaFlavor.user` | Gateway username | `CDK_CLUSTERS_0_KAFKAFLAVOR_USER` | true | string | ∅ | - | `1.19.x` |
| `clusters[].kafkaFlavor.password` | Gateway password | `CDK_CLUSTERS_0_KAFKAFLAVOR_PASSWORD` | true | string | ∅ | - | `1.19.x` |
| `clusters[].kafkaFlavor.virtualCluster` | Gateway virtual cluster | `CDK_CLUSTERS_0_KAFKAFLAVOR_VIRTUALCLUSTER` | true | string | ∅ | - | `1.19.x` |

### Schema registry properties

| Property                                               | Description                                  | Env                                                        | Mandatory | Type                                 | Default |
|--------------------------------------------------------|----------------------------------------------|------------------------------------------------------------|-----------|--------------------------------------|---------|
| `clusters[].schemaRegistry.url`                        | The schema registry URL                      | `CDK_CLUSTERS_0_SCHEMAREGISTRY_URL`                        | true      | string                               | ∅       |
| `clusters[].schemaRegistry.ignoreUntrustedCertificate` | Skip SSL certificate validation              | `CDK_CLUSTERS_0_SCHEMAREGISTRY_IGNOREUNTRUSTEDCERTIFICATE` | false     | boolean                              | `false` |
| `clusters[].schemaRegistry.properties`                 | Any schema registry configuration parameters | `CDK_CLUSTERS_0_SCHEMAREGISTRY_PROPERTIES`                 | false     | string where each line is a property | ∅       |
| **Basic Authentication**                               |                                              |                                                            |           |                                      |         |
| `clusters[].schemaRegistry.security.username`          | Basic auth username                          | `CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_USERNAME`          | false     | string                               | ∅       |
| `clusters[].schemaRegistry.security.password`          | Basic auth password                          | `CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_PASSWORD`          | false     | string                               | ∅       |
| **Bearer Token Authentication**                        |                                              |                                                            |           |                                      |         |
| `clusters[].schemaRegistry.security.token`             | Bearer auth token                            | `CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_TOKEN`             | false     | string                               | ∅       |
| **mTLS Authentication**                                |                                              |                                                            |           |                                      |         |
| `clusters[].schemaRegistry.security.key`               | Access Key                                   | `CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_KEY`               | false     | string                               | ∅       |
| `clusters[].schemaRegistry.security.certificateChain`  | Access certificate                           | `CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_CERTIFICATECHAIN`  | false     | string                               | ∅       |

#### Amazon Glue schema registry properties

| Property                                               | Description                     | Env                                                        | Mandatory | Type   | Default | Values                                   |
|--------------------------------------------------------|---------------------------------|------------------------------------------------------------|-----------|--------|---------|------------------------------------------|
| `clusters[].schemaRegistry.region`                     | The Glue schema registry region | `CDK_CLUSTERS_0_SCHEMAREGISTRY_REGION`                     | true      | string | ∅       |                                          |
| `clusters[].schemaRegistry.registryName`               | The Glue schema registry name   | `CDK_CLUSTERS_0_SCHEMAREGISTRY_REGISTRYNAME`               | false     | string | ∅       |                                          |
| `clusters[].schemaRegistry.amazonSecurity.type`        | Authentication with credentials | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_TYPE`        | true      | string | ∅       | `Credentials`, `FromContext`, `FromRole` |
| **Credentials Security**                               |                                 |                                                            |           |        |         |                                          |         
| `clusters[].schemaRegistry.amazonSecurity.accessKeyId` | Credentials auth access key     | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_ACCESSKEYID` | true      | string | ∅       |                                          |
| `clusters[].schemaRegistry.amazonSecurity.secretKey`   | Credentials auth secret key     | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_SECRETKEY`   | true      | string | ∅       |                                          |
| **FromContext Security**                               |                                 |                                                            |           |        |         |                                          |         
| `clusters[].schemaRegistry.amazonSecurity.profile`     | Authentication profile          | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_PROFILE`     | false     | string | ∅       |                                          |
| **FromRole Security**                                  |                                 |                                                            |           |        |         |                                          |         
| `clusters[].schemaRegistry.amazonSecurity.role`        | Authentication role             | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_ROLE`        | true      | string | ∅       |                                          |

### Kafka Connect properties

| Property                                                | Description                                                     | Environment Variable                                        | Mandatory | Type    | Default |
|---------------------------------------------------------|-----------------------------------------------------------------|-------------------------------------------------------------|-----------|---------|---------|
| `clusters[].kafkaConnects[].id`                         | String used to uniquely identify your Kafka Connect             | `CDK_CLUSTERS_0_KAFKACONNECTS_0_ID`                         | true      | string  | ∅       |
| `clusters[].kafkaConnects[].name`                       | Name your Kafka Connect                                         | `CDK_CLUSTERS_0_KAFKACONNECTS_0_NAME`                       | true      | string  | ∅       |
| `clusters[].kafkaConnects[].url`                        | The Kafka connect URL                                           | `CDK_CLUSTERS_0_KAFKACONNECTS_0_URL`                        | true      | string  | ∅       |
| `clusters[].kafkaConnects[].headers`                    | Optional additional headers (ie: `X-API-Token=123,X-From=Test`) | `CDK_CLUSTERS_0_KAFKACONNECTS_0_HEADERS`                    | false     | string  | ∅       |
| `clusters[].kafkaConnects[].ignoreUntrustedCertificate` | Skip SSL certificate validation                                 | `CDK_CLUSTERS_0_KAFKACONNECTS_0_IGNOREUNTRUSTEDCERTIFICATE` | false     | boolean | `false` |
| **Basic Authentication**                                |                                                                 |                                                             |           |         |         |
| `clusters[].kafkaConnects[].security.username`          | Basic auth username                                             | `CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_USERNAME`          | false     | string  | ∅       |
| `clusters[].kafkaConnects[].security.password`          | Basic auth password                                             | `CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_PASSWORD`          | false     | string  | ∅       |
| **Bearer Token Authentication**                         |                                                                 |                                                             |           |         |         |
| `clusters[].kafkaConnects[].security.token`             | Bearer token                                                    | `CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_TOKEN`             | false     | string  | ∅       |
| **mTLS Authentication**                                 |                                                                 |                                                             |           |         |         |
| `clusters[].kafkaConnects[].security.key`               | Access key                                                      | `CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_KEY`               | false     | string  | ∅       |
| `clusters[].kafkaConnects[].security.certificateChain`  | Access certificate                                              | `CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_CERTIFICATECHAIN`  | false     | string  | ∅       |

### ksqlDB properties

This feature is available from version `1.21.0` of the Conduktor Console.

| Property                                          | Description                                          | Environment Variable                                  | Mandatory | Type    | Default |
|---------------------------------------------------|------------------------------------------------------|-------------------------------------------------------|-----------|---------|---------|
| `clusters[].ksqlDBs[].id`                         | String used to uniquely identify your ksqlDB Cluster | `CDK_CLUSTERS_0_KSQLDBS_0_ID`                         | true      | string  | ∅       |
| `clusters[].ksqlDBs[].name`                       | Name of your ksqlDB Cluster                          | `CDK_CLUSTERS_0_KSQLDBS_0_NAME`                       | true      | string  | ∅       |
| `clusters[].ksqlDBs[].url`                        | The ksqlDB API URL                                   | `CDK_CLUSTERS_0_KSQLDBS_0_URL`                        | true      | string  | ∅       |
| `clusters[].ksqlDBs[].ignoreUntrustedCertificate` | Skip SSL certificate validation                      | `CDK_CLUSTERS_0_KSQLDBS_0_IGNOREUNTRUSTEDCERTIFICATE` | false     | boolean | `false` |
| **Basic Authentication**                          |                                                      |                                                       |           |         |         |
| `clusters[].ksqlDBs[].security.username`          | Basic auth username                                  | `CDK_CLUSTERS_0_KSQLDBS_0_SECURITY_USERNAME`          | false     | string  | ∅       |
| `clusters[].ksqlDBs[].security.password`          | Basic auth password                                  | `CDK_CLUSTERS_0_KSQLDBS_0_SECURITY_PASSWORD`          | false     | string  | ∅       |
| **Bearer Token Authentication**                   |                                                      |                                                       |           |         |         |
| `clusters[].ksqlDBs[].security.token`             | Bearer token                                         | `CDK_CLUSTERS_0_KSQLDBS_0_SECURITY_TOKEN`             | false     | string  | ∅       |
| **mTLS Authentication**                           |                                                      |                                                       |           |         |         |
| `clusters[].ksqlDBs[].security.key`               | Access key                                           | `CDK_CLUSTERS_0_KSQLDBS_0_SECURITY_KEY`               | false     | string  | ∅       |
| `clusters[].ksqlDBs[].security.certificateChain`  | Access certificate                                   | `CDK_CLUSTERS_0_KSQLDBS_0_SECURITY_CERTIFICATECHAIN`  | false     | string  | ∅       |

### Indexer properties

The indexer is the internal process of Conduktor Console that fetches metadata from your Kafka cluster (e.g. topics, consumer groups, subjects).
You should modify these parameters only if you see an issue with the performance of the indexer.

| Property                                             | Description                                                                                                                            | Environment Variable                               | Mandatory | Type | Default           |
|------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|-----------|------|-------------------|
| **Lag exporter**                                     |                                                                                                                                        |                                                    |           |      |                   |
| `lagexporter.frequency`                              | Frequency in seconds of the execution of the lag exporter                                                                              | `CDK_LAGEXPORTER_FREQUENCY`                        | false     | int  | `30`              |
| `lagexporter.clusterparallelism`                     | Number of clusters indexed in parallel for the lag exporter                                                                            | `CDK_LAGEXPORTER_CLUSTERPARALLELISM`               | false     | int  | `1`               |
| `lagexporter.indexertimeout`                         | Lag exporter timeout in seconds                                                                                                        | `CDK_LAGEXPORTER_INDEXERTIMEOUT`                   | false     | int  | `300` (5 minutes) |
| **Metadata indexer**                                 |                                                                                                                                        |                                                    |           |      |                   |
| `metadataindexer.frequency`                          | Frequency in seconds of the execution of the metadata indexer                                                                          | `CDK_METADATAINDEXER_FREQUENCY`                    | false     | int  | `30`              |
| `metadataindexer.clusterparallelism`                 | Number of clusters indexed in parallel for the metadata indexer                                                                        | `CDK_METADATAINDEXER_CLUSTERPARALLELISM`           | false     | int  | `1`               |
| `metadataindexer.indexertimeout`                     | Metadata indexer timeout in seconds                                                                                                    | `CDK_METADATAINDEXER_INDEXERTIMEOUT`               | false     | int  | `300` (5 minutes) |
| **Monitoring indexer**                               |                                                                                                                                        |                                                    |           |      |                   |
| `monitoringconfig.frequency`                         | Frequency in seconds of the execution of the monitoring indexer                                                                        | `CDK_MONITORINGCONFIG_FREQUENCY`                   | false     | int  | `30`              |
| `monitoringconfig.clusterparallelism`                | Number of clusters indexed in parallel for the monitoring indexer                                                                      | `CDK_MONITORINGCONFIG_CLUSTERPARALLELISM`          | false     | int  | `1`               |
| `monitoringconfig.indexertimeout`                    | Monitoring indexer timeout in seconds                                                                                                  | `CDK_MONITORINGCONFIG_INDEXERTIMEOUT`              | false     | int  | `300` (5 minutes) |
| **Schema registry indexer**                          |                                                                                                                                        |                                                    |           |      |                   |
| `registryindexer.frequency`                          | Frequency in seconds of the execution of the schema registry indexer                                                                   | `CDK_REGISTRYINDEXER_FREQUENCY`                    | false     | int  | `30`              |
| `registryindexer.clusterparallelism`                 | Number of clusters indexed in parallel for the schema registry indexer                                                                 | `CDK_REGISTRYINDEXER_CLUSTERPARALLELISM`           | false     | int  | `1`               |
| `registryindexer.indexertimeout`                     | Schema registry indexer timeout in seconds                                                                                             | `CDK_REGISTRYINDEXER_INDEXERTIMEOUT`               | false     | int  | `300` (5 minutes) |
| **Kafka connect indexer**                            |                                                                                                                                        |                                                    |           |      |                   |
| `connectindexer.frequency`                           | Frequency in seconds of the execution of the kafka connect indexer                                                                     | `CDK_CONNECTINDEXER_FREQUENCY`                     | false     | int  | `30`              |
| `connectindexer.clusterparallelism`                  | Number of clusters indexed in parallel for the kafka connect indexer                                                                   | `CDK_CONNECTINDEXER_CLUSTERPARALLELISM`            | false     | int  | `1`               |
| `connectindexer.indexertimeout`                      | Kafka connect indexer timeout in seconds                                                                                               | `CDK_CONNECTINDEXER_INDEXERTIMEOUT`                | false     | int  | `300` (5 minutes) |
| **Kafka admin client configuration**                 |                                                                                                                                        |                                                    |           |      |                   |
| `kafka_admin.list_consumer_group_offsets_batch_size` | How many consumer groups offset to fetch in a single query. Old versions of Kafka may time out when fetching too many offsets at once. | `CDK_KAFKAADMIN_LISTCONSUMERGROUPOFFSETSBATCHSIZE` | false     | int  | `100`             |
| `kafka_admin.batch_parallel_size`                     | Maximum of batched requests that can be sent in parallel`                                                                               | `CDK_KAFKAADMIN_BATCHPARALLELSIZE`                 | false     | int  | `5`               |
