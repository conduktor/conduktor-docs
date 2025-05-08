---
date: 2025-05-08
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
- [Fixes](#fixes)
  - [HashiCorp Vault token refresh resilience](#hashicorp-vault-token-refresh-resilience)

### Breaking changes

#### Gateway Service Accounts are now always required when using PLAIN tokens

Previously, PLAIN tokens could be issued to connect to Gateway without having to create the service account they are linked to.
This could be configured to require the service account exists using an environment variable `GATEWAY_USER_POOL_SERVICE_ACCOUNT_REQUIRED`. This **environment variable is now deprecated** and will behave as if this was set to `true`, meaning all tokens must have their service account already created on Gateway before they're allowed to connect.

If your Gateway was not configured with `GATEWAY_USER_POOL_SERVICE_ACCOUNT_REQUIRED` set to `true`, and your clients are connecting using tokens without a service account created, the result is a breaking change. As part of our onboarding experience this is not the recommended setup, we recommend creating the service account before creating tokens, so we expect customers to be mostly unaffected.

To amend this, create any missing local service accounts. We can achieve this like below, adjusting your admin API credentials, host and name:

```bash
curl -X PUT -u admin:conduktor http://localhost:8888/gateway/v2/service-account \
        -H 'accept: application/json' \
        -d '{"kind": "GatewayServiceAccount", "apiVersion": "gateway/v2", "metadata": { "name": "admin", "vCluster": "passthrough"  }, "spec": { "type": "LOCAL" }}' 
```

For more information on creating service accounts checkout the guide [Manage Service Accounts & ACLs](/gateway/how-to/manage-service-accounts-and-acls/).

#### Gateway JWT signing key must always be set

Previous PLAIN tokens could be issued using the default signing key, or users could define the signing key using the environment variables `GATEWAY_USER_POOL_SECRET_KEY`. This is now a **required variable**, a default value is not provided for signing tokens and Gateway won't start. You'll receive an error message in the logs:

```text
""userPoolConfig.jwt Should not be null.
 Have you checked environment variable GATEWAY_USER_POOL_SECRET_KEY is set?"
```

In this scenario, you will have to recreate and re-issue your Gateway tokens. For more documentation on managing service account users, see [docs](/gateway/how-to/manage-service-accounts-and-acls/#manage-a-local-service-account).

### New features

### Fixes

#### HashiCorp Vault token refresh resilience

Fixed a problem where Gateway would stop scheduling HashiCorp Vault token refreshes after encountering an error during
the refresh process. Previously, if Gateway attempted to refresh its Vault token during a Vault outage, it would fail to
recover even after Vault became available again, requiring a Gateway restart.

With this fix, Gateway will now:

- Continue scheduling token refreshes on the regular interval
- Automatically recover once Vault becomes available again
