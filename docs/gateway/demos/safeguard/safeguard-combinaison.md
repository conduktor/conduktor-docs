---
title: Safeguard
description: Safeguard
tag: safeguard
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# What is a safeguard?

Enforce your rules where it matters

Safeguard ensures that your teams follow your rules and can't break convention. 

Enable your teams, prevent common mistakes, protect your infra.

## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692070.svg)](https://asciinema.org/a/692070)

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
    image: harbor.cdkt.dev/conduktor/conduktor-gateway:3.5.0-SNAPSHOT
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
    image: harbor.cdkt.dev/conduktor/conduktor-gateway:3.5.0-SNAPSHOT
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
 Network safeguard_default  Creating
 Network safeguard_default  Created
 Container kafka2  Creating
 Container kafka3  Creating
 Container kafka-client  Creating
 Container kafka1  Creating
 Container kafka-client  Created
 Container kafka3  Created
 Container kafka2  Created
 Container kafka1  Created
 Container schema-registry  Creating
 Container gateway2  Creating
 Container gateway1  Creating
 Container gateway2  Created
 Container gateway1  Created
 Container schema-registry  Created
 Container kafka-client  Starting
 Container kafka1  Starting
 Container kafka3  Starting
 Container kafka2  Starting
 Container kafka2  Started
 Container kafka1  Started
 Container kafka-client  Started
 Container kafka3  Started
 Container kafka1  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka3  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka2  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container gateway2  Starting
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container schema-registry  Starting
 Container kafka2  Healthy
 Container gateway1  Starting
 Container schema-registry  Started
 Container gateway2  Started
 Container gateway1  Started
 Container gateway2  Waiting
 Container kafka-client  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka-client  Healthy
 Container gateway1  Healthy
 Container gateway2  Healthy
 Container schema-registry  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692038.svg)](https://asciinema.org/a/692038)

</TabItem>
</Tabs>

## Creating topic cars on gateway1

Creating on `gateway1`:

* Topic `cars` with partitions:1 and replication-factor:1






<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic cars
```


</TabItem>
<TabItem value="Output">

```
Created topic cars.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692039.svg)](https://asciinema.org/a/692039)

</TabItem>
</Tabs>

## Producing 3 messages in cars

Produce 3 records to the cars topic.




Sending 3 events
```json
{
  "type" : "Ferrari",
  "color" : "red",
  "price" : 10000
}
{
  "type" : "RollsRoyce",
  "color" : "black",
  "price" : 9000
}
{
  "type" : "Mercedes",
  "color" : "black",
  "price" : 6000
}
```



<Tabs>

<TabItem value="Command">
```sh
echo '{"type":"Ferrari","color":"red","price":10000}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic cars

echo '{"type":"RollsRoyce","color":"black","price":9000}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic cars

echo '{"type":"Mercedes","color":"black","price":6000}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic cars
```


</TabItem>
<TabItem value="Output">

```
>>>>>>

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692040.svg)](https://asciinema.org/a/692040)

</TabItem>
</Tabs>

## Consume the cars topic

Let's confirm the 3 cars are there by consuming from the cars topic.






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic cars \
    --from-beginning \
    --max-messages 4 \
    --timeout-ms 3000 | jq
```


</TabItem>
<TabItem value="Output">

```json
[2024-11-25 21:14:18,186] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 3 messages
{
  "type": "Ferrari",
  "color": "red",
  "price": 10000
}
{
  "type": "RollsRoyce",
  "color": "black",
  "price": 9000
}
{
  "type": "Mercedes",
  "color": "black",
  "price": 6000
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692041.svg)](https://asciinema.org/a/692041)

</TabItem>
</Tabs>

## Describing topic cars

Replication factor is 1? 

This is bad: we can lose data!






<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --describe \
    --topic cars
```


</TabItem>
<TabItem value="Output">

```
Topic: cars	TopicId: bG5H8-kOQUyYciTz-gqOdg	PartitionCount: 1	ReplicationFactor: 1	Configs: 
	Topic: cars	Partition: 0	Leader: 3	Replicas: 3	Isr: 3

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692042.svg)](https://asciinema.org/a/692042)

</TabItem>
</Tabs>

## Adding interceptor guard-on-create-topic

Let's make sure this problem never repeats itself and add a topic creation safeguard. 

... and while we're at it, let's make sure we don't abuse partitions either




`step-09-guard-on-create-topic-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "guard-on-create-topic"
  },
  "spec" : {
    "comment" : "Adding interceptor: guard-on-create-topic",
    "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin",
    "priority" : 100,
    "config" : {
      "replicationFactor" : {
        "min" : 2,
        "max" : 2
      },
      "numPartition" : {
        "min" : 1,
        "max" : 3
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
    --data @step-09-guard-on-create-topic-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "guard-on-create-topic",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: guard-on-create-topic",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin",
      "priority": 100,
      "config": {
        "replicationFactor": {
          "min": 2,
          "max": 2
        },
        "numPartition": {
          "min": 1,
          "max": 3
        }
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692043.svg)](https://asciinema.org/a/692043)

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
      "name": "guard-on-create-topic",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: guard-on-create-topic",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin",
      "priority": 100,
      "config": {
        "replicationFactor": {
          "min": 2,
          "max": 2
        },
        "numPartition": {
          "min": 1,
          "max": 3
        }
      }
    }
  }
]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692044.svg)](https://asciinema.org/a/692044)

</TabItem>
</Tabs>

## Create a topic that is not within policy

Topic creation is denied by our policy






<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --replication-factor 1 \
    --partitions 100 \
    --create --if-not-exists \
    --topic roads
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> org.apache.kafka.common.errors.PolicyViolationException:
>> Request parameters do not satisfy the configured policy.
>>Topic 'roads' with number partitions is '100', must not be greater than 3.
>>Topic 'roads' with replication factor is '1', must not be less than 2
> ```



</TabItem>
<TabItem value="Output">

```
Error while executing topic command : Request parameters do not satisfy the configured policy. Topic 'roads' with number partitions is '100', must not be greater than 3. Topic 'roads' with replication factor is '1', must not be less than 2
[2024-11-25 21:14:21,040] ERROR org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'roads' with number partitions is '100', must not be greater than 3. Topic 'roads' with replication factor is '1', must not be less than 2
 (org.apache.kafka.tools.TopicCommand)

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692045.svg)](https://asciinema.org/a/692045)

</TabItem>
</Tabs>

## Let's now create it again, with parameters within our policy

Perfect, it has been created






<Tabs>

<TabItem value="Command">
```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --replication-factor 2 \
    --partitions 3 \
    --create --if-not-exists \
    --topic roads
```


</TabItem>
<TabItem value="Output">

```
Created topic roads.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692046.svg)](https://asciinema.org/a/692046)

</TabItem>
</Tabs>

## Adding interceptor guard-on-alter-topic

Let's make sure we enforce policies when we alter topics too

Here the retention can only be between 1 and 5 days




`step-13-guard-on-alter-topic-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "guard-on-alter-topic"
  },
  "spec" : {
    "comment" : "Adding interceptor: guard-on-alter-topic",
    "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin",
    "priority" : 100,
    "config" : {
      "retentionMs" : {
        "min" : 86400000,
        "max" : 432000000
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
    --data @step-13-guard-on-alter-topic-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "guard-on-alter-topic",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: guard-on-alter-topic",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin",
      "priority": 100,
      "config": {
        "retentionMs": {
          "min": 86400000,
          "max": 432000000
        }
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692047.svg)](https://asciinema.org/a/692047)

</TabItem>
</Tabs>

## Update 'cars' with a retention of 60 days

Altering the topic is denied by our policy






<Tabs>

<TabItem value="Command">
```sh
kafka-configs \
    --bootstrap-server localhost:6969 \
    --alter \
    --entity-type topics \
    --entity-name roads \
    --add-config retention.ms=5184000000
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> org.apache.kafka.common.errors.PolicyViolationException:
>> Request parameters do not satisfy the configured policy. Resource 'roads' with retention.ms is '5184000000', must not be greater than '432000000'
> ```



</TabItem>
<TabItem value="Output">

```
Error while executing config command with args '--bootstrap-server localhost:6969 --alter --entity-type topics --entity-name roads --add-config retention.ms=5184000000'
java.util.concurrent.ExecutionException: org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Resource 'roads' with retention.ms is '5184000000', must not be greater than '432000000'
	at java.base/java.util.concurrent.CompletableFuture.wrapInExecutionException(CompletableFuture.java:345)
	at java.base/java.util.concurrent.CompletableFuture.reportGet(CompletableFuture.java:440)
	at java.base/java.util.concurrent.CompletableFuture.get(CompletableFuture.java:2140)
	at org.apache.kafka.common.internals.KafkaFutureImpl.get(KafkaFutureImpl.java:180)
	at kafka.admin.ConfigCommand$.alterConfig(ConfigCommand.scala:374)
	at kafka.admin.ConfigCommand$.processCommand(ConfigCommand.scala:341)
	at kafka.admin.ConfigCommand$.main(ConfigCommand.scala:97)
	at kafka.admin.ConfigCommand.main(ConfigCommand.scala)
Caused by: org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Resource 'roads' with retention.ms is '5184000000', must not be greater than '432000000'

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692048.svg)](https://asciinema.org/a/692048)

</TabItem>
</Tabs>

## Update 'cars' with a retention of 3 days

Topic updated successfully






<Tabs>

<TabItem value="Command">
```sh
kafka-configs \
    --bootstrap-server localhost:6969 \
    --alter \
    --entity-type topics \
    --entity-name roads \
    --add-config retention.ms=259200000
```


</TabItem>
<TabItem value="Output">

```
Completed updating config for topic roads.

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692049.svg)](https://asciinema.org/a/692049)

</TabItem>
</Tabs>

## Adding interceptor guard-on-produce

Let's make sure we enforce policies also at produce time!

Here message shall be sent with compression and with the right level of resiliency




`step-16-guard-on-produce-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "guard-on-produce"
  },
  "spec" : {
    "comment" : "Adding interceptor: guard-on-produce",
    "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin",
    "priority" : 100,
    "config" : {
      "acks" : {
        "value" : [ -1 ],
        "action" : "BLOCK"
      },
      "compressions" : {
        "value" : [ "NONE", "GZIP" ],
        "action" : "BLOCK"
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
    --data @step-16-guard-on-produce-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "guard-on-produce",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: guard-on-produce",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin",
      "priority": 100,
      "config": {
        "acks": {
          "value": [
            -1
          ],
          "action": "BLOCK"
        },
        "compressions": {
          "value": [
            "NONE",
            "GZIP"
          ],
          "action": "BLOCK"
        }
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692050.svg)](https://asciinema.org/a/692050)

</TabItem>
</Tabs>

## Produce sample data to our cars topic without the right policies

Produce 1 record ... that do not match our policy




Sending 1 event
```json
{
  "type" : "Fiat",
  "color" : "red",
  "price" : -1
}
```



<Tabs>

<TabItem value="Command">
```sh
echo '{"type":"Fiat","color":"red","price":-1}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --request-required-acks 1 \
        --compression-codec snappy \
        --topic cars
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> org.apache.kafka.common.errors.PolicyViolationException:
>> Request parameters do not satisfy the configured policy.
>>Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1.
>>Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]
> ```



</TabItem>
<TabItem value="Output">

```
>>[2024-11-25 21:14:27,125] ERROR Error when sending message to topic cars with key: null, value: 40 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback)
org.apache.kafka.common.errors.PolicyViolationException: Request parameters do not satisfy the configured policy. Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1. Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692051.svg)](https://asciinema.org/a/692051)

</TabItem>
</Tabs>

## Produce sample data to our cars topic that complies with our policy

Producing a record matching our policy




Sending 1 event
```json
{
  "type" : "Fiat",
  "color" : "red",
  "price" : -1
}
```



<Tabs>

<TabItem value="Command">
```sh
echo '{"type":"Fiat","color":"red","price":-1}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --request-required-acks -1 \
        --compression-codec gzip \
        --topic cars
```


</TabItem>
<TabItem value="Output">

```
>>

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692052.svg)](https://asciinema.org/a/692052)

</TabItem>
</Tabs>

## Adding interceptor produce-rate

Let's add some rate limiting policy on produce




`step-19-produce-rate-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "produce-rate"
  },
  "spec" : {
    "comment" : "Adding interceptor: produce-rate",
    "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin",
    "priority" : 100,
    "config" : {
      "maximumBytesPerSecond" : 1
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
    --data @step-19-produce-rate-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "produce-rate",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: produce-rate",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin",
      "priority": 100,
      "config": {
        "maximumBytesPerSecond": 1
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692053.svg)](https://asciinema.org/a/692053)

</TabItem>
</Tabs>

## Produce sample data

Do not match our produce rate policy




Sending 1 event
```json
{
  "type" : "Fiat",
  "color" : "red",
  "price" : -1
}
```



<Tabs>

<TabItem value="Command">
```sh
echo '{"type":"Fiat","color":"red","price":-1}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --request-required-acks -1 \
        --compression-codec none \
        --topic cars
```


</TabItem>
<TabItem value="Output">

```
>>

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692054.svg)](https://asciinema.org/a/692054)

</TabItem>
</Tabs>

## Check in the audit log that produce was throttled

Check in the audit log that produce was throttled in cluster `kafka1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:9092,localhost:9093,localhost:9094 \
    --topic _conduktor_gateway_auditlogs \
    --from-beginning \
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin")'
```


returns 1 event
```json
{
  "id" : "33412f7a-3e09-4537-b510-7e7671a6dd01",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:49608"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:12:45.687694921Z",
  "eventData" : {
    "interceptorName" : "produce-rate",
    "level" : "warn",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client produced (108) bytes, which is more than 1 bytes per second, producer will be throttled by 827 milliseconds"
  }
}
```

</TabItem>
<TabItem value="Output">

```
{"id":"1c801362-7cb6-4d50-ae8b-de26124fbeae","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53308"},"specVersion":"0.1.0","time":"2024-11-25T21:14:09.193944085Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"054a7640-ac64-4529-8cf3-f1a9fd558373","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53308"},"specVersion":"0.1.0","time":"2024-11-25T21:14:09.227456751Z","eventData":"SUCCESS"}
{"id":"8791677f-c4c0-4b62-9e65-4f1f6961b056","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:52238"},"specVersion":"0.1.0","time":"2024-11-25T21:14:09.330163293Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"949e7723-f420-49d6-aa56-3e26db1081bf","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:52238"},"specVersion":"0.1.0","time":"2024-11-25T21:14:09.330881168Z","eventData":"SUCCESS"}
{"id":"2a677e99-e857-43cf-a274-df1c170eba42","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53316"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.615217710Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"560b4fdd-13aa-496b-b7fc-08df6034a080","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53316"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.616220294Z","eventData":"SUCCESS"}
{"id":"add1f42e-bf00-4330-a1c9-d0638cc8cddd","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:59048"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.678551169Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"4687d9a6-54b6-4e5c-8df7-7f41fd481fc3","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:59048"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.679027627Z","eventData":"SUCCESS"}
{"id":"876361af-c334-447e-9b55-41c63c0b2784","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:33868"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.800283835Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"16254f5a-ba5c-4ebf-a211-e20b45861e2b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:33868"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.800708127Z","eventData":"SUCCESS"}
{"id":"df4df083-a82f-4b2c-834d-73e095490ad9","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53324"},"specVersion":"0.1.0","time":"2024-11-25T21:14:11.988921586Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"cb068ce0-66c7-474c-aede-182910aba4cc","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53324"},"specVersion":"0.1.0","time":"2024-11-25T21:14:11.989556378Z","eventData":"SUCCESS"}
{"id":"b9a61454-e024-4742-8b2e-3b1b5996c4fe","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:59054"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.044323753Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"ac32b54d-639d-4ef9-a70c-10f2e29bf6ad","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:59054"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.044987419Z","eventData":"SUCCESS"}
{"id":"6bd9ca11-dc3a-4207-9b24-76bd8eab39f4","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:52252"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.163371419Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"c2eba891-5950-4e5e-8c48-a64babec308d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:52252"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.163830711Z","eventData":"SUCCESS"}
{"id":"b1099b1a-7247-4681-9678-f1aff12b1136","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:33874"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.172852336Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"f37fb40a-625e-49f5-b435-ff4f376f78a1","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:33874"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.173165253Z","eventData":"SUCCESS"}
{"id":"797f77c6-73ba-4152-9c34-c9c88df37a40","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51332"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.355264212Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"d9298789-f4d4-4b00-ba43-2f69e08b4223","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51332"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.355835087Z","eventData":"SUCCESS"}
{"id":"9f800f59-545e-4990-977e-15e3a0a812d1","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57558"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.413305670Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"1ddf7b6b-a8ba-4c71-bd25-370ea61bdfaa","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57558"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.413895920Z","eventData":"SUCCESS"}
{"id":"9f163db7-9ec8-4e08-baa7-f1b85412d0c7","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35592"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.527201628Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"54eb8f44-cbea-4831-88d5-ff10647852f2","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35592"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.527563712Z","eventData":"SUCCESS"}
{"id":"a0038af3-aabb-4e76-8418-fad1305cbc59","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34684"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.535480712Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"08448720-8704-4eb0-9d98-46ce1dacb516","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34684"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.536544753Z","eventData":"SUCCESS"}
{"id":"5ff0597f-4003-4661-ad09-9afdb56968bf","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51342"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.786480254Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"eb35fd50-47a9-403e-b6fb-d0f5233217dc","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51342"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.789925046Z","eventData":"SUCCESS"}
{"id":"8100a2f8-ef2a-45c7-9168-0f25aaf5af2c","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35600"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.940521504Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"4b562390-7412-4761-aaf6-32abf29b3472","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35600"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.941024796Z","eventData":"SUCCESS"}
{"id":"426a3e19-891d-4900-aa1a-7f732eebcf92","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57574"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.964559254Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"ea6bcb24-bd14-4a72-ae98-e985988b130f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57574"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.965057337Z","eventData":"SUCCESS"}
{"id":"1b23e23a-4bb7-4545-bf2d-948739fd2ef8","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34700"},"specVersion":"0.1.0","time":"2024-11-25T21:14:15.131363421Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"ae08f04e-a031-455d-ad29-ba44ecf6206a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34700"},"specVersion":"0.1.0","time":"2024-11-25T21:14:15.131864796Z","eventData":"SUCCESS"}
{"id":"4900af12-80ce-461e-b19f-a990d5430755","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51346"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.337844464Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"172c0cde-17c9-419a-a675-ddcacbd83285","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51346"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.338756339Z","eventData":"SUCCESS"}
{"id":"3da12440-2334-493b-869a-0b0a8a1b9a66","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34714"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.409453506Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"38c77628-20b4-4e7b-8ab0-8856dccbf059","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34714"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.409895965Z","eventData":"SUCCESS"}
{"id":"06284928-05cf-4b0f-b419-28fa5b1548a3","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57578"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.430416006Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"f7f548dd-d2cc-4fad-bc43-9c33d26ee408","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57578"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.431084465Z","eventData":"SUCCESS"}
{"id":"9ffc9d67-2533-4e93-a488-0f8f74266346","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35616"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.451230048Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"090db4b4-6d37-4ca3-8e96-85f016e8e69b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35616"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.452084590Z","eventData":"SUCCESS"}
{"id":"dc998393-e17f-4393-9286-442bb4ad34cb","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:53494"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.899078131Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"ea87a6a5-99a2-4a10-b5ba-7503fa429209","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:53506"},"specVersion":"0.1.0","time":"2024-11-25T21:14:20.212457673Z","eventData":{"method":"GET","path":"/gateway/v2/interceptor","body":null}}
{"id":"f3531d4b-ad2d-43fa-8c9f-69e8d0ca2a5f","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51352"},"specVersion":"0.1.0","time":"2024-11-25T21:14:20.965392257Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"649f46c7-0510-4700-aa1a-ea4d2d93e15d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51352"},"specVersion":"0.1.0","time":"2024-11-25T21:14:20.967340632Z","eventData":"SUCCESS"}
{"id":"7f129b5e-e097-4fa7-8743-656a086ca40b","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35628"},"specVersion":"0.1.0","time":"2024-11-25T21:14:21.012453965Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"08526aa2-cbf3-46ea-bafd-24663e917bf7","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35628"},"specVersion":"0.1.0","time":"2024-11-25T21:14:21.012882424Z","eventData":"SUCCESS"}
{"id":"5e649700-c4ae-4aa3-be94-6cc1b3379185","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:35628"},"specVersion":"0.1.0","time":"2024-11-25T21:14:21.032641632Z","eventData":{"interceptorName":"guard-on-create-topic","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'roads' with number partitions is '100', must not be greater than 3. Topic 'roads' with replication factor is '1', must not be less than 2"}}
{"id":"497c725f-92b1-4f5f-9cbd-ca97540816ec","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51358"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.121335132Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"64d70996-78a1-4696-b95b-fb1c6a3a9f01","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51358"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.122234757Z","eventData":"SUCCESS"}
{"id":"9ee5c47b-f8dd-4814-9938-24ba06b9bdbf","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34722"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.167245758Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"31a79c25-9650-41fa-9a80-9d7482b94347","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34722"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.167671966Z","eventData":"SUCCESS"}
{"id":"46a1d622-4d89-4b42-b09f-87c2d19c88ac","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:53522"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.635370466Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"c7af41a7-73d9-4eeb-a2ec-d9ecfb25f37d","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40076"},"specVersion":"0.1.0","time":"2024-11-25T21:14:23.951101592Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"c5c2dd72-e6be-4832-a20d-460e6eef6bb9","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40076"},"specVersion":"0.1.0","time":"2024-11-25T21:14:23.952185633Z","eventData":"SUCCESS"}
{"id":"af854d64-89b7-41e6-9f4d-07f722072679","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54976"},"specVersion":"0.1.0","time":"2024-11-25T21:14:23.998344300Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"bc31122b-cb0b-4b7f-871e-86659c7cc19e","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54976"},"specVersion":"0.1.0","time":"2024-11-25T21:14:23.998801258Z","eventData":"SUCCESS"}
{"id":"8e766ce0-9219-4e33-9d15-f6b2798762ff","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51334"},"specVersion":"0.1.0","time":"2024-11-25T21:14:24.023533050Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"7d319dc7-8899-4210-aa59-e0701418fb19","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51334"},"specVersion":"0.1.0","time":"2024-11-25T21:14:24.024087675Z","eventData":"SUCCESS"}
{"id":"101363be-ede3-4234-ad8e-3e3b6005be76","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:54976"},"specVersion":"0.1.0","time":"2024-11-25T21:14:24.038199592Z","eventData":{"interceptorName":"guard-on-alter-topic","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Resource 'roads' with retention.ms is '5184000000', must not be greater than '432000000'"}}
{"id":"8464bfd8-8276-413f-8a58-4bf65c3897f2","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40090"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.318879509Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"6fb6b890-7f72-4d3c-aa65-1b073847db97","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40090"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.319528551Z","eventData":"SUCCESS"}
{"id":"92925f34-c2f0-4011-85c1-37af1bbbdc0e","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54980"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.363116884Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"19d5273a-2948-46ab-992c-0fd82da956bf","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54980"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.363528842Z","eventData":"SUCCESS"}
{"id":"51bddfd8-2945-4f71-bd89-7dea07813430","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:45808"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.925220426Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"beea3eb9-3981-4959-ad9f-7b94a87c8843","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40098"},"specVersion":"0.1.0","time":"2024-11-25T21:14:26.752367968Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"ba8fc445-d4f2-4c39-af6b-7e4c86b41dca","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40098"},"specVersion":"0.1.0","time":"2024-11-25T21:14:26.753795968Z","eventData":"SUCCESS"}
{"id":"040d2eb7-2dcd-463e-a670-4e19d03af805","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:51728"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.047298802Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"56425d00-8a68-4c55-a7c1-01bdbb9bd3df","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51336"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.047521677Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"756deefe-6a75-4808-91f5-804029671e61","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:51728"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.048567177Z","eventData":"SUCCESS"}
{"id":"576189a8-fe54-45ce-8070-92b013964753","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51336"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.048723302Z","eventData":"SUCCESS"}
{"id":"6fe6b668-4fea-40cf-bd77-70111e8ca6db","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:51336"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.118765260Z","eventData":{"interceptorName":"guard-on-produce","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1. Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]"}}
{"id":"bc5d95d0-5fb9-45ea-a6c7-f52187b69794","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40104"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.284875552Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"72472576-1b6c-4e66-9f61-8435f1c8d776","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40104"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.285270635Z","eventData":"SUCCESS"}
{"id":"6bfb221b-6c43-42c1-8e90-83d3201c3df1","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54990"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.331368177Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"865b6b2d-7f31-4560-95da-1571db12d41f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54990"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.331892469Z","eventData":"SUCCESS"}
{"id":"616d079d-ec05-4948-ba31-f25f49aad590","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51352"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.444843677Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"7035fef1-a505-4141-8f0d-99717b372855","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51352"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.445180886Z","eventData":"SUCCESS"}
{"id":"bb61cce5-8a1b-47d2-acf2-3c193268f465","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:45844"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.896296552Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"49fde621-61a7-44d4-b024-99655a046d3a","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40118"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.722236303Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"707d95e8-af45-4b06-8d56-e2cf932335cd","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40118"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.722928636Z","eventData":"SUCCESS"}
{"id":"aa064f9c-a892-47eb-9b32-687648141559","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:55000"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.774922303Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"1b307013-1981-4bdb-be43-79cee26289ca","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:55000"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.775307011Z","eventData":"SUCCESS"}
{"id":"72036dd6-87fc-4145-adcc-eda4c8678d04","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51354"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.887076053Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"1a290e6c-78bb-463c-9ebb-024f5512bae7","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51354"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.887418886Z","eventData":"SUCCESS"}
{"id":"2973a628-d4ce-4d4f-ab0c-2e232d470cdf","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:51354"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.902874928Z","eventData":{"interceptorName":"produce-rate","level":"warn","plugin":"io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Client produced (108) bytes, which is more than 1 bytes per second, producer will be throttled by 22 milliseconds"}}
[2024-11-25 21:14:34,331] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 87 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692055.svg)](https://asciinema.org/a/692055)

</TabItem>
</Tabs>

## Remove interceptor produce-rate








<Tabs>

<TabItem value="Command">
```sh
curl \
    --silent \
    --request DELETE "http://localhost:8888/gateway/v2/interceptor/produce-rate" \
    --header "Content-Type: application/json" \
    --user "admin:conduktor" \
    --data-raw '{
  "vCluster" : "passthrough"
}' | jq
```


</TabItem>
<TabItem value="Output">

```json

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692056.svg)](https://asciinema.org/a/692056)

</TabItem>
</Tabs>

## Adding interceptor consumer-group-name-policy

Let's add some naming conventions on consumer group names




`step-23-consumer-group-name-policy-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "consumer-group-name-policy"
  },
  "spec" : {
    "comment" : "Adding interceptor: consumer-group-name-policy",
    "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin",
    "priority" : 100,
    "config" : {
      "groupId" : {
        "value" : "my-group.*",
        "action" : "BLOCK"
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
    --data @step-23-consumer-group-name-policy-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "consumer-group-name-policy",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: consumer-group-name-policy",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin",
      "priority": 100,
      "config": {
        "groupId": {
          "value": "my-group.*",
          "action": "BLOCK"
        }
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692057.svg)](https://asciinema.org/a/692057)

</TabItem>
</Tabs>

## Consuming from cars

Consuming from cars in cluster `gateway1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic cars \
    --from-beginning \
    --timeout-ms 3000 \
    --group group-not-within-policy | jq
```

> [!IMPORTANT]
> We get the following exception
>
> ```sh
> Unexpected error in join group response: Request parameters do not satisfy the configured policy.
> ```



</TabItem>
<TabItem value="Output">

```json
[2024-11-25 21:14:35,929] ERROR [Consumer clientId=console-consumer, groupId=group-not-within-policy] JoinGroup failed due to unexpected error: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
[2024-11-25 21:14:35,930] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.KafkaException: Unexpected error in join group response: Request parameters do not satisfy the configured policy.
	at org.apache.kafka.clients.consumer.internals.AbstractCoordinator$JoinGroupResponseHandler.handle(AbstractCoordinator.java:741)
	at org.apache.kafka.clients.consumer.internals.AbstractCoordinator$JoinGroupResponseHandler.handle(AbstractCoordinator.java:631)
	at org.apache.kafka.clients.consumer.internals.AbstractCoordinator$CoordinatorResponseHandler.onSuccess(AbstractCoordinator.java:1300)
	at org.apache.kafka.clients.consumer.internals.AbstractCoordinator$CoordinatorResponseHandler.onSuccess(AbstractCoordinator.java:1275)
	at org.apache.kafka.clients.consumer.internals.RequestFuture$1.onSuccess(RequestFuture.java:206)
	at org.apache.kafka.clients.consumer.internals.RequestFuture.fireSuccess(RequestFuture.java:169)
	at org.apache.kafka.clients.consumer.internals.RequestFuture.complete(RequestFuture.java:129)
	at org.apache.kafka.clients.consumer.internals.ConsumerNetworkClient$RequestFutureCompletionHandler.fireCompletion(ConsumerNetworkClient.java:616)
	at org.apache.kafka.clients.consumer.internals.ConsumerNetworkClient.firePendingCompletedRequests(ConsumerNetworkClient.java:428)
	at org.apache.kafka.clients.consumer.internals.ConsumerNetworkClient.poll(ConsumerNetworkClient.java:313)
	at org.apache.kafka.clients.consumer.internals.ConsumerNetworkClient.poll(ConsumerNetworkClient.java:252)
	at org.apache.kafka.clients.consumer.internals.LegacyKafkaConsumer.pollForFetches(LegacyKafkaConsumer.java:686)
	at org.apache.kafka.clients.consumer.internals.LegacyKafkaConsumer.poll(LegacyKafkaConsumer.java:617)
	at org.apache.kafka.clients.consumer.internals.LegacyKafkaConsumer.poll(LegacyKafkaConsumer.java:590)
	at org.apache.kafka.clients.consumer.KafkaConsumer.poll(KafkaConsumer.java:874)
	at kafka.tools.ConsoleConsumer$ConsumerWrapper.receive(ConsoleConsumer.scala:473)
	at kafka.tools.ConsoleConsumer$.process(ConsoleConsumer.scala:103)
	at kafka.tools.ConsoleConsumer$.run(ConsoleConsumer.scala:77)
	at kafka.tools.ConsoleConsumer$.main(ConsoleConsumer.scala:54)
	at kafka.tools.ConsoleConsumer.main(ConsoleConsumer.scala)
Processed a total of 0 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692058.svg)](https://asciinema.org/a/692058)

</TabItem>
</Tabs>

## Check in the audit log that fetch was denied

Check in the audit log that fetch was denied in cluster `kafka1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:9092,localhost:9093,localhost:9094 \
    --topic _conduktor_gateway_auditlogs \
    --from-beginning \
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin")'
```


returns 1 event
```json
{
  "id" : "94550d33-85bb-498a-b9dd-12726e4b31f4",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:52346"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:12:49.189252548Z",
  "eventData" : {
    "interceptorName" : "consumer-group-name-policy",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. GroupId 'group-not-within-policy' is invalid, naming convention must match with regular expression my-group.*"
  }
}
```

</TabItem>
<TabItem value="Output">

```
{"id":"1c801362-7cb6-4d50-ae8b-de26124fbeae","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53308"},"specVersion":"0.1.0","time":"2024-11-25T21:14:09.193944085Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"054a7640-ac64-4529-8cf3-f1a9fd558373","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53308"},"specVersion":"0.1.0","time":"2024-11-25T21:14:09.227456751Z","eventData":"SUCCESS"}
{"id":"8791677f-c4c0-4b62-9e65-4f1f6961b056","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:52238"},"specVersion":"0.1.0","time":"2024-11-25T21:14:09.330163293Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"949e7723-f420-49d6-aa56-3e26db1081bf","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:52238"},"specVersion":"0.1.0","time":"2024-11-25T21:14:09.330881168Z","eventData":"SUCCESS"}
{"id":"2a677e99-e857-43cf-a274-df1c170eba42","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53316"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.615217710Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"560b4fdd-13aa-496b-b7fc-08df6034a080","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53316"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.616220294Z","eventData":"SUCCESS"}
{"id":"add1f42e-bf00-4330-a1c9-d0638cc8cddd","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:59048"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.678551169Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"4687d9a6-54b6-4e5c-8df7-7f41fd481fc3","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:59048"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.679027627Z","eventData":"SUCCESS"}
{"id":"876361af-c334-447e-9b55-41c63c0b2784","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:33868"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.800283835Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"16254f5a-ba5c-4ebf-a211-e20b45861e2b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:33868"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.800708127Z","eventData":"SUCCESS"}
{"id":"df4df083-a82f-4b2c-834d-73e095490ad9","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53324"},"specVersion":"0.1.0","time":"2024-11-25T21:14:11.988921586Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"cb068ce0-66c7-474c-aede-182910aba4cc","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53324"},"specVersion":"0.1.0","time":"2024-11-25T21:14:11.989556378Z","eventData":"SUCCESS"}
{"id":"b9a61454-e024-4742-8b2e-3b1b5996c4fe","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:59054"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.044323753Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"ac32b54d-639d-4ef9-a70c-10f2e29bf6ad","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:59054"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.044987419Z","eventData":"SUCCESS"}
{"id":"6bd9ca11-dc3a-4207-9b24-76bd8eab39f4","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:52252"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.163371419Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"c2eba891-5950-4e5e-8c48-a64babec308d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:52252"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.163830711Z","eventData":"SUCCESS"}
{"id":"b1099b1a-7247-4681-9678-f1aff12b1136","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:33874"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.172852336Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"f37fb40a-625e-49f5-b435-ff4f376f78a1","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:33874"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.173165253Z","eventData":"SUCCESS"}
{"id":"797f77c6-73ba-4152-9c34-c9c88df37a40","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51332"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.355264212Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"d9298789-f4d4-4b00-ba43-2f69e08b4223","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51332"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.355835087Z","eventData":"SUCCESS"}
{"id":"9f800f59-545e-4990-977e-15e3a0a812d1","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57558"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.413305670Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"1ddf7b6b-a8ba-4c71-bd25-370ea61bdfaa","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57558"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.413895920Z","eventData":"SUCCESS"}
{"id":"9f163db7-9ec8-4e08-baa7-f1b85412d0c7","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35592"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.527201628Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"54eb8f44-cbea-4831-88d5-ff10647852f2","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35592"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.527563712Z","eventData":"SUCCESS"}
{"id":"a0038af3-aabb-4e76-8418-fad1305cbc59","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34684"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.535480712Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"08448720-8704-4eb0-9d98-46ce1dacb516","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34684"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.536544753Z","eventData":"SUCCESS"}
{"id":"5ff0597f-4003-4661-ad09-9afdb56968bf","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51342"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.786480254Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"eb35fd50-47a9-403e-b6fb-d0f5233217dc","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51342"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.789925046Z","eventData":"SUCCESS"}
{"id":"8100a2f8-ef2a-45c7-9168-0f25aaf5af2c","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35600"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.940521504Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"4b562390-7412-4761-aaf6-32abf29b3472","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35600"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.941024796Z","eventData":"SUCCESS"}
{"id":"426a3e19-891d-4900-aa1a-7f732eebcf92","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57574"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.964559254Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"ea6bcb24-bd14-4a72-ae98-e985988b130f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57574"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.965057337Z","eventData":"SUCCESS"}
{"id":"1b23e23a-4bb7-4545-bf2d-948739fd2ef8","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34700"},"specVersion":"0.1.0","time":"2024-11-25T21:14:15.131363421Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"ae08f04e-a031-455d-ad29-ba44ecf6206a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34700"},"specVersion":"0.1.0","time":"2024-11-25T21:14:15.131864796Z","eventData":"SUCCESS"}
{"id":"4900af12-80ce-461e-b19f-a990d5430755","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51346"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.337844464Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"172c0cde-17c9-419a-a675-ddcacbd83285","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51346"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.338756339Z","eventData":"SUCCESS"}
{"id":"3da12440-2334-493b-869a-0b0a8a1b9a66","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34714"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.409453506Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"38c77628-20b4-4e7b-8ab0-8856dccbf059","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34714"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.409895965Z","eventData":"SUCCESS"}
{"id":"06284928-05cf-4b0f-b419-28fa5b1548a3","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57578"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.430416006Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"f7f548dd-d2cc-4fad-bc43-9c33d26ee408","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57578"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.431084465Z","eventData":"SUCCESS"}
{"id":"9ffc9d67-2533-4e93-a488-0f8f74266346","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35616"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.451230048Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"090db4b4-6d37-4ca3-8e96-85f016e8e69b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35616"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.452084590Z","eventData":"SUCCESS"}
{"id":"dc998393-e17f-4393-9286-442bb4ad34cb","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:53494"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.899078131Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"ea87a6a5-99a2-4a10-b5ba-7503fa429209","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:53506"},"specVersion":"0.1.0","time":"2024-11-25T21:14:20.212457673Z","eventData":{"method":"GET","path":"/gateway/v2/interceptor","body":null}}
{"id":"f3531d4b-ad2d-43fa-8c9f-69e8d0ca2a5f","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51352"},"specVersion":"0.1.0","time":"2024-11-25T21:14:20.965392257Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"649f46c7-0510-4700-aa1a-ea4d2d93e15d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51352"},"specVersion":"0.1.0","time":"2024-11-25T21:14:20.967340632Z","eventData":"SUCCESS"}
{"id":"7f129b5e-e097-4fa7-8743-656a086ca40b","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35628"},"specVersion":"0.1.0","time":"2024-11-25T21:14:21.012453965Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"08526aa2-cbf3-46ea-bafd-24663e917bf7","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35628"},"specVersion":"0.1.0","time":"2024-11-25T21:14:21.012882424Z","eventData":"SUCCESS"}
{"id":"5e649700-c4ae-4aa3-be94-6cc1b3379185","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:35628"},"specVersion":"0.1.0","time":"2024-11-25T21:14:21.032641632Z","eventData":{"interceptorName":"guard-on-create-topic","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'roads' with number partitions is '100', must not be greater than 3. Topic 'roads' with replication factor is '1', must not be less than 2"}}
{"id":"497c725f-92b1-4f5f-9cbd-ca97540816ec","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51358"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.121335132Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"64d70996-78a1-4696-b95b-fb1c6a3a9f01","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51358"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.122234757Z","eventData":"SUCCESS"}
{"id":"9ee5c47b-f8dd-4814-9938-24ba06b9bdbf","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34722"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.167245758Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"31a79c25-9650-41fa-9a80-9d7482b94347","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34722"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.167671966Z","eventData":"SUCCESS"}
{"id":"46a1d622-4d89-4b42-b09f-87c2d19c88ac","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:53522"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.635370466Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"c7af41a7-73d9-4eeb-a2ec-d9ecfb25f37d","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40076"},"specVersion":"0.1.0","time":"2024-11-25T21:14:23.951101592Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"c5c2dd72-e6be-4832-a20d-460e6eef6bb9","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40076"},"specVersion":"0.1.0","time":"2024-11-25T21:14:23.952185633Z","eventData":"SUCCESS"}
{"id":"af854d64-89b7-41e6-9f4d-07f722072679","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54976"},"specVersion":"0.1.0","time":"2024-11-25T21:14:23.998344300Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"bc31122b-cb0b-4b7f-871e-86659c7cc19e","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54976"},"specVersion":"0.1.0","time":"2024-11-25T21:14:23.998801258Z","eventData":"SUCCESS"}
{"id":"8e766ce0-9219-4e33-9d15-f6b2798762ff","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51334"},"specVersion":"0.1.0","time":"2024-11-25T21:14:24.023533050Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"7d319dc7-8899-4210-aa59-e0701418fb19","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51334"},"specVersion":"0.1.0","time":"2024-11-25T21:14:24.024087675Z","eventData":"SUCCESS"}
{"id":"101363be-ede3-4234-ad8e-3e3b6005be76","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:54976"},"specVersion":"0.1.0","time":"2024-11-25T21:14:24.038199592Z","eventData":{"interceptorName":"guard-on-alter-topic","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Resource 'roads' with retention.ms is '5184000000', must not be greater than '432000000'"}}
{"id":"8464bfd8-8276-413f-8a58-4bf65c3897f2","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40090"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.318879509Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"6fb6b890-7f72-4d3c-aa65-1b073847db97","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40090"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.319528551Z","eventData":"SUCCESS"}
{"id":"92925f34-c2f0-4011-85c1-37af1bbbdc0e","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54980"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.363116884Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"19d5273a-2948-46ab-992c-0fd82da956bf","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54980"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.363528842Z","eventData":"SUCCESS"}
{"id":"51bddfd8-2945-4f71-bd89-7dea07813430","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:45808"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.925220426Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"beea3eb9-3981-4959-ad9f-7b94a87c8843","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40098"},"specVersion":"0.1.0","time":"2024-11-25T21:14:26.752367968Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"ba8fc445-d4f2-4c39-af6b-7e4c86b41dca","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40098"},"specVersion":"0.1.0","time":"2024-11-25T21:14:26.753795968Z","eventData":"SUCCESS"}
{"id":"040d2eb7-2dcd-463e-a670-4e19d03af805","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:51728"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.047298802Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"56425d00-8a68-4c55-a7c1-01bdbb9bd3df","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51336"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.047521677Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"756deefe-6a75-4808-91f5-804029671e61","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:51728"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.048567177Z","eventData":"SUCCESS"}
{"id":"576189a8-fe54-45ce-8070-92b013964753","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51336"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.048723302Z","eventData":"SUCCESS"}
{"id":"6fe6b668-4fea-40cf-bd77-70111e8ca6db","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:51336"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.118765260Z","eventData":{"interceptorName":"guard-on-produce","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1. Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]"}}
{"id":"bc5d95d0-5fb9-45ea-a6c7-f52187b69794","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40104"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.284875552Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"72472576-1b6c-4e66-9f61-8435f1c8d776","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40104"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.285270635Z","eventData":"SUCCESS"}
{"id":"6bfb221b-6c43-42c1-8e90-83d3201c3df1","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54990"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.331368177Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"865b6b2d-7f31-4560-95da-1571db12d41f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54990"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.331892469Z","eventData":"SUCCESS"}
{"id":"616d079d-ec05-4948-ba31-f25f49aad590","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51352"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.444843677Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"7035fef1-a505-4141-8f0d-99717b372855","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51352"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.445180886Z","eventData":"SUCCESS"}
{"id":"bb61cce5-8a1b-47d2-acf2-3c193268f465","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:45844"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.896296552Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"49fde621-61a7-44d4-b024-99655a046d3a","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40118"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.722236303Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"707d95e8-af45-4b06-8d56-e2cf932335cd","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40118"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.722928636Z","eventData":"SUCCESS"}
{"id":"aa064f9c-a892-47eb-9b32-687648141559","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:55000"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.774922303Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"1b307013-1981-4bdb-be43-79cee26289ca","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:55000"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.775307011Z","eventData":"SUCCESS"}
{"id":"72036dd6-87fc-4145-adcc-eda4c8678d04","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51354"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.887076053Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"1a290e6c-78bb-463c-9ebb-024f5512bae7","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51354"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.887418886Z","eventData":"SUCCESS"}
{"id":"2973a628-d4ce-4d4f-ab0c-2e232d470cdf","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:51354"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.902874928Z","eventData":{"interceptorName":"produce-rate","level":"warn","plugin":"io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Client produced (108) bytes, which is more than 1 bytes per second, producer will be throttled by 22 milliseconds"}}
{"id":"2c745f67-c346-4c20-9571-8108d35516cb","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:55588"},"specVersion":"0.1.0","time":"2024-11-25T21:14:34.792005430Z","eventData":{"method":"DELETE","path":"/gateway/v2/interceptor/produce-rate","body":null}}
{"id":"51eaef28-b32e-489b-9bc7-d24654cb4600","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:55594"},"specVersion":"0.1.0","time":"2024-11-25T21:14:34.877700555Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"e20cbe35-d06d-4e2b-9adf-206e24a959cb","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:54888"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.747491375Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"8916ae90-ed05-400d-abcc-467623ab4ac2","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:54888"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.748900875Z","eventData":"SUCCESS"}
{"id":"1c4867d2-8039-4dd5-82ea-a0069cfe0c73","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:40394"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.895882916Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"e4091e55-63bf-420c-993e-dae3696cc32a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:40394"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.896351041Z","eventData":"SUCCESS"}
{"id":"932d1540-e6db-4262-a2c8-3f53a844735b","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:40408"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.919486333Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"9d7f9c0a-339d-4f19-99a2-9272e6c9e245","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:40408"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.919799791Z","eventData":"SUCCESS"}
{"id":"363b27a2-4785-4eaf-97b8-ee0c3dba1ec3","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:40408"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.926927375Z","eventData":{"interceptorName":"consumer-group-name-policy","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin","message":"Request parameters do not satisfy the configured policy. GroupId 'group-not-within-policy' is invalid, naming convention must match with regular expression my-group.*"}}
[2024-11-25 21:14:40,271] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 96 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692059.svg)](https://asciinema.org/a/692059)

</TabItem>
</Tabs>

## Consuming from cars

Consuming from cars in cluster `gateway1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic cars \
    --from-beginning \
    --timeout-ms 3000 \
    --group my-group-within-policy | jq
```


</TabItem>
<TabItem value="Output">

```json
[2024-11-25 21:14:44,838] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 5 messages
{
  "type": "Ferrari",
  "color": "red",
  "price": 10000
}
{
  "type": "RollsRoyce",
  "color": "black",
  "price": 9000
}
{
  "type": "Mercedes",
  "color": "black",
  "price": 6000
}
{
  "type": "Fiat",
  "color": "red",
  "price": -1
}
{
  "type": "Fiat",
  "color": "red",
  "price": -1
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692060.svg)](https://asciinema.org/a/692060)

</TabItem>
</Tabs>

## Remove interceptor consumer-group-name-policy








<Tabs>

<TabItem value="Command">
```sh
curl \
    --silent \
    --request DELETE "http://localhost:8888/gateway/v2/interceptor/consumer-group-name-policy" \
    --header "Content-Type: application/json" \
    --user "admin:conduktor" \
    --data-raw '{
  "vCluster" : "passthrough"
}' | jq
```


</TabItem>
<TabItem value="Output">

```json

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692061.svg)](https://asciinema.org/a/692061)

</TabItem>
</Tabs>

## Adding interceptor guard-limit-connection

Let's add some connect limitation policy




`step-28-guard-limit-connection-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "guard-limit-connection"
  },
  "spec" : {
    "comment" : "Adding interceptor: guard-limit-connection",
    "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "priority" : 100,
    "config" : {
      "maximumConnectionsPerSecond" : 1,
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
    --data @step-28-guard-limit-connection-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "guard-limit-connection",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: guard-limit-connection",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
      "priority": 100,
      "config": {
        "maximumConnectionsPerSecond": 1,
        "action": "BLOCK"
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692062.svg)](https://asciinema.org/a/692062)

</TabItem>
</Tabs>

## Consuming from cars

Consuming from cars in cluster `gateway1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic cars \
    --from-beginning \
    --timeout-ms 3000 \
    --group my-group-id-convention-cars | jq
```


</TabItem>
<TabItem value="Output">

```json
[2024-11-25 21:14:47,489] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Received error POLICY_VIOLATION from node 2147483645 when making an ApiVersionsRequest with correlation id 7. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-25 21:14:47,943] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Received error POLICY_VIOLATION from node 2147483645 when making an ApiVersionsRequest with correlation id 12. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-25 21:14:48,633] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Received error POLICY_VIOLATION from node 2147483645 when making an ApiVersionsRequest with correlation id 17. Disconnecting. (org.apache.kafka.clients.NetworkClient)
[2024-11-25 21:14:49,354] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
[2024-11-25 21:14:49,417] WARN [Consumer clientId=console-consumer, groupId=my-group-id-convention-cars] Received error POLICY_VIOLATION from node 2147483645 when making an ApiVersionsRequest with correlation id 23. Disconnecting. (org.apache.kafka.clients.NetworkClient)
Processed a total of 0 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692063.svg)](https://asciinema.org/a/692063)

</TabItem>
</Tabs>

## Check in the audit log that connection was denied

Check in the audit log that connection was denied in cluster `kafka1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:9092,localhost:9093,localhost:9094 \
    --topic _conduktor_gateway_auditlogs \
    --from-beginning \
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin")'
```


returns 8 events
```json
{
  "id" : "1e53a507-af73-4b99-bc84-5a807f3de770",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:36720"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:12:56.701871260Z",
  "eventData" : {
    "interceptorName" : "guard-limit-connection",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id" : "0fb8d183-5ff2-48b4-aabc-3467217450ef",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51710"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:12:56.959415551Z",
  "eventData" : {
    "interceptorName" : "guard-limit-connection",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id" : "c93c0926-5922-4051-97ca-d1aa89c77de0",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51720"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:12:57.295491052Z",
  "eventData" : {
    "interceptorName" : "guard-limit-connection",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id" : "df384dd9-db03-4fbd-a273-ada355e2ce2f",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51732"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:12:58.404869427Z",
  "eventData" : {
    "interceptorName" : "guard-limit-connection",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id" : "66eea142-00c0-4ece-a09c-28874731dd90",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51420"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:12:58.564739886Z",
  "eventData" : {
    "interceptorName" : "guard-limit-connection",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id" : "ef500ff9-0e8e-4620-acba-06d5a6d5d41b",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51420"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:12:58.875050011Z",
  "eventData" : {
    "interceptorName" : "guard-limit-connection",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id" : "2bc84c96-4f01-4e0e-a8aa-05a72f0ed548",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51420"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:12:59.278733386Z",
  "eventData" : {
    "interceptorName" : "guard-limit-connection",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client connections exceed the limitation of 1 connections per second"
  }
}
{
  "id" : "f0aa524a-26c2-44c2-bd3e-89be157da595",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:46554"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:12:59.314247386Z",
  "eventData" : {
    "interceptorName" : "guard-limit-connection",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client connections exceed the limitation of 1 connections per second"
  }
}
```

</TabItem>
<TabItem value="Output">

```
{"id":"1c801362-7cb6-4d50-ae8b-de26124fbeae","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53308"},"specVersion":"0.1.0","time":"2024-11-25T21:14:09.193944085Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"054a7640-ac64-4529-8cf3-f1a9fd558373","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53308"},"specVersion":"0.1.0","time":"2024-11-25T21:14:09.227456751Z","eventData":"SUCCESS"}
{"id":"8791677f-c4c0-4b62-9e65-4f1f6961b056","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:52238"},"specVersion":"0.1.0","time":"2024-11-25T21:14:09.330163293Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"949e7723-f420-49d6-aa56-3e26db1081bf","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:52238"},"specVersion":"0.1.0","time":"2024-11-25T21:14:09.330881168Z","eventData":"SUCCESS"}
{"id":"2a677e99-e857-43cf-a274-df1c170eba42","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53316"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.615217710Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"560b4fdd-13aa-496b-b7fc-08df6034a080","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53316"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.616220294Z","eventData":"SUCCESS"}
{"id":"add1f42e-bf00-4330-a1c9-d0638cc8cddd","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:59048"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.678551169Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"4687d9a6-54b6-4e5c-8df7-7f41fd481fc3","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:59048"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.679027627Z","eventData":"SUCCESS"}
{"id":"876361af-c334-447e-9b55-41c63c0b2784","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:33868"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.800283835Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"16254f5a-ba5c-4ebf-a211-e20b45861e2b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:33868"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.800708127Z","eventData":"SUCCESS"}
{"id":"df4df083-a82f-4b2c-834d-73e095490ad9","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53324"},"specVersion":"0.1.0","time":"2024-11-25T21:14:11.988921586Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"cb068ce0-66c7-474c-aede-182910aba4cc","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53324"},"specVersion":"0.1.0","time":"2024-11-25T21:14:11.989556378Z","eventData":"SUCCESS"}
{"id":"b9a61454-e024-4742-8b2e-3b1b5996c4fe","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:59054"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.044323753Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"ac32b54d-639d-4ef9-a70c-10f2e29bf6ad","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:59054"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.044987419Z","eventData":"SUCCESS"}
{"id":"6bd9ca11-dc3a-4207-9b24-76bd8eab39f4","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:52252"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.163371419Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"c2eba891-5950-4e5e-8c48-a64babec308d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:52252"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.163830711Z","eventData":"SUCCESS"}
{"id":"b1099b1a-7247-4681-9678-f1aff12b1136","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:33874"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.172852336Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"f37fb40a-625e-49f5-b435-ff4f376f78a1","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:33874"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.173165253Z","eventData":"SUCCESS"}
{"id":"797f77c6-73ba-4152-9c34-c9c88df37a40","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51332"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.355264212Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"d9298789-f4d4-4b00-ba43-2f69e08b4223","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51332"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.355835087Z","eventData":"SUCCESS"}
{"id":"9f800f59-545e-4990-977e-15e3a0a812d1","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57558"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.413305670Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"1ddf7b6b-a8ba-4c71-bd25-370ea61bdfaa","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57558"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.413895920Z","eventData":"SUCCESS"}
{"id":"9f163db7-9ec8-4e08-baa7-f1b85412d0c7","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35592"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.527201628Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"54eb8f44-cbea-4831-88d5-ff10647852f2","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35592"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.527563712Z","eventData":"SUCCESS"}
{"id":"a0038af3-aabb-4e76-8418-fad1305cbc59","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34684"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.535480712Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"08448720-8704-4eb0-9d98-46ce1dacb516","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34684"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.536544753Z","eventData":"SUCCESS"}
{"id":"5ff0597f-4003-4661-ad09-9afdb56968bf","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51342"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.786480254Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"eb35fd50-47a9-403e-b6fb-d0f5233217dc","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51342"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.789925046Z","eventData":"SUCCESS"}
{"id":"8100a2f8-ef2a-45c7-9168-0f25aaf5af2c","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35600"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.940521504Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"4b562390-7412-4761-aaf6-32abf29b3472","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35600"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.941024796Z","eventData":"SUCCESS"}
{"id":"426a3e19-891d-4900-aa1a-7f732eebcf92","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57574"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.964559254Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"ea6bcb24-bd14-4a72-ae98-e985988b130f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57574"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.965057337Z","eventData":"SUCCESS"}
{"id":"1b23e23a-4bb7-4545-bf2d-948739fd2ef8","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34700"},"specVersion":"0.1.0","time":"2024-11-25T21:14:15.131363421Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"ae08f04e-a031-455d-ad29-ba44ecf6206a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34700"},"specVersion":"0.1.0","time":"2024-11-25T21:14:15.131864796Z","eventData":"SUCCESS"}
{"id":"4900af12-80ce-461e-b19f-a990d5430755","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51346"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.337844464Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"172c0cde-17c9-419a-a675-ddcacbd83285","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51346"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.338756339Z","eventData":"SUCCESS"}
{"id":"3da12440-2334-493b-869a-0b0a8a1b9a66","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34714"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.409453506Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"38c77628-20b4-4e7b-8ab0-8856dccbf059","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34714"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.409895965Z","eventData":"SUCCESS"}
{"id":"06284928-05cf-4b0f-b419-28fa5b1548a3","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57578"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.430416006Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"f7f548dd-d2cc-4fad-bc43-9c33d26ee408","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57578"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.431084465Z","eventData":"SUCCESS"}
{"id":"9ffc9d67-2533-4e93-a488-0f8f74266346","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35616"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.451230048Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"090db4b4-6d37-4ca3-8e96-85f016e8e69b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35616"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.452084590Z","eventData":"SUCCESS"}
{"id":"dc998393-e17f-4393-9286-442bb4ad34cb","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:53494"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.899078131Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"ea87a6a5-99a2-4a10-b5ba-7503fa429209","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:53506"},"specVersion":"0.1.0","time":"2024-11-25T21:14:20.212457673Z","eventData":{"method":"GET","path":"/gateway/v2/interceptor","body":null}}
{"id":"f3531d4b-ad2d-43fa-8c9f-69e8d0ca2a5f","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51352"},"specVersion":"0.1.0","time":"2024-11-25T21:14:20.965392257Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"649f46c7-0510-4700-aa1a-ea4d2d93e15d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51352"},"specVersion":"0.1.0","time":"2024-11-25T21:14:20.967340632Z","eventData":"SUCCESS"}
{"id":"7f129b5e-e097-4fa7-8743-656a086ca40b","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35628"},"specVersion":"0.1.0","time":"2024-11-25T21:14:21.012453965Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"08526aa2-cbf3-46ea-bafd-24663e917bf7","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35628"},"specVersion":"0.1.0","time":"2024-11-25T21:14:21.012882424Z","eventData":"SUCCESS"}
{"id":"5e649700-c4ae-4aa3-be94-6cc1b3379185","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:35628"},"specVersion":"0.1.0","time":"2024-11-25T21:14:21.032641632Z","eventData":{"interceptorName":"guard-on-create-topic","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'roads' with number partitions is '100', must not be greater than 3. Topic 'roads' with replication factor is '1', must not be less than 2"}}
{"id":"497c725f-92b1-4f5f-9cbd-ca97540816ec","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51358"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.121335132Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"64d70996-78a1-4696-b95b-fb1c6a3a9f01","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51358"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.122234757Z","eventData":"SUCCESS"}
{"id":"9ee5c47b-f8dd-4814-9938-24ba06b9bdbf","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34722"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.167245758Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"31a79c25-9650-41fa-9a80-9d7482b94347","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34722"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.167671966Z","eventData":"SUCCESS"}
{"id":"46a1d622-4d89-4b42-b09f-87c2d19c88ac","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:53522"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.635370466Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"c7af41a7-73d9-4eeb-a2ec-d9ecfb25f37d","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40076"},"specVersion":"0.1.0","time":"2024-11-25T21:14:23.951101592Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"c5c2dd72-e6be-4832-a20d-460e6eef6bb9","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40076"},"specVersion":"0.1.0","time":"2024-11-25T21:14:23.952185633Z","eventData":"SUCCESS"}
{"id":"af854d64-89b7-41e6-9f4d-07f722072679","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54976"},"specVersion":"0.1.0","time":"2024-11-25T21:14:23.998344300Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"bc31122b-cb0b-4b7f-871e-86659c7cc19e","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54976"},"specVersion":"0.1.0","time":"2024-11-25T21:14:23.998801258Z","eventData":"SUCCESS"}
{"id":"8e766ce0-9219-4e33-9d15-f6b2798762ff","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51334"},"specVersion":"0.1.0","time":"2024-11-25T21:14:24.023533050Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"7d319dc7-8899-4210-aa59-e0701418fb19","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51334"},"specVersion":"0.1.0","time":"2024-11-25T21:14:24.024087675Z","eventData":"SUCCESS"}
{"id":"101363be-ede3-4234-ad8e-3e3b6005be76","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:54976"},"specVersion":"0.1.0","time":"2024-11-25T21:14:24.038199592Z","eventData":{"interceptorName":"guard-on-alter-topic","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Resource 'roads' with retention.ms is '5184000000', must not be greater than '432000000'"}}
{"id":"8464bfd8-8276-413f-8a58-4bf65c3897f2","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40090"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.318879509Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"6fb6b890-7f72-4d3c-aa65-1b073847db97","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40090"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.319528551Z","eventData":"SUCCESS"}
{"id":"92925f34-c2f0-4011-85c1-37af1bbbdc0e","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54980"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.363116884Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"19d5273a-2948-46ab-992c-0fd82da956bf","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54980"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.363528842Z","eventData":"SUCCESS"}
{"id":"51bddfd8-2945-4f71-bd89-7dea07813430","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:45808"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.925220426Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"beea3eb9-3981-4959-ad9f-7b94a87c8843","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40098"},"specVersion":"0.1.0","time":"2024-11-25T21:14:26.752367968Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"ba8fc445-d4f2-4c39-af6b-7e4c86b41dca","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40098"},"specVersion":"0.1.0","time":"2024-11-25T21:14:26.753795968Z","eventData":"SUCCESS"}
{"id":"040d2eb7-2dcd-463e-a670-4e19d03af805","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:51728"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.047298802Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"56425d00-8a68-4c55-a7c1-01bdbb9bd3df","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51336"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.047521677Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"756deefe-6a75-4808-91f5-804029671e61","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:51728"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.048567177Z","eventData":"SUCCESS"}
{"id":"576189a8-fe54-45ce-8070-92b013964753","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51336"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.048723302Z","eventData":"SUCCESS"}
{"id":"6fe6b668-4fea-40cf-bd77-70111e8ca6db","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:51336"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.118765260Z","eventData":{"interceptorName":"guard-on-produce","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1. Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]"}}
{"id":"bc5d95d0-5fb9-45ea-a6c7-f52187b69794","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40104"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.284875552Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"72472576-1b6c-4e66-9f61-8435f1c8d776","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40104"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.285270635Z","eventData":"SUCCESS"}
{"id":"6bfb221b-6c43-42c1-8e90-83d3201c3df1","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54990"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.331368177Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"865b6b2d-7f31-4560-95da-1571db12d41f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54990"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.331892469Z","eventData":"SUCCESS"}
{"id":"616d079d-ec05-4948-ba31-f25f49aad590","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51352"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.444843677Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"7035fef1-a505-4141-8f0d-99717b372855","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51352"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.445180886Z","eventData":"SUCCESS"}
{"id":"bb61cce5-8a1b-47d2-acf2-3c193268f465","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:45844"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.896296552Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"49fde621-61a7-44d4-b024-99655a046d3a","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40118"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.722236303Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"707d95e8-af45-4b06-8d56-e2cf932335cd","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40118"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.722928636Z","eventData":"SUCCESS"}
{"id":"aa064f9c-a892-47eb-9b32-687648141559","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:55000"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.774922303Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"1b307013-1981-4bdb-be43-79cee26289ca","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:55000"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.775307011Z","eventData":"SUCCESS"}
{"id":"72036dd6-87fc-4145-adcc-eda4c8678d04","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51354"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.887076053Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"1a290e6c-78bb-463c-9ebb-024f5512bae7","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51354"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.887418886Z","eventData":"SUCCESS"}
{"id":"2973a628-d4ce-4d4f-ab0c-2e232d470cdf","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:51354"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.902874928Z","eventData":{"interceptorName":"produce-rate","level":"warn","plugin":"io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Client produced (108) bytes, which is more than 1 bytes per second, producer will be throttled by 22 milliseconds"}}
{"id":"2c745f67-c346-4c20-9571-8108d35516cb","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:55588"},"specVersion":"0.1.0","time":"2024-11-25T21:14:34.792005430Z","eventData":{"method":"DELETE","path":"/gateway/v2/interceptor/produce-rate","body":null}}
{"id":"51eaef28-b32e-489b-9bc7-d24654cb4600","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:55594"},"specVersion":"0.1.0","time":"2024-11-25T21:14:34.877700555Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"e20cbe35-d06d-4e2b-9adf-206e24a959cb","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:54888"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.747491375Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"8916ae90-ed05-400d-abcc-467623ab4ac2","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:54888"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.748900875Z","eventData":"SUCCESS"}
{"id":"1c4867d2-8039-4dd5-82ea-a0069cfe0c73","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:40394"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.895882916Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"e4091e55-63bf-420c-993e-dae3696cc32a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:40394"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.896351041Z","eventData":"SUCCESS"}
{"id":"932d1540-e6db-4262-a2c8-3f53a844735b","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:40408"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.919486333Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"9d7f9c0a-339d-4f19-99a2-9272e6c9e245","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:40408"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.919799791Z","eventData":"SUCCESS"}
{"id":"363b27a2-4785-4eaf-97b8-ee0c3dba1ec3","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:40408"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.926927375Z","eventData":{"interceptorName":"consumer-group-name-policy","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin","message":"Request parameters do not satisfy the configured policy. GroupId 'group-not-within-policy' is invalid, naming convention must match with regular expression my-group.*"}}
{"id":"96355bf9-9957-438e-a6a8-df3ef6f2fc36","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:54896"},"specVersion":"0.1.0","time":"2024-11-25T21:14:41.520238752Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"8331c8d0-309e-4552-92c0-988da7c700cf","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:54896"},"specVersion":"0.1.0","time":"2024-11-25T21:14:41.524054961Z","eventData":"SUCCESS"}
{"id":"a83b07fb-5bc4-4469-b839-2ae55bb3e48e","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:51268"},"specVersion":"0.1.0","time":"2024-11-25T21:14:41.698116169Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"800831c6-b5fd-4888-8023-cf852401b0d4","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:51268"},"specVersion":"0.1.0","time":"2024-11-25T21:14:41.698608378Z","eventData":"SUCCESS"}
{"id":"da8ed35f-9448-4bb0-8c05-bada05ea9a93","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:40028"},"specVersion":"0.1.0","time":"2024-11-25T21:14:41.718223086Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"5a58fc22-3569-4a7f-b67c-b2468a58833b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:40028"},"specVersion":"0.1.0","time":"2024-11-25T21:14:41.718755711Z","eventData":"SUCCESS"}
{"id":"721f25a2-7cbc-4b32-9a74-fea40634fd29","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:40032"},"specVersion":"0.1.0","time":"2024-11-25T21:14:41.802829378Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"152a14e5-11ff-4a2a-922c-dd8f33a55cd4","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:40032"},"specVersion":"0.1.0","time":"2024-11-25T21:14:41.803232336Z","eventData":"SUCCESS"}
{"id":"536ec3f5-71a4-4677-9917-ef0ccf54c2b6","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:38914"},"specVersion":"0.1.0","time":"2024-11-25T21:14:45.389189004Z","eventData":{"method":"DELETE","path":"/gateway/v2/interceptor/consumer-group-name-policy","body":null}}
{"id":"16176e9d-8594-473c-bc04-3f1cd49d3fa6","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:38922"},"specVersion":"0.1.0","time":"2024-11-25T21:14:45.480720796Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"c562f08c-58c2-46c1-9a6f-4c12291ca623","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:59010"},"specVersion":"0.1.0","time":"2024-11-25T21:14:46.452319838Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"5cbc8ecb-baef-4d74-acf1-fa0e422cbb49","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:59010"},"specVersion":"0.1.0","time":"2024-11-25T21:14:46.452876755Z","eventData":"SUCCESS"}
{"id":"ec2141f4-6d03-4bae-880e-fc7e19bceb7f","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57598"},"specVersion":"0.1.0","time":"2024-11-25T21:14:46.621023297Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"48beda04-fc82-4544-b38a-59041b3c7f9f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57598"},"specVersion":"0.1.0","time":"2024-11-25T21:14:46.622847172Z","eventData":"SUCCESS"}
{"id":"8d24303b-2462-42ca-9125-ef22cf3ce1fe","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:44304"},"specVersion":"0.1.0","time":"2024-11-25T21:14:46.649514963Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"c41e563e-574a-470e-be21-8cdb39fe69f1","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:44304"},"specVersion":"0.1.0","time":"2024-11-25T21:14:46.650051922Z","eventData":"SUCCESS"}
{"id":"5443a0d1-9ef4-4306-8eab-6455117e35f2","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:44304"},"specVersion":"0.1.0","time":"2024-11-25T21:14:47.485651922Z","eventData":{"interceptorName":"guard-limit-connection","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Client connections exceed the limitation of 1 connections per second"}}
{"id":"fc7deec5-3974-4c8c-9fa4-57bc02a36863","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:44308"},"specVersion":"0.1.0","time":"2024-11-25T21:14:47.642684589Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"65259fa8-9ff3-4a14-9d83-b557bd937b51","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:44308"},"specVersion":"0.1.0","time":"2024-11-25T21:14:47.643549922Z","eventData":"SUCCESS"}
{"id":"d42a4286-4543-4115-8fc4-73a14e6233a8","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:44308"},"specVersion":"0.1.0","time":"2024-11-25T21:14:47.939103964Z","eventData":{"interceptorName":"guard-limit-connection","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Client connections exceed the limitation of 1 connections per second"}}
{"id":"aa95d0a8-7b3d-422f-a709-aee585864545","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:44314"},"specVersion":"0.1.0","time":"2024-11-25T21:14:48.076645881Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"d59c71c3-e0ab-40a9-bf74-a7c789eb71f1","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:44314"},"specVersion":"0.1.0","time":"2024-11-25T21:14:48.077008089Z","eventData":"SUCCESS"}
{"id":"b62bf73e-4acc-4eab-8a3d-4ec870fac33c","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:44314"},"specVersion":"0.1.0","time":"2024-11-25T21:14:48.630137631Z","eventData":{"interceptorName":"guard-limit-connection","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Client connections exceed the limitation of 1 connections per second"}}
{"id":"94982134-4929-4592-8632-3b1f8819e32b","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:44328"},"specVersion":"0.1.0","time":"2024-11-25T21:14:48.964693173Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"49bb4571-7c67-4a1a-88ec-e5e431da53be","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:44328"},"specVersion":"0.1.0","time":"2024-11-25T21:14:48.965205381Z","eventData":"SUCCESS"}
{"id":"6a60fa1c-8abe-419c-8fb7-7eb51a2ba436","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:44328"},"specVersion":"0.1.0","time":"2024-11-25T21:14:49.414781256Z","eventData":{"interceptorName":"guard-limit-connection","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Client connections exceed the limitation of 1 connections per second"}}
[2024-11-25 21:14:53,787] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 122 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692064.svg)](https://asciinema.org/a/692064)

</TabItem>
</Tabs>

## Remove interceptor guard-limit-connection








<Tabs>

<TabItem value="Command">
```sh
curl \
    --silent \
    --request DELETE "http://localhost:8888/gateway/v2/interceptor/guard-limit-connection" \
    --header "Content-Type: application/json" \
    --user "admin:conduktor" \
    --data-raw '{
  "vCluster" : "passthrough"
}' | jq
```


</TabItem>
<TabItem value="Output">

```json

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692065.svg)](https://asciinema.org/a/692065)

</TabItem>
</Tabs>

## Adding interceptor guard-agressive-auto-commit

Let's block aggressive auto-commits strategies




`step-32-guard-agressive-auto-commit-interceptor.json`:

```json
{
  "kind" : "Interceptor",
  "apiVersion" : "gateway/v2",
  "metadata" : {
    "name" : "guard-agressive-auto-commit"
  },
  "spec" : {
    "comment" : "Adding interceptor: guard-agressive-auto-commit",
    "pluginClass" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "priority" : 100,
    "config" : {
      "maximumCommitsPerMinute" : 1,
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
    --data @step-32-guard-agressive-auto-commit-interceptor.json | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "resource": {
    "kind": "Interceptor",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "guard-agressive-auto-commit",
      "scope": {
        "vCluster": "passthrough",
        "group": null,
        "username": null
      }
    },
    "spec": {
      "comment": "Adding interceptor: guard-agressive-auto-commit",
      "pluginClass": "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
      "priority": 100,
      "config": {
        "maximumCommitsPerMinute": 1,
        "action": "BLOCK"
      }
    }
  },
  "upsertResult": "CREATED"
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692066.svg)](https://asciinema.org/a/692066)

</TabItem>
</Tabs>

## Consuming from cars

Consuming from cars in cluster `gateway1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic cars \
    --from-beginning \
    --timeout-ms 3000 \
    --group group-with-aggressive-autocommit | jq
```


</TabItem>
<TabItem value="Output">

```json
[2024-11-25 21:15:01,591] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
[2024-11-25 21:15:01,919] ERROR [Consumer clientId=console-consumer, groupId=group-with-aggressive-autocommit] Offset commit failed on partition cars-0 at offset 5: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
[2024-11-25 21:15:01,919] WARN [Consumer clientId=console-consumer, groupId=group-with-aggressive-autocommit] Synchronous auto-commit of offsets {cars-0=OffsetAndMetadata{offset=5, leaderEpoch=0, metadata=''}} failed: Unexpected error in commit: Request parameters do not satisfy the configured policy. (org.apache.kafka.clients.consumer.internals.ConsumerCoordinator)
Processed a total of 5 messages
{
  "type": "Ferrari",
  "color": "red",
  "price": 10000
}
{
  "type": "RollsRoyce",
  "color": "black",
  "price": 9000
}
{
  "type": "Mercedes",
  "color": "black",
  "price": 6000
}
{
  "type": "Fiat",
  "color": "red",
  "price": -1
}
{
  "type": "Fiat",
  "color": "red",
  "price": -1
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692067.svg)](https://asciinema.org/a/692067)

</TabItem>
</Tabs>

## Check in the audit log that connection was denied

Check in the audit log that connection was denied in cluster `kafka1`






<Tabs>

<TabItem value="Command">
```sh
kafka-console-consumer \
    --bootstrap-server localhost:9092,localhost:9093,localhost:9094 \
    --topic _conduktor_gateway_auditlogs \
    --from-beginning \
    --timeout-ms 3000 \| jq 'select(.type=="SAFEGUARD" and .eventData.plugin=="io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin")'
```


returns 97 events
```json
{
  "id" : "e5cd9e94-63f8-4b15-80be-4efd6d2e7293",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:02.366408596Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "496e69e6-bcdc-4267-8a81-9b4ce851ee23",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:02.581626346Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "ec86e5bd-0f79-4abd-b9b2-dafee6a5fd9d",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:02.853232388Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "0a16c8ec-404c-4c6e-b886-7edf00d55555",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:02.966332221Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "9678910d-b383-4152-a58a-f31525b52cda",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.057689263Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "83837ef3-8877-40ca-8db9-7ec59bf1c1b6",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.095049971Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "bc73d37b-51c0-424f-b72b-32f1acd015b6",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.110465679Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "38e2f0e9-4f6d-4784-87a5-7c5edbc68f26",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.166864388Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "4c444c80-a2d2-4195-b696-0df96135685a",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.174546179Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "b41dac87-107c-4cbf-9f8c-f5d194ada13a",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.178724263Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "f96af90e-15c9-4296-8afb-c45bed7c4b23",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.271905346Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "2422b1be-348b-49b4-8759-fbb4a6f6aa02",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.366436055Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "e24f5be4-c0a5-4702-bfe9-c6d495f6372d",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.481124555Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "25fe96cf-65c9-4101-8c67-fdea78bd1e47",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.536608388Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "4c30147e-f86c-44ed-8944-27d6ea721fc0",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.605800138Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "7793390a-da67-40db-83e5-13a11409c98f",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.711637555Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "b3e887e3-339b-4111-89eb-359eb72f0da0",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.744428721Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "1a5c191a-cb65-4fd6-a781-ac9f07d4a46a",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.777703846Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "8a3d7795-8960-493c-9845-34b6e61b0431",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.787502180Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "bda241f1-3ff1-4cf3-8d1a-99a13bfce86b",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.808810846Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "d63615e8-943b-4d41-9806-ec522bdbdcae",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.825743638Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "cddc30df-3111-40d4-b3dd-1448da4bb589",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.889991471Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "63677f38-e2d9-4491-8ae4-b30a44b07a4c",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:03.990913180Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "3fa4ac34-0c10-4b4b-9b89-c70e112c5b21",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.001465722Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "5e7e2c5b-a31d-46cf-8b35-48beadffeeb1",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.075681513Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "0e417065-ea73-4b96-9f15-3fda34e3afa9",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.108583597Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "0732634f-2b5b-400f-ba08-4f83d81e159c",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.212256138Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "00739454-2b1d-4058-bf60-8bed88226e22",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.219489680Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "c6749494-4bcb-48b1-a485-549df487ceef",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.269059055Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "388d4506-3576-485e-8166-70f438168d8d",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.327418305Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "1f952c09-9745-453a-b53e-7d7dfe37026f",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.392384097Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "8966b4b0-3d4d-48b7-8b30-fed93d90b43f",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.392373888Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "ab05a7b4-b061-4c97-8643-1a625a47c869",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.415559388Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "6c39bc84-b6ef-4cfa-b90f-9c168f016b0a",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.427850430Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "02960f88-e4b4-40c0-9b13-f4f3a63cdac8",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.439232555Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "3f217342-4ecd-4b7a-afb9-38bd8d2a07c5",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.498996055Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "bcd33017-cc9e-4269-b5c4-bf27d46fd710",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.600882305Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "81fc4b35-9bbc-4743-a0a8-e28b8ea83064",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.604968472Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "86ddba64-e340-408d-a00a-2d8fde1b9e6a",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.634912763Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "06fe8890-5c50-4c94-9b3f-bd719da08a28",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.713141514Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "d4097f19-76bf-4114-96fe-96ee30564efd",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.750994347Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "fda6bb10-1976-4bcb-91b1-86b706858c12",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.938871055Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "45cbe328-917c-4bc5-af6c-38510a3b9b25",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.942587472Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "520f43da-c5ae-46cb-9322-fcdc69a5572a",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.957582097Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "2390432c-e80f-4680-aad4-9184a06738bf",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.980996555Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "64e3a624-32c9-43bf-aa19-05b128e7c6de",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:04.991348389Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "ec119287-9099-4fbc-bdc4-02aaa6ee0a99",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.059325597Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "857f70aa-5f19-450f-8106-a87d8feb026f",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.101935597Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "671e8560-3c85-469a-ac27-f0f833429682",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.252905639Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "a8ebef97-7559-4824-90c9-a1ad40c52683",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.310545930Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "e3658af2-13c7-40f8-8a2f-93b3c5c77ed7",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.324344125Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "41e9ae11-5045-413b-99a9-efaa51439768",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.329848541Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "95c3c8ee-736a-491e-a9ce-77a6c891ab12",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.364054125Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "3670f348-5a3f-4ad7-a4ce-206865bac5b8",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.373317875Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "d5d75c0c-b395-4c5c-909b-6cd531f4309c",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.487623625Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "80346e1d-c26e-4891-9dc5-289d1e74abdd",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.574224166Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "e65f2873-a3bb-41db-a450-2965c2ff3c44",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.631219Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "a877507c-1ce2-4f39-93f6-d3cb38f1656b",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.638905Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "bc8e0adf-1b5b-494a-82c4-53758ac35b92",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.697888291Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "c9fcd500-a441-401b-a054-d25a09f3ed11",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.801486083Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "a57a051d-4c78-41f8-b77c-ca144347e3c7",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.874986250Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "80c1c8cd-ae63-4c62-bd34-01997b49ab8e",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.883368250Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "8bbe1ec6-4ca8-4032-9d7c-37f44423b85b",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:05.984181Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "e0af8de9-224f-4b7d-bb2f-3ed722e5eee2",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.033444292Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "fe712255-3b45-4c03-962c-fcb62f001e7d",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.108824292Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "bb4fe926-6caf-481e-8e2c-b9874338b6d0",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.158726667Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "2965a7c9-02bc-48ea-983f-ec893b0c8001",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.175329458Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "a87c236e-6801-4611-b795-0354bc3bcc7b",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.189969917Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "9c07bec1-83d1-4258-968c-428850c6d756",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.248255917Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "3f76a4e1-e689-479a-8b9d-f22d676bdb5d",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.254007417Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "24cebc11-62e7-4aff-877c-61a98e93e13b",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.367288375Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "78db0efc-da71-40e9-941d-2f14b22a0a18",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.371583250Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "98d0a3cd-3e75-4705-9e30-fc424a0a9f90",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.728852334Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "fb809a7e-2403-47f1-be8b-f64c83c61b90",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.731460084Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "b11ecb0a-7d73-458d-bb0b-fbbb0b288ff5",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.772300500Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "eb5028d3-6a29-4033-a1b9-61f6ddac4d7b",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.825740167Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "a4f1f1a1-7d44-443d-a1ec-e7b999a57087",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.905312167Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "87339ef1-d008-4b0b-91ac-46079946965e",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.915553834Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "2110fb70-534d-43bf-9a0b-24e4a4e3fd65",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.936640250Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "192213f2-45ac-40db-bce0-c3073e05d581",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:06.940453292Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "b9b993c0-924e-4a49-af00-75449e0eec65",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.021481Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "112c89be-1d15-42b0-b031-006c3af65742",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.028425167Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "30fe4a4b-f1ec-4c8a-adb0-010ee777a295",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.043054834Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "eaa58702-a40c-4922-a76f-c0e918e96d5b",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.062806625Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "cc08fc04-263e-4d79-8172-e5f8b776238c",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.091679334Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "b38f6726-af00-4da5-b3ae-70122bf332f3",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.105495625Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "a9a03111-9283-464e-9253-bf9a5241b0ad",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.117796334Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "71d54803-3c8b-4c9d-822c-7184f32e5183",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.172939Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "21de565f-4e52-438b-b0ee-d70275260c4f",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.272719292Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "5350aab8-65e5-48ac-b5c0-6ed83c548bc2",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.286530042Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "2660471e-ba1d-4a2c-8ac0-f2c5a6ce905d",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.293626209Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "b68cae2c-1c10-410f-89c7-b7b733ff5305",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.342466584Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "1d6b4797-bb4f-41b9-9cdd-cc97ac3c7a02",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.352286500Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "099f148a-64de-459f-9a57-96f070ecf5fa",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.413897959Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "109ed2b9-2c8a-4506-9076-db301451f64d",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.547501917Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "02414471-c6a1-4b4f-9229-f90dd70e8014",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.817293959Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
{
  "id" : "7dae1f57-a1ae-4d24-a927-62e0a180baf2",
  "source" : "krn://cluster=p0KPFA_mQb2ixdPbQXPblw",
  "type" : "SAFEGUARD",
  "authenticationPrincipal" : "passthrough",
  "userName" : "anonymous",
  "connection" : {
    "localAddress" : null,
    "remoteAddress" : "/192.168.48.1:51426"
  },
  "specVersion" : "0.1.0",
  "time" : "2024-11-25T21:13:07.832422876Z",
  "eventData" : {
    "interceptorName" : "guard-agressive-auto-commit",
    "level" : "error",
    "plugin" : "io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin",
    "message" : "Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"
  }
}
```

</TabItem>
<TabItem value="Output">

```
{"id":"1c801362-7cb6-4d50-ae8b-de26124fbeae","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53308"},"specVersion":"0.1.0","time":"2024-11-25T21:14:09.193944085Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"054a7640-ac64-4529-8cf3-f1a9fd558373","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53308"},"specVersion":"0.1.0","time":"2024-11-25T21:14:09.227456751Z","eventData":"SUCCESS"}
{"id":"8791677f-c4c0-4b62-9e65-4f1f6961b056","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:52238"},"specVersion":"0.1.0","time":"2024-11-25T21:14:09.330163293Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"949e7723-f420-49d6-aa56-3e26db1081bf","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:52238"},"specVersion":"0.1.0","time":"2024-11-25T21:14:09.330881168Z","eventData":"SUCCESS"}
{"id":"2a677e99-e857-43cf-a274-df1c170eba42","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53316"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.615217710Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"560b4fdd-13aa-496b-b7fc-08df6034a080","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53316"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.616220294Z","eventData":"SUCCESS"}
{"id":"add1f42e-bf00-4330-a1c9-d0638cc8cddd","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:59048"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.678551169Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"4687d9a6-54b6-4e5c-8df7-7f41fd481fc3","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:59048"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.679027627Z","eventData":"SUCCESS"}
{"id":"876361af-c334-447e-9b55-41c63c0b2784","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:33868"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.800283835Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"16254f5a-ba5c-4ebf-a211-e20b45861e2b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:33868"},"specVersion":"0.1.0","time":"2024-11-25T21:14:10.800708127Z","eventData":"SUCCESS"}
{"id":"df4df083-a82f-4b2c-834d-73e095490ad9","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53324"},"specVersion":"0.1.0","time":"2024-11-25T21:14:11.988921586Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"cb068ce0-66c7-474c-aede-182910aba4cc","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:53324"},"specVersion":"0.1.0","time":"2024-11-25T21:14:11.989556378Z","eventData":"SUCCESS"}
{"id":"b9a61454-e024-4742-8b2e-3b1b5996c4fe","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:59054"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.044323753Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"ac32b54d-639d-4ef9-a70c-10f2e29bf6ad","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:59054"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.044987419Z","eventData":"SUCCESS"}
{"id":"6bd9ca11-dc3a-4207-9b24-76bd8eab39f4","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:52252"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.163371419Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"c2eba891-5950-4e5e-8c48-a64babec308d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:52252"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.163830711Z","eventData":"SUCCESS"}
{"id":"b1099b1a-7247-4681-9678-f1aff12b1136","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:33874"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.172852336Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"f37fb40a-625e-49f5-b435-ff4f376f78a1","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:33874"},"specVersion":"0.1.0","time":"2024-11-25T21:14:12.173165253Z","eventData":"SUCCESS"}
{"id":"797f77c6-73ba-4152-9c34-c9c88df37a40","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51332"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.355264212Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"d9298789-f4d4-4b00-ba43-2f69e08b4223","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51332"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.355835087Z","eventData":"SUCCESS"}
{"id":"9f800f59-545e-4990-977e-15e3a0a812d1","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57558"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.413305670Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"1ddf7b6b-a8ba-4c71-bd25-370ea61bdfaa","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57558"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.413895920Z","eventData":"SUCCESS"}
{"id":"9f163db7-9ec8-4e08-baa7-f1b85412d0c7","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35592"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.527201628Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"54eb8f44-cbea-4831-88d5-ff10647852f2","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35592"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.527563712Z","eventData":"SUCCESS"}
{"id":"a0038af3-aabb-4e76-8418-fad1305cbc59","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34684"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.535480712Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"08448720-8704-4eb0-9d98-46ce1dacb516","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34684"},"specVersion":"0.1.0","time":"2024-11-25T21:14:13.536544753Z","eventData":"SUCCESS"}
{"id":"5ff0597f-4003-4661-ad09-9afdb56968bf","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51342"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.786480254Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"eb35fd50-47a9-403e-b6fb-d0f5233217dc","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51342"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.789925046Z","eventData":"SUCCESS"}
{"id":"8100a2f8-ef2a-45c7-9168-0f25aaf5af2c","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35600"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.940521504Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"4b562390-7412-4761-aaf6-32abf29b3472","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35600"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.941024796Z","eventData":"SUCCESS"}
{"id":"426a3e19-891d-4900-aa1a-7f732eebcf92","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57574"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.964559254Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"ea6bcb24-bd14-4a72-ae98-e985988b130f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57574"},"specVersion":"0.1.0","time":"2024-11-25T21:14:14.965057337Z","eventData":"SUCCESS"}
{"id":"1b23e23a-4bb7-4545-bf2d-948739fd2ef8","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34700"},"specVersion":"0.1.0","time":"2024-11-25T21:14:15.131363421Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"ae08f04e-a031-455d-ad29-ba44ecf6206a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34700"},"specVersion":"0.1.0","time":"2024-11-25T21:14:15.131864796Z","eventData":"SUCCESS"}
{"id":"4900af12-80ce-461e-b19f-a990d5430755","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51346"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.337844464Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"172c0cde-17c9-419a-a675-ddcacbd83285","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51346"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.338756339Z","eventData":"SUCCESS"}
{"id":"3da12440-2334-493b-869a-0b0a8a1b9a66","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34714"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.409453506Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"38c77628-20b4-4e7b-8ab0-8856dccbf059","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34714"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.409895965Z","eventData":"SUCCESS"}
{"id":"06284928-05cf-4b0f-b419-28fa5b1548a3","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57578"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.430416006Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"f7f548dd-d2cc-4fad-bc43-9c33d26ee408","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57578"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.431084465Z","eventData":"SUCCESS"}
{"id":"9ffc9d67-2533-4e93-a488-0f8f74266346","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35616"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.451230048Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"090db4b4-6d37-4ca3-8e96-85f016e8e69b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35616"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.452084590Z","eventData":"SUCCESS"}
{"id":"dc998393-e17f-4393-9286-442bb4ad34cb","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:53494"},"specVersion":"0.1.0","time":"2024-11-25T21:14:19.899078131Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"ea87a6a5-99a2-4a10-b5ba-7503fa429209","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:53506"},"specVersion":"0.1.0","time":"2024-11-25T21:14:20.212457673Z","eventData":{"method":"GET","path":"/gateway/v2/interceptor","body":null}}
{"id":"f3531d4b-ad2d-43fa-8c9f-69e8d0ca2a5f","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51352"},"specVersion":"0.1.0","time":"2024-11-25T21:14:20.965392257Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"649f46c7-0510-4700-aa1a-ea4d2d93e15d","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51352"},"specVersion":"0.1.0","time":"2024-11-25T21:14:20.967340632Z","eventData":"SUCCESS"}
{"id":"7f129b5e-e097-4fa7-8743-656a086ca40b","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35628"},"specVersion":"0.1.0","time":"2024-11-25T21:14:21.012453965Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"08526aa2-cbf3-46ea-bafd-24663e917bf7","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:35628"},"specVersion":"0.1.0","time":"2024-11-25T21:14:21.012882424Z","eventData":"SUCCESS"}
{"id":"5e649700-c4ae-4aa3-be94-6cc1b3379185","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:35628"},"specVersion":"0.1.0","time":"2024-11-25T21:14:21.032641632Z","eventData":{"interceptorName":"guard-on-create-topic","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.CreateTopicPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'roads' with number partitions is '100', must not be greater than 3. Topic 'roads' with replication factor is '1', must not be less than 2"}}
{"id":"497c725f-92b1-4f5f-9cbd-ca97540816ec","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51358"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.121335132Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"64d70996-78a1-4696-b95b-fb1c6a3a9f01","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:51358"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.122234757Z","eventData":"SUCCESS"}
{"id":"9ee5c47b-f8dd-4814-9938-24ba06b9bdbf","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34722"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.167245758Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"31a79c25-9650-41fa-9a80-9d7482b94347","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:34722"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.167671966Z","eventData":"SUCCESS"}
{"id":"46a1d622-4d89-4b42-b09f-87c2d19c88ac","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:53522"},"specVersion":"0.1.0","time":"2024-11-25T21:14:22.635370466Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"c7af41a7-73d9-4eeb-a2ec-d9ecfb25f37d","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40076"},"specVersion":"0.1.0","time":"2024-11-25T21:14:23.951101592Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"c5c2dd72-e6be-4832-a20d-460e6eef6bb9","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40076"},"specVersion":"0.1.0","time":"2024-11-25T21:14:23.952185633Z","eventData":"SUCCESS"}
{"id":"af854d64-89b7-41e6-9f4d-07f722072679","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54976"},"specVersion":"0.1.0","time":"2024-11-25T21:14:23.998344300Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"bc31122b-cb0b-4b7f-871e-86659c7cc19e","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54976"},"specVersion":"0.1.0","time":"2024-11-25T21:14:23.998801258Z","eventData":"SUCCESS"}
{"id":"8e766ce0-9219-4e33-9d15-f6b2798762ff","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51334"},"specVersion":"0.1.0","time":"2024-11-25T21:14:24.023533050Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"7d319dc7-8899-4210-aa59-e0701418fb19","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51334"},"specVersion":"0.1.0","time":"2024-11-25T21:14:24.024087675Z","eventData":"SUCCESS"}
{"id":"101363be-ede3-4234-ad8e-3e3b6005be76","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:54976"},"specVersion":"0.1.0","time":"2024-11-25T21:14:24.038199592Z","eventData":{"interceptorName":"guard-on-alter-topic","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.AlterTopicConfigPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Resource 'roads' with retention.ms is '5184000000', must not be greater than '432000000'"}}
{"id":"8464bfd8-8276-413f-8a58-4bf65c3897f2","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40090"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.318879509Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"6fb6b890-7f72-4d3c-aa65-1b073847db97","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40090"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.319528551Z","eventData":"SUCCESS"}
{"id":"92925f34-c2f0-4011-85c1-37af1bbbdc0e","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54980"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.363116884Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"19d5273a-2948-46ab-992c-0fd82da956bf","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54980"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.363528842Z","eventData":"SUCCESS"}
{"id":"51bddfd8-2945-4f71-bd89-7dea07813430","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:45808"},"specVersion":"0.1.0","time":"2024-11-25T21:14:25.925220426Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"beea3eb9-3981-4959-ad9f-7b94a87c8843","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40098"},"specVersion":"0.1.0","time":"2024-11-25T21:14:26.752367968Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"ba8fc445-d4f2-4c39-af6b-7e4c86b41dca","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40098"},"specVersion":"0.1.0","time":"2024-11-25T21:14:26.753795968Z","eventData":"SUCCESS"}
{"id":"040d2eb7-2dcd-463e-a670-4e19d03af805","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:51728"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.047298802Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"56425d00-8a68-4c55-a7c1-01bdbb9bd3df","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51336"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.047521677Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"756deefe-6a75-4808-91f5-804029671e61","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:51728"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.048567177Z","eventData":"SUCCESS"}
{"id":"576189a8-fe54-45ce-8070-92b013964753","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51336"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.048723302Z","eventData":"SUCCESS"}
{"id":"6fe6b668-4fea-40cf-bd77-70111e8ca6db","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:51336"},"specVersion":"0.1.0","time":"2024-11-25T21:14:27.118765260Z","eventData":{"interceptorName":"guard-on-produce","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ProducePolicyPlugin","message":"Request parameters do not satisfy the configured policy. Topic 'cars' with invalid value for 'acks': 1. Valid value is one of the values: -1. Topic 'cars' with invalid value for 'compressions': SNAPPY. Valid value is one of the values: [GZIP, NONE]"}}
{"id":"bc5d95d0-5fb9-45ea-a6c7-f52187b69794","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40104"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.284875552Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"72472576-1b6c-4e66-9f61-8435f1c8d776","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40104"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.285270635Z","eventData":"SUCCESS"}
{"id":"6bfb221b-6c43-42c1-8e90-83d3201c3df1","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54990"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.331368177Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"865b6b2d-7f31-4560-95da-1571db12d41f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:54990"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.331892469Z","eventData":"SUCCESS"}
{"id":"616d079d-ec05-4948-ba31-f25f49aad590","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51352"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.444843677Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"7035fef1-a505-4141-8f0d-99717b372855","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51352"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.445180886Z","eventData":"SUCCESS"}
{"id":"bb61cce5-8a1b-47d2-acf2-3c193268f465","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:45844"},"specVersion":"0.1.0","time":"2024-11-25T21:14:28.896296552Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"49fde621-61a7-44d4-b024-99655a046d3a","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40118"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.722236303Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"707d95e8-af45-4b06-8d56-e2cf932335cd","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:40118"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.722928636Z","eventData":"SUCCESS"}
{"id":"aa064f9c-a892-47eb-9b32-687648141559","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:55000"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.774922303Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"1b307013-1981-4bdb-be43-79cee26289ca","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:55000"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.775307011Z","eventData":"SUCCESS"}
{"id":"72036dd6-87fc-4145-adcc-eda4c8678d04","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51354"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.887076053Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"1a290e6c-78bb-463c-9ebb-024f5512bae7","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:51354"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.887418886Z","eventData":"SUCCESS"}
{"id":"2973a628-d4ce-4d4f-ab0c-2e232d470cdf","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:51354"},"specVersion":"0.1.0","time":"2024-11-25T21:14:29.902874928Z","eventData":{"interceptorName":"produce-rate","level":"warn","plugin":"io.conduktor.gateway.interceptor.safeguard.ProducerRateLimitingPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Client produced (108) bytes, which is more than 1 bytes per second, producer will be throttled by 22 milliseconds"}}
{"id":"2c745f67-c346-4c20-9571-8108d35516cb","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:55588"},"specVersion":"0.1.0","time":"2024-11-25T21:14:34.792005430Z","eventData":{"method":"DELETE","path":"/gateway/v2/interceptor/produce-rate","body":null}}
{"id":"51eaef28-b32e-489b-9bc7-d24654cb4600","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:55594"},"specVersion":"0.1.0","time":"2024-11-25T21:14:34.877700555Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"e20cbe35-d06d-4e2b-9adf-206e24a959cb","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:54888"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.747491375Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"8916ae90-ed05-400d-abcc-467623ab4ac2","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:54888"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.748900875Z","eventData":"SUCCESS"}
{"id":"1c4867d2-8039-4dd5-82ea-a0069cfe0c73","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:40394"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.895882916Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"e4091e55-63bf-420c-993e-dae3696cc32a","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:40394"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.896351041Z","eventData":"SUCCESS"}
{"id":"932d1540-e6db-4262-a2c8-3f53a844735b","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:40408"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.919486333Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"9d7f9c0a-339d-4f19-99a2-9272e6c9e245","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:40408"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.919799791Z","eventData":"SUCCESS"}
{"id":"363b27a2-4785-4eaf-97b8-ee0c3dba1ec3","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:40408"},"specVersion":"0.1.0","time":"2024-11-25T21:14:35.926927375Z","eventData":{"interceptorName":"consumer-group-name-policy","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.ConsumerGroupPolicyPlugin","message":"Request parameters do not satisfy the configured policy. GroupId 'group-not-within-policy' is invalid, naming convention must match with regular expression my-group.*"}}
{"id":"96355bf9-9957-438e-a6a8-df3ef6f2fc36","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:54896"},"specVersion":"0.1.0","time":"2024-11-25T21:14:41.520238752Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"8331c8d0-309e-4552-92c0-988da7c700cf","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:54896"},"specVersion":"0.1.0","time":"2024-11-25T21:14:41.524054961Z","eventData":"SUCCESS"}
{"id":"a83b07fb-5bc4-4469-b839-2ae55bb3e48e","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:51268"},"specVersion":"0.1.0","time":"2024-11-25T21:14:41.698116169Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"800831c6-b5fd-4888-8023-cf852401b0d4","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:51268"},"specVersion":"0.1.0","time":"2024-11-25T21:14:41.698608378Z","eventData":"SUCCESS"}
{"id":"da8ed35f-9448-4bb0-8c05-bada05ea9a93","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:40028"},"specVersion":"0.1.0","time":"2024-11-25T21:14:41.718223086Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"5a58fc22-3569-4a7f-b67c-b2468a58833b","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:40028"},"specVersion":"0.1.0","time":"2024-11-25T21:14:41.718755711Z","eventData":"SUCCESS"}
{"id":"721f25a2-7cbc-4b32-9a74-fea40634fd29","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:40032"},"specVersion":"0.1.0","time":"2024-11-25T21:14:41.802829378Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"152a14e5-11ff-4a2a-922c-dd8f33a55cd4","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:40032"},"specVersion":"0.1.0","time":"2024-11-25T21:14:41.803232336Z","eventData":"SUCCESS"}
{"id":"536ec3f5-71a4-4677-9917-ef0ccf54c2b6","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:38914"},"specVersion":"0.1.0","time":"2024-11-25T21:14:45.389189004Z","eventData":{"method":"DELETE","path":"/gateway/v2/interceptor/consumer-group-name-policy","body":null}}
{"id":"16176e9d-8594-473c-bc04-3f1cd49d3fa6","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:38922"},"specVersion":"0.1.0","time":"2024-11-25T21:14:45.480720796Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"c562f08c-58c2-46c1-9a6f-4c12291ca623","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:59010"},"specVersion":"0.1.0","time":"2024-11-25T21:14:46.452319838Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"5cbc8ecb-baef-4d74-acf1-fa0e422cbb49","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:59010"},"specVersion":"0.1.0","time":"2024-11-25T21:14:46.452876755Z","eventData":"SUCCESS"}
{"id":"ec2141f4-6d03-4bae-880e-fc7e19bceb7f","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57598"},"specVersion":"0.1.0","time":"2024-11-25T21:14:46.621023297Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"48beda04-fc82-4544-b38a-59041b3c7f9f","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6970","remoteAddress":"/172.22.0.1:57598"},"specVersion":"0.1.0","time":"2024-11-25T21:14:46.622847172Z","eventData":"SUCCESS"}
{"id":"8d24303b-2462-42ca-9125-ef22cf3ce1fe","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:44304"},"specVersion":"0.1.0","time":"2024-11-25T21:14:46.649514963Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"c41e563e-574a-470e-be21-8cdb39fe69f1","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:44304"},"specVersion":"0.1.0","time":"2024-11-25T21:14:46.650051922Z","eventData":"SUCCESS"}
{"id":"5443a0d1-9ef4-4306-8eab-6455117e35f2","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:44304"},"specVersion":"0.1.0","time":"2024-11-25T21:14:47.485651922Z","eventData":{"interceptorName":"guard-limit-connection","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Client connections exceed the limitation of 1 connections per second"}}
{"id":"fc7deec5-3974-4c8c-9fa4-57bc02a36863","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:44308"},"specVersion":"0.1.0","time":"2024-11-25T21:14:47.642684589Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"65259fa8-9ff3-4a14-9d83-b557bd937b51","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:44308"},"specVersion":"0.1.0","time":"2024-11-25T21:14:47.643549922Z","eventData":"SUCCESS"}
{"id":"d42a4286-4543-4115-8fc4-73a14e6233a8","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:44308"},"specVersion":"0.1.0","time":"2024-11-25T21:14:47.939103964Z","eventData":{"interceptorName":"guard-limit-connection","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Client connections exceed the limitation of 1 connections per second"}}
{"id":"aa95d0a8-7b3d-422f-a709-aee585864545","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:44314"},"specVersion":"0.1.0","time":"2024-11-25T21:14:48.076645881Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"d59c71c3-e0ab-40a9-bf74-a7c789eb71f1","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:44314"},"specVersion":"0.1.0","time":"2024-11-25T21:14:48.077008089Z","eventData":"SUCCESS"}
{"id":"b62bf73e-4acc-4eab-8a3d-4ec870fac33c","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:44314"},"specVersion":"0.1.0","time":"2024-11-25T21:14:48.630137631Z","eventData":{"interceptorName":"guard-limit-connection","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Client connections exceed the limitation of 1 connections per second"}}
{"id":"94982134-4929-4592-8632-3b1f8819e32b","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:44328"},"specVersion":"0.1.0","time":"2024-11-25T21:14:48.964693173Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"49bb4571-7c67-4a1a-88ec-e5e431da53be","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:44328"},"specVersion":"0.1.0","time":"2024-11-25T21:14:48.965205381Z","eventData":"SUCCESS"}
{"id":"6a60fa1c-8abe-419c-8fb7-7eb51a2ba436","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:44328"},"specVersion":"0.1.0","time":"2024-11-25T21:14:49.414781256Z","eventData":{"interceptorName":"guard-limit-connection","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitConnectionPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Client connections exceed the limitation of 1 connections per second"}}
{"id":"017a26c9-1565-486b-ae54-1a1b8fc79df8","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:50640"},"specVersion":"0.1.0","time":"2024-11-25T21:14:54.248676842Z","eventData":{"method":"DELETE","path":"/gateway/v2/interceptor/guard-limit-connection","body":null}}
{"id":"98c69d79-11d8-4ffe-8870-8c4762f5d663","source":"Optional.empty","type":"REST_API","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"172.22.0.6:8888","remoteAddress":"172.22.0.1:50656"},"specVersion":"0.1.0","time":"2024-11-25T21:14:54.325156759Z","eventData":{"method":"PUT","path":"/gateway/v2/interceptor","body":null}}
{"id":"bc71cc3e-b328-4e11-a77e-3818ae1e7bb1","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:33794"},"specVersion":"0.1.0","time":"2024-11-25T21:14:55.292420842Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"97ae452d-14fd-4ac4-86b9-bee8a7794f31","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6969","remoteAddress":"/172.22.0.1:33794"},"specVersion":"0.1.0","time":"2024-11-25T21:14:55.294653176Z","eventData":"SUCCESS"}
{"id":"a1bfa870-613e-4318-b111-b335b666b8a3","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:41622"},"specVersion":"0.1.0","time":"2024-11-25T21:14:55.460001842Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"2590f051-05b8-49ff-a0ca-5b8c7cc598ff","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6971","remoteAddress":"/172.22.0.1:41622"},"specVersion":"0.1.0","time":"2024-11-25T21:14:55.460615592Z","eventData":"SUCCESS"}
{"id":"f49219a7-b900-45b5-9360-6f38b3027f11","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:56268"},"specVersion":"0.1.0","time":"2024-11-25T21:14:55.484856592Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"1ea7abce-bb7b-4647-bc21-a759bf9b3e46","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:56268"},"specVersion":"0.1.0","time":"2024-11-25T21:14:55.485758051Z","eventData":"SUCCESS"}
{"id":"b82ffe58-1be1-4fc1-9065-4079da014492","source":null,"type":"CONNECTION","authenticationPrincipal":null,"userName":null,"connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:56272"},"specVersion":"0.1.0","time":"2024-11-25T21:14:55.553793426Z","eventData":{"clientSoftwareVersion":"3.7.0","clientSoftwareName":"apache-kafka-java"}}
{"id":"cb79f4e2-44af-4531-ab12-c883f90bcc37","source":null,"type":"AUTHENTICATION","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":"/172.22.0.6:6972","remoteAddress":"/172.22.0.1:56272"},"specVersion":"0.1.0","time":"2024-11-25T21:14:55.554185092Z","eventData":"SUCCESS"}
{"id":"cfff646c-c6cc-4d0c-9e83-c19c068e649b","source":"krn://cluster=p0KPFA_mQb2ixdPbQXPblw","type":"SAFEGUARD","authenticationPrincipal":"passthrough","userName":"anonymous","connection":{"localAddress":null,"remoteAddress":"/172.22.0.1:56268"},"specVersion":"0.1.0","time":"2024-11-25T21:15:01.902744679Z","eventData":{"interceptorName":"guard-agressive-auto-commit","level":"error","plugin":"io.conduktor.gateway.interceptor.safeguard.LimitCommitOffsetPolicyPlugin","message":"Request parameters do not satisfy the configured policy. Client calls join group (group-with-aggressive-autocommit) exceed the limitation of 1 commits per minute"}}
[2024-11-25 21:15:06,317] ERROR Error processing message, terminating consumer process:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.TimeoutException
Processed a total of 133 messages

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692068.svg)](https://asciinema.org/a/692068)

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
 Container schema-registry  Stopping
 Container gateway1  Stopping
 Container gateway2  Stopping
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway2  Removed
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway1  Removed
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container schema-registry  Removed
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka2  Stopping
 Container kafka2  Stopped
 Container kafka2  Removing
 Container kafka2  Removed
 Container kafka1  Stopped
 Container kafka1  Removing
 Container kafka1  Removed
 Container kafka-client  Stopped
 Container kafka-client  Removing
 Container kafka-client  Removed
 Container kafka3  Stopped
 Container kafka3  Removing
 Container kafka3  Removed
 Network safeguard_default  Removing
 Network safeguard_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/692069.svg)](https://asciinema.org/a/692069)

</TabItem>
</Tabs>

# Conclusion

Safeguard is really a game changer!

