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
  - [](#)
- [Conduktor Exchange](#conduktor-exchange)
- [Conduktor Trust](#conduktor-trust)
- [Quality of life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)

### Conduktor Scale


#### Email Alert Destination

Email can now be configured as an alert destination. Set up your SMTP server with TLS encryption and authentication to enable secure email delivery directly to your inbox.

Create customized email alerts with custom subjects and body content per alert. Dynamic variables like `{{clusterName}}` and `{{threshold}}` can be embedded using handlebars syntax for context-aware notifications that provide meaningful alert details.

![Email alert destination](/images/changelog/platform/v36/email-integration.png)


#### Configurable Webhook Body

Webhook alert destinations now support full payload customization. In addition to existing headers customizations, you can now secure your webhooks with Basic Auth or Bearer Token authentication. You can now also customize the body of the webhook payload to be sent when the alert is triggered.

Like email alerts, webhook bodies support dynamic variable insertion using handlebars syntax, allowing you to create context-aware webhook payloads tailored to your specific monitoring needs.


#### Redesigned Application Catalog and Application Details


#### Labels on Consumer Groups


#### 

### Conduktor Exchange

### Conduktor Trust

### Quality of life improvements

### Fixes

- Upon creation Partner Zones create instantly, rather than waiting for the next reconciliation loop to pass. Other updates will continue to sync in line via reconciliation loop
