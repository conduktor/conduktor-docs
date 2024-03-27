---
title: Metrics Reference
description: Prometheus metrics available for Console
---

# Metrics Reference

Console exposes metrics using the Prometheus format for your Kafka resources and Console health that you can scrape and send to your external log management system.

## Kafka Metrics Reference

The metrics endpoint is located on `/monitoring/metrics` of your deployed Console instance. Data points are refreshed every 30 seconds.

| Metric Name | Metric Type | Labels | Description |
| --- | --- | --- | --- |
| **Consumer Group Metrics** |  |  |  |
| `kafka_consumergroup_group_lag` | gauge | `cluster_id`, `cluster_name`, `group`, `topic`, `partition` | Group offset lag of a partition |
| `kafka_consumergroup_group_lag_seconds` | gauge | `cluster_id`, `cluster_name`, `group`, `topic`, `partition` | Group time lag of a partition |
| `kafka_consumergroup_group_offset` | gauge | `cluster_id`, `cluster_name`, `group`, `topic`, `partition` | Last group consumed offset of a partition |
| **Consumer Group Metrics (Aggregated)** |  |  |  |
| `kafka_consumergroup_group_max_lag` | gauge | `cluster_id`, `cluster_name`, `group` | Max group offset lag |
| `kafka_consumergroup_group_max_lag_seconds` | gauge | `cluster_id`, `cluster_name`, `group` | Max group time lag |
| `kafka_consumergroup_group_sum_lag` | gauge | `cluster_id`, `cluster_name`, `group` | Sum of group offset lag |
| `kafka_consumergroup_group_topic_sum_lag` | gauge | `cluster_id`, `cluster_name`, `group`, `topic` | Sum of group offset lag across topic partitions |
| **Kafka Cluster & Broker Metrics** |  |  |  |
| `kafka_controller_kafkacontroller_activebrokercount` | gauge | `cluster_name`, `cluster_id` | Gauge for kafka_controller_kafkacontroller_activebrokercount metric |
| `kafka_controller_kafkacontroller_activecontrollercount` | gauge | `cluster_name`, `cluster_id` | Gauge for kafka_controller_kafkacontroller_activecontrollercount metric |
| `kafka_controller_kafkacontroller_globalpartitioncount` | gauge | `cluster_name`, `cluster_id` | Gauge for kafka_controller_kafkacontroller_globalpartitioncount metric |
| `kafka_controller_kafkacontroller_offlinepartitionscount` | gauge | `cluster_name`, `cluster_id` | Gauge for kafka_controller_kafkacontroller_offlinepartitionscount metric |
| `kafka_server_replicamanager_leadercount` | gauge | `cluster_name`, `cluster_id`, `broker_id`, `broker_host` | Gauge for kafka_server_replicamanager_leadercount metric |
| `kafka_server_replicamanager_partitioncount` | gauge | `cluster_name`, `cluster_id`, `broker_id`, `broker_host` | Gauge for kafka_server_replicamanager_partitioncount metric |
| `kafka_server_replicamanager_underminisrpartitioncount` | gauge | `cluster_name`, `cluster_id` | Gauge for kafka_server_replicamanager_underminisrpartitioncount metric |
| `kafka_server_replicamanager_underreplicatedpartitions` | gauge | `cluster_name`, `cluster_id` | Gauge for kafka_server_replicamanager_underreplicatedpartitions metric |
| **Kafka Connect Metrics** |  |  |  |
| `kafka_connect_failed_tasks` | gauge | `cluster_name`, `cluster_id`, `connect_cluster_id`, `connector` | Gauge for kafka_connect_failed_tasks metric |
| `kafka_connect_total_tasks` | gauge | `cluster_name`, `cluster_id`, `connect_cluster_id`, `connector` | Gauge for kafka_connect_total_tasks metric |
| **Kafka Topic & Partition Metrics** |  |  |  |
| `kafka_cluster_partition_underminisr` | gauge | `cluster_name`, `cluster_id`, `topic`, `partition` | Gauge for kafka_cluster_partition_underminisr metric |
| `kafka_cluster_partition_underreplicated` | gauge | `cluster_name`, `cluster_id`, `topic`, `partition` | Gauge for kafka_cluster_partition_underreplicated metric |
| `kafka_partition_earliest_offset` | gauge | `cluster_id`, `cluster_name`, `topic`, `partition` | Earliest offset of a partition |
| `kafka_partition_latest_offset` | gauge | `cluster_id`, `cluster_name`, `topic`, `partition` | Latest offset of a partition |
| **Others** |  |  |  |
| `kafka_consumergroup_poll_time_ms` | gauge | `cluster_id`, `cluster_name` | Group time poll time |
| `kafka_controller_controllerstats_uncleanleaderelectionspersec_created` | gauge | `cluster_name`, `cluster_id` | Counter for kafka_controller_controllerstats_uncleanleaderelectionspersec metric |
| `kafka_controller_controllerstats_uncleanleaderelectionspersec_total` | counter | `cluster_name`, `cluster_id` | Counter for kafka_controller_controllerstats_uncleanleaderelectionspersec metric |
| `kafka_log_log_size` | gauge | `broker_host`, `partition`, `broker_id`, `topic`, `cluster_name`, `cluster_id` | Gauge for kafka_log_log_size metric |

:::info Note that the label `cluster_name` is obsolete and will be removed soon. You should use `cluster_id` instead. :::

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
| `console_indexer_kafka_cluster_duration` | histogram |  |  |
| `console_indexer_kafka_cluster_duration_count` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_cluster_duration_max` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_cluster_duration_min` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_cluster_duration_sum` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_cluster_failed_count` | gauge |  |  |
| `console_indexer_kafka_cluster_skipped_count` | gauge |  |  |
| `console_indexer_kafka_cluster_succeeded_count` | gauge |  |  |
| `console_indexer_kafka_cluster_timeout_count` | gauge |  |  |
| `console_indexer_kafka_describe_topics_duration` | histogram |  |  |
| `console_indexer_kafka_describe_topics_duration_count` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_describe_topics_duration_max` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_describe_topics_duration_min` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_describe_topics_duration_sum` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_consumers_groups_duration` | histogram |  |  |
| `console_indexer_kafka_get_consumers_groups_duration_count` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_consumers_groups_duration_max` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_consumers_groups_duration_min` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_consumers_groups_duration_sum` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_deployed_connectors_duration` | histogram |  |  |
| `console_indexer_kafka_get_deployed_connectors_duration_count` |  | `time_unit`, `technical_id`, `cluster_type`, `kafka_connect` |  |
| `console_indexer_kafka_get_deployed_connectors_duration_max` |  | `time_unit`, `technical_id`, `cluster_type`, `kafka_connect` |  |
| `console_indexer_kafka_get_deployed_connectors_duration_min` |  | `time_unit`, `technical_id`, `cluster_type`, `kafka_connect` |  |
| `console_indexer_kafka_get_deployed_connectors_duration_sum` |  | `time_unit`, `technical_id`, `cluster_type`, `kafka_connect` |  |
| `console_indexer_kafka_get_topics_configs_duration` | histogram |  |  |
| `console_indexer_kafka_get_topics_configs_duration_count` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_topics_configs_duration_max` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_topics_configs_duration_min` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_topics_configs_duration_sum` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_topics_partitions_duration` | histogram |  |  |
| `console_indexer_kafka_get_topics_partitions_duration_count` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_topics_partitions_duration_max` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_topics_partitions_duration_min` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_get_topics_partitions_duration_sum` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_init_cluster_connection_duration` | histogram |  |  |
| `console_indexer_kafka_init_cluster_connection_duration_count` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_init_cluster_connection_duration_max` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_init_cluster_connection_duration_min` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_init_cluster_connection_duration_sum` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_list_topics_duration` | histogram |  |  |
| `console_indexer_kafka_list_topics_duration_count` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_list_topics_duration_max` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_list_topics_duration_min` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_list_topics_duration_sum` |  | `time_unit`, `technical_id`, `cluster_type` |  |
| `console_indexer_kafka_total_duration` | histogram |  |  |
| `console_indexer_kafka_total_duration_count` |  | `time_unit` |  |
| `console_indexer_kafka_total_duration_max` |  | `time_unit` |  |
| `console_indexer_kafka_total_duration_min` |  | `time_unit` |  |
| `console_indexer_kafka_total_duration_sum` |  | `time_unit` |  |
| **Kafka connect indexing** |  |  |  |
| `console_indexer_kafka_connect_cluster_failed_count` | gauge |  |  |
| `console_indexer_kafka_connect_cluster_skipped_count` | gauge |  |  |
| `console_indexer_kafka_connect_cluster_succeeded_count` | gauge |  |  |
| `console_indexer_kafka_connect_cluster_timeout_count` | gauge |  |  |
| `console_indexer_kafka_connect_total_duration` | histogram |  |  |
| `console_indexer_kafka_connect_total_duration_count` |  | `time_unit` |  |
| `console_indexer_kafka_connect_total_duration_max` |  | `time_unit` |  |
| `console_indexer_kafka_connect_total_duration_min` |  | `time_unit` |  |
| `console_indexer_kafka_connect_total_duration_sum` |  | `time_unit` |  |
| **Schema registry indexing** |  |  |  |
| `console_indexer_schema_registry_cluster_failed_count` | gauge |  |  |
| `console_indexer_schema_registry_cluster_skipped_count` | gauge |  |  |
| `console_indexer_schema_registry_cluster_succeeded_count` | gauge |  |  |
| `console_indexer_schema_registry_cluster_timeout_count` | gauge |  |  |
| `console_indexer_schema_registry_total_duration` | histogram |  |  |
| `console_indexer_schema_registry_total_duration_count` |  | `time_unit` |  |
| `console_indexer_schema_registry_total_duration_max` |  | `time_unit` |  |
| `console_indexer_schema_registry_total_duration_min` |  | `time_unit` |  |
| `console_indexer_schema_registry_total_duration_sum` |  | `time_unit` |  |
