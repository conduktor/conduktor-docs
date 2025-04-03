---
sidebar_position: 3
title: System requirements
description: Hardware and Kafka requirements for Conduktor Gateway
---

Conduktor Gateway is provided as a [Docker image](../docker) and a [Helm chart](../kubernetes). These are hardware and Kafka requirements for Gateway.

## Hardware requirements

### Minimum setup

Per Gateway node, for light usage:

- 2 CPU cores
- 4 GB of RAM

Running on this level of machine, each Gateway instance should support around 20-30 MB/s of throughput with a minimal effect on latency.

### Recommended starting setup

Per Gateway node, for medium to high usage:

- 4 CPU cores
- 8 GB of RAM

Running on this level of machine, each Gateway instance should support around 40-50 MB/s of throughput with a minimal effect on latency.

For **production setups** we recommended that you **run at least three Gateway instances**. Any further scaling should be done horizontally first: to increase throughput, add instances to the cluster.

### Local storage requirements

Gateway itself doesn't use local storage but certain interceptors, such as [large message handling](/gateway/interceptors/advanced-patterns-support/large-message-and-batch-handling), might require temporary local storage.

## Scaling Gateway

Conduktor Gateway is **designed to scale horizontally or vertically**, as required.

Depending on your needs and use cases, one or both of these methods may be used to get the best out of Conduktor. Multiple instances of Gateway can be run as a cluster and Gateway will handle the load balancing and other work distribution concerns between the nodes in a cluster.

Gateway is predominantly CPU bound - it stores very little, unless you've configured or adjusted the default caching setup.

### Interceptor impact

Gateway should be tuned to your workloads based on the interceptors you intend to run - they generate most of the CPU load for Gateway.

The interceptors sit in line with the processing of a request, so they affect the end-to-end latency. Some do a lot more work than others. For example, any interceptor that needs to inspect the data being sent (such as field-level encryption or data quality), has a high CPU requirement. This is because the intercepted data has to be de-serialized and re-serialized.

For high CPU loads, you should also add more memory in addition to cores. We recommend to configure 4 GB of RAM per CPU. This provides more headroom for the underlying memory management to run (predominantly for the garbage collection in the JVM).

## Kafka requirements

Conduktor Gateway requires Apache Kafka version 2.5.0 or higher. Gateway should connect to Kafka as an 'admin user'. 

As a minimum, this user should have access to:

- manage topics and consumer groups
- commit offsets
- describe cluster information
