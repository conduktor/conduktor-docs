---
title: Schema Payload Validation for Json Schema
description: Schema Payload Validation for Json Schema
tag: data-quality
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# What is a Schema Payload Validation Policy Interceptor?

Avoid outages from missing or badly formatted records, ensure all messages adhere to a schema.

This interceptor also supports validating payload against specific constraints for AvroSchema and ProtoBuf

This is similar to the validations provided by JsonSchema, such as:

- **Number**: `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `multipleOf`
- **String**: `minLength`, `maxLength`, `pattern`, `format`
- **Collections**: `maxItems`, `minItems`

This interceptor also supports validating payload against specific custom constraints `expression`,
which uses a simple language familiar with devs is [CEL (Common Expression Language)](https://github.com/google/cel-spec)

This interceptor also supports validating payload against specific custom `metadata.rules` object in the schema
using CEL, too.

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690266.svg)](https://asciinema.org/a/690266)

</TabItem>
</Tabs>

## Review the docker compose environment

As can be seen from `docker-compose.yaml` the demo environment consists of the following services:

* gateway1
* gateway2
* kafka-client
* kafka1
* kafka2
* kafka3
* schema-registry

<Tabs>
<TabItem value="Command">

```sh
cat docker-compose.yaml
```

</TabItem>
<TabItem value="File Content">

```yaml
services:
  kafka1:
    image: confluentinc/cp-server:7.5.0
    hostname: kafka1
    container_name: kafka1
    ports:
    - 9092:9092
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_LISTENERS: INTERNAL://kafka1:29092,CONTROLLER://kafka1:29093,EXTERNAL://0.0.0.0:9092
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka1:29092,EXTERNAL://localhost:9092
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka1:29093,2@kafka2:29093,3@kafka3:29093
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
      CLUSTER_ID: p0KPFA_mQb2ixdPbQXPblw
    healthcheck:
      test: nc -zv kafka1 29092 || exit 1
      interval: 5s
      retries: 25
  kafka2:
    image: confluentinc/cp-server:7.5.0
    hostname: kafka2
    container_name: kafka2
    ports:
    - 9093:9093
    environment:
      KAFKA_NODE_ID: 2
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_LISTENERS: INTERNAL://kafka2:29092,CONTROLLER://kafka2:29093,EXTERNAL://0.0.0.0:9093
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka2:29092,EXTERNAL://localhost:9093
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka1:29093,2@kafka2:29093,3@kafka3:29093
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
      CLUSTER_ID: p0KPFA_mQb2ixdPbQXPblw
    healthcheck:
      test: nc -zv kafka1 29092 || exit 1
      interval: 5s
      retries: 25
  kafka3:
    image: confluentinc/cp-server:7.5.0
    hostname: kafka3
    container_name: kafka3
    ports:
    - 9094:9094
    environment:
      KAFKA_NODE_ID: 3
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_LISTENERS: INTERNAL://kafka3:29092,CONTROLLER://kafka3:29093,EXTERNAL://0.0.0.0:9094
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka3:29092,EXTERNAL://localhost:9094
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka1:29093,2@kafka2:29093,3@kafka3:29093
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
      CLUSTER_ID: p0KPFA_mQb2ixdPbQXPblw
    healthcheck:
      test: nc -zv kafka3 29092 || exit 1
      interval: 5s
      retries: 25
  schema-registry:
    image: confluentinc/cp-schema-registry:latest
    hostname: schema-registry
    container_name: schema-registry
    ports:
    - 8081:8081
    environment:
      SCHEMA_REGISTRY_HOST_NAME: schema-registry
      SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS: kafka1:29092,kafka2:29092,kafka3:29092
      SCHEMA_REGISTRY_LOG4J_ROOT_LOGLEVEL: WARN
      SCHEMA_REGISTRY_LISTENERS: http://0.0.0.0:8081
      SCHEMA_REGISTRY_KAFKASTORE_TOPIC: _schemas
      SCHEMA_REGISTRY_SCHEMA_REGISTRY_GROUP_ID: schema-registry
    volumes:
    - type: bind
      source: .
      target: /clientConfig
      read_only: true
    depends_on:
      kafka1:
        condition: service_healthy
      kafka2:
        condition: service_healthy
      kafka3:
        condition: service_healthy
    healthcheck:
      test: nc -zv schema-registry 8081 || exit 1
      interval: 5s
      retries: 25
  gateway1:
    image: conduktor/conduktor-gateway:3.3.2
    hostname: gateway1
    container_name: gateway1
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:29092,kafka2:29092,kafka3:29092
      GATEWAY_ADVERTISED_HOST: localhost
      GATEWAY_SECURITY_PROTOCOL: PLAINTEXT
      GATEWAY_FEATURE_FLAGS_ANALYTICS: false
    depends_on:
      kafka1:
        condition: service_healthy
      kafka2:
        condition: service_healthy
      kafka3:
        condition: service_healthy
    ports:
    - 6969:6969
    - 6970:6970
    - 6971:6971
    - 6972:6972
    - 8888:8888
    healthcheck:
      test: curl localhost:8888/health
      interval: 5s
      retries: 25
  gateway2:
    image: conduktor/conduktor-gateway:3.3.2
    hostname: gateway2
    container_name: gateway2
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:29092,kafka2:29092,kafka3:29092
      GATEWAY_ADVERTISED_HOST: localhost
      GATEWAY_SECURITY_PROTOCOL: PLAINTEXT
      GATEWAY_FEATURE_FLAGS_ANALYTICS: false
    depends_on:
      kafka1:
        condition: service_healthy
      kafka2:
        condition: service_healthy
      kafka3:
        condition: service_healthy
    ports:
    - 7969:6969
    - 7970:6970
    - 7971:6971
    - 7972:6972
    - 8889:8888
    healthcheck:
      test: curl localhost:8888/health
      interval: 5s
      retries: 25
  kafka-client:
    image: confluentinc/cp-kafka:latest
    hostname: kafka-client
    container_name: kafka-client
    command: sleep infinity
    volumes:
    - type: bind
      source: .
      target: /clientConfig
      read_only: true
```
</TabItem>
</Tabs>

## Starting the docker environment

Start all your docker processes, wait for them to be up and ready, then run in background

* `--wait`: Wait for services to be `running|healthy`. Implies detached mode.
* `--detach`: Detached mode: Run containers in the background






<Tabs>

<TabItem value="Command">
```sh
docker compose up --detach --wait
```


</TabItem>
<TabItem value="Output">

```
 Network safeguard-validate-schema-payload-json_default  Creating
 Network safeguard-validate-schema-payload-json_default  Created
 Container kafka1  Creating
 Container kafka-client  Creating
 Container kafka2  Creating
 Container kafka3  Creating
 Container kafka1  Created
 Container kafka-client  Created
 Container kafka3  Created
 Container kafka2  Created
 Container gateway1  Creating
 Container gateway2  Creating
 Container schema-registry  Creating
 Container gateway1  Created
 Container schema-registry  Created
 Container gateway2  Created
 Container kafka1  Starting
 Container kafka-client  Starting
 Container kafka3  Starting
 Container kafka2  Starting
 Container kafka3  Started
 Container kafka2  Started
 Container kafka1  Started
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka-client  Started
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container schema-registry  Starting
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container gateway1  Starting
 Container kafka3  Healthy
 Container gateway2  Starting
 Container schema-registry  Started
 Container gateway1  Started
 Container gateway2  Started
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container kafka-client  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container gateway2  Healthy
 Container schema-registry  Healthy
container gateway1 exited (96)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690253.svg)](https://asciinema.org/a/690253)

</TabItem>
</Tabs>

## Creating topic topic-json-schema on gateway1

Creating on `gateway1`:

* Topic `topic-json-schema` with partitions:1 and replication-factor:1






<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic topic-json-schema
```


</TabItem>
<TabItem value="Output">

```
[2024-11-17 21:05:54,257] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:05:54,360] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:05:54,462] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:05:54,767] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:05:55,189] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:05:55,998] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:05:57,013] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:05:58,032] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:05:59,049] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:05:59,965] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:00,977] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:01,991] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:03,005] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:04,023] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:05,038] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:05,960] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:06,975] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:07,886] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:08,798] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:09,828] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:10,744] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:11,770] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:12,783] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:13,797] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:14,709] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:15,727] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:16,738] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:17,778] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:18,795] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:19,818] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:20,829] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:21,844] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:22,862] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:23,884] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:24,963] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:25,976] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:26,995] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:28,012] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:29,025] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:29,942] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:30,853] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:31,869] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:32,885] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:33,897] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:34,806] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:35,718] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:36,736] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:37,826] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:38,856] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:39,877] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:40,894] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:41,913] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:42,735] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:43,746] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:44,760] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:45,675] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:46,686] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:47,502] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:48,520] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:49,533] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:50,552] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:51,565] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:52,584] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 21:06:53,605] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
Error while executing topic command : Timed out waiting for a node assignment. Call: createTopics
[2024-11-17 21:06:54,268] ERROR org.apache.kafka.common.errors.TimeoutException: Timed out waiting for a node assignment. Call: createTopics
 (org.apache.kafka.tools.TopicCommand)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690254.svg)](https://asciinema.org/a/690254)

</TabItem>
</Tabs>

## Review the example json schema schema

Review the example json schema schema

<Tabs>
<TabItem value="Command">

```sh
cat user-schema-with-validation-rules.json
```

</TabItem>
<TabItem value="File Content">

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 3,
      "maxLength": 50,
      "expression": "size(name) >= 3"
    },
    "age": {
      "type": "integer",
      "minimum": 0,
      "maximum": 120,
      "expression": "age >= 0 && age <= 120"
    },
    "email": {
      "type": "string",
      "format": "email",
      "expression": "email.contains('foo')"
    },
    "address": {
      "type": "object",
      "properties": {
        "street": {
          "type": "string",
          "minLength": 5,
          "maxLength": 15,
          "expression": "size(street) >= 5 && size(street) <= 15"
        },
        "city": {
          "type": "string",
          "minLength": 2,
          "maxLength": 50
        }
      },
      "expression": "size(address.street) > 1 && address.street.contains('paris') || address.city == 'paris'"
    },
    "hobbies": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 2,
      "expression": "size(hobbies) >= 2"
    }
  },
  "metadata": {
    "rules": [
      {
        "name": "check hobbies size",
        "expression": "size(message.hobbies) == 2",
        "message": "hobbies must have 2 items"
      },
      {
        "name": "checkAge",
        "expression": "message.age >= 18",
        "message": "age must be greater than or equal to 18"
      },
      {
        "name": "check email",
        "expression": "message.email.endsWith('example.com')",
        "message": "email should end with 'example.com'"
      },
      {
        "name": "check street",
        "expression": "size(message.address.street) >= 3",
        "message": "address.street length must be greater than equal to 3"
      }
    ]
  }
}
```
</TabItem>
</Tabs>

## Let's register it to the Schema Registry








<Tabs>

<TabItem value="Command">
```sh
curl -s \
  http://localhost:8081/subjects/topic-json-schema/versions \
  -X POST \
  -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data "{\"schemaType\": \"JSON\", \"schema\": $(cat user-schema-with-validation-rules.json | jq tostring)}"
```


</TabItem>
<TabItem value="Output">

```
{"id":1}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690255.svg)](https://asciinema.org/a/690255)

</TabItem>
</Tabs>

## Review invalid payload

Review invalid payload

<Tabs>
<TabItem value="Command">

```sh
cat invalid-payload.json
```

</TabItem>
<TabItem value="File Content">

```json
{
  "name": "D",
  "age": 17,
  "email": "bad email",
  "address": {
    "street": "a way too lond adress that will not fit in your database",
    "city": ""
  },
  "hobbies": [
    "reading"
  ],
  "friends": [
    {
      "name": "Tom",
      "age": 17
    },
    {
      "name": "Emma",
      "age": 18
    }
  ]
}
```
</TabItem>
</Tabs>

## Let's send invalid data

Perfect the Json Schema serializer did its magic and validated our rules






<Tabs>

<TabItem value="Command">
```sh
cat invalid-payload.json | jq -c | \
    kafka-json-schema-console-producer \
        --bootstrap-server localhost:6969 \
        --topic topic-json-schema \
        --property schema.registry.url=http://localhost:8081 \
        --property value.schema.id=1
```


</TabItem>
<TabItem value="Output">

```
[2024-11-17 21:06:56,790] INFO KafkaJsonSchemaSerializerConfig values: 
	auto.register.schemas = true
	basic.auth.credentials.source = URL
	basic.auth.user.info = [hidden]
	bearer.auth.cache.expiry.buffer.seconds = 300
	bearer.auth.client.id = null
	bearer.auth.client.secret = null
	bearer.auth.credentials.source = STATIC_TOKEN
	bearer.auth.custom.provider.class = null
	bearer.auth.identity.pool.id = null
	bearer.auth.issuer.endpoint.url = null
	bearer.auth.logical.cluster = null
	bearer.auth.scope = null
	bearer.auth.scope.claim.name = scope
	bearer.auth.sub.claim.name = sub
	bearer.auth.token = [hidden]
	context.name.strategy = class io.confluent.kafka.serializers.context.NullContextNameStrategy
	http.connect.timeout.ms = 60000
	http.read.timeout.ms = 60000
	id.compatibility.strict = true
	json.default.property.inclusion = null
	json.fail.invalid.schema = true
	json.fail.unknown.properties = true
	json.indent.output = false
	json.oneof.for.nullables = true
	json.schema.spec.version = draft_7
	json.write.dates.iso8601 = false
	key.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
	latest.cache.size = 1000
	latest.cache.ttl.sec = -1
	latest.compatibility.strict = true
	max.schemas.per.subject = 1000
	normalize.schemas = false
	proxy.host = 
	proxy.port = -1
	rule.actions = []
	rule.executors = []
	rule.service.loader.enable = true
	schema.format = null
	schema.reflection = false
	schema.registry.basic.auth.user.info = [hidden]
	schema.registry.ssl.cipher.suites = null
	schema.registry.ssl.enabled.protocols = [TLSv1.2, TLSv1.3]
	schema.registry.ssl.endpoint.identification.algorithm = https
	schema.registry.ssl.engine.factory.class = null
	schema.registry.ssl.key.password = null
	schema.registry.ssl.keymanager.algorithm = SunX509
	schema.registry.ssl.keystore.certificate.chain = null
	schema.registry.ssl.keystore.key = null
	schema.registry.ssl.keystore.location = null
	schema.registry.ssl.keystore.password = null
	schema.registry.ssl.keystore.type = JKS
	schema.registry.ssl.protocol = TLSv1.3
	schema.registry.ssl.provider = null
	schema.registry.ssl.secure.random.implementation = null
	schema.registry.ssl.trustmanager.algorithm = PKIX
	schema.registry.ssl.truststore.certificates = null
	schema.registry.ssl.truststore.location = null
	schema.registry.ssl.truststore.password = null
	schema.registry.ssl.truststore.type = JKS
	schema.registry.url = [http://localhost:8081]
	use.latest.version = false
	use.latest.with.metadata = null
	use.schema.id = -1
	value.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
 (io.confluent.kafka.serializers.json.KafkaJsonSchemaSerializerConfig:370)
org.apache.kafka.common.errors.SerializationException: Error serializing JSON message
	at io.confluent.kafka.serializers.json.AbstractKafkaJsonSchemaSerializer.serializeImpl(AbstractKafkaJsonSchemaSerializer.java:171)
	at io.confluent.kafka.formatter.json.JsonSchemaMessageReader$JsonSchemaMessageSerializer.serialize(JsonSchemaMessageReader.java:167)
	at io.confluent.kafka.formatter.json.JsonSchemaMessageReader$JsonSchemaMessageSerializer.serialize(JsonSchemaMessageReader.java:130)
	at io.confluent.kafka.formatter.SchemaMessageReader.readMessage(SchemaMessageReader.java:406)
	at kafka.tools.ConsoleProducer$$anon$1$$anon$2.hasNext(ConsoleProducer.scala:67)
	at kafka.tools.ConsoleProducer$.loopReader(ConsoleProducer.scala:90)
	at kafka.tools.ConsoleProducer$.main(ConsoleProducer.scala:99)
	at kafka.tools.ConsoleProducer.main(ConsoleProducer.scala)
Caused by: org.apache.kafka.common.errors.SerializationException: Validation error in JSON {"name":"D","age":17,"email":"bad email","address":{"street":"a way too lond adress that will not fit in your database","city":""},"hobbies":["reading"],"friends":[{"name":"Tom","age":17},{"name":"Emma","age":18}]}, Error report:
{
  "schemaLocation": "#",
  "pointerToViolation": "#",
  "causingExceptions": [
    {
      "schemaLocation": "#/properties/address",
      "pointerToViolation": "#/address",
      "causingExceptions": [
        {
          "schemaLocation": "#/properties/address/properties/city",
          "pointerToViolation": "#/address/city",
          "causingExceptions": [],
          "keyword": "minLength",
          "message": "expected minLength: 2, actual: 0"
        },
        {
          "schemaLocation": "#/properties/address/properties/street",
          "pointerToViolation": "#/address/street",
          "causingExceptions": [],
          "keyword": "maxLength",
          "message": "expected maxLength: 15, actual: 56"
        }
      ],
      "message": "2 schema violations found"
    },
    {
      "schemaLocation": "#/properties/hobbies",
      "pointerToViolation": "#/hobbies",
      "causingExceptions": [],
      "keyword": "minItems",
      "message": "expected minimum item count: 2, found: 1"
    },
    {
      "schemaLocation": "#/properties/name",
      "pointerToViolation": "#/name",
      "causingExceptions": [],
      "keyword": "minLength",
      "message": "expected minLength: 3, actual: 1"
    },
    {
      "schemaLocation": "#/properties/email",
      "pointerToViolation": "#/email",
      "causingExceptions": [],
      "keyword": "format",
      "message": "[bad email] is not a valid email address"
    }
  ],
  "message": "5 schema violations found"
}
	at io.confluent.kafka.serializers.json.AbstractKafkaJsonSchemaSerializer.validateJson(AbstractKafkaJsonSchemaSerializer.java:194)
	at io.confluent.kafka.serializers.json.AbstractKafkaJsonSchemaSerializer.serializeImpl(AbstractKafkaJsonSchemaSerializer.java:159)
	... 7 more
Caused by: org.everit.json.schema.ValidationException: #: 5 schema violations found
	at org.everit.json.schema.ValidationException.copy(ValidationException.java:486)
	at org.everit.json.schema.DefaultValidator.performValidation(Validator.java:76)
	at org.everit.json.schema.Schema.validate(Schema.java:152)
	at io.confluent.kafka.schemaregistry.json.JsonSchema.validate(JsonSchema.java:440)
	at io.confluent.kafka.schemaregistry.json.JsonSchema.validate(JsonSchema.java:408)
	at io.confluent.kafka.serializers.json.AbstractKafkaJsonSchemaSerializer.validateJson(AbstractKafkaJsonSchemaSerializer.java:184)
	... 8 more

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690256.svg)](https://asciinema.org/a/690256)

</TabItem>
</Tabs>

## Let's send invalid data using the protocol

Unfortunately the message went through






<Tabs>

<TabItem value="Command">
```sh
MAGIC_BYTE="\000"
SCHEMA_ID="\000\000\000\001"
JSON_PAYLOAD=$(cat invalid-payload.json | jq -c)
printf "${MAGIC_BYTE}${SCHEMA_ID}${JSON_PAYLOAD}" | \
  kcat \
    -E \ 
    -b localhost:6969 \
    -X security.protocol=PLAINTEXT \
    -X sasl.mechanism=PLAIN \
    -P \
    -t topic-json-schema
```


</TabItem>
<TabItem value="Output">

```
Error: -b <broker,..> missing

Usage: kcat <options> [file1 file2 .. | topic1 topic2 ..]]
kcat - Apache Kafka producer and consumer tool
https://github.com/edenhill/kcat
Copyright (c) 2014-2021, Magnus Edenhill
Version 1.7.0 (JSON, Avro, Transactions, IncrementalAssign, librdkafka 2.6.0 builtin.features=gzip,snappy,ssl,sasl,regex,lz4,sasl_gssapi,sasl_plain,sasl_scram,plugins,zstd,sasl_oauthbearer,http,oidc)


General options:
  -C | -P | -L | -Q  Mode: Consume, Produce, Metadata List, Query mode
  -G <group-id>      Mode: High-level KafkaConsumer (Kafka >=0.9 balanced consumer groups)
                     Expects a list of topics to subscribe to
  -t <topic>         Topic to consume from, produce to, or list
  -p <partition>     Partition
  -b <brokers,..>    Bootstrap broker(s) (host[:port])
  -D <delim>         Message delimiter string:
                     a-z | \r | \n | \t | \xNN ..
                     Default: \n
  -K <delim>         Key delimiter (same format as -D)
  -c <cnt>           Limit message count
  -m <seconds>       Metadata (et.al.) request timeout.
                     This limits how long kcat will block
                     while waiting for initial metadata to be
                     retrieved from the Kafka cluster.
                     It also sets the timeout for the producer's
                     transaction commits, init, aborts, etc.
                     Default: 5 seconds.
  -F <config-file>   Read configuration properties from file,
                     file format is "property=value".
                     The KCAT_CONFIG=path environment can also be used, but -F takes precedence.
                     The default configuration file is $HOME/.config/kcat.conf
  -X list            List available librdkafka configuration properties
  -X prop=val        Set librdkafka configuration property.
                     Properties prefixed with "topic." are
                     applied as topic properties.
  -X schema.registry.prop=val Set libserdes configuration property for the Avro/Schema-Registry client.
  -X dump            Dump configuration and exit.
  -d <dbg1,...>      Enable librdkafka debugging:
                     all,generic,broker,topic,metadata,feature,queue,msg,protocol,cgrp,security,fetch,interceptor,plugin,consumer,admin,eos,mock,assignor,conf
  -q                 Be quiet (verbosity set to 0)
  -v                 Increase verbosity
  -E                 Do not exit on non-fatal error
  -V                 Print version
  -h                 Print usage help

Producer options:
  -z snappy|gzip|lz4 Message compression. Default: none
  -p -1              Use random partitioner
  -D <delim>         Delimiter to split input into messages
  -K <delim>         Delimiter to split input key and message
  -k <str>           Use a fixed key for all messages.
                     If combined with -K, per-message keys
                     takes precendence.
  -H <header=value>  Add Message Headers (may be specified multiple times)
  -l                 Send messages from a file separated by
                     delimiter, as with stdin.
                     (only one file allowed)
  -T                 Output sent messages to stdout, acting like tee.
  -c <cnt>           Exit after producing this number of messages
  -Z                 Send empty messages as NULL messages
  file1 file2..      Read messages from files.
                     With -l, only one file permitted.
                     Otherwise, the entire file contents will
                     be sent as one single message.
  -X transactional.id=.. Enable transactions and send all
                     messages in a single transaction which
                     is committed when stdin is closed or the
                     input file(s) are fully read.
                     If kcat is terminated through Ctrl-C
                     (et.al) the transaction will be aborted.

Consumer options:
  -o <offset>        Offset to start consuming from:
                     beginning | end | stored |
                     <value>  (absolute offset) |
                     -<value> (relative offset from end)
                     s@<value> (timestamp in ms to start at)
                     e@<value> (timestamp in ms to stop at (not included))
  -e                 Exit successfully when last message received
  -f <fmt..>         Output formatting string, see below.
                     Takes precedence over -D and -K.
  -J                 Output with JSON envelope
  -s key=<serdes>    Deserialize non-NULL keys using <serdes>.
  -s value=<serdes>  Deserialize non-NULL values using <serdes>.
  -s <serdes>        Deserialize non-NULL keys and values using <serdes>.
                     Available deserializers (<serdes>):
                       <pack-str> - A combination of:
                                    <: little-endian,
                                    >: big-endian (recommended),
                                    b: signed 8-bit integer
                                    B: unsigned 8-bit integer
                                    h: signed 16-bit integer
                                    H: unsigned 16-bit integer
                                    i: signed 32-bit integer
                                    I: unsigned 32-bit integer
                                    q: signed 64-bit integer
                                    Q: unsigned 64-bit integer
                                    c: ASCII character
                                    s: remaining data is string
                                    $: match end-of-input (no more bytes remaining or a parse error is raised).
                                       Not including this token skips any
                                       remaining data after the pack-str is
                                       exhausted.
                       avro       - Avro-formatted with schema in Schema-Registry (requires -r)
                     E.g.: -s key=i -s value=avro - key is 32-bit integer, value is Avro.
                       or: -s avro - both key and value are Avro-serialized
  -r <url>           Schema registry URL (when avro deserializer is used with -s)
  -D <delim>         Delimiter to separate messages on output
  -K <delim>         Print message keys prefixing the message
                     with specified delimiter.
  -O                 Print message offset using -K delimiter
  -c <cnt>           Exit after consuming this number of messages
  -Z                 Print NULL values and keys as "NULL" instead of empty.
                     For JSON (-J) the nullstr is always null.
  -u                 Unbuffered output

Metadata options (-L):
  -t <topic>         Topic to query (optional)

Query options (-Q):
  -t <t>:<p>:<ts>    Get offset for topic <t>,
                     partition <p>, timestamp <ts>.
                     Timestamp is the number of milliseconds
                     since epoch UTC.
                     Requires broker >= 0.10.0.0 and librdkafka >= 0.9.3.
                     Multiple -t .. are allowed but a partition
                     must only occur once.

Format string tokens:
  %s                 Message payload
  %S                 Message payload length (or -1 for NULL)
  %R                 Message payload length (or -1 for NULL) serialized
                     as a binary big endian 32-bit signed integer
  %k                 Message key
  %K                 Message key length (or -1 for NULL)
  %T                 Message timestamp (milliseconds since epoch UTC)
  %h                 Message headers (n=v CSV)
  %t                 Topic
  %p                 Partition
  %o                 Message offset
  \n \r \t           Newlines, tab
  \xXX \xNNN         Any ASCII character
 Example:
  -f 'Topic %t [%p] at offset %o: key %k: %s\n'

JSON message envelope (on one line) when consuming with -J:
 { "topic": str, "partition": int, "offset": int,
   "tstype": "create|logappend|unknown", "ts": int, // timestamp in milliseconds since epoch
   "broker": int,
   "headers": { "<name>": str, .. }, // optional
   "key": str|json, "payload": str|json,
   "key_error": str, "payload_error": str, //optional
   "key_schema_id": int, "value_schema_id": int //optional
 }
 notes:
   - key_error and payload_error are only included if deserialization fails.
   - key_schema_id and value_schema_id are included for successfully deserialized Avro messages.

Consumer mode (writes messages to stdout):
  kcat -b <broker> -t <topic> -p <partition>
 or:
  kcat -C -b ...

High-level KafkaConsumer mode:
  kcat -b <broker> -G <group-id> topic1 top2 ^aregex\d+

Producer mode (reads messages from stdin):
  ... | kcat -b <broker> -t <topic> -p <partition>
 or:
  kcat -P -b ...

Metadata listing:
  kcat -L -b <broker> [-t <topic>]

Query offset by timestamp:
  kcat -Q -b broker -t <topic>:<partition>:<timestamp>

step-10-SH.sh: line 8: -b: command not found

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690257.svg)](https://asciinema.org/a/690257)

</TabItem>
</Tabs>

## Let's consume it back

That's pretty bad, you are going to propagate wrong data within your system!






<Tabs>

<TabItem value="Command">
```sh
kafka-json-schema-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic topic-json-schema \
    --from-beginning \
    --skip-message-on-error \
    --timeout-ms 3000
```


</TabItem>
<TabItem value="Output">

```
[2024-11-17 21:06:58,220] INFO KafkaJsonSchemaDeserializerConfig values: 
	auto.register.schemas = true
	basic.auth.credentials.source = URL
	basic.auth.user.info = [hidden]
	bearer.auth.cache.expiry.buffer.seconds = 300
	bearer.auth.client.id = null
	bearer.auth.client.secret = null
	bearer.auth.credentials.source = STATIC_TOKEN
	bearer.auth.custom.provider.class = null
	bearer.auth.identity.pool.id = null
	bearer.auth.issuer.endpoint.url = null
	bearer.auth.logical.cluster = null
	bearer.auth.scope = null
	bearer.auth.scope.claim.name = scope
	bearer.auth.sub.claim.name = sub
	bearer.auth.token = [hidden]
	context.name.strategy = class io.confluent.kafka.serializers.context.NullContextNameStrategy
	http.connect.timeout.ms = 60000
	http.read.timeout.ms = 60000
	id.compatibility.strict = true
	json.fail.invalid.schema = true
	json.fail.unknown.properties = true
	json.key.type = class java.lang.Object
	json.value.type = class java.lang.Object
	key.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
	latest.cache.size = 1000
	latest.cache.ttl.sec = -1
	latest.compatibility.strict = true
	max.schemas.per.subject = 1000
	normalize.schemas = false
	proxy.host = 
	proxy.port = -1
	rule.actions = []
	rule.executors = []
	rule.service.loader.enable = true
	schema.format = null
	schema.reflection = false
	schema.registry.basic.auth.user.info = [hidden]
	schema.registry.ssl.cipher.suites = null
	schema.registry.ssl.enabled.protocols = [TLSv1.2, TLSv1.3]
	schema.registry.ssl.endpoint.identification.algorithm = https
	schema.registry.ssl.engine.factory.class = null
	schema.registry.ssl.key.password = null
	schema.registry.ssl.keymanager.algorithm = SunX509
	schema.registry.ssl.keystore.certificate.chain = null
	schema.registry.ssl.keystore.key = null
	schema.registry.ssl.keystore.location = null
	schema.registry.ssl.keystore.password = null
	schema.registry.ssl.keystore.type = JKS
	schema.registry.ssl.protocol = TLSv1.3
	schema.registry.ssl.provider = null
	schema.registry.ssl.secure.random.implementation = null
	schema.registry.ssl.trustmanager.algorithm = PKIX
	schema.registry.ssl.truststore.certificates = null
	schema.registry.ssl.truststore.location = null
	schema.registry.ssl.truststore.password = null
	schema.registry.ssl.truststore.type = JKS
	schema.registry.url = [http://localhost:8081]
	type.property = javaType
	use.latest.version = false
	use.latest.with.metadata = null
	use.schema.id = -1
	value.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
 (io.confluent.kafka.serializers.json.KafkaJsonSchemaDeserializerConfig:370)
[2024-11-17 21:07:01,435] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$:45)
org.apache.kafka.common.errors.TimeoutException
[2024-11-17 21:07:01,435] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$:45)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 0 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690258.svg)](https://asciinema.org/a/690258)

</TabItem>
</Tabs>

## Adding interceptor guard-schema-payload-validate

Add Schema Payload Validation Policy Interceptor




`step-12-guard-schema-payload-validate-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "guard-schema-payload-validate"
  },
  "spec" : {
    "comment" : "Adding interceptor: guard-schema-payload-validate",
    "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
    "priority" : 100,
    "config" : {
      "schemaRegistryConfig" : {
        "host" : "http://schema-registry:8081"
      },
      "topic" : "topic-.*",
      "schemaIdRequired" : true,
      "validateSchema" : true,
      "action" : "BLOCK"
    }
  }
}
```


<Tabs>

<TabItem value="Command">
```sh
curl \
    --silent \
    --request PUT "http://localhost:8888/gateway/v2/interceptor" \
    --header "Content-Type: application/json" \
    --user "admin:conduktor" \
    --data @step-12-guard-schema-payload-validate-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690259.svg)](https://asciinema.org/a/690259)

</TabItem>
</Tabs>

## Listing interceptors

Listing interceptors on `gateway1`






<Tabs>

<TabItem value="Command">
```sh
curl \
    --silent \
    --request GET "http://localhost:8888/gateway/v2/interceptor" \
    --user "admin:conduktor" | jq
```


</TabItem>
<TabItem value="Output">

```json

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690260.svg)](https://asciinema.org/a/690260)

</TabItem>
</Tabs>

## Let's send invalid data using the protocol again

Perfect our interceptor did its magic and validated our rules






<Tabs>

<TabItem value="Command">
```sh
MAGIC_BYTE="\000"
SCHEMA_ID="\000\000\000\001"
JSON_PAYLOAD=$(cat invalid-payload.json | jq -c)
printf "${MAGIC_BYTE}${SCHEMA_ID}${JSON_PAYLOAD}" | \
  kcat \
    -E \
    -b localhost:6969 \
    -X security.protocol=PLAINTEXT \
    -P \
    -t topic-json-schema
```


</TabItem>
<TabItem value="Output">

```
%3|1731877621.941|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 2ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 2ms in state CONNECT)
% ERROR: Local: All broker connections are down: 1/1 brokers are down
%3|1731877622.942|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT, 1 identical error(s) suppressed)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT, 1 identical error(s) suppressed)
%3|1731877623.947|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877627.959|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877629.965|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 4ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 4ms in state CONNECT)
%3|1731877635.985|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877636.996|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 4ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 4ms in state CONNECT)
%3|1731877637.993|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877639.996|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877642.003|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877643.009|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 3ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 3ms in state CONNECT)
%3|1731877644.010|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877645.012|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877646.015|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877648.026|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 3ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 3ms in state CONNECT)
%3|1731877650.034|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877651.035|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877652.044|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 4ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 4ms in state CONNECT)
%3|1731877653.045|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT, 1 identical error(s) suppressed)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT, 1 identical error(s) suppressed)
%3|1731877656.054|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877658.061|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877661.073|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877668.098|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877669.100|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877670.103|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877671.109|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 2ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 2ms in state CONNECT)
%3|1731877678.136|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877683.154|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877684.159|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 3ms in state CONNECT, 1 identical error(s) suppressed)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 3ms in state CONNECT, 1 identical error(s) suppressed)
%3|1731877685.161|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877686.166|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877687.169|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877688.176|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877691.187|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877692.192|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877693.195|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877694.200|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877695.202|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877696.202|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877699.213|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877703.231|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877706.245|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877707.250|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877708.255|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877709.259|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 3ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 3ms in state CONNECT)
%3|1731877711.265|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877712.270|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877713.277|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 3ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 3ms in state CONNECT)
%3|1731877714.278|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT, 1 identical error(s) suppressed)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT, 1 identical error(s) suppressed)
%3|1731877715.278|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877716.278|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877717.284|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877718.289|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877720.294|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877722.309|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 3ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 3ms in state CONNECT)
%3|1731877724.311|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877728.327|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877732.345|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877733.349|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877734.354|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877735.358|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877741.382|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877744.395|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877745.398|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877746.402|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT, 1 identical error(s) suppressed)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT, 1 identical error(s) suppressed)
%3|1731877747.410|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 3ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 3ms in state CONNECT)
%3|1731877748.412|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877751.423|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877753.428|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877754.434|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877755.439|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877757.444|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 4ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 4ms in state CONNECT)
%3|1731877758.441|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877760.449|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877761.453|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877762.460|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877763.462|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877766.477|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877767.480|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877768.484|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877769.494|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 6ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 6ms in state CONNECT)
%3|1731877770.493|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877772.499|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877773.502|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877775.509|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877776.514|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877777.516|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT, 1 identical error(s) suppressed)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT, 1 identical error(s) suppressed)
%3|1731877782.537|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877783.542|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877784.542|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877788.559|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877789.561|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877793.580|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877794.582|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877800.610|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877801.614|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877803.622|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877807.641|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877808.644|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877809.646|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877810.650|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877811.653|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT, 1 identical error(s) suppressed)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT, 1 identical error(s) suppressed)
%3|1731877813.671|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 7ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 7ms in state CONNECT)
%3|1731877814.665|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877817.676|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877818.681|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877819.684|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877825.710|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877826.715|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877830.731|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877832.737|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877834.745|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877837.761|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877838.766|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877839.770|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877841.785|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT, 2 identical error(s) suppressed)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT, 2 identical error(s) suppressed)
%3|1731877843.791|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 2ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 2ms in state CONNECT)
%3|1731877844.793|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877847.800|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877849.812|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 4ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 4ms in state CONNECT)
%3|1731877850.807|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877852.820|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 2ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 2ms in state CONNECT)
%3|1731877853.822|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877855.829|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877857.839|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877859.848|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877860.853|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877863.865|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877866.879|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877870.897|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877871.904|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 4ms in state CONNECT, 1 identical error(s) suppressed)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 4ms in state CONNECT, 1 identical error(s) suppressed)
%3|1731877872.904|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877877.928|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 2ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 2ms in state CONNECT)
%3|1731877879.934|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877880.937|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877882.944|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877883.949|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877885.956|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877887.963|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877891.982|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877893.989|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877894.993|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877897.001|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 2ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 2ms in state CONNECT)
%3|1731877898.005|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877902.016|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT, 4 identical error(s) suppressed)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT, 4 identical error(s) suppressed)
%3|1731877906.037|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877908.046|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877909.045|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877910.051|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877911.055|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 1ms in state CONNECT)
%3|1731877915.074|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 2ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 2ms in state CONNECT)
%3|1731877916.072|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877917.078|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877919.087|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877920.096|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 2ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 2ms in state CONNECT)
%3|1731877921.095|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)
%3|1731877921.945|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% ERROR: Local: Broker transport failure: localhost:6969/bootstrap: Connect to ipv4#127.0.0.1:6969 failed: Connection refused (after 0ms in state CONNECT)
% Delivery failed for message: Local: Message timed out
%3|1731877922.103|FAIL|rdkafka#producer-1| [thrd:localhost:6969/bootstrap]: localhost:6969/bootstrap: Connect to ipv6#[::1]:6969 failed: Connection refused (after 0ms in state CONNECT)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690261.svg)](https://asciinema.org/a/690261)

</TabItem>
</Tabs>

## Check in the audit log that message was denied

Check in the audit log that message was denied in cluster `kafka1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:9092,localhost:9093,localhost:9094 \
    --topic _conduktor_gateway_auditlogs \
    --from-beginning \
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin")'
```


returns 1 event
```json
{
  "id" : "3a2962ce-ef87-4a52-828d-20ee6a50f794",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.176.1:35142"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-17T21:05:08.689090586Z",
  "eventData" : {
    "interceptorName" : "guard-schema-payload-validate",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Request parameters do not satisfy the configured policy. Topic 'topic-json-schema' has invalid json schema payload: hobbies must have 2 items, age must be greater than or equal to 18, email should end with 'example.com', #/hobbies: expected minimum item count: 2, found: 1, #/name: expected minLength: 3, actual: 1, #/email: [bad email] is not a valid email address, #/address/city: expected minLength: 2, actual: 0, #/address/street: expected maxLength: 15, actual: 56, street does not match expression 'size(street) >= 5 && size(street) <= 15', address does not match expression 'size(address.street) > 1 && address.street.contains('paris') || address.city == 'paris'', hobbies does not match expression 'size(hobbies) >= 2', name does not match expression 'size(name) >= 3', email does not match expression 'email.contains('foo')'"
  }
}
```

</TabItem>
<TabItem value="Output">

```
[2024-11-17 21:12:06,257] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 0 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690262.svg)](https://asciinema.org/a/690262)

</TabItem>
</Tabs>

## Let's now produce a valid payload








<Tabs>

<TabItem value="Command">
```sh
cat valid-payload.json | jq -c | \
    kafka-json-schema-console-producer \
        --bootstrap-server localhost:6969 \
        --topic topic-json-schema \
        --property schema.registry.url=http://localhost:8081 \
        --property value.schema.id=1
```


</TabItem>
<TabItem value="Output">

```
[2024-11-17 21:12:07,914] INFO KafkaJsonSchemaSerializerConfig values: 
	auto.register.schemas = true
	basic.auth.credentials.source = URL
	basic.auth.user.info = [hidden]
	bearer.auth.cache.expiry.buffer.seconds = 300
	bearer.auth.client.id = null
	bearer.auth.client.secret = null
	bearer.auth.credentials.source = STATIC_TOKEN
	bearer.auth.custom.provider.class = null
	bearer.auth.identity.pool.id = null
	bearer.auth.issuer.endpoint.url = null
	bearer.auth.logical.cluster = null
	bearer.auth.scope = null
	bearer.auth.scope.claim.name = scope
	bearer.auth.sub.claim.name = sub
	bearer.auth.token = [hidden]
	context.name.strategy = class io.confluent.kafka.serializers.context.NullContextNameStrategy
	http.connect.timeout.ms = 60000
	http.read.timeout.ms = 60000
	id.compatibility.strict = true
	json.default.property.inclusion = null
	json.fail.invalid.schema = true
	json.fail.unknown.properties = true
	json.indent.output = false
	json.oneof.for.nullables = true
	json.schema.spec.version = draft_7
	json.write.dates.iso8601 = false
	key.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
	latest.cache.size = 1000
	latest.cache.ttl.sec = -1
	latest.compatibility.strict = true
	max.schemas.per.subject = 1000
	normalize.schemas = false
	proxy.host = 
	proxy.port = -1
	rule.actions = []
	rule.executors = []
	rule.service.loader.enable = true
	schema.format = null
	schema.reflection = false
	schema.registry.basic.auth.user.info = [hidden]
	schema.registry.ssl.cipher.suites = null
	schema.registry.ssl.enabled.protocols = [TLSv1.2, TLSv1.3]
	schema.registry.ssl.endpoint.identification.algorithm = https
	schema.registry.ssl.engine.factory.class = null
	schema.registry.ssl.key.password = null
	schema.registry.ssl.keymanager.algorithm = SunX509
	schema.registry.ssl.keystore.certificate.chain = null
	schema.registry.ssl.keystore.key = null
	schema.registry.ssl.keystore.location = null
	schema.registry.ssl.keystore.password = null
	schema.registry.ssl.keystore.type = JKS
	schema.registry.ssl.protocol = TLSv1.3
	schema.registry.ssl.provider = null
	schema.registry.ssl.secure.random.implementation = null
	schema.registry.ssl.trustmanager.algorithm = PKIX
	schema.registry.ssl.truststore.certificates = null
	schema.registry.ssl.truststore.location = null
	schema.registry.ssl.truststore.password = null
	schema.registry.ssl.truststore.type = JKS
	schema.registry.url = [http://localhost:8081]
	use.latest.version = false
	use.latest.with.metadata = null
	use.schema.id = -1
	value.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
 (io.confluent.kafka.serializers.json.KafkaJsonSchemaSerializerConfig:370)
[2024-11-17 21:13:08,377] ERROR Error when sending message to topic topic-json-schema with key: null, value: 211 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback:52)
org.apache.kafka.common.errors.TimeoutException: Topic topic-json-schema not present in metadata after 60000 ms.
[2024-11-17 21:13:08,377] ERROR Error when sending message to topic topic-json-schema with key: null, value: 211 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback:52)
org.apache.kafka.common.errors.TimeoutException: Topic topic-json-schema not present in metadata after 60000 ms.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690263.svg)](https://asciinema.org/a/690263)

</TabItem>
</Tabs>

## And consume it back








<Tabs>

<TabItem value="Command">
```sh
kafka-json-schema-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic topic-json-schema \
    --from-beginning \
    --skip-message-on-error \
    --timeout-ms 3000
```


</TabItem>
<TabItem value="Output">

```
[2024-11-17 21:13:09,519] INFO KafkaJsonSchemaDeserializerConfig values: 
	auto.register.schemas = true
	basic.auth.credentials.source = URL
	basic.auth.user.info = [hidden]
	bearer.auth.cache.expiry.buffer.seconds = 300
	bearer.auth.client.id = null
	bearer.auth.client.secret = null
	bearer.auth.credentials.source = STATIC_TOKEN
	bearer.auth.custom.provider.class = null
	bearer.auth.identity.pool.id = null
	bearer.auth.issuer.endpoint.url = null
	bearer.auth.logical.cluster = null
	bearer.auth.scope = null
	bearer.auth.scope.claim.name = scope
	bearer.auth.sub.claim.name = sub
	bearer.auth.token = [hidden]
	context.name.strategy = class io.confluent.kafka.serializers.context.NullContextNameStrategy
	http.connect.timeout.ms = 60000
	http.read.timeout.ms = 60000
	id.compatibility.strict = true
	json.fail.invalid.schema = true
	json.fail.unknown.properties = true
	json.key.type = class java.lang.Object
	json.value.type = class java.lang.Object
	key.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
	latest.cache.size = 1000
	latest.cache.ttl.sec = -1
	latest.compatibility.strict = true
	max.schemas.per.subject = 1000
	normalize.schemas = false
	proxy.host = 
	proxy.port = -1
	rule.actions = []
	rule.executors = []
	rule.service.loader.enable = true
	schema.format = null
	schema.reflection = false
	schema.registry.basic.auth.user.info = [hidden]
	schema.registry.ssl.cipher.suites = null
	schema.registry.ssl.enabled.protocols = [TLSv1.2, TLSv1.3]
	schema.registry.ssl.endpoint.identification.algorithm = https
	schema.registry.ssl.engine.factory.class = null
	schema.registry.ssl.key.password = null
	schema.registry.ssl.keymanager.algorithm = SunX509
	schema.registry.ssl.keystore.certificate.chain = null
	schema.registry.ssl.keystore.key = null
	schema.registry.ssl.keystore.location = null
	schema.registry.ssl.keystore.password = null
	schema.registry.ssl.keystore.type = JKS
	schema.registry.ssl.protocol = TLSv1.3
	schema.registry.ssl.provider = null
	schema.registry.ssl.secure.random.implementation = null
	schema.registry.ssl.trustmanager.algorithm = PKIX
	schema.registry.ssl.truststore.certificates = null
	schema.registry.ssl.truststore.location = null
	schema.registry.ssl.truststore.password = null
	schema.registry.ssl.truststore.type = JKS
	schema.registry.url = [http://localhost:8081]
	type.property = javaType
	use.latest.version = false
	use.latest.with.metadata = null
	use.schema.id = -1
	value.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
 (io.confluent.kafka.serializers.json.KafkaJsonSchemaDeserializerConfig:370)
[2024-11-17 21:13:12,746] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$:45)
org.apache.kafka.common.errors.TimeoutException
[2024-11-17 21:13:12,746] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$:45)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 0 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690264.svg)](https://asciinema.org/a/690264)

</TabItem>
</Tabs>

## Tearing down the docker environment

Remove all your docker processes and associated volumes

* `--volumes`: Remove named volumes declared in the "volumes" section of the Compose file and anonymous volumes attached to containers.






<Tabs>

<TabItem value="Command">
```sh
docker compose down --volumes
```


</TabItem>
<TabItem value="Output">

```
 Container kafka-client  Stopping
 Container gateway2  Stopping
 Container gateway1  Stopping
 Container schema-registry  Stopping
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway1  Removed
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway2  Removed
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container schema-registry  Removed
 Container kafka3  Stopping
 Container kafka2  Stopping
 Container kafka1  Stopping
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Network safeguard-validate-schema-payload-json_default  Removing
 Network safeguard-validate-schema-payload-json_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690265.svg)](https://asciinema.org/a/690265)

</TabItem>
</Tabs>

# Conclusion

You can enrich your existing schema to add even more data quality to your systems!

