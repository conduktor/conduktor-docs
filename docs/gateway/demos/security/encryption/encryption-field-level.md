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

[![asciicast](https://asciinema.org/a/Qwz4RJnqGPq3gnPEPI91xHK62.svg)](https://asciinema.org/a/Qwz4RJnqGPq3gnPEPI91xHK62)

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
 Network encryption-decrypt-only-specific-fields_default  Creating
 Network encryption-decrypt-only-specific-fields_default  Created
 Container kafka-client  Creating
 Container kafka1  Creating
 Container kafka3  Creating
 Container kafka2  Creating
 Container kafka3  Created
 Container kafka1  Created
 Container kafka-client  Created
 Container kafka2  Created
 Container schema-registry  Creating
 Container gateway2  Creating
 Container gateway1  Creating
 Container gateway1  Created
 Container gateway2  Created
 Container schema-registry  Created
 Container kafka3  Starting
 Container kafka1  Starting
 Container kafka-client  Starting
 Container kafka2  Starting
 Container kafka-client  Started
 Container kafka3  Started
 Container kafka1  Started
 Container kafka2  Started
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container schema-registry  Starting
 Container kafka2  Healthy
 Container gateway1  Starting
 Container kafka2  Healthy
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
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka-client  Healthy
 Container kafka1  Healthy
 Container schema-registry  Healthy
 Container gateway1  Healthy
 Container gateway2  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/hGM3IyfdI9gdgRhi8FGFyRjlw.svg)](https://asciinema.org/a/hGM3IyfdI9gdgRhi8FGFyRjlw)

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

[![asciicast](https://asciinema.org/a/7Xey4iM5nP6TAfJcb4Xr2zvGf.svg)](https://asciinema.org/a/7Xey4iM5nP6TAfJcb4Xr2zvGf)

</TabItem>
</Tabs>

## Adding interceptor encrypt

We want to encrypt only two fields, with an in memory KMS.




`step-06-encrypt-interceptor.json`:

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


<Tabs>

<TabItem value="Command">
```sh
curl \
    --silent \
    --request PUT "http://localhost:8888/gateway/v2/interceptor" \
    --header "Content-Type: application/json" \
    --user "admin:conduktor" \
    --data @step-06-encrypt-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "encrypt",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: encrypt",
      "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
      "priority": 100,
      "config": {
        "fields": [
          {
            "fieldName": "password",
            "keySecretId": "password-secret",
            "algorithm": "AES128_GCM"
          },
          {
            "fieldName": "visa",
            "keySecretId": "visa-secret",
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

[![asciicast](https://asciinema.org/a/YjNh85wU7TSiwfyXcp6uw3pq1.svg)](https://asciinema.org/a/YjNh85wU7TSiwfyXcp6uw3pq1)

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
      "name": "encrypt",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: encrypt",
      "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
      "priority": 100,
      "config": {
        "fields": [
          {
            "fieldName": "password",
            "keySecretId": "password-secret",
            "algorithm": "AES128_GCM"
          },
          {
            "fieldName": "visa",
            "keySecretId": "visa-secret",
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

[![asciicast](https://asciinema.org/a/chYmG5fFgpkdsQfPR2PH3UAwV.svg)](https://asciinema.org/a/chYmG5fFgpkdsQfPR2PH3UAwV)

</TabItem>
</Tabs>

## Let's send unencrypted json

We are using regular kafka tools




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



<Tabs>

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

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/zuSUhWtTWR0We2s3ZC51vYd8F.svg)](https://asciinema.org/a/zuSUhWtTWR0We2s3ZC51vYd8F)

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
  "password" : "AAAABQAAAAEAAAAzAT3QARSzDlcSg0UYnCxqasrYKqgJZDsLF3swF/2kA1vMTCfqRKTqw8lsXxo5Eb2fLKQ4DC6eLOHqEJ/aTw1LgWzUpwhdqcP+ZooYy5/WzX9kgSLlQKTnSDrJKvgNQoM=",
  "visa" : "AAAABQAAAAEAAAAzAWTHCnABRmeWMl18u8bbSiW9S3hWfTVptIAzCq66/C8dmCmJn6ya+BuAlPFaM2lzFz54HfDgmrUdvxNsH+RD9Utyh97t4MpulV31a4PxRtw/Sb6c67AiFm96N9Ym",
  "address" : "Chancery lane, London"
}
{
  "name" : "laura",
  "username" : "laura@conduktor.io",
  "password" : "AAAABQAAAAEAAAAzAT3QARSzDlcSg0UYnCxqasrYKqgJZDsLF3swF/2kA1vMTCfqRKTqw8lsXxo5Eb2fLKQ4912zfJs+SNOfEka1JfFUD2AOGYwRBOGeUTQetiXcVAUXFPxzjU01RWPPkA==",
  "visa" : "AAAABQAAAAEAAAAzAWTHCnABRmeWMl18u8bbSiW9S3hWfTVptIAzCq66/C8dmCmJn6ya+BuAlPFaM2lzFz54C4SUQwMu03lQbOSBor6y3gTnBhBr69xts4Oit0y5+XYfQClfMvfAnmBF5x2W",
  "address" : "Dubai, UAE"
}
```

</TabItem>
<TabItem value="Output">

```json
[2024-11-10 20:59:53,815] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages
{
  "name": "tom",
  "username": "tom@conduktor.io",
  "password": "AAAABQAAAAEAAAAzAeD1AIEXy4yklvoTbkfg+zIssucd4Nqp6tITjUBs6UQBnVh11iiDK/DVLg6YLaFzk7YgBK2TYNBEJbtGxtUEECOMEbL/QPtpMxT6Hj+xdwXn2WyQixm53MoEqxJMD+w=",
  "visa": "AAAABQAAAAEAAAAzAfqnV96DxHBKaG6M4tGKUfncP4/6gb5IAFI7Lc7c0Ld/oaATTUtxFBAKKOPSid0Rl/TCdd9it9ZBy55WYyuPKx6B59F+ItPCFtKLm8QVlHP63D0qHyYc1k+aCLmW",
  "address": "Chancery lane, London"
}
{
  "name": "laura",
  "username": "laura@conduktor.io",
  "password": "AAAABQAAAAEAAAAzAeD1AIEXy4yklvoTbkfg+zIssucd4Nqp6tITjUBs6UQBnVh11iiDK/DVLg6YLaFzk7YgeJMEWbeldOdAR8RYO3clstVArktJh8u4mRsdk0B5/J1PRW+xl7OJcUZsFw==",
  "visa": "AAAABQAAAAEAAAAzAfqnV96DxHBKaG6M4tGKUfncP4/6gb5IAFI7Lc7c0Ld/oaATTUtxFBAKKOPSid0Rl/TCKC3GH11et9Ktgg6XJAQtRy4Ue5U0SQf5uim913nEJEkFc2N2gR+/Cgp36YOC",
  "address": "Dubai, UAE"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/XjHwbcPG6wN3K8qYPUeRqG4BK.svg)](https://asciinema.org/a/XjHwbcPG6wN3K8qYPUeRqG4BK)

</TabItem>
</Tabs>

## Adding interceptor decrypt

Let's add the decrypt interceptor to decipher messages, but decrypt only a visa




`step-10-decrypt-interceptor.json`:

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


<Tabs>

<TabItem value="Command">
```sh
curl \
    --silent \
    --request PUT "http://localhost:8888/gateway/v2/interceptor" \
    --header "Content-Type: application/json" \
    --user "admin:conduktor" \
    --data @step-10-decrypt-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "decrypt",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: decrypt",
      "pluginClass": "io.conduktor.gateway.interceptor.DecryptPlugin",
      "priority": 100,
      "config": {
        "topic": "customers",
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "vault-plaintext-root-token",
            "version": 1
          }
        },
        "fields": [
          "visa"
        ]
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/1bpLipKQSunw4eyIbw15tgJ4G.svg)](https://asciinema.org/a/1bpLipKQSunw4eyIbw15tgJ4G)

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
      "name": "decrypt",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: decrypt",
      "pluginClass": "io.conduktor.gateway.interceptor.DecryptPlugin",
      "priority": 100,
      "config": {
        "topic": "customers",
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "vault-plaintext-root-token",
            "version": 1
          }
        },
        "fields": [
          "visa"
        ]
      }
    }
  },
  {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "encrypt",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: encrypt",
      "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
      "priority": 100,
      "config": {
        "fields": [
          {
            "fieldName": "password",
            "keySecretId": "password-secret",
            "algorithm": "AES128_GCM"
          },
          {
            "fieldName": "visa",
            "keySecretId": "visa-secret",
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

[![asciicast](https://asciinema.org/a/7HVtXdu8nFt5c78JOnTl8uZsl.svg)](https://asciinema.org/a/7HVtXdu8nFt5c78JOnTl8uZsl)

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
  "password" : "AAAABQAAAAEAAAAzAT3QARSzDlcSg0UYnCxqasrYKqgJZDsLF3swF/2kA1vMTCfqRKTqw8lsXxo5Eb2fLKQ4DC6eLOHqEJ/aTw1LgWzUpwhdqcP+ZooYy5/WzX9kgSLlQKTnSDrJKvgNQoM=",
  "visa" : "#abc123",
  "address" : "Chancery lane, London"
}
{
  "name" : "laura",
  "username" : "laura@conduktor.io",
  "password" : "AAAABQAAAAEAAAAzAT3QARSzDlcSg0UYnCxqasrYKqgJZDsLF3swF/2kA1vMTCfqRKTqw8lsXxo5Eb2fLKQ4912zfJs+SNOfEka1JfFUD2AOGYwRBOGeUTQetiXcVAUXFPxzjU01RWPPkA==",
  "visa" : "#888999XZ;",
  "address" : "Dubai, UAE"
}
```

</TabItem>
<TabItem value="Output">

```json
[2024-11-10 21:00:00,029] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages
{
  "name": "tom",
  "username": "tom@conduktor.io",
  "password": "AAAABQAAAAEAAAAzAeD1AIEXy4yklvoTbkfg+zIssucd4Nqp6tITjUBs6UQBnVh11iiDK/DVLg6YLaFzk7YgBK2TYNBEJbtGxtUEECOMEbL/QPtpMxT6Hj+xdwXn2WyQixm53MoEqxJMD+w=",
  "visa": "#abc123",
  "address": "Chancery lane, London"
}
{
  "name": "laura",
  "username": "laura@conduktor.io",
  "password": "AAAABQAAAAEAAAAzAeD1AIEXy4yklvoTbkfg+zIssucd4Nqp6tITjUBs6UQBnVh11iiDK/DVLg6YLaFzk7YgeJMEWbeldOdAR8RYO3clstVArktJh8u4mRsdk0B5/J1PRW+xl7OJcUZsFw==",
  "visa": "#888999XZ;",
  "address": "Dubai, UAE"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/6pMRbhieodKx7xzWbLmHy24ZM.svg)](https://asciinema.org/a/6pMRbhieodKx7xzWbLmHy24ZM)

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
 Container gateway1  Stopping
 Container schema-registry  Stopping
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway1  Removed
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway2  Removed
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container schema-registry  Removed
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka3  Removed
 Container kafka2  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Network encryption-decrypt-only-specific-fields_default  Removing
 Network encryption-decrypt-only-specific-fields_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/kbDfYSRTPKrBga6PgCQ29cEAJ.svg)](https://asciinema.org/a/kbDfYSRTPKrBga6PgCQ29cEAJ)

</TabItem>
</Tabs>

# Conclusion

Yes, encryption in the Kafka world can be simple!

