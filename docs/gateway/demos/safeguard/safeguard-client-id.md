---
title: Client Id validation
description: Client Id validation
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

[![asciicast](https://asciinema.org/a/AGTh1d60KI8MjOVqiMfdRmgko.svg)](https://asciinema.org/a/AGTh1d60KI8MjOVqiMfdRmgko)

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
    labels:
      tag: conduktor
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
    labels:
      tag: conduktor
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
 Container kafka-client  Creating
 Container zookeeper  Creating
 Container kafka-client  Created
 Container zookeeper  Created
 Container kafka1  Creating
 Container kafka3  Creating
 Container kafka2  Creating
 Container kafka3  Created
 Container kafka1  Created
 Container kafka2  Created
 Container schema-registry  Creating
 Container gateway1  Creating
 Container gateway2  Creating
 gateway1 The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 
 gateway2 The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 
 Container gateway1  Created
 Container gateway2  Created
 Container schema-registry  Created
 Container zookeeper  Starting
 Container kafka-client  Starting
 Container zookeeper  Started
 Container kafka-client  Started
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Healthy
 Container kafka1  Starting
 Container zookeeper  Healthy
 Container kafka3  Starting
 Container zookeeper  Healthy
 Container kafka2  Starting
 Container kafka2  Started
 Container kafka1  Started
 Container kafka3  Started
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container gateway1  Starting
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container schema-registry  Starting
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container gateway2  Starting
 Container schema-registry  Started
 Container gateway1  Started
 Container gateway2  Started
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka3  Healthy
 Container zookeeper  Healthy
 Container kafka1  Healthy
 Container kafka-client  Healthy
 Container kafka2  Healthy
 Container schema-registry  Healthy
 Container gateway2  Healthy
 Container gateway1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/GbKdoN9ReUWFsDKWqO6yWesbu.svg)](https://asciinema.org/a/GbKdoN9ReUWFsDKWqO6yWesbu)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNTY1NDcyNH0.4KipfLjU5dnD-eEZGWch4nuQCDv368Gu-UK346LQv-M';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/h3Ly6MmdSbwUQjJc2jAe8umsh.svg)](https://asciinema.org/a/h3Ly6MmdSbwUQjJc2jAe8umsh)

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

[![asciicast](https://asciinema.org/a/bp2zJzmgkwTb07sKfIvaSmwbz.svg)](https://asciinema.org/a/bp2zJzmgkwTb07sKfIvaSmwbz)

</TabItem>
</Tabs>

## Listing topics in teamA



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --list
```


</TabItem>
<TabItem value="Output">

```
users

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/kKSba7Y2HNXvUhjxoQSJWh7Td.svg)](https://asciinema.org/a/kKSba7Y2HNXvUhjxoQSJWh7Td)

</TabItem>
</Tabs>

## Adding interceptor client-id



Creating the interceptor named `client-id` of the plugin `io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin` using the following payload

```json
{
  "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
  "priority" : 100,
  "config" : {
    "namingConvention" : "naming-convention-.*"
  }
}
```

Here's how to send it:

<Tabs>
<TabItem value="Command">


```sh
curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/client-id" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-08-client-id.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "message": "client-id is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/1E8tRxGsKZiFYtz4We6tONLUa.svg)](https://asciinema.org/a/1E8tRxGsKZiFYtz4We6tONLUa)

</TabItem>
</Tabs>

## Listing interceptors for teamA

Listing interceptors on `gateway1` for virtual cluster `teamA`

<Tabs>
<TabItem value="Command">


```sh
curl \
    --request GET 'http://localhost:8888/admin/interceptors/v1/vcluster/teamA' \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "interceptors": [
    {
      "name": "client-id",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
      "apiKey": null,
      "priority": 100,
      "timeoutMs": 9223372036854775807,
      "config": {
        "namingConvention": "naming-convention-.*"
      }
    }
  ]
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/eOjazwzAyA70D2892cAAU4GsC.svg)](https://asciinema.org/a/eOjazwzAyA70D2892cAAU4GsC)

</TabItem>
</Tabs>

## Creating topic customers on teamA

Creating on `teamA`:

* Topic `customers` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
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
>> clientId 'adminclient-41' is invalid, naming convention must match with regular expression 'naming-convention-.*'
> ```




</TabItem>
<TabItem value="Output">

```
[2024-02-14 03:45:29,923] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 0. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:30,046] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 1. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:30,168] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 2. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:30,517] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 3. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:31,072] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 4. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:32,153] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 5. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:33,117] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 6. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:34,287] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 7. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:35,538] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 8. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:36,479] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 9. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:37,535] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 10. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:38,601] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 11. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:39,647] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 12. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:40,708] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 13. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:41,989] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 14. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:43,254] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 15. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:44,523] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 16. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:45,775] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 17. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:46,942] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 18. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:47,780] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 19. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:49,038] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 20. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:49,913] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 21. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:51,182] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 22. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:52,121] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 23. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:53,293] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 24. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:54,240] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 25. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:55,383] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 26. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:56,246] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 27. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:57,115] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 28. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:57,975] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 29. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:45:59,024] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 30. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:00,102] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 31. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:01,286] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 32. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:02,255] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 33. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:03,525] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 34. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:04,507] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 35. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:05,574] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 36. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:06,737] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 37. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:07,803] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 38. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:08,982] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 39. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:09,934] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 40. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:10,989] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 41. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:11,863] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 42. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:12,842] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 43. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:14,083] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 44. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:15,023] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 45. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:16,064] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 46. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:16,919] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 47. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:18,083] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 48. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:19,332] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 49. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:20,382] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 50. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:21,418] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 51. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:22,463] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 52. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:23,637] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 53. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:24,616] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 54. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:25,560] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 55. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:26,709] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 56. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:27,645] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 57. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:28,698] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 58. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-02-14 03:46:29,550] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 59. Disconnecting. (org.apache.kafka.clients.NetworkClient)
Error while executing topic command : Timed out waiting for a node assignment. Call: createTopics
 (kafka.admin.TopicCommand$)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/AhAR8kxybok9Mxt74erO1829u.svg)](https://asciinema.org/a/AhAR8kxybok9Mxt74erO1829u)

</TabItem>
</Tabs>

## Let's update the client id to match the convention



<Tabs>
<TabItem value="Command">


```sh
echo >> teamA-sa.properties    
echo "client.id=naming-convention-for-this-application" >> teamA-sa.properties    
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/5PGucdLxxzOznxqNE8aPxyAmp.svg)](https://asciinema.org/a/5PGucdLxxzOznxqNE8aPxyAmp)

</TabItem>
</Tabs>

## Creating topic customers on teamA

Creating on `teamA`:

* Topic `customers` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
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

[![asciicast](https://asciinema.org/a/Bivoitxh1AAQ69OyPiMXV7EY5.svg)](https://asciinema.org/a/Bivoitxh1AAQ69OyPiMXV7EY5)

</TabItem>
</Tabs>

## Check in the audit log that produce was denied

Check in the audit log that produce was denied in cluster `kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --topic _auditLogs \
    --from-beginning \
    --timeout-ms 3000 \
    | jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin")'
```


returns 

```json
{
  "id": "efe53d60-f3ab-4d05-9164-706dfb2f93c8",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21282"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:29.910817294Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "8310e4d9-85dd-41e7-b3aa-ec6daecb9fb3",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21283"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:30.043989211Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "137e6444-24d8-4389-8069-c51e86b0b5b6",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21284"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:30.166534544Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "b8f18bde-f955-4704-90b3-7039c97425f6",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21285"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:30.512608253Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "2bb290da-e53f-4213-a901-3a493d8a4925",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21286"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:31.069923170Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "1a185e53-d205-4284-8790-c5a3983beb80",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21287"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:32.149766503Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "e9de8c4c-714c-41d5-9cfe-fae1cc82f531",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21288"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:33.112290712Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "b30e7912-6e72-41d4-9187-184887ec0b1d",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21289"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:34.282501338Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "2892a987-0b6d-4c8d-bcf1-db1b1b171a75",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21290"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:35.535846713Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "810e8502-1ddf-4dba-81f6-4ecdc11f731b",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21291"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:36.476799297Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "6e7ffe11-3b3a-445b-8fe3-fdc512c07d8b",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21292"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:37.532466756Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "61d624cb-1f54-4fdf-bbab-7924adde0726",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21317"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:38.596960465Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "e05fb171-7bec-44ec-848c-d3de400b1173",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21318"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:39.645722924Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "708e26d3-d924-41c3-8656-5fa031f08b6e",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21319"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:40.704392841Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "ecf6acfd-46bc-4254-aa17-d5c5095dc041",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21320"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:41.984330925Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "6cdb0c5f-5257-4bd2-af23-9d69afb13314",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21321"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:43.250322384Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "9d380806-548c-4e91-8d76-33bbc1731b74",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21322"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:44.519505176Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "c40e946c-46d4-401e-a6ef-78e7bc36f967",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21323"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:45.772924760Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "452aa101-12c6-44d4-927a-8830d3517421",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21324"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:46.936088552Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "dda8c22d-a314-4cec-b79e-46ee1a477dd2",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21349"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:47.778435928Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "44fe0104-0f0d-4eb4-bc8f-0330df5d281c",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21350"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:49.035611011Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "0a482281-5ba3-46b6-b75c-81c10f14e6cd",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21351"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:49.907622054Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "4d3a3629-a137-4af3-ae1b-195e6ff7d53a",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21352"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:51.173731012Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "19bec7af-2194-4175-9f49-ccd9c5214c72",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21353"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:52.118219846Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "67442f18-477b-4a38-82b8-83fbfafb37cd",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21354"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:53.289382472Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "856fc9db-9ef0-4bad-a0cb-2efb92e8d5e5",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21355"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:54.236755958Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "d83d0a84-19ec-4d8f-9271-7250ce5c69f9",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21356"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:55.381377292Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "be8c0647-b758-4150-a253-d3ee1c39714c",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21357"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:56.242504876Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "8ec268cf-2307-4650-8041-29a6f31829fd",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21358"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:57.111267209Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "dafaa7f3-f179-4fb9-a366-f8f910399e39",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21383"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:57.971228585Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "106be1a5-e0fb-4196-b597-fa3224f67666",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21384"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:59.019497210Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "23af2bde-d054-42a0-9584-2a4d16fa0c81",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21385"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:00.099085711Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "14503b5b-4fa6-404a-8556-34f125fba626",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21386"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:01.281550753Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "977e8858-3514-445f-a9fd-fdc748daba70",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21387"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:02.248309628Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "a4872262-5a11-4493-bb20-672a7dadf18a",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21388"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:03.523160504Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "b8ea80e9-520e-4336-8a16-c619fc432511",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21389"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:04.503153880Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "47088125-c261-477b-89db-0c2029f21fed",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21390"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:05.572303005Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "00dcbbe5-af7b-4cf2-86f6-da557b950b5c",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21391"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:06.731559922Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "ec64fcb7-bf4d-415f-9b81-e0fdb189aba0",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21416"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:07.799452881Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "57d06014-91f8-4d64-a8d9-b73545d4667c",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21417"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:08.976265965Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "5396baa4-4481-45cc-b6a0-d7ceb6afb144",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21418"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:09.931241215Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "fa3783b7-71b2-42ac-b0cb-d7656465ba92",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21419"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:10.986234174Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "ac8364b6-3851-4458-974b-c9565f78e846",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21420"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:11.860032550Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "0c3ae726-1df6-4338-965e-a91fbe51329e",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21421"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:12.837210508Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "6114c194-29f4-4024-b3ed-8813646c5dea",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21422"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:14.080517176Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "9be903d4-0cd8-40a5-bf34-20f727de9177",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21423"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:15.021202885Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "9f8f93c3-1092-42d3-a507-7fc5226523f7",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21424"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:16.062003927Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "88cf8957-a4ab-4c2b-bf09-b9b03b2c21dd",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21425"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:16.915728927Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "1790abb1-36b4-4291-91f2-e339dd497786",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21450"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:18.079423219Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "a2afb275-0c10-4e2b-8b66-002e565a2c9d",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21451"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:19.329546512Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "55aef285-ef8e-4b4a-8a0a-d5be4d95adc4",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21452"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:20.378826887Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "a9e91210-31ad-476b-9b1b-8b02a45b22e7",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21453"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:21.415936263Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "f6ef1f4e-529c-4ec5-a34e-bc25de9303a7",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21454"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:22.460680471Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "0e739676-5e11-46a0-aad6-62d9adb3377e",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21455"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:23.632740889Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
Processed a total of 129 messages
ientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "ef6cbf90-b7ca-4c6f-b139-adb735637139",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21456"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:24.611977Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "6f6daac7-4a92-4b39-ad61-8e2ba7378517",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21457"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:25.556874792Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "0cb5e6f7-d62d-4d3d-b87a-e8ab925a58cf",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21458"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:26.706456459Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "969c25ff-2ffc-47ec-b7e8-281e8db26f21",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21483"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:27.644283793Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "7f729236-c0f9-432f-94d7-fd5f1c931ed5",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21484"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:28.696353960Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "d99e20a8-f61e-455d-84c6-b66996fc7093",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21485"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:29.548459169Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}

```



</TabItem>
<TabItem value="Output">

```
{
  "id": "efe53d60-f3ab-4d05-9164-706dfb2f93c8",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21282"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:29.910817294Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "8310e4d9-85dd-41e7-b3aa-ec6daecb9fb3",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21283"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:30.043989211Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "137e6444-24d8-4389-8069-c51e86b0b5b6",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21284"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:30.166534544Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "b8f18bde-f955-4704-90b3-7039c97425f6",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21285"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:30.512608253Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "2bb290da-e53f-4213-a901-3a493d8a4925",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21286"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:31.069923170Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "1a185e53-d205-4284-8790-c5a3983beb80",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21287"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:32.149766503Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "e9de8c4c-714c-41d5-9cfe-fae1cc82f531",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21288"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:33.112290712Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "b30e7912-6e72-41d4-9187-184887ec0b1d",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21289"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:34.282501338Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "2892a987-0b6d-4c8d-bcf1-db1b1b171a75",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21290"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:35.535846713Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "810e8502-1ddf-4dba-81f6-4ecdc11f731b",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21291"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:36.476799297Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "6e7ffe11-3b3a-445b-8fe3-fdc512c07d8b",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21292"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:37.532466756Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "61d624cb-1f54-4fdf-bbab-7924adde0726",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21317"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:38.596960465Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "e05fb171-7bec-44ec-848c-d3de400b1173",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21318"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:39.645722924Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "708e26d3-d924-41c3-8656-5fa031f08b6e",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21319"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:40.704392841Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "ecf6acfd-46bc-4254-aa17-d5c5095dc041",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21320"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:41.984330925Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "6cdb0c5f-5257-4bd2-af23-9d69afb13314",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21321"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:43.250322384Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "9d380806-548c-4e91-8d76-33bbc1731b74",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21322"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:44.519505176Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "c40e946c-46d4-401e-a6ef-78e7bc36f967",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21323"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:45.772924760Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "452aa101-12c6-44d4-927a-8830d3517421",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21324"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:46.936088552Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "dda8c22d-a314-4cec-b79e-46ee1a477dd2",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21349"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:47.778435928Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "44fe0104-0f0d-4eb4-bc8f-0330df5d281c",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21350"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:49.035611011Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "0a482281-5ba3-46b6-b75c-81c10f14e6cd",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21351"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:49.907622054Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "4d3a3629-a137-4af3-ae1b-195e6ff7d53a",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21352"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:51.173731012Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "19bec7af-2194-4175-9f49-ccd9c5214c72",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21353"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:52.118219846Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "67442f18-477b-4a38-82b8-83fbfafb37cd",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21354"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:53.289382472Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "856fc9db-9ef0-4bad-a0cb-2efb92e8d5e5",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21355"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:54.236755958Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "d83d0a84-19ec-4d8f-9271-7250ce5c69f9",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21356"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:55.381377292Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "be8c0647-b758-4150-a253-d3ee1c39714c",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21357"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:56.242504876Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "8ec268cf-2307-4650-8041-29a6f31829fd",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21358"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:57.111267209Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "dafaa7f3-f179-4fb9-a366-f8f910399e39",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21383"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:57.971228585Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "106be1a5-e0fb-4196-b597-fa3224f67666",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21384"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:45:59.019497210Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "23af2bde-d054-42a0-9584-2a4d16fa0c81",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21385"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:00.099085711Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "14503b5b-4fa6-404a-8556-34f125fba626",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21386"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:01.281550753Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "977e8858-3514-445f-a9fd-fdc748daba70",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21387"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:02.248309628Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "a4872262-5a11-4493-bb20-672a7dadf18a",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21388"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:03.523160504Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "b8ea80e9-520e-4336-8a16-c619fc432511",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21389"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:04.503153880Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "47088125-c261-477b-89db-0c2029f21fed",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21390"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:05.572303005Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "00dcbbe5-af7b-4cf2-86f6-da557b950b5c",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21391"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:06.731559922Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "ec64fcb7-bf4d-415f-9b81-e0fdb189aba0",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21416"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:07.799452881Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "57d06014-91f8-4d64-a8d9-b73545d4667c",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21417"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:08.976265965Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "5396baa4-4481-45cc-b6a0-d7ceb6afb144",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21418"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:09.931241215Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "fa3783b7-71b2-42ac-b0cb-d7656465ba92",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21419"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:10.986234174Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "ac8364b6-3851-4458-974b-c9565f78e846",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21420"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:11.860032550Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "0c3ae726-1df6-4338-965e-a91fbe51329e",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21421"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:12.837210508Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "6114c194-29f4-4024-b3ed-8813646c5dea",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21422"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:14.080517176Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "9be903d4-0cd8-40a5-bf34-20f727de9177",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21423"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:15.021202885Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "9f8f93c3-1092-42d3-a507-7fc5226523f7",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21424"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:16.062003927Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "88cf8957-a4ab-4c2b-bf09-b9b03b2c21dd",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21425"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:16.915728927Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "1790abb1-36b4-4291-91f2-e339dd497786",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21450"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:18.079423219Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "a2afb275-0c10-4e2b-8b66-002e565a2c9d",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21451"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:19.329546512Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "55aef285-ef8e-4b4a-8a0a-d5be4d95adc4",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21452"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:20.378826887Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "a9e91210-31ad-476b-9b1b-8b02a45b22e7",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21453"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:21.415936263Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "f6ef1f4e-529c-4ec5-a34e-bc25de9303a7",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21454"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:22.460680471Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "0e739676-5e11-46a0-aad6-62d9adb3377e",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21455"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:23.632740889Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
Processed a total of 129 messages
ientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "ef6cbf90-b7ca-4c6f-b139-adb735637139",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21456"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:24.611977Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "6f6daac7-4a92-4b39-ad61-8e2ba7378517",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21457"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:25.556874792Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "0cb5e6f7-d62d-4d3d-b87a-e8ab925a58cf",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21458"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:26.706456459Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "969c25ff-2ffc-47ec-b7e8-281e8db26f21",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21483"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:27.644283793Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "7f729236-c0f9-432f-94d7-fd5f1c931ed5",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21484"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:28.696353960Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
{
  "id": "d99e20a8-f61e-455d-84c6-b66996fc7093",
  "source": "krn://cluster=ve2_D0wASJCkMMPKrG6gGw",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:21485"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T02:46:29.548459169Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message": "clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/o9siq3cI1rgfveNguB1EKfYMq.svg)](https://asciinema.org/a/o9siq3cI1rgfveNguB1EKfYMq)

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
 Container kafka-client  Stopping
 Container schema-registry  Stopping
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
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka1  Stopping
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
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network safeguard-client-id_default  Removing
 Network safeguard-client-id_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/bSdG35aknIi9KOVhNU4G7pE2w.svg)](https://asciinema.org/a/bSdG35aknIi9KOVhNU4G7pE2w)

</TabItem>
</Tabs>

# Conclusion

You can now make sure you have valid client id to help the right customers

