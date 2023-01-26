---
sidebar_position: 1
title: Important Notices
description: The following notes describe important changes that affect Conduktor Monitoring. 
---

# Important Notices

Below outlines important notices relating to Conduktor Platform.

### Monitoring is changing (January 27, 2023)

On **January 27, 2023**, we announced that as of **April** there will be changes made to improve the ease of setup and usability of Monitoring. 

Since launching in September 2022, we have listened carefully to customer feedback. One area that has been prone to misconfiguration is setting up the Prometheus Node/JMX exporter. Additionally, we lacked support for many bespoke integrations such as MSK Open Monitoring, Confluent Cloud and Strimzi. Conduktor’s goal has always been to make our users lives easier, not complicate them.

As a result, we are streamlining how we collect metrics. Moving forwards, all of our metrics will be collected agent-less, meaning you will get the benefits of Monitoring without any additional configuration. Simply add your cluster to your organisation, and we will start collecting metrics immediately. This will also enable us to **maximize our support for all Kafka vendors** out-of-the-box.

Though it will not be possible to derive every metric without any agent, we will continue to provide the most critical metrics for ensuring observability of your Kafka applications. See below on the metrics we will continue to collect.

<!-- prettier-ignore -->
| Context | Metric | Definition |
|-----|---------------|---------------|
| Apps Monitoring | Consumer group status | Indication of healthy or critical status based on lag(s). <br />Critical if max lag/s exceeds 180 |
| Apps Monitoring | Lag messages count | Number of messages each consumer group is behind per partition. |
| Apps Monitoring | Lag(s) | Estimated number of seconds each consumer group is behind in the topic. |
| Cluster Health | Messages count <br />per cluster (s) | This metric gives you the ability to gauge how active your producers are. Given batching and other factors this metric will change over time. |
| Cluster Health | Offline partitions count | Offline partitions can be caused by lingering capacity issues, crashed brokers or cluster wide faults. This is a critical factor in the healthiness of your cluster because an offline partition can not be produced to or consumed from. The view here is that of the controller, if the controller believes a partition is offline it may not reassign or bring online a leader. |
| Cluster Health | Under replicated partitions count | Under replicated partitions are a risk to data durability as well as availability. Under replicated partitions can happen for various reasons including, inability for replicas to keep up or network splits. |
| Cluster Health | Under min ISR partitions count | Under minimum ISR partitions do not meet the durability requirements to be produced to. Producers that try to produce messages to a partition that is under the specified minimum isr will have the messages rejected and be forced to handle the exception. |
| Cluster Health | Partitions count | Total number of partitions(including replicas) across selected Kafka cluster. |
| Cluster Health | Active brokers count | Number of active brokers on selected Kafka cluster. |
| Cluster Health | Active partitions count | Total number of partitions active on selected Kafka cluster. |
| Cluster Health | Active controllers count | Total number of active controllers on selected Kafka cluster. |
| Topic Monitoring | Messages in per topic (/s) | Number of messages produced per second, per broker at a topic granularity. |
| Topic Monitoring | Messages out per topic (/s) | Number of messages consumed per second, per broker at a topic granularity. |
| Topic Monitoring | Messages out per topic (/s) | Number of messages consumed per second, per broker at a topic granularity. |
| Topic Monitoring | Total size of messages | Total size of messages in the topic. |
| Topic Monitoring | Duplicates count | Duplicate message count over the last N minutes, per topic.  |
| Topic Monitoring | Distinct duplicates count | Number of distinct, duplicated messages over the last N minutes, per topic. |
| Topic Monitoring | Transaction abort count | Number of transactions aborted per topic. |
| Topic Monitoring | Batch size | Average size of batches produced to a topic. |
| Topic Monitoring | Messages per batch | Average number of messages produced per Batch to a topic. |
