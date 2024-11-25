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

[![asciicast](https://asciinema.org/a/Ui2beoTRxBrgjJQfpBZCVn8Mm.svg)](https://asciinema.org/a/Ui2beoTRxBrgjJQfpBZCVn8Mm)

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
 Network chaos-simulate-broken-broker_default  Creating
 Network chaos-simulate-broken-broker_default  Created
 Container kafka-client  Creating
 Container kafka3  Creating
 Container kafka2  Creating
 Container kafka1  Creating
 Container kafka2  Created
 Container kafka-client  Created
 Container kafka1  Created
 Container kafka3  Created
 Container gateway1  Creating
 Container schema-registry  Creating
 Container gateway2  Creating
 Container gateway1  Created
 Container gateway2  Created
 Container schema-registry  Created
 Container kafka3  Starting
 Container kafka1  Starting
 Container kafka2  Starting
 Container kafka-client  Starting
 Container kafka2  Started
 Container kafka-client  Started
 Container kafka3  Started
 Container kafka1  Started
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container gateway2  Starting
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container gateway1  Starting
 Container kafka1  Healthy
 Container schema-registry  Starting
 Container gateway2  Started
 Container schema-registry  Started
 Container gateway1  Started
 Container kafka-client  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka2  Healthy
 Container kafka-client  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container schema-registry  Healthy
 Container gateway2  Healthy
 Container gateway1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/vqrtxig7nqehpOad9eEI6hTdS.svg)](https://asciinema.org/a/vqrtxig7nqehpOad9eEI6hTdS)

</TabItem>
</Tabs>

## Creating topic my-topic on gateway1

Creating on `gateway1`:

* Topic `my-topic` with partitions:1 and replication-factor:1






<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
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

[![asciicast](https://asciinema.org/a/5ywifBMlvwwWprbzZqtHMko6T.svg)](https://asciinema.org/a/5ywifBMlvwwWprbzZqtHMko6T)

</TabItem>
</Tabs>

## Adding interceptor simulate-broken-brokers

Let's create the interceptor, instructing Conduktor Gateway to inject failures for some Produce requests that are consistent with broker side issues.




`step-06-simulate-broken-brokers-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "simulate-broken-brokers"
  },
  "spec" : {
    "comment" : "Adding interceptor: simulate-broken-brokers",
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
    --data @step-06-simulate-broken-brokers-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "simulate-broken-brokers",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: simulate-broken-brokers",
      "pluginClass": "io.conduktor.gateway.interceptor.chaos.SimulateBrokenBrokersPlugin",
      "priority": 100,
      "config": {
        "rateInPercent": 100,
        "errorMap": {
          "FETCH": "UNKNOWN_SERVER_ERROR",
          "PRODUCE": "CORRUPT_MESSAGE"
        }
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/7LmPvZBIbQQegdm8WhMLvkgxW.svg)](https://asciinema.org/a/7LmPvZBIbQQegdm8WhMLvkgxW)

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
[
  {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "simulate-broken-brokers",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: simulate-broken-brokers",
      "pluginClass": "io.conduktor.gateway.interceptor.chaos.SimulateBrokenBrokersPlugin",
      "priority": 100,
      "config": {
        "rateInPercent": 100,
        "errorMap": {
          "FETCH": "UNKNOWN_SERVER_ERROR",
          "PRODUCE": "CORRUPT_MESSAGE"
        }
      }
    }
  }
]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/1n0IsGAmbjqO6dwwKm0huqqwp.svg)](https://asciinema.org/a/1n0IsGAmbjqO6dwwKm0huqqwp)

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
  --producer-props \
      bootstrap.servers=localhost:6969 \
      retries=5 \
  --record-size 10 \
  --throughput 1 \
  --num-records 10 \
  --topic my-topic
```


</TabItem>
<TabItem value="Output">

```
[2024-11-10 19:59:15,895] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 8 on topic-partition my-topic-0, retrying (4 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:16,018] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 9 on topic-partition my-topic-0, retrying (3 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:16,260] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 10 on topic-partition my-topic-0, retrying (2 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:16,668] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 11 on topic-partition my-topic-0, retrying (1 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:17,618] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 12 on topic-partition my-topic-0, retrying (0 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:17,620] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 13 on topic-partition my-topic-0, retrying (4 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
[2024-11-10 19:59:18,662] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 15 on topic-partition my-topic-0, retrying (3 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:18,667] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 16 on topic-partition my-topic-0, retrying (4 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:18,903] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 17 on topic-partition my-topic-0, retrying (2 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:19,339] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 18 on topic-partition my-topic-0, retrying (1 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:20,249] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 19 on topic-partition my-topic-0, retrying (0 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
[2024-11-10 19:59:21,268] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 21 on topic-partition my-topic-0, retrying (3 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:21,270] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 22 on topic-partition my-topic-0, retrying (4 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:21,479] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 23 on topic-partition my-topic-0, retrying (2 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:21,913] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 24 on topic-partition my-topic-0, retrying (1 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:22,775] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 25 on topic-partition my-topic-0, retrying (0 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
[2024-11-10 19:59:23,792] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 27 on topic-partition my-topic-0, retrying (3 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:23,794] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 28 on topic-partition my-topic-0, retrying (4 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:24,027] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 29 on topic-partition my-topic-0, retrying (2 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:24,454] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 30 on topic-partition my-topic-0, retrying (1 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:25,313] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 31 on topic-partition my-topic-0, retrying (0 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
[2024-11-10 19:59:26,335] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 33 on topic-partition my-topic-0, retrying (3 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:26,568] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 34 on topic-partition my-topic-0, retrying (2 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:27,046] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 35 on topic-partition my-topic-0, retrying (1 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
[2024-11-10 19:59:27,896] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 36 on topic-partition my-topic-0, retrying (0 attempts left). Error: CORRUPT_MESSAGE (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
org.apache.kafka.common.errors.CorruptRecordException: This message has failed its CRC checksum, exceeds the valid size, has a null key for a compacted topic, or is otherwise corrupt.
0 records sent, 0.000000 records/sec (0.00 MB/sec), NaN ms avg latency, 0.00 ms max latency, 0 ms 50th, 0 ms 95th, 0 ms 99th, 0 ms 99.9th.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/f6pJT9P3kpNJgkGVgpVU1DH3h.svg)](https://asciinema.org/a/f6pJT9P3kpNJgkGVgpVU1DH3h)

</TabItem>
</Tabs>

## Remove interceptor simulate-broken-brokers

Let's delete the interceptor simulate-broken-brokers so we can stop chaos injection






<Tabs>

<TabItem value="Command">
```sh
curl \
    --silent \
    --request DELETE "http://localhost:8888/gateway/v2/interceptor/simulate-broken-brokers" \
    --header "Content-Type: application/json" \
    --user "admin:conduktor" \
    --data-raw '{
  "vCluster" : "passthrough"
}' | jq
```


</TabItem>
<TabItem value="Output">

```json

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/bx8KFQ7M1Rrw9Q41Gl4F8J5bv.svg)](https://asciinema.org/a/bx8KFQ7M1Rrw9Q41Gl4F8J5bv)

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
[]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/YHL5WAjLzMTIurqDksHm3rwVt.svg)](https://asciinema.org/a/YHL5WAjLzMTIurqDksHm3rwVt)

</TabItem>
</Tabs>

## Let's produce some records to our created topic with no chaos








<Tabs>

<TabItem value="Command">
```sh
kafka-producer-perf-test \
  --producer-props bootstrap.servers=localhost:6969 \
  --record-size 10 \
  --throughput 1 \
  --num-records 10 \
  --topic my-topic
```


</TabItem>
<TabItem value="Output">

```
7 records sent, 1.3 records/sec (0.00 MB/sec), 155.9 ms avg latency, 660.0 ms max latency.
10 records sent, 1.058985 records/sec (0.00 MB/sec), 112.10 ms avg latency, 660.00 ms max latency, 15 ms 50th, 660 ms 95th, 660 ms 99th, 660 ms 99.9th.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/MxDeMY4Ynk36AggFpsXn4yjHA.svg)](https://asciinema.org/a/MxDeMY4Ynk36AggFpsXn4yjHA)

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
 Container gateway1  Stopping
 Container gateway2  Stopping
 Container schema-registry  Stopping
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway2  Removed
 Container gateway1  Removed
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container schema-registry  Removed
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka3  Removed
 Container kafka2  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Network chaos-simulate-broken-broker_default  Removing
 Network chaos-simulate-broken-broker_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/e9lBZBJfmeR1IL3bUDStczlkv.svg)](https://asciinema.org/a/e9lBZBJfmeR1IL3bUDStczlkv)

</TabItem>
</Tabs>

# Conclusion

Yes, Chaos Simulate Broken Brokers is simple as it!