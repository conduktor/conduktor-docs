---
sidebar_position: 5
title: API V2 Migration guide
description: Need to know changes between V1 and V2 APIs
---

API V2's objectives is to bring more clarity into the concepts which are managed by the Gateway and make them consistent to use.  

API V1 can still be used at any point in time but they won't enforce the consistency checks that are coming with new the V2.  



## Virtual Clusters

In V1, Virtual Clusters was not a clearly defined concept. It existed as a weak reference on UserMappings & Interceptors targeting

In V2, Virtual Cluster must be declared first before it can be referenced in other API calls:
- Interceptors deploying will fail if targeting a Virtual Cluster that doesn't exist
- GatewayServiceAccount will fail if attached to a Virtual Cluster that doesn't exist
- ConcentrationRule ...

**Migration need to know**


## Concentration Rules

New Concentration Rules are more explicit in their behavior. 
In V1, ConcentrationRule declared with only one topic name ???
In comparison with V1, ConcentrationRule declared with only the delete topic will prevent 

## GatewayServiceAccount


If you have mapped Local Users to Groups through UserMapping in 3.2 and below, you won't be able to generate a token
Local users didn't exist in 3.2 and below. They only existed through their generated token.
As a result, all user mappings are migrated as EXTERNAL GatewayServiceAccount