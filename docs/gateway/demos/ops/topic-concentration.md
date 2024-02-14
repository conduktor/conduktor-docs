---
title: Topic Concentration
description: Topic Concentration
tag: ops
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

[![asciicast](https://asciinema.org/a/QTCNNdOqs98T61U7oBfkELtKP.svg)](https://asciinema.org/a/QTCNNdOqs98T61U7oBfkELtKP)

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
 Network topic-concentration_default  Creating
 Network topic-concentration_default  Created
 Container zookeeper  Creating
 Container kafka-client  Creating
 Container kafka-client  Created
 Container zookeeper  Created
 Container kafka1  Creating
 Container kafka3  Creating
 Container kafka2  Creating
 Container kafka3  Created
 Container kafka1  Created
 Container kafka2  Created
 Container gateway2  Creating
 Container schema-registry  Creating
 Container gateway1  Creating
 gateway1 The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 
 gateway2 The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 
 Container gateway1  Created
 Container gateway2  Created
 Container schema-registry  Created
 Container kafka-client  Starting
 Container zookeeper  Starting
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
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container gateway2  Starting
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container schema-registry  Starting
 Container gateway1  Starting
 Container gateway1  Started
 Container gateway2  Started
 Container schema-registry  Started
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka-client  Healthy
 Container kafka2  Healthy
 Container zookeeper  Healthy
 Container schema-registry  Healthy
 Container gateway1  Healthy
 Container gateway2  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/KaFo6Wsi1sVwLybIeM8Li2GcL.svg)](https://asciinema.org/a/KaFo6Wsi1sVwLybIeM8Li2GcL)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNTY2MDQ0Nn0.h5mLoTTPBaMCDZWehkXX3Z8m3TXIqF0cvDp4QwPDr1Y';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/pKUTIExVo2YNST9DkzUBNB5O4.svg)](https://asciinema.org/a/pKUTIExVo2YNST9DkzUBNB5O4)

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

[![asciicast](https://asciinema.org/a/nVrbn9sDkhiV4eVyPtFafnxK4.svg)](https://asciinema.org/a/nVrbn9sDkhiV4eVyPtFafnxK4)

</TabItem>
</Tabs>

## 

Let's tell `gateway1` that topics matching the pattern `concentrated-.*` need to be concentrated into the underlying `hold-many-concentrated-topics` physical topic.

> [!NOTE]
> You don���t need to create the physical topic that backs the concentrated topics, it will automatically be created when a client topic starts using the concentrated topic.


```json
{
  "concentrated" : true,
  "readOnly" : false,
  "physicalTopicName" : "hold-many-concentrated-topics"
}
```

<Tabs>
<TabItem value="Command">


```sh
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
  "logicalTopicName": "concentrated-.*",
  "physicalTopicName": "hold-many-concentrated-topics",
  "readOnly": false,
  "concentrated": true
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/BSJsfT2SFJBWU6xXglwKyr1ew.svg)](https://asciinema.org/a/BSJsfT2SFJBWU6xXglwKyr1ew)

</TabItem>
</Tabs>

## Let's create multiple topics with  many partitions

Creating on `teamA`:

* Topic `concentrated-topic-with-10-partitions` with partitions:10 and replication-factor:1
* Topic `concentrated-topic-with-20-partitions` with partitions:20 and replication-factor:1
* Topic `concentrated-topic-with-50-partitions` with partitions:50 and replication-factor:1
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
    --partitions 20 \
    --create --if-not-exists \
    --topic concentrated-topic-with-20-partitions
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 50 \
    --create --if-not-exists \
    --topic concentrated-topic-with-50-partitions
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
Created topic concentrated-topic-with-20-partitions.
Created topic concentrated-topic-with-50-partitions.
Created topic concentrated-topic-with-100-partitions.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/xmWoldjnZ1dE6MZRY5b1erj3B.svg)](https://asciinema.org/a/xmWoldjnZ1dE6MZRY5b1erj3B)

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
concentrated-topic-with-10-partitions
concentrated-topic-with-100-partitions
concentrated-topic-with-20-partitions
concentrated-topic-with-50-partitions

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/utAYnarZ9PVWpA7lqWw7njwWE.svg)](https://asciinema.org/a/utAYnarZ9PVWpA7lqWw7njwWE)

</TabItem>
</Tabs>

## Producing 1 message in concentrated-topic-with-10-partitions

Producing 1 message in `concentrated-topic-with-10-partitions` in cluster `teamA`

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "message" : "10 partitions"
}
```
with


```sh
echo '{"message": "10 partitions"}' | \
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

[![asciicast](https://asciinema.org/a/zCTGBfLxGOUcQNyDVOqiF28J9.svg)](https://asciinema.org/a/zCTGBfLxGOUcQNyDVOqiF28J9)

</TabItem>
</Tabs>

## Producing 1 message in concentrated-topic-with-20-partitions

Producing 1 message in `concentrated-topic-with-20-partitions` in cluster `teamA`

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "message" : "20 partitions"
}
```
with


```sh
echo '{"message": "20 partitions"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic concentrated-topic-with-20-partitions
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/vdTT6XnAhVKyccFqzwjbOQ1uU.svg)](https://asciinema.org/a/vdTT6XnAhVKyccFqzwjbOQ1uU)

</TabItem>
</Tabs>

## Producing 1 message in concentrated-topic-with-50-partitions

Producing 1 message in `concentrated-topic-with-50-partitions` in cluster `teamA`

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "message" : "50 partitions"
}
```
with


```sh
echo '{"message": "50 partitions"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic concentrated-topic-with-50-partitions
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/dBNdx3Zv83y3zwpMs1MbHwtwt.svg)](https://asciinema.org/a/dBNdx3Zv83y3zwpMs1MbHwtwt)

</TabItem>
</Tabs>

## Producing 1 message in concentrated-topic-with-100-partitions

Producing 1 message in `concentrated-topic-with-100-partitions` in cluster `teamA`

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "message" : "100 partitions"
}
```
with


```sh
echo '{"message": "100 partitions"}' | \
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

[![asciicast](https://asciinema.org/a/5bJwlSOYThzXkRHOXz2JxpqSb.svg)](https://asciinema.org/a/5bJwlSOYThzXkRHOXz2JxpqSb)

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
    --timeout-ms 10000 | jq
```


returns 

```json
Processed a total of 1 messages
{
  "message": "10 partitions"
}

```



</TabItem>
<TabItem value="Output">

```json
Processed a total of 1 messages
{
  "message": "10 partitions"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/SqTwrgaxlzXkVIjrXfg4ARquM.svg)](https://asciinema.org/a/SqTwrgaxlzXkVIjrXfg4ARquM)

</TabItem>
</Tabs>

## Consuming from concentrated-topic-with-20-partitions

Consuming from concentrated-topic-with-20-partitions in cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic concentrated-topic-with-20-partitions \
    --from-beginning \
    --timeout-ms 10000 | jq
```


returns 

```json
Processed a total of 1 messages
{
  "message": "20 partitions"
}

```



</TabItem>
<TabItem value="Output">

```json
Processed a total of 1 messages
{
  "message": "20 partitions"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/3HLeO9OHIGWoDODq6900aHZyR.svg)](https://asciinema.org/a/3HLeO9OHIGWoDODq6900aHZyR)

</TabItem>
</Tabs>

## Consuming from concentrated-topic-with-50-partitions

Consuming from concentrated-topic-with-50-partitions in cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic concentrated-topic-with-50-partitions \
    --from-beginning \
    --timeout-ms 10000 | jq
```


returns 

```json
Processed a total of 1 messages
{
  "message": "50 partitions"
}

```



</TabItem>
<TabItem value="Output">

```json
Processed a total of 1 messages
{
  "message": "50 partitions"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/sZHNVs5xHjAvn7hid5rHzxPEu.svg)](https://asciinema.org/a/sZHNVs5xHjAvn7hid5rHzxPEu)

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
    --timeout-ms 10000 | jq
```


returns 

```json
Processed a total of 1 messages
{
  "message": "100 partitions"
}

```



</TabItem>
<TabItem value="Output">

```json
Processed a total of 1 messages
{
  "message": "100 partitions"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/7jxEY4gCk3tAFsm8Tfy56wCuT.svg)](https://asciinema.org/a/7jxEY4gCk3tAFsm8Tfy56wCuT)

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


returns 

```json
jq: parse error: Invalid numeric literal at line 1, column 11
Processed a total of 1 messages

```



</TabItem>
<TabItem value="Output">

```json
jq: parse error: Invalid numeric literal at line 1, column 11
Processed a total of 1 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/3TKY3Un7dn2Z946cxKv1JBXBN.svg)](https://asciinema.org/a/3TKY3Un7dn2Z946cxKv1JBXBN)

</TabItem>
</Tabs>

## Revealing the magic

Revealing the magic in cluster `kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --topic hold-many-concentrated-topics \
    --from-beginning \
    --timeout-ms 10000 \
    --property print.headers=true | jq
```


returns 

```json
jq: parse error: Invalid numeric literal at line 1, column 22
Unable to write to standard out, closing consumer.
Processed a total of 2 messages

```



</TabItem>
<TabItem value="Output">

```json
jq: parse error: Invalid numeric literal at line 1, column 22
Unable to write to standard out, closing consumer.
Processed a total of 2 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/I2J1yiZfXuc7fZFpW5psLLJOB.svg)](https://asciinema.org/a/I2J1yiZfXuc7fZFpW5psLLJOB)

</TabItem>
</Tabs>

# Conclusion

Infinite partitions with topic concentration is really a game changer!

