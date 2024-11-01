---
title: Encryption Based on Schema Registry Tags
description: Encryption Based on Schema Registry Tags
tag: encryption
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Schema based field level encryption with Schema Registry

Yes, it work with Avro, Json Schema with nested fields

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/PwZxHlVuldkp46BXjdzCAtHR6.svg)](https://asciinema.org/a/PwZxHlVuldkp46BXjdzCAtHR6)

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
 Network encryption-schema-based_default  Creating
 Network encryption-schema-based_default  Created
 Container kafka-client  Creating
 Container vault  Creating
 Container kafka2  Creating
 Container kafka3  Creating
 Container kafka1  Creating
 Container kafka2  Created
 Container kafka1  Created
 Container vault  Created
 Container kafka3  Created
 Container schema-registry  Creating
 Container gateway1  Creating
 Container gateway2  Creating
 Container kafka-client  Created
 Container gateway2  Created
 Container gateway1  Created
 Container schema-registry  Created
 Container vault  Starting
 Container kafka3  Starting
 Container kafka1  Starting
 Container kafka2  Starting
 Container kafka-client  Starting
 Container vault  Started
 Container kafka2  Started
 Container kafka-client  Started
 Container kafka3  Started
 Container kafka1  Started
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka3  Waiting
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container gateway2  Starting
 Container kafka2  Healthy
 Container gateway1  Starting
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container schema-registry  Starting
 Container schema-registry  Started
 Container gateway1  Started
 Container gateway2  Started
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container vault  Waiting
 Container kafka1  Waiting
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka-client  Healthy
 Container vault  Healthy
 Container kafka3  Healthy
 Container schema-registry  Healthy
 Container gateway2  Healthy
 Container gateway1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/up10JdLVITsg6KKOO3IvFwYVQ.svg)](https://asciinema.org/a/up10JdLVITsg6KKOO3IvFwYVQ)

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

[![asciicast](https://asciinema.org/a/stMh4AGsvCwJvaQkCRTi3Ay6Z.svg)](https://asciinema.org/a/stMh4AGsvCwJvaQkCRTi3Ay6Z)

</TabItem>
</Tabs>

## Adding interceptor encrypt

We want to encrypt two fields at the root layer, and `location` in the `address` object. 
Here we are using an in memory KMS.




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
    "pluginClass" : "io.conduktor.gateway.interceptor.EncryptSchemaBasedPlugin",
    "priority" : 100,
    "config" : {
      "schemaDataMode" : "convert_json",
      "kmsConfig" : {
        "vault" : {
          "uri" : "http://vault:8200",
          "token" : "vault-plaintext-root-token",
          "version" : 1
        }
      },
      "schemaRegistryConfig" : {
        "host" : "http://schema-registry:8081"
      },
      "defaultKeySecretId" : "myDefaultKeySecret",
      "defaultAlgorithm" : "AES128_EAX",
      "tags" : [ "PII", "ENCRYPTION" ],
      "namespace" : "conduktor."
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
      "pluginClass": "io.conduktor.gateway.interceptor.EncryptSchemaBasedPlugin",
      "priority": 100,
      "config": {
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "vault-plaintext-root-token",
            "version": 1
          }
        },
        "tags": [
          "PII",
          "ENCRYPTION"
        ],
        "schemaRegistryConfig": {
          "host": "http://schema-registry:8081"
        },
        "defaultAlgorithm": "AES128_EAX",
        "defaultKeySecretId": "myDefaultKeySecret",
        "namespace": "conduktor.",
        "schemaDataMode": "convert_json"
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/eTKxF7NUg7VMTfL3whYUuXAub.svg)](https://asciinema.org/a/eTKxF7NUg7VMTfL3whYUuXAub)

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
      "pluginClass": "io.conduktor.gateway.interceptor.EncryptSchemaBasedPlugin",
      "priority": 100,
      "config": {
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "vault-plaintext-root-token",
            "version": 1
          }
        },
        "tags": [
          "PII",
          "ENCRYPTION"
        ],
        "schemaRegistryConfig": {
          "host": "http://schema-registry:8081"
        },
        "defaultAlgorithm": "AES128_EAX",
        "defaultKeySecretId": "myDefaultKeySecret",
        "namespace": "conduktor.",
        "schemaDataMode": "convert_json"
      }
    }
  }
]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/wsBlobOPBwxJvck2h0WELZXjW.svg)](https://asciinema.org/a/wsBlobOPBwxJvck2h0WELZXjW)

</TabItem>
</Tabs>

## Let's send unencrypted json schema message with specified json schema with custom constrains for encryption








<Tabs>

<TabItem value="Command">
```sh
valueSchema=$(echo '{
    "title": "Customer",
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "username": { "type": "string" },
      "password": { "type": "string", "conduktor.keySecretId": "password-secret", "conduktor.algorithm": "AES128_GCM" },
      "visa": { "type": "string", "conduktor.keySecretId": "conduktor.visa-secret", "conduktor.algorithm": "AES128_GCM" },
      "address": {
        "type": "object",
        "properties": {
          "location": { "type": "string", "conduktor.tags": ["MY_TAG", "PII", "GDPR", "MY_OTHER_TAG"] },
          "town": { "type": "string" },
          "country": { "type": "string" }
        }
      }
    }
}' | jq -c)

keySchema=$(echo '{
    "title": "Metadata",
    "type": "object",
    "properties": {
        "sessionId": {"type": "string"},
        "authenticationToken": {"type": "string", "conduktor.keySecretId": "token-secret"},
        "deviceInformation": {"type": "string", "conduktor.algorithm": "AES128_CTR_HMAC_SHA256" }
    }
}' | jq -c)

invalidKeyTom=$(echo '{
        "sessionId": "session-id-tom",
        "authenticationToken": "authentication-token-tom",
        "deviceInformation": "device-information-tom"
    }' | jq -c)

invalidValueTom=$(echo '{
        "name": "tom",
        "username": "tom@conduktor.io",
        "password": "motorhead",
        "visa": "#abc123",
        "address": {
          "location": "12 Chancery lane",
          "town": "London",
          "country": "UK"
        }
    }' | jq -c)

invalidInputTom="$invalidKeyTom|$invalidValueTom"
echo $invalidInputTom | \
kafka-json-schema-console-producer \
        --bootstrap-server localhost:6969 \
        --topic customers \
        --property schema.registry.url=http://localhost:8081 \
        --property parse.key=true \
        --property key.separator="|" \
        --property value.schema=$valueSchema \
        --property key.schema=$keySchema 2>&1 /dev/null

invalidKeyLaura=$(echo '{
        "sessionId": "session-id-laura",
        "authenticationToken": "authentication-token-laura",
        "deviceInformation": "device-information-laura"
    }' | jq -c)

invalidValueLaura=$(echo '{
        "name": "laura",
        "username": "laura@conduktor.io",
        "password": "kitesurf",
        "visa": "#888999XZ;",
        "address": {
          "location": "4th Street, Jumeirah",
          "town": "Dubai",
          "country": "UAE"
        }
    }' | jq -c)

invalidInputLaura="$invalidKeyLaura|$invalidValueLaura"
echo $invalidInputLaura | \
kafka-json-schema-console-producer \
        --bootstrap-server localhost:6969 \
        --topic customers \
        --property schema.registry.url=http://localhost:8081 \
        --property parse.key=true \
        --property key.separator="|" \
        --property value.schema=$valueSchema \
        --property key.schema=$keySchema 2>&1 /dev/null
```


</TabItem>
<TabItem value="Output">

```
[2024-11-01 17:12:11,056] INFO KafkaJsonSchemaSerializerConfig values: 
	auto.register.schemas = true
	basic.auth.credentials.source = URL
	basic.auth.user.info = [hidden]
	bearer.auth.cache.expiry.buffer.seconds = 300
	bearer.auth.client.id = null
	bearer.auth.client.secret = null
	bearer.auth.credentials.source = STATIC_TOKEN
	bearer.auth.custom.provider.class = null
	bearer.auth.identity.pool.id = null
	bearer.auth.issuer.endpoint.url = null
	bearer.auth.logical.cluster = null
	bearer.auth.scope = null
	bearer.auth.scope.claim.name = scope
	bearer.auth.sub.claim.name = sub
	bearer.auth.token = [hidden]
	context.name.strategy = class io.confluent.kafka.serializers.context.NullContextNameStrategy
	http.connect.timeout.ms = 60000
	http.read.timeout.ms = 60000
	id.compatibility.strict = true
	json.default.property.inclusion = null
	json.fail.invalid.schema = true
	json.fail.unknown.properties = true
	json.indent.output = false
	json.oneof.for.nullables = true
	json.schema.spec.version = draft_7
	json.write.dates.iso8601 = false
	key.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
	latest.cache.size = 1000
	latest.cache.ttl.sec = -1
	latest.compatibility.strict = true
	max.schemas.per.subject = 1000
	normalize.schemas = false
	proxy.host = 
	proxy.port = -1
	rule.actions = []
	rule.executors = []
	rule.service.loader.enable = true
	schema.format = null
	schema.reflection = false
	schema.registry.basic.auth.user.info = [hidden]
	schema.registry.ssl.cipher.suites = null
	schema.registry.ssl.enabled.protocols = [TLSv1.2, TLSv1.3]
	schema.registry.ssl.endpoint.identification.algorithm = https
	schema.registry.ssl.engine.factory.class = null
	schema.registry.ssl.key.password = null
	schema.registry.ssl.keymanager.algorithm = SunX509
	schema.registry.ssl.keystore.certificate.chain = null
	schema.registry.ssl.keystore.key = null
	schema.registry.ssl.keystore.location = null
	schema.registry.ssl.keystore.password = null
	schema.registry.ssl.keystore.type = JKS
	schema.registry.ssl.protocol = TLSv1.3
	schema.registry.ssl.provider = null
	schema.registry.ssl.secure.random.implementation = null
	schema.registry.ssl.trustmanager.algorithm = PKIX
	schema.registry.ssl.truststore.certificates = null
	schema.registry.ssl.truststore.location = null
	schema.registry.ssl.truststore.password = null
	schema.registry.ssl.truststore.type = JKS
	schema.registry.url = [http://localhost:8081]
	use.latest.version = false
	use.latest.with.metadata = null
	use.schema.id = -1
	value.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
 (io.confluent.kafka.serializers.json.KafkaJsonSchemaSerializerConfig:370)
[2024-11-01 17:12:16,072] INFO KafkaJsonSchemaSerializerConfig values: 
	auto.register.schemas = true
	basic.auth.credentials.source = URL
	basic.auth.user.info = [hidden]
	bearer.auth.cache.expiry.buffer.seconds = 300
	bearer.auth.client.id = null
	bearer.auth.client.secret = null
	bearer.auth.credentials.source = STATIC_TOKEN
	bearer.auth.custom.provider.class = null
	bearer.auth.identity.pool.id = null
	bearer.auth.issuer.endpoint.url = null
	bearer.auth.logical.cluster = null
	bearer.auth.scope = null
	bearer.auth.scope.claim.name = scope
	bearer.auth.sub.claim.name = sub
	bearer.auth.token = [hidden]
	context.name.strategy = class io.confluent.kafka.serializers.context.NullContextNameStrategy
	http.connect.timeout.ms = 60000
	http.read.timeout.ms = 60000
	id.compatibility.strict = true
	json.default.property.inclusion = null
	json.fail.invalid.schema = true
	json.fail.unknown.properties = true
	json.indent.output = false
	json.oneof.for.nullables = true
	json.schema.spec.version = draft_7
	json.write.dates.iso8601 = false
	key.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
	latest.cache.size = 1000
	latest.cache.ttl.sec = -1
	latest.compatibility.strict = true
	max.schemas.per.subject = 1000
	normalize.schemas = false
	proxy.host = 
	proxy.port = -1
	rule.actions = []
	rule.executors = []
	rule.service.loader.enable = true
	schema.format = null
	schema.reflection = false
	schema.registry.basic.auth.user.info = [hidden]
	schema.registry.ssl.cipher.suites = null
	schema.registry.ssl.enabled.protocols = [TLSv1.2, TLSv1.3]
	schema.registry.ssl.endpoint.identification.algorithm = https
	schema.registry.ssl.engine.factory.class = null
	schema.registry.ssl.key.password = null
	schema.registry.ssl.keymanager.algorithm = SunX509
	schema.registry.ssl.keystore.certificate.chain = null
	schema.registry.ssl.keystore.key = null
	schema.registry.ssl.keystore.location = null
	schema.registry.ssl.keystore.password = null
	schema.registry.ssl.keystore.type = JKS
	schema.registry.ssl.protocol = TLSv1.3
	schema.registry.ssl.provider = null
	schema.registry.ssl.secure.random.implementation = null
	schema.registry.ssl.trustmanager.algorithm = PKIX
	schema.registry.ssl.truststore.certificates = null
	schema.registry.ssl.truststore.location = null
	schema.registry.ssl.truststore.password = null
	schema.registry.ssl.truststore.type = JKS
	schema.registry.url = [http://localhost:8081]
	use.latest.version = false
	use.latest.with.metadata = null
	use.schema.id = -1
	value.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
 (io.confluent.kafka.serializers.json.KafkaJsonSchemaSerializerConfig:370)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/kUpiR7PTqINxXAaTXgONIORBw.svg)](https://asciinema.org/a/kUpiR7PTqINxXAaTXgONIORBw)

</TabItem>
</Tabs>

## Let's make sure they are encrypted

password and visa and the nested field `address.location` are encrypted






<Tabs>

<TabItem value="Command">
```sh
kafka-json-schema-console-consumer \
  --bootstrap-server localhost:6969 \
  --property schema.registry.url=http://localhost:8081 \
  --property print.key=true \
  --topic customers \
  --from-beginning \
  --max-messages 2 2>&1  /dev/null | grep '{' | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "sessionId": "session-id-tom",
  "authenticationToken": "AAAABQAAAAEAAAA7AYe/4CxHWLaItSkSnXZXgKR3Z6s0YOEHYd4yXCFXgu3kjgYOLEZEAdSIC733gZzSbyU8tkdX7zLakC0FTxoxNE8hbmkqHE49vusuatdwuFwpEGWAbsp2Wo1/SmiVw+0l+o0Z4bFOWLtQaODFOUhFqXH94BSBXYFeTEI=",
  "deviceInformation": "AAAABQAAAAEAAABnAQwokky12WIkL0MLuT/v79Y9r9i6sxsET6ZI5delJSnIiatJxTjjSdUWXQV0jePuvPmH9jNhza0+LLrbjdz8uqIXFpFW8yNzgEhXZVjZQ7K/62JytObHM61P5y/enGnBFlBz/UIw+eZ0UtLkKLfcWipPHi74Mp//hCM6caU4l43+95YCbVruEQq5pWb2lAxiKq5gTJX/Wt4YsfF8NIYo8swnRJY="
}
{
  "name": "tom",
  "username": "tom@conduktor.io",
  "password": "AAAABQAAAAEAAAAzAY1N8PS9TU5NThUjO6TFUCtfrZqVqhN6AjBtUqP3f6y7EgFUbyBuF/ycu79JytoXyZQIGyhWYJzrOZInyzEskMyfCkfLyrEVjhMyh3ME2j1ofihCps5lD4LSCVDODS4=",
  "visa": "AAAABQAAAAEAAAAzATS+3icecvOVUQ59RQWlaEVh4I0PlJ76osrF9scAGgEKT9TgX+gXsPLBT3oNZXYp19B0YlWGAloEDDfvRFCewwVxtT2vAb42md83wpZztTILvICs7v9CkKWjfEtD",
  "address": {
    "location": "AAAABQAAAAEAAAA7AT9emu5zfSTj0JXDXw8EdF55lRzJ/vz6EPkzAiszIcKMDOs0QhZIbRLvd71pUZ5FLte6r/nVrCA+uSpE0v9QhIR/tlGC96vr0idybGKwJF1Zq2ThDv8/rrcf6HU+Tw8O0U+KMzzaGNr+qjjt7zGbP88g",
    "town": "London",
    "country": "UK"
  }
}
{
  "sessionId": "session-id-laura",
  "authenticationToken": "AAAABQAAAAEAAAA7AYe/4CxHWLaItSkSnXZXgKR3Z6s0YOEHYd4yXCFXgu3kjgYOLEZEAdSIC733gZzSbyU8tkdX7zLakC2kK9865INlJawkdSuEzJDPicO3v5YjBoc7ZHHEDXBzs3o/uUyR5ZvKh8nlf4xDir6cIQuou8lCmQnqZsEkmEIf/g==",
  "deviceInformation": "AAAABQAAAAEAAABnAQwokky12WIkL0MLuT/v79Y9r9i6sxsET6ZI5delJSnIiatJxTjjSdUWXQV0jePuvPmH9jNhza0+LLrbjdz8uqIXFpFW8yNzgEhXZVjZQ7K/62JytObHM61P5y/enGnBFlBz/UIw+cC2LgiOwS/cGKnYiktKZL7VdOtrvxfPvcoh+9MdNRp+1ux41F1/EvRQv5DntAkimtgRBXXVBkULiPcEXP8YiQ=="
}
{
  "name": "laura",
  "username": "laura@conduktor.io",
  "password": "AAAABQAAAAEAAAAzAY1N8PS9TU5NThUjO6TFUCtfrZqVqhN6AjBtUqP3f6y7EgFUbyBuF/ycu79JytoXyZQI8PhLlWIcU6x8kOt6NBEu6JzgwRJ4fl6yElwZGj/2l9q4sgaTxTit096VwA==",
  "visa": "AAAABQAAAAEAAAAzATS+3icecvOVUQ59RQWlaEVh4I0PlJ76osrF9scAGgEKT9TgX+gXsPLBT3oNZXYp19B0d5xBmKoNTZP0GzLhl/K4zlNkhbjRvjN8qPrOiCf1+FmSgGoSINLfh6WTKaZf",
  "address": {
    "location": "AAAABQAAAAEAAAA7AT9emu5zfSTj0JXDXw8EdF55lRzJ/vz6EPkzAiszIcKMDOs0QhZIbRLvd71pUZ5FLte6r/nVrCA+uSqVyCSQAk/bGuCTKgcOZNVubg9G9XKTH0MlV1leUDPFnEp2bvzJc2HAjOiPRCTx/CxxQsUtfvg/XewA3Q==",
    "town": "Dubai",
    "country": "UAE"
  }
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/qFtsna26HbHdmlC4rvEkyceen.svg)](https://asciinema.org/a/qFtsna26HbHdmlC4rvEkyceen)

</TabItem>
</Tabs>

## Adding interceptor decrypt

Let's add the decrypt interceptor to decipher messages




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
      "schemaRegistryConfig" : {
        "host" : "http://schema-registry:8081"
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
        "schemaRegistryConfig": {
          "host": "http://schema-registry:8081"
        }
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/1f05vuj50dxBYtU6GSL2NMPMJ.svg)](https://asciinema.org/a/1f05vuj50dxBYtU6GSL2NMPMJ)

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
        "schemaRegistryConfig": {
          "host": "http://schema-registry:8081"
        }
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
      "pluginClass": "io.conduktor.gateway.interceptor.EncryptSchemaBasedPlugin",
      "priority": 100,
      "config": {
        "kmsConfig": {
          "vault": {
            "uri": "http://vault:8200",
            "token": "vault-plaintext-root-token",
            "version": 1
          }
        },
        "tags": [
          "PII",
          "ENCRYPTION"
        ],
        "schemaRegistryConfig": {
          "host": "http://schema-registry:8081"
        },
        "defaultAlgorithm": "AES128_EAX",
        "defaultKeySecretId": "myDefaultKeySecret",
        "namespace": "conduktor.",
        "schemaDataMode": "convert_json"
      }
    }
  }
]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/6tJjWIu5EGanOSPXSQhrVJkyz.svg)](https://asciinema.org/a/6tJjWIu5EGanOSPXSQhrVJkyz)

</TabItem>
</Tabs>

## Let's make sure they are decrypted

password and visa and the nested field `address.location` are decrypted






<Tabs>

<TabItem value="Command">
```sh
kafka-json-schema-console-consumer \
  --bootstrap-server localhost:6969 \
  --property schema.registry.url=http://localhost:8081 \
  --property print.key=true \
  --topic customers \
  --from-beginning \
  --max-messages 2 2>&1 | grep '{' | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "sessionId": "session-id-tom",
  "authenticationToken": "authentication-token-tom",
  "deviceInformation": "device-information-tom"
}
{
  "name": "tom",
  "username": "tom@conduktor.io",
  "password": "motorhead",
  "visa": "#abc123",
  "address": {
    "location": "12 Chancery lane",
    "town": "London",
    "country": "UK"
  }
}
{
  "sessionId": "session-id-laura",
  "authenticationToken": "authentication-token-laura",
  "deviceInformation": "device-information-laura"
}
{
  "name": "laura",
  "username": "laura@conduktor.io",
  "password": "kitesurf",
  "visa": "#888999XZ;",
  "address": {
    "location": "4th Street, Jumeirah",
    "town": "Dubai",
    "country": "UAE"
  }
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/joX8Jzi1b7vC0UlU6XtgYrryR.svg)](https://asciinema.org/a/joX8Jzi1b7vC0UlU6XtgYrryR)

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
 Container gateway2  Stopping
 Container vault  Stopping
 Container kafka-client  Stopping
 Container schema-registry  Stopping
 Container gateway1  Stopping
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container vault  Stopped
 Container vault  Removing
 Container schema-registry  Removed
 Container vault  Removed
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway1  Removed
 Container gateway2  Removed
 Container kafka3  Stopping
 Container kafka2  Stopping
 Container kafka1  Stopping
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Network encryption-schema-based_default  Removing
 Network encryption-schema-based_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/dmOzBHAKEp7zykN39BXAsy7xT.svg)](https://asciinema.org/a/dmOzBHAKEp7zykN39BXAsy7xT)

</TabItem>
</Tabs>

# Conclusion

Yes, encryption in the Kafka world can be simple!

