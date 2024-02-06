---
title: Encryption full payload
description: Encryption full payload
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Field level encryption

Let's demonstrate full payload encryption

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/TU6ROM5DAnJoaK4RsLkKOzK6O.svg)](https://asciinema.org/a/TU6ROM5DAnJoaK4RsLkKOzK6O)

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
 Container kafka2  Running
 Container kafka3  Running
 Container kafka1  Running
 Container gateway2  Running
 Container schema-registry  Running
 Container gateway1  Running
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container gateway2  Healthy
 Container kafka2  Healthy
 Container zookeeper  Healthy
 Container kafka1  Healthy
 Container gateway1  Healthy
 Container kafka3  Healthy
 Container schema-registry  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/bnDAd0FuuMQQaGsJIYOkRiUJO.svg)](https://asciinema.org/a/bnDAd0FuuMQQaGsJIYOkRiUJO)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNDQ1MTcxMn0.VUgL0txBDQf_8QXuL3YHGiOjR4pQE6DPYQqsPxz3JkY';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/S1hT3OiuwN7PXUtUAXs8k1Ixt.svg)](https://asciinema.org/a/S1hT3OiuwN7PXUtUAXs8k1Ixt)

</TabItem>
</Tabs>

## Creating topic customers on teamA

Creating on `teamA`:

* Topic `customers` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic customers
```


</TabItem>
<TabItem value="Output">

```
Created topic customers.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/gHx2CY2Hcpc3KYNkHBLzN190W.svg)](https://asciinema.org/a/gHx2CY2Hcpc3KYNkHBLzN190W)

</TabItem>
</Tabs>

## Adding interceptor encrypt-full-payload

We want to encrypt the full payload with an in memory KMS.

<Tabs>
<TabItem value="Command">


```sh
cat step-07-encrypt-full-payload.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/encrypt-full-payload" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-07-encrypt-full-payload.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
  "priority": 100,
  "config": {
    "payload": {
      "keySecretId": "full-payload-secret",
      "algorithm": {
        "type": "AES_GCM",
        "kms": "IN_MEMORY"
      }
    }
  }
}
{
  "message": "encrypt-full-payload is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/0S13oM5bJyo8SOLyZhCclfAfX.svg)](https://asciinema.org/a/0S13oM5bJyo8SOLyZhCclfAfX)

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
      "name": "encrypt-full-payload",
      "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
      "apiKey": null,
      "priority": 100,
      "timeoutMs": 9223372036854775807,
      "config": {
        "payload": {
          "keySecretId": "full-payload-secret",
          "algorithm": {
            "type": "AES_GCM",
            "kms": "IN_MEMORY"
          }
        }
      }
    }
  ]
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/bbiuxAKj7Vo0ac3CYNsKh6EHf.svg)](https://asciinema.org/a/bbiuxAKj7Vo0ac3CYNsKh6EHf)

</TabItem>
</Tabs>

## Let's send unencrypted json

We are using regular kafka tools

<Tabs>
<TabItem value="Command">


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
with


```sh
echo '{"name":"tom","username":"tom@conduktor.io","password":"motorhead","visa":"#abc123","address":"Chancery lane, London"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic customers

echo '{"name":"laura","username":"laura@conduktor.io","password":"kitesurf","visa":"#888999XZ;","address":"Dubai, UAE"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic customers
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/tyH5gVHD4WEC0BJt8P9ogujW8.svg)](https://asciinema.org/a/tyH5gVHD4WEC0BJt8P9ogujW8)

</TabItem>
</Tabs>

## Let's consume the message, and confirm tom and laura data is encrypted

Let's consume the message, and confirm tom and laura data is encrypted in cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic customers \
    --from-beginning \
    --timeout-ms 10000 | jq
```


returns 2 events
```json
�BZ���1�H�\׿I��"%����t�o�}�[�)��	��ބ�v��Ѓp��)���M��,�Ρ����Vqu,ƽQ��G@�p!Ee�����rG����O>��@��6�q�$VAhas�&ֱ^q��n�`/rZ΄ֶ���F,��
�BZ�.�J���@����je�l@�ny�Gʅ�x}8=W���.���Զ	����D�:�[Jn}�^\��3o$�yt��Aט���3X���B��wAGZT��w�D�� �Vr��XU>�O;#��!H��B>�sD��p���kzO
```


</TabItem>
<TabItem value="Output">

```json
jq: parse error: Invalid numeric literal at line 1, column 41
[2024-01-31 05:35:28,466] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/RbozTMPnfTkMLxy2dU4vnh1UQ.svg)](https://asciinema.org/a/RbozTMPnfTkMLxy2dU4vnh1UQ)

</TabItem>
</Tabs>

## Adding interceptor decrypt-full-payload

Let's add the decrypt interceptor to decipher messages

<Tabs>
<TabItem value="Command">


```sh
cat step-11-decrypt-full-payload.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/decrypt-full-payload" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-11-decrypt-full-payload.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "pluginClass": "io.conduktor.gateway.interceptor.DecryptPlugin",
  "priority": 100,
  "config": {
    "topic": "customers",
    "kmsConfig": {
      "vault": {
        "uri": "http://vault:8200",
        "token": "vault-plaintext-root-token",
        "version": 1
      }
    }
  }
}
{
  "message": "decrypt-full-payload is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/jJ8TOEjYKwiWDUWgy9bfGx4aA.svg)](https://asciinema.org/a/jJ8TOEjYKwiWDUWgy9bfGx4aA)

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
      "name": "decrypt-full-payload",
      "pluginClass": "io.conduktor.gateway.interceptor.DecryptPlugin",
      "apiKey": null,
      "priority": 100,
      "timeoutMs": 9223372036854775807,
      "config": {
        "topic": "customers",
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "vault-plaintext-root-token",
            "version": 1
          }
        }
      }
    },
    {
      "name": "encrypt-full-payload",
      "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
      "apiKey": null,
      "priority": 100,
      "timeoutMs": 9223372036854775807,
      "config": {
        "payload": {
          "keySecretId": "full-payload-secret",
          "algorithm": {
            "type": "AES_GCM",
            "kms": "IN_MEMORY"
          }
        }
      }
    }
  ]
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/HpdfCvFA6h2ue7o6vKpKS6hRF.svg)](https://asciinema.org/a/HpdfCvFA6h2ue7o6vKpKS6hRF)

</TabItem>
</Tabs>

## Confirm message from tom and laura are decrypted

Confirm message from tom and laura are decrypted in cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic customers \
    --from-beginning \
    --timeout-ms 10000 | jq
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


</TabItem>
<TabItem value="Output">

```json
[2024-01-31 05:35:40,600] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
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

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ad5iWes57qV20exUkDE7UjvHi.svg)](https://asciinema.org/a/ad5iWes57qV20exUkDE7UjvHi)

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
 Container gateway1  Stopping
 Container schema-registry  Stopping
 Container gateway2  Stopping
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway2  Removed
 Container gateway1  Removed
 Container schema-registry  Removed
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container kafka3  Removed
 Container kafka2  Removed
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network encryption-payload_default  Removing
 Network encryption-payload_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/DGzgkBOg37Ui7JF2OCodTkRao.svg)](https://asciinema.org/a/DGzgkBOg37Ui7JF2OCodTkRao)

</TabItem>
</Tabs>

# Conclusion

Yes, encryption in the Kafka world can be simple!

