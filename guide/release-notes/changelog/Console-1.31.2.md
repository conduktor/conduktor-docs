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
- Fixed an issue where Service Accounts with no ACL were incorrectly shown in the UI
- Fixed an issue allowing creation of Service Accounts without ACLs

### Known Issues
- When removing ACLs in the Service Account UI, you cannot remove the last ACL
 - As a workaround, you can remove that last ACL, then create a new ACL against a resource name that does not exist.
 - We will address this issue in the next release
