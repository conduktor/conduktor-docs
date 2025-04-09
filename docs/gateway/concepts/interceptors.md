---
sidebar_position: 1
title: Interceptors
description: Interceptors
---

## Interceptors

Conduktor Gateway has an inventory of Interceptors available for different use cases. View the [Interceptor Catalog](/gateway/category/interceptor-catalog/) for more details.

A few examples:
- Full-body or field-level Encryption & Decryption
- Reject (during produce) or Skip (during consume) records that don't match some business data quality rules
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
````

Interceptors combine with each other in multiple different ways to create very powerful interactions and solve many interesting use-cases:  **Chaining**, **Scoping** & **Overriding**.

### Chaining
Interceptor chaining lets you deploy multiple interceptors (using different names) with different purposes. Each interceptor performs its action sequentially and independently, and passes its result to the next.
The order of execution is determined by the priority of each interceptor. Lower numbers gets executed first.
:::info
The order of execution is always calculated after scoping and overriding, such that overridden interceptor can have a different priority from its parent.
:::


### Scoping
Interceptor Scoping lets you define which Kafka Clients (ultimately resolved as Service Accounts) must be affected by those interceptors.
There are 4 targeting scopes available: Global, VirtualCluster, Group & ServiceAccount.  
Check the Reference Documentation for more details.

````json
// This interceptor only applies to service account 'sa-clickstream'
POST /admin/interceptors/v1/username/sa-clickstream/interceptor/enforce-partition-limit
{
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "numPartition": {
      "min": 1,
      "max": 20,
      "action": "BLOCK"
  }
}
````

### Overriding
Interceptor Overriding lets you change the behavior of an interceptor, by redeploying it with the **same name**, but under a different scope. This effectively overrides the effect of the interceptors with lower precedence.

The order of precedence from highest (overrides all others) to lowest (most easily overridden) is:
- ServiceAccount
- Group
- VirtualCluster
- Global

:::info
In the two JSON examples above, the interceptors have the same name (`enforce-partition-limit`) but 2 different scopes.
The first one is global, the second one is targeting user `sa-clickstream`.
They are not chained together, but instead the second one is overriding the first one.
`sa-clickstream` will be allowed to create topics with 1 to 20 partitions while other service accounts will be limited to 1 to 6.

If they had different names, they would be chained, and the first one (less permissive) would always restrict to 1 to 6 partitions.
:::



**Example**  
In the example below, we can see how **Chaining**, **Scoping** & **Overriding** interact with each other.
- `interceptor-C` is deployed only for Alice. (Scoping)
- `interceptor-D` is deployed globally (Scoping), but also deployed specifically for Bob (Overriding)
- `interceptor-A` and `interceptor-B` are deployed globally (Scoping)
- The priorities (`01`, `40`, `45` and `50`) are then considered for the final execution order (Chaining)
  ![Interceptor example](img/interceptor-example.png)

When you need Interceptors to apply conditionally, targeting by Service Account is the most straightforward way to go.

