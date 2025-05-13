---
date: 2025-05-08
title: Console 1.34
description: docker pull conduktor/conduktor-console:1.34.0
solutions: console
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Conduktor Scale](#conduktor-scale)
  - [Subscribe to application topics](#subscribe-to-application-topics)
- [Conduktor Exchange](#conduktor-exchange)
- [Quality of life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)
- [Known issues](#known-issues)

### Conduktor Scale

Added new Self-service policies on application instances, allowing you to create policies that check whether the newly created resources (connector and topic) are created with the right configuration.

This will replace the existing policies on the topic in the future. the new policies use the [CEL language](https://cel.dev) to express the rule, instead of the previously custom matcher DSL (Domain-Specific Language).

#### Subscribe to application topics

Application owners now have the ability to manage topic subscriptions across their organization. 

Using the Topic Catalog, owners can subscribe to topics outside of their own application, selecting from their list of applications and focusing only on valid instances that share the same Kafka cluster. 

The new interface provides flexible permission configuration, enabling read or write permissions for each subscription, as well as granular control over both user and service account permissions.

![Topic catalog subscribe modal](/images/changelog/platform/v34/topic-catalog-subscribe.png)

Subscription request management has also been enhanced, giving application owners the ability to review pending requests and approve or deny them through both the UI and CLI. 

During this process, administrators can modify the originally requested permissions to better align with organizational requirements. For teams preferring infrastructure-as-code approaches, approving requests using YAML configuration automatically closes the request, streamlining the workflow.

![Application catalog request approval](/images/changelog/platform/v34/app-catalog-request.png)


### Conduktor Exchange

#### Extended authentication mechanisms for Partner Zones

Partner applications can now authenticate to your Partner Zones using client IDs & secrets managed by your OAuth/OIDC provider.

### Quality of life improvements

- Added selectors for key and value formats on the single Kafka message page, enabling the use of custom deserializers.
- Creating resources owned by an application instance using an Admin API key now bypasses Self-service topic policies.
- You can now see clusters referenced by each alert in the **Settings > Alerts** page.

### Fixes

- To avoid timeouts when indexing consumer groups, added a new configuration variable to limit the number of consumer groups requested per describe query.
- Fixed an issue where in Topic Consume page, JQ filters against big numbers loses precision in Safari.
- Fixed an issue where messages with big number fields lose precision when being copied over to be reprocessed in the Topic Produce page.
- Fixed an issue where only the first 1,000 schemas were indexed
- Fixed an issue where opening a message with more than 1MB of data would freeze the UI because of the table view. It now defaults to the JSON view.
- Fixed an issue impacting Kafka Connect sink connectors where providing consumer override values as configuration would lead to a validation failure.

### Known issues

In the Topic Consume view, equality filters (`==`) on JSON number fields aren't working correctly when the number exceeds JavaScript's safe integer limit of `2^53-1`. Note that while range operators (`>`, `<`, `>=`, `<=`) still work with large numbers, there's currently no workaround for exact equality filtering. We'll address this in a future release.
