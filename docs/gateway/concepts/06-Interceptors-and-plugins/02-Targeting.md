---
sidebar_position: 2
title: Plugins Targeting
description: Plugin targeting
---

# Plugin Targeting

All plugins loaded on Gateway should not always be applied, on all requests. 

A plugin can be configured to target only specific Kafka API keys and Plugin Targeting allows you to define the Gateway scope to apply a plugin.

This document outlines the various scopes and hierarchy levels at which plugins can be targeted within the Gateway system. 
Plugins can be targeted globally, to a specific virtual cluster, or to specific users or groups within a virtual cluster.

## Scope

A scope is the functional unit that allow an administrator to enable a plugin to run with a specific configuration on a scope.
A scope define contains the following:
 - `vcluster` (Optional)
 - `group` (Optional)
 - `username` (Optional)

_Global Scope_ : A global scope is a scope where all possible values aren't defined.

Scope has been defined as a hierarchical concept. A global scope can be specialized to a vcluster scope, which can be specialized to a group or username scope.  
Group is as an optional value for Users, a special case and is treated as a Username scope.

We can define the scope hierarchy as the following:
```mermaid
flowchart TD
    Global --> vcluster[Virtual cluster]
    vcluster --> Group
    vcluster ---> Username
```

### Scope configuration

A similar plugin can be associated with a different scope. Each scope will define for a plugin configured its configuration and execution priority.  

As an example you can define that you want to configure a plugin `topicProtection` to apply a `CreateTopicSafeguardPlugin`, and this `topicProtection` plugin should be executed with : 
- Priotity `10` and configuration `X` on global scope
- Priority `12` and configuration `Y` for the vcluster `conduktor`


### Interceptor resolution

When a message is processed by Gateway, we have to detect and apply all `Interceptors` for that request based on the message context.

For each message, interceptor resolution is based on a context containing the following elements :
 - Gateway [User](../03-GatewayUser.md) 
   - VCluster
   - Username
   - Groups (Optional)
 - Kafka Message type

Based on this context for all configured plugin we search if it could apply by search if there is at least one scope matching the request context.
If a plugin have multiple matching scope the most precise one (Username then Group then Virtual cluster then Global) will be used.
Then for the configured plugin we load the corresponding Interceptors with the priority and the configuration of this scope.

```mermaid
flowchart LR
    username{Username scope matching ?} -->|No| group{Groups scope matching ?}
    group -->|No| vcluster{Virtual cluster scope matching ?}
    vcluster -->|No| global{Global scope matching ?}
    username ----->|Yes| load[Load interceptors]
    group ---->|Yes| load
    vcluster --->|Yes| load
    global -->|Yes| load
```

__Special case__: Since groups are a multiple optional value. If no username scope match the context but multiple group scopes does then we load interceptors for all matching groups.