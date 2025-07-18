---
sidebar_position: 1
title: Docker
description: Conduktor Gateway is provided as a Docker image and Helm chart.
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Docker

Conduktor Gateway is provided as a Docker image and [Helm chart](../kubernetes).

It should be deployed and managed in the best way for your organization and use case(s). This could be a single container, or more likely, multiple Gateway instances should be deployed and scaled to meet your needs. Our recommendation is to [deploy with Kubernetes](/platform/get-started/installation/get-started/kubernetes).

Use this quick start guide to help you get started.

Jump to:

- [Running the Gateway](#running-the-gateway)
   - [Connecting to secured Kafka](#connecting-to-secured-kafka)
   - [Confluent Cloud example](#confluent-cloud-example)
- [Docker Compose](#docker-compose)

## Running the Gateway

:::info
For a fully self-contained quick-start, see the [Docker Compose](#docker-compose).
:::

In its simplest form, Gateway can be run from a simple Docker run command with the credentials to connect to your existing Kafka cluster. 

#### Start a local Kafka 

Create a new directory (note the docker network will be derived from the directory name):
```sh
mkdir gateway-quick-start && cd gateway-quick-start
```

Run the below command to start a single node Kafka and ZooKeeper:

```sh
curl -L https://releases.conduktor.io/single-kafka -o docker-compose.yml && docker compose up -d 
```

#### Start Conduktor Gateway 

Run the below command to start Conduktor Gateway and configure Docker networking between the two containers:

```sh
  docker run \
  --network gateway-quick-start_default \
  -e KAFKA_BOOTSTRAP_SERVERS=kafka1:29092 \
  -e GATEWAY_ADVERTISED_HOST=localhost \
  -e GATEWAY_PORT_START=9099 \
  -p 9099:9099 \
  -d \
  conduktor/conduktor-gateway:3.5.1
```

By default, the Gateway uses [port-based routing](../configuration/network.md) and listens on as many ports as there are Kafka brokers. In this case, we started a single-node Kafka cluster and opened 1 port. 

At this stage you have:
 - Kafka running and its brokers available on `localhost:9092`
 - Gateway acting as a proxy to the backing Kafka cluster, accessible at `loalhost:9099`

#### Connecting your clients 

Your clients can now interact with Conduktor Gateway like any other Kafka cluster.

Example: creating a topic via Gateway using the Apache Kafka command line client:

```sh
bin/kafka-topics.sh --create --topic orders --bootstrap-server localhost:9099
```

#### Next Steps

This quick start shows the basics, demonstrating Conduktor Gateway acting as a network proxy for Kafka. However, the real value comes with configuring [interceptors](../concepts/interceptors.md), which are pluggable components that augment Kafka by intercepting specific requests of the Kafka protocol and applying operations to it.

View [demos](../demos/demos.md) that demonstrate how interceptors are used to satisfy specific use cases such as encryption, data quality and safeguarding your cluster with technical and business rules. 

### Connecting to secured Kafka

Your Kafka's bootstrap server, along with its [authentication method](../configuration/kafka-authentication.md) should be configured using [environment variables](../configuration/env-variables.md).

Conduktor Gateway connects to Kafka just like any other client. 

 - Environment variables prefixed by `KAFKA_` dictate the connection between Gateway and the [backing Kafka cluster](../configuration/kafka-authentication.md).
 - Environment variables prefixed by `GATEWAY_` dictate the connection between [clients and the Gateway](../configuration/client-authentication.md).

Security configurations are provided using this scheme. For example:

```bash
ssl.truststore.location
```

becomes:

```bash
KAFKA_SSL_TRUSTSTORE_LOCATION
```

### Confluent Cloud Example

Below shows the most simple way to get started with Confluent Cloud. 

:::info
By default, Gateway assumes you want the same security protocol between your clients and Gateway, as between your Gateway and Kafka.

However, this example uses `SASL_PLAINTEXT` for the `GATEWAY_SECURITY_PROTOCOL` with `KAFKA_MANAGED` for the `GATEWAY_SECURITY_MODE`. For quick start purposes, this avoids needing to configure SSL certificates when connecting to Conduktor Gateway. 
:::

```bash
  docker run \
  -e KAFKA_BOOTSTRAP_SERVERS=$CONFLUENT_CLOUD_KAFKA_BOOTSTRAP_SERVER \
  -e KAFKA_SASL_MECHANISM=PLAIN \
  -e KAFKA_SECURITY_PROTOCOL=SASL_SSL \
  -e KAFKA_SASL_JAAS_CONFIG='org.apache.kafka.common.security.plain.PlainLoginModule required username="$CONFLUENT_CLOUD_API_KEY" password="$CONFLUENT_CLOUD_API_SECRET' \
  -e GATEWAY_SECURITY_PROTOCOL=SASL_PLAINTEXT \
  -e GATEWAY_SECURITY_MODE=KAFKA_MANAGED \
  -e GATEWAY_ADVERTISED_HOST=localhost \
  -e GATEWAY_CLUSTER_ID=test \
  -p 6969-6999:6969-6999 \
  -d \
  conduktor/conduktor-gateway:3.5.1
```

Note that if you wish to maintain the SSL/TLS connection between clients and Conduktor Gateway, see [Client to Gateway Configuration](../configuration/client-authentication.md).

By default, the Gateway uses [port-based routing](../configuration/network.md) and listens on as many ports as there are Kafka brokers. In this case, we open 30 ports to account for Confluent Cloud clusters with many brokers. However, you may need to open more ports depending on the size of your cluster. 

If you need support with your configuration, please [contact us](https://support.conduktor.io/) for support.

## Docker Compose

The below example demonstrates an environment consisting of:
 - Zookeeper and a 3-node Kafka cluster
 - Schema registry
 - Conduktor Gateway using [delegated authentication](/gateway/concepts/service-accounts-authentication-authorization/#delegated-sasl-authentication)
 - Kafka client

<Tabs>
<TabItem value="Command">

```sh
cat docker-compose.yaml
```

</TabItem>
<TabItem value="File Content">

```yaml
 # Gateway Quick Start 
 # Docker Compose

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

  conduktor-gateway-delegated:
    image: conduktor/conduktor-gateway:3.0.4
    hostname: conduktor-gateway-delegated
    container_name: conduktor-gateway-delegated
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9093,kafka3:9094
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
    - 8888:8888
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
    labels:
      tag: conduktor
networks:
  demo: null
```
</TabItem>
</Tabs>

### 1. Start the Docker environment

Start all your docker services, wait for them to be up and ready, then run in background:

* `--wait`: Wait for services to be `running|healthy`. Implies detached mode.
* `--detach`: Detached mode: Run containers in the background

```sh
docker compose up --detach --wait
```

### 2. Create a topic via Conduktor Gateway

<Tabs>
<TabItem value="Kafka Client (Docker Compose)">

```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic orders
```

</TabItem>
<TabItem value="Apache Kafka Client">

```sh
bin/kafka-topics.sh --create --topic orders --bootstrap-server localhost:6969
```

</TabItem>
</Tabs>

### 3. Produce a message to your topic

<Tabs>
<TabItem value="Kafka Client (Docker Compose)">

```sh
echo '{"orderId":"12345","customerId":"67890","price":10000}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic orders
```

</TabItem>
<TabItem value="Apache Kafka Client">

```sh
echo '{"orderId":"12345","customerId":"67890","price":10000}' | bin/kafka-console-producer.sh --topic my_topic --bootstrap-server localhost:6969
```

</TabItem>
</Tabs>

### 4. Consume a message from your topic

<Tabs>
<TabItem value="Kafka Client (Docker Compose)">

```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic cars \
    --from-beginning \
    --max-messages 1 \
    --timeout-ms 10000 | jq
```

</TabItem>
<TabItem value="Apache Kafka Client">

```sh
bin/kafka-console-consumer.sh --topic my_topic --from-beginning --bootstrap-server localhost:6969
```

</TabItem>
</Tabs>

### 5. Next Steps: Configure an interceptor

This quick start shows the basics, demonstrating Conduktor Gateway can be interacted with like any other Kafka cluster. 

However, the real value comes with configuring [interceptors](../concepts/interceptors.md), which are pluggable components that augment Kafka by intercepting specific requests of the Kafka protocol and applying operations to it.

View [demos](../demos/demos.md) that demonstrate how interceptors are used to satisfy specific use cases such as encryption, data quality and safeguarding your cluster with technical and business rules. 
