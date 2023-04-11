---
sidebar_position: 1
title: Overview
description: Learn how to get started with Monitoring
---

# Monitoring

:::info
Monitoring is changing to improve the ease of setup and usability. [Find out more](/platform/support/important-notices#monitoring-is-changing-january-27-2023).
:::

## Overview

Conduktor Monitoring gives you insight into the most important Kafka metrics. There is no complicated setup and it integrates easily with existing systems.

Currently, Monitoring fully supports:

- Open-source Apache Kafka
- Confluent OSS

However, [Application Monitoring](#application-monitoring) and most core metrics are available for all Kafka providers.

![Monitoring](/img/monitoring/monitoring-intro.webp)

## Ops Monitoring

To support understanding of your Kafka infrastructures healthiness, we can help you monitor:

- Cluster health state
- Partitions health state
- Topic activity
- Topic storage

See [metrics](metrics.md) for more information.

## Application Monitoring

To support understanding of your Kafka applications state, we help you monitor:

- Consumer group state
- Consumer group lag

See [metrics](metrics.md) for more information.

## Alerting

We enable real-time notifications on built-in and custom alerts. Alerts can be made at a topic granularity and with configurable thresholds. Note that we currently support alerting via **Slack**. // TODO Slack and Teams
