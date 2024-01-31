---
title: Schema Payload Validation for Avro
description: Schema Payload Validation for Avro
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

[![asciicast](https://asciinema.org/a/o9yjWgX4VRexcLl5eaErDYdzs.svg)](https://asciinema.org/a/o9yjWgX4VRexcLl5eaErDYdzs)

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
 Container kafka2  Running
 Container kafka3  Running
 Container kafka1  Running
 Container gateway2  Running
 Container gateway1  Running
 Container schema-registry  Running
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container gateway2  Healthy
 Container kafka2  Healthy
 Container schema-registry  Healthy
 Container gateway1  Healthy
 Container zookeeper  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/sxCwJpL2wSBvMqmPsSrDHedvC.svg)](https://asciinema.org/a/sxCwJpL2wSBvMqmPsSrDHedvC)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNDQ2NTg0OH0.ULDbQEk60zMH4Lb8e8pEHkSERnEMZgKGkeoLAme1O38';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/CkCB45T6B8EA9FrLCxRtbSEC1.svg)](https://asciinema.org/a/CkCB45T6B8EA9FrLCxRtbSEC1)

</TabItem>
</Tabs>

## Creating topic topic-avro on teamA

Creating on `teamA`:

* Topic `topic-avro` with partitions:1 and replication-factor:1

<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic topic-avro
```


</TabItem>
<TabItem value="Output">

```
Created topic topic-avro.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/1cASl4irDuY0qpAZ21vUZgzYE.svg)](https://asciinema.org/a/1cASl4irDuY0qpAZ21vUZgzYE)

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
    {"name": "name", "type": "string"},
    {"name": "age", "type": "int"},
    {"name": "email", "type": "string"},
    {
      "name": "address",
      "type": {
        "type": "record",
        "name": "AddressRecord",
        "fields": [
          {"name": "street", "type": "string"},
          {"name": "city", "type": "string"}
        ]
      }
    },
    {"name": "hobbies", "type": {"type": "array", "items": "string"}},
    {
      "name": "friends",
      "type": {
        "type": "array",
        "items": {
          "type": "record",
          "name": "Friend",
          "fields": [
            {"name": "name", "type": "string"},
            {"name": "age", "type": "int"}
          ]
        }
      }
    }
  ]
}
```
</TabItem>
</Tabs>

## Let's register it to the Schema Registry



<Tabs>
<TabItem value="Command">


```sh
curl -s \
  http://localhost:8081/subjects/topic-avro/versions \
  -X POST \
  -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data "{\"schemaType\": \"AVRO\", \"schema\": $(cat user-schema.avsc | jq tostring)}"
```


</TabItem>
<TabItem value="Output">

```
{"id":1}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/sSx9RzN9BDsLaCxGzMCmNVxH5.svg)](https://asciinema.org/a/sSx9RzN9BDsLaCxGzMCmNVxH5)

</TabItem>
</Tabs>

## Review invalid payload

Review invalid payload

<Tabs>
<TabItem value="Command">

```sh
cat invalid-payload.json
```

</TabItem>
<TabItem value="File Content">

```json
{
  "name": "D",
  "age": 17,
  "email": "bad email",
  "address": {
    "street": "a way too lond adress that will not fit in your database",
    "city": ""
  },
  "hobbies": [
    "reading"
  ],
  "friends": [
    {
      "name": "Tom",
      "age": 17
    },
    {
      "name": "Emma",
      "age": 18
    }
  ]
}
```
</TabItem>
</Tabs>

## Let's send invalid data



<Tabs>
<TabItem value="Command">


```sh
cat invalid-payload.json | jq -c | \
    kafka-avro-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic topic-avro \
        --property schema.registry.url=http://localhost:8081 \
        --property value.schema.id=1
```


</TabItem>
<TabItem value="Output">

```
[2024-01-31 09:30:52,400] INFO KafkaAvroSerializerConfig values: 
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

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ikv4HC6I38tLN9scWXwolL1Zc.svg)](https://asciinema.org/a/ikv4HC6I38tLN9scWXwolL1Zc)

</TabItem>
</Tabs>

## Let's consume it back

That's pretty bad, you are going to propagate wrong data within your system!

<Tabs>
<TabItem value="Command">


```sh
kafka-avro-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic topic-avro \
    --from-beginning \
    --timeout-ms 3000
```


</TabItem>
<TabItem value="Output">

```
[2024-01-31 09:30:54,161] INFO KafkaAvroDeserializerConfig values: 
	auto.register.schemas = true
	avro.reflection.allow.null = false
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
	specific.avro.key.type = null
	specific.avro.reader = false
	specific.avro.value.type = null
	use.latest.version = false
	use.latest.with.metadata = null
	use.schema.id = -1
	value.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
 (io.confluent.kafka.serializers.KafkaAvroDeserializerConfig:376)
{"name":"D","age":17,"email":"bad email","address":{"street":"a way too lond adress that will not fit in your database","city":""},"hobbies":["reading"],"friends":[{"name":"Tom","age":17},{"name":"Emma","age":18}]}
[2024-01-31 09:30:58,187] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$:44)
org.apache.kafka.common.errors.TimeoutException
[2024-01-31 09:30:58,187] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$:44)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Q2LXdA819TnfKbS3S3tnVWumW.svg)](https://asciinema.org/a/Q2LXdA819TnfKbS3S3tnVWumW)

</TabItem>
</Tabs>

## Adding interceptor guard-schema-payload-validate

Add Schema Payload Validation Policy Interceptor

<Tabs>
<TabItem value="Command">


```sh
cat step-12-guard-schema-payload-validate.json | jq

curl \
    --request POST "http://localhost:8888/admin/interceptors/v1/vcluster/teamA/interceptor/guard-schema-payload-validate" \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data @step-12-guard-schema-payload-validate.json | jq
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

[![asciicast](https://asciinema.org/a/kf8FOM7PMm3ESeSwmPuDzm7ya.svg)](https://asciinema.org/a/kf8FOM7PMm3ESeSwmPuDzm7ya)

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

[![asciicast](https://asciinema.org/a/iwlflJIUvfg6wrG6qIS6XvILF.svg)](https://asciinema.org/a/iwlflJIUvfg6wrG6qIS6XvILF)

</TabItem>
</Tabs>

## Review the avro schema with validation rules

Review the avro schema with validation rules

<Tabs>
<TabItem value="Command">

```sh
cat user-schema-with-validation-rules.avsc
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
          {"name": "street", "type": "string", "minLength": 5, "maxLength": 15},
          {"name": "city", "type": "string", "minLength": 2, "maxLength": 50}
        ]
      }
    },
    {"name": "hobbies", "type": {"type": "array", "items": "string"}, "minItems": 2},
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

## Let's update the schema with our validation rules



<Tabs>
<TabItem value="Command">


```sh
curl -s \
  http://localhost:8081/subjects/topic-avro/versions \
  -X POST \
  -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data "{\"schemaType\": \"AVRO\", \"schema\": $(cat user-schema-with-validation-rules.avsc | jq tostring)}"
```


</TabItem>
<TabItem value="Output">

```
{"id":2}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/JqtTSESJHF0vfmJF3TzUZwbpN.svg)](https://asciinema.org/a/JqtTSESJHF0vfmJF3TzUZwbpN)

</TabItem>
</Tabs>

## Let's asserts number of registered schemas



<Tabs>
<TabItem value="Command">


```sh
curl -s http://localhost:8081/subjects/topic-avro/versions
```


</TabItem>
<TabItem value="Output">

```
[1,2]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/a2Vh2fRjJZ5lFWNN6BYbMi7ui.svg)](https://asciinema.org/a/a2Vh2fRjJZ5lFWNN6BYbMi7ui)

</TabItem>
</Tabs>

## Let's produce the same invalid payload again

The payload has been rejected with useful errors

```
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. 
Topic 'topic-avro' has invalid avro schema payload: name is too short (1 < 3), email does not match format 'email', street is too long (56 > 15), city is too short (0 < 2), hobbies has too few items (1 < 2), age is greater than 10, age is greater than 10
```

<Tabs>
<TabItem value="Command">


```sh
cat invalid-payload.json | jq -c | \
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
[2024-01-31 09:31:00,681] INFO KafkaAvroSerializerConfig values: 
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
[2024-01-31 09:31:01,955] ERROR Error when sending message to topic topic-avro with key: null, value: 99 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback:52)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: name is too short (1 < 3), email does not match format 'email', street is too long (56 > 15), city is too short (0 < 2), hobbies has too few items (1 < 2), age is greater than 10, age is greater than 10
[2024-01-31 09:31:01,955] ERROR Error when sending message to topic topic-avro with key: null, value: 99 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback:52)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: name is too short (1 < 3), email does not match format 'email', street is too long (56 > 15), city is too short (0 < 2), hobbies has too few items (1 < 2), age is greater than 10, age is greater than 10

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/0677p6dIqycTEyzZH5rwxvljS.svg)](https://asciinema.org/a/0677p6dIqycTEyzZH5rwxvljS)

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
  "id" : "d9fd6ff8-38aa-4cae-848b-3edc3b79d477",
  "source" : "krn://cluster=WfJbBG-CT8WNm3NxEoBsdQ",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:31527"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T08:24:57.800864760Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: name is too short (1 < 3), email does not match format 'email', street is too long (56 > 15), city is too short (0 < 2), hobbies has too few items (1 < 2), age is greater than 10, age is greater than 10"
  }
}
```


</TabItem>
<TabItem value="Output">

```
{"id":"59bc3dec-f0cd-42c7-ae70-5500be50dc55","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"172.27.0.7:8888","remoteAddress":"192.168.65.1:49331"},"specVersion":"0.1.0","time":"2024-01-31T08:30:48.547424755Z","eventData":{"method":"POST","path":"/admin/vclusters/v1/vcluster/teamA/username/sa","body":"{\"lifeTimeSeconds\": 7776000}"}}
{"id":"58895f86-e105-48f8-a5be-a3b2623d8f84","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.27.0.7:6969","remoteAddress":"/192.168.65.1:34204"},"specVersion":"0.1.0","time":"2024-01-31T08:30:49.985290589Z","eventData":"SUCCESS"}
{"id":"4c847867-1791-4ef7-b514-d3717aa7045b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.27.0.7:6970","remoteAddress":"/192.168.65.1:30033"},"specVersion":"0.1.0","time":"2024-01-31T08:30:50.096833673Z","eventData":"SUCCESS"}
{"id":"b0593d15-d436-49c9-9ffa-8371114f8e04","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.27.0.7:6969","remoteAddress":"/192.168.65.1:34208"},"specVersion":"0.1.0","time":"2024-01-31T08:30:53.098865132Z","eventData":"SUCCESS"}
{"id":"11d23c2a-ea35-47cb-9f36-c2fbd3189991","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.27.0.7:6970","remoteAddress":"/192.168.65.1:30037"},"specVersion":"0.1.0","time":"2024-01-31T08:30:53.155815757Z","eventData":"SUCCESS"}
{"id":"4ddeedb4-66ed-4687-9b09-b23ab951d702","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.27.0.7:6969","remoteAddress":"/192.168.65.1:34210"},"specVersion":"0.1.0","time":"2024-01-31T08:30:54.722472592Z","eventData":"SUCCESS"}
{"id":"aabb37ee-81ff-4be5-99cc-d54fb2ae3bef","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.27.0.7:6970","remoteAddress":"/192.168.65.1:30039"},"specVersion":"0.1.0","time":"2024-01-31T08:30:54.791672258Z","eventData":"SUCCESS"}
{"id":"d9110eea-7a4f-416a-8d47-1b7daca7739c","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.27.0.7:6970","remoteAddress":"/192.168.65.1:30040"},"specVersion":"0.1.0","time":"2024-01-31T08:30:55.022841425Z","eventData":"SUCCESS"}
{"id":"7a0c7a18-3cc1-4cbc-b1c5-922e2d5b2f21","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"172.27.0.7:8888","remoteAddress":"192.168.65.1:49353"},"specVersion":"0.1.0","time":"2024-01-31T08:30:58.925613469Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-schema-payload-validate","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"schemaRegistryConfig\" : {      \"host\" : \"http://schema-registry:8081\"    },    \"topic\" : \"topic-.*\",    \"schemaIdRequired\" : true,    \"validateSchema\" : true,    \"action\" : \"BLOCK\"  }}"}}
{"id":"233dc1df-771e-400f-8642-2719af5672ee","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"172.27.0.7:8888","remoteAddress":"192.168.65.1:49365"},"specVersion":"0.1.0","time":"2024-01-31T08:30:59.698026011Z","eventData":{"method":"GET","path":"/admin/interceptors/v1/vcluster/teamA","body":null}}
{"id":"08aa52e2-be50-49eb-9249-fdacc81bc2d4","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.27.0.7:6969","remoteAddress":"/192.168.65.1:34230"},"specVersion":"0.1.0","time":"2024-01-31T08:31:01.495098095Z","eventData":"SUCCESS"}
{"id":"86a2fd5f-5c0e-4501-b1c6-b4c4e262be46","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/172.27.0.7:6970","remoteAddress":"/192.168.65.1:30059"},"specVersion":"0.1.0","time":"2024-01-31T08:31:01.575416136Z","eventData":"SUCCESS"}
{"id":"0dab63f4-8130-496b-a81f-64e70089b3ba","source":"krn://cluster=RYEZzJ4pQSyYb59a3C1RzA","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:30059"},"specVersion":"0.1.0","time":"2024-01-31T08:31:01.905503470Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: name is too short (1 < 3), email does not match format 'email', street is too long (56 > 15), city is too short (0 < 2), hobbies has too few items (1 < 2), age is greater than 10, age is greater than 10"}}
[2024-01-31 09:31:06,640] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 13 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/NaaN57LXDp3Am1DiNeS17vnsW.svg)](https://asciinema.org/a/NaaN57LXDp3Am1DiNeS17vnsW)

</TabItem>
</Tabs>

## Let's now produce a valid payload



<Tabs>
<TabItem value="Command">


```sh
cat valid-payload.json | jq -c | \
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
[2024-01-31 09:31:07,635] INFO KafkaAvroSerializerConfig values: 
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

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/kMHlFpjERr1M282sQbt3mV1az.svg)](https://asciinema.org/a/kMHlFpjERr1M282sQbt3mV1az)

</TabItem>
</Tabs>

## And consume it back



<Tabs>
<TabItem value="Command">


```sh
kafka-avro-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic topic-avro \
    --from-beginning \
    --timeout-ms 3000
```


</TabItem>
<TabItem value="Output">

```
[2024-01-31 09:31:09,272] INFO KafkaAvroDeserializerConfig values: 
	auto.register.schemas = true
	avro.reflection.allow.null = false
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
	specific.avro.key.type = null
	specific.avro.reader = false
	specific.avro.value.type = null
	use.latest.version = false
	use.latest.with.metadata = null
	use.schema.id = -1
	value.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
 (io.confluent.kafka.serializers.KafkaAvroDeserializerConfig:376)
{"name":"D","age":17,"email":"bad email","address":{"street":"a way too lond adress that will not fit in your database","city":""},"hobbies":["reading"],"friends":[{"name":"Tom","age":17},{"name":"Emma","age":18}]}
{"name":"Doe","age":17,"email":"john.doe@example.com","address":{"street":"123 Main St","city":"Anytown"},"hobbies":["reading","cycling"],"friends":[{"name":"Tom","age":9},{"name":"Emma","age":10}]}
[2024-01-31 09:31:16,195] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$:44)
org.apache.kafka.common.errors.TimeoutException
[2024-01-31 09:31:16,195] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$:44)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/7I9zX6Y0ZmVH3czK6LL6Tfo1b.svg)](https://asciinema.org/a/7I9zX6Y0ZmVH3czK6LL6Tfo1b)

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
 Container gateway1  Stopping
 Container gateway2  Stopping
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway1  Stopped
 Container gateway1  Removing
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway1  Removed
 Container gateway2  Removed
 Container schema-registry  Removed
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka3  Stopping
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
 Network safeguard-validate-schema-payload-avro_default  Removing
 Network safeguard-validate-schema-payload-avro_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/CHS3YD0pacAAgqQCpT86PjDoQ.svg)](https://asciinema.org/a/CHS3YD0pacAAgqQCpT86PjDoQ)

</TabItem>
</Tabs>

# Conclusion

You can enrich your existing schema to add even more data quality to your systems!

