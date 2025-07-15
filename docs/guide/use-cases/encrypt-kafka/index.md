---
sidebar_position: 330
title: Encrypt Kafka data
description: Encrypt Kafka data using Conduktor
---
import ProductShield from '@site/src/components/shared/product-shield.md';

<ProductShield /> 

<GlossaryTerm>Gateway</GlossaryTerm> can encrypt your data on produce or on consume:

- **On Produce** - data will be encrypted before it gets to the broker, i.e. **encrypted before it enters Kafka**. Gateway will _intercept_ the records, encrypt them following your definition within the <GlossaryTerm>Interceptor</GlossaryTerm> configuration and then pass it to Kafka.
- **On Consume** - the **original data is already in Kafka**. The Gateway will encrypt the original data as the consumer consumes it.

## Encryption modes

Decide whether you want to encrypt the full payload or only certain fields:

- **Full payload** - you want to encrypt the key, the value, or the headers of your records, which can be done on structured or unstructured messages.
- **Field-level** - define which fields in your payload need to be encrypted. You can choose the fields with a schema-based solution, or not. The choice will depend on how you produce the messages and what you want to encrypt:
  - _Schema-based_: fields are encrypted based on tags you include in the record schema itself.
  - _List-based_: fields are encrypted based on the list you specify in the Interceptor configuration.

We support Avro, Protobuf and JSON.

## Decryption

Use the `DecryptPlugin` Interceptor to decrypt data. [Find out more](/guide/tutorials/configure-encryption/#configure-decryption).

## Related resources

- [Find out more about encryption Interceptors](/guide/reference/interceptor-reference/#encryption-interceptor)
- [Configure encryption](/guide/tutorials/configure-encryption)
- [Give us feedback/request a feature](https://conduktor.io/roadmap)
