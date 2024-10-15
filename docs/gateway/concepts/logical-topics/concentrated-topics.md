---
sidebar_position: 2
title: Concentrated Topics
description: Concentrated topics
---

## Overview 
Concentrated Topics transparently act as pointers to a single physical topic on your Kafka cluster.  They allow you to reduce costs on low-volume topics by co-locating messages.  
They are completely transparent to consumers and producers and allow you to emulate different partition counts irrespective of the backing physical topic's partition count.

## Usage
To create Concentrated Topics, first deploy a [ConcentrationRule](/gateway/reference/resources-reference/#concentrationrule):
````yaml
---
kind: ConcentrationRule
metadata:
  name: concentration1
spec:
  pattern: concentrated.*
  physicalTopics:
    delete: physical.topic
````

Now, create topics that match the ConcentrationRule `spec.pattern`

````bash
kafka-topics \
  --bootstrap-server conduktor-gateway:6969 \
  --topic concentrated.topicA \
  --partitions 3

kafka-topics \
  --bootstrap-server conduktor-gateway:6969 \
  --topic concentrated.topicB \
  --partitions 4
````

![Topic Concentration](./img/concentrated-topic.png)

In this case, we have 2 concentrated topics (`concentrated.topicA` & `concentrated.topicB`), with partition counts of 3 and 4 respectively, that are mapped to a single physical topic (`physical.topic`) with 3 partitions.

To ensure that consumers don't consume messages from other partitions or from other concentrated topics, we store the concentrated partition and the concentrated topic name in the record headers. Gateway will automatically filter the messages that should be returned to the consumer.

## Limitations
### Compact and Delete+Compact Topics
You can create concentrated topics with any cleanup.policy, but your ConcentrationRule must have a backing topic for each of them, otherwise it won't let you create the topic.
````yaml
---
kind: ConcentrationRule
metadata:
  name: concentration1
spec:
  pattern: concentrated.*
  physicalTopics:
    delete: physical.topic-delete
    compact: physical.topic-compact
    # deleteCompact: physical.topic-deletecompact
````
In this example, since the config for `spec.deleteCompact` is commented out, trying to create this topic will fail:

````bash
kafka-topics --create 
    --bootstrap-server conduktor-gateway:6969 \
    --topic <your-topic-name> \
    --partitions 3 \
    --config cleanup.policy=compact,delete
Error while executing topic command : Cleanup Policy is invalid
````

Backing topic cleanup policies are checked when you deploy a new ConcentrationRule. This prevents you from declaring a backing topic with a cleanup.policy of delete on a ConcentrationRule `spec.physicalTopic.compact` field.

### Restricted topic configurations

The following list of topic properties are the only allowed properties for concentrated topics:
- `partitions`
- `cleanup.policy`
- `retention.ms`
- `retention.bytes`
- `delete.retention.ms`

If any other configuration besides the above is set, the topic creation will fail with an error.

`retention.ms` and `retention.bytes` can be set to values lower or equal to the backing topic. If a user tries to create a topic with a higher value, topic creation will fail with an error:

```
kafka-topics --create 
    --bootstrap-server conduktor-gateway:6969 \
    --topic <your-topic-name> \
    --partitions 3 \
    --config retention.ms=704800000
Error while executing topic command : Value '704800000' for configuration 'retention.ms' is incompatible with physical topic value '604800000'.
```

This behavior can be altered with the flag `spec.autoManaged`.

:::caution
With concentrated topics, the enforced retention policy is the physical topic's retention policy, and not the policy requested at the concentrated topic creation time.

`retention.ms` and `retention.bytes` are not cleanup guarantees. They are retention guarantees.
:::




## Auto-managed backing topics

When `autoManaged` is enabled: 
- backing topics are automatically created with the default cluster configuration and partition count. 
- Concentrated topics created with higher `retention.ms` and `retention.bytes` are allowed. It automatically extends the configuration of the backing topic.


````yaml
---
kind: ConcentrationRule
metadata:
  name: concentration1
spec:
  pattern: concentrated.*
  physicalTopics:
    delete: physical.topic
  autoManaged: true
````

Let's check the backing topic retention on the physical cluster
````bash
kafka-configs --bootstrap-server kafka:9092 \
    --entity-type topics --entity-name physical.topic \
    --describe
Configs for topic 'physical.topic' are:
  cleanup.policy=delete
  retention.ms=604800000
  retention.bytes=-1
````
Let's try to create a Concentrated Topic with a higher retention on the Gateway
````bash
kafka-topics --create 
    --bootstrap-server conduktor-gateway:6969 \
    --topic <your-topic-name> \
    --partitions 3 \
    --config retention.ms=704800000
````
Let's review the backing topic again
````bash
kafka-configs --bootstrap-server kafka:9092 \
    --entity-type topics --entity-name physical.topic \
    --describe
Configs for topic 'physical.topic' are:
  cleanup.policy=delete
  retention.ms=704800000
  retention.bytes=-1
````
As we can see, the retention has been updated.

:::caution
If one user requests a topic with infinite retention (`retention.ms = -1`), **all topics** with the same cleanup policy associated with the rule will also inherit this extended configuration and have infinite retention.

:::

## Message Count & Lag, Offset (in)correctness

Concentrated topics & SQL topics are virtualized. This creates inconsistencies with existing tools in the Kafka ecosystem, including Conduktor Console.

Right now, the 2 most problematic calculations are **Lag** and **Message Count**. This is due to the calculation method that rely on partition **EndOffset**.

![Offset Incorrectness](img/offset-correct.png)

Any tooling will currently display the message count, and the lag relative to the `EndOffset` of the physical topic. This can create confusion for customers and applications that will see wrong metrics.

To counter this effect we have implemented a dedicated offset management capability for ConcentrationRules.

:::caution 
**This feature is experimental for now.**  
As we collect feedback and gain some knowledge on the feature, we'll transition this to all ConcentrationRules
:::

To enable virtual offsets, add the following line to the ConcentrationRule:

````yaml
---
kind: ConcentrationRule
metadata:
  name: concentration1
spec:
  pattern: concentrated.*
  physicalTopics:
    delete: physical.topic
  trueOffsets: true
````

- `spec.trueOffsets` only applies to Concentrated Topics with the `cleanup.policy=delete`
- `spec.trueOffsets` is not retroactive on previously created Concentrated Topics




## Performance

Gateway must read all the messages for all the consumers and skip the ones that are not necessary for each consumer.

TODO: Fill in results from https://github.com/conduktor/conduktor-proxy/pull/1726