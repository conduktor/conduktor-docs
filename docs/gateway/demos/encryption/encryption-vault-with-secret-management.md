---
title: Encryption using Vault and secret management
description: Encryption using Vault and secret management
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# A full field level with Vault and secret management



## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/UQB3nXBIG5z16dRKGa5L4OBOH.svg)](https://asciinema.org/a/UQB3nXBIG5z16dRKGa5L4OBOH)

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
* vault
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
      VAULT_TOKEN: vault-plaintext-root-token
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
      VAULT_TOKEN: vault-plaintext-root-token
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
  vault:
    image: hashicorp/vault
    healthcheck:
      test: nc -zv 0.0.0.0 8200
      interval: 5s
      retries: 25
    hostname: vault
    environment:
      VAULT_ADDR: http://0.0.0.0:8200
      VAULT_DEV_ROOT_TOKEN_ID: vault-plaintext-root-token
    container_name: vault
    ports:
    - 8200:8200
    command:
    - sh
    - -c
    - (while ! nc -z 127.0.0.1 8200; do sleep 1; echo 'waiting for vault service ...';
      done; export VAULT_ADDR='http://0.0.0.0:8200';vault secrets enable transit;
      vault secrets enable -version=1 kv; vault secrets enable totp ) & vault server
      -dev -dev-listen-address=0.0.0.0:8200
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
 Container vault  Running
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
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka1  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container vault  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container zookeeper  Healthy
 Container kafka1  Healthy
 Container schema-registry  Healthy
 Container kafka3  Healthy
 Container vault  Healthy
 Container gateway2  Healthy
 Container kafka2  Healthy
 Container gateway1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/dGI7U1kLkn1BJnRLAG0cyx2Hn.svg)](https://asciinema.org/a/dGI7U1kLkn1BJnRLAG0cyx2Hn)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNDQ1OTk4NH0.zuhyhQ8E91ghXwcL1hvfzJ2vnoYEt8dhBfX0VhDK3Dg';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/qoFqymojq8qidkWdR65lAblgT.svg)](https://asciinema.org/a/qoFqymojq8qidkWdR65lAblgT)

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

[![asciicast](https://asciinema.org/a/XkQIQIh8NL4Y1mo1AD4pQHUlr.svg)](https://asciinema.org/a/XkQIQIh8NL4Y1mo1AD4pQHUlr)

</TabItem>
</Tabs>

## Listing topics in teamA



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --list
```


</TabItem>
<TabItem value="Output">

```
customers

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/irVxeosMhqidYqr0K08CMjOkv.svg)](https://asciinema.org/a/irVxeosMhqidYqr0K08CMjOkv)

</TabItem>
</Tabs>

## Adding interceptor crypto-shredding-encrypt

Let's ask gateway to encrypt messages using vault and secret management.
The vault token is retrieved from your env variable `${VAULT_TOKEN}`.

<Tabs>
<TabItem value="Command">


```sh
cat step-08-crypto-shredding-encrypt.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/crypto-shredding-encrypt" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-08-crypto-shredding-encrypt.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
  "priority": 100,
  "config": {
    "topic": "customers",
    "kmsConfig": {
      "vault": {
        "uri": "http://vault:8200",
        "token": "${VAULT_TOKEN}",
        "version": 1
      }
    },
    "fields": [
      {
        "fieldName": "password",
        "keySecretId": "vault-kms://vault:8200/transit/keys/secret-for-{{record.value.name}}",
        "algorithm": {
          "type": "AES_GCM",
          "kms": "VAULT"
        }
      },
      {
        "fieldName": "visa",
        "keySecretId": "vault-kms://vault:8200/transit/keys/secret-for-{{record.value.name}}",
        "algorithm": {
          "type": "AES_GCM",
          "kms": "VAULT"
        }
      }
    ]
  }
}
{
  "message": "crypto-shredding-encrypt is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/OiWLJPwpwWmFUZn40k1GzZtoO.svg)](https://asciinema.org/a/OiWLJPwpwWmFUZn40k1GzZtoO)

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
      "name": "crypto-shredding-encrypt",
      "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
      "apiKey": null,
      "priority": 100,
      "timeoutMs": 9223372036854775807,
      "config": {
        "topic": "customers",
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "${VAULT_TOKEN}",
            "version": 1
          }
        },
        "fields": [
          {
            "fieldName": "password",
            "keySecretId": "vault-kms://vault:8200/transit/keys/secret-for-{{record.value.name}}",
            "algorithm": {
              "type": "AES_GCM",
              "kms": "VAULT"
            }
          },
          {
            "fieldName": "visa",
            "keySecretId": "vault-kms://vault:8200/transit/keys/secret-for-{{record.value.name}}",
            "algorithm": {
              "type": "AES_GCM",
              "kms": "VAULT"
            }
          }
        ]
      }
    }
  ]
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/60oF3tePklnb8TgGvk8wLBWuV.svg)](https://asciinema.org/a/60oF3tePklnb8TgGvk8wLBWuV)

</TabItem>
</Tabs>

## Let's produce sample data for tom and laura

Producing 2 messages in `customers` in cluster `teamA`

<Tabs>
<TabItem value="Command">


Sending 2 events
```json
{
  "name" : "laura",
  "username" : "laura@conduktor.io",
  "password" : "kitesurf",
  "visa" : "#888999XZ",
  "address" : "Dubai, UAE"
}
{
  "name" : "tom",
  "username" : "tom@conduktor.io",
  "password" : "motorhead",
  "visa" : "#abc123",
  "address" : "Chancery lane, London"
}
```
with


```sh
echo '{"name":"laura","username":"laura@conduktor.io","password":"kitesurf","visa":"#888999XZ","address":"Dubai, UAE"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic customers

echo '{"name":"tom","username":"tom@conduktor.io","password":"motorhead","visa":"#abc123","address":"Chancery lane, London"}' | \
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

[![asciicast](https://asciinema.org/a/FY2vOizTnhjPsqessqlwHAQmq.svg)](https://asciinema.org/a/FY2vOizTnhjPsqessqlwHAQmq)

</TabItem>
</Tabs>

## Let's consume the message, and confirm tom and laura are encrypted

Let's consume the message, and confirm tom and laura are encrypted in cluster `teamA`

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
  "name" : "laura",
  "username" : "laura@conduktor.io",
  "password" : "AAAABQAAAEl2YXVsdDp2MTorUmdselRNRTB4Rk1wWnJ3ZXdCKy90eDMxY0ZXTW5NZktlME4xSEhRRG9Xc0xOd0I2NmhpekVvSnlWYjdadz09d5B61F6Gda9qndkAF/XFaY3wVpRxAOdGeBdeSRCLTsSYU1adLUA8tIHoqg==",
  "visa" : "AAAABQAAAEl2YXVsdDp2MTpEVUVvUjdmdGpuTVV0WGFPcGVDc1FvdWFnRk9aUkdXMFZEM1YxTVJ2a0JWSldwUklaT093K0h1QUdjMGMxQT091Di38OCx1ofgr8IGo3JkFOSxLqst5PH3R2YpvMTPxG/IrPyYK9Dt0fV3L3U=",
  "address" : "Dubai, UAE"
}
{
  "name" : "tom",
  "username" : "tom@conduktor.io",
  "password" : "AAAABQAAAEl2YXVsdDp2MTpJMlc1SE42eFZ4VDR6aVM3V1JLcGRPVzMxU2JqQVNlVE5ta0YzNHJSMUZrcDA0QWpJMHFYdzBmNEtDdjVaZz095m1Exaah9YGhA/YSMZscio2QbU1zdrKczICP1gCoXGheWhV37p2JSCfKRiw=",
  "visa" : "AAAABQAAAEl2YXVsdDp2MToxZEd5K0NNYnNUdzltU3JwamRXMVpWRCtnTmNKeVpxTGdYMGJhb3kvOGZ1c0pmY2ZpUWVSbFVLZVF4dmdjdz09QI8TvxAProzLQE2maxZKQX1F6Uy7kllhYo+U7Q1spNX4tLXuhd4OWOJk",
  "address" : "Chancery lane, London"
}
```


</TabItem>
<TabItem value="Output">

```json
[2024-01-31 07:53:22,617] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages
{
  "name": "laura",
  "username": "laura@conduktor.io",
  "password": "AAAABQAAAEl2YXVsdDp2MTpjay9nQWFpTjRrZmxTQXZFODl1ZGJBWWFreGt5cEZRSzFBdStnMDR2UW83N0lZSVRqKzJUTlQ1QkhCS0djUT09/M5cGw5exz+A800vqIEhxEM1oVKJ5HK1vjHtZE9KbWcyTA6OBE6DWbJ6qw==",
  "visa": "AAAABQAAAEl2YXVsdDp2MTorRFY0QldHQkNHT09EbVI4RjF2NWZwamtvUTVtMC9HOE5mNmhKNUlFT25yZlFSTDIrYkxseGJGcC9GMlBidz09abIhFbs1j4xibbUg0+gCChiFBx9mp4+VRG/eCuVVM0Ci2MZeH92k3lt2XZw=",
  "address": "Dubai, UAE"
}
{
  "name": "tom",
  "username": "tom@conduktor.io",
  "password": "AAAABQAAAEl2YXVsdDp2MTpsQUpGYThxZC9OV1dsMzZnK2hmUnZkbko4Ni85L3JUTXJPRFh4ZWJ5OCtUU3F0c3ViL0owTjcrS0NuUEdhZz0918WqWhtqyG7ceMhd3BNcQrKDjXANsUIHHugLrZLtL3FFN8DGB8TitwZJGPk=",
  "visa": "AAAABQAAAEl2YXVsdDp2MTpKUTNGWVEwU3VOblpOaC9sSWd4VzdEdVhmdUNzdTlRR2xPY2MxbitUMmY4SDNDVDgvSXR6S0pzZmVjemlBQT09iy7Qti0RD8Y6xcY+fN2aNqC6HRPceGwLV1lKoHYWb+VhEHwdiZ2Nd0i6",
  "address": "Chancery lane, London"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/mnVCsL3SedXqU9fIaYT3FXGPw.svg)](https://asciinema.org/a/mnVCsL3SedXqU9fIaYT3FXGPw)

</TabItem>
</Tabs>

## Adding interceptor crypto-shredding-decrypt

Let's add the decrypt interceptor to decipher messages.
The vault token is retrieved from your env variable `${VAULT_TOKEN}`.

<Tabs>
<TabItem value="Command">


```sh
cat step-12-crypto-shredding-decrypt.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/crypto-shredding-decrypt" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-12-crypto-shredding-decrypt.json | jq
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
        "token": "${VAULT_TOKEN}",
        "version": 1
      }
    }
  }
}
{
  "message": "crypto-shredding-decrypt is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/IFfUGdAU42GdXM7QwdAnNTmvk.svg)](https://asciinema.org/a/IFfUGdAU42GdXM7QwdAnNTmvk)

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
      "name": "crypto-shredding-decrypt",
      "pluginClass": "io.conduktor.gateway.interceptor.DecryptPlugin",
      "apiKey": null,
      "priority": 100,
      "timeoutMs": 9223372036854775807,
      "config": {
        "topic": "customers",
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "${VAULT_TOKEN}",
            "version": 1
          }
        }
      }
    },
    {
      "name": "crypto-shredding-encrypt",
      "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
      "apiKey": null,
      "priority": 100,
      "timeoutMs": 9223372036854775807,
      "config": {
        "topic": "customers",
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "${VAULT_TOKEN}",
            "version": 1
          }
        },
        "fields": [
          {
            "fieldName": "password",
            "keySecretId": "vault-kms://vault:8200/transit/keys/secret-for-{{record.value.name}}",
            "algorithm": {
              "type": "AES_GCM",
              "kms": "VAULT"
            }
          },
          {
            "fieldName": "visa",
            "keySecretId": "vault-kms://vault:8200/transit/keys/secret-for-{{record.value.name}}",
            "algorithm": {
              "type": "AES_GCM",
              "kms": "VAULT"
            }
          }
        ]
      }
    }
  ]
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/AD6JLclnbT1G8XSwskI3WS5x8.svg)](https://asciinema.org/a/AD6JLclnbT1G8XSwskI3WS5x8)

</TabItem>
</Tabs>

## Confirm message from tom and laura are encrypted

Confirm message from tom and laura are encrypted in cluster `teamA`

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
  "name" : "laura",
  "username" : "laura@conduktor.io",
  "password" : "kitesurf",
  "visa" : "#888999XZ",
  "address" : "Dubai, UAE"
}
{
  "name" : "tom",
  "username" : "tom@conduktor.io",
  "password" : "motorhead",
  "visa" : "#abc123",
  "address" : "Chancery lane, London"
}
```


</TabItem>
<TabItem value="Output">

```json
[2024-01-31 07:53:35,508] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages
{
  "name": "laura",
  "username": "laura@conduktor.io",
  "password": "kitesurf",
  "visa": "#888999XZ",
  "address": "Dubai, UAE"
}
{
  "name": "tom",
  "username": "tom@conduktor.io",
  "password": "motorhead",
  "visa": "#abc123",
  "address": "Chancery lane, London"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/hLCJAISuaTa5mzTG7XrnMIqcL.svg)](https://asciinema.org/a/hLCJAISuaTa5mzTG7XrnMIqcL)

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
 Container vault  Stopping
 Container gateway1  Stopping
 Container schema-registry  Stopping
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway2  Stopped
 Container gateway2  Removing
 Container vault  Stopped
 Container vault  Removing
 Container gateway2  Removed
 Container gateway1  Removed
 Container schema-registry  Removed
 Container kafka3  Stopping
 Container kafka2  Stopping
 Container kafka1  Stopping
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka3  Stopped
 Container kafka3  Removing
 Container vault  Removed
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka3  Removed
 Container kafka1  Removed
 Container kafka2  Removed
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network encryption-vault-with-secret-management_default  Removing
 Network encryption-vault-with-secret-management_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Vi7w9Uv4Ap7iKvI7KTAovjP7F.svg)](https://asciinema.org/a/Vi7w9Uv4Ap7iKvI7KTAovjP7F)

</TabItem>
</Tabs>

# Conclusion

Crypto shredding help you protect your most precious information

