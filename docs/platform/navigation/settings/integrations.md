---
sidebar_position: 6
title: Integrations
description: Connect Conduktor to other tools.
---

## Configuring integrations

Conduktor Console can integrate with Slack, MS Teams, email, and any system that receives webhooks.

Enabling the **Slack** integration requires creating a Slack application, installing this to your Slack workspace, inviting your app to the channel and adding the application token to Conduktor.  

After enabling the **MS Teams** integration you will need a Teams webhook URL to create alerts with this destination.

:::info
Disabling an integration used by existing alerts will not delete the alerts, but will prevent them from sending notifications externally.
:::

## Slack integration

As part of configuring the Slack integration in Conduktor, you will find steps for [creating a Slack application](https://api.slack.com/apps) (a bot) using the app manifest template (provided in Conduktor). This app needs to be installed to your Slack workspace and the OAuth token added to the Conduktor integration.

Once configured you'll need to add the application to the Slack channels you wish to send alerts too. You can do this by typing `/invite` in the channel and choose the application you have just created., or through managing the app within Slack. 

import SlackIntegration from './assets/slack-invite.png';

<img src={SlackIntegration} alt="Slack integration" style={{ width: 400, display: 'block', margin: 'auto', marginBottom: '20px' }} />

Channels that have not had the application invited cannot be set as destinations for alerts. You'll get a `not_in_channel` error. Once the applications is invited to the channel, you'll be able to [send alerts](/platform/navigation/settings/alerts) to that Slack channel.

## Email integration

The email integration allows you to receive alert notifications directly in your inbox. Setting up email alerts requires configuring your SMTP server details and authentication credentials.

Setting up email alerts requires two main configuration steps:

1. **Server Settings**: Configure your SMTP server details to enable email delivery
   - **SMTP Server**: Enter your email server address with port (e.g., `mail.company.com:587`)
   - **TLS Encryption**: Enable TLS encryption for secure email transmission (recommended)
   - **SSL Configuration**: Option to skip SSL checks or upload custom certificates for enhanced security
   - **Upload custom certificates**: Upload custom certificates for enhanced security

2. **Authentication**: Provide credentials for authenticating with your email server
   - **Sender Email**: The email address that will appear as the sender for all alerts (e.g., `conduktor-alerts@company.com`)
   - **Username & Password**: Your email server authentication credentials
   - **Test Configuration**: Click "Test configuration" to verify your settings before saving

Once your email integration is configured, you can create email alerts with customizable destination addresses, subjects, and body content. You can use handlebars syntax (e.g., `{{clusterName}}`, `{{threshold}}`) to embed alert variables dynamically in the body of the email.

## Microsoft Teams integration using Workflows

Microsoft plans to retire existing Microsoft 365 (previously Office 365) connectors and webhooks across all cloud platforms starting 8/15/2024, with plans to disable the ability to create new connectors and webhooks. Followed by connectors and webhook's functionality ceasing at the end of the year. Power Automate workflows are the intended solution to replace the connectors and webhooks.

This document focusses on the Workflows integration, rather than webhooks which are used with Microsoft teams to handle alerting from Conduktor's monitoring.

You can send notifications to different rooms for different alerts. However, this room must be a Microsoft Teams "standard room" and not a "shared" room.

### Workflows setup

1.  Open the Workflows app within the chat or channel by right-clicking on the conversation, or by clicking on More options (…) then selecting Workflows.

import Workflows1 from './assets/workflows-1.png';

<img src={Workflows1} alt="Workflows" style={{ width: 400, display: 'block', margin: 'auto', marginBottom: '20px' }} />


2.  In the Workflow app, click on the "+ New flow" button, or select the Create tab and choose "Post to a channel when a webhook request is received" template.

import Workflows2 from './assets/workflows-2.png';

<img src={Workflows2} alt="Workflows" style={{ width: 700, display: 'block', margin: 'auto', marginBottom: '20px' }} />


3.  Choose a name for this flow, you can use the default "Post to a channel when a webhook request is received". And choose who will own this workflow, it should default to the user you are using to log into teams. Then click Next.

import Workflows3 from './assets/workflows-3.png';

<img src={Workflows3} alt="Workflows" style={{ width: 700, display: 'block', margin: 'auto', marginBottom: '20px' }} />


4.  Pick which team and which channel to post to, then click on Create flow. This page may take some time to load.

import Workflows4 from './assets/workflows-4.png';

<img src={Workflows4} alt="Workflows" style={{ width: 700, display: 'block', margin: 'auto', marginBottom: '20px' }} />


5.  Once you click on click on Create flow from the previous step, the next page should show you the URL for the webhook associated with the workflow you just created. Copy and paste this somewhere as it will be used in a later step. Then click done.

6.  Go back to the Home tab in workflow, and edit the newly created workflow by click on more options(...) then Edit.

import Workflows5 from './assets/workflows-5.png';

<img src={Workflows5} alt="Workflows" style={{ width: 700, display: 'block', margin: 'auto', marginBottom: '20px' }} />

7.  On this page:
    1.  Expand the first step "When a Teams webhook request is received" to see the URL endpoint again if you failed to save it from the previous step. You can also change who can trigger the flow, for this example we will use "Anyone".
    2.  Expand the second step and select "attachments" from Select an output from previous steps, then in the sub step select "content" from Adaptive Card. Everything else should be filled in, however here you can choose a different channel if you want to change the options selected during Workflow creation.

import Workflows6 from './assets/workflows-6.png';

<img src={Workflows6} alt="Workflows" style={{ width: 800, display: 'block', margin: 'auto', marginBottom: '20px' }} />

8.  Head to the integrations settings in Conduktor and turn on the Teams integration. You can now [create alerts](/platform/navigation/settings/alerts/#alert-creation) with the destination "Microsoft Teams" and use the URL found in previous steps. You can test your connection by clicking on the test button.

import Workflows7 from './assets/workflows-7.png';

<img src={Workflows7} alt="Workflows" style={{ width: 600, display: 'block', margin: 'auto', marginBottom: '20px' }} />

9.  Fire some alerts and you should now see alert messages being posted in Microsoft teams under the channel you specified

import Workflows8 from './assets/workflows-8.png';

<img src={Workflows8} alt="Workflows" style={{ width: 600, display: 'block', margin: 'auto' }} />

## Webhook integration

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