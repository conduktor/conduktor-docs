---
version: 3.0.0
title: Create Topic Policy
description: Ensuring your topic configuration adheres to your own standards.
parent: governance
license: free
---

## Introduction

Kafka is allowing the creation of topics freely, which leads to invalid topics being created in the cluster.

Create topic policy limits on topic creation to ensure that any topics created in the cluster adhere to a minimum/maximum specification for Replication Factor and Partition count, as well as topic-level configs.

## Configuration

| key                             | type                                              | default | description                                                    |
|:--------------------------------|:--------------------------------------------------|:--------|:---------------------------------------------------------------|
| topic                           | String                                            | `.*`    | Topics that match this regex will have the interceptor applied |
| namingConvention                | [Regex](#regex)                                   |         | Configuration for validating topic name convention             |
| numPartition                    | [Integer](#integer)                               |         | Configuration for number of partitions                         |
| replicationFactor               | [Integer](#integer)                               |         | Configuration for number of replicas                           |
| cleanupPolicy                   | [Cleanup Policy](#cleanuppolicy)                  |         | Configuration for cleanup.policy                               |
| compressionType                 | [Compression Type](#compression-type)             |         | Configuration for compression.type                             |
| deleteRetentionMs               | [Long](#long)                                     |         | Configuration for delete.retention.ms                          |
| fileDeleteDelayMs               | [Long](#long)                                     |         | Configuration for file.delete.delay.ms                         |
| flushMessages                   | [Long](#long)                                     |         | Configuration for flush.messages                               |
| flushMs                         | [Long](#long)                                     |         | Configuration for flush.ms                                     |
| indexIntervalBytes              | [Integer](#integer)                               |         | Configuration for index.interval.bytes                         |
| maxCompactionLagMs              | [Long](#long)                                     |         | Configuration for max.compaction.lag.ms                        |
| maxMessageBytes                 | [Integer](#integer)                               |         | Configuration for max.message.bytes                            |
| messageTimestampDifferenceMaxMs | [Long](#long)                                     |         | Configuration for message.timestamp.difference.max.ms          |
| messageTimestampType            | [Message Timestamp Type](#message-timestamp-type) |         | Configuration for message.timestamp.type                       |
| minCleanableDirtyRatio          | [Double](#double)                                 |         | Configuration for min.cleanable.dirty.ratio                    |
| minCompactionLagMs              | [Long](#long)                                     |         | Configuration for min.compaction.lag.ms                        |
| minInsyncReplicas               | [Integer](#integer)                               |         | Configuration for min.insync.replicas                          |
| preallocate                     | [Boolean](#boolean)                               |         | Configuration for preallocate                                  |
| retentionBytes                  | [Long](#long)                                     |         | Configuration for retention.bytes                              |
| retentionMs                     | [Long](#long)                                     |         | Configuration for retention.ms                                 |
| segmentBytes                    | [Integer](#integer)                               |         | Configuration for segment.bytes                                |
| segmentIndexBytes               | [Integer](#integer)                               |         | Configuration for segment.bytes                                |
| segmentJitterMs                 | [Long](#long)                                     |         | Configuration for segment.jitter.ms                            |
| segmentMs                       | [Long](#long)                                     |         | Configuration for segment.ms                                   |
| uncleanLeaderElectionEnable     | [Boolean](#boolean)                               |         | Configuration for unclean.leader.election.enable               |
| messageDownconversionEnable     | [Boolean](#boolean)                               |         | Configuration for message.downconversion.enable                |

### Regex

| key    | type              | default | description                                                  |
|:-------|:------------------|:--------|:-------------------------------------------------------------|
| value  | String            |         | Regex for validating topic name                              |
| action | [Action](#action) | `BLOCK` | Action to take if the value is outside the specified range.  |

### Integer

| key           | type              | default | description                                                                |
|:--------------|:------------------|:--------|:---------------------------------------------------------------------------|
| min           | int               |         | Minimum value for the configuration.                                       |
| max           | int               |         | Maximum value for the configuration.                                       |
| action        | [Action](#action) | `BLOCK` | Action to take if the value is outside the specified range.                |
| overrideValue | int               |         | Value to override with (only applicable when action is set to `OVERRIDE`). |

### Long

| key           | type              | default | description                                                                |
|:--------------|:------------------|:--------|:---------------------------------------------------------------------------|
| min           | double            |         | Minimum value for the configuration.                                       |
| max           | double            |         | Maximum value for the configuration.                                       |
| action        | [Action](#action) | `BLOCK` | Action to take if the value is outside the specified range.                |
| overrideValue | double            |         | Value to override with (only applicable when action is set to `OVERRIDE`). |

### Cleanup Policy

| key           | type              | default | description                                                                                                                                                                    |
|:--------------|:------------------|:--------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| values        | Set[String]       |         | Value for the configuration, should be a set of string that contains values from `delete`, `compact` or specify both policies in a comma-separated list like `delete,compact`. |
| action        | [Action](#action) | `BLOCK` | Action to take if the value is outside the specified range.                                                                                                                    | 
| overrideValue | String            |         | Value to override with (only applicable when action is set to `OVERRIDE`).                                                                                                     |

### Compression Type

| key           | type                             | default | description                                                                |
|:--------------|:---------------------------------|:--------|:---------------------------------------------------------------------------|
| values        | Set[[Compression](#compression)] |         | Set of string contains compression types.                                  |
| action        | [Action](#action)                | `BLOCK` | Action to take if the value is outside the specified range.                |
| overrideValue | [Compression](#compression)      |         | Value to override with (only applicable when action is set to `OVERRIDE`). |

### Message Timestamp Type

| key    | type              | default | description                                                                                                                              |
|:-------|:------------------|:--------|:-----------------------------------------------------------------------------------------------------------------------------------------|
| value  | String            |         | Only these are allowed, allowed values: `CreateTime` or `LogAppendTime`. If action is `OVERRIDE`, will use this value for override value |
| action | [Action](#action) | `BLOCK` | Action to take if the value is outside the specified range.                                                                              |

### Boolean

| key    | type              | default | description                                                                                  |
|:-------|:------------------|:--------|:---------------------------------------------------------------------------------------------|
| value  | Boolean           |         | Value for the configuration. If action is `OVERRIDE`, will use this value for override value |
| action | [Action](#action) | `BLOCK` | Action to take if the value is outside the specified range.                                  |

### Compression

- `UNCOMPRESSED`
- `GZIP`
- `SNAPPY`
- `LZ4`
- `ZSTD`
- `PRODUCER`

### Action

- `BLOCK` → when fail, save in audit and return error.
- `INFO` → execute API with wrong value, save in audit.
- `OVERRIDE` → execute API with `overrideValue` (or `value` for others) values, save in audit the fact that we updated on the fly (with wrong value, and the one we used to fix them)

## Example

```json
{
  "name": "myCreateTopicPolicyPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin",
  "priority": 100,
  "config": {
    "topic": "topic_1.*",
    "numPartition": {
      "min": 5,
      "max": 5,
      "action": "BLOCK"
    },
    "replicationFactor": {
      "min": 2,
      "max": 4,
      "action": "OVERRIDE",
      "overrideValue": 3
    },
    "retentionMs": {
      "min": 10,
      "max": 100
    },
    "retentionBytes": {
      "min": 10,
      "max": 100,
      "action": "BLOCK"
    },
    "segmentMs": {
      "min": 10,
      "max": 100,
      "action": "INFO"
    },
    "segmentBytes": {
      "min": 10,
      "max": 100,
      "action": "BLOCK"
    },
    "segmentJitterMs": {
      "min": 10,
      "max": 100,
      "action": "INFO",
      "overrideValue": 20
    },
    "flushMessages": {
      "min": 10,
      "max": 100,
      "action": "OVERRIDE",
      "overrideValue": 20
    },
    "flushMs": {
      "min": 10,
      "max": 100,
      "action": "OVERRIDE",
      "overrideValue": 20
    },
    "maxMessageBytes": {
      "min": 10,
      "max": 100,
      "action": "OVERRIDE",
      "overrideValue": 20
    },
    "minInsyncReplicas": {
      "min": 10,
      "max": 100,
      "action": "OVERRIDE",
      "overrideValue": 20
    },
    "cleanupPolicy": {
      "values": [
        "delete",
        "compact"
      ],
      "action": "OVERRIDE"
    },
    "uncleanLeaderElectionEnable": {
      "value": false,
      "action": "BLOCK"
    },
    "compressionType": {
      "values": [
        "producer",
        "gzip"
      ],
      "action": "BLOCK"
    }
  }
}
```