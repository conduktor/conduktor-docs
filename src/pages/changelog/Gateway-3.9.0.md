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
  - [Gateway JWT signing key must always be set](#gateway-jwt-signing-key-must-always-be-set)
- [New features](#new-features)
  - [Enhanced Confluent Cloud authentication with Service Account mapping](#enhanced-confluent-cloud-authentication-with-service-account-mapping)
  - [Dynamic Header Injection from Record Values](#dynamic-header-injection-from-record-values)
- [Fixes](#fixes)
  - [HashiCorp Vault token refresh resilience](#hashicorp-vault-token-refresh-resilience)

### Breaking changes

#### Gateway service accounts are now always required, when using PLAIN tokens

Previously, PLAIN tokens could be issued to connect to Gateway without having to create the service account they are linked to. This could be configured to require that the service account exists using the environment variable `GATEWAY_USER_POOL_SERVICE_ACCOUNT_REQUIRED`.

This **environment variable is now deprecated** and will behave as if it was set to `true`, meaning all tokens must have their service account already created on Gateway before they're allowed to connect.

If your Gateway was not configured with `GATEWAY_USER_POOL_SERVICE_ACCOUNT_REQUIRED` set to `true`, and your clients are connecting using tokens without a local service account created, the result is a breaking change. We expect most customers to be unaffected as this setup is actively discouraged in the onboarding experience, we recommend creating the service account before creating tokens. Customers using a DELEGATED security protocol are unaffected.

If you do hit this issue, it can be amended by creating any missing local service accounts with a similar command to the below, adjusting your admin API credentials, host and name:

```bash
curl -X PUT -u admin:conduktor http://localhost:8888/gateway/v2/service-account \
        -H 'accept: application/json' \
        -d '{"kind": "GatewayServiceAccount", "apiVersion": "gateway/v2", "metadata": { "name": "admin", "vCluster": "passthrough"  }, "spec": { "type": "LOCAL" }}' 
```

[Find out about creating service accounts and ACLs](/gateway/how-to/manage-service-accounts-and-acls/).

#### Gateway JWT signing key must always be set, when using PLAIN tokens

Previously PLAIN tokens could be issued using the default signing key, or users could define the signing key using the environment variables `GATEWAY_USER_POOL_SECRET_KEY`. This is now **required that users define the signing key** with this variable. A default value has been removed, and Gateway won't start if configured to use local service accounts. Customers using a DELEGATED security protocol are unaffected. You'll receive an error message in the logs:

```text
"Invalid value at 'userPoolConfig.jwt.secretKey. Should not be null.
 Have you checked environment variable GATEWAY_USER_POOL_SECRET_KEY is set?"
```

In this scenario, you will have to recreate and re-issue your Gateway tokens. For more documentation on managing service account users, see [docs](/gateway/how-to/manage-service-accounts-and-acls/#manage-a-local-service-account).

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
