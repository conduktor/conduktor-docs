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

[Find out more about Gateway Principal Resolver for Confluent Cloud](https://docs.conduktor.io/gateway/interceptors/authentication/client-authentication/#principal-resolver)