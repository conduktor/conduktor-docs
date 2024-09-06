---
date: 2024-06-20
title: Hotfix for Gateway 3.1.1
description: docker pull conduktor/conduktor-gateway:3.1.1
solutions: gateway
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

## General fixes 🔨

- Performance is improved when using a large number of interceptors (backported in 3.0.5)
- Pre-create folders when using RocksDB as a cache backend
- Moved the Schema Id to the headers when using field level encryption with Avro

