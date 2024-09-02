---
date: 2024-07-19
title: Changes to ACL Support, Upcoming API v2 Release and General Fixes
description: docker pull conduktor/conduktor-gateway:3.2.0
solutions: gateway
tags: features,fix
---

## Breaking Changes 💣
### Two new backing topics are required for Gateway
In the next release (3.3), we'll bring a new API as well as support in the Conduktor [CLI](https://docs.conduktor.io/platform/reference/cli-reference/) to manage Gateway concepts using infra-as-code approach.  

In preparation for this upcoming release, we are replacing some weakly-defined concepts in favor of strongly-defined concepts. The following are now clearly captured in the topics mentioned below:
- Virtual Clusters that existed only through creation of UserMappings or Interceptors targeting
- GatewayGroups that existed only through UserMappings

As a result, 2 new topics will now be created once you upgrade to Gateway 3.2:
 -  `_conduktor_gateway_vclusters`
 -  `_conduktor_gateway_groups`

If you are happy with the default names, you have nothing to do. If you want to control the name of those topics, use the 2 new [environment variables](https://docs.conduktor.io/gateway/configuration/env-variables/#topics-names):
 - `GATEWAY_VCLUSTERS_TOPIC` 
 - `GATEWAY_GROUPS_TOPIC`

Check the [associated Documentation](https://docs.conduktor.io/gateway/configuration/env-variables/#topics-names) for more information.

### Changes to ACL support on Gateway
With Gateway 3.1 we removed our dedicated ACL interceptor in favor of a new environment variable `GATEWAY_ACL_STORE_ENABLED`. This variable was enabling ACLs in all scenarios, whether you used Virtual Clusters or not.

#### Changes for Gateway 3.2
With Gateway 3.2, we are adding a new environment variable `GATEWAY_ACL_ENABLED` and modifying the behavior of the existing variable `GATEWAY_ACL_STORE_ENABLED`.  

From now on, the variables works as follow:

| Environment Variable        | Description                                               | Default   |
|-----------------------------|-----------------------------------------------------------|-----------|
| `GATEWAY_ACL_ENABLED`       | Enable ACLs on the Gateway **excluding** Virtual Clusters | `"false"` |
| `GATEWAY_ACL_STORE_ENABLED` | Enable ACLs on Virtual Clusters **only**                  | `"false"` |


#### Preview for Gateway 3.3
In the next release, we will enhance ACLs to restore and expand the full set of features available before version 3.1. This will be achieved through the introduction of a CLI and APIs, making concepts like VirtualCluster first-class citizens.

#### Enable ACLs for Gateway (excl. Virtual Clusters)
Configure both environment variables:
````shell
GATEWAY_ACL_ENABLED=true
GATEWAY_SUPER_USERS=alice,bob
````

#### Enable ACLs for Virtual Clusters
````yaml
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
````
This will effectively render `GATEWAY_ACL_STORE_ENABLED` obsolete.


## General fixes 🔨

- Fixed an issue with Field-level Avro encryption/decryption relating to [numeric fields](https://docs.conduktor.io/gateway/interceptors/data-security/encryption/encryption-faq/#how-does-encryption-work-with-avro-json-schema-and-protocol-buffers-records):
  - When using partial decryption with Avro schema registry, any numeric values (int, long, float, double) that are not being decrypted will instead be masked with the minimum (most negative) value for the numeric type
  - This is to ensure the field is compliant with the original type in the Avro schema
- Fixed an issue with the ClientIdRequired Policy that wasn't properly overriding the ClientId
- Fixed an issue to ensure all active connections are closed, and clients transition quicker to the new cluster during [cluster switching](https://docs.conduktor.io/gateway/demos/ops/cluster-switching/)
