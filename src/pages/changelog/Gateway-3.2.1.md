---
date: 2024-07-31
title: Hotfix for Gateway 3.2.1
description: docker pull conduktor/conduktor-gateway:3.2.1
solutions: gateway
tags: fix
---

Submit your feedback to us via our [public roadmap](https://product.conduktor.help/?utm_source=changelog&utm_medium=webpage&utm_campaign=).

Visit our [Get Started docs](https://docs.conduktor.io/gateway/?utm_source=changelog&utm_medium=webpage&utm_campaign=) page to learn more and how to try our latest version of Conduktor or [chat with the team](https://www.conduktor.io/contact/sales/?utm_source=changelog&utm_medium=webpage&utm_campaign=).

`docker pull conduktor/conduktor-gateway:3.2.1`  

- [General Fixes 🔨](#general-fixes-🔨)


## General fixes 🔨

- Fixed an issue when either `GATEWAY_ACL_ENABLED` or `GATEWAY_ACL_STORE_ENABLED` was enabled resulting in ACLs being enforced in undesirable scenarios.