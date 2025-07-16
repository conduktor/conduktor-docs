---
sidebar_position: 290
title: Set up alerts
description: Set up alerts and monitor Kafka using Conduktor
---

## Overview

Alerts allow you to be notified and react to Kafka infrastructure or application changes as soon as they happen.

You can integrate alerts with **Slack** and **MS Teams** to receive real-time notifications. Alternatively, set up arbitrary **webhook** destinations with any URL and custom headers. [See how to configure integrations](#configure-integrations).

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

### Alert history

Each alert will keep a history of when it was triggered and the status over time. This gives you an overview of successful or failed deliveries. Alerts with the `firing` status will trigger a notification every hour.

### Alert list

Go to **Settings > Alerts** to see all the alerts, grouped by owner. You can sort the view by name, status or destination and activate/deactivate as required. You can also customize this view to show/hide columns relevant to you.

## Configure integrations

Conduktor Console can integrate with **Slack**, **MS Teams** and any system that receives webhooks.

Enabling the **Slack** integration requires creating a Slack application, installing this to your Slack workspace, inviting your app to the channel and adding the application token to Conduktor.  

After enabling the **MS Teams** integration you will need a Teams webhook URL to create alerts with this destination.

:::info[Removing integrations]
Disabling an integration used by existing alerts will not delete the alerts, but will prevent them from sending notifications externally.
:::

### Slack integration

As part of configuring the Slack integration in Conduktor, you will find steps for [creating a Slack application](https://api.slack.com/apps) (a bot) using the app manifest template (provided in Conduktor). This app needs to be installed to your Slack workspace and the OAuth token added to the Conduktor integration.

Once configured you'll need to add the application to the Slack channels you wish to send alerts too. You can do this by typing `/invite` in the channel and choose the application you have just created., or through managing the app within Slack.

<img src="/guide/slack-invite.png" alt="Slack" style={{maxWidth: '30%'}} />

Channels that have not had the application invited cannot be set as destinations for alerts. You'll get a `not_in_channel` error. Once the applications is invited to the channel, you'll be able to [send alerts](/platform/navigation/settings/alerts) to that Slack channel.

### Microsoft Teams integration using Workflows

This guide focusses on the Workflows integration, rather than webhooks which are used with Microsoft teams to handle alerting from Conduktor's monitoring.

You can send notifications to different rooms for different alerts. However, this room must be a Microsoft Teams *standard room* and not a *shared* room.

#### Workflows setup

1. Open the Workflows app within the chat or channel by right-clicking on the conversation or by clicking **...** then selecting **Workflows**.

<img src="/guide/workflows-1.png" alt="Teams step one" style={{maxWidth: '30%'}} />

2. In the Workflow app, click **+ New flow** or select the Create tab and choose **Post to a channel when a webhook request is received** template.

![Teams workflow step two](/guide/workflows-2.png)

3. Choose a name for this flow (or use the default **Post to a channel when a webhook request is received**) and choose who will own this workflow. It should default to the user logged into Teams. Click **Next**.

![Teams workflow step three](/guide/workflows-3.png)

4. Pick the team and channel you want to post to, then click **Create flow**. This page may take some time to load.

![Teams workflow step four](/guide/workflows-4.png)

5. Once you click on **Create flow** in the previous step, the next page should show you the URL for the webhook associated with the workflow you just created. *Copy and paste this somewhere* as it will be used in a later step and click **Done**.

6. Go back to the Home tab in Workflows and edit the newly created workflow by clicking **...** then **Edit**.

![Teams workflow step five](/guide/workflows-5.png)

7. On this page:
    1. Expand **When a Teams webhook request is received** to see the URL endpoint again, if you've not saved it from the previous step. You can also change *who can trigger the flow*. In this example we'll use *Anyone*.
    1. Expand the second step and for **Select an output from previous steps**, pick **Attachments**. For **Adoptive Card** select **content**. The rest of the form should be filled in but you can change the channel and team here.

  ![Teams workflow step six](/guide/workflows-6.png)

8. Open Console and [create a new alert](#create-alerts) or go to an existing one. In the **Alert destination** page select **Teams**. Paste the webhook URL and click **Save**. You can test your connection by clicking **Send test**.

9. Fire some alerts and you should now see alert messages being posted in Microsoft Teams under the specified channel:

 ![Teams workflow step eight](/guide/workflows-8.png)

### Webhook integration

You can use a tool like [webhook.site](https://webhook.site) to check the payload sent for webhook notifications.

Here's an example:

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

### Audit log events

  | **Event type**                | **Description**                         |
  | ----------------------------- | --------------------------------------- |
  | **Kafka.Alert.Create**        | An alert is created.                    |
  | **Kafka.Alert.Update**        | An alert is updated.                    |
  | **Kafka.Alert.Delete**        | An alert is deleted.                    |
  | **Kafka.Alert.Trigger**       | An alert is triggered.                  |
