---
date: 2024-02-07
title: Better data quality rules error reporting 
description: docker pull conduktor/conduktor-gateway:2.5.1
solutions: gateway
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### General fixes 🔨

- Append data quality error reporting to the the header produced in the Dead Letter Queue
- Added a [swagger](https://github.com/swagger-api/swagger-ui) endpoint at `/swagger`