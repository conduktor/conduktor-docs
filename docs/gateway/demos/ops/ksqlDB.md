---
title: ksqldb
description: ksqldb
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# a ksqlDB experience on concentrated topics



## View the full demo in realtime




<Tabs>
<TabItem value="Command">

You can either follow all the steps manually, or watch the recording

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/SZCZbWVL2r0i1JFsg7Kc7vkuN.svg)](https://asciinema.org/a/SZCZbWVL2r0i1JFsg7Kc7vkuN)

</TabItem>
</Tabs>

## Review the docker compose environment

As can be seen from `docker-compose.yaml` the demo environment consists of the following services:

* gateway1
* gateway2
* kafka1
* kafka2
* kafka3
* ksqldb-server
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
  ksqldb-server:
    image: confluentinc/cp-ksqldb-server:7.4.3.arm64
    healthcheck:
      test: curl localhost:8088/info | grep RUNNING
      interval: 5s
      retries: 25
    hostname: ksqldb-server
    environment:
      KSQL_LISTENERS: http://0.0.0.0:8088
      KSQL_BOOTSTRAP_SERVERS: ${KSQL_BOOTSTRAP_SERVERS:-}
      KSQL_SECURITY_PROTOCOL: ${KSQL_SECURITY_PROTOCOL:-}
      KSQL_SASL_MECHANISM: ${KSQL_SASL_MECHANISM:-}
      KSQL_SASL_JAAS_CONFIG: ${KSQL_SASL_JAAS_CONFIG:-}
      KSQL_KSQL_STREAMS_PROCESSING_GUARANTEE: exactly_once_v2
      KSQL_KSQL_LOGGING_PROCESSING_STREAM_AUTO_CREATE: 'true'
      KSQL_KSQL_LOGGING_PROCESSING_TOPIC_AUTO_CREATE: 'true'
    depends_on:
      kafka1:
        condition: service_healthy
      kafka2:
        condition: service_healthy
      kafka3:
        condition: service_healthy
    container_name: ksqldb-server
    network_mode: host
    profiles:
    - ksqldb
    volumes:
    - type: bind
      source: .
      target: /sql
      read_only: true
    ports:
    - 8088:8088
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
 Container kafka1  Running
 Container kafka3  Running
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
 Container kafka1  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka1  Healthy
 Container kafka1  Healthy
 Container kafka3  Healthy
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container schema-registry  Healthy
 Container zookeeper  Healthy
 Container gateway2  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container gateway1  Healthy
 Container kafka1  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/AjTvavrV8ywgImGxl7CYRUaSC.svg)](https://asciinema.org/a/AjTvavrV8ywgImGxl7CYRUaSC)

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
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNDQ2MDY4M30.jNMkdATXqpG2BI8DMCCttQ2Ia-Eit5uMXUuYsv1Ime0';


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/huw6uPSswuYLX7sUjd9wJw0DJ.svg)](https://asciinema.org/a/huw6uPSswuYLX7sUjd9wJw0DJ)

</TabItem>
</Tabs>

## 

Let's tell `gateway1` that topics matching the pattern `.*` need to be concentrated into the underlying `concentrated` physical topic.

> [!NOTE]
> You don’t need to create the physical topic that backs the concentrated topics, it will automatically be created when a client topic starts using the concentrated topic.

<Tabs>
<TabItem value="Command">


```sh
cat step-06-mapping.json | jq
curl \
    --request POST 'http://localhost:8888/admin/vclusters/v1/vcluster/teamA/topics/.%2A' \
    --header 'Content-Type: application/json' \
    --user 'admin:conduktor' \
    --silent \
    --data "@step-06-mapping.json" | jq
```


</TabItem>
<TabItem value="Output">

```json
{
  "concentrated": true,
  "readOnly": false,
  "physicalTopicName": "concentrated"
}
{
  "logicalTopicName": ".*",
  "physicalTopicName": "concentrated",
  "readOnly": false,
  "concentrated": true
}

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/dG7M98y7JFk0L3QadrnPQMoqI.svg)](https://asciinema.org/a/dG7M98y7JFk0L3QadrnPQMoqI)

</TabItem>
</Tabs>

## Start ksqlDB



<Tabs>
<TabItem value="Command">


```sh
export KSQL_BOOTSTRAP_SERVERS="localhost:6969"
export KSQL_SECURITY_PROTOCOL="SASL_PLAINTEXT"
export KSQL_SASL_MECHANISM="PLAIN"
export KSQL_SASL_JAAS_CONFIG="org.apache.kafka.common.security.plain.PlainLoginModule required username='sa' password='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJ0ZWFtQSIsImV4cCI6MTcxNDQ2MDM3Mn0.3HhSiXg2jYx28fBn4pRP4KlS5rPCGBbILUciVFroquc';"
docker compose --profile ksqldb up -d --wait
```


</TabItem>
<TabItem value="Output">

```
 Container zookeeper  Running
 Container kafka3  Running
 Container kafka1  Running
 Container kafka2  Running
 Container gateway2  Running
 Container schema-registry  Running
 Container ksqldb-server  Creating
 Container gateway1  Running
 ksqldb-server Published ports are discarded when using host network mode 
 Container ksqldb-server  Created
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Waiting
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container zookeeper  Healthy
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
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
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka2  Healthy
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container kafka1  Healthy
 Container ksqldb-server  Starting
 Container ksqldb-server  Started
 Container ksqldb-server  Waiting
 Container zookeeper  Waiting
 Container kafka1  Waiting
 Container kafka2  Waiting
 Container kafka3  Waiting
 Container schema-registry  Waiting
 Container gateway1  Waiting
 Container gateway2  Waiting
 Container kafka2  Healthy
 Container kafka3  Healthy
 Container gateway1  Healthy
 Container schema-registry  Healthy
 Container zookeeper  Healthy
 Container gateway2  Healthy
 Container kafka1  Healthy
 Container ksqldb-server  Healthy

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/p5Q7NHP7jNc7g1RqRJTVOV0Ps.svg)](https://asciinema.org/a/p5Q7NHP7jNc7g1RqRJTVOV0Ps)

</TabItem>
</Tabs>

## Listing topics in teamA



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --list
```


</TabItem>
<TabItem value="Output">

```
_confluent-ksql-default__command_topic
default_ksql_processing_log

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/FPfHZ0NnrhrroXZDziMQ9XaQj.svg)](https://asciinema.org/a/FPfHZ0NnrhrroXZDziMQ9XaQj)

</TabItem>
</Tabs>

## Listing topics in kafka1



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --list
```


</TabItem>
<TabItem value="Output">

```
__consumer_offsets
__transaction_state
_acls
_auditLogs
_consumerGroupSubscriptionBackingTopic
_encryptionConfig
_interceptorConfigs
_license
_offsetStore
_schemas
_topicMappings
_topicRegistry
_userMapping
concentrated

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/TUzaAEeym5vTWGLX64Poweh29.svg)](https://asciinema.org/a/TUzaAEeym5vTWGLX64Poweh29)

</TabItem>
</Tabs>

## Review ksql.sql



<Tabs>
<TabItem value="Command">

```sh
cat ksql.sql
```

</TabItem>
<TabItem value="File Content">

```sql
SET 'processing.guarantee' = 'exactly_once_v2';

CREATE STREAM riderLocations (profileId VARCHAR, latitude DOUBLE, longitude DOUBLE)
  WITH (kafka_topic='locations', value_format='json', partitions=1);

CREATE TABLE currentLocation AS
  SELECT profileId,
         LATEST_BY_OFFSET(latitude) AS la,
         LATEST_BY_OFFSET(longitude) AS lo
  FROM riderlocations
  GROUP BY profileId
  EMIT CHANGES;

CREATE TABLE ridersNearMountainView AS
  SELECT ROUND(GEO_DISTANCE(la, lo, 37.4133, -122.1162), -1) AS distanceInMiles,
         COLLECT_LIST(profileId) AS riders,
         COUNT(*) AS count
  FROM currentLocation
  GROUP BY ROUND(GEO_DISTANCE(la, lo, 37.4133, -122.1162), -1);

INSERT INTO riderLocations (profileId, latitude, longitude) VALUES ('c2309eec', 37.7877, -122.4205);
INSERT INTO riderLocations (profileId, latitude, longitude) VALUES ('18f4ea86', 37.3903, -122.0643);
INSERT INTO riderLocations (profileId, latitude, longitude) VALUES ('4ab5cbad', 37.3952, -122.0813);
INSERT INTO riderLocations (profileId, latitude, longitude) VALUES ('8b6eae59', 37.3944, -122.0813);
INSERT INTO riderLocations (profileId, latitude, longitude) VALUES ('4a7c7b41', 37.4049, -122.0822);
INSERT INTO riderLocations (profileId, latitude, longitude) VALUES ('4ddad000', 37.7857, -122.4011);
```
</TabItem>
</Tabs>

## Execute ksql script



<Tabs>
<TabItem value="Command">


```sh
docker exec ksqldb-server ksql 'http://localhost:8088' -f /sql/ksql.sql
```


</TabItem>
<TabItem value="Output">

```
Jan 31, 2024 7:05:05 AM org.jline.utils.Log logr
WARNING: Unable to create a system terminal, creating a dumb terminal (enable debug logging for more information)
Successfully changed local property 'processing.guarantee' to 'exactly_once_v2'. Use the UNSET command to revert your change.

CREATE STREAM RIDERLOCATIONS (PROFILEID STRING, LATITUDE DOUBLE, LONGITUDE DOUBLE) WITH (CLEANUP_POLICY='delete', KAFKA_TOPIC='locations', KEY_FORMAT='KAFKA', PARTITIONS=1, VALUE_FORMAT='JSON');
 Message        

 Stream created 


CREATE TABLE CURRENTLOCATION WITH (CLEANUP_POLICY='compact', KAFKA_TOPIC='CURRENTLOCATION', PARTITIONS=1, REPLICAS=1, RETENTION_MS=604800000) AS SELECT
  RIDERLOCATIONS.PROFILEID PROFILEID,
  LATEST_BY_OFFSET(RIDERLOCATIONS.LATITUDE) LA,
  LATEST_BY_OFFSET(RIDERLOCATIONS.LONGITUDE) LO
FROM RIDERLOCATIONS RIDERLOCATIONS
GROUP BY RIDERLOCATIONS.PROFILEID
EMIT CHANGES;
 Message                                      

 Created query with ID CTAS_CURRENTLOCATION_3 


CREATE TABLE RIDERSNEARMOUNTAINVIEW WITH (CLEANUP_POLICY='compact', KAFKA_TOPIC='RIDERSNEARMOUNTAINVIEW', PARTITIONS=1, REPLICAS=1, RETENTION_MS=604800000) AS SELECT
  ROUND(GEO_DISTANCE(CURRENTLOCATION.LA, CURRENTLOCATION.LO, 37.4133, -122.1162), -1) DISTANCEINMILES,
  COLLECT_LIST(CURRENTLOCATION.PROFILEID) RIDERS,
  COUNT(*) COUNT
FROM CURRENTLOCATION CURRENTLOCATION
GROUP BY ROUND(GEO_DISTANCE(CURRENTLOCATION.LA, CURRENTLOCATION.LO, 37.4133, -122.1162), -1)
EMIT CHANGES;
 Message                                             

 Created query with ID CTAS_RIDERSNEARMOUNTAINVIEW_5 


```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/zIrAhcjFKhF6o0cDxhGaX5moG.svg)](https://asciinema.org/a/zIrAhcjFKhF6o0cDxhGaX5moG)

</TabItem>
</Tabs>

## Listing topics in teamA



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --command-config teamA-sa.properties \
    --list
```


</TabItem>
<TabItem value="Output">

```
CURRENTLOCATION
RIDERSNEARMOUNTAINVIEW
_confluent-ksql-default__command_topic
_confluent-ksql-default_query_CTAS_CURRENTLOCATION_3-Aggregate-Aggregate-Materialize-changelog
_confluent-ksql-default_query_CTAS_CURRENTLOCATION_3-Aggregate-GroupBy-repartition
_confluent-ksql-default_query_CTAS_RIDERSNEARMOUNTAINVIEW_5-Aggregate-Aggregate-Materialize-changelog
_confluent-ksql-default_query_CTAS_RIDERSNEARMOUNTAINVIEW_5-Aggregate-GroupBy-repartition
_confluent-ksql-default_query_CTAS_RIDERSNEARMOUNTAINVIEW_5-KsqlTopic-Reduce-changelog
default_ksql_processing_log
locations

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/rEVmXDU3w46GyABrh9Cv88xNa.svg)](https://asciinema.org/a/rEVmXDU3w46GyABrh9Cv88xNa)

</TabItem>
</Tabs>

## Listing topics in kafka1



<Tabs>
<TabItem value="Command">


```sh
kafka-topics \
    --bootstrap-server localhost:19092,localhost:19093,localhost:19094 \
    --list
```


</TabItem>
<TabItem value="Output">

```
__consumer_offsets
__transaction_state
_acls
_auditLogs
_consumerGroupSubscriptionBackingTopic
_encryptionConfig
_interceptorConfigs
_license
_offsetStore
_schemas
_topicMappings
_topicRegistry
_userMapping
concentrated
concentrated_compacted

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/ERAtX0mbtWmTtUmwB1ruNEl1f.svg)](https://asciinema.org/a/ERAtX0mbtWmTtUmwB1ruNEl1f)

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
 Container schema-registry  Stopping
 Container gateway1  Stopping
 Container schema-registry  Stopped
 Container schema-registry  Removing
 Container gateway2  Stopped
 Container gateway2  Removing
 Container gateway1  Stopped
 Container gateway1  Removing
 Container gateway1  Removed
 Container gateway2  Removed
 Container schema-registry  Removed
 Container kafka3  Stopping
 Container kafka1  Stopping
 Container kafka2  Stopping
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
 Network ksqldb_default  Removing
 Network ksqldb_default  Removed

```

</TabItem>
<TabItem value="Recording">

[![asciicast](https://asciinema.org/a/RR7AcvVoHYHfLkTheU5nbPVJn.svg)](https://asciinema.org/a/RR7AcvVoHYHfLkTheU5nbPVJn)

</TabItem>
</Tabs>

# Conclusion

ksqlDB can run in a virtual cluster where all its topics are concentrated into a single physical topic

