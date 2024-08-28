---
date: 2024-08-28
title: Hotfix for Gateway 3.2.2
description: docker pull conduktor/conduktor-gateway:3.2.2
solutions: gateway
tags: fix
---

## Upcoming Breaking change 💣
:::info
This breaking change only impacts Local Gateway service accounts generated through our token endpoints:
- `POST /admin/username/{username}`
- `POST /admin/vclusters/v1/vcluster/{vcluster}/username/{username}`

If you are not using Local Gateway services accounts (OIDC, mTLS, Delegated Kafka), you are **not** impacted.
:::
Today, the token as the password for local Gateway service accounts contains all the necessary information. As a result, the SASL username is not used during the authentication phase.
![SASL Login](/images/changelog/gateway/v3.2.2/sasl-login.png)
In an **upcoming** release, we will strictly enforce that the username and the token matches. This will help reduce inconsistencies and avoid unexpected behaviors.

This breaking change is due for release 3.5.0.   
For this hotfix release 3.2.2, and next product releases 3.3.x and 3.4.x, we'll only raise the following warning in the logs:  
````
2024-08-27T18:15:29 [WARN] - Inconsistency detected for plain authentication. Username applicationA is not consistent with validated token created for application-A. SASL configuration should be changed accordingly.
````

## General fixes 🔨

- Fixed a **severe** authentication issue with Gateway generated tokens that could lead to a different user being authenticated, effectively causing elevated privileges under certain conditions.
- Fixed an issue where `GATEWAY_SNI_HOST_SEPARATOR` couldn't be set to the value `-`
- Fixed an issue where `GATEWAY_SNI_HOST_SEPARATOR` wasn't properly taken in account
- Fixed an issue with `GATEWAY_ADVERTISED_SNI_PORT` that wasn't working properly
