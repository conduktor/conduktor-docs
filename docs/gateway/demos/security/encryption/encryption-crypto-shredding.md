---
title: Encryption with Crypto Shredding
description: Encryption with Crypto Shredding
tag: encryption
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# A full field level crypto shredding walkthrough



## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690001.svg)](https://asciinema.org/a/690001)

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
* vault

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
  vault:
    image: hashicorp/vault
    healthcheck:
      test: nc -zv 0.0.0.0 8200
      interval: 5s
      retries: 25
    hostname: vault
    environment:
      VAULT_ADDR: http://0.0.0.0:8200
      VAULT_DEV_ROOT_TOKEN_ID: vault-plaintext-root-token
    container_name: vault
    ports:
    - 8200:8200
    command:
    - sh
    - -c
    - (while ! nc -z 127.0.0.1 8200; do sleep 1; echo 'waiting for vault service ...';
      done; export VAULT_ADDR='http://0.0.0.0:8200';vault secrets enable transit;
      vault secrets enable -version=1 kv; vault secrets enable totp ) & vault server
      -dev -dev-listen-address=0.0.0.0:8200
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
 Network encryption-crypto-shredding_default  Creating
 Network encryption-crypto-shredding_default  Created
 Container kafka-client  Creating
 Container kafka2  Creating
 Container kafka3  Creating
 Container vault  Creating
 Container kafka1  Creating
 Container kafka1  Created
 Container vault  Created
 Container kafka2  Created
 Container kafka-client  Created
 Container kafka3  Created
 Container gateway1  Creating
 Container schema-registry  Creating
 Container gateway2  Creating
 Container gateway1  Created
 Container schema-registry  Created
 Container gateway2  Created
 Container kafka3  Starting
 Container vault  Starting
 Container kafka1  Starting
 Container kafka2  Starting
 Container kafka-client  Starting
 Container kafka3  Started
 Container kafka1  Started
 Container vault  Started
 Container kafka2  Started
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka-client  Started
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container gateway2  Starting
 Container kafka2  Healthy
 Container gateway1  Starting
 Container kafka1  Healthy
 Container schema-registry  Starting
 Container schema-registry  Started
 Container gateway2  Started
 Container gateway1  Started
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container vault  Waiting
 Container kafka1  Waiting
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka-client  Healthy
 Container vault  Healthy
 Container gateway1  Healthy
 Container gateway2  Healthy
 Container schema-registry  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689987.svg)](https://asciinema.org/a/689987)

</TabItem>
</Tabs>

## Creating topic customers-shredding on gateway1

Creating on `gateway1`:

* Topic `customers-shredding` with partitions:1 and replication-factor:1






<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic customers-shredding
```


</TabItem>
<TabItem value="Output">

```
Created topic customers-shredding.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689988.svg)](https://asciinema.org/a/689988)

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
_confluent-telemetry-metrics
_schemas
customers-shredding

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689989.svg)](https://asciinema.org/a/689989)

</TabItem>
</Tabs>

## Adding interceptor crypto-shredding-encrypt

Let's ask gateway to encrypt messages using vault and dynamic keys




`step-07-crypto-shredding-encrypt-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "crypto-shredding-encrypt"
  },
  "spec" : {
    "comment" : "Adding interceptor: crypto-shredding-encrypt",
    "pluginClass" : "io.conduktor.gateway.interceptor.EncryptPlugin",
    "priority" : 100,
    "config" : {
      "topic" : "customers-shredding",
      "kmsConfig" : {
        "vault" : {
          "uri" : "http://vault:8200",
          "token" : "vault-plaintext-root-token",
          "version" : 1
        }
      },
      "fields" : [ {
        "fieldName" : "password",
        "keySecretId" : "vault-kms://vault:8200/transit/keys/secret-for-{{record.value.name}}",
        "algorithm" : "AES128_GCM"
      }, {
        "fieldName" : "visa",
        "keySecretId" : "vault-kms://vault:8200/transit/keys/secret-for-{{record.value.name}}",
        "algorithm" : "AES128_GCM"
      } ]
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
    --data @step-07-crypto-shredding-encrypt-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "crypto-shredding-encrypt",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: crypto-shredding-encrypt",
      "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
      "priority": 100,
      "config": {
        "topic": "customers-shredding",
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "vault-plaintext-root-token",
            "version": 1
          }
        },
        "fields": [
          {
            "fieldName": "password",
            "keySecretId": "vault-kms://vault:8200/transit/keys/secret-for-{{record.value.name}}",
            "algorithm": "AES128_GCM"
          },
          {
            "fieldName": "visa",
            "keySecretId": "vault-kms://vault:8200/transit/keys/secret-for-{{record.value.name}}",
            "algorithm": "AES128_GCM"
          }
        ]
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689990.svg)](https://asciinema.org/a/689990)

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
      "name": "crypto-shredding-encrypt",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: crypto-shredding-encrypt",
      "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
      "priority": 100,
      "config": {
        "topic": "customers-shredding",
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "vault-plaintext-root-token",
            "version": 1
          }
        },
        "fields": [
          {
            "fieldName": "password",
            "keySecretId": "vault-kms://vault:8200/transit/keys/secret-for-{{record.value.name}}",
            "algorithm": "AES128_GCM"
          },
          {
            "fieldName": "visa",
            "keySecretId": "vault-kms://vault:8200/transit/keys/secret-for-{{record.value.name}}",
            "algorithm": "AES128_GCM"
          }
        ]
      }
    }
  }
]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689991.svg)](https://asciinema.org/a/689991)

</TabItem>
</Tabs>

## Let's produce sample data for tom and laura

Producing 2 messages in `customers-shredding` in cluster `gateway1`




Sending 2 events
```json
{
  "name" : "laura",
  "username" : "laura@conduktor.io",
  "password" : "kitesurf",
  "visa" : "#888999XZ",
  "address" : "Dubai, UAE"
}
{
  "name" : "tom",
  "username" : "tom@conduktor.io",
  "password" : "motorhead",
  "visa" : "#abc123",
  "address" : "Chancery lane, London"
}
```



<Tabs>

<TabItem value="Command">
```sh
echo '{"name":"laura","username":"laura@conduktor.io","password":"kitesurf","visa":"#888999XZ","address":"Dubai, UAE"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic customers-shredding

echo '{"name":"tom","username":"tom@conduktor.io","password":"motorhead","visa":"#abc123","address":"Chancery lane, London"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic customers-shredding
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689992.svg)](https://asciinema.org/a/689992)

</TabItem>
</Tabs>

## Let's consume the message, and confirm tom and laura are encrypted

Let's consume the message, and confirm tom and laura are encrypted in cluster `gateway1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic customers-shredding \
    --from-beginning \
    --max-messages 3 \
    --timeout-ms 3000 | jq
```


returns 2 events
```json
{
  "name" : "laura",
  "username" : "laura@conduktor.io",
  "password" : "AAAABQAAAAEAAABJdmF1bHQ6djE6a29zcVRKWm5vNlJrd3pteFBnaENjaTdiNE05RHA4UExad3RIaG5SMUlvcEdmSHNWYTVXUGJQNnpyWmg1WFE9PTT+lvH6WRwOhbSK1zuXemP/zgru12rku7Tfl5gIKOwQAWa8nBV9P1BVJiE=",
  "visa" : "AAAABQAAAAEAAABJdmF1bHQ6djE6a29zcVRKWm5vNlJrd3pteFBnaENjaTdiNE05RHA4UExad3RIaG5SMUlvcEdmSHNWYTVXUGJQNnpyWmg1WFE9Pa5usmFlb8ibw4+n70I1pT09syLa2yqOt1XSf9MC0IH7Tv+9Zq+aKfv49x7X",
  "address" : "Dubai, UAE"
}
{
  "name" : "tom",
  "username" : "tom@conduktor.io",
  "password" : "AAAABQAAAAEAAABJdmF1bHQ6djE6WmVvTkh0eTFSQVdUODdZUm5DU3doMURFRnJJMnphaHFqZ0x3ajE3Um9FUUNVNjltS2tnaUZhMTgyUG5aVFE9PWdVu2uhmxW3cq1WDs6Xd77wbB1WQt2i4Lp3qFjKLTRWE13gttjbBS9dGdhY",
  "visa" : "AAAABQAAAAEAAABJdmF1bHQ6djE6WmVvTkh0eTFSQVdUODdZUm5DU3doMURFRnJJMnphaHFqZ0x3ajE3Um9FUUNVNjltS2tnaUZhMTgyUG5aVFE9PX+m2RpInN+f7nYJ4i+QhnbKwyVZ1e/uDpZufudchZXh23vMdyg8v/CYJA==",
  "address" : "Chancery lane, London"
}
```

</TabItem>
<TabItem value="Output">

```json
[2024-11-16 18:55:46,373] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages
{
  "name": "laura",
  "username": "laura@conduktor.io",
  "password": "AAAABQAAAAEAAABJdmF1bHQ6djE6cy9sMVVTaXpveUZDajBCOFpTSHgzRWowc2lCNS9iMm9TTFJIeU1uTEFRdUdVbDQ3dmlpZXlDczhEaEVQRkE9PbJz0uIuB5xXUvDT15O8aCIX3K6m8LML2eUwORqbpA51BF+7rsMyOXY3f9g=",
  "visa": "AAAABQAAAAEAAABJdmF1bHQ6djE6cy9sMVVTaXpveUZDajBCOFpTSHgzRWowc2lCNS9iMm9TTFJIeU1uTEFRdUdVbDQ3dmlpZXlDczhEaEVQRkE9PalXTG/+i2PivrCL3DaCQWLMhS4DSsrRq8SyXChWkhmDmY+kGmrhND5sHr3c",
  "address": "Dubai, UAE"
}
{
  "name": "tom",
  "username": "tom@conduktor.io",
  "password": "AAAABQAAAAEAAABJdmF1bHQ6djE6UnBRQkwzMzRuUS9xZVNIczVJNFRJNW52a0dTb2RlNDB4QjJKMW1uK05XclhUU2xITVRUS2ZmTWNPUHduQUE9PQg3gDWX2VhiNdS0BiUm5fMouCvIIi0aR/Owyz9FX7aJJMKYw3g5VDJ2lDp6",
  "visa": "AAAABQAAAAEAAABJdmF1bHQ6djE6UnBRQkwzMzRuUS9xZVNIczVJNFRJNW52a0dTb2RlNDB4QjJKMW1uK05XclhUU2xITVRUS2ZmTWNPUHduQUE9PVGnvyHHiT398JskCUckNDNMyZDdEi0rsolJVYRUA2LcMRnrAA/jWZxshQ==",
  "address": "Chancery lane, London"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689993.svg)](https://asciinema.org/a/689993)

</TabItem>
</Tabs>

## Adding interceptor crypto-shredding-decrypt

Let's add the decrypt interceptor to decipher messages




`step-11-crypto-shredding-decrypt-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "crypto-shredding-decrypt"
  },
  "spec" : {
    "comment" : "Adding interceptor: crypto-shredding-decrypt",
    "pluginClass" : "io.conduktor.gateway.interceptor.DecryptPlugin",
    "priority" : 100,
    "config" : {
      "topic" : "customers-shredding",
      "kmsConfig" : {
        "keyTtlMs" : 200,
        "vault" : {
          "uri" : "http://vault:8200",
          "token" : "vault-plaintext-root-token",
          "version" : 1
        }
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
    --data @step-11-crypto-shredding-decrypt-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "crypto-shredding-decrypt",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: crypto-shredding-decrypt",
      "pluginClass": "io.conduktor.gateway.interceptor.DecryptPlugin",
      "priority": 100,
      "config": {
        "topic": "customers-shredding",
        "kmsConfig": {
          "keyTtlMs": 200,
          "vault": {
            "uri": "http://vault:8200",
            "token": "vault-plaintext-root-token",
            "version": 1
          }
        }
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689994.svg)](https://asciinema.org/a/689994)

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
      "name": "crypto-shredding-decrypt",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: crypto-shredding-decrypt",
      "pluginClass": "io.conduktor.gateway.interceptor.DecryptPlugin",
      "priority": 100,
      "config": {
        "topic": "customers-shredding",
        "kmsConfig": {
          "keyTtlMs": 200,
          "vault": {
            "uri": "http://vault:8200",
            "token": "vault-plaintext-root-token",
            "version": 1
          }
        }
      }
    }
  },
  {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "crypto-shredding-encrypt",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: crypto-shredding-encrypt",
      "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
      "priority": 100,
      "config": {
        "topic": "customers-shredding",
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "vault-plaintext-root-token",
            "version": 1
          }
        },
        "fields": [
          {
            "fieldName": "password",
            "keySecretId": "vault-kms://vault:8200/transit/keys/secret-for-{{record.value.name}}",
            "algorithm": "AES128_GCM"
          },
          {
            "fieldName": "visa",
            "keySecretId": "vault-kms://vault:8200/transit/keys/secret-for-{{record.value.name}}",
            "algorithm": "AES128_GCM"
          }
        ]
      }
    }
  }
]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689995.svg)](https://asciinema.org/a/689995)

</TabItem>
</Tabs>

## Confirm message from tom and laura are encrypted

Confirm message from tom and laura are encrypted in cluster `gateway1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic customers-shredding \
    --from-beginning \
    --max-messages 3 \
    --timeout-ms 3000 | jq
```


returns 2 events
```json
{
  "name" : "laura",
  "username" : "laura@conduktor.io",
  "password" : "kitesurf",
  "visa" : "#888999XZ",
  "address" : "Dubai, UAE"
}
{
  "name" : "tom",
  "username" : "tom@conduktor.io",
  "password" : "motorhead",
  "visa" : "#abc123",
  "address" : "Chancery lane, London"
}
```

</TabItem>
<TabItem value="Output">

```json
[2024-11-16 18:55:52,726] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages
{
  "name": "laura",
  "username": "laura@conduktor.io",
  "password": "kitesurf",
  "visa": "#888999XZ",
  "address": "Dubai, UAE"
}
{
  "name": "tom",
  "username": "tom@conduktor.io",
  "password": "motorhead",
  "visa": "#abc123",
  "address": "Chancery lane, London"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689996.svg)](https://asciinema.org/a/689996)

</TabItem>
</Tabs>

## Listing keys created in Vault








<Tabs>

<TabItem value="Command">
```sh
curl \
  --request GET 'http://localhost:8200/v1/transit/keys/?list=true' \
  --silent \
  --header "X-Vault-Token: vault-plaintext-root-token" | jq -r ".data.keys"
```


</TabItem>
<TabItem value="Output">

```
[
  "secret-for-laura",
  "secret-for-tom"
]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689997.svg)](https://asciinema.org/a/689997)

</TabItem>
</Tabs>

## Remove laura related keys








<Tabs>

<TabItem value="Command">
```sh
curl \
  --request POST 'http://localhost:8200/v1/transit/keys/secret-for-laura/config' \
  --silent \
  --header "X-Vault-Token: vault-plaintext-root-token" \
  --header "content-type: application/json" \
  --data-raw '{"min_decryption_version":"1","min_encryption_version":1,"deletion_allowed":true,"auto_rotate_period":0}' > /dev/null

curl \
  --request DELETE http://localhost:8200/v1/transit/keys/secret-for-laura \
  --silent \
  --header "X-Vault-Token: vault-plaintext-root-token"
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689998.svg)](https://asciinema.org/a/689998)

</TabItem>
</Tabs>

## Let's make sure laura data are no more readable!

Let's make sure laura data are no more readable! in cluster `gateway1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic customers-shredding \
    --from-beginning \
    --max-messages 3 \
    --timeout-ms 3000 | jq
```


returns 2 events
```json
{
  "name" : "laura",
  "username" : "laura@conduktor.io",
  "password" : "AAAABQAAAAEAAABJdmF1bHQ6djE6a29zcVRKWm5vNlJrd3pteFBnaENjaTdiNE05RHA4UExad3RIaG5SMUlvcEdmSHNWYTVXUGJQNnpyWmg1WFE9PTT+lvH6WRwOhbSK1zuXemP/zgru12rku7Tfl5gIKOwQAWa8nBV9P1BVJiE=",
  "visa" : "AAAABQAAAAEAAABJdmF1bHQ6djE6a29zcVRKWm5vNlJrd3pteFBnaENjaTdiNE05RHA4UExad3RIaG5SMUlvcEdmSHNWYTVXUGJQNnpyWmg1WFE9Pa5usmFlb8ibw4+n70I1pT09syLa2yqOt1XSf9MC0IH7Tv+9Zq+aKfv49x7X",
  "address" : "Dubai, UAE"
}
{
  "name" : "tom",
  "username" : "tom@conduktor.io",
  "password" : "motorhead",
  "visa" : "#abc123",
  "address" : "Chancery lane, London"
}
```

</TabItem>
<TabItem value="Output">

```json
[2024-11-16 18:55:58,638] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages
{
  "name": "laura",
  "username": "laura@conduktor.io",
  "password": "AAAABQAAAAEAAABJdmF1bHQ6djE6cy9sMVVTaXpveUZDajBCOFpTSHgzRWowc2lCNS9iMm9TTFJIeU1uTEFRdUdVbDQ3dmlpZXlDczhEaEVQRkE9PbJz0uIuB5xXUvDT15O8aCIX3K6m8LML2eUwORqbpA51BF+7rsMyOXY3f9g=",
  "visa": "AAAABQAAAAEAAABJdmF1bHQ6djE6cy9sMVVTaXpveUZDajBCOFpTSHgzRWowc2lCNS9iMm9TTFJIeU1uTEFRdUdVbDQ3dmlpZXlDczhEaEVQRkE9PalXTG/+i2PivrCL3DaCQWLMhS4DSsrRq8SyXChWkhmDmY+kGmrhND5sHr3c",
  "address": "Dubai, UAE"
}
{
  "name": "tom",
  "username": "tom@conduktor.io",
  "password": "motorhead",
  "visa": "#abc123",
  "address": "Chancery lane, London"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/689999.svg)](https://asciinema.org/a/689999)

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
 Container vault  Stopping
 Container kafka-client  Stopping
 Container gateway1  Stopping
 Container gateway2  Stopping
 Container schema-registry  Stopping
 Container vault  Stopped
 Container vault  Removing
 Container vault  Removed
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway2  Removed
 Container gateway1  Stopped
 Container gateway1  Removing
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway1  Removed
 Container schema-registry  Removed
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka3  Removed
 Container kafka1  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Network encryption-crypto-shredding_default  Removing
 Network encryption-crypto-shredding_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690000.svg)](https://asciinema.org/a/690000)

</TabItem>
</Tabs>

# Conclusion

Crypto shredding help you protect your most precious information

