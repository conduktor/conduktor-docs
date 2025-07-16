---
date: 2025-07-16
title: Console 1.36
description: docker pull conduktor/conduktor-console:1.36.0
solutions: console
tags: features,fixes
---

_Release date: {frontMatter.date.toISOString().slice(0, 10)}_

- [Conduktor Exchange](#conduktor-exchange)
    - [Breaking change](#breaking-change)
    - [mTLS support for Partner Zones added](#partner-zones-support-for-mtls)
- [Quality of life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)

### Conduktor Exchange

#### Breaking change

With support for mTLS connections, Partner Zones now have a breaking change: all **existing Partner Zones have to be re-created** (even if not using mTLS).

#### Partner Zones: support for mTLS

Partners can now connect their clients to your Partner Zone using mTLS.

This is an additional option of `MTLS` for the `spec.authenticationMode.type`.

[Find out more about supported authentication modes](/platform/reference/resource-reference/console/#partner-zone) and [prerequisites for creating Partner Zones](/platform/navigation/partner-zones/#prerequisites).

## Quality of life improvements

- Users will now be redirected to the page they were on when they logged in again after session expiry
- Improved navigation between Partner Zones in the list view using keyboard

## Fixes

- Partner Zones are now created instantly, instead of waiting for the next reconciliation loop to pass. Other updates will continue to sync in line with the reconciliation loop.
- Upon creation Partner Zones create instantly, rather than waiting for the next reconciliation loop to pass. Other updates will continue to sync in line via reconciliation loop.
- Fixed an error that occurred when no partitions were selected in the topic consume view. You will now see a warning that no messages will be shown if partitions filter is set to none.
- The JSON view of a message in a topic now displays negative numbers and numbers in scientific notation correctly.
