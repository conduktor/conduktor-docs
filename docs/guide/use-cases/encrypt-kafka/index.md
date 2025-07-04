---
sidebar_position: 330
title: Encrypt Kafka data
description: Encrypt Kafka data using Conduktor
---

<GlossaryTerm>Gateway</GlossaryTerm> can encrypt your data on produce or on consume:

- **On Produce** - data will be encrypted before it gets to the broker, i.e. **encrypted before it enters Kafka**. Gateway will intercept the records, encrypt them following your definition within the Interceptor configuration, and then pass it to Kafka.
- **On Consume** - the **original data is already in Kafka**. The Gateway will encrypt the original data as the consumer consumes it.

## Encryption targets

In either case, you should decide whether you want to encrypt the full payload, or only select fields.

- **Full payload** - You want to encrypt the key, the value, or the headers of your records, which can be done on structured or unstructured messages.
- **Field-level** - Define which fields in your payload need to be encrypted. You can choose the fields with a schema-based solution, or not. The choice will depend on how you produce the messages, and what you want to encrypt:

- **Schema-based**: fields are encrypted based on tags you include in the record schema itself.
- **List-based**: fields are encrypted based on the list you specify in the Interceptor configuration.
  - **Schema Payload**: the record has been produced using a schema (Avro, JSON, Protobuf).
  - **JSON Payload**: the record is a simple JSON payload.

## Related resources

- [Find out more about encryption Interceptors](/guide/reference/interceptor-reference/#encryption-interceptor)
- [Configure encryption](/guide/tutorials/configure-encryption)
- [Give us feedback/request a feature](https://conduktor.io/roadmap)
