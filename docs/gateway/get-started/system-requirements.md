---
sidebar_position: 3
title: System Requirements
description: Hardware and Kafka requirements for running Conduktor Gateway.
---

# System Requirements

Conduktor Gateway is provided as a [Docker image](#running-the-gateway) and [Helm chart](../kubernetes).

Below outlines both the Hardware and Kafka Requirements for running Conduktor Gateway.

## Hardware Requirements

**Minimum Setup - single node, light usage**

- 2 CPU cores
- 4 GB of RAM

**Recommended Starting Setup - single node, medium usage**

- 4 CPU cores
- 8 GB of RAM

This we would expect to support 40-50MB/s of throughput with a minimal affect on latency.

### Local Storage Requirements

Gateway itself does not use local storage, but certain interceptors, such as [Large message handling](/gateway/interceptors/advanced-patterns-support/large-message-and-batch-handling), might require temporary local storage. This is covered per interceptor in their documentation.

## Scaling Gateway to Your Use Cases

The Conduktor Gateway is designed to scale horizontally or vertically as required. Depending on your uses cases one or both of these may be required in order to get the right experience. Multiple instances of the gateway can be run as a cluster, and the gateway will handle the load balancing and other work distribution concerns for you between the nodes in a cluster.

Gateway is predominatly CPU bound - it stores very little unless you have configured or adjusted its caching setups. Gateway is best tuned to your workloads in two steps - transparently and then with interceptors. This is optional however, and good results can be achieved by tuning your full desired setup.

### Transparent Setup (Optional)

No interceptors, right size the core setup (SA, ACL, VCluster, Auth etc.)
This allows the right baseline for the core request/response handling in gateway to be configured, before the potentially more CPU intensive interceptor setups are applied.

### Interceptor Setups (Final State)

Once its happy transparently, now add interceptors. As these sit in line with the processing of a request, they affect the end to end latency you will see. Some interceptors do a lot more work than the others, grouping below ...

TBD full list.
safegaurd topic ... (low)
header injection ... (low)
...
Schema payload Validation (high)
Field level Encryption (highest)

Any plugin which requires the data to be de-seriliased from the messages has a high CPU inpact due to the costs of deserilisation and re-serialisation.

Add more memory for high CPU loads (switch to 4GB ram per CPU) to provide more headroom for the underlying memory management to run (predominitaly for the garbage collection in the JVM).



### Suggested Approach

Horizontal first.

Add interceptors - these affect CPU mostly
A bit of vertical

Then more horizontal.

Can scale past number of brokers.

Rule of thumb - 10MB/s per CPU, 2GB Ram per CPU.
For encryption especially, which is heavilly CPU bound, consider vertical scaling alongside horizontal. Go to 4GB Ram per CPU, and consider larger (8, 16 core) servers.

As ever, our teams are here to support you with your specific needs as we understand every use is different ...

## Kafka Requirements

Conduktor Gateway requires Apache Kafka version 2.5.0 or higher. Conduktor Gateway should connect to Kafka as an admin user. As a minimum this user should have rights to:

- Create/Delete/Alter topics
- Commit offsets
- Create/alter/delete consumer groups
- Describe cluster information

## Gateway Use of Kafka

The GW stores ... in kafka, needs topics ...

