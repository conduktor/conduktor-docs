---
title: SQL Based Data Quality Producer
description: SQL Based Data Quality Producer
tag: data-quality
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# What is SQL Data quality producer?

Use sql definition to assert data quality before being produced.

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692084.svg)](https://asciinema.org/a/692084)

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

<Tabs>
<TabItem value="Command">

```sh
cat docker-compose.yaml
```

</TabItem>
<TabItem value="File Content">

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
 Network sql-data-quality-producer_default  Creating
 Network sql-data-quality-producer_default  Created
 Container kafka1  Creating
 Container kafka-client  Creating
 Container kafka3  Creating
 Container kafka2  Creating
 Container kafka3  Created
 Container kafka2  Created
 Container kafka1  Created
 Container schema-registry  Creating
 Container gateway2  Creating
 Container gateway1  Creating
 Container kafka-client  Created
 Container gateway1  Created
 Container gateway2  Created
 Container schema-registry  Created
 Container kafka-client  Starting
 Container kafka1  Starting
 Container kafka3  Starting
 Container kafka2  Starting
 Container kafka1  Started
 Container kafka2  Started
 Container kafka3  Started
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka-client  Started
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container gateway1  Starting
 Container kafka3  Healthy
 Container schema-registry  Starting
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container gateway2  Starting
 Container schema-registry  Started
 Container gateway1  Started
 Container gateway2  Started
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container kafka1  Healthy
 Container kafka-client  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container gateway2  Healthy
 Container gateway1  Healthy
 Container schema-registry  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692074.svg)](https://asciinema.org/a/692074)

</TabItem>
</Tabs>

## Creating topic cars on gateway1

Creating on `gateway1`:

* Topic `cars` with partitions:1 and replication-factor:1






<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
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

[![asciicast](https://asciinema.org/a/692075.svg)](https://asciinema.org/a/692075)

</TabItem>
</Tabs>

## Adding interceptor cars-quality

Let's create an interceptor to ensure the data produced is valid.




`step-06-cars-quality-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "cars-quality"
  },
  "spec" : {
    "comment" : "Adding interceptor: cars-quality",
    "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.DataQualityProducerPlugin",
    "priority" : 100,
    "config" : {
      "statement" : "SELECT * FROM cars WHERE color = 'red' and record.key.year > 2020",
      "action" : "BLOCK_WHOLE_BATCH",
      "deadLetterTopic" : "dead-letter-topic"
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
    --data @step-06-cars-quality-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "cars-quality",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: cars-quality",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.DataQualityProducerPlugin",
      "priority": 100,
      "config": {
        "statement": "SELECT * FROM cars WHERE color = 'red' and record.key.year > 2020",
        "action": "BLOCK_WHOLE_BATCH",
        "deadLetterTopic": "dead-letter-topic"
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692076.svg)](https://asciinema.org/a/692076)

</TabItem>
</Tabs>

## Producing an invalid car

Produce invalid record to the cars topic (record is not produced because color is not red)




Sending 1 event
```json
{
  "type" : "SUV",
  "price" : 2000,
  "color" : "blue"
}
```



<Tabs>

<TabItem value="Command">
```sh
echo '{"type":"SUV","price":2000,"color":"blue"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic cars
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> org.apache.kafka.common.errors.PolicyViolationException:
>> Request parameters do not satisfy the configured policy: Data quality policy is violated.
> ```



</TabItem>
<TabItem value="Output">

```
>>[2024-11-25 21:28:01,306] ERROR Error when sending message to topic cars with key: null, value: 42 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy: Data quality policy is violated.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692077.svg)](https://asciinema.org/a/692077)

</TabItem>
</Tabs>

## Producing an invalid car based on key

Produce invalid record to the cars topic (record is not produced because year is not > 2020)




Sending 1 event
```json
{
  "key" : "{\"year\":2010,\"make\":\"BMW\"}",
  "value" : {
    "type" : "Sports",
    "price" : 1000,
    "color" : "red"
  }
}
```



<Tabs>

<TabItem value="Command">
```sh
echo '{"year":2010,"make":"BMW"}\t{"type":"Sports","price":1000,"color":"red"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --property "parse.key=true" \
        --topic cars
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> org.apache.kafka.common.errors.PolicyViolationException:
>> Request parameters do not satisfy the configured policy: Data quality policy is violated.
> ```



</TabItem>
<TabItem value="Output">

```
>>[2024-11-25 21:28:02,779] ERROR Error when sending message to topic cars with key: 26 bytes, value: 44 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy: Data quality policy is violated.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692078.svg)](https://asciinema.org/a/692078)

</TabItem>
</Tabs>

## Producing a valid car

Produce valid record to the cars topic




Sending 1 event
```json
{
  "headers" : {
    "X-HEADER-1" : "value1",
    "X-HEADER-2" : "value2"
  },
  "key" : "{\"year\":2023,\"make\":\"Vinfast\"}",
  "value" : {
    "type" : "Trucks",
    "price" : 2500,
    "color" : "red"
  }
}
```



<Tabs>

<TabItem value="Command">
```sh
echo 'X-HEADER-1:value1,X-HEADER-2:value2\t{"year":2023,"make":"Vinfast"}\t{"type":"Trucks","price":2500,"color":"red"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --property "parse.key=true" \
        --property "parse.headers=true" \
        --topic cars
```


</TabItem>
<TabItem value="Output">

```
>>

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692079.svg)](https://asciinema.org/a/692079)

</TabItem>
</Tabs>

## Consuming from cars

Let's confirm just one record is there by consuming from the cars topic.






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic cars \
    --from-beginning \
    --max-messages 2 \
    --timeout-ms 3000 \
    --property print.key=true \
    --property print.headers=true | jq
```


returns 1 event
```json
{
  "headers" : {
    "X-HEADER-1" : "value1",
    "X-HEADER-2" : "value2"
  },
  "key" : "{\"year\":2023,\"make\":\"Vinfast\"}",
  "value" : {
    "type" : "Trucks",
    "price" : 2500,
    "color" : "red"
  }
}
```

</TabItem>
<TabItem value="Output">

```json
parse error: Invalid numeric literal at line 1, column 11
[2024-11-25 21:28:08,972] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692080.svg)](https://asciinema.org/a/692080)

</TabItem>
</Tabs>

## Confirm all invalid cars are in the dead letter topic

Let's confirm the invalid records are in the dead letter topic.






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:9092,localhost:9093,localhost:9094 \
    --topic dead-letter-topic \
    --from-beginning \
    --max-messages 3 \
    --timeout-ms 3000 \
    --property print.key=true \
    --property print.headers=true | jq
```


returns 2 events
```json
{
  "headers" : {
    "X-ERROR-MSG" : "Message does not match the statement [SELECT * FROM cars WHERE color = 'red' and record.key.year > 2020]",
    "X-TOPIC" : "cars",
    "X-PARTITION" : "0"
  },
  "key" : null,
  "value" : {
    "type" : "SUV",
    "price" : 2000,
    "color" : "blue"
  }
}
{
  "headers" : {
    "X-ERROR-MSG" : "Message does not match the statement [SELECT * FROM cars WHERE color = 'red' and record.key.year > 2020]",
    "X-TOPIC" : "cars",
    "X-PARTITION" : "0"
  },
  "key" : "{\"year\":2010,\"make\":\"BMW\"}",
  "value" : {
    "type" : "Sports",
    "price" : 1000,
    "color" : "red"
  }
}
```

</TabItem>
<TabItem value="Output">

```json
parse error: Invalid numeric literal at line 1, column 12
[2024-11-25 21:28:13,359] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692081.svg)](https://asciinema.org/a/692081)

</TabItem>
</Tabs>

## Check in the audit log that messages denial were captured

Check in the audit log that messages denial were captured in cluster `kafka1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:9092,localhost:9093,localhost:9094 \
    --topic _conduktor_gateway_auditlogs \
    --from-beginning \
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.DataQualityProducerInterceptor")'
```


returns 2 events
```json
{
  "id" : "90af879b-34ef-4ff2-bc7a-be047384170c",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/172.25.0.1:52792"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:27:11.915906419Z",
  "eventData" : {
    "interceptorName" : "cars-quality",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.DataQualityProducerInterceptor",
    "message" : "Request parameters do not satisfy the configured policy: Data quality policy is violated."
  }
}
{
  "id" : "72a7e9ab-5441-4a5a-9aed-39930230b159",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/172.25.0.1:52792"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:27:11.988664753Z",
  "eventData" : {
    "interceptorName" : "cars-quality",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.DataQualityProducerInterceptor",
    "message" : "Request parameters do not satisfy the configured policy: Data quality policy is violated."
  }
}
```

</TabItem>
<TabItem value="Output">

```
{"id":"41942ff7-ecc4-44a3-88bd-b491e17e7ecd","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.27.0.7:6969","remoteAddress":"/172.27.0.1:44688"},"specVersion":"0.1.0","time":"2024-11-25T21:27:58.283852135Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"36733b78-7ba6-4590-9e36-c5d12c5d4f63","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.27.0.7:6969","remoteAddress":"/172.27.0.1:44688"},"specVersion":"0.1.0","time":"2024-11-25T21:27:58.378378385Z","eventData":"SUCCESS"}
{"id":"cc131dc7-0f76-4131-b428-2913cc8ad416","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.27.0.7:6970","remoteAddress":"/172.27.0.1:51298"},"specVersion":"0.1.0","time":"2024-11-25T21:27:58.553975760Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"03d500bd-ce47-430f-b391-813c0c19682e","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.27.0.7:6970","remoteAddress":"/172.27.0.1:51298"},"specVersion":"0.1.0","time":"2024-11-25T21:27:58.554358719Z","eventData":"SUCCESS"}
{"id":"7c8479d4-c3b2-401b-a92a-0f5788d2a317","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.27.0.7:8888","remoteAddress":"172.27.0.1:47626"},"specVersion":"0.1.0","time":"2024-11-25T21:27:59.123284677Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"c0c21483-78dc-4ca0-ac6f-0d695ba85163","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.27.0.7:6969","remoteAddress":"/172.27.0.1:44690"},"specVersion":"0.1.0","time":"2024-11-25T21:28:00.679489136Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"5f214824-afe4-479c-b5b8-e34593d84551","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.27.0.7:6969","remoteAddress":"/172.27.0.1:44690"},"specVersion":"0.1.0","time":"2024-11-25T21:28:00.680416386Z","eventData":"SUCCESS"}
{"id":"0c3058fc-8702-48f9-8918-71fe6d486cfb","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.27.0.7:6971","remoteAddress":"/172.27.0.1:54732"},"specVersion":"0.1.0","time":"2024-11-25T21:28:00.754747803Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"e063cbff-d841-4993-adcd-0383550027ee","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.27.0.7:6971","remoteAddress":"/172.27.0.1:54732"},"specVersion":"0.1.0","time":"2024-11-25T21:28:00.755120720Z","eventData":"SUCCESS"}
{"id":"48e26ed1-d3a7-416e-b309-8b1cd9c462c1","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.27.0.7:6972","remoteAddress":"/172.27.0.1:33766"},"specVersion":"0.1.0","time":"2024-11-25T21:28:00.886962678Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"b3b20986-d8cf-47cc-99e1-dde23099e667","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.27.0.7:6972","remoteAddress":"/172.27.0.1:33766"},"specVersion":"0.1.0","time":"2024-11-25T21:28:00.887497345Z","eventData":"SUCCESS"}
{"id":"c413110b-569d-4ff7-9bc6-aba19241155d","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.27.0.1:54732"},"specVersion":"0.1.0","time":"2024-11-25T21:28:01.298110928Z","eventData":{"interceptorName":"cars-quality","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.DataQualityProducerInterceptor","message":"Request parameters do not satisfy the configured policy: Data quality policy is violated."}}
{"id":"94b59243-1a70-41f4-b2bc-7b23c0ea0acd","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.27.0.7:6969","remoteAddress":"/172.27.0.1:44694"},"specVersion":"0.1.0","time":"2024-11-25T21:28:02.558366304Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"259ee5f8-3ac8-46a7-829b-a13bead0cf9e","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.27.0.7:6969","remoteAddress":"/172.27.0.1:44694"},"specVersion":"0.1.0","time":"2024-11-25T21:28:02.559702054Z","eventData":"SUCCESS"}
{"id":"5a1f6a9e-a409-463b-a4d3-47253e1fa4d4","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.27.0.7:6970","remoteAddress":"/172.27.0.1:51302"},"specVersion":"0.1.0","time":"2024-11-25T21:28:02.633970012Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"2952a1d2-1b7b-4cce-8dcc-61b35f2ee4f8","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.27.0.7:6970","remoteAddress":"/172.27.0.1:51302"},"specVersion":"0.1.0","time":"2024-11-25T21:28:02.634325221Z","eventData":"SUCCESS"}
{"id":"40ff9e9c-b259-4bc5-95b0-a0dfc3b15681","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.27.0.7:6971","remoteAddress":"/172.27.0.1:54738"},"specVersion":"0.1.0","time":"2024-11-25T21:28:02.762816596Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"bf826c3e-5d8b-4f1f-9736-6fc0204a035a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.27.0.7:6971","remoteAddress":"/172.27.0.1:54738"},"specVersion":"0.1.0","time":"2024-11-25T21:28:02.763203887Z","eventData":"SUCCESS"}
{"id":"ba55931f-d854-4ebd-8ae2-2b087a62acee","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.27.0.1:54738"},"specVersion":"0.1.0","time":"2024-11-25T21:28:02.778365887Z","eventData":{"interceptorName":"cars-quality","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.DataQualityProducerInterceptor","message":"Request parameters do not satisfy the configured policy: Data quality policy is violated."}}
{"id":"79a6644d-8c3e-4bcb-a9d8-4548b5be668f","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.27.0.7:6969","remoteAddress":"/172.27.0.1:45908"},"specVersion":"0.1.0","time":"2024-11-25T21:28:04.068284846Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"f119bf9a-7c52-4616-b351-c30f1c49583e","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.27.0.7:6969","remoteAddress":"/172.27.0.1:45908"},"specVersion":"0.1.0","time":"2024-11-25T21:28:04.074077763Z","eventData":"SUCCESS"}
{"id":"a6609edb-d251-4c23-8c0b-3542ed5336f8","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.27.0.7:6971","remoteAddress":"/172.27.0.1:46836"},"specVersion":"0.1.0","time":"2024-11-25T21:28:04.135041388Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"673f83b2-0801-4847-8217-fbfbd7f4be31","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.27.0.7:6971","remoteAddress":"/172.27.0.1:46836"},"specVersion":"0.1.0","time":"2024-11-25T21:28:04.135744596Z","eventData":"SUCCESS"}
{"id":"89e768c9-fae6-4964-9b7d-01b3b647e696","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.27.0.7:6972","remoteAddress":"/172.27.0.1:60326"},"specVersion":"0.1.0","time":"2024-11-25T21:28:04.248357138Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"62532f12-8ae0-465b-a225-334fa28760af","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.27.0.7:6972","remoteAddress":"/172.27.0.1:60326"},"specVersion":"0.1.0","time":"2024-11-25T21:28:04.248857805Z","eventData":"SUCCESS"}
{"id":"057255e4-3ccc-4b21-bd0e-be892efc286e","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.27.0.7:6969","remoteAddress":"/172.27.0.1:45918"},"specVersion":"0.1.0","time":"2024-11-25T21:28:05.569946305Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"f1edf612-d75a-428e-b8fb-cc84778a26b7","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.27.0.7:6969","remoteAddress":"/172.27.0.1:45918"},"specVersion":"0.1.0","time":"2024-11-25T21:28:05.570460305Z","eventData":"SUCCESS"}
{"id":"e7e97453-7ba0-4580-8192-3493f152903a","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.27.0.7:6970","remoteAddress":"/172.27.0.1:56644"},"specVersion":"0.1.0","time":"2024-11-25T21:28:05.706102208Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"9250767c-e394-4d52-9d60-9019a5dfeda6","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.27.0.7:6970","remoteAddress":"/172.27.0.1:56644"},"specVersion":"0.1.0","time":"2024-11-25T21:28:05.707093125Z","eventData":"SUCCESS"}
{"id":"77e182d9-030e-45d2-8510-63d3c0f58b7d","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.27.0.7:6971","remoteAddress":"/172.27.0.1:46848"},"specVersion":"0.1.0","time":"2024-11-25T21:28:05.738488041Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"ee615fd5-d406-4d4c-ab20-df89e69e9862","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.27.0.7:6971","remoteAddress":"/172.27.0.1:46848"},"specVersion":"0.1.0","time":"2024-11-25T21:28:05.738852500Z","eventData":"SUCCESS"}
{"id":"cf580498-26f4-49e1-bda0-a6b6e4cee007","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.27.0.7:6971","remoteAddress":"/172.27.0.1:46854"},"specVersion":"0.1.0","time":"2024-11-25T21:28:05.906221041Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"b309b71a-0e1b-4a0c-9998-6d982e101f3d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.27.0.7:6971","remoteAddress":"/172.27.0.1:46854"},"specVersion":"0.1.0","time":"2024-11-25T21:28:05.906601500Z","eventData":"SUCCESS"}
[2024-11-25 21:28:17,720] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 33 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692082.svg)](https://asciinema.org/a/692082)

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
 Container kafka-client  Stopping
 Container gateway2  Stopping
 Container gateway1  Stopping
 Container schema-registry  Stopping
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway1  Removed
 Container gateway2  Removed
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container schema-registry  Removed
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Network sql-data-quality-producer_default  Removing
 Network sql-data-quality-producer_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692083.svg)](https://asciinema.org/a/692083)

</TabItem>
</Tabs>

