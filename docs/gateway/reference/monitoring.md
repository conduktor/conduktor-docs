---
sidebar_position: 3
title: Health & Monitoring
description: Health & Monitoring
---

## Health

To check the health of your Gateway, you can check the endpoint `/health` on the Gateway API (port `8888` by default).

```sh title='cURL Example'
curl -s  http://localhost:8888/health | jq .
```

```json title='Output Example'
{
  "status": "UP",
  "checks": [
    {
      "id": "buildInfo",
      "status": "UP",
      "data": {
        "version": "3.1.0",
        "time": "2024-06-03T20:32:32+0000",
        "commit": "41967691f4c54b5d76a3f1fa8aee3701903b89d9"
      }
    },
    {
      "id": "live",
      "status": "UP"
    }
  ],
  "outcome": "UP"
}
```

## Monitoring
### How to access Prometheus metrics from Gateway

The Prometheus endpoint is `<gateway_host>:<gateway_port>/metrics`, for example:

```bash
localhost:8888/metrics
```

Please be aware that when `GATEWAY_SECURED_METRICS` is enabled (which is the default setting), you will need to use the credentials specified in `GATEWAY_ADMIN_API_USERS` to access the endpoint.

For example, using the default credentials, you can access the metrics with the following command:

```bash title='Retrieve Gateway Metrics'
curl conduktor-gateway:8888/metrics --user "admin:conduktor"
```

See the [API environment variables](/gateway/configuration/env-variables/#http) for more details.

### Available metrics for Prometheus

| Metric description                                                                               | Metric value                                      |
|--------------------------------------------------------------------------------------------------|---------------------------------------------------|
| The number of connections closed per second                                                      | `gateway_upstream_connection_close_rate`          |
| The total number of connections closed                                                           | `gateway_upstream_connection_close_total`         |
| The number of new connections established per second                                             | `gateway_upstream_connection_creation_rate`       |
| The total number of new connections established                                                  | `gateway_upstream_connection_creation_total`      |
| The number of times the I/O layer checked for new I/O to perform per second                      | `gateway_upstream_select_rate`                    |
| The total number of times the I/O layer checked for new I/O to perform                           | `gateway_upstream_select_total`                   |
| The number of time the I/O thread spent waiting                                                  | `gateway_upstream_io_wait_rate`                   |
| The total time the I/O thread spent waiting                                                      | `gateway_upstream_io_wait_total`                  |
| The number of active broker connections of the connection pool                                   | `gateway_brokered_active_connections`             |
| The number of active connections per vcluster                                                    | `gateway_active_connections_vcluster`             |
| The latency to process a request and generate a response                                         | `gateway_latency_request_response`                |
| The latency to process a request and generate a response for each ApiKey                         | `gateway_apiKeys_latency_request_response`        |
| The total number of bytes exchanged through the gateway                                          | `gateway_bytes_exchanged`                         |
| The total bytes exchanged within the context of the specified virtual cluster                    | `gateway_bytes_exchanged_vcluster`                |
| A counter on number of rebuilding kafka request                                                  | `gateway_thread_request_rebuild`                  |
| The number of pending tasks on our Gateway thread (where all rebuilding request/response happen) | `gateway_thread_tasks`                            |
| The number of connections from Gateway to the backing Kafka cluster                              | `gateway_upstream_connections_upstream_connected` |
| The number of connections from clients to Gateway                                                | `gateway_upstream_connections_downstream`         |
| The number of Kafka nodes                                                                        | `gateway_upstream_io_nodes`                       |
| The size of the kcache (equal to the number of key-value pairs we have in the cache)             | `gateway_kcache_size`                             |
| The number of active backend brokers                                                             | `gateway_backend_brokered_active_connections`     |
| The number of authentication attempts that failed for each user                                  | `gateway_failed_authentications`                  |
| The log end offset of client topics                                                              | `gateway_topic_log_end_offset`                    |
| The current offset of consumer group on client topic                                             | `gateway_topic_current_offset`                    |
| The total bytes exchanged within the context of the specified topic                              | `gateway_bytes_exchanged_topic_total`             |
| The total errors per API key for the specified virtual cluster and username                      | `gateway_error_per_apiKeys`                       |
| The current inflight API keys of the specified virtual cluster and username                      | `gateway_current_inflight_apiKeys`                |

### Gateway Lived Events

Gateway Lived Events provide comprehensive monitoring metrics about the Gateway's runtime configuration and usage. These events capture data about interceptors, virtual clusters, topics, and other important components of your Gateway setup. The Prometheus metrics are detailed below.

You can access Gateway Lived Events metrics in Prometheus format from the endpoint mentioned previously, or a JSON response via the dedicated REST API endpoint:

```bash
GET /gateway/v2/analytics/lived
```

For more details about using this API endpoint, refer to the [Gateway API documentation](https://developers.conduktor.io/?product=gateway).

#### Available Gateway Lived Event Metrics

##### Interceptor Metrics

| Metric description                                        | Metric value                                       |
|-----------------------------------------------------------|----------------------------------------------------|
| Total number of interceptor types                         | `gateway_lived_event_interceptors_types_total`     |
| Total number of interceptor instances                     | `gateway_lived_event_interceptors_instances_total` |
| Number of instances for a specific interceptor            | `gateway_lived_event_interceptor_instance_count`   |
| Number of topics covered by a specific interceptor        | `gateway_lived_event_interceptor_topics_covered`   |
| Total number of unique topics covered by all interceptors | `gateway_lived_event_unique_topics_covered`        |

##### Account and Group Metrics

| Metric description                       | Metric value                                 |
|------------------------------------------|----------------------------------------------|
| Total number of Gateway service accounts | `gateway_lived_event_service_accounts_total` |
| Total number of Gateway groups           | `gateway_lived_event_groups_total`           |

##### Topic and Virtual Cluster Metrics

| Metric description                  | Metric value                                    |
|-------------------------------------|-------------------------------------------------|
| Total number of alias topics        | `gateway_lived_event_topics_alias_total`        |
| Total number of concentrated topics | `gateway_lived_event_topics_concentrated_total` |
| Total number of virtual clusters    | `gateway_lived_event_vclusters_total`           |

##### Gateway Information Metrics

| Metric description                                                                        | Metric value                          |
|-------------------------------------------------------------------------------------------|---------------------------------------|
| Gateway deployment information (with version, commit, OS, deployment method labels)       | `gateway_lived_event_info`            |
| Gateway connection information (with security protocol, authentication mechanisms labels) | `gateway_lived_event_connection_info` |
