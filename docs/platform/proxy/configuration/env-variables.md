---
title: Environment Variables
description: Conduktor Proxy connections to Kafka are configured by prefixed and translated environment variables.
---

# Environment Variables

Jump to:

- [Kafka Environment Variables](#kafka-environment-variables)
- [Override Environment Variables](#override-environment-variables)

## Kafka Environment Variables

Conduktor Proxy connections to Kafka are configured by prefixed and translated environment variables. Any variable prefixed with `KAFKA_` will be treated as a connection parameter. The remainder of the environmnt variable will be lower cased and have `_` replaced with `.` so that a variable

```bash
KAFKA_BOOTSTRAP_SERVERS
```

is equivalent to the Kafka property

```bash
bootstrap.servers
```

## Proxy Environment Variables

Default configurations for Conduktor Proxy can be overridden by environment variables:

### Host/Port Configurations

| Environment Variable | Default Value | Description                                                                                                                                                                                                                                                                                                   |
|---------------------| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PROXY_BIND_HOST`   | `0.0.0.0`     | The host on which to bind the proxy                                                                                                                                                                                                                                                                           |
| `PROXY_HOST`        | `localhost`   | The proxy hostname that should be presented to clients                                                                                                                                                                                                                                                        |
| `PROXY_PORT_RANGE`  | `6969:6975`   | A range of ports to be opened on the Conduktor Proxy host, each port in this range will correspond to a broker in the Kafka cluster so it must be at least as large as the broker count of the KAfka cluster. We recommend it is double the size of the Kafka cluster to allow for expansion and reassignment |

### Schema Registry Configurations

| Environment Variable    | Default Value | Description                                                                         |
|-------------------------| ------------- | ----------------------------------------------------------------------------------- |
| `SCHEMA_REGISTRY_HOST`  | None          | A HTTP endpoint for interacting with a Schema Registry (e.g. http://localhost:8081) |

### Authentication Configurations

Note: These configurations apply to authentication between clients and Conduktor Proxy. For authentication between Conduktor Proxy and Kafka see [Kafka Environment Variables](#kafka-environment-variables)

| Environment Variable                | Default Value | Description                                                                                                                |
|-------------------------------------| ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `AUTHENTICATION_AUTHENTICATOR_TYPE` | `NONE`        | The type of authentication clients should use to connect to the Proxy, valid values are NONE, SSL, SASL_PLAIN and SASL_SSL |
| `SSL_KEY_STORE_PATH`                | None          | Path to a keystore for SSL connections                                                                                     |
| `SSL_KEY_STORE_PASSWORD`            | None          | Password for the keystore defined above                                                                                    |
| `SSL_KEY_PASSWORD`                  | None          | Password for the key contained in the store above                                                                          |
| `SSL_KEY_TYPE`                      | `jks`         | The type of keystore used for SSL connections                                                                              |

### HTTP Configurations

| Environment Variable | Default Value | Description                                                    |
|----------------------| ------------- | -------------------------------------------------------------- |
| `HTTP_PORT`          | `8888`        | The port on which the Proxy will present a HTTP management API |

### Thread Configurations

| Environment Variable | Default Value | Description                                                                        |
|----------------------| ------------- | ---------------------------------------------------------------------------------- |
| `DOWNSTREAM_THREAD`  | `2`           | The number of threads dedicated to handling IO between clients and Conduktor Proxy |
| `UPSTREAM_THREAD`    | `4`           | The number of threads dedicated to handling IO between Kafka and Conduktor Proxy   |

### Upstream Connection Configurations

| Environment Variable        | Default Value | Description                                                 |
|-----------------------------| ------------- | ----------------------------------------------------------- |
| `UPSTREAM_NUM_CONNECTION`   | `10`          | The number of connections between Conduktor Proxy and Kafka |

### Topic Store Configurations

| Environment Variable                  | Default Value    | Description                                                                               |
|---------------------------------------| ---------------- | ----------------------------------------------------------------------------------------- |
| `TOPIC_STORE_MAPPING_BACKING_TOPIC`   | `_topicMappings` | The name of an internal topic used to store topic mapping configuration for multi tenancy |
| `TOPIC_STORE_REGISTRY_BACKING_TOPIC`  | `_topicRegistry` | The name of an internal topic used to store topic metadata                                |

### Interceptor Configurations

| Environment Variable               | Default Value         | Description                                                            |
|------------------------------------| --------------------- | ---------------------------------------------------------------------- |
| `INTERCEPTOR_STORE_BACKING_TOPIC`  | `_interceptorConfigs` | The name of an internal topic used to store interceptor configurations |
| `RESOURCE_NAME_BACKING_TOPIC`      | `_resourceNames`      | The name of an internal topic used to store named resource metadata    |

### Tenant Store Configurations

| Environment Variable           | Default Value           | Description                                                 |
|--------------------------------| ----------------------- | ----------------------------------------------------------- |
| `TENANT_STORES_BACKING_TOPIC`  | `_tenantConfigMappings` | The name of an internal topic used to store tenant metadata |

### Offset Store Configurations

| Environment Variable                                       | Default Value                            | Description                                                         |
|------------------------------------------------------------| ---------------------------------------- | ------------------------------------------------------------------- |
| `OFFSET_STORE_COMMITTED_OFFSET_BACKING_TOPIC`              | `_offsetStore`                           | The name of an internal topic used to store offset metadata         |
| `OFFSET_STORE_CONSUMER_GROUP_SUBSCRIPTION_BACKING_TOPIC`   | `_consumerGroupSubscriptionBackingTopic` | The name of an internal topic used to store consumer group metadata |

### Feature Flags Configurations

| Environment Variable                | Default Value | Description                                                                                                                                                   |
|-------------------------------------| ------------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `FEATURE_FLAGS_RBAC`                | `false`       | Whether or not to enable the RBAC feature                                                                                                                     |
| `FEATURE_FLAGS_SINGLE_TENANT`       | `false`       | Whether or not to enable single tenant mode, in this mode topic names etc are not prefixed.                                                                   |
| `FEATURE_FLAGS_NO_INTERNAL_TOPICS`  | `false`       | Whether or not to enable no internal topics mode, in this mode proxy internal topics are not created. Note only one proxy instance is supported in this mode. |

### Metrics Configurations

| Environment Variable      | Default Value | Description                                          |
|---------------------------| ------------- | ---------------------------------------------------- |
| `PROMETHEUS_METRICS_PORT` | `9089`        | The port on which Prometheus metrics will be exposed |

### Conduktor Platform Configurations

| Environment Variable   | Default Value           | Description                                                                                                                                                                                                                 |
|------------------------| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PLATFORM_M2M_SECRET`  | `changeit`              | A shared secret used to authenticate requests between Conduktor Proxy and Conduktor Platform. This can usually be found as the `sharedSecret` property in `/etc/conduktor/devtools.yml` in the Conduktor Platform container |
| `PLATFORM_M2M_ISSUER`  | `http://localhost/auth` | The issuer used to authenticate requests between Conduktor Proxy and Conduktor Platform this should be in the form `http://[platform host name]/auth`                                                                       |

### RBAC configurations

| Environment Variable      | Default Value                       | Description                                      |
|---------------------------| ----------------------------------- | ------------------------------------------------ |
| `RBAC_PLATFORM_ENDPOINT`  | `http://localhost:8080/admin/api/p` | The Conduktor Platform persmissions API endpoint |

### Licensing configurations

| Environment Variable    | Default Value | Description                                               |
|-------------------------| ------------- | --------------------------------------------------------- |
| `LICENSE_BACKING_TOPIC` | `_license`    | The namme of an internal topic used to store license data |
| `LICENSE_PUBLIC_KEY`    | None          | The public key used to decode license keys                |
| `LICENSE_KEY`           | None          | License key                                               |
