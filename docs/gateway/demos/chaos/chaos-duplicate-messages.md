---
title: Chaos Duplicate Messages
description: Chaos Duplicate Messages
tag: chaos
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Chaos Simulate Duplicate Messages

This interceptor injects duplicate records on produce requests.

This demo will run you through some of these use cases step-by-step.

## View the full demo in realtime




You can either follow all the steps manually, or watch the recording

[![asciicast](https://asciinema.org/a/P7uHnIXy7U1tuvjgEvbyLHwOI.svg)](https://asciinema.org/a/P7uHnIXy7U1tuvjgEvbyLHwOI)

## Review the docker compose environment

As can be seen from `docker-compose.yaml` the demo environment consists of the following services:

* gateway1
* gateway2
* kafka-client
* kafka1
* kafka2
* kafka3
* schema-registry

```sh
cat docker-compose.yaml
```

<details>
<summary>File content</summary>

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

</details>

## Starting the docker environment

Start all your docker processes, wait for them to be up and ready, then run in background

* `--wait`: Wait for services to be `running|healthy`. Implies detached mode.
* `--detach`: Detached mode: Run containers in the background


<details open>
<summary>Command</summary>



```sh
docker compose up --detach --wait
```



</details>
<details>
<summary>Output</summary>

```
 Network chaos-duplicate-messages_default  Creating
 Network chaos-duplicate-messages_default  Created
 Container kafka2  Creating
 Container kafka-client  Creating
 Container kafka3  Creating
 Container kafka1  Creating
 Container kafka1  Created
 Container kafka-client  Created
 Container kafka2  Created
 Container kafka3  Created
 Container gateway2  Creating
 Container schema-registry  Creating
 Container gateway1  Creating
 Container gateway2  Created
 Container schema-registry  Created
 Container gateway1  Created
 Container kafka3  Starting
 Container kafka1  Starting
 Container kafka-client  Starting
 Container kafka2  Starting
 Container kafka1  Started
 Container kafka3  Started
 Container kafka2  Started
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka-client  Started
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container gateway2  Starting
 Container kafka2  Healthy
 Container gateway1  Starting
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container schema-registry  Starting
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
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka-client  Healthy
 Container gateway2  Healthy
 Container gateway1  Healthy
 Container schema-registry  Healthy

```

</details>
<details>
<summary>Recording</summary>

[![asciicast](https://asciinema.org/a/cZrKG2NpGb4Br7D0KrGL7aHAz.svg)](https://asciinema.org/a/cZrKG2NpGb4Br7D0KrGL7aHAz)

</details>

## Creating topic topic-duplicate on gateway1

Creating on `gateway1`:

* Topic `topic-duplicate` with partitions:1 and replication-factor:1


<details open>
<summary>Command</summary>



```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic topic-duplicate
```



</details>
<details>
<summary>Output</summary>

```
Created topic topic-duplicate.

```

</details>
<details>
<summary>Recording</summary>

[![asciicast](https://asciinema.org/a/HOdqruZB1Y5HHsZuQN1ylQCfk.svg)](https://asciinema.org/a/HOdqruZB1Y5HHsZuQN1ylQCfk)

</details>

## Adding interceptor duplicate-messages

Let's create the interceptor, instructing Conduktor Gateway to inject duplicate records on produce requests.

<details open>
<summary>step-06-duplicate-messages-interceptor.json</summary>

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "duplicate-messages"
  },
  "spec" : {
    "comment" : "Adding interceptor: duplicate-messages",
    "pluginClass" : "io.conduktor.gateway.interceptor.chaos.DuplicateMessagesPlugin",
    "priority" : 100,
    "config" : {
      "rateInPercent" : 100,
      "topic" : "topic-duplicate",
      "target" : "PRODUCE"
    }
  }
}
```
</details>

<details open>
<summary>Command</summary>



```sh
curl \
    --silent \
    --request PUT "http://localhost:8888/gateway/v2/interceptor" \
    --header "Content-Type: application/json" \
    --user "admin:conduktor" \
    --data @step-06-duplicate-messages-interceptor.json | jq
```



</details>
<details>
<summary>Output</summary>

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "duplicate-messages",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: duplicate-messages",
      "pluginClass": "io.conduktor.gateway.interceptor.chaos.DuplicateMessagesPlugin",
      "priority": 100,
      "config": {
        "rateInPercent": 100,
        "topic": "topic-duplicate",
        "target": "PRODUCE"
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</details>
<details>
<summary>Recording</summary>

[![asciicast](https://asciinema.org/a/RBCf2PMZxz0P1ifoVUyyAKcvJ.svg)](https://asciinema.org/a/RBCf2PMZxz0P1ifoVUyyAKcvJ)

</details>

## Listing interceptors

Listing interceptors on `gateway1`


<details open>
<summary>Command</summary>



```sh
curl \
    --silent \
    --request GET "http://localhost:8888/gateway/v2/interceptor" \
    --user "admin:conduktor" | jq
```



</details>
<details>
<summary>Output</summary>

```json
[
  {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "duplicate-messages",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: duplicate-messages",
      "pluginClass": "io.conduktor.gateway.interceptor.chaos.DuplicateMessagesPlugin",
      "priority": 100,
      "config": {
        "rateInPercent": 100,
        "topic": "topic-duplicate",
        "target": "PRODUCE"
      }
    }
  }
]

```

</details>
<details>
<summary>Recording</summary>

[![asciicast](https://asciinema.org/a/Gu2HcnCZ2ox1buigikkxZdHOA.svg)](https://asciinema.org/a/Gu2HcnCZ2ox1buigikkxZdHOA)

</details>

## Send message to our created topic

Producing 1 message in `topic-duplicate` in cluster `gateway1`


<details open>
<summary>Command</summary>



Sending 1 event
```json
{
  "message" : "hello world"
}
```

```sh
echo '{"message": "hello world"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic topic-duplicate
```



</details>
<details>
<summary>Output</summary>

```

```

</details>
<details>
<summary>Recording</summary>

[![asciicast](https://asciinema.org/a/RHrAjQffwC8vrSW2X457EwDuF.svg)](https://asciinema.org/a/RHrAjQffwC8vrSW2X457EwDuF)

</details>

## Let's consume the message, and confirm message was duplicated

Let's consume the message, and confirm message was duplicated in cluster `gateway1`


<details open>
<summary>Command</summary>



```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic topic-duplicate \
    --from-beginning \
    --max-messages 3 \
    --timeout-ms 3000 | jq
```


returns 2 events
```json
{
  "message" : "hello world"
}
{
  "message" : "hello world"
}
```


</details>
<details>
<summary>Output</summary>

```json
[2024-10-29 19:03:21,013] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages
{
  "message": "hello world"
}
{
  "message": "hello world"
}

```

</details>
<details>
<summary>Recording</summary>

[![asciicast](https://asciinema.org/a/k3cFTWpA4DjhCJzVNcVXRAYgH.svg)](https://asciinema.org/a/k3cFTWpA4DjhCJzVNcVXRAYgH)

</details>

## Tearing down the docker environment

Remove all your docker processes and associated volumes

* `--volumes`: Remove named volumes declared in the "volumes" section of the Compose file and anonymous volumes attached to containers.


<details open>
<summary>Command</summary>



```sh
docker compose down --volumes
```



</details>
<details>
<summary>Output</summary>

```
 Container gateway1  Stopping
 Container schema-registry  Stopping
 Container kafka-client  Stopping
 Container gateway2  Stopping
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway1  Removed
 Container gateway2  Removed
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container schema-registry  Removed
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka1  Removed
 Container kafka2  Removed
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Network chaos-duplicate-messages_default  Removing
 Network chaos-duplicate-messages_default  Removed

```

</details>
<details>
<summary>Recording</summary>

[![asciicast](https://asciinema.org/a/b3RYges0ttWgO01PpNxg19OHm.svg)](https://asciinema.org/a/b3RYges0ttWgO01PpNxg19OHm)

</details>

# Conclusion

Yes, Chaos Simulate Duplicate Messages is simple as it!

