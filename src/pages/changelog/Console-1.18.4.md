---
date: 2023-10-18
title: Bug fixes for Console
description: Conduktor version 1.18.4 brings performance improvements on large Kafka Clusters.
solutions: console
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Fixes 🔨

- Fixed an issue that prevented Console to function properly with PgBouncer
- Fixed an issue where properties (`default.api.timeout.ms` & `request.timeout.ms`) were mistakenly overridden, leading to possible timeouts on large Kafka Clusters
- (1.18.3) Fixed a performance issue on the Topic List page, leading to possible timeouts on large Kafka Clusters