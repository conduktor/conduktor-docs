---
date: 2023-10-30
title: Live Consume, Service Accounts for Aiven & Confluent
description: Conduktor version 1.19
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

## Features ✨

- [Conduktor Console](#conduktor-console)
  - [Features ✨](#features-)
    - [Consume live messages](#consume-live-messages)
    - [Consume messages infinitely](#consume-messages-infinitely)
    - [Consume between dates (and obtain count statistics)](#consume-between-dates-and-obtain-count-statistics)
    - [Provider Integrations within Conduktor Console](#provider-integrations-within-conduktor-console)
    - [Conduktor Gateway Integration](#conduktor-gateway-integration)
    - [Aiven Cloud Integration](#aiven-cloud-integration)
    - [Confluent Cloud Integration](#confluent-cloud-integration)
    - [YAML and Environment Variables for Clusters](#yaml-and-environment-variables-for-clusters)
    - [Better memory configuration](#better-memory-configuration)
  - [Fixes 🔨](#fixes-)

***

### Consume live messages
You can now consume live messages from within the topic consume screen. Simply set the **limit filter** to **None** and you'll see new records flowing as they are being produced. Streaming data is beautiful, isn't it? 😉
![Live Consume](/images/changelog/platform/v19/live-consume.gif)

***

### Consume messages infinitely

We have finally said goodbye to the 5000 records limitation! If you wish to consume 100k records, 10M records, or even an entire topic, it's now possible! Note that for performance reasons, your browser will only store the most recent 5000 records available for browsing, or for use via the export feature.

Warning, we're not responsible for the sudden spike in your billing for Bytes-Out.

![Consume Between Dates](/images/changelog/platform/v19/infinite-annotated.png)

***

### Consume between dates (and obtain count statistics)

If you want to know how many messages were produced **between** two datetimes, you know have a **new limit option** dedicated for this. Simply apply the following filters:
 - **Show from**: `{datetime}`
 - **Limit**: `{datetime}`

![Consume Between Dates](/images/changelog/platform/v19/between-dates.png)

It works particularly well in conjunction with **filters**, whereby you can now count how many messages matched your filters and how many total messages were produced between those dates. 

Note that in the example below, **190** records matches the filter conditions, out of the total **10,522** consumed.

![Consume Between Dates](/images/changelog/platform/v19/between-filters.png)

***

### Provider Integrations within Conduktor Console
Connect with your Kafka Provider to manage their benefits directly in Conduktor Console.  With this first iteration, we bring features to Console that are only available with the provider's APIs.  

![Provider Tab](/images/changelog/platform/v19/provider-tab.png)

***

### Conduktor Gateway Integration
You can now connect our other product artefact, Conduktor Gateway, to the Conduktor Console. This enables you to configure interceptors on Gateway virtual clusters through a dedicated set of pages accessible via the **Gateway Interceptors** tab.

Note that you will need to be connected to a Gateway cluster to utilize this feature. You can explore interactive demos below:
 - [Configure end-to-end encryption on Kafka topics](https://conduktor.navattic.com/full-message-encryption)
 - [Enforcing governance on configurations when creating topics](https://conduktor.navattic.com/governance-demo)

![Gateway](/images/changelog/platform/v19/gateway.png)

***

### Aiven Cloud Integration
We now support the following resources from Aiven Cloud:
- Manage Service Accounts
- Manage ACLs

To manage Aiven resources, navigate to the **Service Accounts** screen when connected to an Aiven Kafka cluster.

![Aiven](/images/changelog/platform/v19/aiven.png)

***

### Confluent Cloud Integration
We now support the following resources from Confluent Cloud:
- Manage Service Accounts & ACLs
- Manage API Keys

To manage Confluent Cloud resources, navigate to the **Service Accounts** screen when connected to a Confluent Cloud Kafka cluster.

![Confluent List](/images/changelog/platform/v19/confluent-list.png)
![Confluent API](/images/changelog/platform/v19/confluent-api-keys.png)

***

### YAML and Environment Variables for Clusters
Kafka Clusters, Schema Registry and Kafka Connects configurations are now properly synced when configured from Yaml and Environment Variables (ie. GitOps way)
````yaml
clusters:
  - id: ccloud
    name: Confluent Cloud ABCD
    bootstrapServers: lkc-abcd.europe-west1.gcp.confluent.cloud:9092
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=PLAIN
      sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required \
        username='<CLUSTER-API-KEY>' \ 
        password='<CLUSTER-API-PASSWORD>';
    kafkaflavor: # Optional, for Service Accounts & Api Key support
      type: Confluent
      key: "<GLOBAL-API-KEY>"
      secret: "<GLOBAL-API-SECRET>"
      confluentEnvironmentId: "env-abcd"
      confluentClusterId: "lkc-abcd"
    schemaRegistry:
      url: http://abcd.europe-west1.gcp.confluent.cloud/
      security:
        username: <REGISTRY-API-KEY>
        password: <REGISTRY-API-PASSWORD>
    kafkaConnects:
      - id: kafka-connect-1
        name: Connect 1
        url: http://kafka-connect-1:8083/
        security:
          username: username
          password: password
    
````
Previously, configuring clusters using Yaml or Environment Variables was acting as INSERT-only (ie. Not Gitops).

We still recommend the use of Console API to maintain your Cluster configurations

***

### Better memory configuration

**RUN_MODE** is gone!  
We now rely on container CGroups limits and use up to 80% of container memory limit for JVM max heap size.
Our settings are the following
```` shell
-XX:+UseContainerSupport -XX:MaxRAMPercentage=80
````

**What does it mean for you?**  
You now only need to care about the limits that you set to your container.  
Read [this article](https://bell-sw.com/announcements/2020/10/28/JVM-in-Linux-containers-surviving-the-isolation/) to understand what this is about.

***

## Fixes 🔨

- Optimized the AdminClient instances usage across Console, by reusing a shared instance as much as possible. This will hugely decrease the number of AdminClient authentications.
- Fixed an issue on Consumer Group details where unassigned partitions were showing as part of an active member
- Fixed an issue on Consumer Group Page where pagination and search didn't work together properly
- Fixed an issue with JS filters when keys contain special characters like '.' or '-' (Use `value["custom.key"]` instead of `value.custom.key`)
- Fixed an issue where Console Group description could not be updated
- Added a message and link to documentation when browsing monitoring while it's not configured
- Fixed an issue that sometimes forced users to cleanup their browser cache after restarting Console
- Removed output logs that were not useful and added others
- Added flushing metrics on AWS S3 or Azure Blob Storage when cortex shuts down, preventing monitoring data loss during restarts or updates
- Added support for array in Environments Variables (ie. `CDK_SSO_OAUTH2_0_SCOPES=scope1,scope2`)
- Added support for Cortex configuration overrides (mounting a file in `/opt/override-configs/cortex.yaml`)