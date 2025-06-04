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

This change:

- Deprecates the `DELEGATED_SASL_PLAINTEXT` and `DELEGATED_SASL_SSL` security protocols (though they remain supported for backward compatibility)
- Deprecates the `GATEWAY_ACL_ENABLED` environment variable, as ACL behavior is now derived from the security mode
- Is non-breaking, supporting existing configurations while encouraging the new approach

Please see [How to: Migration Guide to Security Mode](/gateway/how-to/migration-guide-to-security-mode) for more details.

### Fixes
