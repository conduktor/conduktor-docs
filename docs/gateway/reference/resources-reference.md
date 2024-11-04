---
sidebar_position: 1
title: Resources Reference
description: Resources Reference
---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Admonition from '@theme/Admonition';

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
# This interceptor targets everyone
kind: Interceptor
metadata:
  name: enforce-partition-limit
spec:
  
---
# This interceptor targets only `admin` service account
kind: Interceptor
metadata:
  name: enforce-partition-limit
  scope:
    username: admin
spec:
  
---
# This interceptor targets only `read-only` virtual cluster
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
kind: GatewayServiceAccount
metadata:
  name: application1
spec:
  type: EXTERNAL
  externalNames: 
  - 00u9vme99nxudvxZA0h7
---
# Local User on Virtual Cluster vc-B
kind: GatewayServiceAccount
metadata:
  vcluster: vc-B
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
kind: GatewayGroup
metadata:
  name: group-a
spec:
  members:
    - username: admin
    - vCluster: vc-B
      username: "0000-AAAA-BBBB-CCCC"
````
**GatewayGroup checks:**
- `spec.members[].username` is mandatory.
  - Currently, the username needs to refer to an existing GatewayServiceAccount otherwise it will fail. This is a known issue that we'll address in a further release.
- `spec.members[].vCluster` is optional. Must refer to an existing Virtual Cluster. When not using Virtual Clusters, don't set this attribute.

**GatewayGroup side effects:**
- All members of the group will be affected by Interceptors deployed with this group's scope.

## ConcentrationRule

Concentration Rules allow you to define patterns where topic creation won't generate a physical topic, but will instead use our Topic Concentration feature.

````yaml
---
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
  - This allows for a proper calculation of Message Count and Consumer Group Lag at the expense of some performance overhead.
  - Read more about offset Correctness here
- If `spec.offsetCorrectness` is set to `false`, Gateway will report the offsets of the backing topic records.

:::caution
If a ConcentrationRule spec changes, it will not affect previously created Concentrated Topics.  
It will only affect the Topics created after the change.
:::

## VirtualCluster
A Virtual Cluster allows you to isolate one or more service accounts within a logical cluster. Any topic or consumer group created within a Virtual Cluster will be accessible only to that specific Virtual Cluster.

A Virtual Cluster acts like a Kafka within a Kafka.

```yaml
---
apiVersion: gateway/v2
kind: VirtualCluster
metadata:
 name: "mon-app-A"
spec:
 aclEnabled: true # defaults to false
 superUsers:
 - username1
 - username2
```

**VirtualCluster checks:**
- `metadata.name` must be a valid topic prefix.
- `spec.aclEnabled` is optional, default `false`. 

**VirtualCluster side effects:**
- All topics and consumer groups will be created on the physical Kafka with a prefix `metadata.name`. But, they will appear on the VirtualCluster without the prefix.
- Users can be associated to the VirtualCluster through the GatewayServiceAccount resource.
- When `spec.aclEnabled` is set to `true`, you can configure the superUsers using the `spec.superUsers` list. You will have to manage the ACLs of other service accounts as you would with any other Kafka.


## AliasTopic

An Alias Topic allows a real Kafka topic to appear as a logical topic within the Gateway. This is useful for aliasing topics or making a topic accessible within a Virtual Cluster.

```yaml
---
apiVersion: gateway/v2
kind: AliasTopic
metadata:
  name: name1
  vCluster: vCluster1
spec:
  physicalName: physicalName1
```
