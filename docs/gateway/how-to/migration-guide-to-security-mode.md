---
sidebar_position: 7
title: Migration Guide to Gateway Security Mode
description: How to migrate to Gateway security mode
---

# Gateway Security Mode

## What is changing?

:::info
This guide is for migrating authentication and authorisation to the new configuration in Gateway v3.10.0 and later
:::

We have introduced a new environment variable, `GATEWAY_SECURITY_MODE`, to define where authentication takes place.

As part of this, we are deprecating (although still supporting) `DELEGATED_XXX` inputs for `GATEWAY_SECURITY_PROTOCOL`.
We are also changing the behaviour of `ACL_ENABLED`, rather than `false` this will be determined by the security mode. But can still be manually set by the user.

The valid inputs for `GATEWAY_SECURITY_MODE` are: `KAFKA_MANAGED` and `GATEWAY_MANAGED`. For more details see [documentation](../configuration/env-variables.md#connect-from-clients-to-gateway).

:::warning
If you are using a security protocol that has an ANONYMOUS identity (`PLAINTEXT`, or `SSL` without mTLS) then you will face authorisation errors because ACLs are now enabled by default for Gateway Managed security. To remove authorisation from your setup set `ACL_ENABLED: false` in the Gateway environment variables.
:::

## Why?

We are splitting the security configuration into two steps in order to simplify the user experience. The two questions you should think about are:

- **What is responsible for authentication?** Kafka, or Gateway?
- **How will your Kafka clients be authenticating?** Set the appropriate protocol.

Previously both these questions were resolved by the GATEWAY_SECURITY_PROTOCOL. Instead, we set *the what is responsiblet* using `GATEWAY_SECURITY_MODE` and simplify the options for *the how*, which still uses `GATEWAY_SECURITY_PROTOCOL`.

We will also enable or disable ACLs on Gateway from the security mode, meaning the `GATEWAY_ACL_ENABLED` environment variable only needs to be used when disabling ACLs on Gateway.

## Am I affected?

This change is backwards compatible, we still support the delegated protocols. Your current configuration will automatically map like so:

| **3.9.0 GATEWAY_SECURITY_PROTOCOL** | → **3.10.0** GATEWAY_SECURITY_PROTOCOL | → **3.10.0**  GATEWAY_SECURITY_MODE |
|--------------------------------------|-----------------------------------------|--------------------------------------|
| `PLAINTEXT`                          | `PLAINTEXT`                             | `GATEWAY_MANAGED`                    |
| `SASL_PLAINTEXT`                     | `SASL_PLAINTEXT`                        | `GATEWAY_MANAGED`                    |
| `SASL_SSL`                           | `SASL_SSL`                              | `GATEWAY_MANAGED`                    |
| `SSL`                                | `SSL`                                   | `GATEWAY_MANAGED`                    |
| `DELEGATED_SASL_PLAINTEXT`           | `SASL_PLAINTEXT`                        | `KAFKA_MANAGED`                      |
| `DELEGATED_SASL_SSL`                 | `SASL_SSL`                              | `KAFKA_MANAGED`                      |

We still support `GATEWAY_ACL_ENABLED` variable. Where set, we will continue to honor valid configurations. However, if `GATEWAY_SECURITY_MODE` is set to `KAFKA_MANAGED`, we will provide an error message if `ACL_ENABLED` is set to true. You cannot managed ACLs on the Gateway if you are authenticating.

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

For example, if you want to set up a Gateway configuration that delegates authentication to your backing Kafka cluster using `SASL_SSL`:

- **Before** (in previous versions):

  ```yaml
  GATEWAY_SECURITY_PROTOCOL: DELEGATED_SASL_SSL
  ```

- **Now** (in 3.10.0 and later):
  
  ```yaml
  GATEWAY_SECURITY_MODE: KAFKA_MANAGED
  GATEWAY_SECURITY_PROTOCOL: SASL_SSL
  ```
  
When `GATEWAY_SECURITY_MODE` is set, there is no longer a need to provide `ACL_ENABLED`. The behaviour of ACls will be like so: 

| GATEWAY_SECURITY_MODE | ACL is enabled |
|-----------------------|----------------|
| GATEWAY_MANAGED       | true           |
| KAFKA_MANAGED         | false          |
