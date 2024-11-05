---
sidebar_position: 3
title: Service Accounts, Authentication & Authorization
description: Better understand how the Gateway deals with clients service accounts and authentication
---

## Introduction

This page explains how the Conduktor Gateway manages Service Accounts, client authentication, and ACLs (Access Control Lists).

:::info Definition
A **Service Account** is a non-human identity used by clients to authenticate and perform actions on Kafka resources through the Gateway, depending on their ACLs.
:::

1. [Local and External Service Accounts](#local-and-external-service-accounts)
2. [Client Authentication Methods](#client-authentication-methods)
3. [Authorization Management (ACLs)](#authorization-management-acls)

This page will help you understand:
- Where to authenticate clients, Gateway or Kafka
- Which authentication methods to use
- When you would want to use local, or external, Service Accounts
- How and where to manage service account ACLs

## Local and External Service Accounts

In the Gateway, you can define two types of Service Accounts:
- **Local Service Accounts**: The Gateway generates the password for the Service Account you asked it to create. These credentials can then be shared with clients for authentication.
- **External Service Accounts**: The Gateway declares a Service Account mapped to an existing service account that is already managed by your OIDC identity provider or mTLS certificate. 

Each [Service Account](/gateway/reference/resources-reference/#gatewayserviceaccount) is stored in an internal topic, `_conduktor_gateway_usermappings`, and includes a **name** (used when applying ACLs and interceptors) and an associated **Virtual Cluster**. By default, this is set to `passthrough`.

:::warning
Not all authentication methods support both local and external Service Accounts.

Please refer to the [Client Authentication Methods](#client-authentication-methods) section to see which method supports which type of Service Account.
:::

### Local Service Accounts

The local Service Accounts are useful if you want to **manage the clients credentials directly within Conduktor Gateway**. You can easily create, update, and delete them directly from the Gateway's Admin API.

[Learn how to manage a local service account](/gateway/how-to/manage-service-accounts-and-acls/#manage-a-local-service-account).

### External Service Accounts

For external Service Accounts, the **clients credentials are created and handled by a third-party identity provider** (OIDC, mTLS). 

However, you might want to:
- Refer to them using a friendly name in the Gateway
- Associate them to a Virtual Cluster

In these cases, you can create an external Service Account in the Gateway, and link it to the principal given by your identity provider.

This external Service Account will be the one used in the Gateway to apply **ACLs** & **interceptors**, and will be logged in the **Gateway Audit Log** internal topic.

[Learn how to manage an external service account here.](/gateway/how-to/manage-service-accounts-and-acls/#manage-an-external-service-account)

## Client Authentication Methods

As mentioned earlier, the Gateway supports different **clients authentication methods**, but **not all of them support local and external service accounts**.

You'll find more details below, but here is a summary of the supported service accounts for each client's authentication method:

| `GATEWAY_SECURITY_PROTOCOL`          | [Local SA](#local-service-accounts) | [External SA](#external-service-accounts) |
|--------------------------------------|:-----------------------------------:|:-----------------------------------------:|
| [**Anonymous**](#anonymous-authentication) |                               |                                           |
| &nbsp;&nbsp;PLAINTEXT                |                  ❌                  |                     ❌                     |
| &nbsp;&nbsp;SSL                      |                  ❌                  |                     ❌                     |
| [**SSL with client auth (mTLS)**](#ssl-with-client-authentication-mtls) |                                     |                                           |
| &nbsp;&nbsp;SSL                      |                  ❌                  |                     ✅                     |
| [**SASL**](#sasl-authentication)     |                                     |                                           |
| &nbsp;&nbsp;SASL_PLAINTEXT           |                  ✅                  |            only if OAUTHBEARER            |
| &nbsp;&nbsp;SASL_SSL                 |                  ✅                  |            only if OAUTHBEARER            |
| [**Delegated SASL**](#delegated-sasl-authentication) |                      |                                           |
| &nbsp;&nbsp;DELEGATED_SASL_PLAINTEXT |                  ❌                  |                     ✅                     |
| &nbsp;&nbsp;DELEGATED_SASL_SSL       |                  ❌                  |                     ✅                     |

### Anonymous Authentication

#### PLAINTEXT

In the case of PLAINTEXT authentication, the client is anonymous and doesn't need any credentials.

Thus, authentication cannot take place and so **local and external Service Accounts are not supported in this mode**.

[How to configure the client > Gateway connection with PLAINTEXT.](/gateway/configuration/client-authentication/#plaintext)

#### SSL (Encryption Only)

If you use SSL for encryption only, the Gateway presents a keystore certificate trusted by the client’s truststore, without authenticating the client. 

Thus, **local and external Service Accounts are not supported in this mode**.

[How to configure the client > Gateway connection with SSL.](/gateway/configuration/client-authentication/#ssl)

### SSL with Client Authentication (mTLS)

With mutual TLS (mTLS) authentication, both Kafka clients and the Gateway validate each other’s identities using TLS certificates, ensuring secure and trusted bidirectional communication. This means that both the client and the Gateway authenticate one another through their respective certificates. 

As a result, the Gateway **cannot generate a local Service Account**, but it **can create an external Service Account linked to the client certificate's CN** (Common Name).

:::tip
You can change the SSL principal mapping rules by setting the `GATEWAY_SSL_PRINCIPAL_MAPPING_RULES` environment variable. By default, it extracts the CN.
:::

[How to configure the client > Gateway connection with SSL mTLS.](/gateway/configuration/client-authentication/#mutual-tls-mtls)

### SASL Authentication

With SASL authentication using OAUTHBEARER, clients authenticate with an identity (the `sub` in the OIDC JWT token) which can be mapped to an external Service Account in the Gateway. You can also create a new local Service Account.

:::note
If you have configured OAUTHBEARER, the Gateway expects the client to provide a JWT token, and the grant type should be `clientcredentials`.
:::

See [how to manage Gateway Service Accounts using SASL_PLAINTEXT.](/gateway/how-to/manage-service-accounts-and-acls/)

It is the same for both SASL_PLAINTEXT and SASL_SSL. The only difference is that SASL_SSL encrypts the communication, while SASL_PLAINTEXT transmits in plain text.

[How to configure the client > Gateway connection with SASL.](/gateway/configuration/client-authentication/#sasl_plaintext)

:::warning DELEGATED & NON-DELEGATED MODES
With Conduktor Gateway, you can decide **where you'd like the client authentication & authorization to be made**. This means that you can either:
- **Delegate them at the backing Kafka cluster** ([Delegated SASL Authentication](#delegated-sasl-authentication)) - The Gateway forwards the clients credentials to the Kafka cluster to authenticate them and retrieve their ACLs
- **Handle them at the Gateway** (using the supported [Clients Authentication Methods](#client-authentication-methods)) - The Gateway authenticates the clients and manages their ACLs
:::

### Delegated SASL Authentication

In some cases, you might want to delegate the authentication to the backing Kafka cluster. For example if you want to slowly transition to using the Conduktor Gateway, but first want to continue using the ACLs and Service Accounts defined in your Kafka cluster.

In this case, the Gateway can forward the client credentials to the backing Kafka cluster, and the Kafka cluster will authenticate the client for the Gateway.

:::info
Today, **delegated SASL authentication supports only PLAIN and SCRAM mechanisms**, not GSSAPI (Kerberos) or OAUTHBEARER.
If you'd like us to support more mechanisms, please [let us know](https://product.conduktor.help/tabs/2-released/submit-idea)!
:::

In this mode, the clients authorization (ACLs) is also handled by the backing Kafka cluster. **Any calls to the Kafka ACLs API made on the Gateway will be forwarded to the backing Kafka cluster**.

As such:
- **Local Service Accounts are not available on the Gateway**
- **External Service Accounts are available**, and can be mapped to the client principal. This way Gateway will apply its interceptors on this external Service Account with a "friendly" name

:::warning
Virtual resources ([Virtual Clusters](/gateway/concepts/virtual-clusters), [Alias Topics](/gateway/concepts/logical-topics/alias-topics) and [Concentrated Topics](/gateway/concepts/logical-topics/concentrated-topics)) are not available in the Delegated SASL mode.
:::

[How to configure the client > Gateway connection with DELEGATED_SASL.](/gateway/configuration/client-authentication/#delegated_sasl_plaintext)

## Authorization Management (ACLs)

### In Delegated Mode

Authorization (ACLs) is handled by the backing Kafka cluster. 

Any calls to the Kafka ACLs API made on the Gateway will be forwarded to the backing Kafka cluster.

### In Non-Delegated Mode

Authorization (ACLs) is managed by the Gateway, as such you have to define the ACLs for your applications in the Gateway. This is done using the Kafka ACLs commands, or the Conduktor Console UI.

The principal attached to the ACLs can be either the local Service Account name, or the external Service Account name. If the client connects to the Gateway using OAUTHBEARER, but no external Service Account is defined, the `sub` of the JWT client token will be used as the principal.
