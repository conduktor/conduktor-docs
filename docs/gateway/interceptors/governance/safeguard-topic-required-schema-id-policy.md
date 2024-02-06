---
version: 2.5.0
title: Topic required schema id policy
description: Defend against outages by ensuring that all records produced to Kafka have a schema set.
parent: governance
license: free
---

## Introduction

Ensuring that all records sent through your Kafka system have a schema associated with them ensures data in a known  format for your Kafka consumers.

Records with missing schemas can cause application outages, as consumers may be unable to process the unexpected record format.

The Topic required schema id policy interceptor ensures that all records produced to Kafka have a schema set

See more about schema registry and schema-id [here](https://www.conduktor.io/blog/what-is-the-schema-registry-and-why-do-you-need-to-use-it/)

### What happens when sending an invalid record

Topic required schema id policy interceptor will return the following errors when an invalid record is sent:

| key                     |                                                                                                                          |
|:------------------------|:-------------------------------------------------------------------------------------------------------------------------|
| schemaIdRequired: true  | When sending a record without schemaId: `Request parameters do not satisfy the configured policy. SchemaId is required.` |
| schemaIdRequired: false | When sending a record with schemaId: `Request parameters do not satisfy the configured policy. SchemaId is not allowed.` |

## Configuration

| key               | type                 | default   | description                                                    |
|:-----------------|:---------------------|:----------|:---------------------------------------------------------------|
| topic            | String               | `.*`      | Topics that match this regex will have the interceptor applied |
| schemaIdRequired | Boolean              |           | Records must/must not have schemaId                            |
| action           | [Action](#action)    | `BLOCK`   | Action to take if the value is outside the specified range     |


## Action

- `BLOCK` → when fail, save in audit and return error.
- `INFO` → execute API with wrong value, save in audit.

## Example

```json
{
  "name": "myTopicRequiredSchemaIdPolicyInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.TopicRequiredSchemaIdPolicyPlugin",
  "priority": 100,
  "config": {
    "topic": "topic_1.*",
    "schemaIdRequired": true,
    "action": "BLOCK"
  }
}
```