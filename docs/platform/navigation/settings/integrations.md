---
sidebar_position: 6
title: Integrations
description: Connect Conduktor to other tools that your team uses.
---

## Configuring Integrations

MS Teams and Slack have two different configuration setups which involve generating either a token or a webhook URL. The details of which are documented within the Conduktor UI.

To begin, select the integration you wish to **Configure** the integration for. You may configure for both Slack and Teams if you wish but only one may remain active at any time. You must have sufficient permissions to setup the integration.
![admin integrations start](/img/admin/admin-integrations-start.jpg)

Follow the instructions and **Test your configuration**.

If switching between the integrations you should return to this screen to **Connect**.

![admin integrations configured](/img/admin/admin-slack-teams-configured.jpg)

With the integration configured you can now receive [Alerts in Monitoring](/platform/navigation/monitoring/getting-started/create-alert/)!

# Microsoft Teams integration using Workflows

## Microsoft Workflows

The existing Microsoft 365 (previously called Office 365) connectors and webhooks across all cloud platforms are planned for retirement starting 8/15/2024 with plans to disable the ability to create new connectors and webhooks. Followed by connectors and webhook's functionality ceasing at the end of the year. Power Automate workflows are the intended solution to replace the connectors and webhooks.

This document is focused on how Conduktor console integrates with workflows in place of the webhooks which are used with Microsoft teams to handle alerting from Conduktor's monitoring.

## Workflows Setup Instructions

1.  Open the Workflows app within the chat or channel by right-clicking on the conversation, or by clicking on More options (…) then selecting Workflows.
![138db71339cf516d2667e2f6acf19249.png](/img/msft-workflows/0EZeU9J0Z7feL6-138db71339cf516d2667e2f6acf19249.png)

2.  In the Workflow app, click on the "+ New flow" button, or select the Create tab and choose "Post to a channel when a webhook request is received" template.
![image.png](/img/msft-workflows/iLYlxEniyU6oel-image.png)

3.  Choose a name for this flow, you can use the default "Post to a channel when a webhook request is received". And choose who will own this workflow, it should default to the user you are using to log into teams. Then click Next.
![4e4c0d0c646dfc76ae95628ccd189a13.png](/img/msft-workflows/QKH-EaeHYY6oqd-4e4c0d0c646dfc76ae95628ccd189a13.png)

4.  Pick which team and which channel to post to, then click on Create flow. This page usually takes a bit to load.
![3572acf8f78cb1825a50801c1802405e.png](/img/msft-workflows/JaDpHOeBhqZ9BT-3572acf8f78cb1825a50801c1802405e.png)

5.  Once you click on click on Create flow from the previous step, the next page should show you the URL for the webhook associated with the workflow you just created. Copy and paste this somewhere as it will be used in a later step. Then click done.
6.  Go back to the Home tab in workflow, and edit the newly created workflow by click on more options(...) then Edit.
![ed974995881bb2b454d2c3ccce4490ba.png](/img/msft-workflows/LSO0IoylzhIgS3-ed974995881bb2b454d2c3ccce4490ba.png)

7.  On this page:
    1.  Expand the first step "When a Teams webhook request is received" to see the URL endpoint again if you failed to save it from the previous step. You can also change who can trigger the flow, for this example we will use "Anyone".
    2.  Expand the second step and select "attachments" from Select an output from previous steps, then in the sub step select "content" from Adaptive Card. Everything else should be filled in, however here you can choose a different channel if you want to change the options selected during Workflow creation.
![a9ed6765e145748ba47e98dc2e3ed97c.png](/img/msft-workflows/02aGKAhe66wPlo-a9ed6765e145748ba47e98dc2e3ed97c.png)

8.  Head to Teams integration on Conduktor console, and configure the connection using the URL found in previous steps. You can test your connection and see whether or not it fails on console before saving the configuration.
    1.  Currently with the new workflow integration it will NOT show in the Teams channel where the workflow is configured whether or not the Conduktor integration test connection is successful. Previously with webhooks, it will confirm with a message in the Teams channel.
![18262bc352022d5443a1a2250c27898e.png](/img/msft-workflows/-ifPvYpUmu8LHy-18262bc352022d5443a1a2250c27898e.png)

9.  Fire some alerts and you should now see alert messages being posted in Microsoft teams under the channel you specified
![741b41f425863ca43e44d3e2a49c3ff5.png](/img/msft-workflows/1Qs1G8i6UHrKcH-741b41f425863ca43e44d3e2a49c3ff5.png)