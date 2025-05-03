---
title: Metrics Reference
displayed: false
description: Prometheus metrics available for Console
---

# Metrics Reference

Console exposes metrics using the Prometheus format for your Kafka resources and Console health that you can scrape and send to your external log management system.

## Kafka Metrics Reference

The metrics endpoint is located on `/monitoring/metrics` of your deployed Console instance.
Data points are refreshed every 30 seconds.

| Metric Name | Metric Type | Labels | Description |
| --- | --- | --- | --- |
| **Consumer Group Metrics** |  |  |  |
| `kafka_consumergroup_group_lag` | gauge | `cluster_id`, `cluster_name`, `group`, `topic`, `partition` | Absolute Lag of the consumer group on this topic-partition |
| `kafka_consumergroup_group_lag_seconds` | gauge | `cluster_id`, `cluster_name`, `group`, `topic`, `partition` | Lag in seconds of the consumer group on this topic-partition |
| `kafka_consumergroup_group_offset` | gauge | `cluster_id`, `cluster_name`, `group`, `topic`, `partition` | Last commited offset of the consumer group on this topic-partition |
| **Consumer Group Metrics (Aggregated)** |  |  |  |
| `kafka_consumergroup_group_max_lag` | gauge | `cluster_id`, `cluster_name`, `group` | Max group offset lag |
| `kafka_consumergroup_group_max_lag_seconds` | gauge | `cluster_id`, `cluster_name`, `group` | Lag in seconds of the consumer group (all topics) |
| `kafka_consumergroup_group_sum_lag` | gauge | `cluster_id`, `cluster_name`, `group` | Sum of Absolute Lag of the consumer group (all topics) |
| `kafka_consumergroup_group_topic_sum_lag` | gauge | `cluster_id`, `cluster_name`, `group`, `topic` | Sum of Absolute Lag of the consumer group on this topic (all partitions) |
| **Kafka Cluster & Broker Metrics** |  |  |  |
| `kafka_controller_kafkacontroller_activebrokercount` | gauge | `cluster_name`, `cluster_id` | Number of active Brokers on the Kafka cluster |
| `kafka_controller_kafkacontroller_activecontrollercount` | gauge | `cluster_name`, `cluster_id` | Number of active Controllers on the Kafka cluster |
| `kafka_controller_kafkacontroller_globalpartitioncount` | gauge | `cluster_name`, `cluster_id` | Total number of partitions on the Kafka cluster |
| `kafka_controller_kafkacontroller_offlinepartitionscount` | gauge | `cluster_name`, `cluster_id` | Number of Partitions with no active Leader |
| `kafka_server_replicamanager_leadercount` | gauge | `cluster_name`, `cluster_id`, `broker_id`, `broker_host` | Number of Partition Leaders on this Broker |
| `kafka_server_replicamanager_partitioncount` | gauge | `cluster_name`, `cluster_id`, `broker_id`, `broker_host` | Number of Partitions on this Broker |
| `kafka_server_replicamanager_underminisrpartitioncount` | gauge | `cluster_name`, `cluster_id` | Number of Partitions with replicas that don't meet their minimum ISR |
| `kafka_server_replicamanager_underreplicatedpartitions` | gauge | `cluster_name`, `cluster_id` | Number of Partitions with replicas that don't meet their replication factor |
| **Kafka Connect Metrics** |  |  |  |
| `kafka_connect_failed_tasks` | gauge | `cluster_name`, `cluster_id`, `connect_cluster_id`, `connector` | Number of Failed tasks for this Connector |
| `kafka_connect_total_tasks` | gauge | `cluster_name`, `cluster_id`, `connect_cluster_id`, `connector` | Total number of tasks configured for this Connector |
| **Kafka Topic & Partition Metrics** |  |  |  |
| `kafka_cluster_partition_underminisr` | gauge | `cluster_name`, `cluster_id`, `topic`, `partition` | `1` when the partition is under min ISR |
| `kafka_cluster_partition_underreplicated` | gauge | `cluster_name`, `cluster_id`, `topic`, `partition` | `1` when the partition is under-replicated |
| `kafka_partition_earliest_offset` | gauge | `cluster_id`, `cluster_name`, `topic`, `partition` | Earliest offset of the current topic-partition |
| `kafka_partition_latest_offset` | gauge | `cluster_id`, `cluster_name`, `topic`, `partition` | Latest offset of the current topic-partition |
| **Others** |  |  |  |
| `kafka_consumergroup_poll_time_ms` | gauge | `cluster_id`, `cluster_name` | Group time poll time |
| `kafka_controller_controllerstats_uncleanleaderelectionspersec_created` | gauge | `cluster_name`, `cluster_id` | Counter for kafka_controller_controllerstats_uncleanleaderelectionspersec metric |
| `kafka_controller_controllerstats_uncleanleaderelectionspersec_total` | counter | `cluster_name`, `cluster_id` | Counter for kafka_controller_controllerstats_uncleanleaderelectionspersec metric |
| `kafka_log_log_size` | gauge | `broker_host`, `partition`, `broker_id`, `topic`, `cluster_name`, `cluster_id` | Size in bytes of the current topic-partition |

:::info
Note that the label `cluster_name` is obsolete and will be removed soon. You should use `cluster_id` instead.
:::

## Console Reference

The metrics endpoint is located on `/api/metrics` of your deployed Console instance.

| Metric Name | Metric Type | Labels | Description |
| --- | --- | --- | --- |
| **Console API** |  |  |  |
| `console_api_request_active` | gauge | `path`, `method` |  |
| `console_api_request_duration_seconds` | histogram |  |  |
| `console_api_request_duration_seconds_count` |  | `path`, `method`, `status`, `phase` |  |
| `console_api_request_duration_seconds_max` |  | `path`, `method`, `status`, `phase` |  |
| `console_api_request_duration_seconds_min` |  | `path`, `method`, `status`, `phase` |  |
| `console_api_request_duration_seconds_sum` |  | `path`, `method`, `status`, `phase` |  |
| `console_api_request_total` | counter | `path`, `method`, `status` |  |
| **Console caches** |  |  |  |
| `console_cache_cluster_reachable_hits_total` | counter |  | Number of cache hits for cluster_reachable |
| `console_cache_cluster_reachable_misses_total` | counter |  | Number of cache miss for cluster_reachable |
| `console_cache_cluster_reachable_size` | gauge |  | Total cache size for cluster_reachable |
| `console_cache_kafka_admin_hits_total` | counter |  | Number of cache hits for kafka_admin |
| `console_cache_kafka_admin_misses_total` | counter |  | Number of cache miss for kafka_admin |
| `console_cache_kafka_admin_size` | gauge |  | Total cache size for kafka_admin |
| `console_cache_schema_registry_clients_hits_total` | counter |  | Number of cache hits for schema_registry_clients |
| `console_cache_schema_registry_clients_misses_total` | counter |  | Number of cache miss for schema_registry_clients |
| `console_cache_schema_registry_clients_size` | gauge |  | Total cache size for schema_registry_clients |
| **Kafka cluster indexing** |  |  |  |
| `console_indexer_kafka_cluster_duration` | histogram |  | Duration in milliseconds to index Kafka cluster |
| `console_indexer_kafka_cluster_duration_count` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_cluster_duration_max` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_cluster_duration_min` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_cluster_duration_sum` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_cluster_failed_count` | gauge |  | Number of failed Kafka cluster indexing tasks |
| `console_indexer_kafka_cluster_skipped_count` | gauge |  | Number of skipped Kafka cluster indexing tasks |
| `console_indexer_kafka_cluster_succeeded_count` | gauge |  | Number of succeeded Kafka cluster indexing tasks |
| `console_indexer_kafka_cluster_timeout_count` | gauge |  | Number of timed out Kafka cluster indexing tasks |
| `console_indexer_kafka_describe_topics_duration` | histogram |  | Duration in milliseconds to describes all topics per Kafka cluster |
| `console_indexer_kafka_describe_topics_duration_count` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_describe_topics_duration_max` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_describe_topics_duration_min` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_describe_topics_duration_sum` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_consumers_groups_duration` | histogram |  | Duration in milliseconds to get all consumers groups state per Kafka cluster |
| `console_indexer_kafka_get_consumers_groups_duration_count` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_consumers_groups_duration_max` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_consumers_groups_duration_min` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_consumers_groups_duration_sum` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_deployed_connectors_duration` | histogram |  | Duration in milliseconds to list all deployed connector per Kafka cluster |
| `console_indexer_kafka_get_deployed_connectors_duration_count` |  | `time_unit`, `technical_id`, `cluster_type`, `kafka_connect` |  |
| `console_indexer_kafka_get_deployed_connectors_duration_max` |  | `time_unit`, `technical_id`, `cluster_type`, `kafka_connect` |  |
| `console_indexer_kafka_get_deployed_connectors_duration_min` |  | `time_unit`, `technical_id`, `cluster_type`, `kafka_connect` |  |
| `console_indexer_kafka_get_deployed_connectors_duration_sum` |  | `time_unit`, `technical_id`, `cluster_type`, `kafka_connect` |  |
| `console_indexer_kafka_get_topics_configs_duration` | histogram |  | Duration in milliseconds to get all topics topics configuration per Kafka cluster |
| `console_indexer_kafka_get_topics_configs_duration_count` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_topics_configs_duration_max` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_topics_configs_duration_min` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_topics_configs_duration_sum` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_topics_partitions_duration` | histogram |  | Duration in milliseconds to get all topics partitions state per Kafka cluster |
| `console_indexer_kafka_get_topics_partitions_duration_count` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_topics_partitions_duration_max` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_topics_partitions_duration_min` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_topics_partitions_duration_sum` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_init_cluster_connection_duration` | histogram |  | Duration in milliseconds to initialize the connection per Kafka cluster |
| `console_indexer_kafka_init_cluster_connection_duration_count` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_init_cluster_connection_duration_max` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_init_cluster_connection_duration_min` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_init_cluster_connection_duration_sum` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_list_topics_duration` | histogram |  | Duration in milliseconds to list topics per Kafka cluster |
| `console_indexer_kafka_list_topics_duration_count` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_list_topics_duration_max` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_list_topics_duration_min` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_list_topics_duration_sum` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_total_clusters_count` | gauge |  | Total number of Kafka cluster |
| `console_indexer_kafka_total_duration` | histogram |  | Total duration in milliseconds to index Kafka cluster |
| `console_indexer_kafka_total_duration_count` |  | `time_unit` |  |
| `console_indexer_kafka_total_duration_max` |  | `time_unit` |  |
| `console_indexer_kafka_total_duration_min` |  | `time_unit` |  |
| `console_indexer_kafka_total_duration_sum` |  | `time_unit` |  |
| **Kafka connect indexing** |  |  |  |
| `console_indexer_kafka_connect_cluster_failed_count` | gauge |  | Number of failed Kafka Connect server indexing tasks |
| `console_indexer_kafka_connect_cluster_skipped_count` | gauge |  | Number of skipped Kafka Connect server indexing tasks |
| `console_indexer_kafka_connect_cluster_succeeded_count` | gauge |  | Number of succeeded Kafka Connect server indexing tasks |
| `console_indexer_kafka_connect_cluster_timeout_count` | gauge |  | Number of timed out Kafka Connect server indexing tasks |
| `console_indexer_kafka_connect_total_clusters_count` | gauge |  | Total number of Kafka Connect server |
| `console_indexer_kafka_connect_total_duration` | histogram |  | Total duration in milliseconds to index Kafka Connect server |
| `console_indexer_kafka_connect_total_duration_count` |  | `time_unit` |  |
| `console_indexer_kafka_connect_total_duration_max` |  | `time_unit` |  |
| `console_indexer_kafka_connect_total_duration_min` |  | `time_unit` |  |
| `console_indexer_kafka_connect_total_duration_sum` |  | `time_unit` |  |
| **Schema registry indexing** |  |  |  |
| `console_indexer_schema_registry_cluster_failed_count` | gauge |  | Number of failed Schema Registry server indexing tasks |
| `console_indexer_schema_registry_cluster_skipped_count` | gauge |  | Number of skipped Schema Registry server indexing tasks |
| `console_indexer_schema_registry_cluster_succeeded_count` | gauge |  | Number of succeeded Schema Registry server indexing tasks |
| `console_indexer_schema_registry_cluster_timeout_count` | gauge |  | Number of timed out Schema Registry server indexing tasks |
| `console_indexer_schema_registry_total_clusters_count` | gauge |  | Total number of Schema Registry server |
| `console_indexer_schema_registry_total_duration` | histogram |  | Total duration in milliseconds to index Schema Registry server |
| `console_indexer_schema_registry_total_duration_count` |  | `time_unit` |  |
| `console_indexer_schema_registry_total_duration_max` |  | `time_unit` |  |
| `console_indexer_schema_registry_total_duration_min` |  | `time_unit` |  |
| `console_indexer_schema_registry_total_duration_sum` |  | `time_unit` |  |
