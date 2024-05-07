---
title: Encryption for third party
description: Encryption for third party
tag: encryption
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Field level encryption for third party

Let's demonstrate field level encryption for third party

Aka sharing existing data that is not currently encrypted.

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/v1LPxQt2StQEv3iJcRcIefcHf.svg)](https://asciinema.org/a/v1LPxQt2StQEv3iJcRcIefcHf)

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
    image: conduktor/conduktor-gateway:3.0.2
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
    image: conduktor/conduktor-gateway:3.0.2
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
 Network encryption-third-party_default  Creating
 Network encryption-third-party_default  Created
 Container kafka-client  Creating
 Container zookeeper  Creating
 Container zookeeper  Created
 Container kafka-client  Created
 Container kafka3  Creating
 Container kafka2  Creating
 Container kafka1  Creating
 Container kafka2  Created
 Container kafka1  Created
 Container kafka3  Created
 Container gateway1  Creating
 Container schema-registry  Creating
 Container gateway2  Creating
 Container gateway2  Created
 Container schema-registry  Created
 Container gateway1  Created
 Container zookeeper  Starting
 Container kafka-client  Starting
 Container zookeeper  Started
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container kafka-client  Started
 Container zookeeper  Healthy
 Container kafka3  Starting
 Container zookeeper  Healthy
 Container kafka2  Starting
 Container zookeeper  Healthy
 Container kafka1  Starting
 Container kafka1  Started
 Container kafka2  Started
 Container kafka3  Started
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container gateway1  Starting
 Container kafka2  Healthy
 Container gateway2  Starting
 Container kafka3  Healthy
 Container schema-registry  Starting
 Container schema-registry  Started
 Container gateway2  Started
 Container gateway1  Started
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container zookeeper  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka-client  Healthy
 Container kafka1  Healthy
 Container gateway2  Healthy
 Container gateway1  Healthy
 Container schema-registry  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/5JkSESXHbPk7Cbcym9LTNCqRb.svg)](https://asciinema.org/a/5JkSESXHbPk7Cbcym9LTNCqRb)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcyMDQ3NTczN30.SJzTZa6F6XcO0Ey7sjl_ht-4tPcuwXWRY2o5zXnPic4';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/GU5KZ2Ob0QXmkZahg9oPg7nYc.svg)](https://asciinema.org/a/GU5KZ2Ob0QXmkZahg9oPg7nYc)

</TabItem>
</Tabs>

## Let's create a service account third-party for teamA virtual cluster

Creating virtual cluster `teamA` on gateway `gateway1` and reviewing the configuration file to access it

<Tabs>
<TabItem value="Command">


```sh
# Generate virtual cluster teamA with service account third-party
token=$(curl \
    --request POST "http://localhost:8888/admin/vclusters/v1/vcluster/teamA/username/third-party" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data-raw '{"lifeTimeSeconds": 7776000}' | jq -r ".token")

# Create access file
echo  """
bootstrap.servers=localhost:6969
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='third-party' password='$token';
""" > teamA-third-party.properties

# Review file
cat teamA-third-party.properties
```


</TabItem>
<TabItem value="Output">

```

bootstrap.servers=localhost:6969
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='third-party' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRoaXJkLXBhcnR5IiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcyMDQ3NTczOH0.AyDaRXEfpe11pUpxDaDXVeL2X96ER24kMTbBC-IzqW4';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/d8UMY7VmW3E1My1Y7xnQVY8Ul.svg)](https://asciinema.org/a/d8UMY7VmW3E1My1Y7xnQVY8Ul)

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

[![asciicast](https://asciinema.org/a/5LzbGLHdVvzuMU0LnxC7lgUBs.svg)](https://asciinema.org/a/5LzbGLHdVvzuMU0LnxC7lgUBs)

</TabItem>
</Tabs>

## Adding interceptor encrypt-on-consume

We want to encrypt only two fields, with an in memory KMS.

<Tabs>
<TabItem value="Command">


```sh
cat step-08-encrypt-on-consume.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/username/third-party/interceptor/encrypt-on-consume" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-08-encrypt-on-consume.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "pluginClass": "io.conduktor.gateway.interceptor.FetchEncryptPlugin",
  "priority": 100,
  "config": {
    "fields": [
      {
        "fieldName": "password",
        "keySecretId": "password-secret",
        "algorithm": "AES_GCM"
      },
      {
        "fieldName": "visa",
        "keySecretId": "visa-secret",
        "algorithm": "AES_GCM"
      }
    ]
  }
}
{
  "message": "encrypt-on-consume is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/t63IGsUx7cj2CIhWm1j4Lf0WW.svg)](https://asciinema.org/a/t63IGsUx7cj2CIhWm1j4Lf0WW)

</TabItem>
</Tabs>

## Listing interceptors for teamA

Listing interceptors on `gateway1` for virtual cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
curl \
    --request GET 'http://localhost:8888/admin/interceptors/v1/vcluster/teamA/username/third-party' \
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
      "name": "encrypt-on-consume",
      "pluginClass": "io.conduktor.gateway.interceptor.FetchEncryptPlugin",
      "priority": 100,
      "timeoutMs": 9223372036854775807,
      "config": {
        "fields": [
          {
            "fieldName": "password",
            "keySecretId": "password-secret",
            "algorithm": "AES_GCM"
          },
          {
            "fieldName": "visa",
            "keySecretId": "visa-secret",
            "algorithm": "AES_GCM"
          }
        ]
      }
    }
  ]
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/oHrW7r7aWoBAG8jJrXYg96v2J.svg)](https://asciinema.org/a/oHrW7r7aWoBAG8jJrXYg96v2J)

</TabItem>
</Tabs>

## Let's send unencrypted json

Producing 2 messages in `customers` in cluster `teamA`

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

[![asciicast](https://asciinema.org/a/vyFu9FvYciWnCgCkH3Mgo6Bne.svg)](https://asciinema.org/a/vyFu9FvYciWnCgCkH3Mgo6Bne)

</TabItem>
</Tabs>

## Confirm tom and laura data is not encrypted for teamA

Confirm tom and laura data is not encrypted for teamA in cluster `teamA`

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
[2024-04-10 01:55:54,317] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
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

[![asciicast](https://asciinema.org/a/H3xyleX2qMiv7IUsCcMRZ1YoV.svg)](https://asciinema.org/a/H3xyleX2qMiv7IUsCcMRZ1YoV)

</TabItem>
</Tabs>

## Confirm tom and laura data is encrypted for third-party

Confirm tom and laura data is encrypted for third-party in cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-third-party.properties \
    --topic customers \
    --from-beginning \
    --timeout-ms 10000 | jq
```


returns 2 events
```json
{
  "name" : "tom",
  "username" : "tom@conduktor.io",
  "password" : "AAAABQAAAAEAAAAzAWm+LjGIKi9HMx6dH8wfNpHhvsyGy7oN04PsNHXkYtGAXGILEhEpFAcnNS6Zl3EiaNR+fnuX+FHpdK+EhkCD9eBeiPJnfwI3UdkPlwcgm24pteuQu7s4WtVgZKYG4lE=",
  "visa" : "AAAABQAAAAEAAAAzAWcJgPWEifpgMp6JNU75phVlZqLvBTES/EdC61XCmPnT8IFQnFZuDJh3g7fAt+3eRpJ3VK1lPynAYEB3O9CF072i+DhMfEOb6dzEJNMi6ltuHv/W0OHQ44yJhLKv",
  "address" : "Chancery lane, London"
}
{
  "name" : "laura",
  "username" : "laura@conduktor.io",
  "password" : "AAAABQAAAAEAAAAzAWm+LjGIKi9HMx6dH8wfNpHhvsyGy7oN04PsNHXkYtGAXGILEhEpFAcnNS6Zl3EiaNR+No189YsM4NW5I9ue5Hj07YfblWk6R37GfFtJUTMAjlGntrMbg+3zBI71vg==",
  "visa" : "AAAABQAAAAEAAAAzAWcJgPWEifpgMp6JNU75phVlZqLvBTES/EdC61XCmPnT8IFQnFZuDJh3g7fAt+3eRpJ34JARQFutVWfjhTKOwZppv6vSkkjaQQ7TP55sjhEbQM0w91ow8ZRyzViDeaug",
  "address" : "Dubai, UAE"
}
```


</TabItem>
<TabItem value="Output">

```json
[2024-04-10 01:56:06,780] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages
{
  "name": "tom",
  "username": "tom@conduktor.io",
  "password": "AAAABQAAAAEAAAAzAe12bvhxdFx3ExKWlyJ80JpZCEy1eotQ/zYC6fAxcj9vlsmavZMaB+bDUKupnL8q+iWmCkF/t0ecmqqSLb6mJiiRAU9v6bfomB5bNXviV2n0MdbvNzcaQK6s22SpRHI=",
  "visa": "AAAABQAAAAEAAAAzATRurZ2Mz/FiSRncco5sWclXxTCGE6iBNe3dAy+GYx26mwu4FDk7dXrUUojfJzBhaTqpIzAK5aYThAOa8DL9oQFjtqmz30+Qbc1fMxgryKwroaG0kMfJJXZp+vG8",
  "address": "Chancery lane, London"
}
{
  "name": "laura",
  "username": "laura@conduktor.io",
  "password": "AAAABQAAAAEAAAAzAe12bvhxdFx3ExKWlyJ80JpZCEy1eotQ/zYC6fAxcj9vlsmavZMaB+bDUKupnL8q+iWmwr1U+Zt8OtLtoLHEDww2C6dV/x4vbEr9SKPojZQA0Mw35709iP351JoPdQ==",
  "visa": "AAAABQAAAAEAAAAzATRurZ2Mz/FiSRncco5sWclXxTCGE6iBNe3dAy+GYx26mwu4FDk7dXrUUojfJzBhaTqp9MDomqPs31QzL8lDblrOhIXscB4MfGZXHbKUsHVGvKB7EaWr5gzvfNGb1BO6",
  "address": "Dubai, UAE"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/T15kJgxl0CBvobrNG1l8zy8OA.svg)](https://asciinema.org/a/T15kJgxl0CBvobrNG1l8zy8OA)

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
 Container gateway2  Stopping
 Container kafka-client  Stopping
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
 Container kafka2  Stopping
 Container kafka1  Stopping
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
 Network encryption-third-party_default  Removing
 Network encryption-third-party_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/lqevTQmRXHHrhtiu22Fc1NgPs.svg)](https://asciinema.org/a/lqevTQmRXHHrhtiu22Fc1NgPs)

</TabItem>
</Tabs>

# Conclusion

Yes, encryption in the Kafka world can be simple!

