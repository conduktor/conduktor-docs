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

Deploys an Interceptor on Gateway

<Tabs>
<TabItem  value="CLI" label="CLI">

```yaml
---
apiVersion: gateway/v2
kind: Interceptor
metadata:
  name: enforce-partition-limit
  # scope:
  #   vCluster: aaa
  #   group: bbb
  #   username: ccc
spec:
  pluginClass: "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin"
  priority: 100
  config:
    topic: "myprefix-.*"
    numPartition:
      min: 5
      max: 5
      action: "INFO"
```

</TabItem>
<TabItem value="Terraform" label="Terraform">

```hcl
resource "conduktor_gateway_interceptor_v2" "enforce-partition-limit" {
  name = "enforce-partition-limit"
  #scope = {
  #  vcluster = "aaa"
  #  group    = "bbb"
  #  username = "ccc"
  #}
  spec = {
    plugin_class = "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin"
    priority     = 100
    config = jsonencode({
      topic = "myprefix-.*"
      numPartition = {
        min    = 5
        max    = 5
        action = "INFO"
      }
    })
  }
}
```

</TabItem>
</Tabs>

**Interceptor checks:**

- `metadata.scope` is optional (default empty).
- `metadata.scope.[vCluster | group | username]` combine with each other to define the targeting
  - Check the dedicated [Interceptor targeting](#interceptor-targeting) section
- `spec.pluginClass` is **mandatory**. Must be a valid Interceptor class name from our [available Interceptors](/gateway/category/interceptor-catalog/)
- `spec.priority` is **mandatory**
- `spec.config` is a valid config for the `pluginClass`

### Interceptor targeting

You can activate your Interceptor only in specific scenarios. Use the table below to configure targeting settings.

| Use case                                            | `metadata.scope.vcluster` | `metadata.scope.group` | `metadata.scope.username` |
|-----------------------------------------------------|---------------------------|------------------------|---------------------------|
| Global Interceptor (Including Virtual Clusters)     | Set to `null`             | Set to `null`          | Set to `null`             |
| Global Interceptor (**Excluding** Virtual Clusters) | Empty                     | Empty                  | Empty                     |
| Username targeting                                  | Empty                     | Empty                  | Set                       |
| Group targeting                                     | Empty                     | Set                    | Empty                     |
| Virtual Cluster targeting                           | Set                       | Empty                  | Empty                     |
| Virtual Cluster + Username targeting                | Set                       | Empty                  | Set                       |
| Virtual Cluster + Group targeting                   | Set                       | Set                    | Empty                     |

You can deploy multiple interceptors with the same name using a different targeting scope. This will effectively [override](../concepts/interceptors.md#overriding) the configuration for the scope.

:::info
The order of precedence from highest (overrides all others) to lowest (most easily overridden) is:

- ServiceAccount
- Group
- VirtualCluster
- Global

:::

**Examples**

<Tabs>
<TabItem  value="CLI" label="CLI">

```yaml
---
# This interceptor targets everyone (Including Virtual Clusters)
apiVersion: gateway/v2
kind: Interceptor
metadata:
  name: enforce-partition-limit
  scope:
    vCluster: null
    group: null
    username: null
spec:

---
# This interceptor targets everyone (Excluding Virtual Clusters)
apiVersion: gateway/v2
kind: Interceptor
metadata:
  name: enforce-partition-limit
spec:

---
# This interceptor targets only `admin` service account
apiVersion: gateway/v2
kind: Interceptor
metadata:
  name: enforce-partition-limit
  scope:
    username: admin
spec:

---
# This interceptor targets only `read-only` virtual cluster
apiVersion: gateway/v2
kind: Interceptor
metadata:
  name: enforce-partition-limit
  scope:
    vCluster: read-only
spec:

```

</TabItem>
<TabItem value="Terraform" label="Terraform">

```hcl
# This Interceptor targets everyone (including virtual clusters)
resource "conduktor_gateway_interceptor_v2" "enforce-partition-limit" {
  name = "enforce-partition-limit"
  scope = {
    vcluster = null
    group    = null
    username = null
  }
  spec = {

  }
}

# This Interceptor targets everyone (excluding virtual clusters)
resource "conduktor_gateway_interceptor_v2" "enforce-partition-limit" {
  name = "enforce-partition-limit"
  spec = {

  }
}

# This Interceptor only targets the `admin` service account
resource "conduktor_gateway_interceptor_v2" "enforce-partition-limit" {
  name = "enforce-partition-limit"
  scope = {
    username = "admin"
  }
  spec = {

  }
}


# This Interceptor only targets the `read-only` virtual cluster
resource "conduktor_gateway_interceptor_v2" "enforce-partition-limit" {
  name = "enforce-partition-limit"
  scope = {
    vcluster = "read-only"
  }
  spec = {

  }
}
```

</TabItem>
</Tabs>

## GatewayServiceAccount

GatewayServiceAccount is generally optional when using Oauth, mTLS or Delegated Backing Kafka authentication.

GatewayServiceAccount resource is enabled or not depending on your Gateway configuration. This is to prevent you to declare a resource that is incompatible with your current configuration:

| GATEWAY_SECURITY         | LOCAL GatewayServiceAccount | EXTERNAL GatewayServiceAccount        |
|--------------------------|--|--------------------------|
| PLAINTEXT                | 🚫 | 🚫                       |
| SSL                      | 🚫 | only if mTls             |
| SASL_PLAINTEXT           | ✅ | only if OAuth configured |
| SASL_SSL                 | ✅ | only if OAuth configured |
| DELEGATED_SASL_PLAINTEXT | 🚫 | ✅                        |
| DELEGATED_SASL_SSL       | 🚫 | ✅                        |

There are a few cases where you **must** declare GatewayServiceAccount objects:

- Creating Local Service Accounts
- Renaming Service Accounts for easier clarity when using Interceptors
- Attaching Service Accounts to Virtual Clusters

<Tabs>
<TabItem  value="CLI" label="CLI">

```yaml
---
# External user renamed
apiVersion: gateway/v2
kind: GatewayServiceAccount
metadata:
  name: application1
spec:
  type: EXTERNAL
  externalNames:
  - 00u9vme99nxudvxZA0h7
---
# Local User on Virtual Cluster vc-B
apiVersion: gateway/v2
kind: GatewayServiceAccount
metadata:
  vCluster: vc-B
  name: admin
spec:
  type: LOCAL
```

</TabItem>
<TabItem value="Terraform" label="Terraform">

```hcl
resource "conduktor_gateway_service_account_v2" "application1-sa" {
  name = "application1"
  spec = {
    type = "EXTERNAL"
    external_names = [ "00u9vme99nxudvxZA0h7" ]
  }
}

resource "conduktor_gateway_service_account_v2" "admin-sa" {
  name = "admin"
  vcluster = "vc-B"
  spec = {
    type = "LOCAL"
  }
}

# Generate local service account token
resource "conduktor_gateway_token_v2" "admin-sa-token" {
  vcluster         = "vc-B"
  username         = "user10"
  lifetime_seconds = 3600
}

# Define output to use generated local service account token
output "admin_sa_token" {
  value     = conduktor_gateway_token_v2.admin-sa-token.token
  sensitive = true
}
```

</TabItem>
</Tabs>

**GatewayServiceAccount checks:**
When `spec.type` is `EXTERNAL`, the `spec.externalNames` has to be a non-empty list of external names. Each name has to be unique across all declared GatewayServiceAccount. We currently only support a list of one element. Support for multiple externalNames will be added in the future.

**GatewayServiceAccount side effects:**

- When `spec.type` is `EXTERNAL`:
  - During Client connection, the authenticated user will be checked against the list of `externalNames` to decide which GatewayServiceAccount it is.
- When `spec.type` is `LOCAL`:
  - Access to `/gateway/v2/tokens` endpoint to generate a password for this Service Account
  - Switching a GatewayServiceAccount `spec.type` from `LOCAL` to `EXTERNAL` does not invalidate previously emitted tokens. They will keep on working for their TTL)

## GatewayGroup

Gateway Group lets you add multiple users in the same GatewayGroup for easier Interceptor targeting capabilities.

```yaml
---
# Users added to the group manually
apiVersion: gateway/v2
kind: GatewayGroup
metadata:
  name: group-a
spec:
  members:
    - name: admin
    - vCluster: vc-B
      name: "0000-AAAA-BBBB-CCCC"
```

**GatewayGroup checks:**

- `spec.members[].name` is mandatory.
  - Currently, the username needs to refer to an existing GatewayServiceAccount otherwise it will fail. This is a known issue that we'll address in a further release.
- `spec.members[].vCluster` is optional. Must refer to an existing Virtual Cluster. When not using Virtual Clusters, don't set this attribute.

**GatewayGroup side effects:**

- All members of the group will be affected by Interceptors deployed with this group's scope.

## ConcentrationRule

Concentration Rules allow you to define patterns where topic creation won't generate a physical topic, but will instead use our Topic Concentration feature.

```yaml
---
apiVersion: gateway/v2
kind: ConcentrationRule
metadata:
  # vCluster: vc-B
  name: toutdanstiti
spec:
  pattern: titi-.*
  physicalTopics:
    delete: titi-delete
    compact: titi-compact
    deleteCompact: titi-cd
  autoManaged: false
  offsetCorrectness: false
```

**ConcentrationRule checks:**

- `metadata.vCluster` is optional. Must refer to an existing Virtual Cluster. When not using Virtual Clusters, don't set this attribute.
- `spec.physicalTopics.delete` is mandatory. Must be a valid topic name with a `cleanup.policy` set to `delete`
- `spec.physicalTopics.compact` is optional. Must be a valid topic name with a `cleanup.policy` set to `compact`
- `spec.physicalTopics.deleteCompact` is optional. Must be a valid topic name with a `cleanup.policy` set to `delete,compact`
- `spec.autoManaged` is optional, default `false`
- `spec.offsetCorrectness` is optional, default `false`

**ConcentrationRule side effects:**

- Once the Concentration Rule is deployed, topics created with a name matching the `spec.pattern` will not be created as real Kafka topics but as Concentrated Topics instead.
- Depending on the topic's `cleanup.policy`, the topic's data will be stored in one of the configured physical topics.
- If a topic creation request is made with a `cleanup.policy` that isn't configured in the ConcentrationRule, topic creation will fail.
- It is not possible to update `cleanup.policy` of a concentrated topic.
- If `spec.autoManaged` is set to `true`, the underlying physical topics and configurations will be automatically created and/or extended to honour the topics configurations.
- If `spec.offsetCorrectness` is set to `true`, Gateway will maintain a list of offsets for each of the Concentrated Topic records.
  - This allows for a proper calculation of Message Count and Consumer Group Lag.
  - There are some limitation. Read more about [Offset Correctness here](/gateway/concepts/logical-topics/concentrated-topics/#known-issues-and-limitations-with-offset-correctness)
- If `spec.offsetCorrectness` is set to `false`, Gateway will report the offsets of the backing topic records.

:::caution
If a ConcentrationRule spec changes, it will not affect previously created Concentrated Topics.
It will only affect the Topics created after the change.
:::

## VirtualCluster

A Virtual Cluster allows you to isolate one or more service accounts within a logical cluster. Any topic or consumer group created within a Virtual Cluster will be accessible only to that specific Virtual Cluster.

A Virtual Cluster acts like a Kafka cluster within a Kafka cluster. Here's a simple example:

```yaml
---
apiVersion: gateway/v2
kind: VirtualCluster
metadata:
 name: "mon-app-A"
spec:
 aclEnabled: false # No authorization for clients connecting to the vcluster. Clients are free to perform any operation on resources within the vcluster
```

### Kafka API powered ACLs

You can give Virtual Clusters all of the ACL features of a standard Kafka cluster by setting `spec.aclEnabled` to `true` and defining `spec.aclMode` as `KAFKA_API`,

```yaml
---
apiVersion: gateway/v2
kind: VirtualCluster
metadata:
 name: "mon-app-A"
spec:
 aclEnabled: true # (uses aclMode to determine how the acls are enabled or defaults to KAFKA_API if it is not set)
 aclMode: KAFKA_API # Means ACLs can be edited by the superUsers using kafka-acls command or equivalent 
 superUsers: # This doesn't create users within the Virtual Cluster. You still need to create the gateway service account.
 - username1
 - username2
```

Connecting to Gateway as one of the service accounts named in the `superUsers` list, allows you to manage ACLs for other service accounts within the Virtual Cluster using the Kafka Admin API. The same way you would on a real Kafka Cluster.

### REST API ACLs

Managing ACLs with the Kafka Admin API is extremely powerful, but can also be cumbersome. For some use-cases it is desirable to configure everything using the REST api instead. This can be done by setting the `aclMode` to `REST_API`. For example,

```yaml
---
apiVersion: gateway/v2
kind: VirtualCluster
metadata:
 name: "mon-app-A"
spec:
 aclEnabled: true
 aclMode: REST_API # Means ACLs must be set in this resource using the below acls field
 acls:
  - resourcePattern:
      resourceType: TOPIC
      name: customers
      patternType: LITERAL
    principal: User:username1
    operation: READ
    permissionType: ALLOW
  - resourcePattern:
      resourceType: TOPIC
      name: customers
      patternType: LITERAL
    principal: User:username1
    operation: WRITE
    permissionType: ALLOW
```

This example demonstrates two basic ACLs, but any ACL valid with the Kafka API is also valid to be set via REST (eg `*` wildcards). For a complete understanding of the options available checkout the [Open API schema](https://developers.conduktor.io/?product=gateway&version=3.11.0&gatewayApiVersion=v2#tag/cli_virtual-cluster_gateway_v2_7/operation/List%20the%20virtual%20clusters).

:::info
We do not allow the `aclMode` to be changed once it is set. When `aclEnabled` is set to `true` without specifiying the `aclMode` the system sets it to its default value of `KAFKA_API`. This means that if you set the `aclEnabled` flag to true but do not set the `aclMode` you cannot later change it to `REST_API`. We do this because `KAFKA_API` and `REST_API` have incompatible mutation processes (`KAFKA_API` changes are cumulative whereas `REST_API` is idempotent)
:::

## AliasTopic

An Alias Topic allows a real Kafka topic to appear as a logical topic within the Gateway. This is useful for aliasing topics or making a topic accessible within a Virtual Cluster.

```yaml
---
apiVersion: gateway/v2
kind: AliasTopic
metadata:
  name: name1
  vCluster: vCluster1
spec:
  physicalName: physicalName1
```
