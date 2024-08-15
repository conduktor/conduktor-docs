---
date: 2024-02-14
title: Disabling security on Prometheus metrics 
description: docker pull conduktor/conduktor-gateway:2.6.1
solutions: gateway
tags: fix
---

Submit your feedback to us via our [public roadmap](https://product.conduktor.help/?utm_source=changelog&utm_medium=webpage&utm_campaign=).

Visit our [Get Started docs](https://docs.conduktor.io/gateway/?utm_source=changelog&utm_medium=webpage&utm_campaign=) page to learn more and how to try our latest version of Conduktor or [chat with the team](https://www.conduktor.io/contact/sales/?utm_source=changelog&utm_medium=webpage&utm_campaign=data_quality_24).

`docker pull conduktor/conduktor-gateway:2.6.1`

## General fixes 🔨

* `GATEWAY_SECURED_METRICS`=`false` would not allow to access the prometheus metrics without security. This is now fixed.
