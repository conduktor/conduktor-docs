---
title: ACLs in VCLUSTER mode
description: ACLs in VCLUSTER mode
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Using Gateway ACL in your VClusters



## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/fMD8S7DoNIUbfNBx5L5SnDzfX.svg)](https://asciinema.org/a/fMD8S7DoNIUbfNBx5L5SnDzfX)

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
 Container kafka3  Running
 Container kafka2  Running
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
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container zookeeper  Waiting
 Container gateway1  Healthy
 Container gateway2  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container zookeeper  Healthy
 Container kafka1  Healthy
 Container schema-registry  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/C4iU6lS6eUwa6P0lDWYc8PfGR.svg)](https://asciinema.org/a/C4iU6lS6eUwa6P0lDWYc8PfGR)

</TabItem>
</Tabs>

## Creating virtual cluster aclCluster

Creating virtual cluster `aclCluster` on gateway `gateway1` and reviewing the configuration file to access it

<Tabs>
<TabItem value="Command">


```sh
# Generate virtual cluster aclCluster with service account admin
token=$(curl \
    --request POST "http://localhost:8888/admin/vclusters/v1/vcluster/aclCluster/username/admin" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data-raw '{"lifeTimeSeconds": 7776000}' | jq -r ".token")

# Create access file
echo  """
bootstrap.servers=localhost:6969
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='admin' password='$token';
""" > aclCluster-admin.properties

# Review file
cat aclCluster-admin.properties
```


</TabItem>
<TabItem value="Output">

```

bootstrap.servers=localhost:6969
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='admin' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidmNsdXN0ZXIiOiJhY2xDbHVzdGVyIiwiZXhwIjoxNzE0NDM1ODI5fQ.m1fGvBReVi2wolEe7XDwdcG4w2YBEIgRMoiAXp08fMM';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/pdppa5lHFfwgwAbDIq02Mio1p.svg)](https://asciinema.org/a/pdppa5lHFfwgwAbDIq02Mio1p)

</TabItem>
</Tabs>

## Creating virtual cluster aclCluster

Creating virtual cluster `aclCluster` on gateway `gateway1` and reviewing the configuration file to access it

<Tabs>
<TabItem value="Command">


```sh
# Generate virtual cluster aclCluster with service account producer
token=$(curl \
    --request POST "http://localhost:8888/admin/vclusters/v1/vcluster/aclCluster/username/producer" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data-raw '{"lifeTimeSeconds": 7776000}' | jq -r ".token")

# Create access file
echo  """
bootstrap.servers=localhost:6969
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='producer' password='$token';
""" > aclCluster-producer.properties

# Review file
cat aclCluster-producer.properties
```


</TabItem>
<TabItem value="Output">

```

bootstrap.servers=localhost:6969
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='producer' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InByb2R1Y2VyIiwidmNsdXN0ZXIiOiJhY2xDbHVzdGVyIiwiZXhwIjoxNzE0NDM1ODI5fQ.ZpJWgTOOGTYxMj5xuhphG1jGFW8Eb-JtDeh3PvvHfb4';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/U2aSXLp15s1nTxNq7jdWBjVXR.svg)](https://asciinema.org/a/U2aSXLp15s1nTxNq7jdWBjVXR)

</TabItem>
</Tabs>

## Creating virtual cluster aclCluster

Creating virtual cluster `aclCluster` on gateway `gateway1` and reviewing the configuration file to access it

<Tabs>
<TabItem value="Command">


```sh
# Generate virtual cluster aclCluster with service account consumer
token=$(curl \
    --request POST "http://localhost:8888/admin/vclusters/v1/vcluster/aclCluster/username/consumer" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data-raw '{"lifeTimeSeconds": 7776000}' | jq -r ".token")

# Create access file
echo  """
bootstrap.servers=localhost:6969
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='consumer' password='$token';
""" > aclCluster-consumer.properties

# Review file
cat aclCluster-consumer.properties
```


</TabItem>
<TabItem value="Output">

```

bootstrap.servers=localhost:6969
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='consumer' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImNvbnN1bWVyIiwidmNsdXN0ZXIiOiJhY2xDbHVzdGVyIiwiZXhwIjoxNzE0NDM1ODI5fQ.1YiO6zLk_iNgKQJCoBK1NTaND11nAhevG_D8zBo_BEI';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/8kv1kxwEbMZD3MNxRx8o1Mhn6.svg)](https://asciinema.org/a/8kv1kxwEbMZD3MNxRx8o1Mhn6)

</TabItem>
</Tabs>

## Adding interceptor acl

Add ACL interceptor

<Tabs>
<TabItem value="Command">


```sh
cat step-08-acl.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/aclCluster/interceptor/acl" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-08-acl.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "pluginClass": "io.conduktor.gateway.interceptor.AclsInterceptorPlugin",
  "priority": 100,
  "config": {}
}
{
  "message": "acl is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/fzKBN3P4KlN5LJgB6hgWTwITs.svg)](https://asciinema.org/a/fzKBN3P4KlN5LJgB6hgWTwITs)

</TabItem>
</Tabs>

## Try to create a topic as a consumer

Creating on `aclCluster`:

* Topic `restricted-topic` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config aclCluster-consumer.properties \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic restricted-topic
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> org.apache.kafka.common.errors.ClusterAuthorizationException:
>> Cluster not authorized
> ```




</TabItem>
<TabItem value="Output">

```
Error while executing topic command : Cluster not authorized
[2024-01-31 01:10:30,904] ERROR org.apache.kafka.common.errors.ClusterAuthorizationException: Cluster not authorized
 (kafka.admin.TopicCommand$)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/hiwJvT0gZTLGuLkz0rIiYzMmc.svg)](https://asciinema.org/a/hiwJvT0gZTLGuLkz0rIiYzMmc)

</TabItem>
</Tabs>

## Creating topic restricted-topic on aclCluster

Creating on `aclCluster`:

* Topic `restricted-topic` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config aclCluster-admin.properties \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic restricted-topic
```


</TabItem>
<TabItem value="Output">

```
Created topic restricted-topic.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/KxopbxN1HmVDZ0qq4cqQ8l84C.svg)](https://asciinema.org/a/KxopbxN1HmVDZ0qq4cqQ8l84C)

</TabItem>
</Tabs>

## List topics with consumer-sa does not throw error but gets no topic



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config aclCluster-consumer.properties \
    --list
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/foijbn9waqwNMkWlc6rP5dC7S.svg)](https://asciinema.org/a/foijbn9waqwNMkWlc6rP5dC7S)

</TabItem>
</Tabs>

## Let's give read-access to test-topic for consumer SA



<Tabs>
<TabItem value="Command">


```sh
kafka-acls \
    --bootstrap-server localhost:6969 \
    --command-config aclCluster-admin.properties \
    --add \
    --allow-principal User:consumer \
    --operation read \
    --topic restricted-topic
```


</TabItem>
<TabItem value="Output">

```
Adding ACLs for resource `ResourcePattern(resourceType=TOPIC, name=restricted-topic, patternType=LITERAL)`: 
 	(principal=User:consumer, host=*, operation=READ, permissionType=ALLOW) 

Current ACLs for resource `ResourcePattern(resourceType=TOPIC, name=restricted-topic, patternType=LITERAL)`: 
 	(principal=User:consumer, host=*, operation=READ, permissionType=ALLOW) 


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/fewDDrhQjbFcWbRN5bv0zgNZK.svg)](https://asciinema.org/a/fewDDrhQjbFcWbRN5bv0zgNZK)

</TabItem>
</Tabs>

## Consuming from _acls

Consuming from _acls in cluster `kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --topic _acls \
    --from-beginning \
    --timeout-ms 10000 \
    --property print.key=true | jq
```


returns 1 event
```json
{
  "key" : "{\"tenant\":\"aclCluster\",\"principal\":\"User:consumer\",\"host\":\"*\",\"resource\":{\"name\":\"restricted-topic\",\"resourceType\":\"TOPIC\",\"patternType\":\"LITERAL\"},\"operation\":\"READ\"}",
  "value" : true
}
```


</TabItem>
<TabItem value="Output">

```json
[2024-01-31 01:28:34,447] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages
{
  "tenant": "aclCluster",
  "principal": "User:consumer",
  "host": "*",
  "resource": {
    "name": "restricted-topic",
    "resourceType": "TOPIC",
    "patternType": "LITERAL"
  },
  "operation": "READ"
}
true

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/pD4NLZcNc7yt4M6aA8JflZECf.svg)](https://asciinema.org/a/pD4NLZcNc7yt4M6aA8JflZECf)

</TabItem>
</Tabs>

## Let's give read-access to fixed console-consumer for consumer SA



<Tabs>
<TabItem value="Command">


```sh
kafka-acls \
    --bootstrap-server localhost:6969 \
    --command-config aclCluster-admin.properties \
    --add \
    --allow-principal User:consumer \
    --operation read \
    --group console-consumer \
    --resource-pattern-type prefixed
```


</TabItem>
<TabItem value="Output">

```
Adding ACLs for resource `ResourcePattern(resourceType=GROUP, name=console-consumer, patternType=PREFIXED)`: 
 	(principal=User:consumer, host=*, operation=READ, permissionType=ALLOW) 

Current ACLs for resource `ResourcePattern(resourceType=GROUP, name=console-consumer, patternType=PREFIXED)`: 
 	(principal=User:consumer, host=*, operation=READ, permissionType=ALLOW) 


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Med9HMF8vlsxS3gFINV5Kp6Uq.svg)](https://asciinema.org/a/Med9HMF8vlsxS3gFINV5Kp6Uq)

</TabItem>
</Tabs>

## Listing topics in aclCluster



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config aclCluster-consumer.properties \
    --list
```


</TabItem>
<TabItem value="Output">

```
restricted-topic

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ozRiDq1h03YlnEBGA0YPbPFwL.svg)](https://asciinema.org/a/ozRiDq1h03YlnEBGA0YPbPFwL)

</TabItem>
</Tabs>

## Give read/write access to test-topic to producer SA



<Tabs>
<TabItem value="Command">


```sh
kafka-acls \
    --bootstrap-server localhost:6969 \
    --command-config aclCluster-admin.properties \
    --add \
    --allow-principal User:producer \
    --operation write \
    --topic restricted-topic 
```


</TabItem>
<TabItem value="Output">

```
Adding ACLs for resource `ResourcePattern(resourceType=TOPIC, name=restricted-topic, patternType=LITERAL)`: 
 	(principal=User:producer, host=*, operation=WRITE, permissionType=ALLOW) 

Current ACLs for resource `ResourcePattern(resourceType=TOPIC, name=restricted-topic, patternType=LITERAL)`: 
 	(principal=User:consumer, host=*, operation=READ, permissionType=ALLOW)
	(principal=User:producer, host=*, operation=WRITE, permissionType=ALLOW) 


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/teSk6hyHkneTV8FqpUykSYEa3.svg)](https://asciinema.org/a/teSk6hyHkneTV8FqpUykSYEa3)

</TabItem>
</Tabs>

## Listing topics in aclCluster



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config aclCluster-producer.properties \
    --list
```


</TabItem>
<TabItem value="Output">

```
restricted-topic

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/NB13gKulMStvPA4tvI8ZfeXUK.svg)](https://asciinema.org/a/NB13gKulMStvPA4tvI8ZfeXUK)

</TabItem>
</Tabs>

## Let's write into test-topic (producer)

Producing 1 message in `restricted-topic` in cluster `aclCluster`

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "msg" : "test message"
}
```
with


```sh
echo '{"msg":"test message"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config aclCluster-producer.properties \
        --topic restricted-topic
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/t5AOlibhndRDqEK95KwQ2j7Ps.svg)](https://asciinema.org/a/t5AOlibhndRDqEK95KwQ2j7Ps)

</TabItem>
</Tabs>

## Let's consume from test-topic (consumer)

Let's consume from test-topic (consumer) in cluster `aclCluster`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config aclCluster-consumer.properties \
    --topic restricted-topic \
    --from-beginning \
    --timeout-ms 10000 | jq
```


returns 1 event
```json
{
  "msg" : "test message"
}
```


</TabItem>
<TabItem value="Output">

```json
[2024-01-31 01:28:52,964] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages
{
  "msg": "test message"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/PKGTJWQXevUnwfjrsFcb32AfK.svg)](https://asciinema.org/a/PKGTJWQXevUnwfjrsFcb32AfK)

</TabItem>
</Tabs>

## Consumer-sa cannot write into the test-topic

Producing 1 message in `restricted-topic` in cluster `aclCluster`

<Tabs>
<TabItem value="Command">


Sending 1 event
```json
{
  "msg" : "I would be surprised if it would work!"
}
```
with


```sh
echo '{"msg":"I would be surprised if it would work!"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config aclCluster-consumer.properties \
        --topic restricted-topic
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> org.apache.kafka.common.errors.TopicAuthorizationException:
>> Not authorized to access topics: [restricted-topic]
> ```




</TabItem>
<TabItem value="Output">

```
[2024-01-31 01:28:54,677] ERROR [Producer clientId=console-producer] Aborting producer batches due to fatal error (org.apache.kafka.clients.producer.internals.Sender)
org.apache.kafka.common.errors.TransactionalIdAuthorizationException: Transactional Id authorization failed.
[2024-01-31 01:28:54,678] ERROR Error when sending message to topic restricted-topic with key: null, value: 48 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback)
org.apache.kafka.common.errors.TransactionalIdAuthorizationException: Transactional Id authorization failed.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/3IlkRfH0Uu2wXTbcfjsoPv8qB.svg)](https://asciinema.org/a/3IlkRfH0Uu2wXTbcfjsoPv8qB)

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
 Container schema-registry  Stopping
 Container gateway1  Stopping
 Container gateway2  Stopped
 Container gateway2  Removing
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway2  Removed
 Container gateway1  Removed
 Container schema-registry  Removed
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container kafka2  Removed
 Container kafka3  Removed
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network acls-vcluster_default  Removing
 Network acls-vcluster_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/nLsDl2PqlULFjfydULd0GnXou.svg)](https://asciinema.org/a/nLsDl2PqlULFjfydULd0GnXou)

</TabItem>
</Tabs>

