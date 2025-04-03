---
sidebar_position: 3
title: System Requirements
description: Hardware and Kafka requirements for running Conduktor Gateway.
---

# System Requirements

Conduktor Gateway is provided as a [Docker image](#running-the-gateway) and [Helm chart](../kubernetes).

Below outlines both the Hardware and Kafka Requirements for running Conduktor Gateway.

## Hardware Requirements

### Minimum Setup

Per single node, light usage

- 2 CPU cores
- 4 GB of RAM

This we would expect each gateway instance to support 20-30MB/s of throughput with a minimal affect on latency.

### Recommended Starting Setup

Per single node, medium to high usage

- 4 CPU cores
- 8 GB of RAM

This we would expect each gateway instance to support 40-50MB/s of throughput with a minimal affect on latency, and it is recommended that you run at least three gateway instances. 

### Local Storage Requirements

Gateway itself does not use local storage, but certain interceptors, such as [Large message handling](/gateway/interceptors/advanced-patterns-support/large-message-and-batch-handling), might require temporary local storage. This is covered per interceptor in their documentation.

## Scaling Gateway to Your Use Cases

The Conduktor Gateway is designed to scale horizontally or vertically as required. Depending on your uses cases one or both of these may be required in order to get the right experience. Multiple instances of the gateway can be run as a cluster, and the gateway will handle the load balancing and other work distribution concerns for you between the nodes in a cluster.

Gateway is predominatly CPU bound - it stores very little unless you have configured or adjusted its caching setups. Gateway is best tuned to your workloads based on the interceptors you intend to run, as the interceptors are what geneartes most of the CPU load for gateway.


### Impact of Interceptors

The interceptors sit in line with the processing of a request, and as such they affect the end to end latency you will see. Some interceptors do a lot more work than the others, as a rule any interceptor that needs to inspect the data being sent (e.g. field level encryption, data quailty etc.) has a high CPU requirement. This is due to having to deseriliase and re-serialise the data which is being interpceted.

As well as cores, you should also add more memory for high CPU loads - our recommendataion is to configure 4GB ram per CPU. This provides more headroom for the underlying memory management to run (predominitaly for the garbage collection in the JVM).


## Kafka Requirements

Conduktor Gateway requires Apache Kafka version 2.5.0 or higher. Conduktor Gateway should connect to Kafka as an admin user. As a minimum this user should have rights to:

- Create/Delete/Alter topics
- Commit offsets
- Create/alter/delete consumer groups
- Describe cluster information

