---
date: 2024-09-25
title: Hotfix for Gateway 3.3.1
description: docker pull conduktor/conduktor-gateway:3.3.1
solutions: gateway
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

## General fixes 🔨

- Fixed an issue where Gateway would close the client connection upon receiving certain API Keys in parallel of the initial Metadata Request