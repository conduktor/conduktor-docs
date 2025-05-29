---
sidebar_position: 300
title: Monitoring metrics
description: Set up monitoring and metrics using Conduktor
---

| Context | Metric | Description |
|-----|---------------|---------------|
| Apps monitoring | Consumer group status | Indication of healthy or critical status based on lag. <br />Critical if max lag/s exceeds 180. |
| Apps monitoring | Lag messages count | Number of messages each consumer group is behind per partition. |
| Apps monitoring | Lag(s) | Estimated number of seconds each consumer group is behind in the topic. |
| Cluster health | Messages count <br />per broker (s) | This metric gives you the ability to gauge how active your producers are. Given batching and other factors this metric will change over time. |
| Cluster health | Messages in <br />per broker (B/s) | This metric gives you the amount of bandwidth, per broker, taken up by producers as well as replication from partitions the broker leads in your cluster. This is useful for planning well distributed leader placement. |
| Cluster health | Messages out <br />per broker (B/s) | This metric indicates how much bandwidth, per broker, is being utilized by consumers, as well as for replication to the broker. This is useful for planning replica and leader placements. |
| Cluster health | Offline partitions count | Offline partitions can be caused by lingering capacity issues, crashed brokers or cluster wide faults. This is a critical factor in the healthiness of your cluster because an offline partition can not be produced to or consumed from. The view here is that of the controller, if the controller believes a partition is offline it may not reassign or bring online a leader. |
| Cluster health | Under replicated partitions count | Under replicated partitions are a risk to data durability as well as availability. Under replicated partitions can happen for various reasons including, inability for replicas to keep up or network splits. |
| Cluster health | Under min ISR partitions count | Under minimum ISR partitions do not meet the durability requirements to be produced to. Producers that try to produce messages to a partition that is under the specified minimum ISR will have the messages rejected and be forced to handle the exception. |
| Cluster health | Disk - FS usage | If a Kafka broker fills up its disk durability and availability of data is at risk. Producers will also be unable to produce to that broker. Filling a broker's disk is also a hard incident to recover from and often involves loss of data. |
| Cluster health | Partitions count | Total number of partitions (including replicas) across the selected Kafka cluster. |
| Cluster health | Active brokers count | Number of active brokers on the selected Kafka cluster. |
| Cluster health | Active partitions count | Total number of partitions active on the selected Kafka cluster. |
| Cluster health | Active controllers count | Total number of active controllers on the selected Kafka cluster. |
| Topic monitoring | Messages count per topic (/s) | Number of messages produced per second, per broker at a topic granularity. |
| Topic monitoring | Topic traffic in (B/s) | Byte rate per second of messages produced, per broker at a topic granularity. |
| Topic monitoring | Topic traffic out (B/s) | Byte rate per second of messages consumed, per broker at a topic granularity. |
| Topic monitoring | Total size of messages | Total size of messages in the topic. |
