---
date: 2025-07-03
title: Console 1.35.2
description: docker pull conduktor/conduktor-console:1.35.2
solutions: console
tags: fixes
---

_Release date: {frontMatter.date.toISOString().slice(0, 10)}_

### Fixes

- Improved performance of a database migration to ensure completion within the startup probe time limit
- Fixed a database deadlock issue caused by the indexer
