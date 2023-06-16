---
sidebar_position: 1
title: Important Notices
description: The following notes describe important changes that affect Conduktor Monitoring. 
---

# Important Notices

Below outlines important notices relating to Conduktor Platform.

 - [Important changes regarding your production deployment (June 12th, 2023)](#important-changes-regarding-your-production-deployment-june-12th-2023)
 - [Important change when updating to Conduktor 1.15.0 (May 15, 2023)](#important-change-when-updating-to-conduktor-1150-may-15-2023)
 - [Important change when updating to Conduktor 1.14.0 (April 18, 2023)](#important-change-when-updating-to-conduktor-1140-april-18-2023)
 - [Monitoring is changing (January 27, 2023)](#monitoring-is-changing-january-27-2023)

### Important notice regarding production deployments (June 12th, 2023)

:::caution
We are deprecating support for the **embedded database** in an upcoming release. Additionally, you must ensure you have a **block storage (S3, GCS, Azure, Swift)** configured for storing your monitoring data.

Support for both the embedded database and using a container volume filesystem for monitoring data will be **removed** in an **August** release. If you require support in making these changes, please **[contact us](https://www.conduktor.io/contact/support/)** so we can help you. 
:::

Since v1.0, Conduktor has shipped with an **optional embedded database** for storing Console data. For demo and trial purposes, the embedded database allows you to get started quickly; storing data such as users, permissions, tags and configurations. However, it was never intended that the embedded database be used in production.

Equally, if you do not configure an external block storage for **monitoring data**, it has been possible to depend on the container volume filesystem. Again, this does not meet our [production requirements](../installation/hardware.md#production-requirements), as the volume will grow in size as your usage of Conduktor continues.

When deploying Conduktor in [production](../installation/hardware.md#production-requirements), we want to ensure you have a reliable, durable and recoverable deployment. 

As such, it is:
   - **Mandatory** to use an [external PostgreSQL (13+) database](../configuration/database.md). This will ensure you have a robust and supported migration path when updating Conduktor. It also ensures that you have an appropriate backup policy in case of a corrupt environment. 
   - **Mandatory** to setup [block storage (S3, GCS, Azure, Swift)](../configuration/env-variables.md#monitoring-properties) to store metrics data required for Monitoring. This will ensure your container volume does not grow indefinitely.
   - **Mandatory** to ensure you meet the [hardware requirements](../installation/hardware.md) necessary for running Conduktor.

If you are an existing customer with a production-grade deployment, it's vital that you review if you are adhering to these requirements. Support for both the embedded database and using a container volume filesystem for monitoring data will be **removed in an August release**.

If you require support in making these changes, our **[customer success team](https://www.conduktor.io/contact/support/)** are here to help. 





### Important change when updating to Conduktor 1.15.0 (May 15, 2023)

Note that in Conduktor 1.15.0, the Testing application will no longer be started by default on our on-premise deployment. It's still available on our Cloud version.
If you wish to start Testing alongside the Platform on-premise, you must start Conduktor using an explicit environment variable.

**How to start Platform with Testing?**

Set the environment variable `TESTING_ENABLED` to **true** when starting Conduktor. See docker image [environment variables](../configuration/env-variables.md).

**Why are we making this change?**

By removing the number of services started by default on-premise, this provides a performance optimisation for customers that are not currently using Testing.

---

### Important change when updating to Conduktor 1.14.0 (April 18, 2023)

For existing customers updating to Conduktor **1.14.0**, you **must** configure an explicit **root administrator account** else Conduktor will fail to start. Note this is an **additive change**, and you should not remove or update any other parts of your existing configuration.

:::caution
You should only set a **single root administrator** account in the platform configuration (used for initialization). However, it's possible to define multiple users with administrator role from within the Conduktor interface.
:::

**Steps to migrate**

Previously, your configuration file might have looked like:
```yaml
organization:
  name: conduktor

auth:
  local-users:
    - email: admin@conduktor.io
      password: admin
    - email: developer@conduktor.io
      password: he11oworld
```

After the update, your configuration should look like:

```yaml
organization:
  name: conduktor

admin:
  email: admin@conduktor.io
  password: admin

auth:
  local-users:
    - email: developer@conduktor.io
      password: he11oworld
```

Note that the administrator account can also be set via **environment variables:**
 - `CDK_ADMIN_EMAIL`
 - `CDK_ADMIN_PASSWORD`

Note **it's mandatory to have an administrator account defined for Conduktor to start**. If you were not using Conduktor prior to 1.14.0, then we recommend following the [simple setup](../installation/get-started/docker.md#simple-setup), which will guide you through creating an administrator account during the onboarding wizard.

---

### Monitoring is changing (January 27, 2023)

On **January 27, 2023**, we announced that as of **April 3rd, 2023** there will be changes made to improve the ease of setup and usability of Monitoring. 

Since launching in September 2022, we have listened carefully to customer feedback. One area that has been prone to misconfiguration is setting up the Prometheus Node/JMX exporter. Conduktor’s goal has always been to make our users lives easier, not complicate them. 

As a result, we will focus our immediate attention on providing an excellent Monitoring experience without the need for an Agent. This allows us to **maximize support for all Kafka vendors** out-of-the-box, rather than investing in a wide variety of bespoke setups and integrations. This means you will get the benefits of Monitoring without any additional configuration. Simply add your cluster to your organisation, and we will start collecting metrics immediately.

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
| Topic Monitoring | Duplicates count | Duplicate message count over the last N minutes, per topic. <br />Note this depends on Topic Analyzer being enabled.  |
| Topic Monitoring | Distinct duplicates count | Number of distinct, duplicated messages over the last N minutes, per topic. <br />Note this depends on Topic Analyzer being enabled. |
| Topic Monitoring | Transaction abort count | Number of transactions aborted per topic. <br />Note this depends on Topic Analyzer being enabled. |
| Topic Monitoring | Batch size | Average size of batches produced to a topic. <br />Note this depends on Topic Analyzer being enabled. |
| Topic Monitoring | Messages per batch | Average number of messages produced per Batch to a topic. <br />Note this depends on Topic Analyzer being enabled. |
