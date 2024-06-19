---
sidebar_position: 1
title: Overview
description: Kafka is a powerful tool, with many nuances and great flexibility. However, this power and flexibility can lead to challenges around managing and bringing structure to your Kafka ecosystem, especially as it grows.
---

# Overview

## What is Conduktor Gateway?

Conduktor Gateway is a network proxy for Apache Kafka, complete with an extensible and dynamic plugin mechanism that can be used to add technical and business logic on top of your existing Kafka deployment.

This can be used to provide functionality that is not available in Kafka natively, such as:
 - End-to-end encryption
 - Safeguarding, through enforced configuration rules and business policies
 - Multi-tenancy through virtual clusters
 - Data Quality through schema validation

Conduktor Gateway is vendor-agnostic, meaning it supports all Kafka providers (Confluent, AWS MSK, Redpanda, Aiven, Apache Kafka), both cloud and on-premise.

To discover all functionality, see [Gateway demos](https://docs.conduktor.io/gateway/demos/).

## How it works

Conduktor Gateway is deployed between your client applications and existing Kafka clusters.   As it's Kafka protocol compliant, there are minimal adjustments required for clients other than pointing to a new bootstrap server.

![conduktor-gateway](./medias/conduktor-gateway.svg)

### Authentication

Much like Kafka brokers, Gateway supports multiple security protocols for Kafka client to Gateway authentication, such as PLAINTEXT, SSL, SASL SSL, mTLS. Equally, Gateway supports all Kafka security protocols for Gateway to Kafka authentication. Read more about [Gateway to Kafka Authentication](/gateway/configuration/kafka-authentication/) or [Client to Gateway Authentication](/gateway/configuration/client-authentication/).

### Interceptors

Once Gateway is deployed, interceptors are used to add technical and business logic, such as message encryption, inside your Gateway deployment. Interceptors can be deployed and managed through the [HTTP API](https://developers.conduktor.io/), and targeted at different granularities (Global, Virtual Cluster, Group, Username). Read more about [Interceptors](concepts/interceptors)

### Processing Flow

Kafka protocol requests, such as Produce requests, pass sequentially through each of the components in the pipeline, before being forwarded to the broker. When the broker returns a response, such as a Produce response, the components in the pipeline are invoked in reverse order, each having the opportunity to inspect and/or manipulate the response. Eventually, a response is returned to the client.

 ```mermaid
flowchart LR
    A[User App]
    subgraph G [Gateway]
        direction LR
        Auth[Authentication & </br> Authorization]
        subgraph I [Dynamic interceptor pipeline]
            direction LR
            I1(Plugin </br> priority: 1 </br> interceptor)
            I2(Plugin </br> priority: 10 </br> interceptor1 & interceptor2)
            I3(Plugin </br> priority: 42 </br> interceptor)
            I1 <--> I2 <--> I3
        end
        subgraph Core [Core features]
            direction TB
            LT(Logical Topics)
            VC(Virtual clusters)
        end
        Auth <--> I
    end
    subgraph K [Main Kafka cluster]
    B1(broker 1)
    B2(broker 2)
    B3(broker 3)
    B1 === B2 === B3
    end
    A <--> Auth
    I <--> Core
    Core <--> K
```

### What about scaling?
The Gateway is stateless and can be scaled horizontally by adding more instances and distributing the incoming traffic using a load balancer.

### What about resilience?
Much like Kafka, if a broker dies it can be restarted whilst Gateway keeps running. As the Gateway is Kafka protocol compliant, your applications remain available.

### What about latency?
By default, the Gateway operates with minimal impact on performance, typically adding only milliseconds of latency. However, if you begin implementing more resource-intensive features, such as encryption utilizing a Key Management Service (KMS), there will naturally be a slight increase in overhead.

## Resources

- [Get Started](./get-started/docker.md)
- [Concepts](./concepts/index.md)
- [Configuration](./configuration/index.md)
- [Support](https://www.conduktor.io/contact/support)
- [Arrange a technical demo](https://www.conduktor.io/contact/demo/?utm_source=docs&utm_medium=webpage)
- [Try demos yourself](https://github.com/conduktor/conduktor-gateway-demos)
- [Changelog](https://www.conduktor.io/changelog/)