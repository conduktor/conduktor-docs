---
version: 3.0.0
title: Fetch Policy
description: Increase resilience by ensuring that the fetch request adheres to the specified configuration requirements.
parent: governance
license: enterprise
---

## Introduction

`The fetch policy interceptor` will be able to encourage (log) or block fetch requests that do not meet the specified configuration.


### What happens when sending an invalid request

Any request that doesn't match the interceptor's configuration will be blocked and return the corresponding error message.

For example: you want to send fetch request with isolationLevel=read_committed, but the interceptor is being configured `isolationLevel=read_uncommitted`.

When you send that request to the cluster, consumer will retry the request and the following error is logged in the gateway:

```sh
org.apache.kafka.common.errors.PolicyViolationException: 
Request parameters do not satisfy the configured policy. Topic 'topicName' with isolationLevel is READ_UNCOMMITTED, must be READ_COMMITTED
```

## Configuration

| key            | type                                              | default | description                                                                                                           |
|:---------------|:--------------------------------------------------|:--------|:----------------------------------------------------------------------------------------------------------------------|
| topic          | String                                            | `.*`    | Topics that match this regex will have the interceptor applied. If no value is set, it will be applied to all topics. |
| isolationLevel | [IsolationLevel](#isolation-level)                |         | Configuration for isolation level                                                                                     |
| rackIdRequired | [Boolean](#boolean)                               |         | Configuration of rankId usage                                                                                         |
| fetchMaxBytes  | [SafeguardIntegerConfig](#safeguardIntegerConfig) |         | Configuration for maxBytes                                                                                            |
| fetchMinBytes  | [SafeguardIntegerConfig](#safeguardIntegerConfig) |         | Configuration for minBytes                                                                                            |
| maxWaitMs      | [SafeguardIntegerConfig](#safeguardIntegerConfig) |         | Configuration for maxWaitMs                                                                                           |
| version        | [Version](#version)                               |         | Configuration for fetch version                                                                                       |


### Isolation Level

| key    | type                    | default | description                                                 |
|:-------|:------------------------|:--------|:------------------------------------------------------------|
| value  | [Isolation](#isolation) |         | Isolation level for fetch request                           |
| action | [Action](#action)       | `BLOCK` | Action to take if the value is outside the specified range. |

### Boolean

| key    | type                  | default | description                                                 |
|:-------|:----------------------|:--------|:------------------------------------------------------------|
| value  | Boolean               |         | Value for the configuration                                 |
| action | [Action](#action)     | `BLOCK` | Action to take if the value is outside the specified range. |

### Version

| key    | type              | default | description                                                 |
|:-------|:------------------|:--------|:------------------------------------------------------------|
| min    | int               |         | Minimum value of fetch version                              |
| max    | int               |         | Maximum value of fetch version                              |
| action | [Action](#action) | `BLOCK` | Action to take if the value is outside the specified range. |

### SafeguardIntegerConfig

| key    | type              | default | description                                                 |
|:-------|:------------------|:--------|:------------------------------------------------------------|
| min    | int               |         | Minimum value of property                                   |
| max    | int               |         | Maximum value of property                                   |
| action | [Action](#action) | `BLOCK` | Action to take if the value is outside the specified range. |

### Isolation

- `read_uncommitted`
- `read_committed`

### Action

- `BLOCK` → when fail, save in audit and return error.
- `INFO` → execute API with wrong value, save in audit.

## Example

```json
{
  "name": "myFetchPolicyPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.FetchPolicyPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "isolationLevel": {
      "value": "read_uncommitted",
      "action": "BLOCK"
    },
    "rackIdRequired": {
      "value": true,
      "action": "BLOCK"
    },
    "fetchMaxBytes": {
      "min": 1000,
      "max": 3000,
      "action": "INFO"
    },
    "fetchMinBytes": {
      "min": 1,
      "max": 500,
      "action": "INFO"
    },
    "maxWaitMs": {
      "min": 10000,
      "max": 20000,
      "action": "INFO"
    },
    "version": {
      "min": 1,
      "max": 3,
      "action": "BLOCK"
    }
  }
}
```
