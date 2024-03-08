---
sidebar_position: 4
title: Concentrated Topics
description: Concentrated topics
---

Concentration is feature offered by Conduktor Gateway to multiplex several Kafka topics (concentrated topics) into a single physical Kafka topic from the perspective of the client.

For client applications, concentrated topics are totally like regular Kafka topics, they are just backed under the hood by a single physical topic. The topic the client is seeing and using is the concentrated topic, a flavour of Conduktor's logical topics, reminder of the [topic naming convention](/gateway/reference/reference-docs/#topics).

Topic Concentration helps reduce costs on low-volume topics by co-locating the messages from different unrelated topics on the same physical topic-partitions behind the scenes.

## Concentrated Topic Mapping
To achieve concentration we need to define a relationship (a mapping) between a client application's topic and its backing physical topic.
Such a relationship is called a **Concentrated topic mapping**. It consists of an association between the logical topic name and the physical topic.
Along the lifecycle of the topic (produce, consume etc), the Gateway will manage offsets and partitions mapping to provide the same experience as a classical topic for end users.

## Limitations
* The physical topic must preexist
* Topic configurations: must be compatible with the physical topic. Hence it is very important to think about it beforehand
    * `retention.ms` of the logical topic cannot exceed the retention of the backing physical topic
    * Other topic creation configs must be omitted or equal to the physical topic configs

## Concentration Rule
A concentration rule is a regex pattern applied on a newly created topic that defines which physical topic the new concentrated topic will be redirected to.

Example:

**Given** the following concentration rule:
* pattern = "concentration-*"
* physical topic = "concentration-backing"

**When** a topic whose name matches "concentration-*" (example: concentration-test) is created

**Then**
* A concentrated topic mapping (concentration-test → concentration-backing)  is added
* The traffic/data of concentration-test is handled physically on the concentration-backing topic. Possibly also hosting other client application's topics with a name matching the concentration rule

The management of concentration rules is made through the GATEWAY HHTP REST API.