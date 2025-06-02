---
date: 2025-06-17
title: Gateway 3.10.0
description: docker pull conduktor/conduktor-gateway:3.10.0
solutions: gateway
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
- [New features](#new-features)
- [Fixes](#fixes)

### Breaking changes

### New features

#### `GATEWAY_SECURITY_MODE` environment variable

This release introduces the `GATEWAY_SECURITY_MODE` environment variable,
which simplifies the configuration process by splitting out **what** manages authentication/authorization (valid values: `KAFKA_MANAGED` or `GATEWAY_MANAGED`) from **how** it should be managed (still set in the `GATEWAY_SECURITY_PROTOCOL` environment variable).

This is a non-breaking change, still supporting existing configurations whilst encouraging a new approach.

This change also allows for the deprecation of the `ACL_ENABLED` environment variable. Whilst we still support it, we strongly encourage users to use the `GATEWAY_SECURITY_MODE` environment variable.

Please see [How to: Migration Guide to Security Mode](../../../docs/gateway/how-to/migration-guide-to-security-mode.md) for more details.

### Fixes
