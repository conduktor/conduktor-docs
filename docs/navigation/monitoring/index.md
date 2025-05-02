---
sidebar_position: 1
title: Monitoring
displayed: false
description: Learn how to get started with Monitoring
---

# Monitoring


## Overview

Conduktor Monitoring gives you insight into the most important Kafka metrics. To set it up you will need to [configure a Cortex instance](/platform/get-started/configuration/cortex/) which is not complicated, and it integrates easily with existing systems.

![Monitoring](/images/changelog/platform/v28/topic-monitoring.png)

## Ops Monitoring

To support understanding of your Kafka infrastructure healthiness, we can help you monitor:

- Cluster health state
- Partitions health state
- Topic activity
- Topic storage

See [metrics](/platform/navigation/monitoring/metrics/) for more information.

## Application Monitoring

To support understanding of your Kafka applications state, we help you monitor:

- Consumer group state
- Consumer group lag

See [metrics](/platform/navigation/monitoring/metrics/) for more information.

## Alerting

We enable real-time notifications on built-in and custom alerts. [Alerts](/platform/navigation/settings/alerts) can be made at a topic granularity and with configurable thresholds. We currently support alerting via **Slack** and **MS Teams**.
