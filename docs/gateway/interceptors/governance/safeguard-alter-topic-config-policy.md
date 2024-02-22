---
version: 2.6.0
title: Alter Topic Config Policy
description: Ensuring your topic configuration adheres to your own standards.
parent: governance
license: enterprise
---

## Introduction

The alter topic config policy interceptor will impose limits on configuration changes to ensure that any configuration changed in the topic adhere to the configured specification.

The full list of Kafka configurations that this interceptor protects is:

- retention.ms
- retention.bytes
- segment.ms
- segment.bytes
- segment.jitter.ms
- flush.messages
- flush.ms
- max.message.bytes
- min.insync.replicas
- cleanup.policy
- unclean.leader.election.enable

### What happens when sending an invalid request:

Any request that doesn't match the interceptor's configuration will be blocked and return the corresponding error  message.

For example: 

you want to change the configuration `retention.ms = 10000`.
But the interceptor is being configured `minRetentionMs=60000`. 

When you send that request to the cluster, the following error is returned:

```sh
org.apache.kafka.common.errors.PolicyViolationException: 
Request parameters do not satisfy the configured policy. retention.ms is '1', must not be less than '10'
```

## Configuration

| key                         | type                            | default | description                                                    |
|:----------------------------|:--------------------------------|:--------|:---------------------------------------------------------------|
| topic                       | String                          | `.*`    | Topics that match this regex will have the interceptor applied |
| blacklist                   | [BlackList](#blacklist)         |         | Blacklist of properties which cannot be changed                |
| retentionMs                 | [Long](#long)                   |         | Configuration for retention.ms                                 |
| retentionBytes              | [Long](#long)                   |         | Configuration for retention.bytes                              |
| segmentMs                   | [Long](#long)                   |         | Configuration for segment.ms                                   |
| segmentBytes                | [Integer](#integer)             |         | Configuration for segment.bytes                                |
| segmentJitterMs             | [Long](#long)                   |         | Configuration for segment.jitter.ms                            |
| flushMessages               | [Long](#long)                   |         | Configuration for flush.messages                               |
| flushMs                     | [Long](#long)                   |         | Configuration for flush.ms                                     |
| maxMessageBytes             | [Integer](#integer)             |         | Configuration for max.message.bytes                            |
| minInsyncReplicas           | [Integer](#integer)             |         | Configuration for min.insync.replicas                          |
| cleanupPolicy               | [Cleanupolicy](#cleanup-policy) |         | Configuration for cleanup.policy                               |
| uncleanLeaderElectionEnable | [Boolean](#boolean)             |         | Configuration for unclean.leader.election.enable               |

### BlackList

| key    | type                  | description                                                     |
|:-------|:----------------------|:----------------------------------------------------------------|
| values | Set[String]           | A set of string that contains properties that cannot be changed |
| action | [Action](#action)     | Action to take if the value is outside the specified range.     |

### Integer

| key           | type                | description                                                                |
|:--------------|:--------------------|:---------------------------------------------------------------------------|
| min           | int                 | Minimum value for the configuration.                                       |
| max           | int                 | Maximum value for the configuration.                                       |
| action        | [Action](#action)   | Action to take if the value is outside the specified range.                |
| overrideValue | int                 | Value to override with (only applicable when action is set to `OVERRIDE`). |

### Long

| key           | type                | description                                                                |
|:--------------|:--------------------|:---------------------------------------------------------------------------|
| min           | double              | Minimum value for the configuration.                                       |
| max           | double              | Maximum value for the configuration.                                       |
| action        | [Action](#action)   | Action to take if the value is outside the specified range.                |
| overrideValue | double              | Value to override with (only applicable when action is set to `OVERRIDE`). |

### Cleanup Policy

| key           | type                  | description                                                                                                                                                                     |
|:--------------|:----------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| values        | Set[String]           | Value for the configuration, should be a set of string that contains values from `delete`, `compact` or specify both policies in a comma-separated list (eg: `delete,compact`). |
| action        | [Action](#action)     | Action to take if the value is outside the specified range.                                                                                                                     |
| overrideValue | String                | Value to override with (only applicable when action is set to `OVERRIDE`).                                                                                                      |
### Boolean

| key    | type              | description                                                                                  |
|:-------|:------------------|:---------------------------------------------------------------------------------------------|
| value  | Boolean           | Value for the configuration. If action is `OVERRIDE`, will use this value for override value |
| action | [Action](#action) | Action to take if the value is outside the specified range.                                  |

### Action

- `BLOCK` → when fail, save in audit and return error.
- `INFO` → execute API with wrong value, save in audit.
- `OVERRIDE` → execute API with `overrideValue` (or `value` for others) values, save in audit the fact that we updated on the fly (with wrong value, and the one we used to fix them)

## Example

```json
{
  "name": "myAlterTopicConfigPolicy",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "retentionMs": {
      "min": 10,
      "max": 100
    },
    "retentionBytes": {
      "min": 10,
      "max": 100,
      "action": "BLOCK"
    },
    "segmentMs": {
      "min": 10,
      "max": 100,
      "action": "INFO"
    },
    "segmentBytes": {
      "min": 10,
      "max": 100,
      "action": "BLOCK"
    },
    "segmentJitterMs": {
      "min": 10,
      "max": 100,
      "action": "INFO",
      "overrideValue": 20
    },
    "flushMessages": {
      "min": 10,
      "max": 100,
      "action": "OVERRIDE",
      "overrideValue": 20
    },
    "flushMs": {
      "min": 10,
      "max": 100,
      "action": "OVERRIDE",
      "overrideValue": 20
    },
    "maxMessageBytes": {
      "min": 10,
      "max": 100,
      "action": "OVERRIDE",
      "overrideValue": 20
    },
    "minInsyncReplicas": {
      "min": 10,
      "max": 100,
      "action": "OVERRIDE",
      "overrideValue": 20
    },
    "cleanupPolicy": {
      "value": [
        "delete",
        "compact"
      ],
      "action": "OVERRIDE"
    },
    "uncleanLeaderElectionEnable": {
      "value": false,
      "action": "BLOCK"
    }
  }
}
```