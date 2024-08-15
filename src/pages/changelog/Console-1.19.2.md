---
date: 2023-11-23
title: Bug Fixes
description: Conduktor version 1.19.2
solutions: console
tags: fix
---

Remember, you can always:

- Submit your feedback via our [public roadmap](https://product.conduktor.help/)
- Visit our [Get Started](https://www.conduktor.io/get-started/) page to test our latest version of Conduktor
- Receive updates on our future Releases via our [Support Portal](https://support.conduktor.io/hc/en-gb/sections/16400521075217-Releases) and selecting **follow**

# Conduktor Console

## Fixes 🔨

- Fixed an issue with the Reset Offset Preview in the Consumer Groups details showing incorrect target offsets
- Fixed an issue with Service Account page where prefix ACLs were saved incorrectly (`prefix-*` instead of `prefix-`)
- Fixed an issue with Service Account page where forcing an operation to "Not Set" caused an error on save
- Fixed an issue with Audit Log after upgrading from 1.18 and previous versions
- Fixed a UI issue where ACLs could not be deleted by non-Admin group members
- Fixed multiple UI issues with Topic As a Service
- Added new configurations for better OIDC support (`allow-unsigned-id-tokens` and `preferred-jws-algorithm`)
