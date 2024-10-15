---
date: 2024-10-18
title: Gateway 3.4.0
description: docker pull conduktor/conduktor-gateway:3.4.0
solutions: gateway
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

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
For this release 3.4.0, we'll only raise the following warning in the logs:  
````
2024-08-27T18:15:29 [WARN] - Inconsistency detected for plain authentication. Username applicationA is not consistent with validated token created for application-A. SASL configuration should be changed accordingly.
````

## Features ✨

- [Correct Offsets on Concentrated Topics](#correct-offsets-on-concentrated-topics)

### Correct Offsets on Concentrated Topics

The main limitation of Concentrated Topics was its inability to show correct Lag and Message Count.  

This is now a problem from the past as we are now computing offsets directly within the Gateway.

This experimental feature can be enabled per ConcentrationRule.
````yaml
---
kind: ConcentrationRule
metadata:
  name: myapp-concentrated
spec:
  pattern: myapp-.*
  physicalTopics:
    delete: myapp-concentrated
  autoManaged: false
  trueOffsets: true
````

Check the dedicated documentation for more details on the feature and its limitations.


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