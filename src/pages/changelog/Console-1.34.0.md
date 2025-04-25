---
date: 2025-05-08
title: Console 1.34
description: docker pull conduktor/conduktor-console:1.34.0
solutions: console
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Conduktor Scale](#conduktor-scale)
- [Conduktor Exchange](#conduktor-exchange)
- [Quality of life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)
- [Known issues](#known-issues)

### Conduktor Scale

### Conduktor Exchange

### Quality of life improvements

- Add selectors for key and value formats on the single Kafka message page, enabling the use of customer deserializers.
- Creating resources owned by an Application Instance using an Admin API Key now bypasses Self-service topic policies.

### Fixes
- To avoid timeouts when indexing consumer groups, added a new configuration variable to limit the number of consumer groups requested per describe query.

### Known issues

In the Topic Consume view, equality filters (`==`) on JSON number fields aren't working correctly when the number exceeds JavaScript's safe integer limit of `2^53-1`. Note that while range operators (`>`, `<`, `>=`, `<=`) still work with large numbers, there's currently no workaround for exact equality filtering. We'll address this in a future release.
