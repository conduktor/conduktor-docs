---
title: Data Masking
description: Data Masking
tag: security
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Data Masking

Let's demonstrate field level data masking

## View the full demo in realtime




You can either follow all the steps manually, or watch the recording

[![asciicast](https://asciinema.org/a/upn0nKNhc6tnFkZtanzngkqn1.svg)](https://asciinema.org/a/upn0nKNhc6tnFkZtanzngkqn1)

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
 Network data-masking_default  Creating
 Network data-masking_default  Created
 Container kafka3  Creating
 Container kafka2  Creating
 Container kafka-client  Creating
 Container kafka1  Creating
 Container kafka1  Created
 Container kafka2  Created
 Container kafka3  Created
 Container gateway2  Creating
 Container schema-registry  Creating
 Container gateway1  Creating
 Container kafka-client  Created
 Container gateway1  Created
 Container gateway2  Created
 Container schema-registry  Created
 Container kafka3  Starting
 Container kafka-client  Starting
 Container kafka2  Starting
 Container kafka1  Starting
 Container kafka1  Started
 Container kafka2  Started
 Container kafka-client  Started
 Container kafka3  Started
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container gateway2  Starting
 Container gateway1  Starting
 Container schema-registry  Starting
 Container gateway1  Started
 Container schema-registry  Started
 Container gateway2  Started
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
 Container schema-registry  Healthy
 Container gateway2  Healthy
 Container gateway1  Healthy

```

</details>
<details>
<summary>Recording</summary>

[![asciicast](https://asciinema.org/a/aTk0bIvhHHegF24CF3EN42VIH.svg)](https://asciinema.org/a/aTk0bIvhHHegF24CF3EN42VIH)

</details>

## Creating topic customers on gateway1

Creating on `gateway1`:

* Topic `customers` with partitions:1 and replication-factor:1


<details open>
<summary>Command</summary>



```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic customers
```



</details>
<details>
<summary>Output</summary>

```
Created topic customers.

```

</details>
<details>
<summary>Recording</summary>

[![asciicast](https://asciinema.org/a/KxgTkJdy2GL7sls8lnhdJqkeT.svg)](https://asciinema.org/a/KxgTkJdy2GL7sls8lnhdJqkeT)

</details>

## Adding interceptor data-masking

We want to data masking only two fields, with an in memory KMS.

<details open>
<summary>step-06-data-masking-interceptor.json</summary>

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "data-masking"
  },
  "spec" : {
    "comment" : "Adding interceptor: data-masking",
    "pluginClass" : "io.conduktor.gateway.interceptor.FieldLevelDataMaskingPlugin",
    "priority" : 100,
    "config" : {
      "policies" : [ {
        "name" : "Mask password",
        "rule" : {
          "type" : "MASK_ALL"
        },
        "fields" : [ "password" ]
      }, {
        "name" : "Mask visa",
        "rule" : {
          "type" : "MASK_LAST_N",
          "maskingChar" : "X",
          "numberOfChars" : 4
        },
        "fields" : [ "visa", "a.b.c", "visa3" ]
      } ]
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
    --data @step-06-data-masking-interceptor.json | jq
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
      "name": "data-masking",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: data-masking",
      "pluginClass": "io.conduktor.gateway.interceptor.FieldLevelDataMaskingPlugin",
      "priority": 100,
      "config": {
        "policies": [
          {
            "name": "Mask password",
            "rule": {
              "type": "MASK_ALL"
            },
            "fields": [
              "password"
            ]
          },
          {
            "name": "Mask visa",
            "rule": {
              "type": "MASK_LAST_N",
              "maskingChar": "X",
              "numberOfChars": 4
            },
            "fields": [
              "visa",
              "a.b.c",
              "visa3"
            ]
          }
        ]
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</details>
<details>
<summary>Recording</summary>

[![asciicast](https://asciinema.org/a/HMSNuQYVYZm8rGA7rHAKXQRwt.svg)](https://asciinema.org/a/HMSNuQYVYZm8rGA7rHAKXQRwt)

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
      "name": "data-masking",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: data-masking",
      "pluginClass": "io.conduktor.gateway.interceptor.FieldLevelDataMaskingPlugin",
      "priority": 100,
      "config": {
        "policies": [
          {
            "name": "Mask password",
            "rule": {
              "type": "MASK_ALL"
            },
            "fields": [
              "password"
            ]
          },
          {
            "name": "Mask visa",
            "rule": {
              "type": "MASK_LAST_N",
              "maskingChar": "X",
              "numberOfChars": 4
            },
            "fields": [
              "visa",
              "a.b.c",
              "visa3"
            ]
          }
        ]
      }
    }
  }
]

```

</details>
<details>
<summary>Recording</summary>

[![asciicast](https://asciinema.org/a/6U9ypNUPxC0FeypXbczfGyLZ8.svg)](https://asciinema.org/a/6U9ypNUPxC0FeypXbczfGyLZ8)

</details>

## Let's send json

We are using regular kafka tools


<details open>
<summary>Command</summary>



Sending 2 events
```json
{
  "name" : "tom",
  "username" : "tom@conduktor.io",
  "password" : "motorhead",
  "visa" : "#abc123",
  "address" : "Chancery lane, London"
}
{
  "name" : "laura",
  "username" : "laura@conduktor.io",
  "password" : "kitesurf",
  "visa" : "#888999XZ;",
  "address" : "Dubai, UAE"
}
```

```sh
echo '{"name":"tom","username":"tom@conduktor.io","password":"motorhead","visa":"#abc123","address":"Chancery lane, London"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic customers

echo '{"name":"laura","username":"laura@conduktor.io","password":"kitesurf","visa":"#888999XZ;","address":"Dubai, UAE"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic customers
```



</details>
<details>
<summary>Output</summary>

```

```

</details>
<details>
<summary>Recording</summary>

[![asciicast](https://asciinema.org/a/AHER05KbjzPGQ0dSuVkRL0voJ.svg)](https://asciinema.org/a/AHER05KbjzPGQ0dSuVkRL0voJ)

</details>

## Let's consume the message, and confirm tom and laura fields are masked

Let's consume the message, and confirm tom and laura fields are masked in cluster `gateway1`


<details open>
<summary>Command</summary>



```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic customers \
    --from-beginning \
    --max-messages 3 \
    --timeout-ms 3000 | jq
```


returns 2 events
```json
{
  "name" : "tom",
  "username" : "tom@conduktor.io",
  "password" : "********",
  "visa" : "#abXXXX",
  "address" : "Chancery lane, London"
}
{
  "name" : "laura",
  "username" : "laura@conduktor.io",
  "password" : "********",
  "visa" : "#88899XXXX",
  "address" : "Dubai, UAE"
}
```


</details>
<details>
<summary>Output</summary>

```json
[2024-10-29 19:54:23,557] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages
{
  "name": "tom",
  "username": "tom@conduktor.io",
  "password": "********",
  "visa": "#abXXXX",
  "address": "Chancery lane, London"
}
{
  "name": "laura",
  "username": "laura@conduktor.io",
  "password": "********",
  "visa": "#88899XXXX",
  "address": "Dubai, UAE"
}

```

</details>
<details>
<summary>Recording</summary>

[![asciicast](https://asciinema.org/a/0bXV7HW59DlrkrdzbrZBfr3Dq.svg)](https://asciinema.org/a/0bXV7HW59DlrkrdzbrZBfr3Dq)

</details>

## Remove interceptor data-masking




<details open>
<summary>Command</summary>



```sh
curl \
    --silent \
    --request DELETE "http://localhost:8888/gateway/v2/interceptor/data-masking" \
    --header "Content-Type: application/json" \
    --user "admin:conduktor" \
    --data-raw '{
  "vCluster" : "passthrough"
}' | jq
```



</details>
<details>
<summary>Output</summary>

```json

```

</details>
<details>
<summary>Recording</summary>

[![asciicast](https://asciinema.org/a/pH8Iovdtgbk8qLvU9tmV9u75r.svg)](https://asciinema.org/a/pH8Iovdtgbk8qLvU9tmV9u75r)

</details>

## Let's consume the message, and confirm tom and laura fields no more masked

Let's consume the message, and confirm tom and laura fields no more masked in cluster `gateway1`


<details open>
<summary>Command</summary>



```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic customers \
    --from-beginning \
    --max-messages 3 \
    --timeout-ms 3000 | jq
```


returns 2 events
```json
{
  "name" : "tom",
  "username" : "tom@conduktor.io",
  "password" : "motorhead",
  "visa" : "#abc123",
  "address" : "Chancery lane, London"
}
{
  "name" : "laura",
  "username" : "laura@conduktor.io",
  "password" : "kitesurf",
  "visa" : "#888999XZ;",
  "address" : "Dubai, UAE"
}
```


</details>
<details>
<summary>Output</summary>

```json
[2024-10-29 19:54:29,450] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages
{
  "name": "tom",
  "username": "tom@conduktor.io",
  "password": "motorhead",
  "visa": "#abc123",
  "address": "Chancery lane, London"
}
{
  "name": "laura",
  "username": "laura@conduktor.io",
  "password": "kitesurf",
  "visa": "#888999XZ;",
  "address": "Dubai, UAE"
}

```

</details>
<details>
<summary>Recording</summary>

[![asciicast](https://asciinema.org/a/i78sidmkLjy8DYNEeLBGcGleJ.svg)](https://asciinema.org/a/i78sidmkLjy8DYNEeLBGcGleJ)

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
 Container gateway2  Stopping
 Container schema-registry  Stopping
 Container kafka-client  Stopping
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway1  Removed
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway2  Removed
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container schema-registry  Removed
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Network data-masking_default  Removing
 Network data-masking_default  Removed

```

</details>
<details>
<summary>Recording</summary>

[![asciicast](https://asciinema.org/a/A8J5bFd5hlsMhV9cFKKORzGYe.svg)](https://asciinema.org/a/A8J5bFd5hlsMhV9cFKKORzGYe)

</details>

# Conclusion

Yes, data masking in the Kafka world can be simple!

