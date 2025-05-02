---
sidebar_position: 1
title: Crypto shredding
description: Reduce costs and maintain compliance with centralized and secure key management
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

## Overview

:::info[**Conduktor Shield** feature]
:::

Conduktor provides a cost-efficient and scalable crypto shredding solution that works seamlessly with Kafka. Keys are centrally managed and securely stored which ensures that deleting a key instantly makes all associated data unreadable, without the complexity of self-managed vaults, expensive per-user encryption or additional infrastructure overhead.

![Conduktor's crypto shredding solution](/images/changelog/gateway/v3.7.0/crypto-shredding-concept.png)

This allows you to honor deletion requests and maintain compliance with regulations like GDPR (General Data Protection Regulation) and CCPA (California Consumer Privacy Act). This approach is also particularly valuable for organizations that need to implement crypto shredding at scale, across large user bases or high-volume data sets, offering both **substantial cost savings** and **improved performance** compared to managing individual keys directly in an external KMS such as AWS.

Conduktor's solution:

- stores only a single master key in your external KMS
- securely manages every individual **encryption key** needed in Gateway's internal key store
- allows individual **encryption keys** to be deleted when needed, rendering the associated data permanently inaccessible

### How does it work?

- Gateway is configured to encrypt a combination of the record key, the record headers and either the entire record value or individual fields from a structured document (JSON or AVRO).
- It does this using an **encryption key** derived from a property of each record (eg a field or key value that uniquely identifies the associated user)
- Gateway generates the associated **encryption keys** from a central master key provided by an external KMS (e.g. AWS KMS).
- These **encryption keys** are stored in a dedicated compacted Kafka topic. They are secure because they cannot be decrypted without the external KMS.
- Overwriting an **encryption key** in the topic makes the associated encrypted data permanently undecryptable via Gateway.

## Sample use case

This document will step through,

1. setting up a local Gateway to encrypt sensitive user data sent to a Kafka topic using the Gateway KMS
2. decrypting data read off the same Kafka topic via Gateway
3. crypto shredding keys such that associated data can no longer be decrypted by Gateway

We will configure Gateway to encrypt sensitive customer data (`password`, `visa`) using an **encryption key** derived from a unique customer identifier (`userId`). Other data (eg `name`) will be left un-encrypted. All of the data will come from the same simple json payload. For example, we might expect to see

```json
{
  "userId" : 12345678,
  "name" : "Joe Smith",
  "password" : "admin123",
  "visa" : 4111111145551142
}
```

encrypted as,

```json
{
  "userId" : 12345678,
  "name" : "Joe Smith",
  "password" : "AAAABQAAAAKNxgtetTtIBLsCuCd5LJ7kYDspZqsfUhWRY7lDlVIWF2UgALxI8WEzcXAxEjuuWFiq+Kb8K6pTA5IPeg==",
  "visa" : "AAAAAgAAAAKNxgtetTtIBLsCuCd5LJ7k5Dab7pJ9dEQtf5TjHM1ZasVGOEeYI5Vna/HyDGQTZqYT0KWAAjsoe17+F8nPbFlX5Ms7n6ryCyTPyYPLi/hKMd5JDQAJAdfg/2FRtpHui3MaUjsipuo+7gdnU7HKEd64Hi/+hH2jQxQVJOoujxg="
}
```


### 1. Setup an environment

The following docker-compose file will minimally configure Kafka, the Conduktor platform and a Vault KMS instance to work together. We will then manually configure them for our encryption use-case.

<Tabs>
<TabItem value="Start the environment" label="Start the environment">

```bash
docker compose -f docker-compose.yaml up -d
```

</TabItem>
<TabItem value="docker-compose.yaml" label="docker-compose.yaml">

```yaml title="docker-compose.yml"
services:
  zookeeper:
    image: "confluentinc/cp-zookeeper:latest"
    container_name: crypto-shredding-howto-zookeeper
    restart: always
    ports:
      - "22181:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    healthcheck:
      test: echo srvr | nc zookeeper 2181 || exit 1
      retries: 20
      interval: 10s
  kafka-1:
    image: "confluentinc/cp-kafka:latest"
    container_name: crypto-shredding-howto-kafka-1
    restart: always
    ports:
      - "19092:19092"
    environment:
      KAFKA_ZOOKEEPER_CONNECT: "zookeeper:2181"
      KAFKA_LISTENERS: "INTERNAL://kafka-1:9092,EXTERNAL://:19092"
      KAFKA_ADVERTISED_LISTENERS: "INTERNAL://kafka-1:9092,EXTERNAL://localhost:19092"
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT"
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_BROKER_ID: 1
    healthcheck:
      test: nc -zv kafka-1 9092 || exit 1
      interval: 10s
      retries: 25
      start_period: 20s
    depends_on:
      zookeeper:
        condition: service_healthy
  kafka-2:
    image: confluentinc/cp-kafka
    container_name: crypto-shredding-howto-kafka-2
    hostname: kafka-2
    ports:
      - 19093:19093
    environment:
      KAFKA_ZOOKEEPER_CONNECT: "zookeeper:2181"
      KAFKA_LISTENERS: "INTERNAL://kafka-2:9093,EXTERNAL://:19093"
      KAFKA_ADVERTISED_LISTENERS: "INTERNAL://kafka-2:9093,EXTERNAL://localhost:19093"
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT"
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_BROKER_ID: 2
    healthcheck:
      test: nc -zv kafka-2 9093 || exit 1
      interval: 10s
      retries: 25
      start_period: 20s
    depends_on:
      zookeeper:
        condition: service_healthy
  kafka-3:
    image: confluentinc/cp-kafka
    container_name: crypto-shredding-howto-kafka-3
    hostname: kafka-3
    ports:
      - 19094:19094
    environment:
      KAFKA_ZOOKEEPER_CONNECT: "zookeeper:2181"
      KAFKA_LISTENERS: "INTERNAL://kafka-3:9094,EXTERNAL://:19094"
      KAFKA_ADVERTISED_LISTENERS: "INTERNAL://kafka-3:9094,EXTERNAL://localhost:19094"
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT"
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_BROKER_ID: 3
    healthcheck:
      test: nc -zv kafka-3 9094 || exit 1
      interval: 10s
      retries: 25
      start_period: 20s
    depends_on:
      zookeeper:
        condition: service_healthy
  vault:
    image: hashicorp/vault
    container_name: crypto-shredding-howto-vault
    healthcheck:
      test: nc -zv 0.0.0.0 8200
      interval: 5s
      retries: 25
    hostname: vault
    environment:
      VAULT_ADDR: http://0.0.0.0:8200
      VAULT_DEV_ROOT_TOKEN_ID: vault-plaintext-root-token
    ports:
    - 8200:8200
    command:
    - sh
    - -c
    - (while ! nc -z 127.0.0.1 8200; do sleep 1; echo 'waiting for vault service ...';
      done; export VAULT_ADDR='http://0.0.0.0:8200';vault secrets enable transit;
      vault secrets enable -version=1 kv; vault secrets enable totp ) & vault server
      -dev -dev-listen-address=0.0.0.0:8200
  conduktor-gateway:
    image: conduktor/conduktor-gateway:3.8.1
    hostname: conduktor-gateway
    container_name: crypto-shredding-howto-conduktor-gateway
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka-1:9092,kafka-2:9093,kafka-3:9094
      JAVA_OPTS: "-XX:UseSVE=0"
      VAULT_TOKEN: vault-plaintext-root-token
    ports:
      - "8888:8888"
      - "6969:6969"
    healthcheck:
      test: curl localhost:8888/health
      interval: 5s
      retries: 25
    volumes:
    - ./driver-gateway/deploy/ssd-deployment/templates:/templates:ro
    depends_on:
      kafka-1:
        condition: service_healthy
      kafka-2:
        condition: service_healthy
      kafka-3:
        condition: service_healthy
  kafka-client:
      image: confluentinc/cp-kafka:latest
      hostname: kafka-client
      container_name: crypto-shredding-howto-kafka-client
      command: sleep infinity
  kcat:
      image: edenhill/kcat:1.7.1
      hostname: kcat
      container_name: crypto-shredding-howto-kcat
      command: sleep infinity
      entrypoint: ["sh", "-c", "tail -f /dev/null"]
  conduktor-console:
    image: conduktor/conduktor-console:1.33.0
    container_name: crypto-shredding-howto-conduktor-console
    ports:
      - "8080:8080"
    volumes:
      - conduktor_data:/var/conduktor
    environment:
      CDK_DATABASE_URL: "postgresql://conduktor:change_me@postgresql:5432/conduktor-console"
      CDK_KAFKASQL_DATABASE_URL: "postgresql://conduktor:change_me@postgresql-sql:5432/conduktor-sql"
      CDK_ORGANIZATION_NAME: "getting-started"
      CDK_CLUSTERS_0_ID: "local-kafka"
      CDK_CLUSTERS_0_NAME: "local-kafka"
      CDK_CLUSTERS_0_BOOTSTRAPSERVERS: "kafka-1:9092"
      CDK_CLUSTERS_0_COLOR: "#6A57C8"
      CDK_CLUSTERS_0_ICON: "kafka"
      CDK_CLUSTERS_1_ID: "cdk-gateway"
      CDK_CLUSTERS_1_NAME: "cdk-gateway"
      CDK_CLUSTERS_1_BOOTSTRAPSERVERS: "conduktor-gateway:6969"
      CDK_CLUSTERS_1_KAFKAFLAVOR_URL: "http://conduktor-gateway:8888"
      CDK_CLUSTERS_1_KAFKAFLAVOR_USER: "admin"
      CDK_CLUSTERS_1_KAFKAFLAVOR_PASSWORD: "conduktor"
      CDK_CLUSTERS_1_KAFKAFLAVOR_VIRTUALCLUSTER: "passthrough"
      CDK_CLUSTERS_1_KAFKAFLAVOR_TYPE: "Gateway"
      CDK_CLUSTERS_1_COLOR: "#6A57C8"
      CDK_CLUSTERS_1_ICON: "key"
      CDK_MONITORING_CORTEX-URL: http://conduktor-monitoring:9009/
      CDK_MONITORING_ALERT-MANAGER-URL: http://conduktor-monitoring:9010/
      CDK_MONITORING_CALLBACK-URL: http://conduktor-console:8080/monitoring/api/
      CDK_MONITORING_NOTIFICATIONS-CALLBACK-URL: http://localhost:8080
      CONSOLE_JAVA_OPTS: "-XX:UseSVE=0"
    depends_on:
      kafka-1:
        condition: service_healthy
      postgresql:
        condition: service_healthy
      postgresql-2:
        condition: service_healthy
  conduktor-ctl:
    image: conduktor/conduktor-ctl:v0.5.0
    container_name: conduktor-ctl
    entrypoint: sleep infinity # override entry point to keep container up
    volumes:
      - ./:/self-service
    environment:
      CDK_BASE_URL: "http://conduktor-console:8080"
      CDK_API_KEY: "" # generate me from the UI for the demo, CLI also available
  # Conduktor stores its metadata in PostgreSQL.
  # Consider using an external managed database for production usage.
  # https://docs.conduktor.io/platform/get-started/configuration/database/
  postgresql:
    image: postgres:14
    hostname: postgresql
    container_name: crypto-shredding-howto-postgresql-metadata
    volumes:
      - pg_data:/var/lib/postgresql/data
    environment:
      PGDATA: "/var/lib/postgresql/data"
      POSTGRES_DB: "conduktor-console"
      POSTGRES_USER: "conduktor"
      POSTGRES_PASSWORD: "change_me"
      POSTGRES_HOST_AUTH_METHOD: "scram-sha-256"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 10s
      timeout: 5s
      retries: 5
  # Conduktor depends on a separate db for storing Kafka data for SQL querying
  # It is optional, but required if you wish to use SQL functionality
  # Separate db ensures continued operation of the core Console experience if the SQL db becomes unavailable
  # https://docs.conduktor.io/platform/guides/configure-sql/
  postgresql-2:
    image: postgres:14
    hostname: postgresql-sql
    container_name: crypto-shredding-howto-postgresql-data
    volumes:
      - pg_data_sql:/var/lib/postgresql/data
    environment:
      PGDATA: "/var/lib/postgresql/data"
      POSTGRES_DB: "conduktor-sql"
      POSTGRES_USER: "conduktor"
      POSTGRES_PASSWORD: "change_me"
      POSTGRES_HOST_AUTH_METHOD: "scram-sha-256"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 10s
      timeout: 5s
      retries: 5
  # Conduktor uses Cortex to store Kafka and applications metrics as well as alerting.
  # It is optional. 
  # https://docs.conduktor.io/platform/get-started/configuration/cortex/
  conduktor-monitoring:
    image: conduktor/conduktor-console-cortex:1.33.0
    container_name: crypto-shredding-howto-conduktor-monitoring
    environment:
      CDK_CONSOLE-URL: "http://conduktor-console:8080"
volumes:
  pg_data: {}
  pg_data_sql: {}
  conduktor_data: {}
```

</TabItem>
</Tabs>

### 2. Gateway Encryption interceptor configuration

We will use the following encryption interceptor configuration to implement our use-case. Note the following,
- Encryption will only be applied to the `customers` topic
- Gateway will use (and create if necessary) a single Vault KMS key called `/transit/keys/master-key`
- Each record will have an encryption key derived from the record value `userId` (as templated in the configuration). 
  - For example the sample JSON from earlier would have an encryption key with id `secret-for-12345678`.
  - Each record encryption key will be encrypted with the KMS key
- This configuration requires raw JSON, AVRO or protobuff record values to be sent. We will send JSON files.

[Configure the Gateway KMS](/gateway/interceptors/data-security/encryption/encryption-configuration#gateway-kms)

```json
{
  "kind": "Interceptor",
  "apiVersion": "gateway/v2",
  "metadata": {
    "name": "sensitive customer data encryption"
  },
  "spec": {
    "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
    "priority": 100,
    "config": {
      "topic": "customers",
      "kmsConfig": {
        "vault": {
          "uri": "http://vault:8200",
          "token": "${VAULT_TOKEN}",
          "version": 1
        },
        "gateway": {
          "masterKeyId": "vault-kms://vault:8200/transit/keys/master-key"
        }
      },
      "fields": [
        {
          "fieldName": "password",
          "keySecretId": "gateway-kms://secret-for-{{record.value.userId}}",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "visa",
          "keySecretId": "gateway-kms://secret-for-{{record.value.userId}}",
          "algorithm": "AES128_GCM"
        }
      ]
    }
  }
}
```

The interceptor configuration can be applied to Gateway via the command line or via the Console GUI. 

<Tabs>
<TabItem value="Configure via CLI" label="Configure via CLI">

```bash
curl --request PUT \
  --url http://localhost:8888/gateway/v2/interceptor \
  --header 'authorization: Basic YWRtaW46Y29uZHVrdG9y' \
  --header 'content-type: application/json' \
  --data '{
  "kind": "Interceptor",
  "apiVersion": "gateway/v2",
  "metadata": {
    "name": "sensitive customer data encryption"
  },
  "spec": {
    "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
    "priority": 100,
    "config": {
      "topic": "customers",
      "kmsConfig": {
        "vault": {
          "uri": "http://vault:8200",
          "token": "${VAULT_TOKEN}",
          "version": 1
        },
        "gateway": {
          "masterKeyId": "vault-kms://vault:8200/transit/keys/master-key"
        }
      },
      "fields": [
        {
          "fieldName": "password",
          "keySecretId": "gateway-kms://secret-for-{{record.value.userId}}",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "visa",
          "keySecretId": "gateway-kms://secret-for-{{record.value.userId}}",
          "algorithm": "AES128_GCM"
        }
      ]
    }
  }
}'
```

</TabItem>
<TabItem value="Configure via GUI" label="Configure via GUI">

TODO!!

</TabItem>
</Tabs>


### 3: Producing encrypted data

With encryption configured we can now produce records via Gateway that will be encrypted at rest on disk in the backing Kafka cluster and when re-reading via Kafka or Gateway.

<Tabs>
<TabItem value="Produce and check via CLI" label="Produce and check via GUI">

```bash
docker compose exec kafka-client kafka-topics --create \
  --bootstrap-server kafka-1:9092 \
  --replication-factor 1 \
  --partitions 3 \
  --topic customers

echo '{ "userId" : 10000001, "name" : "Joe Smith", "password" : "admin123", "visa" : 4111111145551142 }' | \
docker compose exec -T kafka-client \
  kafka-console-producer --bootstrap-server conduktor-gateway:6969 \
  --topic customers
echo '{ "userId" : 10000002, "name" : "Mary Brown", "password" : "abc123", "visa" : 4111111111111111 }' | \
docker compose exec -T kafka-client \
  kafka-console-producer --bootstrap-server conduktor-gateway:6969 \
  --topic customers

docker compose exec kafka-client kafka-console-consumer \
  --bootstrap-server conduktor-gateway:6969 --topic customers --from-beginning
```

</TabItem>
<TabItem value="Produce and check via GUI" label="Produce and check via GUI">
</TabItem>
</Tabs>

You should see something like the following final output for the customer data stored in Kafka. Both `password` and `visa` are encrypted as configured, whilst other fields (eg `name`) remain unencrypted.

```
{"userId":10000001,"name":"Joe Smith","password":"AAAABQAAAAKNxgtetTtIBLsCuCd5LJ7kIuzPa+/h6sm+fwHPmDhhMEF3qViBjD4LgxVExq8ct4wZ+DMxJKC86bFgUQ==","visa":"AAAAAgAAAAKNxgtetTtIBLsCuCd5LJ7kK9me1JMK6wuH4r9e30JS43cSY/7QRxy8pxT0zTIUWzxeoc5XigVmIEJLstrf361SVmZq8PCy5qg7tLM92uO9o+TrTFJIa/dxZHj4pgRcUg12ZjKku+3BTXBXPjP77DCyCsW48rUxBDK67dp6RBc="}
{"userId":10000002,"name":"Mary Brown","password":"AAAABQAAAAJJLWtew1NLwZdoDS87B0qSV8/MdZ9sTWj2EVN1c3j+yXHX0FVx8fOEcA9A/flr7RwONuByQ9GeuZA=","visa":"AAAAAgAAAAJJLWtew1NLwZdoDS87B0qS/3NEgLjPO/32aD5LFN56FmpyRCZzfJ4HN8cgHxTCorNdBup5pnlbi8tFgKKWnqrUnRNTBq5haKXsbJm4/mcd3XFWSSJeIkXtuxb1Lb2SUOVQQiZDmbk3o3p9nVcPCRYR7sx04+++S3Sj6VqM7n8="}
```

### 4: Inspecting the created keys

Gateway creates keys on demand, so now that we've produced two messages with two different secretIds (`secret-for-10000001` and `secret-for-10000002`) we would expect to see associated **encryption keys** persisted in a keystore. We would not expect to see them in our Vault KMS. This should only ever contain the master key (`/transit/keys/master-key`) which was used to encrypt them. Take a look for yourself,

<Tabs>
<TabItem value="Inspect Vault tokens via CLI" label="Inspect Vault tokens via GUI">

```bash
curl \
    --header "X-Vault-Token: vault-plaintext-root-token" \
    --request LIST \
    http://localhost:8200/v1/transit/keys/
```

</TabItem>
<TabItem value="Inspect Vault tokens via GUI" label="Inspect Vault tokens via GUI">

TODO!!

</TabItem>
</Tabs>

Instead we would expect to see the **encryption keys** in the Gateway key store (the Kafka topic `_conduktor_gateway_encryption_keys`)

<Tabs>
<TabItem value="Inspect Vault tokens via CLI" label="Inspect Vault tokens via GUI">

```bash
docker compose exec kafka-client kafka-console-consumer \
  --bootstrap-server conduktor-gateway:6969 --topic _conduktor_gateway_encryption_keys \
  --from-beginning --property print.key=true --property key.separator="|"
```


</TabItem>
<TabItem value="Inspect Vault tokens via GUI" label="Inspect Vault tokens via GUI">

TODO!!

</TabItem>
</Tabs>

You should see something like the following,

| Key   | Value |
| ----- | ----- |
| {"algorithm":"AES128_GCM","keyId":"gateway-kms://secret-for-10000001","uuid":"8dc60b5e-b53b-4804-bb02-b827792c9ee4"} | {"edek":"vault:v1:5FWLvI/AcXn5ABTBPGONK5yqNVEdnxDfU6FWN8hvIb5aKy3lsXxgFF9LfLr6Og=="} |
| {"algorithm":"AES128_GCM","keyId":"gateway-kms://secret-for-10000002","uuid":"492d6b5e-c353-4bc1-9768-0d2f3b074a92"} | {"edek":"vault:v1:5RALxs8+0z4w9Xu9ZlEhdTzrti3Laj5JD+5oF06TafLAg+0qHLPjGog3T+jSTA=="} |

There are are two records (one for each **encryption key**) to match the two `userIds`. As the number of records with different userIds grows this can lead to **substantial cost savings** and **improved performance** over storing the same **encryption key** in the KMS. 

The record key is composed of the unique `keyId` that we expected, the cryptographic `algorithm` from the configuration and a `uuid` that is uniquely generated per inserted record. The **encryption key** in the record value is encrypted with the KMS encryption key and is unusable without it.

> [!NOTE]
> The `uuid` is necessary because it is possible for two different gateway nodes to process a record with the same `keyId` for the first time at the same time. In such a scenario two records with the same `keyId` but a different `uuid` would be created. This means that it is possible (although relatively rare) for the same `keyId` to have multiple **encryption keys**.

> [!TIP]
> Make a note of the UUID returned for `"keyId":"gateway-kms://secret-for-10000001"` as we will need it for crypto shredding the key in step 7: [Crypto shredding](#7-crypto-shredding).

### 5: Gateway Decryption interceptor configuration

Before we can demonstrate crypto shredding we need to show records being decrypted. The following decryption interceptor configuration mirrors the encryption interceptor configuration that we added earlier.

```json
{
  "kind": "Interceptor",
  "apiVersion": "gateway/v2",
  "metadata": {
    "name": "sensitive customer data decryption"
  },
  "spec": {
    "pluginClass": "io.conduktor.gateway.interceptor.DecryptPlugin",
    "priority": 100,
    "config": {
      "topic": "customers",
      "kmsConfig": {
        "vault": {
          "uri": "http://vault:8200",
          "token": "${VAULT_TOKEN}",
          "version": 1
        },
        "gateway": {
          "masterKeyId": "vault-kms://vault:8200/transit/keys/master-key"
        }
      }
    }
  }
}
```

As before the interceptor configuration can be applied to Gateway via the command line or via the Console GUI. 

<Tabs>
<TabItem value="Configure decryption via CLI" label="Configure decryption via CLI">

```bash
curl --request PUT \
  --url http://localhost:8888/gateway/v2/interceptor \
  --header 'authorization: Basic YWRtaW46Y29uZHVrdG9y' \
  --header 'content-type: application/json' \
  --data '{
  "kind": "Interceptor",
  "apiVersion": "gateway/v2",
  "metadata": {
    "name": "sensitive customer data decryption"
  },
  "spec": {
    "pluginClass": "io.conduktor.gateway.interceptor.DecryptPlugin",
    "priority": 100,
    "config": {
      "topic": "customers",
      "kmsConfig": {
        "vault": {
          "uri": "http://vault:8200",
          "token": "${VAULT_TOKEN}",
          "version": 1
        },
        "gateway": {
          "masterKeyId": "vault-kms://vault:8200/transit/keys/master-key"
        }
      }
    }
  }
}'
```

</TabItem>
<TabItem value="Configure decryption via GUI" label="Configure decryption via GUI">

TODO!!

</TabItem>
</Tabs>

### 6: Consuming and decrypting data

With a decryption interceptor configured on consumption from the same topic we have been encrypting data produced to it is now possible to decrypt and read the records we produced and observed as encrypted earlier.

<Tabs>
<TabItem value="Decrypt and consume via CLI" label="Decrypt and consume via CLI">

```bash
docker compose exec kafka-client kafka-console-consumer \
    --bootstrap-server conduktor-gateway:6969 --topic customers \
    --from-beginning
```

</TabItem>
<TabItem value="Decrypt and consume via GUI" label="Decrypt and consume via GUI">

TODO 

</TabItem>
</Tabs>

You should see the following records exactly as they were originally sent.

```
{"userId":10000001,"name":"Joe Smith","password":"admin123","visa":4111111145551142}
{"userId":10000002,"name":"Mary Brown","password":"abc123","visa":4111111111111111}
```

### 7: Crypto shredding 

Records encrypted with Gateway KMS can have their **encryption keys** crypto shredded by tombstoning the associated record in the Kafka topic key store. The same `secretId` can have multiple record entries so it is important to tombstone every key (each will have a unique `uuid`). Conduktor doesn't currently offer an automated solution for this process. You need to read the entire topic manually and find every record which has the `secretId` which needs tombstoning.

For this HOWTO we only published two records and both had different `secretIds` so we can be confident that only one record needs tombstoning. 

<Tabs>
<TabItem value="Crypto shred and check via CLI" label="Crypto shred and check via GUI">

```bash
echo -n '{"algorithm":"AES128_GCM","keyId":"gateway-kms://secret-for-10000001","uuid":"<UUID_FOR_10000001_FROM_STEP_4>"}|' | \
  docker-compose exec -T kcat kcat -b kafka-1:9092 -t _conduktor_gateway_encryption_keys -K '|' -P

docker compose exec kafka-client kafka-console-consumer \
  --bootstrap-server conduktor-gateway:6969 --topic _conduktor_gateway_encryption_keys \
  --from-beginning --property print.key=true --property key.separator="|"
```

</TabItem>
<TabItem value="Crypto shred and check via GUI" label="Crypto shred and check via GUI">

TODO 

</TabItem>
</Tabs>

The records in the **encryption keys** topic should now show the latest record value for the key we crypto shredded as `null` (or empty if consuming via the CLI). Gateway will now be unable to decrypt data associated with it.

```
{"algorithm":"AES128_GCM","keyId":"gateway-kms://secret-for-10000001","uuid":"9871c88e-d5dd-4cb2-86e0-4d65ef0a8361"}|{"edek":"vault:v1:rTbfUBpiPM23WAGu2njeeeqty60BzIPedhl6CL3jaViGDP9Nf0EfRe9+0pbD4A=="}
{"algorithm":"AES128_GCM","keyId":"gateway-kms://secret-for-10000002","uuid":"381e3464-8876-4bcc-9b75-ff49d19a918f"}|{"edek":"vault:v1:c8h+LWonSpPi0Q8Zd8KjHE9GTcxXzvUwAEULDVPQdxDKkSLtiN9teE8lhDeHNw=="}
{"algorithm":"AES128_GCM","keyId":"gateway-kms://secret-for-10000001","uuid":"9871c88e-d5dd-4cb2-86e0-4d65ef0a8361"}|
```

> [!NOTE]
> The sample data above now shows two records for `"keyId":"gateway-kms://secret-for-10000001"` and you are likely to see the same. This is because Kafka compaction isn't instantaneous. Gateway guarantees to use the latest record and to prevent decryption if the associated value has been shredded. However, the earlier record still exists on disk and is available to anyone who consumes the Kafka topic directly. This means that it is technically possible for someone with access to the topic and the KMS master key to recover crypto-shredded data. The key should eventually be deleted because the topic is configured for compaction, but there is no guarantee for when that will occur. Reducing the time until (encrypted) encryption keys are deleted from disk is beyond the scope of this HOWTO. The important thing to remember is that Gateway (and therefore users) will be instantly unable to decrypt data that has been crypto shredded, as the next section will demonstrate.

### 8: Verify crypto shredded record no longer decrypts 

If you repeat the step 5 [Consuming and decrypting data](#5-gateway-decryption-interceptor-configuration) you should now see that only the data from one of the records is decrypted. The data associated with the `secretId` that we crypto-shredded remains encrypted.

```
{"userId":10000001,"name":"Joe Smith","password":"AAAABQAAAAKYcciO1d1MsobgTWXvCoNh51wLjVYSfeSdM8YncPhs5gSQhNYagQO6j74HXLw0nq9cyorBJ21qBollyQ==","visa":"AAAAAgAAAAKYcciO1d1MsobgTWXvCoNhJUWekrCBA77tBU2WfYu+z6eSeRwIuS5UluZs8m/PjSoAEsyL+2Xslt0j6XmvnzfMcFMzeZlk/U+2FNSnTEjB/CjXGXiSr5kA4Idr1dFx6kqJ4wtd0jk8e7kl8z1aAMXTKLyU5Xk6bk4inv7lpMs="}
{"userId":10000002,"name":"Mary Brown","password":"abc123","visa":4111111111111111}
```