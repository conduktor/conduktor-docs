---
sidebar_position: 2
title: Environment Variables
description: Conduktor Gateway connections to Kafka are configured by prefixed and translated environment variables.
---

Configuring the environment variables is the recommended way of setting up Conduktor Gateway.

# Environment Variables

Jump to:

- [Kafka Environment Variables](#kafka-environment-variables)
- [Override Environment Variables](#override-environment-variables)

## Kafka Environment Variables

Conduktor Gateway connections to Kafka are configured by prefixed and translated environment variables. Any variable prefixed with `KAFKA_` will be treated as a connection parameter. The remainder of the environmnt variable will be lower cased and have `_` replaced with `.` so that a variable

```bash
KAFKA_BOOTSTRAP_SERVERS
```

is equivalent to the Kafka property;

```bash
bootstrap.servers
```

## Gateway Environment Variables

Default configurations for Conduktor Gateway can be overridden by environment variables:


### Guidelines
A typical deployment of Gateway is hard to describe as every environment will be unique in it's design and considerations. As such, the below is an example including some variables we recommend you modify in any setup you do, but is by no means a guarantee of sufficient requirements in your setup. We will support you in onboarding of Conduktor Gateway to help you get setup in the first place and for any ongoing issues or questions please contact support.

__Example Values__

```shell
  -e KAFKA_BOOTSTRAP_SERVERS=kafka1:9092 \
  -e KAFKA_SASL_MECHANISM=SCRAM-SHA-256 \
  -e KAFKA_SECURITY_PROTOCOL=SASL_SSL \
  -e KAFKA_SASL_JAAS_CONFIG="org.apache.kafka.common.security.scram.ScramLoginModule required username='usr' password='pw';" \
  -e GATEWAY_FEATURE_FLAGS_MULTITENANCY=true \
  -e GATEWAY_ADMIN_API_USERS=[{username: adminChangeMe, password: conduktorChangeMe, admin: true}}]
```

:::info

Multi-tenancy is disabled by default to get you up and running with Gateway quicker and simpler. When disabled Gateway will use the existing kafka credentials of the app to connect to the cluster, allowing it to passthrough the Gateway.
To get the most out of Conduktor Gateway multi-tenancy should later be activated.

:::
### Host/Port Configurations

| Environment Variable | Default Value | Description                                                                                                                                                                                                                                                                                                                                                            |  Enterprise Only  |
|----------------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------:|
| `GATEWAY_BIND_HOST`    | `0.0.0.0`     | The host on which to bind the gateway (Use `GATEWAY_BIND_HOST` with the open source gateway)                                                                                                                                                                                                                                                                           |        No         |
| `GATEWAY_HOST`         | `localhost`   | The gateway hostname that should be presented to clients  (Use `GATEWAY_HOST` with the open source gateway)                                                                                                                                                                                                                                                            |        No         | 
| `GATEWAY_PORT_RANGE`   | `6969:6975`   | A range of ports to be opened on the Conduktor `GATEWAY_HOST`, each port in this range will correspond to a broker in the Kafka cluster so it must be at least as large as the broker count of the Kafka cluster. We recommend it is double the size of the Kafka cluster to allow for expansion and reassignment. (Use `GATEWAY_PORT_RANGE` with the open source gateway) |        No         |

### Load Balancing Configurations

| Environment Variable                     | Default Value      | Description                                                                                                                                                                                                          | Enterprise Only |
|------------------------------------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------:|
| `GATEWAY_CLUSTER_ID`                       | `conduktorGateway` | A unique identifier for a given Gateway cluster, this is used to establish Gateway cluster membership for load balancing                                                                                             |       Yes       |
| `GATEWAY_FEATURE_FLAGS_INTERNAL_LOAD_BALANCING`  | `false`             | Whether to use Conduktor Gateway's internal load balancer to balance connections between Gateway instances. This is not recommended for production use and should be disabled when an external load balancer is used |       Yes       |
| `GATEWAY_RACK_ID`   | `?`   | Description goes here. |        No         |

### Schema Registry Configurations

| Environment Variable    | Default Value | Description                                                                         |  Enterprise Only   |
|-------------------------| ------------- | ----------------------------------------------------------------------------------- |:------------------:|
| `SCHEMA_REGISTRY_HOST`  | None          | A HTTP endpoint for interacting with a Schema Registry (e.g. http://localhost:8081) |        Yes         |

### Authentication Configurations

Note: These configurations apply to authentication between clients and Conduktor Gateway. For authentication between Conduktor Gateway and Kafka see [Kafka Environment Variables](#kafka-environment-variables)

| Environment Variable                | Default Value | Description                                                                                                                  | Enterprise Only |
|-------------------------------------| ------------- |------------------------------------------------------------------------------------------------------------------------------|:---------------:|
| `GATEWAY_SECURITY_PROTOCOL` | `NONE`        | The type of authentication clients should use to connect to the gateway, valid values are NONE, SSL, SASL_PLAIN and SASL_SSL |       No        |
| `GATEWAY_SSL_KEY_STORE_PATH`                | config/kafka-proxy.keystore.jks          | Path to a keystore for SSL connections                                                                                       |       No        |
| `GATEWAY_SSL_KEY_STORE_PASSWORD`            | 123456          | Password for the keystore defined above                                                                                      |       No        |
| `GATEWAY_SSL_KEY_PASSWORD`                  | None          | Password for the key contained in the store above                                                                            |       No        |
| `GATEWAY_SSL_KEY_TYPE`                      | `jks`         | The type of keystore used for SSL connections       
| `GATEWAY_SSL_UPDATE_INTERVAL_MS`            | 600000         |                                             |       No        |

### HTTP Configurations

| Environment Variable | Default Value | Description                                                      | Enterprise Only |
|----------------------| ------------- |------------------------------------------------------------------|:---------------:|
| `GATEWAY_HTTP_PORT`          | `8888`        | The port on which the gateway will present a HTTP management API |       Yes       | 

### Thread Configurations

| Environment Variable | Default Value | Description                                                                          | Enterprise Only |
|----------------------| ------------- |--------------------------------------------------------------------------------------|:---------------:|
| `GATEWAY_DOWNSTREAM_THREAD`  | `2`           | The number of threads dedicated to handling IO between clients and Conduktor Gateway |       No        |
| `GATEWAY_UPSTREAM_THREAD`    | `4`           | The number of threads dedicated to handling IO between Kafka and Conduktor Gateway   |       No        |

### Upstream Connection Configurations

| Environment Variable        | Default Value | Description                                                   | Enterprise Only |
|-----------------------------| ------------- |---------------------------------------------------------------|:---------------:|
| `GATEWAY_UPSTREAM_NUM_CONNECTION`   | `10`          | The number of connections between Conduktor Gateway and Kafka |      No         | 

### Topic Store Configurations

| Environment Variable                  | Default Value    | Description                                                                               | Enterprise Only |
|---------------------------------------| ---------------- | ----------------------------------------------------------------------------------------- |:---------------:|
| `GATEWAY_TOPIC_STORE_MAPPING_BACKING_TOPIC`   | `_topicMappings` | The name of an internal topic used to store topic mapping configuration for multi tenancy |       Yes       |
| `GATEWAY_TOPIC_STORE_REGISTRY_BACKING_TOPIC`  | `_topicRegistry` | The name of an internal topic used to store topic metadata                                |       Yes       |

### Interceptor Configurations

| Environment Variable               | Default Value         | Description                                                            | Enterprise Only |
|------------------------------------| --------------------- | ---------------------------------------------------------------------- |:---------------:|
| `GATEWAY_INTERCEPTOR_STORE_BACKING_TOPIC`  | `_interceptorConfigs` | The name of an internal topic used to store interceptor configurations |       Yes       |
| `GATEWAY_RESOURCE_NAME_BACKING_TOPIC`      | `_resourceNames`      | The name of an internal topic used to store named resource metadata    |      Yes        |

### Tenant Store Configurations

| Environment Variable           | Default Value           | Description                                                 | Enterprise Only |
|--------------------------------| ----------------------- | ----------------------------------------------------------- |:---------------:|
| `GATEWAY_TENANT_STORES_BACKING_TOPIC`  | `_tenantConfigMappings` | The name of an internal topic used to store tenant metadata |      Yes        |

### Offset Store Configurations

| Environment Variable                                       | Default Value                            | Description                                                         | Enterprise Only |
|------------------------------------------------------------| ---------------------------------------- | ------------------------------------------------------------------- |:---------------:|
| `GATEWAY_OFFSET_STORE_COMMITTED_OFFSET_BACKING_TOPIC`              | `_offsetStore`                           | The name of an internal topic used to store offset metadata         | Yes |
| `GATEWAY_OFFSET_STORE_CONSUMER_GROUP_SUBSCRIPTION_BACKING_TOPIC`   | `_consumerGroupSubscriptionBackingTopic` | The name of an internal topic used to store consumer group metadata | Yes |

### Other Feature Flags Configurations

| Environment Variable                | Default Value | Description                                                                                                                                                       | Enterprise Only |
|-------------------------------------| ------------- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------:|
| `GATEWAY_FEATURE_FLAGS_MULTITENANCY`        | `false`       | Whether or not to pass Kafka credentials from the client through to the cluster for connecting, or use the tenants within Gateway. This must be enabled for multi-tenancy. 
| `GATEWAY_FEATURE_FLAGS_AUDIT`                | `true`       | Whether or not to enable the audit feature          |      Yes        |
| `GATEWAY_FEATURE_FLAGS_RBAC`                | `false`       | Whether or not to enable the RBAC feature          |      Yes        |
| `GATEWAY_FEATURE_FLAGS_SINGLE_TENANT`       | `false`       | Whether or not to enable single tenant mode, in this mode topic names etc are not prefixed. |       Yes       |
| `GATEWAY_FEATURE_FLAGS_NO_INTERNAL_TOPICS`  | `false`       | Whether or not to enable no internal topics mode, in this mode gateway internal topics are not created. Note only one gateway instance is supported in this mode. |       Yes       |

### Metrics Configurations

| Environment Variable      | Default Value | Description                                          | Enterprise only |
|---------------------------| ------------- | ---------------------------------------------------- |:---------------:|
| `PROMETHEUS_METRICS_PORT` | `9089`        | The port on which Prometheus metrics will be exposed | Yes |

### Conduktor Platform Configurations

| Environment Variable   | Default Value           | Description                                                                                                                                                                                                                   | Enterprise Only |
|------------------------| ----------------------- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------:|
| `PLATFORM_M2M_SECRET`  | `changeit`              | A shared secret used to authenticate requests between Conduktor Gateway and Conduktor Platform. This can usually be found as the `sharedSecret` property in `/etc/conduktor/devtools.yml` in the Conduktor Platform container |       Yes       |
| `PLATFORM_M2M_ISSUER`  | `http://localhost/auth` | The issuer used to authenticate requests between Conduktor Gateway and Conduktor Platform this should be in the form `http://[platform host name]/auth`                                                                       |       Yes       |

### RBAC configurations

| Environment Variable      | Default Value                       | Description                                      | Enterprise Only |
|---------------------------| ----------------------------------- | ------------------------------------------------ |:---------------:|
| `GATEWAY_RBAC_PLATFORM_ENDPOINT`  | `http://localhost:8080/admin/api/p` | The Conduktor Platform persmissions API endpoint |       Yes       |

### Licensing configurations

| Environment Variable    | Default Value | Description                                               | Enterprise Only |
|-------------------------| ------------- | --------------------------------------------------------- |:---------------:|
| `GATEWAY_LICENSE_BACKING_TOPIC` | `_license`    | The namme of an internal topic used to store license data |       Yes       |
| `GATEWAY_LICENSE_PUBLIC_KEY`    | None          | The public key used to decode license keys                |       Yes       |
| `GATEWAY_LICENSE_KEY`           | None          | License key                                               |       Yes       |

### Security configuration

| Environment Variable         | Default Value | Description                                 | Enterprise Only |
|------------------------------|---------------|---------------------------------------------|:---------------:|
| `JWT_AUTH_MASTER_USERNAME`   | `conduktor`   | Master credentials for use with admin APIs  |       Yes       |
| `JWT_AUTH_MASTER_PASSWORD`   | `conduktor`   | Master credentials for use with admin APIs  |       Yes       |

### Logging configuration

| Environment Variable                                   | Default Value | Description                                                                                      | Enterprise Only |
|--------------------------------------------------------|---------------|--------------------------------------------------------------------------------------------------|:---------------:|
| `LOG4J2_APPENDER_LAYOUT`                               | `pattern`     | The format to output console logging. Use `json` for json layout or `pattern` for pattern layout |       Yes       |
| `LOG4J2_ROOT_LEVEL`                                    | `info`        | The logging level for the root logger                                                            |       Yes       |
| `LOG4J2_ORG_APACHE_KAFKA_LEVEL`                        | `warn`        | The logging level for the package org.apache.kafka                                               |       Yes       |
| `LOG4J2_IO_KCACHE_LEVEL`                               | `warn`        | The logging level for the package io.kcache                                                      |       Yes       |
| `LOG4J2_IO_VERTX_LEVEL`                                | `warn`        | The logging level for the package io.vertx                                                       |       Yes       |
| `LOG4J2_IO_NETTY_LEVEL`                                | `error`       | The logging level for the package io.netty                                                       |       Yes       |
| `LOG4J2_IO_CONDUKTOR_LEVEL`                            | `info`        | The logging level for the package io.conduktor                                                   |       Yes       |
| `LOG4J2_IO_CONDUKTOR_PROXY_AUTHORIZATION_LEVEL`        | `info`        | The logging level for the package io.conduktor.proxy.authorization                               |       Yes       |
| `LOG4J2_IO_CONDUKTOR_PROXY_REBUILDER_COMPONENTS_LEVEL` | `info`        | The logging level for the package io.conduktor.proxy.rebuilder.components                        |       Yes       |
| `LOG4J2_IO_CONDUKTOR_PROXY_SERVICE_LEVEL`              | `info`        | The logging level for the package io.conduktor.proxy.service                                     |       Yes       |
| `LOG4J2_IO_CONDUKTOR_PROXY_NETWORK_LEVEL`              | `info`        | The logging level for the package io.conduktor.proxy.network                                     |       Yes       |
| `LOG4J2_IO_MICROMETER_LEVEL`                           | `error`       | The logging level for the package io.micrometer                                                  |       Yes       |
