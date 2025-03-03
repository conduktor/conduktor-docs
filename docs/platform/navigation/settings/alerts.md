---
sidebar_position: 8
title: Alerts
description: Get notified about changes to your Kafka resources with alerts
---

# Alerts

## Overview

Alerts allow you to be notified and react to Kafka infrastructure or application changes as soon as they happen.

You can integrate alerts with **Slack** and **MS Teams** to receive real-time notifications. Alternatively, set up arbitrary **webhook** destinations with any URL and custom headers. Find out how to [configure integrations](/platform/navigation/settings/integrations).

Alerts are periodically checked for **every minute**.

## Create alerts
Alerts can be created for most resources (e.g. brokers or topics) in Conduktor Console. 

To create an alert:
1. Navigate to the required resource.
1. Click on the **Alerts** tab.
1. Click **Create an alert**:

import AlertCreationButton from './assets/create-alert-button.png';

<img src={AlertCreationButton} alt="Alert creation" style={{ width: 800, display: 'block', margin: 'auto', marginBottom: '20px' }} />

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
You can disable an alert temporarily without deleting it. You can also test the alert at any point or duplicate it (e.g. if you want the same alert to go to different external destinations). 

Select the event and click the three docs in the top-right corner:

import EditAlert from './assets/edit-alert.png';

<img src={EditAlert} alt="Editing alerts" style={{ width: 200, display: 'block', margin: 'auto', marginBottom: '20px' }} />

## Alerting history
Each alert will keep a history of when it was triggered and the status over time. This gives you an overview of successful or failed deliveries. Alerts with the `firing` status will trigger a notification every hour.

import AlertDetails from './assets/alert-details.png';

<img src={AlertDetails} style={{ width: 800, display: 'block', margin: 'auto', marginBottom: '20px' }}
  alt="Alert details page. The left-hand side lists alert properties like name and description. The right-hand side displays a heatmap-style chart with red and grey squares indicating alert health and a table below listing recent alert notifications."
  />

## Alert list
Go to **Settings > Alerts** to see all the alerts, grouped by owner. You can sort the view by name, status or destination and enable/disable as required. You can also customize this view to show/hide columns relevant to you.