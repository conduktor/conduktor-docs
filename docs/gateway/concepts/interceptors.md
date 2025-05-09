---
sidebar_position: 1
title: Interceptors
description: Elevate your Kafka usage with Conduktor Gateway Interceptors
---

Conduktor Gateway offers a number of powerful Interceptors that enhance your Kafka usage.

For example, you can use Interceptors to:

- perform full-message encryption, field-level encryption, and decryption
- reject (during produce) or skip (during consume) records that don't match specified data quality rules
- enforce producer configurations such as acks or compression
- override or enforce configurations during a CreateTopic request, such as a replication factor or naming convention

 [View the Interceptor catalog](/gateway/category/interceptor-catalog/).

## Using Interceptors

Before deploying an Interceptor, you have to configure it, similar to using [Kafka Connect connectors](/platform/navigation/console/kafka-connect/#add-a-connector).

Here's an example of an Interceptor that will block the creation of topics with more than six partitions:

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

### Chaining

Interceptors can be chained, allowing you to create powerful interactions for various scenarios.

Each Interceptor can have a distinct purpose that's unrelated to other Interceptors in the chain. Interceptors are executed in order of priority, starting with the lowest number. Interceptor actions are performed **sequentially and independently**, passing the results from one to the next one in the chain.

:::info[Chaining caveat]
The order of execution is calculated **after scoping and overriding**. For example, an overridden Interceptor can have a different priority from its parent.
:::

### Scoping

Interceptor scoping lets you **define affected Kafka clients** (ultimately resolved as Service Accounts).

There are four targeting scopes:

- Global
- VirtualCluster
- Group
- ServiceAccount  

[See resource reference details](/gateway/reference/resources-reference/#interceptor-targeting).

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

### Interceptor interaction example

Here's an example combining Interceptors **chaining**, **scoping** and **overriding**:

- `interceptor-C` is deployed only for Alice (scoping)
- `interceptor-D` is deployed globally (scoping) but also deployed specifically for Bob (overriding)
- `interceptor-A` and `interceptor-B` are deployed globally (scoping)
- the priorities (`01`, `40`, `45` and `50`) are then considered for the final execution order (chaining)
  ![Interceptor example](img/interceptor-example.png)

When you need Interceptors to apply conditionally, targeting by Service Account is the most straightforward way.
