---
title: mTLS
description: mTLS
tag: security
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# mTLS

When passwords are not enough, you can rely on TLS client certificate
But certificates do not host vcluster information, so let's map manually CN to vclusters.

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690011.svg)](https://asciinema.org/a/690011)

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
      GATEWAY_SECURITY_PROTOCOL: SSL
      GATEWAY_FEATURE_FLAGS_ANALYTICS: false
      GATEWAY_SSL_KEY_STORE_PATH: /config/keystore.jks
      GATEWAY_SSL_KEY_STORE_PASSWORD: 123456
      GATEWAY_SSL_KEY_PASSWORD: 123456
      GATEWAY_SSL_KEY_TYPE: pkcs12
      GATEWAY_SSL_TRUST_STORE_PATH: /config/truststore.jks
      GATEWAY_SSL_TRUST_STORE_PASSWORD: 123456
      GATEWAY_SSL_TRUST_STORE_TYPE: pkcs12
      GATEWAY_SSL_CLIENT_AUTH: REQUIRE
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
    volumes:
    - type: bind
      source: .
      target: /config
      read_only: true
  gateway2:
    image: conduktor/conduktor-gateway:3.3.2
    hostname: gateway2
    container_name: gateway2
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:29092,kafka2:29092,kafka3:29092
      GATEWAY_ADVERTISED_HOST: localhost
      GATEWAY_SECURITY_PROTOCOL: SSL
      GATEWAY_FEATURE_FLAGS_ANALYTICS: false
      GATEWAY_SSL_KEY_STORE_PATH: /config/keystore.jks
      GATEWAY_SSL_KEY_STORE_PASSWORD: 123456
      GATEWAY_SSL_KEY_PASSWORD: 123456
      GATEWAY_SSL_KEY_TYPE: jks
      GATEWAY_SSL_TRUST_STORE_PATH: /config/truststore.jks
      GATEWAY_SSL_TRUST_STORE_PASSWORD: 123456
      GATEWAY_SSL_TRUST_STORE_TYPE: jks
      GATEWAY_SSL_CLIENT_AUTH: REQUIRE
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
    volumes:
    - type: bind
      source: .
      target: /config
      read_only: true
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

## Generate self-signed ssl certificates








<Tabs>

<TabItem value="Command">
```sh

pwd > /tmp/ici
pwd 
rm -f *jks *key *p12 *crt

openssl req \
  -x509 \
  -newkey rsa:4096 \
  -sha256 \
  -days 3560 \
  -nodes \
  -keyout san.key \
  -out san.crt \
  -subj '/CN=username' \
  -extensions san \
  -config openssl.config

openssl pkcs12 \
  -export \
  -in san.crt \
  -inkey san.key \
  -name brokers \
  -out san.p12 \
  -password "pass:123456"

keytool \
  -noprompt \
  -alias brokers \
  -importkeystore \
  -deststorepass 123456 \
  -destkeystore keystore.jks \
  -srckeystore san.p12 \
  -srcstoretype PKCS12 \
  -srcstorepass 123456

keytool \
  -noprompt \
  -import \
  -alias brokers \
  -file san.crt \
  -keypass 123456 \
  -destkeystore truststore.jks \
  -storepass 123456

echo """
bootstrap.servers=localhost:6969
security.protocol=SSL
ssl.truststore.location=$PWD/truststore.jks
ssl.truststore.password=123456
ssl.keystore.location=$PWD/keystore.jks
ssl.keystore.password=123456
""" > client.config      
```


</TabItem>
<TabItem value="Output">

```
/Users/jameswhite/Documents/Proxy/conduktor-proxy-1/functional-testing/target/2024.11.16-19:24:02/ssl
.....+.+......+..+......+++++++++++++++++++++++++++++++++++++++++++++*..+.........+.........+.............+..+.......+++++++++++++++++++++++++++++++++++++++++++++*..+..................+.....+.......+..+.+....................+...+.+.........+..+.........+.........+.+.....+.............+.....+..........+...........+....+........+.........+....+.....+.+......+.....+...+.+...+.....+.+.....+.........+.+.....+.......+........+.+.....+.............+......+..+.............+..+....+......+............+...........+.......+..+.+.....+....+........+.............+..+.........+.............+............+......+...+..+...+.+.........+............+.....+...+....+.....+...+..........+...+..+.......+..+...................+.....+....+.....+......+.+...+..+.+.........+++++
.+..+...+....+......+............+..+......+...+....+...+.....+....+...+.....+......+.......+..+......+.+...+..+....+......+.....+...+.+......+........+...+....+.........+..+...+............+............+......+....+...........+......+.+...............+.........+.....+.+..+............+.........+.........+...+....+........+.+......+...+......+++++++++++++++++++++++++++++++++++++++++++++*..+....+...+...........+.+.....+...+..................+...+....+...+++++++++++++++++++++++++++++++++++++++++++++*...+.........+..........+..+...+......+...+.+.........+..+...+......................+..............+.........+......+.....................+.+.....+.........+....+..+....+...+..+....+...............+............+..+............+.+...............+.....+...+.+.........+............+.....+.........+...+++++
-----
Importing keystore san.p12 to keystore.jks...
Certificate was added to keystore

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690005.svg)](https://asciinema.org/a/690005)

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
 Network ssl_default  Creating
 Network ssl_default  Created
 Container kafka3  Creating
 Container kafka2  Creating
 Container kafka-client  Creating
 Container kafka1  Creating
 Container kafka1  Created
 Container kafka3  Created
 Container kafka-client  Created
 Container kafka2  Created
 Container gateway1  Creating
 Container gateway2  Creating
 Container schema-registry  Creating
 Container schema-registry  Created
 Container gateway1  Created
 Container gateway2  Created
 Container kafka-client  Starting
 Container kafka2  Starting
 Container kafka3  Starting
 Container kafka1  Starting
 Container kafka2  Started
 Container kafka1  Started
 Container kafka3  Started
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka-client  Started
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container schema-registry  Starting
 Container kafka3  Healthy
 Container gateway1  Starting
 Container kafka3  Healthy
 Container gateway2  Starting
 Container schema-registry  Started
 Container gateway2  Started
 Container gateway1  Started
 Container kafka-client  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka-client  Healthy
 Container gateway2  Healthy
 Container schema-registry  Healthy
 Container gateway1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690006.svg)](https://asciinema.org/a/690006)

</TabItem>
</Tabs>

## Creating topic foo on gateway1

Creating on `gateway1`:

* Topic `foo` with partitions:10 and replication-factor:1






<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config client.config \
    --replication-factor 1 \
    --partitions 10 \
    --create --if-not-exists \
    --topic foo
```


</TabItem>
<TabItem value="Output">

```
Created topic foo.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690007.svg)](https://asciinema.org/a/690007)

</TabItem>
</Tabs>

## Listing topics in gateway1








<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config client.config \
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
foo

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690008.svg)](https://asciinema.org/a/690008)

</TabItem>
</Tabs>

## Listing topics in kafka1








<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:9092,localhost:9093,localhost:9094 \
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
foo

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690009.svg)](https://asciinema.org/a/690009)

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
 Container schema-registry  Stopping
 Container gateway1  Stopping
 Container gateway2  Stopped
 Container gateway2  Removing
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway2  Removed
 Container schema-registry  Removed
 Container gateway1  Removed
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Network ssl_default  Removing
 Network ssl_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690010.svg)](https://asciinema.org/a/690010)

</TabItem>
</Tabs>

