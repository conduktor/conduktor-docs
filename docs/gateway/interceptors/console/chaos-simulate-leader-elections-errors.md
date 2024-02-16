---
version: 2.6.0
title: Simulate leader election errors
description: Ensure that Kafka applications are resilient to errors returned during a leader election.
parent: console
license: enterprise
---

## Introduction

This interceptor is useful for testing applications to ensure they can survive leader election that happen:

- When the leader dies, and another one needs to take over
- When we do rolling upgrades

By sending

- LEADER_NOT_AVAILABLE
- NOT_LEADER_OR_FOLLOWER
- BROKER_NOT_AVAILABLE

## Configuration

| key           | type | description                                                                              |
|:--------------|:-----|:-----------------------------------------------------------------------------------------|
| rateInPercent | int  | The percentage of requests that will result in a leader or broker not available response |

## Example

```json
{
  "name": "mySimulateLeaderElectionsErrorsPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.chaos.SimulateLeaderElectionsErrorsPlugin",
  "priority": 100,
  "config": {
    "rateInPercent": 100
  }
}
```