---
version: 2.6.0
title: Data masking
description: Mask fields in records to hide sensitive data.
parent: data-security
license: enterprise
---

## Introduction

Field level data masking interceptor masks sensitive fields within messages as they are consumed.

## Configuration

Policies will be actioned and applied when consuming messages. 

| key      | type                    | default | description                                                    |
|:---------|:------------------------|:--------|:---------------------------------------------------------------|
| topic    | String                  | `.*`    | Topics that match this regex will have the interceptor applied |
| policies | List[[Policy](#policy)] |         | List of your masking policies                                  |

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

### Schema Registry

| key               | type   | default | description                                                                                                                                                                                                                                        |
|:------------------|:-------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| host              | String |         | Url of schema registry                                                                                                                                                                                                                             |
| cacheSize         | String | `50`    | This interceptor caches schemas locally so that it doesn't have to query the schema registry                                                                                                                                                       |
| additionalConfigs | map    |         | Additional properties maps to specific security related parameters. For enhanced security, you can use the template `${MY_ENV_VAR}` in `map` values, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue) |

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
