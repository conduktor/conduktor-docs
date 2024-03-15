---
sidebar_position: 3
title: Migration Guide to 3.x
description: Migration guide to 3.x from 2.x
---

# Migration Guide to 3.x

# Requirements

-   Kafka cluster is reachable
-   Gateway 3.x migration executable jar ([tmp download link](https://github.com/conduktor/conduktor-proxy/packages/2092665?version=3.0.0-rc0))
-   Java version >= 21
-   Bash shell (other flavors should work but Bash is recommended)

# Storage configuration

The Gateway configuration is stored in Kafka topics. Here is the list of them in version 2.x

```bash
➜ kafka-topics --bootstrap-server kafka:9092 --list
```

```bash
__consumer_offsets
_acls
_auditLogs
_consumerGroupSubscriptionBackingTopic
_encryptionConfig
_interceptorConfigs
_license
_offsetStore
_schemas
_topicMappings
_topicRegistry
_userMapping
```

## Internal topics renaming

In Gateway 3.x, the default internal topics have been changed to be prefixed with **\_conduktor_gateway_** ("gateway" being the default cluster name but can be changed in multi gateway clusters mode). This is to avoid any potential conflicts for the case of multiple Gateway clusters running on the same Kafka cluster.
This prefixing is not mandatory (the multi gateway cluster is a very specific use case) and can be overridden by configuration. 

TLDR if you are running a single Gateway cluster, and you want to migrate from 2.x to 3.x:
* Some topics names must be explicitly given via the environment configuration:
```properties
GATEWAY_LICENSE_TOPIC=_license
GATEWAY_USER_MAPPINGS_TOPIC=_userMapping
GATEWAY_CONSUMER_SUBSCRIPTIONS_TOPIC=_consumerGroupSubscriptionBackingTopic
GATEWAY_CONSUMER_OFFSETS_TOPIC=_offsetStore
GATEWAY_INTERCEPTOR_CONFIGS_TOPIC=_interceptorConfigs
GATEWAY_ENCRYPTION_CONFIGS_TOPIC=_encryptionConfig
GATEWAY_ACLS_TOPIC=_acls
GATEWAY_AUDIT_LOGS_TOPIC=_auditLogs
```

* The other topics (related to topic mappings and interceptors) will be automatically renamed after you have fully executed the migration described in this document.


## Environment variables changes

The following environment variables have been renamed in Gateway 3.x:

| V 2.x                                                                                  | V 3.x                                |
|----------------------------------------------------------------------------------------|--------------------------------------|
| _(nonexistent)_                                                                        | GATEWAY_GROUP_ID                     |
| GATEWAY_LICENSE_BACKING_TOPIC                                                          | GATEWAY_LICENSE_TOPIC                |
| GATEWAY_TOPIC_STORE_MAPPING_BACKING_TOPIC / GATEWAY_TOPIC_STORE_REGISTRY_BACKING_TOPIC | GATEWAY_TOPIC_MAPPINGS_TOPIC         |
| GATEWAY_USER_MAPPING_BACKING_TOPIC                                                     | GATEWAY_USER_MAPPINGS_TOPIC          |
| GATEWAY_OFFSET_STORE_CONSUMER_GROUP_SUBSCRIPTION_BACKING_TOPIC                         | GATEWAY_CONSUMER_SUBSCRIPTIONS_TOPIC |
| GATEWAY_OFFSET_STORE_COMMITTED_OFFSET_BACKING_TOPIC                                    | GATEWAY_CONSUMER_OFFSETS_TOPIC       |
| GATEWAY_INTERCEPTOR_STORE_BACKING_TOPIC                                                | GATEWAY_INTERCEPTOR_CONFIGS_TOPIC    |
| GATEWAY_ENCRYPTION_CONFIG_BACKING_TOPIC                                                | GATEWAY_ENCRYPTION_CONFIGS_TOPIC     |
| GATEWAY_ACLS_STORES_BACKING_TOPIC                                                      | GATEWAY_ACLS_TOPIC                   |
| GATEWAY_AUDIT_LOG_SERVICE_BACKING_TOPIC                                                | GATEWAY_AUDIT_LOGS_TOPIC             |


## Topic mappings migration

On a running version of Conduktor Gateway 2.x, the topic mappings are stored in 2 internal Kafka topics: \_topicMappings and \_topicRegistry

The migration of topic mappings will merge the content of those 2 topics in a new one called \_conduktor_gateway_topicmappings

Here is a view of the data they contain:

-   **\_topicMappings** :

```bash
➜ kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic _topicMappings \
  --from-beginning --property print.key=true
```

```json
passthrough
{
  "my-topic": {
    "clusterId": "main",
    "name": "passthroughmy-topic",
    "isConcentrated": false,
    "compactedName": "passthroughmy-topic",
    "isCompacted": false,
    "compactedAndDeletedName": "passthroughmy-topic",
    "isCompactedAndDeleted": false,
    "createdAt": [
      2024,
      3,
      6,
      14,
      7,
      30,
      361
    ],
    "isDeleted": false,
    "configuration": {
      "numPartitions": 1,
      "replicationFactor": 1,
      "properties": {}
    },
    "isVirtual": false
  }
}
```

-   **\_topicRegistry**:

```bash
➜ kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic _topicRegistry \
  --from-beginning \
  --property print.key=true
```

```json
    {"tenant":"passthrough","topic":"my-topic"}
    {
      "name": "my-topic",
      "partitionMappings": {
        "0": 0
      },
      "compactedKey": "d02108bc-b4b3-43b7-9c84-893042a01bfb",
      "configuration": {
        "properties": {}
      },
      "retention": null,
      "lastOffsetsMappings": {}
    }
```

### Migration

When the Conduktor Gateway 3.x is deployed, a new internal topic is created: **\_conduktor_gateway_topicmappings**

```bash
➜ kafka-topics --bootstrap-server kafka:9092 --list
__consumer_offsets
_acls
_auditLogs
_consumerGroupSubscriptionBackingTopic
_encryptionConfig
_interceptorConfigs
_license
_conduktor_gateway_topicmappings
_offsetStore
_schemas
_topicMappings
_topicRegistry
_userMapping
```

The migration process can now be started. It consists of executing a command line with the provided Java executable jar file.

It is self documented with the **-h** option:

```bash
➜ java -jar migration-3.0.0-jar-with-dependencies.jar topic -h
Usage: migration topic [-dhV] [-t=<targetTopic>]
                       [--topicMappingsTopic=<sourceTopicMappings>]
                       [--topicRegistryTopic=<sourceTopicRegistry>]
                       KAFKA_PROPERTIES
      KAFKA_PROPERTIES   Kafka property file to connect
  -d, --dry-run          Dry run execution
  -h, --help             Show this help message and exit.
  -t, --targetTopic=<targetTopic>
                         Destination topic for gateway mappings (3.0.0)
      --topicMappingsTopic=<sourceTopicMappings>
                         Source topic for gateway topic mappings (2.x)
      --topicRegistryTopic=<sourceTopicRegistry>
                         Source topic for gateway topic registry (2.x)
  -V, --version          Print version information and exit.
```

The **-d** option allow to run it in "**dry mode**": no change will be applied but it will check whether the arguments are valid and Kafka target is reachable.

It is handy to check the settings are ok before running the actual migration.

Example of execution:

```bash
➜ java -jar migration-3.0.0-jar-with-dependencies.jar topic \
    -d \
    -t=_conduktor_gateway_topicmappings \
    --topicMappingsTopic=_topicMappings \
    --topicRegistryTopic=_topicRegistry \
    ~/.kafkaConfigs/migration.properties
```

The configuration file contains your Kafka connection properties. Fill it in with you own connection settings.

A simple example:

```bash
➜ cat ~/.kafkaConfigs/migration.properties
bootstrap.servers=kafka:9092
```

After the migration the  \_conduktor_gateway_topicmappings topic should contain the migrated data and Conduktor Gateway topic mappings should work seamlessly 🥳 !

```bash
➜ kafka-console-consumer --bootstrap-server kafka:9092 \
    --topic _conduktor_gateway_topicmappings \
    --from-beginning \
    --property print.key=true
```

```json
{ "id": "my-topic", "recordType": "MAPPING", "vcluster": "passthrough" }
{
  "io.conduktor.proxy.avro.schema.AvroTopicMapping.AliasTopicMapping": {
    "clusterId": "main",
    "logicalTopicName": "my-topic",
    "physicalTopicName": "passthroughmy-topic"
  }
}
```


## Interceptors

The migration of interceptors is very similar to the topic mappings one. It consists in the transfer the interceptor configurations that are stored in the \_interceptorConfigs topic to a new format in the new topic named \_conduktor_gateway_interceptor_configs

Here is the content of **\_interceptorConfigs** topic in 2.x:

```bash
    ➜ kafka-console-consumer \
     --bootstrap-server kafka:9092 \
     --topic _interceptorConfigs \
     --from-beginning \
     --property print.key=true

    {"configName":"guard-create-topics","vcluster":"passthrough","username":""}
    {
      "apiKey": null,
      "config": "{\"numPartition\":{\"min\":5,\"max\":5,\"action\":\"BLOCK\"}}",
      "name": "guard-create-topics",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin",
      "priority": 1,
      "timeoutMs": {
        "long": 9223372036854776000
      }
    }
```

After having deployed Gateway 3.x you can run the migration similarly as explained in the topic mappings section:

```bash
     java -jar migration-3.0.0-jar-with-dependencies.jar \
        interceptor -t=_conduktor_gateway_interceptor_configs \
        --topicInterceptorConfigs=_interceptorConfigs \
        ~/.kafkaConfigs/migration.properties
```

The new topic is populated and Gateway 3.0 is now live with the 2.x interceptors imported ! 🥳

```bash
     kafka-console-consumer \
      --bootstrap-server kafka:9092 \
      --topic _conduktor_gateway_interceptor_configs \
      --from-beginning \
      --property print.key=true
```

```json
guard-create-topics
{
  "name": "guard-create-topics",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin",
  "rules": [
    {
      "comment": "",
      "configs": "{\"numPartition\":{\"min\":5,\"max\":5,\"action\":\"BLOCK\"}}",
      "filter": {
        "group": null,
        "username": {
          "string": ""
        },
        "vcluster": {
          "string": "passthrough"
        }
      },
      "priority": 1
    }
  ],
  "timeoutMs": 9223372036854776000
}
```

The new interceptor targeting system is explained in a [dedicated section](../concepts/06-Interceptors-and-plugins/02-Targeting.md) .

# Gateway mode removal

In 3.0.0, we worked to unify Gateway behaviors and only provide some opt-in options for our customers, one of this aspect is the removal of `GATEWAY_MODE` configuration from Gateway.

To be sure that your gateway behave the same as before here is the Gateway 3.0.0 equivalent


### Migrate from `KAFKA_SECURITY`

This mode was replaced in Gateway 3.0.0 by new security protocols `DELEGATED_SASL_PLAINTEXT` and `DELEGATED_SASL_SSL`. You can find more information on those in our [Security documentation](../concepts/02-Clients.md).

To migrate this you need to find the configured security protocol of your existing gateway.
If you were configuring `GATEWAY_SECURITY_PROTOCOL` then it's this configuration to refer to.
If you weren't, then this configuration was infered based on your Kafka `security.protocol` (`KAFKA_SECURITY_PROTOCOL` or `PLAINTEXT` by default)

Based on this configuration follow the corresponding migration table to apply to update your `GATEWAY_SECURITY_PROTOCOL`
| 2.x `GATEWAY_SECURITY_PROTOCOL` | 3.0.0 `GATEWAY_SECURITY_PROTOCOL` |
| --- | --- |
| `SASL_PLAINTEXT` | `DELEGATED_SASL_PLAINTEXT` |
| `SASL_SSL` | `DELEGATED_SASL_SSL` |
| `PLAINTEXT` | `PLAINTEXT` |

### Migrate from `GATEWAY_SECURITY`

This mode is not impacted by configuration change but should now offer all Gateway features (Concentration, Alias topics, Virtual clusters, ...)

### Migrate from `VCLUSTER`

This mode is not impacted by configuration change.
