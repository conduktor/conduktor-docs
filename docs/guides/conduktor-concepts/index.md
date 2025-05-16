---
sidebar_position: 240
id: index
title: Conduktor concepts
description: Learn Conduktor terminology
---

For an alphabetical list of all our terminology, [check out Conduktor glossary](/glossary).

### Gateway

When working with <GlossaryTerm>Apache Kafka</GlossaryTerm>, you'll need to configure various broker settings.
When working with Apache Kafka, you'll need to configure various <GlossaryTerm>broker</GlossaryTerm> settings.

Conduktor Gateway is deployed between your client applications and existing Kafka clusters. As it's Kafka protocol compliant, there are minimal adjustments required for clients other than pointing to a new bootstrap server.

![Conduktor Gateway](/guides/gateway-integration.png)

Conduktor Gateway extends Kafka to provide new functionalities with different techniques:

- **Interceptors** are pluggable components that augment Kafka by intercepting specific requests of the Kafka protocol and applying operations to it.
- **Core features** like Authentication, Virtual clusters, Logical Topics and Failover are features that blend much more deeply the Kafka protocol. For that reason, we decided they should be experienced as dedicated features for simplicity and ease of understanding (as opposed to pluggable Interceptors).

Most core features and all interceptors can be configured using the Gateway [HTTP API](https://developers.conduktor.io/).

## Interceptors

Conduktor Gateway has a significant number of Interceptors available to satisfy many different use-cases. Check out Interceptor Catalog for details.

A few examples:

- Full-body or field-level Encryption and Decryption
- Reject (during produce) or Skip (during consume) records that don't match business data quality rules
- Enforce producer configurations such as acks or compression
- Enforce or override configurations during a CreateTopic request, such as replication factor or naming convention

To deploy an Interceptor, you need to prepare its configuration. Configuring and deploying an interceptor is a bit similar to what you'd do with Kafka Connect Connectors.

Here's an example for an interceptor that will block the creation of topics with more than 6 partitions:

````json
POST /admin/interceptors/v1/interceptor/enforce-partition-limit
{
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "numPartition": {
      "min": 1,
      "max": 6,
      "action": "BLOCK"
    }
}
}
````

Interceptors also combine with each other to create very powerful interactions and solve many interesting use-cases in different ways.

The most basic possibility is to chain them together so that each interceptor performs its action sequentially and independently, and pass its result to the next.

The order of execution is determined by the **priority** of each interceptor. Lower numbers gets executed first.

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
    A --> Auth
    I <--> Core
    Core <--> K
```

More advanced behaviors can also be configured such as **Scoping** and **Overriding**. They are presented in the detailed Interceptor Concepts page.
