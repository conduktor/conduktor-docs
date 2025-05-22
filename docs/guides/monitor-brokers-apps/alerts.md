---
sidebar_position: 290
title: Set up alerts
description: Set up alerts and monitor Kafka using Conduktor
---

## Overview

Alerts allow you to be notified and react to Kafka infrastructure or application changes as soon as they happen.

You can integrate alerts with **Slack** and **MS Teams** to receive real-time notifications. Alternatively, set up arbitrary **webhook** destinations with any URL and custom headers. Find out how to [configure integrations](/platform/navigation/settings/integrations).

Alerts are periodically checked for **every minute**.

## Create alerts

Alerts can be created for most resources (e.g. brokers or topics) in Conduktor Console.

To create an alert:

1. Navigate to the required resource.
1. Click on the **Alerts** tab.
1. Click **Create an alert**.

In the **New Alert** pane enter the required details. Each alert has to have:

  - a unique name
  - a metric you want to measure (e.g. messageCount)
  - an operator and value for the threshold
  - an owner. This can be a group, an application instance or an individual user. The ownership will determine who can edit the alert.
    :::warning
    If the owner of an alert is deleted, the associated alerts will also be deleted.
    :::
- (optional) a description explaining what the alert does or why you created it. This is useful if you're creating an external alert.
- a destination: internal (Conduktor Console) or external (Slack, Teams or Webhook). Each alert can have **only one external destination**. To verify that it works, click **Send test**.

## Manage alerts

You can **deactivate an alert without deleting** it. Deactivated alerts won't send notifications or record history/status until reactivated.

You can also test, duplicate or delete the alert at any point.

Select the event and click the three dots in the top-right corner.

## Alert history

Each alert will keep a history of when it was triggered and the status over time. This gives you an overview of successful or failed deliveries. Alerts with the `firing` status will trigger a notification every hour.

## Alert list

Go to **Settings > Alerts** to see all the alerts, grouped by owner. You can sort the view by name, status or destination and activate/deactivate as required. You can also customize this view to show/hide columns relevant to you.
