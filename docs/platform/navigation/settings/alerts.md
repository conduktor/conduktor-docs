---
sidebar_position: 8
title: Alerts
description: Using alerts to be notified about changes to your Kafka resources
---

# Alerts

## Overview

Our alerting solution enables you to react to Kafka infrastructure and application changes.
Currently, we integrate with **Slack** and **MS Teams** so that you can receive real-time notifications.
You can also set up arbitrary webhook destinations for alerts with any URL and custom headers.

You can find information about configuring alerting integrations in [our docs for the integrations page](/platform/navigation/settings/integrations).
If you require an additional integration, please [let us know](https://conduktor.io/roadmap) so we can consider it.

To create an alert, first navigate to the page for the resource the alert will target (e.g. broker, topic).
Since removing the dedicated monitoring section of console, we've embedded graphs for relevant metrics into resource pages and you can create alerts directly from these graphs.
Along with graphs for relevant metrics, resource pages also have an 'Alerts' tab where you can view and edit the alerts you have created.

To get a unified view of all your alerts, you can visit the alerts page in settings.
Here, you can see alerts listed by ownership and see a breakdown of how many alerts are healthy or firing.

## Alert creation

Click the bell icon on a graph to open the alert creation drawer. Alerts need a unique name, a metric to measure, and an operator and value for their threshold.
You also need to specify an owner when creating an alert.
Currently alerts can be owned by an individual, a group, or an individual user, and this determines who can edit the alert.
**If the owner of an alert is deleted, then the alerts associated with that owner will be deleted too.**

import AlertCreation from './assets/create-alert.png';

<img src={AlertCreation} alt="Alert creation" style={{ width: 800, display: 'block', margin: 'auto', marginBottom: '20px' }} />

If you have configured alerting integrations in [the integration settings page](/platform/navigation/settings/integrations) you will be able to set an external destination for alert notifications.
Each alert has a maximum of one external destination.
After configuring a destination, you can click the 'send test' button to trigger a sample notification.
When selecting MS Teams as the destination for an alert, you will need to provide [a webhook URL](https://docs.conduktor.io/platform/navigation/settings/integrations/#microsoft-workflows).

## Webhook payload

Tools like [Webhook.site](https://webhook.site) can be used to check the payload sent for webhook notifications.
You can also reference the example below:

```json
{
  "data": {
    "metatadata": {
      "name": "high produce rate",
      "appInstance": null,
      "group": "menu-team",
      "user": null,
      "updatedAt": "2025-01-21T14:13:34.729783423Z",
      "updatedBy": "mary@example.com",
      "lastTriggeredAt": null,
      "status": "Pending"
    },
    "spec": {
      "cluster": "prod-internal",
      "threshold": 1000,
      "operator": "GreaterThan",
      "metric": "MessageIn",
      "promQl": "sum(rate(kafka_partition_latest_offset{cluster_id=\"shadow-julien\"}[1m])) > 1000",
      "description": "Miguel knows how to fix this",
      "displayName": null,
      "destination": {
        "url": "https://example.com/webhook/f0c608e3-aca3-4b07-8d4d-7226f629ade9",
        "method": "POST",
        "headers": {
          "example": "123"
        },
        "authentification": null,
        "type": "Webhook"
      },
      "disable": null,
      "type": "BrokerAlert"
    }
  },
  "status": "resolved"
}
```
