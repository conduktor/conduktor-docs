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
| Environment variable              | Since Version | Until Version | Default Value                                                                          | Description                                                                                                       |
| --------------------------------- | ------------- | ------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **`CDK_DEBUG`**                   | `1.0.0`       | latest        | `false`                                                                                | Flag to enable platform debug logs                                                                                |
| **`RUN_MODE`**                    | `1.0.2`       | latest        | `nano`                                                                                 | Memory presets for the platform see [ advanced settings](../installation/hardware.md)                             |
| **`CDK_VOLUME_DIR`**              | `1.0.2`       | latest        | `/var/conduktor`                                                                       | Volume directory where Conduktor platform store data \*\*                                                         |
| **`CDK_IN_CONF_FILE`**            | `1.0.2`       | latest        | [`/opt/conduktor/default-platform-config.yaml`](./introduction.md#configuration-file)) | Conduktor platform configuration file location \*\*                                                               |
| **`CDK_LISTENING_PORT`**          | `1.2.0`       | latest        | `8080`                                                                                 | Platform listening port \*\*                                                                                      |
| **`CDK_SSL_TRUSTSTORE_PATH`**     | `1.5.0`       | latest        | None                                                                                   | Truststore file path used by platform kafka, SSO, S3, ... clients SSL/TLS verification                            |
| **`CDK_SSL_TRUSTSTORE_PASSWORD`** | `1.5.0`       | latest        | None                                                                                   | Truststore password (optional)                                                                                    |
| **`CDK_SSL_TRUSTSTORE_TYPE`**     | `1.5.0`       | latest        | `jks`                                                                                  | Truststore type (optional)                                                                                        |
| **`CDK_SSL_DEBUG`**               | `1.9.0`       | latest        | `false`                                                                                | Enable SSL/TLS debug logs                                                                                         |
| **`CDK_HTTP_PROXY_HOST`**         | `1.10.0`      | latest        | None                                                                                   | Specify [proxy settings](./http-proxy-configuration.md) that Conduktor Platform should use to access the Internet |
| **`CDK_HTTP_PROXY_PORT`**         | `1.10.0`      | latest        | `80`                                                                                   | Specify [proxy settings](./http-proxy-configuration.md) that Conduktor Platform should use to access the Internet |
| **`CDK_HTTP_NON_PROXY_HOSTS`**    | `1.10.0`      | latest        | None                                                                                   | Specify [proxy settings](./http-proxy-configuration.md) that Conduktor Platform should use to access the Internet |
| **`CDK_HTTP_PROXY_USERNAME`**     | `1.10.0`      | latest        | None                                                                                   | Specify [proxy settings](./http-proxy-configuration.md) that Conduktor Platform should use to access the Internet |
| **`CDK_HTTP_PROXY_PASSWORD`**     | `1.10.0`      | latest        | None                                                                                   | Specify [proxy settings](./http-proxy-configuration.md) that Conduktor Platform should use to access the Internet |
| **`CDK_GLOBAL_JAVA_OPTS`**        | `1.10.0`      | latest        | None                                                                                   | Custom JAVA_OPTS parameters passed to platform modules.                                                           |

## Platform properties reference

Starting from Conduktor Platform `1.2.0` input configuration fields can be provided using environment variables.

Below shows the mapping of configuration fields in the `platform-config.yaml` to environment variables.

#### Support of `*_FILE` environment variables

Since release `1.10.0`, setting an environment variable matching `*_FILE` to a file path, the prefixed environment variable will be overridden with the value specified in that file.

For example, setting `CDK_LICENSE_FILE` to `/run/secrets/license` will override `CDK_LICENSE` with the content of the file `/run/secrets/license`.

> Exception: `CDK_IN_CONF_FILE` is not supported

### Global properties

| Configuration field            | Environment variable                   | Description                                                                                                                                                                                         | Type   | Mandatory | Default value |
| ------------------------------ | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------- | ------------- |
| **`organization.name`**        | **`CDK_ORGANIZATION_NAME`**            | Your organization's name                                                                                                                                                                            | string | Yes       | `"default"`   |
| **`license`**                  | **`CDK_LICENSE`** or **`LICENSE_KEY`** | Enterprise license key. If not provided, fallback to free plan.                                                                                                                                     | string | No        | ∅             |
| **`platform.fqdn`**            | **`CDK_PLATFORM_FQDN`**                | Platform FQDN. Could be useful for SSO callback URL when using a reverse proxy. The platform will try to guess it automatically using `X-Forwarded-Host` header coming from upstream reverse proxy. | string | No        | `"localhost"` |
| **`platform.https.cert.path`** | **`CDK_PLATFORM_HTTPS_CERT_PATH`**     | Path to the SSL `certificate` file                                                                                                                                                                  | string | No        | ∅             |
| **`platform.https.key.path`**  | **`CDK_PLATFORM_HTTPS_KEY_PATH`**      | Path to the SSL `private key` file                                                                                                                                                                  | string | No        | ∅             |

> **Tips** : If you need more that what free plan offer, you can [contact us](https://www.conduktor.io/contact/sales) for a trial license.

### Database properties

See database configuration [documentation](./database) for more info

| Configuration field               | Environment variable                                                 | Description                                                                                                                        | Type    | Mandatory | Default value |
| --------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------- | --------- | ------------- |
| **`database.url`**                | **`CDK_DATABASE_URL`** (prior to `1.2.0` it was *`PLATFORM_DB_URL`*) | External PostgreSQL configuration URL in format `[jdbc:]postgresql://[user[:password]@]netloc[:port][/dbname][?param1=value1&...]` | string  | No        | ∅             |
| **`database.host`**               | **`CDK_DATABASE_HOST`**                                              | External PostgreSQL server hostname                                                                                                | string  | No        | ∅             |
| **`database.port`**               | **`CDK_DATABASE_PORT`**                                              | External PostgreSQL server port                                                                                                    | integer | No        | ∅             |
| **`database.name`**               | **`CDK_DATABASE_NAME`**                                              | External PostgreSQL database name                                                                                                  | string  | No        | ∅             |
| **`database.username`**           | **`CDK_DATABASE_USERNAME`**                                          | External PostgreSQL login role                                                                                                     | string  | No        | ∅             |
| **`database.password`**           | **`CDK_DATABASE_PASSWORD`**                                          | External PostgreSQL login password                                                                                                 | string  | No        | ∅             |
| **`database.connection_timeout`** | **`CDK_DATABASE_CONNECTIONTIMEOUT`**                                 | External PostgreSQL connection timeout in seconds                                                                                  | integer | No        | ∅             |
### Monitoring properties

| Configuration field                         | Environment variable                            | Description                                       | Type    | Since Version | Mandatory | Default value |
| ------------------------------------------- | ----------------------------------------------- | ------------------------------------------------- | ------- | ------------- | --------- | ------------- |
| **`monitoring.storage.s3.endpoint`**        | **`CDK_MONITORING_STORAGE_S3_ENDPOINT`**        | External monitoring S3 storage endpoint           | string  | `1.5.0`       | No        | ∅             |
| **`monitoring.storage.s3.region`**          | **`CDK_MONITORING_STORAGE_S3_REGION`**          | External monitoring S3 storage region             | string  | `1.5.0`       | No        | ∅             |
| **`monitoring.storage.s3.bucket`**          | **`CDK_MONITORING_STORAGE_S3_BUCKET`**          | External monitoring S3 storage bucket name        | string  | `1.5.0`       | Yes       | ∅             |
| **`monitoring.storage.s3.insecure`**        | **`CDK_MONITORING_STORAGE_S3_INSECURE`**        | External monitoring S3 storage SSL/TLS check flag | boolean | `1.5.0`       | No        | `false`       |
| **`monitoring.storage.s3.accessKeyId`**     | **`CDK_MONITORING_STORAGE_S3_ACCESSKEYID`**     | External monitoring S3 storage access key         | string  | `1.5.0`       | Yes       | ∅             |
| **`monitoring.storage.s3.secretAccessKey`** | **`CDK_MONITORING_STORAGE_S3_SECRETACCESSKEY`** | External monitoring S3 storage access key secret  | string  | `1.5.0`       | Yes       | ∅             |

### Kafka clusters properties

| Configuration field                         | Environment variable                            | Description                                                          | Type                                     | Mandatory | Default value |
| ------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------- | --------- | ------------- |
| **`clusters[].id`**                         | **`CDK_CLUSTERS_0_ID`**                         | String used to uniquely identify your Kafka cluster                  | string                                   | Yes       | ∅             |
| **`clusters[].name`**                       | **`CDK_CLUSTERS_0_NAME`**                       | Alias or user-friendly name for your Kafka cluster                   | string                                   | Yes       | ∅             |
| **`clusters[].color`**                      | **`CDK_CLUSTERS_0_COLOR`**                      | Attach a color to associate with your cluster in the UI              | string in hexadecimal format (`#FFFFFF`) | No        | random        |
| **`clusters[].ignoreUntrustedCertificate`** | **`CDK_CLUSTERS_0_IGNOREUNTRUSTEDCERTIFICATE`** | Skip SSL certificate validation                                      | boolean                                  | No        | `false`       |
| **`clusters[].bootstrapServers`**           | **`CDK_CLUSTERS_0_BOOTSTRAPSERVERS`**           | List of host:port for your Kafka brokers separated by coma `,`       | string                                   | Yes       | ∅             |
| **`clusters[].zookeeperServer`**            | **`CDK_CLUSTERS_0_ZOOKEEPERSERVER`**            | Zookeeper server url                                                 | string                                   | No        | ∅             |
| **`clusters[].properties`**                 | **`CDK_CLUSTERS_0_PROPERTIES`**                 | Any cluster configuration properties                                 | string where each line is a property     | No        | ∅             |
| **`clusters[].jmxScrapePort`**              | **`CDK_CLUSTERS_0_JMXSCRAPEPORT`**              | JMX-exporter port used to scrape kafka broker metrics for monitoring | integer                                  | No        | `9101`        |
| **`clusters[].nodeScrapePort`**             | **`CDK_CLUSTERS_0_NODESCRAPEPORT`**             | Node-exporter port used to scrape kafka host metrics for monitoring  | integer                                  | No        | `9100`        |

> **Tips** : For clusters[].properties you can set multi-line properties using environment variable, separate each properties with `\n` like `prop1=value1\nprop3=value3`.

### Schema registry properties

| Configuration field                | Environment variable                   | Description                                           | Type   | Mandatory | Default value |
| ---------------------------------- | -------------------------------------- | ----------------------------------------------------- | ------ | --------- | ------------- |
| **`clusters[].schemaRegistry.id`** | **`CDK_CLUSTERS_0_SCHEMAREGISTRY_ID`** | String used to uniquely identify your schema registry | string | Yes       | ∅             |

#### Confluent schema registry properties

| Configuration field                                        | Environment variable                                           | Description                                  | Type                                 | Mandatory | Default value |
| ---------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------- | ------------------------------------ | --------- | ------------- |
| **`clusters[].schemaRegistry.url`**                        | **`CDK_CLUSTERS_0_SCHEMAREGISTRY_URL`**                        | The schema registry URL                      | string                               | Yes       | ∅             |
| **`clusters[].schemaRegistry.ignoreUntrustedCertificate`** | **`CDK_CLUSTERS_0_SCHEMAREGISTRY_IGNOREUNTRUSTEDCERTIFICATE`** | Skip SSL certificate validation              | boolean                              | No        | `false`       |
| **`clusters[].schemaRegistry.properties`**                 | **`CDK_CLUSTERS_0_SCHEMAREGISTRY_PROPERTIES`**                 | Any schema registry configuration parameters | string where each line is a property | No        | ∅             |

> **Tips** : For clusters[].schemaRegistry.properties, you can set multi-line properties using environment variable, separate each properties with `\n` like `prop1=value1\nprop3=value3`.

If you need to authenticate with basic auth, you can use the following properties:

| Configuration field                               | Environment variable                                  | Description         | Type   | Mandatory | Default value |
| ------------------------------------------------- | ----------------------------------------------------- | ------------------- | ------ | --------- | ------------- |
| **`clusters[].schemaRegistry.security.username`** | **`CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_USERNAME`** | Basic auth username | string | No        | ∅             |
| **`clusters[].schemaRegistry.security.password`** | **`CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_PASSWORD`** | Basic auth password | string | No        | ∅             |

If you need to authenticate with bearer auth, you can use the following property:

| Configuration field                            | Environment variable                               | Description       | Type   | Mandatory | Default value |
| ---------------------------------------------- | -------------------------------------------------- | ----------------- | ------ | --------- | ------------- |
| **`clusters[].schemaRegistry.security.token`** | **`CDK_CLUSTERS_0_SCHEMAREGISTRY_SECURITY_TOKEN`** | Bearer auth token | string | No        | ∅             |

#### Amazon Glue schema registry properties

| Configuration field                                 | Environment variable                                    | Description                     | Type   | Since Version | Mandatory | Default value | Values                                   |
| --------------------------------------------------- | ------------------------------------------------------- | ------------------------------- | ------ | ------------- | --------- | ------------- | ---------------------------------------- |
| **`clusters[].schemaRegistry.region`**              | **`CDK_CLUSTERS_0_SCHEMAREGISTRY_REGION`**              | The Glue schema registry region | string | `1.x.x`       | Yes       | ∅             |                                          |
| **`clusters[].schemaRegistry.registryName`**        | **`CDK_CLUSTERS_0_SCHEMAREGISTRY_REGISTRYNAME`**        | The Glue schema registry name   | string | `1.x.x`       | No        | ∅             |                                          |
| **`clusters[].schemaRegistry.amazonSecurity.type`** | **`CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_TYPE`** | Authentication with credentials | string | `1.x.x`       | Yes       | ∅             | `Credentials`, `FromContext`, `FromRole` |

If `amazonSecurity.type` is `Credentials`, you must use the following properties:

| Configuration field                                        | Environment variable                                           | Description                 | Type   | Since Version | Mandatory | Default value |
| ---------------------------------------------------------- | -------------------------------------------------------------- | --------------------------- | ------ | ------------- | --------- | ------------- |
| **`clusters[].schemaRegistry.amazonSecurity.accessKeyId`** | **`CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_ACCESSKEYID`** | Credentials auth access key | string | `1.x.x`       | Yes       | ∅             |
| **`clusters[].schemaRegistry.amazonSecurity.secretKey`**   | **`CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_SECRETKEY`**   | Credentials auth secret key | string | `1.x.x`       | Yes       | ∅             |

If `amazonSecurity.type` is `FromContext`, you must use the following properties:

| Configuration field                                    | Environment variable                                       | Description            | Type   | Since Version | Mandatory | Default value |
| ------------------------------------------------------ | ---------------------------------------------------------- | ---------------------- | ------ | ------------- | --------- | ------------- |
| **`clusters[].schemaRegistry.amazonSecurity.profile`** | **`CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_PROFILE`** | Authentication profile | string | `1.x.x`       | No        | ∅             |

If `amazonSecurity.type` is `FromRole`, you must use the following properties:


| Configuration field                                 | Environment variable                                    | Description         | Type   | Since Version | Mandatory | Default value |
| --------------------------------------------------- | ------------------------------------------------------- | ------------------- | ------ | ------------- | --------- | ------------- |
| **`clusters[].schemaRegistry.amazonSecurity.role`** | **`CDK_CLUSTERS_0_SCHEMAREGISTRY_AMAZONSECURITY_ROLE`** | Authentication role | string | `1.x.x`       | Yes       | ∅             |

#### Kafka Connect properties

| Configuration field                                | Environment variable                                   | Description                                         | Type   | Since Version | Mandatory | Default value |
| -------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------- | ------ | ------------- | --------- | ------------- |
| **`clusters[].kafkaConnects[].id`**                | **`CDK_CLUSTERS_0_KAFKACONNECTS_0_ID`**                | String used to uniquely identify your Kafka Connect | string | Yes           | ∅         |               |
| **`clusters[].kafkaConnects[].url`**               | **`CDK_CLUSTERS_0_KAFKACONNECTS_0_URL`**               | The Kafka connect URL                               | string | Yes           | ∅         |               |
| **`clusters[].kafkaConnects[].security.username`** | **`CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_USERNAME`** | Basic auth username                                 | string | No            | ∅         |               |
| **`clusters[].kafkaConnects[].security.password`** | **`CDK_CLUSTERS_0_KAFKACONNECTS_0_SECURITY_PASSWORD`** | Basic auth password                                 | string | No            | ∅         |               |

### Environment properties (for governance feature)

Optional list of environments used by governance.

| Configuration field    | Environment variable       | Description                         | Type   | Mandatory | Default value |
| ---------------------- | -------------------------- | ----------------------------------- | ------ | --------- | ------------- |
| **`envs[].name`**      | **`CDK_ENVS_0_NAME`**      | Environment name used by governance | string | Yes       | ∅             |
| **`envs[].clusterId`** | **`CDK_ENVS_0_CLUSTERID`** | Environment linked clusterId        | string | Yes       | ∅             |

### Application properties (for governance feature)

Optional list of applications used by governance.

| Configuration field              | Environment variable                 | Description             | Type                               | Mandatory | Default value |
| -------------------------------- | ------------------------------------ | ----------------------- | ---------------------------------- | --------- | ------------- |
| **`applications[].name`**        | **`CDK_APPLICATIONS_0_NAME`**        | Application name        | string                             | Yes       | ∅             |
| **`applications[].description`** | **`CDK_APPLICATIONS_0_DESCRIPTION`** | Application description | string                             | No        | ∅             |
| **`applications[].slug`**        | **`CDK_APPLICATIONS_0_SLUG`**        | Application slug        | string                             | Yes       | ∅             |
| **`applications[].tags[]`**      | **`CDK_APPLICATIONS_0_TAGS`**        | Application tags list   | string                             | No        | ∅             |
| **`applications[].owner`**       | **`CDK_APPLICATIONS_0_OWNER`**       | Application owner email | string (e.g: `U:user@company.com`) | Yes       | ∅             |

### Local users properties

Optional local accounts list used to login on conduktor-platform

| Configuration field               | Environment variable                 | Description   | Type   | Mandatory | Default value          |
| --------------------------------- | ------------------------------------ | ------------- | ------ | --------- | ---------------------- |
| **`auth.local-users[].email`**    | **`CDK_AUTH_LOCALUSERS_0_EMAIL`**    | User login    | string | Yes       | `"admin@conduktor.io"` |
| **`auth.local-users[].password`** | **`CDK_AUTH_LOCALUSERS_0_PASSWORD`** | User password | string | Yes       | `"admin"`              |

### SSO properties

SSO authentication properties (only on enterprise plan).
See authentication [documentation](./user-authentication) for snipets

| Configuration field                  | Environment variable                   | Description        | Type    | Since Version | Mandatory | Default value |
| ------------------------------------ | -------------------------------------- | ------------------ | ------- | ------------- | --------- | ------------- |
| **`sso.ignoreUntrustedCertificate`** | **`SSO_IGNORE-UNTRUSTED-CERTIFICATE`** | Disable SSL checks | boolean | `1.3.0`       | No        | `false`       |

#### LDAP properties

| Configuration field                      | Environment variable                     | Description                                                                                                                                                                                       | Type         | Since Version | Mandatory | Default value        |
| ---------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------- | --------- | -------------------- |
| **`sso.ldap[].name`**                    | **`SSO_LDAP_0_NAME`**                    | Ldap connection name                                                                                                                                                                              | string       | None          | Yes       | ∅                    |
| **`sso.ldap[].server`**                  | **`SSO_LDAP_0_SERVER`**                  | Ldap server host and port                                                                                                                                                                         | string       | None          | Yes       | ∅                    |
| **`sso.ldap[].managerDn`**               | **`SSO_LDAP_0_MANAGERDN`**               | Sets the manager DN                                                                                                                                                                               | string       | None          | Yes       | ∅                    |
| **`sso.ldap[].managerPassword`**         | **`SSO_LDAP_0_MANAGERPASSWORD`**         | Sets the manager password                                                                                                                                                                         | string       | None          | Yes       | ∅                    |
| **`sso.ldap[].search-subtree`**          | **`SSO_LDAP_0_SEARCH-SUBTREE`**          | Sets if the subtree should be searched                                                                                                                                                            | boolean      | `1.5.0`       | No        | `true`               |
| **`sso.ldap[].search-base`**             | **`SSO_LDAP_0_SEARCH-BASE`**             | Sets the base DN to search                                                                                                                                                                        | string       | None          | Yes       | ∅                    |
| **`sso.ldap[].search-filter`**           | **`SSO_LDAP_0_SEARCH-FILTER`**           | Sets the search filter. By default, the filter is set to `(uid={0})` for users using class type `InetOrgPerson`                                                                                   | string       | `1.5.0`       | No        | `"(uid={0})"`        |
| **`sso.ldap[].search-attributes`**       | **`SSO_LDAP_0_SEARCH-ATTRIBUTES`**       | Sets the attributes list to return. By default, all attributes are returned. Platform search for `uid`, `cn`, `mail`, `email`, `givenName`, `sn`, `displayName` attributes to map into user token | string array | `1.5.0`       | No        | `[]`                 |
| **`sso.ldap[].groups-enabled`**          | **`SSO_LDAP_0_GROUPS-ENABLED`**          | Sets if group search is enabled                                                                                                                                                                   | boolean      | `1.5.0`       | No        | `false`              |
| **`sso.ldap[].groups-subtree`**          | **`SSO_LDAP_0_GROUPS-SUBTREE`**          | Sets if the subtree should be searched                                                                                                                                                            | boolean      | `1.5.0`       | No        | `true`               |
| **`sso.ldap[].groups-base`**             | **`SSO_LDAP_0_GROUPS-BASE`**             | Sets the base DN to search from                                                                                                                                                                   | string       | None          | Yes       | ∅                    |
| **`sso.ldap[].groups-filter`**           | **`SSO_LDAP_0_GROUPS-FILTER`**           | Sets the group search filter. For group class `GroupOfUniqueNames`, use the default value. For group class `GroupOfNames`, use `"member={0}"`.                                                    | string       | `1.5.0`       | No        | `"uniqueMember={0}"` |
| **`sso.ldap[].groups-filter-attribute`** | **`SSO_LDAP_0_GROUPS-FILTER-ATTRIBUTE`** | Sets the name of the user attribute to bind to the group search filter. Defaults to the user’s DN.                                                                                                | string       | `1.5.0`       | No        | ∅                    |
| **`sso.ldap[].groups-attribute`**        | **`SSO_LDAP_0_GROUPS-ATTRIBUTE`**        | Sets the group attribute name.                                                                                                                                                                    | string       | `1.5.0`       | No        | `"cn"`               |

#### OAuth2 properties

| Configuration field                  | Environment variable                 | Description                                             | Type    | Mandatory | Default value                                                                                                              | Values |
| ------------------------------------ | ------------------------------------ | ------------------------------------------------------- | ------- | --------- | -------------------------------------------------------------------------------------------------------------------------- | ------ |
| **`sso.oauth2[].name`**              | **`SSO_OAUTH2_0_NAME`**              | OAuth2 connection name                                  | string  | Yes       | ∅                                                                                                                          |        |
| **`sso.oauth2[].default`**           | **`SSO_OAUTH2_0_DEFAULT`**           | Use as default                                          | boolean | Yes       | ∅                                                                                                                          |        |
| **`sso.oauth2[].client-id`**         | **`SSO_OAUTH2_0_CLIENT-ID`**         | OAuth2 client id                                        | string  | Yes       | ∅                                                                                                                          |        |
| **`sso.oauth2[].client-secret`**     | **`SSO_OAUTH2_0_CLIENT-SECRET`**     | OAuth2 client secret                                    | string  | Yes       | ∅                                                                                                                          |        |
| **`sso.oauth2[].openid.issuer`**     | **`SSO_OAUTH2_0_OPENID_ISSUER`**     | Issuer to check on token                                | string  | Yes       | ∅                                                                                                                          |        |
| **`sso.oauth2[].scopes`**            | **`SSO_OAUTH2_0_SCOPES`**            | Scope to be requested in the client credentials request | string  | Yes       | `[]`                                                                                                                       |        |
| **`sso.oauth2[].authorization-url`** | **`SSO_OAUTH2_0_AUTHORIZATION-URL`** | Authorization endpoint URL                              | string  | No        | ∅                                                                                                                          |        |
| **`sso.oauth2[].token.url`**         | **`SSO_OAUTH2_0_TOKEN_URL`**         | Get token endpoint URL                                  | string  | No        | ∅                                                                                                                          |        |
| **`sso.oauth2[].token.auth-method`** | **`SSO_OAUTH2_0_TOKEN_AUTH-METHOD`** | Authentication Method                                   | No      | ∅         | `"CLIENT_SECRET_BASIC"`, `"CLIENT_SECRET_JWT"`, `"CLIENT_SECRET_POST"`, `"NONE"`, `"PRIVATE_KEY_JWT"`, `"TLS_CLIENT_AUTH"` |        |

> **Note** : In environment variables, lists start at index 0 and are provided using `_idx_` syntax.
