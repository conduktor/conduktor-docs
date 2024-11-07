---
sidebar_position: 99
title: Environment Variables
description: Conduktor Gateway connections to Kafka are configured by prefixed and translated environment variables.
---

## Introduction

You must use environment variables in order to configure Conduktor Gateway's:
- Connection from Gateway to Kafka
- Connection from Clients to Gateway
- Internal Gateway setup (internal topics, license, API, logs, ...)

Some functionalities like Interceptors, Virtual Clusters, or Service Accounts are managed via Gateway's API on the run.

:::caution
There is **no typical deployment of a Gateway**, as each environment’s design, requirements, and security considerations are unique.

We’re here to support you during your onboarding on Conduktor Gateway, ensuring a smooth initial setup. For any ongoing questions or issues, please reach out to our support team via the [Support Portal](https://support.conduktor.io/hc/en-gb/requests/new?ticket_form_id=17438312520209).
:::

Jump to:

  - [Connection from Gateway to Kafka](#connection-from-gateway-to-kafka)
  - [Connection from Clients to Gateway](#connection-from-clients-to-gateway)
  - [Internal Gateway Setup](#internal-gateway-setup)
    - [Host/Port](#hostport)
    - [Load Balancing](#load-balancing)
    - [Client to Gateway Authentication](#client-to-gateway-authentication)
      - [SSL & mTLS](#ssl--mtls)
      - [OAUTHBEARER](#oauthbearer)
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

### Set Gateway Environment Variables

In order to set these environment variables, you have a few option depending on what you're using to deploy Gateway:

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Helm Chart" label="Helm Chart">
  ```yaml
  gateway:
    env:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092 \
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT \
      KAFKA_SASL_MECHANISM: PLAIN \
      KAFKA_SASL_JAAS_CONFIG: "org.apache.kafka.common.security.plain.PlainLoginModule required username='usr' password='pwd';" \
      GATEWAY_SECURITY_PROTOCOL: SASL_PLAINTEXT
  ```
  </TabItem>
  <TabItem value="Docker compose" label="Docker compose">
  ```yaml
  services:
    conduktor-gateway:
      environment:
        KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092 \
        KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT \
        KAFKA_SASL_MECHANISM: PLAIN \
        KAFKA_SASL_JAAS_CONFIG: "org.apache.kafka.common.security.plain.PlainLoginModule required username='usr' password='pwd';" \
        GATEWAY_SECURITY_PROTOCOL: SASL_PLAINTEXT
  ```
  </TabItem>
  <TabItem value="Docker run" label="Docker run">
  ```shell
  -e KAFKA_BOOTSTRAP_SERVERS=kafka1:9092,kafka2:9092 \
  -e KAFKA_SECURITY_PROTOCOL=SASL_PLAINTEXT \
  -e KAFKA_SASL_MECHANISM=PLAIN \
  -e KAFKA_SASL_JAAS_CONFIG="org.apache.kafka.common.security.plain.PlainLoginModule required username='usr' password='pwd';" \
  -e GATEWAY_SECURITY_PROTOCOL=SASL_PLAINTEXT
  ```
  </TabItem>
</Tabs>

## Connection from Gateway to Kafka

Conduktor Gateway connects to Kafka through environment variables prefixed with `KAFKA_`. To configure these settings, translate Kafka property names by converting them to uppercase and replacing any `.` (dots) with `_` (underscores), and add them to Gateway environment variables.

**Example**: The Kafka cluster `bootstrap.servers` must be configured for the Gateway to connect to it. For that, the environment variable to set in Gateway is `KAFKA_BOOTSTRAP_SERVERS`.

Any variable prefixed with `KAFKA_` will be treated as a connection parameter to the backing Kafka cluster by Gateway.

## Connection from Clients to Gateway

Note: These configurations apply to authentication between clients and Conduktor Gateway.

For authentication between Conduktor Gateway and Kafka see [Kafka Environment Variables](#kafka-environment-variables).

You can retrieve some configuration examples in the [Client to Gateway Configuration](/gateway/configuration/client-authentication/) page.

| Environment Variable                       | Default Value             | Description                                                                                                                                                                                                            |
|--------------------------------------------|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_SECURITY_PROTOCOL`                | `KAFKA_SECURITY_PROTOCOL` | The type of authentication clients should use to connect to the gateway, valid values are `PLAINTEXT`, `SASL_PLAINTEXT`, `SASL_SSL`, `SSL`, `DELEGATED_SASL_PLAINTEXT` and `DELEGATED_SASL_SSL`                        |
| `GATEWAY_FEATURE_FLAGS_MANDATORY_VCLUSTER` | `false`                   | If no virtual cluster was detected then user automatically falls back into the transparent virtual cluster, named `passthrough`. Reject authentication if set to `true` and vcluster is not configured for a principal |
| `GATEWAY_ACL_ENABLED`                      | `false`                   | Enable / Disable ACLs support on the Gateway (not including Virtual Clusters, only for passthrough)                                                                                                                    |
| `GATEWAY_SUPER_USERS`                      | `GATEWAY_ADMIN_API_USERS` | List of super users for ACLs, only for passthrough (Gateway 3.3+)                                                                                                                                                      |
| `GATEWAY_ACL_STORE_ENABLED`                | `false`                   | Enable / Disable ACLs support for Virtual Clusters only (not supported after 3.3, where [ACLs are enabled in the Virtual Cluster object directly](/gateway/reference/resources-reference/#virtualcluster))             |

### SSL & mTLS

See how to configure the client to Gateway authentication to be [SSL](/gateway/configuration/client-authentication/#ssl) or [mTLS](/gateway/configuration/client-authentication/#mutual-tls-mtls).

| Environment Variable                                      | Default Value                       | Description                                                                                                                                |
|-----------------------------------------------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| **Keystore**                                              |                                     |                                                                                                                                            |
| &nbsp;&nbsp;`GATEWAY_SSL_KEY_STORE_PATH`                  | `config/kafka-proxy.keystore.jks`   | Path to a keystore                                                                                                                         |
| &nbsp;&nbsp;`GATEWAY_SSL_KEY_STORE_PASSWORD`              | `123456`                            | Password for the keystore defined above                                                                                                    |
| &nbsp;&nbsp;`GATEWAY_SSL_KEY_PASSWORD`                    | `123456`                            | Password for the key contained in the store above                                                                                          |
| &nbsp;&nbsp;`GATEWAY_SSL_KEY_TYPE`                        | `jks`                               | We currently only support `jks`                                                                                                            |
| &nbsp;&nbsp;`GATEWAY_SSL_UPDATE_INTERVAL_MS`              | `600000`                            |                                                                                                                                            |
| &nbsp;&nbsp;`GATEWAY_SSL_UPDATE_CONTEXT_INTERVAL_MINUTES` | `5`                                 | Interval in minutes to refresh the SSL context                                                                                             |
| **Truststore (for mTLS)**                                 |                                     |                                                                                                                                            |
| &nbsp;&nbsp;`GATEWAY_SSL_TRUST_STORE_PATH`                | `config/kafka-proxy.truststore.jks` | Path to a truststore                                                                                                                       |
| &nbsp;&nbsp;`GATEWAY_SSL_TRUST_STORE_PASSWORD`            | `123456`                            | Password for the truststore defined above                                                                                                  |
| &nbsp;&nbsp;`GATEWAY_SSL_TRUST_STORE_TYPE`                | `jks`                               | We currently only support `jks`                                                                                                            |
| &nbsp;&nbsp;`GATEWAY_SSL_CLIENT_AUTH`                     | `NONE`                              | `NONE` will not request client authentication, `OPTIONAL` will request client authentication, `REQUIRE` will require client authentication |
| &nbsp;&nbsp;`GATEWAY_SSL_PRINCIPAL_MAPPING_RULES` | extracts the `CN` |  mTLS leverages SSL mutual authentication to identify a Kafka client. The principal for mTLS connection can be detected from the subject certificate using the same feature as in Apache Kafka, the [SSL principal mapping](https://docs.confluent.io/platform/current/kafka/configure-mds/mutual-tls-auth-rbac.html#principal-mapping-rules-for-tls-ssl-listeners-extract-a-principal-from-a-certificate). |
| **Other SSL configurations**                              |                                     |                                                                                                                                            |
| `GATEWAY_AUTHENTICATION_CONNECTION_MAX_REAUTH_MS`         | `0`                                 | Max Reauth                                                                                                                                 |
| `GATEWAY_AUTHENTICATION_TIMEOUT_MS`                       | `1000`                              | Timeout in ms                                                                                                                              |
| `GATEWAY_AUTHENTICATION_EXPONENTIAL_BACKOFF_MULTIPLIER`   | `2`                                 | Backoff multiplier on reauth                                                                                                               |
| `GATEWAY_AUTHENTICATION_EXPONENTIAL_BACKOFF_MAX_MS`       | `5000`                              | Max backoff                                                                                                                                |

### OAUTHBEARER

Some of these definitions are taken from the Kafka documentation, e.g. [JKWS_REFRESH](https://kafka.apache.org/35/javadoc/constant-values.html#org.apache.kafka.common.config.SaslConfigs.SASL_OAUTHBEARER_JWKS_ENDPOINT_REFRESH_MS_DOC).

| Environment Variable               | Description                                                                                                                                                                                                                                                             |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_OAUTH_JWKS_URL`           | URL from the OAuth/OIDC provider where the JWKS (JSON Web Key Set) can be retrieved. Supports both HTTP(S) and file-based URLs.                                                                                                                           |
| `GATEWAY_OAUTH_EXPECTED_ISSUER`    | (Optional) Expected issuer of the JWT. The broker verifies that the `iss` claim in the JWT matches this value exactly; if there’s no match, authentication fails.                                                                                          |
| `GATEWAY_OAUTH_EXPECTED_AUDIENCES` | (Optional) Expected audiences for the JWT, as a comma-separated list. The broker checks that the `aud` claim in the JWT matches one of these values exactly; if there’s no match, authentication fails.                                                    |
| `GATEWAY_OAUTH_JWKS_REFRESH`       | (Optional) Time in milliseconds for how often the broker refreshes its JWKS cache, which contains keys for verifying JWT signatures.                                                                                            |
| `GATEWAY_OAUTH_JWKS_RETRY`         | (Optional) Initial wait time in milliseconds between JWKS retrieval attempts. Uses exponential backoff with an initial wait based on `sasl.oauthbearer.jwks.endpoint.retry.backoff.ms`, doubling the wait time until reaching the maximum wait time set by `sasl.oauthbearer.jwks.endpoint.retry.backoff.max.ms`. |
| `GATEWAY_OAUTH_JWKS_MAX_RETRY`     | (Optional) Maximum wait time in milliseconds for JWKS retrieval attempts. Uses exponential backoff with an initial wait based on `sasl.oauthbearer.jwks.endpoint.retry.backoff.ms`, doubling the wait time between attempts until reaching this maximum.             |
| `GATEWAY_OAUTH_SCOPE_CLAIM_NAME`   | (Optional) Specifies a custom claim name for scope. If the OAuth/OIDC provider uses a different name than `scope` for this claim, set that name here.                                                                           |
| `GATEWAY_OAUTH_SUB_CLAIM_NAME`     | (Optional) Specifies a custom claim name for the subject. If the OAuth/OIDC provider uses a different name than `sub` for this claim, set that name here.                                                                       |


| Environment Variable               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_OAUTH_JWKS_MAX_RETRY`     | The (optional) value in milliseconds for the maximum wait between attempts to retrieve the JWKS (JSON Web Key Set) from the external authentication provider. JWKS retrieval uses an exponential backoff algorithm with an initial wait based on the sasl.oauthbearer.jwks.endpoint.retry.backoff.ms setting and will double in wait length between attempts up to a maximum wait length specified by the sasl.oauthbearer.jwks.endpoint.retry.backoff.max.ms setting |
| `GATEWAY_OAUTH_SCOPE_CLAIM_NAME`   | The OAuth claim for the scope is often named `scope`, but this (optional) setting can provide a different name to use for the scope included in the JWT payload's claims if the OAuth/OIDC provider uses a different name for that claim.                                                                                                                                                                                                                             |
| `GATEWAY_OAUTH_SUB_CLAIM_NAME`     | The OAuth claim for the subject is often named `sub`, but this (optional) setting can provide a different name to use for the subject included in the JWT payload's claims if the OAuth/OIDC provider uses a different name for that claim.                                                                                                                                                                                                                           |

### PLAIN

These settings are used when the Service Accounts credentials are managed on the Gateway (non delegated mode), see [Client Authentication](/gateway/configuration/client-authentication/#plain) for details.

| Environment Variable        | Default Value | Description                                                                                                             |
|-----------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_USER_POOL_SECRET_KEY` | A default value is used to sign tokens and *must* be changed. | Used for the `PLAIN` mechanism when generating JWT tokens for clients. You must set a random value which is at least 256 bit long to ensure tokens can't be forged. |

## Internal Gateway Setup

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


### API

| Environment Variable                 | Default Value                                           | Description                                                                                             |
|--------------------------------------|---------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| `GATEWAY_HTTP_PORT`                  | `8888`                                                  | Gateway API port                                     |
| `GATEWAY_SECURED_METRICS`            | `true`                                                  | Whether or not the API require authentication                                                 |
| `GATEWAY_ADMIN_API_USERS`            | `[{username: admin, password: conduktor, admin: true}]` | List of user:password pairs to access the API                      |
| **HTTPS**                            |                                                         | Configure the API endpoint with TLS                                                             |
| `GATEWAY_HTTPS_CLIENT_AUTH`          | `NONE`                                                  | Client auth configuration for HTTPS incoming connection. Possible values: `NONE`, `REQUEST`, `REQUIRED` |
| `GATEWAY_HTTPS_KEY_STORE_PATH`       |                                                         | Activates HTTPS and defines the keystore to use for TLS connection                                      |
| `GATEWAY_HTTPS_KEY_STORE_PASSWORD`   |                                                         | Configures the password of the keystore used for HTTPS TLS connection                                   |
| `GATEWAY_HTTPS_TRUST_STORE_PATH`     |                                                         | Configure the truststore used for the HTTPS TLS connection                                              |
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


#### Internal Topics Name

| Environment Variable                   | Default Value                               | Description                                                               |
|----------------------------------------|---------------------------------------------|---------------------------------------------------------------------------|
| `GATEWAY_LICENSE_TOPIC`                | `_conduktor_gateway_license`                | Name of the license topic, that stores the Conduktor Enterprise license key, or the expiry date if you're on free trial                                                     |
| `GATEWAY_TOPIC_MAPPINGS_TOPIC`         | `_conduktor_gateway_topicmappings`          | Name of the topic that stores the Topics Aliases and Concentration rules & topics                                          |
| `GATEWAY_USER_MAPPINGS_TOPIC`          | `_conduktor_gateway_usermappings`           | Name of the topic that stores the internal & local Service Accounts defined on Gateway                                            |
| `GATEWAY_CONSUMER_SUBSCRIPTIONS_TOPIC` | `_conduktor_gateway_consumer_subscriptions` | Name of the topic that stores the subscriptions for concentrated topic consumption topic        |
| `GATEWAY_CONSUMER_OFFSETS_TOPIC`       | `_conduktor_gateway_consumer_offsets`       | Name of the topic to store the offsets for concentrated topic consumption |
| `GATEWAY_INTERCEPTOR_CONFIGS_TOPIC`    | `_conduktor_gateway_interceptor_configs`    | Name of interceptor config topic                                          |
| `GATEWAY_ENCRYPTION_CONFIGS_TOPIC`     | `_conduktor_gateway_encryption_configs`     | Name of encryption configuration topic                                    |
| `GATEWAY_ACLS_TOPIC`                   | `_conduktor_gateway_acls`                   | Name of the acl topic                                                     |
| `GATEWAY_AUDIT_LOG_TOPIC`              | `_conduktor_gateway_auditlogs`              | Name of audit topic                                                       |
| `GATEWAY_VCLUSTERS_TOPIC`              | `_conduktor_gateway_vclusters`              | Name of vclusters topic                                                   |
| `GATEWAY_GROUPS_TOPIC`                 | `_conduktor_gateway_groups`                 | Name of groups topic                                                      |



### Hostname & Port Based Mappings

The below environment variables are used to configure how Gateway will be advertised to clients, either based on [Port Mapping](/gateway/configuration/network/#port-based-routing), or [SNI Routing](/gateway/configuration/network/#host-based-routing-sni).

| Environment Variable                                                           | Default Value               | Description                                                                                                                                                  |
|--------------------------------------------------------------------------------|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_BIND_HOST`                                                            | `0.0.0.0`                   | Host on which to bind Gateway                                                                                                                                |
| `GATEWAY_ADVERTISED_HOST`                                                      | Container hostname          | Gateway hostname that should be presented to clients in the metadata we return                                                                               |
| `GATEWAY_PORT_START`                                                           | `6969`                      | First port to be advertised to the client                                                                                                                    |
| `GATEWAY_ROUTING_MECHANISM`                                                    | `port`                      | `port` for port mapping, `host` for SNI routing                                                                                                              |
| **[Port Mapping](/gateway/configuration/network/#port-based-routing) only**    |                             |                                                                                                                                                              |
| `GATEWAY_PORT_COUNT`                                                           | (maxBrokerId-minBrokerId)+3 | Number of ports to be used by Gateway, based on the number of backing brokers. We recommend you add a few more ports in case you add extra brokers later on. |
| `GATEWAY_MIN_BROKERID`                                                         | `0`                         | The lowest backing broker `broker.id` (or `node.id`) Gateway will be communicating with                                                                      |
| **[SNI Routing](/gateway/configuration/network/#host-based-routing-sni) only** |                             |                                                                                                                                                              |
| `GATEWAY_ADVERTISED_SNI_PORT`                                                  | none                        | Port to be advertised to the client                                                                                                                          |
| `GATEWAY_ADVERTISED_HOST_PREFIX`                                               | `broker`                    | Host prefix when using SNI Routing                                                                                                                           |
| `GATEWAY_SNI_HOST_SEPARATOR`                                                   | `.`                         | Host separator when using SNI Routing                                                                                                                        |



### Load Balancing & Clustering

Learn more about the differences between internal and external load balancing [here](/gateway/reference/load-balancing/).

| Environment Variable                            | Default Value | Description                                                                                                                               |
|-------------------------------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_CLUSTER_ID`                            | `gateway`     | Unique identifier for a Gateway cluster, used to define Gateway cluster membership for load balancing and to name internal Gateway topics |
| `GATEWAY_FEATURE_FLAGS_INTERNAL_LOAD_BALANCING` | `true`        | Whether or not to use Conduktor Gateway's internal load balancer to balance connections between Gateway instances                         |
| `GATEWAY_RACK_ID`                               | none          | Similar as `broker.rack`                                                                                                                  |


### Cluster Switching / Failover

For a detailed description of the failover process, refer to the [failover how-to guide](/gateway/how-to/configuring-failover). 

Setting up the environment variables to connect to the failover cluster follows the same approach as connecting to the Kafka cluster, but requires two sets:
- One for the main cluster
- One for the failover cluster

Alternatively, you can [load a cluster configuration file](/gateway/how-to/configuring-failover#configuring-through-a-cluster-config-file) if preferred.

| Environment Variable               | Description                                                                                              |
|------------------------------------|----------------------------------------------------------------------------------------------------------|
| `GATEWAY_BACKEND_KAFKA_SELECTOR`   | Indicates use of a file for config, and provide path to it e.g. `'file : { path: /cluster-config.yaml}'` |
| `KAFKA_FAILOVER_GATEWAY_ROLES`     | Turn the Gateway into failover mode, set this to `failover` for this scenario                            |
| **Main Cluster**                   |                                                                                                          |
| `KAFKA_MAIN_BOOTSTRAP_SERVERS`     | Bootstrap server of the main cluster                                                                     |
| `KAFKA_MAIN_SECURITY_PROTOCOL`     | Security protocol of the main cluster                                                                    |
| `KAFKA_MAIN_SASL_MECHANISM`        | SASL mechanism of the main cluster                                                                       |
| `KAFKA_MAIN_SASL_JAAS_CONFIG`      | SASL jaas config of the main cluster                                                                     |
| **Failover Cluster**               |                                                                                                          |
| `KAFKA_FAILOVER_BOOTSTRAP_SERVERS` | Bootstrap server of the failover cluster                                                                 |
| `KAFKA_FAILOVER_SECURITY_PROTOCOL` | Security protocol of the failover cluster                                                                |
| `KAFKA_FAILOVER_SASL_MECHANISM`    | SASL mechanism of the main cluster                                                                       |
| `KAFKA_FAILOVER_SASL_JAAS_CONFIG`  | SASL jaas config of the main cluster                                                                     |

### Threading

| Environment Variable                | Default Value   | Description                                                                          |
|-------------------------------------|-----------------|--------------------------------------------------------------------------------------|
| `GATEWAY_DOWNSTREAM_THREAD`         | number of cores | Number of threads dedicated to handling IO between clients and Conduktor Gateway |
| `GATEWAY_UPSTREAM_THREAD`           | number of cores | Number of threads dedicated to handling IO between Kafka and Conduktor Gateway   |

### Upstream Connection

| Environment Variable                    | Default Value | Description                                                                                                                           |
|-----------------------------------------|---------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_UPSTREAM_CONNECTION_POOL_TYPE` | `NONE`        | Upstream connection pool type. Possible values are `NONE` (no connection pool), `ROUND_ROBIN` (Round robin selected connection pool). |
| `GATEWAY_UPSTREAM_NUM_CONNECTION`       | `10`          | Number of connections between Conduktor Gateway and Kafka per upstream thread. Used only when `ROUND_ROBIN` is enabled.               |

### Licensing

| Environment Variable  | Default Value | Description                      |
|-----------------------|---------------|----------------------------------|
| `GATEWAY_LICENSE_KEY` | None          | Conduktor Enterprise license key |

### Audit Log

Here is how to configure the audit log topic (named after `GATEWAY_AUDIT_LOG_TOPIC`), and how Gateway produces into it.

| Environment Variable                            | Default Value | Description                                                                                                         |
|-------------------------------------------------|---------------|---------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_FEATURE_FLAGS_AUDIT`                   | `true`        | Whether or not to enable the audit log                                                                              |
| `GATEWAY_AUDIT_LOG_REPLICATION_FACTOR_OF_TOPIC` | `-1`          | Replication factor to be used when creating the audit topic, defaults to the one defined in your cluster settings   |
| `GATEWAY_AUDIT_LOG_NUM_PARTITIONS_OF_TOPIC`     | `-1`          | Number of partitions to be used when creating the audit topic, defaults to the one defined in your cluster settings |
| `GATEWAY_AUDIT_LOG_KAFKA_`                      |               | Overrides Kafka Producer configuration for Audit Logs ie. `GATEWAY_AUDIT_LOG_KAFKA_LINGER_MS=0`                     |

### Container Logging

In order to troubleshoot Gateway, you can configure the logging level of the different dependencies, based on what you need.

| Environment Variable                                   | Default Value | Description                                                                                                                 | Package                                  |
|--------------------------------------------------------|---------------|-----------------------------------------------------------------------------------------------------------------------------|------------------------------------------|
| `LOG4J2_APPENDER_LAYOUT`                               | `pattern`     | The format to output console logging. Use `json` for json layout or `pattern` for pattern layout                            |                                          |
| `LOG4J2_IO_CONDUKTOR_PROXY_NETWORK_LEVEL`              | `info`        | Low-level networking, connection mapping, authentication, authorization                                                     | io.conduktor.proxy.network               |
| `LOG4J2_IO_CONDUKTOR_UPSTREAM_THREAD_LEVEL`            | `info`        | Requests processing and forwarding. At `trace`, log requests sent                                                           | io.conduktor.proxy.thread.UpstreamThread |
| `LOG4J2_IO_CONDUKTOR_PROXY_REBUILDER_COMPONENTS_LEVEL` | `info`        | Requests and responses rewriting. Logs responses payload in `debug` (useful for checking METADATA)                          | io.conduktor.proxy.rebuilder.components  |
| `LOG4J2_IO_CONDUKTOR_PROXY_SERVICE_LEVEL`              | `info`        | Various. Logs ACL checks and interceptor targettings at `debug`. Logs post-interceptor requests/response payload at `trace` | io.conduktor.proxy.service               |
| `LOG4J2_IO_CONDUKTOR_LEVEL`                            | `info`        | Get even more logs not covered by specific packages                                                                         | io.conduktor                             |
| `LOG4J2_ORG_APACHE_KAFKA_LEVEL`                        | `warn`        | Kafka log level                                                                                                             | org.apache.kafka                         |
| `LOG4J2_IO_KCACHE_LEVEL`                               | `warn`        | Kcache log level (our persistence library)                                                                                  | io.kcache                                |
| `LOG4J2_IO_VERTX_LEVEL`                                | `warn`        | Vertx log level (our HTTP API framework)                                                                                    | io.vertx                                 |
| `LOG4J2_IO_NETTY_LEVEL`                                | `error`       | Netty log level (our network framework)                                                                                     | io.netty                                 |
| `LOG4J2_IO_MICROMETER_LEVEL`                           | `error`       | Micrometer log level (our metrics framework)                                                                                | io.micrometer                            |
| `LOG4J2_ROOT_LEVEL`                                    | `info`        | Root logging level (applies to anything else)                                                                               | (root)                                   |

### Product Analytics

| Environment Variable              | Default Value | Description                                                                                                                                                                                                                                   |
|-----------------------------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_FEATURE_FLAGS_ANALYTICS` | `true`        | Conduktor collects basic user analytics to understand product usage and enhance product development and improvement, such as a Gateway Started event. This is not based on any of the underlying Kafka data which is never sent to Conduktor. |
