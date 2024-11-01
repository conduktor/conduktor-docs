---
title: Dynamic Header Injection
description: Dynamic Header Injection
tag: ops
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Dynamic Header Injection & Removal

There are multiple interceptors available for manipulating headers, either injection or regex based removal. 

This demo will run you through some of these use cases step-by-step.

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/rLCgSUInUKFAyGxk01X9X6cdo.svg)](https://asciinema.org/a/rLCgSUInUKFAyGxk01X9X6cdo)

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
 Network header-injection_default  Creating
 Network header-injection_default  Created
 Container kafka3  Creating
 Container kafka1  Creating
 Container kafka2  Creating
 Container kafka-client  Creating
 Container kafka1  Created
 Container kafka-client  Created
 Container kafka3  Created
 Container kafka2  Created
 Container gateway2  Creating
 Container gateway1  Creating
 Container schema-registry  Creating
 Container schema-registry  Created
 Container gateway2  Created
 Container gateway1  Created
 Container kafka-client  Starting
 Container kafka1  Starting
 Container kafka2  Starting
 Container kafka3  Starting
 Container kafka2  Started
 Container kafka1  Started
 Container kafka-client  Started
 Container kafka3  Started
 Container kafka1  Waiting
 Container kafka1  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka2  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka3  Waiting
 Container kafka3  Waiting
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container schema-registry  Starting
 Container kafka2  Healthy
 Container gateway1  Starting
 Container kafka2  Healthy
 Container gateway2  Starting
 Container gateway1  Started
 Container gateway2  Started
 Container schema-registry  Started
 Container kafka-client  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka-client  Healthy
 Container gateway2  Healthy
 Container gateway1  Healthy
 Container schema-registry  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Ynr6IfhkY3mGobOofpGv7pg6L.svg)](https://asciinema.org/a/Ynr6IfhkY3mGobOofpGv7pg6L)

</TabItem>
</Tabs>

## Creating topic users on gateway1

Creating on `gateway1`:

* Topic `users` with partitions:1 and replication-factor:1






<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
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

[![asciicast](https://asciinema.org/a/Zn16bLOb8mROrDRfGJNT8Kaqf.svg)](https://asciinema.org/a/Zn16bLOb8mROrDRfGJNT8Kaqf)

</TabItem>
</Tabs>

## Adding interceptor inject-headers

Let's create the interceptor to inject various headers




`step-06-inject-headers-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "inject-headers"
  },
  "spec" : {
    "comment" : "Adding interceptor: inject-headers",
    "pluginClass" : "io.conduktor.gateway.interceptor.DynamicHeaderInjectionPlugin",
    "priority" : 100,
    "config" : {
      "headers" : {
        "X-MY-KEY" : "my own value",
        "X-USER" : "{{user}}",
        "X-INTERPOLATED" : "User {{user}} via ip {{userIp}}"
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
    --data @step-06-inject-headers-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "inject-headers",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: inject-headers",
      "pluginClass": "io.conduktor.gateway.interceptor.DynamicHeaderInjectionPlugin",
      "priority": 100,
      "config": {
        "headers": {
          "X-MY-KEY": "my own value",
          "X-USER": "{{user}}",
          "X-INTERPOLATED": "User {{user}} via ip {{userIp}}"
        }
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Ia98V16UkaeLRsDGiiSXkn64b.svg)](https://asciinema.org/a/Ia98V16UkaeLRsDGiiSXkn64b)

</TabItem>
</Tabs>

## Send tom and laura into users

Producing 2 messages in `users` in cluster `gateway1`




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



<Tabs>

<TabItem value="Command">
```sh
echo '{"name":"tom","username":"tom@conduktor.io","password":"motorhead","visa":"#abc123","address":"Chancery lane, London"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic users

echo '{"name":"laura","username":"laura@conduktor.io","password":"kitesurf","visa":"#888999XZ","address":"Dubai, UAE"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic users
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/MpE56lwwtV6gW9abrVbXM64tC.svg)](https://asciinema.org/a/MpE56lwwtV6gW9abrVbXM64tC)

</TabItem>
</Tabs>

## Verify tom and laura have the corresponding headers

Verify tom and laura have the corresponding headers in cluster `gateway1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic users \
    --from-beginning \
    --max-messages 3 \
    --timeout-ms 3000 \
    --property print.headers=true | jq
```


returns 2 events
```json
{
  "headers" : {
    "X-INTERPOLATED" : "User anonymous via ip 172.22.0.1",
    "X-MY-KEY" : "my own value",
    "X-USER" : "anonymous"
  },
  "value" : {
    "name" : "tom",
    "username" : "tom@conduktor.io",
    "password" : "motorhead",
    "visa" : "#abc123",
    "address" : "Chancery lane, London"
  }
}
{
  "headers" : {
    "X-INTERPOLATED" : "User anonymous via ip 172.22.0.1",
    "X-MY-KEY" : "my own value",
    "X-USER" : "anonymous"
  },
  "value" : {
    "name" : "laura",
    "username" : "laura@conduktor.io",
    "password" : "kitesurf",
    "visa" : "#888999XZ",
    "address" : "Dubai, UAE"
  }
}
```

</TabItem>
<TabItem value="Output">

```json
parse error: Invalid numeric literal at line 1, column 15
[2024-10-29 21:25:00,499] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/i1O6Y0a13ZcExHaTCRNwRTWC0.svg)](https://asciinema.org/a/i1O6Y0a13ZcExHaTCRNwRTWC0)

</TabItem>
</Tabs>

## Adding interceptor remove-headers

Let's create the interceptor `remove-headers` to remove headers that match `X-MY-.*`




`step-09-remove-headers-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "remove-headers"
  },
  "spec" : {
    "comment" : "Adding interceptor: remove-headers",
    "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.MessageHeaderRemovalPlugin",
    "priority" : 100,
    "config" : {
      "headerKeyRegex" : "X-MY-.*"
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
    --data @step-09-remove-headers-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "remove-headers",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: remove-headers",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.MessageHeaderRemovalPlugin",
      "priority": 100,
      "config": {
        "headerKeyRegex": "X-MY-.*"
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/V7t9EBW2pExfczUaH2cBff3u8.svg)](https://asciinema.org/a/V7t9EBW2pExfczUaH2cBff3u8)

</TabItem>
</Tabs>

## Verify tom and laura have the corresponding headers

Verify tom and laura have the corresponding headers in cluster `gateway1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic users \
    --from-beginning \
    --max-messages 3 \
    --timeout-ms 3000 \
    --property print.headers=true | jq
```


returns 2 events
```json
{
  "headers" : {
    "X-INTERPOLATED" : "User anonymous via ip 172.22.0.1",
    "X-USER" : "anonymous"
  },
  "value" : {
    "name" : "tom",
    "username" : "tom@conduktor.io",
    "password" : "motorhead",
    "visa" : "#abc123",
    "address" : "Chancery lane, London"
  }
}
{
  "headers" : {
    "X-INTERPOLATED" : "User anonymous via ip 172.22.0.1",
    "X-USER" : "anonymous"
  },
  "value" : {
    "name" : "laura",
    "username" : "laura@conduktor.io",
    "password" : "kitesurf",
    "visa" : "#888999XZ",
    "address" : "Dubai, UAE"
  }
}
```

</TabItem>
<TabItem value="Output">

```json
parse error: Invalid numeric literal at line 1, column 15
[2024-10-29 21:25:06,309] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/BqsDET2CBNCmuOfabblTDKw4L.svg)](https://asciinema.org/a/BqsDET2CBNCmuOfabblTDKw4L)

</TabItem>
</Tabs>

## Remove interceptor remove-headers

Let's delete the interceptor `remove-headers` so we can access all our headers again






<Tabs>

<TabItem value="Command">
```sh
curl \
    --silent \
    --request DELETE "http://localhost:8888/gateway/v2/interceptor/remove-headers" \
    --header "Content-Type: application/json" \
    --user "admin:conduktor" \
    --data-raw '{
  "vCluster" : "passthrough"
}' | jq
```


</TabItem>
<TabItem value="Output">

```json

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/rPqm39vnYdamviZawQnq5gtwu.svg)](https://asciinema.org/a/rPqm39vnYdamviZawQnq5gtwu)

</TabItem>
</Tabs>

## Verify tom and laura have X-MY-KEY back

Verify tom and laura have X-MY-KEY back in cluster `gateway1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic users \
    --from-beginning \
    --max-messages 3 \
    --timeout-ms 3000 \
    --property print.headers=true | jq
```


returns 2 events
```json
{
  "headers" : {
    "X-INTERPOLATED" : "User anonymous via ip 172.22.0.1",
    "X-MY-KEY" : "my own value",
    "X-USER" : "anonymous"
  },
  "value" : {
    "name" : "tom",
    "username" : "tom@conduktor.io",
    "password" : "motorhead",
    "visa" : "#abc123",
    "address" : "Chancery lane, London"
  }
}
{
  "headers" : {
    "X-INTERPOLATED" : "User anonymous via ip 172.22.0.1",
    "X-MY-KEY" : "my own value",
    "X-USER" : "anonymous"
  },
  "value" : {
    "name" : "laura",
    "username" : "laura@conduktor.io",
    "password" : "kitesurf",
    "visa" : "#888999XZ",
    "address" : "Dubai, UAE"
  }
}
```

</TabItem>
<TabItem value="Output">

```json
parse error: Invalid numeric literal at line 1, column 15
[2024-10-29 21:25:12,051] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/AveJ0OZAoAUPnHMp1fPTPGwEK.svg)](https://asciinema.org/a/AveJ0OZAoAUPnHMp1fPTPGwEK)

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
 Container gateway2  Stopping
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
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Network header-injection_default  Removing
 Network header-injection_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/3XfZGPhbdya9RfMflqOKugMqw.svg)](https://asciinema.org/a/3XfZGPhbdya9RfMflqOKugMqw)

</TabItem>
</Tabs>

# Conclusion

Leveraging headers in Kafka is of tremendous help!

