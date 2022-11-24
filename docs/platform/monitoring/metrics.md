---
sidebar_position: 3
title: Metrics
description: Monitoring Metrics available in Conduktor Monitoring
---

# Metrics

Below details the metrics that are surfaced within Conduktor Monitoring.

You will have access to some metrics without any additional configuration, but you should install the [agent](/platform/monitoring/getting-started/agent-setup) to use Monitoring at full capacity.

<!-- prettier-ignore -->
| Context | Metric | Definition |
|-----|---------------|---------------|
| Apps Monitoring | Consumer group status | Indication of healthy or critical status based on lag(s). <br />Critical if max lag/s exceeds 180 |
| Apps Monitoring | Lag messages count | Number of messages each consumer group is behind per partition. |
| Apps Monitoring | Lag(s) | Estimated number of seconds each consumer group is behind in the topic. |
| Cluster Health | Messages count <br />per broker (s) | This metric gives you the ability to gauge how active your producers are. Given batching and other factors this metric will change over time. |
| Cluster Health | Messages in <br />per broker (B/s) | This metric gives you the amount of bandwidth, per broker, taken up by producers as well as replication from partitions the broker leads in your cluster. This is useful for planning well distributed leader placement. |
| Cluster Health | Messages out <br />per broker (B/s) | This metric indicates how much bandwidth, per broker, is being utilized by consumers, as well as for replication to the broker. This is useful for planning replica and leader placements. |
| Cluster Health | Offline partitions count | Offline partitions can be caused by lingering capacity issues, crashed brokers or cluster wide faults. This is a critical factor in the healthiness of your cluster because an offline partition can not be produced to or consumed from. The view here is that of the controller, if the controller believes a partition is offline it may not reassign or bring online a leader. |
| Cluster Health | Under replicated partitions count | Under replicated partitions are a risk to data durability as well as availability. Under replicated partitions can happen for various reasons including, inability for replicas to keep up or network splits. |
| Cluster Health | Under min ISR partitions count | Under minimum ISR partitions do not meet the durability requirements to be produced to. Producers that try to produce messages to a partition that is under the specified minimum isr will have the messages rejected and be forced to handle the exception. |
| Cluster Health | Disk - FS usage | If a Kafka broker fills up its disk durability and availability of data is at risk. Also producers will be unable to to produce to that broker. Filling a brokers' disk is also a hard incident to recover from and often involves loss of data. |
| Cluster Health | Partitions count | Total number of partitions(including replicas) across selected Kafka cluster. |
| Cluster Health | Active brokers count | Number of active brokers on selected Kafka cluster. |
| Cluster Health | Active partitions count | Total number of partitions active on selected Kafka cluster. |
| Cluster Health | Active controllers count | Total number of active controllers on selected Kafka cluster. |
| Topic Monitoring | Messages count per topic (/s) | Number of messages produced per second, per broker at a topic granularity. |
| Topic Monitoring | Topic traffic in (B/s) | Byte rate per second of messages produced, per broker at a topic granularity. |
| Topic Monitoring | Topic traffic out (B/s) | Byte rate per second of messages consumed, per broker at a topic granularity. |
| Topic Monitoring | Duplicates count | Duplicate message count over the last N minutes, per topic.  |
| Topic Monitoring | Distinct duplicates count | Number of distinct, duplicated messages over the last N minutes, per topic. |
| Topic Monitoring | Transaction abort count | Number of transactions aborted per topic. |
| Topic Monitoring | Batch size | Average size of batches produced to a topic. |
| Topic Monitoring | Messages per batch | Average number of messages produced per Batch to a topic. |
