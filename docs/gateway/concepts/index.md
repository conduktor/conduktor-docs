---
sidebar_position: 3
title: Concepts
description: Introduction to the different concepts of Conduktor Gateway
---

:::info
The objective of this document is to introduce each concept individually and gradually while keeping the complexity and details to a minimum. 
If you already understand Conduktor Gateway's concepts and you are looking for a detailed reference, check this page instead: Gateway Resource Reference(todo)
:::

## Conduktor Gateway

The Conduktor Gateway itself is a proxy that sits between your Kafka and your clients. It extends the capabilities of Kafka while maintaining a strict compatibility with the Kafka protocol, thus requiring no change on the Kafka clients or the Kafka brokers

There are 2 ways Kafka can be extended by Conduktor Gateway to provide new functionalities.
- **Core functionalities** like authentication, virtual clusters isolation or failover are installation or deployment options that impact the whole Conduktor Gateway and are generally (but not always) configured at installation time.
- **Interceptors** are pluggable components that augment Kafka by intercepting requests of the Kafka protocol and applying operations to it.

- TODO this to reflect explanation better ?

## Interceptors
Interceptors are pluggable components that augment Kafka by intercepting any request of the Kafka protocol and applying operations to it.
- For example, you can apply encryption on the messages during Produce and decryption during Fetch (consume) without any modification of the Kafka Client.
- Another example is to deploy an interceptor to enforce or limit configurations during a CreateTopic request, such as replication factor or naming convention.

Conduktor Gateway has a massive list of Interceptors available. Check our Interceptor Catalog for more details.

To deploy an Interceptor, you need to prepare its configuration. The configuration of an interceptor is a little similar to configuring a Kafka Connect Connector.

Here's an example for an interceptor whose responsibility is to prevent creation of topics with more than 6 partitions:
TODO (tabbed view for API vs CLI)
- Using the API `POST /interceptors`
````json
{
  "name": "enforce-partition-limit",
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
````
- Using the CLI conduktor gateway apply -f file.yml
````yaml
---
kind: Interceptor
metadata:
  name: enforce-partition-limit
spec:
  pluginClass: "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin",
  priority: 100,
  config:
    topics: ".*"
    numPartition:
      min: 1,
      max: 6,
      action: "BLOCK"
````

Interceptors combine with each other in 3 different ways to create very powerful interactions and solve many interesting use-cases:  **Chaining**, **Targeting** & **Overriding**.

**Interceptor Chaining** lets you deploy multiple interceptors (using different names) with different purpose, where each interceptor performs its action sequentially and independently, and pass its result to the next.

**Interceptor Targeting** lets you define which Kafka Clients (ultimately resolved as Service Accounts) must be affected by those interceptors. There are multiple ways to configure the scope of an interceptors. Check the Reference Documentation for more details.
````yaml
# This interceptors only triggers for service account 'sa-clickstream'
---
kind: Interceptor
metadata:
  user: sa-clickstream
  name: enforce-partition-limit
spec:
  pluginClass: "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin",
  priority: 100,
  config:
    topics: ".*"
    numPartition:
      min: 1,
      max: 20,
      action: "BLOCK"
````

**Interceptor Overriding** lets you change the behavior of an interceptor, by redeploying it with the same name, but under a different scope. This effectively overrides the effect of the interceptor above it by the new one for this particular scope.

:::info
In the two examples above, the interceptors have the same name but with 2 different scope.
The first one is global, second one is targeting user `sa-clickstream`.
They are not chained together, but instead the second one is overriding the first one.
`sa-clickstream` will be allowed to create topics with 1 to 20 partitions while other service accounts will be limited to 1 to 6.

If they had different names, they would be chained, and the first one (less permissive) would always restrict to 1 to 6 partitions.
:::


## Gateway Service Accounts

Gateway Service Accounts 

There are 3 types of Service Accounts on the Gateway: DELEGATED, EXTERNAL, and LOCAL.
Those types of authentication are no the `security.protocol` and `sasl.mechanism` that are used to
- **DELEGATED** Service Account are defined in the backing cluster. Gateway as source of authentication.
- **EXTERNAL** Authentication relies on an external source of users such as OIDC, LDAP, or mTLS
The result of the Authentication gives Gateway a 