---
version: 2.6.0
title: Read only topic policy
description: Mark a topic as readonly
parent: governance
license: enterprise
---

## Introduction

The read only topic policy interceptor allows you to define some topics to be "Read-only".

This means that any mutating requests are denied. For example, produce requests are blocked, as are any requests that
alter or delete topics.

The full list of Kafka API requests that this interceptor blocks for the specified topics is:

- ProduceRequest
- DeleteTopicsRequest
- AlterConfigsRequest
- AlterPartitionReassignmentsRequest
- AlterPartitionRequest
- CreatePartitionsRequest
- IncrementalAlterConfigsRequest
- DeleteRecordsRequest
- ElectLeadersRequest
- AlterReplicaLogDirsRequest

### What happens when sending a request to a read-only topic

If an attempt is made to send a request to a read-only topic, the following error will be returned, such  as: 

```sh
org.apache.kafka.common.errors.TopicAuthorizationException: 
Not authorized to access topics: [topic name]
```

## Configuration

| config | type                | default   | description                                                     |
|:-------|:--------------------|:----------|:----------------------------------------------------------------|
| topic  | String              | `.*`      | Topics that match this regex will have the interceptor applied. |
| action | [Action](#action)   | `BLOCK`   | Action to take if the value is outside the specified range.     |

### Action

- `BLOCK` → when fail, save in audit and return error.
- `INFO` → execute API with wrong value, save in audit.

## Example

```json
{
  "name": "myReadOnlyTopicPolicyPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ReadOnlyTopicPolicyPlugin",
  "priority": 100,
  "config": {
    "topic": "client_topic_.*",
    "action": "BLOCK"
  }
}
```