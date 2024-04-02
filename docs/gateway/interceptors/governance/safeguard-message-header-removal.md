---
version: 3.0.0
title: Message Header Removal
description: Remove headers from Kafka records
parent: governance
license: enterprise
---

## Introduction

This interceptor cleanup by removing unnecessary record headers when consume message.

This supports for Fetch Response only.

This should be run in the end of interceptor list.

## Configuration

| key            | type     | default | description                                                                        |
|:---------------|:---------|:--------|:-----------------------------------------------------------------------------------|
| topic          | String   | `.*`    | Topics that match this regex will have the interceptor applied                     |
| headerKeyRegex | String   |         | Record header key regex, record header with key matches this regex will be removed |

## Example

```json
{
  "name": "myMessageHeaderRemovalInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.MessageHeaderRemovalPlugin",
  "priority": 100,
  "config": {
    "topic": "topic-.*",
    "headerKeyRegex": "headerKey.*"
  }
}
```