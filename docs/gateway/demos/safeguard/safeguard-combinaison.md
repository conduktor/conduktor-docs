---
title: Safeguard
description: Safeguard
tag: safeguard
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

[![asciicast](https://asciinema.org/a/IvcfHakgIpqmvTihgCtqDpLfR.svg)](https://asciinema.org/a/IvcfHakgIpqmvTihgCtqDpLfR)

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
 Network safeguard-combinaison_default  Creating
 Network safeguard-combinaison_default  Created
 Container kafka-client  Creating
 Container zookeeper  Creating
 Container zookeeper  Created
 Container kafka-client  Created
 Container kafka2  Creating
 Container kafka3  Creating
 Container kafka1  Creating
 Container kafka1  Created
 Container kafka3  Created
 Container kafka2  Created
 Container gateway2  Creating
 Container gateway1  Creating
 Container schema-registry  Creating
 gateway1 The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 
 gateway2 The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 
 Container gateway1  Created
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
 Container kafka3  Starting
 Container zookeeper  Healthy
 Container kafka2  Starting
 Container zookeeper  Healthy
 Container kafka1  Starting
 Container kafka1  Started
 Container kafka3  Started
 Container kafka2  Started
 Container kafka1  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container gateway2  Starting
 Container kafka2  Healthy
 Container gateway1  Starting
 Container kafka2  Healthy
 Container schema-registry  Starting
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
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka-client  Healthy
 Container kafka3  Healthy
 Container zookeeper  Healthy
 Container schema-registry  Healthy
 Container gateway1  Healthy
 Container gateway2  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/4ycewGn96DLY0QfZCABREJHtu.svg)](https://asciinema.org/a/4ycewGn96DLY0QfZCABREJHtu)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNTY1NTI1M30.AnFM6afl7Qtd-JBrKlzaaTJmN5eIJYNL6BQPue3gbS8';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/h64AGbLYhrg1jkEATQ1EAV5C2.svg)](https://asciinema.org/a/h64AGbLYhrg1jkEATQ1EAV5C2)

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

[![asciicast](https://asciinema.org/a/gthCYTdJtSgPkkSYiygavKXLE.svg)](https://asciinema.org/a/gthCYTdJtSgPkkSYiygavKXLE)

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

[![asciicast](https://asciinema.org/a/muA7GP81i5f9PvNI7eybT4UIe.svg)](https://asciinema.org/a/muA7GP81i5f9PvNI7eybT4UIe)

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


returns 

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

[![asciicast](https://asciinema.org/a/EyAboiVqgUh4TgckSqKiBneas.svg)](https://asciinema.org/a/EyAboiVqgUh4TgckSqKiBneas)

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
Topic: cars	TopicId: eu-RFjWMTrquHCMyoTB-UA	PartitionCount: 1	ReplicationFactor: 1	Configs: 
	Topic: cars	Partition: 0	Leader: 3	Replicas: 3	Isr: 3

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/aSLYKlsMx5JGUnfgyJE4BS5m8.svg)](https://asciinema.org/a/aSLYKlsMx5JGUnfgyJE4BS5m8)

</TabItem>
</Tabs>

## Adding interceptor guard-on-create-topic

Let's make sure this problem never repeats itself and add a topic creation safeguard. 

... and while we're at it, let's make sure we don't abuse partitions either

Creating the interceptor named `guard-on-create-topic` of the plugin `io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin` using the following payload

```json
{
  "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin",
  "priority" : 100,
  "config" : {
    "replicationFactor" : {
      "min" : 2,
      "max" : 2
    },
    "numPartition" : {
      "min" : 1,
      "max" : 3
    }
  }
}
```

Here's how to send it:

<Tabs>
<TabItem value="Command">


```sh
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
  "message": "guard-on-create-topic is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/tbRk9vV8tU3i4DVzempq6iGLL.svg)](https://asciinema.org/a/tbRk9vV8tU3i4DVzempq6iGLL)

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

[![asciicast](https://asciinema.org/a/IUjwFrSZIsrfC7C3HcOB2yCWo.svg)](https://asciinema.org/a/IUjwFrSZIsrfC7C3HcOB2yCWo)

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
[2024-02-14 03:54:23,885] ERROR org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'roads' with number partitions is '100', must not be greater than 3. Topic 'roads' with replication factor is '1', must not be less than 2
 (kafka.admin.TopicCommand$)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/TS4b9v2D5nNOx8HlWboKZ6H8l.svg)](https://asciinema.org/a/TS4b9v2D5nNOx8HlWboKZ6H8l)

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

[![asciicast](https://asciinema.org/a/KbsPpd7ZoN89vpZPNuYOZPhl4.svg)](https://asciinema.org/a/KbsPpd7ZoN89vpZPNuYOZPhl4)

</TabItem>
</Tabs>

## Adding interceptor guard-on-alter-topic

Let's make sure we enforce policies when we alter topics too

Here the retention can only be between 1 and 5 days

Creating the interceptor named `guard-on-alter-topic` of the plugin `io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin` using the following payload

```json
{
  "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin",
  "priority" : 100,
  "config" : {
    "retentionMs" : {
      "min" : 86400000,
      "max" : 432000000
    }
  }
}
```

Here's how to send it:

<Tabs>
<TabItem value="Command">


```sh
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
  "message": "guard-on-alter-topic is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/O0E0RD6ECPiyLz73tIkwetBX4.svg)](https://asciinema.org/a/O0E0RD6ECPiyLz73tIkwetBX4)

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

[![asciicast](https://asciinema.org/a/rPVKdnDdov6OJUzHUFtfOwiwx.svg)](https://asciinema.org/a/rPVKdnDdov6OJUzHUFtfOwiwx)

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

[![asciicast](https://asciinema.org/a/DvSOsY0Q4HLVi2nIhW4Ne49SG.svg)](https://asciinema.org/a/DvSOsY0Q4HLVi2nIhW4Ne49SG)

</TabItem>
</Tabs>

## Adding interceptor guard-on-produce

Let's make sure we enforce policies also at produce time!

Here message shall be sent with compression and with the right level of resiliency

Creating the interceptor named `guard-on-produce` of the plugin `io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin` using the following payload

```json
{
  "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin",
  "priority" : 100,
  "config" : {
    "acks" : {
      "value" : [ -1 ],
      "action" : "BLOCK"
    },
    "compressions" : {
      "value" : [ "NONE", "GZIP" ],
      "action" : "BLOCK"
    }
  }
}
```

Here's how to send it:

<Tabs>
<TabItem value="Command">


```sh
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
  "message": "guard-on-produce is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/9EXOrf1vphp3MeMOMjcoT8TAt.svg)](https://asciinema.org/a/9EXOrf1vphp3MeMOMjcoT8TAt)

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
[2024-02-14 03:54:29,922] ERROR Error when sending message to topic cars with key: null, value: 40 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1. Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/boIsLcIZJiQm46QlwzjVBnEJG.svg)](https://asciinema.org/a/boIsLcIZJiQm46QlwzjVBnEJG)

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

[![asciicast](https://asciinema.org/a/rIx4qjvFvish9ZBxfFG6ktziN.svg)](https://asciinema.org/a/rIx4qjvFvish9ZBxfFG6ktziN)

</TabItem>
</Tabs>

## Adding interceptor produce-rate

Let's add some rate limiting policy on produce

Creating the interceptor named `produce-rate` of the plugin `io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin` using the following payload

```json
{
  "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin",
  "priority" : 100,
  "config" : {
    "maximumBytesPerSecond" : 1
  }
}
```

Here's how to send it:

<Tabs>
<TabItem value="Command">


```sh
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
  "message": "produce-rate is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/dX5vMWhwdKjiYsQyFxb17O2JZ.svg)](https://asciinema.org/a/dX5vMWhwdKjiYsQyFxb17O2JZ)

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

[![asciicast](https://asciinema.org/a/mpmhln2uRIp9KfOokR8za3nBi.svg)](https://asciinema.org/a/mpmhln2uRIp9KfOokR8za3nBi)

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
    --timeout-ms 3000 \
    | jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin")'
```


returns 

```json
Processed a total of 38 messages
{
  "id": "5b0fd5aa-742f-48dd-822b-f23b2187302d",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53647"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:54:32.674463045Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin",
    "message": "Client produced (108) bytes, which is more than 1 bytes per second, producer will be throttled by 134 milliseconds"
  }
}

```



</TabItem>
<TabItem value="Output">

```
Processed a total of 38 messages
{
  "id": "5b0fd5aa-742f-48dd-822b-f23b2187302d",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53647"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:54:32.674463045Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin",
    "message": "Client produced (108) bytes, which is more than 1 bytes per second, producer will be throttled by 134 milliseconds"
  }
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Vynh13iSItFqZkpNLC7RIugVd.svg)](https://asciinema.org/a/Vynh13iSItFqZkpNLC7RIugVd)

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

[![asciicast](https://asciinema.org/a/TuDdTFlUXdwa0ESR24oc5mOnq.svg)](https://asciinema.org/a/TuDdTFlUXdwa0ESR24oc5mOnq)

</TabItem>
</Tabs>

## Adding interceptor consumer-group-name-policy

Let's add some naming conventions on consumer group names

Creating the interceptor named `consumer-group-name-policy` of the plugin `io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin` using the following payload

```json
{
  "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin",
  "priority" : 100,
  "config" : {
    "groupId" : {
      "value" : "my-group.*",
      "action" : "BLOCK"
    }
  }
}
```

Here's how to send it:

<Tabs>
<TabItem value="Command">


```sh
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
  "message": "consumer-group-name-policy is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/fVmM1jfO6gEC4oiF9klGRmX8D.svg)](https://asciinema.org/a/fVmM1jfO6gEC4oiF9klGRmX8D)

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



returns 

```json
[2024-02-14 03:54:38,590] ERROR [Consumer clientId=console-consumer, groupId=group-not-within-policy] JoinGroup failed due to unexpected error: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
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
<TabItem value="Output">

```json
[2024-02-14 03:54:38,590] ERROR [Consumer clientId=console-consumer, groupId=group-not-within-policy] JoinGroup failed due to unexpected error: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
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

[![asciicast](https://asciinema.org/a/Kdla6JWVZm9AoohJlMDQJ01W1.svg)](https://asciinema.org/a/Kdla6JWVZm9AoohJlMDQJ01W1)

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
    --timeout-ms 3000 \
    | jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin")'
```


returns 

```json
Processed a total of 43 messages
{
  "id": "03adead3-35e4-40e9-875d-b94c946f89ad",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:49990"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:54:38.585534131Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin",
    "message": "Request parameters do not satisfy the configured policy. GroupId 'group-not-within-policy' is invalid, naming convention must match with regular expression my-group.*"
  }
}

```



</TabItem>
<TabItem value="Output">

```
Processed a total of 43 messages
{
  "id": "03adead3-35e4-40e9-875d-b94c946f89ad",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:49990"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:54:38.585534131Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin",
    "message": "Request parameters do not satisfy the configured policy. GroupId 'group-not-within-policy' is invalid, naming convention must match with regular expression my-group.*"
  }
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/TwNwiPazTLtKPCMDAxktLwbAg.svg)](https://asciinema.org/a/TwNwiPazTLtKPCMDAxktLwbAg)

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


returns 

```json
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
<TabItem value="Output">

```json
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

[![asciicast](https://asciinema.org/a/9aqFeQOO1cY43b9koUOqNWbX7.svg)](https://asciinema.org/a/9aqFeQOO1cY43b9koUOqNWbX7)

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

[![asciicast](https://asciinema.org/a/VhAsvgCyN1k9jGv8ik6yNWqnU.svg)](https://asciinema.org/a/VhAsvgCyN1k9jGv8ik6yNWqnU)

</TabItem>
</Tabs>

## Adding interceptor guard-limit-connection

Let's add some connect limitation policy

Creating the interceptor named `guard-limit-connection` of the plugin `io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin` using the following payload

```json
{
  "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
  "priority" : 100,
  "config" : {
    "maximumConnectionsPerSecond" : 1,
    "action" : "BLOCK"
  }
}
```

Here's how to send it:

<Tabs>
<TabItem value="Command">


```sh
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
  "message": "guard-limit-connection is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Hr4FFVDcFAHTKl1fqGOvsq1qM.svg)](https://asciinema.org/a/Hr4FFVDcFAHTKl1fqGOvsq1qM)

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


returns 

```json
[2024-02-14 03:54:57,112] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Received error POLICY_VIOLATION from node 2147483644 when making an ApiVersionsRequest with correlation id 4. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:54:57,947] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Received error POLICY_VIOLATION from node 3 when making an ApiVersionsRequest with correlation id 15. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:54:59,105] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Received error POLICY_VIOLATION from node 3 when making an ApiVersionsRequest with correlation id 18. Disconnecting. (org.apache.kafka.clients.NetworkClient)
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
<TabItem value="Output">

```json
[2024-02-14 03:54:57,112] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Received error POLICY_VIOLATION from node 2147483644 when making an ApiVersionsRequest with correlation id 4. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:54:57,947] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Received error POLICY_VIOLATION from node 3 when making an ApiVersionsRequest with correlation id 15. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:54:59,105] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Received error POLICY_VIOLATION from node 3 when making an ApiVersionsRequest with correlation id 18. Disconnecting. (org.apache.kafka.clients.NetworkClient)
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

[![asciicast](https://asciinema.org/a/SiLEV3RgosHbmJYkAdxu0vfwo.svg)](https://asciinema.org/a/SiLEV3RgosHbmJYkAdxu0vfwo)

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
    --timeout-ms 3000 \
    | jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin")'
```


returns 

```json
{
  "id": "f1a4068b-7e2f-4bd4-b352-f62ccaecaaad",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53736"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:54:57.103049668Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message": "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id": "a78d7253-152e-44f8-8e85-ffaa96482569",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53739"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:54:57.948077251Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message": "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id": "c9d3075f-e1dd-4c42-be62-872031245f73",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53740"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:54:59.096660544Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message": "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id": "4cb22e9f-1fee-4254-9396-cfee4838f8d1",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53741"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:55:01.409479670Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message": "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id": "69489f65-0987-4f93-80cf-2d32a28d649d",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53741"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:55:03.306784796Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message": "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id": "bc5161f7-336c-4e0e-a298-3035410d9ff4",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53741"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:55:07.045165506Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message": "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id": "b4585baa-2cfa-405e-9810-90f0791238d9",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53741"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:55:07.860314506Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message": "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id": "94d3541d-0645-4b64-a76b-49f5427e896d",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
Processed a total of 63 messages
pal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53741"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:55:08.682395881Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message": "Client connections exceed the limitation of 1 connections per second"
  }
}

```



</TabItem>
<TabItem value="Output">

```
{
  "id": "f1a4068b-7e2f-4bd4-b352-f62ccaecaaad",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53736"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:54:57.103049668Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message": "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id": "a78d7253-152e-44f8-8e85-ffaa96482569",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53739"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:54:57.948077251Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message": "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id": "c9d3075f-e1dd-4c42-be62-872031245f73",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53740"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:54:59.096660544Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message": "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id": "4cb22e9f-1fee-4254-9396-cfee4838f8d1",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53741"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:55:01.409479670Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message": "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id": "69489f65-0987-4f93-80cf-2d32a28d649d",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53741"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:55:03.306784796Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message": "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id": "bc5161f7-336c-4e0e-a298-3035410d9ff4",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53741"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:55:07.045165506Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message": "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id": "b4585baa-2cfa-405e-9810-90f0791238d9",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53741"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:55:07.860314506Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message": "Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id": "94d3541d-0645-4b64-a76b-49f5427e896d",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
Processed a total of 63 messages
pal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53741"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:55:08.682395881Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message": "Client connections exceed the limitation of 1 connections per second"
  }
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/7wjWpEzAp4ZZkDrOanFqhcgLq.svg)](https://asciinema.org/a/7wjWpEzAp4ZZkDrOanFqhcgLq)

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

[![asciicast](https://asciinema.org/a/jKSEcxC8DvHSDxMY6CWZQiCq0.svg)](https://asciinema.org/a/jKSEcxC8DvHSDxMY6CWZQiCq0)

</TabItem>
</Tabs>

## Adding interceptor guard-agressive-auto-commit

Let's block aggressive auto-commits strategies

Creating the interceptor named `guard-agressive-auto-commit` of the plugin `io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin` using the following payload

```json
{
  "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
  "priority" : 100,
  "config" : {
    "maximumCommitsPerMinute" : 1,
    "action" : "BLOCK"
  }
}
```

Here's how to send it:

<Tabs>
<TabItem value="Command">


```sh
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
  "message": "guard-agressive-auto-commit is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/vE2xv6B7huEoDh5w0zq30G3EK.svg)](https://asciinema.org/a/vE2xv6B7huEoDh5w0zq30G3EK)

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


returns 

```json
[2024-02-14 03:55:26,266] ERROR [Consumer clientId=console-consumer, groupId=group-with-aggressive-autocommit] Offset commit failed on partition cars-0 at offset 5: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
[2024-02-14 03:55:26,818] ERROR [Consumer clientId=console-consumer, groupId=group-with-aggressive-autocommit] Offset commit failed on partition cars-0 at offset 5: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
[2024-02-14 03:55:26,819] WARN [Consumer clientId=console-consumer, groupId=group-with-aggressive-autocommit] Asynchronous auto-commit of offsets {cars-0=OffsetAndMetadata{offset=5, leaderEpoch=0, metadata=''}} failed: Unexpected error in commit: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
[2024-02-14 03:55:26,819] WARN [Consumer clientId=console-consumer, groupId=group-with-aggressive-autocommit] Synchronous auto-commit of offsets {cars-0=OffsetAndMetadata{offset=5, leaderEpoch=0, metadata=''}} failed: Unexpected error in commit: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
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
<TabItem value="Output">

```json
[2024-02-14 03:55:26,266] ERROR [Consumer clientId=console-consumer, groupId=group-with-aggressive-autocommit] Offset commit failed on partition cars-0 at offset 5: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
[2024-02-14 03:55:26,818] ERROR [Consumer clientId=console-consumer, groupId=group-with-aggressive-autocommit] Offset commit failed on partition cars-0 at offset 5: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
[2024-02-14 03:55:26,819] WARN [Consumer clientId=console-consumer, groupId=group-with-aggressive-autocommit] Asynchronous auto-commit of offsets {cars-0=OffsetAndMetadata{offset=5, leaderEpoch=0, metadata=''}} failed: Unexpected error in commit: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
[2024-02-14 03:55:26,819] WARN [Consumer clientId=console-consumer, groupId=group-with-aggressive-autocommit] Synchronous auto-commit of offsets {cars-0=OffsetAndMetadata{offset=5, leaderEpoch=0, metadata=''}} failed: Unexpected error in commit: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
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

[![asciicast](https://asciinema.org/a/L9m67VIdpNqYyRHjdYU9fbi7N.svg)](https://asciinema.org/a/L9m67VIdpNqYyRHjdYU9fbi7N)

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
    --timeout-ms 3000 \
    | jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin")'
```


returns 

```json
Processed a total of 70 messages
{
  "id": "45f3eb08-4422-4504-8236-6eccb591b978",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53796"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:55:26.250918792Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message": "Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id": "056b7df1-faed-4812-9d2a-75d3aa3118eb",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53796"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:55:26.812908501Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message": "Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}

```



</TabItem>
<TabItem value="Output">

```
Processed a total of 70 messages
{
  "id": "45f3eb08-4422-4504-8236-6eccb591b978",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53796"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:55:26.250918792Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message": "Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id": "056b7df1-faed-4812-9d2a-75d3aa3118eb",
  "source": "krn://cluster=A_OiC5SRRuCYf3vkbsYqBA",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:53796"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:55:26.812908501Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message": "Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/cqv5iqfMqBlXRyYeuLVW8EaOX.svg)](https://asciinema.org/a/cqv5iqfMqBlXRyYeuLVW8EaOX)

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
 Container gateway1  Stopping
 Container schema-registry  Stopping
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
 Container kafka2  Stopping
 Container kafka1  Stopping
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network safeguard-combinaison_default  Removing
 Network safeguard-combinaison_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/NEHnyLUYsnS1eSuaOhbVEaNpk.svg)](https://asciinema.org/a/NEHnyLUYsnS1eSuaOhbVEaNpk)

</TabItem>
</Tabs>

# Conclusion

Safeguard is really a game changer!

