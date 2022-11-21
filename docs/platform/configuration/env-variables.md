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
| ENV | Since Version | Until Version | Default Value |   | 
|-----|---------------|---------------|---------------|---|
| **`RUN_MODE`**          | 1.0.2 | latest | `nano` | Memory presets for the platform see [ advanced settings](../installation/hardware.md)
| **`CDK_VOLUME_DIR`**    | 1.0.2 | latest | `/var/conduktor` | Volume directory where Conduktor platform store data **|
| **`CDK_IN_CONF_FILE`**  | 1.0.2 | latest | [`/opt/conduktor/default-platform-config.yaml`](./introduction.md#configuration-file)) | Conduktor platform configuration file location **|
| **`CDK_LISTENING_PORT`** | 1.2.0 | latest | `8080` | Platform listening port **|
| **`CDK_SSL_TRUSTSTORE_PATH`** | 1.5.0 | latest | None | Truststore file path used by platform kafka, SSO, S3, ... clients SSL/TLS verification
| **`CDK_SSL_TRUSTSTORE_PASSWORD`** | 1.5.0 | latest | None | Truststore password (optional)
| **`CDK_SSL_TRUSTSTORE_TYPE`** | 1.5.0 | latest | `jks` | Truststore type (optional)

## Platform properties reference

Starting from Conduktor Platform `1.2.0` input configuration fields can be provided using environment variables.

Below shows the mapping of configuration fields in the `platform-config.yaml` to environment variables.

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

### Kafka clusters properties

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

- **`clusters[].schemaRegistry.id`** : String used to uniquely identify your schema registry

  - _Env_ : **`CDK_CLUSTERS_0_SCHEMAREGISTRY_ID`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

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

### Environment properties (for governance feature)

Optional list of environments used by governance.

- **`envs[].name`** : Environment name used by governance

  - _Env_ : **`CDK_ENVS_0_NAME`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`envs[].clusterId`** : Environment linked clusterId
  - _Env_ : **`CDK_ENVS_0_CLUSTERID`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

### Application properties (for governance feature)

Optional list of applications used by governance.

- **`applications[].name`** : Application name

  - _Env_ : **`CDK_APPLICATIONS_0_NAME`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`applications[].description`** : Application description

  - _Env_ : **`CDK_APPLICATIONS_0_DESCRIPTION`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

- **`applications[].slug`** : Application slug

  - _Env_ : **`CDK_APPLICATIONS_0_SLUG`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`applications[].tags[]`** : Application tags list

  - _Env_ : **`CDK_APPLICATIONS_0_TAGS`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅

- **`applications[].owner`** : Application owner email
  - _Env_ : **`CDK_APPLICATIONS_0_OWNER`**
  - _Mandatory_ : true
  - _Type_ : string (e.g: `U:user@company.com`)
  - _Default_ : ∅

### Local users properties

Optional local accounts list used to login on conduktor-platform

- **`auth.local-users[].email`** : User login

  - _Env_ : **`CDK_AUTH_LOCALUSERS_0_EMAIL`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : `"admin@conduktor.io"`

- **`auth.local-users[].password`** : User password
  - _Env_ : **`CDK_AUTH_LOCALUSERS_0_PASSWORD`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : `"admin"`

### SSO properties

SSO authentication properties (only on enterprise plan).
See authentication [documentation](./user-authentication) for snipets

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

  - _Env_ : **`SSO_LDAP_0_SEARCH-subtree`**
  - _Mandatory_ : false
  - _Type_ : boolean
  - _Default_ : `true`
  - _Since_ : `1.5.0`

- **`sso.ldap[].search-base`** : Sets the base DN to search.

  - _Env_ : **`SSO_LDAP_0_SEARCH-BASE`**
  - _Mandatory_ : true
  - _Type_ : string
  - _Default_ : ∅

- **`sso.ldap[].search-filter`** : Sets the search filter.

  - _Env_ : **`SSO_LDAP_0_SEARCH-FILTER`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : `"(uid={0})"`
  - _Since_ : `1.5.0`

- **`sso.ldap[].search-attributes`** : Sets the attributes list to return.

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

- **`sso.ldap[].groups-filter`** : Sets the group search filter.

  - _Env_ : **`SSO_LDAP_0_GROUPS-FILTER`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : `"uniquemember={0}"`
  - _Since_ : `1.5.0`

- **`sso.ldap[].groups-filter-attribute`** : Sets the name of the user attribute to bind to the group search filter.

  - _Env_ : **`SSO_LDAP_0_GROUPS-FILTER-ATTRIBUTE`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : ∅
  - _Since_ : `1.5.0`

- **`sso.ldap[].groups-attribute`** : SSets the group attribute name
  - _Env_ : **`SSO_LDAP_0_GROUPS-ATTRIBUTE`**
  - _Mandatory_ : false
  - _Type_ : string
  - _Default_ : `"cn"`
  - _Since_ : `1.5.0`

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

> **Note** : In environment variables, lists start at index 0 and are provided using `_idx_` syntax.
