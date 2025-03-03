---
date: 2025-03-03
title: Hotfix for Console 1.31.2
description: docker pull conduktor/conduktor-console:1.31.2
solutions: console
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Fixes
- Fixed prefixed ACLs not displaying correctly in the Service Account UI
- Fixed dangling Service Account metadata incorrectly appearing in the UI
- Fixed an issue allowing creation of Service Accounts without ACLs

### Known Issues
- When removing ACLs in the Service Account UI, you can not remove the last ACL
