---
date: 2025-06-24
title: Conduktor CLI
description: docker pull conduktor/conduktor-ctl:v0.6.1
solutions: cli
tags: fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Fixes

- Addresses a minor regression in error handling from v0.6.0 for resource applies: The CLI now correctly exits with a non-zero status code if any resource apply operation fails. This ensures that automation and CI/CD pipelines can reliably detect failures.

[Find out more](https://github.com/conduktor/ctl/releases/tag/v0.6.1).
