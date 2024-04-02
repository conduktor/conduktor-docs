---
version: 3.0.0
title: Alter Broker Config Policy
description: Ensuring your broker configuration adheres to your own standards.
parent: governance
license: enterprise
---

## Introduction

`The alter broker config policy interceptor` will impose limits on configuration changes to ensure that any configuration changed in the cluster adhere to the configured specification.

The full list of Kafka configurations that this interceptor protects is:

- log.retention.bytes
- log.retention.ms
- log.segment.bytes

### What happens when sending an invalid request

Any request that doesn't match the interceptor's configuration will be blocked and return the corresponding error  message.

For example: you want to change the configuration log.retention.ms = 10000, but the interceptor is being configured minLogRetentionMs=60000.

When you send that request to the cluster, the following error is returned:

`org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. log.retention.ms is '1', must not be less than '10'`

## Configuration

The configuration table now includes the updated structure for the configuration values.

| key               | type                    | description                                     |
|:------------------|:------------------------|:------------------------------------------------|
| blacklist         | [BlackList](#blacklist) | Blacklist of properties which cannot be changed |
| logRetentionBytes | [Long](#long)           | Configuration for log.retention.bytes           |
| logRetentionMs    | [Long](#long)           | Configuration for log.retention.ms              |
| logSegmentBytes   | [Long](#long)           | Configuration for log.segment.bytes             |

### BlackList

| key    | type                 | description                                                     |
|:-------|:---------------------|:----------------------------------------------------------------|
| values | Set[String]          | A set of string that contains properties that cannot be changed |
| action | [Action](#action)    | Action to take if the value is outside the specified range.     |

### Long

| key           | type              | description                                                                |
|:--------------|:------------------|:---------------------------------------------------------------------------|
| min           | double            | Minimum value for the configuration.                                       |
| max           | double            | Maximum value for the configuration.                                       |
| action        | [Action](#action) | Action to take if the value is outside the specified range.                |
| overrideValue | double            | Value to override with (only applicable when action is set to `OVERRIDE`). |

### Action

- `BLOCK` → when fail, save in audit and return error.
- `INFO` → execute API with wrong value, save in audit.
- `OVERRIDE` → execute API with `overrideValue` values, save in audit the fact that we updated on the fly (with wrong value, and the one we used to fix them).

## Example

```json
{
  "name": "myAlterBrokerConfigPolicy",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.AlterBrokerConfigPolicyPlugin",
  "priority": 100,
  "config": {
    "logRetentionBytes": {
      "min": 10,
      "max": 100,
      "action": "BLOCK"
    },
    "logRetentionMs": {
      "min": 10,
      "max": 100,
      "action": "OVERRIDE",
      "overrideValue": 20
    },
    "logSegmentBytes": {
      "min": 10,
      "max": 100,
      "action": "INFO"
    }
  }
}
```