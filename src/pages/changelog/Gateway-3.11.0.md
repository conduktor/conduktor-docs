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
- **Environment variable control**: New `GATEWAY_AUTO_CREATE_TOPICS_ENABLED` environment variable (default: `false`) to enable/disable the feature
- **Kafka property integration**: Leverages the Kafka property `auto.create.topics.enable` when the feature is enabled
- **Concentrated topics limitation**: When auto-create topics is enabled, topics that would normally be concentrated will be created as physical topics instead
- **ACL authorization**: Implements proper access control for auto-create topics:
  - **Permission requirements**: Requires either `CREATE` permission on the topic or `CREATE` permission on the cluster
  - **Security**: Ensures proper access control while maintaining flexibility for different permission models

[Find out more about environment variables](/gateway/configuration/env-variables#connect-from-clients-to-gateway) and [auto-create topics authorization](/gateway/how-to/manage-service-accounts-and-acls#auto-create-topics-authorization). 