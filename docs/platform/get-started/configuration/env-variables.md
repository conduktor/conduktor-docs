---
sidebar_position: 2
title: Configuration Properties & Environment Variables
description: Conduktor Console input configuration fields can be provided using environment variables.
---

# Configuration Properties and Environment Variables


- [Docker image environment variables](#docker-image-environment-variables)
- [Console properties reference](#console-properties-reference)
  - [YAML Property Cases](#yaml-property-cases)
  - [Environment Variable Conversion](#environment-variable-conversion)
    - [Conversion edge cases](#conversion-edge-cases)
  - [Support of shell expansion in the YAML configuration file](#support-of-shell-expansion-in-the-yaml-configuration-file)
  - [Support of `*_FILE` environment variables](#support-of-_file-environment-variables)
  - [Global properties](#global-properties)
  - [Database properties](#database-properties)
  - [Session lifetime properties](#session-lifetime-properties)
  - [Local users properties](#local-users-properties)
  - [Monitoring properties](#monitoring-properties)
    - [Monitoring Configuration for Console](#monitoring-configuration-for-console)
    - [Monitoring Configuration for Cortex](#monitoring-configuration-for-cortex)
  - [SSO properties](#sso-properties)
    - [LDAP properties](#ldap-properties)
    - [OAuth2 properties](#oauth2-properties)
    - [JWT auth properties](#jwt-auth-properties)
  - [Kafka clusters properties](#kafka-clusters-properties)
  - [Kafka vendor specific properties](#kafka-vendor-specific-properties)
  - [Schema registry properties](#schema-registry-properties)
    - [Amazon Glue schema registry properties](#amazon-glue-schema-registry-properties)
  - [Kafka Connect properties](#kafka-connect-properties)
  - [ksqlDB properties](#ksqldb-properties)
  - [Indexer properties](#indexer-properties)
  - [AuditLog export properties](#auditlog-export-properties)
  - [Conduktor SQL properties](#conduktor-sql-properties)
  - [Partner zone properties](#partner-zone-properties)

## Docker image environment variables

| Environment Variable                                                                                                   | Description                                                                                                                                                 | Default Value                                                                       | Since Version |
|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|---------------|
| **[Logs](/platform/get-started/troubleshooting/logs-configuration/)**                                                  |                                                                                                                                                             |                                                                                     |               |
| `CDK_DEBUG`                                                                                                            | Enable Console debug logs (equivalent to `CDK_ROOT_LOG_LEVEL=DEBUG`)                                                                                        | `false`                                                                             | 1.0.0         |
| `CDK_ROOT_LOG_LEVEL`                                                                                                   | Set the Console global log level (one of `DEBUG`, `INFO`, `WARN`, `ERROR`)                                                                                  | `INFO`                                                                              | 1.11.0        |
| `CDK_ROOT_LOG_FORMAT`                                                                                                  | Set logs format (one of `TEXT`, `JSON`)                                                                                                                     | `TEXT`                                                                              | 1.26.0        |
| `CDK_ROOT_LOG_COLOR`                                                                                                   | Enable ANSI colors in logs                                                                                                                                  | `true`                                                                              | 1.11.0        |
| `CDK_LOG_TIMEZONE`                                                                                                     | Timezone for dates in logs (in Olson timezone ID format, e.g. `Europe/Paris`)                                                                               | `TZ` environment variable or `UTC` if `TZ` is not defined                           | 1.28.0        |
| **[Proxy settings](/platform/get-started/configuration/http-proxy-configuration/)**                                    |                                                                                                                                                             |                                                                                     |               |
| `CDK_HTTP_PROXY_HOST`                                                                                                  | Proxy hostname                                                                                                                                              | ∅                                                                                   | 1.10.0        |
| `CDK_HTTP_PROXY_PORT`                                                                                                  | Proxy port                                                                                                                                                  | `80`                                                                                | 1.10.0        |
| `CDK_HTTP_NON_PROXY_HOSTS`                                                                                             | List of hosts that should be reached directly, bypassing the proxy. Hosts must be separated by `\|`, end with a `*` for wildcards, and not contain any `/`. | ∅                                                                                   | 1.10.0        |
| `CDK_HTTP_PROXY_USERNAME`                                                                                              | Proxy username                                                                                                                                              | ∅                                                                                   | 1.10.0        |
| `CDK_HTTP_PROXY_PASSWORD`                                                                                              | Proxy password                                                                                                                                              | ∅                                                                                   | 1.10.0        |
| **[SSL](/platform/get-started/configuration/ssl-tls-configuration/#configure-custom-truststore-on-conduktor-console)** |                                                                                                                                                             |                                                                                     |               |
| `CDK_SSL_TRUSTSTORE_PATH`                                                                                              | Truststore file path used by Console for Kafka, SSO, S3,... clients SSL/TLS verification                                                                    | ∅                                                                                   | 1.5.0         |
| `CDK_SSL_TRUSTSTORE_PASSWORD`                                                                                          | Truststore password (optional)                                                                                                                              | ∅                                                                                   | 1.5.0         |
| `CDK_SSL_TRUSTSTORE_TYPE`                                                                                              | Truststore type (optional)                                                                                                                                  | `jks`                                                                               | 1.5.0         |
| `CDK_SSL_DEBUG`                                                                                                        | Enable SSL/TLS debug logs                                                                                                                                   | `false`                                                                             | 1.9.0         |
| **Java**                                                                                                               |                                                                                                                                                             |                                                                                     |               |
| `CDK_GLOBAL_JAVA_OPTS`                                                                                                 | Custom JAVA_OPTS parameters passed to Console                                                                                                               | ∅                                                                                   | 1.10.0        |
| `CONSOLE_MEMORY_OPTS`                                                                                                  | Configure [Java memory options](memory-configuration.md)                                                                                                    | `-XX:+UseContainerSupport -XX:MaxRAMPercentage=80`                                  | 1.18.0        |
| **Console**                                                                                                            |                                                                                                                                                             |                                                                                     |               |
| `CDK_LISTENING_PORT`                                                                                                   | Console listening port                                                                                                                                      | `8080`                                                                              | 1.2.0         |
| `CDK_VOLUME_DIR`                                                                                                       | Volume directory where Console stores data                                                                                                                  | `/var/conduktor`                                                                    | 1.0.2         |
| `CDK_IN_CONF_FILE`                                                                                                     | Console configuration file location                                                                                                                         | [`/opt/conduktor/default-platform-config.yaml`](introduction.md#configuration-file) | 1.0.2         |
| `CDK_PLUGINS_DIR`                                                                                                      | Volume directory for [Custom Deserializers](/platform/guides/custom-deserializers/) plugins                                                                 | `/opt/conduktor/plugins`                                                            | 1.22.0        |
| **Nginx**                                                                                                              |                                                                                                                                                             |                                                                                     |               |
| `PROXY_BUFFER_SIZE`                                                                                                    | Tune internal Nginx `proxy_buffer_size`                                                                                                                     | `8k`                                                                                | 1.16.0        |

## Console properties reference

You have multiple options to configure Console: via environment variables, or via a YAML configuration file. You can find a mapping of the configuration fields in the `platform-config.yaml` to environment variables below.

Environment variables can be set on the container or imported from a file.  When importing from a file, mount the file into the container and provide its path by setting the environment variable `CDK_ENV_FILE`. Use a .env file with key value pairs.

```
MY_ENV_VAR1=value
MY_ENV_VAR2=otherValue
```

The logs will confirm, `Sourcing environment variables from $CDK_ENV_FILE`, or warn if set and the file is not found

```
Warning: CDK_ENV_FILE is set but the file does not exist or is not readable.
```

In case you set both environment variable and YAML value for a specific field, the environment variable will take precedence.

:::note
Lists start at index 0 and are provided using `_idx_` syntax.
:::

### YAML Property Cases

YAML configuration supports multiple case formats (`camelCase`/`kebab-case`/`lowercase`) for property fragments such as:
- `clusters[].schemaRegistry.ignoreUntrustedCertificate`
- `clusters[].schema-registry.ignore-untrusted-certificate`
- `clusters[].schemaregistry.ignoreuntrustedcertificate`

All are valid and equivalent in YAML.


### Environment Variable Conversion

At startup, Conduktor Console will merge environment variables and YAML based configuration files into one unified configuration. The conversion rules are as follows:

- Filter for environment variables that start with `CDK_`
- Remove the `CDK_` prefix
- Convert the variable name to lowercase
- Replace `_` with `.` for nested properties
- Replace `_[0-9]+_` with `[0-9].` for list properties. (Lists start at index 0)

For example, the environment variables `CDK_DATABASE_URL` will be converted to `database.url`, or `CDK_SSO_OAUTH2_0_OPENID_ISSUER` will be converted into `sso.oauth2[0].openid.issuer`.
The YAML equivalent would be:

```yaml
database:
  url: "..."
sso:
  oauth2:
    - openid:
        issuer: "..."
```

:::note
When converting environment variables to YAML configuration, environment variables in `UPPER-KEBAB-CASE` will be converted to `kebab-case` in the YAML configuration.
:::

#### Conversion edge cases

Because of YAML multiple case formats support, the conversion rules have some edge cases when trying to mix environment variables and YAML configuration.

Extra rules when mixing environment variables and YAML configuration:
- Don't use `camelCase` in YAML configuration. Use `kebab-case` or `lowercase`
- Stick to one compatible case format for a given property fragment using the following compatibility matrix

Compatibility matrix:

| YAML\Environment | `UPPER-KEBAB-CASE` | `UPPERCASE` |
|------------------|--------------------|-------------|
| `kebab-case`     | ✅                 | 🚫          |
| `lowercase`      | 🚫                 | ✅          |
| `camelCase`      | 🚫                 | 🚫          |

For example `CDK_CLUSTERS_0_SCHEMAREGISTRY_IGNOREUNTRUSTEDCERTIFICATE` environment variable :

```yaml
# Is equivalent to and compatible with
clusters:
  - schemaregistry:
      ignoreuntrustedcertificate: true
# but not with
clusters:
  - schema-registry:
      ignore-untrusted-certificate: true
```

And conversely, for `CDK_CLUSTERS_0_SCHEMA-REGISTRY_IGNORE-UNTRUSTED-CERTIFICATE` environment variable.

That's why camelCase is not recommended in YAML configuration when mixing with environment variables.

### Support of shell expansion in the YAML configuration file

Console supports shell expansion for environment variables and home tilde `~`.
This is useful if you have to use custom environment variables in your configuration.

For example, you can use the following syntax:

```yaml title="YAML configuration file"
database:
  url: "jdbc:postgresql://${DB_LOGIN}:${DB_PWD}@${DB_HOST}:${DB_PORT:-5432}/${DB_NAME}"
```

with the following environment variables:

| Environment Variable | Value       |
|----------------------|-------------|
| `DB_LOGIN`           | `usr`       |
| `DB_PWD`             | `pwd`       |
| `DB_HOST`            | `some_host` |
| `DB_NAME`            | `cdk`       |


This will be expanded to:

```yaml title="Expanded configuration"
database:
  url: "jdbc:postgresql://usr:pwd@some_host:5432/cdk"
```

:::note
If you want to escape the shell expansion, you can use the following syntax: `$$`.
For example, if you want `admin.password` to be `secret$123`, you should set `admin.password: "secret$$123"`.
:::

### Support of `*_FILE` environment variables

When an environment variable ending with `_FILE` is set to a file path, its corresponding unprefixed environment variable will be replaced with the content of that file.

For instance, if you set `CDK_LICENSE_FILE=/run/secrets/license`, the value of `CDK_LICENSE` will be overridden by the content of the file located at `/run/secrets/license`.

:::warning
Exception: `CDK_IN_CONF_FILE` is not supported.
:::

### Global properties

| Property                   | Description                                                                                                                                                                                                 | Environment Variable           | Mandatory | Type    | Default     |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------|-----------|---------|-------------|
| `organization.name`        | Your organization's name                                                                                                                                                                                    | `CDK_ORGANIZATION_NAME`        | false     | string  | `"default"` |
| `admin.email`              | Your organization's root administrator account email  | `CDK_ADMIN_EMAIL`              | true      | string  | ∅           |
| `admin.password`           | Your organization's root administrator account password. Must be at least 8 characters in length, and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol | `CDK_ADMIN_PASSWORD`           | true      | string  | ∅           |
| `license`                  | Enterprise license key. If not provided, fallback to free plan. | `CDK_LICENSE` or `LICENSE_KEY` | false     | string  | ∅           |
| `platform.external.url`    | Force Console external URL. Useful for SSO callback URL when using a reverse proxy. By default, Console will try to guess it automatically using X-Forwarded-\* headers coming from upstream reverse proxy. | `CDK_PLATFORM_EXTERNAL_URL`    | false     | string  | ∅           |
| `platform.https.cert.path` | Path to the SSL certificate file                                                                                                                                                                            | `CDK_PLATFORM_HTTPS_CERT_PATH` | false     | string  | ∅           |
| `platform.https.key.path`  | Path to the SSL private key file                                                                                                                                                                            | `CDK_PLATFORM_HTTPS_KEY_PATH`  | false     | string  | ∅           |
| `enable_product_metrics`   | In order to improve Conduktor Console, we collect anonymous usage metrics. Set to `false`, this configuration disable all of our metrics collection.                                                        | `CDK_ENABLE_PRODUCT_METRICS`   | false     | boolean | `true`      |

:::tip
If you need more than what the free plan offers, you can [contact us](https://www.conduktor.io/contact/sales) for a trial license.
:::

### Database properties

See database configuration [documentation](/platform/get-started/configuration/database/) for more info.

| Property                      | Description                                                                                                                                 | Environment Variable             | Mandatory | Type   | Default |
|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|-----------|--------|---------|
| `database.url`                | External PostgreSQL configuration URL in format `[jdbc:]postgresql://[user[:password]@][[netloc][:port],...][/dbname][?param1=value1&...] ` | `CDK_DATABASE_URL`               | false     | string | ∅       |
| `database.hosts[].host`       | External PostgreSQL servers hostname                                                                                                        | `CDK_DATABASE_HOSTS_0_HOST`      | false     | string | ∅       |
| `database.hosts[].port`       | External PostgreSQL servers port                                                                                                            | `CDK_DATABASE_HOSTS_0_PORT`      | false     | int    | ∅       |
| `database.host`               | External PostgreSQL server hostname (Deprecated, use `database.hosts` instead)                                                              | `CDK_DATABASE_HOST`              | false     | string | ∅       |
| `database.port`               | External PostgreSQL server port (Deprecated, use `database.hosts` instead)                                                                  | `CDK_DATABASE_PORT`              | false     | int    | ∅       |
| `database.name`               | External PostgreSQL database name                                                                                                           | `CDK_DATABASE_NAME`              | false     | string | ∅       |
| `database.username`           | External PostgreSQL login role                                                                                                              | `CDK_DATABASE_USERNAME`          | false     | string | ∅       |
| `database.password`           | External PostgreSQL login password                                                                                                          | `CDK_DATABASE_PASSWORD`          | false     | string | ∅       |
| `database.connection_timeout` | External PostgreSQL connection timeout in seconds                                                                                           | `CDK_DATABASE_CONNECTIONTIMEOUT` | false     | int    | ∅       |

### Session lifetime properties

Optional properties for configuring [session lifetime](/platform/get-started/configuration/user-authentication/session-lifetime/).

| Property               | Description                                                                                           | Environment Variable       | Mandatory | Type | Default Value |
|------------------------|-------------------------------------------------------------------------------------------------------|----------------------------|-----------|------|---------------|
| `auth.sessionLifetime` | Max session lifetime in seconds                                                                       | `CDK_AUTH_SESSIONLIFETIME` | false     | int  | `259200`      |
| `auth.idleTimeout`     | Max idle session time in seconds (access token lifetime). Should be lower than `auth.sessionLifetime` | `CDK_AUTH_IDLETIMEOUT`     | false     | int  | `259200`      |

### Local users properties

Optional local accounts list used to log on Console

| Property                      | Description   | Environment Variable             | Mandatory | Type   | Default Value          |
|-------------------------------|---------------|----------------------------------|-----------|--------|------------------------|
| `auth.local-users[].email`    | User login    | `CDK_AUTH_LOCALUSERS_0_EMAIL`    | true      | string | `"admin@conduktor.io"` |
| `auth.local-users[].password` | User password | `CDK_AUTH_LOCALUSERS_0_PASSWORD` | true      | string | `"admin"`              |

### Monitoring properties
:::caution
Starting with version 1.18.0, if you want to benefit from our Monitoring capabilities (dashboard and alerts), you need to deploy a new image along with Console.
- `conduktor/conduktor-console:1.18.0` or above
and
- `conduktor/conduktor-console-cortex:1.18.0` or above
:::

This new image is based on [Cortex](https://github.com/cortexproject/cortex) and pre-configured to run with Console.
Cortex is a custom implementation of Prometheus used in several production systems including Amazon Managed Service for Prometheus (AMP).

You can choose to not deploy `conduktor/conduktor-console-cortex` (Cortex) image. In this case, you will not be able to see the monitoring graphs and configure alerts.

The configuration is split in 2 chapters:
- Monitoring Configuration for Console applies to `conduktor/conduktor-console`
- Monitoring Configuration for Cortex applies to `conduktor/conduktor-console-cortex`

#### Monitoring Configuration for Console

First, we need to configure Console to connect to Cortex services.
Cortex ports are configured like this by default:
- Query port 9009
- Alert Manager port 9010


| Property                                | Description                                                          | Environment Variable                     | Mandatory | Type   | Default |
|-----------------------------------------|----------------------------------------------------------------------|------------------------------------------|-----------|--------|---------|
| `monitoring.cortex-url`                 | Cortex Search Query URL with port 9009                               | `CDK_MONITORING_CORTEXURL`               | true      | string | ∅       |
| `monitoring.alert-manager-url`          | Cortex Alert Manager URL with port 9010                              | `CDK_MONITORING_ALERTMANAGERURL`         | true      | string | ∅       |
| `monitoring.callback-url`               | Console API                                                          | `CDK_MONITORING_CALLBACKURL`             | true      | string | ∅       |
| `monitoring.notifications-callback-url` | Where the Slack notification should redirect                         | `CDK_MONITORING_NOTIFICATIONCALLBACKURL` | true      | string | ∅       |
| `monitoring.clusters-refresh-interval`  | Refresh rate in seconds for metrics                                  | `CDK_MONITORING_CLUSTERREFRESHINTERVAL`  | false     | int    | `60`    |
| `monitoring.use-aggregated-metrics`         | Defines whether use the new aggregated metrics in the Console graphs | `CDK_MONITORING_USEAGGREGATEDMETRICS`      | No        | Boolean | `false` |
| `monitoring.enable-non-aggregated-metrics`  | Toggles the collection of obsolete granular metrics                  | `CDK_MONITORING_ENABLENONAGGREGATEDMETRICS` | No        | Boolean | `true`  |

:::info
`monitoring.use-aggregated-metrics` and `monitoring.enable-non-aggregated-metrics` are temporary flags to help you transition to the new metrics collection system. They will be removed in a future release.

Swap their default value if you experience performance issues when Console is connected with large Kafka clusters:
```
CDK_MONITORING_USEAGGREGATEDMETRICS: true
CDK_MONITORING_ENABLENONAGGREGATEDMETRICS: false
```
:::

#### Monitoring Configuration for Cortex

See [Cortex configuration page](/platform/get-started/configuration/cortex/) for more info.

### SSO properties

See [authentication documentation](/platform/category/configure-sso/) for snippets.

| Property                         | Description                                                              | Environment Variable                 | Mandatory | Type    | Default |
|----------------------------------|--------------------------------------------------------------------------|--------------------------------------|-----------|---------|---------|
| `sso.ignoreUntrustedCertificate` | Disable SSL checks                                                       | `CDK_SSO_IGNOREUNTRUSTEDCERTIFICATE` | false     | boolean | `false` |
| `sso.trustedCertificates`        | SSL public certificates for SSO authentication (LDAPS and OAuth2) as PEM | `CDK_SSO_TRUSTEDCERTIFICATES`        | false     | string  | ∅       |

#### LDAP properties

| Property                             | Description                                                                                                                                                                                        | Environment Variable                   | Mandatory | Type         | Default              |
|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|-----------|--------------|----------------------|
| `sso.ldap[].name`                    | Ldap connection name                                                                                                                                                                               | `CDK_SSO_LDAP_0_NAME`                  | true      | string       | ∅                    |
| `sso.ldap[].server`                  | Ldap server host and port                                                                                                                                                                          | `CDK_SSO_LDAP_0_SERVER`                | true      | string       | ∅                    |
| `sso.ldap[].managerDn`               | Sets the manager DN                                                                                                                                                                                | `CDK_SSO_LDAP_0_MANAGERDN`             | true      | string       | ∅                    |
| `sso.ldap[].managerPassword`         | Sets the manager password                                                                                                                                                                          | `CDK_SSO_LDAP_0_MANAGERPASSWORD`       | true      | string       | ∅                    |
| `sso.ldap[].search-subtree`          | Sets if the subtree should be searched.                                                                                                                                                            | `CDK_SSO_LDAP_0_SEARCHSUBTREE`         | false     | boolean      | `true`               |
| `sso.ldap[].search-base`             | Sets the base DN to search.                                                                                                                                                                        | `CDK_SSO_LDAP_0_SEARCHBASE`            | true      | string       | ∅                    |
| `sso.ldap[].search-filter`           | Sets the search filter. By default, the filter is set to `(uid={0})` for users using class type `InetOrgPerson`.                                                                                   | `CDK_SSO_LDAP_0_SEARCHFILTER`          | false     | string       | `"(uid={0})"`        |
| `sso.ldap[].search-attributes`       | Sets the attributes list to return. By default, all attributes are returned. Platform search for `uid`, `cn`, `mail`, `email`, `givenName`, `sn`, `displayName` attributes to map into user token. | `CDK_SSO_LDAP_0_SEARCHATTRIBUTES`      | false     | string array | `[]`                 |
| `sso.ldap[].groups-enabled`          | Sets if group search is enabled.                                                                                                                                                                   | `CDK_SSO_LDAP_0_GROUPSENABLED`         | false     | boolean      | `false`              |
| `sso.ldap[].groups-subtree`          | Sets if the subtree should be searched.                                                                                                                                                            | `CDK_SSO_LDAP_0_GROUPSSUBTREE`         | false     | boolean      | `true`               |
| `sso.ldap[].groups-base`             | Sets the base DN to search from.                                                                                                                                                                   | `CDK_SSO_LDAP_0_GROUPSBASE`            | true      | string       | ∅                    |
| `sso.ldap[].groups-filter`           | Sets the group search filter. If using group class type `GroupOfUniqueNames` use the filter `"uniqueMember={0}"`. For group class `GroupOfNames` use `"member={0}"`.                               | `CDK_SSO_LDAP_0_GROUPSFILTER`          | false     | string       | `"uniquemember={0}"` |
| `sso.ldap[].groups-filter-attribute` | Sets the name of the user attribute to bind to the group search filter. Defaults to the user’s DN.                                                                                                 | `CDK_SSO_LDAP_0_GROUPSFILTERATTRIBUTE` | false     | string       | ∅                    |
| `sso.ldap[].groups-attribute`        | Sets the group attribute name. Defaults to `cn`.                                                                                                                                                   | `CDK_SSO_LDAP_0_GROUPSATTRIBUTE`       | false     | string       | `"cn"`               |
| `sso.ldap[].properties`              | Additional properties that will be passed to identity provider context.                                                                                                                            | `CDK_SSO_LDAP_0_PROPERTIES`            | false     | dictionary   | ∅                    |

#### OAuth2 properties

| Property                                | Description                                                         | Environment Variable                     | Mandatory | Type                                                                                                                                         | Default |
|-----------------------------------------|---------------------------------------------------------------------|------------------------------------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------|---------|
| `sso.oauth2[].name`                     | OAuth2 connection name                                              | `CDK_SSO_OAUTH2_0_NAME`                  | true      | string                                                                                                                                       | ∅       |
| `sso.oauth2[].default`                  | Use as default                                                      | `CDK_SSO_OAUTH2_0_DEFAULT`               | true      | boolean                                                                                                                                      | ∅       |
| `sso.oauth2[].client-id`                | OAuth2 client ID                                                    | `CDK_SSO_OAUTH2_0_CLIENTID`              | true      | string                                                                                                                                       | ∅       |
| `sso.oauth2[].client-secret`            | OAuth2 client secret                                                | `CDK_SSO_OAUTH2_0_CLIENTSECRET`          | true      | string                                                                                                                                       | ∅       |
| `sso.oauth2[].openid.issuer`            | Issuer to check on token                                            | `CDK_SSO_OAUTH2_0_OPENID_ISSUER`         | true      | string                                                                                                                                       | ∅       |
| `sso.oauth2[].scopes`                   | Scopes to be requested in the client credentials request            | `CDK_SSO_OAUTH2_0_SCOPES`                | true      | string                                                                                                                                       | `[]`    |
| `sso.oauth2[].groups-claim`             | Group attribute from your identity provider                         | `CDK_SSO_OAUTH2_0_GROUPSCLAIM`           | false     | string                                                                                                                                       | ∅       |
| `sso.oauth2[].username-claim`           | Email attribute from your identity provider                         | `CDK_SSO_OAUTH2_0_USERNAMECLAIM`         | false     | string                                                                                                                                       | `email` |
| `sso.oauth2[].allow-unsigned-id-tokens` | Allow unsigned ID tokens                                            | `CDK_SSO_OAUTH2_0_ALLOWUNSIGNEDIDTOKENS` | false     | boolean                                                                                                                                      | false   |
| `sso.oauth2[].preferred-jws-algorithm`  | Configure preferred JWS algorithm                                   | `CDK_SSO_OAUTH2_0_PREFERREDJWSALGORITHM` | false     | string one of: "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "ES256", "ES256K", "ES384", "ES512", "PS256", "PS384", "PS512", "EdDSA" | ∅       |
| `sso.oauth2-logout`                     | Wether the central identity provider logout should be called or not | `CDK_SSO_OAUTH2LOGOUT`                   | false     | boolean                                                                                                                                      | true    |


#### JWT auth properties

| Property                      | Description                                   | Environment Variable            | Mandatory | Type   | Default  |
|-------------------------------|-----------------------------------------------|---------------------------------|-----------|--------|----------|
| `sso.jwt-auth.issuer`         | Issuer of your identity provider              | `CDK_SSO_JWTAUTH_ISSUER`        | true      | string | ∅        |
| `sso.jwt-auth.username-claim` | Email attribute from your identity provider   | `CDK_SSO_JWTAUTH_USERNAMECLAIM` | false     | string | `email`  |
| `sso.jwt-auth.groups-claim`   | Group attribute from your identity provider   | `CDK_SSO_JWTAUTH_GROUPSCLAIM`   | false     | string | `groups` |
| `sso.jwt-auth.api-key-claim`  | API key attribute from your identity provider | `CDK_SSO_JWTAUTH_APIKEYCLAIM`   | false     | string | `apikey` |

### Kafka clusters properties

:::caution
The new recommended way to configure clusters is through the CLI and YAML manifests.
Check the associated [KafkaCluster documentation](/platform/reference/resource-reference/console/#kafkacluster)
:::

For more information on configuring your Kafka clusters using GitOps processes, see [GitOps: Managing Cluster Configurations](/platform/get-started/configuration/configuration-snippets/#gitops-managing-cluster-configurations).

You can find sample configurations on the [Configuration Snippets](/platform/get-started/configuration/configuration-snippets/) page.

| Property                                | Description                                                    | Environment Variable                        | Mandatory | Type                                     | Default |
|-----------------------------------------|----------------------------------------------------------------|---------------------------------------------|-----------|------------------------------------------|---------|
| `clusters[].id`                         | String used to uniquely identify your Kafka cluster            | `CDK_CLUSTERS_0_ID`                         | true      | string                                   | ∅       |
| `clusters[].name`                       | Alias or user-friendly name for your Kafka cluster             | `CDK_CLUSTERS_0_NAME`                       | true      | string                                   | ∅       |
| `clusters[].color`                      | Attach a color to associate with your cluster in the UI        | `CDK_CLUSTERS_0_COLOR`                      | false     | string in hexadecimal format (`#FFFFFF`) | random  |
| `clusters[].ignoreUntrustedCertificate` | Skip SSL certificate validation                                | `CDK_CLUSTERS_0_IGNOREUNTRUSTEDCERTIFICATE` | false     | boolean                                  | `false` |
| `clusters[].bootstrapServers`           | List of host:port for your Kafka brokers separated by coma `,` | `CDK_CLUSTERS_0_BOOTSTRAPSERVERS`           | true      | string                                   | ∅       |
| `clusters[].properties`                 | Any cluster configuration properties                           | `CDK_CLUSTERS_0_PROPERTIES`                 | false     | string where each line is a property     | ∅       |

### Kafka vendor specific properties

Note that you only need to set the [Kafka cluster properties](#kafka-clusters-properties) to use the core features of Console.

However, you can get additional benefits by setting the flavor of your cluster. This corresponds to the `Provider` tab of your cluster configuration in Console.

| Property                                        | Description                                                 | Environment Variable                                | Mandatory | Type   | Default |
|-------------------------------------------------|-------------------------------------------------------------|-----------------------------------------------------|-----------|--------|---------|
| `clusters[].kafkaFlavor.type`                   | Kafka flavor type, one of `Confluent`, `Aiven`, `Gateway`   | `CDK_CLUSTERS_0_KAFKAFLAVOR_TYPE`                   | false     | string | ∅       |
| **Flavor is `Confluent`**                       | Manage Confluent Cloud service accounts, API keys, and ACLs |                                                     |           |        |         |
| `clusters[].kafkaFlavor.key`                    | Confluent Cloud API Key                                     | `CDK_CLUSTERS_0_KAFKAFLAVOR_KEY`                    | true      | string | ∅       |
| `clusters[].kafkaFlavor.secret`                 | Confluent Cloud API Secret                                  | `CDK_CLUSTERS_0_KAFKAFLAVOR_SECRET`                 | true      | string | ∅       |
| `clusters[].kafkaFlavor.confluentEnvironmentId` | Confluent Environment ID                                    | `CDK_CLUSTERS_0_KAFKAFLAVOR_CONFLUENTENVIRONMENTID` | true      | string | ∅       |
| `clusters[].kafkaFlavor.confluentClusterId`     | Confluent Cluster ID                                        | `CDK_CLUSTERS_0_KAFKAFLAVOR_CONFLUENTCLUSTERID`     | true      | string | ∅       |
| **Flavor is `Aiven`**                           | Manage Aiven service accounts and ACLs                      |                                                     |           |        |         |
| `clusters[].kafkaFlavor.apiToken`               | Aiven API token                                             | `CDK_CLUSTERS_0_KAFKAFLAVOR_APITOKEN`               | true      | string | ∅       |
| `clusters[].kafkaFlavor.project`                | Aiven project                                               | `CDK_CLUSTERS_0_KAFKAFLAVOR_PROJECT`                | true      | string | ∅       |
| `clusters[].kafkaFlavor.serviceName`            | Aiven service name                                          | `CDK_CLUSTERS_0_KAFKAFLAVOR_SERVICENAME`            | true      | string | ∅       |
| **Flavor is `Gateway`**                         | Manage Conduktor Gateway interceptors                       |                                                     |           |        |         |
| `clusters[].kafkaFlavor.url`                    | Gateway API endpoint URL                                    | `CDK_CLUSTERS_0_KAFKAFLAVOR_URL`                    | true      | string | ∅       |
| `clusters[].kafkaFlavor.user`                   | Gateway API username                                        | `CDK_CLUSTERS_0_KAFKAFLAVOR_USER`                   | true      | string | ∅       |
| `clusters[].kafkaFlavor.password`               | Gateway API password                                        | `CDK_CLUSTERS_0_KAFKAFLAVOR_PASSWORD`               | true      | string | ∅       |
| `clusters[].kafkaFlavor.virtualCluster`         | Gateway virtual cluster                                     | `CDK_CLUSTERS_0_KAFKAFLAVOR_VIRTUALCLUSTER`         | true      | string | ∅       |

### Schema registry properties

| Property                                               | Description                                  | Environment Variable                                       | Mandatory | Type                                 | Default |
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

| Property                                               | Description                                                                      | Environment Variable                                       | Mandatory | Type   | Default |
|--------------------------------------------------------|----------------------------------------------------------------------------------|------------------------------------------------------------|-----------|--------|---------|
| `clusters[].schemaRegistry.region`                     | The Glue schema registry region                                                  | `CDK_CLUSTERS_0_SCHEMAREGISTRY_REGION`                     | true      | string | ∅       |
| `clusters[].schemaRegistry.registryName`               | The Glue schema registry name                                                    | `CDK_CLUSTERS_0_SCHEMAREGISTRY_REGISTRYNAME`               | false     | string | ∅       |
| `clusters[].schemaRegistry.amazonSecurity.type`        | Authentication with credentials, one of `Credentials`, `FromContext`, `FromRole` | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_TYPE`        | true      | string | ∅       |
| **Credentials Security**                               |                                                                                  |                                                            |           |        |         |
| `clusters[].schemaRegistry.amazonSecurity.accessKeyId` | Credentials auth access key                                                      | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_ACCESSKEYID` | true      | string | ∅       |
| `clusters[].schemaRegistry.amazonSecurity.secretKey`   | Credentials auth secret key                                                      | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_SECRETKEY`   | true      | string | ∅       |
| **FromContext Security**                               |                                                                                  |                                                            |           |        |         |
| `clusters[].schemaRegistry.amazonSecurity.profile`     | Authentication profile                                                           | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_PROFILE`     | false     | string | ∅       |
| **FromRole Security**                                  |                                                                                  |                                                            |           |        |         |
| `clusters[].schemaRegistry.amazonSecurity.role`        | Authentication role                                                              | `CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_ROLE`        | true      | string | ∅       |

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

We support ksqlDB integration as of Conduktor Console `1.21.0`.

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

The [indexer](/platform/navigation/console/about-indexing/) is the internal process of Conduktor Console that fetches metadata from your Kafka cluster (e.g. topics, consumer groups, subjects).
You should modify these parameters only if you see an issue with the performance of the indexer.

| Property                                             | Description                                                                                                                                   | Environment Variable                               | Mandatory | Type | Default           |
|------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|-----------|------|-------------------|
| **Lag exporter**                                     |                                                                                                                                               |                                                    |           |      |                   |
| `lagexporter.frequency`                              | Frequency in seconds of the execution of the lag exporter                                                                                     | `CDK_LAGEXPORTER_FREQUENCY`                        | false     | int  | `30`              |
| `lagexporter.clusterparallelism`                     | Number of clusters indexed in parallel for the lag exporter                                                                                   | `CDK_LAGEXPORTER_CLUSTERPARALLELISM`               | false     | int  | `1`               |
| `lagexporter.indexertimeout`                         | Lag exporter timeout in seconds                                                                                                               | `CDK_LAGEXPORTER_INDEXERTIMEOUT`                   | false     | int  | `300` (5 minutes) |
| **Metadata indexer**                                 |                                                                                                                                               |                                                    |           |      |                   |
| `metadataindexer.frequency`                          | Frequency in seconds of the execution of the metadata indexer                                                                                 | `CDK_METADATAINDEXER_FREQUENCY`                    | false     | int  | `30`              |
| `metadataindexer.clusterparallelism`                 | Number of clusters indexed in parallel for the metadata indexer                                                                               | `CDK_METADATAINDEXER_CLUSTERPARALLELISM`           | false     | int  | `1`               |
| `metadataindexer.indexertimeout`                     | Metadata indexer timeout in seconds                                                                                                           | `CDK_METADATAINDEXER_INDEXERTIMEOUT`               | false     | int  | `300` (5 minutes) |
| **Monitoring indexer**                               |                                                                                                                                               |                                                    |           |      |                   |
| `monitoringconfig.frequency`                         | Frequency in seconds of the execution of the monitoring indexer                                                                               | `CDK_MONITORINGCONFIG_FREQUENCY`                   | false     | int  | `30`              |
| `monitoringconfig.clusterparallelism`                | Number of clusters indexed in parallel for the monitoring indexer                                                                             | `CDK_MONITORINGCONFIG_CLUSTERPARALLELISM`          | false     | int  | `1`               |
| `monitoringconfig.indexertimeout`                    | Monitoring indexer timeout in seconds                                                                                                         | `CDK_MONITORINGCONFIG_INDEXERTIMEOUT`              | false     | int  | `300` (5 minutes) |
| **Schema registry indexer**                          |                                                                                                                                               |                                                    |           |      |                   |
| `registryindexer.frequency`                          | Frequency in seconds of the execution of the schema registry indexer                                                                          | `CDK_REGISTRYINDEXER_FREQUENCY`                    | false     | int  | `30`              |
| `registryindexer.clusterparallelism`                 | Number of clusters indexed in parallel for the schema registry indexer                                                                        | `CDK_REGISTRYINDEXER_CLUSTERPARALLELISM`           | false     | int  | `1`               |
| `registryindexer.indexertimeout`                     | Schema registry indexer timeout in seconds                                                                                                    | `CDK_REGISTRYINDEXER_INDEXERTIMEOUT`               | false     | int  | `300` (5 minutes) |
| **Kafka connect indexer**                            |                                                                                                                                               |                                                    |           |      |                   |
| `connectindexer.frequency`                           | Frequency in seconds of the execution of the kafka connect indexer                                                                            | `CDK_CONNECTINDEXER_FREQUENCY`                     | false     | int  | `30`              |
| `connectindexer.clusterparallelism`                  | Number of clusters indexed in parallel for the kafka connect indexer                                                                          | `CDK_CONNECTINDEXER_CLUSTERPARALLELISM`            | false     | int  | `1`               |
| `connectindexer.indexertimeout`                      | Kafka connect indexer timeout in seconds                                                                                                      | `CDK_CONNECTINDEXER_INDEXERTIMEOUT`                | false     | int  | `300` (5 minutes) |
| **Kafka admin client configuration**                 |                                                                                                                                               |                                                    |           |      |                   |
| `kafka_admin.list_consumer_group_offsets_batch_size` | The number of consumer groups offset to fetch in a single query. Old versions of Kafka may time out when fetching too many offsets at once.        | `CDK_KAFKAADMIN_LISTCONSUMERGROUPOFFSETSBATCHSIZE` | false     | int  | `100`             |
| `kafka_admin.describe_consumer_groups_batch_size`    | The number of consumer groups to be described in a single query.                                                                                       | `CDK_KAFKAADMIN_DESCRIBECONSUMERGROUPSBATCHSIZE`   | false     | int  | `10000`           |
| `kafka_admin.batch_parallel_size`                    | Maximum of batched requests that can be sent in parallel                                                                                      | `CDK_KAFKAADMIN_BATCHPARALLELSIZE`                 | false     | int  | `5`               |
| `kafka_admin.record_size_limit`                      | Maximum size in bytes of a single message to display in the consume page. For larger messages, you'll get a link to open in a dedicated page. | `CDK_KAFKAADMIN_RECORDSIZELIMIT`                   | false     | int  | `102400` (bytes)  |

### AuditLog export properties

The audit log can be exported to a Kafka topic, once configured in Console.
For details on the available exportable events refer to: [Exportable audit log events](docs/platform/navigation/settings/audit-log.md#exportable-audit-log-events).

| Property                                            | Description                                           | Environment Variable                                  | Mandatory | Type   | Default |
|-----------------------------------------------------|-------------------------------------------------------|-------------------------------------------------------|-----------|--------|---------|
| `audit_log_publisher.cluster`                       | The cluster ID where the audit logs will be exported  | `CDK_AUDITLOGPUBLISHER_CLUSTER`                       | false     | string | ∅       |
| `audit_log_publisher.topicName`                     | The topic name where the audit logs will be exported  | `CDK_AUDITLOGPUBLISHER_TOPICNAME`                     | false     | string | ∅       |
| `audit_log_publisher.topicConfig.partition`         | The number of partitions for the audit log topic      | `CDK_AUDITLOGPUBLISHER_TOPICCONFIG_PARTITION`         | false     | int    | `1`     |
| `audit_log_publisher.topicConfig.replicationFactor` | The replication factor for the audit log topic        | `CDK_AUDITLOGPUBLISHER_TOPICCONFIG_REPLICATIONFACTOR` | false     | int    | `1`     |

### Conduktor SQL properties

In order to use Conduktor SQL, you need to configure a second database to store the Topics data.  
You can configure Conduktor SQL Database using `CDK_KAFKASQL_DATABASE_URL` or alternatively, set each value individually `CDK_KAFKASQL_DATABASE_*`.

Check the [Configure SQL guide](/platform/guides/configure-sql/) to get started.

| Property                                             | Description                                                                                                                           | Environment Variable                               | Mandatory | Type   | Default        |
|------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|-----------|--------|----------------|
| `kafka_sql.database.url`                             | External PostgreSQL configuration URL in format `[jdbc:]postgresql://[user[:password]@][[netloc][:port],...][/dbname][?param1=value1&...] ` | `CDK_KAFKASQL_DATABASE_URL`                        | false     | string | ∅               |
| `kafka_sql.database.hosts[].host`                    | External PostgreSQL servers hostname                                                                                                        | `CDK_KAFKASQL_DATABASE_HOSTS_0_HOST`               | false     | string | ∅               |
| `kafka_sql.database.hosts[].port`                    | External PostgreSQL servers port                                                                                                            | `CDK_KAFKASQL_DATABASE_HOSTS_0_PORT`               | false     | int    | ∅               |
| `kafka_sql.database.host`                            | External PostgreSQL server hostname (Deprecated, use `kafka_sql.database.hosts` instead)                                                    | `CDK_KAFKASQL_DATABASE_HOST`                       | false     | string | ∅               |
| `kafka_sql.database.port`                            | External PostgreSQL server port (Deprecated, use `kafka_sql.database.hosts` instead)                                                        | `CDK_KAFKASQL_DATABASE_PORT`                       | false     | int    | ∅               |
| `kafka_sql.database.name`                            | External PostgreSQL database name                                                                                                           | `CDK_KAFKASQL_DATABASE_NAME`                       | false     | string | ∅               |
| `kafka_sql.database.username`                        | External PostgreSQL login role                                                                                                              | `CDK_KAFKASQL_DATABASE_USERNAME`                   | false     | string | ∅               |
| `kafka_sql.database.password`                        | External PostgreSQL login password                                                                                                          | `CDK_KAFKASQL_DATABASE_PASSWORD`                   | false     | string | ∅               |
| `kafka_sql.database.connection_timeout`              | External PostgreSQL connection timeout in seconds                                                                                           | `CDK_KAFKASQL_DATABASE_CONNECTIONTIMEOUT`          | false     | int    | ∅               |

Advanced properties (typically, these do not need to be altered)

| Property                                             | Description                                                                                                                           | Environment Variable                               | Mandatory | Type   | Default        |
|------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|-----------|--------|----------------|
| `kafka_sql.commit_offset_every_in_sec`               | Frequency at which Conduktor SQL commits offsets into Kafka and flushes rows in the database                                          | `CDK_KAFKASQL_COMMITOFFSETEVERYINSEC`              | false     | int    | `30` (seconds) |
| `kafka_sql.clean_expired_record_every_in_hour`       | How often to check for expired records and delete them from the Database                                                              | `CDK_KAFKASQL_CLEANEXPIREDRECORDEVERYINHOUR`  | false     | int    | `1` (hour)     |
| `kafka_sql.refresh_topic_configuration_every_in_sec` | Frequency at which Conduktor SQL looks for new topics to start indexing or stop indexing                                              | `CDK_KAFKASQL_REFRESHTOPICCONFIGURATIONEVERYINSEC` | false     | int    | `30` (seconds) |
| `kafka_sql.consumer_group_id`                        | Consumer group used to identify Conduktor SQL                                                                                         | `CDK_KAFKASQL_CONSUMER-GROUP-ID`                   | false     | string    | `conduktor-sql`  |
| `kafka_sql.refresh_user_permissions_every_in_sec`    | Frequency at which Conduktor SQL refreshes the role permissions in the DB to match the RBAC setup in Console                          | `CDK_KAFKASQL_REFRESHUSERPERMISSIONSEVERYINSEC`                   | false     | string    | `conduktor-sql`  |

### Partner zone properties

Advanced properties (typically, these do not need to be altered).

| Property                                            | Description                                                                                                                                                                                                                                                     | Environment Variable                             | Mandatory | Type   | Default       |
|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|-----------|--------|---------------|
| `partner_zone.reconcile-with-gateway-every-seconds` | The interval at which the partner zone's state that is stored on Console, is synchronized with Gateway. A lower value results in faster alignment between the desired state and the current state on the Gateway. The default value is set to 5 seconds. | CDK_PARTNERZONE_RECONCILEWITHGATEWAYEVERYSECONDS | false     | int    | `5` (seconds) |
