---
version: 3.0.0
title: CEL Topic Filtering
description: Don't reinvent the wheel to filter your messages, just use CEL expression!
parent: optimize
license: enterprise
---

## Introduction

Conduktor Gateway's CEL topic feature uses CEL (Common Expression Language) expression to filter messages, based on a
simple CEL Expression in the form.

Currently

- Filtered by:
    - Record key (It supports SR):
        - Record key as string: - `.. record.key == 'some thing'`
        - Record key as schema: `.. record.key.someValue.someChildValue == 'some thing'`
    - Record value (It supports SR): `.. record.value.someValue.someChildValue == 'some thing'`
    - Partition: `.. record.partition == 1`
    - Timestamp: `.. record.timestamp == 98717823712`
    - Header: `.. record.header.someHeaderKey == 'some thing'`
    - Offset: `.. record.offset == 1`

## Configuration

| key                  | type                                | description                                                                                                                              |
|:---------------------|:------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------|
| virtualTopic         | String                              | When accessed, this virtual topic retrieves filtered data from the specified client topic, applying a CEL expression for data filtering. |
| topic                | String                              | Specifies the client topic from which data is fetched.                                                                                   |
| expression           | String                              | A CEL expression that returns BOOLEAN to filter data. This determines which data from the topic is relevant based on the given criteria. |
| schemaRegistryConfig | [Schema Registry](#schema-registry) | Schema Registry Config                                                                                                                   |
| celCacheSize         | int                                 | In memory cache size for cel expressions, balancing speed and resource use, optimize performance.                                        |

### Schema Registry

| key               | type   | default | description                                                                                                                                                                                                                                                          |
|:------------------|:-------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| host              | String |         | Url of schema registry                                                                                                                                                                                                                                               |
| cacheSize         | String | `50`    | This interceptor caches schemas locally so that it doesn't have to query the schema registry                                                                                                                                                                         |
| additionalConfigs | map    |         | Additional properties maps to specific security related parameters. For enhanced security, you can use the template `${MY_ENV_VAR}` in `map` values, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue) |

See more about schema
registry [here](https://www.conduktor.io/blog/what-is-the-schema-registry-and-why-do-you-need-to-use-it/)

## Example

```json
{
  "name": "myCelTopicPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.CelTopicPlugin",
  "priority": 100,
  "config": {
    "virtualTopic": "legal_user",
    "topic": "users",
    "expression": "record.value.age > 18",
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081"
    },
    "celCacheSize": 100
  }
}
```

### Schema Registry with secured template

```json
{
  "name": "myCelTopicPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.CelTopicPlugin",
  "priority": 100,
  "config": {
    "virtualTopic": "legal_user",
    "topic": "users",
    "statement": "record.value.age > 18",
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081",
      "additionalConfigs": {
        "schema.registry.url": "${SR_URL}",
        "basic.auth.credentials.source": "${SR_BASIC_AUTH_CRED_SRC}",
        "basic.auth.user.info": "${SR_BASIC_AUTH_USER_INFO}"
      }
    },
    "celCacheSize": 100
  }
}
```