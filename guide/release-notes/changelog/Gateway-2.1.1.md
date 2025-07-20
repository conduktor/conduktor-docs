---
date: 2023-08-25
title: Support for Confluent version 7.5.0
description: The latest version of Conduktor Gateway introduces some fixes & improvements.
solutions: gateway
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### General fixes 🔨

- Moved configuration of mTLS to the environment variable level, checkout the docs for more
- Improved some API responses to more clearly reference virtual clusters and interceptors
- Fixed an issue listing offsets with latest version of Confluent, 7.5.0
- Improved handling for scenarios where topics are altered outside of Gateway
