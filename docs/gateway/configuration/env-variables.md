---
sidebar_position: 2
title: Environment Variables
description: Conduktor Gateway connections to Kafka are configured by prefixed and translated environment variables.
---

# Environment Variables

Configuring the environment variables is the recommended way of setting up Conduktor Gateway.


Jump to:

- [Kafka Environment Variables](#kafka-environment-variables)
- [Gateway Environment Variables](#gateway-environment-variables)
  - [Host/Port](#hostport)
  - [Load Balancing](#load-balancing)
  - [Client to Gateway Authentication](#client-to-gateway-authentication)
  - [Security Provider](#security-provider)
  - [Secret management](#secret-management)
  - [HTTP](#http)
  - [Internal State](#internal-state)
  - [Internal Setup](#internal-setup)
  - [Feature Flags](#feature-flags)
  - [Licensing](#licensing)
  - [Audit](#audit)
  - [Logging](#logging)
  - [Product Analytics](#product-analytics)

## Kafka Environment Variables

Conduktor Gateway's connection to Kafka are configured by the `KAFKA_` environment variables.
When translating Kafka's properties, use upper case instead and replace the `.` with `_`.  

For example;  
When defining Gateway's Kafka property `bootstrap.servers` , declare it as the environment variable `KAFKA_BOOTSTRAP_SERVERS`.

Any variable prefixed with `KAFKA_` will be treated as a connection parameter by Gateway.


## Gateway Environment Variables

Default configurations for Conduktor Gateway can be overridden by environment variables.

### Guidelines

There is no typical deployment of Gateway as every environment will be unique in it's design considerations and security requirements.

The below is an example including some variables we recommend you modify in any setup you do, but is by no
means a guarantee of sufficient requirements in your setup.

We will support you in onboarding of Conduktor Gateway to help you get setup in the first place and for any ongoing
issues or questions please contact support at `support@conduktor.io`.

__Example Values__

```shell
  -e KAFKA_BOOTSTRAP_SERVERS=kafka1:9092,kafka2:9092 \
  -e KAFKA_SASL_MECHANISM=PLAIN \
  -e KAFKA_SECURITY_PROTOCOL=SASL_PLAINTEXT \
  -e KAFKA_SASL_JAAS_CONFIG="org.apache.kafka.common.security.plain.PlainLoginModule required username='usr' password='pwd';"
```

### Host/Port

| Environment Variable      | Default Value                          | Description                                                                                                                                                                                                                                                                                     |
|---------------------------|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_BIND_HOST`       | `0.0.0.0`                              | The host on which to bind the gateway                                                                                                                                                                                                                                                           |
| `GATEWAY_ADVERTISED_HOST` | defaults to your hostname              | The gateway hostname that should be presented to clients                                                                                                                                                                                                                                        |
| `GATEWAY_PORT_START`      | `6969`                                 | Port on which Gateway will start listening on                                                                                                                                                                                                                                                   |
| `GATEWAY_PORT_COUNT`      | defaults to your number of brokers +2  | Number of ports to be used by the Gateway, each port will correspond to a broker in the Kafka cluster so it must be at least as large as the broker count of the Kafka cluster. In production, we recommend it is double the size of the Kafka cluster to allow for expansion and reassignment. |
| `GATEWAY_ADVERTISED_SNI_PORT`       | none                              | Port to be advertised to client if routing mechanism is set to `host` for SNI routing.   |


### Load Balancing

| Environment Variable                            | Default Value      | Description                                                                                                              |
|-------------------------------------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_CLUSTER_ID`                            | `conduktorGateway` | A unique identifier for a given Gateway cluster, this is used to establish Gateway cluster membership for load balancing |
| `GATEWAY_FEATURE_FLAGS_INTERNAL_LOAD_BALANCING` | `true`             | Whether to use Conduktor Gateway's internal load balancer to balance connections between Gateway instances.              |
| `GATEWAY_RACK_ID`                               | none               | Similar as `broker.rack`                                                                                                 |

* `KAFKA_SECURITY` where your credentials and ACL handled your target Kafka cluster
* `GATEWAY_SECURITY` where your credentials and ACL handled by Gateway
* `VCLUSTER` where your virtual clusters, credentials and ACL handled by Gateway


### Client to Gateway Authentication

Note: These configurations apply to authentication between clients and Conduktor Gateway.
For authentication between Conduktor Gateway and Kafka see [Kafka Environment Variables](#kafka-environment-variables)

| Environment Variable        | Default Value                         | Description                                                                                                                                   |
|-----------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_SECURITY_PROTOCOL` | defaults to `KAFKA_SECURITY_PROTOCOL` | The type of authentication clients should use to connect to the gateway, valid values are `PLAINTEXT`, `SASL_PLAINTEXT`, `SASL_SSL`, `SSL`, `DELEGATED_SASL_PLAINTEXT` and `DELEGATED_SASL_SSL` |
| `GATEWAY_FEATURE_FLAGS_MANDATORY_VCLUSTER` | default to `false`     | Set if authenticated users are automaticaly assigned to `passtrhough` vcluster in it's not configured. Reject authentication if set to `true` and vcluster is not configured for a principal |

#### SSL

| Environment Variable                            | Default Value                      | Description                                       |
|-------------------------------------------------|------------------------------------|---------------------------------------------------|
| `GATEWAY_SSL_KEY_STORE_PATH`                    | `config/kafka-proxy.keystore.jks`  | Path to a keystore for SSL connections            |
| `GATEWAY_SSL_KEY_STORE_PASSWORD`                | `123456`                           | Password for the keystore defined above           |
| `GATEWAY_SSL_KEY_PASSWORD`                      | `123456`                           | Password for the key contained in the store above |
| `GATEWAY_SSL_KEY_TYPE`                          | `jks`                              | We currently only support `jks`                   |
| `GATEWAY_SSL_UPDATE_INTERVAL_MS`                | `600000`                           |                                                   |
| `GATEWAY_SSL_UPDATE_CONTEXT_INTERVAL_MINUTES`   | `5`                                | Interval in minutes to refresh SSL context        |

| Environment Variable               | Default Value                       | Description                                                                                                                                |
|------------------------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_SSL_TRUST_STORE_PATH`     | `config/kafka-proxy.truststore.jks` | Path to a keystore for SSL connections                                                                                                     |
| `GATEWAY_SSL_TRUST_STORE_PASSWORD` | `123456`                            | Password for the keystore defined above                                                                                                    |
| `GATEWAY_SSL_TRUST_STORE_TYPE`     | `jks`                               | We currently only support `jks`                                                                                                            |
| `GATEWAY_SSL_CLIENT_AUTH`          | `NONE`                              | `NONE` will not request client authentication, `OPTIONAL` will request client authentication, `REQUIRE` will require client authentication |

#### SSL Config

| Environment Variable                                    | Default Value | Description                  |
|---------------------------------------------------------|---------------|------------------------------|
| `GATEWAY_AUTHENTICATION_CONNECTION_MAX_REAUTH_MS`       | `0`           | Max Reauth                   |
| `GATEWAY_AUTHENTICATION_TIMEOUT_MS`                     | `1000`        | Timeout in ms                |
| `GATEWAY_AUTHENTICATION_EXPONENTIAL_BACKOFF_MULTIPLIER` | `2`           | Backoff multiplier on reauth |
| `GATEWAY_AUTHENTICATION_EXPONENTIAL_BACKOFF_MAX_MS`     | `5000`        | Max backoff                  |

#### OAuthbearer

Some of these definitions are taken from the Kafka documentation, e.g. [JKWS_REFRESH](https://kafka.apache.org/35/javadoc/constant-values.html#org.apache.kafka.common.config.SaslConfigs.SASL_OAUTHBEARER_JWKS_ENDPOINT_REFRESH_MS_DOC).

| Environment Variable              | Default Value | Description                                                                                                                                                                                                                                                                                                                                                                                          |
|-----------------------------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_OAUTH_JWKS_URL`          | `NULL`        |The OAuth/OIDC provider URL from which the provider's JWKS (JSON Web Key Set) can be retrieved. The URL can be HTTP(S)-based or file-based.                                                                                                                                                                                                                                                           | 
| `GATEWAY_OAUTH_EXPECTED_ISSUER`   | `NULL`        | The (optional) setting for the broker to use to verify that the JWT was created by the expected issuer. The JWT will be inspected for the standard OAuth `iss` claim and if this value is set, the broker will match it exactly against what is in the JWT's `iss` claim. If there is no match, the broker will reject the JWT and authentication will fail                                          | 
| `GATEWAY_OAUTH_EXPECTED_AUDIENCES` | `NULL`        | The (optional) comma-delimited setting for the broker to use to verify that the JWT was issued for one of the expected audiences. The JWT will be inspected for the standard OAuth `aud` claim and if this value is set, the broker will match the value from JWT's `aud` claim to see if there is an exact match. If there is no match, the broker will reject the JWT and authentication will fail. | 
| `GATEWAY_OAUTH_JWKS_REFRESH`      | `NULL`        | The (optional) value in milliseconds for the broker to wait between refreshing its JWKS (JSON Web Key Set) cache that contains the keys to verify the signature of the JWT.                                                                                                                                                                                                                          | 
| `GATEWAY_OAUTH_JWKS_RETRY`        | `NULL`        | The (optional) value in milliseconds for the initial wait between JWKS (JSON Web Key Set) retrieval attempts from the external authentication provider. JWKS retrieval uses an exponential backoff algorithm with an initial wait based on the sasl.oauthbearer.jwks.endpoint.retry.backoff.ms setting and will double in wait length between attempts up to a maximum wait length specified by the sasl.oauthbearer.jwks.endpoint.retry.backoff.max.ms setting                                                                                                                                                                                                                                                                                                                                                                                    | 
| `GATEWAY_OAUTH_JWKS_MAX_RETRY`    | `NULL`        | The (optional) value in milliseconds for the maximum wait between attempts to retrieve the JWKS (JSON Web Key Set) from the external authentication provider. JWKS retrieval uses an exponential backoff algorithm with an initial wait based on the sasl.oauthbearer.jwks.endpoint.retry.backoff.ms setting and will double in wait length between attempts up to a maximum wait length specified by the sasl.oauthbearer.jwks.endpoint.retry.backoff.max.ms setting                                                                                                                                                                                                                                                                                                                                            | 
| `GATEWAY_OAUTH_SCOPE_CLAIM_NAME`  | `NULL`        | The OAuth claim for the scope is often named `scope`, but this (optional) setting can provide a different name to use for the scope included in the JWT payload's claims if the OAuth/OIDC provider uses a different name for that claim.                                                                                                                                                            |
| `GATEWAY_OAUTH_SUB_CLAIM_NAME`    | `NULL`        | The OAuth claim for the subject is often named `sub`, but this (optional) setting can provide a different name to use for the subject included in the JWT payload's claims if the OAuth/OIDC provider uses a different name for that claim.                                                                                                                                                          |


#### SECURITY PROVIDER

| Environment Variable        | Default Value | Description                                                                                                             |
|-----------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_SECURITY_PROVIDER` | `DEFAULT`     | Specify your security provider, can be `DEFAULT` (from your JRE), `BOUNCY_CASTLE`, `BOUNCY_CASTLE_FIPS` and `CONSCRYPT` |

Please note that `CONSCRYPT` does not support Mac OS with aarch64.

#### SECRET MANAGEMENT

Secrets may be passed from configuration to Gateway using environement variables. Some suggested examples are below that may be more common, but you are free to use your own and avoid any clashes with existing environment variables. 

* `SCHEMA_REGISTRY_LOGIN`
* `SCHEMA_REGISTRY_PASSWORD`
* `AWS_ACCESS_KEY`
* `AWS_SECRET_KEY`
* `AWS_SESSION_TOKEN`
* `AZURE_CLIENT_ID`
* `AZURE_TENANT_ID`
* `AZURE_CLIENT_SECRET`
* `VAULT_TOKEN`
* `VAULT_USERNAME`
* `VAULT_PASSWORD`
* etc.

For a full list of security examples consider the [marketplace plugin pages](https://marketplace.conduktor.io/interceptors/field-level-encryption/).


### HTTP

| Environment Variable      | Default Value                                           | Description                                                                       |
|---------------------------|---------------------------------------------------------|-----------------------------------------------------------------------------------|
| `GATEWAY_HTTP_PORT`       | `8888`                                                  | The port on which the gateway will present a HTTP management API                  |
| `GATEWAY_SECURED_METRICS` | `true`                                                  | Does the HTTP management API require users?                                       |
| `GATEWAY_ADMIN_API_USERS` | `[{username: admin, password: conduktor, admin: true}]` | Users that can access the api, please note that admin is required to do any write |

### Internal State

Conduktor needs to save state, you can choose where:

| Environment Variable    | Default Value   | Description                         |
|-------------------------|-----------------|-------------------------------------|
| `GATEWAY_STORAGE_TYPE`  | `KAFKA`         | Can be `IN_MEMORY` or, `KAFKA`      |
| `GATEWAY_GROUP_ID`      | null            | Set the group name for internal topic if not defined      |
| `GATEWAY_STORE_TTL_MS`  | `604800000`     | Time between full refresh           |

#### Topics Names

State is saved in different location based on `GATEWAY_STORAGE_TYPE`

When it is set

* `KAFKA` they will be materialized as a topic.
* `IN_MEMORY` they will be stored in memory.

| Environment Variable                   | Default Value                               | Description                                                                                  |
|----------------------------------------|---------------------------------------------|----------------------------------------------------------------------------------------------|
| `GATEWAY_LICENSE_TOPIC`                | `_conduktor_gateway_license`                | Name of license topic                                                                        |
| `GATEWAY_TOPIC_MAPPINGS_TOPIC`         | `_conduktor_gateway_topicmappings`          | Name of topicMappings topic                                                                  |
| `GATEWAY_USER_MAPPINGS_TOPIC`          | `_conduktor_gateway_usermappings`           | Name of the user mapping topic                                                               |
| `GATEWAY_CONSUMER_SUBSCRIPTIONS_TOPIC` | `_conduktor_gateway_consumer_subscriptions` | Name of the subscriptions for concentrated topic consumption topic                           |
| `GATEWAY_CONSUMER_OFFSETS_TOPIC`       | `_conduktor_gateway_consumer_offsets`       | Name of the topic to store the offsets for concentrated topic consumption                    |
| `GATEWAY_INTERCEPTOR_CONFIGS_TOPIC`    | `_conduktor_gateway_interceptor_configs`    | Name of interceptor config topic                                                             |
| `GATEWAY_ENCRYPTION_CONFIGS_TOPIC`     | `_conduktor_gateway_encryption_configs`     | Name of encryption configuration stopic                                                      |
| `GATEWAY_ACLS_TOPIC`                   | `_conduktor_gateway_acls`                   | Name of the acl topic                                                                        |
| `GATEWAY_AUDIT_LOG_TOPIC`             | `_conduktor_gateway_auditlogs`              | Name of audit topic                                                                          |

#### `IN_MEMORY` State Configurations

none

#### `KAFKA` State Configurations

| Environment Variable                                         | Default Value | Description                                          |
|--------------------------------------------------------------|---------------|------------------------------------------------------|
| `GATEWAY_TOPIC_STORE_REAL_TOPIC_PARTITION_COUNT`             | `-1`          | Defaults to the one defined in your cluster settings |
| `GATEWAY_TOPIC_STORE_KCACHE_REPLICATION_FACTOR`              | `-1`          | Defaults to the one defined in your cluster settings |
| `GATEWAY_TOPIC_STORE_DISTRIBUTED_CATCHUP_TIMEOUT_IN_SECONDS` | `1`           | Duration for catchup                                 |

### Internal Setup

#### Threading

| Environment Variable                | Default Value   | Description                                                                          |
|-------------------------------------|-----------------|--------------------------------------------------------------------------------------|
| `GATEWAY_DOWNSTREAM_THREAD`         | number of cores | The number of threads dedicated to handling IO between clients and Conduktor Gateway |
| `GATEWAY_UPSTREAM_THREAD`           | number of cores | The number of threads dedicated to handling IO between Kafka and Conduktor Gateway   |

#### Upstream Connection

| Environment Variable              | Default Value | Description                                                    |
|-----------------------------------| ------------- |----------------------------------------------------------------|
| `GATEWAY_UPSTREAM_NUM_CONNECTION` | `10`          | The number of connections between Conduktor Gateway and Kafka  |
| `GATEWAY_UPSTREAM_CONNECTION_POOL_TYPE` | `NONE`          | Upstream connection pool type. Possible values are `NONE` (no connection pool), `ROUND_ROBIN` (Round robin selected connection pool)  |

### Feature Flags

| Environment Variable                            | Default Value      | Description                                                                                                                                                                |
|-------------------------------------------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_FEATURE_FLAGS_AUDIT`                   | `true`             | Whether or not to enable the audit feature                                                                                                                                 |
| `GATEWAY_FEATURE_FLAGS_INTERNAL_LOAD_BALANCING` | `true`             | Whether or not to enable we replicate kafka internal load balancing                                                                                                        |

### Licensing

| Environment Variable             | Default Value | Description                                               |
|----------------------------------| ------------- | --------------------------------------------------------- |
| `GATEWAY_LICENSE_KEY`            | None          | License key                                               |

### Audit

| Environment Variable                            | Default Value   | Description                                                                                                         |
|-------------------------------------------------|-----------------|---------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_AUDIT_LOG_CONFIG_SPEC_VERSION`         | `0.1.0`         | Version                                                                                                             |
| `GATEWAY_AUDIT_LOG_SERVICE_BACKING_TOPIC`       | `_auditLogs`    | Target topic name                                                                                                   |
| `GATEWAY_AUDIT_LOG_REPLICATION_FACTOR_OF_TOPIC` | `-1`            | Replication factor to be used when creating the audit topic, defaults to the one defined in your cluster settings   |
| `GATEWAY_AUDIT_LOG_NUM_PARTITIONS_OF_TOPIC`     | `-1`            | Number of partitions to be used when creating the audit topic, defaults to the one defined in your cluster settings |

### Logging

| Environment Variable                                   | Default Value | Description                                                                                      |
|--------------------------------------------------------|---------------|--------------------------------------------------------------------------------------------------|
| `LOG4J2_APPENDER_LAYOUT`                               | `pattern`     | The format to output console logging. Use `json` for json layout or `pattern` for pattern layout |
| `LOG4J2_ROOT_LEVEL`                                    | `info`        | The logging level for the root logger                                                            |
| `LOG4J2_ORG_APACHE_KAFKA_LEVEL`                        | `warn`        | The logging level for the package org.apache.kafka                                               |
| `LOG4J2_IO_KCACHE_LEVEL`                               | `warn`        | The logging level for the package io.kcache                                                      |
| `LOG4J2_IO_VERTX_LEVEL`                                | `warn`        | The logging level for the package io.vertx                                                       |
| `LOG4J2_IO_NETTY_LEVEL`                                | `error`       | The logging level for the package io.netty                                                       |
| `LOG4J2_IO_CONDUKTOR_LEVEL`                            | `info`        | The logging level for the package io.conduktor                                                   |
| `LOG4J2_IO_CONDUKTOR_PROXY_AUTHORIZATION_LEVEL`        | `info`        | The logging level for the package io.conduktor.proxy.authorization                               |
| `LOG4J2_IO_CONDUKTOR_PROXY_REBUILDER_COMPONENTS_LEVEL` | `info`        | The logging level for the package io.conduktor.proxy.rebuilder.components                        |
| `LOG4J2_IO_CONDUKTOR_PROXY_SERVICE_LEVEL`              | `info`        | The logging level for the package io.conduktor.proxy.service                                     |
| `LOG4J2_IO_CONDUKTOR_PROXY_NETWORK_LEVEL`              | `info`        | The logging level for the package io.conduktor.proxy.network                                     |
| `LOG4J2_IO_MICROMETER_LEVEL`                           | `error`       | The logging level for the package io.micrometer                                                  |

### Product Analytics

| Environment Variable                                   | Default Value | Description                                                                                                                                                                                                                                   |
|--------------------------------------------------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_FEATURE_FLAGS_ANALYTICS`                      | `true`        | Conduktor collects basic user analytics to understand product usage and enhance product development and improvement, such as a Gateway Started event. This is not based on any of the underlying Kafka data which is never sent to Conduktor. |