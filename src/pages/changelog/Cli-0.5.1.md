---
date: 2025-05-14
title: Conduktor CLI
description: docker pull conduktor/conduktor-ctl:v0.5.1
solutions: cli
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Changes
- The -o flags are now visible at the get root command level, making output options more discoverable.

### Fixes
- Fixed an issue where alerts could not be deleted via the CLI when using the metadata group.
[Find out more](https://github.com/conduktor/ctl/releases/tag/v0.5.1).