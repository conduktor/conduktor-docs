---
version: 3.0.0
title: Data Masking
description: Mask fields in records to hide sensitive data.
parent: data-security
license: enterprise
---

## Introduction

Field level data masking interceptor masks sensitive fields within messages as they are consumed.

## Configuration

Policies will be actioned and applied when consuming messages. 

| key         | type                    | default       | description                                                                                                   |
|:------------|:------------------------|:--------------|:--------------------------------------------------------------------------------------------------------------|
| topic       | String                  | `.*`          | Topics that match this regex will have the interceptor applied                                                |
| policies    | List[[Policy](#policy)] |               | List of your masking policies                                                                                 |
| errorPolicy | [String](#error-policy) | `fail_fetch`  | Determines the plugin behaviour when it cannot parse a fetched message. One of `fail_fetch` or `skip_masking` |


### Policy

| key                  | type                               | description                                                                                                                                                                                    |
|:---------------------|:-----------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name                 | String                             | Unique name for identifying your policy                                                                                                                                                        |                                                                                                    
| fields               | list                               | List of fields that should be obfuscated with the masking rule. Fields can be nested structure with dot `.` such as `education.account.username`, `banks[0].accountNo` or `banks[*].accountNo` |
| rule                 | [Rule](#rule)                      | Rule                                                                                                                                                                                           |
| schemaRegistryConfig | [SchemaRegistry](#schema-registry) | Schema Registry                                                                                                                                                                                | 

### Rule

| key           | type                          | default    | description                                                 |
|:--------------|:------------------------------|:-----------|:------------------------------------------------------------|
| type          | [Masking Type](#masking-type) | `MASK_ALL` | Masking type                                                |
| maskingChar   | char                          | `*`        | Character that the data masked                              |
| numberOfChars | number                        |            | number of masked characters, required if `type != MASK_ALL` |

### Masking Type

* `MASK_ALL`: data will be masked,
* `MASK_FIRST_N`: The first `n` characters will be masked
* `MASK_LAST_N`: The last `n` characters will be masked

### Error Policy

You can control the plugin behaviour when it cannot parse a fetched message through its `errorPolicy`.
This can be set to one of `fail_fetch` or `skip_masking`.

The default mode is `fail_fetch` and in this mode the plugin will return a failure to read the batch which the fetch record is part of, effectively blocking any consumer.

In `skip_masking` mode, if there is a failure to parse a message being fetched (e.g. an encrpyted record is read in) then that record is skipped, and returned un-masked.

### Schema Registry

| Key                   | Type   | Default     | Description                                                                                                                                                                                                         |
|-----------------------|--------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`                | string | `CONFLUENT` | The type of schema registry to use: choose `CONFLUENT` (for Confluent-like schema registries including OSS Kafka) or `AWS` for AWS Glue schema registries.                                                      |
| `additionalConfigs`   | map    |             | Additional properties maps to specific security-related parameters. For enhanced security, you can hide the sensitive values using environment variables as secrets.​ |
| **Confluent Like**    |        |             | **Configuration for Confluent-like schema registries**                                                                                                                                                              |
| `host`                | string |             | URL of your schema registry.                                                                                                                                                                                        |
| `cacheSize`           | string | `50`        | Number of schemas that can be cached locally by this interceptor so that it doesn't have to query the schema registry every time.                                                                                   |
| **AWS Glue**          |        |             | **Configuration for AWS Glue schema registries**                                                                                                                                                                    |
| `region`              | string |             | The AWS region for the schema registry, e.g. `us-east-1`                                                                                                                                                            |
| `registryName`        | string |             | The name of the schema registry in AWS (leave blank for the AWS default of `default-registry`)                                                                                                                      |
| `basicCredentials`    | string |             | Access credentials for AWS (see below section for structure)                                                                                                                                                        |
| **AWS Credentials**   |        |             | **AWS Credentials Configuration**                                                                                                                                                                                   |
| `accessKey`           | string |             | The access key for the connection to the schema registry.                                                                                                                                                           |
| `secretKey`           | string |             | The secret key for the connection to the schema registry.                                                                                                                                                           |
| `validateCredentials` | bool   | `true`      | `true` / `false` flag to determine whether the credentials provided should be validated when set.                                                                                                                   |
| `accountId`           | string |             | The Id for the AWS account to use.                                                                                                                                                                                  |


If you do not supply a `basicCredentials` section for the AWS Glue schema registry, the client we use to connect will instead attempt to find the connection information is needs from the environment, and the credentials required can be passed this way to the Gateway as part of its core configuration. More information on the setup for this is found in the [AWS documentation](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html#credentials-default).

See more about schema registry [here](https://www.conduktor.io/blog/what-is-the-schema-registry-and-why-do-you-need-to-use-it/)

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

### Secured Schema Registry

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
