---
version: 3.0.0
title: Simulate slow producers and consumers
description: Validate your application behaves correctly when there are delays in responses from the Kafka cluster.
parent: console
license: enterprise
---

## Introduction

This interceptor slows responses from the brokers.

It will operate only on a set of topics rather than all traffic.

This interceptor only works on Produce requests and Fetch requests.

## Configuration

| key           | type    | default | description                                                     |
|:--------------|:--------|:--------|:----------------------------------------------------------------|
| topic         | String  | `.*`    | Topics that match this regex will have the interceptor applied. |
| rateInPercent | int     |         | The percentage of requests that will apply this interceptor     |
| minLatencyMs  | int     |         | Minimum for the random response latency in milliseconds         |
| maxLatencyMs  | int     |         | Maximum for the random response latency in milliseconds         |

## Example

```json
{
  "name": "mySimulateSlowProducersConsumersInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.chaos.SimulateSlowProducersConsumersPlugin",
  "priority": 100,
  "config": {
    "rateInPercent": 100,
    "minLatencyMs": 50,
    "maxLatencyMs": 1200
  }
}
```
