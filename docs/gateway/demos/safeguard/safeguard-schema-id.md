---
title: SchemaId Validation
description: SchemaId Validation
tag: safeguard
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Schema Id validation



## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690206.svg)](https://asciinema.org/a/690206)

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
 Network safeguard-schema-id_default  Creating
 Network safeguard-schema-id_default  Created
 Container kafka-client  Creating
 Container kafka1  Creating
 Container kafka2  Creating
 Container kafka3  Creating
 Container kafka2  Created
 Container kafka1  Created
 Container kafka3  Created
 Container schema-registry  Creating
 Container gateway2  Creating
 Container gateway1  Creating
 Container kafka-client  Created
 Container gateway1  Created
 Container gateway2  Created
 Container schema-registry  Created
 Container kafka3  Starting
 Container kafka1  Starting
 Container kafka-client  Starting
 Container kafka2  Starting
 Container kafka3  Started
 Container kafka2  Started
 Container kafka1  Started
 Container kafka2  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka-client  Started
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container schema-registry  Starting
 Container kafka1  Healthy
 Container gateway2  Starting
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container gateway1  Starting
 Container gateway2  Started
 Container schema-registry  Started
 Container gateway1  Started
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka-client  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container gateway2  Healthy
 Container schema-registry  Healthy
 Container gateway1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690195.svg)](https://asciinema.org/a/690195)

</TabItem>
</Tabs>

## Creating topic users on gateway1

Creating on `gateway1`:

* Topic `users` with partitions:1 and replication-factor:1






<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic users
```


</TabItem>
<TabItem value="Output">

```
Created topic users.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690196.svg)](https://asciinema.org/a/690196)

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
users

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690197.svg)](https://asciinema.org/a/690197)

</TabItem>
</Tabs>

## Adding interceptor schema-id






`step-07-schema-id-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "schema-id"
  },
  "spec" : {
    "comment" : "Adding interceptor: schema-id",
    "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.TopicRequiredSchemaIdPolicyPlugin",
    "priority" : 100,
    "config" : {
      "topic" : "users",
      "schemaIdRequired" : true
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
    --data @step-07-schema-id-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "schema-id",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: schema-id",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.TopicRequiredSchemaIdPolicyPlugin",
      "priority": 100,
      "config": {
        "topic": "users",
        "schemaIdRequired": true
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690198.svg)](https://asciinema.org/a/690198)

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
      "name": "schema-id",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: schema-id",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.TopicRequiredSchemaIdPolicyPlugin",
      "priority": 100,
      "config": {
        "topic": "users",
        "schemaIdRequired": true
      }
    }
  }
]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690199.svg)](https://asciinema.org/a/690199)

</TabItem>
</Tabs>

## Producing 1 message in users

Producing 1 message in `users` in cluster `gateway1`




Sending 1 event
```json
{
  "msg" : "hello world"
}
```



<Tabs>

<TabItem value="Command">
```sh
echo '{"msg":"hello world"}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic users
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> org.apache.kafka.common.errors.PolicyViolationException:
>> Request parameters do not satisfy the configured policy. Request parameters do not satisfy the configured policy.
>>Topic 'users' with schemaId is required.
> ```



</TabItem>
<TabItem value="Output">

```
>>[2024-11-17 20:09:11,901] ERROR Error when sending message to topic users with key: null, value: 21 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Request parameters do not satisfy the configured policy. Topic 'users' with schemaId is required.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690200.svg)](https://asciinema.org/a/690200)

</TabItem>
</Tabs>

## Consuming from users

Consuming from users in cluster `gateway1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic users \
    --from-beginning \
    --max-messages 1 \
    --timeout-ms 3000 | jq
```


</TabItem>
<TabItem value="Output">

```json
[2024-11-17 20:09:16,029] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 0 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690201.svg)](https://asciinema.org/a/690201)

</TabItem>
</Tabs>

## Send avro message








<Tabs>

<TabItem value="Command">
```sh
echo '{
    "name": "conduktor",
    "username": "test@conduktor.io",
    "password": "password1",
    "visa": "visa123456",
    "address": "Conduktor Towers, London"
}' | \
  jq -c | \
      kafka-json-schema-console-producer  \
        --bootstrap-server localhost:6969 \
        --topic users \
        --property schema.registry.url=http://localhost:8081 \
        --property value.schema='{
            "title": "User",
            "type": "object",
            "properties": {
                "name": { "type": "string" },
                "username": { "type": "string" },
                "password": { "type": "string" },
                "visa": { "type": "string" },
                "address": { "type": "string" }
            }
        }'
```


</TabItem>
<TabItem value="Output">

```
[2024-11-17 20:09:17,793] INFO KafkaJsonSchemaSerializerConfig values: 
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

[![asciicast](https://asciinema.org/a/690202.svg)](https://asciinema.org/a/690202)

</TabItem>
</Tabs>

## Get subjects








<Tabs>

<TabItem value="Command">
```sh
curl --silent http://localhost:8081/subjects/ | jq     
```


</TabItem>
<TabItem value="Output">

```
[
  "users-value"
]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690203.svg)](https://asciinema.org/a/690203)

</TabItem>
</Tabs>

## Consuming from users

Consuming from users in cluster `gateway1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic users \
    --from-beginning \
    --max-messages 2 \
    --timeout-ms 3000 | jq
```


</TabItem>
<TabItem value="Output">

```json
[2024-11-17 20:09:23,422] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 1 messages
0
{
  "name": "conduktor",
  "username": "test@conduktor.io",
  "password": "password1",
  "visa": "visa123456",
  "address": "Conduktor Towers, London"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690204.svg)](https://asciinema.org/a/690204)

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
 Container schema-registry  Stopping
 Container gateway1  Stopping
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway1  Removed
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway2  Removed
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
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Network safeguard-schema-id_default  Removing
 Network safeguard-schema-id_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/690205.svg)](https://asciinema.org/a/690205)

</TabItem>
</Tabs>

# Conclusion

You can now make sure you don't fall because of a wrong message

