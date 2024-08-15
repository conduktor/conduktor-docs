---
date: 2024-02-26
title: ksqlDB, monitoring metrics and smarter tables
description: docker pull conduktor/conduktor-console:1.21.0
solutions: console
tags: features,fix
---

Remember, you can always:

- Submit your feedback via our [public roadmap](https://product.conduktor.help/)
- Visit our [Get Started](https://www.conduktor.io/get-started/) page to test our latest version of Conduktor
- Receive updates on our future Releases via our [Support Portal](https://support.conduktor.io/hc/en-gb/sections/16400553827473-Conduktor-Console) and selecting **follow**

# Conduktor Console

## Future Breaking Changes 💣
### New docker image name
To clarify our product naming we have renamed the Console docker image to `conduktor/conduktor-console`.

We will publish newer versions using both names for the next **three releases** only. Please modify your installation to reflect this change in advance of us deprecating the name `conduktor-platform`.

````shell
docker pull conduktor/conduktor-console:1.21.0
````

## Features ✨

- [ksqlDB](#ksql-db)
- [Metrics available via Prometheus](#subscribe-to-metrics-via-the-prometheus-endpoint)
- [Smart tables for Connect and Schema Registry](#smart-tables-for-kafka-connect-and-schema-registry-subjects)
- [Add Local Users from the UI](#add-local-users-from-the-ui)
- [Fixes](#fixes-🔨)

---

### ksqlDB
Say hello to seamless integration with ksqlDB for you and your team on Conduktor Console.   
Grant permission to whom can access the interface to create queries, setup new connections and visualise the existing connections.

Now you can:

* Browse ksqlDB clusters that are connected to Console
* Visualize all the currently running queries as well as write your own queries or executes statements
* Visualize and act on the running Streams (resulting from CREATE STREAM statements) with the **Streams** tab
* Visualize and act on the running Streams (resulting from CREATE TABLE statements) with the **Tables** tab
* Show all the Persistent and Push queries currently running on the ksqlDB Cluster with the **Queries** tab
* Execute Pull and Pull Queries (SELECT) and Statements (CREATE, DESCRIBE, DROP, ...) with the **Editor** tab

More info about kSQL is available on [their website](https://docs.ksqldb.io/en/latest/concepts/).

For more information [checkout the docs](https://docs.conduktor.io/platform/navigation/console/ksqldb/).

![New navigation](/images/changelog/platform/v21/ksqlComp.png)

### Subscribe to metrics via the Prometheus endpoint

Gain deeper insights into your system's performance with metrics now readily available via the Prometheus endpoint. No need for yet another system to monitor, seamlessly integrate metrics directly into your external log system in the Prometheus format, allowing for effortless monitoring and optimization of Conduktor within your systems.

You can monitor metrics such as under replicated partitions, total & failed connector tasks and consumer group lags. For the full list of available metrics [checkout the docs](https://docs.conduktor.io/platform/reference/metric-reference/).

### Smart tables for Kafka Connect and Schema Registry subjects

Get the answers you need quicker with the new tables. Sort by what matters, be that subject name, version count, latest version and more! For Connect there's all the usual suspects: source/sink, topics, the connect cluster and importantly the state (e.g. Failed, Paused). Quickly find which connectors are failing with just one click. 

Choose what columns to hide the noise. Filter on name, tags and other resource metatdata such as consumer group state.

### Add Local Users from the UI

Don't have SSO ? Now you can add Users directly from the Users & Groups page in Settings, instead of modifying the config file and restarting the Console.
![Add Users](/images/changelog/platform/v21/add-users.png)

## Fixes 🔨
- Added support for complex union-type avro messages in Console Producer
- Fixed a blank screen issue after login due to case-sensitivity bug with email address
- Fixed an issue where Message Reprocessing didn't work after refreshing the page
- Resolved an issue with MSK role assumption
- Fixed an issue with custom certificates for Schema Registry and Kafka Connect
- Fixed several issues improving indexing performance on large clusters
- Increased cortex ingestion limits for large clusters
- Fixed an issue that occurs when `Group:` ACLs are present
