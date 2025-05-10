---
title: Interceptors
description: Learn Conduktor terminology
---


export const Highlight = ({children, color, text}) => (

<span style={{ backgroundColor: color, borderRadius: '4px', color: text, padding: '0.2rem 0.5rem', fontWeight: '500', }}>
    {children}
</span>
);

export const CLI = () => (
<Highlight color="#F8F1EE" text="#7D5E54">CLI</Highlight>
);

export const API = () => (
<Highlight color="#E7F9F5" text="#067A6F">API</Highlight>
);

export const TF = () => (
<Highlight color="#FCEFFC" text="#9C2BAD">Terraform</Highlight>
);

export const GUI = () => (
<Highlight color="#F6F4FF" text="#422D84">Console UI</Highlight>
);


export const AppToken = () => (
<Highlight color="#F0F4FF" text="#3451B2">Application API Key</Highlight>
);

export const AdminToken = () => (
<Highlight color="#FEEFF6" text="#CB1D63">Admin API Key</Highlight>
);

export const MissingLabelSupport = () => (
<Highlight color="#F5F5F5" text="#666666">Label Support Incoming</Highlight>
);

export const FullLabelSupport = () => (
<Highlight color="#E6F4EA" text="#1B7F4B">Full Label Support</Highlight>
);

export const PartialLabelSupport = () => (
<Highlight color="#FFF8E1" text="#B26A00">Partial Label Support (No UI yet)</Highlight>
);

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
(img/interceptor-example.png)

When you need Interceptors to apply conditionally, targeting by Service Account is the most straightforward way.


## Interceptor

**API Keys:** <AdminToken />  
**Managed with:** <API /> <CLI /> <GUI />

Deploys an Interceptor on the Gateway
````yaml
---
apiVersion: gateway/v2
kind: Interceptor
metadata:
  name: enforce-partition-limit
  # scope:
  #   vCluster: aaa
  #   group: bbb
  #   username: ccc
spec:
  pluginClass: "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin"
  priority: 100
  config:
    topic: "myprefix-.*"
    numPartition:
      min: 5
      max: 5
      action: "INFO"
````
**Interceptor checks:**
- `metadata.scope` is optional (default empty). 
- `metadata.scope.[vCluster | group | username]` combine with each other to define the targeting
  - Check the dedicated [Interceptor Targeting](#interceptor-targeting) section
- `spec.pluginClass` is **mandatory**. Must be a valid Interceptor class name from our [available Interceptors](/gateway/category/interceptor-catalog/)
- `spec.priority` is **mandatory**
- `spec.config` is a valid config for the `pluginClass`

### Interceptor Targeting
You can activate your Interceptor only in specific scenarios. Use the table below to configure Targeting settings.

| Use case                                            | `metadata.scope.vcluster` | `metadata.scope.group` | `metadata.scope.username` |
|-----------------------------------------------------|---------------------------|------------------------|---------------------------|
| Global Interceptor (Including Virtual Clusters)     | Set to `null`             | Set to `null`          | Set to `null`             |
| Global Interceptor (**Excluding** Virtual Clusters) | Empty                     | Empty                  | Empty                     |
| Username Targeting                                  | Empty                     | Empty                  | Set                       |
| Group Targeting                                     | Empty                     | Set                    | Empty                     |
| Virtual Cluster Targeting                           | Set                       | Empty                  | Empty                     |
| Virtual Cluster + Username Targeting                | Set                       | Empty                  | Set                       |
| Virtual Cluster + Group Targeting                   | Set                       | Set                    | Empty                     |

You can deploy multiple interceptors with the same name using a different targeting scope. This will effectively [override](../concepts/interceptors.md#overriding) the configuration for the scope.

:::info
The order of precedence from highest (overrides all others) to lowest (most easily overridden) is:

- ServiceAccount
- Group
- VirtualCluster
- Global
:::

**Examples**
````yaml
---
# This interceptor targets everyone (Including Virtual Clusters)
apiVersion: gateway/v2
kind: Interceptor
metadata:
  name: enforce-partition-limit
  scope:
    vCluster: null
    group: null
    username: null
spec:

---
# This interceptor targets everyone (Excluding Virtual Clusters)
apiVersion: gateway/v2
kind: Interceptor
metadata:
  name: enforce-partition-limit
spec:

---
# This interceptor targets only `admin` service account
apiVersion: gateway/v2
kind: Interceptor
metadata:
  name: enforce-partition-limit
  scope:
    username: admin
spec:
  
---
# This interceptor targets only `read-only` virtual cluster
apiVersion: gateway/v2
kind: Interceptor
metadata:
  name: enforce-partition-limit
  scope:
    vCluster: read-only
spec:
  

````

## GatewayServiceAccount
GatewayServiceAccount is generally optional when using Oauth, mTLS or Delegated Backing Kafka authentication.  

GatewayServiceAccount resource is enabled or not depending on your Gateway configuration.   
This is to prevent you to declare a resource that is incompatible with your current configuration:

| GATEWAY_SECURITY         | LOCAL GatewayServiceAccount | EXTERNAL GatewayServiceAccount        |
|--------------------------|--|--------------------------|
| PLAINTEXT                | 🚫 | 🚫                       |
| SSL                      | 🚫 | only if mTls             |
| SASL_PLAINTEXT           | ✅ | only if OAuth configured |
| SASL_SSL                 | ✅ | only if OAuth configured |
| DELEGATED_SASL_PLAINTEXT | 🚫 | ✅                        |
| DELEGATED_SASL_SSL       | 🚫 | ✅                        |

There are a few cases where you **must** declare GatewayServiceAccount objects:
- Creating Local Service Accounts
- Renaming Service Accounts for easier clarity when using Interceptors
- Attaching Service Accounts to Virtual Clusters

````yaml
---
# External User renamed
apiVersion: gateway/v2
kind: GatewayServiceAccount
metadata:
  name: application1
spec:
  type: EXTERNAL
  externalNames: 
  - 00u9vme99nxudvxZA0h7
---
# Local User on Virtual Cluster vc-B
apiVersion: gateway/v2
kind: GatewayServiceAccount
metadata:
  vCluster: vc-B
  name: admin
spec:
  type: LOCAL
````
**GatewayServiceAccount checks:**
- When `spec.type` is `EXTERNAL`:
  - `spec.externalNames` must be a non-empty list of external names. Each name must be unique across all declared GatewayServiceAccount.
  - **At the moment** we only support a list of one element. Support for multiple externalNames will be added in the future.

**GatewayServiceAccount side effects:**
- When `spec.type` is `EXTERNAL`:
  - During Client connection, the authenticated user will be checked against the list of `externalNames` to decide which GatewayServiceAccount it is.
- When `spec.type` is `LOCAL`:
  - Access to `/gateway/v2/tokens` endpoint to generate a password for this Service Account
  - Switching a GatewayServiceAccount `spec.type` from `LOCAL` to `EXTERNAL` does not invalidate previously emitted tokens. They will keep on working for their TTL)


## GatewayGroup
Gateway Group lets you add multiple users in the same GatewayGroup for easier Interceptor targeting capabilities.

````yaml
---
# Users added to the group manually
apiVersion: gateway/v2
kind: GatewayGroup
metadata:
  name: group-a
spec:
  members:
    - name: admin
    - vCluster: vc-B
      name: "0000-AAAA-BBBB-CCCC"
````
**GatewayGroup checks:**
- `spec.members[].name` is mandatory.
  - Currently, the username needs to refer to an existing GatewayServiceAccount otherwise it will fail. This is a known issue that we'll address in a further release.
- `spec.members[].vCluster` is optional. Must refer to an existing Virtual Cluster. When not using Virtual Clusters, don't set this attribute.

**GatewayGroup side effects:**
- All members of the group will be affected by Interceptors deployed with this group's scope.

## ConcentrationRule

Concentration Rules allow you to define patterns where topic creation won't generate a physical topic, but will instead use our Topic Concentration feature.

````yaml
---
apiVersion: gateway/v2
kind: ConcentrationRule
metadata:
  # vCluster: vc-B
  name: toutdanstiti
spec:
  pattern: titi-.*
  physicalTopics:
    delete: titi-delete
    compact: titi-compact
    deleteCompact: titi-cd
  autoManaged: false
  offsetCorrectness: false
````
**ConcentrationRule checks:**
- `metadata.vCluster` is optional. Must refer to an existing Virtual Cluster. When not using Virtual Clusters, don't set this attribute.
- `spec.physicalTopics.delete` is mandatory. Must be a valid topic name with a `cleanup.policy` set to `delete`
- `spec.physicalTopics.compact` is optional. Must be a valid topic name with a `cleanup.policy` set to `compact`
- `spec.physicalTopics.deleteCompact` is optional. Must be a valid topic name with a `cleanup.policy` set to `delete,compact`
- `spec.autoManaged` is optional, default `false`
- `spec.offsetCorrectness` is optional, default `false`

**ConcentrationRule side effects:**
- Once the Concentration Rule is deployed, topics created with a name matching the `spec.pattern` will not be created as real Kafka topics but as Concentrated Topics instead.  
- Depending on the topic's `cleanup.policy`, the topic's data will be stored in one of the configured physical topics.
- If a topic creation request is made with a `cleanup.policy` that isn't configured in the ConcentrationRule, topic creation will fail.
- It is not possible to update `cleanup.policy` of a concentrated topic.
- If `spec.autoManaged` is set to `true`, the underlying physical topics and configurations will be automatically created and/or extended to honour the topics configurations.
- If `spec.offsetCorrectness` is set to `true`, Gateway will maintain a list of offsets for each of the Concentrated Topic records. 
  - This allows for a proper calculation of Message Count and Consumer Group Lag.
  - There are some limitation. Read more about [Offset Correctness here](/gateway/concepts/logical-topics/concentrated-topics/#known-issues-and-limitations-with-offset-correctness)
- If `spec.offsetCorrectness` is set to `false`, Gateway will report the offsets of the backing topic records.

:::caution
If a ConcentrationRule spec changes, it will not affect previously created Concentrated Topics.  
It will only affect the Topics created after the change.
:::