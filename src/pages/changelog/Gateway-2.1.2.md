---
date: 2023-09-01
title: Better API responses codes
description: The latest version of Conduktor Gateway introduces some fixes & improvements.
solutions: gateway
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

## General fixes 🔨

- More detailed API responses from the admin API. 201 & 203 codes now returned, as well as additional messages on create and deletion of resources
- Fixed an issue fetching offsets for invalid partitions
- Fixed an issue to more thoroughly delete topics
- Improved robustness when creating or deleting topics at higher throughputs
- Fixed an issue with consumer groups on deletes
