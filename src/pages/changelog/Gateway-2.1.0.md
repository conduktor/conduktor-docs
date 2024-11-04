---
date: 2023-08-25
title: mTLS support, more prometheus metrics
description: The latest version of Conduktor Gateway introduces some fixes & improvements.
solutions: gateway
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

## General features

### mTLS support for clients to Gateway

Gateway now supports mTLS connetions between clients and the Gateway. We are constantly expanding our offering to meet the demands of our customer's environments and are excited to bring mTLS compatability.

### Metrics on Prometheus

Gateway exposes several health metrics on the available endpoint to help you monitor the health of your deployment. Checkout the docs for the available metrics on our docs site. If there are any you would need or like to see don't hesitate to [submit a feature request](https://conduktor.io/roadmap) on our public roadmap.

## General fixes 🔨

- Fixed an issue with token generation where a small percentage generated would be invalid, requiring an early regeneration
- Improved handling of timeout errors: Clients will now be better informed when timeout issues occur.
