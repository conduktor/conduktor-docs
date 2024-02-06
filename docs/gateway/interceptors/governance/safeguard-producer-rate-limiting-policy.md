---
version: 2.5.0
title: Producer rate limiting policy
description: Add produce throughput quota policy
parent: governance
license: enterprise
---

## Introduction

Kafka uses per broker quotas to throttle the volume of data reaching each broker.

Throttling across the cluster is not possible using default Apache Kafka.

Additionally, if you are using a hosted Kafka instance you don't have access to the Kafka configuration to set quotas.

This interceptor limits throughput at a per Gateway scope, throttling producer throughput on either a global or a per vcluster basis.

## Configuration

| key                   | default | type              | description                                                |
|:----------------------|:--------|:------------------|:-----------------------------------------------------------|
| maximumBytesPerSecond |         | int               | Maximum bytes which is allowed to produce within a second  |
| action                | `BLOCK` | [Action](#action) | Action to take if the value is outside the specified range |

### Action

- `BLOCK` → when threshold is reached, throttle and save an error in audit.
- `INFO` → when threshold is reached, do not throttle but save in audit a warn.

## Example

```json
{
  "name": "myProducerRateLimitingPolicyPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin",
  "priority": 100,
  "config": {
    "maximumBytesPerSecond": 500,
    "action": "BLOCK"
  }
}
```

If we get produced size more than 500 bytes at 600 millisecond of a second, producer will be throttled by 400
milliseconds.
