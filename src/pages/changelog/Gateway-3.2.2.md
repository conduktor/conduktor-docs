---
date: 2024-08-28
title: Hotfix for Gateway 3.2.2
description: docker pull conduktor/conduktor-gateway:3.2.2
solutions: gateway
tags: fix
---

## Breaking change 💣
:::caution Warning
This breaking change only impacts local Gateway users generated through our token endpoints:
- `/admin/username/{username}`
- `/admin/vclusters/v1/vcluster/{vcluster}/username/{username}`

All other users (OIDC, mTLS, Delegated Kafka) are not impacted.
:::

Up until now, only the password was used during authentication and the username was not used.
![SASL Login](/images/changelog/gateway/v3.2.2/sasl-login.png)

We have changed this behavior to enforce consistency between the username in the username fi

## General fixes 🔨

- Fixed an issue where `GATEWAY_SNI_HOST_SEPARATOR` couldn't be set to the value `-`
- Fixed an issue where `GATEWAY_SNI_HOST_SEPARATOR` wasn't properly taken in account
- Fixed an issue with `GATEWAY_ADVERTISED_SNI_PORT` that wasn't working properly
- Fixed an authentication issue with Gateway generated tokens that could lead to a different user being authenticated as a result