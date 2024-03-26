---
version: 3.0.0
title: Consumer group policy
description: Ensure smooth Kafka consumer group operation by enforcing configuration policies.
parent: governance
license: enterprise
---

## Introduction

The consumer group policy interceptor is designed to enhance the reliability and efficiency of Kafka consumer group operations.

By enforcing specific configuration policies, it ensures that consumer groups adhere to predefined rules, thereby preventing potential issues.

### What happens when sending an invalid request

For example: you configure consumer with groupId is `invalid_group_id`, but the interceptor is being configured `groupId=conduktor_group_id.*`.

### on `BLOCK`

Any request that doesn't match the interceptor's configuration will be blocked and return the corresponding error message.

When a consumer sends that configuration to the cluster, the following error is returned:

```sh 
org.apache.kafka.common.errors.PolicyViolationException: 
Request parameters do not satisfy the configured policy. GroupId 'invalid_group_id' is invalid.`
```

### on `INFO`

`invalid_group_id` is still accepted and you will receive an audit record with the following error: `Request parameters do not satisfy the configured policy. GroupId 'invalid_group_id' is invalid.`

## Configuration

| key                | type                | description                          |
|:-------------------|:--------------------|:-------------------------------------|
| groupId            | [Regex](#regex)     | Configuration for groupId.           |
| sessionTimeoutMs   | [Integer](#integer) | Configuration for session timeout.   |
| rebalanceTimeoutMs | [Integer](#integer) | Configuration for rebalance timeout. |
| memberId           | [Regex](#regex)     | Configuration for memberId.          |
| groupInstanceId    | [Regex](#regex)     | Configuration for groupInstanceId.   |

### Regex

| key    | type              | default  | description                                                                         |
|:-------|:------------------|:---------|:------------------------------------------------------------------------------------|
| value  | String            |          | Value as a regex, request values matching this regex will have interceptor applied. |
| action | [Action](#action) | `BLOCK`  | Action to take if the value is outside the specified range.                         |

### Integer

| key           | type              | default | description                                                                |
|:--------------|:------------------|:--------|:---------------------------------------------------------------------------|
| min           | int               |         | Minimum value for the configuration.                                       |
| max           | int               |         | Maximum value for the configuration.                                       |
| action        | [Action](#action) | `BLOCK` | Action to take if the value is outside the specified range.                |
| overrideValue | int               |         | Value to override with (only applicable when action is set to `OVERRIDE`). |


### Action

- `BLOCK` → when fail, save in audit and return error.
- `INFO` → execute API with wrong value, save in audit.
- `OVERRIDE` → execute API with `overrideValue` values, save in audit the fact that we updated on the fly (with wrong value, and the one we used to fix them).

## Example

```json
{
  "name": "myConsumerGroupPolicyPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin",
  "priority": 100,
  "config": {
    "groupId": {
      "value": "group.*",
      "action": "BLOCK"
    },
    "sessionTimeoutMs": {
      "max": 60000,
      "action": "INFO"
    },
    "rebalanceTimeoutMs": {
      "min": 30000,
      "action": "OVERRIDE",
      "overrideValue": 40000
    },
    "memberId": {
      "value": "member.*",
      "action": "INFO"
    },
    "groupInstanceId": {
      "value": "groupInstance.*",
      "action": "BLOCK"
    }
  }
}

```