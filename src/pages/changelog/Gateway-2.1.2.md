---
date: 2023-09-01
title: Better API responses codes
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

- More detailed API responses from the admin API. 201 & 203 codes now returned, as well as additional messages on create and deletion of resources
- Fixed an issue fetching offsets for invalid partitions
- Fixed an issue to more thoroughly delete topics
- Improved robustness when creating or deleting topics at higher throughputs
- Fixed an issue with consumer groups on deletes
