---
title: Schema Producer Interceptor
description: Schema Producer Interceptor
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

[![asciicast](https://asciinema.org/a/A8nkdbgb7I7NY2u7wj413svJu.svg)](https://asciinema.org/a/A8nkdbgb7I7NY2u7wj413svJu)

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
 Container kafka2  Running
 Container kafka1  Running
 Container gateway1  Running
 Container schema-registry  Running
 Container gateway2  Running
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka3  Waiting
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container gateway2  Healthy
 Container zookeeper  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container schema-registry  Healthy
 Container gateway1  Healthy
 Container kafka2  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/FAhJiztDP3abYKjp4nDKG90LE.svg)](https://asciinema.org/a/FAhJiztDP3abYKjp4nDKG90LE)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNDQ2NTQyOH0.m12bxJ6wRC5lLiXRW7SHnp6JZmNjGSbQ8my9vPKrRug';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/6k2C67FQcejvAaBuyHn61a9uA.svg)](https://asciinema.org/a/6k2C67FQcejvAaBuyHn61a9uA)

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

[![asciicast](https://asciinema.org/a/qxfIhSLmi8ai33EjPWtXw0Z6P.svg)](https://asciinema.org/a/qxfIhSLmi8ai33EjPWtXw0Z6P)

</TabItem>
</Tabs>

## Adding interceptor guard-schema-payload-validate

Add Schema Payload Validation Policy Interceptor

<Tabs>
<TabItem value="Command">


```sh
cat step-07-guard-schema-payload-validate.json | jq

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
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
  "priority": 100,
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
{
  "message": "guard-schema-payload-validate is created"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/lcNCobdoZokxI6I7GGmAKHXI3.svg)](https://asciinema.org/a/lcNCobdoZokxI6I7GGmAKHXI3)

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

[![asciicast](https://asciinema.org/a/TzOPqYwftSs12Qm0BleY3agYQ.svg)](https://asciinema.org/a/TzOPqYwftSs12Qm0BleY3agYQ)

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

[![asciicast](https://asciinema.org/a/WSuvHNzNZRiiV8amzvsEiOsjO.svg)](https://asciinema.org/a/WSuvHNzNZRiiV8amzvsEiOsjO)

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

[![asciicast](https://asciinema.org/a/HIa2fitro2VLmTwPfAwGIJ4Y0.svg)](https://asciinema.org/a/HIa2fitro2VLmTwPfAwGIJ4Y0)

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
[2024-01-31 09:23:56,719] INFO KafkaJsonSchemaSerializerConfig values: 
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

[![asciicast](https://asciinema.org/a/DrmGf51Eswy6RdbHSg8ZNy6E7.svg)](https://asciinema.org/a/DrmGf51Eswy6RdbHSg8ZNy6E7)

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
[2024-01-31 09:23:58,368] INFO KafkaAvroSerializerConfig values: 
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
[2024-01-31 09:23:59,272] ERROR Error when sending message to topic topic-avro with key: null, value: 88 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback:52)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: name is too short (2 < 3), street is too long (11 > 10), hobbies has too few items (2 < 3), age is greater than 10, age is greater than 10
[2024-01-31 09:23:59,272] ERROR Error when sending message to topic topic-avro with key: null, value: 88 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback:52)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: name is too short (2 < 3), street is too long (11 > 10), hobbies has too few items (2 < 3), age is greater than 10, age is greater than 10

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/yoNVbShGFm5K91MzIs5HEXDh4.svg)](https://asciinema.org/a/yoNVbShGFm5K91MzIs5HEXDh4)

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
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin")'
```


returns 1 event
```json
{
  "id" : "d8ac845c-f615-4794-969a-85bd47b00022",
  "source" : "krn://cluster=rIIQWvX1SWqdrOUUP_GlIA",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:23945"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T08:17:58.399168302Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: name is too short (2 < 3), street is too long (11 > 10), hobbies has too few items (2 < 3), age is greater than 10, age is greater than 10"
  }
}
```


</TabItem>
<TabItem value="Output">

```
{"id":"b2a5df40-045e-4d83-89ee-78b6a41fdcc9","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"172.20.0.7:8888","remoteAddress":"192.168.65.1:46056"},"specVersion":"0.1.0","time":"2024-01-31T08:23:48.271213922Z","eventData":{"method":"POST","path":"/admin/vclusters/v1/vcluster/teamA/username/sa","body":"{\"lifeTimeSeconds\": 7776000}"}}
{"id":"9ba22f1f-28a7-41c9-80ad-6488c90e7c75","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6969","remoteAddress":"/192.168.65.1:30927"},"specVersion":"0.1.0","time":"2024-01-31T08:23:49.681195839Z","eventData":"SUCCESS"}
{"id":"676a1df0-c8a0-4f4f-942d-935d630e38b8","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6971","remoteAddress":"/192.168.65.1:34101"},"specVersion":"0.1.0","time":"2024-01-31T08:23:49.775569464Z","eventData":"SUCCESS"}
{"id":"c387a1af-a2a2-4fe0-a85e-f3a79cd02f38","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6969","remoteAddress":"/192.168.65.1:30929"},"specVersion":"0.1.0","time":"2024-01-31T08:23:51.910540674Z","eventData":"SUCCESS"}
{"id":"c715eec4-7c45-424d-8d22-a0af17b1045f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6971","remoteAddress":"/192.168.65.1:34103"},"specVersion":"0.1.0","time":"2024-01-31T08:23:51.960808215Z","eventData":"SUCCESS"}
{"id":"5546dc85-daff-43ab-8442-1884943a3961","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6969","remoteAddress":"/192.168.65.1:30931"},"specVersion":"0.1.0","time":"2024-01-31T08:23:53.519256924Z","eventData":"SUCCESS"}
{"id":"4bdfb6af-7836-4055-9b5c-e655ad226568","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6971","remoteAddress":"/192.168.65.1:34105"},"specVersion":"0.1.0","time":"2024-01-31T08:23:53.552982299Z","eventData":"SUCCESS"}
{"id":"ac131ae3-0084-4507-9598-6cb99df1f019","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"172.20.0.7:8888","remoteAddress":"192.168.65.1:46072"},"specVersion":"0.1.0","time":"2024-01-31T08:23:54.140125091Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-schema-payload-validate","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"schemaRegistryConfig\" : {      \"host\" : \"http://schema-registry:8081\"    },    \"topic\" : \"topic-.*\",    \"schemaIdRequired\" : true,    \"validateSchema\" : true,    \"action\" : \"BLOCK\"  }}"}}
{"id":"a0963a5b-b1aa-43d3-a82c-55ebe87e930c","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"172.20.0.7:8888","remoteAddress":"192.168.65.1:46073"},"specVersion":"0.1.0","time":"2024-01-31T08:23:54.705500383Z","eventData":{"method":"GET","path":"/admin/interceptors/v1/vcluster/teamA","body":null}}
{"id":"0b3a28c7-c631-4cf2-9350-3d2491b1a450","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6969","remoteAddress":"/192.168.65.1:30940"},"specVersion":"0.1.0","time":"2024-01-31T08:23:57.349465134Z","eventData":"SUCCESS"}
{"id":"4f899f43-1e6d-41c2-933b-4b12a6b00b82","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6969","remoteAddress":"/192.168.65.1:30953"},"specVersion":"0.1.0","time":"2024-01-31T08:23:58.983903344Z","eventData":"SUCCESS"}
{"id":"5f62a0f5-d3fb-4ef3-8a41-815501df1312","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6969","remoteAddress":"/192.168.65.1:30954"},"specVersion":"0.1.0","time":"2024-01-31T08:23:59.040053760Z","eventData":"SUCCESS"}
{"id":"e33eddb1-6485-4b9b-acc2-7f71399e734a","source":"krn://cluster=F5rpirOQQCCITt0smzh25g","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:30954"},"specVersion":"0.1.0","time":"2024-01-31T08:23:59.264697260Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: name is too short (2 < 3), street is too long (11 > 10), hobbies has too few items (2 < 3), age is greater than 10, age is greater than 10"}}
[2024-01-31 09:24:03,808] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 13 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/VQKx4yLbTrQ3HTRLGvkEK9eQj.svg)](https://asciinema.org/a/VQKx4yLbTrQ3HTRLGvkEK9eQj)

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
[2024-01-31 09:24:04,798] INFO KafkaProtobufSerializerConfig values: 
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
[2024-01-31 09:24:06,171] ERROR Error when sending message to topic topic-protobuf with key: null, value: 102 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback:52)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'topic-protobuf' has invalid protobuf schema payload: Student.name is too short (2 < 3), Student.Address.street is too long (11 > 10), Student.Friend.age is greater than 10, Student.Friend.age is greater than 10
[2024-01-31 09:24:06,171] ERROR Error when sending message to topic topic-protobuf with key: null, value: 102 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback:52)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'topic-protobuf' has invalid protobuf schema payload: Student.name is too short (2 < 3), Student.Address.street is too long (11 > 10), Student.Friend.age is greater than 10, Student.Friend.age is greater than 10

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/jcvlZkihtseQ4nMDfWuI0QymC.svg)](https://asciinema.org/a/jcvlZkihtseQ4nMDfWuI0QymC)

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
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin")'
```


returns 1 event
```json
{
  "id" : "e42b67e6-76da-46d2-afcd-8289236283e2",
  "source" : "krn://cluster=rIIQWvX1SWqdrOUUP_GlIA",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:28123"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T08:18:03.792856179Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Topic 'topic-protobuf' has invalid protobuf schema payload: Student.name is too short (2 < 3), Student.Address.street is too long (11 > 10), Student.Friend.age is greater than 10, Student.Friend.age is greater than 10"
  }
}
```


</TabItem>
<TabItem value="Output">

```
{"id":"b2a5df40-045e-4d83-89ee-78b6a41fdcc9","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"172.20.0.7:8888","remoteAddress":"192.168.65.1:46056"},"specVersion":"0.1.0","time":"2024-01-31T08:23:48.271213922Z","eventData":{"method":"POST","path":"/admin/vclusters/v1/vcluster/teamA/username/sa","body":"{\"lifeTimeSeconds\": 7776000}"}}
{"id":"9ba22f1f-28a7-41c9-80ad-6488c90e7c75","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6969","remoteAddress":"/192.168.65.1:30927"},"specVersion":"0.1.0","time":"2024-01-31T08:23:49.681195839Z","eventData":"SUCCESS"}
{"id":"676a1df0-c8a0-4f4f-942d-935d630e38b8","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6971","remoteAddress":"/192.168.65.1:34101"},"specVersion":"0.1.0","time":"2024-01-31T08:23:49.775569464Z","eventData":"SUCCESS"}
{"id":"c387a1af-a2a2-4fe0-a85e-f3a79cd02f38","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6969","remoteAddress":"/192.168.65.1:30929"},"specVersion":"0.1.0","time":"2024-01-31T08:23:51.910540674Z","eventData":"SUCCESS"}
{"id":"c715eec4-7c45-424d-8d22-a0af17b1045f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6971","remoteAddress":"/192.168.65.1:34103"},"specVersion":"0.1.0","time":"2024-01-31T08:23:51.960808215Z","eventData":"SUCCESS"}
{"id":"5546dc85-daff-43ab-8442-1884943a3961","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6969","remoteAddress":"/192.168.65.1:30931"},"specVersion":"0.1.0","time":"2024-01-31T08:23:53.519256924Z","eventData":"SUCCESS"}
{"id":"4bdfb6af-7836-4055-9b5c-e655ad226568","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6971","remoteAddress":"/192.168.65.1:34105"},"specVersion":"0.1.0","time":"2024-01-31T08:23:53.552982299Z","eventData":"SUCCESS"}
{"id":"ac131ae3-0084-4507-9598-6cb99df1f019","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"172.20.0.7:8888","remoteAddress":"192.168.65.1:46072"},"specVersion":"0.1.0","time":"2024-01-31T08:23:54.140125091Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-schema-payload-validate","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"schemaRegistryConfig\" : {      \"host\" : \"http://schema-registry:8081\"    },    \"topic\" : \"topic-.*\",    \"schemaIdRequired\" : true,    \"validateSchema\" : true,    \"action\" : \"BLOCK\"  }}"}}
{"id":"a0963a5b-b1aa-43d3-a82c-55ebe87e930c","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"172.20.0.7:8888","remoteAddress":"192.168.65.1:46073"},"specVersion":"0.1.0","time":"2024-01-31T08:23:54.705500383Z","eventData":{"method":"GET","path":"/admin/interceptors/v1/vcluster/teamA","body":null}}
{"id":"0b3a28c7-c631-4cf2-9350-3d2491b1a450","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6969","remoteAddress":"/192.168.65.1:30940"},"specVersion":"0.1.0","time":"2024-01-31T08:23:57.349465134Z","eventData":"SUCCESS"}
{"id":"4f899f43-1e6d-41c2-933b-4b12a6b00b82","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6969","remoteAddress":"/192.168.65.1:30953"},"specVersion":"0.1.0","time":"2024-01-31T08:23:58.983903344Z","eventData":"SUCCESS"}
{"id":"5f62a0f5-d3fb-4ef3-8a41-815501df1312","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6969","remoteAddress":"/192.168.65.1:30954"},"specVersion":"0.1.0","time":"2024-01-31T08:23:59.040053760Z","eventData":"SUCCESS"}
{"id":"e33eddb1-6485-4b9b-acc2-7f71399e734a","source":"krn://cluster=F5rpirOQQCCITt0smzh25g","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:30954"},"specVersion":"0.1.0","time":"2024-01-31T08:23:59.264697260Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: name is too short (2 < 3), street is too long (11 > 10), hobbies has too few items (2 < 3), age is greater than 10, age is greater than 10"}}
{"id":"6b6faaeb-f87c-45dd-8a4d-3926467c6c56","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6969","remoteAddress":"/192.168.65.1:30959"},"specVersion":"0.1.0","time":"2024-01-31T08:24:05.496998222Z","eventData":"SUCCESS"}
{"id":"3e78b17d-98d5-4c70-ac2a-951df04dc202","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.20.0.7:6971","remoteAddress":"/192.168.65.1:34133"},"specVersion":"0.1.0","time":"2024-01-31T08:24:05.555083472Z","eventData":"SUCCESS"}
{"id":"f6d23b25-1974-44cb-afb9-69549c02832f","source":"krn://cluster=F5rpirOQQCCITt0smzh25g","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:34133"},"specVersion":"0.1.0","time":"2024-01-31T08:24:06.137392347Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'topic-protobuf' has invalid protobuf schema payload: Student.name is too short (2 < 3), Student.Address.street is too long (11 > 10), Student.Friend.age is greater than 10, Student.Friend.age is greater than 10"}}
[2024-01-31 09:24:10,740] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 16 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ApAxbEkkIp1caN8gSxnaCm4in.svg)](https://asciinema.org/a/ApAxbEkkIp1caN8gSxnaCm4in)

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
 Container gateway2  Stopping
 Container gateway1  Stopping
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway2  Stopped
 Container gateway2  Removing
 Container schema-registry  Removed
 Container gateway2  Removed
 Container gateway1  Removed
 Container kafka2  Stopping
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Container kafka1  Removed
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

[![asciicast](https://asciinema.org/a/zbySWClvv27doqIQhKjBbtbKa.svg)](https://asciinema.org/a/zbySWClvv27doqIQhKjBbtbKa)

</TabItem>
</Tabs>

# Conclusion

Safeguard is really a game changer!

