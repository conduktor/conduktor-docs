---
title: Encryption using Vault and Secret Management
description: Encryption using Vault and Secret Management
tag: encryption
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# A full field level with Vault and secret management



## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/NqSBg1jaHnvytiUrH7WL0ktEh.svg)](https://asciinema.org/a/NqSBg1jaHnvytiUrH7WL0ktEh)

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
      VAULT_TOKEN: vault-plaintext-root-token
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
      VAULT_TOKEN: vault-plaintext-root-token
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
 Network encryption-vault-with-secret-management_default  Creating
 Network encryption-vault-with-secret-management_default  Created
 Container vault  Creating
 Container kafka2  Creating
 Container kafka-client  Creating
 Container kafka1  Creating
 Container kafka3  Creating
 Container vault  Created
 Container kafka3  Created
 Container kafka-client  Created
 Container kafka2  Created
 Container kafka1  Created
 Container gateway1  Creating
 Container schema-registry  Creating
 Container gateway2  Creating
 Container schema-registry  Created
 Container gateway1  Created
 Container gateway2  Created
 Container kafka3  Starting
 Container kafka1  Starting
 Container kafka-client  Starting
 Container vault  Starting
 Container kafka2  Starting
 Container kafka1  Started
 Container vault  Started
 Container kafka3  Started
 Container kafka-client  Started
 Container kafka2  Started
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container gateway1  Starting
 Container schema-registry  Starting
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container gateway2  Starting
 Container schema-registry  Started
 Container gateway1  Started
 Container gateway2  Started
 Container kafka-client  Waiting
 Container vault  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container vault  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka-client  Healthy
 Container gateway1  Healthy
 Container schema-registry  Healthy
 Container gateway2  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/fah8CO13Z8pHHaSMTyuZRaxnk.svg)](https://asciinema.org/a/fah8CO13Z8pHHaSMTyuZRaxnk)

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
Created topic customers.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/keYThbDg9cqOSikwbOQrzfokl.svg)](https://asciinema.org/a/keYThbDg9cqOSikwbOQrzfokl)

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
customers

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/eNFsK5l2SV0ZooWuvAcMZIfLT.svg)](https://asciinema.org/a/eNFsK5l2SV0ZooWuvAcMZIfLT)

</TabItem>
</Tabs>

## Adding interceptor crypto-shredding-encrypt

Let's ask gateway to encrypt messages using vault and secret management.
The vault token is retrieved from your env variable `${VAULT_TOKEN}`.




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
      "topic" : "customers",
      "kmsConfig" : {
        "vault" : {
          "uri" : "http://vault:8200",
          "token" : "${VAULT_TOKEN}",
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
        "topic": "customers",
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "${VAULT_TOKEN}",
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

[![asciicast](https://asciinema.org/a/czz9oj30m3uUxTLf2r7HfonkL.svg)](https://asciinema.org/a/czz9oj30m3uUxTLf2r7HfonkL)

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
        "topic": "customers",
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "${VAULT_TOKEN}",
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

[![asciicast](https://asciinema.org/a/5BC6uAetcYmkEWmuNTTpSeMBE.svg)](https://asciinema.org/a/5BC6uAetcYmkEWmuNTTpSeMBE)

</TabItem>
</Tabs>

## Let's produce sample data for tom and laura

Producing 2 messages in `customers` in cluster `gateway1`




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
        --topic customers

echo '{"name":"tom","username":"tom@conduktor.io","password":"motorhead","visa":"#abc123","address":"Chancery lane, London"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic customers
```


</TabItem>
<TabItem value="Output">

```

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/sOOhZTyXDvQq0uFZz7eJQeC3j.svg)](https://asciinema.org/a/sOOhZTyXDvQq0uFZz7eJQeC3j)

</TabItem>
</Tabs>

## Let's consume the message, and confirm tom and laura are encrypted

Let's consume the message, and confirm tom and laura are encrypted in cluster `gateway1`






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
  "name" : "laura",
  "username" : "laura@conduktor.io",
  "password" : "AAAABQAAAAEAAABJdmF1bHQ6djE6WWh1Sy9mVWFZN0U5YUQ0UENUTFErSlZZS0VVUm9HVjVQdWJWRjFqeksvSkhCOC9FQWczY01hSDF6L3Q0S1E9PZhV/URNZZs21Dtj4otO2gVQMFRm6mjpJztnFWbOC6KqSTFuiMcoh8wp8P4=",
  "visa" : "AAAABQAAAAEAAABJdmF1bHQ6djE6WWh1Sy9mVWFZN0U5YUQ0UENUTFErSlZZS0VVUm9HVjVQdWJWRjFqeksvSkhCOC9FQWczY01hSDF6L3Q0S1E9PVaHQq+b/OzbABGmdll1yI+eMbw9mZoHi2LU4baYcfd27Svoe6BNobfyB2rJ",
  "address" : "Dubai, UAE"
}
{
  "name" : "tom",
  "username" : "tom@conduktor.io",
  "password" : "AAAABQAAAAEAAABJdmF1bHQ6djE6YWM3d3k5Z1Z6SG5FMmVrTDNSRFl6Q3ZYejlKODZsaC9kWndlSFJYb2JkOVhlV3dKbC95M3N0b3NJMC9iZ0E9PUYnTIXyqL3N/JTW7j1Cvv/ykNGVI4tGgJqvPQGj60tewBwWdvcraX8OF6HT",
  "visa" : "AAAABQAAAAEAAABJdmF1bHQ6djE6YWM3d3k5Z1Z6SG5FMmVrTDNSRFl6Q3ZYejlKODZsaC9kWndlSFJYb2JkOVhlV3dKbC95M3N0b3NJMC9iZ0E9PWMcy2fZLq9Hat+Sxt7sJePENRWGc749hoaeDRw30szpTQfrEtzRZW5LCQ==",
  "address" : "Chancery lane, London"
}
```

</TabItem>
<TabItem value="Output">

```json
[2024-10-29 21:09:45,080] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages
{
  "name": "laura",
  "username": "laura@conduktor.io",
  "password": "AAAABQAAAAEAAABJdmF1bHQ6djE6T3B0dVB1aUw4WllDaGVpMGZHRWpBaTNXam1MZ3B0SzdDM2xQQjJ1d2QrdGs4R005cURlNm16dzgybk1MN0E9PeNC0urxFeBDwwyqdjKps0usbgaY5YC/aMtADm21DR2zscg1/zWO+0y/Qoc=",
  "visa": "AAAABQAAAAEAAABJdmF1bHQ6djE6T3B0dVB1aUw4WllDaGVpMGZHRWpBaTNXam1MZ3B0SzdDM2xQQjJ1d2QrdGs4R005cURlNm16dzgybk1MN0E9PWUyUUnGD3ZielobgfmeCSBZp9fKDbx4fQknf/BQD9UylupJSXIDl453xu15",
  "address": "Dubai, UAE"
}
{
  "name": "tom",
  "username": "tom@conduktor.io",
  "password": "AAAABQAAAAEAAABJdmF1bHQ6djE6V0tOV1htcG9vVzJ3eEY2c2I1WFNhenUyKzNDSmZIM2hkMjBNVFVHWFIzMjVOQ3MrMndDbHBIemQ2MnQ2TXc9PYEBQjx3D6GY0cATZlydDqnjbbD9ruX36Q6dGblLhVKYcweQsjwM86s3vjXD",
  "visa": "AAAABQAAAAEAAABJdmF1bHQ6djE6V0tOV1htcG9vVzJ3eEY2c2I1WFNhenUyKzNDSmZIM2hkMjBNVFVHWFIzMjVOQ3MrMndDbHBIemQ2MnQ2TXc9PY/sNGGbrV91RuuMVBaJeRWfmboymp0iUXa9oflXw9CJc44YUqS9rqWhXw==",
  "address": "Chancery lane, London"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/RUPirKmiWbgaHCHBK9d68uftX.svg)](https://asciinema.org/a/RUPirKmiWbgaHCHBK9d68uftX)

</TabItem>
</Tabs>

## Adding interceptor crypto-shredding-decrypt

Let's add the decrypt interceptor to decipher messages.
The vault token is retrieved from your env variable `${VAULT_TOKEN}`.




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
      "topic" : "customers",
      "kmsConfig" : {
        "vault" : {
          "uri" : "http://vault:8200",
          "token" : "${VAULT_TOKEN}",
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
        "topic": "customers",
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "${VAULT_TOKEN}",
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

[![asciicast](https://asciinema.org/a/Ez6XBUsyxzKCnMKLaxPus5hQx.svg)](https://asciinema.org/a/Ez6XBUsyxzKCnMKLaxPus5hQx)

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
        "topic": "customers",
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "${VAULT_TOKEN}",
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
        "topic": "customers",
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "${VAULT_TOKEN}",
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

[![asciicast](https://asciinema.org/a/D9g32W8o5min9CIbfCKx3CtVd.svg)](https://asciinema.org/a/D9g32W8o5min9CIbfCKx3CtVd)

</TabItem>
</Tabs>

## Confirm message from tom and laura are encrypted

Confirm message from tom and laura are encrypted in cluster `gateway1`






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
[2024-10-29 21:09:51,392] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
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

[![asciicast](https://asciinema.org/a/IWBs4fKJwKdf9idPk0p2bZNCg.svg)](https://asciinema.org/a/IWBs4fKJwKdf9idPk0p2bZNCg)

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
 Container schema-registry  Stopping
 Container gateway1  Stopping
 Container gateway2  Stopping
 Container vault  Stopped
 Container vault  Removing
 Container vault  Removed
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
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Network encryption-vault-with-secret-management_default  Removing
 Network encryption-vault-with-secret-management_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/SG993tkl4wVTYS7pl8dBO5Nkm.svg)](https://asciinema.org/a/SG993tkl4wVTYS7pl8dBO5Nkm)

</TabItem>
</Tabs>

# Conclusion

Crypto shredding help you protect your most precious information

