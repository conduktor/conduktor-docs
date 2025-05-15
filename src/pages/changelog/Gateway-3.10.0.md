---
date: 2025-06-17
title: Gateway 3.10.0
description: docker pull conduktor/conduktor-gateway:3.10.0
solutions: gateway
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
- [New features](#new-features)
- [Fixes](#fixes)

### Breaking changes

### New features

#### `GATEWAY_SECURITY_MODE` environment variable

This release introduces the `GATEWAY_SECURITY_MODE` environment variable, which allows you to set the security mode for Gateway. This aims to simplify the decision path around `DELEGATED_XXX` security protocols.

The valid values for `GATEWAY_SECURITY_MODE` are: `GATEWAY_MANAGED`, `KAFKA_MANAGED`.

When in `KAFKA_MANAGED` mode, you may use non delegated security protocols. The mapping is as follows:

| GATEWAY_SECURITY_MODE | GATEWAY_SECURITY_PROTOCOL | Previous version GATEWAY_SECURITY_PROTOCOL equivalent  |
|-----------------------|---------------------------|--------------------------------------------------------|
| GATEWAY_MANAGED       | SASL_PLAINTEXT            | SASL_PLAINTEXT                                         |
| GATEWAY_MANAGED       | SASL_SSL                  | SASL_SSL                                               |
| GATEWAY_MANAGED       | SSL                       | SSL                                                    |
| GATEWAY_MANAGED       | PLAINTEXT                 | PLAINTEXT                                              |
| KAFKA_MANAGED         | SASL_PLAINTEXT            | DELEGATED_SASL_PLAINTEXT                               |
| KAFKA_MANAGED         | SASL_SSL                 | DELEGATED_SASL_SSL                                     |
| KAFKA_MANAGED         | SSL               | Invalid auth mode with Kafka. Will be rejected.        |
| KAFKA_MANAGED         | PLAINTEXT                 | Invalid auth mode with Kafka. Will be rejected.        |

Note this is a non-breaking change. Security protocol inputs `DELEGATED_SASL_PLAINTEXT`, `DELEGATED_SASL_SSL`, are still supported. Additionally, when `GATEWAY_SECURITY_MODE` is not set, we will infer its value based on your security mode.

### Fixes
