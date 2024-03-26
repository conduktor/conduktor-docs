---
version: 3.0.0
title: Audit
description: Protect your Kafka environment by knowing who is doing what in your Gateway.
parent: data-security
license: enterprise
formid: 09b52407-1ab1-4bfb-bb10-3e68d573651d
---

## Introduction

This interceptor support to log information from api key request. User need to inject this interceptor and
implement `ApiKeyAuditLog` interface for their audit.

The current list of Kafka API requests that this interceptor supports for audit is:

- ProduceRequest (PRODUCE)
- FetchRequest (FETCH)
- CreateTopicRequest (CREATE_TOPICS)
- DeleteTopicRequest (DELETE_TOPICS)
- AlterConfigRequest (ALTER_CONFIGS)

## Configuration

| name            | type         | default | description                                                             |
|:----------------|:-------------|:--------|:------------------------------------------------------------------------|
| topic           | String       | `.*`    | Topics that match this regex will have the interceptor applied          |
| apiKeys         | Set[string]  |         | Set of kafka api keys to be audited                                     |
| vcluster        | String       | `.*`    | vcluster that match this regex will have the interceptor applied        |
| username        | String       | `.*`    | username that match this regex will have the interceptor applied        |
| consumerGroupId | String       | `.*`    | consumerGroupId that match this regex will have the interceptor applied |
| topicPartitions | Set[Integer] |         | Set of topic partitions to be audited                                   |

## Example

```json
{
  "name": "myAuditInterceptorPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.AuditPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "apiKeys": [
      "PRODUCE",
      "FETCH"
    ],
    "vcluster": ".*",
    "username": ".*",
    "consumerGroupId": ".*",
    "topicPartitions": [
      1,
      2
    ]
  }
}
```