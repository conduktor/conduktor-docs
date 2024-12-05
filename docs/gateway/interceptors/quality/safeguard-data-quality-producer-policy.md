---
version: 3.0.0
title: Data Quality Producer Policy
description: Don't reinvent the wheel to assert data quality before being produced, just use SQL!
parent: governance
license: enterprise
---

# What is the data quality producer policy ?

Conduktor Gateway's data quality producer policy feature uses a SQL like language to assert data quality before being produced, based on a simple SQL statement. Records in the topic from the FROM clause must match the WHERE clause for the statement in order to be considered valid.

For example, given a simple orders topic with records in the form:

```json
{
  "id" : "B2EE6886-7FFF-4CAB-9B2A-CF0A06C9E648",
  "amount_cents": 12499,
  "currency": "EUR",
  "order_date": "2024-20-12T15:45:33Z"
}
```

You may want to ensure that:
* The `id` is a valid UUID format
* The `amount_cents` is a positive integer, and not too large
* The `currency` is one of your accepted currencies
* The `order_date` is in ISO 8601 format

This can be asserted with the policy as below:

```sql
SELECT
    *       -- ignored in this policy
FROM
    orders  -- topic to enforce the rule on
WHERE
        id REGEXP '^[0-9A-F-]{36}$'    -- 36 char UUID in hex with dash separators
    AND amount_cents REGEXP '[0-9]+'   -- amount must be an integer
    AND amount_cents > 0               -- ... greater than zero
    AND amount_cents < 1000000         -- ... and less than 1,000,000 cents
    AND currency REGEXP 'EUR|GBP|USD'  -- currency must be one of these three
    AND order_date REGEXP '^20[2-9][0-9]-[0-1][0-9]-[0-3][0-9]T[0-2][0-9]:[0-5][0-9]:[0-5][0-9]Z$'
                                       -- valid date, and after 2020  
```

In the statement, the list of fields selected is actually ignored - the important parts are the FROM clause (specifying the topic that the policy is applied to) and the WHERE clause, which specifies the condition data must meet in order to be considered valid. i.e. If the select returns something, the record is valid. If it returns no results, the record is considered invalid.

`SELECT [ignored!] FROM [topic name] WHERE [field filter criteria]`

Only one topic can be specified in the FROM clause (joins will be ignored), and the topic name is matched explicity (no regexp support). If a record does not match the WHERE clause, it will be rejected. There are a variety of options for this described in the actions below. Fields are assumed to be from the value of the record. The interceptor currently supports values in JSON, AVRO and Protobuf formats.

**Please Note**: Topic names with dash `-` characters in them must be quoted, as the dash is not a valid character for a SQL name. E.g. for a topic `our-orders` you would need to use:

`SELECT * FROM "our-orders" WHERE ...`

Nested fields can be accessed as expected with dot notation in the WHERE clause, e.g.:

`address.street = 'Electric Avenue'`

## WHERE Clause

If you specify a field name in the where clause which does not exist in the record, then the condition will always fail and the record will always be considered invalid. Fields in the WHERE clause must exist in a record for it to be considered valid.

The WHERE clause supports a subset of SQL operations, as below:
- The operators `=, >, >=, <, <=, <>` and `REGEXP` (RegExp MySQL Operator) are all supported
- When providing more than one condition in the WHERE clause, only the `AND` operator is supported
- The `IN` clause is not supported, but can be approximated with a RegExp
- By default, the fields in the where clause are looked up from the value in the record. You can also filter by other parts of the record using the syntax below:
    - Record key (It also supports encoded keys which require a schema registry lookup):
        - Record key as string: - `.. WHERE record.key = 'some thing'`
        - Record key as schema: `.. WHERE record.key.someValue.someChildValue = 'some thing'`
    - Partition: `.. WHERE record.partition = 1`
    - Timestamp: `.. WHERE record.timestamp = 98717823712`
    - Header: `.. WHERE record.header.someHeaderKey = 'some thing'`
    - Offset: `.. WHERE record.offset = 1`


## Actions for Invalid Data

The policy acts on produce requests from the clients of Kafka, and as such this means it will often deal with a batch of multiple records spread over multiple topics and partitions. The policy can apply different effects to each request batch based on its configuration.

| action                     | description                                                                                                                                                                                                                                                                                           |
|:---------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| BLOCK_WHOLE_BATCH          | If any records in the batch are invalid, then block the whole batch. The Produce Request will fail for the client in this case.                                                                                                                                                                        |
| BLOCK_ONLY_INVALID_RECORDS | Any records that are invalid are removed from the batch, and all the valid records in the batch are saved in kafka. If any records are written, a success response for that is returned to the client. In the case where every message in the batch is invalid then an error is returned to the client. |
| AUDIT_LOG_ONLY             | For any records in the produce request which are invalid, record this in the audit log only. All records still are saved in kafka                                                                                                                                                                     |
| THROTTLE                   | If any records in the produce request are invalid, throttle the producer for a certain amount of time (`throttleTimeMs`). All records are still saved in kafka.                                                                                                                                       |

## Dead Letter Topic

If a dead letter topic service is configured for the Gateway, then you can optionally supply a topic name for this policy to use for any records which are considered invalid. This topic will be created with the default config for your Kafka setup.

Any record which the policy considers invalid is written to the dead letter topic, and has some headers added for audit purposes. Please note that this is done in the `AUDIT_LOG_ONLY` mode also, even though the records in this mode are still written to the "real" topic.

| Header       | Message                                                               |
|:-------------|:----------------------------------------------------------------------|
| X-ERROR-MSG  | Message does not match the statement [ ...]                           |
| X-TOPIC      | The topic the message was intended to be written to                   |
| X-PARTITION  | The partition of that topic the message was intended to be written to |

The generation of these headers can be disabled if required, through the `addErrorHeader` configuration parameter (defaults to `true`).

If no `deadLetterTopic` is configured for the policy, then no messages will be written out in this manner.

## Audit Log

Any violation of the policy is logged to the configured Audit Log for the Gateway, if it is set up.
This is currently logged at the *batch* level for each topic in the produce request. There is not a per record audit - it identifies that a policy breach occurred for the produce request (and identifies the tenant, username and client IP for the request).


## Configuration

| key                  | type                                | description                                                                |
|:---------------------|:------------------------------------|:---------------------------------------------------------------------------|
| statement            | String                              | SQL Statement                                                              |
| schemaRegistryConfig | [Schema Registry](#schema-registry) | Schema Registry Config                                                     |
| action               | [Action](#action)                   | Data quality producer action                                               |
| deadLetterTopic      | String                              | Dead letter topic.                                                         |
| addErrorHeader       | boolean (default `true`)            | Add or not add the error information headers into dead letter topic        |
| throttleTimeMs       | int (default: 100)                  | Value to throttle with (only applicable when action is set to `THROTTLE`). |

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
| THROTTLE                   | If messages are invalid, throttle the producer for a certain amount of time (`throttleTimeMs`)                 |

## Example

```json
{
  "name": "myDataQualityProducerPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.safeguard.DataQualityProducerPlugin",
  "priority": 100,
  "config": {
    "statement": "SELECT x FROM orders WHERE amount_cents > 0 AND amount_cents < 1000000",
    "schemaRegistryConfig": {
       "host": "http://schema-registry:8081"
    },
    "action": "BLOCK_WHOLE_BATCH",
    "deadLetterTopic": "dead-letter-topic",
    "addErrorHeader": false
  }
}
```

