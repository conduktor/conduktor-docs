---
version: 3.0.0
title: SQL Topic Filtering
description: Don't reinvent the wheel to filter and project your messages, just use SQL!
parent: optimize
license: enterprise
---

## Introduction

Conduktor Gateway's SQL topic feature uses a SQL like language to filter and project messages, based on a simple SQL statement in the form.

```sql
SELECT
    type,
    price as amount,
    color,
    CASE
        WHEN color = 'red' AND price > 1000 THEN 'Exceptional'
        WHEN price > 8000 THEN 'Luxury'
        ELSE 'Regular'
    END as quality,
    record.offset as record_offset,
    record.partition as record_partition
  FROM cars
```

This supports for FetchResponse only: i.e., resulting topic is read-only.

`SELECT [list of fields] FROM [topic name] WHERE [field filter criteria]`

**Please Note**: Topic names with dash `-` characters in them must be double quoted, as the dash is not a valid character for a SQL name. E.g. for a topic `our-orders` you would need to use:

`SELECT * FROM "our-orders" WHERE ...`

Currently

- With filter records based on more than one condition, only `AND` operator current supported
- Predicates are currently supported: `=`, `>`, `>=`, `<`, `<=`, `<>` and `REGEXP` (RegExp MySQL Operator)
- Support Case Expression
- Filtered by:
    - Record key (It supports SR):
        - Record key as string: - `.. WHERE record.key = 'some thing'`
        - Record key as schema: `.. WHERE record.key.someValue.someChildValue = 'some thing'`
    - Record value (It supports SR): `.. WHERE $.someValue.someChildValue = 'some thing'`
    - Partition: `.. WHERE record.partition = 1`
    - Timestamp: `.. WHERE record.timestamp = 98717823712`
    - Header: `.. WHERE record.header.someHeaderKey = 'some thing'`
    - Offset: `.. WHERE record.offset = 1`

## Schemas and Projections

If your data uses a schema, then it is not possible to make use of the projection feature here because the resulting data will no longer match the original schema. For plain JSON topics you may use the select clause to alter the shape of the data returned as required - however for schema'd data (Avro and Protobuf) you must not use a projection, i.e. the select should be in the form:

`SELECT * FROM ...`

Filtering with the where clause is still supported.

## Configuration

| key                  | type                                | description                                                                                                         |
|:---------------------|:------------------------------------|:--------------------------------------------------------------------------------------------------------------------|
| virtualTopic         | String                              | if virtualTopic exists, fetch this topic will get the data from the statement without configure it's own statement. |
| statement            | String                              | SQL Statement                                                                                                       |
| schemaRegistryConfig | [Schema Registry](#schema-registry) | Schema Registry Config                                                                                              |

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

If you don't supply a `basicCredentials` section for the AWS Glue schema registry, the client used to connect will  attempt to find the connection information from the environment. The required credentials can be passed to Gateway in this way as part of core configuration.

Find out more about the setup for this from [AWS documentation](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html#credentials-default).

See more about schema registry [here](https://www.conduktor.io/blog/what-is-the-schema-registry-and-why-do-you-need-to-use-it/)

## Example

```json
{
  "name": "mySqlTopicPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.VirtualSqlTopicPlugin",
  "priority": 100,
  "config": {
    "virtualTopic": "legal_user",
    "statement": "SELECT * FROM users WHERE age > 18",
    "schemaRegistryConfig": {
       "host": "http://schema-registry:8081"
    }
  }
}
```

### Schema Registry with secured template

```json
{
  "name": "mySqlTopicPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.VirtualSqlTopicPlugin",
  "priority": 100,
  "config": {
    "virtualTopic": "legal_user",
    "statement": "SELECT * FROM users WHERE age > 18",
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081",
      "additionalConfigs": {
        "schema.registry.url": "${SR_URL}",
        "basic.auth.credentials.source": "${SR_BASIC_AUTH_CRED_SRC}",
        "basic.auth.user.info": "${SR_BASIC_AUTH_USER_INFO}"
      }
    }
  }
}
```
