---
title: Schema Producer Interceptor
description: Schema Producer Interceptor
tag: quality
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# What is a Schema Payload Validation Policy Interceptor?

Avoid outages from missing or badly formatted records, ensure all messages adhere to a schema.

This interceptor also supports validating payload against specific constraints for AvroSchema and Protobuf.

This is similar to the validations provided by JsonSchema, such as:

- **Number**: `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `multipleOf`
- **String**: `minLength`, `maxLength`, `pattern`, `format`
- **Collections**: `maxItems`, `minItems`

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/7qKjID1cxK8xIQxTmdW0pFihN.svg)](https://asciinema.org/a/7qKjID1cxK8xIQxTmdW0pFihN)

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
 Network safeguard-validate-schema-payload_default  Creating
 Network safeguard-validate-schema-payload_default  Created
 Container kafka-client  Creating
 Container zookeeper  Creating
 Container kafka-client  Created
 Container zookeeper  Created
 Container kafka3  Creating
 Container kafka2  Creating
 Container kafka1  Creating
 Container kafka1  Created
 Container kafka3  Created
 Container kafka2  Created
 Container gateway2  Creating
 Container schema-registry  Creating
 Container gateway1  Creating
 gateway2 The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 
 Container gateway2  Created
 gateway1 The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested 
 Container gateway1  Created
 Container schema-registry  Created
 Container kafka-client  Starting
 Container zookeeper  Starting
 Container kafka-client  Started
 Container zookeeper  Started
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Healthy
 Container kafka1  Starting
 Container zookeeper  Healthy
 Container kafka2  Starting
 Container zookeeper  Healthy
 Container kafka3  Starting
 Container kafka2  Started
 Container kafka3  Started
 Container kafka1  Started
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka1  Waiting
 Container kafka3  Waiting
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container gateway1  Starting
 Container schema-registry  Starting
 Container kafka2  Healthy
 Container gateway2  Starting
 Container schema-registry  Started
 Container gateway2  Started
 Container gateway1  Started
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container zookeeper  Healthy
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

[![asciicast](https://asciinema.org/a/2ZJOlRlstI7FnZZqUJvw3gawT.svg)](https://asciinema.org/a/2ZJOlRlstI7FnZZqUJvw3gawT)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNTY1NjMyOX0.vZ0iVQg-rFo6HZDhZk9D8jO2o76z-GYpBQydeo8_Rn8';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/iDHcUk5zzGf8C5sG9aCh47C6e.svg)](https://asciinema.org/a/iDHcUk5zzGf8C5sG9aCh47C6e)

</TabItem>
</Tabs>

## Creating topics topic-json,topic-avro,topic-protobuf on teamA

Creating on `teamA`:

* Topic `topic-json` with partitions:1 and replication-factor:1
* Topic `topic-avro` with partitions:1 and replication-factor:1
* Topic `topic-protobuf` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic topic-json
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic topic-avro
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic topic-protobuf
```


</TabItem>
<TabItem value="Output">

```
Created topic topic-json.
Created topic topic-avro.
Created topic topic-protobuf.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/4PdxTOwebZDZi9cXAGXM6x2qx.svg)](https://asciinema.org/a/4PdxTOwebZDZi9cXAGXM6x2qx)

</TabItem>
</Tabs>

## Adding interceptor guard-schema-payload-validate

Add Schema Payload Validation Policy Interceptor

Creating the interceptor named `guard-schema-payload-validate` of the plugin `io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin` using the following payload

```json
{
  "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
  "priority" : 100,
  "config" : {
    "schemaRegistryConfig" : {
      "host" : "http://schema-registry:8081"
    },
    "topic" : "topic-.*",
    "schemaIdRequired" : true,
    "validateSchema" : true,
    "action" : "BLOCK"
  }
}
```

Here's how to send it:

<Tabs>
<TabItem value="Command">


```sh
curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/guard-schema-payload-validate" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-07-guard-schema-payload-validate.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "message": "guard-schema-payload-validate is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/jo66tm7wc259sV3itKRzPSBNy.svg)](https://asciinema.org/a/jo66tm7wc259sV3itKRzPSBNy)

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
      "name": "guard-schema-payload-validate",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
      "apiKey": null,
      "priority": 100,
      "timeoutMs": 9223372036854775807,
      "config": {
        "schemaRegistryConfig": {
          "host": "http://schema-registry:8081"
        },
        "topic": "topic-.*",
        "schemaIdRequired": true,
        "validateSchema": true,
        "action": "BLOCK"
      }
    }
  ]
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/JMScyYRYceu71Br4p0tEKeLxp.svg)](https://asciinema.org/a/JMScyYRYceu71Br4p0tEKeLxp)

</TabItem>
</Tabs>

## Review the example json schema

Review the example json schema

<Tabs>
<TabItem value="Command">

```sh
cat user-schema.json
```

</TabItem>
<TabItem value="File Content">

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 3,
      "maxLength": 50
    },
    "age": {
      "type": "integer",
      "minimum": 0,
      "maximum": 120
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "address": {
      "type": "object",
      "properties": {
        "street": {
          "type": "string",
          "minLength": 5,
          "maxLength": 10
        },
        "city": {
          "type": "string",
          "minLength": 2,
          "maxLength": 50
        }
      }
    },
    "hobbies": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 3
    }
  }
}
```
</TabItem>
</Tabs>

## Review the example avro schema

Review the example avro schema

<Tabs>
<TabItem value="Command">

```sh
cat user-schema.avsc
```

</TabItem>
<TabItem value="File Content">

```avsc
{
  "namespace": "schema.avro",
  "type": "record",
  "name": "User",
  "fields": [
    {"name": "name", "type": "string", "minLength": 3, "maxLength": 50},
    {"name": "age", "type": "int", "minimum": 0, "maximum": 120},
    {"name": "email", "type": "string", "format": "email"},
    {
      "name": "address",
      "type": {
        "type": "record",
        "name": "AddressRecord",
        "fields": [
          {"name": "street", "type": "string", "minLength": 5, "maxLength": 10},
          {"name": "city", "type": "string", "minLength": 2, "maxLength": 50}
        ]
      }
    },
    {"name": "hobbies", "type": {"type": "array", "items": "string"}, "minItems": 3},
    {
      "name": "friends",
      "type": {
        "type": "array",
        "items": {
          "type": "record",
          "name": "Friend",
          "fields": [
            {"name": "name", "type": "string"},
            {"name": "age", "type": "int", "minimum": 2, "maximum": 10}
          ]
        }
      }
    }
  ]
}
```
</TabItem>
</Tabs>

## Review the example protobuf schema

Review the example protobuf schema

<Tabs>
<TabItem value="Command">

```sh
cat user-schema.proto
```

</TabItem>
<TabItem value="File Content">

```proto
syntax = "proto3";

option java_package = "schema.protobuf";
option java_outer_classname = "User";

message Student {
  string name = 1 [(confluent.field_meta).params = {minLength: "3", maxLength: "50"}];
  int32 age = 2 [(confluent.field_meta).params = {minimum: "3", maximum: "120"}];
  string email = 3 [(confluent.field_meta).params = {format: "email"}];
  Address address = 4;
  repeated string hobbies = 5 [(confluent.field_meta).params = {minItems: "2"}];
  repeated Friend friends = 6;

  message Address {
    string street = 1 [(confluent.field_meta).params = {minLength: "5", maxLength: "10"}];
    string city = 2 [(confluent.field_meta).params = {minLength: "2", maxLength: "10"}];
  }

  message Friend {
    string name = 1 [(confluent.field_meta).params = {minLength: "3", maxLength: "10"}];
    int32 age = 2 [(confluent.field_meta).params = {minimum: "2", maximum: "10"}];
  }
}
```
</TabItem>
</Tabs>

## Let's register these schemas to the Schema Registry



<Tabs>
<TabItem value="Command">


```sh
echo jsonSchemaId = $(curl -s -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" \
--data "{\"schemaType\": \"JSON\", \"schema\": $(cat user-schema.json | jq tostring)}" \
  http://localhost:8081/subjects/topic-json/versions)

echo avroSchemaId = $(curl -s -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" \
--data "{\"schemaType\": \"AVRO\", \"schema\": $(cat user-schema.avsc | jq tostring)}" \
  http://localhost:8081/subjects/topic-avro/versions)

echo protobufSchemaId = $(curl -s -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" \
--data "{\"schemaType\": \"PROTOBUF\", \"schema\": $(cat user-schema.proto | jq -Rs .)}" \
  http://localhost:8081/subjects/topic-protobuf/versions)
```


</TabItem>
<TabItem value="Output">

```
jsonSchemaId = {"id":1}
avroSchemaId = {"id":2}
protobufSchemaId = {"id":3}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/22aIeeos3jNauUVuATwHfbFyl.svg)](https://asciinema.org/a/22aIeeos3jNauUVuATwHfbFyl)

</TabItem>
</Tabs>

## Let's asserts number of registered schemas



<Tabs>
<TabItem value="Command">


```sh
echo nb schemas = $(curl --silent http://localhost:8081/subjects/ | jq 'length')
```


</TabItem>
<TabItem value="Output">

```
nb schemas = 3

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Q433j2VzXM0P4hLfRyNW5TpFi.svg)](https://asciinema.org/a/Q433j2VzXM0P4hLfRyNW5TpFi)

</TabItem>
</Tabs>

## Let's produce invalid payload to the json schema



<Tabs>
<TabItem value="Command">


```sh
echo '{"name":"Hi","age":7,"email":"john.doecom","address":{"street":"123 Main St","city":"a"},"hobbies":["reading","cycling"]}' | \
    kafka-json-schema-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic topic-json \
        --property schema.registry.url=http://localhost:8081 \
        --property value.schema.id=1
```


</TabItem>
<TabItem value="Output">

```
[2024-02-14 04:12:15,548] INFO KafkaJsonSchemaSerializerConfig values: 
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
 (io.confluent.kafka.serializers.json.KafkaJsonSchemaSerializerConfig:376)
org.apache.kafka.common.errors.SerializationException: Error serializing JSON message
	at io.confluent.kafka.serializers.json.AbstractKafkaJsonSchemaSerializer.serializeImpl(AbstractKafkaJsonSchemaSerializer.java:166)
	at io.confluent.kafka.formatter.json.JsonSchemaMessageReader$JsonSchemaMessageSerializer.serialize(JsonSchemaMessageReader.java:167)
	at io.confluent.kafka.formatter.json.JsonSchemaMessageReader$JsonSchemaMessageSerializer.serialize(JsonSchemaMessageReader.java:130)
	at io.confluent.kafka.formatter.SchemaMessageReader.readMessage(SchemaMessageReader.java:406)
	at kafka.tools.ConsoleProducer$.main(ConsoleProducer.scala:50)
	at kafka.tools.ConsoleProducer.main(ConsoleProducer.scala)
Caused by: org.apache.kafka.common.errors.SerializationException: Validation error in JSON {"name":"Hi","age":7,"email":"john.doecom","address":{"street":"123 Main St","city":"a"},"hobbies":["reading","cycling"]}, Error report:
{
  "schemaLocation": "#",
  "pointerToViolation": "#",
  "causingExceptions": [
    {
      "schemaLocation": "#/properties/address",
      "pointerToViolation": "#/address",
      "causingExceptions": [
        {
          "schemaLocation": "#/properties/address/properties/city",
          "pointerToViolation": "#/address/city",
          "causingExceptions": [],
          "keyword": "minLength",
          "message": "expected minLength: 2, actual: 1"
        },
        {
          "schemaLocation": "#/properties/address/properties/street",
          "pointerToViolation": "#/address/street",
          "causingExceptions": [],
          "keyword": "maxLength",
          "message": "expected maxLength: 10, actual: 11"
        }
      ],
      "message": "2 schema violations found"
    },
    {
      "schemaLocation": "#/properties/hobbies",
      "pointerToViolation": "#/hobbies",
      "causingExceptions": [],
      "keyword": "minItems",
      "message": "expected minimum item count: 3, found: 2"
    },
    {
      "schemaLocation": "#/properties/name",
      "pointerToViolation": "#/name",
      "causingExceptions": [],
      "keyword": "minLength",
      "message": "expected minLength: 3, actual: 2"
    },
    {
      "schemaLocation": "#/properties/email",
      "pointerToViolation": "#/email",
      "causingExceptions": [],
      "keyword": "format",
      "message": "[john.doecom] is not a valid email address"
    }
  ],
  "message": "5 schema violations found"
}
	at io.confluent.kafka.serializers.json.AbstractKafkaJsonSchemaSerializer.validateJson(AbstractKafkaJsonSchemaSerializer.java:189)
	at io.confluent.kafka.serializers.json.AbstractKafkaJsonSchemaSerializer.serializeImpl(AbstractKafkaJsonSchemaSerializer.java:154)
	... 5 more
Caused by: org.everit.json.schema.ValidationException: #: 5 schema violations found
	at org.everit.json.schema.ValidationException.copy(ValidationException.java:486)
	at org.everit.json.schema.DefaultValidator.performValidation(Validator.java:76)
	at org.everit.json.schema.Schema.validate(Schema.java:152)
	at io.confluent.kafka.schemaregistry.json.JsonSchema.validate(JsonSchema.java:441)
	at io.confluent.kafka.schemaregistry.json.JsonSchema.validate(JsonSchema.java:409)
	at io.confluent.kafka.serializers.json.AbstractKafkaJsonSchemaSerializer.validateJson(AbstractKafkaJsonSchemaSerializer.java:179)
	... 6 more

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/x3UEdZeRTld0bnYBcNGKmsU8c.svg)](https://asciinema.org/a/x3UEdZeRTld0bnYBcNGKmsU8c)

</TabItem>
</Tabs>

## Let's produce invalid payload to the avro schema



<Tabs>
<TabItem value="Command">


```sh
echo '{"name":"Hi","age":7,"email":"john.doe@example.com","address":{"street":"123 Main St","city":"Anytown"},"hobbies":["reading","cycling"],"friends":[{"name":"Friend1","age":17},{"name":"Friend2","age":18}]}' | \
    kafka-avro-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic topic-avro \
        --property schema.registry.url=http://localhost:8081 \
        --property value.schema.id=2
```


</TabItem>
<TabItem value="Output">

```
[2024-02-14 04:12:16,974] INFO KafkaAvroSerializerConfig values: 
	auto.register.schemas = true
	avro.reflection.allow.null = false
	avro.remove.java.properties = false
	avro.use.logical.type.converters = false
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
 (io.confluent.kafka.serializers.KafkaAvroSerializerConfig:376)
[2024-02-14 04:12:17,711] ERROR Error when sending message to topic topic-avro with key: null, value: 88 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback:52)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: name is too short (2 < 3), street is too long (11 > 10), hobbies has too few items (2 < 3), age is greater than 10, age is greater than 10
[2024-02-14 04:12:17,711] ERROR Error when sending message to topic topic-avro with key: null, value: 88 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback:52)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: name is too short (2 < 3), street is too long (11 > 10), hobbies has too few items (2 < 3), age is greater than 10, age is greater than 10

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/0FUpu1G3lrgbBIxU4aywdSmTC.svg)](https://asciinema.org/a/0FUpu1G3lrgbBIxU4aywdSmTC)

</TabItem>
</Tabs>

## Check in the audit log that message was denied

Check in the audit log that message was denied in cluster `kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --topic _auditLogs \
    --from-beginning \
    --timeout-ms 3000 \
    | jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin")'
```


returns 

```json
Processed a total of 13 messages
{
  "id": "42ff3bf1-9ec7-4a5e-9208-27bdf5f57809",
  "source": "krn://cluster=TtF1fia0TJ-2B2bjRog-gg",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:58866"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T03:12:17.693833427Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
    "message": "Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: name is too short (2 < 3), street is too long (11 > 10), hobbies has too few items (2 < 3), age is greater than 10, age is greater than 10"
  }
}

```



</TabItem>
<TabItem value="Output">

```
Processed a total of 13 messages
{
  "id": "42ff3bf1-9ec7-4a5e-9208-27bdf5f57809",
  "source": "krn://cluster=TtF1fia0TJ-2B2bjRog-gg",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:58866"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T03:12:17.693833427Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
    "message": "Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: name is too short (2 < 3), street is too long (11 > 10), hobbies has too few items (2 < 3), age is greater than 10, age is greater than 10"
  }
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/oTaRtAln5zy10fJ6wqdMBOZ3M.svg)](https://asciinema.org/a/oTaRtAln5zy10fJ6wqdMBOZ3M)

</TabItem>
</Tabs>

## Let's produce invalid payload to the protobuf schema



<Tabs>
<TabItem value="Command">


```sh
echo '{"name":"Hi","age":7,"email":"john.doe@example.com","address":{"street":"123 Main St","city":"Anytown"},"hobbies":["reading","cycling"],"friends":[{"name":"Friend1","age":17},{"name":"Friend2","age":18}]}' | \
    kafka-protobuf-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic topic-protobuf \
        --property schema.registry.url=http://localhost:8081 \
        --property value.schema.id=3
```


</TabItem>
<TabItem value="Output">

```
[2024-02-14 04:12:23,053] INFO KafkaProtobufSerializerConfig values: 
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
	key.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
	latest.cache.size = 1000
	latest.cache.ttl.sec = -1
	latest.compatibility.strict = true
	max.schemas.per.subject = 1000
	normalize.schemas = false
	proxy.host = 
	proxy.port = -1
	reference.lookup.only = false
	reference.subject.name.strategy = class io.confluent.kafka.serializers.subject.DefaultReferenceSubjectNameStrategy
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
	skip.known.types = true
	use.latest.version = false
	use.latest.with.metadata = null
	use.schema.id = -1
	value.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
 (io.confluent.kafka.serializers.protobuf.KafkaProtobufSerializerConfig:376)
[2024-02-14 04:12:24,289] ERROR Error when sending message to topic topic-protobuf with key: null, value: 102 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback:52)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'topic-protobuf' has invalid protobuf schema payload: Student.name is too short (2 < 3), Student.Address.street is too long (11 > 10), Student.Friend.age is greater than 10, Student.Friend.age is greater than 10
[2024-02-14 04:12:24,289] ERROR Error when sending message to topic topic-protobuf with key: null, value: 102 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback:52)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'topic-protobuf' has invalid protobuf schema payload: Student.name is too short (2 < 3), Student.Address.street is too long (11 > 10), Student.Friend.age is greater than 10, Student.Friend.age is greater than 10

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ucMYjZvwYn84Fd8MdoMfLzJkw.svg)](https://asciinema.org/a/ucMYjZvwYn84Fd8MdoMfLzJkw)

</TabItem>
</Tabs>

## Check in the audit log that message was denied

Check in the audit log that message was denied in cluster `kafka1`

<Tabs>
<TabItem value="Command">


```sh
kafka-console-consumer \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --topic _auditLogs \
    --from-beginning \
    --timeout-ms 3000 \
    | jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin")'
```


returns 

```json
Processed a total of 16 messages
{
  "id": "42ff3bf1-9ec7-4a5e-9208-27bdf5f57809",
  "source": "krn://cluster=TtF1fia0TJ-2B2bjRog-gg",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:58866"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T03:12:17.693833427Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
    "message": "Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: name is too short (2 < 3), street is too long (11 > 10), hobbies has too few items (2 < 3), age is greater than 10, age is greater than 10"
  }
}
{
  "id": "b6d3c6e8-c3f8-4f86-914c-046d793a0f30",
  "source": "krn://cluster=TtF1fia0TJ-2B2bjRog-gg",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:58872"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T03:12:24.271040805Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
    "message": "Request parameters do not satisfy the configured policy. Topic 'topic-protobuf' has invalid protobuf schema payload: Student.name is too short (2 < 3), Student.Address.street is too long (11 > 10), Student.Friend.age is greater than 10, Student.Friend.age is greater than 10"
  }
}

```



</TabItem>
<TabItem value="Output">

```
Processed a total of 16 messages
{
  "id": "42ff3bf1-9ec7-4a5e-9208-27bdf5f57809",
  "source": "krn://cluster=TtF1fia0TJ-2B2bjRog-gg",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:58866"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T03:12:17.693833427Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
    "message": "Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: name is too short (2 < 3), street is too long (11 > 10), hobbies has too few items (2 < 3), age is greater than 10, age is greater than 10"
  }
}
{
  "id": "b6d3c6e8-c3f8-4f86-914c-046d793a0f30",
  "source": "krn://cluster=TtF1fia0TJ-2B2bjRog-gg",
  "type": "SAFEGUARD",
  "authenticationPrincipal": "teamA",
  "userName": "sa",
  "connection": {
    "localAddress": null,
    "remoteAddress": "/192.168.65.1:58872"
  },
  "specVersion": "0.1.0",
  "time": "2024-02-14T03:12:24.271040805Z",
  "eventData": {
    "level": "error",
    "plugin": "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
    "message": "Request parameters do not satisfy the configured policy. Topic 'topic-protobuf' has invalid protobuf schema payload: Student.name is too short (2 < 3), Student.Address.street is too long (11 > 10), Student.Friend.age is greater than 10, Student.Friend.age is greater than 10"
  }
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/PS7pMEM5k5yIPcqUhmSIhZpza.svg)](https://asciinema.org/a/PS7pMEM5k5yIPcqUhmSIhZpza)

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
 Container gateway1  Stopping
 Container kafka-client  Stopping
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
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network safeguard-validate-schema-payload_default  Removing
 Network safeguard-validate-schema-payload_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/A6hA2gzlPJQb9QUiEjYhmXMFk.svg)](https://asciinema.org/a/A6hA2gzlPJQb9QUiEjYhmXMFk)

</TabItem>
</Tabs>

# Conclusion

Safeguard is really a game changer!

