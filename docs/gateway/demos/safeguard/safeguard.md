---
title: Safeguard
description: Safeguard
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# What is a safeguard?

Enforce your rules where it matters

Safeguard ensures that your teams follow your rules and can't break convention. 

Enable your teams, prevent common mistakes, protect your infra.

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Xu9OYDRISdqnhTZg4H7PPkwwh.svg)](https://asciinema.org/a/Xu9OYDRISdqnhTZg4H7PPkwwh)

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
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container gateway2  Healthy
 Container zookeeper  Healthy
 Container schema-registry  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container gateway1  Healthy
 Container kafka1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/zScjEnW95MJ4ZzQG3SMihULCG.svg)](https://asciinema.org/a/zScjEnW95MJ4ZzQG3SMihULCG)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNDQ2NDAzM30.cJJ89qPOcyqGS6-xYz3fRl4ZFic-wFrTbT8hEYURhgQ';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/6BVzxHlSoKefWT3RhsAOzudU5.svg)](https://asciinema.org/a/6BVzxHlSoKefWT3RhsAOzudU5)

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

[![asciicast](https://asciinema.org/a/Bou5BY0hhXUIv9ihjSlSsJT0q.svg)](https://asciinema.org/a/Bou5BY0hhXUIv9ihjSlSsJT0q)

</TabItem>
</Tabs>

## Producing 3 messages in cars

Produce 3 records to the cars topic.

<Tabs>
<TabItem value="Command">


Sending 3 events
```json
{
  "type" : "Ferrari",
  "color" : "red",
  "price" : 10000
}
{
  "type" : "RollsRoyce",
  "color" : "black",
  "price" : 9000
}
{
  "type" : "Mercedes",
  "color" : "black",
  "price" : 6000
}
```
with


```sh
echo '{"type":"Ferrari","color":"red","price":10000}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic cars

echo '{"type":"RollsRoyce","color":"black","price":9000}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic cars

echo '{"type":"Mercedes","color":"black","price":6000}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic cars
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/omr4QrpOmpE4ngXZj0iEQkv5W.svg)](https://asciinema.org/a/omr4QrpOmpE4ngXZj0iEQkv5W)

</TabItem>
</Tabs>

## Consume the cars topic

Let's confirm the 3 cars are there by consuming from the cars topic.

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic cars \
    --from-beginning \
    --max-messages 3 \
    --timeout-ms 10000 | jq
```


</TabItem>
<TabItem value="Output">

```json
Processed a total of 3 messages
{
  "type": "Ferrari",
  "color": "red",
  "price": 10000
}
{
  "type": "RollsRoyce",
  "color": "black",
  "price": 9000
}
{
  "type": "Mercedes",
  "color": "black",
  "price": 6000
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ZMALFU3VrvPQHgiPyaXpC7EU5.svg)](https://asciinema.org/a/ZMALFU3VrvPQHgiPyaXpC7EU5)

</TabItem>
</Tabs>

## Describing topic cars

Replication factor is 1? 

This is bad: we can lose data!

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --describe \
    --topic cars
```


</TabItem>
<TabItem value="Output">

```
Topic: cars	TopicId: VTNRgjLUTkmXnhI8jCTRtQ	PartitionCount: 1	ReplicationFactor: 1	Configs: 
	Topic: cars	Partition: 0	Leader: 3	Replicas: 3	Isr: 3

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Rdduojz6Wo87VxsRcRKvdlgzF.svg)](https://asciinema.org/a/Rdduojz6Wo87VxsRcRKvdlgzF)

</TabItem>
</Tabs>

## Adding interceptor guard-on-create-topic

Let's make sure this problem never repeats itself and add a topic creation safeguard. 

... and while we're at it, let's make sure we don't abuse partitions either

<Tabs>
<TabItem value="Command">


```sh
cat step-10-guard-on-create-topic.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/guard-on-create-topic" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-10-guard-on-create-topic.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin",
  "priority": 100,
  "config": {
    "replicationFactor": {
      "min": 2,
      "max": 2
    },
    "numPartition": {
      "min": 1,
      "max": 3
    }
  }
}
{
  "message": "guard-on-create-topic is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/KXMeb7Mej9K9YwGwH8GD3xsWx.svg)](https://asciinema.org/a/KXMeb7Mej9K9YwGwH8GD3xsWx)

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
      "name": "guard-on-create-topic",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin",
      "apiKey": null,
      "priority": 100,
      "timeoutMs": 9223372036854775807,
      "config": {
        "replicationFactor": {
          "min": 2,
          "max": 2
        },
        "numPartition": {
          "min": 1,
          "max": 3
        }
      }
    }
  ]
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/NtXUtq6WvhA6j1pTrjOM9dgo4.svg)](https://asciinema.org/a/NtXUtq6WvhA6j1pTrjOM9dgo4)

</TabItem>
</Tabs>

## Create a topic that is not within policy

Topic creation is denied by our policy

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 100 \
    --create --if-not-exists \
    --topic roads
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> org.apache.kafka.common.errors.PolicyViolationException:
>> Request parameters do not satisfy the configured policy.
>>Topic 'roads' with number partitions is '100', must not be greater than 3.
>>Topic 'roads' with replication factor is '1', must not be less than 2
> ```




</TabItem>
<TabItem value="Output">

```
Error while executing topic command : Request parameters do not satisfy the configured policy. Topic 'roads' with number partitions is '100', must not be greater than 3. Topic 'roads' with replication factor is '1', must not be less than 2
[2024-01-31 09:00:47,299] ERROR org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'roads' with number partitions is '100', must not be greater than 3. Topic 'roads' with replication factor is '1', must not be less than 2
 (kafka.admin.TopicCommand$)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/N1W6pJIT6pbdEvt9KYaVZOUpT.svg)](https://asciinema.org/a/N1W6pJIT6pbdEvt9KYaVZOUpT)

</TabItem>
</Tabs>

## Let's now create it again, with parameters within our policy

Perfect, it has been created

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 2 \
    --partitions 3 \
    --create --if-not-exists \
    --topic roads
```


</TabItem>
<TabItem value="Output">

```
Created topic roads.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/8qUiCAMSTpH2xz0xmlPvQDBYZ.svg)](https://asciinema.org/a/8qUiCAMSTpH2xz0xmlPvQDBYZ)

</TabItem>
</Tabs>

## Adding interceptor guard-on-alter-topic

Let's make sure we enforce policies when we alter topics too

Here the retention can only be between 1 and 5 days

<Tabs>
<TabItem value="Command">


```sh
cat step-14-guard-on-alter-topic.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/guard-on-alter-topic" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-14-guard-on-alter-topic.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin",
  "priority": 100,
  "config": {
    "retentionMs": {
      "min": 86400000,
      "max": 432000000
    }
  }
}
{
  "message": "guard-on-alter-topic is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/waoZimRYdep8ac0TwGYgV61iX.svg)](https://asciinema.org/a/waoZimRYdep8ac0TwGYgV61iX)

</TabItem>
</Tabs>

## Update 'cars' with a retention of 60 days

Altering the topic is denied by our policy

<Tabs>
<TabItem value="Command">


```sh
kafka-configs \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --alter \
    --entity-type topics \
    --entity-name roads \
    --add-config retention.ms=5184000000
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> org.apache.kafka.common.errors.PolicyViolationException:
>> Request parameters do not satisfy the configured policy. Resource 'roads' with retention.ms is '5184000000', must not be greater than '432000000'
> ```




</TabItem>
<TabItem value="Output">

```
Error while executing config command with args '--bootstrap-server localhost:6969 --command-config teamA-sa.properties --alter --entity-type topics --entity-name roads --add-config retention.ms=5184000000'
java.util.concurrent.ExecutionException: org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Resource 'roads' with retention.ms is '5184000000', must not be greater than '432000000'
	at java.base/java.util.concurrent.CompletableFuture.reportGet(CompletableFuture.java:396)
	at java.base/java.util.concurrent.CompletableFuture.get(CompletableFuture.java:2096)
	at org.apache.kafka.common.internals.KafkaFutureImpl.get(KafkaFutureImpl.java:180)
	at kafka.admin.ConfigCommand$.alterConfig(ConfigCommand.scala:361)
	at kafka.admin.ConfigCommand$.processCommand(ConfigCommand.scala:328)
	at kafka.admin.ConfigCommand$.main(ConfigCommand.scala:97)
	at kafka.admin.ConfigCommand.main(ConfigCommand.scala)
Caused by: org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Resource 'roads' with retention.ms is '5184000000', must not be greater than '432000000'

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/0hNdv44u5W4fkWgsNlpkjhbBz.svg)](https://asciinema.org/a/0hNdv44u5W4fkWgsNlpkjhbBz)

</TabItem>
</Tabs>

## Update 'cars' with a retention of 3 days

Topic updated successfully

<Tabs>
<TabItem value="Command">


```sh
kafka-configs \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --alter \
    --entity-type topics \
    --entity-name roads \
    --add-config retention.ms=259200000
```


</TabItem>
<TabItem value="Output">

```
Completed updating config for topic roads.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Cz81ESprRHAORcRzNiQ4SpsP2.svg)](https://asciinema.org/a/Cz81ESprRHAORcRzNiQ4SpsP2)

</TabItem>
</Tabs>

## Adding interceptor guard-on-produce

Let's make sure we enforce policies also at produce time!

Here message shall be sent with compression and with the right level of resiliency

<Tabs>
<TabItem value="Command">


```sh
cat step-17-guard-on-produce.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/guard-on-produce" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-17-guard-on-produce.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin",
  "priority": 100,
  "config": {
    "acks": {
      "value": [
        -1
      ],
      "action": "BLOCK"
    },
    "compressions": {
      "value": [
        "NONE",
        "GZIP"
      ],
      "action": "BLOCK"
    }
  }
}
{
  "message": "guard-on-produce is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/z2YzhE3qWyiFf3xfQiiD0H7Ul.svg)](https://asciinema.org/a/z2YzhE3qWyiFf3xfQiiD0H7Ul)

</TabItem>
</Tabs>

## Produce sample data to our cars topic without the right policies

Produce 1 record ... that do not match our policy

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "type" : "Fiat",
  "color" : "red",
  "price" : -1
}
```
with


```sh
echo '{"type":"Fiat","color":"red","price":-1}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --request-required-acks 1 \
        --compression-codec snappy \
        --topic cars
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> org.apache.kafka.common.errors.PolicyViolationException:
>> Request parameters do not satisfy the configured policy.
>>Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1.
>>Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]
> ```




</TabItem>
<TabItem value="Output">

```
[2024-01-31 09:00:54,055] ERROR Error when sending message to topic cars with key: null, value: 40 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1. Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/omu8WzN8yQ4vvEtoPBSgPdAfF.svg)](https://asciinema.org/a/omu8WzN8yQ4vvEtoPBSgPdAfF)

</TabItem>
</Tabs>

## Produce sample data to our cars topic that complies with our policy

Producing a record matching our policy

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "type" : "Fiat",
  "color" : "red",
  "price" : -1
}
```
with


```sh
echo '{"type":"Fiat","color":"red","price":-1}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --request-required-acks -1 \
        --compression-codec gzip \
        --topic cars
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/CdlaHsBuKEBn2Bk9NLUEvUItU.svg)](https://asciinema.org/a/CdlaHsBuKEBn2Bk9NLUEvUItU)

</TabItem>
</Tabs>

## Adding interceptor produce-rate

Let's add some rate limiting policy on produce

<Tabs>
<TabItem value="Command">


```sh
cat step-20-produce-rate.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/produce-rate" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-20-produce-rate.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin",
  "priority": 100,
  "config": {
    "maximumBytesPerSecond": 1
  }
}
{
  "message": "produce-rate is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/nFzHJtYCrf806lilpPIzYgz2Y.svg)](https://asciinema.org/a/nFzHJtYCrf806lilpPIzYgz2Y)

</TabItem>
</Tabs>

## Produce sample data

Do not match our produce rate policy

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "type" : "Fiat",
  "color" : "red",
  "price" : -1
}
```
with


```sh
echo '{"type":"Fiat","color":"red","price":-1}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --request-required-acks -1 \
        --compression-codec none \
        --topic cars
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/W7TIeUCc1YvDOh4LcYZ2ljJzZ.svg)](https://asciinema.org/a/W7TIeUCc1YvDOh4LcYZ2ljJzZ)

</TabItem>
</Tabs>

## Check in the audit log that produce was throttled

Check in the audit log that produce was throttled in cluster `kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --topic _auditLogs \
    --from-beginning \
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin")'
```


returns 1 event
```json
{
  "id" : "717ec26b-2aa3-4d1d-9c14-da6faa4420bd",
  "source" : "krn://cluster=PXf14wbFTTuF5IyZwRUrGA",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:62968"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T07:45:39.668615845Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin",
    "message" : "Client produced (108) bytes, which is more than 1 bytes per second, producer will be throttled by 932 milliseconds"
  }
}
```


</TabItem>
<TabItem value="Output">

```
{"id":"176da68b-89f1-41ae-8687-2ba18e18994f","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35888"},"specVersion":"0.1.0","time":"2024-01-31T08:00:33.274440554Z","eventData":{"method":"POST","path":"/admin/vclusters/v1/vcluster/teamA/username/sa","body":"{\"lifeTimeSeconds\": 7776000}"}}
{"id":"2b45a2bf-39d8-4094-bf4e-fc17fc649cff","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20750"},"specVersion":"0.1.0","time":"2024-01-31T08:00:34.837310347Z","eventData":"SUCCESS"}
{"id":"7487baf8-f74d-412f-8e62-7565a1bddffc","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16579"},"specVersion":"0.1.0","time":"2024-01-31T08:00:34.944556888Z","eventData":"SUCCESS"}
{"id":"eaeb66df-75cd-49c0-a3c1-391f1920d637","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20752"},"specVersion":"0.1.0","time":"2024-01-31T08:00:36.692880041Z","eventData":"SUCCESS"}
{"id":"e521bcf4-7e71-4bb9-8d0c-219a8a32f3ac","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23926"},"specVersion":"0.1.0","time":"2024-01-31T08:00:36.746094250Z","eventData":"SUCCESS"}
{"id":"73f8dc7b-a319-4a6e-9532-3d40ff609b97","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20765"},"specVersion":"0.1.0","time":"2024-01-31T08:00:39.176545459Z","eventData":"SUCCESS"}
{"id":"1d70481c-8d60-4fc5-9bab-2e4093e4d91d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23939"},"specVersion":"0.1.0","time":"2024-01-31T08:00:39.274028334Z","eventData":"SUCCESS"}
{"id":"150e4443-49ae-4c2c-9601-6df770cd46b0","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20767"},"specVersion":"0.1.0","time":"2024-01-31T08:00:40.896439127Z","eventData":"SUCCESS"}
{"id":"597dd4c1-59e5-4f9c-b925-5dc776819a15","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23941"},"specVersion":"0.1.0","time":"2024-01-31T08:00:40.954266794Z","eventData":"SUCCESS"}
{"id":"9aa6be13-d226-4414-b2bf-5fc9555ea09e","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20769"},"specVersion":"0.1.0","time":"2024-01-31T08:00:42.421208503Z","eventData":"SUCCESS"}
{"id":"1b67fa74-37a2-4ab6-b918-09567e129068","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16598"},"specVersion":"0.1.0","time":"2024-01-31T08:00:42.485314253Z","eventData":"SUCCESS"}
{"id":"30e677dc-6aa2-484b-8052-658828f2784f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23944"},"specVersion":"0.1.0","time":"2024-01-31T08:00:42.698533461Z","eventData":"SUCCESS"}
{"id":"3e2f119d-70ca-48f2-a6b1-8e7e480179e6","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20772"},"specVersion":"0.1.0","time":"2024-01-31T08:00:44.931696254Z","eventData":"SUCCESS"}
{"id":"2c64b169-60e4-4456-9e0d-118bce3fb68b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23946"},"specVersion":"0.1.0","time":"2024-01-31T08:00:44.970148879Z","eventData":"SUCCESS"}
{"id":"eb3b3ce0-f479-401c-9c90-2b7615a9f810","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20774"},"specVersion":"0.1.0","time":"2024-01-31T08:00:45.019749670Z","eventData":"SUCCESS"}
{"id":"2de76b20-e5c8-4904-a8de-b1eed8c065ef","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16603"},"specVersion":"0.1.0","time":"2024-01-31T08:00:45.059975545Z","eventData":"SUCCESS"}
{"id":"1e37d608-c46d-461e-949f-a8a69dac7a3e","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35915"},"specVersion":"0.1.0","time":"2024-01-31T08:00:45.580428129Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-on-create-topic","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"replicationFactor\" : {      \"min\" : 2,      \"max\" : 2    },    \"numPartition\" : {      \"min\" : 1,      \"max\" : 3    }  }}"}}
{"id":"4ed42001-8dbd-45e0-b519-f17780134a46","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35916"},"specVersion":"0.1.0","time":"2024-01-31T08:00:46.106833338Z","eventData":{"method":"GET","path":"/admin/interceptors/v1/vcluster/teamA","body":null}}
{"id":"73a7dbc8-e166-4be8-8161-9ecc07f81e7f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20778"},"specVersion":"0.1.0","time":"2024-01-31T08:00:47.222587172Z","eventData":"SUCCESS"}
{"id":"1b36faa2-baec-4c3c-b719-eb6fe32710b4","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16607"},"specVersion":"0.1.0","time":"2024-01-31T08:00:47.258035797Z","eventData":"SUCCESS"}
{"id":"7fae320e-23a3-4fd3-a2e8-67b08190feea","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:16607"},"specVersion":"0.1.0","time":"2024-01-31T08:00:47.282549672Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'roads' with number partitions is '100', must not be greater than 3. Topic 'roads' with replication factor is '1', must not be less than 2"}}
{"id":"892fbe18-ef7a-4c74-90cc-f4f82bfc5661","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20791"},"specVersion":"0.1.0","time":"2024-01-31T08:00:48.712786297Z","eventData":"SUCCESS"}
{"id":"eeb74d6d-700c-495a-a32b-0d6dc558418a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16620"},"specVersion":"0.1.0","time":"2024-01-31T08:00:48.745490631Z","eventData":"SUCCESS"}
{"id":"63fbc9b1-acbf-4931-9b6f-3b353ea8b661","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35932"},"specVersion":"0.1.0","time":"2024-01-31T08:00:49.344152798Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-on-alter-topic","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"retentionMs\" : {      \"min\" : 86400000,      \"max\" : 432000000    }  }}"}}
{"id":"17074172-b1ae-416e-ac51-0abd609fcdea","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20794"},"specVersion":"0.1.0","time":"2024-01-31T08:00:50.493563965Z","eventData":"SUCCESS"}
{"id":"f63da10b-876f-4657-be5e-240094ee402f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23968"},"specVersion":"0.1.0","time":"2024-01-31T08:00:50.526643340Z","eventData":"SUCCESS"}
{"id":"a319d24a-5d70-4de5-9c8f-1b27f60a6035","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:23968"},"specVersion":"0.1.0","time":"2024-01-31T08:00:50.570684298Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Resource 'roads' with retention.ms is '5184000000', must not be greater than '432000000'"}}
{"id":"a0f263db-1749-4957-ac8a-41ae5cae4e9b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20796"},"specVersion":"0.1.0","time":"2024-01-31T08:00:52.109115507Z","eventData":"SUCCESS"}
{"id":"43fb7385-5328-4758-b98f-9bdb12b3922f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20797"},"specVersion":"0.1.0","time":"2024-01-31T08:00:52.151241382Z","eventData":"SUCCESS"}
{"id":"12fdb50d-092c-40a9-89b2-d53ade2c0e2f","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35937"},"specVersion":"0.1.0","time":"2024-01-31T08:00:52.685032966Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-on-produce","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"acks\" : {      \"value\" : [ -1 ],      \"action\" : \"BLOCK\"    },    \"compressions\" : {      \"value\" : [ \"NONE\", \"GZIP\" ],      \"action\" : \"BLOCK\"    }  }}"}}
{"id":"b8867efd-7d80-489a-ba26-3037fbd51e6b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20799"},"specVersion":"0.1.0","time":"2024-01-31T08:00:53.790920091Z","eventData":"SUCCESS"}
{"id":"10b63bc4-9158-48bf-93ea-519676c2489d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23973"},"specVersion":"0.1.0","time":"2024-01-31T08:00:53.969879008Z","eventData":"SUCCESS"}
{"id":"eac3c988-e39a-4ee0-aed5-41645dddd4d1","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:23973"},"specVersion":"0.1.0","time":"2024-01-31T08:00:54.048663758Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1. Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]"}}
{"id":"553a9867-4a85-4bbc-87ce-b61466497ca3","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20801"},"specVersion":"0.1.0","time":"2024-01-31T08:00:55.534008467Z","eventData":"SUCCESS"}
{"id":"e261f1dc-e3e4-4faf-88cc-a0f3d2e0767c","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23975"},"specVersion":"0.1.0","time":"2024-01-31T08:00:55.590998801Z","eventData":"SUCCESS"}
{"id":"87a07bea-2bf6-4696-82e4-eba6c9f8027c","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35942"},"specVersion":"0.1.0","time":"2024-01-31T08:00:56.077212592Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/produce-rate","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"maximumBytesPerSecond\" : 1  }}"}}
{"id":"161a0119-2800-483c-8670-bafa44914aee","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20804"},"specVersion":"0.1.0","time":"2024-01-31T08:00:57.154284718Z","eventData":"SUCCESS"}
{"id":"b7805c52-fb1e-4463-8031-4c8340112589","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23978"},"specVersion":"0.1.0","time":"2024-01-31T08:00:57.197246051Z","eventData":"SUCCESS"}
[2024-01-31 09:01:01,688] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 38 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/3bErwA3EiyDBqrdLOKJViiV32.svg)](https://asciinema.org/a/3bErwA3EiyDBqrdLOKJViiV32)

</TabItem>
</Tabs>

## Remove interceptor produce-rate



<Tabs>
<TabItem value="Command">


```sh
curl \
    --request DELETE "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/produce-rate" \
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

[![asciicast](https://asciinema.org/a/G7TGtnhEygvcrDE7otEp4NTO4.svg)](https://asciinema.org/a/G7TGtnhEygvcrDE7otEp4NTO4)

</TabItem>
</Tabs>

## Adding interceptor consumer-group-name-policy

Let's add some naming conventions on consumer group names

<Tabs>
<TabItem value="Command">


```sh
cat step-24-consumer-group-name-policy.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/consumer-group-name-policy" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-24-consumer-group-name-policy.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin",
  "priority": 100,
  "config": {
    "groupId": {
      "value": "my-group.*",
      "action": "BLOCK"
    }
  }
}
{
  "message": "consumer-group-name-policy is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/xpIcCk2PCD9IhVEqYPa3mMl3w.svg)](https://asciinema.org/a/xpIcCk2PCD9IhVEqYPa3mMl3w)

</TabItem>
</Tabs>

## Consuming from cars

Consuming from cars in cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic cars \
    --from-beginning \
    --timeout-ms 10000 \
    --group group-not-within-policy | jq
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> Unexpected error in join group response: Request parameters do not satisfy the configured policy.
> ```




</TabItem>
<TabItem value="Output">

```json
[2024-01-31 09:01:03,375] ERROR [Consumer clientId=console-consumer, groupId=group-not-within-policy] JoinGroup failed due to unexpected error: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
[2024-01-31 09:01:03,375] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.KafkaException: Unexpected error in join group response: Request parameters do not satisfy the configured policy.
	at org.apache.kafka.clients.consumer.internals.AbstractCoordinator$JoinGroupResponseHandler.handle(AbstractCoordinator.java:711)
	at org.apache.kafka.clients.consumer.internals.AbstractCoordinator$JoinGroupResponseHandler.handle(AbstractCoordinator.java:603)
	at org.apache.kafka.clients.consumer.internals.AbstractCoordinator$CoordinatorResponseHandler.onSuccess(AbstractCoordinator.java:1270)
	at org.apache.kafka.clients.consumer.internals.AbstractCoordinator$CoordinatorResponseHandler.onSuccess(AbstractCoordinator.java:1245)
	at org.apache.kafka.clients.consumer.internals.RequestFuture$1.onSuccess(RequestFuture.java:206)
	at org.apache.kafka.clients.consumer.internals.RequestFuture.fireSuccess(RequestFuture.java:169)
	at org.apache.kafka.clients.consumer.internals.RequestFuture.complete(RequestFuture.java:129)
	at org.apache.kafka.clients.consumer.internals.ConsumerNetworkClient$RequestFutureCompletionHandler.fireCompletion(ConsumerNetworkClient.java:617)
	at org.apache.kafka.clients.consumer.internals.ConsumerNetworkClient.firePendingCompletedRequests(ConsumerNetworkClient.java:427)
	at org.apache.kafka.clients.consumer.internals.ConsumerNetworkClient.poll(ConsumerNetworkClient.java:312)
	at org.apache.kafka.clients.consumer.internals.ConsumerNetworkClient.poll(ConsumerNetworkClient.java:251)
	at org.apache.kafka.clients.consumer.KafkaConsumer.pollForFetches(KafkaConsumer.java:1255)
	at org.apache.kafka.clients.consumer.KafkaConsumer.poll(KafkaConsumer.java:1186)
	at org.apache.kafka.clients.consumer.KafkaConsumer.poll(KafkaConsumer.java:1159)
	at kafka.tools.ConsoleConsumer$ConsumerWrapper.receive(ConsoleConsumer.scala:473)
	at kafka.tools.ConsoleConsumer$.process(ConsoleConsumer.scala:103)
	at kafka.tools.ConsoleConsumer$.run(ConsoleConsumer.scala:77)
	at kafka.tools.ConsoleConsumer$.main(ConsoleConsumer.scala:54)
	at kafka.tools.ConsoleConsumer.main(ConsoleConsumer.scala)
Processed a total of 0 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/6hBT6qt5fbNSkU2mxSbvmx96p.svg)](https://asciinema.org/a/6hBT6qt5fbNSkU2mxSbvmx96p)

</TabItem>
</Tabs>

## Check in the audit log that fetch was denied

Check in the audit log that fetch was denied in cluster `kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --topic _auditLogs \
    --from-beginning \
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin")'
```


returns 1 event
```json
{
  "id" : "966e62a7-e3f2-43ed-ac6b-9f3596eec21d",
  "source" : "krn://cluster=PXf14wbFTTuF5IyZwRUrGA",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:20784"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T07:45:42.926629180Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. GroupId 'group-not-within-policy' is invalid, naming convention must match with regular expression my-group.*"
  }
}
```


</TabItem>
<TabItem value="Output">

```
{"id":"176da68b-89f1-41ae-8687-2ba18e18994f","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35888"},"specVersion":"0.1.0","time":"2024-01-31T08:00:33.274440554Z","eventData":{"method":"POST","path":"/admin/vclusters/v1/vcluster/teamA/username/sa","body":"{\"lifeTimeSeconds\": 7776000}"}}
{"id":"2b45a2bf-39d8-4094-bf4e-fc17fc649cff","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20750"},"specVersion":"0.1.0","time":"2024-01-31T08:00:34.837310347Z","eventData":"SUCCESS"}
{"id":"7487baf8-f74d-412f-8e62-7565a1bddffc","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16579"},"specVersion":"0.1.0","time":"2024-01-31T08:00:34.944556888Z","eventData":"SUCCESS"}
{"id":"eaeb66df-75cd-49c0-a3c1-391f1920d637","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20752"},"specVersion":"0.1.0","time":"2024-01-31T08:00:36.692880041Z","eventData":"SUCCESS"}
{"id":"e521bcf4-7e71-4bb9-8d0c-219a8a32f3ac","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23926"},"specVersion":"0.1.0","time":"2024-01-31T08:00:36.746094250Z","eventData":"SUCCESS"}
{"id":"73f8dc7b-a319-4a6e-9532-3d40ff609b97","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20765"},"specVersion":"0.1.0","time":"2024-01-31T08:00:39.176545459Z","eventData":"SUCCESS"}
{"id":"1d70481c-8d60-4fc5-9bab-2e4093e4d91d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23939"},"specVersion":"0.1.0","time":"2024-01-31T08:00:39.274028334Z","eventData":"SUCCESS"}
{"id":"150e4443-49ae-4c2c-9601-6df770cd46b0","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20767"},"specVersion":"0.1.0","time":"2024-01-31T08:00:40.896439127Z","eventData":"SUCCESS"}
{"id":"597dd4c1-59e5-4f9c-b925-5dc776819a15","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23941"},"specVersion":"0.1.0","time":"2024-01-31T08:00:40.954266794Z","eventData":"SUCCESS"}
{"id":"9aa6be13-d226-4414-b2bf-5fc9555ea09e","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20769"},"specVersion":"0.1.0","time":"2024-01-31T08:00:42.421208503Z","eventData":"SUCCESS"}
{"id":"1b67fa74-37a2-4ab6-b918-09567e129068","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16598"},"specVersion":"0.1.0","time":"2024-01-31T08:00:42.485314253Z","eventData":"SUCCESS"}
{"id":"30e677dc-6aa2-484b-8052-658828f2784f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23944"},"specVersion":"0.1.0","time":"2024-01-31T08:00:42.698533461Z","eventData":"SUCCESS"}
{"id":"3e2f119d-70ca-48f2-a6b1-8e7e480179e6","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20772"},"specVersion":"0.1.0","time":"2024-01-31T08:00:44.931696254Z","eventData":"SUCCESS"}
{"id":"2c64b169-60e4-4456-9e0d-118bce3fb68b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23946"},"specVersion":"0.1.0","time":"2024-01-31T08:00:44.970148879Z","eventData":"SUCCESS"}
{"id":"eb3b3ce0-f479-401c-9c90-2b7615a9f810","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20774"},"specVersion":"0.1.0","time":"2024-01-31T08:00:45.019749670Z","eventData":"SUCCESS"}
{"id":"2de76b20-e5c8-4904-a8de-b1eed8c065ef","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16603"},"specVersion":"0.1.0","time":"2024-01-31T08:00:45.059975545Z","eventData":"SUCCESS"}
{"id":"1e37d608-c46d-461e-949f-a8a69dac7a3e","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35915"},"specVersion":"0.1.0","time":"2024-01-31T08:00:45.580428129Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-on-create-topic","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"replicationFactor\" : {      \"min\" : 2,      \"max\" : 2    },    \"numPartition\" : {      \"min\" : 1,      \"max\" : 3    }  }}"}}
{"id":"4ed42001-8dbd-45e0-b519-f17780134a46","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35916"},"specVersion":"0.1.0","time":"2024-01-31T08:00:46.106833338Z","eventData":{"method":"GET","path":"/admin/interceptors/v1/vcluster/teamA","body":null}}
{"id":"73a7dbc8-e166-4be8-8161-9ecc07f81e7f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20778"},"specVersion":"0.1.0","time":"2024-01-31T08:00:47.222587172Z","eventData":"SUCCESS"}
{"id":"1b36faa2-baec-4c3c-b719-eb6fe32710b4","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16607"},"specVersion":"0.1.0","time":"2024-01-31T08:00:47.258035797Z","eventData":"SUCCESS"}
{"id":"7fae320e-23a3-4fd3-a2e8-67b08190feea","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:16607"},"specVersion":"0.1.0","time":"2024-01-31T08:00:47.282549672Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'roads' with number partitions is '100', must not be greater than 3. Topic 'roads' with replication factor is '1', must not be less than 2"}}
{"id":"892fbe18-ef7a-4c74-90cc-f4f82bfc5661","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20791"},"specVersion":"0.1.0","time":"2024-01-31T08:00:48.712786297Z","eventData":"SUCCESS"}
{"id":"eeb74d6d-700c-495a-a32b-0d6dc558418a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16620"},"specVersion":"0.1.0","time":"2024-01-31T08:00:48.745490631Z","eventData":"SUCCESS"}
{"id":"63fbc9b1-acbf-4931-9b6f-3b353ea8b661","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35932"},"specVersion":"0.1.0","time":"2024-01-31T08:00:49.344152798Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-on-alter-topic","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"retentionMs\" : {      \"min\" : 86400000,      \"max\" : 432000000    }  }}"}}
{"id":"17074172-b1ae-416e-ac51-0abd609fcdea","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20794"},"specVersion":"0.1.0","time":"2024-01-31T08:00:50.493563965Z","eventData":"SUCCESS"}
{"id":"f63da10b-876f-4657-be5e-240094ee402f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23968"},"specVersion":"0.1.0","time":"2024-01-31T08:00:50.526643340Z","eventData":"SUCCESS"}
{"id":"a319d24a-5d70-4de5-9c8f-1b27f60a6035","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:23968"},"specVersion":"0.1.0","time":"2024-01-31T08:00:50.570684298Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Resource 'roads' with retention.ms is '5184000000', must not be greater than '432000000'"}}
{"id":"a0f263db-1749-4957-ac8a-41ae5cae4e9b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20796"},"specVersion":"0.1.0","time":"2024-01-31T08:00:52.109115507Z","eventData":"SUCCESS"}
{"id":"43fb7385-5328-4758-b98f-9bdb12b3922f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20797"},"specVersion":"0.1.0","time":"2024-01-31T08:00:52.151241382Z","eventData":"SUCCESS"}
{"id":"12fdb50d-092c-40a9-89b2-d53ade2c0e2f","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35937"},"specVersion":"0.1.0","time":"2024-01-31T08:00:52.685032966Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-on-produce","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"acks\" : {      \"value\" : [ -1 ],      \"action\" : \"BLOCK\"    },    \"compressions\" : {      \"value\" : [ \"NONE\", \"GZIP\" ],      \"action\" : \"BLOCK\"    }  }}"}}
{"id":"b8867efd-7d80-489a-ba26-3037fbd51e6b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20799"},"specVersion":"0.1.0","time":"2024-01-31T08:00:53.790920091Z","eventData":"SUCCESS"}
{"id":"10b63bc4-9158-48bf-93ea-519676c2489d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23973"},"specVersion":"0.1.0","time":"2024-01-31T08:00:53.969879008Z","eventData":"SUCCESS"}
{"id":"eac3c988-e39a-4ee0-aed5-41645dddd4d1","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:23973"},"specVersion":"0.1.0","time":"2024-01-31T08:00:54.048663758Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1. Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]"}}
{"id":"553a9867-4a85-4bbc-87ce-b61466497ca3","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20801"},"specVersion":"0.1.0","time":"2024-01-31T08:00:55.534008467Z","eventData":"SUCCESS"}
{"id":"e261f1dc-e3e4-4faf-88cc-a0f3d2e0767c","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23975"},"specVersion":"0.1.0","time":"2024-01-31T08:00:55.590998801Z","eventData":"SUCCESS"}
{"id":"87a07bea-2bf6-4696-82e4-eba6c9f8027c","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35942"},"specVersion":"0.1.0","time":"2024-01-31T08:00:56.077212592Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/produce-rate","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"maximumBytesPerSecond\" : 1  }}"}}
{"id":"161a0119-2800-483c-8670-bafa44914aee","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20804"},"specVersion":"0.1.0","time":"2024-01-31T08:00:57.154284718Z","eventData":"SUCCESS"}
{"id":"b7805c52-fb1e-4463-8031-4c8340112589","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23978"},"specVersion":"0.1.0","time":"2024-01-31T08:00:57.197246051Z","eventData":"SUCCESS"}
{"id":"30350404-dea6-4eaf-862f-72cfcc73baab","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35959"},"specVersion":"0.1.0","time":"2024-01-31T08:01:02.177368262Z","eventData":{"method":"DELETE","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/produce-rate","body":null}}
{"id":"c1c5da16-69a8-4075-88c8-b26a976553d9","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35960"},"specVersion":"0.1.0","time":"2024-01-31T08:01:02.249701512Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/consumer-group-name-policy","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"groupId\" : {      \"value\" : \"my-group.*\",      \"action\" : \"BLOCK\"    }  }}"}}
{"id":"d95d3c87-46d8-4be6-9aaa-97dd5a7fef29","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20822"},"specVersion":"0.1.0","time":"2024-01-31T08:01:03.322153721Z","eventData":"SUCCESS"}
{"id":"7f980139-f936-4cc3-82f7-5d6318b6bc44","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16651"},"specVersion":"0.1.0","time":"2024-01-31T08:01:03.361162096Z","eventData":"SUCCESS"}
{"id":"86ae1402-cc15-4710-83fd-a58b61077083","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:16651"},"specVersion":"0.1.0","time":"2024-01-31T08:01:03.370344054Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin","message":"Request parameters do not satisfy the configured policy. GroupId 'group-not-within-policy' is invalid, naming convention must match with regular expression my-group.*"}}
[2024-01-31 09:01:07,904] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 43 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/urUWsoYRJ18W81oZ5CLVgWt8z.svg)](https://asciinema.org/a/urUWsoYRJ18W81oZ5CLVgWt8z)

</TabItem>
</Tabs>

## Consuming from cars

Consuming from cars in cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic cars \
    --from-beginning \
    --timeout-ms 10000 \
    --group my-group-within-policy | jq
```


</TabItem>
<TabItem value="Output">

```json
[2024-01-31 09:01:19,677] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 5 messages
{
  "type": "Ferrari",
  "color": "red",
  "price": 10000
}
{
  "type": "RollsRoyce",
  "color": "black",
  "price": 9000
}
{
  "type": "Mercedes",
  "color": "black",
  "price": 6000
}
{
  "type": "Fiat",
  "color": "red",
  "price": -1
}
{
  "type": "Fiat",
  "color": "red",
  "price": -1
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/dfQIyS1sC4QLdKBbR7AnLiCpV.svg)](https://asciinema.org/a/dfQIyS1sC4QLdKBbR7AnLiCpV)

</TabItem>
</Tabs>

## Remove interceptor consumer-group-name-policy



<Tabs>
<TabItem value="Command">


```sh
curl \
    --request DELETE "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/consumer-group-name-policy" \
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

[![asciicast](https://asciinema.org/a/pCqtckwGc5GI6xkB8YVrJBHfe.svg)](https://asciinema.org/a/pCqtckwGc5GI6xkB8YVrJBHfe)

</TabItem>
</Tabs>

## Adding interceptor guard-limit-connection

Let's add some connect limitation policy

<Tabs>
<TabItem value="Command">


```sh
cat step-29-guard-limit-connection.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/guard-limit-connection" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-29-guard-limit-connection.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
  "priority": 100,
  "config": {
    "maximumConnectionsPerSecond": 1,
    "action": "BLOCK"
  }
}
{
  "message": "guard-limit-connection is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/0ZzR0PaDTPedwiduaPiQVsQbO.svg)](https://asciinema.org/a/0ZzR0PaDTPedwiduaPiQVsQbO)

</TabItem>
</Tabs>

## Consuming from cars

Consuming from cars in cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic cars \
    --from-beginning \
    --timeout-ms 10000 \
    --group my-group-id-convention-cars | jq
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> Request parameters do not satisfy the configured policy.
> ```




</TabItem>
<TabItem value="Output">

```json
[2024-01-31 09:01:21,884] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Received error POLICY_VIOLATION from node 2147483644 when making an ApiVersionsRequest with correlation id 4. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:01:21,990] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Received error POLICY_VIOLATION from node 3 when making an ApiVersionsRequest with correlation id 6. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:01:23,064] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Received error POLICY_VIOLATION from node 2 when making an ApiVersionsRequest with correlation id 7. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:01:23,459] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Received error POLICY_VIOLATION from node 2147483644 when making an ApiVersionsRequest with correlation id 12. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:01:24,607] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Received error POLICY_VIOLATION from node 3 when making an ApiVersionsRequest with correlation id 22. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:01:25,283] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Received error POLICY_VIOLATION from node 3 when making an ApiVersionsRequest with correlation id 25. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:01:28,771] ERROR [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Offset commit failed on partition cars-0 at offset 5: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
[2024-01-31 09:01:28,774] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Asynchronous auto-commit of offsets {cars-0=OffsetAndMetadata{offset=5, leaderEpoch=0, metadata=''}} failed: Unexpected error in commit: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
[2024-01-31 09:01:35,639] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 5 messages
{
  "type": "Ferrari",
  "color": "red",
  "price": 10000
}
{
  "type": "RollsRoyce",
  "color": "black",
  "price": 9000
}
{
  "type": "Mercedes",
  "color": "black",
  "price": 6000
}
{
  "type": "Fiat",
  "color": "red",
  "price": -1
}
{
  "type": "Fiat",
  "color": "red",
  "price": -1
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/dzQakQVvH1R3JgBSfYeyYSjiE.svg)](https://asciinema.org/a/dzQakQVvH1R3JgBSfYeyYSjiE)

</TabItem>
</Tabs>

## Check in the audit log that connection was denied

Check in the audit log that connection was denied in cluster `kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --topic _auditLogs \
    --from-beginning \
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin")'
```


returns 10 events
```json
{
  "id" : "83bacc7d-34ec-481a-a3fb-cd7c512c3124",
  "source" : "krn://cluster=PXf14wbFTTuF5IyZwRUrGA",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:17581"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T07:45:56.633085005Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id" : "eaa48981-c40a-4d7b-b0d8-8823b9ab2069",
  "source" : "krn://cluster=PXf14wbFTTuF5IyZwRUrGA",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:17632"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T07:45:56.997615214Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id" : "d591bcb0-9729-4ff0-8513-3c779207f621",
  "source" : "krn://cluster=PXf14wbFTTuF5IyZwRUrGA",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:17581"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T07:45:57.302539756Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id" : "4ad8cbf8-9853-4cbf-a91e-67d25eebf25f",
  "source" : "krn://cluster=PXf14wbFTTuF5IyZwRUrGA",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:17633"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T07:45:58.079239214Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id" : "afbb6c26-0a3e-4b9c-8a26-cb4cae89413a",
  "source" : "krn://cluster=PXf14wbFTTuF5IyZwRUrGA",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:62980"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T07:45:58.478183923Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id" : "42f635c4-6b4c-4bfc-9068-1d4447f0e2f2",
  "source" : "krn://cluster=PXf14wbFTTuF5IyZwRUrGA",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:20807"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T07:45:59.000809882Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id" : "e10d3cd8-4c26-4fbe-a2f9-80310e65d227",
  "source" : "krn://cluster=PXf14wbFTTuF5IyZwRUrGA",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:63010"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T07:45:59.980525007Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id" : "0464fd9a-f30e-441c-a2d5-6e5c997bd05b",
  "source" : "krn://cluster=PXf14wbFTTuF5IyZwRUrGA",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:17648"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T07:46:00.470917341Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id" : "3a3ce222-4310-44ba-87f4-aa8be9628cf5",
  "source" : "krn://cluster=PXf14wbFTTuF5IyZwRUrGA",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:17649"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T07:46:01.039200133Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id" : "bd25882f-78cd-4ce7-abcc-ff66c5223b12",
  "source" : "krn://cluster=PXf14wbFTTuF5IyZwRUrGA",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:17647"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T07:46:02.200788050Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Client connections exceed the limitation of 1 connections per second"
  }
}
```


</TabItem>
<TabItem value="Output">

```
{"id":"176da68b-89f1-41ae-8687-2ba18e18994f","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35888"},"specVersion":"0.1.0","time":"2024-01-31T08:00:33.274440554Z","eventData":{"method":"POST","path":"/admin/vclusters/v1/vcluster/teamA/username/sa","body":"{\"lifeTimeSeconds\": 7776000}"}}
{"id":"2b45a2bf-39d8-4094-bf4e-fc17fc649cff","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20750"},"specVersion":"0.1.0","time":"2024-01-31T08:00:34.837310347Z","eventData":"SUCCESS"}
{"id":"7487baf8-f74d-412f-8e62-7565a1bddffc","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16579"},"specVersion":"0.1.0","time":"2024-01-31T08:00:34.944556888Z","eventData":"SUCCESS"}
{"id":"eaeb66df-75cd-49c0-a3c1-391f1920d637","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20752"},"specVersion":"0.1.0","time":"2024-01-31T08:00:36.692880041Z","eventData":"SUCCESS"}
{"id":"e521bcf4-7e71-4bb9-8d0c-219a8a32f3ac","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23926"},"specVersion":"0.1.0","time":"2024-01-31T08:00:36.746094250Z","eventData":"SUCCESS"}
{"id":"73f8dc7b-a319-4a6e-9532-3d40ff609b97","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20765"},"specVersion":"0.1.0","time":"2024-01-31T08:00:39.176545459Z","eventData":"SUCCESS"}
{"id":"1d70481c-8d60-4fc5-9bab-2e4093e4d91d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23939"},"specVersion":"0.1.0","time":"2024-01-31T08:00:39.274028334Z","eventData":"SUCCESS"}
{"id":"150e4443-49ae-4c2c-9601-6df770cd46b0","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20767"},"specVersion":"0.1.0","time":"2024-01-31T08:00:40.896439127Z","eventData":"SUCCESS"}
{"id":"597dd4c1-59e5-4f9c-b925-5dc776819a15","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23941"},"specVersion":"0.1.0","time":"2024-01-31T08:00:40.954266794Z","eventData":"SUCCESS"}
{"id":"9aa6be13-d226-4414-b2bf-5fc9555ea09e","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20769"},"specVersion":"0.1.0","time":"2024-01-31T08:00:42.421208503Z","eventData":"SUCCESS"}
{"id":"1b67fa74-37a2-4ab6-b918-09567e129068","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16598"},"specVersion":"0.1.0","time":"2024-01-31T08:00:42.485314253Z","eventData":"SUCCESS"}
{"id":"30e677dc-6aa2-484b-8052-658828f2784f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23944"},"specVersion":"0.1.0","time":"2024-01-31T08:00:42.698533461Z","eventData":"SUCCESS"}
{"id":"3e2f119d-70ca-48f2-a6b1-8e7e480179e6","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20772"},"specVersion":"0.1.0","time":"2024-01-31T08:00:44.931696254Z","eventData":"SUCCESS"}
{"id":"2c64b169-60e4-4456-9e0d-118bce3fb68b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23946"},"specVersion":"0.1.0","time":"2024-01-31T08:00:44.970148879Z","eventData":"SUCCESS"}
{"id":"eb3b3ce0-f479-401c-9c90-2b7615a9f810","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20774"},"specVersion":"0.1.0","time":"2024-01-31T08:00:45.019749670Z","eventData":"SUCCESS"}
{"id":"2de76b20-e5c8-4904-a8de-b1eed8c065ef","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16603"},"specVersion":"0.1.0","time":"2024-01-31T08:00:45.059975545Z","eventData":"SUCCESS"}
{"id":"1e37d608-c46d-461e-949f-a8a69dac7a3e","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35915"},"specVersion":"0.1.0","time":"2024-01-31T08:00:45.580428129Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-on-create-topic","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"replicationFactor\" : {      \"min\" : 2,      \"max\" : 2    },    \"numPartition\" : {      \"min\" : 1,      \"max\" : 3    }  }}"}}
{"id":"4ed42001-8dbd-45e0-b519-f17780134a46","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35916"},"specVersion":"0.1.0","time":"2024-01-31T08:00:46.106833338Z","eventData":{"method":"GET","path":"/admin/interceptors/v1/vcluster/teamA","body":null}}
{"id":"73a7dbc8-e166-4be8-8161-9ecc07f81e7f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20778"},"specVersion":"0.1.0","time":"2024-01-31T08:00:47.222587172Z","eventData":"SUCCESS"}
{"id":"1b36faa2-baec-4c3c-b719-eb6fe32710b4","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16607"},"specVersion":"0.1.0","time":"2024-01-31T08:00:47.258035797Z","eventData":"SUCCESS"}
{"id":"7fae320e-23a3-4fd3-a2e8-67b08190feea","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:16607"},"specVersion":"0.1.0","time":"2024-01-31T08:00:47.282549672Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'roads' with number partitions is '100', must not be greater than 3. Topic 'roads' with replication factor is '1', must not be less than 2"}}
{"id":"892fbe18-ef7a-4c74-90cc-f4f82bfc5661","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20791"},"specVersion":"0.1.0","time":"2024-01-31T08:00:48.712786297Z","eventData":"SUCCESS"}
{"id":"eeb74d6d-700c-495a-a32b-0d6dc558418a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16620"},"specVersion":"0.1.0","time":"2024-01-31T08:00:48.745490631Z","eventData":"SUCCESS"}
{"id":"63fbc9b1-acbf-4931-9b6f-3b353ea8b661","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35932"},"specVersion":"0.1.0","time":"2024-01-31T08:00:49.344152798Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-on-alter-topic","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"retentionMs\" : {      \"min\" : 86400000,      \"max\" : 432000000    }  }}"}}
{"id":"17074172-b1ae-416e-ac51-0abd609fcdea","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20794"},"specVersion":"0.1.0","time":"2024-01-31T08:00:50.493563965Z","eventData":"SUCCESS"}
{"id":"f63da10b-876f-4657-be5e-240094ee402f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23968"},"specVersion":"0.1.0","time":"2024-01-31T08:00:50.526643340Z","eventData":"SUCCESS"}
{"id":"a319d24a-5d70-4de5-9c8f-1b27f60a6035","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:23968"},"specVersion":"0.1.0","time":"2024-01-31T08:00:50.570684298Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Resource 'roads' with retention.ms is '5184000000', must not be greater than '432000000'"}}
{"id":"a0f263db-1749-4957-ac8a-41ae5cae4e9b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20796"},"specVersion":"0.1.0","time":"2024-01-31T08:00:52.109115507Z","eventData":"SUCCESS"}
{"id":"43fb7385-5328-4758-b98f-9bdb12b3922f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20797"},"specVersion":"0.1.0","time":"2024-01-31T08:00:52.151241382Z","eventData":"SUCCESS"}
{"id":"12fdb50d-092c-40a9-89b2-d53ade2c0e2f","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35937"},"specVersion":"0.1.0","time":"2024-01-31T08:00:52.685032966Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-on-produce","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"acks\" : {      \"value\" : [ -1 ],      \"action\" : \"BLOCK\"    },    \"compressions\" : {      \"value\" : [ \"NONE\", \"GZIP\" ],      \"action\" : \"BLOCK\"    }  }}"}}
{"id":"b8867efd-7d80-489a-ba26-3037fbd51e6b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20799"},"specVersion":"0.1.0","time":"2024-01-31T08:00:53.790920091Z","eventData":"SUCCESS"}
{"id":"10b63bc4-9158-48bf-93ea-519676c2489d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23973"},"specVersion":"0.1.0","time":"2024-01-31T08:00:53.969879008Z","eventData":"SUCCESS"}
{"id":"eac3c988-e39a-4ee0-aed5-41645dddd4d1","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:23973"},"specVersion":"0.1.0","time":"2024-01-31T08:00:54.048663758Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1. Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]"}}
{"id":"553a9867-4a85-4bbc-87ce-b61466497ca3","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20801"},"specVersion":"0.1.0","time":"2024-01-31T08:00:55.534008467Z","eventData":"SUCCESS"}
{"id":"e261f1dc-e3e4-4faf-88cc-a0f3d2e0767c","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23975"},"specVersion":"0.1.0","time":"2024-01-31T08:00:55.590998801Z","eventData":"SUCCESS"}
{"id":"87a07bea-2bf6-4696-82e4-eba6c9f8027c","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35942"},"specVersion":"0.1.0","time":"2024-01-31T08:00:56.077212592Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/produce-rate","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"maximumBytesPerSecond\" : 1  }}"}}
{"id":"161a0119-2800-483c-8670-bafa44914aee","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20804"},"specVersion":"0.1.0","time":"2024-01-31T08:00:57.154284718Z","eventData":"SUCCESS"}
{"id":"b7805c52-fb1e-4463-8031-4c8340112589","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23978"},"specVersion":"0.1.0","time":"2024-01-31T08:00:57.197246051Z","eventData":"SUCCESS"}
{"id":"30350404-dea6-4eaf-862f-72cfcc73baab","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35959"},"specVersion":"0.1.0","time":"2024-01-31T08:01:02.177368262Z","eventData":{"method":"DELETE","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/produce-rate","body":null}}
{"id":"c1c5da16-69a8-4075-88c8-b26a976553d9","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35960"},"specVersion":"0.1.0","time":"2024-01-31T08:01:02.249701512Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/consumer-group-name-policy","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"groupId\" : {      \"value\" : \"my-group.*\",      \"action\" : \"BLOCK\"    }  }}"}}
{"id":"d95d3c87-46d8-4be6-9aaa-97dd5a7fef29","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20822"},"specVersion":"0.1.0","time":"2024-01-31T08:01:03.322153721Z","eventData":"SUCCESS"}
{"id":"7f980139-f936-4cc3-82f7-5d6318b6bc44","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16651"},"specVersion":"0.1.0","time":"2024-01-31T08:01:03.361162096Z","eventData":"SUCCESS"}
{"id":"86ae1402-cc15-4710-83fd-a58b61077083","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:16651"},"specVersion":"0.1.0","time":"2024-01-31T08:01:03.370344054Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin","message":"Request parameters do not satisfy the configured policy. GroupId 'group-not-within-policy' is invalid, naming convention must match with regular expression my-group.*"}}
{"id":"e1835b75-08ee-4189-a525-65b6567d427a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20838"},"specVersion":"0.1.0","time":"2024-01-31T08:01:09.492525126Z","eventData":"SUCCESS"}
{"id":"de930824-9733-48a0-af93-c17f5afab30a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20839"},"specVersion":"0.1.0","time":"2024-01-31T08:01:09.545071335Z","eventData":"SUCCESS"}
{"id":"7f189e24-d665-4aa3-a60d-ae86c5a45fbb","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24013"},"specVersion":"0.1.0","time":"2024-01-31T08:01:09.631605126Z","eventData":"SUCCESS"}
{"id":"d85f4880-ac60-4b28-9884-eb46bec269d1","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35991"},"specVersion":"0.1.0","time":"2024-01-31T08:01:20.412376673Z","eventData":{"method":"DELETE","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/consumer-group-name-policy","body":null}}
{"id":"f1d04c3b-20cf-466d-8278-9e40223f2db0","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35992"},"specVersion":"0.1.0","time":"2024-01-31T08:01:20.469840256Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-limit-connection","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"maximumConnectionsPerSecond\" : 1,    \"action\" : \"BLOCK\"  }}"}}
{"id":"ba411fb1-27b9-40f5-bfed-9854dd2af56d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20854"},"specVersion":"0.1.0","time":"2024-01-31T08:01:21.628112840Z","eventData":"SUCCESS"}
{"id":"dcadcdaa-6b24-4645-b2ff-b3f554128fcb","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24028"},"specVersion":"0.1.0","time":"2024-01-31T08:01:21.668204715Z","eventData":"SUCCESS"}
{"id":"1c5726cc-cb51-4638-9747-655b77f092bb","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24028"},"specVersion":"0.1.0","time":"2024-01-31T08:01:21.870571090Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"90ea461b-cc1a-46d2-a303-6c6e5d24f6ef","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24029"},"specVersion":"0.1.0","time":"2024-01-31T08:01:21.906656340Z","eventData":"SUCCESS"}
{"id":"bb2dada1-1a26-4730-8f3c-e70bb28a1ca3","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24029"},"specVersion":"0.1.0","time":"2024-01-31T08:01:21.987336049Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"5c9a4ea5-a330-4e12-8fda-eac168ae81e0","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16685"},"specVersion":"0.1.0","time":"2024-01-31T08:01:22.110928757Z","eventData":"SUCCESS"}
{"id":"ab755ffe-62f4-43fb-a7c7-c92dfc142a8b","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:16685"},"specVersion":"0.1.0","time":"2024-01-31T08:01:23.045297758Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"fd340d34-6a7c-45bc-a0c0-d3338a3983ff","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20858"},"specVersion":"0.1.0","time":"2024-01-31T08:01:23.180372549Z","eventData":"SUCCESS"}
{"id":"c0fcf2b4-15f6-4871-967b-536d5a1e0083","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24032"},"specVersion":"0.1.0","time":"2024-01-31T08:01:23.213963716Z","eventData":"SUCCESS"}
{"id":"5f9e63d6-e4e1-4977-99a1-6968426521d8","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24032"},"specVersion":"0.1.0","time":"2024-01-31T08:01:23.456240758Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"286da964-c538-4fe3-af18-0d8a46180202","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24033"},"specVersion":"0.1.0","time":"2024-01-31T08:01:23.602807508Z","eventData":"SUCCESS"}
{"id":"79635d8a-be7e-452c-90ea-716753662c87","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24034"},"specVersion":"0.1.0","time":"2024-01-31T08:01:23.697933675Z","eventData":"SUCCESS"}
{"id":"9cff04ab-0645-4dfc-a2e1-a2f720e73bda","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24034"},"specVersion":"0.1.0","time":"2024-01-31T08:01:24.599899133Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"e10d26c9-cf64-4ed9-8cf4-fc29a13b109d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24035"},"specVersion":"0.1.0","time":"2024-01-31T08:01:24.742092883Z","eventData":"SUCCESS"}
{"id":"5dc7877f-ab6e-43c5-95e1-c4c7b8f25384","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24035"},"specVersion":"0.1.0","time":"2024-01-31T08:01:25.269079592Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"db3c5968-8f5f-42ad-8475-74738ca149e6","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24036"},"specVersion":"0.1.0","time":"2024-01-31T08:01:25.515870300Z","eventData":"SUCCESS"}
{"id":"66ef2a54-5b84-40b0-88b8-721edfba201d","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24036"},"specVersion":"0.1.0","time":"2024-01-31T08:01:27.600071218Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"ec1b57bb-502b-4922-972f-a98be48b9f1c","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24033"},"specVersion":"0.1.0","time":"2024-01-31T08:01:28.766332927Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"b1a8a99c-bb2a-48e9-a3ed-bfeb436c2608","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24036"},"specVersion":"0.1.0","time":"2024-01-31T08:01:30.336095803Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"8a10beb7-6427-44cf-b696-e0a605a1b311","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24036"},"specVersion":"0.1.0","time":"2024-01-31T08:01:30.657576220Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"5be370bf-0cc5-4e1d-9bb2-7de95dfae4af","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24036"},"specVersion":"0.1.0","time":"2024-01-31T08:01:33.741031638Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"bb6f95de-054a-409b-93fa-8fa833f1bad4","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24036"},"specVersion":"0.1.0","time":"2024-01-31T08:01:34.303456430Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"111dfefd-850b-437d-af26-529e5b6997ba","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24036"},"specVersion":"0.1.0","time":"2024-01-31T08:01:35.227176930Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
[2024-01-31 09:01:40,998] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 71 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/M6mOAcO5lMwTdTpHlSjNfyYVy.svg)](https://asciinema.org/a/M6mOAcO5lMwTdTpHlSjNfyYVy)

</TabItem>
</Tabs>

## Remove interceptor guard-limit-connection



<Tabs>
<TabItem value="Command">


```sh
curl \
    --request DELETE "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/guard-limit-connection" \
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

[![asciicast](https://asciinema.org/a/8jMgB7wxLHNg1TLnB0WcBDWvQ.svg)](https://asciinema.org/a/8jMgB7wxLHNg1TLnB0WcBDWvQ)

</TabItem>
</Tabs>

## Adding interceptor guard-agressive-auto-commit

Let's block aggressive auto-commits strategies

<Tabs>
<TabItem value="Command">


```sh
cat step-33-guard-agressive-auto-commit.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/guard-agressive-auto-commit" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-33-guard-agressive-auto-commit.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
  "priority": 100,
  "config": {
    "maximumCommitsPerMinute": 1,
    "action": "BLOCK"
  }
}
{
  "message": "guard-agressive-auto-commit is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/3ELx7K1Xd19pIS0gEavTFkaro.svg)](https://asciinema.org/a/3ELx7K1Xd19pIS0gEavTFkaro)

</TabItem>
</Tabs>

## Consuming from cars

Consuming from cars in cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic cars \
    --from-beginning \
    --timeout-ms 10000 \
    --group group-with-aggressive-autocommit | jq
```


</TabItem>
<TabItem value="Output">

```json
[2024-01-31 09:01:52,842] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
[2024-01-31 09:01:53,098] ERROR [Consumer clientId=console-consumer, groupId=group-with-aggressive-autocommit] Offset commit failed on partition cars-0 at offset 5: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
[2024-01-31 09:01:53,225] ERROR [Consumer clientId=console-consumer, groupId=group-with-aggressive-autocommit] Offset commit failed on partition cars-0 at offset 5: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
[2024-01-31 09:01:53,225] WARN [Consumer clientId=console-consumer, groupId=group-with-aggressive-autocommit] Asynchronous auto-commit of offsets {cars-0=OffsetAndMetadata{offset=5, leaderEpoch=0, metadata=''}} failed: Unexpected error in commit: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
[2024-01-31 09:01:53,226] WARN [Consumer clientId=console-consumer, groupId=group-with-aggressive-autocommit] Synchronous auto-commit of offsets {cars-0=OffsetAndMetadata{offset=5, leaderEpoch=0, metadata=''}} failed: Unexpected error in commit: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
Processed a total of 5 messages
{
  "type": "Ferrari",
  "color": "red",
  "price": 10000
}
{
  "type": "RollsRoyce",
  "color": "black",
  "price": 9000
}
{
  "type": "Mercedes",
  "color": "black",
  "price": 6000
}
{
  "type": "Fiat",
  "color": "red",
  "price": -1
}
{
  "type": "Fiat",
  "color": "red",
  "price": -1
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/vKRBeoTLgwEv9VGOAbUXZTwSL.svg)](https://asciinema.org/a/vKRBeoTLgwEv9VGOAbUXZTwSL)

</TabItem>
</Tabs>

## Check in the audit log that connection was denied

Check in the audit log that connection was denied in cluster `kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --topic _auditLogs \
    --from-beginning \
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin")'
```


returns 1 event
```json
{
  "id" : "25f514df-3abf-4134-9feb-8b43d7a7a1f4",
  "source" : "krn://cluster=PXf14wbFTTuF5IyZwRUrGA",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:17656"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T07:46:16.597586167Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
```


</TabItem>
<TabItem value="Output">

```
{"id":"176da68b-89f1-41ae-8687-2ba18e18994f","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35888"},"specVersion":"0.1.0","time":"2024-01-31T08:00:33.274440554Z","eventData":{"method":"POST","path":"/admin/vclusters/v1/vcluster/teamA/username/sa","body":"{\"lifeTimeSeconds\": 7776000}"}}
{"id":"2b45a2bf-39d8-4094-bf4e-fc17fc649cff","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20750"},"specVersion":"0.1.0","time":"2024-01-31T08:00:34.837310347Z","eventData":"SUCCESS"}
{"id":"7487baf8-f74d-412f-8e62-7565a1bddffc","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16579"},"specVersion":"0.1.0","time":"2024-01-31T08:00:34.944556888Z","eventData":"SUCCESS"}
{"id":"eaeb66df-75cd-49c0-a3c1-391f1920d637","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20752"},"specVersion":"0.1.0","time":"2024-01-31T08:00:36.692880041Z","eventData":"SUCCESS"}
{"id":"e521bcf4-7e71-4bb9-8d0c-219a8a32f3ac","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23926"},"specVersion":"0.1.0","time":"2024-01-31T08:00:36.746094250Z","eventData":"SUCCESS"}
{"id":"73f8dc7b-a319-4a6e-9532-3d40ff609b97","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20765"},"specVersion":"0.1.0","time":"2024-01-31T08:00:39.176545459Z","eventData":"SUCCESS"}
{"id":"1d70481c-8d60-4fc5-9bab-2e4093e4d91d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23939"},"specVersion":"0.1.0","time":"2024-01-31T08:00:39.274028334Z","eventData":"SUCCESS"}
{"id":"150e4443-49ae-4c2c-9601-6df770cd46b0","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20767"},"specVersion":"0.1.0","time":"2024-01-31T08:00:40.896439127Z","eventData":"SUCCESS"}
{"id":"597dd4c1-59e5-4f9c-b925-5dc776819a15","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23941"},"specVersion":"0.1.0","time":"2024-01-31T08:00:40.954266794Z","eventData":"SUCCESS"}
{"id":"9aa6be13-d226-4414-b2bf-5fc9555ea09e","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20769"},"specVersion":"0.1.0","time":"2024-01-31T08:00:42.421208503Z","eventData":"SUCCESS"}
{"id":"1b67fa74-37a2-4ab6-b918-09567e129068","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16598"},"specVersion":"0.1.0","time":"2024-01-31T08:00:42.485314253Z","eventData":"SUCCESS"}
{"id":"30e677dc-6aa2-484b-8052-658828f2784f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23944"},"specVersion":"0.1.0","time":"2024-01-31T08:00:42.698533461Z","eventData":"SUCCESS"}
{"id":"3e2f119d-70ca-48f2-a6b1-8e7e480179e6","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20772"},"specVersion":"0.1.0","time":"2024-01-31T08:00:44.931696254Z","eventData":"SUCCESS"}
{"id":"2c64b169-60e4-4456-9e0d-118bce3fb68b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23946"},"specVersion":"0.1.0","time":"2024-01-31T08:00:44.970148879Z","eventData":"SUCCESS"}
{"id":"eb3b3ce0-f479-401c-9c90-2b7615a9f810","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20774"},"specVersion":"0.1.0","time":"2024-01-31T08:00:45.019749670Z","eventData":"SUCCESS"}
{"id":"2de76b20-e5c8-4904-a8de-b1eed8c065ef","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16603"},"specVersion":"0.1.0","time":"2024-01-31T08:00:45.059975545Z","eventData":"SUCCESS"}
{"id":"1e37d608-c46d-461e-949f-a8a69dac7a3e","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35915"},"specVersion":"0.1.0","time":"2024-01-31T08:00:45.580428129Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-on-create-topic","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"replicationFactor\" : {      \"min\" : 2,      \"max\" : 2    },    \"numPartition\" : {      \"min\" : 1,      \"max\" : 3    }  }}"}}
{"id":"4ed42001-8dbd-45e0-b519-f17780134a46","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35916"},"specVersion":"0.1.0","time":"2024-01-31T08:00:46.106833338Z","eventData":{"method":"GET","path":"/admin/interceptors/v1/vcluster/teamA","body":null}}
{"id":"73a7dbc8-e166-4be8-8161-9ecc07f81e7f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20778"},"specVersion":"0.1.0","time":"2024-01-31T08:00:47.222587172Z","eventData":"SUCCESS"}
{"id":"1b36faa2-baec-4c3c-b719-eb6fe32710b4","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16607"},"specVersion":"0.1.0","time":"2024-01-31T08:00:47.258035797Z","eventData":"SUCCESS"}
{"id":"7fae320e-23a3-4fd3-a2e8-67b08190feea","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:16607"},"specVersion":"0.1.0","time":"2024-01-31T08:00:47.282549672Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'roads' with number partitions is '100', must not be greater than 3. Topic 'roads' with replication factor is '1', must not be less than 2"}}
{"id":"892fbe18-ef7a-4c74-90cc-f4f82bfc5661","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20791"},"specVersion":"0.1.0","time":"2024-01-31T08:00:48.712786297Z","eventData":"SUCCESS"}
{"id":"eeb74d6d-700c-495a-a32b-0d6dc558418a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16620"},"specVersion":"0.1.0","time":"2024-01-31T08:00:48.745490631Z","eventData":"SUCCESS"}
{"id":"63fbc9b1-acbf-4931-9b6f-3b353ea8b661","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35932"},"specVersion":"0.1.0","time":"2024-01-31T08:00:49.344152798Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-on-alter-topic","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"retentionMs\" : {      \"min\" : 86400000,      \"max\" : 432000000    }  }}"}}
{"id":"17074172-b1ae-416e-ac51-0abd609fcdea","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20794"},"specVersion":"0.1.0","time":"2024-01-31T08:00:50.493563965Z","eventData":"SUCCESS"}
{"id":"f63da10b-876f-4657-be5e-240094ee402f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23968"},"specVersion":"0.1.0","time":"2024-01-31T08:00:50.526643340Z","eventData":"SUCCESS"}
{"id":"a319d24a-5d70-4de5-9c8f-1b27f60a6035","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:23968"},"specVersion":"0.1.0","time":"2024-01-31T08:00:50.570684298Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Resource 'roads' with retention.ms is '5184000000', must not be greater than '432000000'"}}
{"id":"a0f263db-1749-4957-ac8a-41ae5cae4e9b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20796"},"specVersion":"0.1.0","time":"2024-01-31T08:00:52.109115507Z","eventData":"SUCCESS"}
{"id":"43fb7385-5328-4758-b98f-9bdb12b3922f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20797"},"specVersion":"0.1.0","time":"2024-01-31T08:00:52.151241382Z","eventData":"SUCCESS"}
{"id":"12fdb50d-092c-40a9-89b2-d53ade2c0e2f","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35937"},"specVersion":"0.1.0","time":"2024-01-31T08:00:52.685032966Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-on-produce","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"acks\" : {      \"value\" : [ -1 ],      \"action\" : \"BLOCK\"    },    \"compressions\" : {      \"value\" : [ \"NONE\", \"GZIP\" ],      \"action\" : \"BLOCK\"    }  }}"}}
{"id":"b8867efd-7d80-489a-ba26-3037fbd51e6b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20799"},"specVersion":"0.1.0","time":"2024-01-31T08:00:53.790920091Z","eventData":"SUCCESS"}
{"id":"10b63bc4-9158-48bf-93ea-519676c2489d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23973"},"specVersion":"0.1.0","time":"2024-01-31T08:00:53.969879008Z","eventData":"SUCCESS"}
{"id":"eac3c988-e39a-4ee0-aed5-41645dddd4d1","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:23973"},"specVersion":"0.1.0","time":"2024-01-31T08:00:54.048663758Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1. Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]"}}
{"id":"553a9867-4a85-4bbc-87ce-b61466497ca3","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20801"},"specVersion":"0.1.0","time":"2024-01-31T08:00:55.534008467Z","eventData":"SUCCESS"}
{"id":"e261f1dc-e3e4-4faf-88cc-a0f3d2e0767c","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23975"},"specVersion":"0.1.0","time":"2024-01-31T08:00:55.590998801Z","eventData":"SUCCESS"}
{"id":"87a07bea-2bf6-4696-82e4-eba6c9f8027c","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35942"},"specVersion":"0.1.0","time":"2024-01-31T08:00:56.077212592Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/produce-rate","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"maximumBytesPerSecond\" : 1  }}"}}
{"id":"161a0119-2800-483c-8670-bafa44914aee","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20804"},"specVersion":"0.1.0","time":"2024-01-31T08:00:57.154284718Z","eventData":"SUCCESS"}
{"id":"b7805c52-fb1e-4463-8031-4c8340112589","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:23978"},"specVersion":"0.1.0","time":"2024-01-31T08:00:57.197246051Z","eventData":"SUCCESS"}
{"id":"30350404-dea6-4eaf-862f-72cfcc73baab","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35959"},"specVersion":"0.1.0","time":"2024-01-31T08:01:02.177368262Z","eventData":{"method":"DELETE","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/produce-rate","body":null}}
{"id":"c1c5da16-69a8-4075-88c8-b26a976553d9","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35960"},"specVersion":"0.1.0","time":"2024-01-31T08:01:02.249701512Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/consumer-group-name-policy","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"groupId\" : {      \"value\" : \"my-group.*\",      \"action\" : \"BLOCK\"    }  }}"}}
{"id":"d95d3c87-46d8-4be6-9aaa-97dd5a7fef29","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20822"},"specVersion":"0.1.0","time":"2024-01-31T08:01:03.322153721Z","eventData":"SUCCESS"}
{"id":"7f980139-f936-4cc3-82f7-5d6318b6bc44","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16651"},"specVersion":"0.1.0","time":"2024-01-31T08:01:03.361162096Z","eventData":"SUCCESS"}
{"id":"86ae1402-cc15-4710-83fd-a58b61077083","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:16651"},"specVersion":"0.1.0","time":"2024-01-31T08:01:03.370344054Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin","message":"Request parameters do not satisfy the configured policy. GroupId 'group-not-within-policy' is invalid, naming convention must match with regular expression my-group.*"}}
{"id":"e1835b75-08ee-4189-a525-65b6567d427a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20838"},"specVersion":"0.1.0","time":"2024-01-31T08:01:09.492525126Z","eventData":"SUCCESS"}
{"id":"de930824-9733-48a0-af93-c17f5afab30a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20839"},"specVersion":"0.1.0","time":"2024-01-31T08:01:09.545071335Z","eventData":"SUCCESS"}
{"id":"7f189e24-d665-4aa3-a60d-ae86c5a45fbb","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24013"},"specVersion":"0.1.0","time":"2024-01-31T08:01:09.631605126Z","eventData":"SUCCESS"}
{"id":"d85f4880-ac60-4b28-9884-eb46bec269d1","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35991"},"specVersion":"0.1.0","time":"2024-01-31T08:01:20.412376673Z","eventData":{"method":"DELETE","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/consumer-group-name-policy","body":null}}
{"id":"f1d04c3b-20cf-466d-8278-9e40223f2db0","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:35992"},"specVersion":"0.1.0","time":"2024-01-31T08:01:20.469840256Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-limit-connection","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"maximumConnectionsPerSecond\" : 1,    \"action\" : \"BLOCK\"  }}"}}
{"id":"ba411fb1-27b9-40f5-bfed-9854dd2af56d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20854"},"specVersion":"0.1.0","time":"2024-01-31T08:01:21.628112840Z","eventData":"SUCCESS"}
{"id":"dcadcdaa-6b24-4645-b2ff-b3f554128fcb","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24028"},"specVersion":"0.1.0","time":"2024-01-31T08:01:21.668204715Z","eventData":"SUCCESS"}
{"id":"1c5726cc-cb51-4638-9747-655b77f092bb","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24028"},"specVersion":"0.1.0","time":"2024-01-31T08:01:21.870571090Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"90ea461b-cc1a-46d2-a303-6c6e5d24f6ef","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24029"},"specVersion":"0.1.0","time":"2024-01-31T08:01:21.906656340Z","eventData":"SUCCESS"}
{"id":"bb2dada1-1a26-4730-8f3c-e70bb28a1ca3","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24029"},"specVersion":"0.1.0","time":"2024-01-31T08:01:21.987336049Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"5c9a4ea5-a330-4e12-8fda-eac168ae81e0","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6970","remoteAddress":"/192.168.65.1:16685"},"specVersion":"0.1.0","time":"2024-01-31T08:01:22.110928757Z","eventData":"SUCCESS"}
{"id":"ab755ffe-62f4-43fb-a7c7-c92dfc142a8b","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:16685"},"specVersion":"0.1.0","time":"2024-01-31T08:01:23.045297758Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"fd340d34-6a7c-45bc-a0c0-d3338a3983ff","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20858"},"specVersion":"0.1.0","time":"2024-01-31T08:01:23.180372549Z","eventData":"SUCCESS"}
{"id":"c0fcf2b4-15f6-4871-967b-536d5a1e0083","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24032"},"specVersion":"0.1.0","time":"2024-01-31T08:01:23.213963716Z","eventData":"SUCCESS"}
{"id":"5f9e63d6-e4e1-4977-99a1-6968426521d8","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24032"},"specVersion":"0.1.0","time":"2024-01-31T08:01:23.456240758Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"286da964-c538-4fe3-af18-0d8a46180202","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24033"},"specVersion":"0.1.0","time":"2024-01-31T08:01:23.602807508Z","eventData":"SUCCESS"}
{"id":"79635d8a-be7e-452c-90ea-716753662c87","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24034"},"specVersion":"0.1.0","time":"2024-01-31T08:01:23.697933675Z","eventData":"SUCCESS"}
{"id":"9cff04ab-0645-4dfc-a2e1-a2f720e73bda","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24034"},"specVersion":"0.1.0","time":"2024-01-31T08:01:24.599899133Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"e10d26c9-cf64-4ed9-8cf4-fc29a13b109d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24035"},"specVersion":"0.1.0","time":"2024-01-31T08:01:24.742092883Z","eventData":"SUCCESS"}
{"id":"5dc7877f-ab6e-43c5-95e1-c4c7b8f25384","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24035"},"specVersion":"0.1.0","time":"2024-01-31T08:01:25.269079592Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"db3c5968-8f5f-42ad-8475-74738ca149e6","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24036"},"specVersion":"0.1.0","time":"2024-01-31T08:01:25.515870300Z","eventData":"SUCCESS"}
{"id":"66ef2a54-5b84-40b0-88b8-721edfba201d","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24036"},"specVersion":"0.1.0","time":"2024-01-31T08:01:27.600071218Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"ec1b57bb-502b-4922-972f-a98be48b9f1c","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24033"},"specVersion":"0.1.0","time":"2024-01-31T08:01:28.766332927Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"b1a8a99c-bb2a-48e9-a3ed-bfeb436c2608","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24036"},"specVersion":"0.1.0","time":"2024-01-31T08:01:30.336095803Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"8a10beb7-6427-44cf-b696-e0a605a1b311","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24036"},"specVersion":"0.1.0","time":"2024-01-31T08:01:30.657576220Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"5be370bf-0cc5-4e1d-9bb2-7de95dfae4af","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24036"},"specVersion":"0.1.0","time":"2024-01-31T08:01:33.741031638Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"bb6f95de-054a-409b-93fa-8fa833f1bad4","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24036"},"specVersion":"0.1.0","time":"2024-01-31T08:01:34.303456430Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"111dfefd-850b-437d-af26-529e5b6997ba","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24036"},"specVersion":"0.1.0","time":"2024-01-31T08:01:35.227176930Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Client connections exceed the limitation of 1 connections per second"}}
{"id":"69950489-4753-4be3-aa21-15c2f425a7c7","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:36028"},"specVersion":"0.1.0","time":"2024-01-31T08:01:41.497722752Z","eventData":{"method":"DELETE","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-limit-connection","body":null}}
{"id":"ecbea20e-2b81-4d42-88df-df69ee959151","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.96.6:8888","remoteAddress":"192.168.65.1:36029"},"specVersion":"0.1.0","time":"2024-01-31T08:01:41.555030544Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-agressive-auto-commit","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"maximumCommitsPerMinute\" : 1,    \"action\" : \"BLOCK\"  }}"}}
{"id":"47fa937f-1a70-4f6e-b21c-53ed4159f604","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6969","remoteAddress":"/192.168.65.1:20891"},"specVersion":"0.1.0","time":"2024-01-31T08:01:42.675680628Z","eventData":"SUCCESS"}
{"id":"ca0ff3e0-8620-4d4d-82e7-34be635913fc","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24065"},"specVersion":"0.1.0","time":"2024-01-31T08:01:42.717268336Z","eventData":"SUCCESS"}
{"id":"f9f9566c-1397-44cd-815a-d34fc4f12d15","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.96.6:6971","remoteAddress":"/192.168.65.1:24066"},"specVersion":"0.1.0","time":"2024-01-31T08:01:42.785813211Z","eventData":"SUCCESS"}
{"id":"acce26aa-d75d-49a0-b40c-8d82c4142e1c","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24065"},"specVersion":"0.1.0","time":"2024-01-31T08:01:53.088788133Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin","message":"Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"}}
{"id":"81d8438a-d25e-4d67-b260-8197455908b1","source":"krn://cluster=A4cejXw9S-CjaBUThgqtWw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24065"},"specVersion":"0.1.0","time":"2024-01-31T08:01:53.218447466Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin","message":"Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"}}
[2024-01-31 09:01:57,837] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 78 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/yqBBlIH2EI1pGerdFAjxCEHPe.svg)](https://asciinema.org/a/yqBBlIH2EI1pGerdFAjxCEHPe)

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
 Container gateway1  Stopped
 Container gateway1  Removing
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway2  Removed
 Container gateway1  Removed
 Container schema-registry  Removed
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka3  Removed
 Container kafka1  Removed
 Container kafka2  Removed
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network safeguard_default  Removing
 Network safeguard_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/z2yF8RCamevOEdT9I0uhDl6tz.svg)](https://asciinema.org/a/z2yF8RCamevOEdT9I0uhDl6tz)

</TabItem>
</Tabs>

# Conclusion

Safeguard is really a game changer!

