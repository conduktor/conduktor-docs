---
title: Interceptors
description: Learn Conduktor terminology
---

import Label from '@site/src/components/Labels';
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

Conduktor <GlossaryTerm>Gateway</GlossaryTerm> offers a number of powerful Interceptors that enhance your Kafka usage. For example, you can use them to:

- perform full-body or field-level encryption and decryption
- reject (during produce) or skip (during consume) records that don't match specified data quality rules
- enforce producer configurations such as acks or compression
- override or enforce configurations during a *CreateTopic* request, such as a replication factor or naming convention

## Configure and use

To deploy an Interceptor, you need to prepare its configuration. Here's an example for an interceptor that will **block the creation of topics with more than six partitions**:

<Tabs>
<TabItem  value="CLI" label="CLI">

  ````json
  curl \
    --request PUT \
    --url 'http://localhost:8888/gateway/v2/interceptor' \
    --header 'Authorization: Basic YWRtaW46Y29uZHVrdG9y' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "kind" : "Interceptor",
    "apiVersion" : "gateway/v2",
    "metadata" : {
      "name" : "less-than-6-partitions"
    },
    "spec" : {
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
  }'
  ````

</TabItem>

<TabItem  value="API" label="API">


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

</TabItem>
</Tabs>

Interceptors also combine with each other to create very powerful interactions and solve many interesting use-cases in different ways.

One option is to [chain](#chain-interceptors) them together, so that each Interceptor performs its action sequentially and independently, then passes the result to the next Interceptor to action.

The order of execution is determined by the **priority** of each Interceptor. Lower numbers gets executed first.

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

More advanced behaviors can also be configured such as [Scoping](#interceptor-scope) and **Overriding**. They are presented in the detailed Interceptor Concepts page.

### Chain Interceptors

Interceptors can be chained, allowing you to create powerful interactions for various scenarios.

Each Interceptor can have a distinct purpose that's unrelated to other Interceptors in the chain. Interceptors are executed in order of priority, starting with the lowest number. Interceptor actions are performed **sequentially and independently**, passing the results from one to the next one in the chain.

:::info[Chaining caveat]
The order of execution is calculated **after scoping and overriding**. For example, an overridden Interceptor can have a different priority from its parent.
:::

### Interceptor scope

Interceptor scoping lets you **define affected Kafka clients** (ultimately resolved as service accounts).

There are four targeting scopes:

- Global
- VirtualCluster
- Group
- ServiceAccount  

[See resource reference details](/guide/reference/resources-reference/#interceptor-targeting).

Example:

````json
// This interceptor only applies to service account 'sa-clickstream'
curl \
  --request PUT \
  --url 'http://localhost:8888/gateway/v2/interceptor' \
  --header 'Authorization: Basic YWRtaW46Y29uZHVrdG9y' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "less-than-6-partitions",
    "scope": {
      "username": "sa-clickstream"
    }
  },
  "spec" : {
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
}'
````

### Overriding

Interceptor overriding lets you change the behavior of an Interceptor by **redeploying it with the same name but under a different scope**. This will effectively override the lower precedence Interceptors.

The order of precedence from highest (overrides all others) to lowest (easiest to override) is:

1. ServiceAccount
1. Group
1. VirtualCluster
1. Global

:::info[Overriding caveat]
In the two JSON examples above, both Interceptors have the same name (`enforce-partition-limit`) but two different scopes: the first one is global, the second one is targeting user `sa-clickstream`. These Interceptors aren't chained but the second one is overriding the first one. The `sa-clickstream` service account will be allowed to create topics with 1 to 20 partitions, while other service accounts will be limited to six. If these Interceptors had different names, they would be chained, so the first one would enforce the restriction to 6 partitions.
:::

### Ordering

The Interceptor order is determined by its `priority`: a lower value (e.g. 1) will be executed *before* a higher one (e.g. 100).

To ensure that Interceptors are executed in a particular order, specify a unique and correct `priority` for each Interceptor.

Gateway doesn't guarantee the order that Interceptors with the same priority are applied.

### Interceptor interaction example

Here's an example combining Interceptors **chaining**, **scoping** and **overriding**:

- `interceptor-C` is deployed only for Alice (scoping)
- `interceptor-D` is deployed globally (scoping) but also deployed specifically for Bob (overriding)
- `interceptor-A` and `interceptor-B` are deployed globally (scoping)
- the priorities (`01`, `40`, `45` and `50`) are then considered for the final execution order (chaining)

![Interceptor example](/guide/interceptor-example.png)

When you need Interceptors to apply conditionally, targeting by Service Account is the most straightforward way.

## Related resources

- [Gateway resource reference](/guide/reference/gateway-reference)
- [Give us feedback/request a feature](https://conduktor.io/roadmap)
