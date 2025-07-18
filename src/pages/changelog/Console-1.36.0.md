---
date: 2025-07-16
title: Console 1.36
description: docker pull conduktor/conduktor-console:1.36.0
solutions: console
tags: features,fixes
---

_Release date: {frontMatter.date.toISOString().slice(0, 10)}_

- [Conduktor Scale](#conduktor-scale)
  - [New alert destination: email](#new-alert-destination-email)
  - [Configurable Webhook Body](#configurable-webhook-body)
  - [Redesigned Application Catalog and Application Details](#redesigned-application-catalog-and-application-details-pages-in-console)
  - [Labels on Consumer Groups](#labels-on-consumer-groups)
- [Conduktor Exchange](#conduktor-exchange)
  - [Breaking change](#breaking-change)
  - [mTLS support for Partner Zones added](#partner-zones-support-for-mtls)
- [Quality of life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)
- [Known Issues](#known-issues)


### Conduktor Scale

#### New alert destination: email

You can now set emails as alert destinations. Set up your SMTP server with TLS encryption and authentication to enable secure email delivery directly to your inbox.

Create customized email alerts with custom subjects and body content per alert. Dynamic variables like `{{clusterName}}` and `{{threshold}}` can be embedded using handlebars syntax for context-aware notifications that provide meaningful alert details.

[Find out how to configure email integration](/platform/navigation/settings/integrations/#email-integration).

#### Configurable webhook body

Webhook alert destinations now support full payload customization. In addition to existing header customizations, you can now secure your webhooks with **basic auth** or **bearer token** authentication and customize the body of the webhook payload to be sent when an alert is triggered.

Like email alerts, webhook bodies support dynamic variable insertion using handlebars syntax, allowing you to create context-aware webhook payloads tailored to your specific monitoring needs.

#### Redesigned Application Catalog and Application details pages in Console

Application details page:

- displays a list of the application instances with labels and stats.
- includes an editor for modifying the application description.
- shows the application groups list with the owner group pinned.

Application instance page:

- header section displays stats and labels, with the ability to manage labels.
- contains multiple tabs: Details, External access, Alerts, and API keys.
- within the Details tab, information is divided into two sections: ownership and resource policies.

#### Labels on Consumer groups

Labels are now displayed across various consumer groups views, along with new filtering capabilities:

- The consumer groups list now shows labels and allows filtering by them.
- Topic lists within both the consumer groups and member details pages now support label-based filtering.
- In the topic details view for consumer groups, labels are visible and can be added, edited, or deleted.

### Conduktor Exchange

#### Breaking change

With support for mTLS connections, Partner Zones now have a breaking change: all **existing Partner Zones have to be re-created** (even if not using mTLS).

#### Partner Zones: support for mTLS

Partners can now connect their clients to your Partner Zone using mTLS.

This is an additional option of `MTLS` for the `spec.authenticationMode.type`.

[Find out more about supported authentication modes](/platform/reference/resource-reference/console/#partner-zone) and [prerequisites for creating Partner Zones](/platform/navigation/partner-zones/#prerequisites).

#### Quality of life improvements

- Users will now be redirected to the page they were on when they logged in again after session expiry
- Improved navigation between Partner Zones in the list view using keyboard
- Improved configurability of circuit breaker behaviour for indexed tasks. See more in the [reference documentation](/platform/get-started/configuration/env-variables/#indexer-properties)

### Fixes

- Partner Zones are now created instantly, instead of waiting for the next reconciliation loop to pass. Other updates will continue to sync in line with the reconciliation loop.
- Fixed an error that occurred when no partitions were selected in the topic consume view. You will now see a warning that no messages will be shown if partitions filter is set to none.
- The JSON view of a message in a topic now displays negative numbers and numbers in scientific notation correctly.
- Kafka Connect clusters are no longer visible to users who do not have permission on any of their connectors.
- Error messages are now more informative when attempting to create a service account on a resource for which the caller lacks permission.
- Resolve case sensitivity issue with email addresses in the application group payload that causes mismatches in RBAC configuration.

### Known Issues

If a self-service resource policy is attached to a self-service application instance, the self-service Application Instance page may display a validation error in console.
