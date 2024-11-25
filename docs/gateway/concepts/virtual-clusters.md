---
sidebar_position: 5
title: Virtual Clusters
description: What a virtual cluster is 
---

A Virtual Cluster in Conduktor Gateway is a logical representation of a Kafka cluster. This innovative concept allows users to create multiple virtual clusters while maintaining just a single physical Kafka cluster. Essentially, it enables the simulation of multiple Kafka environments on a single physical infrastructure.

![image.png](../medias/vclusters.png)

:::info
Virtual Cluster concept is entirely **optional**.  
  
If you choose not to configure any Virtual Clusters, Conduktor Gateway will act as a transparent proxy for your backing Kafka Cluster. 
This is the default mode and all topics and resources will be visible and accessible as usual, without any additional configuration.  
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
$ kafka-topics --bootstrap-server=gateway:6969 --command-config vc-alice.properties --list
orders
# As expected, Alice sees its topic normally. 

# Now let's check what happens if we list the topics with Bob
$ kafka-topics --bootstrap-server=gateway:6969 --command-config vc-bob.properties --list
[]
# Bob doesn't see Alice's topics. 

# Let's try to create the same topic for Bob
$ kafka-topics --bootstrap-server=gateway:6969 --command-config vc-bob.properties --create --topic orders 
$ kafka-topics --bootstrap-server=gateway:6969 --command-config vc-bob.properties --list
orders

# If we contact directly the backing cluster instead of the gateway, 
# we can see both topics under a different name. This is the actual topic name on the Kafka cluster, which is observed when not interacting through the Gateway.
$ kafka-topics.sh --bootstrap-server=backing-kafka:9092  --list
vc-alice.orders
vc-bob.orders

````
