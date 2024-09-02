---
date: 2024-09-05
title: Gateway 3.3.0
description: docker pull conduktor/conduktor-gateway:3.3.0
solutions: gateway
tags: features,fix
---

## Upcoming Breaking change 💣
:::info
This breaking change only impacts Local Gateway service accounts generated through our token endpoints:
- `POST /admin/username/{username}`
- `POST /admin/vclusters/v1/vcluster/{vcluster}/username/{username}`

If you are not using Local Gateway services accounts (OIDC, mTLS, Delegated Kafka), you are **not** impacted.
:::
Today, the token as the password for local Gateway service accounts contains all the necessary information. As a result, the SASL username is not used during the authentication phase.  
In an **upcoming** release, we will strictly enforce that the username and the token matches. This will help reduce inconsistencies and avoid unexpected behaviors.

**This breaking change is due for release 3.5.0.**   
For this release 3.3.0, and next product release 3.4.0, we'll only raise the following warning in the logs:  
````
2024-08-27T18:15:29 [WARN] - Inconsistency detected for plain authentication. Username applicationA is not consistent with validated token created for application-A. SASL configuration should be changed accordingly.
````

## Features ✨

- [New V2 APIs and CLI support](#new-v2-apis-and-cli-support)
- [Support for HTTPS APIs](#support-for-https-apis)
- [Virtual Cluster ACLs and superUsers](#enhanced-ui--alerts-for-kafka-connect)
- [Broker ID and port sticking](#quality-of-life-improvements)

### New V2 APIs and CLI support

We are proud to introduce a whole new API for the Gateway, which is designed to work seamlessly with our CLI.  
You can now deploy Gateway resources using infra-as-code with easy to use and clearly defined concepts:
- Interceptor
- GatewayServiceAccount
- GatewayGroup
- ConcentrationRule
- AliasTopic
- VirtualCluster

[Check the associated documentation for more information regarding each concept](/gateway/reference/resources-reference/)

On top of that, the API is now strictly enforcing consistency between resources.  
For instance: 
- You can't deploy an Interceptor that target a Virtual Cluster that doesn't exist
- You can't delete a Group which is used by and interceptor

````yaml
---
apiVersion: gateway/v2
kind: GatewayGroup
metadata:
  name: groupB
spec:
  members:
    - name: user1
    - name: user2
---
apiVersion: gateway/v2
kind: Interceptor
metadata:
  name: enforce-partition-limit
  scope:
    group: groupB
spec:
  pluginClass: io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin
  priority: 100
  config:
    numPartition:
      action: BLOCK
      max: 9
      min: 9
    topic: .*

$ conduktor apply -f gateway.yml
Interceptor/enforce-partition-limit: Created

$ conduktor delete GatewayGroup groupB
The group groupB is still used by the following interceptor(s): enforce-partition-limit
````

API V1 are still available. We recommend new users or simple Gateway configurations to start using V2 API as soon as possible.  
We will come up with a deprecation plan in the next few weeks.   
You will be informed in advance which Gateway version will be the last to support V1 APIs.


### Support for HTTPS APIs
It is now possible to configure HTTPS and mTLS authentication on the Gateway HTTP APIs.
Check the [HTTP section of the Environment Variables page](/gateway/configuration/env-variables/#http) for more details

### Virtual Cluster ACLs and superUsers

### Broker ID and port sticking
We have introduced a new Environment Variable `GATEWAY_MIN_BROKERID` 

## General fixes 🔨

**TODO: remove ticket reference when we're happy with the list**
- CUS-294: Improved log messages for Interceptors that reject actions, such as TopicPolicyPlugin
- PXY-1523: Several improvements to the Large Message / Batch Handling Interceptors
- PXY-1582: No error message when kcache initialization fails
