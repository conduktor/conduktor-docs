---
version: 3.0.0
title: Broken brokers
description: Validate your application behaves correctly when broker errors occur.
parent: console
license: enterprise
---

## Introduction

This interceptor injects intermittent errors in client connections to brokers that are consistent with broker side issues.

This only works on Produce and Fetch requests.

## Configuration

| key           | type | default                                                           | description                                                                    |
|:--------------|:-----|:------------------------------------------------------------------|:-------------------------------------------------------------------------------|
| rateInPercent | int  |                                                                   | The percentage of requests that will result in a broker not available response |
| errorMap      | Map  | `{"FETCH": "UNKNOWN_SERVER_ERROR", "PRODUCE": "CORRUPT_MESSAGE"}` | Map of ApiKeys and Error you want to response                                  |



## Possible Error for Api Key

### [FETCH](https://github.com/apache/kafka/blob/trunk/clients/src/main/java/org/apache/kafka/common/requests/FetchResponse.java#L48-L65)

- OFFSET_OUT_OF_RANGE
- TOPIC_AUTHORIZATION_FAILED
- REPLICA_NOT_AVAILABLE
- NOT_LEADER_OR_FOLLOWER
- FENCED_LEADER_EPOCH
- UNKNOWN_LEADER_EPOCH
- UNKNOWN_TOPIC_OR_PARTITION
- KAFKA_STORAGE_ERROR
- UNSUPPORTED_COMPRESSION_TYPE
- CORRUPT_MESSAGE
- UNKNOWN_TOPIC_ID
- FETCH_SESSION_TOPIC_ID_ERROR,
- INCONSISTENT_TOPIC_ID,
- UNKNOWN_SERVER_ERROR

### [PRODUCE](https://github.com/apache/kafka/blob/trunk/clients/src/main/java/org/apache/kafka/common/requests/ProduceResponse.java#L39-L53)

- CORRUPT_MESSAGE,
- UNKNOWN_TOPIC_OR_PARTITION,
- NOT_LEADER_OR_FOLLOWER,
- INVALID_TOPIC_EXCEPTION,
- RECORD_LIST_TOO_LARGE,
- NOT_ENOUGH_REPLICAS,
- NOT_ENOUGH_REPLICAS_AFTER_APPEND,
- INVALID_REQUIRED_ACKS,
- TOPIC_AUTHORIZATION_FAILED,
- UNSUPPORTED_FOR_MESSAGE_FORMAT,
- INVALID_PRODUCER_EPOCH,
- CLUSTER_AUTHORIZATION_FAILED,
- TRANSACTIONAL_ID_AUTHORIZATION_FAILED,
- INVALID_RECORD

## Example

```json
{
  "name": "myBrokenBrokerChaosInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.chaos.SimulateBrokenBrokersPlugin",
  "priority": 100,
  "config": {
    "rateInPercent": 100,
    "errorMap": {
      "FETCH": "UNKNOWN_SERVER_ERROR",
      "PRODUCE": "CORRUPT_MESSAGE"
    }
  }
}
```