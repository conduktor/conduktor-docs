---
sidebar_position: 2
title: Environment Variables
description: Conduktor Gateway connections to Kafka are configured by prefixed and translated environment variables.
---

Configuring the environment variables is the recommended way of setting up Conduktor Gateway.


Jump to:

- [Kafka Environment Variables](#kafka-environment-variables)
- [Gateway Environment Variables](#gateway-environment-variables)

# Kafka Environment Variables

Conduktor Gateway connections to Kafka are configured by prefixed and translated environment variables.
Any variable prefixed with `KAFKA_` will be treated as a connection parameter.
The remainder of the environment variable will be lower cased and have `_` replaced with `.`.

Thus a variable

```bash
KAFKA_BOOTSTRAP_SERVERS
```

is equivalent to the Kafka property;

```bash
bootstrap.servers
```

# Gateway Environment Variables

Default configurations for Conduktor Gateway can be overridden by environment variables:

## Guidelines

A typical deployment of Gateway is hard to describe as every environment will be unique in it's design and
considerations.

As such, the below is an example including some variables we recommend you modify in any setup you do, but is by no
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

## Host/Port

| Environment Variable      | Default Value                      | Description                                                                                                                                                                                                                                                                         |
|---------------------------|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_BIND_HOST`       | `0.0.0.0`                          | The host on which to bind the gateway                                                                                                                                                                                                                                               |
| `GATEWAY_ADVERTISED_HOST` | defaults to your hostname          | The gateway hostname that should be presented to clients                                                                                                                                                                                                                            |
| `GATEWAY_PORT_START`      | `6969`                             | Port on which Gateway will start listening on                                                                                                                                                                                                                                     |
| `GATEWAY_PORT_COUNT`      | defaults to your number of brokers | Number of ports to be used by the Gateway, each port will correspond to a broker in the Kafka cluster so it must be at least as large as the broker count of the Kafka cluster. We recommend it is double the size of the Kafka cluster to allow for expansion and reassignment. |

## Load Balancing

| Environment Variable                           | Default Value       | Description                                                                                                              |
|------------------------------------------------|---------------------|--------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_CLUSTER_ID`                           | `conduktorGateway`  | A unique identifier for a given Gateway cluster, this is used to establish Gateway cluster membership for load balancing |
| `GATEWAY_FEATURE_FLAGS_INTERNAL_LOAD_BALANCING` | `true`              | Whether to use Conduktor Gateway's internal load balancer to balance connections between Gateway instances.              |
| `GATEWAY_RACK_ID`                              | none                | Similar as `broker.rack`                                                                                                 |

## Client to Gateway Authentication

Note: These configurations apply to authentication between clients and Conduktor Gateway.
For authentication between Conduktor Gateway and Kafka see [Kafka Environment Variables](#kafka-environment-variables)

| Environment Variable        | Default Value                         | Description                                                                                                                    |
|-----------------------------|---------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_SECURITY_PROTOCOL` | defaults to `KAFKA_SECURITY_PROTOCOL` | The type of authentication clients should use to connect to the gateway, valid values are `NONE`, `SASL_PLAIN` and `SASL_SSL`  |

### SSL

| Environment Variable                            | Default Value                      | Description                                       |
|-------------------------------------------------|------------------------------------|---------------------------------------------------|
| `GATEWAY_SSL_KEY_STORE_PATH`                    | `config/kafka-proxy.keystore.jks`  | Path to a keystore for SSL connections            |
| `GATEWAY_SSL_KEY_STORE_PASSWORD`                | `123456`                           | Password for the keystore defined above           |
| `GATEWAY_SSL_KEY_PASSWORD`                      | `123456`                           | Password for the key contained in the store above |
| `GATEWAY_SSL_KEY_TYPE`                          | `jks`                              | We currently only support `jks`                   |
| `GATEWAY_SSL_UPDATE_INTERVAL_MS`                | `600000`                           |                                                   |
| `GATEWAY_SSL_UPDATE_CONTEXT_INTERVAL_MINUTES`   | `5`                                | Interval in minutes to refresh SSL context        |

| Environment Variable               | Default Value                       | Description                                                                                              |
|------------------------------------|-------------------------------------|----------------------------------------------------------------------------------------------------------|
| `GATEWAY_SSL_TRUST_STORE_PATH`     | `config/kafka-proxy.truststore.jks` | Path to a keystore for SSL connections                                                                   |
| `GATEWAY_SSL_TRUST_STORE_PASSWORD` | `123456`                            | Password for the keystore defined above                                                                  |
| `GATEWAY_SSL_TRUST_STORE_TYPE`     | `jks`                               | We currently only support `jks`                                                                          |
| `GATEWAY_SSL_CLIENT_AUTH`          | `NONE`                              | `NONE` will not request client authentication, `OPTIONAL` will request client authentication, `REQUIRE` will require client authentication |

### SSL Config

| Environment Variable                                      | Default Value | Description                  |
|-----------------------------------------------------------|---------------|------------------------------|
| `GATEWAY_AUTHENTICATION_CONNECTION_MAX_REAUTH_MS`         | `0`           | Max Reauth                   |
| `GATEWAY_AUTHENTICATION_EXPONENTIAL_BACKOFF_MULTIPLIER`   | `2`           | Backoff multiplier on reauth |
| `GATEWAY_AUTHENTICATION_EXPONENTIAL_BACKOFF_MAX_MS`       | `5000`        | Max backoff                  |

## HTTP

| Environment Variable      | Default Value                                           | Description                                                                       |
|---------------------------|---------------------------------------------------------|-----------------------------------------------------------------------------------|
| `GATEWAY_HTTP_PORT`       | `8888`                                                  | The port on which the gateway will present a HTTP management API                  |
| `GATEWAY_SECURED_METRICS` | `true`                                                  | Does the HTTP management API require users?                                       |
| `GATEWAY_ADMIN_API_USERS` | `[{username: admin, password: conduktor, admin: true}]` | Users that can access the api, please note that admin is required to do any write |

## Internal state

Conduktor needs to save state

| Environment Variable    | Default Value   | Description                                |
|-------------------------|-----------------|--------------------------------------------|
| `GATEWAY_STORAGE_TYPE`  | `KAFKA`         | Can be `IN_MEMORY`, `KAFKA` and `POSTGRES` |
| `GATEWAY_STORE_TTL_MS`  | `604800000`     | Time between full refresh                  |

### Topics names

State is saved in different location based on `GATEWAY_STORAGE_TYPE`

When it is set

* `KAFKA` they will be materialized as a topic.
* `POSTGRES` they will be stored as a table.
* `IN_MEMORY` they will be stored in memory.

| Environment Variable                                             | Default Value                              | Description                                         |
|------------------------------------------------------------------|--------------------------------------------|-----------------------------------------------------|
| `GATEWAY_TOPIC_STORE_MAPPING_BACKING_TOPIC`                      | `_topicMappings`                           | Name of topicMappings topic                         |
| `GATEWAY_TOPIC_STORE_REGISTRY_BACKING_TOPIC`                     | `_topicRegistry`                           | Name of topicRegistry topic                         |
| `GATEWAY_INTERCEPTOR_STORE_BACKING_TOPIC`                        | `_interceptorConfigs`                      | Name of interceptorConfigs topic                    |
| `GATEWAY_ACLS_STORES_BACKING_TOPIC`                              | `_acls`                                    | Name of acls topic                                  |
| `GATEWAY_OFFSET_STORE_COMMITTED_OFFSET_BACKING_TOPIC`            | `_offsetStore`                             | Name of offsetStore topic                           |
| `GATEWAY_OFFSET_STORE_CONSUMER_GROUP_SUBSCRIPTION_BACKING_TOPIC` | `_consumerGroupSubscriptionBackingTopic`   | Name of consumerGroupSubscriptionBackingTopic topic |
| `GATEWAY_LICENSE_BACKING_TOPIC`                                  | `_license`                                 | Name of license topic                               |

### `IN_MEMORY` State Configurations

none

### `KAFKA` State Configurations

| Environment Variable                                         | Default Value | Description                                          |
|--------------------------------------------------------------|---------------|------------------------------------------------------|
| `GATEWAY_TOPIC_STORE_REAL_TOPIC_PARTITION_COUNT`             | `-1`          | Defaults to the one defined in your cluster settings |
| `GATEWAY_TOPIC_STORE_KCACHE_REPLICATION_FACTOR`              | `-1`          | Defaults to the one defined in your cluster settings |
| `GATEWAY_TOPIC_STORE_DISTRIBUTED_CATCHUP_TIMEOUT_IN_SECONDS` | `1`           | Duration for catchup                                 |

### `POSTGRES` State Configurations

| Environment Variable                    | Default Value | Description       |
|-----------------------------------------|---------------|-------------------|
| `GATEWAY_STORAGE_RDBMS_URL`             |               | Postgres url      |
| `GATEWAY_STORAGE_RDBMS_USER`            |               | Postgres user     |
| `GATEWAY_STORAGE_RDBMS_PASSWORD`        |               | Postgres password |
| `GATEWAY_STORAGE_RDBMS_SCHEMA`          |               | Postgres schema   |
| `GATEWAY_STORAGE_RDBMS_POLLINGINTERVAL` |               | polling interval  |

## Internal setup

### Threading

| Environment Variable                | Default Value   | Description                                                                          |
|-------------------------------------|-----------------|--------------------------------------------------------------------------------------|
| `GATEWAY_DOWNSTREAM_THREAD`         | number of cores | The number of threads dedicated to handling IO between clients and Conduktor Gateway |
| `GATEWAY_UPSTREAM_THREAD`           | number of cores | The number of threads dedicated to handling IO between Kafka and Conduktor Gateway   |
| `GATEWAY_UPSTREAM_MAX_PENDING_TASK` | `2048`          | Maximum number of pending tasks to handling IO between Kafka and Conduktor Gateway   |

### Upstream Connection

| Environment Variable              | Default Value | Description                                                    |
|-----------------------------------| ------------- |----------------------------------------------------------------|
| `GATEWAY_UPSTREAM_NUM_CONNECTION` | `10`          | The number of connections between Conduktor Gateway and Kafka  |

## Feature Flags

| Environment Variable                            | Default Value | Description                                                                                                                                                                |
|-------------------------------------------------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_FEATURE_FLAGS_MULTI_TENANCY`           | `false`       | Whether or not to pass Kafka credentials from the client through to the cluster for connecting, or use the tenants within Gateway. This must be enabled for multi-tenancy. |
| `GATEWAY_FEATURE_FLAGS_AUDIT`                   | `true`        | Whether or not to enable the audit feature                                                                                                                                 |
| `GATEWAY_FEATURE_FLAGS_RBAC`                    | `false`       | Whether or not to enable the RBAC feature                                                                                                                                  |
| `GATEWAY_FEATURE_FLAGS_SINGLE_TENANT`           | `false`       | Whether or not to enable single tenant mode, in this mode topic names etc are not prefixed.                                                                                |
| `GATEWAY_FEATURE_FLAGS_INTERNAL_LOAD_BALANCING` | `true`        | Whether or not to enable we replicate kafka internal load balancing                                                                                                        |

## Licensing

| Environment Variable             | Default Value | Description                                               |
|----------------------------------| ------------- | --------------------------------------------------------- |
| `GATEWAY_LICENSE_KEY`            | None          | License key                                               |

## Audit

| Environment Variable                            | Default Value   | Description                                                                                                        |
|-------------------------------------------------|-----------------|--------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_AUDIT_LOG_CONFIG_SPEC_VERSION`         | `0.1.0`         | Version                                                                                                            |
| `GATEWAY_AUDIT_LOG_SERVICE_BACKING_TOPIC`       | `_auditLogs`    | Target topic name                                                                                                  |
| `GATEWAY_AUDIT_LOG_REPLICATION_FACTOR_OF_TOPIC` | `-1`            | Replication factor to be used when creating the audit topic, defaults to the one defined in your cluster settings  |
| `GATEWAY_AUDIT_LOG_NUM_PARTITIONS_OF_TOPIC`     | `-1`            | Number of partitions to be used when creating the audit topic, defaults to the one defined in your cluster settings |

## Logging

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

## Usage Analytics

| Environment Variable                                   | Default Value | Description                                                                                      |
|--------------------------------------------------------|---------------|--------------------------------------------------------------------------------------------------|
| `GATEWAY_FEATURE_FLAGS_ANALYTICS`                      | `true`     | Conduktor collects basic user analytics to understand product usage and enable product development and improvement,  such as a Gateway Started event. This is not based on any of the underlying Kafka data.|