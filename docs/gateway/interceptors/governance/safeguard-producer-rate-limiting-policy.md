---
version: 3.0.0
title: Producer Rate Limiting Policy
description: Add produce throughput quota policy
parent: governance
license: enterprise
---

## Introduction

Kafka uses per broker quotas to throttle the volume of data reaching each broker.

Throttling across the cluster is not possible using default Apache Kafka.

Additionally, if you are using a hosted Kafka instance you don't have access to the Kafka configuration to set quotas.

This interceptor improves the throttling story by limiting throughput at a per Gateway scope, throttling produce
throughput on either a global or per vcluster(tenant) basis.
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

The maximum number of bytes that can be produced in any one second, before being throttled. In the above example only 500 bytes are allowed to be produced per second, before being throttled.
