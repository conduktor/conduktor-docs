---
sidebar_position: 2
---

# Environment Variables

Jump to:
- [Core Environment Variables](#core-environment-variables)
- [Override Environment Variables](#override-environment-variables)

## Core Environment Variables

| ENV | Since Version | Until Version | Default Value |   | 
|-----|---------------|---------------|---------------|---|
| `RUN_MODE`          | 1.0.2 | latest | Memory presets for the platform see [ advanced settings](../installation/hardware.md)
| `CDK_VOLUME_DIR`    | 1.0.2 | latest | `/var/conduktor` | Volume directory where Conduktor platform store data |
| `CDK_IN_CONF_FILE`  | 1.0.2 | latest | [`/opt/conduktor/default-platform-config.yaml`](./introduction.md#configuration-file)) | Conduktor platform configuration file location |
| `EMBEDDED_POSTGRES` | 1.1.2 | 1.1.3 | `true` | Flag to enabled or disable embedded Postgresql database. (Deprecated since **1.2.0**. Now if no external database is configured embedded database is used) |
| `PLATFORM_DB_URL`   | 1.1.2 | latest | None | Deprecated, use `CDK_DATABASE_URL` or decomposed external database configuration. |
| `CDK_DATABASE_URL` | 1.2.0 | latest | None | External Postgresql configuration URL in format `[jdbc:]postgresql://[user[:password]@]netloc[:port][/dbname][?param1=value1&...]`. |
| `CDK_DATABASE_HOST` | 1.2.0 | latest | None | External Postgresql server hostname |
| `CDK_DATABASE_PORT` | 1.2.0 | latest | 5432 | External Postgresql server port |
| `CDK_DATABASE_NAME` | 1.2.0 | latest | None | External Postgresql database name |
| `CDK_DATABASE_USERNAME` | 1.2.0 | latest | None | External Postgresql login role |
| `CDK_DATABASE_PASSWORD` | 1.2.0 | latest | None | External Postgresql login password |
| `CDK_DATABASE_CONNECTIONTIMEOUT` | 1.2.0 | latest | None | External Postgresql connection timeout in seconds. |
| `PLATFORM_LISTENING_PORT` | 1.1.3 | 1.2.0 | 8080 | Deprecated, use `CDK_LISTENING_PORT` |
| `CDK_LISTENING_PORT` | 1.2.0 | latest | 8080 | Platform listening port |

## Override Environment Variables

Starting from Conduktor Platform `1.2.0` input configuration fields can be provided using environment variables.

Below shows the mapping of configuration fields in the `platform-config.yaml` to environment variables.


| Configuration Field     | Environment Variable    |   Definition  |
|---------|--------------------|--------------------|
| `organization.name`    | `CDK_ORGANIZATION_NAME`  | Your organizations name  |
| `clusters[0].id`    | `CDK_CLUSTERS_1_ID`  | String used to uniquely identify your Kafka cluster  |
| `clusters[0].name`    | `CDK_CLUSTERS_1_NAME`  | Alias or user-friendly name for your Kafka cluster  |
| `clusters[0].color`    | `CDK_CLUSTERS_1_COLOR`  | (optional) Attach a color to associate with your cluster in the UI  |
| `clusters[0].ignoreUntrustedCertificate`    | `CDK_CLUSTERS_1_IGNOREUNTRUSTEDCERTIFICATE`  | (optional) Skip SSL certificate validation  |
| `clusters[0].bootstrapServers`    | `CDK_CLUSTERS_1_BOOTSTRAPSERVERS`  | List of host:port for your Kafka brokers  |
| `clusters[0].zookeeperServer`    | `CDK_CLUSTERS_1_ZOOKEEPERSERVER`  | (optional)  |
| `clusters[0].properties`    | `CDK_CLUSTERS_1_PROPERTIES`  | Any cluster configuration properties. See [more].  |
| `clusters[0].schemaRegistry.id`    | `CDK_CLUSTERS_1_SCHEMAREGISTRY_ID`  | String used to uniquely identify your schema registry  |
| `clusters[0].schemaRegistry.url`    | `CDK_CLUSTERS_1_SCHEMAREGISTRY_URL`  | The schema registry URL |
| `clusters[0].schemaRegistry.ignoreUntrustedCertificate`    | `CDK_CLUSTERS_1_SCHEMAREGISTRY_IGNOREUNTRUSTEDCERTIFICATE`  | (optional) Skip SSL certificate validation |
| `clusters[0].schemaRegistry.properties`    | `CDK_CLUSTERS_1_SCHEMAREGISTRY_PROPERTIES`  | Any schema registry configuration parameters. See [more] |
| `clusters[0].schemaRegistry.security.username`    | `CDK_CLUSTERS_1_SCHEMAREGISTRY_SECURITY_USERNAME`  | Basic auth username  |
| `clusters[0].schemaRegistry.security.password`    | `CDK_CLUSTERS_1_SCHEMAREGISTRY_SECURITY_PASSWORD`  | Basic auth password  |
| `clusters[0].kafkaConnects.id`    | `CDK_CLUSTERS_1_KAFKACONNECTS_ID`  | String used to uniquely identify your Kafka Connect  |
| `clusters[0].kafkaConnects.url`    | `CDK_CLUSTERS_1_KAFKACONNECTS_URL`  | The Kafka connect URL  |
| `clusters[0].kafkaConnects.security.username`    | `CDK_CLUSTERS_1_KAFKACONNECTS_SECURITY_USERNAME`  | Basic auth username  |
| `clusters[0].kafkaConnects.security.username`    | `CDK_CLUSTERS_1_KAFKACONNECTS_SECURITY_PASSWORD`  | Basic auth password  |
| `clusters[0].jmxScrapePort`    | `CDK_CLUSTERS_1_JMXSCRAPEPORT`  | JMX-exporter port used to scrape kafka broker metrics for monitoring. (optional, 9101 by default)  |
| `clusters[0].nodeScrapePort`    | `CDK_CLUSTERS_1_NODESCRAPEPORT`  | Node-exporter port used to scrape kafka host metrics for monitoring. (optional, 9100 by default)  |