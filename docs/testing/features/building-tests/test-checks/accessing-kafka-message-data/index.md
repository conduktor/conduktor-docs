---
title: Accessing Kafka message data
description: Access data from your message key, value or the associated metadata
---

# Accessing Kafka message data

When you produce or consume records from Kafka you may need to **access the data for checks**.&#x20;

:::info
Looking for how to access the **previous** task data ? Here is the [documentation ](../../chaining-tasks#accessing-the-output)
:::

For example:

- to validate if an attribute inside a JSON record is correct
- to validate if your message was produced into a specific partition

There are two methods of selecting data for a check:

- Field selection (JSON Query)
- JavaScript

The below table indicates the different object identifiers that can be used to access attributes.

_Note the information you are able to access depends on the task you are making the check on._

## Producer Checks

It's possible to make checks on the metadata collected when you produce to Kafka.

| Attribute | Type         | How to access: Field selection (JQ) | How to access: JavaScript |
| --------- | ------------ | ----------------------------------- | ------------------------- |
| Key       | User-defined | .record.key                         | context.record.key        |
| Value     | User-defined | .record.value                       | context.record.value      |
| Offset    | Number       | .record.offset                      | context.record.offset     |
| Partition | Number       | .record.partition                   | context.record.partition  |
| Timestamp | Timestamp    | .record.timestamp                   | context.record.timestamp  |
| Topic     | String       | .record.topic                       | context.record.topic      |

:::info
See an [example](./#example-check-the-value-of-an-attribute-inside-a-json-message-value) of how to check the partition of a record produced to Kafka
:::

## Consumer

Make checks on the key & value for any consumed record(s) and associated metadata.&#x20;

| Attribute       | Type         | How to access: Field selection (JQ) | How to access: JavaScript    |
| --------------- | ------------ | ----------------------------------- | ---------------------------- |
| Key             | User-defined | .record.key                         | context.record.key           |
| Value           | User-defined | .record.value                       | context.record.value         |
| Offset          | Number       | .record.offset                      | context.record.offset        |
| Partition       | Number       | .record.partition                   | context.record.partition     |
| Timestamp       | Timestamp    | .record.timestamp                   | context.record.timestamp     |
| Topic           | String       | .record.topic                       | context.record.topic         |
| Key Schema Id   | Number       | .record.keySchemaId                 | context.record.keySchemaId   |
| Value Schema Id | Number       | .record.valueSchemaId               | context.record.valueSchemaId |

:::info
See an [example](check-the-value-inside-a-json-message-consumed-from-kafka) of how to check an attribute inside a JSON message value
:::

---
