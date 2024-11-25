---
title: ClientId Validation
description: ClientId Validation
tag: safeguard
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Client Id validation



## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690194.svg)](https://asciinema.org/a/690194)

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
 Network safeguard-client-id_default  Creating
 Network safeguard-client-id_default  Created
 Container kafka3  Creating
 Container kafka-client  Creating
 Container kafka1  Creating
 Container kafka2  Creating
 Container kafka1  Created
 Container kafka2  Created
 Container kafka3  Created
 Container gateway2  Creating
 Container schema-registry  Creating
 Container gateway1  Creating
 Container kafka-client  Created
 Container gateway1  Created
 Container gateway2  Created
 Container schema-registry  Created
 Container kafka2  Starting
 Container kafka-client  Starting
 Container kafka3  Starting
 Container kafka1  Starting
 Container kafka1  Started
 Container kafka3  Started
 Container kafka2  Started
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka-client  Started
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container schema-registry  Starting
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container gateway2  Starting
 Container kafka1  Healthy
 Container gateway1  Starting
 Container schema-registry  Started
 Container gateway2  Started
 Container gateway1  Started
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka-client  Healthy
 Container schema-registry  Healthy
 Container gateway2  Healthy
 Container gateway1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690184.svg)](https://asciinema.org/a/690184)

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

[![asciicast](https://asciinema.org/a/690185.svg)](https://asciinema.org/a/690185)

</TabItem>
</Tabs>

## Listing topics in gateway1








<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --list
```


</TabItem>
<TabItem value="Output">

```
__consumer_offsets
_conduktor_gateway_acls
_conduktor_gateway_auditlogs
_conduktor_gateway_consumer_offsets
_conduktor_gateway_consumer_subscriptions
_conduktor_gateway_encryption_configs
_conduktor_gateway_groups
_conduktor_gateway_interceptor_configs
_conduktor_gateway_license
_conduktor_gateway_topicmappings
_conduktor_gateway_usermappings
_conduktor_gateway_vclusters
_confluent-command
_confluent-link-metadata
_schemas
users

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690186.svg)](https://asciinema.org/a/690186)

</TabItem>
</Tabs>

## Adding interceptor client-id






`step-07-client-id-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "client-id"
  },
  "spec" : {
    "comment" : "Adding interceptor: client-id",
    "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "priority" : 100,
    "config" : {
      "namingConvention" : "naming-convention-.*"
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
    --data @step-07-client-id-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "client-id",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: client-id",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
      "priority": 100,
      "config": {
        "namingConvention": "naming-convention-.*"
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690187.svg)](https://asciinema.org/a/690187)

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
      "name": "client-id",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: client-id",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
      "priority": 100,
      "config": {
        "namingConvention": "naming-convention-.*"
      }
    }
  }
]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690188.svg)](https://asciinema.org/a/690188)

</TabItem>
</Tabs>

## Creating topic customers on gateway1

Creating on `gateway1`:

* Topic `customers` with partitions:1 and replication-factor:1






<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic customers
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> org.apache.kafka.common.errors.PolicyViolationException:
>> Request parameters do not satisfy the configured policy. clientId 'adminclient-2' is invalid, naming convention must match with regular expression 'naming-convention-.*'
> ```



</TabItem>
<TabItem value="Output">

```
[2024-11-17 19:59:33,906] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 0. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:34,019] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 1. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:34,131] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 2. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:34,348] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 3. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:34,762] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 4. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:35,483] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 5. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:36,515] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 6. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:37,537] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 7. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:38,456] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 8. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:39,482] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 9. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:40,404] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 10. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:41,428] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 11. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:42,353] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 12. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:43,380] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 13. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:44,413] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 14. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:45,449] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 15. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:46,478] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 16. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:47,506] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 17. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:48,432] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 18. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:49,459] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 19. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:50,491] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 20. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:51,497] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 21. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:52,536] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 22. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:53,573] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 23. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:54,627] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 24. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:56,035] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 25. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:56,980] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 26. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:58,025] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 27. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 19:59:59,065] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 28. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:00,138] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 29. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:01,069] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 30. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:02,098] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 31. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:03,107] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 32. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:04,220] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 33. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:05,042] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 34. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:05,976] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 35. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:06,903] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 36. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:07,900] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 37. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:08,946] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 38. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:09,990] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 39. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:11,023] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 40. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:12,059] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 41. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:13,085] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 42. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:14,166] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 43. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:15,127] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 44. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:15,950] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 45. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:16,975] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 46. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:18,008] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 47. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:18,962] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 48. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:19,794] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 49. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:20,835] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 50. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:21,862] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 51. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:22,884] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 52. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:23,915] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 53. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:24,952] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 54. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:25,988] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 55. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:27,013] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 56. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:28,046] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 57. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:29,065] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 58. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:30,088] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 59. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:31,126] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 60. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:32,149] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 61. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-17 20:00:33,168] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 62. Disconnecting. (org.apache.kafka.clients.NetworkClient)
Error while executing topic command : Timed out waiting for a node assignment. Call: createTopics
[2024-11-17 20:00:33,777] ERROR org.apache.kafka.common.errors.TimeoutException: Timed out waiting for a node assignment. Call: createTopics
 (org.apache.kafka.tools.TopicCommand)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690189.svg)](https://asciinema.org/a/690189)

</TabItem>
</Tabs>

## Let's update the client id to match the convention








<Tabs>

<TabItem value="Command">
```sh
echo >> client.properties    
echo "client.id=naming-convention-for-this-application" >> client.properties    
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690190.svg)](https://asciinema.org/a/690190)

</TabItem>
</Tabs>

## Creating topic customers on gateway1

Creating on `gateway1`:

* Topic `customers` with partitions:1 and replication-factor:1






<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config client.properties \
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

[![asciicast](https://asciinema.org/a/690191.svg)](https://asciinema.org/a/690191)

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
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin")'
```


returns 1 event
```json
{
  "id" : "96121d90-c50b-47fa-a9a4-3ea7216bcd97",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.224.1:54240"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-17T19:58:55.588787595Z",
  "eventData" : {
    "interceptorName" : "client-id",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. clientId 'adminclient-2' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
```

</TabItem>
<TabItem value="Output">

```
{"id":"e9b853fb-4f55-418b-b77f-b8190bbe9a71","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44860"},"specVersion":"0.1.0","time":"2024-11-17T19:59:31.238800916Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"9631ffb0-c4cd-45b4-a6fc-ae5bb89729a4","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44860"},"specVersion":"0.1.0","time":"2024-11-17T19:59:31.254545250Z","eventData":"SUCCESS"}
{"id":"7bb3fefe-fdca-4e2d-8876-2e1f4ebcbfec","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6972","remoteAddress":"/172.19.0.1:43586"},"specVersion":"0.1.0","time":"2024-11-17T19:59:31.348138666Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"2331c97f-cb87-494e-873d-fc100fdb6be3","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6972","remoteAddress":"/172.19.0.1:43586"},"specVersion":"0.1.0","time":"2024-11-17T19:59:31.348704750Z","eventData":"SUCCESS"}
{"id":"427e335a-a65d-49d0-babb-e76b1a8f6aca","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44866"},"specVersion":"0.1.0","time":"2024-11-17T19:59:32.490972333Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"e032f8f8-5f98-4417-91b2-c0e8525170c8","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44866"},"specVersion":"0.1.0","time":"2024-11-17T19:59:32.491552042Z","eventData":"SUCCESS"}
{"id":"c898b703-9402-4721-969c-446563f7f8d3","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6970","remoteAddress":"/172.19.0.1:35626"},"specVersion":"0.1.0","time":"2024-11-17T19:59:32.539870417Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"e8fbd840-6be3-42b6-9476-c51b351d3772","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6970","remoteAddress":"/172.19.0.1:35626"},"specVersion":"0.1.0","time":"2024-11-17T19:59:32.540266209Z","eventData":"SUCCESS"}
{"id":"7b1f9f98-8d71-4c81-96b4-5aa5a5214ada","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.19.0.8:8888","remoteAddress":"172.19.0.1:57146"},"specVersion":"0.1.0","time":"2024-11-17T19:59:32.985492334Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":"{  \"kind\" : \"Interceptor\",  \"apiVersion\" : \"gateway/v2\",  \"metadata\" : {    \"name\" : \"client-id\"  },  \"spec\" : {    \"comment\" : \"Adding interceptor: client-id\",    \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin\",    \"priority\" : 100,    \"config\" : {      \"namingConvention\" : \"naming-convention-.*\"    }  }}"}}
{"id":"2a18ade5-21bd-4e20-89a9-2ed425f14bb6","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.19.0.8:8888","remoteAddress":"172.19.0.1:57160"},"specVersion":"0.1.0","time":"2024-11-17T19:59:33.168452834Z","eventData":{"method":"GET","path":"/gateway/v2/interceptor","body":null}}
{"id":"d21d5835-32e5-4a98-ac94-d32387481f95","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44868"},"specVersion":"0.1.0","time":"2024-11-17T19:59:33.859888751Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"786be741-118b-4a60-8315-da27f14a024f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44868"},"specVersion":"0.1.0","time":"2024-11-17T19:59:33.860312417Z","eventData":"SUCCESS"}
{"id":"afcdaf40-c8ff-4d3b-b7ad-f387079adbc4","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:44868"},"specVersion":"0.1.0","time":"2024-11-17T19:59:33.868970584Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"f004c0ae-5b61-4170-af0d-0829d268c99a","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44872"},"specVersion":"0.1.0","time":"2024-11-17T19:59:34.015391959Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"d3efef61-7e7f-4edf-b25f-bd9e4f93d6c9","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44872"},"specVersion":"0.1.0","time":"2024-11-17T19:59:34.015886334Z","eventData":"SUCCESS"}
{"id":"1c93b933-4cd9-4b6e-a87c-a42faa2ea5be","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:44872"},"specVersion":"0.1.0","time":"2024-11-17T19:59:34.016815668Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"6cb5f502-6432-41aa-a0d4-34b02abd6f9a","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44876"},"specVersion":"0.1.0","time":"2024-11-17T19:59:34.127425751Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"4b453178-7606-44a5-9d20-a2e980f93148","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44876"},"specVersion":"0.1.0","time":"2024-11-17T19:59:34.127844251Z","eventData":"SUCCESS"}
{"id":"c4563b8c-a93e-4486-9b76-15c568908436","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:44876"},"specVersion":"0.1.0","time":"2024-11-17T19:59:34.128764084Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"9799805d-f4f0-4185-bd0c-83d38eac3a15","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44880"},"specVersion":"0.1.0","time":"2024-11-17T19:59:34.343136334Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"aa438474-8582-4863-9cef-c1a529e6e201","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44880"},"specVersion":"0.1.0","time":"2024-11-17T19:59:34.343781668Z","eventData":"SUCCESS"}
{"id":"209b7a65-f1ef-4dac-8d49-afa25ff7ea23","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:44880"},"specVersion":"0.1.0","time":"2024-11-17T19:59:34.344953584Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"6c3eb802-c9f9-408d-a643-a4dad993f5cd","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44886"},"specVersion":"0.1.0","time":"2024-11-17T19:59:34.758934460Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"41f59bef-a465-4de8-9e86-0b5cdfc59569","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44886"},"specVersion":"0.1.0","time":"2024-11-17T19:59:34.759534960Z","eventData":"SUCCESS"}
{"id":"2ec16edd-969c-480b-b601-e1c8d414aaa9","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:44886"},"specVersion":"0.1.0","time":"2024-11-17T19:59:34.760306293Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"068c23e0-6dfb-407b-bfcb-b241a1f25c95","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44902"},"specVersion":"0.1.0","time":"2024-11-17T19:59:35.479021085Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"c8b0632f-f5d7-412f-9d60-b515b20aaaab","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44902"},"specVersion":"0.1.0","time":"2024-11-17T19:59:35.479507793Z","eventData":"SUCCESS"}
{"id":"de5a4425-f7b6-4c9e-baf8-6bc6cef380d7","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:44902"},"specVersion":"0.1.0","time":"2024-11-17T19:59:35.480935710Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"170653e9-c71f-439a-993e-5915b3e98c5d","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44912"},"specVersion":"0.1.0","time":"2024-11-17T19:59:36.505796627Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"9ce48df5-02ed-4ab4-afce-bf3449fa154f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:44912"},"specVersion":"0.1.0","time":"2024-11-17T19:59:36.511105085Z","eventData":"SUCCESS"}
{"id":"eee0ee23-6d39-423b-b2a3-1b2f9333af1f","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:44912"},"specVersion":"0.1.0","time":"2024-11-17T19:59:36.512056752Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"8558a035-a9d3-4c90-bcfd-33cbc9ccd58c","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39774"},"specVersion":"0.1.0","time":"2024-11-17T19:59:37.531601919Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"eaf68e3f-d9f7-4b3f-8ad8-80132a97b8f2","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39774"},"specVersion":"0.1.0","time":"2024-11-17T19:59:37.531952836Z","eventData":"SUCCESS"}
{"id":"044f7d8a-76ef-4b8f-b020-78367186ef73","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:39774"},"specVersion":"0.1.0","time":"2024-11-17T19:59:37.532949003Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"ea74eb59-b92f-4d1b-b35d-b74d18fe44a5","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39786"},"specVersion":"0.1.0","time":"2024-11-17T19:59:38.453299961Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"57725193-1ca7-419c-b51a-214eb2f617d9","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39786"},"specVersion":"0.1.0","time":"2024-11-17T19:59:38.453673711Z","eventData":"SUCCESS"}
{"id":"fe2ac06b-65f3-42ac-b3e0-0207c1a76ec6","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:39786"},"specVersion":"0.1.0","time":"2024-11-17T19:59:38.454461628Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"3b5a5e36-e6fd-4439-84ca-7145846bba67","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39802"},"specVersion":"0.1.0","time":"2024-11-17T19:59:39.476846878Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"4dcb9dd4-3668-45d6-ad43-e1b8d3c956b7","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39802"},"specVersion":"0.1.0","time":"2024-11-17T19:59:39.477352337Z","eventData":"SUCCESS"}
{"id":"e4bcc728-6cc8-40c8-9640-28af05a7cfdc","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:39802"},"specVersion":"0.1.0","time":"2024-11-17T19:59:39.478840003Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"20d1c767-76ee-4bca-946d-f4e404f54aa8","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39818"},"specVersion":"0.1.0","time":"2024-11-17T19:59:40.397884837Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"72aced5f-e6d1-4bd0-8ac8-3a3326b12744","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39818"},"specVersion":"0.1.0","time":"2024-11-17T19:59:40.398382171Z","eventData":"SUCCESS"}
{"id":"15a17b19-df9a-4cde-be18-4ec6702a0320","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:39818"},"specVersion":"0.1.0","time":"2024-11-17T19:59:40.398894879Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"0db8e461-08ff-4717-9b60-88015efb9387","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39834"},"specVersion":"0.1.0","time":"2024-11-17T19:59:41.424710088Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"abd8c80b-9ac6-40dc-a940-037957ea44ee","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39834"},"specVersion":"0.1.0","time":"2024-11-17T19:59:41.425032546Z","eventData":"SUCCESS"}
{"id":"b5472db5-514d-42d6-9b19-2ebd84e58b70","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:39834"},"specVersion":"0.1.0","time":"2024-11-17T19:59:41.425954546Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"69eac935-be04-4510-8656-0a4bf969397a","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39846"},"specVersion":"0.1.0","time":"2024-11-17T19:59:42.347443755Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"4aa8d5d9-7a41-4e80-ab08-f37ce4a8b53d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39846"},"specVersion":"0.1.0","time":"2024-11-17T19:59:42.348992255Z","eventData":"SUCCESS"}
{"id":"f8c24a4d-9932-4fe1-8efa-17c180c04bae","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:39846"},"specVersion":"0.1.0","time":"2024-11-17T19:59:42.349947713Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"50c50ecb-a08b-40a7-b9a3-ce72ffa99345","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39860"},"specVersion":"0.1.0","time":"2024-11-17T19:59:43.374606630Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"34e5a780-2b59-43c5-a02d-70aba02ce9a4","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39860"},"specVersion":"0.1.0","time":"2024-11-17T19:59:43.375687589Z","eventData":"SUCCESS"}
{"id":"a0ce093c-337c-485b-8f8b-8e6c8fc721bb","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:39860"},"specVersion":"0.1.0","time":"2024-11-17T19:59:43.377130380Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"b6f984e1-4037-4800-b2ed-ce5e30d9598a","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39870"},"specVersion":"0.1.0","time":"2024-11-17T19:59:44.408586214Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"f2fd2801-5cbc-40c1-8ca8-d98e2847a2e7","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39870"},"specVersion":"0.1.0","time":"2024-11-17T19:59:44.409457881Z","eventData":"SUCCESS"}
{"id":"465c2a2f-e0ea-40cc-91d5-efdcf8c08531","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:39870"},"specVersion":"0.1.0","time":"2024-11-17T19:59:44.410842631Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"1e913d3c-ba1c-4170-9c02-5ac1e08f963a","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39872"},"specVersion":"0.1.0","time":"2024-11-17T19:59:45.444773756Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"72c8b54c-32a0-491e-ae42-8a0628b9c627","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39872"},"specVersion":"0.1.0","time":"2024-11-17T19:59:45.445566381Z","eventData":"SUCCESS"}
{"id":"52a8dbbf-970a-4bb2-ab36-0fa34d331b9b","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:39872"},"specVersion":"0.1.0","time":"2024-11-17T19:59:45.446649465Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"a3bd430e-49c7-4310-8120-8c23a40dd1f0","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39874"},"specVersion":"0.1.0","time":"2024-11-17T19:59:46.474380007Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"35cf007f-b770-44d4-a5be-0dffa7ce5137","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:39874"},"specVersion":"0.1.0","time":"2024-11-17T19:59:46.474935882Z","eventData":"SUCCESS"}
{"id":"d4995ca7-4a6a-4b56-9072-2a0b82002240","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:39874"},"specVersion":"0.1.0","time":"2024-11-17T19:59:46.475981840Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"99ad3939-cf7b-46e1-8d9f-29de3b0c4a21","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50214"},"specVersion":"0.1.0","time":"2024-11-17T19:59:47.499488132Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"554106f1-efee-450e-bfb7-e284fefac53f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50214"},"specVersion":"0.1.0","time":"2024-11-17T19:59:47.502340674Z","eventData":"SUCCESS"}
{"id":"fedf2e67-7852-4dd4-8e00-8f92261e08a7","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:50214"},"specVersion":"0.1.0","time":"2024-11-17T19:59:47.503038216Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"54a48954-0783-4593-b0b7-286320d4701a","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50216"},"specVersion":"0.1.0","time":"2024-11-17T19:59:48.422326258Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"f90ba907-0a65-47d2-9be8-432442514533","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50216"},"specVersion":"0.1.0","time":"2024-11-17T19:59:48.422810008Z","eventData":"SUCCESS"}
{"id":"657de056-d726-45b8-bce6-f1b35c08197d","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:50216"},"specVersion":"0.1.0","time":"2024-11-17T19:59:48.428940091Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"87d6d76b-8f39-46a5-8b85-de5330adeb8c","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50218"},"specVersion":"0.1.0","time":"2024-11-17T19:59:49.453122842Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"faaf5bc9-d4e0-4abc-856b-827c7ae249d2","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50218"},"specVersion":"0.1.0","time":"2024-11-17T19:59:49.454665758Z","eventData":"SUCCESS"}
{"id":"4dd2e78c-2651-462d-8cbe-f973a301d8d6","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:50218"},"specVersion":"0.1.0","time":"2024-11-17T19:59:49.456473508Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"d1230ed1-cfb1-41de-b03f-e384602d3960","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50222"},"specVersion":"0.1.0","time":"2024-11-17T19:59:50.482736425Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"78d2083c-e4f3-42e8-b827-d8bdd2defd83","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50222"},"specVersion":"0.1.0","time":"2024-11-17T19:59:50.484856009Z","eventData":"SUCCESS"}
{"id":"9f5786d7-8c94-4416-83fc-826a35083cd4","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:50222"},"specVersion":"0.1.0","time":"2024-11-17T19:59:50.486576425Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"b941fe82-a24b-490f-a92c-5e898dab2052","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50230"},"specVersion":"0.1.0","time":"2024-11-17T19:59:51.475459884Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"f79d7ba3-a9c1-4901-bd71-b830f56e0c2d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50230"},"specVersion":"0.1.0","time":"2024-11-17T19:59:51.478359051Z","eventData":"SUCCESS"}
{"id":"cb4d5ea3-a97f-43a1-a1da-74e0cf0fa1ef","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:50230"},"specVersion":"0.1.0","time":"2024-11-17T19:59:51.480912009Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"ba178ea2-fc43-43a3-9ab4-159eb329ce2a","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50236"},"specVersion":"0.1.0","time":"2024-11-17T19:59:52.525686635Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"3239b79e-77ce-401d-9fc7-c79263e15542","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50236"},"specVersion":"0.1.0","time":"2024-11-17T19:59:52.529357760Z","eventData":"SUCCESS"}
{"id":"867c8cc3-a14c-4cb6-a126-3cfec46ec9f8","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:50236"},"specVersion":"0.1.0","time":"2024-11-17T19:59:52.531315093Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"7b3ef6be-99d0-44eb-9f3f-c665de5faf11","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50248"},"specVersion":"0.1.0","time":"2024-11-17T19:59:53.555518052Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"f84e41ee-e91e-4864-bf33-d0c3ba993862","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50248"},"specVersion":"0.1.0","time":"2024-11-17T19:59:53.556935094Z","eventData":"SUCCESS"}
{"id":"cfe65bcd-2ad4-4313-9cf0-bbdec0b6914b","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:50248"},"specVersion":"0.1.0","time":"2024-11-17T19:59:53.558781344Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"7de497ae-2e0d-4cfb-acaf-e5c52c0e0f8a","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50254"},"specVersion":"0.1.0","time":"2024-11-17T19:59:54.614528094Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"b5d5d287-1927-44e5-b089-3dbfe47e3832","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50254"},"specVersion":"0.1.0","time":"2024-11-17T19:59:54.621382761Z","eventData":"SUCCESS"}
{"id":"087c8543-3e85-4afa-a72b-64d4e04b57a0","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:50254"},"specVersion":"0.1.0","time":"2024-11-17T19:59:54.623594511Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"f3617aed-aa30-4ae8-a2e0-3b4117827e08","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50258"},"specVersion":"0.1.0","time":"2024-11-17T19:59:56.023782803Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"458bbd38-95b0-4eaf-a224-fcb9226ba69a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50258"},"specVersion":"0.1.0","time":"2024-11-17T19:59:56.024935970Z","eventData":"SUCCESS"}
{"id":"5b6584b2-4241-4cd2-8aa5-bef41ad939df","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:50258"},"specVersion":"0.1.0","time":"2024-11-17T19:59:56.026632470Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"ee0a45ae-ffe6-4b59-8dec-c400759ba635","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50270"},"specVersion":"0.1.0","time":"2024-11-17T19:59:56.968078970Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"4ddc1fbc-1680-468d-9e66-2f728d7b69ed","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:50270"},"specVersion":"0.1.0","time":"2024-11-17T19:59:56.970554720Z","eventData":"SUCCESS"}
{"id":"29db2228-0a2c-4165-8527-e4f2954bd340","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:50270"},"specVersion":"0.1.0","time":"2024-11-17T19:59:56.977044387Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"cb18b5de-adfd-44a3-9c1f-06b4e029d44b","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56876"},"specVersion":"0.1.0","time":"2024-11-17T19:59:58.007602721Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"2c0e775d-40ca-487d-901f-6a84c740f50d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56876"},"specVersion":"0.1.0","time":"2024-11-17T19:59:58.016985471Z","eventData":"SUCCESS"}
{"id":"8fbd530b-7347-4bc1-92be-c49d736a5f68","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:56876"},"specVersion":"0.1.0","time":"2024-11-17T19:59:58.019949971Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"191f3619-0178-4d46-b6f0-9afdeedb7987","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56890"},"specVersion":"0.1.0","time":"2024-11-17T19:59:59.055634054Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"186f5822-c44e-4aec-8f68-8faf62fa8b4b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56890"},"specVersion":"0.1.0","time":"2024-11-17T19:59:59.057844763Z","eventData":"SUCCESS"}
{"id":"5d50258f-c3db-480d-862f-f8511e5657f4","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:56890"},"specVersion":"0.1.0","time":"2024-11-17T19:59:59.060541763Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"156a4e9c-29dd-4fc3-8918-297de9f00417","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56898"},"specVersion":"0.1.0","time":"2024-11-17T20:00:00.116082138Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"e348a355-9265-44da-901e-9ddb20aadb7b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56898"},"specVersion":"0.1.0","time":"2024-11-17T20:00:00.122707930Z","eventData":"SUCCESS"}
{"id":"23bbb865-98ce-4534-928f-362bf95f5d46","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:56898"},"specVersion":"0.1.0","time":"2024-11-17T20:00:00.133546597Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"0f928556-b4ad-459a-97c1-3c20b332c23f","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56908"},"specVersion":"0.1.0","time":"2024-11-17T20:00:01.062523722Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"d10e1adb-0932-43cf-bcea-13e0d070efd9","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56908"},"specVersion":"0.1.0","time":"2024-11-17T20:00:01.063373430Z","eventData":"SUCCESS"}
{"id":"35aac894-4322-4c83-8a60-95c6159010c0","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:56908"},"specVersion":"0.1.0","time":"2024-11-17T20:00:01.064752805Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"17777bd4-9153-4c2d-a1fe-be5b2c25fc25","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56924"},"specVersion":"0.1.0","time":"2024-11-17T20:00:02.098722917Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"a7e4517f-6de6-4251-9bc9-5d648e8f0089","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56924"},"specVersion":"0.1.0","time":"2024-11-17T20:00:02.099098833Z","eventData":"SUCCESS"}
{"id":"c5d12f88-0435-4e3b-ae31-40bec77d01c4","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:56924"},"specVersion":"0.1.0","time":"2024-11-17T20:00:02.101668958Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"86b9f5e0-7551-444c-8db6-c1686b32d753","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56932"},"specVersion":"0.1.0","time":"2024-11-17T20:00:03.097272584Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"60382932-54b7-4237-a335-6864f4e12557","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56932"},"specVersion":"0.1.0","time":"2024-11-17T20:00:03.105474750Z","eventData":"SUCCESS"}
{"id":"efecf511-b584-4932-b681-594a3f8daf45","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:56932"},"specVersion":"0.1.0","time":"2024-11-17T20:00:03.110568542Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"b51a6bf2-6de5-44c1-9e3a-9c969be80848","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56940"},"specVersion":"0.1.0","time":"2024-11-17T20:00:04.213859918Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"19ab1add-d696-4b53-98a2-181025d40563","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56940"},"specVersion":"0.1.0","time":"2024-11-17T20:00:04.217919584Z","eventData":"SUCCESS"}
{"id":"f064041d-2e64-4410-8017-14ce2ce005c2","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:56940"},"specVersion":"0.1.0","time":"2024-11-17T20:00:04.222052459Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"c00e2de8-f6b9-4db0-8fe1-3b178f4401be","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56948"},"specVersion":"0.1.0","time":"2024-11-17T20:00:05.045826376Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"884ff823-eb1f-4474-aaab-5c7b285d8880","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56948"},"specVersion":"0.1.0","time":"2024-11-17T20:00:05.046287668Z","eventData":"SUCCESS"}
{"id":"9fcde09d-4995-47de-ab25-2a1f36e07aa5","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:56948"},"specVersion":"0.1.0","time":"2024-11-17T20:00:05.047824043Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"49a5061a-956a-42ba-bb67-04640c618974","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56964"},"specVersion":"0.1.0","time":"2024-11-17T20:00:05.972602502Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"84df0f80-17a9-492b-bbd1-3529f32202f7","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56964"},"specVersion":"0.1.0","time":"2024-11-17T20:00:05.975961210Z","eventData":"SUCCESS"}
{"id":"f83a7b51-baaf-4d73-96b5-94ff9c7ede64","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:56964"},"specVersion":"0.1.0","time":"2024-11-17T20:00:05.980980668Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"a6f72fdb-682e-484c-a668-412b175ebda2","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56972"},"specVersion":"0.1.0","time":"2024-11-17T20:00:06.906953044Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"d540a99f-e3a8-4129-bd22-bc4c74501188","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:56972"},"specVersion":"0.1.0","time":"2024-11-17T20:00:06.907930794Z","eventData":"SUCCESS"}
{"id":"fc6712b5-4bf4-4537-aa85-e2b0e577fa53","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:56972"},"specVersion":"0.1.0","time":"2024-11-17T20:00:06.909425211Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"b51eab8f-113d-4e66-ad28-2dd406cdd8d0","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48344"},"specVersion":"0.1.0","time":"2024-11-17T20:00:07.900163169Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"b4172f8b-12ad-470d-969e-7381c65aa258","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48344"},"specVersion":"0.1.0","time":"2024-11-17T20:00:07.900950669Z","eventData":"SUCCESS"}
{"id":"9310e2ae-37d5-4a2b-86fb-7ea92e6058cb","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:48344"},"specVersion":"0.1.0","time":"2024-11-17T20:00:07.903685544Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"300d6c3a-4542-44a6-a0de-b4676d39ceb3","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48350"},"specVersion":"0.1.0","time":"2024-11-17T20:00:08.938613503Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"7eb0a93b-21b0-4004-9618-333489cb1739","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48350"},"specVersion":"0.1.0","time":"2024-11-17T20:00:08.944702337Z","eventData":"SUCCESS"}
{"id":"b70be995-9f57-4643-8e1e-c294c51fc446","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:48350"},"specVersion":"0.1.0","time":"2024-11-17T20:00:08.946554253Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"921f8ab7-485f-48fb-b698-5fcc63f0a356","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48360"},"specVersion":"0.1.0","time":"2024-11-17T20:00:09.981664254Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"2446190f-c747-4127-b70a-c75ec674f9e0","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48360"},"specVersion":"0.1.0","time":"2024-11-17T20:00:09.990585337Z","eventData":"SUCCESS"}
{"id":"8ddf7af7-1de1-4239-832a-eddf7d8e45ba","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:48360"},"specVersion":"0.1.0","time":"2024-11-17T20:00:09.993091920Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"f6c3f6f1-2f15-4024-be0c-7bdaf877e764","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48370"},"specVersion":"0.1.0","time":"2024-11-17T20:00:11.026557713Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"9cc6bce8-f8b2-4814-8776-540bd29e9d7e","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48370"},"specVersion":"0.1.0","time":"2024-11-17T20:00:11.027203421Z","eventData":"SUCCESS"}
{"id":"faa66c14-f6a8-40cd-bea0-c58c019f67e8","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:48370"},"specVersion":"0.1.0","time":"2024-11-17T20:00:11.028512463Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"f7a6dd33-1ea0-416b-8b0c-6b7930661533","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48386"},"specVersion":"0.1.0","time":"2024-11-17T20:00:12.059652213Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"56f6702a-516d-43c8-9604-5e45bf586025","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48386"},"specVersion":"0.1.0","time":"2024-11-17T20:00:12.061005130Z","eventData":"SUCCESS"}
{"id":"eecf8b1b-98a0-459a-afad-f2e0a76b50a6","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:48386"},"specVersion":"0.1.0","time":"2024-11-17T20:00:12.063021588Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"aebed3eb-50c6-4104-a93a-43641d5f0c40","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48394"},"specVersion":"0.1.0","time":"2024-11-17T20:00:13.086863672Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"fdc37586-3656-443b-9cbf-438d5e1dbbbe","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48394"},"specVersion":"0.1.0","time":"2024-11-17T20:00:13.087231839Z","eventData":"SUCCESS"}
{"id":"aae3a9e7-1ee4-4eef-8f9e-92d562b90714","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:48394"},"specVersion":"0.1.0","time":"2024-11-17T20:00:13.089020255Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"01f7f361-d2ff-4ea3-bebb-9683076d09de","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48396"},"specVersion":"0.1.0","time":"2024-11-17T20:00:14.148016839Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"77b19bd7-a871-4dec-bfee-9381d651ea0d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48396"},"specVersion":"0.1.0","time":"2024-11-17T20:00:14.164712589Z","eventData":"SUCCESS"}
{"id":"1b4e719a-dd59-4474-bb89-853456d4573b","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:48396"},"specVersion":"0.1.0","time":"2024-11-17T20:00:14.169693547Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"2b2af6ab-7776-4d05-9337-525e6ed6dee2","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48410"},"specVersion":"0.1.0","time":"2024-11-17T20:00:15.107896256Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"458c1a44-f675-4fd3-80be-9c577739cd13","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48410"},"specVersion":"0.1.0","time":"2024-11-17T20:00:15.117582756Z","eventData":"SUCCESS"}
{"id":"4129d751-76ad-42a7-b532-e5f87275021f","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:48410"},"specVersion":"0.1.0","time":"2024-11-17T20:00:15.127620589Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"c7bc66d9-fa2a-4dbd-82a9-48e214ec50b9","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48418"},"specVersion":"0.1.0","time":"2024-11-17T20:00:15.954900173Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"317003f1-3653-4b48-8fb2-dfb32a0a93fd","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48418"},"specVersion":"0.1.0","time":"2024-11-17T20:00:15.955252132Z","eventData":"SUCCESS"}
{"id":"b0d4f2e0-2691-4a24-abd7-ecbe18b4851f","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:48418"},"specVersion":"0.1.0","time":"2024-11-17T20:00:15.956841090Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"f700ddfd-0af2-4387-a784-6c064641962c","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48428"},"specVersion":"0.1.0","time":"2024-11-17T20:00:16.977256007Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"3d6e4e1b-3a19-4238-acc9-d939ed43840e","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:48428"},"specVersion":"0.1.0","time":"2024-11-17T20:00:16.977869174Z","eventData":"SUCCESS"}
{"id":"70eac377-f910-4748-924e-68cb972aaf6e","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:48428"},"specVersion":"0.1.0","time":"2024-11-17T20:00:16.979831132Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"0cf4b24a-4c7c-4ce1-a838-2d8a85ee1c28","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49732"},"specVersion":"0.1.0","time":"2024-11-17T20:00:18.007008549Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"da3d063f-7238-440c-8825-f2f6435c8ea0","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49732"},"specVersion":"0.1.0","time":"2024-11-17T20:00:18.007679258Z","eventData":"SUCCESS"}
{"id":"ea78799e-1179-420d-bffc-7730f81efb01","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:49732"},"specVersion":"0.1.0","time":"2024-11-17T20:00:18.009166258Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"99efdb82-a202-43d9-9cb1-d50f24740438","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49736"},"specVersion":"0.1.0","time":"2024-11-17T20:00:18.950280966Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"6aabb8e5-f27f-40bb-9770-39c567cbf713","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49736"},"specVersion":"0.1.0","time":"2024-11-17T20:00:18.953140300Z","eventData":"SUCCESS"}
{"id":"7be26a43-912f-4d01-aa9e-dc1077de07fc","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:49736"},"specVersion":"0.1.0","time":"2024-11-17T20:00:18.956694966Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"ad9c7879-79c1-47af-956b-1af1d8ed1057","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49748"},"specVersion":"0.1.0","time":"2024-11-17T20:00:19.790926758Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"3ab7a1de-8c71-4af0-a7f9-ebc9ba0fcd4b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49748"},"specVersion":"0.1.0","time":"2024-11-17T20:00:19.800101675Z","eventData":"SUCCESS"}
{"id":"9b8f7483-f469-4c9b-b525-ca14e3075432","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:49748"},"specVersion":"0.1.0","time":"2024-11-17T20:00:19.802046258Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"e9caac5e-dd35-46cd-b30c-0f12c681ffa6","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49752"},"specVersion":"0.1.0","time":"2024-11-17T20:00:20.839081759Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"f179cfea-4264-4b00-9183-62355169a3a0","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49752"},"specVersion":"0.1.0","time":"2024-11-17T20:00:20.840000759Z","eventData":"SUCCESS"}
{"id":"37046d0a-fefb-43b0-9586-1195360e5c32","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:49752"},"specVersion":"0.1.0","time":"2024-11-17T20:00:20.841118592Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"2477b0ba-cb1c-48ba-b992-326b9442c91e","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49758"},"specVersion":"0.1.0","time":"2024-11-17T20:00:21.865185759Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"edaa0157-d985-4707-93fc-90abe42f9231","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49758"},"specVersion":"0.1.0","time":"2024-11-17T20:00:21.866701176Z","eventData":"SUCCESS"}
{"id":"d2747de9-bb57-4ce9-a43d-2123a2a658e6","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:49758"},"specVersion":"0.1.0","time":"2024-11-17T20:00:21.868933509Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"bf3f7569-2788-48db-a99a-eaf41cd361b7","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49766"},"specVersion":"0.1.0","time":"2024-11-17T20:00:22.889268093Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"05f82f9e-1c99-480c-b0e5-aeff949c0deb","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49766"},"specVersion":"0.1.0","time":"2024-11-17T20:00:22.889987927Z","eventData":"SUCCESS"}
{"id":"46d3161b-5eb1-4a61-ace4-4c518599c365","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:49766"},"specVersion":"0.1.0","time":"2024-11-17T20:00:22.890801760Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"b0a0e5b8-367d-4a4b-ba13-99942ad81e36","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49768"},"specVersion":"0.1.0","time":"2024-11-17T20:00:23.920756135Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"b5cbcd24-c09f-44d5-8b80-3085182ba7d5","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49768"},"specVersion":"0.1.0","time":"2024-11-17T20:00:23.921182719Z","eventData":"SUCCESS"}
{"id":"74a43358-462d-4ffc-bc63-747cd633430a","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:49768"},"specVersion":"0.1.0","time":"2024-11-17T20:00:23.921954427Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"c6cdf6aa-ea0c-4459-a93b-6066b199569e","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49784"},"specVersion":"0.1.0","time":"2024-11-17T20:00:24.952894594Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"37333983-9be6-46be-8a92-b3d779530559","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49784"},"specVersion":"0.1.0","time":"2024-11-17T20:00:24.957570844Z","eventData":"SUCCESS"}
{"id":"40f9051f-675e-4024-830e-40dae1811a3b","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:49784"},"specVersion":"0.1.0","time":"2024-11-17T20:00:24.958214553Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"07065eb1-cd4f-404a-bae2-496b480683b5","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49796"},"specVersion":"0.1.0","time":"2024-11-17T20:00:25.984974470Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"8539b0c9-5fbc-4c21-83f3-556095cd35f0","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49796"},"specVersion":"0.1.0","time":"2024-11-17T20:00:25.985695886Z","eventData":"SUCCESS"}
{"id":"974ae6f5-b71f-4502-8fcf-94c4a2a69b64","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:49796"},"specVersion":"0.1.0","time":"2024-11-17T20:00:25.986826678Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"d7e74567-184b-4044-9f62-5d2561337fd8","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49798"},"specVersion":"0.1.0","time":"2024-11-17T20:00:27.018652095Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"4cda2d85-bf2d-48cc-9da1-f5dde43f1dec","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:49798"},"specVersion":"0.1.0","time":"2024-11-17T20:00:27.019116595Z","eventData":"SUCCESS"}
{"id":"e0c62e29-f1fa-4f58-89c1-a3ba6dabd704","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:49798"},"specVersion":"0.1.0","time":"2024-11-17T20:00:27.020058679Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"f10385b8-eb5a-44d4-b464-bc9181a6813e","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:59610"},"specVersion":"0.1.0","time":"2024-11-17T20:00:28.043660929Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"18a853b8-e538-4e5c-b312-b19c03bd3b4f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:59610"},"specVersion":"0.1.0","time":"2024-11-17T20:00:28.045170554Z","eventData":"SUCCESS"}
{"id":"6a63134f-3180-46a8-816c-81cebb9e0e48","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:59610"},"specVersion":"0.1.0","time":"2024-11-17T20:00:28.049288387Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"9bcab606-8177-46cb-b051-8a99bc2a07ab","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:59620"},"specVersion":"0.1.0","time":"2024-11-17T20:00:29.071506304Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"a6fc08f6-815f-4192-86a1-0f0d3a048425","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:59620"},"specVersion":"0.1.0","time":"2024-11-17T20:00:29.071991929Z","eventData":"SUCCESS"}
{"id":"f72db426-5461-48ab-b3d4-ac2555366fd7","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:59620"},"specVersion":"0.1.0","time":"2024-11-17T20:00:29.072951471Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"32d39350-188e-4d3c-a136-80c64b94c9a0","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:59630"},"specVersion":"0.1.0","time":"2024-11-17T20:00:30.092805097Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"4ba8c0b0-8c78-4f87-a233-3b368ea3f823","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:59630"},"specVersion":"0.1.0","time":"2024-11-17T20:00:30.094442638Z","eventData":"SUCCESS"}
{"id":"e31a91e1-a56c-45d3-8549-d420230f0044","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:59630"},"specVersion":"0.1.0","time":"2024-11-17T20:00:30.095093430Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"ca4f07a8-8762-4073-8745-daaa5645b3a1","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:59640"},"specVersion":"0.1.0","time":"2024-11-17T20:00:31.131452014Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"bb811c82-98b4-4e32-b5fe-e25d54212058","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:59640"},"specVersion":"0.1.0","time":"2024-11-17T20:00:31.131828347Z","eventData":"SUCCESS"}
{"id":"d745d97e-b6a9-46c3-acf2-0d58a0264a29","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:59640"},"specVersion":"0.1.0","time":"2024-11-17T20:00:31.132648264Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"c7f5f163-9684-48d8-99eb-1e958ab97653","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:59650"},"specVersion":"0.1.0","time":"2024-11-17T20:00:32.145435375Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"e1b0a5cd-720b-48ed-a1bb-de174d2a8632","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:59650"},"specVersion":"0.1.0","time":"2024-11-17T20:00:32.146126458Z","eventData":"SUCCESS"}
{"id":"47824362-a7cf-4c6b-8b92-bf0dabf201b0","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:59650"},"specVersion":"0.1.0","time":"2024-11-17T20:00:32.146986917Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"cc648c94-9890-4cfb-a61b-96ca24672adf","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:59658"},"specVersion":"0.1.0","time":"2024-11-17T20:00:33.165000209Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"71bb5ab7-c0d0-49cb-ac83-9c73997d5241","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:59658"},"specVersion":"0.1.0","time":"2024-11-17T20:00:33.165737084Z","eventData":"SUCCESS"}
{"id":"907a75d1-1ce3-4614-ba31-e7317ea16670","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.19.0.1:59658"},"specVersion":"0.1.0","time":"2024-11-17T20:00:33.166480375Z","eventData":{"interceptorName":"client-id","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"Request parameters do not satisfy the configured policy. clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"5f77b44b-776f-40f7-bd24-105ff6f491e6","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:59670"},"specVersion":"0.1.0","time":"2024-11-17T20:00:34.970063126Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"3b7a575e-2460-44c6-bd3f-7bef58eb1944","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6969","remoteAddress":"/172.19.0.1:59670"},"specVersion":"0.1.0","time":"2024-11-17T20:00:34.972990001Z","eventData":"SUCCESS"}
{"id":"72927b07-f14b-4fae-a308-c5fe66291196","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.19.0.8:6972","remoteAddress":"/172.19.0.1:52208"},"specVersion":"0.1.0","time":"2024-11-17T20:00:35.031943085Z","eventData":{"clientSoftwareName":"apache-kafka-java","clientSoftwareVersion":"3.7.0"}}
{"id":"9fbcb03d-9a36-48b1-8fa2-b9c6cfc2d707","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.19.0.8:6972","remoteAddress":"/172.19.0.1:52208"},"specVersion":"0.1.0","time":"2024-11-17T20:00:35.032330085Z","eventData":"SUCCESS"}
[2024-11-17 20:00:39,476] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 203 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690192.svg)](https://asciinema.org/a/690192)

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
 Container gateway1  Stopping
 Container gateway2  Stopping
 Container schema-registry  Stopping
 Container kafka-client  Stopping
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway2  Removed
 Container gateway1  Removed
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container schema-registry  Removed
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka1  Removed
 Container kafka3  Removed
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Network safeguard-client-id_default  Removing
 Network safeguard-client-id_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690193.svg)](https://asciinema.org/a/690193)

</TabItem>
</Tabs>

# Conclusion

You can now make sure you have valid client id to help the right customers

