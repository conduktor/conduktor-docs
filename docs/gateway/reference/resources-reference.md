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
    topics: "myprefix-.*"
    numPartition:
      min: 5
      max: 5
      action: "WARN"
````
**Interceptor checks:**
- `metadata.scope` is optional (default empty). `metadata.scope.[vCluster | group | username]` combine with each other to define the targeting
  - Check the dedicated [Interceptor Targeting](#interceptor-targeting) section
- `spec.pluginClass` is **mandatory**. Must be a valid Interceptor class name from our [available Interceptors](/gateway/category/interceptors-catalog/)
- `spec.priority` is **mandatory**
- `spec.config` is a valid config for the `pluginClass`

### Interceptor Targeting
You can make your Interceptor only active on certain scenarios. Use the following table to configure Targeting.

| Use case                              | `metadata.scope.vcluster` | `metadata.scope.group` | `metadata.scope.username` | 
|---------------------------------------|---------------------------|------------------------|---------------------------|
| Global Interceptor (targets everyone) | Empty                     | Empty                  | Empty                     |
| Username Targeting                    | Empty                     | Empty                  | Set                       |
| Group Targeting                       | Empty                     | Set                    | Empty                     |
| Virtual Cluster Targeting             | Set                       | Empty                  | Empty                     |
| Virtual Cluster + Username Targeting  | Set                       | Empty                  | Set                       |
| Virtual Cluster + Group Targeting     | Set                       | Set                    | Empty                     |

You can deploy multiple interceptors with the same name using different targeting scope. This will effectively override the configuration for the scope.

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
There are a few cases where you **must** declare GatewayServiceAccount objects:
- Create Local Service Accounts
- Rename Service Accounts for easier clarity when using Interceptors
- Attach Service Accounts to Virtual Clusters

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
  - `spec.externalNames` must be a list of external names. Each name must be unique across all declared GatewayServiceAccount.
  - **At the moment** we only support a list of one element. Support for multiple externalNames will be added in the future.

**GatewayServiceAccount side effects:**
- When `spec.type` is `EXTERNAL`:
  - During Client connection, the authenticated user will be checked against the list of `externalNames` to decide which GatewayServiceAccount it is.
- When `spec.type` is `LOCAL`:
  - Access to `/gateway/v2/tokens` endpoint to generate a password for this Service Account
  - Switching a GatewayServiceAccount `spec.type` from `LOCAL` to `EXTERNAL` does not invalidate previously emitted tokens. They will keep on working for their TTL)


## GatewayGroup
Gateway Group lets you add multiple users in the same GatewayGroup for easier targeting capabilities

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
  - Currently, the username needs to refer to an existing GatewayServiceAccount otherwise it'll fail. This is a known issue that we'll address in a further release
- `spec.members[].vCluster` is optional. Must refer to an existing Virtual Cluster. When not using Virtual Clusters, don't set this attribute.

**GatewayGroup side effects:**
- All members of the group will be affected by Interceptors deployed with this group's scope.

## ConcentrationRule

Concentration Rules lets you declare a pattern for which topic creation will not lead to a real physical topic but rather use our Topic Concentration feature.


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
````
**ConcentrationRule checks:**
- `metadata.vCluster` is optional. Must refer to an existing Virtual Cluster. When not using Virtual Clusters, don't set this attribute.
- `spec.physicalTopics.delete` is mandatory. Must be a valid topic name with a `cleanup.policy` set to `delete`
- `spec.physicalTopics.compact` and `deleteCompact` are optional. Must be a valid topic name with a `cleanup.policy` set to `compact` and `delete,compact` respectively.
- `spec.autoManaged` is optional, default `false`. When set to `true`, the underlying physical topics will be automatically created and extended to fit

**ConcentrationRule side effects:**
Topics created with the `spec.pattern` name will not be created as real Kafka topics but as Concentrated topics instead.  
Depending on the topic `cleanup.policy`, the topic's data will be stored in a different physical topic.  
You can re

## VirtualCluster

```yaml
---
apiVersion: gateway/v2
kind: VirtualCluster
metadata:
 name: "mon-app-A"
spec:
 prefix: "app-A-"
 aclEnabled: "true" # defaults to false
 superUsers:
 - username1
 - username2
```

## AliasTopic

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
