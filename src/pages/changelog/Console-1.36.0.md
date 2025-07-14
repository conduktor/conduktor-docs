---
date: 2025-07-16
title: Console 1.36
description: docker pull conduktor/conduktor-console:1.36.0
solutions: console
tags: features,fixes
---

_Release date: {frontMatter.date.toISOString().slice(0, 10)}_

- [Conduktor Scale](#conduktor-scale)
- [Conduktor Exchange](#conduktor-exchange)
- [Conduktor Trust](#conduktor-trust)
- [Quality of life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)

### Conduktor Scale

### Conduktor Exchange

#### Partner Zone support for mTLS

mTLS is now supported as an authentication mode type when creating a Partner Zone i.e. `spec.authenticationMode.type` can now be additionally set to `MTLS`.

As a result of the work to enable this new authentication mode, customers are required to delete their existing Partner Zones and re-create them.

To find out more, head over to the documentation for the [supported authentication mode types](/platform/reference/resource-reference/console/#partner-zone) and the [prerequisites for creating partner zones](/platform/navigation/partner-zones/#prerequisites).

### Conduktor Trust

### Quality of life improvements

- Users will now be redirected to the page they were on when they logged in again when their session expired
- Improved navigation between Partner Zones in the list view via keyboard

### Fixes

- Upon creation Partner Zones create instantly, rather than waiting for the next reconciliation loop to pass. Other updates will continue to sync in line via reconciliation loop
