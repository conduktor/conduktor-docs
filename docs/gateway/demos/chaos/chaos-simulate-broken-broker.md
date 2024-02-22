---
title: Chaos Simulate Broken Brokers
description: Chaos Simulate Broken Brokers
tag: chaos
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Simulate Broken Brokers

This interceptor injects intermittent errors in client connections to brokers that are consistent with broker side issues.

This demo will run you through some of these use cases step-by-step.

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/gz0XslNYl4toq6ZMG9dBvNpSO.svg)](https://asciinema.org/a/gz0XslNYl4toq6ZMG9dBvNpSO)

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
* zookeeper

<Tabs>
<TabItem value="Command">

```sh
cat docker-compose.yaml
```

</TabItem>
<TabItem value="File Content">

```yaml
version: '3.7'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    hostname: zookeeper
    container_name: zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2801
      ZOOKEEPER_TICK_TIME: 2000
    healthcheck:
      test: nc -zv 0.0.0.0 2801 || exit 1
      interval: 5s
      retries: 25
    labels:
      tag: conduktor
  kafka1:
    hostname: kafka1
    container_name: kafka1
    image: confluentinc/cp-kafka:latest
    ports:
    - 19092:19092
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2801
      KAFKA_LISTENERS: INTERNAL://:9092,EXTERNAL_SAME_HOST://:19092
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka1:9092,EXTERNAL_SAME_HOST://localhost:19092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL_SAME_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_LOGGERS: kafka.authorizer.logger=INFO
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
    depends_on:
      zookeeper:
        condition: service_healthy
    healthcheck:
      test: nc -zv kafka1 9092 || exit 1
      interval: 5s
      retries: 25
    labels:
      tag: conduktor
  kafka2:
    hostname: kafka2
    container_name: kafka2
    image: confluentinc/cp-kafka:latest
    ports:
    - 19093:19093
    environment:
      KAFKA_BROKER_ID: 2
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2801
      KAFKA_LISTENERS: INTERNAL://:9093,EXTERNAL_SAME_HOST://:19093
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka2:9093,EXTERNAL_SAME_HOST://localhost:19093
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL_SAME_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_LOGGERS: kafka.authorizer.logger=INFO
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
    depends_on:
      zookeeper:
        condition: service_healthy
    healthcheck:
      test: nc -zv kafka2 9093 || exit 1
      interval: 5s
      retries: 25
    labels:
      tag: conduktor
  kafka3:
    image: confluentinc/cp-kafka:latest
    hostname: kafka3
    container_name: kafka3
    ports:
    - 19094:19094
    environment:
      KAFKA_BROKER_ID: 3
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2801
      KAFKA_LISTENERS: INTERNAL://:9094,EXTERNAL_SAME_HOST://:19094
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka3:9094,EXTERNAL_SAME_HOST://localhost:19094
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL_SAME_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_LOGGERS: kafka.authorizer.logger=INFO
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
    depends_on:
      zookeeper:
        condition: service_healthy
    healthcheck:
      test: nc -zv kafka3 9094 || exit 1
      interval: 5s
      retries: 25
    labels:
      tag: conduktor
  schema-registry:
    image: confluentinc/cp-schema-registry:latest
    hostname: schema-registry
    container_name: schema-registry
    ports:
    - 8081:8081
    environment:
      SCHEMA_REGISTRY_HOST_NAME: schema-registry
      SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9093,kafka3:9094
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
    labels:
      tag: conduktor
  gateway1:
    image: conduktor/conduktor-gateway:2.6.0
    hostname: gateway1
    container_name: gateway1
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9093,kafka3:9094
      GATEWAY_ADVERTISED_HOST: localhost
      GATEWAY_MODE: VCLUSTER
      GATEWAY_SECURITY_PROTOCOL: SASL_PLAINTEXT
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
    - 8888:8888
    healthcheck:
      test: curl localhost:8888/health
      interval: 5s
      retries: 25
    labels:
      tag: conduktor
  gateway2:
    image: conduktor/conduktor-gateway:2.6.0
    hostname: gateway2
    container_name: gateway2
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9093,kafka3:9094
      GATEWAY_ADVERTISED_HOST: localhost
      GATEWAY_MODE: VCLUSTER
      GATEWAY_SECURITY_PROTOCOL: SASL_PLAINTEXT
      GATEWAY_FEATURE_FLAGS_ANALYTICS: false
      GATEWAY_START_PORT: 7969
    depends_on:
      kafka1:
        condition: service_healthy
      kafka2:
        condition: service_healthy
      kafka3:
        condition: service_healthy
    ports:
    - 7969:7969
    - 7970:7970
    - 7971:7971
    - 8889:8888
    healthcheck:
      test: curl localhost:8888/health
      interval: 5s
      retries: 25
    labels:
      tag: conduktor
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
    labels:
      tag: conduktor
networks:
  demo: null
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
 Network chaos-simulate-broken-broker_default  Creating
 Network chaos-simulate-broken-broker_default  Created
 Container zookeeper  Creating
 Container kafka-client  Creating
 Container kafka-client  Created
 Container zookeeper  Created
 Container kafka3  Creating
 Container kafka1  Creating
 Container kafka2  Creating
 Container kafka1  Created
 Container kafka2  Created
 Container kafka3  Created
 Container gateway2  Creating
 Container schema-registry  Creating
 Container gateway1  Creating
 gateway1 The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 
 gateway2 The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 
 Container gateway1  Created
 Container gateway2  Created
 Container schema-registry  Created
 Container zookeeper  Starting
 Container kafka-client  Starting
 Container zookeeper  Started
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container kafka-client  Started
 Container zookeeper  Healthy
 Container kafka1  Starting
 Container zookeeper  Healthy
 Container kafka2  Starting
 Container zookeeper  Healthy
 Container kafka3  Starting
 Container kafka2  Started
 Container kafka3  Started
 Container kafka1  Started
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container schema-registry  Starting
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container gateway1  Starting
 Container gateway2  Starting
 Container gateway2  Started
 Container schema-registry  Started
 Container gateway1  Started
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container zookeeper  Healthy
 Container kafka-client  Healthy
 Container kafka1  Healthy
 Container gateway1  Healthy
 Container schema-registry  Healthy
 Container gateway2  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/zctBVg2JzoIMSD9S9PoERphyO.svg)](https://asciinema.org/a/zctBVg2JzoIMSD9S9PoERphyO)

</TabItem>
</Tabs>

## Creating virtual cluster teamA

Creating virtual cluster `teamA` on gateway `gateway1` and reviewing the configuration file to access it

<Tabs>
<TabItem value="Command">


```sh
# Generate virtual cluster teamA with service account sa
token=$(curl \
    --request POST "http://localhost:8888/admin/vclusters/v1/vcluster/teamA/username/sa" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data-raw '{"lifeTimeSeconds": 7776000}' | jq -r ".token")

# Create access file
echo  """
bootstrap.servers=localhost:6969
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='$token';
""" > teamA-sa.properties

# Review file
cat teamA-sa.properties
```


</TabItem>
<TabItem value="Output">

```

bootstrap.servers=localhost:6969
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNTY0NTA3M30.Df1klq7Gj-BkEC23aFbIkw7rIk_duD7LyLFsQ0kuuss';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/OBJrwDQACOgFbdcpFsA7kbTXo.svg)](https://asciinema.org/a/OBJrwDQACOgFbdcpFsA7kbTXo)

</TabItem>
</Tabs>

## Creating topic my-topic on teamA

Creating on `teamA`:

* Topic `my-topic` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic my-topic
```


</TabItem>
<TabItem value="Output">

```
Created topic my-topic.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ivfS087xx9KS7cr9DyV1Y7qc2.svg)](https://asciinema.org/a/ivfS087xx9KS7cr9DyV1Y7qc2)

</TabItem>
</Tabs>

## Adding interceptor simulate-broken-brokers

Let's create the interceptor against the virtual cluster teamA, instructing Conduktor Gateway to inject failures for some Produce requests that are consistent with broker side issues.

Creating the interceptor named `simulate-broken-brokers` of the plugin `io.conduktor.gateway.interceptor.chaos.SimulateBrokenBrokersPlugin` using the following payload

```json
{
  "pluginClass" : "io.conduktor.gateway.interceptor.chaos.SimulateBrokenBrokersPlugin",
  "priority" : 100,
  "config" : {
    "rateInPercent" : 100,
    "errorMap" : {
      "FETCH" : "UNKNOWN_SERVER_ERROR",
      "PRODUCE" : "CORRUPT_MESSAGE"
    }
  }
}
```

Here's how to send it:

<Tabs>
<TabItem value="Command">


```sh
curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/simulate-broken-brokers" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-07-simulate-broken-brokers.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "message": "simulate-broken-brokers is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/DIPOUuOzg9AOoQaX2fmOXZLen.svg)](https://asciinema.org/a/DIPOUuOzg9AOoQaX2fmOXZLen)

</TabItem>
</Tabs>

## Listing interceptors for teamA

Listing interceptors on `gateway1` for virtual cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
curl \
    --request GET 'http://localhost:8888/admin/interceptors/v1/vcluster/teamA' \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "interceptors": [
    {
      "name": "simulate-broken-brokers",
      "pluginClass": "io.conduktor.gateway.interceptor.chaos.SimulateBrokenBrokersPlugin",
      "apiKey": null,
      "priority": 100,
      "timeoutMs": 9223372036854775807,
      "config": {
        "rateInPercent": 100,
        "errorMap": {
          "FETCH": "UNKNOWN_SERVER_ERROR",
          "PRODUCE": "CORRUPT_MESSAGE"
        }
      }
    }
  ]
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/B0mXrDaGLh0bVtD7mKCytOLs6.svg)](https://asciinema.org/a/B0mXrDaGLh0bVtD7mKCytOLs6)

</TabItem>
</Tabs>

## Let's produce some records to our created topic and observe some errors being injected by Conduktor Gateway.

This should produce output similar to this:

```
[2023-12-19 14:08:09,150] WARN [Producer clientId=producer-1] Got error produce response with correlation id 3 on topic-partition my-topic-0, retrying (1 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2023-12-19 14:08:09,252] WARN [Producer clientId=producer-1] Got error produce response with correlation id 4 on topic-partition my-topic-0, retrying (1 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
```

<Tabs>
<TabItem value="Command">


```sh
kafka-producer-perf-test \
  --producer.config teamA-sa.properties \
  --record-size 10 \
  --throughput 1 \
  --num-records 10 \
  --producer-prop retries=5 \
  --topic my-topic
```


</TabItem>
<TabItem value="Output">

```
[2024-02-14 01:04:36,933] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 4 on topic-partition my-topic-0, retrying (4 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:37,037] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 5 on topic-partition my-topic-0, retrying (3 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:37,144] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 6 on topic-partition my-topic-0, retrying (2 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:37,253] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 7 on topic-partition my-topic-0, retrying (1 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:37,369] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 8 on topic-partition my-topic-0, retrying (0 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
[2024-02-14 01:04:37,905] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 10 on topic-partition my-topic-0, retrying (4 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:38,015] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 11 on topic-partition my-topic-0, retrying (3 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:38,127] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 12 on topic-partition my-topic-0, retrying (2 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:38,237] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 13 on topic-partition my-topic-0, retrying (1 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:38,345] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 14 on topic-partition my-topic-0, retrying (0 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
[2024-02-14 01:04:38,932] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 16 on topic-partition my-topic-0, retrying (4 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:39,041] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 17 on topic-partition my-topic-0, retrying (3 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:39,154] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 18 on topic-partition my-topic-0, retrying (2 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:39,261] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 19 on topic-partition my-topic-0, retrying (1 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:39,378] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 20 on topic-partition my-topic-0, retrying (0 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
[2024-02-14 01:04:39,936] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 22 on topic-partition my-topic-0, retrying (4 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:40,056] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 23 on topic-partition my-topic-0, retrying (3 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:40,173] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 24 on topic-partition my-topic-0, retrying (2 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:40,299] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 25 on topic-partition my-topic-0, retrying (1 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:40,437] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 26 on topic-partition my-topic-0, retrying (0 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
[2024-02-14 01:04:40,949] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 28 on topic-partition my-topic-0, retrying (4 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:41,074] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 29 on topic-partition my-topic-0, retrying (3 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:41,183] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 30 on topic-partition my-topic-0, retrying (2 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:41,292] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 31 on topic-partition my-topic-0, retrying (1 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:41,401] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 32 on topic-partition my-topic-0, retrying (0 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
[2024-02-14 01:04:41,985] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 34 on topic-partition my-topic-0, retrying (4 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:42,096] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 35 on topic-partition my-topic-0, retrying (3 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:42,204] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 36 on topic-partition my-topic-0, retrying (2 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:42,314] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 37 on topic-partition my-topic-0, retrying (1 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:42,424] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 38 on topic-partition my-topic-0, retrying (0 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
[2024-02-14 01:04:42,962] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 40 on topic-partition my-topic-0, retrying (4 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:43,072] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 41 on topic-partition my-topic-0, retrying (3 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:43,181] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 42 on topic-partition my-topic-0, retrying (2 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:43,287] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 43 on topic-partition my-topic-0, retrying (1 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:43,396] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 44 on topic-partition my-topic-0, retrying (0 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
[2024-02-14 01:04:43,975] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 46 on topic-partition my-topic-0, retrying (4 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:44,094] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 47 on topic-partition my-topic-0, retrying (3 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:44,213] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 48 on topic-partition my-topic-0, retrying (2 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:44,324] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 49 on topic-partition my-topic-0, retrying (1 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:44,444] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 50 on topic-partition my-topic-0, retrying (0 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
[2024-02-14 01:04:45,003] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 52 on topic-partition my-topic-0, retrying (4 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:45,118] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 53 on topic-partition my-topic-0, retrying (3 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:45,226] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 54 on topic-partition my-topic-0, retrying (2 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:45,342] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 55 on topic-partition my-topic-0, retrying (1 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-02-14 01:04:45,469] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 56 on topic-partition my-topic-0, retrying (0 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
0 records sent, 0,000000 records/sec (0,00 MB/sec), NaN ms avg latency, 0,00 ms max latency, 0 ms 50th, 0 ms 95th, 0 ms 99th, 0 ms 99.9th.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/dikxVAC0JmhsWaJ44bO37BpW6.svg)](https://asciinema.org/a/dikxVAC0JmhsWaJ44bO37BpW6)

</TabItem>
</Tabs>

## Remove interceptor simulate-broken-brokers

Let's delete the interceptor simulate-broken-brokers so we can stop chaos injection

<Tabs>
<TabItem value="Command">


```sh
curl \
    --request DELETE "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/simulate-broken-brokers" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent | jq
```


</TabItem>
<TabItem value="Output">

```json

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/iZRilf9qjXo9mSIkz7twkDtrU.svg)](https://asciinema.org/a/iZRilf9qjXo9mSIkz7twkDtrU)

</TabItem>
</Tabs>

## Listing interceptors for teamA

Listing interceptors on `gateway1` for virtual cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
curl \
    --request GET 'http://localhost:8888/admin/interceptors/v1/vcluster/teamA' \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "interceptors": []
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/YSEyIgTgb0E44wfTfxMJBnTEI.svg)](https://asciinema.org/a/YSEyIgTgb0E44wfTfxMJBnTEI)

</TabItem>
</Tabs>

## Let's produce some records to our created topic with no chaos



<Tabs>
<TabItem value="Command">


```sh
kafka-producer-perf-test \
  --producer.config teamA-sa.properties \
  --record-size 10 \
  --throughput 1 \
  --num-records 10 \
  --topic my-topic
```


</TabItem>
<TabItem value="Output">

```
7 records sent, 1,3 records/sec (0,00 MB/sec), 48,9 ms avg latency, 205,0 ms max latency.
10 records sent, 1,081783 records/sec (0,00 MB/sec), 40,80 ms avg latency, 205,00 ms max latency, 26 ms 50th, 205 ms 95th, 205 ms 99th, 205 ms 99.9th.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/s0GCzsl6LLk433rSpFmn1m1BL.svg)](https://asciinema.org/a/s0GCzsl6LLk433rSpFmn1m1BL)

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
 Container schema-registry  Stopping
 Container gateway1  Stopping
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway1  Removed
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway2  Removed
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container schema-registry  Removed
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network chaos-simulate-broken-broker_default  Removing
 Network chaos-simulate-broken-broker_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ezrLXhWg9DOFWefgO3PTAAvkf.svg)](https://asciinema.org/a/ezrLXhWg9DOFWefgO3PTAAvkf)

</TabItem>
</Tabs>

# Conclusion

Yes, Chaos Simulate Broken Brokers is simple as it!

