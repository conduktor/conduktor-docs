---
title: SQL topics
description: SQL topics
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# What is sql topics?

Don't reinvent the wheel to filter and project your messages, just use SQL!

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/geOJewXxrPwbjB3c8Yqh7bV1C.svg)](https://asciinema.org/a/geOJewXxrPwbjB3c8Yqh7bV1C)

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
      GATEWAY_MODE: KAFKA_SECURITY
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
      GATEWAY_MODE: KAFKA_SECURITY
      GATEWAY_SECURITY_PROTOCOL: PLAINTEXT
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
 Container kafka2  Running
 Container kafka3  Running
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
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container schema-registry  Healthy
 Container kafka2  Healthy
 Container zookeeper  Healthy
 Container gateway1  Healthy
 Container kafka3  Healthy
 Container gateway2  Healthy
 Container kafka1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/IlWPVeXwixP4y2LE4Mx6NgKbv.svg)](https://asciinema.org/a/IlWPVeXwixP4y2LE4Mx6NgKbv)

</TabItem>
</Tabs>

## Creating topic cars on gateway1

Creating on `gateway1`:

* Topic `cars` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic cars
```


</TabItem>
<TabItem value="Output">

```
Created topic cars.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ztDC1WCI4HJVAZrAWn7OPRdzc.svg)](https://asciinema.org/a/ztDC1WCI4HJVAZrAWn7OPRdzc)

</TabItem>
</Tabs>

## Producing 2 messages in cars

Produce 2 records to the cars topic: our mock car data for cars.

* A blue car
* A red car

<Tabs>
<TabItem value="Command">


Sending 2 events
```json
{
  "type" : "Sports",
  "price" : 75,
  "color" : "blue"
}
{
  "type" : "SUV",
  "price" : 55,
  "color" : "red"
}
```
with


```sh
echo '{"type":"Sports","price":75,"color":"blue"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic cars

echo '{"type":"SUV","price":55,"color":"red"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic cars
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ZJUqGd5ijbvWWUxGM2iLD1E0w.svg)](https://asciinema.org/a/ZJUqGd5ijbvWWUxGM2iLD1E0w)

</TabItem>
</Tabs>

## Consuming from cars

Let's confirm the 2 records are there by consuming from the cars topic.

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic cars \
    --from-beginning \
    --max-messages 2 \
    --timeout-ms 10000 | jq
```


returns 2 events
```json
{
  "type" : "Sports",
  "price" : 75,
  "color" : "blue"
}
{
  "type" : "SUV",
  "price" : 55,
  "color" : "red"
}
```


</TabItem>
<TabItem value="Output">

```json
Processed a total of 2 messages
{
  "type": "Sports",
  "price": 75,
  "color": "blue"
}
{
  "type": "SUV",
  "price": 55,
  "color": "red"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/eACYMS5R4CEWFpRrHQetrR2P1.svg)](https://asciinema.org/a/eACYMS5R4CEWFpRrHQetrR2P1)

</TabItem>
</Tabs>

## Adding interceptor red-cars

Let's create the interceptor to filter out the red cars from the cars topic.

<Tabs>
<TabItem value="Command">


```sh
cat step-08-red-cars.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/passthrough/interceptor/red-cars" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-08-red-cars.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "pluginClass": "io.conduktor.gateway.interceptor.VirtualSqlTopicPlugin",
  "priority": 100,
  "config": {
    "virtualTopic": "red-cars",
    "statement": "SELECT type, price as money FROM cars WHERE color = 'red'"
  }
}
{
  "message": "red-cars is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/sCsDbheDRYA85SVwLB6kZiPot.svg)](https://asciinema.org/a/sCsDbheDRYA85SVwLB6kZiPot)

</TabItem>
</Tabs>

## Listing interceptors for passthrough

Listing interceptors on `gateway1` for virtual cluster `passthrough`

<Tabs>
<TabItem value="Command">


```sh
curl \
    --request GET 'http://localhost:8888/admin/interceptors/v1/vcluster/passthrough' \
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
      "name": "red-cars",
      "pluginClass": "io.conduktor.gateway.interceptor.VirtualSqlTopicPlugin",
      "apiKey": null,
      "priority": 100,
      "timeoutMs": 9223372036854775807,
      "config": {
        "virtualTopic": "red-cars",
        "statement": "SELECT type, price as money FROM cars WHERE color = 'red'"
      }
    }
  ]
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/IOC6EuIPGXn8g5z5JeyutLCbM.svg)](https://asciinema.org/a/IOC6EuIPGXn8g5z5JeyutLCbM)

</TabItem>
</Tabs>

## Consume from the virtual topic red-cars

Let's consume from our virtual topic red-cars.

You now see only one car, the red one, please note that its format changed according to our SQL statement's projection.

If you are wondering if you can be a bit more fancy, the answer is ... yes!

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic red-cars \
    --from-beginning \
    --timeout-ms 10000 | jq
```


returns 1 event
```json
{
  "type" : "SUV",
  "money" : 55
}
```


</TabItem>
<TabItem value="Output">

```json
[2024-01-31 10:02:28,041] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages
{
  "type": "SUV",
  "money": 55
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/FDNLHPg6zoJxl0xIwRTcfKdCl.svg)](https://asciinema.org/a/FDNLHPg6zoJxl0xIwRTcfKdCl)

</TabItem>
</Tabs>

## Can we do more with SQL?

Yes! We sure can.

```sql
SELECT
  type,
  price as newPriceName,
  color,
  CASE
    WHEN color = 'red' AND price > 1000 THEN 'Exceptional'
    WHEN price > 8000 THEN 'Luxury'
    ELSE 'Regular'
  END as quality,
  record.offset as record_offset,
  record.partition as record_partition
FROM cars
```

is an example where you mix projection, case, renaming, and kafka metadata.

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
 Container schema-registry  Stopping
 Container gateway1  Stopping
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway1  Removed
 Container gateway2  Removed
 Container schema-registry  Removed
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka1  Removed
 Container kafka2  Removed
 Container kafka3  Removed
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network sql-topics_default  Removing
 Network sql-topics_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/oRy5DGgE1bmYWZMw1fBEeb1bJ.svg)](https://asciinema.org/a/oRy5DGgE1bmYWZMw1fBEeb1bJ)

</TabItem>
</Tabs>

# Conclusion

SQL topic is really a game changer!

