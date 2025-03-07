---
title: Console 1.32
description: docker pull conduktor/conduktor-console:1.32.0
solutions: console
tags: features,fix
---

TODO release date: frontMatter.date.toISOString().slice(0, 10)

- [Scale](#scale)
  - [Alert history](#alert-history)
  - [Service account labels](#service-account-labels)
- [Quality of life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)

### Scale

#### Alert history

The alert details page now displays information about the history of alerts' healthy/firing status, and warnings about failed notification delivery.
Read [the alerting section of our documentation](/platform/navigation/settings/alerts) for more information.

![Alert details page. The left-hand side lists alert properties like name and description. The right-hand side displays a heatmap-style chart with red and grey squares indicating alert health and a table below listing recent alert notifications.](/images/changelog/platform/v32/alert-details.png)

#### Service account labels

You can now edit labels on service accounts in plain Kafka clusters through the UI, in addition to the existing CLI & API support.
Support for service accounts in Aiven and Confluent Cloud clusters is coming soon.

![The service account details page shows labels underneath the service account name heading. Next to existing labels there is an edit button which you can click to open a drawer with a form to add and edit labels](/images/changelog/platform/v32/edit-service-account-labels.png)

***

### Quality of life improvements

- Enabled the confirmation of resource deletion using the Enter key
- Updated connector restart button labels and toast messages to accurately reflect their behaviour for Confluent Cloud connectors

### Fixes

- Fixed an issue where editing a schema registry subject would overwrite its compatibility mode with the global compatibility setting
- Fixed an issue where the Kafka Connect failed task heatmap did not display data for days in 2025
