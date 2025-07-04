---
sidebar_position: 360
title: Apply Traffic Control Policies
description: Implement policies using Conduktor
---
import ProductScalePlus from '@site/src/components/shared/product-scale-plus.md';

<ProductScalePlus /> 

## Overview

Conduktor <GlossaryTerm>Gateway</GlossaryTerm> offers a number of <GlossaryTerm>Interceptors</GlossaryTerm> that apply <GlossaryTerm>Traffic Control Policies</GlossaryTerm> to data.

## Alter broker config

The alter broker config policy Interceptor will impose limits on configuration changes to ensure that any configuration changed in the cluster adhere to the configured specification.

The full list of Kafka configurations that this Interceptor protects is:

- log.retention.bytes
- log.retention.ms
- log.segment.bytes

#### What happens when sending an invalid request

Any request that doesn't match the Interceptor's configuration will be blocked and return the corresponding error  message.

For example: you want to change the configuration log.retention.ms = 10000, but the Interceptor is being configured minLogRetentionMs=60000. When you send that request to the cluster, the following error is returned:

`org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. log.retention.ms is '1', must not be less than '10'`

#### Configuration

The configuration table now includes the updated structure for the configuration values.

| Key               | Type                    | Description                                     |
|:------------------|:------------------------|:------------------------------------------------|
| blacklist         | BlackList | Blacklist of properties which cannot be changed |
| logRetentionBytes | Long       | Configuration for log.retention.bytes           |
| logRetentionMs    | Long         | Configuration for log.retention.ms              |
| logSegmentBytes   | Long          | Configuration for log.segment.bytes             |

#### BlackList

| Key    | Type                 | Description                                                     |
|:-------|:---------------------|:----------------------------------------------------------------|
| values | Set String          | A set of string that contains properties that cannot be changed |
| action | Action  | Action to take if the value is outside the specified range.     |

#### Long

| Key           | Type              | Description                                                                |
|:--------------|:------------------|:---------------------------------------------------------------------------|
| min           | double            | Minimum value for the configuration.                                       |
| max           | double            | Maximum value for the configuration.                                       |
| action        | action| Action to take if the value is outside the specified range.                |
| overrideValue | double            | Value to override with (only applicable when action is set to `OVERRIDE`). |

#### Action

- `BLOCK` - when fail, save in audit and return error.
- `INFO` - execute API with wrong value, save in audit.
- `OVERRIDE` - execute API with `overrideValue` values, save in audit the fact that we updated on the fly (with wrong value, and the one we used to fix them).

#### Example

```json
{
  "name": "myAlterBrokerConfigPolicy",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.AlterBrokerConfigPolicyPlugin",
  "priority": 100,
  "config": {
    "logRetentionBytes": {
      "min": 10,
      "max": 100,
      "action": "BLOCK"
    },
    "logRetentionMs": {
      "min": 10,
      "max": 100,
      "action": "OVERRIDE",
      "overrideValue": 20
    },
    "logSegmentBytes": {
      "min": 10,
      "max": 100,
      "action": "INFO"
    }
  }
}
```

## Alter topic config

The alter topic config policy Interceptor will impose limits on configuration changes to ensure that any configuration changed in the topic adhere to the configured specification.

The full list of Kafka configurations that this Interceptor protects is:

- retention.ms
- retention.bytes
- segment.ms
- segment.bytes
- segment.jitter.ms
- flush.messages
- flush.ms
- max.message.bytes
- min.insync.replicas
- cleanup.policy
- unclean.leader.election.enable

#### Sending an invalid request:

Any request that doesn't match the Interceptor's configuration will be blocked and return the corresponding error  message.

For example, you want to change the configuration `retention.ms = 10000` but the Interceptor is being configured `minRetentionMs=60000`. When you send that request to the cluster, the following error is returned:

```sh
org.apache.kafka.common.errors.PolicyViolationException: 
Request parameters do not satisfy the configured policy. retention.ms is '1', must not be less than '10'
```

#### Configuration

| Key                         | Type                            | Default | Description                                                    |
|:----------------------------|:--------------------------------|:--------|:---------------------------------------------------------------|
| topic                       | String                          | `.*`    | Topics that match this regex will have the Interceptor applied |
| blacklist                   | BlackList     |         | Blacklist of properties which cannot be changed                |
| retentionMs                 | Long                 |         | Configuration for retention.ms                                 |
| retentionBytes              | Long                 |         | Configuration for retention.bytes                              |
| segmentMs                   | Long                  |         | Configuration for segment.ms                                   |
| segmentBytes                | Integer           |         | Configuration for segment.bytes                                |
| segmentJitterMs             | Long                |         | Configuration for segment.jitter.ms                            |
| flushMessages               | Long                 |         | Configuration for flush.messages                               |
| flushMs                     | Long                |         | Configuration for flush.ms                                     |
| maxMessageBytes             | Integer             |         | Configuration for max.message.bytes                            |
| minInsyncReplicas           | Integer           |         | Configuration for min.insync.replicas                          |
| cleanupPolicy               | Cleanupolicy |         | Configuration for cleanup.policy                               |
| uncleanLeaderElectionEnable | Boolean            |         | Configuration for unclean.leader.election.enable               |

#### BlackList

| Key    | Type                  | Description                                                     |
|:-------|:----------------------|:----------------------------------------------------------------|
| values | Set String        | A set of string that contains properties that cannot be changed |
| action | Action   | Action to take if the value is outside the specified range.     |

#### Integer

|  Key    | Type                  | Description                                                              |
|:--------------|:--------------------|:---------------------------------------------------------------------------|
| min           | int                 | Minimum value for the configuration.                                       |
| max           | int                 | Maximum value for the configuration.                                       |
| action        | action  | Action to take if the value is outside the specified range.                |
| overrideValue | int                 | Value to override with (only applicable when action is set to `OVERRIDE`). |

#### Long

| Key    | Type                  | Description                                                                 |
|:--------------|:--------------------|:---------------------------------------------------------------------------|
| min           | double              | Minimum value for the configuration.                                       |
| max           | double              | Maximum value for the configuration.                                       |
| action        | action  | Action to take if the value is outside the specified range.                |
| overrideValue | double              | Value to override with (only applicable when action is set to `OVERRIDE`). |

#### Cleanup policy

| Key           | Type                  | Description                                                                                                                                                                     |
|:--------------|:----------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| values        | Set String        | Value for the configuration, should be a set of string that contains values from `delete`, `compact` or specify both policies in a comma-separated list (eg: `delete,compact`). |
| action        | Action     | Action to take if the value is outside the specified range.                                                                                                                     |
| overrideValue | String                | Value to override with (only applicable when action is set to `OVERRIDE`).                                                                                                      |

#### Boolean

| Key    | Type              | Description                                                                                  |
|:-------|:------------------|:---------------------------------------------------------------------------------------------|
| value  | Boolean           | Value for the configuration. If action is `OVERRIDE`, will use this value for override value |
| action | Action | Action to take if the value is outside the specified range.                                  |

#### Action

- `BLOCK` - when fail, save in audit and return error.
- `INFO` - execute API with wrong value, save in audit.
- `OVERRIDE` - execute API with `overrideValue` (or `value` for others) values, save in audit the fact that we updated on the fly (with wrong value, and the one we used to fix them)

#### Example

```json
{
  "name": "myAlterTopicConfigPolicy",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
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
      "value": [
        "delete",
        "compact"
      ],
      "action": "OVERRIDE"
    },
    "uncleanLeaderElectionEnable": {
      "value": false,
      "action": "BLOCK"
    }
  }
}
```

## ClientId required

If client id does not match the specified name convention, it will respond `PolicyViolationException` when `action` is `BLOCK`. Otherwise, fill the client-id with a templating mechanism

We support templating such as `clientId-{{userIp}}-testing"`. Here are the values we can expand:

- `uuid`
- `userIp`
- `vcluster`
- `user`
- `clientId`
- `gatewayIp`
- `gatewayHost`
- `gatewayVersion`
- `apiKey`
- `apiKeyVersion`
- `timestampMillis`

#### Configuration

| Key              | Type              | Default | Description                                            |
|:-----------------|:------------------|:--------|:-------------------------------------------------------|
| clientIdTemplate | String            |         | Client-id with a templating mechanism to override      |
| namingConvention | String            | `.*`    | Configuration for validating client id name convention |
| action           | Action |         | Action to take if the client id is invalid             |

#### Action

- `BLOCK` - when fail, save in audit and return error.
- `INFO` - execute API with wrong client id, save in audit.
- `OVERRIDE` - execute API with override value with a templating mechanism, save in audit the fact that we updated on the fly.

#### Example

```json
{
  "name": "client-id-required-policy",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
  "priority": 100,
  "config": {
    "namingConvention": "clientId-.*",
    "action": "BLOCK"
  }
}
```

```json
{
  "name": "client-id-required-policy",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
  "priority": 100,
  "config": {
    "namingConvention": "clientId-.*",
    "action": "INFO"
  }
}
```

```json
{
  "name": "client-id-required-policy",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
  "priority": 100,
  "config": {
    "clientIdTemplate": "clientId-{{userIp}}-testing",
    "namingConvention": "clientId-.*",
    "action": "OVERRIDE"
  }
}
```

## Consumer group policy

The consumer group policy Interceptor is designed to enhance the reliability and efficiency of Kafka consumer group operations.

By enforcing specific configuration policies, it ensures that consumer groups adhere to predefined rules, thereby preventing potential issues.

#### Sending an invalid request

For example: you configure consumer with groupId is `invalid_group_id`, but the Interceptor is being configured `groupId=conduktor_group_id.*`.

#### Block request

Any request that doesn't match the Interceptor's configuration will be blocked and return the corresponding error message. When a consumer sends that configuration to the cluster, the following error is returned:

```sh 
org.apache.kafka.common.errors.PolicyViolationException: 
Request parameters do not satisfy the configured policy. GroupId 'invalid_group_id' is invalid.`
```

#### Info on request

`invalid_group_id` is still accepted and you will receive an audit record with the following error: `Request parameters do not satisfy the configured policy. GroupId 'invalid_group_id' is invalid.`

#### Configuration

| Key                | Type                | Description                          |
|:-------------------|:--------------------|:-------------------------------------|
| groupId            | Regex    | Configuration for groupId.           |
| sessionTimeoutMs   | Integer | Configuration for session timeout.   |
| rebalanceTimeoutMs | Integer | Configuration for rebalance timeout. |
| memberId           | Regex    | Configuration for memberId.          |
| groupInstanceId    | Regex    | Configuration for groupInstanceId.   |

#### Regex

| Key    | Type              | Default  | Description                                                                         |
|:-------|:------------------|:---------|:------------------------------------------------------------------------------------|
| value  | String            |          | Value as a regex, request values matching this regex will have Interceptor applied. |
| action | Action | `BLOCK`  | Action to take if the value is outside the specified range.                         |

#### Integer

| Key           | Type              | Default | Description                                                                |
|:--------------|:------------------|:--------|:---------------------------------------------------------------------------|
| min           | int               |         | Minimum value for the configuration.                                       |
| max           | int               |         | Maximum value for the configuration.                                       |
| action        | action | `BLOCK` | Action to take if the value is outside the specified range.                |
| overrideValue | int               |         | Value to override with (only applicable when action is set to `OVERRIDE`). |

#### Action

- `BLOCK` - when fail, save in audit and return error.
- `INFO` - execute API with wrong value, save in audit.
- `OVERRIDE` - execute API with `overrideValue` values, save in audit the fact that we updated on the fly (with wrong value, and the one we used to fix them).

#### Example

```json
{
  "name": "myConsumerGroupPolicyPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin",
  "priority": 100,
  "config": {
    "groupId": {
      "value": "group.*",
      "action": "BLOCK"
    },
    "sessionTimeoutMs": {
      "max": 60000,
      "action": "INFO"
    },
    "rebalanceTimeoutMs": {
      "min": 30000,
      "action": "OVERRIDE",
      "overrideValue": 40000
    },
    "memberId": {
      "value": "member.*",
      "action": "INFO"
    },
    "groupInstanceId": {
      "value": "groupInstance.*",
      "action": "BLOCK"
    }
  }
}

```

## Create topic policy

Kafka is allowing the creation of topics freely, which leads to invalid topics being created in the cluster. Create topic policy limits on topic creation to ensure that any topics created in the cluster adhere to a minimum/maximum specification for Replication Factor and Partition count, as well as topic-level configs.

#### Configuration

| Key                             | Type                                              | Default | Description                                                    |
|:--------------------------------|:--------------------------------------------------|:--------|:---------------------------------------------------------------|
| topic                           | String                                            | `.*`    | Topics that match this regex will have the Interceptor applied |
| namingConvention                | Regex                                  |         | Configuration for validating topic name convention             |
| numPartition                    | Integer                             |         | Configuration for number of partitions                         |
| replicationFactor               | Integer                              |         | Configuration for number of replicas                           |
| cleanupPolicy                   | Cleanup policy                  |         | Configuration for cleanup.policy                               |
| compressionType                 | Compression type            |         | Configuration for compression.type                             |
| deleteRetentionMs               | Long                                 |         | Configuration for delete.retention.ms                          |
| fileDeleteDelayMs               | Long                                   |         | Configuration for file.delete.delay.ms                         |
| flushMessages                   | Long                                    |         | Configuration for flush.messages                               |
| flushMs                         | Long                                     |         | Configuration for flush.ms                                     |
| indexIntervalBytes              | Integer                             |         | Configuration for index.interval.bytes                         |
| maxCompactionLagMs              | Long                                    |         | Configuration for max.compaction.lag.ms                        |
| maxMessageBytes                 | Integer                             |         | Configuration for max.message.bytes                            |
| messageTimestampDifferenceMaxMs | Long                                    |         | Configuration for message.timestamp.difference.max.ms          |
| messageTimestampType            | Message timestamp type |         | Configuration for message.timestamp.type                       |
| minCleanableDirtyRatio          | Double                           |         | Configuration for min.cleanable.dirty.ratio                    |
| minCompactionLagMs              | Long                                  |         | Configuration for min.compaction.lag.ms                        |
| minInsyncReplicas               | Integer                             |         | Configuration for min.insync.replicas                          |
| preallocate                     | Boolean                          |         | Configuration for preallocate                                  |
| retentionBytes                  | Long                                  |         | Configuration for retention.bytes                              |
| retentionMs                     | Long                                   |         | Configuration for retention.ms                                 |
| segmentBytes                    | Integer                              |         | Configuration for segment.bytes                                |
| segmentIndexBytes               | Integer                             |         | Configuration for segment.bytes                                |
| segmentJitterMs                 | Long                                 |         | Configuration for segment.jitter.ms                            |
| segmentMs                       | Long                                   |         | Configuration for segment.ms                                   |
| uncleanLeaderElectionEnable     | Boolean                           |         | Configuration for unclean.leader.election.enable               |
| messageDownconversionEnable     | Boolean                              |         | Configuration for message.downconversion.enable                |

#### Regex

| Key    | Type              | Default | Description                                                  |
|:-------|:------------------|:--------|:-------------------------------------------------------------|
| value  | String            |         | Regex for validating topic name                              |
| action | Action | `BLOCK` | Action to take if the value is outside the specified range.  |

#### Integer

| Key           | Type              | Default | Description                                                                |
|:--------------|:------------------|:--------|:---------------------------------------------------------------------------|
| min           | int               |         | Minimum value for the configuration.                                       |
| max           | int               |         | Maximum value for the configuration.                                       |
| action        | action | `BLOCK` | Action to take if the value is outside the specified range.                |
| overrideValue | int               |         | Value to override with (only applicable when action is set to `OVERRIDE`). |

#### Long

| Key           | Type              | Default | Description                                                                |
|:--------------|:------------------|:--------|:---------------------------------------------------------------------------|
| min           | double            |         | Minimum value for the configuration.                                       |
| max           | double            |         | Maximum value for the configuration.                                       |
| action        | action | `BLOCK` | Action to take if the value is outside the specified range.                |
| overrideValue | double            |         | Value to override with (only applicable when action is set to `OVERRIDE`). |

#### Cleanup policy

| Key           | Type              | Default | Description                                                                                                                                                                    |
|:--------------|:------------------|:--------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| values        | Set String     |         | Value for the configuration, should be a set of string that contains values from `delete`, `compact` or specify both policies in a comma-separated list like `delete,compact`. |
| action        | Action | `BLOCK` | Action to take if the value is outside the specified range.                                                                                                                    | 
| overrideValue | String            |         | Value to override with (only applicable when action is set to `OVERRIDE`).                                                                                                     |

#### Compression type

| Key           | Type              | Default | Description                                                              |
|:--------------|:---------------------------------|:--------|:---------------------------------------------------------------------------|
| values        | Set Compression |         | Set of string contains compression types.                                  |
| action        | Action               | `BLOCK` | Action to take if the value is outside the specified range.                |
| overrideValue | Compression     |         | Value to override with (only applicable when action is set to `OVERRIDE`). |

#### Message timestamp type

| Key           | Type              | Default | Description                                                                                                                            |
|:-------|:------------------|:--------|:-----------------------------------------------------------------------------------------------------------------------------------------|
| value  | String            |         | Only these are allowed, allowed values: `CreateTime` or `LogAppendTime`. If action is `OVERRIDE`, will use this value for override value |
| action | Action | `BLOCK` | Action to take if the value is outside the specified range.                                                                              |

#### Boolean

| Key           | Type              | Default | Description                                                                                  |
|:-------|:------------------|:--------|:---------------------------------------------------------------------------------------------|
| value  | Boolean           |         | Value for the configuration. If action is `OVERRIDE`, will use this value for override value |
| action | Action | `BLOCK` | Action to take if the value is outside the specified range.                                  |

#### Compression

- `uncompressed`
- `gzip`
- `snappy`
- `lz4`
- `zstd`
- `producer`

#### Action

- `BLOCK` - when fail, save in audit and return error.
- `INFO` - execute API with wrong value, save in audit.
- `OVERRIDE` - execute API with `overrideValue` (or `value` for others) values, save in audit the fact that we updated on the fly (with wrong value, and the one we used to fix them)

#### Example

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

## Fetch policy

`The fetch policy interceptor` will be able to encourage (log) or block fetch requests that do not meet the specified configuration.

#### Sending an invalid request

Any request that doesn't match the Interceptor's configuration will be blocked and return the corresponding error message. For example: you want to send fetch request with isolationLevel=read_committed, but the Interceptor is being configured `isolationLevel=read_uncommitted`.

When you send that request to the cluster, consumer will retry the request and the following error is logged in Gateway:

```sh
org.apache.kafka.common.errors.PolicyViolationException: 
Request parameters do not satisfy the configured policy. Topic 'topicName' with isolationLevel is READ_UNCOMMITTED, must be READ_COMMITTED
```

#### Configuration

| Key            | Type                                              | Default | Description                                                                                                           |
|:---------------|:--------------------------------------------------|:--------|:----------------------------------------------------------------------------------------------------------------------|
| topic          | String                                            | `.*`    | Topics that match this regex will have the Interceptor applied. If no value is set, it will be applied to all topics. |
| isolationLevel | IsolationLevel             |         | Configuration for isolation level                                                                                     |
| rackIdRequired | Boolean                             |         | Configuration of rankId usage                                                                                         |
| fetchMaxBytes  | SafeguardIntegerConfig |         | Configuration for maxBytes                                                                                            |
| fetchMinBytes  | SafeguardIntegerConfig |         | Configuration for minBytes                                                                                            |
| maxWaitMs      | SafeguardIntegerConfig |         | Configuration for maxWaitMs                                                                                           |
| version        | Version                             |         | Configuration for fetch version                                                                                       |

#### Isolation Level

| Key           | Type              | Default | Description                                             |
|:-------|:------------------------|:--------|:------------------------------------------------------------|
| value  |Isolation |         | Isolation level for fetch request                           |
| action | Action      | `BLOCK` | Action to take if the value is outside the specified range. |

#### Boolean

| Key           | Type              | Default | Description                                            |
|:-------|:----------------------|:--------|:------------------------------------------------------------|
| value  | Boolean               |         | Value for the configuration                                 |
| action | Action    | `BLOCK` | Action to take if the value is outside the specified range. |

#### Version

| Key           | Type              | Default | Description                                            |
|:-------|:------------------|:--------|:------------------------------------------------------------|
| min    | int               |         | Minimum value of fetch version                              |
| max    | int               |         | Maximum value of fetch version                              |
| action | action| `BLOCK` | Action to take if the value is outside the specified range. |

#### SafeguardIntegerConfig

| Key           | Type              | Default | Description                                             |
|:-------|:------------------|:--------|:------------------------------------------------------------|
| min    | int               |         | Minimum value of property                                   |
| max    | int               |         | Maximum value of property                                   |
| action | action | `BLOCK` | Action to take if the value is outside the specified range. |

#### Isolation

- `read_uncommitted`
- `read_committed`

#### Action

- `BLOCK` - when fail, save in audit and return error.
- `INFO` - execute API with wrong value, save in audit.

#### Example

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

## Limit commit offset policy

Limit Commit Offset Policy limits commit offset attempts on the same `groupId` within a minute. If commit offset attempts hit more than limitation in specific duration, it will respond `PolicyViolationException`.

#### Configuration

| Key           | Type              | Default | Description                                                                               |
|:------------------------|:------------------|:--------|:--------------------------------------------------------------------------------|
| groupId                 | string            | `.*`    | groupId regex, groupId that match this regex will have the Interceptor applied. |
| maximumCommitsPerMinute | int               |         | Maximum commit offset attempts on the same `groupId` within a minute            |
| action                  | action | `BLOCK` | Action to take if the value is outside the specified range.                     |
| throttleTimeMs          | int               | 100     | Value to throttle with (only applicable when action is set to `THROTTLE`).      |

#### Action

- `BLOCK` - when fail, save in audit and return error.
- `INFO` - execute API with wrong value, save in audit.
- `THROTTLE` - when fail, save in audit and the request will be throttled with time = `throttleTimeMs`.

#### Example

```json
{
  "name": "limit-commit-offset-policy",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
  "priority": 100,
  "config": {
    "groupId": "myGroupId.*",
    "maximumCommitsPerMinute": 5,
    "action": "BLOCK"
  }
}
```

## Limit connection attempts policy

Limit connection policy limits connection attempts within a second because creating a new connection is expensive. If connection attempts hit more than limitation in specific duration, it will respond `PolicyViolationException`.

#### Configuration

| Key           | Type              | Default | Description                                                                |
|:----------------------------|:------------------|:--------|:----------------------------------------------------------------------------|
| maximumConnectionsPerSecond | int               |         | Maximum connections which is allowed within a second                        |
| action                      | action | `BLOCK` | Action to take if the value is outside the specified range.                 |
| throttleTimeMs              | int               | 100     | Value to throttle with (only applicable when action is set to `THROTTLE`).  |

#### Action

- `BLOCK` - when fail, save in audit and return error.
- `INFO` - execute API with wrong value, save in audit.
- `THROTTLE` - when fail, save in audit and the request will be throttled with time = `throttleTimeMs`.

#### Example

```json
{
  "name": "myLimitConnectionPolicyPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
  "priority": 100,
  "config": {
    "maximumConnectionsPerSecond": 5,
    "action": "BLOCK"
  }
}
```

## Limit join group policy

Limit join group policy limits joinGroup attempts on the same `groupId` within a minute. If joinGroups attempts hit more than limitation in specific duration, it will respond `PolicyViolationException`.

#### Configuration

| Key           | Type              | Default | Description                                                                 |
|:-----------------------|:-------------------|:--------|:-------------------------------------------------------------------------------|
| groupId                | string             | `.*`    | groupId regex, groupId that match this regex will have the Interceptor applied |
| maximumJoinsPerMinute  | int                |         | Maximum joinGroup attempts on the same `groupId` within a minute.              |
| action                 | action |         | Action to take if the value is outside the specified range.                    |
| throttleTimeMs         | int                | 100     | Value to throttle with (only applicable when action is set to `THROTTLE`).     |

#### Action

- `BLOCK` - when fail, save in audit and return error.
- `INFO` - execute API with wrong value, save in audit.
- `THROTTLE` - when fail, save in audit and the request will be throttled with time = `throttleTimeMs`.

#### Example

```json
{
  "name": "limit-join-group-policy",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.LimitJoinGroupPolicyPlugin",
  "priority": 100,
  "config": {
    "groupId": "myGroupId.*",
    "maximumJoinsPerMinute": 5,
    "action": "BLOCK"
  }
}
```

## Message header removal policy

This Interceptor cleanup by removing unnecessary record headers when consume message. This supports 'Fetch Response' only. This should be run in the end of Interceptor list.

#### Configuration

| Key           | Type              | Default | Description                                                                       |
|:---------------|:---------|:--------|:-----------------------------------------------------------------------------------|
| topic          | String   | `.*`    | Topics that match this regex will have the Interceptor applied                     |
| headerKeyRegex | String   |         | Record header key regex, record header with key matches this regex will be removed |

#### Example

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

## Produce policy

The produce policy Interceptor will impose limits on incoming messages to kafka to ensure that messages going to kafka adhere to the configured specification.

#### Sending an invalid request

Any request that doesn't match the Interceptor's configuration will be blocked and return the corresponding error message. For example: you want to send record without header, but the Interceptor is being configured `recordHeaderRequired=true`. When you send that request to the cluster, the following error is returned:

```sh
org.apache.kafka.common.errors.PolicyViolationException: 
Request parameters do not satisfy the configured policy. Headers are required
```

#### Configuration

| Key                  | Type                                  | Default | Description                                                                                                           |
|:---------------------|:--------------------------------------|:--------|:----------------------------------------------------------------------------------------------------------------------|
| topic                | String                                | `.*`    | Topics that match this regex will have the Interceptor applied. If no value is set, it will be applied to all topics. |
| acks                 | Acks                       |         | Configuration for acks modes                                                                                          |
| recordHeaderRequired | Boolean                |         | Configuration of header usage                                                                                         |
| compressions         | Compression type |         | Configuration for compression types                                                                                   |
| idempotenceRequired  | Boolean                  |         | Configuration for idempotency usage                                                                                   |
| transactionRequired  | Boolean                 |         | Configuration for transaction usage                                                                                   |
| version              | Version                 |         | Configuration for produce version                                                                                     |

#### Acks

| Key           | Type              | Default | Description                                                   |
|:-------|:------------------|:--------|:----------------------------------------------------------------|
| value  | Array integer  |         | Only these acks modes are allowed, allowed values: -1, 0, 1     |
| action | Action | `BLOCK` | Action to take if the value is outside the specified range.     |

#### Boolean

| Key           | Type              | Default | Description                                                                                |
|:-------|:----------------------|:--------|:---------------------------------------------------------------------------------------------|
| value  | Boolean               |         | Value for the configuration. If action is `OVERRIDE`, will use this value for override value |
| action | Action    | `BLOCK` | Action to take if the value is outside the specified range.                                  |

#### Version

| Key           | Type              | Default | Description                                                 |
|:-------|:------------------|:--------|:--------------------------------------------------------------|
| min    | int               |         | Minimum value of produce version                              |
| max    | int               |         | Maximum value of produce version                              |
| action | action | `BLOCK` | Action to take if the value is outside the specified range.   |

#### Compression Type

| Key           | Type              | Default | Description                                                                |
|:--------------|:---------------------------------|:---------|:---------------------------------------------------------------------------|
| values        | Set Compression|          | Set of string contains compression types.                                  |
| action        | Action             | `BLOCK`  | Action to take if the value is outside the specified range.  `             |
| overrideValue | Compression    |          | Value to override with (only applicable when action is set to `OVERRIDE`). |

#### Compression

- `NONE`
- `GZIP`
- `SNAPPY`
- `LZ4`
- `ZSTD`

#### Action

- `BLOCK` - when fail, save in audit and return error.
- `INFO` - execute API with wrong value, save in audit.

#### Example

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

## Producer rate limiting policy

Kafka uses per broker quotas to throttle the volume of data reaching each broker. Throttling across the cluster is not possible using default Apache Kafka.

Additionally, if you are using a hosted Kafka instance you don't have access to the Kafka configuration to set quotas.

This Interceptor improves the throttling story by limiting throughput at a per Gateway scope, throttling produce throughput on either a global or per vcluster(tenant) basis.

#### Configuration

| Key           | Type              | Default | Description                                                 |
|:----------------------|:--------|:------------------|:-----------------------------------------------------------|
| maximumBytesPerSecond |         | int               | Maximum bytes which is allowed to produce within a second  |
| action                | `BLOCK` | action | Action to take if the value is outside the specified range |

#### Action

- `BLOCK` - when threshold is reached, throttle and save an error in audit.
- `INFO` - when threshold is reached, do not throttle but save in audit a warn.

#### Example

```json
{
  "name": "myProducerRateLimitingPolicyPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin",
  "priority": 100,
  "config": {
    "maximumBytesPerSecond": 500,
    "action": "BLOCK"
  }
}
```

The maximum number of bytes that can be produced in any one second, before being throttled. In the above example only 500 bytes are allowed to be produced per second, before being throttled.

## Read-only topic policy

The read-only topic policy Interceptor allows you to define some topics to be `Read-only`. This means that any mutating requests are denied. For example, produce requests are blocked, as are any requests that alter or delete topics.

The full list of Kafka API requests that this Interceptor blocks for the specified topics is:

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

#### Sending a request to a read-only topic

If an attempt is made to send a request to a read-only topic, the following error will be returned, such  as: 

```sh
org.apache.kafka.common.errors.TopicAuthorizationException: 
Not authorized to access topics: [topic name]
```

#### Configuration

| Key           | Type              | Default | Description                                                     |
|:-------|:--------------------|:----------|:----------------------------------------------------------------|
| topic  | String              | `.*`      | Topics that match this regex will have the Interceptor applied. |
| action | Action  | `BLOCK`   | Action to take if the value is outside the specified range.     |

#### Action

- `BLOCK` - when fail, save in audit and return error.
- `INFO` - execute API with wrong value, save in audit.

#### Example

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

## Topic required schema ID policy

Ensuring that all records sent through your Kafka system have a schema associated with them ensures data in a known  format for your Kafka consumers. Records with missing schemas can cause application outages, as consumers may be unable to process the unexpected record format.

The topic required schema ID policy Interceptor ensures that all records produced to Kafka have a schema set. [Learn about schema registry and schema-id](https://www.conduktor.io/blog/what-is-the-schema-registry-and-why-do-you-need-to-use-it/).

#### Sending an invalid record

Topic required schema id policy Interceptor will return the following errors when an invalid record is sent:

| Key                     | Description                                                                                                              |
|:------------------------|:-------------------------------------------------------------------------------------------------------------------------|
| schemaIdRequired: true  | When sending a record without schemaId: `Request parameters do not satisfy the configured policy. SchemaId is required.` |
| schemaIdRequired: false | When sending a record with schemaId: `Request parameters do not satisfy the configured policy. SchemaId is not allowed.` |

#### Configuration

| Key           | Type              | Default | Description                                                    |
|:-----------------|:---------------------|:----------|:---------------------------------------------------------------|
| topic            | String               | `.*`      | Topics that match this regex will have the Interceptor applied |
| schemaIdRequired | Boolean              |           | Records must/must not have schemaId                            |
| action           | Action               | `BLOCK`   | Action to take if the value is outside the specified range     |

#### Action

- `BLOCK` - when fail, save in audit and return error.
- `INFO` - execute API with wrong value, save in audit.

#### Example

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

## Related resources

- [See the full list of Traffic Control Policies](/guide/conduktor-concepts/traffic-control-policies)
- [Find out how to deploy an Interceptor](/guide/conduktor-concepts/interceptors)
- [View resource reference](/guides/reference/self-service-reference)
- [Give us feedback/request a feature](https://conduktor.io/roadmap)
