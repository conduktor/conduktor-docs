---
title: Metrics Reference
description: Prometheus metrics available for Console
---

# Metrics Reference

Console exposes metrics using the Prometheus format for your Kafka resources and Console health that you can scrap and send to your external log management system.

## Kafka Metrics Reference

The metrics endpoint is located on `/monitoring/metrics` of your deployed Console instance.  
Data points are refreshed every 30 seconds.

| Metric value                                              | Labels                                          | Description                                                                 |
|-----------------------------------------------------------|-------------------------------------------------|-----------------------------------------------------------------------------|
| **Kafka Cluster & Broker Metrics**                        |                                                 |                                                                             |
| `kafka_controller_kafkacontroller_activebrokercount`      | `cluster_id`                                    | Number of active Brokers on the Kafka cluster                               |
| `kafka_controller_kafkacontroller_activecontrollercount`  | `cluster_id`                                    | Number of active Controllers on the Kafka cluster                           |
| `kafka_controller_kafkacontroller_globalpartitioncount`   | `cluster_id`                                    | Total number of partition on the Kafka cluster                              |
| `kafka_controller_kafkacontroller_offlinepartitionscount` | `cluster_id`                                    | Number of Partitions with no active Leader                                  |
| `kafka_server_replicamanager_underminisrpartitioncount`   | `cluster_id`                                    | Number of Partitions with replicas that don't meet their minimum ISR        |
| `kafka_server_replicamanager_underreplicatedpartitions`   | `cluster_id`                                    | Number of Partitions with replicas that don't meet their replication factor |
| `kafka_server_replicamanager_leadercount`                 | `cluster_id`, `broker_id`, `broker_host`        | Number of Partition Leaders on this Broker                                  |
| `kafka_server_replicamanager_partitioncount`              | `cluster_id`, `broker_id`, `broker_host`        | Number of Partitions on this Broker                                         |
| **Kafka Topic & Partition Metrics**                       |                                                 |                                                                             |
| `kafka_cluster_partition_underreplicated`                 | `cluster_id`, `topic`, `partition`              | `1` when the partition is under-replicated                                  |
| `kafka_cluster_partition_underminisr`                     | `cluster_id`, `topic`, `partition`              | `1` when the partition is under min ISR                                     |
| `kafka_partition_latest_offset`                           | `cluster_id`, `topic`, `partition`              | Latest offset of the current partition                                      |
| `kafka_log_log_size`                                      | `cluster_id`, `topic`, `partition`              | Size in bytes of the current partition                                      |
| **Consumer Group Metrics**                                |                                                 |                                                                             |
| `kafka_consumergroup_group_lag_seconds`                   | `cluster_id`, `group`, `topic`, `partition`     | Lag in seconds of the consumer group on this topic/partition                |
| `kafka_consumergroup_group_lag`                           | `cluster_id`, `group`, `topic`, `partition`     | Absolute Lag of the consumer group on this topic/partition                  |
| `kafka_consumergroup_group_offset`                        | `cluster_id`, `group`, `topic`, `partition`     | Last commited offset of the consumer group on this topic/partition          |
| **Kafka Connect Metrics**                                 |                                                 |                                                                             |
| `kafka_connect_total_tasks`                               | `cluster_id`, `connect_cluster_id`, `connector` | Total number of tasks configured for this Connector                         |
| `kafka_connect_failed_tasks`                              | `cluster_id`, `connect_cluster_id`, `connector` | Number of Failed tasks for this Connector                                   |


:::info 
Note that the label `cluster_name` is obsolete and will be removed soon. You should use `cluster_id` instead.
:::