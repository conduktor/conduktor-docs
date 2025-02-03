---
date: 2025-02-XX
title: Hotfix for Gateway 3.6.0
description: docker pull conduktor/conduktor-gateway:3.6.0
solutions: gateway
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Features ✨

#### Multiple Kafka Cluster Connections

TBD

#### Encryption Improvements
* Improvement: Encryption mustache templates
* Improvement: Encryption Hard Failure Mode 
* Improvement: Encryption add namespace support for vault KMS

### Fixes 🔨

* Improvement: Read only schema registry access
* Improvement: CreateTopicPolicy override applications
* Improvement: Remove log spamming, and updated some logging to be clearer on the issue logged
* Improvement: DataQualityPolicy validate schema registry access

