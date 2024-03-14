# Concentration

Concentration is feature offered by Conduktor Gateway to multiplex several virtual Kafka topics (concentrated topics) into a single physical Kafka topic.

For client applications, concentrated topics are totally like regular Kafka topics, they are just backed under the hood by a single physical topic.

Topic Concentration helps reduce costs on low-volume topics by co-locating the messages from different unrelated topics on the same physical topic-partitions behind the scenes.

# Concentrated TopicMapping

To achieve concentration we need to define a relationship (a mapping) between a client applications topic and its backing physical topic.

Such a relationship is called a Concentrated topic mapping. It consists of an association between logical topic name and the physical topic.

Along the lifecycle of the topic (produce, consume etc), the Gateway will manage offsets and partitions mapping to provide the same experience as a classical topic for end users.

### Limitations

-   ACL in delegated Kafka security aren't supported on Concentrated topics
-   Offset correctness: is still in progress
-   The physical topic must preexist
-   Topic configurations: must be compatible with the physical topic. Hence it is very important to think about it beforehand
    -   `retention.ms` of a gateway topic cannot exceed the retention of the physical topic
    -   Other topic creation configs must be omitted or equal to the physical topic configs

# ConcentrationRule

A concentration rule is a regex pattern applied on a newly created topic that defines which physical topic the new topic will be redirected to.

Example:

**Given** the following concentration rule :

-   pattern = "concentration-\*"
-   physical topic = "concentration-backing"

**When** a topic whose name matches "concentration-\*" (example: concentration-test) is created

**Then**

-   a concentrated topic mapping (concentration-test → concentration-backing) is added
-   The traffic/data of concentration-test is handled physically on the concentration-backing topic. Possibly also hosting other client applications topic with a name matchin the concentration rule.

The management of concentration rules is made through the REST API provided by Gateway.

          