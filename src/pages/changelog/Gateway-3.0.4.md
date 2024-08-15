---
date: 2024-05-22
title: Hotfix for Gateway 3.0.4
description: docker pull conduktor/conduktor-gateway:3.0.4
solutions: gateway
tags: fix
---

Submit your feedback to us via our [public roadmap](https://product.conduktor.help/?utm_source=changelog&utm_medium=webpage&utm_campaign=).

Visit our [Get Started docs](https://docs.conduktor.io/gateway/?utm_source=changelog&utm_medium=webpage&utm_campaign=) page to learn more and how to try our latest version of Conduktor or [chat with the team](https://www.conduktor.io/contact/sales/?utm_source=changelog&utm_medium=webpage&utm_campaign=data_quality_24).

`docker pull conduktor/conduktor-gateway:3.0.4`  

## Performance improvements 🚀

- Consumer group membership is no longer loaded synchronously
- Optimize hostname resolution for ACL

## General fixes 🔨

- `GATEWAY_DOWNSTREAM_THREAD` and `GATEWAY_UPSTREAM_THREAD` are now correctly gathering the number of cores
- in `LargeMessageHandlingPlugin` plugin, honor correctly the `localCacheExpireAfterWriteInSeconds` property
