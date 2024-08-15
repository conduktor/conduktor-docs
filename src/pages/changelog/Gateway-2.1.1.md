---
date: 2023-08-25
title: Support for Confluent version 7.5.0
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

- Moved configuration of mTLS to the environment variable level, checkout the docs for more
- Improved some API responses to more clearly reference virtual clusters and interceptors
- Fixed an issue listing offsets with latest version of Confluent, 7.5.0
- Improved handling for scenarios where topics are altered outside of Gateway
