---
date: 2025-07-16
title: Console 1.36
description: docker pull conduktor/conduktor-console:1.36.0
solutions: console
tags: features,fixes
---

_Release date: {frontMatter.date.toISOString().slice(0, 10)}_

- [Conduktor Scale](#conduktor-scale)
  - [Email Alert Destination](#email-alert-destination)
  - [Configurable Webhook Body](#configurable-webhook-body)
  - [Redesigned Application Catalog and Application Details](#redesigned-application-catalog-and-application-details)
  - [Labels on Consumer Groups](#labels-on-consumer-groups)
- [Conduktor Exchange](#conduktor-exchange)
- [Conduktor Trust](#conduktor-trust)
- [Quality of life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)

### Conduktor Scale

#### Email alert destinations

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
