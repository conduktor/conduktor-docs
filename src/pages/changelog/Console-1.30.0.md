---
date: 2024-12-12
title: title
description: docker pull conduktor/conduktor-console:1.30.0
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

**TOC**

## Breaking Changes 💣
?


***

## Quality of Life improvements

### Alert list redesign
We’ve redesigned our alert lists across the product to provide a more intuitive overview of alert configurations and statuses:

- The Prometheus query column is replaced with a more friendly metric and condition row.
- Added the "Last Triggered Time" column to make filtering and finding firing alerts easier.


![New alert list](/images/changelog/platform/v30/new-alert-list.png)


### RBAC screen redesign

The RBAC screen displaying resource access has been redesigned to provide a clearer distinction between inherited and user-specific permissions.

![RBAC screen](/images/changelog/platform/v30/RBAC-screen-redesign.png)


## Fixes 🔨
