---
title: Client Id validation
description: Client Id validation
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Client Id validation



## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ESYWLXz11d6rIsL6QgqDETKnv.svg)](https://asciinema.org/a/ESYWLXz11d6rIsL6QgqDETKnv)

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
 Container kafka1  Running
 Container kafka2  Running
 Container gateway2  Running
 Container schema-registry  Running
 Container gateway1  Running
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container kafka3  Healthy
 Container gateway2  Healthy
 Container gateway1  Healthy
 Container schema-registry  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container zookeeper  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/aVN50sheInR2LR2O17OkmmQwz.svg)](https://asciinema.org/a/aVN50sheInR2LR2O17OkmmQwz)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNDQ2NDU1N30.FoDZ-iEznoo-Be7EmAJAvbfISf_echqVTy2RbysTMmI';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/9rlPcGJTdXFFh6Cik0VB9j4Kg.svg)](https://asciinema.org/a/9rlPcGJTdXFFh6Cik0VB9j4Kg)

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

[![asciicast](https://asciinema.org/a/th6msbcC1eSAjbiT55EDew89T.svg)](https://asciinema.org/a/th6msbcC1eSAjbiT55EDew89T)

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

[![asciicast](https://asciinema.org/a/x24DXeVkQNHLJzifS9NLm247b.svg)](https://asciinema.org/a/x24DXeVkQNHLJzifS9NLm247b)

</TabItem>
</Tabs>

## Adding interceptor client-id



<Tabs>
<TabItem value="Command">


```sh
cat step-08-client-id.json | jq

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
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
  "priority": 100,
  "config": {
    "namingConvention": "naming-convention-.*"
  }
}
{
  "message": "client-id is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/tHeiehrCWtZYg9r4LcegIEtuQ.svg)](https://asciinema.org/a/tHeiehrCWtZYg9r4LcegIEtuQ)

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

[![asciicast](https://asciinema.org/a/lSFfYrMX90R0sh5zaVK8SeGIB.svg)](https://asciinema.org/a/lSFfYrMX90R0sh5zaVK8SeGIB)

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
>> clientId 'adminclient-17' is invalid, naming convention must match with regular expression 'naming-convention-.*'
> ```




</TabItem>
<TabItem value="Output">

```
[2024-01-31 09:09:22,301] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 0. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:22,430] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 1. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:22,659] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 2. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:22,989] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 3. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:23,425] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 4. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:24,477] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 5. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:25,486] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 6. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:26,739] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 7. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:28,609] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 8. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:29,608] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 9. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:30,781] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 10. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:31,853] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 11. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:32,802] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 12. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:34,064] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 13. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:35,311] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 14. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:36,456] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 15. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:37,404] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 16. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:38,555] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 17. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:39,722] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 18. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:40,975] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 19. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:42,232] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 20. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:43,271] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 21. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:44,438] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 22. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:45,581] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 23. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:46,519] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 24. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:47,466] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 25. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:48,523] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 26. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:49,658] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 27. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:50,701] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 28. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:51,922] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 29. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:52,940] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 30. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:53,976] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 31. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:55,010] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 32. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:56,253] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 33. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:57,304] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 34. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:58,409] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 35. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:09:59,870] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 36. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:01,042] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 37. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:01,988] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 38. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:03,229] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 39. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:04,172] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 40. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:05,315] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 41. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:06,496] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 42. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:07,666] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 43. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:08,816] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 44. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:09,771] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 45. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:10,924] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 46. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:11,855] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 47. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:12,785] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 48. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:14,057] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 49. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:14,987] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 50. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:16,044] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 51. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:17,184] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 52. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:18,339] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 53. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:19,373] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 54. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:20,517] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 55. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-01-31 09:10:21,748] WARN [AdminClient clientId=adminclient-1] Received error POLICY_VIOLATION from node -1 when making an ApiVersionsRequest with correlation id 56. Disconnecting. (org.apache.kafka.clients.NetworkClient)
Error while executing topic command : Timed out waiting for a node assignment. Call: createTopics
[2024-01-31 09:10:22,161] ERROR org.apache.kafka.common.errors.TimeoutException: Timed out waiting for a node assignment. Call: createTopics
 (kafka.admin.TopicCommand$)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/608x7YhwL4fOSdVfjVpNGFTnT.svg)](https://asciinema.org/a/608x7YhwL4fOSdVfjVpNGFTnT)

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

[![asciicast](https://asciinema.org/a/YUpHXpSy3qXWrGSocJXwiB449.svg)](https://asciinema.org/a/YUpHXpSy3qXWrGSocJXwiB449)

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

[![asciicast](https://asciinema.org/a/jc0HefQTi9QGsjXZIqQv7QHP7.svg)](https://asciinema.org/a/jc0HefQTi9QGsjXZIqQv7QHP7)

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
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin")'
```


returns 1 event
```json
{
  "id" : "8e31b776-6f22-4899-92e3-8e6d3b617e6b",
  "source" : "krn://cluster=hczsSNiJRLiZ6d-P4GWMgg",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:17404"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T08:02:43.660425920Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin",
    "message" : "clientId 'adminclient-17' is invalid, naming convention must match with regular expression 'naming-convention-.*'"
  }
}
```


</TabItem>
<TabItem value="Output">

```
{"id":"7fdd5ccf-9093-4413-9dd9-7a67a4665a4f","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.160.6:8888","remoteAddress":"192.168.65.1:39399"},"specVersion":"0.1.0","time":"2024-01-31T08:09:16.925086796Z","eventData":{"method":"POST","path":"/admin/vclusters/v1/vcluster/teamA/username/sa","body":"{\"lifeTimeSeconds\": 7776000}"}}
{"id":"9fcdb616-0e1a-4144-95be-5856440c5e9f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24261"},"specVersion":"0.1.0","time":"2024-01-31T08:09:18.377666714Z","eventData":"SUCCESS"}
{"id":"6069cbf3-987e-432a-8550-eca179160031","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6971","remoteAddress":"/192.168.65.1:27435"},"specVersion":"0.1.0","time":"2024-01-31T08:09:18.480295214Z","eventData":"SUCCESS"}
{"id":"ecce66ef-8a4f-46f2-9a02-1cff9a2297d9","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24263"},"specVersion":"0.1.0","time":"2024-01-31T08:09:20.199037631Z","eventData":"SUCCESS"}
{"id":"dfb94e33-ea78-4ef1-b379-85a63af4574c","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24264"},"specVersion":"0.1.0","time":"2024-01-31T08:09:20.240951340Z","eventData":"SUCCESS"}
{"id":"434d3fc3-fee6-4710-8247-1fed092a0444","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.160.6:8888","remoteAddress":"192.168.65.1:39404"},"specVersion":"0.1.0","time":"2024-01-31T08:09:20.722923340Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/client-id","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"namingConvention\" : \"naming-convention-.*\"  }}"}}
{"id":"7d0a0127-fde4-4eb7-b994-c15e95cea438","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.160.6:8888","remoteAddress":"192.168.65.1:39405"},"specVersion":"0.1.0","time":"2024-01-31T08:09:21.171689673Z","eventData":{"method":"GET","path":"/admin/interceptors/v1/vcluster/teamA","body":null}}
{"id":"3ea34f69-07a4-41bd-996a-dd8500d3855c","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24267"},"specVersion":"0.1.0","time":"2024-01-31T08:09:22.262371632Z","eventData":"SUCCESS"}
{"id":"4c258d8a-6129-476a-bd5b-8490424edb17","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24267"},"specVersion":"0.1.0","time":"2024-01-31T08:09:22.282677466Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"0eef4edd-504f-460d-a14c-e46ebab5c837","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24268"},"specVersion":"0.1.0","time":"2024-01-31T08:09:22.418707382Z","eventData":"SUCCESS"}
{"id":"d856cf24-2cbe-457a-ab2f-cf1bff1ee833","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24268"},"specVersion":"0.1.0","time":"2024-01-31T08:09:22.424166174Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"0cc21abf-615d-4991-9514-d046ee5a9436","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24269"},"specVersion":"0.1.0","time":"2024-01-31T08:09:22.649675299Z","eventData":"SUCCESS"}
{"id":"8a88295a-2e44-4df4-b6c1-ac1811429f1e","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24269"},"specVersion":"0.1.0","time":"2024-01-31T08:09:22.655785924Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"e87c793f-a175-4009-9b10-31ec57877843","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24281"},"specVersion":"0.1.0","time":"2024-01-31T08:09:22.978557758Z","eventData":"SUCCESS"}
{"id":"c74d276f-1f76-4833-b3d0-584eb94e253c","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24281"},"specVersion":"0.1.0","time":"2024-01-31T08:09:22.983719549Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"47a71599-ab9f-4823-933f-ad2f9cb6f56c","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24282"},"specVersion":"0.1.0","time":"2024-01-31T08:09:23.414448299Z","eventData":"SUCCESS"}
{"id":"4f725b23-ccbc-4983-ab51-a1fadf5ff1a9","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24282"},"specVersion":"0.1.0","time":"2024-01-31T08:09:23.420492258Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"5936b870-e48e-4f2a-85bc-d52a1d6125c1","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24283"},"specVersion":"0.1.0","time":"2024-01-31T08:09:24.410128675Z","eventData":"SUCCESS"}
{"id":"adc79d6d-5ffd-4c38-b69f-4f821c502e34","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24283"},"specVersion":"0.1.0","time":"2024-01-31T08:09:24.449708050Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"38f0bed1-6e4f-42f2-a8c1-40226e3bfc73","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24284"},"specVersion":"0.1.0","time":"2024-01-31T08:09:25.455921092Z","eventData":"SUCCESS"}
{"id":"46e931c0-f235-4043-9db3-f308bfe38fae","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24284"},"specVersion":"0.1.0","time":"2024-01-31T08:09:25.473204509Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"af00d8b3-5798-4fc1-9c9f-da98d26f70a8","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24285"},"specVersion":"0.1.0","time":"2024-01-31T08:09:26.697613676Z","eventData":"SUCCESS"}
{"id":"20d4cf02-b6e9-46e7-9114-494b8dfd3ade","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24285"},"specVersion":"0.1.0","time":"2024-01-31T08:09:26.725792718Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"effb53b4-14a3-45b7-8fad-e376f044f9cd","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24286"},"specVersion":"0.1.0","time":"2024-01-31T08:09:28.565270427Z","eventData":"SUCCESS"}
{"id":"35be3d35-6899-4788-bd54-393a6822171c","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24286"},"specVersion":"0.1.0","time":"2024-01-31T08:09:28.594040594Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"22e875cb-9db3-4972-87d6-b7829b18ce08","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24287"},"specVersion":"0.1.0","time":"2024-01-31T08:09:29.569752136Z","eventData":"SUCCESS"}
{"id":"2872f58a-bc0e-4290-9e6d-e7dec8214f62","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24287"},"specVersion":"0.1.0","time":"2024-01-31T08:09:29.602432761Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"28991dcf-b4f2-4ab1-8acd-7310885748bc","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24288"},"specVersion":"0.1.0","time":"2024-01-31T08:09:30.760570428Z","eventData":"SUCCESS"}
{"id":"6b356d53-6a7d-4fb3-b02c-a574c022f4db","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24288"},"specVersion":"0.1.0","time":"2024-01-31T08:09:30.771188428Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"11c517c5-de1f-4d9b-9893-937f2da7a23c","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24289"},"specVersion":"0.1.0","time":"2024-01-31T08:09:31.836012345Z","eventData":"SUCCESS"}
{"id":"65251ae1-40a6-4236-a8da-76a68851d01c","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24289"},"specVersion":"0.1.0","time":"2024-01-31T08:09:31.847102845Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"ef4966a9-4fe1-423e-b3cd-47f17f728ab1","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24292"},"specVersion":"0.1.0","time":"2024-01-31T08:09:32.791894596Z","eventData":"SUCCESS"}
{"id":"342cff9a-cf71-4572-b679-67070bcf1ddf","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24292"},"specVersion":"0.1.0","time":"2024-01-31T08:09:32.797824429Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"a5b08096-45d8-43be-b48d-dc6a8ee727df","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24302"},"specVersion":"0.1.0","time":"2024-01-31T08:09:34.051174179Z","eventData":"SUCCESS"}
{"id":"a251cff5-cb7f-4472-aa2e-38006b088aa3","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24302"},"specVersion":"0.1.0","time":"2024-01-31T08:09:34.058257971Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"6a710b92-2921-4e5c-b69f-c1aa80a1e6ae","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24303"},"specVersion":"0.1.0","time":"2024-01-31T08:09:35.300133972Z","eventData":"SUCCESS"}
{"id":"6ef81530-5269-48c7-8944-6b9ba8c63049","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24303"},"specVersion":"0.1.0","time":"2024-01-31T08:09:35.306646597Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"22a03657-e64e-4e54-a278-eaa0bad5adf4","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24304"},"specVersion":"0.1.0","time":"2024-01-31T08:09:36.444588958Z","eventData":"SUCCESS"}
{"id":"3a63d748-d0b7-48ef-be34-857ded70614e","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24304"},"specVersion":"0.1.0","time":"2024-01-31T08:09:36.452475208Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"e2c1ff8c-b89d-4c34-ae43-6b87acd9cd5d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24305"},"specVersion":"0.1.0","time":"2024-01-31T08:09:37.385629167Z","eventData":"SUCCESS"}
{"id":"0049273c-0d81-42b1-91cd-23336c894544","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24305"},"specVersion":"0.1.0","time":"2024-01-31T08:09:37.400887083Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"2868add4-ecc4-4761-9142-1ec416342414","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24306"},"specVersion":"0.1.0","time":"2024-01-31T08:09:38.545318542Z","eventData":"SUCCESS"}
{"id":"7e8a429e-4159-4e9e-9a9f-60f6bf12f967","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24306"},"specVersion":"0.1.0","time":"2024-01-31T08:09:38.550776792Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"d1318faa-42e0-4a8b-a884-08c83a4000c0","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24307"},"specVersion":"0.1.0","time":"2024-01-31T08:09:39.712809793Z","eventData":"SUCCESS"}
{"id":"5ba7c860-a1c6-4871-8279-2a63b657eeda","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24307"},"specVersion":"0.1.0","time":"2024-01-31T08:09:39.717049668Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"8fe3d541-1d76-4fdd-b858-5abd633d56e3","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24308"},"specVersion":"0.1.0","time":"2024-01-31T08:09:40.965451168Z","eventData":"SUCCESS"}
{"id":"00bb50f1-d338-4aca-8af0-93ce4ba81f09","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24308"},"specVersion":"0.1.0","time":"2024-01-31T08:09:40.971354127Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"e7ef6629-6075-44f0-93ee-7840e64090fb","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24309"},"specVersion":"0.1.0","time":"2024-01-31T08:09:42.221697461Z","eventData":"SUCCESS"}
{"id":"968fd434-c803-4e22-a2ca-a0bfd2399cc4","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24309"},"specVersion":"0.1.0","time":"2024-01-31T08:09:42.228201336Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"7213e9b0-aaf7-426d-bfa2-eb2404e3253c","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24321"},"specVersion":"0.1.0","time":"2024-01-31T08:09:43.262004670Z","eventData":"SUCCESS"}
{"id":"42469953-00b6-44f7-8e0f-3e323cf10980","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24321"},"specVersion":"0.1.0","time":"2024-01-31T08:09:43.266104170Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"d230c65f-fb49-47ab-8459-772668e065c3","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24322"},"specVersion":"0.1.0","time":"2024-01-31T08:09:44.428529212Z","eventData":"SUCCESS"}
{"id":"716d1fcf-5c58-47ce-83ea-f2d31aadc392","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24322"},"specVersion":"0.1.0","time":"2024-01-31T08:09:44.433755920Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"46f36ee3-a594-4352-ac0c-dd18266b532a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24323"},"specVersion":"0.1.0","time":"2024-01-31T08:09:45.571314171Z","eventData":"SUCCESS"}
{"id":"af8aa7a3-14df-436c-95de-7e2aa78d0aaa","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24323"},"specVersion":"0.1.0","time":"2024-01-31T08:09:45.577539671Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"7c170281-b9ed-49f4-81b2-8aeafe27b89f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24324"},"specVersion":"0.1.0","time":"2024-01-31T08:09:46.506693713Z","eventData":"SUCCESS"}
{"id":"1ae4c230-df27-4ace-bce4-dc387f8eff05","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24324"},"specVersion":"0.1.0","time":"2024-01-31T08:09:46.511804671Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"f9aac9dd-8a5e-4f39-bec1-c66ce9020a4d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24325"},"specVersion":"0.1.0","time":"2024-01-31T08:09:47.453284922Z","eventData":"SUCCESS"}
{"id":"03a0f46c-ddff-48d8-815f-408fd48933e8","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24325"},"specVersion":"0.1.0","time":"2024-01-31T08:09:47.463241088Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"c6c35a9e-6d86-436b-a7f3-09f4bdeca983","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24326"},"specVersion":"0.1.0","time":"2024-01-31T08:09:48.506017380Z","eventData":"SUCCESS"}
{"id":"05ef78d2-2196-4b04-ac82-0318b299d7c7","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24326"},"specVersion":"0.1.0","time":"2024-01-31T08:09:48.518438839Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"d5ec19cb-1e3b-4632-841e-6b30868d34fe","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24327"},"specVersion":"0.1.0","time":"2024-01-31T08:09:49.652546048Z","eventData":"SUCCESS"}
{"id":"b72f5dbf-579f-4bc0-86ed-8bf9b74b6c65","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24327"},"specVersion":"0.1.0","time":"2024-01-31T08:09:49.656165964Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"47e19399-45c2-4973-8be7-fc57e2c9b33b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24328"},"specVersion":"0.1.0","time":"2024-01-31T08:09:50.693043506Z","eventData":"SUCCESS"}
{"id":"57105654-5bbf-4bdc-a908-b951dbc3b3fd","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24328"},"specVersion":"0.1.0","time":"2024-01-31T08:09:50.698665423Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"fac8ccee-4550-43ee-b183-e0aa37f2e1fb","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24329"},"specVersion":"0.1.0","time":"2024-01-31T08:09:51.913516549Z","eventData":"SUCCESS"}
{"id":"bfe8cbe2-96f7-4f5e-9729-f8dfc66e33f4","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24329"},"specVersion":"0.1.0","time":"2024-01-31T08:09:51.920021757Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"944b30dc-abee-4e03-a18d-0c4e962fe728","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24341"},"specVersion":"0.1.0","time":"2024-01-31T08:09:52.932505299Z","eventData":"SUCCESS"}
{"id":"07e6490b-5cc3-4964-8df9-edf187650cf6","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24341"},"specVersion":"0.1.0","time":"2024-01-31T08:09:52.937634424Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"d6fb3165-57b8-42dd-bae3-532b26b69f45","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24342"},"specVersion":"0.1.0","time":"2024-01-31T08:09:53.965628758Z","eventData":"SUCCESS"}
{"id":"f25aa786-e601-4f47-aa9c-ac9a3d39ec9c","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24342"},"specVersion":"0.1.0","time":"2024-01-31T08:09:53.971809425Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"c9ddbefd-b5cc-45aa-8d5e-7be992d25f15","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24343"},"specVersion":"0.1.0","time":"2024-01-31T08:09:54.999908467Z","eventData":"SUCCESS"}
{"id":"fcbdd45f-9557-401f-8147-7bf8b68aded6","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24343"},"specVersion":"0.1.0","time":"2024-01-31T08:09:55.006146634Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"e2225b3d-4727-4113-a59a-3cf1a39972da","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24344"},"specVersion":"0.1.0","time":"2024-01-31T08:09:56.243804259Z","eventData":"SUCCESS"}
{"id":"0561a373-190e-42d5-8cf9-ccbc796cd2e3","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24344"},"specVersion":"0.1.0","time":"2024-01-31T08:09:56.249538926Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"fff0bd88-37cf-4c6b-8176-d7b9993e5ce0","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24345"},"specVersion":"0.1.0","time":"2024-01-31T08:09:57.290909218Z","eventData":"SUCCESS"}
{"id":"a04ea440-4237-493e-afab-7635ea2db125","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24345"},"specVersion":"0.1.0","time":"2024-01-31T08:09:57.300093176Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"86737602-079b-471e-84d8-d83ce72515ae","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24346"},"specVersion":"0.1.0","time":"2024-01-31T08:09:58.390736260Z","eventData":"SUCCESS"}
{"id":"06b8043f-83d8-4bfb-a811-b63be36da130","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24346"},"specVersion":"0.1.0","time":"2024-01-31T08:09:58.400851010Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"038b7002-a69c-4735-8155-bb11db2e6c7c","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24347"},"specVersion":"0.1.0","time":"2024-01-31T08:09:59.841485636Z","eventData":"SUCCESS"}
{"id":"fa11343a-e4ad-4615-8d01-57c0e813a2d3","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24347"},"specVersion":"0.1.0","time":"2024-01-31T08:09:59.864861677Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"cc80b1bc-27f6-4b82-b71c-1d48dda60622","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24348"},"specVersion":"0.1.0","time":"2024-01-31T08:10:01.019462720Z","eventData":"SUCCESS"}
{"id":"591ee9f7-b61b-41c9-89e3-1379cb13b1d1","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24348"},"specVersion":"0.1.0","time":"2024-01-31T08:10:01.034420678Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"c016b0a3-f806-4479-948e-3da7887e0288","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24349"},"specVersion":"0.1.0","time":"2024-01-31T08:10:01.978953012Z","eventData":"SUCCESS"}
{"id":"3dce437b-744b-49ca-a589-48321ff76ca5","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24349"},"specVersion":"0.1.0","time":"2024-01-31T08:10:01.984442595Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"16bc9549-6702-4d76-aa7a-b3c73500ae64","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24361"},"specVersion":"0.1.0","time":"2024-01-31T08:10:03.217099512Z","eventData":"SUCCESS"}
{"id":"46a8df98-0979-4eb5-8cd0-94a6a2aa3044","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24361"},"specVersion":"0.1.0","time":"2024-01-31T08:10:03.224408304Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"74839a11-3517-46b5-92e2-831500ab838a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24362"},"specVersion":"0.1.0","time":"2024-01-31T08:10:04.161117513Z","eventData":"SUCCESS"}
{"id":"14310fa3-f429-4a97-a004-07d208639ba1","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24362"},"specVersion":"0.1.0","time":"2024-01-31T08:10:04.168946680Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"7c8895e7-8488-4017-b1ba-d0aa3bb83ed9","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24363"},"specVersion":"0.1.0","time":"2024-01-31T08:10:05.304754097Z","eventData":"SUCCESS"}
{"id":"89635be3-e55b-4805-9859-ee2220f14279","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24363"},"specVersion":"0.1.0","time":"2024-01-31T08:10:05.311333388Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"55c576ea-b808-4716-bd9e-23c28ebcfe64","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24364"},"specVersion":"0.1.0","time":"2024-01-31T08:10:06.470416916Z","eventData":"SUCCESS"}
{"id":"1f4eb663-f660-4c27-8865-fe50c5a77402","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24364"},"specVersion":"0.1.0","time":"2024-01-31T08:10:06.484022916Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"2256409f-b1bf-478d-8665-a0015ac8b34b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24365"},"specVersion":"0.1.0","time":"2024-01-31T08:10:07.660909584Z","eventData":"SUCCESS"}
{"id":"2d008aef-8b82-4081-94a8-cef88184aa07","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24365"},"specVersion":"0.1.0","time":"2024-01-31T08:10:07.665448792Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"38487d91-7add-4262-a719-bcfd6d47077a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24366"},"specVersion":"0.1.0","time":"2024-01-31T08:10:08.804459376Z","eventData":"SUCCESS"}
{"id":"f3365486-a4c9-4f9e-badc-018e0ee18357","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24366"},"specVersion":"0.1.0","time":"2024-01-31T08:10:08.810306542Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"f1df2dca-5c6d-4e60-b282-6686d7359ca7","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24367"},"specVersion":"0.1.0","time":"2024-01-31T08:10:09.765936710Z","eventData":"SUCCESS"}
{"id":"cc8c58eb-1737-4106-8f15-08628b6225c9","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24367"},"specVersion":"0.1.0","time":"2024-01-31T08:10:09.769333251Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"a5022116-ea05-4495-9004-67effce39522","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24368"},"specVersion":"0.1.0","time":"2024-01-31T08:10:10.908217377Z","eventData":"SUCCESS"}
{"id":"1191d2cf-f8b1-43b0-a95f-bf32c9e01ef9","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24368"},"specVersion":"0.1.0","time":"2024-01-31T08:10:10.919517835Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"b48dc7aa-1256-47e4-9475-3f49e1b0d2ec","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24369"},"specVersion":"0.1.0","time":"2024-01-31T08:10:11.848726127Z","eventData":"SUCCESS"}
{"id":"9665ada4-76ac-454a-aabf-12b09c26b3e3","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24369"},"specVersion":"0.1.0","time":"2024-01-31T08:10:11.853660044Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"38f168b4-dfc5-465f-919f-457e074ceb29","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24381"},"specVersion":"0.1.0","time":"2024-01-31T08:10:12.779418961Z","eventData":"SUCCESS"}
{"id":"a15df9df-016c-4c6c-a4f6-2355a8155a2a","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24381"},"specVersion":"0.1.0","time":"2024-01-31T08:10:12.783789211Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"82eb2b56-ab5c-4be7-be13-9ba494b79adf","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24382"},"specVersion":"0.1.0","time":"2024-01-31T08:10:14.042101045Z","eventData":"SUCCESS"}
{"id":"86f8cb86-4bf4-48b1-953a-8753c469fc79","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24382"},"specVersion":"0.1.0","time":"2024-01-31T08:10:14.054399420Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"d7fc490e-b045-4359-b37c-7a97ec9b5931","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24383"},"specVersion":"0.1.0","time":"2024-01-31T08:10:14.981467420Z","eventData":"SUCCESS"}
{"id":"d0b8ae7f-506a-4f63-ba1a-9b32de7674f9","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24383"},"specVersion":"0.1.0","time":"2024-01-31T08:10:14.985522004Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"e2337375-6e12-4a7e-bcce-0b8456ed253c","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24384"},"specVersion":"0.1.0","time":"2024-01-31T08:10:16.035104879Z","eventData":"SUCCESS"}
{"id":"4330dfe2-84ba-45c6-bada-e6a2842c70a9","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24384"},"specVersion":"0.1.0","time":"2024-01-31T08:10:16.040195088Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"b8181af3-817e-4e10-847f-c1b6f7f150c7","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24385"},"specVersion":"0.1.0","time":"2024-01-31T08:10:17.170232213Z","eventData":"SUCCESS"}
{"id":"9668d32d-d023-4755-a34f-3432d16e4aa9","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24385"},"specVersion":"0.1.0","time":"2024-01-31T08:10:17.178968588Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"3cefb6e4-518f-4651-98b6-87c9888222a9","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24386"},"specVersion":"0.1.0","time":"2024-01-31T08:10:18.330972839Z","eventData":"SUCCESS"}
{"id":"5c3db947-ce4e-4bd4-818d-159de0e227f9","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24386"},"specVersion":"0.1.0","time":"2024-01-31T08:10:18.334881047Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"b4fd09c5-4011-49c1-9f56-b7bcb2bbb12a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24387"},"specVersion":"0.1.0","time":"2024-01-31T08:10:19.364359172Z","eventData":"SUCCESS"}
{"id":"77c759fd-1759-4392-ad82-9aa377f5229d","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24387"},"specVersion":"0.1.0","time":"2024-01-31T08:10:19.369424589Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"a30483f1-5810-40c1-bdfd-1a29e305ef31","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24388"},"specVersion":"0.1.0","time":"2024-01-31T08:10:20.506177298Z","eventData":"SUCCESS"}
{"id":"5e361a27-dd78-4bc8-971a-02dd2e329129","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24388"},"specVersion":"0.1.0","time":"2024-01-31T08:10:20.512310798Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"80fa2681-0480-42e9-a6f7-21bde17f180f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24389"},"specVersion":"0.1.0","time":"2024-01-31T08:10:21.740765799Z","eventData":"SUCCESS"}
{"id":"1ae8f89c-f498-4fba-9164-0a1c90f57222","source":"krn://cluster=tCiXbQguSj2UxAtEpXLyuw","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:24389"},"specVersion":"0.1.0","time":"2024-01-31T08:10:21.746121340Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ClientIdRequiredPolicyPlugin","message":"clientId 'adminclient-1' is invalid, naming convention must match with regular expression 'naming-convention-.*'"}}
{"id":"44d2fede-63db-4511-8e0c-8fb6280a2def","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6969","remoteAddress":"/192.168.65.1:24401"},"specVersion":"0.1.0","time":"2024-01-31T08:10:23.895742008Z","eventData":"SUCCESS"}
{"id":"c1e05e69-0585-4b2a-916d-612c07b91361","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.160.6:6971","remoteAddress":"/192.168.65.1:27575"},"specVersion":"0.1.0","time":"2024-01-31T08:10:23.982198216Z","eventData":"SUCCESS"}
[2024-01-31 09:10:28,728] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 123 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/m8CPRMBeS49f8vxw82y0jCOuR.svg)](https://asciinema.org/a/m8CPRMBeS49f8vxw82y0jCOuR)

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
 Container schema-registry  Stopping
 Container gateway2  Stopping
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway1  Removed
 Container gateway2  Removed
 Container schema-registry  Removed
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container kafka3  Removed
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

[![asciicast](https://asciinema.org/a/xuM40mGHEGTUv5pazqOMWupE1.svg)](https://asciinema.org/a/xuM40mGHEGTUv5pazqOMWupE1)

</TabItem>
</Tabs>

# Conclusion

You can now make sure you have valid client id to help the right customers

