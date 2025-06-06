---
sidebar_position: 2
title: Topic Catalog
description: Kafka Self-service Overview
---

:::tip
Self-service UI is almost entirely Read-only for now.  
Use the CLI to interact with the product.
:::

## Topic Catalog page

The Topic Catalog lets you search through the Topics marked as public deployed in your organization.

You can filter by multiple dimensions: Application, Kafka Cluster, and also the Topic metadata.

![TopicCatalog](assets/topic-catalog.png)

## Topic subscription

Application owners can subscribe to topics outside their own application using the Topic Catalog. When viewing a topic in the catalog, click **Subscribe** to initiate a subscription request.

The subscription modal lets you select from a list of applications and focuses only on valid instances that share the same Kafka cluster as the topic. You can also configure the request details, pick `read` or `write` access per subscription with granular controls over both user and service account permissions.

![Topic catalog subscribe modal](/images/changelog/platform/v34/topic-catalog-subscribe.png)

Once submitted, the subscription requests are routed to the appropriate application owners for review and approval. 

The status of your requests can be tracked within the application catalog page.