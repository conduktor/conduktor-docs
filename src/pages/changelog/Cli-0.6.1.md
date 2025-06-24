---
date: 2025-06-24
title: Conduktor CLI
description: docker pull conduktor/conduktor-ctl:v0.6.1
solutions: cli
tags: fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Fixes

- Fixed an intermittent failure on some apply runs where kind ordering would not be respected. In some scenarios the parent resource is not made before the child (e.g.  ApplicationInstances being created before Applications) and the run would fail, this could be fixed by attempting a retry.
- Fixed an issue where failed runs would not return an exit code, leading to silent failures in CI actions.

[Find out more](https://github.com/conduktor/ctl/releases/tag/v0.6.1).
