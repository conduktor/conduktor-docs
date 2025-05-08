---
date: 2025-05-08
title: Gateway 3.9.0
description: docker pull conduktor/conduktor-gateway:3.9.0
solutions: gateway
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
- [New features](#new-features)
- [Fixes](#fixes)
    - [HashiCorp Vault token refresh resilience](#hashicorp-vault-token-refresh-resilience)

### Breaking changes

#### Gateway Service Accounts are now always required when using PLAIN tokens

GATEWAY_USER_POOL_SERVICE_ACCOUNT_REQUIRED environment variable is deprecated
Previously, PLAIN tokens could be issued to connect to Gateway without having to create the service account they are for.
This could be optionally configured to be required using an environment variable `GATEWAY_USER_POOL_SERVICE_ACCOUNT_REQUIRED`. This environment variable is now deprecated and will behave as if this was set to `true`, meaning all tokens must have their service account already created on Gateway before they're allowed to connect.

If your Gateway was not configured with `GATEWAY_USER_POOL_SERVICE_ACCOUNT_REQUIRED` set to `true`, and your clients are connecting using tokens without a service account created, the result is a breaking change. As part of our onboarding experience this is not the recommended setup.

To amend this, create the local service account. We can achieve this like below, adjusting your admin API credentials, host, name:

```bash
curl -X PUT -u admin:conduktor http://localhost:8888/gateway/v2/service-account \
        -H 'accept: application/json' \
        -d '{"kind": "GatewayServiceAccount", "apiVersion": "gateway/v2", "metadata": { "name": "admin", "vCluster": "passthrough"  }, "spec": { "type": "LOCAL" }}' 
```

#### GATEWAY_USER_POOL_SECRET_KEY environment variable now mandatory

A default value for `GATEWAY_USER_POOL_SECRET_KEY` is no longer provided. It now must be set on Gateway creation.
When this value is notset, the Gateway will not start. You will be prompted with error message:

```text
"Should not be null. Have you checked environment variable GATEWAY_USER_POOL_SECRET_KEY is set?"
```

A breaking change of this feature, documented [here](GATEWAY_USER_POOL_SECRET_KEY environment variable now mandatory-2) is ... #TODO
In this scenario, you will have to recreate your Gateway users. For more documentation on managing service account users, see [docs](https://docs.conduktor.io/gateway/how-to/manage-service-accounts-and-acls/#manage-a-local-service-account)  

### New features

### Fixes

#### HashiCorp Vault token refresh resilience

Fixed a problem where Gateway would stop scheduling HashiCorp Vault token refreshes after encountering an error during
the refresh process. Previously, if Gateway attempted to refresh its Vault token during a Vault outage, it would fail to
recover even after Vault became available again, requiring a Gateway restart.

With this fix, Gateway will now:

- Continue scheduling token refreshes on the regular interval
- Automatically recover once Vault becomes available again
