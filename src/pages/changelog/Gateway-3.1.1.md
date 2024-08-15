---
date: 2024-06-20
title: Hotfix for Gateway 3.1.1
description: docker pull conduktor/conduktor-gateway:3.1.1
solutions: gateway
tags: fix
---

Submit your feedback to us via our [public roadmap](https://product.conduktor.help/?utm_source=changelog&utm_medium=webpage&utm_campaign=).

Visit our [Get Started docs](https://docs.conduktor.io/gateway/?utm_source=changelog&utm_medium=webpage&utm_campaign=) page to learn more and how to try our latest version of Conduktor or [chat with the team](https://www.conduktor.io/contact/sales/?utm_source=changelog&utm_medium=webpage&utm_campaign=data_quality_24).

`docker pull conduktor/conduktor-gateway:3.1.1`  

## General fixes 🔨

- Performance is improved when using a large number of interceptors (backported in 3.0.5)
- Pre-create folders when using RocksDB as a cache backend
- Moved the Schema Id to the headers when using field level encryption with Avro

