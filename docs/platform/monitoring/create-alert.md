---
sidebar_position: 3
title: Create Alert
description: Learn how to create an alert in Monitoring
---

# Create an Alert

:::info
Alerting is an Enterprise feature. Please [contact us](https://www.conduktor.io/contact) to discuss getting access.
:::

## Overview

Our alerting solution will enable you to react to Kafka infrastructure and application irregularties. Currently, we integrate with **Slack** so that you can receive real-time notifications.

If you require an additional integration, please [let us know](https://product.conduktor.help/tabs/1-in-development) so we can consider it.

## Configure Slack

From within Monitoring, navigagte to the **Alerts** tab. If you have not yet configured the Slack integration, then follow the link to set this up as a pre-requisite.

If you have any issues with this process, please [contact us](https://conduktor.io/contact)

![monitoring-configure](/img/monitoring/monitoring-configure.png)

## Create an Alert

### Option 1: From the Alerts Tab

Once you have configured Slack, click the **+ New Alert** button from within the **Alerts** tab.

Fill in the:

- **Name**: Unique name to identify your alert
- **Graph**: The metric you wish to create an alert on
- **Broker / Topic / Consumer Group**: Further options to filter your alert granularity
- **Operator**: The operator used to define your alert condition (for example, greater than or less than)
- **Value**: The value to use as threshold for the alert
- **Comments**: Any additional comments to share with your colleagues

![monitoring-alert-1](/img/monitoring/monitoring-alert-1.png)

### Option 2: Create Alert from Graph

Alternatively, you can create an alert more dynamically when viewing a graph.

Next to each graph, you have a **+** button that can be used to create the alert.

![monitoring-alert-1](/img/monitoring/monitoring-alert-2.png)
