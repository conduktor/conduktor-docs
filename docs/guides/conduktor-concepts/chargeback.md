---
title: Chargeback
description: Learn Conduktor terminology
---

This <GlossaryTerm>Interceptor</GlossaryTerm> will watch produce and consume to store metrics about incoming and outgoing traffic (bytes) in a topic.

This topic is then utilized by the Console to display Chargeback metrics. Chargeback allows organizations to track and allocate costs/usage associated with Kafka resources to different teams or departments based on their data consumption and processing, facilitating cost accountability and management.

### Configuration overview

| Name              | Type   | Default | Description                                                                      |
|:------------------|:-------|:--------|:---------------------------------------------------------------------------------|
| topicName         | String |         | Topics used to store observability metrics. If this topic already exists in your cluster, it must have only one partition. If the topic does not exist, Gateway will create this when you deploy the plugin. |
| replicationFactor | Int    |         | The replication factor to set if Gateway needs to create the topic.               |
| flushIntervalInSecond | Int    |    300     | The periodic interval for flushing metrics to the specified topic.               |

### Example

```json
{
  "name": "myObservabilityInterceptorPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.observability.ObservabilityPlugin",
  "priority": 100,
  "config": {
    "topicName": "observability",
    "replicationFactor": 3
  }
}
```

[Check out Chargeback tutorial](/guides/tutorials/configure-chargeback).
