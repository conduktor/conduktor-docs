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