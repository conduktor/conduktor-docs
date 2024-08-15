---
date: 2024-04-15
title: Hotfix for Gateway 3.0.1
description: docker pull conduktor/conduktor-gateway:3.0.1
solutions: gateway
tags: fix
---

Submit your feedback to us via our [public roadmap](https://product.conduktor.help/?utm_source=changelog&utm_medium=webpage&utm_campaign=).

Visit our [Get Started docs](https://docs.conduktor.io/gateway/?utm_source=changelog&utm_medium=webpage&utm_campaign=) page to learn more and how to try our latest version of Conduktor or [chat with the team](https://www.conduktor.io/contact/sales/?utm_source=changelog&utm_medium=webpage&utm_campaign=data_quality_24).

`docker pull conduktor/conduktor-gateway:3.0.1`  

## General fixes 🔨

- Fixed some issues with Encryption when the value is a tombstone.
- Fixed some inconsistencies between the OpenAPI Spec and the actual implementation.
- Fixed a memory leak when using the default `GATEWAY_UPSTREAM_CONNECTION_POOL_TYPE`.
- Added a startup check to prevent an incompatible configuration: `GATEWAY_UPSTREAM_CONNECTION_POOL_TYPE=ROUND_ROBIN` with delegated authentication.


