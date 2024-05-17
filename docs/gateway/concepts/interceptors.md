---
sidebar_position: 1
title: Interceptors
description: Interceptors
---


# Interceptors

Interceptors are used to add technical and business logic, such as message encryption, inside your Gateway deployment. 

Interceptors can be deployed and managed through the [REST API](https://developers.conduktor.io/), and targeted at different granularities.

# Interceptor Targeting

This document outlines the various scopes and hierarchy levels at which interceptors can be targeted within the Gateway system. 

Interceptors can be targeted globally, to a specific virtual cluster, or to specific username or group within a virtual cluster.

## Scope

A scope is the functional unit that allow an administrator to enable a interceptor to run with a specific configuration on a scope.
A scope define contains the following:
 - `vcluster` (Optional)
 - `group` (Optional)
 - `username` (Optional)

_Global Scope_ : A global scope is a scope where all possible values aren't defined.

Scope has been defined as a hierarchical concept. A global scope can be specialized to a vcluster scope, which can be specialized to a group or username scope.  
Group is as an optional value for a User, a special case and is treated as a Username scope.

We can define the scope hierarchy as the following:
```mermaid
flowchart TD
    Global --> vcluster[Virtual cluster]
    vcluster --> Group
    vcluster ---> Username
```

### Scope configuration

A similar interceptor can be associated with a different scope. Each scope will define for an interceptor configured its configuration and execution priority.  

As an example you can define that you want to configure an interceptor `topicProtection` to apply a `CreateTopicSafeguardPlugin`, and this `topicProtection` interceptor should be executed with : 
- Priotity `10` and configuration `X` on global scope
- Priority `12` and configuration `Y` for the vcluster `conduktor`


### Interceptor resolution

When a message is processed by Gateway, we have to detect and apply all `Interceptors` for that request based on the message context.

For each message, interceptor resolution is based on a context containing the following elements :
 - Gateway [User](service-accounts) 
   - VCluster
   - Username
   - Groups (Optional)
 - Kafka Message type

Based on this context for all configured interceptor we search if it could apply by search if there is at least one scope matching the request context.
If an interceptor has multiple matching scopes the most precise one (Username, then Group, then Virtual cluster, then Global) will be used.
Then for the configured interceptor we load the one with the priority and the configuration of this scope.

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