---
version: 2.6.0
title: Produce policy
description: Increase resilience and data quality by ensuring produced messages adhere to the specified configuration requirements.
parent: governance
license: enterprise
---

## Introduction

`The produce policy interceptor` will impose limits on incoming messages to kafka to ensure that messages going to kafka adhere to the configured specification.


### What happens when sending an invalid request

Any request that doesn't match the interceptor's configuration will be blocked and return the corresponding error message.

For example: you want to send record without header, but the interceptor is being configured `recordHeaderRequired=true`.

When you send that request to the cluster, the following error is returned:

```sh
org.apache.kafka.common.errors.PolicyViolationException: 
Request parameters do not satisfy the configured policy. Headers are required
```

## Configuration

| key                  | type                                  | default | description                                                                                                           |
|:---------------------|:--------------------------------------|:--------|:----------------------------------------------------------------------------------------------------------------------|
| topic                | String                                | `.*`    | Topics that match this regex will have the interceptor applied. If no value is set, it will be applied to all topics. |
| acks                 | [Acks](#acks)                         |         | Configuration for acks modes                                                                                          |
| recordHeaderRequired | [Boolean](#boolean)                   |         | Configuration of header usage                                                                                         |
| compressions         | [Compression Type](#compression-type) |         | Configuration for compression types                                                                                   |
| idempotenceRequired  | [Boolean](#boolean)                   |         | Configuration for idempotency usage                                                                                   |
| transactionRequired  | [Boolean](#boolean)                   |         | Configuration for transaction usage                                                                                   |
| version              | [Version](#version)                   |         | Configuration for produce version                                                                                     |


### Acks

| key    | type              | default | description                                                     |
|:-------|:------------------|:--------|:----------------------------------------------------------------|
| value  | Array[integer]    |         | Only these acks modes are allowed, allowed values: -1, 0, 1     |
| action | [Action](#action) | `BLOCK` | Action to take if the value is outside the specified range.     |

### Boolean

| key    | type                  | default | description                                                                                  |
|:-------|:----------------------|:--------|:---------------------------------------------------------------------------------------------|
| value  | Boolean               |         | Value for the configuration. If action is `OVERRIDE`, will use this value for override value |
| action | [Action](#action)     | `BLOCK` | Action to take if the value is outside the specified range.                                  |

### Version

| key    | type              | default | description                                                   |
|:-------|:------------------|:--------|:--------------------------------------------------------------|
| min    | int               |         | Minimum value of produce version                              |
| max    | int               |         | Maximum value of produce version                              |
| action | [Action](#action) | `BLOCK` | Action to take if the value is outside the specified range.   |

### Compression Type

| key           | type                             | default  | description                                                                |
|:--------------|:---------------------------------|:---------|:---------------------------------------------------------------------------|
| values        | Set[[Compression](#compression)] |          | Set of string contains compression types.                                  |
| action        | [Action](#action)                | `BLOCK`  | Action to take if the value is outside the specified range.  `             |
| overrideValue | [Compression](#compression)      |          | Value to override with (only applicable when action is set to `OVERRIDE`). |

### Compression

- `NONE`
- `GZIP`
- `SNAPPY`
- `LZ4`
- `ZSTD`

### Action

- `BLOCK` → when fail, save in audit and return error.
- `INFO` → execute API with wrong value, save in audit.

## Example

```json
{
  "name": "myProducePolicyPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "acks": {
      "value": [
        -1,
        0
      ],
      "action": "BLOCK"
    },
    "recordHeaderRequired": {
      "value": true,
      "action": "BLOCK"
    },
    "compressions": {
      "value": [
        "NONE",
        "GZIP"
      ],
      "action": "INFO"
    },
    "idempotenceRequired": {
      "value": true,
      "action": "INFO"
    },
    "transactionRequired": {
      "value": true
    },
    "version": {
      "min": 1,
      "max": 3,
      "action": "BLOCK"
    }
  }
}
```
