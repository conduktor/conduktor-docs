---
date: 2024-07-31
title: Hotfix for Gateway 3.2.1
description: docker pull conduktor/conduktor-gateway:3.2.1
solutions: gateway
tags: fix
---

## General fixes 🔨

- Fixed an issue when either `GATEWAY_ACL_ENABLED` or `GATEWAY_ACL_STORE_ENABLED` was enabled resulting in ACLs being enforced in undesirable scenarios.