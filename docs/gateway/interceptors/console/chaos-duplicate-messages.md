---
version: 3.0.0
title: Duplicate Messages
description: Validate your application behaves correctly when duplicate records arise
parent: console
license: enterprise
---

## Introduction

Duplicate Messages will duplicate records when the client produces/consumes the records to/from kafka.

This interceptor is useful for testing applications to ensure that they behave appropriately when there are duplicate records received from Kafka.

*Note: By default, duplicate messages causes chaos on **fetch**, therefore this plugin only duplicates the records returned to the client, the records on the broker are not duplicated*

For example, you could have a message that says "Add £10 to a bank account, Unique Message Id is 12345".

That message is duplicated. The unique id is the same in both.

The client application needs to be validated to ensure that it only receives £10 once.

## Configuration

| key           | type    | default   | description                                                                                                |
|:--------------|:--------|:----------|:-----------------------------------------------------------------------------------------------------------|
| topic         | String  | `.*`      | Topics that match this regex will have the interceptor applied.                                            |
| rateInPercent | int     | `100`     | The percentage of records that will be duplicated.                                                         |
| target        | enum    | `CONSUME` | Record is duplicated when the client produces or consumes the record, values can be `PRODUCE` or `CONSUME` |

## Example

```json
{
  "name": "myDuplicateRecordsInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.chaos.DuplicateMessagesPlugin",
  "priority": 100,
  "config": {
    "topic": "client_topic_.*",
    "rateInPercent": 100,
    "target": "PRODUCE"
  }
}
```