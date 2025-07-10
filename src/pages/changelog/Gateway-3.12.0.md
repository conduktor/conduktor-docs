---
date: 2025-08-20
title: Gateway 3.12.0
description: docker pull conduktor/conduktor-gateway:3.12.0
solutions: gateway
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
- [New features](#new-features)

### Breaking changes

### New features

#### `GATEWAY_AUDIT_LOG_EVENT_TYPES` environment variable

This release introduces the `GATEWAY_AUDIT_LOG_EVENT_TYPES` environment variable, which controls the types of event types recorded in the audit log.
This provides flexibility to enable or disable specific event types, such as `CONNECTION`. The full list and explanation of the event types can be found in
the [Audit Log configuration documentation](/gateway/configuration/env-variables/#audit).