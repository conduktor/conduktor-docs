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
- [Better UX for ACLs and superUsers](#better-ux-for-acls-and-superusers)
- [Encryption Enhancements and Support Clarification](#encryption-enhancements-and-support-clarification)

### New V2 APIs and CLI support

We’re excited to introduce our new Gateway API, designed for seamless integration with our CLI. This update allows you to deploy Gateway resources using infrastructure-as-code with straightforward, clearly defined concepts:
- Interceptor
- GatewayServiceAccount
- GatewayGroup
- ConcentrationRule
- AliasTopic
- VirtualCluster

Check the [CLI reference](/gateway/reference/cli-reference) to get started, and the [resources reference for more information on each concept](/gateway/reference/resources-reference/).

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
GatewayGroup/groupB: Created
Interceptor/enforce-partition-limit: Created

$ conduktor delete GatewayGroup groupB
The group groupB is still used by the following interceptor(s): enforce-partition-limit
````

**Note**: API V1 is still available, but we recommend that new users and those with simple Gateway configurations begin using the V2 API as soon as possible. 
We will announce a deprecation plan in the coming weeks and notify you in advance of which Gateway version will be the last to support the V1 APIs.

### Support for HTTPS APIs
It is now possible to configure HTTPS and mTLS authentication on the Gateway HTTP APIs. Check the [HTTP section of the Environment Variables page](/gateway/configuration/env-variables/#http) for more details.

### Better UX for ACLs and superUsers
To coincide with the clearly defined concepts established in API V2, we are making changes to ACLs management in Gateway.

ACLs and Super Users on the Gateway (excluding Virtual Clusters) must be configured through Environment Variables.
ACLs and Super Users on Virtual Clusters must now be driven explicitly by configuration.  

#### Enable ACLs for Gateway (excl. Virtual Clusters)
Configure both environment variables:
````shell
GATEWAY_ACL_ENABLED=true # default false
GATEWAY_SUPER_USERS=alice,bob
````

If `GATEWAY_SUPER_USERS` is not set, it will default to `GATEWAY_ADMIN_API_USERS` for backward compatibility.

#### Enable ACLs for Virtual Clusters
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
| Double | Float MIN_VALUE (float again here due to some serdes behaviour) |
| byte[] | "********" as bytes |
| fixed[] | every byte filled with charater "*" |
| boolean | false |

Note that the same default values are now used across all relevant plugins when manipulating a non-string field - Data Masking, Partial Decrypt, and Encrypt on Fetch. 

#### Attempt to apply encryption to a message more than once will now fail
If any of the encryption headers are detected in a message when encryption is about to be applied, then the encryption operation will fail. This is because applying encryption twice (or more) is currently not reversible.

#### Deprecated support for Schema Based (tag) encryption with Protobuf 
Note this is no longer supported, and the Gateway will now throw an exception if the encryption plugin attempts to apply schema (tag) based processing to a Protobuf message.

Note that any data previously written in this mode can still be read back - as the decrypt does not use the schemas at all, rather it uses the message header to know what was encrypted.


## General fixes 🔨

- Large double values (where > Float Max) are now supported in field-level encryption for Avro and Protobuf
- Bytes and fixed fields now properly supported in field-level encryption for Avro
- Avro unions of two or more values (rather than just a value and a null) are now supported in field-level encryption for Avro
- Schema (tag) based encryption now checks and fails if its config is invalid
- It is not possible to encrypt the headers which the encryption plugin uses to manage its decryption process (as this would render the data unrecoverable)
- Improved log messages for Interceptors that reject actions, such as TopicPolicyPlugin
- Several improvements to the LargeMessage & LargeBatch Interceptors
- Fixed an issue where KCache topic initialization would fail silently and leave Gateway in an unusable state
- Added a new Environment Variable `GATEWAY_MIN_BROKERID` (default 0) that allows for determinist mapping of brokers and ports
- Improved network stability during Gateway scaling or Kafka topology changes
- Added support for overriding Kafka Producer properties used for Audit Log topic with `GATEWAY_AUDIT_LOG_KAFKA_` environment variables
- Removed metric `gateway.brokered_active_connections`. This was equal to portCount with port mapping and always 1 in host mapping
- Changed metric `gateway.request_expired` tags: nodeHost/nodePort are replaced by nodeId/clusterId
- Fix default value for `GATEWAY_UPSTREAM_THREAD` config. The new intended default (number of CPU) previously was (2 x number of CPU).
- Fixed an issue with `GATEWAY_ADVERTISED_SNI_PORT` that wasn't working properly
- Add log level for io.confluent packages in default log configuration
- Add default value to non mandatory configruation value for min and max bytes in FetchPolicyInterceptor
- Fix an issue with Concentrated Topics creation with Redpanda

## Known issues
- We are aware of an issue with `kcat` when the new environment variable `GATEWAY_MIN_BROKERID` is not aligned with the first BrokerId of your Kafka cluster.
  - As a workaround, you can either define `GATEWAY_MIN_BROKERID` to your first Kafka BrokerId or use `kcat` with the `-E` flag
- It is not possible to add Service Accounts to GatewayGroups using API V2 unless they are previously declared as GatewayServiceAccount.
  - This is not a wanted behavior, especially for OAuth or Delegated Kafka Authentication where declaring a GatewayServiceAccount should not be needed. We'll address this issue in a follow-up release
  - API V1 (user-mapping) is not impacted
- If you perform a rolling upgrade to 3.3.0, Gateway nodes in earlier versions will show the following error in the logs: `[ERROR] [KafkaCache:1007] - Failed to deserialize a value org.apache.avro.AvroTypeException: Expected field name not found: clusterId`
  - This is fine and will not cause any further problems
- If you use Virtual Clusters and ACLs: After updating to 3.3.0, you must manage VirtualCluster's ACL and superUsers through V2 API. 