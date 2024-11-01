---
title: Chaos Simulate Message Corruption
description: Chaos Simulate Message Corruption
tag: chaos
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Chaos Simulate Message Corruption

This interceptor simulates message corruption by appending random bytes to messages produced.

This demo will run you through some of these use cases step-by-step.

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ypZ3iDrpQtbtGgjEo6lm1W59Q.svg)](https://asciinema.org/a/ypZ3iDrpQtbtGgjEo6lm1W59Q)

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

<Tabs>
<TabItem value="Command">

```sh
cat docker-compose.yaml
```

</TabItem>
<TabItem value="File Content">

```yaml
services:
  kafka1:
    image: confluentinc/cp-server:7.5.0
    hostname: kafka1
    container_name: kafka1
    ports:
    - 9092:9092
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_LISTENERS: INTERNAL://kafka1:29092,CONTROLLER://kafka1:29093,EXTERNAL://0.0.0.0:9092
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka1:29092,EXTERNAL://localhost:9092
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka1:29093,2@kafka2:29093,3@kafka3:29093
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
      CLUSTER_ID: p0KPFA_mQb2ixdPbQXPblw
    healthcheck:
      test: nc -zv kafka1 29092 || exit 1
      interval: 5s
      retries: 25
  kafka2:
    image: confluentinc/cp-server:7.5.0
    hostname: kafka2
    container_name: kafka2
    ports:
    - 9093:9093
    environment:
      KAFKA_NODE_ID: 2
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_LISTENERS: INTERNAL://kafka2:29092,CONTROLLER://kafka2:29093,EXTERNAL://0.0.0.0:9093
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka2:29092,EXTERNAL://localhost:9093
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka1:29093,2@kafka2:29093,3@kafka3:29093
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
      CLUSTER_ID: p0KPFA_mQb2ixdPbQXPblw
    healthcheck:
      test: nc -zv kafka1 29092 || exit 1
      interval: 5s
      retries: 25
  kafka3:
    image: confluentinc/cp-server:7.5.0
    hostname: kafka3
    container_name: kafka3
    ports:
    - 9094:9094
    environment:
      KAFKA_NODE_ID: 3
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_LISTENERS: INTERNAL://kafka3:29092,CONTROLLER://kafka3:29093,EXTERNAL://0.0.0.0:9094
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka3:29092,EXTERNAL://localhost:9094
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka1:29093,2@kafka2:29093,3@kafka3:29093
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
      CLUSTER_ID: p0KPFA_mQb2ixdPbQXPblw
    healthcheck:
      test: nc -zv kafka3 29092 || exit 1
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
      SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS: kafka1:29092,kafka2:29092,kafka3:29092
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
    image: conduktor/conduktor-gateway:3.3.2
    hostname: gateway1
    container_name: gateway1
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:29092,kafka2:29092,kafka3:29092
      GATEWAY_ADVERTISED_HOST: localhost
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
    - 6972:6972
    - 8888:8888
    healthcheck:
      test: curl localhost:8888/health
      interval: 5s
      retries: 25
  gateway2:
    image: conduktor/conduktor-gateway:3.3.2
    hostname: gateway2
    container_name: gateway2
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:29092,kafka2:29092,kafka3:29092
      GATEWAY_ADVERTISED_HOST: localhost
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
    - 7969:6969
    - 7970:6970
    - 7971:6971
    - 7972:6972
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
 Network chaos-simulate-message-corruption_default  Creating
 Network chaos-simulate-message-corruption_default  Created
 Container kafka1  Creating
 Container kafka-client  Creating
 Container kafka3  Creating
 Container kafka2  Creating
 Container kafka2  Created
 Container kafka-client  Created
 Container kafka3  Created
 Container kafka1  Created
 Container gateway2  Creating
 Container schema-registry  Creating
 Container gateway1  Creating
 Container gateway2  Created
 Container gateway1  Created
 Container schema-registry  Created
 Container kafka-client  Starting
 Container kafka3  Starting
 Container kafka2  Starting
 Container kafka1  Starting
 Container kafka2  Started
 Container kafka3  Started
 Container kafka-client  Started
 Container kafka1  Started
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container schema-registry  Starting
 Container gateway2  Starting
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container gateway1  Starting
 Container gateway2  Started
 Container schema-registry  Started
 Container gateway1  Started
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container kafka1  Waiting
 Container kafka1  Healthy
 Container kafka-client  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container gateway1  Healthy
 Container schema-registry  Healthy
container gateway2 exited (96)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ly8TPbTFSYtXlHl3wouzDCmaK.svg)](https://asciinema.org/a/ly8TPbTFSYtXlHl3wouzDCmaK)

</TabItem>
</Tabs>

## Creating topic with-random-bytes on gateway1

Creating on `gateway1`:

* Topic `with-random-bytes` with partitions:1 and replication-factor:1






<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic with-random-bytes
```


</TabItem>
<TabItem value="Output">

```
Created topic with-random-bytes.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ByCUohAGdPxbAC59xHOZhfOHj.svg)](https://asciinema.org/a/ByCUohAGdPxbAC59xHOZhfOHj)

</TabItem>
</Tabs>

## Adding interceptor simulate-massage-corruption

Let's create the interceptor, instructing Conduktor Gateway to simulate message corruption by appending random bytes to messages produced.




`step-06-simulate-massage-corruption-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "simulate-massage-corruption"
  },
  "spec" : {
    "comment" : "Adding interceptor: simulate-massage-corruption",
    "pluginClass" : "io.conduktor.gateway.interceptor.chaos.ProduceSimulateMessageCorruptionPlugin",
    "priority" : 100,
    "config" : {
      "topic" : "with-random-bytes",
      "sizeInBytes" : 10,
      "rateInPercent" : 100
    }
  }
}
```


<Tabs>

<TabItem value="Command">
```sh
curl \
    --silent \
    --request PUT "http://localhost:8888/gateway/v2/interceptor" \
    --header "Content-Type: application/json" \
    --user "admin:conduktor" \
    --data @step-06-simulate-massage-corruption-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "simulate-massage-corruption",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: simulate-massage-corruption",
      "pluginClass": "io.conduktor.gateway.interceptor.chaos.ProduceSimulateMessageCorruptionPlugin",
      "priority": 100,
      "config": {
        "topic": "with-random-bytes",
        "sizeInBytes": 10,
        "rateInPercent": 100
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/o279y8syJdf0J2e38weGjtBxa.svg)](https://asciinema.org/a/o279y8syJdf0J2e38weGjtBxa)

</TabItem>
</Tabs>

## Listing interceptors

Listing interceptors on `gateway1`






<Tabs>

<TabItem value="Command">
```sh
curl \
    --silent \
    --request GET "http://localhost:8888/gateway/v2/interceptor" \
    --user "admin:conduktor" | jq
```


</TabItem>
<TabItem value="Output">

```json
[
  {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "simulate-massage-corruption",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: simulate-massage-corruption",
      "pluginClass": "io.conduktor.gateway.interceptor.chaos.ProduceSimulateMessageCorruptionPlugin",
      "priority": 100,
      "config": {
        "topic": "with-random-bytes",
        "sizeInBytes": 10,
        "rateInPercent": 100
      }
    }
  }
]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/CjhDojvpvJqgNyWP07vXs8wCg.svg)](https://asciinema.org/a/CjhDojvpvJqgNyWP07vXs8wCg)

</TabItem>
</Tabs>

## Send message to our created topic

Producing 1 message in `with-random-bytes` in cluster `gateway1`




Sending 1 event
```json
{
  "message" : "hello world"
}
```



<Tabs>

<TabItem value="Command">
```sh
echo '{"message": "hello world"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic with-random-bytes
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/GnoUa6rgtL86gNNK6tfWH5gHz.svg)](https://asciinema.org/a/GnoUa6rgtL86gNNK6tfWH5gHz)

</TabItem>
</Tabs>

## Let's consume the message, and confirm message was appended random bytes

This should produce output similar to this:

```
{"message": "hello world"}T[�   �X�{�
```






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic with-random-bytes \
    --from-beginning \
    --max-messages 2 \
    --timeout-ms 3000 
```


</TabItem>
<TabItem value="Output">

```
,M7�"D0ق{"message": "hello world"}
[2024-10-29 19:21:07,867] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/kfeuMVu3VG7Mrr4Pe0oCQqt3I.svg)](https://asciinema.org/a/kfeuMVu3VG7Mrr4Pe0oCQqt3I)

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
 Container schema-registry  Stopping
 Container gateway1  Stopping
 Container gateway2  Stopping
 Container kafka-client  Stopping
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
 Container kafka1  Stopping
 Container kafka3  Stopping
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka2  Removed
 Container kafka3  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Network chaos-simulate-message-corruption_default  Removing
 Network chaos-simulate-message-corruption_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/JyzjIHGY4dudShpBlnu1LD4BC.svg)](https://asciinema.org/a/JyzjIHGY4dudShpBlnu1LD4BC)

</TabItem>
</Tabs>

# Conclusion

Yes, Chaos Simulate Message Corruption is simple as it!

