---
sidebar_position: 5
title: Monitoring and Health
description: Monitoring and Health
---


# How to access Prometheus metrics from Gateway

The Prometheus endpoint is `<gateway_host>:<gateway_port>/metrics` , for example;

```bash
localhost:8888/metrics
```

Please note that if you enabled `GATEWAY_SECURED_METRICS` you will need to access it with credentials, for example;
```bash
--username "admin:conduktor" localhost:8888/metrics
```



# Available metrics for Prometheus

| Metric description                                                          | Metric value                         |
|-----------------------------------------------------------------------------|--------------------------------------------|
| The number of connections closed per second | `gateway.upstream.connection_close_rate`     |
| The total number of connections closed | `gateway.upstream.connection_close_total`    |
| The number of new connections established per second | `gateway.upstream.connection_creation_rate`  |
| The total number of new connections established | `gateway.upstream.connection_creation_total` |
| The number of times the I/O layer checked for new I/O to perform per second | `gateway.upstream.select_rate`               |
| The total number of times the I/O layer checked for new I/O to perform | `gateway.upstream.select_total`              |
| The number of time the I/O thread spent waiting | `gateway.upstream.io_wait_rate`              |
| The total time the I/O thread spent waiting | `gateway.upstream.io_wait_total`             |
| The number of active broker connections of the connection pool | `gateway.brokered_active_connections`        |
| The number of active connections per vcluster | `gateway.active_connections.vcluster`        |
| The latency to process a request and generate a response | `gateway.latency.request_response`           |
| The latency to process a request and generate a response for each ApiKey | `gateway.apiKeys.latency.request_response`   |
| The total number of bytes exchanged through the gateway | `gateway.bytes_exchanged`   |
| The total bytes exchanged within the context of the specified virtual cluster | `gateway.bytes_exchanged.vcluster`   |
| A counter on number of rebuilding kafka request | `gateway.thread.request.rebuild`   |
| The number of pending tasks on our Gateway thread (where all rebuilding request/response happen) | `gateway.thread.tasks`   |
| The number of connections from Gateway to the backing Kafka cluster| `gateway.upstream.connections.upstream.connected`   |
| The number of connections from clients to Gateway | `gateway.upstream.connections.downstream`   |
| The number of Kafka nodes | `gateway.upstream.io.nodes`   |
| The size of the kcache (equal to the number of key-value pairs we have in the cache) | `gateway.kcache_size`   |
| The number of active backend brokers | `gateway.backend.brokered_active_connections`   |
| The number of authentication attempts that failed for each user | `gateway.failed_authentications`   |
| The log end offset of client topics | `gateway.topic.log_end_offset`   |
| The current offset of consumer group on client topic | `gateway.topic.current_offset`   |
