---
date: 2024-04-15
title: Hotfix for Gateway 3.0.1
description: docker pull conduktor/conduktor-gateway:3.0.1
solutions: gateway
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

## General fixes 🔨

- Fixed some issues with Encryption when the value is a tombstone.
- Fixed some inconsistencies between the OpenAPI Spec and the actual implementation.
- Fixed a memory leak when using the default `GATEWAY_UPSTREAM_CONNECTION_POOL_TYPE`.
- Added a startup check to prevent an incompatible configuration: `GATEWAY_UPSTREAM_CONNECTION_POOL_TYPE=ROUND_ROBIN` with delegated authentication.


