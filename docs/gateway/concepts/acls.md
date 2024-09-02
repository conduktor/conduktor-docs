---
version: 3.0.0
title: ACLs
description: Apply ACLs to your Gateway resources
license: enterprise
---

## Introduction

Like in Kafka, you can define ACLs on the Gateway to restrict your applications access. This implies that the authentication is made on Gateway, and that you are **not** using a [delegated mode](/gateway/configuration/kafka-authentication/#delegated-authentication).

## Super Users

In order to create and manipulate ACLs, you have to define one of your application principal as super user.

To do so, you can add this principal to the environment variable `GATEWAY_ADMIN_API_USERS` in the Gateway configuration.

Example:
```yaml
GATEWAY_ADMIN_API_USERS: "[{username: admin, password: conduktor, admin: true}, {username: super-admin, password: whatever, admin: true}]"
```

If the application principal is a bit complex (like UUID), you can use the Gateway user-mapping to map the principal to a simpler username.

As of now, you can create ACLs using the Conduktor Console or the Kafka CLI, using the credentials of the super user.

### Delegate the ACLs management to a user

Defining a super user gives it the permissions to manage the ACLs, but also a full access to all the Kafka resources. If you'd like to, you can create a delegated admin user (which is not a super user) in order to assign ACLs only.

To do so, the only [set of permissions](https://docs.confluent.io/platform/current/kafka/authorization.html#cluster-resource-operations) the super user has to give to the delegated admin are the `Alter` and `Describe` on cluster.

Here is an example of command:
```bash
kafka-acls --bootstrap-server conduktor-gateway:6969 \
  --command-config super-admin.properties \
  --add \
  --allow-principal User:delegated-admin --allow-host '*' \
  --operation Alter --operation Describe --cluster
```

## ACLs Activation

To activate the ACLs, you need to add the following environment variable to your Gateway configuration:

| Environment Variable        | Default | Description                                                                   |
|:----------------------------|:--------|:------------------------------------------------------------------------------|
| `GATEWAY_ACL_ENABLED`       | `false` | Enable or disable the ACLs **on the passthrough only**                        |
| `GATEWAY_ACL_STORE_ENABLED` | `false` | <div>Enable or disable the ACLs **only on virtual cluster, excluding passthrough**.</div><br /><div>Note this is **Deprecated in 3.3.0** in favour of [ACLs on Virtual Clusters](#acls-activation-on-virtual-clusters).</div>   |

### Activation on Virtual Clusters

As of Gateway 3.3.0, ACLs within Virtual Clusters can be driven explicitly by configuration. 

:::warning
Note that if you are migrating from an older version of Gateway, the migration will generate existing Virtual Clusters as configuration. 

 - The automation will derive the boolean value `aclEnabled` from the previously used `GATEWAY_ACL_STORE_ENABLED` variable. 
 - The migration will not populate the `superUsers` list automatically, so this must be addressed as part of your migration. 
:::

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

See the [CLI Reference](../reference/cli-reference.md) for more information on managing Gateway resources.


## ACLs Creation

You can now create ACLs using either the [Conduktor Console](/platform/navigation/console/service-accounts), or the Kafka CLI.

For example, you can run the following command line to list the ACLs on the Gateway:
```bash
kafka-acls \
  --bootstrap-server conduktor-gateway:6969 \
  --command-config super-admin.properties \
  --list
```

And as the delegated admin, for instance, you can give visibility to all the topics to a user `alice`:
```bash
kafka-acls \
  --bootstrap-server conduktor-gateway:6969 \
  --command-config delegated-admin.properties \
  --add \
  --allow-principal User:alice --allow-host * \
  --operation All --topic *
```

### Creation on Virtual Clusters

You can create ACLs targeting topics that reside on a Virtual Cluster by using the virtual cluster configuration during ACL creation:
```bash
kafka-acls \
    --bootstrap-server conduktor-gateway:6969 \
    --command-config virtual-cluster-admin.properties \
    --add \
    --allow-principal User:consumer \
    --operation read \
    --topic logical-topic
```
