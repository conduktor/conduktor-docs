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

This release introduces the `GATEWAY_SECURITY_MODE` environment variable, which allows you to set the security mode for Gateway. This aims to simplify the decision path around `DELEGATED_XXX` security protocols
by separating this configuration in two steps.

This is a non-breaking change, still supporting existing configurations whilst encouraging a new approach.

Please see [How to: Migration Guide to Security Mode](../../../docs/gateway/how-to/migration-guide-to-security-mode.md) for more details.

### Fixes
