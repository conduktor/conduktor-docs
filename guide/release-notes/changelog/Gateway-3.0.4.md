---
date: 2024-05-22
title: Hotfix for Gateway 3.0.4
description: docker pull conduktor/conduktor-gateway:3.0.4
solutions: gateway
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Performance improvements 🚀

- Consumer group membership is no longer loaded synchronously
- Optimize hostname resolution for ACL

### General fixes 🔨

- `GATEWAY_DOWNSTREAM_THREAD` and `GATEWAY_UPSTREAM_THREAD` are now correctly gathering the number of cores
- in `LargeMessageHandlingPlugin` plugin, honor correctly the `localCacheExpireAfterWriteInSeconds` property
