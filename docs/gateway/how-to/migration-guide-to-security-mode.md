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

As part of this, we are deprecating (although still supporting) `DELEGATED_XXX` inputs for `GATEWAY_SECURITY_PROTOCOL`. The valid inputs for `GATEWAY_SECURITY_MODE` are: `KAFKA_MANAGED` and `GATEWAY_MANAGED`. For more details see [documentation](../configuration/env-variables.md#connect-from-clients-to-gateway).
We are also changing the default behaviour of `GATEWAY_ACL_ENABLED`.
Previously, when left unset this was always defaulted to be `false`. Going forward it will be determined by the security mode. You'll find more details below.

:::warning
If you are using a security protocol that has an ANONYMOUS identity (`PLAINTEXT`, or `SSL` without mTLS) then you will face authorisation errors because ACLs are now enabled by default for Gateway Managed security. To remove authorisation from your setup set `GATEWAY_ACL_ENABLED: false` in the Gateway environment variables.
:::

## Why?

We are splitting the security configuration into two steps in order to simplify the user experience. The two questions you should think about are:

- **What is responsible for authentication and authorization?** Kafka, or Gateway?
- **How will your Kafka clients be authenticating?** Set the appropriate protocol.

Previously, both these questions were resolved by the GATEWAY_SECURITY_PROTOCOL. Instead, we set *the what is responsible* using `GATEWAY_SECURITY_MODE` and simplify the options for *the how*, which still uses `GATEWAY_SECURITY_PROTOCOL`.

We will also enable or disable ACLs on Gateway from the security mode, meaning the `GATEWAY_ACL_ENABLED` environment variable only needs to be used when disabling ACLs on Gateway, on the passthrough. The behaviour for the virtual clusters is directly handled in the [virtual cluster configuration](/gateway/reference/resources-reference/#virtualcluster)..

## Am I affected?

All our customers are affected. Even though this change is backwards-compatible (we still support the delegated protocols for the `GATEWAY_SECURITY_PROTOCOL`), we recommend you migrate to the new environment variables. You can find more details in the [What do I need to do](#what-do-i-need-to-do).

We still support the `GATEWAY_ACL_ENABLED` variable. Where set, we will continue to honor valid configurations. However, if `GATEWAY_SECURITY_MODE` is set to `KAFKA_MANAGED`, we will provide an error message if `GATEWAY_ACL_ENABLED` is set to true. **You cannot manage ACLs on the Gateway if you are authenticating on the Kafka cluster.**

## What do I need to do?

### Delegated Security Protocols

We strongly encourage to set up the security configurations using the new `GATEWAY_SECURITY_MODE` environment variable and migrate from usage of `DELEGATED_SASL_PLAINTEXT` and `DELEGATED_SASL_SSL`.

You can use this table to guide your possible configurations.

1. Find your pre-3.10.0 `GATEWAY_SECURITY_PROTOCOL` value in your current deployment configuration
1. Add the relevant `GATEWAY_SECURITY_MODE` environment variable to your deployment configuration
1. Replace the `GATEWAY_SECURITY_PROTOCOL`
    1. If you are already using a `GATEWAY_MANAGED` setup, this will be no change
1. If you are using an unauthorised setup, with `PLAINTEXT` or `SSL` and `KAFKA_MANAGED`, you will need to disable ACLs by adding `GATEWAY_ACL_ENABLED: false` in your configuration. Otherwise, you'll get an error in your startup logs.

| **3.9.0** GATEWAY_SECURITY_PROTOCOL | → **3.10.0** GATEWAY_SECURITY_PROTOCOL | → **3.10.0**  GATEWAY_SECURITY_MODE |
|-------------------------------------|----------------------------------------|-------------------------------------|
| `PLAINTEXT`                         | `PLAINTEXT`                            | `GATEWAY_MANAGED`                   |
| `SASL_PLAINTEXT`                    | `SASL_PLAINTEXT`                       | `GATEWAY_MANAGED`                   |
| `SASL_SSL`                          | `SASL_SSL`                             | `GATEWAY_MANAGED`                   |
| `SSL`                               | `SSL`                                  | `GATEWAY_MANAGED`                   |
| `DELEGATED_SASL_PLAINTEXT`          | `SASL_PLAINTEXT`                       | `KAFKA_MANAGED`                     |
| `DELEGATED_SASL_SSL`                | `SASL_SSL`                             | `KAFKA_MANAGED`                     |

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
  
### GATEWAY_ACL_ENABLED

When `GATEWAY_SECURITY_MODE` is set, there is no longer a need to provide `GATEWAY_ACL_ENABLED`. Unless you want to disable ACLs, in which case add `GATEWAY_ACL_ENABLED: false` to your configuration. The behaviour of ACLs on passthrough will be like so:

| GATEWAY_SECURITY_MODE | ACL is enabled |
|-----------------------|----------------|
| GATEWAY_MANAGED       | true           |
| KAFKA_MANAGED         | false          |

You may have existing dev builds that previously configured `GATEWAY_ACL_ENABLED` to be `false` due to being unset. To maintain this behaviour, you must now explicitly override `GATEWAY_ACL_ENABLED` to be false.  