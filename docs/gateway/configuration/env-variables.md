---
sidebar_position: 99
title: Environment Variables
description: Conduktor Gateway connections to Kafka are configured by prefixed and translated environment variables.
---

# Environment Variables

Configuring the environment variables is the recommended way of setting up Conduktor Gateway.


Jump to:

- [Environment Variables](#environment-variables)
  - [Kafka Environment Variables](#kafka-environment-variables)
  - [Gateway Environment Variables](#gateway-environment-variables)
    - [Guidelines](#guidelines)
    - [Host/Port](#hostport)
    - [Load Balancing](#load-balancing)
    - [Client to Gateway Authentication](#client-to-gateway-authentication)
      - [SSL](#ssl)
      - [SSL Config](#ssl-config)
      - [MTLS](#mtls)
      - [OAuthbearer](#oauthbearer)
      - [SECURITY PROVIDER](#security-provider)
      - [SECRET MANAGEMENT](#secret-management)
    - [HTTP](#http)
    - [Internal State](#internal-state)
      - [Topics Names](#topics-names)
    - [Cluster Switching / Failover](#cluster-switching--failover)
    - [Internal Setup](#internal-setup)
      - [Threading](#threading)
      - [Upstream Connection](#upstream-connection)
    - [Feature Flags](#feature-flags)
    - [Licensing](#licensing)
    - [Audit](#audit)
    - [Logging](#logging)
    - [Product Analytics](#product-analytics)

## Kafka Environment Variables

Conduktor Gateway's connection to Kafka are configured by the `KAFKA_` environment variables.
When translating Kafka's properties, use upper case instead and replace the `.` with `_`.  

For example;  
When defining Gateway's Kafka property `bootstrap.servers`, declare it as the environment variable `KAFKA_BOOTSTRAP_SERVERS`.

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
  -e KAFKA_SECURITY_PROTOCOL=SASL_PLAINTEXT \
  -e KAFKA_SASL_MECHANISM=PLAIN \
  -e KAFKA_SASL_JAAS_CONFIG="org.apache.kafka.common.security.plain.PlainLoginModule required username='usr' password='pwd';"
```

### Host/Port

| Environment Variable             | Default Value               | Description                                                                                                                                                |
|----------------------------------|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_BIND_HOST`              | `0.0.0.0`                   | The host on which to bind the gateway                                                                                                                      |
| `GATEWAY_ADVERTISED_HOST`        | Your hostname               | The gateway hostname that should be presented to clients                                                                                                   |
| `GATEWAY_PORT_START`             | `6969`                      | Port on which Gateway will start listening on                                                                                                              |
| `GATEWAY_PORT_COUNT`             | (maxBrokerId-minBrokerId)+3 | Number of ports to be used by the Gateway, see [networking](docs/gateway/configuration/network.md#port-based-routing) for more on host/port configuration. |
| `GATEWAY_MIN_BROKERID`           | `0`                         | The broker id associated to Gateway's first port (`GATEWAY_PORT_START`), should be the lowest `broker.id` (or `node.id`) defined in the Kafka cluster.     |
| `GATEWAY_ROUTING_MECHANISM`      | `port`                      | `port` or `host`.                                                                                                                                          |
| **SNI Routing only**             |                             | Check our dedicated guide on [SNI Routing ](/gateway/how-to/sni-routing/)                                                                                  |
| `GATEWAY_ADVERTISED_SNI_PORT`    | none                        | Port to be advertised to the client if routing mechanism is set to `host` for SNI routing.                                                                 |
| `GATEWAY_ADVERTISED_HOST_PREFIX` | `broker`                    | Set the host prefix when using SNI Routing                                                                                                                 |
| `GATEWAY_SNI_HOST_SEPARATOR`     | `-`                         | Set the host separator when using SNI Routing. The value is split on the first occurence of this separator.                                                | 


### Load Balancing

| Environment Variable                            | Default Value      | Description                                                                                                              |
|-------------------------------------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_CLUSTER_ID`                            | `conduktorGateway` | A unique identifier for a given Gateway cluster, this is used to establish Gateway cluster membership for load balancing |
| `GATEWAY_FEATURE_FLAGS_INTERNAL_LOAD_BALANCING` | `true`             | Whether to use Conduktor Gateway's internal load balancer to balance connections between Gateway instances.              |
| `GATEWAY_RACK_ID`                               | none               | Similar as `broker.rack`                                                                                                 |


### Client to Gateway Authentication

Note: These configurations apply to authentication between clients and Conduktor Gateway.
For authentication between Conduktor Gateway and Kafka see [Kafka Environment Variables](#kafka-environment-variables)

| Environment Variable                       | Default Value                         | Description                                                                                                                                                                                                         |
|--------------------------------------------|---------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_SECURITY_PROTOCOL`                | defaults to `KAFKA_SECURITY_PROTOCOL` | The type of authentication clients should use to connect to the gateway, valid values are `PLAINTEXT`, `SASL_PLAINTEXT`, `SASL_SSL`, `SSL`, `DELEGATED_SASL_PLAINTEXT` and `DELEGATED_SASL_SSL`                     |
| `GATEWAY_FEATURE_FLAGS_MANDATORY_VCLUSTER` | default to `false`                    | If no virtual cluster was detected then user automatically falls back into the transparent virtual cluster, named `passthrough`. Reject authentication if set to `true` and vcluster is not configured for a principal |
| `GATEWAY_ACL_ENABLED`                      | default to `false`                    | Enable / Disable ACLs support on the Gateway (not including Virtual Clusters)                                                                                                                                       |
| `GATEWAY_SUPER_USERS`                      | empty                                 | Coma-separated list of service accounts that will be super users on the Gateway (**excluding Virtual Clusters**).<br/> Example: `alice,bob`.                                                                        |
| `GATEWAY_ACL_STORE_ENABLED`                | default to `false`                    | **Obsolete, use [VirtualCluster](/gateway/reference/resources-reference/#virtualcluster) resource now** <br />Enable / Disable ACLs support for Virtual Clusters only.                                                                                                    |

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

#### MTLS

More context for mTLS [here](/gateway/concepts/service-accounts-authentication-authorization/)

| Environment Variable                  | Default Value     | Description                                       |
|---------------------------------------|-------------------|---------------------------------------------------|
| `GATEWAY_SSL_PRINCIPAL_MAPPING_RULES` | extracts the `CN` |  mTLS leverages SSL mutual authentication to identify a Kafka client. Principal for mTLS connection can be detected from the subject certificate using the same feature as in Apache Kafka, the [SSL principal mapping](https://docs.confluent.io/platform/current/kafka/configure-mds/mutual-tls-auth-rbac.html#principal-mapping-rules-for-tls-ssl-listeners-extract-a-principal-from-a-certificate) |


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
#### PLAIN
These settings are used when credentials are managed on the Gateway, see [Client Authentication](/docs/gateway/configuration/client-authentication.md#plain) for details.

| Environment Variable        | Default Value | Description                                                                                                             |
|-----------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_USER_POOL_SECRET_KEY` | A default value is used to sign tokens and *must* be changed. | Used for the `PLAIN` mechanism when generating JWT tokens for clients. You must set a random value which is at least 256 bit long to ensure tokens can't be forged. |

#### SECURITY PROVIDER

| Environment Variable        | Default Value | Description                                                                                                             |
|-----------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_SECURITY_PROVIDER` | `DEFAULT`     | Specify your security provider, can be `DEFAULT` (from your JRE), `BOUNCY_CASTLE`, `BOUNCY_CASTLE_FIPS` and `CONSCRYPT` |

Please note that `CONSCRYPT` does not support Mac OS with aarch64.

#### SECRET MANAGEMENT

Secrets may be passed from configuration to Gateway using environment variables. Some suggested examples are below that may be more common, but you are free to use your own and avoid any clashes with existing environment variables. 

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


### HTTP

| Environment Variable                  | Default Value                                           | Description                                                                                             |
| ------------------------------------- | ------------------------------------------------------- |---------------------------------------------------------------------------------------------------------|
| `GATEWAY_HTTP_PORT`                   | `8888`                                                  | The port on which the gateway will present the HTTP management API                                      |
| `GATEWAY_SECURED_METRICS`             | `true`                                                  | Does the HTTP management API require authentication?                                                    |
| `GATEWAY_ADMIN_API_USERS`             | `[{username: admin, password: conduktor, admin: true}]` | Users that can access the api, please note that admin is required to do any write                       |
| `GATEWAY_HTTPS_CLIENT_AUTH`           | `NONE`                                                  | Client auth configuration for HTTPS incoming connection. Possible values: `NONE`, `REQUEST`, `REQUIRED` |
| `GATEWAY_HTTPS_KEY_STORE_PATH`       |                                                         | Activates HTTPS and defines the keystore to use for TLS connection                                      |
| `GATEWAY_HTTPS_KEY_STORE_PASSWORD`    |                                                         | Configures the password of the keystore used for HTTPS TLS connection                                   |
| `GATEWAY_HTTPS_TRUST_STORE_PATH`      |                                                         | Configure the truststore used for the HTTPS TLS connection                                              |
| `GATEWAY_HTTPS_TRUST_STORE_PASSWORD` |                                                         | Configures the password of the truststore used for HTTPS TLS connection                                 |

### Internal State

To keep the Gateway instances stateless, internal state is stored in Kafka topics.

| Environment Variable                                         | Default Value | Description                                          |
|--------------------------------------------------------------|---------------|------------------------------------------------------|
| `GATEWAY_GROUP_ID`                                           | null          | Set the group name for internal topic if not defined |
| `GATEWAY_STORE_TTL_MS`                                       | `604800000`   | Time between full refresh                            | 
| `GATEWAY_TOPIC_STORE_REAL_TOPIC_PARTITION_COUNT`             | `-1`          | Defaults to the one defined in your cluster settings |
| `GATEWAY_TOPIC_STORE_KCACHE_REPLICATION_FACTOR`              | `-1`          | Defaults to the one defined in your cluster settings |
| `GATEWAY_TOPIC_STORE_DISTRIBUTED_CATCHUP_TIMEOUT_IN_SECONDS` | `1`           | Duration for catchup                                 |


#### Topic Names

| Environment Variable                   | Default Value                               | Description                                                               |
|----------------------------------------|---------------------------------------------|---------------------------------------------------------------------------|
| `GATEWAY_LICENSE_TOPIC`                | `_conduktor_gateway_license`                | Name of license topic                                                     |
| `GATEWAY_TOPIC_MAPPINGS_TOPIC`         | `_conduktor_gateway_topicmappings`          | Name of topicMappings topic                                               |
| `GATEWAY_USER_MAPPINGS_TOPIC`          | `_conduktor_gateway_usermappings`           | Name of the user mapping topic                                            |
| `GATEWAY_CONSUMER_OFFSETS_TOPIC`       | `_conduktor_gateway_consumer_offsets`       | Name of the topic to store the offsets for concentrated topic consumption |
| `GATEWAY_INTERCEPTOR_CONFIGS_TOPIC`    | `_conduktor_gateway_interceptor_configs`    | Name of interceptor config topic                                          |
| `GATEWAY_ENCRYPTION_CONFIGS_TOPIC`     | `_conduktor_gateway_encryption_configs`     | Name of encryption configuration topic                                    |
| `GATEWAY_ACLS_TOPIC`                   | `_conduktor_gateway_acls`                   | Name of the acl topic                                                     |
| `GATEWAY_AUDIT_LOG_TOPIC`              | `_conduktor_gateway_auditlogs`              | Name of audit topic                                                       |
| `GATEWAY_VCLUSTERS_TOPIC`              | `_conduktor_gateway_vclusters`              | Name of vclusters topic                                                   |
| `GATEWAY_GROUPS_TOPIC`                 | `_conduktor_gateway_groups`                 | Name of groups topic                                                      |


### Cluster Switching / Failover
For a fuller description of the failover experience see the [failover how-to](docs/gateway/how-to/configuring-failover.md).
Setup of environment variables is similar to normally [connecting to a Kafka cluster](#kafka-environment-variables), but you provide two sets, one for your main cluster, one for your failover cluster. You can also load a [cluster-config file](/docs/gateway/how-to/configuring-failover.md#configuring-through-a-cluster-config-file) if you prefer.

| Environment Variable | Default Value | Description |
| --- | --- |--- |
| `GATEWAY_BACKEND_KAFKA_SELECTOR` | | Indicates use of a file for config, and provide path to it e.g. `'file : { path: /cluster-config.yaml}'` |
| `KAFKA_MAIN_BOOTSTRAP_SERVERS` | | Bootstrap server of the main cluster |
| `KAFKA_MAIN_SECURITY_PROTOCOL` | | Security protocol of the main cluster |
| `KAFKA_MAIN_SASL_MECHANISM` | | SASL mechanism of the main cluster |
| `KAFKA_MAIN_SASL_JAAS_CONFIG` | | SASL jaas config of the main cluster |
| `KAFKA_FAILOVER_BOOTSTRAP_SERVERS` | | Bootstrap server of the failover cluster |
| `KAFKA_FAILOVER_SECURITY_PROTOCOL` | | Security protocol of the failover cluster |
| `KAFKA_FAILOVER_SASL_MECHANISM` | | SASL mechanism of the main cluster |
| `KAFKA_FAILOVER_SASL_JAAS_CONFIG` | | SASL jaas config of the main cluster |
| `KAFKA_FAILOVER_GATEWAY_ROLES` | | Set the Gateway into failover mode, set this to `failover` for this scenario|

### Internal Setup

#### Threading

| Environment Variable                | Default Value   | Description                                                                          |
|-------------------------------------|-----------------|--------------------------------------------------------------------------------------|
| `GATEWAY_DOWNSTREAM_THREAD`         | number of cores | The number of threads dedicated to handling IO between clients and Conduktor Gateway |
| `GATEWAY_UPSTREAM_THREAD`           | number of cores | The number of threads dedicated to handling IO between Kafka and Conduktor Gateway   |

#### Upstream Connection

| Environment Variable              | Default Value | Description                                                    |
|-----------------------------------| ------------- |----------------------------------------------------------------|
| `GATEWAY_UPSTREAM_CONNECTION_POOL_TYPE` | `NONE`          | Upstream connection pool type. Possible values are `NONE` (no connection pool), `ROUND_ROBIN` (Round robin selected connection pool)  |
| `GATEWAY_UPSTREAM_NUM_CONNECTION` | `10`          | The number of connections between Conduktor Gateway and Kafka per upstream thread. Used only when `ROUND_ROBIN` is enabled. |

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
| `GATEWAY_AUDIT_LOG_KAFKA_`                      |                 | Overrides Kafka Producer configuration for Audit Logs ie. `GATEWAY_AUDIT_LOG_KAFKA_LINGER_MS=0`                     |

### Logging

| Environment Variable                                   | Default Value | Description                                                                                                                | Package                                  |
|--------------------------------------------------------|---------------|----------------------------------------------------------------------------------------------------------------------------|------------------------------------------|
| `LOG4J2_APPENDER_LAYOUT`                               | `pattern`     | The format to output console logging. Use `json` for json layout or `pattern` for pattern layout                           |                                          |
| `LOG4J2_IO_CONDUKTOR_PROXY_NETWORK_LEVEL`              | `info`        | Low-level networking, connection mapping, authentication, authorization                                                    | io.conduktor.proxy.network               |
| `LOG4J2_IO_CONDUKTOR_UPSTREAM_THREAD_LEVEL`            | `info`        | Requests processing and forwarding. At `trace`, log requests sent                                                          | io.conduktor.proxy.thread.UpstreamThread |
| `LOG4J2_IO_CONDUKTOR_PROXY_REBUILDER_COMPONENTS_LEVEL` | `info`        | Requests and responses rewriting. Logs responses payload in `debug` (useful for checking METADATA)                        | io.conduktor.proxy.rebuilder.components  |
| `LOG4J2_IO_CONDUKTOR_PROXY_SERVICE_LEVEL`              | `info`        | Various. Logs ACL checks and interceptor targettings at `debug`. Logs post-interceptor requests/response payload at `trace` | io.conduktor.proxy.service               |
| `LOG4J2_IO_CONDUKTOR_LEVEL`                            | `info`        | Get even more logs not covered by specific packages                                                                        | io.conduktor                             |
| `LOG4J2_ORG_APACHE_KAFKA_LEVEL`                        | `warn`        | Kafka log level                                                                                                            | org.apache.kafka                         |
| `LOG4J2_IO_KCACHE_LEVEL`                               | `warn`        | Kcache log level (our persistence library)                                                                                 | io.kcache                                |
| `LOG4J2_IO_VERTX_LEVEL`                                | `warn`        | Vertx log level (our HTTP API framework)                                                                                   | io.vertx                                 |
| `LOG4J2_IO_NETTY_LEVEL`                                | `error`       | Netty log level (our network framework)                                                                                    | io.netty                                 |
| `LOG4J2_IO_MICROMETER_LEVEL`                           | `error`       | Micrometer log level (our metrics framework)                                                                               | io.micrometer                            |
| `LOG4J2_ROOT_LEVEL`                                    | `info`        | Root logging level (applies to anything else)                                                                              | (root)                                   |

### Product Analytics

| Environment Variable                                   | Default Value | Description                                                                                                                                                                                                                                   |
|--------------------------------------------------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_FEATURE_FLAGS_ANALYTICS`                      | `true`        | Conduktor collects basic user analytics to understand product usage and enhance product development and improvement, such as a Gateway Started event. This is not based on any of the underlying Kafka data which is never sent to Conduktor. |
