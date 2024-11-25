---
version: 3.4.0
title: Chargeback
description: Track and allocate costs and usage associated with Kafka resources to different teams or departments based on their data consumption and processing
parent: observability
license: enterprise
---

## Introduction

This interceptor will watch produce and consume to store metrics about incoming and outgoing traffic in bytes in a topic.
This topic will be latter used by console to display metrics such as chargeback.

## Configuration
| name              | type   | default | description                                                                      |
|:------------------|:-------|:--------|:---------------------------------------------------------------------------------|
| topicName         | String |         | Topics used to store metrics. if already exists, it must have only one partition |
| replicationFactor | Int    |         | The replication factor to set if gateway need to create the topic.               |

## Example

```json
{
  "name": "myObservabilityInterceptorPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.observability.ObservabilityPlugin",
  "priority": 100,
  "config": {
    "topicName": "observability",
    "replicationFactor": 3
  }
}
```