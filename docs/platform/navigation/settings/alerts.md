---
sidebar_position: 8
title: Alerts
description: Get notified about changes to your Kafka resources with alerts
---

# Alerts

## Overview

Alerts allow you to be notified and react to Kafka infrastructure or application changes as soon as they happen.

You can integrate alerts with **Slack**, **MS Teams**, and **email** to receive real-time notifications. Alternatively, set up arbitrary **webhook** destinations with any URL and custom headers. Find out how to [configure integrations](/platform/navigation/settings/integrations).

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
- a destination: internal (Conduktor Console) or external (Slack, Teams, Email or Webhook). Each alert can have **only one external destination**. To verify that it works, click **Send test**.

## Alert Destinations

Once you've configured your integrations in the [integrations settings](/platform/navigation/settings/integrations), you can choose from several alert destination types when creating alerts:

### Slack
- **Destination Channel**: Select from available Slack channels (your Slack app must be invited to the channel first)

### Microsoft Teams
- **Webhook URL**: Use the channel webhook URL from your Teams workflow configuration

### Email
- **Destination Email**: Specify the recipient email address where notifications will be sent
- **Subject**: Customize the email subject line for your alerts to make them easily identifiable
- **Body**: Body of the email. You can use handlebars syntax (e.g., `{{clusterName}}`, `{{threshold}}`) to embed alert variables dynamically

Email alerts will be sent from the sender address configured in your email integration settings.

### Webhook
- **Method**: Select the HTTP method to use for the webhook request (POST, PUT)
- **URL**: Any webhook endpoint that accepts POST requests
- **Custom Headers**: Add custom headers as needed
- **Body**: Receives structured JSON payload with alert details and metadata. You can use handlebars syntax (e.g., `{{clusterName}}`, `{{threshold}}`) to embed alert variables dynamically
- **Authentication**: Configure authentication if required by your webhook endpoint (Basic Auth, Bearer Token)

All external destinations include a **Send test** button to verify your configuration before saving the alert.

## Manage alerts
You can **deactivate an alert without deleting** it. Deactivated alerts won't send notifications or record history/status until reactivated.

You can also test, duplicate or delete the alert at any point.

Select the event and click the three dots in the top-right corner:

import EditAlert from './assets/edit-alert.png';

<img src={EditAlert} alt="Editing alerts" style={{ width: 200, display: 'block', margin: 'auto', marginBottom: '20px' }} />

## Alert history
Each alert will keep a history of when it was triggered and the status over time. This gives you an overview of successful or failed deliveries. Alerts with the `firing` status will trigger a notification every hour.

import AlertDetails from './assets/alert-details.png';

<img src={AlertDetails} style={{ width: 800, display: 'block', margin: 'auto', marginBottom: '20px' }}
  alt="Alert details page. The left-hand side lists alert properties like name and description. The right-hand side displays a heatmap-style chart with red and grey squares indicating alert health and a table below listing recent alert notifications."
  />

## Alert list
Go to **Settings > Alerts** to see all the alerts, grouped by owner. You can sort the view by name, status or destination and activate/deactivate as required. You can also customize this view to show/hide columns relevant to you.
