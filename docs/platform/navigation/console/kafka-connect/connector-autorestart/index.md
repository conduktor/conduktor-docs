---
sidebar_position: 5
title: Connector Auto-restart
description: Schema Registry in Conduktor Platform handles the distribution and synchronization of schemas to the producer and consumer for Kafka.
---

Sometimes, Kafka Connect tasks experience failures due to transient issues:
- A database which isn't available for a few minutes
- A networking issue
- ...

When this happens, Kafka Connect tasks shut down and you need to manually start the tasks again.

## Enable Auto-restart
Console lets you enable **Auto-restart** on any connector instance. Once enabled, you can additionally configure the **delay** (default 10 minutes) between 2 consecutive restart attempts.
### How Auto-restart works
**Every minute**, Console will check for failed tasks for this Connector. If there are some failed tasks:
- If the Auto-restart process haven't tried to restart the task in the past **10 minutes** (configurable):
  - Capture the task error message
  - Restart the failed task
- Otherwise do nothing

## Auto-restart history
You can review all the occurrences when Auto-restart triggered and what was the error message of the failed task before restarting.

![Kafka Connect auto-restart](../img/connector-details-autorestart.png)

