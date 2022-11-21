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

| Environment Variable                  | Default Value | Description                                                                                                                                                                                                                                                                                                   |
| ------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hostPortConfiguration_proxyBindHost` | `0.0.0.0`     | The host on which to bind the proxy                                                                                                                                                                                                                                                                           |
| `hostPortConfiguration_proxyHost`     | `localhost`   | The proxy hostname that should be presented to clients                                                                                                                                                                                                                                                        |
| `hostPortConfiguration_portRange`     | `6969:6975`   | A range of ports to be opened on the Conduktor Proxy host, each port in this range will correspond to a broker in the Kafka cluster so it must be at least as large as the broker count of the KAfka cluster. We recommend it is double the size of the Kafka cluster to allow for expansion and reassignment |

### Schema Registry Configurations

| Environment Variable  | Default Value | Description                                                                         |
| --------------------- | ------------- | ----------------------------------------------------------------------------------- |
| `schemaRegistry_host` | None          | A HTTP endpoint for interacting with a Schema Registry (e.g. http://localhost:8081) |

### Authentication Configurations

Note: These configurations apply to authentication between clients and Conduktor Proxy. For authentication between Conduktor Proxy and Kafka see [Kafka Environment Variables](#kafka-environment-variables)

| Environment Variable                     | Default Value | Description                                                                                                                |
| ---------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `authenticationConfig_authenticatorType` | `NONE`        | The type of authentication clients should use to connect to the Proxy, valid values are NONE, SSL, SASL_PLAIN and SASL_SSL |
| `sslConfig_keyStore_keyStorePath`        | None          | Path to a keystore for SSL connections                                                                                     |
| `sslConfig_keyStore_keyStorePassword`    | None          | Password for the keystore defined above                                                                                    |
| `sslConfig_keyStore_keyPassword`         | None          | Password for the key contained in the store above                                                                          |
| `sslConfig_keyStore_keyStoreType`        | `jks`         | The type of keystore used for SSL connections                                                                              |

### HTTP Configurations

| Environment Variable | Default Value | Description                                                    |
| -------------------- | ------------- | -------------------------------------------------------------- |
| `httpConfig_port`    | `8888`        | The port on which the Proxy will present a HTTP management API |

### Thread Configurations

| Environment Variable            | Default Value | Description                                                                        |
| ------------------------------- | ------------- | ---------------------------------------------------------------------------------- |
| `threadConfig_downStreamThread` | `2`           | The number of threads dedicated to handling IO between clients and Conduktor Proxy |
| `threadConfig_upstreamThread`   | `4`           | The number of threads dedicated to handling IO between Kafka and Conduktor Proxy   |

### Upstream Connection Configurations

| Environment Variable                       | Default Value | Description                                                 |
| ------------------------------------------ | ------------- | ----------------------------------------------------------- |
| `upstreamConnectionConfig_numOfConnection` | `10`          | The number of connections between Conduktor Proxy and Kafka |

### Topic Store Configurations

| Environment Variable                                | Default Value    | Description                                                                               |
| --------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------- |
| `topicStoreConfig_topicMappingServiceBackingTopic`  | `_topicMappings` | The name of an internal topic used to store topic mapping configuration for multi tenancy |
| `topicStoreConfig_topicRegistryServiceBackingTopic` | `_topicRegistry` | The name of an internal topic used to store topic metadata                                |

### Interceptor Configurations

| Environment Variable                                                 | Default Value         | Description                                                            |
| -------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------- |
| `interceptorStoreConfig_interceptorConfigurationServiceBackingTopic` | `_interceptorConfigs` | The name of an internal topic used to store interceptor configurations |
| `resourceNameBackingTopic`                                           | `_resourceNames`      | The name of an internal topic used to store named resource metadata    |

### Tenant Store Configurations

| Environment Variable                                       | Default Value           | Description                                                 |
| ---------------------------------------------------------- | ----------------------- | ----------------------------------------------------------- |
| `tenantStoreConfig_tenantConfigurationServiceBackingTopic` | `_tenantConfigMappings` | The name of an internal topic used to store tenant metadata |

### Offset Store Configurations

| Environment Variable                                      | Default Value                            | Description                                                         |
| --------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------- |
| `offsetStoreConfig_committedOffsetBackingTopic`           | `_offsetStore`                           | The name of an internal topic used to store offset metadata         |
| `offsetStoreConfig_consumerGroupSubscriptionBackingTopic` | `_consumerGroupSubscriptionBackingTopic` | The name of an internal topic used to store consumer group metadata |

### Feature Flags Configurations

| Environment Variable | Default Value | Description                               |
| -------------------- | ------------- | ----------------------------------------- |
| `featureFlags_rbac`  | `false`       | Whether or not to enable the RBAC feature |

### Cold Storage Configurations

| Environment Variable                  | Default Value  | Description                              |
| ------------------------------------- | -------------- | ---------------------------------------- |
| `amazonProperties_accessKey`          | `ignored`      | AWS access key for S3                    |
| `amazonProperties_secretKey`          | `ignore`       | AWS secret key for S3                    |
| `amazonProperties_bucketName`         | `ignored`      | S3 bucket name for cold storage          |
| `amazonProperties_uri`                | `s3://ignored` | S3 uri for cold storage                  |
| `amazonProperties_region`             | `ignored`      | S3 region for cold starage               |
| `amazonProperties_localDiskDirectory` | `/tmp/ignored` | local storage directory for cold starage |

### Metrics Configurations

| Environment Variable    | Default Value | Description                                          |
| ----------------------- | ------------- | ---------------------------------------------------- |
| `prometheusMetricsPort` | `9089`        | The port on which Prometheus metrics will be exposed |

### Conduktor Platform Configurations

| Environment Variable | Default Value           | Description                                                                                                                                                                                                                 |
| -------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `platformM2M_secret` | `changeit`              | A shared secret used to authenticate requests between Conduktor Proxy and Conduktor Platform. This can usually be found as the `sharedSecret` property in `/etc/conduktor/devtools.yml` in the Conduktor Platform container |
| `platformM2M_issuer` | `http://localhost/auth` | The issuer used to authenticate requests between Conduktor Proxy and Conduktor Platform this should be in the form `http://[platform host name]/auth`                                                                       |

### RBAC configurations

| Environment Variable          | Default Value                       | Description                                      |
| ----------------------------- | ----------------------------------- | ------------------------------------------------ |
| `rbacConfig_platformEndpoint` | `http://localhost:8080/admin/api/p` | The Conduktor Platform persmissions API endpoint |

### Licensing configurations

| Environment Variable                | Default Value | Description                                               |
| ----------------------------------- | ------------- | --------------------------------------------------------- |
| `licenseConfig_licenseBackingTopic` | `_license`    | The namme of an internal topic used to store license data |
| `licenseConfig_publicKey`           | None          | The public key used to decode license keys                |
| `licenseConfig_licenseKey`          | None          | License key                                               |
