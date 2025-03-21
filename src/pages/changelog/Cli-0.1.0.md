---
date: 2024-03-26
title: Conduktor CLI
description: docker pull conduktor/conduktor-cli:0.1.0
solutions: cli
tags: features
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

[Conduktor CLI](/platform/reference/cli-reference/) allows you to perform operations directly from your command line or a CI/CD pipeline to a Conduktor Console instance.

### Features
- Support for `get`, `apply` (upsert) and `delete` commands for the following Conduktor Console resources:
    - Application
    - ApplicationInstance
    - ApplicationInstancePermission
 - Support for `--dry-run` on `apply` and `delete`
- Support `completion` that generates the autocompletion script for the specified shell
- Support for proxy auth using certificate and key
- Support `ignore` untrusted certificates environment variable
- Configurable environment variables