---
date: 2024-10-14
title: Conduktor SQL
description: docker pull conduktor/conduktor-console:1.28.0
solutions: console
tags: features,fix
---

- [Features ✨](#features-)
  - [Conduktor SQL](#conduktor-sql)
  - [Shareable Filters](#shareable-filters)
  - [Tags becomes Labels](#tags-becomes-labels)
  - [Audit Log events into Kafka](#audit-log-events-into-kafka)
  - [Quality of Life improvements](#quality-of-life-improvements)
- [Fixes 🔨](#fixes-)

## Features ✨

### Conduktor SQL

### Shareable Filters

### Tags becomes Labels

First topics, but we'll extend this to all resources.

### Audit Log events into Kafka

### Quality of Life improvements
- TODO

## Fixes 🔨
- CONS-1776 Fixed an issue with Topic Policy constraint Range where max value wasn't inclusive
- CONS-1774 Fixed an issue with the "New version" button in the banner that was still showing despite being on the latest version
- 


:::warning

We are aware of a critical CVE - [CVE-2024-41110](https://avd.aquasec.com/nvd/2024/cve-2024-41110/) - coming from a dependency of prometheus on the `console-cortex` image. This CVE is related to prometheus docker metric scraping, which is not used by Conduktor.

Regardless, as soon as the prometheus team fix this issue, it will be patched immediately by Conduktor.
:::