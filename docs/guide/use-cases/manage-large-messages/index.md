---
sidebar_position: 370
title: Manage large messages
description: Handle large Kafka messages using Conduktor
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';
import ProductScalePlus from '@site/src/components/shared/product-scale-plus.md';

<ProductScalePlus /> 

## IS THIS DEMO OUT OF DATE??

Large message handling in Kafka with built-in claimcheck pattern

## View the full demo in realtime

<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692128.svg)](https://asciinema.org/a/692128)

</TabItem>
</Tabs>

## Review the docker compose environment

As can be seen from `docker-compose.yaml` the demo environment consists of the following services:

* cli-aws
* gateway1
* gateway2
* kafka-client
* kafka1
* kafka2
* kafka3
* minio
* schema-registry

<Tabs>
<TabItem value="Command">

```sh
cat docker-compose.yaml
```

</TabItem>
<TabItem value="File content">

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
    image: harbor.cdkt.dev/conduktor/conduktor-gateway:3.5.0-SNAPSHOT
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
    image: harbor.cdkt.dev/conduktor/conduktor-gateway:3.5.0-SNAPSHOT
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

## Starting the Docker environment

Start all your docker processes, wait for them to be up and ready, then run in background

- `--wait`: Wait for services to be `running|healthy` (this implies the detached mode).
- `--detach`: Detached mode: runs containers in the background

<Tabs>
<TabItem value="Command">

```sh
docker compose up --detach --wait
```

</TabItem>
<TabItem value="Output">

```
 Network large-messages_default  Creating
 Network large-messages_default  Created
 Container kafka3  Creating
 Container kafka1  Creating
 Container kafka2  Creating
 Container cli-aws  Creating
 Container minio  Creating
 Container kafka-client  Creating
 Container cli-aws  Created
 Container minio  Created
 Container kafka2  Created
 Container kafka1  Created
 Container kafka3  Created
 Container gateway2  Creating
 Container gateway1  Creating
 Container schema-registry  Creating
 Container kafka-client  Created
 Container gateway1  Created
 Container schema-registry  Created
 Container gateway2  Created
 Container kafka2  Starting
 Container kafka-client  Starting
 Container kafka1  Starting
 Container kafka3  Starting
 Container minio  Starting
 Container cli-aws  Starting
 Container minio  Started
 Container cli-aws  Started
 Container kafka3  Started
 Container kafka1  Started
 Container kafka-client  Started
 Container kafka2  Started
 Container kafka1  Waiting
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container schema-registry  Starting
 Container kafka2  Healthy
 Container gateway2  Starting
 Container kafka1  Healthy
 Container gateway1  Starting
 Container schema-registry  Started
 Container gateway2  Started
 Container gateway1  Started
 Container gateway1  Waiting
 Container kafka1  Waiting
 Container cli-aws  Waiting
 Container kafka2  Waiting
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container minio  Waiting
 Container kafka3  Healthy
 Container kafka-client  Healthy
 Container minio  Healthy
 Container kafka1  Healthy
 Container cli-aws  Healthy
 Container kafka2  Healthy
 Container gateway2  Healthy
 Container gateway1  Healthy
 Container schema-registry  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692117.svg)](https://asciinema.org/a/692117)

</TabItem>
</Tabs>

## Review credentials

<Tabs>
<TabItem value="Command">

```sh
cat credentials
```

</TabItem>
<TabItem value="File content">

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

[![asciicast](https://asciinema.org/a/692118.svg)](https://asciinema.org/a/692118)

</TabItem>
</Tabs>

## Creating topic large-messages on gateway1

Creating on `gateway1`:

- Topic `large-messages` with partitions:1 and replication-factor:1

<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
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

[![asciicast](https://asciinema.org/a/692119.svg)](https://asciinema.org/a/692119)

</TabItem>
</Tabs>

## Adding interceptor large-messages

Let's ask Gateway to offload large messages to S3

`step-08-large-messages-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "large-messages"
  },
  "spec" : {
    "comment" : "Adding interceptor: large-messages",
    "pluginClass" : "io.conduktor.gateway.interceptor.LargeMessageHandlingPlugin",
    "priority" : 100,
    "config" : {
      "topic" : "large-messages",
      "s3Config" : {
        "accessKey" : "minio",
        "secretKey" : "minio123",
        "bucketName" : "bucket",
        "region" : "eu-south-1",
        "uri" : "http://minio:9000"
      }
    }
  }
}
```

<Tabs>
<TabItem value="Command">
```sh
curl \
    --silent \
    --request PUT "http://localhost:8888/gateway/v2/interceptor" \
    --header "Content-Type: application/json" \
    --user "admin:conduktor" \
    --data @step-08-large-messages-interceptor.json | jq
```

</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "large-messages",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: large-messages",
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
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692120.svg)](https://asciinema.org/a/692120)

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
-rw-r--r--  1 johndoe  staff    40M Nov 25 22:46 large-message.bin

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692121.svg)](https://asciinema.org/a/692121)

</TabItem>
</Tabs>

## Sending large PDF file through Kafka

<Tabs>
<TabItem value="Command">

```sh
requiredMemory=$(( 2 * $(cat large-message.bin | wc -c | awk '{print $1}')))

kafka-producer-perf-test \
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
Reading payloads from: /Users/JohnDoe/Documents/Proxy/conduktor-proxy-2/functional-testing/target/2024.11.25-22:19:13/large-messages/large-message.bin
Number of messages read: 1
1 records sent, 0.242954 records/sec (9.72 MB/sec), 4108.00 ms avg latency, 4108.00 ms max latency, 4108 ms 50th, 4108 ms 95th, 4108 ms 99th, 4108 ms 99.9th.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692122.svg)](https://asciinema.org/a/692122)

</TabItem>
</Tabs>

## Let's read the message back

<Tabs>
<TabItem value="Command">
```sh
kafka-console-consumer  \
  --bootstrap-server localhost:6969 \
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

[![asciicast](https://asciinema.org/a/692123.svg)](https://asciinema.org/a/692123)

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
-rw-r--r--  1 johndoe  staff  41943041 Nov 25 22:46 from-kafka.bin
-rw-r--r--  1 johndoe  staff  41943041 Nov 25 22:46 large-message.bin

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692124.svg)](https://asciinema.org/a/692124)

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
2025-01-25 22:46:22   40.0 MiB large-messages/e38c3deb-b490-4673-8e0f-4894718d2b50

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692125.svg)](https://asciinema.org/a/692125)

</TabItem>
</Tabs>

## Consuming from large-messages

Consuming from large-messages in cluster `kafka1`

<Tabs>
<TabItem value="Command">

```sh
kafka-console-consumer \
    --bootstrap-server localhost:9092,localhost:9093,localhost:9094 \
    --topic large-messages \
    --from-beginning \
    --max-messages 5 \
    --timeout-ms 3000 \
    --property print.headers=true | jq
```

</TabItem>
<TabItem value="Output">

```json
parse error: Invalid numeric literal at line 1, column 20
[2025-01-25 22:46:31,743] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692126.svg)](https://asciinema.org/a/692126)

</TabItem>
</Tabs>

## Tearing down the Docker environment

Remove all your docker processes and associated volumes

- `--volumes`: Remove named volumes declared in the "volumes" section of the Compose file and anonymous volumes attached to containers.

<Tabs>

<TabItem value="Command">
```sh
docker compose down --volumes
```

</TabItem>
<TabItem value="Output">

```
 Container kafka-client  Stopping
 Container schema-registry  Stopping
 Container minio  Stopping
 Container cli-aws  Stopping
 Container gateway1  Stopping
 Container gateway2  Stopping
 Container minio  Stopped
 Container minio  Removing
 Container minio  Removed
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway1  Removed
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
 Container cli-aws  Stopped
 Container cli-aws  Removing
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container cli-aws  Removed
 Container kafka-client  Removed
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Network large-messages_default  Removing
 Network large-messages_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692127.svg)](https://asciinema.org/a/692127)

</TabItem>
</Tabs>


## Handle large messages/batches

The <GlossaryTerm>Interceptor</GlossaryTerm> for handling large messages/batches will save the actual messages produced to <GlossaryTerm>Gateway</GlossaryTerm> into a cloud storage service. This helps to protect data or optimize storage in actual Kafka.

We currently support:

- **Amazon S3** or Amazon Simple Storage Service is a service offered by AWS (Amazon Web Services) that provides object storage through a web service interface.
- **Azure Blob Storage** is a service offered by Microsoft Azure that provides blob storage.

### Configuration

| Key                | Type            | Default | Description                                                                                            |
|:-------------------|:----------------|:--------|:-------------------------------------------------------------------------------------------------------|
| topic              | String          | `.*`    | Topics that match this regex will have the Interceptor applied                                         |
| s3Config           | [S3](#s3)       |         | Amazon S3 configuration                                                                                |
| azureConfig        | [Azure](#azure) |         | Azure Blob Storage configuration                                                                       |
| minimumSizeInBytes | int             |         | Only upload to S3 if batch/message record has size greater than or equal to this `minimumSizeInBytes` |
| localDiskDirectory | string          |         | Local temp storage, used when we download file from S3 while fetching messages                         |

## Amazon S3

The S3 credentials default to managed identity. They will be overwritten if a specific `basic credentials` (`accessKey` and `secretKey`) or `session credentials` (`accessKey`, `secretKey` and `sessionToken`) are configured.

| Key                | Type         | Description                                                                    |
|:-------------------|:-------------|:-------------------------------------------------------------------------------|
| accessKey          | string       | S3 access key                                                                  |
| secretKey          | string       | S3 secret key                                                                  |
| sessionToken       | string       | S3 session token                                                               |
| bucketName         | string       | S3 bucket name                                                                 |
| uri                | string       | S3 URI                                                                         |
| region             | string       | S3 region                                                                      |

## Azure Blob

Note that your application will require at least **Storage Blob Data Contributor** permissions to be able to read/write the data.

| Key           | Type         | Description                                        |
|:--------------|:-------------|:---------------------------------------------------|
| tenantId      | string       | Azure tenant ID                                    |
| clientId      | string       | Azure client ID                                    |
| secret        | string       | Azure client secret                                |
| blobEndpoint  | string       | Azure Blob Storage endpoint to use                 |
| bucketName    | string       | Bucket (container) name in Blob Storage configured to store in |

## Examples

#### Large batches

Each *batch* that's above the `minimumSizeInBytes` threshold will be saved in **one file** on Amazon S3, with credentials defaulting to managed identity:

```json
{
  "name": "myLargeBatchHandlingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.LargeBatchHandlingPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "minimumSizeInBytes": 1024,
    "localDiskDirectory": "myStorage/",
    "s3Config": {
      "bucketName": "myBucketName",
      "uri": "http://myexampleuri",
      "region": "us-east-1",
    }
  }
}
```

With `basic credentials`:

```json
{
  "name": "myLargeBatchHandlingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.LargeBatchHandlingPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "minimumSizeInBytes": 1024,
    "localDiskDirectory": "myStorage/",
    "s3Config": {
      "accessKey": "myAccessKey",
      "secretKey": "mySecretKey",
      "bucketName": "myBucketName",
      "uri": "http://myexampleuri",
      "region": "us-east-1",
    }
  }
}
```

With `session credentials`:

```json
{
  "name": "myLargeBatchHandlingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.LargeBatchHandlingPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "minimumSizeInBytes": 1024,
    "localDiskDirectory": "myStorage/",
    "s3Config": {
      "accessKey": "myAccessKey",
      "secretKey": "mySecretKey",
      "sessionToken": "mySessionToken",
      "bucketName": "myBucketName",
      "uri": "http://myexampleuri",
      "region": "us-east-1",
    }
  }
}
```

#### Large messages

Each *individual message* that's above the `minimumSizeInBytes` threshold will be saved in **one file** on Amazon S3, with credentials defaulting to managed identity:

```json
{
  "name": "myLargeMessageHandlingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.LargeMessageHandlingPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "minimumSizeInBytes": 1024,
    "localDiskDirectory": "myStorage/",
    "s3Config": {
      "bucketName": "myBucketName",
      "uri": "http://myexampleuri",
      "region": "us-east-1",
    }
  }
}
```

With `basic credentials`:

```json
{
  "name": "myLargeMessageHandlingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.LargeMessageHandlingPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "minimumSizeInBytes": 1024,
    "localDiskDirectory": "myStorage/",
    "s3Config": {
      "accessKey": "myAccessKey",
      "secretKey": "mySecretKey",
      "bucketName": "myBucketName",
      "uri": "http://myexampleuri",
      "region": "us-east-1",
    }
  }
}
```

With `sessionCredentials`:

```json
{
  "name": "myLargeMessageHandlingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.LargeMessageHandlingPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "minimumSizeInBytes": 1024,
    "localDiskDirectory": "myStorage/",
    "s3Config": {
      "accessKey": "myAccessKey",
      "secretKey": "mySecretKey",
      "sessionToken": "mySessionToken",
      "bucketName": "myBucketName",
      "uri": "http://myexampleuri",
      "region": "us-east-1",
    }
  }
}
```
