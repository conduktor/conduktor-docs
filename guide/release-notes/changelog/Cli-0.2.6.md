---
date: 2024-06-25
title: Conduktor CLI
description: docker pull conduktor/conduktor-cli:0.2.6
solutions: cli
tags: features
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Changes
- Started with v to solve issue with go package
- Use resource priority from default catalog if catalog doesn't have any
- Added resource priority
- Keep order from API response
- Updated offline kind