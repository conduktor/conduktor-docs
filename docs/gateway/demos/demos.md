---
sidebar_position: 1
title: Demos
description: Demos for Conduktor Gateway
---

# Demos

Here are some demos to get you started with Conduktor Gateway. Explore the documentation folders on the left to have a look at other scenarios.

:::tip

As Gateway is quite a technical product, we recommend you to [book a demo](https://www.conduktor.io/contact/sales/?utm_source=docs&utm_medium=website) with us. We'll be happy to help you and your team to get started with the best practices and the best setup for your use case.
:::


## Encrypting data in-transit and at-rest

- [Field level encryption](./encryption/encryption-decrypt-only-specific-fields/): Encrypt and decrypt only specific fields
- [Full encryption for 3rd Party](./encryption/encryption-third-party/): Encrypt specific fields for 3rd party consumers
- [Encrypting using Vault](./encryption/encryption-vault-with-secret-management): Use HashiCorp Vault to encrypt and decrypt data

## Operations

- [Cluster switching/Failover](./ops/cluster-switching): Transparent failover for your applications
- [Merge Clusters](./ops/merge-cluster): Merge multiple Kafka clusters into a single logical one
- [Multi-tenancy](./ops/multi-tenancy): Build multi-tenancy infrastructure with Kafka
- [Topic Concentration](./ops/topic-concentration): Concentrate multiple topics into a single one for cost savings
- [Header injection](./ops/header-injection): Inject headers into your Kafka messages for lineage or chargeback support
- [Large messages support](./ops/large-messages): Sending files or large messages through Kafka?
- [SQL](./sql/sql-topic-schema-registry/): Filter and transform your Kafka topics data with SQL without hassle

## Security

- [Audit](./security/audit): Capture, protect, and preserve authorization activity into topics
- [Data Masking](./security/data-masking): Field-level data masking
- [OAuth2 Integration](./security/oauth): Secure your Kafka cluster with Keycloak

## Chaos Testing

To test the resiliency of your applications, we have many more demos. Here are a few of them:

- [Chaos Duplicate Messages](./chaos/chaos-duplicate-messages): Validate the idempotency of your applications
- [Chaos Simulate Invalid Schema ID](./chaos/chaos-simulate-invalid-schema-id): Validate the robustness of your applications

## Data Quality / Safeguard

Ensure your teams follow technical and business rules and can't break conventions. Help preventing common mistakes and protect your infrastructure and your data from misbehaving clients.

- [Schema Validation for Avro](./quality/safeguard-validate-schema-payload-avro/)
- [Enforce client.id convention](./safeguard/safeguard-client-id)
- [Enforce all topics have SchemaId](./safeguard/safeguard-schema-id)

## Performance

Question about the performance? We get you cover!

- [Latency Impact](./performance/latency)
- [Throughput Impact](./performance/throughput)


:::tip

As Gateway is quite a technical product, we recommend you to [book a demo](https://www.conduktor.io/contact/sales/?utm_source=docs&utm_medium=website) with us. We'll be happy to help you and your team to get started with the best practices and the best setup for your use case.
:::
