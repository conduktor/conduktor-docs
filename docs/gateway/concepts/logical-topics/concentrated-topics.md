---
sidebar_position: 2
title: Concentrated Topics
description: Concentrated topics
---

## Overview 
Concentrated Topics transparently act as pointers to a single physical topic on your Kafka cluster.  They allow you to reduce costs on low-volume topics by co-locating messages.  
They are completely transparent to consumers and producers and allow you to emulate different partition counts irrespective of the backing physical topic's partition count.

To create Concentrated Topics, first deploy a [ConcentrationRule](/gateway/reference/resources-reference/#concentrationrule) and then, on the Gateway, create topics that match the ConcentrationRule `spec.pattern`:
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

![Topic Concentration](./img/concentrated-topic.png)

In this case, we have 2 concentrated topics (`concentrated.topicA` & `concentrated.topicB`), with partition counts of 3 and 4 respectively, that are mapped to a single physical topic (`physical.topic`) with 3 partitions.

To ensure that consumers don't consume messages from other partitions or from other concentrated topics, we store the concentrated partition and the concentrated topic name in the record headers. Gateway will automatically filter the messages that should be returned to the consumer.

## Limitations
### Compact and Delete+Compact Topics

### Available topic configurations


The following list of topic properties are the only allowed properties for concentrated topics:
- `partitions`
- `cleanup.policy`
- `retention.ms`
- `retention.bytes`
- `delete.retention.ms`

If any other configuration besides the above is being set, and is different from the physical cluster default, the topic creation will fail with an error.


If `autoManaged` is disabled, the `retention.ms` and `retention.bytes` values must not exceed the physical topic's configuration. Otherwise, the topic creation will fail with an error like the one below:

```
Error while executing topic command : Value '704800000' for configuration 'retention.ms' is incompatible with physical topic value '604800000'.
```


:::caution
With concentrated topics, the enforced retention policy is the physical topic's retention policy, and not the policy requested at the concentrated topic creation time.

`retention.ms` and `retention.bytes` are not cleanup guarantees. They are retention guarantees.
:::

### Auto-managed backing topics

The `autoManaged` flag, when enabled, will automatically create the physical topics with the default configuration of the physical cluster and the default number of partitions (`num.partitions`).

In this `autoManaged` mode, topics created by users will auto-extend the configuration (for example to honour the request `retention.ms`). As a result, if one users asks for a compacted topic with a retention of -1 (infinite), all other compacted topics associated with the concentration rule are now with infinite retention.


### Message Count & Lag, Offset (in)correctness


Concentrated topics & SQL topics are virtualized, which creates incompatibilities with existing tools in the Kafka Ecosystem (Conduktor included) that rely on topics metadata to generate reports, graphs or calculations.

Right now, the 2 most problematic calculations are **Lag** and **Message Count**. This is due to the calculation method that rely on partition **EndOffset**.

![Offset Incorrectness](img/offset-correct.png)

Any tooling will currently display the message count, and the lag relative to the `EndOffset`, of the physical topic. This can create confusion for customers and applications that will see wrong metrics.


#### Enabling `spec.trueOffsets` on ConcentrationRule



- `spec.trueOffsets` only applies to Concentrated Topics with the `cleanup.policy=delete`
  - instead of reporting the backing topic records offsets
    - Updating this value on an existing ConcentrationRule is risky because the offsets WILL change
    - Consumers with already committed offsets will either skip or reprocess messages depending on how the offsets are recalculated
    - 
- instead of reporting the backing topic records offsets
    - Updating this value on an existing ConcentrationRule is risky because the offsets WILL change
    - Consumers with already committed offsets will either skip or reprocess messages depending on how the offsets are recalculated


### Performance

Gateway must read all the messages for all the consumers and skip the ones that are not necessary for each consumer.