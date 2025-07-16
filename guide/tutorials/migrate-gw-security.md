---
sidebar_position: 9
title: Migrate to new Gateway security mode
description: A guide for existing customers on how to migrate to Gateway security mode
---

## Overview

This guide is for migrating authentication and authorization to the new configuration in Gateway v3.10.0 and later.

We have introduced a new environment variable: `GATEWAY_SECURITY_MODE` which determines where authentication takes place.

As part of this, we're deprecating (but will still support) `DELEGATED_XXX` inputs for `GATEWAY_SECURITY_PROTOCOL`. The valid inputs for `GATEWAY_SECURITY_MODE` are: `KAFKA_MANAGED` and `GATEWAY_MANAGED`. [Find out more about the client to Gateway connection](/guide/conduktor-in-production/deploy-artifacts/deploy-gateway/#4-configure-gateway-to-accept-client-connections).

We're also changing the default behavior of `GATEWAY_ACL_ENABLED`. Previously, when left undefined, it defaulted to `false`. It will now be determined by the security mode.

:::warning[Using anonymous identity]
If you're using a security protocol that has an ANONYMOUS identity (`PLAINTEXT` or `SSL` without mTLS), you will face authorization errors because ACLs are now enabled by default for Gateway managed security. To remove authorization from your setup, set `GATEWAY_ACL_ENABLED: false`.
:::

## Benefits

We're splitting the security configuration into two steps to simplify the user experience. The two questions to consider:

1. What's responsible for authentication and authorization - Kafka or Gateway?
1. How will your Kafka clients be authenticating? Set the appropriate protocol.

Previously, both these were resolved by the GATEWAY_SECURITY_PROTOCOL. Instead, we set *the what is responsible* using `GATEWAY_SECURITY_MODE` and simplify the options for *the how*, which still uses `GATEWAY_SECURITY_PROTOCOL`.

We'll also enable/disable ACLs on Gateway from the security mode, meaning that the `GATEWAY_ACL_ENABLED` environment variable **only needs to be used when disabling ACLs** on Gateway, on the passthrough. The behavior for the virtual clusters is handled in the [Virtual Cluster configuration](/guide/reference/gateway-reference/#virtualcluster).

## Am I affected?

All our customers are affected. Even though this change is backwards-compatible (we still support the delegated protocols for the `GATEWAY_SECURITY_PROTOCOL`), **we recommend that you migrate to the new environment variables**.

We still support the `GATEWAY_ACL_ENABLED` variable. Where set, we will continue to honor valid configurations. However, if `GATEWAY_SECURITY_MODE` is set to `KAFKA_MANAGED`, we will provide an error message if `GATEWAY_ACL_ENABLED` is set to true. **You cannot manage ACLs on Gateway if you're authenticating on the Kafka cluster.**

## What do I need to do?

### Delegated security protocols

We strongly encourage to set up the security configurations using the new `GATEWAY_SECURITY_MODE` environment variable and migrate from using `DELEGATED_SASL_PLAINTEXT` and `DELEGATED_SASL_SSL`.

1. Find your pre-3.10.0 `GATEWAY_SECURITY_PROTOCOL` value in your current deployment configuration.
1. Add the relevant `GATEWAY_SECURITY_MODE` environment variable to your deployment configuration.
1. Replace the `GATEWAY_SECURITY_PROTOCOL`.
    1. If you're already using a `GATEWAY_MANAGED` setup, there will be no change.
1. If you're using an unauthorized setup with `PLAINTEXT` or `SSL` and `KAFKA_MANAGED`, you'll need to disable ACLs by adding `GATEWAY_ACL_ENABLED: false` in your configuration. Otherwise, you'll get an error in your startup logs.

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

- **Now** (in v3.10.0 and later):
  
  ```yaml
  GATEWAY_SECURITY_MODE: KAFKA_MANAGED
  GATEWAY_SECURITY_PROTOCOL: SASL_SSL
  ```
  
### GATEWAY_ACL_ENABLED

When `GATEWAY_SECURITY_MODE` is set, there's no longer a need to provide `GATEWAY_ACL_ENABLED`. If you want to disable ACLs, add `GATEWAY_ACL_ENABLED: false` to your configuration. The behavior of ACLs on passthrough will be like this:

| GATEWAY_SECURITY_MODE | ACL is enabled |
|-----------------------|----------------|
| GATEWAY_MANAGED       | true           |
| KAFKA_MANAGED         | false          |

You may have existing dev builds that previously configured `GATEWAY_ACL_ENABLED` to be `false` due to being undefined. To maintain this behavior, you have to now explicitly override `GATEWAY_ACL_ENABLED` to be false.
