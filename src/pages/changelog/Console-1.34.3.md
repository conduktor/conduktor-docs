---
date: 2025-06-03
title: Console 1.34.3
description: docker pull conduktor/conduktor-console:1.34.3
solutions: console
tags: fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Fixes

- Improved support of Kafka Connect from Confluent Cloud (more connector statuses supported, better error messages, fixed list of topics).
- Improved caching strategy of the RBAC model resulting in faster UI and API.
- Fixed dependencies vulnerable to [CVE-2025-48734](https://nvd.nist.gov/vuln/detail/CVE-2025-48734)
