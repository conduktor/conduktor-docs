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

[![asciicast](https://asciinema.org/a/2BDccl8ACbIdlf1pUusxzlRFj.svg)](https://asciinema.org/a/2BDccl8ACbIdlf1pUusxzlRFj)

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
 Container kafka-client  Creating
 Container zookeeper  Creating
 Container kafka-client  Created
 Container zookeeper  Created
 Container kafka1  Creating
 Container kafka2  Creating
 Container kafka3  Creating
 Container kafka1  Created
 Container kafka2  Created
 Container kafka3  Created
 Container gateway2  Creating
 Container schema-registry  Creating
 Container gateway1  Creating
 gateway1 The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 
 Container gateway1  Created
 gateway2 The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 
 Container gateway2  Created
 Container schema-registry  Created
 Container zookeeper  Starting
 Container kafka-client  Starting
 Container kafka-client  Started
 Container zookeeper  Started
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Healthy
 Container kafka2  Starting
 Container zookeeper  Healthy
 Container kafka3  Starting
 Container zookeeper  Healthy
 Container kafka1  Starting
 Container kafka1  Started
 Container kafka3  Started
 Container kafka2  Started
 Container kafka1  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container gateway1  Starting
 Container kafka2  Healthy
 Container gateway2  Starting
 Container kafka2  Healthy
 Container schema-registry  Starting
 Container gateway2  Started
 Container gateway1  Started
 Container schema-registry  Started
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Healthy
 Container kafka-client  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container schema-registry  Healthy
 Container gateway2  Healthy
 Container gateway1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/DNssOZ0VESfOdgHrf0Z1dgh1y.svg)](https://asciinema.org/a/DNssOZ0VESfOdgHrf0Z1dgh1y)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNTY3OTYzOX0.YqFehQofH7_a-vKu2OT2mE9K3N4fKiIyWS0vn0zvJ8s';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/uKGiwhsO3sd6dVNtwrTOYc9OG.svg)](https://asciinema.org/a/uKGiwhsO3sd6dVNtwrTOYc9OG)

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

[![asciicast](https://asciinema.org/a/pv9dv5aUbuvftCZgufDkXRfFx.svg)](https://asciinema.org/a/pv9dv5aUbuvftCZgufDkXRfFx)

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

[![asciicast](https://asciinema.org/a/rJVxxLvPfFGEADisM5y8fLX1V.svg)](https://asciinema.org/a/rJVxxLvPfFGEADisM5y8fLX1V)

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

[![asciicast](https://asciinema.org/a/zDLdTvTsHp9r7junVIIBvSEf9.svg)](https://asciinema.org/a/zDLdTvTsHp9r7junVIIBvSEf9)

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

[![asciicast](https://asciinema.org/a/LylACGokM7aTkdi4I3PNfF9HQ.svg)](https://asciinema.org/a/LylACGokM7aTkdi4I3PNfF9HQ)

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

[![asciicast](https://asciinema.org/a/ufoeYV08dSS7K94JSMITmX27G.svg)](https://asciinema.org/a/ufoeYV08dSS7K94JSMITmX27G)

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

[![asciicast](https://asciinema.org/a/gqgQEXLl8DO9lNGiZU6m5jtuu.svg)](https://asciinema.org/a/gqgQEXLl8DO9lNGiZU6m5jtuu)

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

[![asciicast](https://asciinema.org/a/gzXV2dBiExq81J99UQvJMQ0NR.svg)](https://asciinema.org/a/gzXV2dBiExq81J99UQvJMQ0NR)

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

[![asciicast](https://asciinema.org/a/X6xGKnJtdAzIqPwrzVTeXJqfO.svg)](https://asciinema.org/a/X6xGKnJtdAzIqPwrzVTeXJqfO)

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

[![asciicast](https://asciinema.org/a/edEnaaQdKJ0moK5bfjB33rJTa.svg)](https://asciinema.org/a/edEnaaQdKJ0moK5bfjB33rJTa)

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

[![asciicast](https://asciinema.org/a/HLbfmv8YHVWODR5O3B5oeHS6J.svg)](https://asciinema.org/a/HLbfmv8YHVWODR5O3B5oeHS6J)

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

[![asciicast](https://asciinema.org/a/jlCrdMY4bFV7hcwJqZJ7nflmm.svg)](https://asciinema.org/a/jlCrdMY4bFV7hcwJqZJ7nflmm)

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

[![asciicast](https://asciinema.org/a/jFLDpumBiAMVUbMiNl0v4brMi.svg)](https://asciinema.org/a/jFLDpumBiAMVUbMiNl0v4brMi)

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
    --property print.headers=true 
```


returns

```json
PDK_originalPartition:5,PDK_originalTopic:concentrated-topic-with-10-partitions	{"message": "10 partitions"}
PDK_originalPartition:11,PDK_originalTopic:concentrated-topic-with-20-partitions	{"message": "20 partitions"}
PDK_originalPartition:10,PDK_originalTopic:concentrated-topic-with-50-partitions	{"message": "50 partitions"}
PDK_originalPartition:93,PDK_originalTopic:concentrated-topic-with-100-partitions	{"message": "100 partitions"}
Processed a total of 4 messages

```



</TabItem>
<TabItem value="Output">

```
PDK_originalPartition:5,PDK_originalTopic:concentrated-topic-with-10-partitions	{"message": "10 partitions"}
PDK_originalPartition:11,PDK_originalTopic:concentrated-topic-with-20-partitions	{"message": "20 partitions"}
PDK_originalPartition:10,PDK_originalTopic:concentrated-topic-with-50-partitions	{"message": "50 partitions"}
PDK_originalPartition:93,PDK_originalTopic:concentrated-topic-with-100-partitions	{"message": "100 partitions"}
Processed a total of 4 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/yz4mi5tGabmGy4vCSKolLo6dc.svg)](https://asciinema.org/a/yz4mi5tGabmGy4vCSKolLo6dc)

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
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway2  Removed
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway1  Removed
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container schema-registry  Removed
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
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
 Network topic-concentration_default  Removing
 Network topic-concentration_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Kcrc95BpS3hDRpdrzmjlW34Sy.svg)](https://asciinema.org/a/Kcrc95BpS3hDRpdrzmjlW34Sy)

</TabItem>
</Tabs>

# Conclusion

Infinite partitions with topic concentration is really a game changer!

