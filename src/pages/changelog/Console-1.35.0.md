---
date: 2025-06-14
title: Console 1.35
description: docker pull conduktor/conduktor-console:1.35.0
solutions: console
tags: features,fixes
---

_Release date: {frontMatter.date.toISOString().slice(0, 10)}_

- [Conduktor Scale](#conduktor-scale)
- [Conduktor Exchange](#conduktor-exchange)
- [Conduktor Trust](#conduktor-trust)
- [Quality of life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)
- [Known issues](#known-issues)

### Conduktor Scale

### Conduktor Exchange

### Conduktor Trust

### Quality of life improvements

### Fixes

- Fixed an issue where changing the cluster did not clear the search filter in Consumer Groups / Topics pages.
- Fixed an issue where navigating to a schema registry with a name containing non-escaped characters such as `/` would redirect to the home page.
- Fixed an issue where the equality filter on JSON number fields was not working correctly against large numbers in the Topic Consume view.
- The JSON view of a message in a topic no longer coerces large number fields to a string.
- Fixed an issue where the full message was not displayed correctly in the tooltip when hovering over it in the Topic Consume view table.

### Known issues
