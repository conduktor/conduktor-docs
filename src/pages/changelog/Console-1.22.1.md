---
date: 2024-04-18
title: Hotfix for Console 1.22.1
description: docker pull conduktor/conduktor-console:1.22.1
solutions: console
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

## Features ✨
- Added support for Azure Managed Identity for Kafka authentication
- Implement OIDC logout. You may need to update your OIDC configuration to allow the root page of Console as a possible redirect URI

## Fixes 🔨
- Fixed an issue where two ACLs with the same name but with different pattern type (PREFIXED and LITERAL) were merged in the same group in the UI.
- Fixed an issue with OIDC login that could cause an expired sessions to become stuck and prevent login in again.
- Fixed an issue with ksqlDB caused by not escaping the Stream or Table name in the query.
