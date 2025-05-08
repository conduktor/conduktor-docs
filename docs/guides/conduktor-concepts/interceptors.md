---
title: Interceptors
description: Learn Conduktor terminology
---

Conduktor Gateway offers a number of powerful Interceptors that enhance your Kafka usage.

For example, you can use Interceptors to:

- perform full-message encryption, field-level encryption, and decryption
- reject (during produce) or skip (during consume) records that don't match specified data quality rules
- enforce producer configurations such as acks or compression
- override or enforce configurations during a CreateTopic request, such as a replication factor or naming convention
