---
date: 2024-08-28
title: Hotfix for Gateway 3.2.2
description: docker pull conduktor/conduktor-gateway:3.2.2
solutions: gateway
tags: fix
---

## General fixes 🔨

- Fixed an issue where `GATEWAY_SNI_HOST_SEPARATOR` couldn't be set to the value `-`
- Fixed an issue where `GATEWAY_SNI_HOST_SEPARATOR` wasn't properly taken in account
- Fixed an issue with `GATEWAY_ADVERTISED_SNI_PORT` that wasn't working properly
- Fixed an authentication issue with Gateway generated tokens that could lead to a different user being authenticated as a result