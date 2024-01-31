---
title: Cluster Switching / Failover
description: Cluster Switching / Failover
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# What is cluster switching?

Conduktor Gateway's cluster switching allows hot-switch the backend Kafka cluster without having to change your client configuration, or restart Gateway.

This features enables you to build a seamless disaster recovery strategy for your Kafka cluster, when Gateway is deployed in combination with a replication solution (like MirrorMaker, Confluent replicator, Cluster Linking, etc.).

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/fMuzLb4uEu9WOV7qGvNHz9BTn.svg)](https://asciinema.org/a/fMuzLb4uEu9WOV7qGvNHz9BTn)

</TabItem>
</Tabs>

## Limitations to consider when designing a disaster recovery strategy

* Cluster switching does not replicate data between clusters. You need to use a replication solution like MirrorMaker to replicate data between clusters
* Because of their asynchronous nature, such replication solutions may lead to data loss in case of a disaster
* Cluster switching is a manual process - automatic failover is not supported, yet
* Concentrated topics offsets: Gateway stores client offsets of concentrated topics in a regular Kafka topic. When replicating this topic, there will be no adjustments of potential offsets shifts between the source and failover cluster
* When switching, Kafka consumers will perform a group rebalance. They will not be able to commit their offset before the rebalance. This may lead to a some messages being consumed twice

## Review the docker compose environment

As can be seen from `docker-compose.yaml` the demo environment consists of the following services:

* failover-kafka1
* failover-kafka2
* failover-kafka3
* gateway1
* gateway2
* kafka1
* kafka2
* kafka3
* mirror-maker
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
      GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: true
      GATEWAY_CLUSTER_ID: private
      GATEWAY_BACKEND_KAFKA_SELECTOR: 'file : { path:  /config/clusters.yaml}'
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
    volumes:
    - type: bind
      source: .
      target: /config
      read_only: true
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
      GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: true
      GATEWAY_CLUSTER_ID: private
      GATEWAY_BACKEND_KAFKA_SELECTOR: 'file : { path:  /config/clusters.yaml}'
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
    volumes:
    - type: bind
      source: .
      target: /config
      read_only: true
  failover-kafka1:
    image: confluentinc/cp-kafka:latest
    healthcheck:
      test: nc -zv failover-kafka1 9092 || exit 1
      interval: 5s
      retries: 25
    hostname: failover-kafka1
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2801/backup
      KAFKA_LISTENERS: EXTERNAL_SAME_HOST://:29092,INTERNAL://:9092
      KAFKA_ADVERTISED_LISTENERS: EXTERNAL_SAME_HOST://localhost:29092,INTERNAL://failover-kafka1:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL_SAME_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_LOGGERS: kafka.authorizer.logger=INFO
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
    depends_on:
      zookeeper:
        condition: service_healthy
    container_name: failover-kafka1
    ports:
    - 29092:29092
  failover-kafka2:
    image: confluentinc/cp-kafka:latest
    healthcheck:
      test: nc -zv failover-kafka2 9093 || exit 1
      interval: 5s
      retries: 25
    hostname: failover-kafka2
    environment:
      KAFKA_BROKER_ID: 2
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2801/backup
      KAFKA_LISTENERS: EXTERNAL_SAME_HOST://:29093,INTERNAL://:9093
      KAFKA_ADVERTISED_LISTENERS: EXTERNAL_SAME_HOST://localhost:29093,INTERNAL://failover-kafka2:9093
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL_SAME_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_LOGGERS: kafka.authorizer.logger=INFO
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
    depends_on:
      zookeeper:
        condition: service_healthy
    container_name: failover-kafka2
    ports:
    - 29093:29093
  failover-kafka3:
    image: confluentinc/cp-kafka:latest
    healthcheck:
      test: nc -zv failover-kafka3 9094 || exit 1
      interval: 5s
      retries: 25
    hostname: failover-kafka3
    environment:
      KAFKA_BROKER_ID: 3
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2801/backup
      KAFKA_LISTENERS: EXTERNAL_SAME_HOST://:29094,INTERNAL://:9094
      KAFKA_ADVERTISED_LISTENERS: EXTERNAL_SAME_HOST://localhost:29094,INTERNAL://failover-kafka3:9094
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL_SAME_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_LOGGERS: kafka.authorizer.logger=INFO
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
    depends_on:
      zookeeper:
        condition: service_healthy
    container_name: failover-kafka3
    ports:
    - 29094:29094
  mirror-maker:
    image: confluentinc/cp-kafka:latest
    healthcheck:
      test: nc -zv failover-kafka3 9094 || exit 1
      interval: 5s
      retries: 25
    hostname: mirror-maker
    depends_on:
      kafka1:
        condition: service_healthy
      kafka2:
        condition: service_healthy
      kafka3:
        condition: service_healthy
      failover-kafka1:
        condition: service_healthy
      failover-kafka2:
        condition: service_healthy
      failover-kafka3:
        condition: service_healthy
    container_name: mirror-maker
    volumes:
    - type: bind
      source: .
      target: /config
      read_only: true
    command: connect-mirror-maker /config/mm2.properties
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

  failover:
    bootstrap.servers: failover-kafka1:9092,failover-kafka2:9093,failover-kafka3:9094
    gateway.roles: failover
```
</TabItem>
</Tabs>

## Review the Mirror-Maker configuration

Review the Mirror-Maker configuration

<Tabs>
<TabItem value="Command">

```sh
cat mm2.properties
```

</TabItem>
<TabItem value="File Content">

```properties
# specify any number of cluster aliases
clusters = main, failover

# connection information for each cluster
main.bootstrap.servers = kafka1:9092,kafka2:9093,kafka3:9094
failover.bootstrap.servers = failover-kafka1:9092,failover-kafka2:9093,failover-kafka3:9094

# enable and configure individual replication flows
main->failover.enabled = true
# Do not rename topics
replication.policy.class=org.apache.kafka.connect.mirror.IdentityReplicationPolicy

# regex which defines which topics gets replicated.
main->failover.topics = .*
refresh.topics.interval.seconds=10
main.consumer.auto.offset.reset=earliest

# regex which defines which consumer groups gets replicated.
main->failover.groups = .*
sync.group.offsets.enabled=true
refresh.groups.interval.seconds=10

# Setting replication factor of newly created remote topics
replication.factor=1

############################# Internal Topic Settings  #############################
# The replication factor for mm2 internal topics "heartbeats", "B.checkpoints.internal" and "mm2-offset-syncs.B.internal"
# For anything other than development testing, a value greater than 1 is recommended to ensure availability such as 3.
checkpoints.topic.replication.factor=1
heartbeats.topic.replication.factor=1
offset-syncs.topic.replication.factor=1

# The replication factor for connect internal topics "mm2-configs.B.internal", "mm2-offsets.B.internal" and
# "mm2-status.B.internal"
# For anything other than development testing, a value greater than 1 is recommended to ensure availability such as 3.
offset.storage.replication.factor=1
status.storage.replication.factor=1
config.storage.replication.factor=1
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
 Container failover-kafka3  Running
 Container failover-kafka1  Running
 Container failover-kafka2  Running
 Container kafka3  Running
 Container kafka1  Running
 Container schema-registry  Running
 Container gateway1  Running
 Container mirror-maker  Running
 Container gateway2  Running
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container zookeeper  Healthy
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container zookeeper  Healthy
 Container kafka3  Waiting
 Container failover-kafka1  Waiting
 Container failover-kafka2  Waiting
 Container failover-kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Healthy
 Container failover-kafka2  Healthy
 Container kafka3  Healthy
 Container failover-kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container failover-kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container zookeeper  Waiting
 Container failover-kafka3  Waiting
 Container failover-kafka2  Waiting
 Container kafka1  Waiting
 Container failover-kafka1  Waiting
 Container mirror-maker  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container gateway2  Waiting
 Container kafka2  Healthy
 Container failover-kafka2  Healthy
 Container schema-registry  Healthy
 Container zookeeper  Healthy
 Container gateway2  Healthy
 Container failover-kafka1  Healthy
 Container kafka3  Healthy
 Container failover-kafka3  Healthy
 Container kafka1  Healthy
 Container mirror-maker  Healthy
 Container gateway1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/sRNp8WycM1wgO2G1B48byDc8w.svg)](https://asciinema.org/a/sRNp8WycM1wgO2G1B48byDc8w)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNDQ0MzQzOH0.adivqRFVLn7MyhLfllCoZQFl0H1g0NbqqoGLxBbNgnA';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/3fo5PCg97npWAyeLVgiIlTQTL.svg)](https://asciinema.org/a/3fo5PCg97npWAyeLVgiIlTQTL)

</TabItem>
</Tabs>

## Creating topic users on teamA

Creating on `teamA`:

* Topic `users` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic users
```


</TabItem>
<TabItem value="Output">

```
Created topic users.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/LspZh43NlHDKo3QR60QmuZWbx.svg)](https://asciinema.org/a/LspZh43NlHDKo3QR60QmuZWbx)

</TabItem>
</Tabs>

## Send tom and laura into topic users

Producing 2 messages in `users` in cluster `teamA`

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
  "visa" : "#888999XZ",
  "address" : "Dubai, UAE"
}
```
with


```sh
echo '{"name":"tom","username":"tom@conduktor.io","password":"motorhead","visa":"#abc123","address":"Chancery lane, London"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic users

echo '{"name":"laura","username":"laura@conduktor.io","password":"kitesurf","visa":"#888999XZ","address":"Dubai, UAE"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic users
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Kqmj0qxJwqC1kOPSmMdZbOOLV.svg)](https://asciinema.org/a/Kqmj0qxJwqC1kOPSmMdZbOOLV)

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
_acls
_auditLogs
_consumerGroupSubscriptionBackingTopic
_encryptionConfig
_interceptorConfigs
_license
_offsetStore
_schemas
_topicMappings
_topicRegistry
_userMapping
heartbeats
mm2-configs.failover.internal
mm2-offset-syncs.failover.internal
mm2-offsets.failover.internal
mm2-status.failover.internal
teamAusers

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/CtDeXOY5FU8WtgWAfh9d9eblL.svg)](https://asciinema.org/a/CtDeXOY5FU8WtgWAfh9d9eblL)

</TabItem>
</Tabs>

## Wait for mirror maker to do its job on gateway internal topic

Wait for mirror maker to do its job on gateway internal topic in cluster `failover-kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:29092,localhost:29093,localhost:29094 \
    --topic _topicMappings \
    --from-beginning \
    --max-messages 1 \
    --timeout-ms 15000 | jq
```


</TabItem>
<TabItem value="Output">

```json
Processed a total of 1 messages
{
  "users": {
    "clusterId": "main",
    "name": "teamAusers",
    "isConcentrated": false,
    "compactedName": "teamAusers",
    "isCompacted": false,
    "compactedAndDeletedName": "teamAusers",
    "isCompactedAndDeleted": false,
    "createdAt": [
      2024,
      1,
      31,
      2,
      17,
      19,
      477
    ],
    "isDeleted": false,
    "configuration": {
      "numPartitions": 1,
      "replicationFactor": 1,
      "properties": {}
    },
    "isVirtual": false
  }
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/BJ8ejl8niZvNI894EmPAYYJbz.svg)](https://asciinema.org/a/BJ8ejl8niZvNI894EmPAYYJbz)

</TabItem>
</Tabs>

## Wait for mirror maker to do its job on users topics

Wait for mirror maker to do its job on users topics in cluster `failover-kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:29092,localhost:29093,localhost:29094 \
    --topic teamAusers \
    --from-beginning \
    --max-messages 1 \
    --timeout-ms 15000 | jq
```


</TabItem>
<TabItem value="Output">

```json
[2024-01-31 03:17:26,767] WARN [Consumer clientId=console-consumer, groupId=console-consumer-77977] Error while fetching metadata with correlation id 2 : {teamAusers=UNKNOWN_TOPIC_OR_PARTITION} (org.apache.kafka.clients.NetworkClient)
[2024-01-31 03:17:26,872] WARN [Consumer clientId=console-consumer, groupId=console-consumer-77977] Error while fetching metadata with correlation id 7 : {teamAusers=UNKNOWN_TOPIC_OR_PARTITION} (org.apache.kafka.clients.NetworkClient)
Processed a total of 1 messages
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

[![asciicast](https://asciinema.org/a/sY0amCyMv8ptlqr453rNJOThP.svg)](https://asciinema.org/a/sY0amCyMv8ptlqr453rNJOThP)

</TabItem>
</Tabs>

## Assert mirror maker did its job



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:29092,localhost:29093,localhost:29094 \
    --list
```


</TabItem>
<TabItem value="Output">

```
__consumer_offsets
_acls
_auditLogs
_consumerGroupSubscriptionBackingTopic
_encryptionConfig
_interceptorConfigs
_license
_offsetStore
_schemas
_topicMappings
_topicRegistry
_userMapping
heartbeats
main.checkpoints.internal
main.heartbeats
mm2-configs.main.internal
mm2-offsets.main.internal
mm2-status.main.internal
teamAusers

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/w0KIVxGDiFr0PgSOUsRGFBNnv.svg)](https://asciinema.org/a/w0KIVxGDiFr0PgSOUsRGFBNnv)

</TabItem>
</Tabs>

## Failing over from main to failover

Failing over from `main` to `failover` on gateway `gateway1`

<Tabs>
<TabItem value="Command">


```sh
curl \
  --request POST 'http://localhost:8888/admin/pclusters/v1/pcluster/main/switch?to=failover' \
  --user 'admin:conduktor' \
  --silent | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "message": "Cluster switched"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/cA60dmNw2FoyFSVMYuTeCFp2c.svg)](https://asciinema.org/a/cA60dmNw2FoyFSVMYuTeCFp2c)

</TabItem>
</Tabs>

## Failing over from main to failover

Failing over from `main` to `failover` on gateway `gateway2`

<Tabs>
<TabItem value="Command">


```sh
curl \
  --request POST 'http://localhost:8889/admin/pclusters/v1/pcluster/main/switch?to=failover' \
  --user 'admin:conduktor' \
  --silent | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "message": "Cluster switched"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/9Q29usVepijFIst3GHPT7Iurl.svg)](https://asciinema.org/a/9Q29usVepijFIst3GHPT7Iurl)

</TabItem>
</Tabs>

## Produce alice into users, it should hit only failover-kafka

Producing 1 message in `users` in cluster `teamA`

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "name" : "alice",
  "username" : "alice@conduktor.io",
  "password" : "youpi",
  "visa" : "#812SSS",
  "address" : "Les ifs"
}
```
with


```sh
echo '{"name":"alice","username":"alice@conduktor.io","password":"youpi","visa":"#812SSS","address":"Les ifs"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic users
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ekhF3PN8XgKTS5UGYkkt5TIyu.svg)](https://asciinema.org/a/ekhF3PN8XgKTS5UGYkkt5TIyu)

</TabItem>
</Tabs>

## Verify we can read laura (via mirror maker), tom (via mirror maker) and alice (via cluster switching)

Verify we can read laura (via mirror maker), tom (via mirror maker) and alice (via cluster switching) in cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic users \
    --from-beginning \
    --max-messages 3 \
    --timeout-ms 10000 | jq
```


returns 1 event
```json
{
  "name" : "alice",
  "username" : "alice@conduktor.io",
  "password" : "youpi",
  "visa" : "#812SSS",
  "address" : "Les ifs"
}
```


</TabItem>
<TabItem value="Output">

```json
Processed a total of 3 messages
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
  "visa": "#888999XZ",
  "address": "Dubai, UAE"
}
{
  "name": "alice",
  "username": "alice@conduktor.io",
  "password": "youpi",
  "visa": "#812SSS",
  "address": "Les ifs"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/8cJjZIb1sJMCPoZE6ze0lLwMe.svg)](https://asciinema.org/a/8cJjZIb1sJMCPoZE6ze0lLwMe)

</TabItem>
</Tabs>

## Verify alice is not in main kafka

Verify alice is not in main kafka in cluster `kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --topic teamAusers \
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
  "visa" : "#888999XZ",
  "address" : "Dubai, UAE"
}
```


</TabItem>
<TabItem value="Output">

```json
[2024-01-31 03:17:53,034] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
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
  "visa": "#888999XZ",
  "address": "Dubai, UAE"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/WiIhI5LOxuLnVI9we6pdhrQyr.svg)](https://asciinema.org/a/WiIhI5LOxuLnVI9we6pdhrQyr)

</TabItem>
</Tabs>

## Verify alice is in failover

Verify alice is in failover in cluster `failover-kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:29092,localhost:29093,localhost:29094 \
    --topic teamAusers \
    --from-beginning \
    --max-messages 3 \
    --timeout-ms 15000 | jq
```


returns 1 event
```json
{
  "name" : "alice",
  "username" : "alice@conduktor.io",
  "password" : "youpi",
  "visa" : "#812SSS",
  "address" : "Les ifs"
}
```


</TabItem>
<TabItem value="Output">

```json
Processed a total of 3 messages
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
  "visa": "#888999XZ",
  "address": "Dubai, UAE"
}
{
  "name": "alice",
  "username": "alice@conduktor.io",
  "password": "youpi",
  "visa": "#812SSS",
  "address": "Les ifs"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/YBv4fAo4G0E1FdCC2g4jOHzq0.svg)](https://asciinema.org/a/YBv4fAo4G0E1FdCC2g4jOHzq0)

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
 Container mirror-maker  Stopping
 Container gateway1  Stopping
 Container gateway2  Stopping
 Container schema-registry  Stopping
 Container mirror-maker  Stopped
 Container mirror-maker  Removing
 Container gateway1  Stopped
 Container gateway1  Removing
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway2  Removed
 Container gateway1  Removed
 Container schema-registry  Removed
 Container mirror-maker  Removed
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container failover-kafka1  Stopping
 Container failover-kafka2  Stopping
 Container kafka3  Stopping
 Container failover-kafka3  Stopping
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka2  Stopped
 Container kafka2  Removing
 Container failover-kafka1  Stopped
 Container failover-kafka1  Removing
 Container kafka3  Stopped
 Container kafka3  Removing
 Container failover-kafka3  Stopped
 Container failover-kafka3  Removing
 Container failover-kafka2  Stopped
 Container failover-kafka2  Removing
 Container kafka1  Removed
 Container kafka3  Removed
 Container failover-kafka1  Removed
 Container kafka2  Removed
 Container failover-kafka3  Removed
 Container failover-kafka2  Removed
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network cluster-switching_default  Removing
 Network cluster-switching_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/I1Dt6fxljgeYDZRi1fiWI2sFL.svg)](https://asciinema.org/a/I1Dt6fxljgeYDZRi1fiWI2sFL)

</TabItem>
</Tabs>

# Conclusion

Cluster switching help your seamlessly move from one cluster to another!

