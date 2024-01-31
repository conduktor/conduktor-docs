---
title: Chaos Simulate Leader Election Errors
description: Chaos Simulate Leader Election Errors
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Chaos Simulate Leader Election Errors

This interceptor simulates a leader election on partitions being produced to through Conduktor Gateway

This demo will run you through some of these use cases step-by-step.

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/gpPjnCKHUjJaC1Gbdj08mTOcm.svg)](https://asciinema.org/a/gpPjnCKHUjJaC1Gbdj08mTOcm)

</TabItem>
</Tabs>

## Review the docker compose environment

As can be seen from `docker-compose.yaml` the demo environment consists of the following services:

* gateway1
* gateway2
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
  gateway1:
    image: conduktor/conduktor-gateway:2.5.0
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
  gateway2:
    image: conduktor/conduktor-gateway:2.5.0
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
 Container zookeeper  Running
 Container kafka1  Running
 Container kafka3  Running
 Container kafka2  Running
 Container gateway2  Running
 Container gateway1  Running
 Container schema-registry  Running
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container gateway1  Healthy
 Container kafka1  Healthy
 Container schema-registry  Healthy
 Container gateway2  Healthy
 Container kafka3  Healthy
 Container zookeeper  Healthy
 Container kafka2  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/F4HhqSzHM6o4kBS2xvHPDISnv.svg)](https://asciinema.org/a/F4HhqSzHM6o4kBS2xvHPDISnv)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNDQ0MjE0N30.rTa584Pv5KSWHITz9zFhKJE7XN8DTv8_MFSn_Nvk0vs';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/U6lp8RuOWDKAWXwqMO0kGgIZJ.svg)](https://asciinema.org/a/U6lp8RuOWDKAWXwqMO0kGgIZJ)

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

[![asciicast](https://asciinema.org/a/XHsLdiT487asdEU7Sv48MV043.svg)](https://asciinema.org/a/XHsLdiT487asdEU7Sv48MV043)

</TabItem>
</Tabs>

## Adding interceptor simulate-leader-elections-errors

Let's create the interceptor against the virtual cluster teamA, instructing Conduktor Gateway to simulate a leader election on partitions being produced to through Conduktor Gateway.

<Tabs>
<TabItem value="Command">


```sh
cat step-07-simulate-leader-elections-errors.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/simulate-leader-elections-errors" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-07-simulate-leader-elections-errors.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "pluginClass": "io.conduktor.gateway.interceptor.chaos.SimulateLeaderElectionsErrorsPlugin",
  "priority": 100,
  "config": {
    "rateInPercent": 50
  }
}
{
  "message": "simulate-leader-elections-errors is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/CsL7DNdJzTJXyPx1VnOs7tMcw.svg)](https://asciinema.org/a/CsL7DNdJzTJXyPx1VnOs7tMcw)

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
      "name": "simulate-leader-elections-errors",
      "pluginClass": "io.conduktor.gateway.interceptor.chaos.SimulateLeaderElectionsErrorsPlugin",
      "apiKey": null,
      "priority": 100,
      "timeoutMs": 9223372036854775807,
      "config": {
        "rateInPercent": 50
      }
    }
  ]
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/N3NRhV8WQk8oKkfZc8KXv6GO6.svg)](https://asciinema.org/a/N3NRhV8WQk8oKkfZc8KXv6GO6)

</TabItem>
</Tabs>

## Let's produce some records to our created topic.

This should produce output similar to this:

```
[2023-12-18 12:58:57,041] WARN [Producer clientId=producer-1] Got error produce response with correlation id 25 on topic-partition my-topic-0, retrying (2147483646 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2023-12-18 12:58:57,041] WARN [Producer clientId=producer-1] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
```

<Tabs>
<TabItem value="Command">


```sh
kafka-producer-perf-test \
  --producer-props bootstrap.servers=localhost:6969 \
  --producer.config teamA-sa.properties \
  --record-size 10 \
  --throughput 1 \
  --producer-prop retries=5 \
  --num-records 10 \
  --topic my-topic
```


</TabItem>
<TabItem value="Output">

```
[2024-01-31 02:55:54,318] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 7 on topic-partition my-topic-0, retrying (4 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:54,320] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:55,314] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 10 on topic-partition my-topic-0, retrying (4 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:55,315] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:55,439] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 12 on topic-partition my-topic-0, retrying (3 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:55,439] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:55,552] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 14 on topic-partition my-topic-0, retrying (2 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:55,552] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:55,665] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 16 on topic-partition my-topic-0, retrying (1 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:55,665] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:55,773] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 18 on topic-partition my-topic-0, retrying (0 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:55,773] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.
[2024-01-31 02:55:55,889] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:56,321] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 22 on topic-partition my-topic-0, retrying (4 attempts left). Error: OUT_OF_ORDER_SEQUENCE_NUMBER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:56,433] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 23 on topic-partition my-topic-0, retrying (3 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:56,433] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:56,543] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 25 on topic-partition my-topic-0, retrying (2 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:56,543] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:56,651] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 27 on topic-partition my-topic-0, retrying (1 attempts left). Error: OUT_OF_ORDER_SEQUENCE_NUMBER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:56,770] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 28 on topic-partition my-topic-0, retrying (0 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:56,770] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.
[2024-01-31 02:55:56,896] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:57,347] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 32 on topic-partition my-topic-0, retrying (4 attempts left). Error: OUT_OF_ORDER_SEQUENCE_NUMBER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:57,459] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 33 on topic-partition my-topic-0, retrying (3 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:57,459] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:57,571] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 35 on topic-partition my-topic-0, retrying (2 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:57,571] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:57,677] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 37 on topic-partition my-topic-0, retrying (1 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:57,677] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:57,783] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 39 on topic-partition my-topic-0, retrying (0 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:57,784] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.OutOfOrderSequenceException: The broker received an out of order sequence number.
[2024-01-31 02:55:57,891] ERROR [Producer clientId=perf-producer-client] The broker returned org.apache.kafka.common.errors.OutOfOrderSequenceException: The broker received an out of order sequence number. for topic-partition my-topic-0 with producerId 1001, epoch 0, and sequence number 7 (org.apache.kafka.clients.producer.internals.TransactionManager)
[2024-01-31 02:55:58,340] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 42 on topic-partition my-topic-0, retrying (4 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:58,341] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:58,451] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 44 on topic-partition my-topic-0, retrying (3 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:58,451] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:58,566] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 46 on topic-partition my-topic-0, retrying (2 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:58,567] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
6 records sent, 0,8 records/sec (0,00 MB/sec), 134,2 ms avg latency, 369,0 ms max latency.
[2024-01-31 02:55:59,330] WARN [Producer clientId=perf-producer-client] Got error produce response with correlation id 49 on topic-partition my-topic-0, retrying (4 attempts left). Error: NOT_LEADER_OR_FOLLOWER (org.apache.kafka.clients.producer.internals.Sender)
[2024-01-31 02:55:59,330] WARN [Producer clientId=perf-producer-client] Received invalid metadata error in produce request on partition my-topic-0 due to org.apache.kafka.common.errors.NotLeaderOrFollowerException: For requests intended only for the leader, this error indicates that the broker is not the current leader. For requests intended for any replica, this error indicates that the broker is not a replica of the topic partition.. Going to request metadata update now (org.apache.kafka.clients.producer.internals.Sender)
7 records sent, 0,758068 records/sec (0,00 MB/sec), 131,57 ms avg latency, 369,00 ms max latency, 116 ms 50th, 369 ms 95th, 369 ms 99th, 369 ms 99.9th.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/kFQF3dBDomk1Z23cDORUQETlH.svg)](https://asciinema.org/a/kFQF3dBDomk1Z23cDORUQETlH)

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
 Container gateway2  Stopping
 Container gateway1  Stopping
 Container schema-registry  Stopping
 Container gateway1  Stopped
 Container gateway1  Removing
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway1  Removed
 Container gateway2  Removed
 Container schema-registry  Removed
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container kafka3  Removed
 Container kafka2  Removed
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network chaos-simulate-leader-election-errors_default  Removing
 Network chaos-simulate-leader-election-errors_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/tiGPjfWnEw4ZQkHD6n9ydPuyT.svg)](https://asciinema.org/a/tiGPjfWnEw4ZQkHD6n9ydPuyT)

</TabItem>
</Tabs>

# Conclusion

Yes, Chaos Leader Election Errors is simple as it!

