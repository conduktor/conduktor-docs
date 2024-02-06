---
version: 2.5.0
title: Encryption
description: Encrypt data within your Kafka records to ensure the data cannot be read by third parties.
parent: data-security
license: enterprise
---

1. [Introduction](#introduction)
2. [Processes](#encryption-and-decryption-processes)
3. [Configuration](#configuration)
4. [Examples](#examples)
5. [FAQ](#faq)

## Introduction

This interceptor is designed to provide a robust and flexible solution for encrypting data within your Kafka records. 
The primary purpose of this feature is to ensure that sensitive data cannot be read by unauthorized third parties, thereby enhancing the security of your data both in transit and at rest.

The interceptor supports both field-level and full message encryption. Field-level encryption allows you to encrypt specific fields within your Kafka records, such as passwords or personal user information. 
This is particularly useful when only certain parts of the message are sensitive.
Full message encryption, on the other hand, encrypts the entire Kafka record. 
This is useful when the entire message needs to be secured.

The encryption process is handled seamlessly by the interceptor, which identifies the data to be encrypted, retrieves the encryption key from the Key Management Service (KMS), encrypts the data, and then sends the encrypted message to its destination. 
The interceptor supports various encryption algorithms and KMS options, providing flexibility to suit your specific requirements.

The interceptor also supports decryption of the encrypted data. This can be done for all fields, specific fields, or the entire message, depending on your configuration. 
The decryption process is similar to the encryption process, with the interceptor identifying the data to be decrypted, retrieving the decryption key from the KMS, decrypting the data, and then making the decrypted message ready for consumption.

This interceptor is designed to be easy to configure and use, with various examples and detailed configuration options provided in this document. 
Whether you need to secure specific fields or entire messages, this interceptor provides a comprehensive solution for your data encryption needs in Kafka.


## Encryption and Decryption Processes

### How to Encrypt Data

1. Data Identification: The interceptor identifies the data that needs to be encrypted. This could be the entire message or specific fields within the message, based on your configuration. For example, if you have specified password as a field to be encrypted in the `fields` configuration, the interceptor will identify this field in the incoming Kafka record.
2. Key Retrieval: The interceptor retrieves the encryption key from the Key Management Service (KMS). The KMS could be Vault, Azure, AWS, GCP, or an in-memory service, depending on your configuration. The interceptor uses the `keySecretId` specified in the configuration to retrieve the correct key.
3. Encryption: The interceptor encrypts the identified data using the retrieved key and the specified encryption algorithm. The encrypted data replaces the original data in the message.
4. Transmission: Encrypted data is converted to json format and sent as a string to the destination.

### How to Decrypt Data

1. Data Identification: The interceptor identifies the data that needs to be decrypted. This could be the entire message or specific fields within the message, based on your configuration. The interceptor uses the `fields` configuration to identify which fields need to be decrypted.
2. Key Retrieval: The interceptor retrieves the decryption key from the KMS. This is usually the same key that was used for encryption. The interceptor uses the `keySecretId` specified in the configuration to retrieve the correct key.
3. Decryption: The interceptor decrypts the identified data using the retrieved key and the specified encryption algorithm. The decrypted data replaces the encrypted data in the message.
4. Consumption: The decrypted message is then ready for consumption by the end user or application. The interceptor ensures that the decrypted data is correctly formatted and compatible with the Kafka record structure.

Please note that the encryption and decryption process is transparent to the end user or application. The interceptor handles all the operations, allowing you to focus on your core business logic.

## Configuration

### Field level encryption configuration

| key                  | type                                | default | description                                                                                                                                                                                                          |
|:---------------------|:------------------------------------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| topic                | String                              | `.*`    | Topics that match this regex will have the interceptor applied                                                                                                                                                       |
| schemaRegistryConfig | [Schema Registry](#schema-registry) |         | Schema Registry config                                                                                                                                                                                               |
| fields               | List[[Fields](#fields)]             |         | List of fields to be encrypted                                                                                                                                                                                       |
| externalStorage      | Boolean                             | false   | Choose whether to securely store your `fields` or `payload` encryption settings in external storage to reduce message record size in physical kafka (based on how we store these encryption settings under the hood) |
| kmsConfig            | [KMS](#kms)                         |         | Define multiple KMS                                                                                                                                                                                                  |

### Full message level encryption configuration

| key                  | type                                | default | description                                                                                                                                                                                                          |
|:---------------------|:------------------------------------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| topic                | String                              | `.*`    | Topics that match this regex will have the interceptor applied                                                                                                                                                       |
| schemaRegistryConfig | [Schema Registry](#schema-registry) |         | Schema Registry config                                                                                                                                                                                               |
| payload              | [Payload](#payload)                 |         | Payload                                                                                                                                                                                                              |
| externalStorage      | Boolean                             | false   | Choose whether to securely store your `fields` or `payload` encryption settings in external storage to reduce message record size in physical kafka (based on how we store these encryption settings under the hood) |
| kmsConfig            | [KMS](#kms)                         |         | Define multiple KMS                                                                                                                                                                                                  |

## Decryption configuration

| key                  | type                                | default | description                                                                                                    |
|:---------------------|:------------------------------------|:--------|:---------------------------------------------------------------------------------------------------------------|
| topic                | String                              | `.*`    | Topics that match this regex will have the interceptor applied                                                 |
| schemaRegistryConfig | [Schema Registry](#schema-registry) |         | Schema Registry config                                                                                         |
| fields               | List[String]                        |         | Only for field level encryption. A list of field names for decryption, an empty list would decrypt all fields  |
| kmsConfig            | [KMS](#kms)                         |         | Define multiple KMS                                                                                            |

### Fields

For **field level** encryption include this section in your interceptor config.
Encryption interceptor allows encoding to each field (currently only text fields are supported):



| key         | type                                        | description                                                                                                                             |
|:------------|:--------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------|
| fieldName   | String                                      | field name to be encrypted/decrypted. Can be nested structure with dot `.` such as `education.account.username` or `banks[0].accountNo` |
| secretKeyId | [Secret Key Template](#secret-key-template) | secretKeyId is a unique identifier for the secret key, can be a template for crypto shredding usecases                                  |
| algorithm   | [Algorithm Config](#algorithm-config)       | Algorithm to leverage                                                                                                                   |

### Payload

For **full message** encryption include this section in your interceptor config, instead of the above `fields`.  
You can choose to ignore or have a blank `fieldName`.
Supported formats are ;
* avro/protobuf/json schemas
* string as json
* raw string
* integer

| key         | type                                        | description                                                  |
|:------------|:--------------------------------------------|:-------------------------------------------------------------|
| secretKeyId | [Secret Key Template](#secret-key-template) | Secret key, can be a template for crypto shredding use cases |
| algorithm   | [Algorithm Config](#algorithm-config)       | Algorithm to leverage                                        |


### Secret Key template

Secret keys can be dynamic, leveraging mustache patterns like:

- `{{record.topic}}` for inject record topic
- `{{record.key}}` for inject record key
- `{{record.value.someValueFieldName}}` for inject record field value from field `someValueFieldName`, `someValueFieldName`, must not be one of field names going to be encrypted/decrypted
- `{{record.value.someList[0].someValueField}}` for inject record field value from field `someValueFieldName` at the first element of the list `someList`
- `{{record.value.someList[*].someValueField}}` for inject record field value from all fields `someValueFieldName` of the list `someList`
- `{{record.header.someHeaderKey}}` for inject header value with header key is `someHeaderKey`

> **_Note:_** the value of a field will be replaced with the encrypted value. So it is not allowed to use the encryption field as the keyId.

If you want to use KMS to manage the secret key, you can use the following format to specify the secretKeyId:

| KMS       | KMS identifier prefix | Key URI format                                                                                       | Example                                                                                            |
|:----------|-----------------------|:-----------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------|
| Vault     | vault-kms://          | `vault-kms://<vault-host>/transit/keys/<key-id>`                                                     | `vault-kms://http://vault:8200/transit/keys/password-key-id`                                       |
| Azure     | azure-kms://          | `azure-kms://<key-vault-name>.vault.azure.net/keys/<key-id>`                                         | `azure-kms://my-key-vault.vault.azure.net/keys/password-key-id`                                    |
| AWS       | aws-kms://            | `aws-kms://arn:aws:kms:<region>:<account-id>:key/<key-id>`                                           | `aws-kms://arn:aws:kms:us-east-1:123456789012:key/password-key-id`                                 |
| GCP       | gcp-kms://            | `gcp-kms://projects/<project-id>/locations/<location-id>/keyRings/<key-ring-id>/cryptoKeys/<key-id>` | `gcp-kms://projects/my-project/locations/us-east1/keyRings/my-key-ring/cryptoKeys/password-key-id` |
| In-Memory |                       | any string is permitted as the secret key                                                            |                                                                                                    |

Keys are string that starts with a letter, followed by a combination of letters, underscores (\_), hyphens (-),
and numbers. Special characters are not allowed. Also, it can work with the upper mustache pattern.

### Algorithm Config

| key  | type                    | description     |
|:-----|:------------------------|:----------------|
| type | [Algorithm](#algorithm) | Algorithm       |
| kms  | [KMS](#kms)             | KMS to levarege |


### Algorithm

- AES_GCM
- AES256_GCM
- AES128_EAX
- AES256_EAX
- AES128_CTR_HMAC_SHA256
- AES256_CTR_HMAC_SHA256
- CHACHA20_POLY1305
- XCHACHA20_POLY1305

## KMS

- IN_MEMORY
- VAULT
- AZURE
- AWS
- GCP

| key   | type                    | description             |
|:------|:------------------------|:------------------------|
| vault | [Vault KMS](#vault-kms) | Vault kms configuration |
| azure | [Azure KMS](#azure-kms) | Azure kms configuration |
| aws   | [AWS KMS](#aws-kms)     | AWS kms configuration   |
| gcp   | [GCP KMS](#gcp-kms)     | GCP kms configuration   |

## Vault KMS

| key      | type   | description                                                                                                                                                                |
|:---------|:-------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| uri      | String | Vault uri                                                                                                                                                                  |
| token    | String | Token. For enhanced security, you can use the template `${MY_ENV_VAR}`, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue)    |
| username | String | Username. For enhanced security, you can use the template `${MY_ENV_VAR}`, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue) |
| password | String | Password. For enhanced security, you can use the template `${MY_ENV_VAR}`, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue) |
| version  | String | version                                                                                                                                                                    |

> **_Note:_** You can select either Token auth method (using a token) or Userpass auth method (using a username and password) to access the Vault KMS. Ensure that you follow the appropriate method and provide the required configuration parameters accordingly.

## Azure KMS

| key                        | type                                                    | description         |
|:---------------------------|:--------------------------------------------------------|:--------------------|
| tokenCredential            | [Azure Token Credentials](#azure-kms-token-credentials) | Token configuration |
| usernamePasswordCredential | [Azure Token Credentials](#azure-kms-token-credentials) | Token configuration |


### Azure KMS token credentials

| key           | type   | description                                                                                                                                                                                     |
|:--------------|:-------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| clientId      | String | Client id. For enhanced security, you can use the template `${MY_ENV_VAR}`, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue)     |
| tenantId      | String | Tenant id. For enhanced security, you can use the template `${MY_ENV_VAR}`, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue)     |
| clientSecret  | String | Client Secret. For enhanced security, you can use the template `${MY_ENV_VAR}`, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue) |

### Azure KMS username password credentials

| key       | type   | description                                                                                                                                                                                 |
|:----------|:-------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| clientId  | String | Client Id. For enhanced security, you can use the template `${MY_ENV_VAR}`, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue) |
| tenantId  | String | Tenant Id. For enhanced security, you can use the template `${MY_ENV_VAR}`, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue) |
| username  | String | Username. For enhanced security, you can use the template `${MY_ENV_VAR}`, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue)  |
| password  | String | Password. For enhanced security, you can use the template `${MY_ENV_VAR}`, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue)  |

## AWS KMS

| key                      | type                                                    | description                       |
|:-------------------------|:--------------------------------------------------------|:----------------------------------|
| basicCredentials         | [AWS Basic Credentials](#aws-kms-basic-credentials)     | Basic credentials configuration   |
| sessionCredentials       | [AWS Session Credentials](#aws-kms-session-credentials) | Session configuration             |

### AWS KMS basic credentials

| key       | type   | description                                                                                                                                                                  |
|:----------|:-------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| accessKey | String | Access Key. For enhanced security, you can use the template `${MY_ENV_VAR}`, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue) |
| secretKey | String | Secret key. For enhanced security, you can use the template `${MY_ENV_VAR}`, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue) |

### AWS KMS session credentials

| key          | type   | description                                                                                                                                                                     |
|:-------------|:-------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| accessKey    | String | Access Key. For enhanced security, you can use the template `${MY_ENV_VAR}`, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue)    |
| secretKey    | String | Secret key. For enhanced security, you can use the template `${MY_ENV_VAR}`, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue)    |
| sessionToken | String | Session token. For enhanced security, you can use the template `${MY_ENV_VAR}`, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue) |

## GCP KMS

| key                               | type   | description                                                                                                                                                                                                               |
|:----------------------------------|:-------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| serviceAccountCredentialsFilePath | String | service account key file in Google Cloud Platform (GCP). For enhanced security, you can use the template `${MY_ENV_VAR}`, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue) |

## Schema Registry

| key               | type   | default | description                                                                                                                                                                                                                                        |
|:------------------|:-------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| host              | String |         | Url of schema registry                                                                                                                                                                                                                             |
| cacheSize         | String | `50`    | This interceptor caches schemas locally so that it doesn't have to query the schema registry                                                                                                                                                       |
| additionalConfigs | map    |         | Additional properties maps to specific security related parameters. For enhanced security, you can use the template `${MY_ENV_VAR}` in `map` values, then define their actual values in the environmental config variables of Gateway. (eg: -e MY_ENV_VAR=someValue) |

See more about schema registry [here](https://www.conduktor.io/blog/what-is-the-schema-registry-and-why-do-you-need-to-use-it/)

## Examples

### Simple Encrypt on Produce

```json
{
   "name": "myEncryptionPlugin",
   "pluginClass": "io.conduktor.gateway.interceptor.EncryptPlugin",
   "priority": 100,
   "config": {
      "topic": ".*",
      "fields": [
         {
            "fieldName": "password",
            "keySecretId": "password-secret",
            "algorithm": {
               "type": "AES_GCM",
               "kms": "IN_MEMORY"
            }
         }
      ]
   }
}
```

### Field level encryption on Produce

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
    "fields": [
      {
        "fieldName": "password",
        "keySecretId": "password-secret",
        "algorithm": {
          "type": "AES_GCM",
          "kms": "IN_MEMORY"
        }
      },
      {
        "fieldName": "visa",
        "keySecretId": "{{record.header.test-header}}-visa-secret-{{record.key}}-{{record.value.username}}-{{record.value.education.account.accountId}}",
        "algorithm": {
          "type": "AES_GCM",
          "kms": "VAULT"
        }
      },
      {
        "fieldName": "education.account.username",
        "keySecretId": "{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
        "algorithm": {
          "type": "AES_GCM",
          "kms": "IN_MEMORY"
        }
      }
    ]
  }
}
```

### Field level encryption on Produce with secured template

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
      },
      "azure": {
        "tokenCredential": {
          "clientId": "${AZURE_CLIENT_ID}",
          "tenantId": "${AZURE_TENANT_ID}",
          "clientSecret": "${AZURE_CLIENT_SECRET}"
        }
      }
    },
    "fields": [
      {
        "fieldName": "password",
        "keySecretId": "password-secret",
        "algorithm": {
          "type": "AES_GCM",
          "kms": "IN_MEMORY"
        }
      },
      {
        "fieldName": "visa",
        "keySecretId": "{{record.header.test-header}}-visa-secret-{{record.key}}-{{record.value.username}}-{{record.value.education.account.accountId}}",
        "algorithm": {
          "type": "AES_GCM",
          "kms": "VAULT"
        }
      },
      {
        "fieldName": "education.account.username",
        "keySecretId": "{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
        "algorithm": {
          "type": "AES_GCM",
          "kms": "IN_MEMORY"
        }
      }
    ]
  }
}
```

### Full message level encryption on Produce

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
    "payload": {
      "keySecretId": "{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
      "algorithm": {
        "type": "AES_GCM",
        "kms": "IN_MEMORY"
      }
    }
  }
}
```

### Full message level encryption on Produce with secured template

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
      },
      "azure": {
        "tokenCredential": {
          "clientId": "${AZURE_CLIENT_ID}",
          "tenantId": "${AZURE_TENANT_ID}",
          "clientSecret": "${AZURE_CLIENT_SECRET}"
        }
      }
    },
    "payload": {
      "keySecretId": "{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
      "algorithm": {
        "type": "AES_GCM",
        "kms": "IN_MEMORY"
      }
    }
  }
}
```

### Encryption on Consume

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
    "fields": [
      {
        "fieldName": "password",
        "keySecretId": "password-secret",
        "algorithm": {
          "type": "AES_GCM",
          "kms": "IN_MEMORY"
        }
      },
      {
        "fieldName": "visa",
        "keySecretId": "vault-kms://{{record.header.test-header}}-visa-secret-{{record.key}}-{{record.value.username}}-{{record.value.education.account.accountId}}",
        "algorithm": {
          "type": "AES_GCM",
          "kms": "VAULT"
        }
      },
      {
        "fieldName": "education.account.username",
        "keySecretId": "{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
        "algorithm": {
          "type": "AES_GCM",
          "kms": "IN_MEMORY"
        }
      }
    ]
  }
}
```

### Encryption on Consume with secured template

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
    "fields": [
      {
        "fieldName": "password",
        "keySecretId": "password-secret",
        "algorithm": {
          "type": "AES_GCM",
          "kms": "IN_MEMORY"
        }
      },
      {
        "fieldName": "visa",
        "keySecretId": "vault-kms://{{record.header.test-header}}-visa-secret-{{record.key}}-{{record.value.username}}-{{record.value.education.account.accountId}}",
        "algorithm": {
          "type": "AES_GCM",
          "kms": "VAULT"
        }
      },
      {
        "fieldName": "education.account.username",
        "keySecretId": "{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
        "algorithm": {
          "type": "AES_GCM",
          "kms": "IN_MEMORY"
        }
      }
    ]
  }
}
```

### Decrypt all fields

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

### Decrypt all fields with secured template

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

### Decrypt specific fields

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
    "fields": [
      "visa",
      "education.account.username"
    ]
  }
}
```

### Decrypt specific fields with secured template

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
    "fields": [
      "visa",
      "education.account.username"
    ]
  }
}
```

### Decrypt full message

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

### Decrypt full message with secured template

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

## Frequently Asked Questions

### Does the interceptor support key rotation?

Key rotation is an important aspect of cryptographic key management. 
However, key rotation is not directly supported by the interceptor. 
Key rotation is typically handled at the KMS level. 
When a key is rotated in the KMS, the interceptor will automatically start using the new key for encryption and decryption.

### Is the KMS called on a per-message basis?

Yes, every time a message is encrypted or decrypted, a new Data Encryption Key (DEK) is generated and encrypted or decrypted with the Key Encryption Key (KEK) from the Key Management Service (KMS). 
This happens on a per-message basis. 
Therefore, the KMS is indeed called on a per-message basis.

### What happens if the interceptor is unable to encrypt the message?

If the interceptor is unable to encrypt the message, it will throw an error and the message will not be sent to the destination. 
This ensures that sensitive data is always encrypted before it is sent to the destination.

### What happens if the interceptor is unable to decrypt the message?

If the interceptor is unable to decrypt the message, the encrypted message will be returned to the client. 
It ensures that sensitive data is not exposed to unauthorized third parties.

### When we talk to the KMS? Do we store the keys in the interceptor?

The interceptor talks to the KMS when it needs to retrieve the encryption or decryption key. 
This happens on a per-message basis. 
We do not store the keys in the interceptor, so the interceptor needs to retrieve the keys from the KMS every time it needs to encrypt or decrypt a message. 
Although this may seem inefficient, it is actually a more secure approach as it ensures that the keys are not exposed to unauthorized third parties.

### Can I use encrypted data as the secretKeyId?

No, you cannot use encrypted data as the secretKeyId. 
Because the value of a field will be replaced with the encrypted value. 
So it is not allowed to use the encryption field as the keyId.

### What is the difference between the Encryption on Produce interceptor and the Encryption on Consume interceptor?

The Encryption on Produce interceptor is used to encrypt data before it is sent to the destination. 
The Encryption on Consume interceptor is used to decrypt data before it is consumed by the end user or application.

