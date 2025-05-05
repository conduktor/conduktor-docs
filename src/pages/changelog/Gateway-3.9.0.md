---
date: 2025-05-08
title: Gateway 3.9.0
description: docker pull conduktor/conduktor-gateway:3.9.0
solutions: gateway
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
- [New features](#new-features)
  - [Gateway Lived Events](#gateway-lived-events)

### Breaking changes

### New features

#### Gateway Lived Events

Gateway Lived Events is a real-time analytics feature that provides detailed statistics about the Gateway's operational state. It tracks various metrics including interceptor statistics, service accounts, groups, alias topics, and deployment information. This data is exposed through both Prometheus metrics and Segment analytics. 

**Key benefits:**
- **Comprehensive visibility**: Monitor interceptor usage, topics covered, virtual clusters, and more
- **Operational awareness**: Track configuration complexity and resource usage
- **Integration with monitoring tools**: Metrics exposed via Prometheus for seamless integration with your existing monitoring stack

Gateway Lived Events enables you to:
- Monitor the number and types of interceptors running on your Gateway
- Track how many topics are covered by interceptors
- View statistics on service accounts, groups, alias topics, and concentrated topics
- Get information about your Gateway deployment environment

**Access Gateway Lived Events data:**
- Via the API endpoint: `GET /gateway/v2/analytics/lived`
- Through Prometheus metrics with the `gateway_lived_event_` prefix

[Find out more about Gateway Metrics](/gateway/reference/monitoring#gateway-lived-events)