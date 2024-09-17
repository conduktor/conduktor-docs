---
version: 3.0.0
title: Limit Commit Offset Policy
description: Limits commit offset attempts on the same `groupId` within a minute.
parent: governance
license: enterprise
---

## Introduction

Limit Commit Offset Policy limits commit offset attempts on the same `groupId` within a minute.

If commit offset attempts hit more than limitation in specific duration, it will respond `PolicyViolationException`.

## Configuration

| key                     | type              | Default | description                                                                     |
|:------------------------|:------------------|:--------|:--------------------------------------------------------------------------------|
| groupId                 | String            | `.*`    | groupId regex, groupId that match this regex will have the interceptor applied. |
| maximumCommitsPerMinute | int               |         | Maximum commit offset attempts on the same `groupId` within a minute            |
| action                  | [Action](#action) | `BLOCK` | Action to take if the value is outside the specified range.                     |
| throttleTimeMs          | int               | 100     | Value to throttle with (only applicable when action is set to `THROTTLE`).      |

### Action

- `BLOCK` → when fail, save in audit and return error.
- `INFO` → execute API with wrong value, save in audit.
- `THROTTLE` → when fail, save in audit and the request will be throttled with time = `throttleTimeMs`.

## Example

```json
{
  "name": "limit-commit-offset-policy",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
  "priority": 100,
  "config": {
    "groupId": "myGroupId.*",
    "maximumCommitsPerMinute": 5,
    "action": "BLOCK"
  }
}
```