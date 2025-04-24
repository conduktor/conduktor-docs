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

- Add new self service policies on application instances, allowing users to create policies that check that newly created resources, for now connector and topic, are created with the right configuration. This will replace the existing policies on the topic in the future. the new policies use the [CEL language](https://cel.dev) to express the rule instead of the previously custom matcher DSL

### Conduktor Exchange

### Quality of life improvements

- Add selectors for key and value formats on the single Kafka message page, enabling the use of customer deserializers.
- Creating resources owned by an Application Instance using an Admin API Key now bypasses Self-service topic policies.

### Fixes

### Known issues

In the Topic Consume view, equality filters (`==`) on JSON number fields aren't working correctly when the number exceeds JavaScript's safe integer limit of `2^53-1`. Note that while range operators (`>`, `<`, `>=`, `<=`) still work with large numbers, there's currently no workaround for exact equality filtering. We'll address this in a future release.
