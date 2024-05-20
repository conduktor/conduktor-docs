---
sidebar_position: 4
title: Virtual Clusters
description: What a virtual cluster is 
---

A Virtual Cluster in Conduktor Gateway is a logical representation of a Kafka cluster. This innovative concept allows users to create multiple virtual clusters while maintaining just a single physical Kafka cluster. Essentially, it enables the simulation of multiple Kafka environments on a single physical infrastructure.

![image.png](../medias/vclusters.png)

:::info
Virtual Cluster concept is entirely **optional**.  
  
If you choose not to configure any Virtual Clusters, Conduktor Gateway will act as a transparent proxy for your backing Kafka Cluster. 
This is the default mode and all topics and resources will be visible and accessible as usual, without any additional configuration.  
  
Technically, this mode is also a Virtual Cluster called [Passthrough](#passthrough).
:::

### Why Use Virtual Clusters?
**Flexibility and Scalability**: Virtual Clusters provide the flexibility to simulate multiple independent Kafka clusters without the need for additional physical resources. This is particularly useful for environments where different teams or applications require separate Kafka instances but maintaining multiple physical clusters would be cost-prohibitive or complex.

**Isolation and Multitenancy**: By using Virtual Clusters, you can ensure isolation between different logical clusters, similar to enabling multitenancy in Kafka. Each Virtual Cluster can have its own set of topics and consumer groups, and these are managed independently even though they reside on the same physical cluster.

**Resource Efficiency**: Instead of deploying and managing multiple physical clusters, which can be resource-intensive and expensive, Virtual Clusters allow you to maximize the utilization of a single physical Kafka cluster. This leads to better resource management and operational efficiency.

### How Do Virtual Clusters Work?
When you create a Virtual Cluster in Conduktor Gateway, it prefixes all resources (such as topics and consumer groups) associated with that Virtual Cluster on the backing physical Kafka cluster. This prefixing ensures that there is no overlap or conflict between resources belonging to different Virtual Clusters, thereby maintaining their isolation.




In the following example, we assume a topic `order` has been created on Virtual Cluster `vc-alice`. Let's see how other Virtual Clusters and Backing cluster perceive this.
````shell
# Listing topics on Virtual Cluster vc-alice
$ kafka-topics.sh --bootstrap-server=gateway:9092 --command-config vc-alice.properties  --list
orders

# As expected, Alice see its topic normally. Now let's check what Bob sees...
$ kafka-topics.sh --bootstrap-server=gateway:9092 --command-config vc-alice.properties  --list
[]
# Bob doesn't see Alice's topics.


# If we contact directly the backing cluster instead of the gateway, 
# we can see alice's topic under a different name, and other topics
$ kafka-topics.sh --bootstrap-server=backing-kafka:9092  --list
vc-alice.orders
__consumer_offsets
...
````


<hr />

# OLD OLD OLD

A Virtual Cluster (for "virtual cluster") is a logical representation of a Kafka cluster in Conduktor Gateway. Thanks to this concept, Conduktor Gateway enables Kafka users to create as many (virtual) clusters as they wish while having only a single physical kafka cluster deployed.

## Isolation

The primary goal of Virtual Clusters is to multiplex several logical Kafka clusters on a single physical Kafka clusters. For that we need to ensure isolation between the different Virtual Clusters (like if we enabled multitenancy in Kafka).

To achieve isolation every Virtual Cluster has a **prefix**.

The principle is that any kafka resource (topic, group id, transactional id) whose key starts with a Virtual Cluster's prefix will be accessible from this Virtual Cluster.

![image.png](../medias/Virtual Clusters.png)

## Passthrough

There is one special case, a Virtual Cluster with a prefix defined with the special name `passthrough` will not use any prefixing whether it reads or writes in Kafka. As a consequence, every resource on the physical Kafka is potentially accessible in this Virtual Cluster.

![image.png](../medias/passthrough.png)

**Naming**: The `passthrough` Virtual Cluster is equivalent to a transparent Virtual Cluster.

Since the prefix must be unique, a Gateway instance can only have one single `passthrough` Virtual Cluster.
