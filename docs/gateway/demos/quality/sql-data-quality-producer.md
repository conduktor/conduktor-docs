---
title: SQL Based Data Quality Producer
description: SQL Based Data Quality Producer
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

[![asciicast](https://asciinema.org/a/lYPO7Co2fE5yJVlhD8tDbDiH3.svg)](https://asciinema.org/a/lYPO7Co2fE5yJVlhD8tDbDiH3)

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
 Container kafka3  Running
 Container kafka1  Running
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
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container gateway2  Healthy
 Container kafka1  Healthy
 Container zookeeper  Healthy
 Container schema-registry  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container gateway1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/eWx1wOMmsS8Pifo1S4NpW4i2C.svg)](https://asciinema.org/a/eWx1wOMmsS8Pifo1S4NpW4i2C)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNDQ2NzA0OH0.iWTxkvfgRShR4lK__1933w6u0U3yZlbmouAj4QQ9WO8';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/EZBtBOiKvEgMBWvn0OzXs2N08.svg)](https://asciinema.org/a/EZBtBOiKvEgMBWvn0OzXs2N08)

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

[![asciicast](https://asciinema.org/a/MRfoc6A8t1ItJHHBpC9Atw3r0.svg)](https://asciinema.org/a/MRfoc6A8t1ItJHHBpC9Atw3r0)

</TabItem>
</Tabs>

## Adding interceptor cars-quality

Let's create an interceptor to ensure the data produced is valid.

<Tabs>
<TabItem value="Command">


```sh
cat step-07-cars-quality.json | jq

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
  "pluginClass": "io.conduktor.gateway.interceptor.DataQualityProducerPlugin",
  "priority": 100,
  "config": {
    "statement": "SELECT * FROM cars WHERE color = 'red' and record.key.year > 2020",
    "action": "BLOCK_WHOLE_BATCH",
    "deadLetterTopic": "dead-letter-topic"
  }
}
{
  "message": "cars-quality is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/jCPPkqnv2EbI9jHcZwLVoejs2.svg)](https://asciinema.org/a/jCPPkqnv2EbI9jHcZwLVoejs2)

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
[2024-01-31 09:50:52,988] ERROR Error when sending message to topic cars with key: null, value: 42 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy: Data quality policy is violated.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/vZdDzdHGak7zGcoCyo20KBtdT.svg)](https://asciinema.org/a/vZdDzdHGak7zGcoCyo20KBtdT)

</TabItem>
</Tabs>

## Producing an invalid car based on key

Produce invalid record to the cars topic (record is not produced because year is not > 2020)

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "key" : "{\"year\":2010,\"make\":\"BMW\"}",
  "value" : {
    "type" : "Sports",
    "price" : 1000,
    "color" : "red"
  }
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
[2024-01-31 09:50:54,585] ERROR Error when sending message to topic cars with key: 26 bytes, value: 44 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy: Data quality policy is violated.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/8fNWsiWVTV6kwalJ7IBC2Dhz6.svg)](https://asciinema.org/a/8fNWsiWVTV6kwalJ7IBC2Dhz6)

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
  "value" : {
    "type" : "Trucks",
    "price" : 2500,
    "color" : "red"
  }
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

[![asciicast](https://asciinema.org/a/tRJSG7Tk1d29y9TTxhiflzPEE.svg)](https://asciinema.org/a/tRJSG7Tk1d29y9TTxhiflzPEE)

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


returns 1 event
```json
{
  "headers" : {
    "X-HEADER-1" : "value1",
    "X-HEADER-2" : "value2"
  },
  "key" : "{\"year\":2023,\"make\":\"Vinfast\"}",
  "value" : {
    "type" : "Trucks",
    "price" : 2500,
    "color" : "red"
  }
}
```


</TabItem>
<TabItem value="Output">

```json
jq: parse error: Invalid numeric literal at line 1, column 11
Processed a total of 1 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/9H5DC2JIRQ6Qyx3KgE5JdthqJ.svg)](https://asciinema.org/a/9H5DC2JIRQ6Qyx3KgE5JdthqJ)

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


returns 2 events
```json
{
  "headers" : {
    "X-ERROR-MSG" : "Message does not match the statement [SELECT * FROM cars WHERE color = 'red' and record.key.year > 2020]"
  },
  "key" : null,
  "value" : {
    "type" : "SUV",
    "price" : 2000,
    "color" : "blue"
  }
}
{
  "headers" : {
    "X-ERROR-MSG" : "Message does not match the statement [SELECT * FROM cars WHERE color = 'red' and record.key.year > 2020]"
  },
  "key" : "{\"year\":2010,\"make\":\"BMW\"}",
  "value" : {
    "type" : "Sports",
    "price" : 1000,
    "color" : "red"
  }
}
```


</TabItem>
<TabItem value="Output">

```json
jq: parse error: Invalid numeric literal at line 1, column 12
Processed a total of 2 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/EH44kgZiI42t65wbOMBenKNmF.svg)](https://asciinema.org/a/EH44kgZiI42t65wbOMBenKNmF)

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
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.DataQualityProducerInterceptor")'
```


returns 2 events
```json
{
  "id" : "a35d3c01-c96f-4355-8e00-8f6fcfe21119",
  "source" : "krn://cluster=KPb4D2o9SpSHujituJm59Q",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:44181"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T08:45:51.281438715Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.DataQualityProducerInterceptor",
    "message" : "Request parameters do not satisfy the configured policy: Data quality policy is violated."
  }
}
{
  "id" : "bdd6d002-32b4-4114-aa46-72c2794e1db6",
  "source" : "krn://cluster=KPb4D2o9SpSHujituJm59Q",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:44181"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T08:45:51.341459132Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.DataQualityProducerInterceptor",
    "message" : "Request parameters do not satisfy the configured policy: Data quality policy is violated."
  }
}
```


</TabItem>
<TabItem value="Output">

```
{"id":"689be27e-49c0-49ff-984a-365a4c5ed9f2","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.144.6:8888","remoteAddress":"192.168.65.1:58556"},"specVersion":"0.1.0","time":"2024-01-31T08:50:47.980228088Z","eventData":{"method":"POST","path":"/admin/vclusters/v1/vcluster/teamA/username/sa","body":"{\"lifeTimeSeconds\": 7776000}"}}
{"id":"a4963ba9-db3b-470c-b6be-19781618088c","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.144.6:6969","remoteAddress":"/192.168.65.1:43429"},"specVersion":"0.1.0","time":"2024-01-31T08:50:49.603671839Z","eventData":"SUCCESS"}
{"id":"d2c9f46a-e896-4af2-a51f-1d5e29cc1840","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.144.6:6970","remoteAddress":"/192.168.65.1:39258"},"specVersion":"0.1.0","time":"2024-01-31T08:50:49.710644547Z","eventData":"SUCCESS"}
{"id":"d69dd71f-e724-4533-9c9e-6e5e36daa794","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.144.6:8888","remoteAddress":"192.168.65.1:58570"},"specVersion":"0.1.0","time":"2024-01-31T08:50:50.476744923Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/cars-quality","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.DataQualityProducerPlugin\",  \"priority\" : 100,  \"config\" : {    \"statement\" : \"SELECT * FROM cars WHERE color = 'red' and record.key.year > 2020\",    \"action\" : \"BLOCK_WHOLE_BATCH\",    \"deadLetterTopic\" : \"dead-letter-topic\"  }}"}}
{"id":"16b70418-5e89-4132-be31-49d24d1cc482","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.144.6:6969","remoteAddress":"/192.168.65.1:43432"},"specVersion":"0.1.0","time":"2024-01-31T08:50:52.690862799Z","eventData":"SUCCESS"}
{"id":"cd1101ac-1e4f-477a-a74c-e24a713f31d2","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.144.6:6970","remoteAddress":"/192.168.65.1:39261"},"specVersion":"0.1.0","time":"2024-01-31T08:50:52.788385924Z","eventData":"SUCCESS"}
{"id":"d26b0cd5-6529-4157-8e16-c143e4be9f4c","source":"krn://cluster=h8xOuEcpRIabmTpeR2Xngw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:39261"},"specVersion":"0.1.0","time":"2024-01-31T08:50:52.952499382Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.DataQualityProducerInterceptor","message":"Request parameters do not satisfy the configured policy: Data quality policy is violated."}}
{"id":"c34fb114-5f23-4cbe-9804-21d7c24c9e3b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.144.6:6969","remoteAddress":"/192.168.65.1:43434"},"specVersion":"0.1.0","time":"2024-01-31T08:50:54.502774091Z","eventData":"SUCCESS"}
{"id":"cd2f67d1-c081-493b-bfcb-5f3df66d194b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.144.6:6970","remoteAddress":"/192.168.65.1:39263"},"specVersion":"0.1.0","time":"2024-01-31T08:50:54.554632800Z","eventData":"SUCCESS"}
{"id":"0e0622e4-df60-4c49-90c6-bc5ab594dc81","source":"krn://cluster=h8xOuEcpRIabmTpeR2Xngw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:39263"},"specVersion":"0.1.0","time":"2024-01-31T08:50:54.576258425Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.DataQualityProducerInterceptor","message":"Request parameters do not satisfy the configured policy: Data quality policy is violated."}}
{"id":"d4207835-05f8-410b-a9c2-a160a867631d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.144.6:6969","remoteAddress":"/192.168.65.1:43436"},"specVersion":"0.1.0","time":"2024-01-31T08:50:56.630422259Z","eventData":"SUCCESS"}
{"id":"8bc9c2c6-0b42-43b7-b924-9f4254aa51c8","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.144.6:6970","remoteAddress":"/192.168.65.1:39265"},"specVersion":"0.1.0","time":"2024-01-31T08:50:57.220912301Z","eventData":"SUCCESS"}
{"id":"883141ed-ce85-477d-8e55-f89136eae5ec","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.144.6:6969","remoteAddress":"/192.168.65.1:43449"},"specVersion":"0.1.0","time":"2024-01-31T08:50:59.232649552Z","eventData":"SUCCESS"}
{"id":"ed32c3cc-2dc2-40f1-9800-64f780a512b1","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.144.6:6969","remoteAddress":"/192.168.65.1:43450"},"specVersion":"0.1.0","time":"2024-01-31T08:50:59.301311135Z","eventData":"SUCCESS"}
{"id":"8191c02d-7c7d-4c80-a585-28c7ef391505","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.144.6:6970","remoteAddress":"/192.168.65.1:39279"},"specVersion":"0.1.0","time":"2024-01-31T08:50:59.746519219Z","eventData":"SUCCESS"}
[2024-01-31 09:51:07,500] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 15 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/o2LlpxF1pRizddgLAm100RAqt.svg)](https://asciinema.org/a/o2LlpxF1pRizddgLAm100RAqt)

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
 Container schema-registry  Stopping
 Container gateway1  Stopping
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway1  Stopped
 Container gateway1  Removing
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway1  Removed
 Container gateway2  Removed
 Container schema-registry  Removed
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka1  Removed
 Container kafka3  Removed
 Container kafka2  Removed
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network sql-data-quality-producer_default  Removing
 Network sql-data-quality-producer_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/KvSROLnxke5LlqNUBQTPWREs2.svg)](https://asciinema.org/a/KvSROLnxke5LlqNUBQTPWREs2)

</TabItem>
</Tabs>

