---
title: SQL Based Data Quality Producer
description: SQL Based Data Quality Producer
tag: quality
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# What is SQL Data quality producer?

Use sql definition to assert data quality before being produced.

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/fV9XdLb49NkOdQKL4lAtZEmld.svg)](https://asciinema.org/a/fV9XdLb49NkOdQKL4lAtZEmld)

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
 Network sql-data-quality-producer_default  Creating
 Network sql-data-quality-producer_default  Created
 Container zookeeper  Creating
 Container kafka-client  Creating
 Container kafka-client  Created
 Container zookeeper  Created
 Container kafka3  Creating
 Container kafka1  Creating
 Container kafka2  Creating
 Container kafka3  Created
 Container kafka1  Created
 Container kafka2  Created
 Container schema-registry  Creating
 Container gateway1  Creating
 Container gateway2  Creating
 gateway1 The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 
 gateway2 The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 
 Container gateway2  Created
 Container gateway1  Created
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
 Container kafka3  Starting
 Container zookeeper  Healthy
 Container kafka2  Starting
 Container kafka2  Started
 Container kafka3  Started
 Container kafka1  Started
 Container kafka2  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka3  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container schema-registry  Starting
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container gateway2  Starting
 Container kafka3  Healthy
 Container gateway1  Starting
 Container schema-registry  Started
 Container gateway1  Started
 Container gateway2  Started
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container zookeeper  Healthy
 Container kafka2  Healthy
 Container kafka-client  Healthy
 Container schema-registry  Healthy
 Container gateway2  Healthy
 Container gateway1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/mMChPHhYW38sIfJM9Cuz1ziQp.svg)](https://asciinema.org/a/mMChPHhYW38sIfJM9Cuz1ziQp)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNTY1Nzk5OH0.X4c9Be9T0zzxtPGXHPH6bDEYX2SwsoYNiXIRIe32CBI';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/VKPtPUhEJTA6t2QkcakMeOlz3.svg)](https://asciinema.org/a/VKPtPUhEJTA6t2QkcakMeOlz3)

</TabItem>
</Tabs>

## Creating topic cars on teamA

Creating on `teamA`:

* Topic `cars` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
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

[![asciicast](https://asciinema.org/a/BImwyUegtfLfa8fpKTauiCknK.svg)](https://asciinema.org/a/BImwyUegtfLfa8fpKTauiCknK)

</TabItem>
</Tabs>

## Adding interceptor cars-quality

Let's create an interceptor to ensure the data produced is valid.

Creating the interceptor named `cars-quality` of the plugin `io.conduktor.gateway.interceptor.DataQualityProducerPlugin` using the following payload

```json
{
  "pluginClass" : "io.conduktor.gateway.interceptor.DataQualityProducerPlugin",
  "priority" : 100,
  "config" : {
    "statement" : "SELECT * FROM cars WHERE color = 'red' and record.key.year > 2020",
    "action" : "BLOCK_WHOLE_BATCH",
    "deadLetterTopic" : "dead-letter-topic"
  }
}
```

Here's how to send it:

<Tabs>
<TabItem value="Command">


```sh
curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/cars-quality" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-07-cars-quality.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "message": "cars-quality is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/MmvIY5p8Y5Bel7ADx9a6ibi95.svg)](https://asciinema.org/a/MmvIY5p8Y5Bel7ADx9a6ibi95)

</TabItem>
</Tabs>

## Producing an invalid car

Produce invalid record to the cars topic (record is not produced because color is not red)

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "type" : "SUV",
  "price" : 2000,
  "color" : "blue"
}
```
with


```sh
echo '{"type":"SUV","price":2000,"color":"blue"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic cars
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> org.apache.kafka.common.errors.PolicyViolationException:
>> Request parameters do not satisfy the configured policy: Data quality policy is violated.
> ```




</TabItem>
<TabItem value="Output">

```
[2024-02-14 04:40:02,341] ERROR Error when sending message to topic cars with key: null, value: 42 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy: Data quality policy is violated.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/THX2pX8KXOZicyNLwQ2xSeEMZ.svg)](https://asciinema.org/a/THX2pX8KXOZicyNLwQ2xSeEMZ)

</TabItem>
</Tabs>

## Producing an invalid car based on key

Produce invalid record to the cars topic (record is not produced because year is not > 2020)

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "headers" : { },
  "key" : "{\"year\":2010,\"make\":\"BMW\"}",
  "value" : "{\"type\":\"Sports\",\"price\":1000,\"color\":\"red\"}"
}
```
with


```sh
echo '{"year":2010,"make":"BMW"}\t{"type":"Sports","price":1000,"color":"red"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --property "parse.key=true" \
        --topic cars
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> org.apache.kafka.common.errors.PolicyViolationException:
>> Request parameters do not satisfy the configured policy: Data quality policy is violated.
> ```




</TabItem>
<TabItem value="Output">

```
[2024-02-14 04:40:03,663] ERROR Error when sending message to topic cars with key: 26 bytes, value: 44 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy: Data quality policy is violated.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/6Ds1vgVTptxjq52dq1ogAxmTk.svg)](https://asciinema.org/a/6Ds1vgVTptxjq52dq1ogAxmTk)

</TabItem>
</Tabs>

## Producing a valid car

Produce valid record to the cars topic

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "headers" : {
    "X-HEADER-1" : "value1",
    "X-HEADER-2" : "value2"
  },
  "key" : "{\"year\":2023,\"make\":\"Vinfast\"}",
  "value" : "{\"type\":\"Trucks\",\"price\":2500,\"color\":\"red\"}"
}
```
with


```sh
echo 'X-HEADER-1:value1,X-HEADER-2:value2\t{"year":2023,"make":"Vinfast"}\t{"type":"Trucks","price":2500,"color":"red"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --property "parse.key=true" \
        --property "parse.headers=true" \
        --topic cars
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Rdjp6JNZ08Lt9i5kkOZOq4fjV.svg)](https://asciinema.org/a/Rdjp6JNZ08Lt9i5kkOZOq4fjV)

</TabItem>
</Tabs>

## Consuming from cars

Let's confirm just one record is there by consuming from the cars topic.

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic cars \
    --from-beginning \
    --max-messages 1 \
    --timeout-ms 10000 \
    --property print.key=true \
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

[![asciicast](https://asciinema.org/a/b3yfaWiM5SO0VhY06hx50Hnxz.svg)](https://asciinema.org/a/b3yfaWiM5SO0VhY06hx50Hnxz)

</TabItem>
</Tabs>

## Confirm all invalid cars are in the dead letter topic

Let's confirm the invalid records are in the dead letter topic.

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:19092,localhost:29093,localhost:29094 \
    --topic dead-letter-topic \
    --from-beginning \
    --max-messages 2 \
    --timeout-ms 10000 \
    --property print.key=true \
    --property print.headers=true | jq
```


returns 

```json
[2024-02-14 04:40:08,192] WARN [Consumer clientId=console-consumer, groupId=console-consumer-77413] Connection to node -3 (localhost/127.0.0.1:29094) could not be established. Broker may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 04:40:08,192] WARN [Consumer clientId=console-consumer, groupId=console-consumer-77413] Bootstrap broker localhost:29094 (id: -3 rack: null) disconnected (org.apache.kafka.clients.NetworkClient)
[2024-02-14 04:40:08,294] WARN [Consumer clientId=console-consumer, groupId=console-consumer-77413] Connection to node -2 (localhost/127.0.0.1:29093) could not be established. Broker may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 04:40:08,294] WARN [Consumer clientId=console-consumer, groupId=console-consumer-77413] Bootstrap broker localhost:29093 (id: -2 rack: null) disconnected (org.apache.kafka.clients.NetworkClient)
jq: parse error: Invalid numeric literal at line 1, column 12
Processed a total of 2 messages

```



</TabItem>
<TabItem value="Output">

```json
[2024-02-14 04:40:08,192] WARN [Consumer clientId=console-consumer, groupId=console-consumer-77413] Connection to node -3 (localhost/127.0.0.1:29094) could not be established. Broker may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 04:40:08,192] WARN [Consumer clientId=console-consumer, groupId=console-consumer-77413] Bootstrap broker localhost:29094 (id: -3 rack: null) disconnected (org.apache.kafka.clients.NetworkClient)
[2024-02-14 04:40:08,294] WARN [Consumer clientId=console-consumer, groupId=console-consumer-77413] Connection to node -2 (localhost/127.0.0.1:29093) could not be established. Broker may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 04:40:08,294] WARN [Consumer clientId=console-consumer, groupId=console-consumer-77413] Bootstrap broker localhost:29093 (id: -2 rack: null) disconnected (org.apache.kafka.clients.NetworkClient)
jq: parse error: Invalid numeric literal at line 1, column 12
Processed a total of 2 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/VJEH3OVHPKw90scjc4iRb8kCn.svg)](https://asciinema.org/a/VJEH3OVHPKw90scjc4iRb8kCn)

</TabItem>
</Tabs>

## Check in the audit log that messages denial were captured

Check in the audit log that messages denial were captured in cluster `kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:19092,localhost:29093,localhost:29094 \
    --topic _auditLogs \
    --from-beginning \
    --timeout-ms 3000 \
    | jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.DataQualityProducerInterceptor")'
```


returns 

```json
[2024-02-14 04:40:10,285] WARN [Consumer clientId=console-consumer, groupId=console-consumer-79560] Connection to node -3 (localhost/127.0.0.1:29094) could not be established. Broker may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 04:40:10,285] WARN [Consumer clientId=console-consumer, groupId=console-consumer-79560] Bootstrap broker localhost:29094 (id: -3 rack: null) disconnected (org.apache.kafka.clients.NetworkClient)
Processed a total of 15 messages
{
  "id": "b614ab23-d5bb-4ce9-b4dc-2f11945df53c",
  "source": "krn://cluster=i8_E-a17RG6Aat716F1btw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:32870"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T03:40:02.319943378Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.DataQualityProducerInterceptor",
    "message": "Request parameters do not satisfy the configured policy: Data quality policy is violated."
  }
}
{
  "id": "18ffee64-e7b2-4daa-8875-519090c990b7",
  "source": "krn://cluster=i8_E-a17RG6Aat716F1btw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:32872"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T03:40:03.656667170Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.DataQualityProducerInterceptor",
    "message": "Request parameters do not satisfy the configured policy: Data quality policy is violated."
  }
}

```



</TabItem>
<TabItem value="Output">

```
[2024-02-14 04:40:10,285] WARN [Consumer clientId=console-consumer, groupId=console-consumer-79560] Connection to node -3 (localhost/127.0.0.1:29094) could not be established. Broker may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 04:40:10,285] WARN [Consumer clientId=console-consumer, groupId=console-consumer-79560] Bootstrap broker localhost:29094 (id: -3 rack: null) disconnected (org.apache.kafka.clients.NetworkClient)
Processed a total of 15 messages
{
  "id": "b614ab23-d5bb-4ce9-b4dc-2f11945df53c",
  "source": "krn://cluster=i8_E-a17RG6Aat716F1btw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:32870"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T03:40:02.319943378Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.DataQualityProducerInterceptor",
    "message": "Request parameters do not satisfy the configured policy: Data quality policy is violated."
  }
}
{
  "id": "18ffee64-e7b2-4daa-8875-519090c990b7",
  "source": "krn://cluster=i8_E-a17RG6Aat716F1btw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:32872"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T03:40:03.656667170Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.DataQualityProducerInterceptor",
    "message": "Request parameters do not satisfy the configured policy: Data quality policy is violated."
  }
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/3yeCGmHxoik0Jq2ebLhGn5dtt.svg)](https://asciinema.org/a/3yeCGmHxoik0Jq2ebLhGn5dtt)

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
 Container kafka-client  Stopping
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
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network sql-data-quality-producer_default  Removing
 Network sql-data-quality-producer_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/tAHgTu6vtt33q99hG5uTNHxrN.svg)](https://asciinema.org/a/tAHgTu6vtt33q99hG5uTNHxrN)

</TabItem>
</Tabs>

