---
date: 2023-09-26
title: Bug fixes for Console
description: Conduktor version 1.18.1 introduces fixes related to authentication and indexing.
solutions: console
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Fixes 🔨

- Increased timeout from 30s to 5m when indexing snapshots (used for caching list pages) of Kafka clusters
- Fixed a DB issue that prevented authentication to succeed when the generated token was longer than 255 characters
- Fixed an issue with cortex (`conduktor/conduktor-platform-cortex`) when console (`conduktor/conduktor-platform`) is configured with HTTPS
- Fixed an issue where LDAP users could not see or configure Alerts under certain circumstances