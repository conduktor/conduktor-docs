---
sidebar_position: 6
title: Migration Guide to 3.x
description: Migrating from a deployed 2.x to a 3.x version of Gateway
---
# Migration guide to 3.x

## Steps: 

```mermaid
flowchart TD
    A[Configuration changes] --> B[Migrate the data]
    B --> C[Deploy Gateway 3.x]
```


## 1. Configuration changes

### 1.1 Internal topics renaming

In Gateway 3.x, the default internal topics have been changed to be prefixed with **\_conduktor_gateway_** 

As a consequence, existing 2.x topics must be explicitly given via the environment configuration.


* Add

| Environment variable               | Value to set <br/> if you did not customize topic names in 2.x | Value to set <br/> if you customized topic names in 2.x                        |
|------------------------------------|----------------------------------------------------------------|--------------------------------------------------------------------------------|
| GATEWAY_TOPIC_MAPPINGS_TOPIC       | _conduktor_gateway_topicmappings                               | N/A                                                                            |
| GATEWAY_INTERCEPTOR_CONFIGS_TOPIC  | _conduktor_gateway_interceptor_configs                         | N/A                                                                            |
| GATEWAY_LICENSE_TOPIC              | _license                                                       | Value of former <br/>GATEWAY_LICENSE_BACKING_TOPIC                             |
| GATEWAY_USER_MAPPINGS_TOPIC        | _userMapping                                                   | Value of former <br/>GATEWAY_USER_MAPPING_BACKING_TOPIC                        |
| GATEWAY_CONSUMER_SUBSCRIPTIONS_TOPIC| _consumerGroupSubscriptionBackingTopic                         | Value of former  <br/>GATEWAY_OFFSET_STORE_CONSUMER_GROUP_SUBSCRIPTION_BACKING_TOPIC |
| GATEWAY_CONSUMER_OFFSETS_TOPIC      | _offsetStore                                                   | Value of former  <br/>GATEWAY_OFFSET_STORE_COMMITTED_OFFSET_BACKING_TOPIC      |
| GATEWAY_ENCRYPTION_CONFIGS_TOPIC    | _encryptionConfig                                              | Value of former <br/>GATEWAY_ENCRYPTION_CONFIG_BACKING_TOPIC                   |
| GATEWAY_ACLS_TOPIC                  | _acls                                                          | Value of former <br/>GATEWAY_ACLS_STORES_BACKING_TOPIC                         |
| GATEWAY_AUDIT_LOG_TOPIC            | _auditLogs                                                     | Value of former <br/>GATEWAY_AUDIT_LOG_SERVICE_BACKING_TOPIC                   |



__Caution:__ 
Do not use the same name for 2 topics even in different versions of Gateway as it could make the data migration fail.

* Remove

    * GATEWAY_LICENSE_BACKING_TOPIC                                                          
    * GATEWAY_TOPIC_STORE_MAPPING_BACKING_TOPIC
    * GATEWAY_TOPIC_STORE_REGISTRY_BACKING_TOPIC 
    * GATEWAY_USER_MAPPING_BACKING_TOPIC                                                     
    * GATEWAY_OFFSET_STORE_CONSUMER_GROUP_SUBSCRIPTION_BACKING_TOPIC                         
    * GATEWAY_OFFSET_STORE_COMMITTED_OFFSET_BACKING_TOPIC                                    
    * GATEWAY_INTERCEPTOR_STORE_BACKING_TOPIC                                                
    * GATEWAY_ENCRYPTION_CONFIG_BACKING_TOPIC                                                
    * GATEWAY_ACLS_STORES_BACKING_TOPIC                                                      
    * GATEWAY_AUDIT_LOG_SERVICE_BACKING_TOPIC                                                


### 1.2 Gateway mode removal

* Update value

__If you are using GATEWAY_MODE=KAFKA_SECURITY__, update the value of `GATEWAY_SECURITY_PROTOCOL` according to the following table :

| V2.x value       | V3.x corresponding value   |
|------------------|----------------------------|
| `SASL_PLAINTEXT` | `DELEGATED_SASL_PLAINTEXT` |
| `SASL_SSL`       | `DELEGATED_SASL_SSL`       |
| `PLAINTEXT`      | `PLAINTEXT`                |
| empty            | empty                      |

* Remove
   * GATEWAY_MODE

## 2. Migrate the data

The data can be migrated before Gateway 3.x is deployed. Gateway 2.x 's data won't be altered and it will keep running during the data migration to 3.x.
This prevents from any service interruption.

__Prerequisites__:
- The target Kafka cluster must be reachable
- Docker is installed
- Create a properties file according to your Kafka cluster configuration. Here is an example:

```properties
# The Kafka bootstrap servers
bootstrap.servers=PLAINTEXT://your.kafka.host:9092
# Add any other Kafka properties here
```


__Cautions__: from this point, the changes made on Gateway 2.x can be lost in the migration process. Until the migration it finished it is recommended to :
* Stop using the Gateway 2.x API
* Stop creating concentrated topics

### 2.1 Topic mappings

Replace the following placeholders with the actual topic names:
* targetTopicMappingsTopicName = value of GATEWAY_TOPIC_MAPPINGS_TOPIC environment variable
* sourceTopicMappingTopicName = value of GATEWAY_TOPIC_STORE_MAPPING_BACKING_TOPIC environment variable
* sourceTopicRegistryTopicName = value of GATEWAY_TOPIC_STORE_REGISTRY_BACKING_TOPIC environment variable

```bash
docker run -v ~/my-kafka.properties:/tmp/my-kafka.properties \
    harbor.cdkt.dev/public/conduktor-gateway-migration:3.0.1 \
    topic -t={targetTopicMappingsTopicName} \
    --topicMappingsTopic={sourceTopicMappingTopicName} \
    --topicRegistryTopic={sourceTopicRegistryTopicName} \
    /tmp/my-kafka.properties
```

Expected output:
```bash
2024-03-19T09:53:34.843+0000 [      main] [INFO ] [TopicMappingRegistryCommand:83] - Loading topic mapping from source topic _topicMappings
2024-03-19T09:53:35.186+0000 [      main] [INFO ] [TopicMappingRegistryCommand:85] - Loading topic registry from source topic _topicRegistry
2024-03-19T09:53:35.252+0000 [      main] [INFO ] [TopicMappingRegistryCommand:90] - Insert in target topic _logicalTopicMappings new configurations
```

### 2.2 Interceptors

Replace the following placeholders with the actual topic names:
* targetInterceptorsTopicName = value of GATEWAY_INTERCEPTOR_CONFIGS_TOPIC environment variable
* sourceInterceptorsTopicName = value of GATEWAY_INTERCEPTOR_STORE_BACKING_TOPIC environment variable
 
```bash
docker run -v ~/my-kafka.properties:/tmp/my-kafka.properties \
    harbor.cdkt.dev/public/conduktor-gateway-migration:3.0.1 \
    interceptor -t={targetInterceptorsTopicName} \
    --topicInterceptorConfigs={sourceInterceptorsTopicName} \
    /tmp/my-kafka.properties
```

Expected output:
```bash
2024-03-19T10:00:23.362+0000 [      main] [INFO ] [InterceptorConfigurationCommand:56] - Loading topic mapping from source topic _interceptorConfigs
2024-03-19T10:00:23.585+0000 [      main] [INFO ] [InterceptorConfigurationCommand:61] - Insert in target topic _conduktor_gateway_interceptor_configs new configurations
```

## 3. Deploy Gateway 3.x

Deploy the new Gateway 3.x with the new configuration settings.
Your client applications should work seamlessly.


