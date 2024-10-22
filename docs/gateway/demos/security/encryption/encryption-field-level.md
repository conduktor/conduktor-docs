---
title: Encryption Field Level
description: Encryption Field Level
tag: encryption
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Field level encryption

Let's demonstrate field level encryption

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

![](images/encryption-decrypt-only-specific-fields.gif)

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
    image: harbor.cdkt.dev/conduktor/conduktor-gateway
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
    image: harbor.cdkt.dev/conduktor/conduktor-gateway
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
step-04-DOCKER-OUTPUT
```

</TabItem>
<TabItem value="Recording">

![](images/encryption-decrypt-only-specific-fields-step-04-DOCKER.gif)

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


</TabItem>
<TabItem value="Output">

```
step-05-CREATE_TOPICS-OUTPUT
```

</TabItem>
<TabItem value="Recording">

![](images/encryption-decrypt-only-specific-fields-step-05-CREATE_TOPICS.gif)

</TabItem>
</Tabs>

## Adding interceptor encrypt

We want to encrypt only two fields, with an in memory KMS.

<Tabs>




<TabItem value="Command">
<TabItem value="step-06-encrypt-interceptor.json">

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "encrypt"
  },
  "spec" : {
    "comment" : "Adding interceptor: encrypt",
    "pluginClass" : "io.conduktor.gateway.interceptor.EncryptPlugin",
    "priority" : 100,
    "config" : {
      "fields" : [ {
        "fieldName" : "password",
        "keySecretId" : "password-secret",
        "algorithm" : "AES128_GCM"
      }, {
        "fieldName" : "visa",
        "keySecretId" : "visa-secret",
        "algorithm" : "AES128_GCM"
      } ]
    }
  }
}
```
</TabItem>
```sh
curl \
    --silent \
    --request PUT 'http://localhost:8888/gateway/v2/interceptor' \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --data @step-06-encrypt-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
step-06-ADD_INTERCEPTOR-OUTPUT
```

</TabItem>
<TabItem value="Recording">

![](images/encryption-decrypt-only-specific-fields-step-06-ADD_INTERCEPTOR.gif)

</TabItem>
</Tabs>

## Listing interceptors

Listing interceptors on `gateway1`

<Tabs>




<TabItem value="Command">

```sh
curl \
    --silent \
    --request GET 'http://localhost:8888/gateway/v2/interceptor' \
    --user 'admin:conduktor' | jq
```


</TabItem>
<TabItem value="Output">

```json
step-07-LIST_INTERCEPTORS-OUTPUT
```

</TabItem>
<TabItem value="Recording">

![](images/encryption-decrypt-only-specific-fields-step-07-LIST_INTERCEPTORS.gif)

</TabItem>
</Tabs>

## Let's send unencrypted json

We are using regular kafka tools

<Tabs>



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
  "visa" : "#888999XZ;",
  "address" : "Dubai, UAE"
}
```
with


<TabItem value="Command">

```sh
echo '{"name":"tom","username":"tom@conduktor.io","password":"motorhead","visa":"#abc123","address":"Chancery lane, London"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic customers

echo '{"name":"laura","username":"laura@conduktor.io","password":"kitesurf","visa":"#888999XZ;","address":"Dubai, UAE"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic customers
```


</TabItem>
<TabItem value="Output">

```
step-08-PRODUCE-OUTPUT
```

</TabItem>
<TabItem value="Recording">

![](images/encryption-decrypt-only-specific-fields-step-08-PRODUCE.gif)

</TabItem>
</Tabs>

## Let's consume the message, and confirm tom and laura data is encrypted

Let's consume the message, and confirm tom and laura data is encrypted in cluster `gateway1`

<Tabs>




<TabItem value="Command">

```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic customers \
    --from-beginning \
    --max-messages 3 \
    --timeout-ms 3000 | jq
```


returns 2 events
```json
{
  "name" : "tom",
  "username" : "tom@conduktor.io",
  "password" : "AAAABQAAAAEAAAAzAZmFpo5IA2PAC7aM/+HDusVd2Zkat0h1Mc5hXEV6xb/uqBKhcyw8yLP3EXeLnuvr+ZObdoeKS2cP/hgpmCksh51USbSS+6XkUohHYUX6Bxp5VwXyuScBdW1nyAAXF2U=",
  "visa" : "AAAABQAAAAEAAAAzAXm64xREBJrq6/yu4emfrrKPunvUm+uyYBH/+KhQY/p9lgBm45UVn73x0ZB4g4q5N8Vmlbi5vedRhl3odoz37JYInSGBwrAd54kkkjTmwGuCyA0/i4zMwbJVWcix",
  "address" : "Chancery lane, London"
}
{
  "name" : "laura",
  "username" : "laura@conduktor.io",
  "password" : "AAAABQAAAAEAAAAzAZmFpo5IA2PAC7aM/+HDusVd2Zkat0h1Mc5hXEV6xb/uqBKhcyw8yLP3EXeLnuvr+ZObK2ZaVsJkVdqNt+HqBgaiOewbRlAoMWJVNlt99Rt2Y+sPUbjCgrvhR4I6Vg==",
  "visa" : "AAAABQAAAAEAAAAzAXm64xREBJrq6/yu4emfrrKPunvUm+uyYBH/+KhQY/p9lgBm45UVn73x0ZB4g4q5N8VmpZp3Ate0IMe9dKPvm8mMnOxDyDic41vi6Z0qyRIP0kJkSoRFb4Gy6zgHH+/j",
  "address" : "Dubai, UAE"
}
```

</TabItem>
<TabItem value="Output">

```json
step-09-CONSUME-OUTPUT
```

</TabItem>
<TabItem value="Recording">

![](images/encryption-decrypt-only-specific-fields-step-09-CONSUME.gif)

</TabItem>
</Tabs>

## Adding interceptor decrypt

Let's add the decrypt interceptor to decipher messages, but decrypt only a visa

<Tabs>




<TabItem value="Command">
<TabItem value="step-10-decrypt-interceptor.json">

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "decrypt"
  },
  "spec" : {
    "comment" : "Adding interceptor: decrypt",
    "pluginClass" : "io.conduktor.gateway.interceptor.DecryptPlugin",
    "priority" : 100,
    "config" : {
      "topic" : "customers",
      "kmsConfig" : {
        "vault" : {
          "uri" : "http://vault:8200",
          "token" : "vault-plaintext-root-token",
          "version" : 1
        }
      },
      "fields" : [ "visa" ]
    }
  }
}
```
</TabItem>
```sh
curl \
    --silent \
    --request PUT 'http://localhost:8888/gateway/v2/interceptor' \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --data @step-10-decrypt-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
step-10-ADD_INTERCEPTOR-OUTPUT
```

</TabItem>
<TabItem value="Recording">

![](images/encryption-decrypt-only-specific-fields-step-10-ADD_INTERCEPTOR.gif)

</TabItem>
</Tabs>

## Listing interceptors

Listing interceptors on `gateway1`

<Tabs>




<TabItem value="Command">

```sh
curl \
    --silent \
    --request GET 'http://localhost:8888/gateway/v2/interceptor' \
    --user 'admin:conduktor' | jq
```


</TabItem>
<TabItem value="Output">

```json
step-11-LIST_INTERCEPTORS-OUTPUT
```

</TabItem>
<TabItem value="Recording">

![](images/encryption-decrypt-only-specific-fields-step-11-LIST_INTERCEPTORS.gif)

</TabItem>
</Tabs>

## Confirm message from tom and laura are partially decrypted

Confirm message from tom and laura are partially decrypted in cluster `gateway1`

<Tabs>




<TabItem value="Command">

```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic customers \
    --from-beginning \
    --max-messages 3 \
    --timeout-ms 3000 | jq
```


returns 2 events
```json
{
  "name" : "tom",
  "username" : "tom@conduktor.io",
  "password" : "AAAABQAAAAEAAAAzAZmFpo5IA2PAC7aM/+HDusVd2Zkat0h1Mc5hXEV6xb/uqBKhcyw8yLP3EXeLnuvr+ZObdoeKS2cP/hgpmCksh51USbSS+6XkUohHYUX6Bxp5VwXyuScBdW1nyAAXF2U=",
  "visa" : "#abc123",
  "address" : "Chancery lane, London"
}
{
  "name" : "laura",
  "username" : "laura@conduktor.io",
  "password" : "AAAABQAAAAEAAAAzAZmFpo5IA2PAC7aM/+HDusVd2Zkat0h1Mc5hXEV6xb/uqBKhcyw8yLP3EXeLnuvr+ZObK2ZaVsJkVdqNt+HqBgaiOewbRlAoMWJVNlt99Rt2Y+sPUbjCgrvhR4I6Vg==",
  "visa" : "#888999XZ;",
  "address" : "Dubai, UAE"
}
```

</TabItem>
<TabItem value="Output">

```json
step-12-CONSUME-OUTPUT
```

</TabItem>
<TabItem value="Recording">

![](images/encryption-decrypt-only-specific-fields-step-12-CONSUME.gif)

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
step-13-DOCKER-OUTPUT
```

</TabItem>
<TabItem value="Recording">

![](images/encryption-decrypt-only-specific-fields-step-13-DOCKER.gif)

</TabItem>
</Tabs>

# Conclusion

Yes, encryption in the Kafka world can be simple!

