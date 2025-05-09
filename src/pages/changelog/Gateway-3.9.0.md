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

### New features

### Fixes

#### HashiCorp Vault token refresh resilience

Fixed a problem where Gateway would stop scheduling HashiCorp Vault token refreshes after encountering an error during
the refresh process. Previously, if Gateway attempted to refresh its Vault token during a Vault outage, it would fail to
recover even after Vault became available again, requiring a Gateway restart.

With this fix, Gateway will now:

- Continue scheduling token refreshes on the regular interval
- Automatically recover once Vault becomes available again
