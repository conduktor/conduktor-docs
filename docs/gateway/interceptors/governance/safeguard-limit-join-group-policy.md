---
version: 3.0.0
title: Limit Join Group Policy
description: Avoid excessive group reblances by limiting the number of consumer group joins.
parent: governance
license: enterprise
---

## Introduction

Limit join group policy limits joinGroup attempts on the same `groupId` within a minute.


If joinGroups attempts hit more than limitation in specific duration, it will respond `PolicyViolationException`.

## Configuration

| key                    | type               | default | description                                                                    |
|:-----------------------|:-------------------|:--------|:-------------------------------------------------------------------------------|
| groupId                | String             | `.*`    | groupId regex, groupId that match this regex will have the interceptor applied |
| maximumJoinsPerMinute  | int                |         | Maximum joinGroup attempts on the same `groupId` within a minute.              |
| action                 | [Action](#action)  |         | Action to take if the value is outside the specified range.                    |
| throttleTimeMs         | int                | 100     | Value to throttle with (only applicable when action is set to `THROTTLE`).     |

### Action

- `BLOCK` → when fail, save in audit and return error.
- `INFO` → execute API with wrong value, save in audit.
- `THROTTLE` → when fail, save in audit and the request will be throttled with time = `throttleTimeMs`.

## Example

```json
{
  "name": "limit-join-group-policy",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.LimitJoinGroupPolicyPlugin",
  "priority": 100,
  "config": {
    "groupId": "myGroupId.*",
    "maximumJoinsPerMinute": 5,
    "action": "BLOCK"
  }
}
```