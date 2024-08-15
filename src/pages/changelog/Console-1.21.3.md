---
date: 2024-04-18
title: Hotfix for Console 1.21.3
description: docker pull conduktor/conduktor-console:1.21.3
solutions: console
tags: fix
---

Remember, you can always:

- Submit your feedback via our [public roadmap](https://product.conduktor.help/)
- Visit our [Get Started](https://www.conduktor.io/get-started/) page to test our latest version of Conduktor
- Receive updates on our future Releases via our [Support Portal](https://support.conduktor.io/hc/en-gb/sections/16400553827473-Conduktor-Console) and selecting **follow**


# Conduktor Console

## Features ✨
- Added support for Azure Managed Identity for Kafka authentication
- Implement OIDC logout. You may need to update your OIDC configuration to allow the root page of Console as a possible redirect URI

## Fixes 🔨
- Fixed an issue where two ACLs with the same name but with different pattern type (PREFIXED and LITERAL) were merged in the same group in the UI.
- Fixed an issue with OIDC login that could cause an expired sessions to become stuck and prevent login in again.