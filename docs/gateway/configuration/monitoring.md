---
sidebar_position: 5
title: Monitoring and Health
description: Monitoring and Health
---


# How to access Prometheus metrics from Gateway

Url is `<gateway_host>:<gateway_port>/metrics`

Please note that if you enabled `GATEWAY_SECURED_METRICS` you will need to access it with credentials.



# Available metrics for Prometheus

| Metric description                                                          | Metric value                         |
|-----------------------------------------------------------------------------|--------------------------------------------|
| The number of connections closed per second                                 | `gateway.upstream.connection_close_rate`     |
| The total number of connections closed                                      | `gateway.upstream.connection_close_total`    |
| The number of new connections established per second                        | `gateway.upstream.connection_creation_rate`  |
| The total number of new connections established                             | `gateway.upstream.connection_creation_total` |
| The number of times the I/O layer checked for new I/O to perform per second | `gateway.upstream.select_rate`               |
| The total number of times the I/O layer checked for new I/O to perform      | `gateway.upstream.select_total`              |
| The number of time the I/O thread spent waiting                             | `gateway.upstream.io_wait_rate`              |
| The total time the I/O thread spent waiting                                 | `gateway.upstream.io_wait_total`             |
|                                                                             | `gateway.brokered_active_connections`        |
|                                                                             | `gateway.active_connections.vcluster`        |
|                                                                             | `gateway.latency.request_response`           |
|                                                                             | `gateway.apiKeys.latency.request_response`   |
|                                                                             | `gateway.bytes_exchanged`   |
|                                                                             | `gateway.bytes_exchanged.vcluster`   |
|                                                                             | `gateway.thread.request.rebuild`   |
|                                                                             | `gateway.thread.request.received`   |
|                                                                             | `gateway.thread.tasks`   |
|                                                                             | `gateway.upstream.connections.upstream.connected`   |
|                                                                             | `gateway.upstream.connections.downstream`   |
|                                                                             | `gateway.upstream.io.nodes`   |
|                                                                             | `gateway.upstream.nodes`   |
|                                                                             | `gateway.kcache_size`   |
|                                                                             | `gateway.backend.brokered_active_connections`   |
|                                                                             | `gateway.failed_authentications`   |
|                                                                             | `gateway.topic.log_end_offset`   |
|                                                                             | `gateway.topic.current_offset`   |
