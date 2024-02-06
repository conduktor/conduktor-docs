---
title: Topic Concentration
description: Topic Concentration
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Infinite Partitions with Topic Concentration

Conduktor Gateway's topic concentration feature allows you to store multiple topics's data on a single underlying Kafka topic. 

To clients, it appears that there are multiple topics and these can be read from as normal but in the underlying Kafka cluster there is a lot less resource required.

In this demo we are going to create a concentrated topic for powering several virtual topics. 

Create the virtual topics, produce and consume data to them, and explore how this works.

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/lKvHXGaVz3A0iyXzLa5tYsqfR.svg)](https://asciinema.org/a/lKvHXGaVz3A0iyXzLa5tYsqfR)

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
 Container kafka2  Running
 Container kafka3  Running
 Container kafka1  Running
 Container gateway2  Running
 Container schema-registry  Running
 Container gateway1  Running
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka3  Healthy
 Container gateway2  Healthy
 Container kafka2  Healthy
 Container schema-registry  Healthy
 Container gateway1  Healthy
 Container zookeeper  Healthy
 Container kafka1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/zB5OorDTTM3s3UbPpC75honwt.svg)](https://asciinema.org/a/zB5OorDTTM3s3UbPpC75honwt)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNDQ3MDAwMH0.pYWnQ3zOACA3UysGk2nfzVkgUoqvMxXqGSmd_-nUzGo';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/sXwTgiA9z0F7GKzVZbPhZ2N8E.svg)](https://asciinema.org/a/sXwTgiA9z0F7GKzVZbPhZ2N8E)

</TabItem>
</Tabs>

## Create the topic that will hold virtual topics

Creating on `kafka1`:

* Topic `hold-many-concentrated-topics` with partitions:5 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --replication-factor 1 \
    --partitions 5 \
    --create --if-not-exists \
    --topic hold-many-concentrated-topics
```


</TabItem>
<TabItem value="Output">

```
Created topic hold-many-concentrated-topics.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/d3uf7yFCfbY3ikWikrU4W0wiM.svg)](https://asciinema.org/a/d3uf7yFCfbY3ikWikrU4W0wiM)

</TabItem>
</Tabs>

## 

Let's tell `gateway1` that topics matching the pattern `concentrated-.*` need to be concentrated into the underlying `hold-many-concentrated-topics` physical topic.

> [!NOTE]
> You don’t need to create the physical topic that backs the concentrated topics, it will automatically be created when a client topic starts using the concentrated topic.

<Tabs>
<TabItem value="Command">


```sh
cat step-07-mapping.json | jq
curl \
    --request POST 'http://localhost:8888/admin/vclusters/v1/vcluster/teamA/topics/concentrated-.%2A' \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data "@step-07-mapping.json" | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "concentrated": true,
  "readOnly": false,
  "physicalTopicName": "hold-many-concentrated-topics"
}
{
  "logicalTopicName": "concentrated-.*",
  "physicalTopicName": "hold-many-concentrated-topics",
  "readOnly": false,
  "concentrated": true
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Mci07QWNKvevJ0I6oxLxi027Q.svg)](https://asciinema.org/a/Mci07QWNKvevJ0I6oxLxi027Q)

</TabItem>
</Tabs>

## Create concentrated topics

Creating on `teamA`:

* Topic `concentrated-normal` with partitions:1 and replication-factor:1
* Topic `concentrated-delete` with partitions:1 and replication-factor:1
* Topic `concentrated-compact` with partitions:1 and replication-factor:1
* Topic `concentrated-delete-compact` with partitions:1 and replication-factor:1
* Topic `concentrated-compact-delete` with partitions:1 and replication-factor:1
* Topic `concentrated-small-retention` with partitions:1 and replication-factor:1
* Topic `concentrated-large-retention` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic concentrated-normal
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --config cleanup.policy=delete \
    --create --if-not-exists \
    --topic concentrated-delete
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --config cleanup.policy=compact \
    --create --if-not-exists \
    --topic concentrated-compact
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --config cleanup.policy=delete,compact \
    --create --if-not-exists \
    --topic concentrated-delete-compact
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --config cleanup.policy=compact,delete \
    --create --if-not-exists \
    --topic concentrated-compact-delete
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --config retention.ms=10000 \
    --create --if-not-exists \
    --topic concentrated-small-retention
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --config retention.ms=6048000000 \
    --create --if-not-exists \
    --topic concentrated-large-retention
```


</TabItem>
<TabItem value="Output">

```
Created topic concentrated-normal.
Created topic concentrated-delete.
Created topic concentrated-compact.
Created topic concentrated-delete-compact.
Created topic concentrated-compact-delete.
Created topic concentrated-small-retention.
Created topic concentrated-large-retention.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/VSAPOCFZK3T7FAjOnn9djq4o0.svg)](https://asciinema.org/a/VSAPOCFZK3T7FAjOnn9djq4o0)

</TabItem>
</Tabs>

## Assert the topics have been created



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --list
```


</TabItem>
<TabItem value="Output">

```
concentrated-compact
concentrated-compact-delete
concentrated-delete
concentrated-delete-compact
concentrated-large-retention
concentrated-normal
concentrated-small-retention

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Z8ydylVEF0BSN5l82Cy2VzrWG.svg)](https://asciinema.org/a/Z8ydylVEF0BSN5l82Cy2VzrWG)

</TabItem>
</Tabs>

## Assert the topics have not been created in the underlying kafka cluster

If we list topics from the backend cluster, not from Gateway perspective, we do not see the concentrated topics.

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --list
```


</TabItem>
<TabItem value="Output">

```
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
hold-many-concentrated-topics
hold-many-concentrated-topics_compacted
hold-many-concentrated-topics_compactedAndDeleted

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/k5ZxxwmggJ2dwRlEwPBO2BSnj.svg)](https://asciinema.org/a/k5ZxxwmggJ2dwRlEwPBO2BSnj)

</TabItem>
</Tabs>

## Let's continue created virtual topics, but now with many partitions

Creating on `teamA`:

* Topic `concentrated-topic-with-10-partitions` with partitions:10 and replication-factor:1
* Topic `concentrated-topic-with-100-partitions` with partitions:100 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 10 \
    --create --if-not-exists \
    --topic concentrated-topic-with-10-partitions
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 100 \
    --create --if-not-exists \
    --topic concentrated-topic-with-100-partitions
```


</TabItem>
<TabItem value="Output">

```
Created topic concentrated-topic-with-10-partitions.
Created topic concentrated-topic-with-100-partitions.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/oOYQ3hd6kk0cfRvRYb57rZ0C5.svg)](https://asciinema.org/a/oOYQ3hd6kk0cfRvRYb57rZ0C5)

</TabItem>
</Tabs>

## Assert they exist in teamA cluster



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --list
```


</TabItem>
<TabItem value="Output">

```
concentrated-compact
concentrated-compact-delete
concentrated-delete
concentrated-delete-compact
concentrated-large-retention
concentrated-normal
concentrated-small-retention
concentrated-topic-with-10-partitions
concentrated-topic-with-100-partitions

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/KquKuvQQAWlfPM2xaUZxEMLad.svg)](https://asciinema.org/a/KquKuvQQAWlfPM2xaUZxEMLad)

</TabItem>
</Tabs>

## Producing 1 message in concentrated-topic-with-10-partitions

Producing 1 message in `concentrated-topic-with-10-partitions` in cluster `teamA`

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "type" : "Sports",
  "price" : 75,
  "color" : "blue"
}
```
with


```sh
echo '{"type": "Sports", "price": 75, "color": "blue"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic concentrated-topic-with-10-partitions
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/SzEin7lBkiCJ9UR9UImMwNFMg.svg)](https://asciinema.org/a/SzEin7lBkiCJ9UR9UImMwNFMg)

</TabItem>
</Tabs>

## Consuming from concentrated-topic-with-10-partitions

Consuming from concentrated-topic-with-10-partitions in cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic concentrated-topic-with-10-partitions \
    --from-beginning \
    --timeout-ms 10000 \
    --property print.headers=true | jq
```


returns 1 event
```json
{
  "headers" : { },
  "value" : {
    "type" : "Sports",
    "price" : 75,
    "color" : "blue"
  }
}
```


</TabItem>
<TabItem value="Output">

```json
jq: parse error: Invalid numeric literal at line 1, column 11
[2024-01-31 10:40:36,810] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/wIEeOpZsHXW8qc7gaWueCoxHa.svg)](https://asciinema.org/a/wIEeOpZsHXW8qc7gaWueCoxHa)

</TabItem>
</Tabs>

## Producing 1 message in concentrated-topic-with-100-partitions

Producing 1 message in `concentrated-topic-with-100-partitions` in cluster `teamA`

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "msg" : "hello world"
}
```
with


```sh
echo '{"msg":"hello world"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic concentrated-topic-with-100-partitions
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Y8h1S0E1YyeARGoaQpxSK15ea.svg)](https://asciinema.org/a/Y8h1S0E1YyeARGoaQpxSK15ea)

</TabItem>
</Tabs>

## Consuming from concentrated-topic-with-100-partitions

Consuming from concentrated-topic-with-100-partitions in cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic concentrated-topic-with-100-partitions \
    --from-beginning \
    --timeout-ms 10000 \
    --property print.headers=true | jq
```


</TabItem>
<TabItem value="Output">

```json
jq: parse error: Invalid numeric literal at line 1, column 11
[2024-01-31 10:40:50,916] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/yjMNoSs4CVLOzTKWe153axTa7.svg)](https://asciinema.org/a/yjMNoSs4CVLOzTKWe153axTa7)

</TabItem>
</Tabs>

## Consuming from concentrated-topic-with-100-partitions

Consuming from concentrated-topic-with-100-partitions in cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic concentrated-topic-with-100-partitions \
    --from-beginning \
    --timeout-ms 10000 \
    --property print.headers=true | jq
```


returns 1 event
```json
{
  "headers" : { },
  "value" : {
    "msg" : "hello world"
  }
}
```


</TabItem>
<TabItem value="Output">

```json
jq: parse error: Invalid numeric literal at line 1, column 11
[2024-01-31 10:41:03,305] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/uzgVIVTLUtQzN8OM14wJMTjb9.svg)](https://asciinema.org/a/uzgVIVTLUtQzN8OM14wJMTjb9)

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
 Container gateway1  Stopping
 Container gateway2  Stopping
 Container schema-registry  Stopping
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway2  Stopped
 Container gateway2  Removing
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway1  Removed
 Container gateway2  Removed
 Container schema-registry  Removed
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container kafka2  Removed
 Container kafka3  Removed
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network topic-concentration_default  Removing
 Network topic-concentration_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/RWnyFSWp5h2fPSASJhEcLTkqO.svg)](https://asciinema.org/a/RWnyFSWp5h2fPSASJhEcLTkqO)

</TabItem>
</Tabs>

# Conclusion

Infinite partitions with topic concentration is really a game changer!

