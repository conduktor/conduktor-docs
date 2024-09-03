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
- [Encryption Enhancements and Support Clarification](#encryption-enhancements-and-support-clarification)
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

### Encryption Enhancements and Support Clarification

#### Field-Level Encryption: Preserving Message Format to Enhance Usability
When applying field-level encryption prior to `3.3.0`, the encryption plugin would convert the message to JSON, and re-apply the schema format when the message was read back through the decryption plugin. 

In Gateway `3.3.0`, we now preserve the schema format for Avro messages - meaning the same schema is used in the backing topic, and the data can be read directly from Kafka or without the decryption plugin at all. 

[Read more](/gateway/interceptors/data-security/encryption/encryption-faq/#starting-from-330-avro-only) about this change to the default behaviour, and how to configure it.

Fields which cannot be encrypted in-place (effectively any non-string field) have their encrypted value placed in the headers, and the field itself is given a default masking value. The default values are clarified below:

| **Field Type** | **Default Value in 3.3.0** |
|--------------|--------------|
| Integer | Int MIN_VALUE |
| Long | Long MIN_VALUE |
| Float | Float, MIN_VALUE |
| Double | Float MIN_VALUE (yes, float again for doubles - because protobuf doesn't like Double MIN_VALUE) |
| byte[] | "********" as bytes (array of '42' s) |
| fixed[] | every byte filled with charater "*" |
| boolean | false |

Note that the same default values are now used across all relevant plugins when manipulating a non-string field - Data Masking, Partial Decrypt, and Encrypt on Fetch. 

#### Attempt to apply encryption to a message more than once will now fail
If any of the encryption headers are detected in a message when encryption is about to be applied, then the encryption operation will fail. This is because applying encryption twice (or more) is currently not reversible.

#### Deprecated support for Schema Based (tag) encryption with Protobuf 
Note this is no longer supported, and the Gateway will now throw an exception if the encryption plugin attempts to apply schema (tag) based processing to a Protobuf message.

Note that any data previously written in this mode can still be read back - as the decrypt does not use the schemas at all, rather it uses the message header to know what was encrypted.


## General fixes 🔨

**TODO: remove ticket reference when we're happy with the list**
- Large double values (where > Float Max) are now supported in field-level encryption for Avro and Protobuf
- Bytes and fixed fields now properly supported in field-levle encryption for Avro
- Avro unions of two or more values (rather than just a value and a null) are now supported in field-level encryption for Avro
- Schema (tag) based encryption now checks and fails if its config is invalid
- It is not possible to encrypt the headers which the encryption plugin uses to manage its decryption process (as this would render the data unrecoverable)
- CUS-294: Improved log messages for Interceptors that reject actions, such as TopicPolicyPlugin
- PXY-1523: Several improvements to the Large Message / Batch Handling Interceptors
- PXY-1582: No error message when kcache initialization fails
- Added a new Environment Variable `GATEWAY_MIN_BROKERID` that allows for determinist mapping of brokers and ports
- Improved network stability during Gateway scaling or Kafka topology changes
- CUS-371: https://linear.app/conduktor/issue/CUS-371/sainsburys-audit-logs-impact-clients-latency