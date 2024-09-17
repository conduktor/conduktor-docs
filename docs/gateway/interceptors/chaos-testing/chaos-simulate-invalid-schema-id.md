---
version: 3.0.0
title: Simulate Invalid Schema ID
description: Validate your application behaves correctly when records have an invalid schema id.
parent: console
license: enterprise
---

## Introduction

Simulate invalid schema id will overwrite an invalid schemaId value to the records.

Because schemaId is overwritten with an invalid value, the following error is returned when consuming records:

```bash
Processed a total of 1 messages
[2022-11-17 15:59:13,184] ERROR Unknown error when running consumer:  (kafka.tools.ConsoleConsumer$)
org.apache.kafka.common.errors.SerializationException: Error retrieving JSON schema for id 999
	at io.confluent.kafka.serializers.AbstractKafkaSchemaSerDe.toKafkaException(AbstractKafkaSchemaSerDe.java:259)
	at io.confluent.kafka.serializers.json.AbstractKafkaJsonSchemaDeserializer.deserialize(AbstractKafkaJsonSchemaDeserializer.java:182)
	at io.confluent.kafka.formatter.json.JsonSchemaMessageFormatter$JsonSchemaMessageDeserializer.deserialize(JsonSchemaMessageFormatter.java:130)
	at io.confluent.kafka.formatter.json.JsonSchemaMessageFormatter$JsonSchemaMessageDeserializer.deserialize(JsonSchemaMessageFormatter.java:103)
	at io.confluent.kafka.formatter.json.JsonSchemaMessageFormatter.writeTo(JsonSchemaMessageFormatter.java:94)
	at io.confluent.kafka.formatter.SchemaMessageFormatter.writeTo(SchemaMessageFormatter.java:181)
	at kafka.tools.ConsoleConsumer$.process(ConsoleConsumer.scala:116)
	at kafka.tools.ConsoleConsumer$.run(ConsoleConsumer.scala:76)
	at kafka.tools.ConsoleConsumer$.main(ConsoleConsumer.scala:53)
	at kafka.tools.ConsoleConsumer.main(ConsoleConsumer.scala)
Caused by: io.confluent.kafka.schemaregistry.client.rest.exceptions.RestClientException: Schema 999 not found; error code: 40403
	at io.confluent.kafka.schemaregistry.client.rest.RestService.sendHttpRequest(RestService.java:301)
	at io.confluent.kafka.schemaregistry.client.rest.RestService.httpRequest(RestService.java:371)
	at io.confluent.kafka.schemaregistry.client.rest.RestService.getId(RestService.java:840)
	at io.confluent.kafka.schemaregistry.client.rest.RestService.getId(RestService.java:813)
	at io.confluent.kafka.schemaregistry.client.CachedSchemaRegistryClient.getSchemaByIdFromRegistry(CachedSchemaRegistryClient.java:294)
	at io.confluent.kafka.schemaregistry.client.CachedSchemaRegistryClient.getSchemaBySubjectAndId(CachedSchemaRegistryClient.java:417)
	at io.confluent.kafka.serializers.json.AbstractKafkaJsonSchemaDeserializer.deserialize(AbstractKafkaJsonSchemaDeserializer.java:119)
	... 8 more
```

See more about schema registry and schema-id [here](https://www.conduktor.io/blog/what-is-the-schema-registry-and-why-do-you-need-to-use-it/)

## Configuration

| key             | type    | default   | description                                                                                                                                        |
|:----------------|:--------|:----------|:---------------------------------------------------------------------------------------------------------------------------------------------------|
| topic           | String  | `.*`      | Topics that match this regex will have the interceptor applied                                                                                     |
| invalidSchemaId | integer |           | Invalid schema id, if not passed the value will be random                                                                                          |
| target          | enum    | `CONSUME` | SchemaId is overwritten with an invalid value in the record when the client produces or consumes the record, values can be `PRODUCE` or  `CONSUME` |

## Example

```json
{
  "name": "mySimulateInvalidSchemaIdInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.chaos.SimulateInvalidSchemaIdPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "invalidSchemaId": 9999,
    "target": "PRODUCE"
  }
}
```