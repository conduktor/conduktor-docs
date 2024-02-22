---
title: Merge Cluster
description: Merge Cluster
tag: ops
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# What is merge cluster?

Conduktor Gateway's merge cluster brings all your Kafka clusters together into an instance for clients to access.

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/8vqM2kK8r0DBIeBjsw7H6Uoej.svg)](https://asciinema.org/a/8vqM2kK8r0DBIeBjsw7H6Uoej)

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
* s1_kafka1
* s1_kafka2
* s1_kafka3
* schema-registry
* zookeeper
* zookeeper_s1

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
      GATEWAY_BACKEND_KAFKA_SELECTOR: 'file : { path:  /config/clusters.yaml}'
      GATEWAY_PORT_COUNT: 6
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
    - 6972:6972
    - 6973:6973
    - 6974:6974
    healthcheck:
      test: curl localhost:8888/health
      interval: 5s
      retries: 25
    labels:
      tag: conduktor
    volumes:
    - type: bind
      source: .
      target: /config
      read_only: true
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
      GATEWAY_BACKEND_KAFKA_SELECTOR: 'file : { path:  /config/clusters.yaml}'
      GATEWAY_PORT_COUNT: 6
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
    - 7972:7972
    - 7973:7973
    - 7974:7974
    healthcheck:
      test: curl localhost:8888/health
      interval: 5s
      retries: 25
    labels:
      tag: conduktor
    volumes:
    - type: bind
      source: .
      target: /config
      read_only: true
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
  zookeeper_s1:
    image: confluentinc/cp-zookeeper:latest
    healthcheck:
      test: nc -zv 0.0.0.0 12801 || exit 1
      interval: 5s
      retries: 25
    hostname: zookeeper_s1
    environment:
      ZOOKEEPER_CLIENT_PORT: 12801
      ZOOKEEPER_TICK_TIME: 2000
    container_name: zookeeper_s1
    ports:
    - 12801:12801
    labels:
      tag: conduktor
  s1_kafka1:
    image: confluentinc/cp-kafka:latest
    healthcheck:
      test: nc -zv s1_kafka1 9092 || exit 1
      interval: 5s
      retries: 25
    hostname: s1_kafka1
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper_s1:12801
      KAFKA_LISTENERS: EXTERNAL_SAME_HOST://:29092,INTERNAL://:9092
      KAFKA_ADVERTISED_LISTENERS: EXTERNAL_SAME_HOST://localhost:29092,INTERNAL://s1_kafka1:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL_SAME_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_LOGGERS: kafka.authorizer.logger=INFO
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
    depends_on:
      zookeeper_s1:
        condition: service_healthy
    container_name: s1_kafka1
    ports:
    - 29092:29092
    labels:
      tag: conduktor
  s1_kafka2:
    image: confluentinc/cp-kafka:latest
    healthcheck:
      test: nc -zv s1_kafka2 9093 || exit 1
      interval: 5s
      retries: 25
    hostname: s1_kafka2
    environment:
      KAFKA_BROKER_ID: 2
      KAFKA_ZOOKEEPER_CONNECT: zookeeper_s1:12801
      KAFKA_LISTENERS: EXTERNAL_SAME_HOST://:29093,INTERNAL://:9093
      KAFKA_ADVERTISED_LISTENERS: EXTERNAL_SAME_HOST://localhost:29093,INTERNAL://s1_kafka2:9093
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL_SAME_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_LOGGERS: kafka.authorizer.logger=INFO
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
    depends_on:
      zookeeper_s1:
        condition: service_healthy
    container_name: s1_kafka2
    ports:
    - 29093:29093
    labels:
      tag: conduktor
  s1_kafka3:
    image: confluentinc/cp-kafka:latest
    healthcheck:
      test: nc -zv s1_kafka3 9094 || exit 1
      interval: 5s
      retries: 25
    hostname: s1_kafka3
    environment:
      KAFKA_BROKER_ID: 3
      KAFKA_ZOOKEEPER_CONNECT: zookeeper_s1:12801
      KAFKA_LISTENERS: EXTERNAL_SAME_HOST://:29094,INTERNAL://:9094
      KAFKA_ADVERTISED_LISTENERS: EXTERNAL_SAME_HOST://localhost:29094,INTERNAL://s1_kafka3:9094
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL_SAME_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_LOGGERS: kafka.authorizer.logger=INFO
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
    depends_on:
      zookeeper_s1:
        condition: service_healthy
    container_name: s1_kafka3
    ports:
    - 29094:29094
    labels:
      tag: conduktor
networks:
  demo: null
```
</TabItem>
</Tabs>

## Review the Gateway configuration

Review the Gateway configuration

<Tabs>
<TabItem value="Command">

```sh
cat clusters.yaml
```

</TabItem>
<TabItem value="File Content">

```yaml
config:
  main:
    bootstrap.servers: kafka1:9092,kafka2:9093,kafka3:9094

  cluster1:
    bootstrap.servers: s1_kafka1:9092,s1_kafka2:9093,s1_kafka3:9094
    gateway.roles: upstream
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
 Network merge-cluster_default  Creating
 Network merge-cluster_default  Created
 Container zookeeper  Creating
 Container kafka-client  Creating
 Container zookeeper_s1  Creating
 Container kafka-client  Created
 Container zookeeper_s1  Created
 Container zookeeper  Created
 Container s1_kafka3  Creating
 Container s1_kafka1  Creating
 Container kafka1  Creating
 Container kafka2  Creating
 Container kafka3  Creating
 Container s1_kafka2  Creating
 Container kafka3  Created
 Container s1_kafka1  Created
 Container s1_kafka2  Created
 Container kafka2  Created
 Container kafka1  Created
 Container schema-registry  Creating
 Container gateway2  Creating
 Container gateway1  Creating
 Container s1_kafka3  Created
 gateway2 The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 
 gateway1 The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 
 Container gateway2  Created
 Container gateway1  Created
 Container schema-registry  Created
 Container zookeeper_s1  Starting
 Container zookeeper  Starting
 Container kafka-client  Starting
 Container zookeeper_s1  Started
 Container zookeeper_s1  Waiting
 Container zookeeper_s1  Waiting
 Container zookeeper_s1  Waiting
 Container zookeeper  Started
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container kafka-client  Started
 Container zookeeper_s1  Healthy
 Container s1_kafka1  Starting
 Container zookeeper_s1  Healthy
 Container s1_kafka2  Starting
 Container zookeeper_s1  Healthy
 Container s1_kafka3  Starting
 Container zookeeper  Healthy
 Container kafka1  Starting
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container kafka3  Starting
 Container kafka2  Starting
 Container s1_kafka1  Started
 Container s1_kafka2  Started
 Container s1_kafka3  Started
 Container kafka2  Started
 Container kafka3  Started
 Container kafka1  Started
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka3  Waiting
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container gateway1  Starting
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container gateway2  Starting
 Container kafka3  Healthy
 Container schema-registry  Starting
 Container gateway1  Started
 Container gateway2  Started
 Container schema-registry  Started
 Container kafka3  Waiting
 Container kafka-client  Waiting
 Container s1_kafka2  Waiting
 Container gateway1  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container zookeeper  Waiting
 Container zookeeper_s1  Waiting
 Container s1_kafka1  Waiting
 Container schema-registry  Waiting
 Container gateway2  Waiting
 Container s1_kafka3  Waiting
 Container zookeeper_s1  Healthy
 Container s1_kafka1  Healthy
 Container kafka-client  Healthy
 Container s1_kafka3  Healthy
 Container kafka1  Healthy
 Container zookeeper  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container s1_kafka2  Healthy
 Container schema-registry  Healthy
 Container gateway1  Healthy
 Container gateway2  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/kl8cshaF3XrYEnBM4Bo3BWPmN.svg)](https://asciinema.org/a/kl8cshaF3XrYEnBM4Bo3BWPmN)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNTY1MzQyM30.1XVWzoI_Qx41mnvc0duexQpmKjs-s0TFEeMPIfRDVaw';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/oDaJFyjuXneWce8Ny772MGhmP.svg)](https://asciinema.org/a/oDaJFyjuXneWce8Ny772MGhmP)

</TabItem>
</Tabs>

## Create the topic 'cars' in main cluster

Creating on `kafka1`:

* Topic `cars` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
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

[![asciicast](https://asciinema.org/a/YlBLcICSvxmMh4OBJkI10mzLa.svg)](https://asciinema.org/a/YlBLcICSvxmMh4OBJkI10mzLa)

</TabItem>
</Tabs>

## Create the topic 'cars' in cluster1

Creating on `s1_kafka1`:

* Topic `cars` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:29092,localhost:29093,localhost:29094 \
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

[![asciicast](https://asciinema.org/a/3Uu7ttfLDO4CCwhxjzVG5srfU.svg)](https://asciinema.org/a/3Uu7ttfLDO4CCwhxjzVG5srfU)

</TabItem>
</Tabs>

## Let's route the topic 'eu_cars', as seen by the client application, on to the 'cars' topic on the main (default) cluster



<Tabs>
<TabItem value="Command">


```sh
curl \
  --silent \
  --request POST localhost:8888/topicMappings/teamA/eu_cars \
  --user 'admin:conduktor' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "clusterId": "main",
      "topicName": "cars",
      "concentrated": false
    }' | jq

curl \
  --silent \
  --user admin:conduktor \
  --request POST localhost:8888/topics/teamA \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "name": "eu_cars"
    }' | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "message": "cars is created"
}
{
  "message": "eu_cars is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/hOcMlKGayMJbp1PsRqKxBEiup.svg)](https://asciinema.org/a/hOcMlKGayMJbp1PsRqKxBEiup)

</TabItem>
</Tabs>

## Let's route the topic 'us_cars', as seen by the client application, on to the 'cars' topic on the second cluster (cluster1)



<Tabs>
<TabItem value="Command">


```sh
curl \
  --silent \
  --request POST localhost:8888/topicMappings/teamA/us_cars \
  --user 'admin:conduktor' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "clusterId": "cluster1",
      "topicName": "cars",
      "concentrated": false
    }' | jq

curl \
  --silent \
  --user admin:conduktor \
  --request POST localhost:8888/topics/teamA \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "name": "us_cars"
    }' | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "message": "cars is created"
}
{
  "message": "us_cars is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ogmUHXrLCwArhT6bjct6MMR44.svg)](https://asciinema.org/a/ogmUHXrLCwArhT6bjct6MMR44)

</TabItem>
</Tabs>

## Send into topic 'eu_cars'

Producing 1 message in `eu_cars` in cluster `teamA`

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "name" : "eu_cars_record"
}
```
with


```sh
echo '{"name":"eu_cars_record"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic eu_cars
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ZZf49xgbDaZtRZ2ce4qybGaUG.svg)](https://asciinema.org/a/ZZf49xgbDaZtRZ2ce4qybGaUG)

</TabItem>
</Tabs>

## Send into topic 'us_cars'

Producing 1 message in `us_cars` in cluster `teamA`

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "name" : "us_cars_record"
}
```
with


```sh
echo '{"name":"us_cars_record"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic us_cars
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ukk4iOvKFQWpcvC5rrnhHPhXT.svg)](https://asciinema.org/a/ukk4iOvKFQWpcvC5rrnhHPhXT)

</TabItem>
</Tabs>

## Consuming from eu_cars

Consuming from eu_cars in cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic eu_cars \
    --from-beginning \
    --timeout-ms 10000 | jq
```


returns 

```json
Processed a total of 1 messages
{
  "name": "eu_cars_record"
}

```



</TabItem>
<TabItem value="Output">

```json
Processed a total of 1 messages
{
  "name": "eu_cars_record"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/YVVrDtpHDjEU9pyr2C9mUvW8D.svg)](https://asciinema.org/a/YVVrDtpHDjEU9pyr2C9mUvW8D)

</TabItem>
</Tabs>

## Consuming from us_cars

Consuming from us_cars in cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic us_cars \
    --from-beginning \
    --timeout-ms 10000 | jq
```


returns 

```json
Processed a total of 1 messages
{
  "name": "us_cars_record"
}

```



</TabItem>
<TabItem value="Output">

```json
Processed a total of 1 messages
{
  "name": "us_cars_record"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/HCUlrQK4rdnGaojb4H605Ftbt.svg)](https://asciinema.org/a/HCUlrQK4rdnGaojb4H605Ftbt)

</TabItem>
</Tabs>

## Verify eu_cars_record is not in main kafka

Verify eu_cars_record is not in main kafka in cluster `kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --topic cars \
    --from-beginning \
    --timeout-ms 10000 | jq
```


returns 

```json
Processed a total of 1 messages
{
  "name": "eu_cars_record"
}

```



</TabItem>
<TabItem value="Output">

```json
Processed a total of 1 messages
{
  "name": "eu_cars_record"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/trnPOSvPqEctEM2gjXdCRHk2o.svg)](https://asciinema.org/a/trnPOSvPqEctEM2gjXdCRHk2o)

</TabItem>
</Tabs>

## Verify us_cars_record is not in cluster1 kafka

Verify us_cars_record is not in cluster1 kafka in cluster `s1_kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:29092,localhost:29093,localhost:29094 \
    --topic cars \
    --from-beginning \
    --timeout-ms 10000 | jq
```


returns 

```json
Processed a total of 1 messages
{
  "name": "us_cars_record"
}

```



</TabItem>
<TabItem value="Output">

```json
Processed a total of 1 messages
{
  "name": "us_cars_record"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/OjPhGAWNrl2soH6pXvRoyDIwb.svg)](https://asciinema.org/a/OjPhGAWNrl2soH6pXvRoyDIwb)

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
 Container s1_kafka2  Stopping
 Container s1_kafka1  Stopping
 Container gateway1  Stopping
 Container schema-registry  Stopping
 Container kafka-client  Stopping
 Container s1_kafka3  Stopping
 Container gateway2  Stopping
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway2  Removed
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway1  Removed
 Container s1_kafka1  Stopped
 Container s1_kafka1  Removing
 Container s1_kafka1  Removed
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container schema-registry  Removed
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka3  Removed
 Container kafka2  Removed
 Container s1_kafka3  Stopped
 Container s1_kafka3  Removing
 Container s1_kafka3  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container s1_kafka2  Stopped
 Container s1_kafka2  Removing
 Container s1_kafka2  Removed
 Container zookeeper_s1  Stopping
 Container zookeeper_s1  Stopped
 Container zookeeper_s1  Removing
 Container zookeeper_s1  Removed
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network merge-cluster_default  Removing
 Network merge-cluster_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/LREHgLSB7EP9izTAGrfOVeOp5.svg)](https://asciinema.org/a/LREHgLSB7EP9izTAGrfOVeOp5)

</TabItem>
</Tabs>

# Conclusion

Merge cluster is simple as it

