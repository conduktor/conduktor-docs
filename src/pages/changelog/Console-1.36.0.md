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

### Breaking changes

Condutkor Exchange has a breaking change in bringing support for mTLS connections, any existing partner zones must be re-created. See the Conduktor Exchange section below for details.

### Conduktor Scale

### Conduktor Exchange

#### Partner Zone support for mTLS

Partners can now connect their clients to your partner zone using mTLS.

This is an additional option of `MTLS` for the `spec.authenticationMode.type`.

This is a breaking change for existing Partner Zones, they must be deleted and re-created even if not using mTLS.

To find out more, head over to the documentation for [supported authentication mode types](/platform/reference/resource-reference/console/#partner-zone) and [prerequisites for creating partner zones](/platform/navigation/partner-zones/#prerequisites).

### Conduktor Trust

### Quality of life improvements

- Users will now be redirected to the page they were on when they logged in again when their session expired
- Improved navigation between Partner Zones in the list view via keyboard

### Fixes

- Upon creation Partner Zones create instantly, rather than waiting for the next reconciliation loop to pass. Other updates will continue to sync in line via reconciliation loop
