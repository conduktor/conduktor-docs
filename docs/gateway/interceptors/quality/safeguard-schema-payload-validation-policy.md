---
version: 3.0.0
title: Schema Payload Validation
description: Avoid outages from missing or badly formatted records, ensure all messages adhere to a schema
parent: governance
license: enterprise
---

## Introduction

Ensuring that all records sent through your Kafka system conform to an agreed structure enables your Kafka consumers to confidently and independently access data. Records with missing or invalid schemas can cause application outages, as consumers may be unable to process the unexpected record format.

More than this though, the use of schemas can broadly only assert structural correctness of data and a level of compatibility for those structures. When it comes to the _values_ in a record often all you can assert is a basic data type (integer, string, double etc.). So while the use of a valid schema solves some concerns around data quality, there are other concerns that still have to be dealt with in a bespoke or distributed manner across all the clients of a given data type.

As a final point, while correct structure can be enforced in a Kafka ecosystem at a client level - each client needs to ensure that it knows and follows the expectations for the data. You cannot prevent one client correctly writing AVRO to a topic, while another one writes plain JSON to the same topic. If the second client doesn't know the rules it can't follow them.  

## Centralized Policy Enforcement

The Schema validation interceptor comes into play here, and provides functionality which you can configure once in your Kafka system on the source for data (a topic) to ensure that:

- All records produced to Kafka have a schema set
- The record contents adhere to that schema
- The fields (values) in any given record comply to business validation rules you have set in the schema

This policy provides a centralized enforcement of the validation of these rules at the point of write to Kafka. This enforcement cannot be bypassed or ignored by a client, so provides a strong guarantee that data actually written in to Kafka does match your rule set.    

Learn more about the Schema Registry and Schemas [here](https://www.conduktor.io/blog/what-is-the-schema-registry-and-why-do-you-need-to-use-it/)

## How does the Policy Work?

The policy operates on Produce Requests made to kafka, and will inspect the entire batch of records in a request. Based on its setup, it performs various checks and then will take an action if it finds any problems.

The first important thing to note is that the Policy will do *nothing* if there is no Audit Log configured for the gateway (as it does not want to silently reject any data). So for the policy to work at all, you **must have the Audit Log configured**.

Next point of note is that the policy will only check the value for a kafka record, and does not currently support checking the key or headers for a record. 

The core config values for the policy itself are:
* `topic` : the topic/s to apply the rule to
* `schemaIdRequired` : whether records must/must not have a schema assigned to them
* `validateSchema` : whether the policy should check if the data for the record matches the schema found for the record. 
* `action` : what to do if a problem is found

There are three levels of check you can apply:

| Setup                                               | Effect                                                                                                                                                           |
|:----------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `schemaIdRequired = false`                          | Ensures that no records have a schema!                                                                                                                           |
| `schemaIdRequired = true`, `validateSchema = false` | Ensures that records have a valid schema set, and that schema exists in the Schema Registry. Does not check whether the value actually matches the schema though |
| `schemaIdRequired = true`, `validateSchema = true`  | Ensures that records have a valid schema set, that schema exists in the Schema Registry and that the value in the record matches the schema. This includes any data validation rules in the schema (see below) as well as a structural check | 

### Action

If any problems are found, the policy will take an action as configured. The `action` can be set to one of:

- `BLOCK` → If any records in the batch fail the policy checks, record the problems in the audit log and then return an error to the client failing the entire batch. No records are written to kafka at all if at least one of the records in the batch is considered invalid.
- `INFO` → In this mode the data is always written to Kafka whether it passes the checks or not - but any problems found recorded in the audit log.
- `THROTTLE` → If any records in the batch fail the policy checks, the data is still written to Kafka but the request will be throttled with time = `throttleTimeMs`, forcing the client to back off. Any problems found are recorded in the audit log.

### Dead Letter Topic

If a dead letter topic service is configured for the Gateway, then you can optionally supply a topic name for this policy to use for any records which are considered invalid. This topic will be created with the default config for your Kafka setup.

Any record which the policy considers invalid is written to the dead letter topic, and has some headers added for audit purposes. Please note that this is done in the `AUDIT_LOG_ONLY` mode also, even though the records in this mode are still written to the "real" topic.


| Header       | Message                                                               |
|:-------------|:----------------------------------------------------------------------|
| X-ERROR-MSG  | Description of the reason for the policy failure                       |
| X-TOPIC      | The topic the message was intended to be written to                   |
| X-PARTITION  | The partition of that topic the message was intended to be written to |

The generation of these headers can be disabled if required, through the `addErrorHeader` configuration parameter (defaults to `true`).

If no `deadLetterTopic` is configured for the policy, then no messages will be written out in this manner.

## Configuration

The full configuration topics for the policy are as below.

| name                 | type                                     | default | description                                                                                                                             |
|:---------------------|:-----------------------------------------|:--------|:----------------------------------------------------------------------------------------------------------------------------------------|
| topic                | String                                   | `.*`    | Topics that match this regex will have the interceptor applied                                                                          |
| schemaIdRequired     | Boolean                                  | `false` | Records must/must not have schemaId                                                                                                     |
| validateSchema       | Boolean                                  | `false` | If true, deserialize the record, validate the record structure and fields within the data itself ([see more](#schema-payload-validate)) |
| action               | `BLOCK`, `INFO`, `THROTTLE`              | `BLOCK` | Action to take if the value is outside the specified range.                                                                             |
| schemaRegistryConfig | [Schema Registry](#schema-registry)      | N/A     | Schema Registry Config                                                                                                                  | 
| celCacheSize         | int                                      | 100     | In memory cache size for cel expressions, balancing speed and resource use, optimize performance.                                       |
| deadLetterTopic      | String                                   |         | Dead letter topic. Not used if this parameter is not set.                                                                               |
| addErrorHeader       | Boolean                                  | `true`  | Add or not add the error information headers into dead letter topic                                                                     |
| throttleTimeMs       | int                                      | 100     | Value to throttle with (only applicable when action is set to `THROTTLE`).                                                              |


### Schema Registry

| Key                   | Type   | Default     | Description                                                                                                                                                                                                         |
|-----------------------|--------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`                | string | `CONFLUENT` | The type of schema registry to use: choose `CONFLUENT` (for Confluent-like schema registries including OSS Kafka) or `AWS` for AWS Glue schema registries.                                                      |
| `additionalConfigs`   | map    |             | Additional properties maps to specific security-related parameters. For enhanced security, you can hide the sensitive values using [environment variables as secrets](#use-environment-variables-as-secrets).​ |
| **Confluent Like**    |        |             | **Configuration for Confluent-like schema registries**                                                                                                                                                              |
| `host`                | string |             | URL of your schema registry.                                                                                                                                                                                        |
| `cacheSize`           | string | `50`        | Number of schemas that can be cached locally by this interceptor so that it doesn't have to query the schema registry every time.                                                                                   |
| **AWS Glue**          |        |             | **Configuration for AWS Glue schema registries**                                                                                                                                                                    |
| `region`              | string |             | The AWS region for the schema registry, e.g. `us-east-1`                                                                                                                                                            |
| `registryName`        | string |             | The name of the schema registry in AWS (leave blank for the AWS default of `default-registry`)                                                                                                                      |
| `basicCredentials`    | string |             | Access credentials for AWS (see below section for structure)                                                                                                                                                        |
| **AWS Credentials**   |        |             | **AWS Credentials Configuration**                                                                                                                                                                                   |
| `accessKey`           | string |             | The access key for the connection to the schema registry.                                                                                                                                                           |
| `secretKey`           | string |             | The secret key for the connection to the schema registry.                                                                                                                                                           |
| `validateCredentials` | bool   | `true`      | `true` / `false` flag to determine whether the credentials provided should be validated when set.                                                                                                                   |
| `accountId`           | string |             | The Id for the AWS account to use.                                                                                                                                                                                  |

If you do not supply a `basicCredentials` section for the AWS Glue schema registry, the client we use to connect will instead attempt to find the connection information is needs from the environment, and the credentials required can be passed this way to the Gateway as part of its core configuration. More information on the setup for this is found in the [AWS documentation](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html#credentials-default).

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
    "action": "BLOCK",
    "celCacheSize": 100
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
    "action": "BLOCK",
    "celCacheSize": 100
  }
}
```

## Schema Payload Validations

When configured to do so, the Schema Validation interceptor supports validating the value in a Kafka record against a specific set custom constraints for AvroSchema records. 
This is similar to the validations provided by JsonSchema, such as:

For fields in an Avro schema, you can specify specific constraints on what is considered a correct value. These rules operate on the specific fields value only.
- **INT**, **LONG**, **FLOAT**, **DOUBLE**: `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `multipleOf`
- **STRING**: `minLength`, `maxLength`, `pattern`, `format`
- **ARRAY**: `maxItems`, `minItems`

Current supported String `format` values:
- `byte`, `date`, `time`, `date-time`, `duration`, `uri`, `uri-reference`, `uri-template`, `uri`, `email`, `hostname`, `ipv4`, `ipv6`, `regex`, `uuid`, `json-pointer`, `json-pointer-uri-fragment`, `relative-json-pointer`

This interceptor also supports further validating elements from the whole payload against specific custom constraints - or Metadata Rules - using an expression
based on the [CEL (Common Expression Language)](https://github.com/google/cel-spec) format. This provides a means to define more advanced rules dependent on *multiple* values in a record. 

### Metadata rule

| key        | type   | description                                                                                                     |
|:-----------|:-------|:----------------------------------------------------------------------------------------------------------------|
| name       | string | Rule name                                                                                                       |
| expression | string | CEL expression for validation, must return `BOOLEAN`                                                            |
| message    | string | Error message if payload not matches the `expression` with namespace `message.` represents for produced message |

### Json Schema Example

In Json Schema, constraints and rules are defined directly in the schema. Here's an example that includes various validations:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 3,
      "maxLength": 50,
      "expression": "size(name) >= 3"
    },
    "age": {
      "type": "integer",
      "minimum": 0,
      "maximum": 120,
      "expression": "age >= 0 && age <= 120"
    },
    "email": {
      "type": "string",
      "format": "email",
      "expression": "email.contains('foo')"
    },
    "address": {
      "type": "object",
      "properties": {
        "street": {
          "type": "string",
          "minLength": 5,
          "maxLength": 10,
          "expression": "size(street) >= 5 && size(street) <= 10"
        },
        "city": {
          "type": "string",
          "minLength": 2,
          "maxLength": 50
        }
      },
      "expression": "size(address.street) > 1 && address.street.contains('paris') || address.city == 'paris'"
    },
    "hobbies": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 3,
      "expression": "size(hobbies) >= 3"
    }
  },
  "metadata": {
    "rules": [
      {
        "name": "check hobbies size and name",
        "expression": "size(message.hobbies) == 3 && size(message.name) > 3",
        "message": "hobbies must have 3 items"
      },
      {
        "name": "checkAge",
        "expression": "message.age >= 18",
        "message": "age must be greater than or equal to 18"
      },
      {
        "name": "check email",
        "expression": "message.email.endsWith('yahoo.com')",
        "message": "email should end with 'yahoo.com'"
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

### Avro Schema Example

In Avro, constraints and rules are defined directly in the schema. Here's an example that includes various validations:

```json
{
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
          {"name": "street", "type": "string", "minLength": 5, "maxLength": 100, "expression": "size(street) >= 5 && size(street) <= 10"},
          {"name": "city", "type": "string", "minLength": 2, "maxLength": 50}
        ]
      },
      "expression": "size(address.street) >= 5 && address.street.contains('paris') || address.city == 'paris'"
    },
    {"name": "hobbies", "type": {"type": "array", "items": "string"}, "minItems": 3, "expression": "size(hobbies) >= 3"},
    {
      "name": "friends",
      "type": {
        "type": "array",
        "items": {
          "type": "record",
          "name": "Friend",
          "fields": [
            {"name": "name", "type": "string", "expression": "size(name) < 3"},
            {"name": "age", "type": "int", "minimum": 2, "maximum": 10}
          ]
        }
      }
    }
  ],
  "metadata": {
    "rules": [
      {
        "name": "check hobbies size and name",
        "expression": "size(message.hobbies) == 3 && size(message.name) > 3",
        "message": "hobbies must have 3 items"
      },
      {
        "name": "checkAge",
        "expression": "message.age >= 18",
        "message": "age must be greater than or equal to 18"
      },
      {
        "name": "check email",
        "expression": "message.email.endsWith('yahoo.com')",
        "message": "email should end with 'yahoo.com'"
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
