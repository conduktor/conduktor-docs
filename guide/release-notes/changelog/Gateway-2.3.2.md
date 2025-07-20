---
date: 2024-01-11
title: ACL fixes for GATEWAY_SECURITY mode
description: docker pull conduktor/conduktor-gateway:2.3.2
solutions: gateway
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### General fixes 🔨

- ACL would not be applied in `GATEWAY_SECURITY` mode.
