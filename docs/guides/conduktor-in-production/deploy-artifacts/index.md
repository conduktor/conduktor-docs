---
sidebar_position: 50
id: index
title: Conduktor artifact overview
description: Conduktor artifact overview
---

Conduktor platform consists of these <GlossaryTerm>artifacts</GlossaryTerm>:

- [Gateway](#gateway)- a network proxy for Apache Kafka, complete with an extensible and dynamic plugin mechanism that can be used to add technical and business logic on top of your existing Kafka deployment.

- [Console](#console) - the centralized UI-based control plane for managing Kafka

- [Conduktor CLI](/guides/conduktor-in-production/automate/cli-automation) - an alternative to the UI, our Command Line Interface lets you automate repetitive actions.

- [Cortex](/guides/conduktor-in-production/deploy-artifacts/cortex) - the monitoring component for Conduktor Platform that runs in the background.

## Gateway

Conduktor Gateway is deployed between your client applications and existing Kafka clusters. As it's Kafka protocol compliant, there are minimal adjustments required for clients other than pointing to a new bootstrap server.

![Conduktor Gateway](/guides/gateway-integration.png)

### Benefits

This can be used to provide functionality that is not available in Kafka natively, such as:

- **Centrally configure encryption** at the field-level or full payload, to secure your data during transit and at rest, before the cluster
- **Mask sensitive data** across topics and set access rules, so users only see what they’re authorized to
- **Set granular RBAC controls** to manage access and permissions for data at the cluster, team or individual level 
- **Leverage multi-tenancy** with virtual clusters to optimize resources and reduce operational overheads
- **Empower development teams** to manage their data within a federated control framework, accelerating project delivery

Conduktor Gateway is vendor-agnostic, meaning it supports all Kafka providers (Confluent, AWS MSK, Redpanda, Aiven, Apache Kafka), both cloud and on-premise.

### How it works

Conduktor Gateway is deployed between your client applications and existing Kafka clusters. As it's Kafka protocol compliant, there are minimal adjustments required for clients other than pointing to a new bootstrap server.

#### Authentication

Much like Kafka brokers, Gateway supports multiple security protocols for Kafka client to Gateway authentication, such as PLAINTEXT, SSL, SASL SSL, mTLS. Equally, Gateway supports all Kafka security protocols for Gateway to Kafka authentication.

#### Interceptors

Once Gateway is deployed, <GlossaryTerm>Interceptors</GlossaryTerm> are used to add technical and business logic, such as message encryption, inside your Gateway deployment. Interceptors can be deployed and managed through the [API](https://developers.conduktor.io/?product=gateway) and targeted at a different scope (Global, Virtual Cluster, Group, Username). [Find out more about Interceptors](/guides/conduktor-concepts/interceptors).

#### Processing flow

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

#### Scaling

The Gateway is stateless and can be scaled horizontally by adding more instances and distributing the incoming traffic using a load balancer.

#### Resilience

Much like Kafka, if a broker dies it can be restarted whilst Gateway keeps running. As the Gateway is Kafka protocol compliant, your applications remain available.

#### Latency

By default, the Gateway operates with minimal impact on performance, typically adding only milliseconds of latency. However, if you begin implementing more resource-intensive features, such as encryption utilizing a Key Management Service (KMS), there will naturally be a slight increase in overhead.

## Console

## CLI

## Cortex

### Related resources

- [Check out our recommended architecture on GitHub](https://github.com/conduktor/conduktor-reference-architecture)
- [Try out Conduktor tutorials](/guides/tutorials/index)
