---
title: Oauth
description: Oauth
tag: security
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# What is OAuth

You can be using OAuth instead of SASL_SSL

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689985.svg)](https://asciinema.org/a/689985)

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
* keycloack
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
      GATEWAY_SECURITY_PROTOCOL: SASL_PLAINTEXT
      GATEWAY_FEATURE_FLAGS_ANALYTICS: false
      GATEWAY_OAUTH_JWKS_URL: http://keycloak:18080/realms/conduktor/protocol/openid-connect/certs
      GATEWAY_OAUTH_EXPECTED_ISSUER: http://keycloak:18080/realms/conduktor
      JAVA_TOOL_OPTIONS: -Dorg.apache.kafka.sasl.oauthbearer.allowed.urls=http://keycloak:18080/realms/conduktor/protocol/openid-connect/certs
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
      GATEWAY_SECURITY_PROTOCOL: SASL_PLAINTEXT
      GATEWAY_FEATURE_FLAGS_ANALYTICS: false
      GATEWAY_OAUTH_JWKS_URL: http://keycloak:18080/realms/conduktor/protocol/openid-connect/certs
      GATEWAY_OAUTH_EXPECTED_ISSUER: http://keycloak:18080/realms/conduktor
      JAVA_TOOL_OPTIONS: -Dorg.apache.kafka.sasl.oauthbearer.allowed.urls=http://keycloak:18080/realms/conduktor/protocol/openid-connect/certs
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
  keycloack:
    image: quay.io/keycloak/keycloak:22.0
    hostname: keycloak
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    container_name: keycloak
    volumes:
    - type: bind
      source: conduktor-realm.json
      target: /opt/keycloak/data/import/realm.json
      read_only: true
    ports:
    - 18080:18080
    command:
    - start-dev
    - --http-port 18080
    - --hostname=keycloak
    - --metrics-enabled=true
    - --health-enabled=true
    - --import-realm
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
 Network oauth_default  Creating
 Network oauth_default  Created
 Container kafka3  Creating
 Container kafka2  Creating
 Container kafka-client  Creating
 Container keycloak  Creating
 Container kafka1  Creating
 Container kafka-client  Created
 Container kafka3  Created
 Container kafka1  Created
 Container keycloak  Created
 Container kafka2  Created
 Container gateway2  Creating
 Container schema-registry  Creating
 Container gateway1  Creating
 Container gateway2  Created
 Container gateway1  Created
 Container schema-registry  Created
 Container kafka3  Starting
 Container kafka2  Starting
 Container kafka-client  Starting
 Container keycloak  Starting
 Container kafka1  Starting
 Container keycloak  Started
 Container kafka2  Started
 Container kafka3  Started
 Container kafka1  Started
 Container kafka-client  Started
 Container kafka1  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka3  Waiting
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container schema-registry  Starting
 Container gateway1  Starting
 Container gateway2  Starting
 Container gateway1  Started
 Container schema-registry  Started
 Container gateway2  Started
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container keycloak  Waiting
 Container kafka3  Healthy
 Container kafka-client  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container keycloak  Healthy
 Container schema-registry  Healthy
 Container gateway2  Healthy
container gateway1 exited (96)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689981.svg)](https://asciinema.org/a/689981)

</TabItem>
</Tabs>

## Review the kafka properties to connect using OAuth

Review the kafka properties to connect using OAuth

<Tabs>
<TabItem value="Command">

```sh
cat user-1.properties
```

</TabItem>
<TabItem value="File Content">

```properties
sasl.mechanism=OAUTHBEARER
sasl.login.callback.handler.class=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler
sasl.oauthbearer.token.endpoint.url=http://localhost:18080/realms/conduktor/protocol/openid-connect/token
sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required clientId="m2m" clientSecret="m2m" scope="email gateway";
security.protocol=SASL_PLAINTEXT
```
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
    --command-config user-1.properties \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic cars
```


</TabItem>
<TabItem value="Output">

```
[2024-11-11 02:28:28,685] WARN [Principal=:f3e0ecec-42d0-455e-88aa-5db45560c160]: Expiring credential expires at Mon Nov 11 02:29:27 GMT 2024, so buffer times of 60 and 300 seconds at the front and back, respectively, cannot be accommodated.  We will refresh at Mon Nov 11 02:29:17 GMT 2024. (org.apache.kafka.common.security.oauthbearer.internals.expiring.ExpiringCredentialRefreshingLogin)
[2024-11-11 02:28:29,276] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:28:29,407] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:28:29,530] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:28:30,032] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:28:30,550] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:28:31,450] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:28:32,554] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:28:33,582] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:28:35,044] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:28:36,391] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:28:37,452] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:28:38,603] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:28:39,728] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
Error while executing topic command : Timed out waiting for a node assignment. Call: createTopics
[2024-11-11 02:45:46,633] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:45:46,662] ERROR org.apache.kafka.common.errors.TimeoutException: Timed out waiting for a node assignment. Call: createTopics
 (org.apache.kafka.tools.TopicCommand)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689982.svg)](https://asciinema.org/a/689982)

</TabItem>
</Tabs>

## Listing topics in gateway1








<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config user-1.properties \
    --list
```


</TabItem>
<TabItem value="Output">

```
[2024-11-11 02:45:52,704] ERROR [Principal=:f3e0ecec-42d0-455e-88aa-5db45560c160]: Current clock: Mon Nov 11 02:45:52 GMT 2024 is later than expiry Mon Nov 11 02:29:48 GMT 2024. This may indicate a clock skew problem. Check that this host's and remote host's clocks are in sync. Not starting refresh thread. This process is likely unable to authenticate SASL connections (for example, it is unlikely to be able to authenticate a connection with a Kafka Broker). (org.apache.kafka.common.security.oauthbearer.internals.expiring.ExpiringCredentialRefreshingLogin)
[2024-11-11 02:45:52,824] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:45:52,947] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:45:53,070] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:45:53,393] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:45:53,800] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:45:54,630] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:45:55,557] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:45:56,658] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:45:57,633] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:45:58,591] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:45:59,625] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:00,550] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:01,608] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:02,592] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:03,567] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:04,598] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:05,598] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:06,665] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:07,709] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:08,803] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:09,780] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:10,728] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:11,787] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:12,633] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:13,772] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:14,719] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:15,784] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:16,851] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:17,943] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:18,911] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:20,114] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:21,347] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:22,248] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:23,340] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:24,494] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:25,561] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:26,593] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:27,692] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:29,008] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:30,136] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:31,240] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:32,163] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:33,187] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:34,296] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:35,414] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:36,469] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:37,517] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:38,578] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:39,502] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:40,528] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:41,554] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:42,577] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:43,501] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:44,588] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:45,626] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:46,722] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:47,635] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:48,769] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:49,728] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:50,786] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:51,664] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-11-11 02:46:52,745] WARN [AdminClient clientId=adminclient-1] Connection to node -1 (localhost/127.0.0.1:6969) could not be established. Node may not be available. (org.apache.kafka.clients.NetworkClient)
Error while executing topic command : Timed out waiting for a node assignment. Call: listTopics
[2024-11-11 02:46:52,851] ERROR org.apache.kafka.common.errors.TimeoutException: Timed out waiting for a node assignment. Call: listTopics
 (org.apache.kafka.tools.TopicCommand)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689983.svg)](https://asciinema.org/a/689983)

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
 Container keycloak  Stopping
 Container gateway1  Stopping
 Container gateway2  Stopping
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway1  Removed
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway2  Removed
 Container keycloak  Stopped
 Container keycloak  Removing
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container schema-registry  Removed
 Container keycloak  Removed
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka1  Stopped
 Container kafka3  Stopped
 Container kafka1  Removing
 Container kafka3  Removing
 Container kafka3  Removed
 Container kafka1  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Network oauth_default  Removing
 Network oauth_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689984.svg)](https://asciinema.org/a/689984)

</TabItem>
</Tabs>

# Conclusion

OAuth is your next security protocol!

