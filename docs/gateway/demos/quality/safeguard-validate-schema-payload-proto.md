---
title: Schema Payload Validation for Protocol Buffer
description: Schema Payload Validation for Protocol Buffer
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# What is a Schema Payload Validation Policy Interceptor?

Avoid outages from missing or badly formatted records, ensure all messages adhere to a schema.

This interceptor also supports validating payload against specific constraints for AvroSchema and JsonSchema.

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

[![asciicast](https://asciinema.org/a/p80Cn5EPIHmCfmmTOmh5CpnXR.svg)](https://asciinema.org/a/p80Cn5EPIHmCfmmTOmh5CpnXR)

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
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container gateway2  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container zookeeper  Healthy
 Container kafka3  Healthy
 Container schema-registry  Healthy
 Container kafka1  Healthy
 Container gateway2  Healthy
 Container kafka2  Healthy
 Container gateway1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/DkhTGSrF3jntBnfNIYewVxfZm.svg)](https://asciinema.org/a/DkhTGSrF3jntBnfNIYewVxfZm)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNDQ2NjY4OH0.TwDMJy5lFxvgNCPkKwH49RewL_s72XnIqQHN8Ezgwyc';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/Rkc9R5PgBFMripwLXtca4Xw9H.svg)](https://asciinema.org/a/Rkc9R5PgBFMripwLXtca4Xw9H)

</TabItem>
</Tabs>

## Creating topic topic-protobuf on teamA

Creating on `teamA`:

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
    --topic topic-protobuf
```


</TabItem>
<TabItem value="Output">

```
Created topic topic-protobuf.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/qXmvgukUqszpyTwS2VHvTO1tW.svg)](https://asciinema.org/a/qXmvgukUqszpyTwS2VHvTO1tW)

</TabItem>
</Tabs>

## Review the example protocol buffer schema

Review the example protocol buffer schema

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
  string name = 1;
  int32 age = 2;
  string email = 3;
  Address address = 4;
  repeated string hobbies = 5;
  repeated Friend friends = 6;

  message Address {
    string street = 1;
    string city = 2;
  }

  message Friend {
    string name = 1;
    int32 age = 2;
  }
}
```
</TabItem>
</Tabs>

## Let's register it to the Schema Registry



<Tabs>
<TabItem value="Command">


```sh
curl -s \
  http://localhost:8081/subjects/topic-protobuf/versions \
  -X POST \
  -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data "{\"schemaType\": \"PROTOBUF\", \"schema\": $(cat user-schema.proto | jq -Rs)}"
```


</TabItem>
<TabItem value="Output">

```
{"id":1}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/0SBcJlla8C8UuC1phhNNyoMz0.svg)](https://asciinema.org/a/0SBcJlla8C8UuC1phhNNyoMz0)

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
    kafka-protobuf-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic topic-protobuf \
        --property schema.registry.url=http://localhost:8081 \
        --property value.schema.id=1
```


</TabItem>
<TabItem value="Output">

```
[2024-01-31 09:44:52,372] INFO KafkaProtobufSerializerConfig values: 
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

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/cTKuG3NgdwuYDuKpRBzBRmXUu.svg)](https://asciinema.org/a/cTKuG3NgdwuYDuKpRBzBRmXUu)

</TabItem>
</Tabs>

## Let's consume it back

That's pretty bad, you are going to propagate wrong data within your system!

<Tabs>
<TabItem value="Command">


```sh
kafka-protobuf-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic topic-protobuf \
    --from-beginning \
    --timeout-ms 3000
```


</TabItem>
<TabItem value="Output">

```
[2024-01-31 09:44:54,306] INFO KafkaProtobufDeserializerConfig values: 
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
	derive.type = false
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
	specific.protobuf.key.type = class java.lang.Object
	specific.protobuf.value.type = class java.lang.Object
	use.latest.version = false
	use.latest.with.metadata = null
	use.schema.id = -1
	value.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
 (io.confluent.kafka.serializers.protobuf.KafkaProtobufDeserializerConfig:376)
{"name":"D","age":17,"email":"bad email","address":{"street":"a way too lond adress that will not fit in your database","city":""},"hobbies":["reading"],"friends":[{"name":"Tom","age":17},{"name":"Emma","age":18}]}
[2024-01-31 09:44:58,443] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$:44)
org.apache.kafka.common.errors.TimeoutException
[2024-01-31 09:44:58,443] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$:44)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/uglzHtwGZxiNIk5dmzvEb1egj.svg)](https://asciinema.org/a/uglzHtwGZxiNIk5dmzvEb1egj)

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

[![asciicast](https://asciinema.org/a/exjsvt0iLOuRbF0A3pnqhhQ88.svg)](https://asciinema.org/a/exjsvt0iLOuRbF0A3pnqhhQ88)

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

[![asciicast](https://asciinema.org/a/9hJ2CHtfxpfJ4vG45mffVSVYz.svg)](https://asciinema.org/a/9hJ2CHtfxpfJ4vG45mffVSVYz)

</TabItem>
</Tabs>

## Review the protocol buffer schema with validation rules

Review the protocol buffer schema with validation rules

<Tabs>
<TabItem value="Command">

```sh
cat user-schema-with-validation-rules.proto
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
    string street = 1 [(confluent.field_meta).params = {minLength: "5", maxLength: "15"}];
    string city = 2 [(confluent.field_meta).params = {minLength: "2", maxLength: "50"}];
  }

  message Friend {
    string name = 1 [(confluent.field_meta).params = {minLength: "3", maxLength: "10"}];
    int32 age = 2 [(confluent.field_meta).params = {minimum: "2", maximum: "10"}];
  }
}
```
</TabItem>
</Tabs>

## Let's update the schema with our validation rules



<Tabs>
<TabItem value="Command">


```sh
curl -s \
  http://localhost:8081/subjects/topic-protobuf/versions \
  -X POST \
  -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data "{\"schemaType\": \"PROTOBUF\", \"schema\": $(cat user-schema-with-validation-rules.proto  | jq -Rs)}"
```


</TabItem>
<TabItem value="Output">

```
{"id":2}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/aIu2Zt0v74HnUlGx93X8hqfrN.svg)](https://asciinema.org/a/aIu2Zt0v74HnUlGx93X8hqfrN)

</TabItem>
</Tabs>

## Let's asserts number of registered schemas



<Tabs>
<TabItem value="Command">


```sh
curl -s http://localhost:8081/subjects/topic-protobuf/versions
```


</TabItem>
<TabItem value="Output">

```
[1,2]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/RvEKwTtgGRUoclOE2v60xpnLS.svg)](https://asciinema.org/a/RvEKwTtgGRUoclOE2v60xpnLS)

</TabItem>
</Tabs>

## Let's produce the same invalid payload again

The payload has been rejected with useful errors

```
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. 
Topic 'topic-protobuf' has invalid protobuf schema payload: name is too short (1 < 3), email does not match format 'email', street is too long (56 > 15), city is too short (0 < 2), hobbies has too few items (1 < 2), age is greater than 10, age is greater than 10
```

<Tabs>
<TabItem value="Command">


```sh
cat invalid-payload.json | jq -c | \
    kafka-protobuf-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic topic-protobuf \
        --property schema.registry.url=http://localhost:8081 \
        --property value.schema.id=2
```


</TabItem>
<TabItem value="Output">

```
[2024-01-31 09:45:00,239] INFO KafkaProtobufSerializerConfig values: 
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
[2024-01-31 09:45:01,782] ERROR Error when sending message to topic topic-protobuf with key: null, value: 110 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback:52)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'topic-protobuf' has invalid protobuf schema payload: Student.name is too short (1 < 3), Student.email does not match format 'email', Student.Address.street is too long (56 > 15), Student.Address.city is too short (0 < 2), Student.hobbies has too few items (1 < 2), Student.Friend.age is greater than 10, Student.Friend.age is greater than 10
[2024-01-31 09:45:01,782] ERROR Error when sending message to topic topic-protobuf with key: null, value: 110 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback:52)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'topic-protobuf' has invalid protobuf schema payload: Student.name is too short (1 < 3), Student.email does not match format 'email', Student.Address.street is too long (56 > 15), Student.Address.city is too short (0 < 2), Student.hobbies has too few items (1 < 2), Student.Friend.age is greater than 10, Student.Friend.age is greater than 10

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/I4gKMWx2TwBELSXoH4VHJkiqc.svg)](https://asciinema.org/a/I4gKMWx2TwBELSXoH4VHJkiqc)

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
  "id" : "ebb7334f-a5cc-4415-80a2-060a3f595dee",
  "source" : "krn://cluster=rIRGvkSsSeWedsMRmz7WEA",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "teamA",
  "userName" : "sa",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.65.1:41110"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-01-31T08:38:51.241905382Z",
  "eventData" : {
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Topic 'topic-protobuf' has invalid protobuf schema payload: Student.name is too short (1 < 3), Student.email does not match format 'email', Student.Address.street is too long (56 > 15), Student.Address.city is too short (0 < 2), Student.hobbies has too few items (1 < 2), Student.Friend.age is greater than 10, Student.Friend.age is greater than 10"
  }
}
```


</TabItem>
<TabItem value="Output">

```
{"id":"3f166acd-7b7e-48f1-a983-cc101539ca00","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.80.6:8888","remoteAddress":"192.168.65.1:55568"},"specVersion":"0.1.0","time":"2024-01-31T08:44:48.355621380Z","eventData":{"method":"POST","path":"/admin/vclusters/v1/vcluster/teamA/username/sa","body":"{\"lifeTimeSeconds\": 7776000}"}}
{"id":"cc4bd8aa-4123-42dd-9df5-8f52078bf4a4","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.80.6:6969","remoteAddress":"/192.168.65.1:40430"},"specVersion":"0.1.0","time":"2024-01-31T08:44:50.155052298Z","eventData":"SUCCESS"}
{"id":"74cfe31e-27b0-47f5-9634-30a1194cc40c","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.80.6:6969","remoteAddress":"/192.168.65.1:40431"},"specVersion":"0.1.0","time":"2024-01-31T08:44:50.280722506Z","eventData":"SUCCESS"}
{"id":"7bb740fa-3ca4-4c2d-a598-820bbba7d386","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.80.6:6969","remoteAddress":"/192.168.65.1:40434"},"specVersion":"0.1.0","time":"2024-01-31T08:44:53.194771257Z","eventData":"SUCCESS"}
{"id":"43ef25ce-33c2-4dfe-8383-500ec293ca41","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.80.6:6971","remoteAddress":"/192.168.65.1:43608"},"specVersion":"0.1.0","time":"2024-01-31T08:44:53.303220841Z","eventData":"SUCCESS"}
{"id":"bec44c2b-8ddf-47b8-891e-a37d5d3d8b3b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.80.6:6969","remoteAddress":"/192.168.65.1:40447"},"specVersion":"0.1.0","time":"2024-01-31T08:44:54.845650675Z","eventData":"SUCCESS"}
{"id":"e446e36c-156b-4bd2-a518-64ef1312e025","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.80.6:6971","remoteAddress":"/192.168.65.1:43621"},"specVersion":"0.1.0","time":"2024-01-31T08:44:54.931494633Z","eventData":"SUCCESS"}
{"id":"ac760ecd-3412-4b2e-9ee1-cc62e705844d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.80.6:6971","remoteAddress":"/192.168.65.1:43622"},"specVersion":"0.1.0","time":"2024-01-31T08:44:55.193393508Z","eventData":"SUCCESS"}
{"id":"68d81e2a-728b-4c13-8ca7-59bfc832cb9a","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.80.6:8888","remoteAddress":"192.168.65.1:55590"},"specVersion":"0.1.0","time":"2024-01-31T08:44:58.938169885Z","eventData":{"method":"POST","path":"/admin/interceptors/v1/vcluster/teamA/interceptor/guard-schema-payload-validate","body":"{  \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin\",  \"priority\" : 100,  \"config\" : {    \"schemaRegistryConfig\" : {      \"host\" : \"http://schema-registry:8081\"    },    \"topic\" : \"topic-.*\",    \"schemaIdRequired\" : true,    \"validateSchema\" : true,    \"action\" : \"BLOCK\"  }}"}}
{"id":"2a043bf0-e019-480d-aea0-f462b10de44c","source":"Optional.empty","type":"REST_API","authenticationPrincipal":"admin","userName":null,"connection":{"localAddress":"192.168.80.6:8888","remoteAddress":"192.168.65.1:55591"},"specVersion":"0.1.0","time":"2024-01-31T08:44:59.512399427Z","eventData":{"method":"GET","path":"/admin/interceptors/v1/vcluster/teamA","body":null}}
{"id":"ecf233c6-5d2f-45f4-a64e-aa257a872ab0","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.80.6:6969","remoteAddress":"/192.168.65.1:40456"},"specVersion":"0.1.0","time":"2024-01-31T08:45:01.039754428Z","eventData":"SUCCESS"}
{"id":"b113a48a-3cfa-4991-995a-f08fb29b6fdb","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":"/192.168.80.6:6971","remoteAddress":"/192.168.65.1:43630"},"specVersion":"0.1.0","time":"2024-01-31T08:45:01.106420845Z","eventData":"SUCCESS"}
{"id":"28ab85cd-5d3c-4d25-893f-b30c60314d12","source":"krn://cluster=ti0863LvSG62-4QcZGXjRQ","type":"SAFEGUARD","authenticationPrincipal":"teamA","userName":"sa","connection":{"localAddress":null,"remoteAddress":"/192.168.65.1:43630"},"specVersion":"0.1.0","time":"2024-01-31T08:45:01.758712970Z","eventData":{"level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'topic-protobuf' has invalid protobuf schema payload: Student.name is too short (1 < 3), Student.email does not match format 'email', Student.Address.street is too long (56 > 15), Student.Address.city is too short (0 < 2), Student.hobbies has too few items (1 < 2), Student.Friend.age is greater than 10, Student.Friend.age is greater than 10"}}
[2024-01-31 09:45:06,366] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 13 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/fzJbdBCQNl7FV2EOC0lG9YxtG.svg)](https://asciinema.org/a/fzJbdBCQNl7FV2EOC0lG9YxtG)

</TabItem>
</Tabs>

## Let's now produce a valid payload



<Tabs>
<TabItem value="Command">


```sh
cat valid-payload.json | jq -c | \
    kafka-protobuf-console-producer \
        --bootstrap-server localhost:6969 \
        --producer.config teamA-sa.properties \
        --topic topic-protobuf \
        --property schema.registry.url=http://localhost:8081 \
        --property value.schema.id=2
```


</TabItem>
<TabItem value="Output">

```
[2024-01-31 09:45:07,337] INFO KafkaProtobufSerializerConfig values: 
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

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/if3PjpgfKjYwIruazSqFVhb5m.svg)](https://asciinema.org/a/if3PjpgfKjYwIruazSqFVhb5m)

</TabItem>
</Tabs>

## And consume it back



<Tabs>
<TabItem value="Command">


```sh
kafka-protobuf-console-consumer \
    --bootstrap-server localhost:6969 \
    --consumer.config teamA-sa.properties \
    --topic topic-protobuf \
    --from-beginning \
    --timeout-ms 3000
```


</TabItem>
<TabItem value="Output">

```
[2024-01-31 09:45:08,993] INFO KafkaProtobufDeserializerConfig values: 
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
	derive.type = false
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
	specific.protobuf.key.type = class java.lang.Object
	specific.protobuf.value.type = class java.lang.Object
	use.latest.version = false
	use.latest.with.metadata = null
	use.schema.id = -1
	value.subject.name.strategy = class io.confluent.kafka.serializers.subject.TopicNameStrategy
 (io.confluent.kafka.serializers.protobuf.KafkaProtobufDeserializerConfig:376)
{"name":"D","age":17,"email":"bad email","address":{"street":"a way too lond adress that will not fit in your database","city":""},"hobbies":["reading"],"friends":[{"name":"Tom","age":17},{"name":"Emma","age":18}]}
{"name":"Doe","age":17,"email":"john.doe@example.com","address":{"street":"123 Main St","city":"Anytown"},"hobbies":["reading","cycling"],"friends":[{"name":"Tom","age":9},{"name":"Emma","age":10}]}
[2024-01-31 09:45:12,898] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$:44)
org.apache.kafka.common.errors.TimeoutException
[2024-01-31 09:45:12,898] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$:44)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/pDCG2n7dWICzxjZMSjcOmRJD2.svg)](https://asciinema.org/a/pDCG2n7dWICzxjZMSjcOmRJD2)

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
 Container gateway1  Stopping
 Container gateway2  Stopping
 Container schema-registry  Stopping
 Container gateway2  Stopped
 Container gateway2  Removing
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway1  Removed
 Container gateway2  Removed
 Container schema-registry  Removed
 Container kafka3  Stopping
 Container kafka2  Stopping
 Container kafka1  Stopping
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container kafka1  Removed
 Container kafka3  Removed
 Container zookeeper  Stopping
 Container zookeeper  Stopped
 Container zookeeper  Removing
 Container zookeeper  Removed
 Network safeguard-validate-schema-payload-proto_default  Removing
 Network safeguard-validate-schema-payload-proto_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/dk7hPa9JHSLsEqycHg73VG35K.svg)](https://asciinema.org/a/dk7hPa9JHSLsEqycHg73VG35K)

</TabItem>
</Tabs>

# Conclusion

You can enrich your existing schema to add even more data quality to your systems!

