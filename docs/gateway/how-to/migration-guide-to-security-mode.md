---
sidebar_position: 8
title: Migration Guide to Gateway Security Mode
description: How to migrate to the new Gateway security mode
---

# Gateway Security Mode

## What is changing?

:::info
This migration guide is for Gateway v3.10.0 and later
:::

We have introduced a new environment variable, `$GATEWAY_SECURITY_MODE`, to define where authentication takes place. As part of this, we are deprecating (although still supporting) `DELEGATED_XXX` inputs for `${GATEWAY_SECURITY_PROTOCOL}`.

The valid inputs for `$GATEWAY_SECURITY_MODE` are: `KAFKA_MANAGED` and `GATEWAY_MANAGED`. For more details see [documentation](../configuration/env-variables.md#connect-from-clients-to-gateway).

## Why?

We are splitting the security configuration into two steps in order to simplify the user experience. 

## Am I affected?

This change is backwards compatible, we still support delegated protocols. Your current configuration will automatically map like so:

| **3.9.0 $GATEWAY_SECURITY_PROTOCOL** | → **3.10.0** $GATEWAY_SECURITY_PROTOCOL | → **3.10.0**  $GATEWAY_SECURITY_MODE |
|--------------------------------------|-----------------------------------------|--------------------------------------|
| `PLAINTEXT`                          | `PLAINTEXT`                             | `GATEWAY_MANAGED`                    |
| `SASL_PLAINTEXT`                     | `SASL_PLAINTEXT`                        | `GATEWAY_MANAGED`                    |
| `SASL_SSL`                           | `SASL_SSL`                              | `GATEWAY_MANAGED`                    |
| `SSL`                                | `SSL`                                   | `GATEWAY_MANAGED`                    |
| `DELEGATED_SASL_PLAINTEXT`           | `SASL_PLAINTEXT`                        | `KAFKA_MANAGED`                      |
| `DELEGATED_SASL_SSL`                 | `SASL_SSL`                              | `KAFKA_MANAGED`                      |

## What do I need to do?

We strongly encourage users to set up configurations using the new `GATEWAY_SECURITY_MODE` environment variable and migrate from usage of `DELEGATED_SASL_PLAINTEXT` and `DELEGATED_SASL_SSL`.

You can use this table to guide your possible configurations.

| GATEWAY_SECURITY_MODE | GATEWAY_SECURITY_PROTOCOL | Previous version GATEWAY_SECURITY_PROTOCOL equivalent |
|-----------------------|---------------------------|-------------------------------------------------------|
| GATEWAY_MANAGED       | SASL_PLAINTEXT            | SASL_PLAINTEXT                                        |
| GATEWAY_MANAGED       | SASL_SSL                  | SASL_SSL                                              |
| GATEWAY_MANAGED       | SSL                       | SSL                                                   |
| GATEWAY_MANAGED       | PLAINTEXT                 | PLAINTEXT                                             |
| KAFKA_MANAGED         | SASL_PLAINTEXT            | DELEGATED_SASL_PLAINTEXT                              |
| KAFKA_MANAGED         | SASL_SSL                  | DELEGATED_SASL_SSL                                    |
| KAFKA_MANAGED         | SSL                       | Invalid auth mode with Kafka. Will be rejected.       |
| KAFKA_MANAGED         | PLAINTEXT                 | Invalid auth mode with Kafka. Will be rejected.       |

For example, if you want to set up a Gateway configuration that delegates authentication
to your backing Kafka cluster using `SASL_SSL`:

- **Before** (in previous versions):
  ```
  ${GATEWAY_SECURITY_PROTOCOL}: DELEGATED_SASL_SSL
  ```

- **Now** (in 3.10.0 and later):
  ```
  ${GATEWAY_SECURITY_MODE}: KAFKA_MANAGED
  ${GATEWAY_SECURITY_PROTOCOL}: SASL_SSL
  ```

