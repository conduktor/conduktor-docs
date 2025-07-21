---
date: 2025-07-21
title: Console 1.36.1
description: docker pull conduktor/conduktor-console:1.36.1
solutions: console
tags: fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Fixes

- Fixed an issue where Policies without labels were not properly displayed in the Application Catalog in Console
- Fixed an issue where the default produce header used a problematic naming format (app.name) that could cause compatibility issues with certain connectors