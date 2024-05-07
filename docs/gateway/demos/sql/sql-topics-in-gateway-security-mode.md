---
title: SQL topics in GATEWAY_SECURITY mode
description: SQL topics in GATEWAY_SECURITY mode
tag: sql
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

[![asciicast](https://asciinema.org/a/sDttOJuwDWz8nAYoUxqRs2NHz.svg)](https://asciinema.org/a/sDttOJuwDWz8nAYoUxqRs2NHz)

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
    image: conduktor/conduktor-gateway:3.0.2
    hostname: gateway1
    container_name: gateway1
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9093,kafka3:9094
      GATEWAY_ADVERTISED_HOST: localhost
      GATEWAY_MODE: GATEWAY_SECURITY
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
    image: conduktor/conduktor-gateway:3.0.2
    hostname: gateway2
    container_name: gateway2
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9093,kafka3:9094
      GATEWAY_ADVERTISED_HOST: localhost
      GATEWAY_MODE: GATEWAY_SECURITY
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
 Network sql-topics-in-gateway-security-mode_default  Creating
 Network sql-topics-in-gateway-security-mode_default  Created
 Container zookeeper  Creating
 Container kafka-client  Creating
 Container zookeeper  Created
 Container kafka2  Creating
 Container kafka3  Creating
 Container kafka1  Creating
 Container kafka-client  Created
 Container kafka2  Created
 Container kafka1  Created
 Container kafka3  Created
 Container gateway2  Creating
 Container schema-registry  Creating
 Container gateway1  Creating
 Container gateway2  Created
 Container gateway1  Created
 Container schema-registry  Created
 Container kafka-client  Starting
 Container zookeeper  Starting
 Container zookeeper  Started
 Container kafka-client  Started
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Healthy
 Container kafka2  Starting
 Container zookeeper  Healthy
 Container kafka1  Starting
 Container zookeeper  Healthy
 Container kafka3  Starting
 Container kafka2  Started
 Container kafka1  Started
 Container kafka3  Started
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container gateway2  Starting
 Container kafka2  Healthy
 Container gateway1  Starting
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container schema-registry  Starting
 Container gateway1  Started
 Container gateway2  Started
 Container schema-registry  Started
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container zookeeper  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka-client  Healthy
 Container gateway1  Healthy
 Container gateway2  Healthy
 Container schema-registry  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/dH16OI4VW35pV6jowM7WoOje7.svg)](https://asciinema.org/a/dH16OI4VW35pV6jowM7WoOje7)

</TabItem>
</Tabs>

## Creating virtual cluster passthrough

Creating virtual cluster `passthrough` on gateway `gateway1` and reviewing the configuration file to access it

<Tabs>
<TabItem value="Command">


```sh
# Generate virtual cluster passthrough with service account sa
token=$(curl \
    --request POST "http://localhost:8888/admin/vclusters/v1/vcluster/passthrough/username/sa" \
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
""" > passthrough-sa.properties

# Review file
cat passthrough-sa.properties
```


</TabItem>
<TabItem value="Output">

```

bootstrap.servers=localhost:6969
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJwYXNzdGhyb3VnaCIsImV4cCI6MTcyMDQ4NDY0M30.ftmw0vnFC2D1-6q1B2YcWqbV-Xe0sOrxiPnb6Z1tVdU';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/LyBs055T5il6MByzTuQ9OBzEG.svg)](https://asciinema.org/a/LyBs055T5il6MByzTuQ9OBzEG)

</TabItem>
</Tabs>

## Creating topic cars on passthrough

Creating on `passthrough`:

* Topic `cars` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config passthrough-sa.properties \
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

[![asciicast](https://asciinema.org/a/qahOt7q16OvsLbDAxJi6RAaPs.svg)](https://asciinema.org/a/qahOt7q16OvsLbDAxJi6RAaPs)

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
        --producer.config passthrough-sa.properties \
        --topic cars

echo '{"type":"SUV","price":55,"color":"red"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config passthrough-sa.properties \
        --topic cars
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/omAFwvXQjykvx5QR1Bw1UBXIt.svg)](https://asciinema.org/a/omAFwvXQjykvx5QR1Bw1UBXIt)

</TabItem>
</Tabs>

## Consuming from cars

Let's confirm the 2 records are there by consuming from the cars topic.

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config passthrough-sa.properties \
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

[![asciicast](https://asciinema.org/a/Az086t34IOFeenvxtkUMTtVPs.svg)](https://asciinema.org/a/Az086t34IOFeenvxtkUMTtVPs)

</TabItem>
</Tabs>

## Adding interceptor red-cars

Let's create the interceptor to filter out the red cars from the cars topic.

<Tabs>
<TabItem value="Command">


```sh
cat step-09-red-cars.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/passthrough/interceptor/red-cars" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-09-red-cars.json | jq
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

[![asciicast](https://asciinema.org/a/VcIAHOFxM0PnBlLAZbtsFEGES.svg)](https://asciinema.org/a/VcIAHOFxM0PnBlLAZbtsFEGES)

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

[![asciicast](https://asciinema.org/a/EzO5jd0qyMkhx2OjihpL0duMR.svg)](https://asciinema.org/a/EzO5jd0qyMkhx2OjihpL0duMR)

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
    --consumer.config passthrough-sa.properties \
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
[2024-04-10 04:24:21,051] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages
{
  "type": "SUV",
  "money": 55
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/FYEpIX6Ab8aIFvxWzGTRDkg9C.svg)](https://asciinema.org/a/FYEpIX6Ab8aIFvxWzGTRDkg9C)

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
 Container schema-registry  Stopping
 Container gateway2  Stopping
 Container kafka-client  Stopping
 Container gateway1  Stopping
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway2  Removed
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container schema-registry  Removed
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway1  Removed
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network sql-topics-in-gateway-security-mode_default  Removing
 Network sql-topics-in-gateway-security-mode_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/n9hY8c5tjyrGuvc0Q9MFNToXJ.svg)](https://asciinema.org/a/n9hY8c5tjyrGuvc0Q9MFNToXJ)

</TabItem>
</Tabs>

# Conclusion

SQL topic is really a game changer!

