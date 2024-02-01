---
version: 2.5.0
title: Schema validation
description: Avoid outages from missing or badly formatted records, ensure all messages adhere to a schema
parent: governance
license: enterprise
---

## Introduction

Ensuring that all records sent through your Kafka system have a schema associated with them ensures data in a known format for your Kafka consumers.

Records with missing or invalid schemas can cause application outages, as consumers may be unable to process the unexpected record format.

The Schema ID validation interceptor ensures that:

- All records produced to Kafka have a schema set
- The record contents adhere to that schema

See more about schema registry and schema-id [here](https://www.conduktor.io/blog/what-is-the-schema-registry-and-why-do-you-need-to-use-it/)


### What happens when sending an invalid record

Schema ID validation interceptor will return the following errors when an invalid record is sent:

## Configuration

| name                 | type                                                | default | description                                                                                                                             |
|:---------------------|:----------------------------------------------------|:--------|:----------------------------------------------------------------------------------------------------------------------------------------|
| topic                | String                                              | `.*`    | Topics that match this regex will have the interceptor applied                                                                          |
| schemaIdRequired     | Boolean   [Schema Id Required](#schema-id-required) | `false` | Records must/must not have schemaId                                                                                                     |
| validateSchema       | Boolean                                             | `false` | If true, deserialize the record, validate the record structure and fields within the data itself ([see more](#schema-payload-validate)) |
| action               | [Action](#action)                                   | `BLOCK` | Action to take if the value is outside the specified range.                                                                             |
| schemaRegistryConfig | [Schema Registry](#schema-registry)                 |         | Schema Registry Config                                                                                                                  | 

### Action

- `BLOCK` → when fail, save in audit and return error
- `INFO` → execute API with wrong value, save in audit.

### Schema Id Required

| key                                          |                                                                                                                                     |
|:--------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------|
| schemaIdRequired: true                      | When sending a record without schemaId: `Request parameters do not satisfy the configured policy. SchemaId is required.`            |
| schemaIdRequired: false                     | When sending a record with schemaId: `Request parameters do not satisfy the configured policy. SchemaId is not allowed.`            |
| schemaIdRequired: true,validateSchema: true | When sending a record with schemaId but wrong structure: `Request parameters do not satisfy the configured policy. Invalid schema.` |


### Schema Registry

| key               | type   | default | description                                                                                                                                                                                                                                        |
|:------------------|:-------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| host              | String |         | Url of schema registry                                                                                                                                                                                                                             |
| cacheSize         | String | `50`    | This interceptor caches schemas locally so that it doesn't have to query the schema registry                                                                                                                                                       |
| additionalConfigs | map    |         | Additional properties maps to specific security related parameters. For enhanced security, you can use the template `${MY_ENV_VAR}` in `map` values, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue) |

See more about schema registry [here](https://www.conduktor.io/blog/what-is-the-schema-registry-and-why-do-you-need-to-use-it/)

## Example

```json
{
  "name": "mySchemaIdValidationInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
  "priority": 100,
  "config": {
    "topic": "topic_1.*",
    "schemaIdRequired": true,
    "validateSchema": true,
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081"
    },
    "action": "BLOCK"
  }
}
```

### Schema Registry with secured template

```json
{
  "name": "mySchemaIdValidationInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.SchemaPayloadValidationPolicyPlugin",
  "priority": 100,
  "config": {
    "topic": "topic_1.*",
    "schemaIdRequired": true,
    "validateSchema": true,
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081",
      "additionalConfigs": {
        "schema.registry.url": "${SR_URL}",
        "basic.auth.credentials.source": "${SR_BASIC_AUTH_CRED_SRC}",
        "basic.auth.user.info": "${SR_BASIC_AUTH_USER_INFO}"
      }
    },
    "action": "BLOCK"
  }
}
```

## Schema Payload Validate

The Schema ID validation interceptor also supports validating payload against specific custom constraints for AvroSchema and Protobuf. 
This is similar to the validations provided by JsonSchema, such as:

Avro field type and it's current support constraints:
- **INT**, **LONG**, **FLOAT**, **DOUBLE**: `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `multipleOf`
- **STRING**: `minLength`, `maxLength`, `pattern`, `format`
- **ARRAY**: `maxItems`, `minItems`

Protobuf field type and it's current support constraints:
- **INT32**, **INT64**, **FLOAT**, **DOUBLE**: `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `multipleOf`
- **STRING**: `minLength`, `maxLength`, `pattern`, `format`
- **repeated**: `maxItems`, `minItems`

### Avro Schema Example

In Avro, constraints are defined directly in the schema. Here's an example that includes various validations:

```json
{
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
          {"name": "street", "type": "string", "minLength": 5, "maxLength": 100},
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

### Protobuf Schema Example

In Protobuf, since we are using the Confluent Schema Registry, we use the `(confluent.field_meta).params` (with type `map<string, string`) 
for field options. Here's how it can be defined:

```protobuf
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