---
version: 3.0.0
title: Data masking
description: Mask fields in records to hide sensitive data.
parent: data-security
license: enterprise
---

## Overview

Field level data masking Interceptor masks sensitive fields within messages as they are consumed.

## Configuration

The policies will be applied when consuming messages.

| Key         | Type                    | Default       | Description                                                                                                   |
|:------------|:------------------------|:--------------|:--------------------------------------------------------------------------------------------------------------|
| topic       | String                  | `.*`          | Topics that match this regex will have the Interceptor applied                                                |
| policies    | Policy list  |               | List of your masking policies                                                                                 |
| errorPolicy | String | `fail_fetch`  | Determines the plugin behavior when it can't parse a fetched message: `fail_fetch` or `skip_masking` |

### Policy

| Key                  | Type                               | Description                                                                                                                                                                                    |
|:---------------------|:-----------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name                 | String                             | Unique name to identify your policy                                                                                                                                                        |
| fields               | list                               | List of fields that should be obfuscated with the masking rule. Fields can be in a nested structure with dot `.`. For example: `education.account.username`, `banks[0].accountNo` or `banks[*].accountNo` |
| rule                 | Rule                      | Rule                                                                                                                                                                                           |
| schemaRegistryConfig | Schema registry | The schema registry in use.                                                                                                                         |

### Rule

| Key           | Type                          | Default    | Description                                                 |
|:--------------|:------------------------------|:-----------|:------------------------------------------------------------|
| type          | Masking type                  | `MASK_ALL` | The type of masking (see below).                            |
| maskingChar   | char                          | `*`        | The character used for masking data.                        |
| numberOfChars | number                        |            | Number of masked characters, required if `type != MASK_ALL` |

### Masking type

- `MASK_ALL`: all data will be masked
- `MASK_FIRST_N`: the first `n` characters will be masked
- `MASK_LAST_N`: the last `n` characters will be masked

### Error policy

You can control the plugin behavior when it can't parse a fetched message through its `errorPolicy` which can be set to `fail_fetch` or `skip_masking`.

The default is `fail_fetch`. In this mode, the plugin will return a failure to read the batch which the fetch record is part of, effectively blocking any consumer.

In `skip_masking` mode, if there's a failure to parse a message being fetched (e.g. an encrypted record is read in), then that record is skipped and returned un-masked.

### Schema registry

| Key                   | Type   | Default     | Description                                                                                                                                                                                                         |
|-----------------------|--------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`                | string | `CONFLUENT` | The type of schema registry to use. Choose `CONFLUENT` (for Confluent-like schema registries including OSS Kafka) or `AWS` for AWS Glue schema registries.                                                      |
| `additionalConfigs`   | map    |             | Additional properties that map to specific security-related parameters. For enhanced security, you can hide the sensitive values using environment variables as secrets.​ |
| **Confluent Like**    |        |             | **Configuration for Confluent-like schema registries**                                                                                                                                                              |
| `host`                | string |             | URL of your schema registry.                                                                                                                                                                                        |
| `cacheSize`           | string | `50`        | Number of schemas that can be cached locally by this Interceptor so that it doesn't have to query the schema registry every time.                                                                                   |
| **AWS Glue**          |        |             | **Configuration for AWS Glue schema registries**                                                                                                                                                                    |
| `region`              | string |             | The AWS region for the schema registry, e.g. `us-east-1`.                                                                                                                                                            |
| `registryName`        | string |             | The name of the schema registry in AWS. Leave blank for the AWS default of `default-registry`.                                                                                                                      |
| `basicCredentials`    | string |             | Access credentials for AWS.                                                                                                                                     |
| **AWS credentials**   |        |             | **AWS credential configuration**                                                                                                                          |
| `accessKey`           | string |             | The access key for the connection to the schema registry.                                                                                                                                                           |
| `secretKey`           | string |             | The secret key for the connection to the schema registry.                                                                                                                                                           |
| `validateCredentials` | bool   | `true`      | The `true` or `false` flag determines whether the credentials provided should be validated when set.                                                                                                                   |
| `accountId`           | string |             | The Id for the AWS account to use.                                                                                                                        |

If you don't provide a `basicCredentials` section for the AWS Glue schema registry, the client we use to connect will instead attempt to find the connection information is needs from the environment and the credentials required can be passed this way to Gateway as part of its core configuration. [Find out more about setting up AWS](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html#credentials-default).

[Read our blog about schema registries](https://www.conduktor.io/blog/what-is-the-schema-registry-and-why-do-you-need-to-use-it/).

## Example

```json
{
  "name": "myFieldLevelDataMaskingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.FieldLevelDataMaskingPlugin",
  "priority": 100,
  "config": {
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081"
    },
    "policies": [
      {
        "name": "Mask password",
        "rule": {
          "type": "MASK_ALL"
        },
        "fields": [
          "password"
        ]
      },
      {
        "name": "Mask visa",
        "rule": {
          "type": "MASK_LAST_N",
          "maskingChar": "X",
          "numberOfChars": 4
        },
        "fields": [
          "visa"
        ]
      }
    ]
  }
}
```

### Secured schema registry

```json
{
  "name": "myFieldLevelDataMaskingPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.FieldLevelDataMaskingPlugin",
  "priority": 100,
  "config": {
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081",
      "additionalConfigs": {
        "schema.registry.url": "${SR_URL}",
        "basic.auth.credentials.source": "${SR_BASIC_AUTH_CRED_SRC}",
        "basic.auth.user.info": "${SR_BASIC_AUTH_USER_INFO}"
      }
    },
    "policies": [
      {
        "name": "Mask password",
        "rule": {
          "type": "MASK_ALL"
        },
        "fields": [
          "password"
        ]
      },
      {
        "name": "Mask visa",
        "rule": {
          "type": "MASK_LAST_N",
          "maskingChar": "X",
          "numberOfChars": 4
        },
        "fields": [
          "visa"
        ]
      }
    ]
  }
}
```
