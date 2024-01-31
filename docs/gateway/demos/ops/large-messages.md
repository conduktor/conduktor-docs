---
title: Large message support
description: Large message support
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Large messages support in Kafka with built-in claimcheck pattern.



## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/zfdMgBQrB8i60qapME6LJnt87.svg)](https://asciinema.org/a/zfdMgBQrB8i60qapME6LJnt87)

</TabItem>
</Tabs>

## Review the docker compose environment

As can be seen from `docker-compose.yaml` the demo environment consists of the following services:

* cli-aws
* gateway1
* gateway2
* kafka1
* kafka2
* kafka3
* minio
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
  minio:
    image: quay.io/minio/minio
    hostname: minio
    environment:
      MINIO_SERVER_HOST: minio
      MINIO_ROOT_USER: minio
      MINIO_ROOT_PASSWORD: minio123
      MINIO_SITE_REGION: eu-south-1
    container_name: minio
    ports:
    - 9000:9000
    command: minio server /data
  cli-aws:
    image: amazon/aws-cli
    hostname: cli-aws
    container_name: cli-aws
    entrypoint: sleep 100d
    volumes:
    - type: bind
      source: credentials
      target: /root/.aws/credentials
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
 Container minio  Running
 Container cli-aws  Running
 Container zookeeper  Running
 Container kafka3  Running
 Container kafka1  Running
 Container kafka2  Running
 Container schema-registry  Running
 Container gateway1  Running
 Container gateway2  Running
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
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container kafka1  Waiting
 Container gateway1  Waiting
 Container cli-aws  Waiting
 Container kafka2  Waiting
 Container gateway2  Waiting
 Container minio  Waiting
 Container zookeeper  Waiting
 Container minio  Healthy
 Container cli-aws  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container schema-registry  Healthy
 Container zookeeper  Healthy
 Container gateway1  Healthy
 Container gateway2  Healthy
 Container kafka1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Bomjn1BevIYAamqxo1nUf8puU.svg)](https://asciinema.org/a/Bomjn1BevIYAamqxo1nUf8puU)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNDQ2MTA3NH0.mTEXZm2KUREiKXtUyVZRwrDnKH2f6OZIqJnuG5akO1k';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/09C7s6lOfDNeCqeNvNCckMKAO.svg)](https://asciinema.org/a/09C7s6lOfDNeCqeNvNCckMKAO)

</TabItem>
</Tabs>

## Review credentials



<Tabs>
<TabItem value="Command">

```sh
cat credentials
```

</TabItem>
<TabItem value="File Content">

```
[minio]
aws_access_key_id = minio
aws_secret_access_key = minio123
```
</TabItem>
</Tabs>

## Let's create a bucket



<Tabs>
<TabItem value="Command">


```sh
docker compose exec cli-aws \
  aws \
    --profile minio \
    --endpoint-url=http://minio:9000 \
    --region eu-south-1 \
    s3api create-bucket \
      --bucket bucket
```


</TabItem>
<TabItem value="Output">

```
{
    "Location": "/bucket"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Q4Vwgn98Y7gUj1WXaauzkfg7v.svg)](https://asciinema.org/a/Q4Vwgn98Y7gUj1WXaauzkfg7v)

</TabItem>
</Tabs>

## Creating topic large-messages on teamA

Creating on `teamA`:

* Topic `large-messages` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic large-messages
```


</TabItem>
<TabItem value="Output">

```
Created topic large-messages.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/sWsVyGd6PZrcJegMVVK1O6kWt.svg)](https://asciinema.org/a/sWsVyGd6PZrcJegMVVK1O6kWt)

</TabItem>
</Tabs>

## Adding interceptor large-messages

Let's ask Gateway to offload large messages to S3

<Tabs>
<TabItem value="Command">


```sh
cat step-09-large-messages.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/large-messages" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-09-large-messages.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "pluginClass": "io.conduktor.gateway.interceptor.LargeMessageHandlingPlugin",
  "priority": 100,
  "config": {
    "topic": "large-messages",
    "s3Config": {
      "accessKey": "minio",
      "secretKey": "minio123",
      "bucketName": "bucket",
      "region": "eu-south-1",
      "uri": "http://minio:9000"
    }
  }
}
{
  "message": "large-messages is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/1DrIOobMP3IEMz8ReUoK16vf8.svg)](https://asciinema.org/a/1DrIOobMP3IEMz8ReUoK16vf8)

</TabItem>
</Tabs>

## Let's create a large message



<Tabs>
<TabItem value="Command">


```sh
openssl rand -hex $((20*1024*1024)) > large-message.bin 
ls -lh large-message.bin
```


</TabItem>
<TabItem value="Output">

```
-rw-r--r--@ 1 framiere  staff    40M 31 jan 08:11 large-message.bin

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/R74GtC0reNnFSug7VtOf9eTOt.svg)](https://asciinema.org/a/R74GtC0reNnFSug7VtOf9eTOt)

</TabItem>
</Tabs>

## Sending large pdf file through kafka



<Tabs>
<TabItem value="Command">


```sh
requiredMemory=$(( 2 * $(cat large-message.bin | wc -c | awk '{print $1}')))

kafka-producer-perf-test \
  --producer.config teamA-sa.properties \
  --topic large-messages \
  --throughput -1 \
  --num-records 1 \
  --payload-file large-message.bin \
  --producer-props \
    bootstrap.servers=localhost:6969 \
    max.request.size=$requiredMemory \
    buffer.memory=$requiredMemory
```


</TabItem>
<TabItem value="Output">

```
Reading payloads from: /Users/framiere/conduktor/conduktor-gateway-functional-testing/target/2024.01.31-07:09:00/large-messages/large-message.bin
Number of messages read: 1
1 records sent, 0,380807 records/sec (15,23 MB/sec), 2607,00 ms avg latency, 2607,00 ms max latency, 2607 ms 50th, 2607 ms 95th, 2607 ms 99th, 2607 ms 99.9th.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/mvQXK6e0oAYJrCrWseYv3q91Y.svg)](https://asciinema.org/a/mvQXK6e0oAYJrCrWseYv3q91Y)

</TabItem>
</Tabs>

## Let's read the message back



<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer  \
  --bootstrap-server localhost:6969 \
  --consumer.config teamA-sa.properties \
  --topic large-messages \
  --from-beginning \
  --max-messages 1 > from-kafka.bin
```


</TabItem>
<TabItem value="Output">

```
Processed a total of 1 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/hIifVBaVUlODTVDOTpFi9Zxtt.svg)](https://asciinema.org/a/hIifVBaVUlODTVDOTpFi9Zxtt)

</TabItem>
</Tabs>

## Let's compare the files



<Tabs>
<TabItem value="Command">


```sh
ls -lH *bin
```


</TabItem>
<TabItem value="Output">

```
-rw-r--r--@ 1 framiere  staff  41943041 31 jan 08:11 from-kafka.bin
-rw-r--r--@ 1 framiere  staff  41943041 31 jan 08:11 large-message.bin

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/w1ESfbxoo8jqoRGmxW0sx2kne.svg)](https://asciinema.org/a/w1ESfbxoo8jqoRGmxW0sx2kne)

</TabItem>
</Tabs>

## Let's look at what's inside minio



<Tabs>
<TabItem value="Command">


```sh
docker compose exec cli-aws \
    aws \
        --profile minio \
        --endpoint-url=http://minio:9000 \
        --region eu-south-1 \
        s3 \
        ls s3://bucket --recursive --human-readable
```


</TabItem>
<TabItem value="Output">

```
2024-01-31 07:11:24   40.0 MiB large-messages/5be5b9a8-380d-4e16-b47c-05197afb9efa

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/QA00WEZeV18tXhhBiWI5nQ14t.svg)](https://asciinema.org/a/QA00WEZeV18tXhhBiWI5nQ14t)

</TabItem>
</Tabs>

## Consuming from teamAlarge-messages

Consuming from teamAlarge-messages in cluster `kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --topic teamAlarge-messages \
    --from-beginning \
    --timeout-ms 10000 \
    --property print.headers=true | jq
```


</TabItem>
<TabItem value="Output">

```json
jq: parse error: Invalid numeric literal at line 1, column 17
[2024-01-31 08:11:40,209] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/IAapQsMjJUe2aqPIy749LwWlX.svg)](https://asciinema.org/a/IAapQsMjJUe2aqPIy749LwWlX)

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
 Container cli-aws  Stopping
 Container minio  Stopping
 Container gateway1  Stopping
 Container gateway2  Stopping
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway1  Stopped
 Container gateway1  Removing
 Container minio  Stopped
 Container minio  Removing
 Container cli-aws  Stopped
 Container cli-aws  Removing
 Container gateway2  Removed
 Container cli-aws  Removed
 Container gateway1  Removed
 Container minio  Removed
 Container schema-registry  Removed
 Container kafka3  Stopping
 Container kafka2  Stopping
 Container kafka1  Stopping
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka2  Removed
 Container kafka3  Removed
 Container kafka1  Removed
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network large-messages_default  Removing
 Network large-messages_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Jo8EADnBpgxtnMMEbvI9ouve9.svg)](https://asciinema.org/a/Jo8EADnBpgxtnMMEbvI9ouve9)

</TabItem>
</Tabs>

# Conclusion

ksqlDB can run in a virtual cluster where all its topics are concentrated into a single physical topic

