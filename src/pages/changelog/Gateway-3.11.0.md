---
date: 2025-07-16
title: Gateway 3.11.0
description: docker pull conduktor/conduktor-gateway:3.11.0
solutions: gateway
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
- [New features](#new-features)
  -  [Auto-Create Topics Feature](#auto-create-topics-feature)

### Breaking changes

### New features

#### Auto-Create Topics Feature

- **New auto-create topics configuration**: Added support for automatically creating topics when producing or consuming through the Gateway
- **Environment variable control**: New `GATEWAY_AUTO_CREATE_TOPICS_ENABLE` environment variable (default: `false`) to enable/disable the feature
- **Kafka property integration**: Leverages the Kafka property `auto.create.topics.enable` when the feature is enabled
- **Concentrated topics limitation**: When auto-create topics is enabled, topics that would normally be concentrated will be created as physical topics instead