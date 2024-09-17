---
version: 3.0.0
title: Simulate Slow Brokers
description: Validate your application behaves correctly when there are delays in responses from the Kafka cluster.
parent: console
license: enterprise
---

## Introduction

This interceptor slows responses from the brokers.

This only works on Produce requests and Fetch requests.

## Configuration

| key           | type | description                                                       |
|:--------------|:-----|:------------------------------------------------------------------|
| rateInPercent | int  | The percentage of requests that will have the interceptor applied |
| minLatencyMs  | int  | Minimum for the random response latency in milliseconds           |
| maxLatencyMs  | int  | Maximum for the random response latency in milliseconds           |

## Example

```json
{
  "name": "mySimulateSlowBrokerInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.chaos.SimulateSlowBrokerPlugin",
  "priority": 100,
  "config": {
    "rateInPercent": 100,
    "minLatencyMs": 50,
    "maxLatencyMs": 1200
  }
}
```