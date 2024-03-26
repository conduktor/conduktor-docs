---
version: 3.0.0
title: Simulate latency on all interactions
description: Validate your application behaves correctly when there are delays in responses from the Kafka cluster.
parent: console
license: enterprise
---

## Introduction

This interceptor adds latency to a percentage of requests and responses flowing between your Kafka applications and your Kafka cluster.

This interceptor is useful for testing applications to ensure that they behave appropriately when there are network delays talking to Kafka, or the Kafka broker is for some reason responding slowly.

## Configuration

| key               | type | description                                                                                                                                                                                                                                                           |
|:------------------|:-----|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| appliedPercentage | int  | The percentage of requests flowing through the gateway that will have increased latency applied for them. For example, an applied percentage of 10 will add a latency of the value of latencyMs to 10% of requests and responses. The value must be between 0 and 10. |
| latencyMs         | long | The number of milliseconds to add to the request. The latency in milliseconds that will be applied to the requests and responses flowing through the gateway. The value must be between 0 and (don't mind... max int, or 10 seconds, or something else)?              |

## Example

```json
{
  "name": "mySimulateLatencyInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.chaos.SimulateLatencyPlugin",
  "priority": 100,
  "config": {
    "appliedPercentage": 100,
    "latencyMs": 1000
  }
}
```