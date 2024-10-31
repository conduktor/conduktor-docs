---
date: 2024-02-14
title: Disabling security on Prometheus metrics 
description: docker pull conduktor/conduktor-gateway:2.6.1
solutions: gateway
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

## General fixes 🔨

* `GATEWAY_SECURED_METRICS`=`false` would not allow to access the prometheus metrics without security. This is now fixed.
