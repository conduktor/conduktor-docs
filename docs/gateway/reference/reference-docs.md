---
sidebar_position: 1
title: Reference Docs
description: Reference documentation
---

Gateway is a Kafka proxy. That means a large amount of it's job is to transform and filter Kafka messages between Kafka clients and Kafka brokers and to be transparent. Any modifications to messages are managed by the plugins, known as interceptors.

But Gateway also provides a set of features on top of Kafka that are going further than only Kafka message transformation, features that create and manage a set of specific resources that can only be managed by calling Gateway.

## Gateway managed resources
Gateway has some features that you can't manage directly through the regulay Kafka APIs.

Here is a list of Gateway specific resources:
 - User Mappings
 - Virtual Clusters
 - Topic Mappings
 - Alias Topics
 - Concentrated Topics

Everything connected to those resources are managed by Gateway via the HTTP API.

### Topics
As we're dealing with different types of topics to the regular Kafka topic we have a common topology for these resources.

* **Physical topics**: The regular Kafka topic.
* **Logical topics**: A Conduktor topic. Does not exist on the Kafka cluster.
    * **Alias topics**: A logical topic that points to a physical topic.
    * **Concentrated topics**: A logical topic that is aggregated alongside other concentrated topics onto a physical topic. The client only sees the concentrated topic.
    * **SQL topics**: A logical topic that is configured with a SQL statement.