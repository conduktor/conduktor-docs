---
date: 2025-05-14
title: Gateway 3.9.0
description: docker pull conduktor/conduktor-gateway:3.9.0
solutions: gateway
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
  - [Gateway Service Accounts are now always required when using PLAIN tokens](#gateway-service-accounts-are-now-always-required-when-using-plain-tokens)
  - [Local service account token signing key is now mandatory](#local-service-account-token-signing-key-is-now-mandatory)
- [New features](#new-features)
  - [Enhanced Confluent Cloud authentication with Service Account mapping](#enhanced-confluent-cloud-authentication-with-service-account-mapping)
  - [Dynamic Header Injection from Record Values](#dynamic-header-injection-from-record-values)
- [Fixes](#fixes)
  - [HashiCorp Vault token refresh resilience](#hashicorp-vault-token-refresh-resilience)

### Breaking changes

#### Gateway service accounts are now always required, when using PLAIN tokens

Previously, PLAIN tokens could be issued to connect to Gateway without having to create the service account they are linked to. This could be configured to require that the service account exists using the environment variable `GATEWAY_USER_POOL_SERVICE_ACCOUNT_REQUIRED`.

##### You're impacted if 

- **your Gateway was not previously configured** with the environment variable `GATEWAY_USER_POOL_SERVICE_ACCOUNT_REQUIRED=true`
- and your clients are connecting using PLAIN tokens without having a corresponding local service account already created.

Note: **Customers using the DELEGATED security protocol are unaffected.**

##### Do I have to do anything?

- You must create any **missing local service accounts** that your tokens rely on. 
- You can do this using the following command, adjusting your admin API credentials, host and name as appropriate

```bash
curl -X PUT -u admin:conduktor http://localhost:8888/gateway/v2/service-account \
        -H 'accept: application/json' \
        -d '{"kind": "GatewayServiceAccount", "apiVersion": "gateway/v2", "metadata": { "name": "admin", "vCluster": "passthrough"  }, "spec": { "type": "LOCAL" }}' 
```

[Find out about creating service accounts and ACLs](/gateway/how-to/manage-service-accounts-and-acls/).

##### Why did we make this change?

We expect most customers to be unaffected as this setup is actively discouraged in the onboarding experience, we recommend creating the service account before creating tokens.

This change improves **security and consistency** by enforcing that all PLAIN tokens must correspond to a pre-existing local service account. While previously this was configurable via the `GATEWAY_USER_POOL_SERVICE_ACCOUNT_REQUIRED` environment variable, **this variable is now deprecated** and will behave as if it was set to `true`.

This enforces best practises that were previously only encouraged, meaning all tokens must have their service account already created on Gateway before they're allowed to connect.

#### Local service account token signing key is now mandatory

##### You're impacted if:

- your Gateway security protocol (for the client connection to Gateway) is `SASL_SSL` or `SASL_PLAINTEXT`
- you're using local service accounts, managed by Gateway
- and `GATEWAY_USER_POOL_SECRET_KEY` wasn't already set

##### Do I have to do anything?

- Yes. Set `GATEWAY_USER_POOL_SECRET_KEY`. We recommend using the following command line to generate the hash:

```
openssl rand -base64 32
```

##### Why did we make this change?

Previously, when we signed the tokens for the local service accounts, we used a key that's set to a default value. The issue with that is that anybody who knows that default value is able to create their own tokens and connect to Gateway, if you've not changed the key.

To prevent this, we now ask you to set the key and store it safely, so that nobody unauthorized could create identities. [Find out more about managing service accounts](/gateway/how-to/manage-service-accounts-and-acls/#manage-a-local-service-account).

### New features

#### Enhanced Confluent Cloud authentication with service account mapping

When using Confluent Cloud with delegated authentication, Gateway now supports automatically resolving
API keys to their associated service account. This feature addresses key limitations of the previous approach:

- **Improved Interceptor targeting**: Interceptors can now target service accounts directly
- **Enhanced Chargeback capabilities**: Usage tracking by service account instead of API key
- **Elimination of manual mappings**: Removes the need for administrators to maintain user mappings

[Find out more about Gateway principal resolver for Confluent Cloud](/gateway/configuration/client-authentication/#principal-resolver)

#### Dynamic header Injection from record payloads

The header injection Interceptor has been enhanced to support deriving header values directly from record payloads.

This powerful feature allows you to extract:

- the entire record key or value and inject it as a header
- specific fields from record keys or values and inject them as headers

You can now reference record fields using mustache syntax:

```json
{
  "config": {
    "topic": "topic.*",
    "headers": {
      "X-CLIENT_IP": "{{userIp}} testing",
      "X-USER-ID": "{{record.key.id}}",
      "X-USER-EMAIL": "{{record.value.email}}"
    },
    "overrideIfExists": true
  }
}
```

This feature supports:

- Extracting values from JSON, AVRO, PROTOBUF serialized records
- Accessing record fields using dot notation
- Referencing the entire key or value payload
- Using mustache syntax for dynamic header values

### Fixes

#### HashiCorp Vault token refresh resilience

Fixed a problem where Gateway would stop scheduling HashiCorp Vault token refreshes after encountering an error during
the refresh process. Previously, if Gateway attempted to refresh its Vault token during a Vault outage, it would fail to
recover even after Vault became available again, requiring a Gateway restart.

With this fix, Gateway will now:

- Continue scheduling token refreshes on the regular interval
- Automatically recover once Vault becomes available again
