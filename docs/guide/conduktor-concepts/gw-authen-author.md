---
title: Gateway authentication and authorization
description: Learn Conduktor terminology
---
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

## Overview

Find out how Conduktor Gateway manages <GlossaryTerm>service accounts</GlossaryTerm>, client authentication and ACLs (Access Control Lists):

- where to authenticate clients, Gateway or Kafka
- which authentication method to use
- when to use local or external service accounts
- how and where to manage service account ACLs

## Client authentication methods

Gateway supports different client authentication methods, depending on both the type of service account (local or external), and the [security mode](/gateway/configuration/client-authentication/) (Gateway managed or Kafka managed).

| **Mode**          | **Protocol**                                                            | [Local service account](/guide/conduktor-concepts/gw-service-accounts/#local-service-accounts)               | [External service account](/guide/conduktor-concepts/gw-service-accounts/#external-service-accounts)                  |
| ----------------- | ----------------------------------------------------------------------- | :---------------------------------: | :---------------------------------------: |
|                   | [**Anonymous**](#anonymous-authentication)                              |                                     |                                           |
| `GATEWAY_MANAGED` | PLAINTEXT                                                               |                  ❌                 |                     ❌                    |
|                   | SSL                                                                     |                  ❌                 |                     ❌                    |
|                   | [**SSL with client auth (mTLS)**](#ssl-with-client-authentication-mtls) |                                     |                                           |
|                   | SSL                                                                     |                  ❌                 |                     ✅                    |
|                   | [**SASL**](#sasl-authentication)                                        |                                     |                                           |
|                   | SASL\_PLAINTEXT                                                         |                  ✅                 |           only if `OAUTHBEARER`           |
|                   | SASL\_SSL                                                               |                  ✅                 |           only if `OAUTHBEARER`           |
| `KAFKA_MANAGED`   | SASL\_PLAINTEXT                                                         |                  ❌                 |                     ✅                    |
|                   | SASL\_SSL                                                               |                  ❌                 |                     ✅                    |

:::warning[Deprecated protocols]
As of [Gateway v3.10.0](/changelog/Gateway-3.10.0), the `DELEGATED_XXX` security protocols have been deprecated in favour of the security mode, set by an additional environment variable `GATEWAY_SECURITY_MODE`. These values remain supported for backward compatibility but will be deprecated in future and are no longer the recommendation for new configurations.

If you're using `DELEGATED` security protocols, [see the security mode migration guide](/guide/tutorials/migrate-gw-security).
:::

### Anonymous authentication

#### PLAINTEXT

In the case of PLAINTEXT authentication, the client is anonymous and doesn't need any credentials.

Thus, authentication can't take place and so **local and external Service Accounts are not supported in this mode**.

[How to configure the client > Gateway connection with PLAINTEXT.](/gateway/configuration/client-authentication/#plaintext)

#### SSL (encryption only)

If you're using SSL for transport layer encryption only, Gateway presents a keystore certificate trusted by the client’s truststore, without authenticating the client.

Thus, **local and external Service Accounts are not supported in this mode**.

[How to configure the client > Gateway connection with SSL.](/gateway/configuration/client-authentication/#ssl)

### SSL with client authentication (mTLS)

With mutual TLS (mTLS) authentication, both Kafka clients and Gateway validate each other’s identities using TLS certificates, ensuring secure and trusted bidirectional communication. This means that both the client and Gateway authenticate one another through their respective certificates.

As a result, Gateway extracts the user identity from the TLS certificate, which can be mapped to an external Service Account in Gateway.

:::tip[Username format]
The username will be in this format: `CN=writeuser,OU=Unknown,O=Unknown,L=Unknown,ST=Unknown,C=Unknown`. You can change this by setting the `GATEWAY_SSL_PRINCIPAL_MAPPING_RULES` environment variable to a customized rule. By default, it extracts the certificate distinguished name.

For example, `GATEWAY_SSL_PRINCIPAL_MAPPING_RULES=RULE:^CN=([a-zA-Z0-9.-]*).*$$/$$1/ , DEFAULT` will extract the CN part of the certificate.
:::

[See how to configure the client to Gateway connection with SSL mTLS](/gateway/configuration/client-authentication/#mutual-tls-mtls).

### SASL authentication

With SASL authentication using OAUTHBEARER, clients authenticate with an identity (the `sub` in the OIDC JWT token) which can be mapped to an external Service Account in Gateway.

:::note[JWT token]
If you have configured OAUTHBEARER, Gateway expects the client to provide a JWT token and the grant type should be `clientcredentials`.
:::

[Check out the tutorial on how to manage Gateway service accounts using SASL_PLAINTEXT](/guide/tutorials/manage-gw-sa).

It's the same for both SASL_PLAINTEXT and SASL_SSL. The only difference is that SASL_SSL encrypts the communication, while SASL_PLAINTEXT transmits in plain text.

[How to configure the client to Gateway connection with SASL](/gateway/configuration/client-authentication/#sasl_plaintext).

:::warning[KAFKA_MANAGED and GATEWAY_MANAGED modes]
With Conduktor Gateway, you can **decide where you'd like the client authentication and authorization to be made**. This means that you can either:

- **allow the backing Kafka cluster to manage them** ([Kafka Managed SASL Authentication](#kafka-managed-sasl-authentication)) - in this mode Gateway forwards the client credentials to the Kafka cluster to authenticate them and retrieve their ACL rules. Or you can
- **manage them with Gateway** (using the supported [client authentication methods](#client-authentication-methods)) - in this mode, Gateway manages the client authentication and authorization, based on their associated ACL rules.

:::

### Kafka managed SASL authentication

In some cases, you might want to delegate the authentication to the backing Kafka cluster. For example, you want to gradually transition to using the Conduktor Gateway but first want to continue using the ACLs and Service Accounts defined in your Kafka cluster.

In this case, Gateway can forward the client credentials to the backing Kafka cluster, and the Kafka cluster will authenticate the client for Gateway.

:::info[Supported mechanisms]
Currently, Kafka managed SASL authentication only supports PLAIN, SCRAM, OAUTHBEARER and AWS_MSK_IAM mechanisms. If you have specific requirements, [get in touch](https://support.conduktor.io/hc/en-gb/requests/new?ticket_form_id=17438365654417).
:::

In this mode, the client's authorization (ACLs) is also handled by the backing Kafka cluster. **Any calls to the Kafka ACLs API made on Gateway will be forwarded to the backing Kafka cluster**.

Therefore, **local Service Accounts are not available on Gateway** but **the external service accounts are available** and can be mapped to the client principal. This way Gateway will apply its Interceptors on this external Service Account with a friendly name.

:::warning[Limitation]
Virtual resources such as ([virtual clusters](/guide/concepts/virtual-clusters), [alias topics](/guide/concepts/logical-topics/alias-topics) and [concentrated topics](/guide/concepts/logical-topics/concentrated-topics)) are not available in Kafka managed mode.
:::

[Find out how to configure the client to Gateway connection with KAFKA_MANAGED](/gateway/configuration/client-authentication/#security-protocol).

## Authorization management (ACLs)

### In Kafka managed mode

Authorization (ACLs) is handled by the backing Kafka cluster.

Any calls to the Kafka ACLs API made on Gateway will be forwarded to the backing Kafka cluster.

### In Gateway managed mode

Authorization (ACLs) is managed by Gateway, so you have to define the ACLs for your applications in Gateway. This is done using the Kafka ACLs commands or the Conduktor Console UI.

The principal attached to the ACLs can either be the local or the external service account name. If the client connects to Gateway using OAUTHBEARER but no external service account is defined, the `sub` of the JWT client token will be used as the principal.

## Gateway service accounts and authentication

Gateway service accounts are tightly coupled to the Authentication method you choose to connect your clients to Gateway.

:::info
The objective of authentication, whatever the method used, is to provide Conduktor Gateway with a Service Account **name** to be used in Kafka, and optionally a **set of Groups** and a **Virtual Cluster** to associate to the Service Account.
:::

There are three ways to authenticate users with Gateway:

- **Delegating** authentication to the backing cluster (Confluent Cloud API Keys for instance)
- Using an **External** source of authentication such as OAuth/OIDC, mTLS, LDAP
- Using Gateway **Local** Service Accounts

### Client authentication methods

Gateway supports different client authentication methods, depending on whether you're using local or external service accounts.

| `GATEWAY_SECURITY_PROTOCOL`                                             |  [Local service account](/guide/conduktor-concepts/gw-service-accounts/#local-service-accounts)               | [External service account](/guide/conduktor-concepts/gw-service-accounts/#external-service-accounts)   |
|-------------------------------------------------------------------------|:-----------------------------------:|:-----------------------------------------:|
| [**Anonymous**](#anonymous-authentication)                              |                                     |                                           |
| &nbsp;&nbsp;PLAINTEXT                                                   |                  ❌                  |                     ❌                     |
| &nbsp;&nbsp;SSL                                                         |                  ❌                  |                     ❌                     |
| [**SSL with client auth (mTLS)**](#ssl-with-client-authentication-mtls) |                                     |                                           |
| &nbsp;&nbsp;SSL                                                         |                  ❌                  |                     ✅                     |
| [**SASL**](#sasl-authentication)                                        |                                     |                                           |
| &nbsp;&nbsp;SASL_PLAINTEXT                                              |                  ✅                  |            only if `OAUTHBEARER`            |
| &nbsp;&nbsp;SASL_SSL                                                    |                  ✅                  |            only if `OAUTHBEARER`            |
| [**Delegated SASL**](#delegated-sasl-authentication)                    |                                     |                                           |
| &nbsp;&nbsp;DELEGATED_SASL_PLAINTEXT                                    |                  ❌                  |                     ✅                     |
| &nbsp;&nbsp;DELEGATED_SASL_SSL                                          |                  ❌                  |                     ✅                     |

#### Anonymous authentication

##### PLAINTEXT

In the case of PLAINTEXT authentication, the client is anonymous and doesn't need any credentials. This means that authentication can't take place and so **local and external service accounts are not supported in this mode**.

[How to configure the client > Gateway connection with PLAINTEXT.](/gateway/configuration/client-authentication/#plaintext)

##### SSL (encryption only)

If you use SSL for encryption only, Gateway presents a keystore certificate trusted by the client’s truststore, without authenticating the client. Therefore, **local and external service accounts are not supported in this mode**.

[How to configure the client > Gateway connection with SSL.](/gateway/configuration/client-authentication/#ssl)

#### SSL with client authentication (mTLS)

With mutual TLS (mTLS) authentication, both Kafka clients and Gateway validate each other’s identities using TLS certificates, ensuring secure and trusted bidirectional communication. This means that both the client and Gateway authenticate one another through their respective certificates.

As a result, Gateway extracts the user identity from the TLS certificate, which can be mapped to an external Service Account in Gateway.

:::note
The username will be in this format: `CN=writeuser,OU=Unknown,O=Unknown,L=Unknown,ST=Unknown,C=Unknown`. You can change it by setting the `GATEWAY_SSL_PRINCIPAL_MAPPING_RULES` environment variable to a custom rule. By default, it extracts the certificate distinguished name.

For instance: `GATEWAY_SSL_PRINCIPAL_MAPPING_RULES=RULE:^CN=([a-zA-Z0-9.-]*).*$$/$$1/ , DEFAULT` will extract the CN part of the certificate.
:::

[How to configure the client > Gateway connection with SSL mTLS.](/gateway/configuration/client-authentication/#mutual-tls-mtls)

#### SASL authentication

With SASL authentication using OAUTHBEARER, clients authenticate with an identity (the `sub` in the OIDC JWT token) which can be mapped to an external Service Account in Gateway.

:::note
If you have configured OAUTHBEARER, Gateway expects the client to provide a JWT token, and the grant type should be `clientcredentials`.
:::

See [how to manage Gateway Service Accounts using SASL_PLAINTEXT.](/gateway/how-to/manage-service-accounts-and-acls/)

It's the same for both SASL_PLAINTEXT and SASL_SSL. The only difference is that SASL_SSL encrypts the communication, while SASL_PLAINTEXT transmits in plain text.

[How to configure the client > Gateway connection with SASL.](/gateway/configuration/client-authentication/#sasl_plaintext)

:::warning[Choose a delegated or non-delegated mode]
With Conduktor Gateway, you can pick **where you'd like the client authentication and authorization to be made**. You can either:

- use [delegated SASL authentication](#delegated-sasl-authentication) - Gateway forwards the client credentials to the Kafka cluster to authenticate them and retrieve their ACLs or

- handle this with Gateway using the supported [client authentication methods](#client-authentication-methods) - Gateway authenticates the clients and manages their ACLs.

:::

#### Delegated SASL authentication

In some cases, you might want to delegate the authentication to the backing Kafka cluster. For example, if you want to gradually transition to using the Conduktor Gateway, but first want to continue using the ACLs and Service Accounts defined in your Kafka cluster.

In this case, Gateway can forward the client credentials to the backing Kafka cluster, and the Kafka cluster will authenticate the client for Gateway.

:::info[Supported mechanisms]
Currently, delegated SASL authentication only supports PLAIN, SCRAM, OAUTHBEARER and AWS_MSK_IAM mechanisms. [Get in touch](https://support.conduktor.io/hc/en-gb/requests/new?ticket_form_id=17438365654417) for specific requirements.
:::

In this mode, the clients authorization (ACLs) is also handled by the backing Kafka cluster. **Any calls to the Kafka ACLs API made on Gateway will be forwarded to the backing Kafka cluster**.

As a result, local service accounts are not available on Gateway but thr external ones **are available** and can be mapped to the client principal. This way Gateway will apply its interceptors on this external service account with a user-friendly name.

:::info[Virtual resource limitation]
 [Virtual clusters](/guide/cpnduktor-concepts/virtual-clusters), [alias topics](/guide/conduktor-concepts/topics) and [concentrated topics](/guide/conduktor-concepts/topics/#concentrated-topics) are not available in the Delegated SASL mode.
:::

[How to configure the client > Gateway connection with DELEGATED_SASL.](/gateway/configuration/client-authentication/#delegated_sasl_plaintext)

### Authorization management (ACLs)

#### In delegated mode

Authorization (ACLs) is handled by the backing Kafka cluster. Any calls to the Kafka ACLs API made on Gateway will be forwarded to the backing Kafka cluster.

#### In non-delegated mode

Authorization (ACLs) is managed by Gateway, so you have to define the ACLs for your applications in Gateway. This is done using the Kafka ACLs commands or the Conduktor Console UI.

The principal attached to the ACLs can either be the local or the external service account name.

If the client connects to Gateway using OAUTHBEARER, but no external Service Account is defined, the `sub` of the JWT client token will be used as the principal.

## Related resources

- [Gateway service accounts](/guide/conduktor-concepts/gw-service-accounts)
- [Manage service accounts and ACLs using Console](/guide/manage-kafka/kafka-resources/service-accounts-acls)
- [Give us feedback/request a feature](https://conduktor.io/roadmap)
