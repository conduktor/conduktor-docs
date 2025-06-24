---
date: 2025-06-23
title: Conduktor CLI
description: docker pull conduktor/conduktor-ctl:v0.6.0
solutions: cli
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Changes

*Note this release introduced a couple of bugs that were fixed in `v0.6.1`, please use this instead of `v0.6.0` where possible.*

- Significant performance improvements when applying a large number of resources. Control the maximum number of concurrent resource `apply` operations with the `--parallelism` flag.
  - The flag accepts integer values between 1 and 100. If a value outside this range is provided, the command will print an error and exit.

[Find out more](https://github.com/conduktor/ctl/releases/tag/v0.6.0).
