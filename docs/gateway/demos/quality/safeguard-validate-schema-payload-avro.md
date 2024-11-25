---
title: Schema Payload Validation for Avro
description: Schema Payload Validation for Avro
tag: data-quality
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# What is a Schema Payload Validation Policy Interceptor?

Avoid outages from missing or badly formatted records, ensure all messages adhere to a schema.

This interceptor also supports validating payload against specific constraints for AvroSchema and Protobuf.

This is similar to the validations provided by JsonSchema, such as:

- **Number**: `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `multipleOf`
- **String**: `minLength`, `maxLength`, `pattern`, `format`
- **Collections**: `maxItems`, `minItems`

This interceptor also supports validating payload against specific custom constraints `expression`,
which uses a simple language familiar with devs is [CEL (Common Expression Language)](https://github.com/google/cel-spec)

This interceptor also supports validating payload against specific custom `metadata.rules` object in the schema
using CEL, too.

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690237.svg)](https://asciinema.org/a/690237)

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
 Network safeguard-validate-schema-payload-avro_default  Creating
 Network safeguard-validate-schema-payload-avro_default  Created
 Container kafka1  Creating
 Container kafka3  Creating
 Container kafka2  Creating
 Container kafka-client  Creating
 Container kafka1  Created
 Container kafka-client  Created
 Container kafka2  Created
 Container kafka3  Created
 Container gateway1  Creating
 Container gateway2  Creating
 Container schema-registry  Creating
 Container gateway2  Created
 Container schema-registry  Created
 Container gateway1  Created
 Container kafka3  Starting
 Container kafka1  Starting
 Container kafka-client  Starting
 Container kafka2  Starting
 Container kafka3  Started
 Container kafka1  Started
 Container kafka2  Started
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka-client  Started
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container gateway1  Starting
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container gateway2  Starting
 Container kafka3  Healthy
 Container schema-registry  Starting
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
 Container kafka-client  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container schema-registry  Healthy
 Container gateway2  Healthy
 Container gateway1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690223.svg)](https://asciinema.org/a/690223)

</TabItem>
</Tabs>

## Creating topic topic-avro on gateway1

Creating on `gateway1`:

* Topic `topic-avro` with partitions:1 and replication-factor:1






<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
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

[![asciicast](https://asciinema.org/a/690224.svg)](https://asciinema.org/a/690224)

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

[![asciicast](https://asciinema.org/a/690225.svg)](https://asciinema.org/a/690225)

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
      "name": "Tommy",
      "age": 17
    },
    {
      "name": "Emma Watson",
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
        --topic topic-avro \
        --property schema.registry.url=http://localhost:8081 \
        --property value.schema.id=1
```


</TabItem>
<TabItem value="Output">

```
[2024-11-17 20:22:54,041] INFO KafkaAvroSerializerConfig values: 
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
 (io.confluent.kafka.serializers.KafkaAvroSerializerConfig:370)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690226.svg)](https://asciinema.org/a/690226)

</TabItem>
</Tabs>

## Let's consume it back

That's pretty bad, you are going to propagate wrong data within your system!






<Tabs>

<TabItem value="Command">
```sh
kafka-avro-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic topic-avro \
    --from-beginning \
    --timeout-ms 3000
```


</TabItem>
<TabItem value="Output">

```
[2024-11-17 20:22:55,360] INFO KafkaAvroDeserializerConfig values: 
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
 (io.confluent.kafka.serializers.KafkaAvroDeserializerConfig:370)
{"name":"D","age":17,"email":"bad email","address":{"street":"a way too lond adress that will not fit in your database","city":""},"hobbies":["reading"],"friends":[{"name":"Tommy","age":17},{"name":"Emma Watson","age":18}]}
[2024-11-17 20:22:59,354] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$:45)
org.apache.kafka.common.errors.TimeoutException
[2024-11-17 20:22:59,354] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$:45)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690227.svg)](https://asciinema.org/a/690227)

</TabItem>
</Tabs>

## Adding interceptor guard-schema-payload-validate

Add Schema Payload Validation Policy Interceptor




`step-11-guard-schema-payload-validate-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "guard-schema-payload-validate"
  },
  "spec" : {
    "comment" : "Adding interceptor: guard-schema-payload-validate",
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
    --data @step-11-guard-schema-payload-validate-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "guard-schema-payload-validate",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: guard-schema-payload-validate",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
      "priority": 100,
      "config": {
        "schemaRegistryConfig": {
          "host": "http://schema-registry:8081"
        },
        "validateSchema": true,
        "topic": "topic-.*",
        "schemaIdRequired": true,
        "action": "BLOCK"
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690228.svg)](https://asciinema.org/a/690228)

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
      "name": "guard-schema-payload-validate",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: guard-schema-payload-validate",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
      "priority": 100,
      "config": {
        "schemaRegistryConfig": {
          "host": "http://schema-registry:8081"
        },
        "validateSchema": true,
        "topic": "topic-.*",
        "schemaIdRequired": true,
        "action": "BLOCK"
      }
    }
  }
]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690229.svg)](https://asciinema.org/a/690229)

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
    {"name": "name", "type": "string", "minLength": 3, "maxLength": 50, "expression": "size(name) >= 3 && size(name) <= 50"},
    {"name": "age", "type": "int", "minimum": 0, "maximum": 120, "expression": "age >= 0 && age <= 120"},
    {"name": "email", "type": "string", "format": "email", "expression": "email.contains('foo')"},
    {
      "name": "address",
      "type": {
        "type": "record",
        "name": "AddressRecord",
        "fields": [
          {"name": "street", "type": "string", "minLength": 5, "maxLength": 15, "expression": "size(street) >= 5 && size(street) <= 15"},
          {"name": "city", "type": "string", "minLength": 2, "maxLength": 50}
        ]
      },
      "expression": "size(address.street) >= 5 && address.street.contains('paris') || address.city == 'paris'"
    },
    {"name": "hobbies", "type": {"type": "array", "items": "string"}, "minItems": 2, "expression": "size(hobbies) >= 2"},
    {
      "name": "friends",
      "type": {
        "type": "array",
        "items": {
          "type": "record",
          "name": "Friend",
          "fields": [
            {"name": "name", "type": "string", "expression": "size(name) <= 4"},
            {"name": "age", "type": "int", "minimum": 2, "maximum": 10}
          ]
        }
      }
    }
  ],
  "metadata": {
    "rules": [
      {
        "name": "check hobbies size",
        "expression": "size(message.hobbies) == 2",
        "message": "hobbies must have 2 items"
      },
      {
        "name": "checkAge",
        "expression": "message.age >= 18",
        "message": "age must be greater than or equal to 18"
      },
      {
        "name": "check email",
        "expression": "message.email.endsWith('example.com')",
        "message": "email should end with 'example.com'"
      },
      {
        "name": "check street",
        "expression": "size(message.address.street) >= 3",
        "message": "address.street length must be greater than equal to 3"
      }
    ]
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

[![asciicast](https://asciinema.org/a/690230.svg)](https://asciinema.org/a/690230)

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

[![asciicast](https://asciinema.org/a/690231.svg)](https://asciinema.org/a/690231)

</TabItem>
</Tabs>

## Let's produce the same invalid payload again

The payload has been rejected with useful errors

```
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. 
Topic 'topic-avro' has invalid avro schema payload: hobbies must have 2 items, age must be greater than or equal to 18, email should end with 'example.com', name is too short (1 < 3), name does not match expression 'size(name) >= 3 && size(name) <= 50', email does not match format 'email', email does not match expression 'email.contains('foo')', street is too long (56 > 15), street does not match expression 'size(street) >= 5 && size(street) <= 15', city is too short (0 < 2), address does not match expression 'size(address.street) >= 5 && address.street.contains('paris') || address.city == 'paris'', hobbies has too few items (1 < 2), hobbies does not match expression 'size(hobbies) >= 2', name does not match expression 'size(name) <= 4', age is greater than 10, name does not match expression 'size(name) <= 4', age is greater than 10
```






<Tabs>

<TabItem value="Command">
```sh
cat invalid-payload.json | jq -c | \
    kafka-avro-console-producer \
        --bootstrap-server localhost:6969 \
        --topic topic-avro \
        --property schema.registry.url=http://localhost:8081 \
        --property value.schema.id=2
```


</TabItem>
<TabItem value="Output">

```
[2024-11-17 20:23:01,515] INFO KafkaAvroSerializerConfig values: 
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
 (io.confluent.kafka.serializers.KafkaAvroSerializerConfig:370)
[2024-11-17 20:23:02,403] ERROR Error when sending message to topic topic-avro with key: null, value: 108 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback:52)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: hobbies must have 2 items, age must be greater than or equal to 18, email should end with 'example.com', name is too short (1 < 3), name does not match expression 'size(name) >= 3 step-16-SH-OUTPUTstep-16-SH-OUTPUT size(name) <= 50', email does not match format 'email', email does not match expression 'email.contains('foo')', street is too long (56 > 15), street does not match expression 'size(street) >= 5 step-16-SH-OUTPUTstep-16-SH-OUTPUT size(street) <= 15', city is too short (0 < 2), address does not match expression 'size(address.street) >= 5 step-16-SH-OUTPUTstep-16-SH-OUTPUT address.street.contains('paris') || address.city == 'paris'', hobbies has too few items (1 < 2), hobbies does not match expression 'size(hobbies) >= 2', name does not match expression 'size(name) <= 4', age is greater than 10, name does not match expression 'size(name) <= 4', age is greater than 10
[2024-11-17 20:23:02,403] ERROR Error when sending message to topic topic-avro with key: null, value: 108 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback:52)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: hobbies must have 2 items, age must be greater than or equal to 18, email should end with 'example.com', name is too short (1 < 3), name does not match expression 'size(name) >= 3 step-16-SH-OUTPUTstep-16-SH-OUTPUT size(name) <= 50', email does not match format 'email', email does not match expression 'email.contains('foo')', street is too long (56 > 15), street does not match expression 'size(street) >= 5 step-16-SH-OUTPUTstep-16-SH-OUTPUT size(street) <= 15', city is too short (0 < 2), address does not match expression 'size(address.street) >= 5 step-16-SH-OUTPUTstep-16-SH-OUTPUT address.street.contains('paris') || address.city == 'paris'', hobbies has too few items (1 < 2), hobbies does not match expression 'size(hobbies) >= 2', name does not match expression 'size(name) <= 4', age is greater than 10, name does not match expression 'size(name) <= 4', age is greater than 10

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690232.svg)](https://asciinema.org/a/690232)

</TabItem>
</Tabs>

## Check in the audit log that message was denied

Check in the audit log that message was denied in cluster `kafka1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:9092,localhost:9093,localhost:9094 \
    --topic _conduktor_gateway_auditlogs \
    --from-beginning \
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin")'
```


returns 1 event
```json
{
  "id" : "25cb4ba1-37a6-42a8-baad-68be330f1ce9",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/172.29.0.1:58384"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-17T20:22:11.698055963Z",
  "eventData" : {
    "interceptorName" : "guard-schema-payload-validate",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: hobbies must have 2 items, age must be greater than or equal to 18, email should end with 'example.com', name is too short (1 < 3), name does not match expression 'size(name) >= 3 && size(name) <= 50', email does not match format 'email', email does not match expression 'email.contains('foo')', street is too long (56 > 15), street does not match expression 'size(street) >= 5 && size(street) <= 15', city is too short (0 < 2), address does not match expression 'size(address.street) >= 5 && address.street.contains('paris') || address.city == 'paris'', hobbies has too few items (1 < 2), hobbies does not match expression 'size(hobbies) >= 2', name does not match expression 'size(name) <= 4', age is greater than 10, name does not match expression 'size(name) <= 4', age is greater than 10"
  }
}
```

</TabItem>
<TabItem value="Output">

```
{"id":"c817aff9-ba44-40ae-a749-e73f29c5a73b","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.30.0.8:6969","remoteAddress":"/172.30.0.1:59798"},"specVersion":"0.1.0","time":"2024-11-17T20:22:52.347175218Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"178e8d08-9ed5-4814-8e2c-08793f5706db","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.30.0.8:6969","remoteAddress":"/172.30.0.1:59798"},"specVersion":"0.1.0","time":"2024-11-17T20:22:52.370528843Z","eventData":"SUCCESS"}
{"id":"b516d8b3-2441-4864-b1ed-53079bfe2ea9","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.30.0.8:6971","remoteAddress":"/172.30.0.1:37188"},"specVersion":"0.1.0","time":"2024-11-17T20:22:52.499403551Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"5f38d17a-7b4b-49f6-b915-415892ed81d1","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.30.0.8:6971","remoteAddress":"/172.30.0.1:37188"},"specVersion":"0.1.0","time":"2024-11-17T20:22:52.500115218Z","eventData":"SUCCESS"}
{"id":"dd283d83-1fc8-4f2e-ad33-cb8b12da0b6e","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.30.0.8:6969","remoteAddress":"/172.30.0.1:59802"},"specVersion":"0.1.0","time":"2024-11-17T20:22:54.256213344Z","eventData":{"clientSoftwareVersion":"7.5.1-ce","clientSoftwareName":"apache-kafka-java"}}
{"id":"676c5912-dab1-4c39-a387-ef39aab91578","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.30.0.8:6969","remoteAddress":"/172.30.0.1:59802"},"specVersion":"0.1.0","time":"2024-11-17T20:22:54.257077260Z","eventData":"SUCCESS"}
{"id":"eb480605-1942-4e38-bbb3-ada73dbf3b25","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.30.0.8:6970","remoteAddress":"/172.30.0.1:40982"},"specVersion":"0.1.0","time":"2024-11-17T20:22:54.338337094Z","eventData":{"clientSoftwareVersion":"7.5.1-ce","clientSoftwareName":"apache-kafka-java"}}
{"id":"ca281bf5-1599-4f01-b155-3db77861dafe","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.30.0.8:6970","remoteAddress":"/172.30.0.1:40982"},"specVersion":"0.1.0","time":"2024-11-17T20:22:54.339128344Z","eventData":"SUCCESS"}
{"id":"77320eb6-196b-4504-bfd3-d0211546b643","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.30.0.8:6971","remoteAddress":"/172.30.0.1:37190"},"specVersion":"0.1.0","time":"2024-11-17T20:22:54.456822177Z","eventData":{"clientSoftwareVersion":"7.5.1-ce","clientSoftwareName":"apache-kafka-java"}}
{"id":"4f0c293c-70a0-4aa4-98b8-f03c54b6426c","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.30.0.8:6971","remoteAddress":"/172.30.0.1:37190"},"specVersion":"0.1.0","time":"2024-11-17T20:22:54.457335760Z","eventData":"SUCCESS"}
{"id":"66709550-f8f6-465b-a6fc-26e3404d6994","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.30.0.8:6969","remoteAddress":"/172.30.0.1:59818"},"specVersion":"0.1.0","time":"2024-11-17T20:22:55.803445469Z","eventData":{"clientSoftwareVersion":"7.5.1-ce","clientSoftwareName":"apache-kafka-java"}}
{"id":"933f6edf-d93b-4f7e-90b3-d63091662f53","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.30.0.8:6969","remoteAddress":"/172.30.0.1:59818"},"specVersion":"0.1.0","time":"2024-11-17T20:22:55.804283886Z","eventData":"SUCCESS"}
{"id":"86b869b7-2f5d-4f6f-821e-b4c668580c9d","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.30.0.8:6972","remoteAddress":"/172.30.0.1:34320"},"specVersion":"0.1.0","time":"2024-11-17T20:22:55.973208303Z","eventData":{"clientSoftwareVersion":"7.5.1-ce","clientSoftwareName":"apache-kafka-java"}}
{"id":"4c15a4f1-f002-400c-8f5f-9a1e3fa9fc01","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.30.0.8:6972","remoteAddress":"/172.30.0.1:34320"},"specVersion":"0.1.0","time":"2024-11-17T20:22:55.973783303Z","eventData":"SUCCESS"}
{"id":"a257622d-0100-4f67-ac0c-75128b08d3ed","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.30.0.8:6972","remoteAddress":"/172.30.0.1:34332"},"specVersion":"0.1.0","time":"2024-11-17T20:22:56.009473470Z","eventData":{"clientSoftwareVersion":"7.5.1-ce","clientSoftwareName":"apache-kafka-java"}}
{"id":"6b3379e5-f5a0-4a16-8d9c-7e9beb8dc3ef","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.30.0.8:6972","remoteAddress":"/172.30.0.1:34332"},"specVersion":"0.1.0","time":"2024-11-17T20:22:56.010219678Z","eventData":"SUCCESS"}
{"id":"a31b4d14-3d9a-4cf4-b12b-15ce10ded520","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.30.0.8:6971","remoteAddress":"/172.30.0.1:37192"},"specVersion":"0.1.0","time":"2024-11-17T20:22:56.183108970Z","eventData":{"clientSoftwareVersion":"7.5.1-ce","clientSoftwareName":"apache-kafka-java"}}
{"id":"ece7df43-b6fe-493c-8f20-1d3d4a58fbd4","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.30.0.8:6971","remoteAddress":"/172.30.0.1:37192"},"specVersion":"0.1.0","time":"2024-11-17T20:22:56.183498970Z","eventData":"SUCCESS"}
{"id":"8014c719-c42d-4b4d-85cf-1feac29170b5","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.30.0.8:8888","remoteAddress":"172.30.0.1:48782"},"specVersion":"0.1.0","time":"2024-11-17T20:23:00.295548305Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":"{  \"kind\" : \"Interceptor\",  \"apiVersion\" : \"gateway/v2\",  \"metadata\" : {    \"name\" : \"guard-schema-payload-validate\"  },  \"spec\" : {    \"comment\" : \"Adding interceptor: guard-schema-payload-validate\",    \"pluginClass\" : \"io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin\",    \"priority\" : 100,    \"config\" : {      \"schemaRegistryConfig\" : {        \"host\" : \"http://schema-registry:8081\"      },      \"topic\" : \"topic-.*\",      \"schemaIdRequired\" : true,      \"validateSchema\" : true,      \"action\" : \"BLOCK\"    }  }}"}}
{"id":"70646b29-7197-4ad7-8c90-be7e0b976039","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.30.0.8:8888","remoteAddress":"172.30.0.1:48786"},"specVersion":"0.1.0","time":"2024-11-17T20:23:00.676802722Z","eventData":{"method":"GET","path":"/gateway/v2/interceptor","body":null}}
{"id":"9e88665d-3ba5-44ba-bb4f-bda8fdff26a2","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.30.0.8:6969","remoteAddress":"/172.30.0.1:34558"},"specVersion":"0.1.0","time":"2024-11-17T20:23:01.708589250Z","eventData":{"clientSoftwareVersion":"7.5.1-ce","clientSoftwareName":"apache-kafka-java"}}
{"id":"67373d0b-4d30-470d-9252-6b73879a2ac9","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.30.0.8:6969","remoteAddress":"/172.30.0.1:34558"},"specVersion":"0.1.0","time":"2024-11-17T20:23:01.709399500Z","eventData":"SUCCESS"}
{"id":"7c4a259f-1b7e-4e73-a74e-50025f7ce753","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.30.0.8:6971","remoteAddress":"/172.30.0.1:48338"},"specVersion":"0.1.0","time":"2024-11-17T20:23:01.804246166Z","eventData":{"clientSoftwareVersion":"7.5.1-ce","clientSoftwareName":"apache-kafka-java"}}
{"id":"adef2473-30a8-431e-b289-c6e9fce043d3","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.30.0.8:6971","remoteAddress":"/172.30.0.1:48338"},"specVersion":"0.1.0","time":"2024-11-17T20:23:01.804720791Z","eventData":"SUCCESS"}
{"id":"80318d39-dde3-4d10-a581-27e1a4399a64","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.30.0.8:6972","remoteAddress":"/172.30.0.1:36420"},"specVersion":"0.1.0","time":"2024-11-17T20:23:01.921848125Z","eventData":{"clientSoftwareVersion":"7.5.1-ce","clientSoftwareName":"apache-kafka-java"}}
{"id":"affa22df-0815-44d9-8867-1f092d3323f8","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.30.0.8:6972","remoteAddress":"/172.30.0.1:36420"},"specVersion":"0.1.0","time":"2024-11-17T20:23:01.922553416Z","eventData":"SUCCESS"}
{"id":"dc9673d5-47ee-44a0-bc53-4d9745a1e96a","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.30.0.1:48338"},"specVersion":"0.1.0","time":"2024-11-17T20:23:02.382690125Z","eventData":{"interceptorName":"guard-schema-payload-validate","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Request parameters do not satisfy the configured policy. Topic 'topic-avro' has invalid avro schema payload: hobbies must have 2 items, age must be greater than or equal to 18, email should end with 'example.com', name is too short (1 < 3), name does not match expression 'size(name) >= 3 step-17-AUDITLOG-OUTPUTstep-17-AUDITLOG-OUTPUT size(name) <= 50', email does not match format 'email', email does not match expression 'email.contains('foo')', street is too long (56 > 15), street does not match expression 'size(street) >= 5 step-17-AUDITLOG-OUTPUTstep-17-AUDITLOG-OUTPUT size(street) <= 15', city is too short (0 < 2), address does not match expression 'size(address.street) >= 5 step-17-AUDITLOG-OUTPUTstep-17-AUDITLOG-OUTPUT address.street.contains('paris') || address.city == 'paris'', hobbies has too few items (1 < 2), hobbies does not match expression 'size(hobbies) >= 2', name does not match expression 'size(name) <= 4', age is greater than 10, name does not match expression 'size(name) <= 4', age is greater than 10"}}
[2024-11-17 20:23:06,828] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 27 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690233.svg)](https://asciinema.org/a/690233)

</TabItem>
</Tabs>

## Let's now produce a valid payload








<Tabs>

<TabItem value="Command">
```sh
cat valid-payload.json | jq -c | \
    kafka-avro-console-producer \
        --bootstrap-server localhost:6969 \
        --topic topic-avro \
        --property schema.registry.url=http://localhost:8081 \
        --property value.schema.id=2
```


</TabItem>
<TabItem value="Output">

```
[2024-11-17 20:23:07,876] INFO KafkaAvroSerializerConfig values: 
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
 (io.confluent.kafka.serializers.KafkaAvroSerializerConfig:370)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690234.svg)](https://asciinema.org/a/690234)

</TabItem>
</Tabs>

## And consume it back








<Tabs>

<TabItem value="Command">
```sh
kafka-avro-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic topic-avro \
    --from-beginning \
    --timeout-ms 3000
```


</TabItem>
<TabItem value="Output">

```
[2024-11-17 20:23:09,161] INFO KafkaAvroDeserializerConfig values: 
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
 (io.confluent.kafka.serializers.KafkaAvroDeserializerConfig:370)
{"name":"D","age":17,"email":"bad email","address":{"street":"a way too lond adress that will not fit in your database","city":""},"hobbies":["reading"],"friends":[{"name":"Tommy","age":17},{"name":"Emma Watson","age":18}]}
{"name":"Doe","age":18,"email":"foo.doe@example.com","address":{"street":"123 Main paris","city":"Anytown paris"},"hobbies":["reading","cycling"],"friends":[{"name":"Tom","age":9},{"name":"Emma","age":10}]}
[2024-11-17 20:23:13,008] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$:45)
org.apache.kafka.common.errors.TimeoutException
[2024-11-17 20:23:13,008] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$:45)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 2 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690235.svg)](https://asciinema.org/a/690235)

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
 Container kafka-client  Stopping
 Container gateway2  Stopping
 Container schema-registry  Stopping
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway2  Removed
 Container gateway1  Removed
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container schema-registry  Removed
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Network safeguard-validate-schema-payload-avro_default  Removing
 Network safeguard-validate-schema-payload-avro_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690236.svg)](https://asciinema.org/a/690236)

</TabItem>
</Tabs>

# Conclusion

You can enrich your existing schema to add even more data quality to your systems!

