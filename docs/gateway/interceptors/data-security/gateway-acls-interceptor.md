---
version: 2.5.0
title: Acls
description: Apply Acls to your gateway resources
parent: data-security
license: enterprise
---

## Introduction

## SuperUsers

In order to create and manipulate ACLs a super user account must be created. This interceptor uses the super user 
account details from the underlying Gateway instance (`GATEWAY_ADMIN_API_USERS`). Note that an access token must be 
created for these users so that Kafka commands can be issued.


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
