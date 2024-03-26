---
version: 3.0.0
title: Data Quality Producer Policy
description: Don't reinvent the wheel to assert data quality before being produced, just use SQL!
parent: governance
license: enterprise
---

# What is data quality producer policy ?

Conduktor Gateway's data quality producer policy feature uses a SQL like language to assert data quality before being produced, based on a simple SQL statement in the form.

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

`SELECT [list of fields] FROM [topic name] WHERE [field filter criteria]`

Currently

- With filter records based on more than one condition, only `AND` operator current supported
- Predicates are currently supported: `=, >, >=, <, <=, <>` and REGEXP (RegExp MySQL Operator)
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


## Configuration

| key                  | type                                | description                                                         |
|:---------------------|:------------------------------------|:--------------------------------------------------------------------|
| statement            | String                              | SQL Statement                                                       |
| schemaRegistryConfig | [Schema Registry](#schema-registry) | Schema Registry Config                                              |
| action               | [Action](#action)                   | Data quality producer action                                        |
| deadLetterTopic      | String                              | Dead letter topic.                                                  |
| addErrorHeader       | boolean (default `true`)            | Add or not add the error information headers into dead letter topic |

### Schema Registry

| key               | type   | default | description                                                                                                                                                                                                                                                          |
|:------------------|:-------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| host              | String |         | Url of schema registry                                                                                                                                                                                                                                               |
| cacheSize         | String | `50`    | This interceptor caches schemas locally so that it doesn't have to query the schema registry                                                                                                                                                                         |
| additionalConfigs | map    |         | Additional properties maps to specific security related parameters. For enhanced security, you can use the template `${MY_ENV_VAR}` in `map` values, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue) |

See more about schema registry [here](https://www.conduktor.io/blog/what-is-the-schema-registry-and-why-do-you-need-to-use-it/)

### Action
| action                     | description                                                                                                    |
|:---------------------------|:---------------------------------------------------------------------------------------------------------------|
| BLOCK_WHOLE_BATCH          | If one message is invalid, block the whole batch                                                               |
| BLOCK_ONLY_INVALID_RECORDS | If one message is invalid, block only the invalid message (all other messages in the batch are saved in kafka) |
| AUDIT_LOG_ONLY             | If messages are invalid, audit log only (all messages still are saved in kafka)                                |

## Example

```json
{
  "name": "myDataQualityProducerPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.DataQualityProducerPlugin",
  "priority": 100,
  "config": {
    "statement": "SELECT * FROM users WHERE age > 18",
    "schemaRegistryConfig": {
       "host": "http://schema-registry:8081"
    },
    "action": "BLOCK_WHOLE_BATCH",
    "deadLetterTopic": "dead-letter-topic",
    "addErrorHeader": false
  }
}
```