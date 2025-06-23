---
date: 2025-06-18
title: Gateway 3.10.0
description: docker pull conduktor/conduktor-gateway:3.10.0
solutions: gateway
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

## New features

### The new `GATEWAY_SECURITY_MODE` environment variable

This release introduces the `GATEWAY_SECURITY_MODE` environment variable which simplifies the security configuration by splitting out **what** manages authentication/authorization (valid values: `KAFKA_MANAGED` or `GATEWAY_MANAGED`) from **how** it should be managed (still set in the `GATEWAY_SECURITY_PROTOCOL` environment variable).

This change:

- deprecates the `DELEGATED_SASL_PLAINTEXT` and `DELEGATED_SASL_SSL` security protocols (though they remain supported for backward compatibility)
- enables ACLs by default, when managing security on Gateway by changing the default behavior of the `GATEWAY_ACL_ENABLED` environment variable. ACL behavior is now derived from the new security mode.
- is backwards compatible, supporting existing configurations. We strongly recommend adopting this new approach. [Find out how to adopt to the new Gateway security configuration](/gateway/how-to/migration-guide-to-security-mode).
