---
version: 3.0.0
title: Encryption - Snippets
description: Encrypt data within your Kafka records to ensure the data cannot be read by third parties.
parent: data-security
license: enterprise
---


## Schema Based Encryption

- Fields containing specific information with  (`keySecretId`, `algorithm`, `tags` match) will be encrypted.
- Field would be encrypted with the associated `keySecretId`, `algorithm`, 
if any missed, would be encrypted with the associated default ones in the interceptor configuration.
- Field would be encrypted with defaultSecret, defaultAlgorithm when `tags` has element with is in the interceptor configuration.

Example for json schema, assuming we're using default namespace (`conduktor.`):

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Customer",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "username": { "type": "string" },
    "password": { "type": "string", "conduktor.keySecretId": "password-secret", "conduktor.algorithm": "AES128_GCM"},
    "visa": { "type": "string", "conduktor.keySecretId": "password-visa"},
    "address": {
      "type": "object",
      "properties": {
        "location": { "type": "string", "conduktor.tags": ["MY_TAG", "PII", "GDPR", "MY_OTHER_TAG"]},
        "town": { "type": "string" },
        "country": { "type": "string" }
      }
    }
  }
}
```

Explanation:
- `password` would be encrypted with the associated keySecretId, algorithm etc.
- `visa` would be encryption with the associated keySecretId and the default algorithm provided in the interceptor configuration.
- `location` would be encrypted with defaultSecret, defaultAlgorithm because tags has `PII` with is in the interceptor configuration.
- fields containing no specific information (`keySecretId`, `algorithm`, `tags` without match) are left untouched.

Example for avro schema, assuming we're using default namespace (`conduktor.`):

```json
{
  "type": "record",
  "name": "User",
  "fields": [
    {"name": "name", "type": "string", "conduktor.algorithm": "AES128_GCM"},
    {"name": "age", "type": "int", "conduktor.keySecretId": "age-secret"},
    {"name": "email", "type": "string"},
    {
      "name": "address",
      "type": {
        "type": "record",
        "name": "AddressRecord",
        "fields": [
          {"name": "street", "type": "string", "conduktor.keySecretId": "street-secret"},
          {"name": "city", "type": "string", "conduktor.keySecretId": "city-secret", "conduktor.algorithm": "AES128_GCM"}
        ]
      }
    },
    {"name": "hobbies", "type": {"type": "array", "items": "string"}},
    {
      "name": "friends",
      "type": {
        "type": "array",
        "items": {
          "type": "record",
          "name": "Friend",
          "fields": [
            {"name": "name", "type": "string", "conduktor.tags": ["MY_TAG", "PII", "GDPR", "MY_OTHER_TAG"]},
            {"name": "age", "type": "int"}
          ]
        }
      }
    }
  ]
}
```

Example for protobuf schema, assuming we're using default namespace (`conduktor.`):
In Protobuf, since we are using the Confluent Schema Registry, we use the `(confluent.field_meta).params` (with type `map<string, string`)
for field options. Here's how it can be defined:

```protobuf
  syntax = "proto3";
                 
  option java_package = "schema.protobuf";
  option java_outer_classname = "User";
  
  message Student {
    string name = 1 [(confluent.field_meta).params = {conduktor.keySecretId: "name-secret", conduktor.algorithm: "AES128_GCM"}];
    int32 age = 2 [(confluent.field_meta).params = {conduktor.keySecretId: "age-secret"}];
    string email = 3 [(confluent.field_meta).params = {conduktor.keySecretId: "email-secret"}];
    Address address = 4;
    repeated string hobbies = 5;
    repeated Friend friends = 6;
  
    message Address {
      string street = 1 [(confluent.field_meta).params = {conduktor.keySecretId: "street-secret", conduktor.algorithm: "AES128_GCM"}];
      string city = 2 [(confluent.field_meta).params = {conduktor.keySecretId: "city-secret"}];
    }
  
    message Friend {
      string name = 1 [(confluent.field_meta).params = {conduktor.tags: "[\"PII\", \"MY_TAG\"]"}];
      int32 age = 2 [(confluent.field_meta).params = {conduktor.keySecretId: "friend-age-secret"}];
    }
  }
```

## Simple Encrypt on Produce

```json
{
  "name": "myEncryptionPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "recordValue": {
      "fields": [
        {
          "fieldName": "password",
          "keySecretId": "password-secret",
          "algorithm": "AES128_GCM"
        }
      ]
    }
  }
}
```

## Field level encryption on Produce

```json
{
  "name": "myEncryptPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081"
    },
    "kmsConfig": {
      "vault": {
        "uri": "http://vault:8200",
        "token": "vault-plaintext-root-token",
        "version": 1
      },
      "azure": {
        "tokenCredential": {
          "clientId": "azure_client_id",
          "tenantId": "azure_tenant_id",
          "clientSecret": "azure_client_secret"
        }
      }
    },
    "recordValue": {
      "fields": [
        {
          "fieldName": "password",
          "keySecretId": "vault-kms://vault:8200/transit/keys/password-secret",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "visa",
          "keySecretId": "vault-kms://vault:8200/transit/keys/{{record.header.test-header}}-visa-secret-{{record.key}}-{{record.value.username}}-{{record.value.education.account.accountId}}",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "education.account.username",
          "keySecretId": "azure-kms://my-key-vault.vault.azure.net/keys/conduktor-gateway/4ceb7a4d1f3e4738b23bea870ae8745d",
          "algorithm": "AES128_GCM"
        }
      ]
    }
  }
}
```

## Field level encryption on Produce with secured template

```json
{
  "name": "myEncryptPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081",
      "additionalConfigs": {
        "schema.registry.url": "${SR_URL}",
        "basic.auth.credentials.source": "${SR_BASIC_AUTH_CRED_SRC}",
        "basic.auth.user.info": "${SR_BASIC_AUTH_USER_INFO}"
      }
    },
    "kmsConfig": {
      "vault": {
        "uri": "http://vault:8200",
        "token": "${VAULT_TOKEN}",
        "version": 1
      }
      }
    },
    "recordValue": {
      "fields": [
        {
          "fieldName": "password",
          "keySecretId": "vault-kms://vault:8200/transit/keys/password-secret",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "visa",
          "keySecretId": "vault-kms://vault:8200/transit/keys/{{record.header.test-header}}-visa-secret-{{record.key}}-{{record.value.username}}-{{record.value.education.account.accountId}}",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "education.account.username",
          "keySecretId": "vault-kms://vault:8200/transit/keys/{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
          "algorithm": "AES128_GCM"
        }
      ]
    }
  }
}
```

## Schema Based field level encryption on Produce

```json
{
  "name": "mySchemaBasedEncryptPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.EncryptSchemaBasedPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081"
    },
    "kmsConfig": {
      "vault": {
        "uri": "http://vault:8200",
        "token": "vault-plaintext-root-token",
        "version": 1
      }
      }
    },
    "defaultKeySecretId": "vault-kms://vault:8200/transit/keys/myDefaultKeySecret",
    "defaultAlgorithm": "AES128_EAX",
    "tags": ["PII", "ENCRYPTION"],
    "namespace": "conduktor."
  }
}
```

## Full message level encryption on Produce

```json
{
  "name": "myEncryptPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081"
    },
    "kmsConfig": {
      "vault": {
        "uri": "http://vault:8200",
        "token": "vault-plaintext-root-token",
        "version": 1
      }
      }
    },
    "recordValue": {
      "payload": {
        "keySecretId": "vault-kms://vault:8200/transit/keys/{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
        "algorithm": "AES128_GCM"
      }
    }
  }
}
```

## Full message level encryption on Produce with secured template

```json
{
  "name": "myEncryptPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081",
      "additionalConfigs": {
        "schema.registry.url": "${SR_URL}",
        "basic.auth.credentials.source": "${SR_BASIC_AUTH_CRED_SRC}",
        "basic.auth.user.info": "${SR_BASIC_AUTH_USER_INFO}"
      }
    },
    "kmsConfig": {
      "vault": {
        "uri": "http://vault:8200",
        "token": "${VAULT_TOKEN}",
        "version": 1
      }
      }
    },
    "recordValue": {
      "payload": {
        "keySecretId": "vault-kms://vault:8200/transit/keys/{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
        "algorithm": "AES128_GCM"
      }
    }
  }
}
```

## Encryption on Consume

```json
{
  "name": "myEncryptPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.FetchEncryptPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081"
    },
    "kmsConfig": {
      "vault": {
        "uri": "http://vault:8200",
        "token": "vault-plaintext-root-token",
        "version": 1
      }
    },
    "recordValue": {
      "fields": [
        {
          "fieldName": "password",
          "keySecretId": "vault-kms://vault:8200/transit/keys/password-secret",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "visa",
          "keySecretId": "vault-kms://vault:8200/transit/keys/{{record.header.test-header}}-visa-secret-{{record.key}}-{{record.value.username}}-{{record.value.education.account.accountId}}",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "education.account.username",
          "keySecretId": "vault-kms://vault:8200/transit/keys/{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
          "algorithm": "AES128_GCM"
        }
      ]
    }
  }
}
```
## Schema Based field level encryption on Consume

```json
{
  "name": "mySchemaBasedEncryptPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.FetchEncryptSchemaBasedPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081"
    },
    "kmsConfig": {
      "vault": {
        "uri": "http://vault:8200",
        "token": "vault-plaintext-root-token",
        "version": 1
      }
      }
    },
    "defaultKeySecretId": "vault-kms://vault:8200/transit/keys/myDefaultKeySecret",
    "defaultAlgorithm": "AES128_EAX",
    "tags": ["PII", "ENCRYPTION"],
    "namespace": "conduktor."
  }
}
```

## Encryption on Consume with secured template

```json
{
  "name": "myEncryptPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.FetchEncryptPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081",
      "additionalConfigs": {
        "schema.registry.url": "${SR_URL}",
        "basic.auth.credentials.source": "${SR_BASIC_AUTH_CRED_SRC}",
        "basic.auth.user.info": "${SR_BASIC_AUTH_USER_INFO}"
      }
    },
    "kmsConfig": {
      "vault": {
        "uri": "http://vault:8200",
        "token": "${VAULT_TOKEN}",
        "version": 1
      }
    },
    "recordValue": {
      "fields": [
        {
          "fieldName": "password",
          "keySecretId": "vault-kms://vault:8200/transit/keys/password-secret",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "visa",
          "keySecretId": "vault-kms://vault:8200/transit/keys/{{record.header.test-header}}-visa-secret-{{record.key}}-{{record.value.username}}-{{record.value.education.account.accountId}}",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "education.account.username",
          "keySecretId": "vault-kms://vault:8200/transit/keys/{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
          "algorithm": "AES128_GCM"
        }
      ]
    }
  }
}
```

## Decrypt all fields

```json
{
  "name": "myDecryptPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.DecryptPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081"
    },
    "kmsConfig": {
      "vault": {
        "uri": "http://vault:8200",
        "token": "vault-plaintext-root-token",
        "version": 1
      }
    }
  }
}
```

## Decrypt all fields with secured template

```json
{
  "name": "myDecryptPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.DecryptPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081",
      "additionalConfigs": {
        "schema.registry.url": "${SR_URL}",
        "basic.auth.credentials.source": "${SR_BASIC_AUTH_CRED_SRC}",
        "basic.auth.user.info": "${SR_BASIC_AUTH_USER_INFO}"
      }
    },
    "kmsConfig": {
      "vault": {
        "uri": "http://vault:8200",
        "token": "${VAULT_TOKEN}",
        "version": 1
      }
    }
  }
}
```

## Decrypt specific fields

```json
{
  "name": "myDecryptPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.DecryptPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081"
    },
    "kmsConfig": {
      "vault": {
        "uri": "http://vault:8200",
        "token": "vault-plaintext-root-token",
        "version": 1
      }
    },
    "recordValueFields": [
      "visa",
      "education.account.username"
    ],
    "recordKeyFields": [
      "bank.accountNo"
    ],
    "recordHeaderFields": [
      "account.username"
    ]
  }
}
```

## Decrypt specific fields with secured template

```json
{
  "name": "myDecryptPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.DecryptPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081",
      "additionalConfigs": {
        "schema.registry.url": "${SR_URL}",
        "basic.auth.credentials.source": "${SR_BASIC_AUTH_CRED_SRC}",
        "basic.auth.user.info": "${SR_BASIC_AUTH_USER_INFO}"
      }
    },
    "kmsConfig": {
      "vault": {
        "uri": "http://vault:8200",
        "token": "${VAULT_TOKEN}",
        "version": 1
      }
    },
    "recordValueFields": [
      "visa",
      "education.account.username"
    ],
    "recordKeyFields": [
      "bank.accountNo"
    ],
    "recordHeaderFields": [
      "account.username"
    ]
  }
}
```

## Decrypt full message

```json
{
  "name": "myDecryptPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.DecryptPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "kmsConfig": {
      "vault": {
        "uri": "http://vault:8200",
        "token": "vault-plaintext-root-token",
        "version": 1
      }
    }
  }
}
```

## Decrypt full message with secured template

```json
{
  "name": "myDecryptPlugin",
  "pluginClass": "io.conduktor.gateway.interceptor.DecryptPlugin",
  "priority": 100,
  "config": {
    "topic": ".*",
    "kmsConfig": {
      "vault": {
        "uri": "http://vault:8200",
        "token": "${VAULT_TOKEN}",
        "version": 1
      }
    }
  }
}
```