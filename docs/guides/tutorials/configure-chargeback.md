---
sidebar_position: 3
title: Configure Chargeback
displayed: false
description: Configure Chargeback
---

## Overview

<GlossaryTerm>Chargeback</GlossaryTerm> allows organizations to track and allocate costs/usage associated with Kafka resources to different teams or departments based on their data consumption and processing, facilitating cost accountability and management.

Currently, the tracked metrics are: **bytes produced and consumed by service accounts**. We'll be adding more metrics soon.

## Pre-requisites

Chargeback requires both Console and Gateway:

- Console 1.29.0+
- Gateway 3.4.0+

## Configuration

To enable the Chargeback in <GlossaryTerm>Console</GlossaryTerm>:

1. Go to **Settings** > **Clusters** and select your cluster.
1. In the **Provider** tab, Select **Gateway** and enter API details with the default virtual cluster value of `passthrough`.

    ![Gateway provider](/guides/gateway-provider.png)

1. Deploy the [Chargeback Interceptor](/gateway/interceptors/observability/chargeback) on Gateway. This can be done through Console UI or using the Gateway API/[CLI](/gateway/reference/cli-reference)

  ```yaml
  apiVersion: gateway/v2
  kind: Interceptor
  metadata:
    name: observability-interceptor
  spec:
    pluginClass: "io.conduktor.gateway.interceptor.observability.ObservabilityPlugin"
    priority: 100
    config:
      topicName: observability # name of the Topic where the Chargeback data will be stored
      replicationFactor: 3
      flushIntervalInSecond: 300
  ```

After a few minutes, you should see your active service accounts appear on the **Chargeback** page in Console.
