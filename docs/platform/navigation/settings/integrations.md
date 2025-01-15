---
sidebar_position: 6
title: Integrations
description: Connect Conduktor to other tools that your team uses.
---

## Configuring Integrations

Conduktor console can integrate with Slack, MS Teams, and any system that receives webhooks.
MS Teams and webhook integrations can be enabled and disabled from this page with a simple toggle.
_Disabling an integration that is used by existing alerts will not delete those alerts, but it will prevent them from sending external notifications._
Enabling the Slack integration requires generating a token, and instructions for this can be found within the Conduktor UI after initiating a connection.
MS Teams integration can be enabled and disabled on this page, but you will need a webhook URL from Teams when creating alerts with this destination.
Instructions for generating this URL can be found below.

# Microsoft Teams integration using Workflows

## Microsoft Workflows

The existing Microsoft 365 (previously called Office 365) connectors and webhooks across all cloud platforms are planned for retirement starting 8/15/2024 with plans to disable the ability to create new connectors and webhooks. Followed by connectors and webhook's functionality ceasing at the end of the year. Power Automate workflows are the intended solution to replace the connectors and webhooks.

This document is focused on how Conduktor console integrates with workflows in place of the webhooks which are used with Microsoft teams to handle alerting from Conduktor's monitoring.

Note: We currently only support alerting to a single Microsoft Teams room.  This room must also be a Microsoft Teams "standard room" and not a "shared" room.

## Workflows Setup Instructions

1.  Open the Workflows app within the chat or channel by right-clicking on the conversation, or by clicking on More options (…) then selecting Workflows.

import Workflows1 from './assets/workflows-1.png';

<img src={Workflows1} alt="Workflows" style={{ width: 400, display: 'block', margin: 'auto' }} />

2.  In the Workflow app, click on the "+ New flow" button, or select the Create tab and choose "Post to a channel when a webhook request is received" template.

import Workflows2 from './assets/workflows-2.png';

<img src={Workflows2} alt="Workflows" style={{ width: 700, display: 'block', margin: 'auto' }} />

3.  Choose a name for this flow, you can use the default "Post to a channel when a webhook request is received". And choose who will own this workflow, it should default to the user you are using to log into teams. Then click Next.

import Workflows3 from './assets/workflows-3.png';

<img src={Workflows3} alt="Workflows" style={{ width: 700, display: 'block', margin: 'auto' }} />

4.  Pick which team and which channel to post to, then click on Create flow. This page usually takes a bit to load.

import Workflows4 from './assets/workflows-4.png';

<img src={Workflows4} alt="Workflows" style={{ width: 700, display: 'block', margin: 'auto' }} />

5.  Once you click on click on Create flow from the previous step, the next page should show you the URL for the webhook associated with the workflow you just created. Copy and paste this somewhere as it will be used in a later step. Then click done.

6.  Go back to the Home tab in workflow, and edit the newly created workflow by click on more options(...) then Edit.

import Workflows5 from './assets/workflows-5.png';

<img src={Workflows5} alt="Workflows" style={{ width: 700, display: 'block', margin: 'auto' }} />

7.  On this page:
    1.  Expand the first step "When a Teams webhook request is received" to see the URL endpoint again if you failed to save it from the previous step. You can also change who can trigger the flow, for this example we will use "Anyone".
    2.  Expand the second step and select "attachments" from Select an output from previous steps, then in the sub step select "content" from Adaptive Card. Everything else should be filled in, however here you can choose a different channel if you want to change the options selected during Workflow creation.

import Workflows6 from './assets/workflows-6.png';

<img src={Workflows6} alt="Workflows" style={{ width: 800, display: 'block', margin: 'auto' }} />

8.  Head to Teams integration on Conduktor console, and configure the connection using the URL found in previous steps. You can test your connection and see whether or not it fails on console before saving the configuration.
    1.  Currently with the new workflow integration it will NOT show in the Teams channel where the workflow is configured whether or not the Conduktor integration test connection is successful. Previously with webhooks, it will confirm with a message in the Teams channel.

import Workflows7 from './assets/workflows-7.png';

<img src={Workflows7} alt="Workflows" style={{ width: 600, display: 'block', margin: 'auto' }} />

9.  Fire some alerts and you should now see alert messages being posted in Microsoft teams under the channel you specified

import Workflows8 from './assets/workflows-8.png';

<img src={Workflows8} alt="Workflows" style={{ width: 600, display: 'block', margin: 'auto' }} />
