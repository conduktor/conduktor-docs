---
title: Audit
description: Audit
tag: security
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# What does audit do?



## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/jtuJD9HfrjfH8xJUAIkE9Go2C.svg)](https://asciinema.org/a/jtuJD9HfrjfH8xJUAIkE9Go2C)

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
    image: conduktor/conduktor-gateway:3.3.2
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
    image: conduktor/conduktor-gateway:3.3.2
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
 Network audit_default  Creating
 Network audit_default  Created
 Container kafka3  Creating
 Container kafka1  Creating
 Container kafka2  Creating
 Container kafka-client  Creating
 Container kafka-client  Created
 Container kafka2  Created
 Container kafka3  Created
 Container kafka1  Created
 Container gateway1  Creating
 Container gateway2  Creating
 Container schema-registry  Creating
 Container gateway1  Created
 Container schema-registry  Created
 Container gateway2  Created
 Container kafka1  Starting
 Container kafka3  Starting
 Container kafka-client  Starting
 Container kafka2  Starting
 Container kafka2  Started
 Container kafka1  Started
 Container kafka3  Started
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka-client  Started
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container gateway1  Starting
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container schema-registry  Starting
 Container gateway2  Starting
 Container schema-registry  Started
 Container gateway1  Started
 Container gateway2  Started
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container kafka-client  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container gateway1  Healthy
 Container gateway2  Healthy
 Container schema-registry  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ZKqAt4Yj2Vc083ttLnaH4bvI6.svg)](https://asciinema.org/a/ZKqAt4Yj2Vc083ttLnaH4bvI6)

</TabItem>
</Tabs>

## Adding interceptor guard-on-produce

Let's make sure we enforce policies also at produce time!

Here message shall be sent with compression and with the right level of resiliency




`step-05-guard-on-produce-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "guard-on-produce"
  },
  "spec" : {
    "comment" : "Adding interceptor: guard-on-produce",
    "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin",
    "priority" : 100,
    "config" : {
      "acks" : {
        "value" : [ -1 ],
        "action" : "BLOCK"
      },
      "compressions" : {
        "value" : [ "NONE", "GZIP" ],
        "action" : "BLOCK"
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
    --data @step-05-guard-on-produce-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "guard-on-produce",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: guard-on-produce",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin",
      "priority": 100,
      "config": {
        "acks": {
          "value": [
            -1
          ],
          "action": "BLOCK"
        },
        "compressions": {
          "value": [
            "NONE",
            "GZIP"
          ],
          "action": "BLOCK"
        }
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/eyEbN2FfTQTz73j5wx7s79ukZ.svg)](https://asciinema.org/a/eyEbN2FfTQTz73j5wx7s79ukZ)

</TabItem>
</Tabs>

## Listing interceptors

Listing interceptors on `gateway1`






<Tabs>

<TabItem value="Command">
```sh
curl \
    --silent \
    --request GET "http://localhost:8888/gateway/v2/interceptor" \
    --user "admin:conduktor" | jq
```


</TabItem>
<TabItem value="Output">

```json
[
  {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "guard-on-produce",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: guard-on-produce",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin",
      "priority": 100,
      "config": {
        "acks": {
          "value": [
            -1
          ],
          "action": "BLOCK"
        },
        "compressions": {
          "value": [
            "NONE",
            "GZIP"
          ],
          "action": "BLOCK"
        }
      }
    }
  }
]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/0brtf98mKf9YLbwY4emXJ9QzA.svg)](https://asciinema.org/a/0brtf98mKf9YLbwY4emXJ9QzA)

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

[![asciicast](https://asciinema.org/a/zXHsHzBAhvJhbtxghYgOZwBzF.svg)](https://asciinema.org/a/zXHsHzBAhvJhbtxghYgOZwBzF)

</TabItem>
</Tabs>

## Produce sample data to our cars topic without the right policies

Produce 1 record ... that do not match our policy




Sending 1 event
```json
{
  "type" : "Fiat",
  "color" : "red",
  "price" : -1
}
```



<Tabs>

<TabItem value="Command">
```sh
echo '{"type":"Fiat","color":"red","price":-1}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --request-required-acks 1 \
        --compression-codec snappy \
        --topic cars
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> org.apache.kafka.common.errors.PolicyViolationException:
>> Request parameters do not satisfy the configured policy.
>>Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1.
>>Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]
> ```



</TabItem>
<TabItem value="Output">

```
[2024-11-10 19:48:25,375] ERROR Error when sending message to topic cars with key: null, value: 40 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1. Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/oH5qb4EKPNH5h8cEApPtBVE4y.svg)](https://asciinema.org/a/oH5qb4EKPNH5h8cEApPtBVE4y)

</TabItem>
</Tabs>

## Check in the audit log that produce was denied

Check in the audit log that produce was denied in cluster `kafka1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:9092,localhost:9093,localhost:9094 \
    --topic _conduktor_gateway_auditlogs \
    --from-beginning \
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin")'
```


returns 1 event
```json
{
  "id" : "32c8abb3-43a6-4b3c-8848-84253be458f4",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.224.1:52810"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-10T19:47:45.978201638Z",
  "eventData" : {
    "interceptorName" : "guard-on-produce",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1. Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]"
  }
}
```

</TabItem>
<TabItem value="Output">

```
{"id":"f6346407-79f3-4203-8540-a9ef440fb440","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.18.0.7:8888","remoteAddress":"172.18.0.1:43602"},"specVersion":"0.1.0","time":"2024-11-10T19:48:18.898952542Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":"{  \"kind\" : \"Interceptor\",  \"apiVersion\" : \"gateway/v2\",  \"metadata\" : {    \"name\" : \"guard-on-produce\"  },  \"spec\" : {    \"comment\" : \"Adding interceptor: guard-on-produce\",    \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin\",    \"priority\" : 100,    \"config\" : {      \"acks\" : {        \"value\" : [ -1 ],        \"action\" : \"BLOCK\"      },      \"compressions\" : {        \"value\" : [ \"NONE\", \"GZIP\" ],        \"action\" : \"BLOCK\"      }    }  }}"}}
{"id":"e83b5bca-475e-4a6e-b44e-a9dece207ec7","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.18.0.7:8888","remoteAddress":"172.18.0.1:43604"},"specVersion":"0.1.0","time":"2024-11-10T19:48:19.315890209Z","eventData":{"method":"GET","path":"/gateway/v2/interceptor","body":null}}
{"id":"9443897a-5ea0-4a39-9b47-8a16c028ef75","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.18.0.7:6969","remoteAddress":"/172.18.0.1:40378"},"specVersion":"0.1.0","time":"2024-11-10T19:48:21.212540668Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"92624ff1-a4e9-449b-8388-aab6e7d8d51c","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.18.0.7:6969","remoteAddress":"/172.18.0.1:40378"},"specVersion":"0.1.0","time":"2024-11-10T19:48:21.225368877Z","eventData":"SUCCESS"}
{"id":"64eee873-ab5a-41df-aff8-98942ea4e830","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.18.0.7:6971","remoteAddress":"/172.18.0.1:46530"},"specVersion":"0.1.0","time":"2024-11-10T19:48:21.520875210Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"a9571ed7-1736-48de-a254-7f026b6a5bb6","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.18.0.7:6971","remoteAddress":"/172.18.0.1:46530"},"specVersion":"0.1.0","time":"2024-11-10T19:48:21.521690252Z","eventData":"SUCCESS"}
{"id":"9c6598b7-afa7-44c2-b2a2-68db4d8c782c","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.18.0.7:6969","remoteAddress":"/172.18.0.1:40388"},"specVersion":"0.1.0","time":"2024-11-10T19:48:24.662489087Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"01580ca5-a03f-46e1-b16a-2e1f0bb8d727","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.18.0.7:6969","remoteAddress":"/172.18.0.1:40388"},"specVersion":"0.1.0","time":"2024-11-10T19:48:24.666267045Z","eventData":"SUCCESS"}
{"id":"788c59d5-86df-4e5a-95f2-10d3366da909","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.18.0.7:6970","remoteAddress":"/172.18.0.1:36476"},"specVersion":"0.1.0","time":"2024-11-10T19:48:25.220176128Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"df7e787b-d609-4d89-a884-99baaaee09e0","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.18.0.7:6970","remoteAddress":"/172.18.0.1:36476"},"specVersion":"0.1.0","time":"2024-11-10T19:48:25.220773087Z","eventData":"SUCCESS"}
{"id":"02f0d62d-ae60-4790-998c-7ed84e828271","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.18.0.1:36476"},"specVersion":"0.1.0","time":"2024-11-10T19:48:25.344348920Z","eventData":{"interceptorName":"guard-on-produce","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1. Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]"}}
[2024-11-10 19:48:30,864] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 11 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/DAhdCY2iw6QgJAuZS6pHh7vkY.svg)](https://asciinema.org/a/DAhdCY2iw6QgJAuZS6pHh7vkY)

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
 Container kafka-client  Stopping
 Container gateway1  Stopping
 Container gateway2  Stopping
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
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka2  Removed
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka1  Removed
 Container kafka3  Removed
 Network audit_default  Removing
 Network audit_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/W5hf14gfQPcqlEP6Cwc30SFtg.svg)](https://asciinema.org/a/W5hf14gfQPcqlEP6Cwc30SFtg)

</TabItem>
</Tabs>

