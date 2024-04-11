---
title: Multi tenancy
description: Multi tenancy
tag: ops
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Multi-tenancy, virtual clusters



## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/BxcusMZqkq6pDzWfhTaP8k14J.svg)](https://asciinema.org/a/BxcusMZqkq6pDzWfhTaP8k14J)

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
    image: conduktor/conduktor-gateway:3.0.0
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
    image: conduktor/conduktor-gateway:3.0.0
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
 Network multi-tenancy_default  Creating
 Network multi-tenancy_default  Created
 Container kafka-client  Creating
 Container zookeeper  Creating
 Container kafka-client  Created
 Container zookeeper  Created
 Container kafka3  Creating
 Container kafka1  Creating
 Container kafka2  Creating
 Container kafka2  Created
 Container kafka3  Created
 Container kafka1  Created
 Container schema-registry  Creating
 Container gateway2  Creating
 Container gateway1  Creating
 Container gateway2  Created
 Container gateway1  Created
 Container schema-registry  Created
 Container zookeeper  Starting
 Container kafka-client  Starting
 Container zookeeper  Started
 Container zookeeper  Waiting
 Container kafka-client  Started
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Healthy
 Container kafka2  Starting
 Container zookeeper  Healthy
 Container kafka1  Starting
 Container zookeeper  Healthy
 Container kafka3  Starting
 Container kafka3  Started
 Container kafka1  Started
 Container kafka2  Started
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container gateway2  Starting
 Container kafka1  Healthy
 Container schema-registry  Starting
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container gateway1  Starting
 Container gateway1  Started
 Container schema-registry  Started
 Container gateway2  Started
 Container kafka-client  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka2  Healthy
 Container zookeeper  Healthy
 Container kafka1  Healthy
 Container kafka-client  Healthy
 Container kafka3  Healthy
 Container gateway2  Healthy
 Container schema-registry  Healthy
 Container gateway1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/q9odKF9dSc2ma1t2uSZ9879p1.svg)](https://asciinema.org/a/q9odKF9dSc2ma1t2uSZ9879p1)

</TabItem>
</Tabs>

## Listing topics in kafka1



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
_conduktor_gateway_acls
_conduktor_gateway_auditlogs
_conduktor_gateway_consumer_offsets
_conduktor_gateway_consumer_subscriptions
_conduktor_gateway_encryption_configs
_conduktor_gateway_interceptor_configs
_conduktor_gateway_license
_conduktor_gateway_topicmappings
_conduktor_gateway_usermappings
_schemas

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/R7oOgiaVPUhPo6iVaHlC0upG7.svg)](https://asciinema.org/a/R7oOgiaVPUhPo6iVaHlC0upG7)

</TabItem>
</Tabs>

## Creating virtual cluster london

Creating virtual cluster `london` on gateway `gateway1` and reviewing the configuration file to access it

<Tabs>
<TabItem value="Command">


```sh
# Generate virtual cluster london with service account sa
token=$(curl \
    --request POST "http://localhost:8888/admin/vclusters/v1/vcluster/london/username/sa" \
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
""" > london-sa.properties

# Review file
cat london-sa.properties
```


</TabItem>
<TabItem value="Output">

```

bootstrap.servers=localhost:6969
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJsb25kb24iLCJleHAiOjE3MjA0Nzg1MTl9.AXgPo-n9UAsw1TCj1F0rMVXHsQfYhAAkZYwDlhyiHSU';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/fCr9umhRp9ioqhJh1QjzsNhss.svg)](https://asciinema.org/a/fCr9umhRp9ioqhJh1QjzsNhss)

</TabItem>
</Tabs>

## Creating virtual cluster paris

Creating virtual cluster `paris` on gateway `gateway1` and reviewing the configuration file to access it

<Tabs>
<TabItem value="Command">


```sh
# Generate virtual cluster paris with service account sa
token=$(curl \
    --request POST "http://localhost:8888/admin/vclusters/v1/vcluster/paris/username/sa" \
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
""" > paris-sa.properties

# Review file
cat paris-sa.properties
```


</TabItem>
<TabItem value="Output">

```

bootstrap.servers=localhost:6969
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJwYXJpcyIsImV4cCI6MTcyMDQ3ODUxOX0.Jb9TRqossTJCuCkXBh-CmW7AUI-TgTJ8Ap-GGDIP1kE';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ZRtCCTYE7ZjdgLteUt89XcFbS.svg)](https://asciinema.org/a/ZRtCCTYE7ZjdgLteUt89XcFbS)

</TabItem>
</Tabs>

## Creating topic londonTopic on london

Creating on `london`:

* Topic `londonTopic` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config london-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic londonTopic
```


</TabItem>
<TabItem value="Output">

```
Created topic londonTopic.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/nxiwufKqVdG3ws1xx6ZsWusfh.svg)](https://asciinema.org/a/nxiwufKqVdG3ws1xx6ZsWusfh)

</TabItem>
</Tabs>

## Creating topic parisTopic on paris

Creating on `paris`:

* Topic `parisTopic` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config paris-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic parisTopic
```


</TabItem>
<TabItem value="Output">

```
Created topic parisTopic.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/hkZfW64HExTAe9vxC5PcQfsNK.svg)](https://asciinema.org/a/hkZfW64HExTAe9vxC5PcQfsNK)

</TabItem>
</Tabs>

## Listing topics in london



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config london-sa.properties \
    --list
```


</TabItem>
<TabItem value="Output">

```
londonTopic

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/kcmqVlrIGPEJgq8wWU568pOdw.svg)](https://asciinema.org/a/kcmqVlrIGPEJgq8wWU568pOdw)

</TabItem>
</Tabs>

## Listing topics in paris



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config paris-sa.properties \
    --list
```


</TabItem>
<TabItem value="Output">

```
parisTopic

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/OJp6TPM7u2gQhkw9EMCR6C7Ko.svg)](https://asciinema.org/a/OJp6TPM7u2gQhkw9EMCR6C7Ko)

</TabItem>
</Tabs>

## Producing 1 message in londonTopic

Producing 1 message in `londonTopic` in cluster `london`

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{"message: "Hello from London"}
```
with


```sh
echo '{"message: "Hello from London"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config london-sa.properties \
        --topic londonTopic
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/w1bygJbaU6Yj341ujK4pEXCAy.svg)](https://asciinema.org/a/w1bygJbaU6Yj341ujK4pEXCAy)

</TabItem>
</Tabs>

## Consuming from londonTopic

Consuming from londonTopic in cluster `london`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config london-sa.properties \
    --topic londonTopic \
    --from-beginning \
    --timeout-ms 10000 | jq
```


</TabItem>
<TabItem value="Output">

```json
jq: parse error: Invalid numeric literal at line 1, column 18
[2024-04-10 02:42:17,493] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/9xGXP85o79CWsFfKhyiNiPedi.svg)](https://asciinema.org/a/9xGXP85o79CWsFfKhyiNiPedi)

</TabItem>
</Tabs>

## Producing 1 message in parisTopic

Producing 1 message in `parisTopic` in cluster `paris`

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{"message: "Bonjour depuis Paris"}
```
with


```sh
echo '{"message: "Bonjour depuis Paris"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config paris-sa.properties \
        --topic parisTopic
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/cLnHulqyLBBQHfgkbtUAtaJ50.svg)](https://asciinema.org/a/cLnHulqyLBBQHfgkbtUAtaJ50)

</TabItem>
</Tabs>

## Consuming from parisTopic

Consuming from parisTopic in cluster `paris`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config paris-sa.properties \
    --topic parisTopic \
    --from-beginning \
    --timeout-ms 10000 | jq
```


</TabItem>
<TabItem value="Output">

```json
jq: parse error: Invalid numeric literal at line 1, column 20
[2024-04-10 02:42:30,664] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/XCPoD3xWTMjBuGHKsYL0MA3Rg.svg)](https://asciinema.org/a/XCPoD3xWTMjBuGHKsYL0MA3Rg)

</TabItem>
</Tabs>

## Creating topic existingLondonTopic on kafka1

Creating on `kafka1`:

* Topic `existingLondonTopic` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic existingLondonTopic
```


</TabItem>
<TabItem value="Output">

```
Created topic existingLondonTopic.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Ch3dkjByEnX4zjCS7tmfPaFQB.svg)](https://asciinema.org/a/Ch3dkjByEnX4zjCS7tmfPaFQB)

</TabItem>
</Tabs>

## Producing 1 message in existingLondonTopic

Producing 1 message in `existingLondonTopic` in cluster `kafka1`

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{"message: "Hello from London"}
```
with


```sh
echo '{"message: "Hello from London"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
        --topic existingLondonTopic
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/VOKC5FDiTVHfYA4MfaBLqijRW.svg)](https://asciinema.org/a/VOKC5FDiTVHfYA4MfaBLqijRW)

</TabItem>
</Tabs>

## Map the existing topic to the virtual cluster



<Tabs>
<TabItem value="Command">


```sh
curl \
  --silent \
  --request POST localhost:8888/admin/vclusters/v1/vcluster/london/topics/existingLondonTopic \
  --user 'admin:conduktor' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "physicalTopicName": "existingLondonTopic",
      "readOnly": false,
      "type": "alias"
    }' | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "logicalTopicName": "existingLondonTopic",
  "clusterId": "main",
  "physicalTopicName": "existingLondonTopic",
  "readOnly": false,
  "type": "ALIAS"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/zXS1hytiuvS9Hf6jsPG3BKrvD.svg)](https://asciinema.org/a/zXS1hytiuvS9Hf6jsPG3BKrvD)

</TabItem>
</Tabs>

## Listing topics in london



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config london-sa.properties \
    --list
```


</TabItem>
<TabItem value="Output">

```
existingLondonTopic
londonTopic

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/6X4EFSLWilXJU346ll9sfewRY.svg)](https://asciinema.org/a/6X4EFSLWilXJU346ll9sfewRY)

</TabItem>
</Tabs>

## Creating topic existingSharedTopic on kafka1

Creating on `kafka1`:

* Topic `existingSharedTopic` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic existingSharedTopic
```


</TabItem>
<TabItem value="Output">

```
Created topic existingSharedTopic.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/RX6GN68lQHWNSNlb8DViA5gf8.svg)](https://asciinema.org/a/RX6GN68lQHWNSNlb8DViA5gf8)

</TabItem>
</Tabs>

## Producing 1 message in existingSharedTopic

Producing 1 message in `existingSharedTopic` in cluster `kafka1`

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "message" : "Existing shared message"
}
```
with


```sh
echo '{"message": "Existing shared message"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
        --topic existingSharedTopic
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/zSR2Mju7o2rPp5wIUmZxuqNwO.svg)](https://asciinema.org/a/zSR2Mju7o2rPp5wIUmZxuqNwO)

</TabItem>
</Tabs>

## Map the existing topic to the virtual cluster



<Tabs>
<TabItem value="Command">


```sh
curl \
  --silent \
  --request POST localhost:8888/admin/vclusters/v1/vcluster/london/topics/existingSharedTopic \
  --user 'admin:conduktor' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "physicalTopicName": "existingSharedTopic",
    "readOnly": false,
    "type": "alias"
  }' | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "logicalTopicName": "existingSharedTopic",
  "clusterId": "main",
  "physicalTopicName": "existingSharedTopic",
  "readOnly": false,
  "type": "ALIAS"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/UtXNCrUnT9Tkx4kBRfke9VEhZ.svg)](https://asciinema.org/a/UtXNCrUnT9Tkx4kBRfke9VEhZ)

</TabItem>
</Tabs>

## Listing topics in london



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config london-sa.properties \
    --list
```


</TabItem>
<TabItem value="Output">

```
existingLondonTopic
existingSharedTopic
londonTopic

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/lcDRxNkXkyifLTqAsAaNMvT1M.svg)](https://asciinema.org/a/lcDRxNkXkyifLTqAsAaNMvT1M)

</TabItem>
</Tabs>

## Consuming from existingLondonTopic

Consuming from existingLondonTopic in cluster `london`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config london-sa.properties \
    --topic existingLondonTopic \
    --from-beginning \
    --timeout-ms 10000 | jq
```


returns 1 event
```json
{"message: "Hello from London"}
```


</TabItem>
<TabItem value="Output">

```json
jq: parse error: Invalid numeric literal at line 1, column 18
[2024-04-10 02:42:50,507] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Qx9jaotXWAh4cIWnjS59zq4UQ.svg)](https://asciinema.org/a/Qx9jaotXWAh4cIWnjS59zq4UQ)

</TabItem>
</Tabs>

## Consuming from existingSharedTopic

Consuming from existingSharedTopic in cluster `london`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config london-sa.properties \
    --topic existingSharedTopic \
    --from-beginning \
    --timeout-ms 10000 | jq
```


returns 1 event
```json
{
  "message" : "Existing shared message"
}
```


</TabItem>
<TabItem value="Output">

```json
[2024-04-10 02:43:02,246] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages
{
  "message": "Existing shared message"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/dBqLCQDwhoeZBf8tS5Mj72XGS.svg)](https://asciinema.org/a/dBqLCQDwhoeZBf8tS5Mj72XGS)

</TabItem>
</Tabs>

## Map the existing topic to the virtual cluster



<Tabs>
<TabItem value="Command">


```sh
curl \
  --silent \
  --request POST localhost:8888/admin/vclusters/v1/vcluster/paris/topics/existingSharedTopic \
  --user 'admin:conduktor' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "physicalTopicName": "existingSharedTopic",
    "readOnly": false,
    "type": "alias"
  }' | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "logicalTopicName": "existingSharedTopic",
  "clusterId": "main",
  "physicalTopicName": "existingSharedTopic",
  "readOnly": false,
  "type": "ALIAS"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/wwOaFirWQJPUQdQpTgxggFONy.svg)](https://asciinema.org/a/wwOaFirWQJPUQdQpTgxggFONy)

</TabItem>
</Tabs>

## Listing topics in paris



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config paris-sa.properties \
    --list
```


</TabItem>
<TabItem value="Output">

```
existingSharedTopic
parisTopic

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/3T7iwV04yIL0PZv0PhwfcQ78j.svg)](https://asciinema.org/a/3T7iwV04yIL0PZv0PhwfcQ78j)

</TabItem>
</Tabs>

## Consuming from existingSharedTopic

Consuming from existingSharedTopic in cluster `paris`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config paris-sa.properties \
    --topic existingSharedTopic \
    --from-beginning \
    --timeout-ms 10000 | jq
```


returns 1 event
```json
{
  "message" : "Existing shared message"
}
```


</TabItem>
<TabItem value="Output">

```json
[2024-04-10 02:43:15,440] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages
{
  "message": "Existing shared message"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/8Jbrt9HBATzt36wWEFxQsgR5U.svg)](https://asciinema.org/a/8Jbrt9HBATzt36wWEFxQsgR5U)

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
 Container gateway1  Stopping
 Container schema-registry  Stopping
 Container gateway2  Stopping
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
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
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
 Network multi-tenancy_default  Removing
 Network multi-tenancy_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/oZcLSk2xWfzD2St8NQAXpEII8.svg)](https://asciinema.org/a/oZcLSk2xWfzD2St8NQAXpEII8)

</TabItem>
</Tabs>

# Conclusion

Multi-tenancy/Virtual clusters is key to be in control of your kafka spend!

