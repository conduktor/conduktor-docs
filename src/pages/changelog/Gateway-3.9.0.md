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
  - [Enhanced Confluent Cloud authentication with Service Account mapping](#enhanced-confluent-cloud-authentication-with-service-account-mapping) 

### Breaking changes

### New features

#### Enhanced Confluent Cloud authentication with Service Account mapping

When using Confluent Cloud authentication with delegated authentication, Gateway now supports automatically resolving API keys to their associated Service Account. This feature addresses key limitations of the previous approach:

- **Improved interceptor targeting**: Interceptors can now target Service Accounts directly
- **Enhanced chargeback capabilities**: Usage tracking by Service Account instead of API Key
- **Elimination of manual mappings**: Removes the need for administrators to maintain user mappings

This feature is disabled by default to maintain compatibility with existing deployments. To enable it, add the following configuration:

```yaml
authenticationConfig:
  principalResolver: CONFLUENT
  confluentCloud:
    apiKey: ${GATEWAY_CONFLUENT_CLOUD_API_KEY}
    apiSecret: ${GATEWAY_CONFLUENT_CLOUD_API_SECRET}
    cacheConfig:
      maxSize: ${GATEWAY_CONFLUENT_CLOUD_CACHE_SIZE|1000}
      ttlMs: ${GATEWAY_CONFLUENT_CLOUD_CACHE_EXPIRY_MS|86400000} # 1 day
```

or set these environment variables:

```env
GATEWAY_PRINCIPAL_RESOLVER=CONFLUENT
GATEWAY_CONFLUENT_CLOUD_API_KEY=...
GATEWAY_CONFLUENT_CLOUD_API_SECRET=...
GATEWAY_CONFLUENT_CLOUD_CACHE_SIZE=1000 # default
GATEWAY_CONFLUENT_CLOUD_CACHE_EXPIRY_MS=86400000 # 1 day default
```

When enabled, Gateway will automatically resolve API keys (like `XIGMNERQXOUKXDQU`) to their associated Service Accounts (like `sa-72839j`).