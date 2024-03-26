---
version: 3.0.0
title: Simulate message corruption
description: Validate malformed messages are handled by you consumer applications.
parent: console
license: free
---

## Introduction

From time to time, messages will arrive that are not in the expected format.

This interceptor adds a random bytes to the end of the data in records produced to Kafka.

## Configuration

| key           | type   | default | description                                                        |
|:--------------|:-------|:--------|:-------------------------------------------------------------------|
| topic         | String | `.*`    | Regular expression that matches topics from your produce request.  |
| sizeInBytes   | int    | `10`    | Number of random content bytes to append to the message data.      |
| rateInPercent | int    | `100`   | percentage of records that will have random bytes appended.        |

You can simulate corruption when:

* *sending* data: `io.conduktor.gateway.interceptor.chaos.ProduceSimulateMessageCorruptionPlugin`
* *reading data:`io.conduktor.gateway.interceptor.chaos.FetchSimulateMessageCorruptionPlugin`

## Example

```json
{
  "name": "mySimulateMessageCorruptionInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.chaos.FetchSimulateMessageCorruptionPlugin",
  "priority": 100,
  "config": {
    "topic": "client_topic_.*",
    "sizeInBytes": 100,
    "rateInPercent": 100
  }
}
```