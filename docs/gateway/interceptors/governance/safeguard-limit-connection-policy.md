---
version: 2.6.0
title: Limit Connection Policy
description: Limits connection attempts
parent: governance
license: enterprise
---

## Introduction

Limit connection policy limits connection attempts within a second because creating a new connection is expensive.

If connection attempts hit more than limitation in specific duration, it will respond `PolicyViolationException`.

## Configuration

| key                         | type              | default | description                                                 |
|:----------------------------|:------------------|:--------|:------------------------------------------------------------|
| maximumConnectionsPerSecond | int               |         | Maximum connections which is allowed within a second        |
| action                      | [Action](#action) | `BLOCK` | Action to take if the value is outside the specified range. |

### Action

- `BLOCK` → when fail, save in audit and return error.
- `INFO` → execute API with wrong value, save in audit.

## Example

```json
{
  "name": "myLimitConnectionPolicyPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
  "priority": 100,
  "config": {
    "maximumConnectionsPerSecond": 5,
    "action": "BLOCK"
  }
}
```