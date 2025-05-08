---
date: 2025-05-08
title: Console 1.34
description: docker pull conduktor/conduktor-console:1.34.0
solutions: console
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Conduktor Scale](#conduktor-scale)
  - [Application topic subscribe workflow](#application-topic-subscribe-workflow)
- [Conduktor Exchange](#conduktor-exchange)
- [Quality of life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)
- [Known issues](#known-issues)

### Conduktor Scale

#### Application topic subscribe workflow

Application owners now have the ability to manage topic subscriptions across their organization. Using the topic catalog, owners can subscribe to topics outside their own application, selecting from their list of applications and focusing only on valid instances that share the same Kafka cluster. The new interface allows for flexible permission configuration, enabling Read or Write permissions for each subscription, and granular control over both user and service account permissions.

![Topic catalog subscribe modal](/images/changelog/platform/v34/topic-catalog-subscribe.png)

Subscription request management has also been enhanced, giving application owners the ability to review pending requests and approve or deny them through both the UI and CLI. During this process, administrators can modify the originally requested permissions to better align with organizational requirements. For teams preferring infrastructure-as-code approaches, approving requests using YAML configuration automatically closes the request, streamlining the workflow.

![Application catalog request approval](/images/changelog/platform/v34/app-catalog-request.png)

### Conduktor Exchange

#### Extended authentication mechanisms for Partner Zones

Partner applications can now authenticate to your Partner Zones using client IDs & secrets managed by your OAuth/OIDC provider.

- ### Quality of life improvements

- Add selectors for key and value formats on the single Kafka message page, enabling the use of customer deserializers.
- Creating resources owned by an Application Instance using an Admin API Key now bypasses Self-service topic policies.

### Fixes

- To avoid timeouts when indexing consumer groups, added a new configuration variable to limit the number of consumer groups requested per describe query.
- Fixed an issue where in Topic Consume page, JQ filters against big numbers loses precision in Safari.
- Fixed an issue where messages with big number fields lose precision when being copied over to be reprocessed in the Topic Produce page.

### Known issues

In the Topic Consume view, equality filters (`==`) on JSON number fields aren't working correctly when the number exceeds JavaScript's safe integer limit of `2^53-1`. Note that while range operators (`>`, `<`, `>=`, `<=`) still work with large numbers, there's currently no workaround for exact equality filtering. We'll address this in a future release.
