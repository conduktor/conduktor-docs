---
sidebar_position: 3
title: Service Accounts & Authentication
description: Better understand how the Gateway deals with clients service accounts and authentication
---

## Introduction

In this concept page, we will explain how the Gateway deals with Service Accounts, authentication, and how to manage the client ACLs.

1. [Local and External Service Accounts](#local-and-external-service-accounts)
2. [Authentication Methods](#authentication-methods)
3. [ACLs management](#acls-management)

At the end of this page, you will have a better understanding of:
- Where do you want your clients to authenticate? (Gateway, Kafka)
- Using which authentication method?
- Do you want to manage local or external service accounts?
- How to manage service accounts ACLs?

## Local and External Service Accounts

The service account is the non-human identity used by clients to connect to Kafka. This identity is used to authorize the client to perform actions on Kafka resources.
In the Gateway, you can define two types of service accounts:
- **Local service accounts**: The Gateway will generate the password for the service account you gave it. Then, you can share this with your clients to authenticate.
- **External service accounts**: The Gateway will declare a service account mapped to an existing one handled by your OIDC, mTLS or LDAP identity provider. 

Behind the scenes, all the service accounts created in the Gateway are stored in the `_conduktor_gateway_usermappings` internal topic.

Creating Local Service Accounts
Renaming Service Accounts for easier clarity when using Interceptors
Attaching Service Accounts to Virtual Clusters

In its [definition](/gateway/reference/resources-reference/#gatewayserviceaccount), each service account has a **name**, which is the reference used by Gateway to apply ACLs or interceptors. It also exists in a **Virtual Cluster**. If you don't provide any Virtual Cluster in your API call, the default is `passthrough`.

:::warning
Local and external service accounts aren't available in all the authentication methods. Please refer to the [Authentication Methods](#authentication-methods) section to understand which method supports which type of service account.
:::

### Local Service Accounts

The local service accounts are useful if you want to manage the clients credentials directly in the Gateway. You can easily create, update, and delete them directly from the Gateway API. 

See this guide to learn how to [manage a local service account](/gateway/how-to/manage-service-accounts/#manage-a-local-service-account).

### External Service Accounts

In the case of external service accounts, the clients credentials are handled by a third-party identity provider (OIDC, mTLS, LDAP). 

However, you might want to:
- Map them to a more friendly name in the Gateway
- Attach them to a Virtual Cluster

In those cases, you can create an external service account in the Gateway, which will be linked to the external service account.

## Authentication Methods

As mentioned earlier, the Gateway supports different clients authentication methods, but not all of them support local and external service accounts.

Here is a summary of the supported service accounts for each authentication method:

| GATEWAY_SECURITY         | Local SA | External    SA           |
|--------------------------|----------|--------------------------|
| **Anonymous**            |          |                          |
| PLAINTEXT                | 🚫       | 🚫                       |
| SSL                      | 🚫       | only if mTls             |
| **SASL**                 |          |                          |
| SASL_PLAINTEXT           | ✅        | only if OAuth configured |
| SASL_SSL                 | ✅        | only if OAuth configured |
| **Delegated SASL**       |          |                          |
| DELEGATED_SASL_PLAINTEXT | 🚫       | ✅                        |
| DELEGATED_SASL_SSL       | 🚫       | ✅                        |

### Anonymous Authentication

#### PLAINTEXT

In the case of PLAINTEXT authentication, the client is anonymous and doesn't need any credentials. This means that the creation of local and service accounts are not available.

#### SSL

In the case of SSL authentication, the client is authenticated using a client certificate. For that reason, you can't create any local service account in the Gateway. However, you can create an external service account if you're using mTLS, that would be mapped to the CN of the client certificate.

:::warning
To be confirmed, this doesn't work for me.
:::

### SASL Authentication

In the case of SASL authentication, when the clients connect, we retrieve their service account. This mean that you can create local and external service accounts.

For both SASL_PLAINTEXT and SASL_SSL, you can

### Delegated SASL Authentication



## ACLs management







---

Gateway Service Accounts are tightly coupled to the Authentication method you choose to connect your clients to the Gateway.

:::info
The objective of Authentication, whatever the method used, is to provide Conduktor Gateway with a Service Account **name** to be used in Kafka, and optionally a **set of Groups** and a **Virtual Cluster** to associate to the Service Account.
:::

There are 3 ways to authenticate users with the Gateway:
- **Delegating** authentication to the backing cluster (Confluent Cloud API Keys for instance)
- Using an **External** source of authentication such as OAuth/OIDC, mTLS, LDAP
- Using Gateway **Local** Service Accounts

Each method has its own advantages and limitations, due to the structure of the object returned by the authentication process:

| Authentication | Source of Name | Source of Groups | Source of Virtual Cluster |
|----------------|----------------|------------------|---------------------------|
| Delegated      | ✅              | 🚫               | 🚫                        |
| mTLS           | ✅              | 🚫               | 🚫                        |
| External Oauth | ✅              | ✅                | ✅                         |
| Local          | ✅              | ✅                | ✅                         |

Check the dedicated [Authentication Configuration page](/gateway/configuration/client-authentication) to understand how to configure each method.


:::tip
Once Authentication is configured, if you don't need Group or Virtual Cluster, then no further step is necessary regarding Service Accounts.
:::

There are a few cases where it's necessary to declare GatewayServiceAccount resources: **Local Gateway Users**, **Service Account mapping** or **Virtual Cluster mapping**.  
Also, the GatewayServiceAccount API will be restricted depending on your Gateway configuration:

| GATEWAY_SECURITY         | Local SA | External    SA           |
|--------------------------|----------|--------------------------|
| PLAINTEXT                | 🚫       | 🚫                       |
| SSL                      | 🚫       | only if mTls             |
| SASL_PLAINTEXT           | ✅        | only if OAuth configured |
| SASL_SSL                 | ✅        | only if OAuth configured |
| DELEGATED_SASL_PLAINTEXT | 🚫       | ✅                        |
| DELEGATED_SASL_SSL       | 🚫       | ✅                        |


**Local Gateway Users**  
If you don't use any form of external authentication (delegated, Oauth, mTLS, ...), but still want authentication (you can also stay with unauthenticated users), then you must declare Local Gateway users.

You can generate a tuple user/password using the dedicated endpoint:
````json
POST /admin/username/alice
{
  "lifeTimeSeconds": 7776000
}
````

**Service Account mapping**  
When you don't have any control on the JWT generated by your OIDC provider, and you need map the `sub` of the claim to a more friendly and recognizable name in Kafka.
````json
{
  "aud": "https://myapi.example.com",
  "iss": "https://login.microsoftonline.com/{tenant_id}/v2.0",
  "sub": "8d5e86b4-6a41-4e94-b6a8-1e5b7723e858",
  "exp": 1643482800,
  "nbf": 1643479200,
  "iat": 1643479200,
  "nonce": "12345"
}
````
Given this JWT token, deploying this `GatewayServiceAccount` resource will map the unreadable sub into a clear name `alice`, which you will then use for Interceptor Targeting, ACLs, ...
````json
POST /admin/userMappings/v1
{
  "username": "alice",
  "principal": "8d5e86b4-6a41-4e94-b6a8-1e5b7723e858"
}
````

**Virtual Cluster mapping**  
If you want to use Virtual Cluster feature, deploying this resource will link the service account to the specified Virtual Cluster `vc-alice`.

````json
POST /admin/userMappings/v1/vcluster/vc-alice
{
  "username": "alice",
  "principal": "8d5e86b4-6a41-4e94-b6a8-1e5b7723e858"
}
````


          