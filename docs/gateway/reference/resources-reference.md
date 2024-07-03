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
  # vcluster: aaa
  # group: bbb
  # username: ccc
  name: enforce-partition-limit
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
- `metadata.vcluster` / `metadata.group` / `metadata.user` are optional (default empty). They combine with each other to define the targeting
  - Check the dedicated [Interceptor Targeting](#interceptor-targeting) section
- `spec.pluginClass` is **mandatory**. Must be a valid Interceptor class name from our [available Interceptors](/gateway/category/interceptors-catalog/)
- `spec.priority` is **mandatory**
- `spec.config` is a valid config for the `pluginClass`

### Interceptor Targeting
You can make your Interceptor only active on certain scenarios. Use the following table to configure Targeting.  
You can deploy multiple interceptors with the same name using different targeting scope. This will effectively override the scope.

:::info
The order of precedence from highest (overrides all others) to lowest (most easily overridden) is:

- ServiceAccount
- Group
- VirtualCluster
- Global
:::

| Use case                              | `metadata.vcluster` | `metadata.group` | `metadata.username` | 
|---------------------------------------|---------------------|------------------|---------------------|
| Global Interceptor (targets everyone) | Empty               | Empty            | Empty               |
| Username Targeting                    | Empty               | Empty            | Set                 |
| Group Targeting                       | Empty               | Set              | Empty               |
| Virtual Cluster Targeting             | Set                 | Empty            | Empty               |
| Virtual Cluster + Username Targeting  | Set                 | Empty            | Set                 |
| Virtual Cluster + Group Targeting     | Set                 | Set              | Empty               |

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
  username: admin
  name: enforce-partition-limit
spec:
  
---
# This interceptor targets only `read-only` virtual cluster
kind: Interceptor
metadata:
  vcluster: read-only
  name: enforce-partition-limit
spec:
  

````

## GatewayServiceAccount

````yaml
---
# External User on passthrough
kind: GatewayServiceAccount
metadata:
  name: application1
spec:
  type: EXTERNAL
  externalName: 00u9vme99nxudvxZA0h7
---
# Local User on vc-B
kind: GatewayServiceAccount
metadata:
  vcluster: vc-B
  name: admin
spec:
  type: LOCAL
````

## GatewayGroup

````yaml
---
# Users added to the group manually
kind: GatewayGroup
metadata:
  name: app-a
spec:
  members:
    - username: admin # admin from vcluster passthrough
    - vcluster: vc-B
      username: admin
    - vcluster: passthrough
      username: "0000-AAAA-BBBB-CCCC"
````

## ConcentrationRule

````yaml
---
kind: ConcentrationRule
metadata:
  # vcluster: passthrough <<< SUGGESTED
  name: toutdanstiti
spec:
  pattern: titi-
  backingTopics:
    delete: titi-delete
    compact: titi-compact
    c+d: titi-cd
autoManageBackingTopics: false
````

## VirtualCluster
