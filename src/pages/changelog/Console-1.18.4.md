---
date: 2023-10-18
title: Bug fixes for Console
description: Conduktor version 1.18.4 brings performance improvements on large Kafka Clusters.
solutions: console
tags: fix
---

Submit your feedback via our [public roadmap](https://product.conduktor.help/).

Visit our [Get Started](https://www.conduktor.io/get-started/) page to test our latest version of Conduktor.

To receive updates on our future Releases, visit [Our Support Portal](https://support.conduktor.io/hc/en-gb/sections/16400521075217-Releases) and "Follow".

# Conduktor Console

## Fixes 🔨

- Fixed an issue that prevented Console to function properly with PgBouncer
- Fixed an issue where properties (`default.api.timeout.ms` & `request.timeout.ms`) were mistakenly overridden, leading to possible timeouts on large Kafka Clusters
- (1.18.3) Fixed a performance issue on the Topic List page, leading to possible timeouts on large Kafka Clusters