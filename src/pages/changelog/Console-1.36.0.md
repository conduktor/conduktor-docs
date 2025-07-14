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

#### Email Alert Destination

Email can now be configured as an alert destination. Set up your SMTP server with TLS encryption and authentication to enable secure email delivery directly to your inbox.

Create customized email alerts with custom subjects and body content per alert. Dynamic variables like `{{clusterName}}` and `{{threshold}}` can be embedded using handlebars syntax for context-aware notifications that provide meaningful alert details.

Follow [this guide](/platform/navigation/settings/integrations/#email-integration) to set up email integration in your environment.

#### Configurable Webhook Body

Webhook alert destinations now support full payload customization. In addition to existing headers customizations, you can now secure your webhooks with Basic Auth or Bearer Token authentication. You can now also customize the body of the webhook payload to be sent when the alert is triggered.

Like email alerts, webhook bodies support dynamic variable insertion using handlebars syntax, allowing you to create context-aware webhook payloads tailored to your specific monitoring needs.

#### Redesigned Application Catalog and Application Details

Application details page:

- Display a List of the application instances with labels and stats.
- Includes an editor for modifying the application description.
- Display the groups list for the application with the owner group pinned.

Application instance page:

- Header section displaying stats and labels, with the ability to add, edit, or delete labels.
- Contains multiple tabs: Details, External Access, Alerts, and API Keys.
- Within the Details tab, information is divided into two sections: Ownership and Resource Policies.

#### Labels on Consumer Groups

Labels are now displayed across various consumer groups views, along with new filtering capabilities:

- The consumer groups list now shows labels and allows filtering by them.
- Topic lists within both the consumer groups and member details pages now support label-based filtering.
- In the topic details view for consumer groups, labels are visible and can be added, edited, or deleted.

### Conduktor Exchange

### Conduktor Trust

### Quality of life improvements

### Fixes

- Upon creation Partner Zones create instantly, rather than waiting for the next reconciliation loop to pass. Other updates will continue to sync in line via reconciliation loop
