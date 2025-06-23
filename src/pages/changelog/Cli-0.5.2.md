---
date: 2025-06-23
title: Conduktor CLI
description: docker pull conduktor/conduktor-cli:0.5.2
solutions: cli
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Changes
- Added a --parallelism flag to the apply command, allowing users to control the maximum number of concurrent resource apply operations.
- The flag accepts integer values between 1 and 100. If a value outside this range is provided, the command will print an error and exit.

[Find out more](https://github.com/conduktor/ctl/releases/tag/v0.5.2).