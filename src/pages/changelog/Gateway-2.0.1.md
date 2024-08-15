---
date: 2023-08-21
title: Improve error handling and robustness when scaling
description: The latest version of Conduktor Gateway introduces some fixes & improvements.
solutions: gateway
tags: fix
---

Submit your feedback to us via our [public roadmap](https://product.conduktor.help/).

Visit our [Get Started](https://docs.conduktor.io/gateway/) page to learn more and how to try our latest version of Conduktor.

## Conduktor Gateway

A vendor agnostic Apache Kafka proxy. Solving organizational problems of governance, security, cost-optimisation, and much more! Gateway is one of the two primary artefacts provided by Conduktor, and must be deployed to unlock Conduktor Data Security, Conduktor Governance, and Conduktor Optimize.

Sound interesting? [Chat with the team](https://www.conduktor.io/contact/sales/).

## General fixes 🔨

- Improved error handling on start: When faced with issues to do with missing keystores or inadequately configured port count, we'll throw you some better error messages
- Improved robustness of memory handling during network outages
- Improved robustness for the audit log
- Improved robustness when scaling
- Renamed `GATEWAY_HOST` to `GATEWAY_ADVERTISED_HOST` : Don't worry it will still work with the old value too!
- Include token detail on expiry: When tokens expire the token detail is provided in the expiry message
