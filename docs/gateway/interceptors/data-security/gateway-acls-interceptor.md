---
version: 3.0.0
title: ACLs
description: Apply Acls to your gateway resources
parent: data-security
license: enterprise
---

## Introduction

Like in Kafka, you can define ACLs on the Gateway to restrict your applications access. This implies that the authentication is made on Gateway, and that you are **not** using a [delegated mode](/gateway/configuration/kafka-authentication/#delegated-authentication). This interceptor is made to activate these ACLs.

:::warning
This interceptor is not supported anymore, as of Gateway 3.1.0.
If you are using a more recent version, please refer to this [page](../../concepts/acls).
:::

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

After having turned on the ACLs interceptor, the delegated admin will be able to manage other users ACLs.

## Supported ACLs

Conduktor Gateway supports all Kafka ACLs except the following:

* Any ACL where the Resource is DelegationToken
* Restricting listTransactionsRequest with TransactionalId Resource ACLs

Note: Conduktor Gateway does not support partial application of ACLs, a request will fail or succeed in its entirety if
 an appropriate ACL is applied.

## Manipulating ACLs

Conduktor Gateway supports the usual ACL manipulation tooling documented [here](https://cwiki.apache.org/confluence/display/KAFKA/Kafka+Authorization+Command+Line+Interface)

ACLs are applied independently for each vCluster. When creating ACLs, ensure that the credentials used are for the 
appropriate vCluster.

## Configuration

```json
{
  "name": "myAclInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.AclsInterceptorPlugin",
  "priority": 100,
  "config": {
  }
}
```
