---
date: 2025-02-17
title: Hotfix for Console 1.31.0
description: docker pull conduktor/conduktor-console:1.31.1
solutions: console
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Fixes
- Fix for dependencies vulnerable to [CVE-2024-57699](https://nvd.nist.gov/vuln/detail/CVE-2024-57699)
- Resolved an issue related to SSL checks between the Console and Cortex where bad certificates caused communication issues
- Fixed an issue with user email addresses containing a `'` character that blocked database migrations
- Reduced the memory consumption and improved performance of metrics under heave load that prevented them from displaying
