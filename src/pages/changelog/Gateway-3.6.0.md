---
date: 2025-02-07
title: Hotfix for Gateway 3.6.0
description: docker pull conduktor/conduktor-gateway:3.6.0
solutions: gateway
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Features ✨

#### Multiple Kafka Cluster Connections

TBD

#### Encryption Improvements
* Improvement: Encryption mustache templates
* Improvement: Encryption Hard Failure Mode 
* Improvement: Encryption add namespace support for vault KMS

### Quality of Life Improvements
- Added a new CLI command `conduktor run generateServiceAccountToken` to generate the JWT for Local service accounts. Update your CLI to version 0.3.5 or higher.

### Fixes 🔨

* Improvement: Read only schema registry access
* Improvement: CreateTopicPolicy override applications
* Improvement: Remove log spamming, and updated some logging to be clearer on the issue logged
* Improvement: DataQualityPolicy validate schema registry access

