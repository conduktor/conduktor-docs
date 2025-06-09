---
date: 2025-06-09
title: Gateway 3.9.1
description: docker pull conduktor/conduktor-gateway:3.9.1
solutions: gateway
tags: fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Fixes

Fixed a security vulnerability in `commons-beanutils` (CVE-2025-48734).

This release patches the affected dependency to mitigate the risk associated with this CVE.  
