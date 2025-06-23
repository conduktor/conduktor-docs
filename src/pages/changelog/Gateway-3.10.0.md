---
date: 2025-06-18
title: Gateway 3.10.0
description: docker pull conduktor/conduktor-gateway:3.10.0
solutions: gateway
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
- [New features](#new-features)
  - [`GATEWAY_SECURITY_MODE` environment variable](#gateway_security_mode-environment-variable)

### Breaking changes

### New features

#### `GATEWAY_SECURITY_MODE` environment variable

This release introduces the `GATEWAY_SECURITY_MODE` environment variable,
which simplifies the security configuration by splitting out **what** manages authentication/authorization (valid values: `KAFKA_MANAGED` or `GATEWAY_MANAGED`) from **how** it should be managed (still set in the `GATEWAY_SECURITY_PROTOCOL` environment variable).

This change:

- Deprecates the `DELEGATED_SASL_PLAINTEXT` and `DELEGATED_SASL_SSL` security protocols (though they remain supported for backward compatibility)
- Enables ACLs by default when managing security on the Gateway, by changing the default behaviour of the `GATEWAY_ACL_ENABLED` environment variable. ACL behavior is now derived from the security mode
- Is backwards compatible, supporting existing configurations while encouraging the new approach

Please see [How to: Migration Guide to Security Mode](/gateway/how-to/migration-guide-to-security-mode) for full guidance on how to adopt the new security configuration.
