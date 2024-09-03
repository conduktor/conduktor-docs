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
- [Encryption Enhancements](#encryption-enhancements)
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

Check the [CLI reference](/gateway/reference/cli-reference) to get started, and the [resources reference for more information on each concept](/gateway/reference/resources-reference/).

API V2 added value
- the API is now strictly enforcing consistency between resources.
- allows for --dry-run to check before changes

For instance: 
- You can't deploy an Interceptor targeting a Virtual Cluster that doesn't exist.
- You can't delete a Group that is used by an Interceptor.

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

**Note**: API V1 is still available, but we recommend that new users and those with simple Gateway configurations begin using the V2 API as soon as possible. 
We will announce a deprecation plan in the coming weeks and notify you in advance of which Gateway version will be the last to support the V1 APIs.

### Support for HTTPS APIs
It is now possible to configure HTTPS and mTLS authentication on the Gateway HTTP APIs. Check the [HTTP section of the Environment Variables page](/gateway/configuration/env-variables/#http) for more details.

### Virtual Cluster ACLs and superUsers
To coincide with the clearly defined concepts established in API V2, ACLs within Virtual Clusters can now be driven explicitly by configuration.  

:::warning
Note that if you are migrating from an older version of Gateway, the migration will automatically generate existing Virtual Clusters as configuration.

- The automation will derive the boolean value `aclEnabled` from the previously used `GATEWAY_ACL_STORE_ENABLED` variable.
- The migration will not populate the `superUsers` list automatically, so this must be addressed as part of your migration.
:::

Example configuration:

```yaml
---
apiVersion: gateway/v2
kind: VirtualCluster
metadata:
  name: "mon-app-A"
spec:
  aclEnabled: "true" # defaults to false
  superUsers:
  - username1
  - username2
```

### Encryption Enhancements
 - TO DO...
 - schemaDataMode
 - Block attempts to double encrypt (encrypt on encrypt)
 - Default values
 - Block attempts to encrypt headers containing required metadata for encryption
 - Several bug fixes to support more field types
 - Standardised default values across masking, partial decrypt, encrypt on fetch
 - Deprecated support for schema (tag) based encryption with Protobuf, will fail. Decryption of historical still supported
 - ...


## General fixes 🔨

**TODO: remove ticket reference when we're happy with the list**
- CUS-294: Improved log messages for Interceptors that reject actions, such as TopicPolicyPlugin
- PXY-1523: Several improvements to the Large Message / Batch Handling Interceptors
- PXY-1582: No error message when kcache initialization fails
- Added a new Environment Variable `GATEWAY_MIN_BROKERID` that allows for determinist mapping of brokers and ports
- Improved network stability during Gateway scaling or Kafka topology changes
- CUS-371: https://linear.app/conduktor/issue/CUS-371/sainsburys-audit-logs-impact-clients-latency