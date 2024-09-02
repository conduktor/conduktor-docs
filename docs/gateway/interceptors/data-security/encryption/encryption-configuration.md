---
version: 3.0.0
title: Encryption - Configuration
description: Encrypt data within your Kafka records to ensure the data cannot be read by third parties.
parent: data-security
license: enterprise
---

# Encryption & Decryption Configurations

## Introduction

This document details all the configuration properties we support in our encryption and decryption interceptors.

You'll also find a few tips, like the [Secret Key Templates](#secret-key-templates) or the [Secrets in Environment Variables](#use-environment-variables-as-secrets).

Please find some examples of interceptors on the [Encryption Snippets](/gateway/interceptors/data-security/encryption/encryption-snippets) page.

### Encryption Types

#### *When to encrypt?*

Gateway can encrypt your data on produce, or on consume:

- **On Produce** - The data will be encrypted before it gets to the broker, i.e. **encrypted before it enters Kafka**. The Gateway will intercept the records, encrypt them following your definition within the interceptor configuration, and then pass it to Kafka.
- **On Consume** - The **original data is already in Kafka**. The Gateway will encrypt the original data as the consumer consumes it.

#### *What to encrypt?*

In either case, you should decide whether you want to encrypt the full payload, or only select fields.

- **Full payload** - You want to encrypt the key, the value, or the headers of your records, which can be done on structured or unstructured messages.
- **Field-level** - Define which fields in your payload need to be encrypted. You can choose the fields with a schema-based solution, or not. The choice will depend on how you produce the messages, and what you want to encrypt:
    - **Schema-based** - Fields are encrypted based on tags you include in the record schema itself.
    - **List-based** - Fields are encrypted based on the list you specify in the interceptor configuration.
        - **Schema Payload** - The record has been produced using a schema (Avro, JSON, Protobuf).
        - **JSON Payload** - The record is a simple JSON payload.

## Encryption Configuration - *How to encrypt?*

The properties detailed in this section work for the following plugins:

|              |         On Produce         |           On Consume            |
|:------------:|:--------------------------:|:-------------------------------:|
|  List-based  |      `EncryptPlugin`       |      `FetchEncryptPlugin`       |
| Schema-based | `EncryptSchemaBasedPlugin` | `FetchEncryptSchemaBasedPlugin` |

Both schema-based and list-based encryption plugins have their configuration, but some properties are common to both of them.

| key                                                                            | type                                             | default         | description                                                                                                                                                                                                                                                                                                                                             |
|--------------------------------------------------------------------------------|--------------------------------------------------|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Common Properties**                                                          |                                                  |                 |                                                                                                                                                                                                                                                                                                                                                         |
| `topic`                                                                        | String                                           | `.*`            | Topics matching this regex will have the interceptor applied.                                                                                                                                                                                                                                                                                           |
| `schemaRegistryConfig`                                                         | [SchemaRegistry](#schema-registry-configuration) |                 | Configuration of your Schema Registry, is needed if you want to encrypt data produced using Avro, JSON or Protobuf schemas.                                                                                                                                                                                                                             |
| `schemaDataMode`                                                               | String                                           | `preserve_avro` | As of 3.3, you can decide to preserve the inbound message format when it encrypts the data IF the incoming data is Avro, rather than converting the message to JSON (as per current behaviour).<br />To convert the record to JSON and break the link to its schema in the backing topic, you can set this field to `convert_json` (default until 3.3). |
| `externalStorage`                                                              | Boolean                                          | `false`         | Choose where to store your encryption settings.<br />`false` - Encryption settings will be stored within message headers.<br />`true` - Encryption settings will be stored in a topic called `_conduktor_gateway_encryption_configs` by default, this can be renamed using the environment variable `GATEWAY_ENCRYPTION_CONFIGS_TOPIC`.                 |
| `kmsConfig`                                                                    | [KMS](#kms-configuration)                        |                 | Configuration of one or multiple KMS.                                                                                                                                                                                                                                                                                                                   |
| [**List-Based Properties**](#list-based-encryption)                            |                                                  |                 |                                                                                                                                                                                                                                                                                                                                                         |
| `recordValue`                                                                  | [Value & Key Encryption](#value--key-encryption) |                 | Configuration to encrypt the record value.                                                                                                                                                                                                                                                                                                              |
| `recordKey`                                                                    | [Value & Key Encryption](#value--key-encryption) |                 | Configuration to encrypt the record key.                                                                                                                                                                                                                                                                                                                |
| `recordHeader`                                                                 | [Headers Encryption](#headers-encryption)        |                 | Configuration to encrypt the record headers.                                                                                                                                                                                                                                                                                                            |
| [**Schema-Based Properties**](#schema-based-encryption---schema-configuration) |                                                  |                 |                                                                                                                                                                                                                                                                                                                                                         |
| `defaultKeySecretId`                                                           | [Secret Key Template](#secret-key-templates)     |                 | Default `keySecretId` to use if none is set in the schema. It must be a unique identifier for the secret key, and can be a template for crypto shredding use cases.                                                                                                                                                                                     |
| `defaultAlgorithm`                                                             | [Algorithm](#supported-algorithms)               | `AES128_GCM`    | Default `algorithm` to use if no algorithm is set in the schema.                                                                                                                                                                                                                                                                                        |
| `tags`                                                                         | List[String]                                     |                 | List of tags to search for in the schema to encrypt the specified fields.                                                                                                                                                                                                                                                                               |
| `namespace`                                                                    | String                                           | `conduktor.`    | Prefix of custom schema constraints for encryption.                                                                                                                                                                                                                                                                                                     |

### List-Based Encryption

To define what you want to encrypt, the following options are expanded upon in their respective sections below:

-   Value & Key:
    -   Encrypt a set of fields
    -   Encrypt the full payload
-   Headers:
    -   Encrypt a set of fields
    -   Encrypt the full payload
    -   Encrypt a set of headers that match a regex

#### Value & Key Encryption

Set the following properties below for `recordValue` (for value encryption) and/or `recordKey` (for key encryption).

| key                         | type                                         | default      | description                                                                                                                                                   |
|-----------------------------|----------------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Full-Payload Encryption** |                                              |              |                                                                                                                                                               |
| `payload.keySecretId`       | [Secret Key Template](#secret-key-templates) |              | Secret key, can be a template for crypto shredding use cases.                                                                                                 |
| `payload.algorithm`         | [Algorithm](#supported-algorithms)           | `AES128_GCM` | Algorithm to leverage.                                                                                                                                        |
| **Field-Level Encryption**  |                                              |              |                                                                                                                                                               |
| `fields[].fieldName`        | String                                       |              | Name of the field to encrypt. It can be a nested structure with a dot `.` such as `education.account.username` or `banks[0].accountNo`.                       |
| `fields[].keySecretId`      | [Secret Key Template](#secret-key-templates) | `AES128_GCM` | Unique identifier for the secret key. You can store this key in your KMS by using the KMS key templates. It can be a template for crypto shredding use cases. |
| `fields[].algorithm`        | [Algorithm](#supported-algorithms)           |              | Algorithm to use to encrypt this field.                                                                                                                       |

To see an example, please refer to the [Encryption Examples](/gateway/interceptors/data-security/encryption/encryption-snippets) page.

#### Headers Encryption

Set the following properties below for `recordHeader`.

| key                         | type                                         | default      | description                                                                                                                             |
|-----------------------------|----------------------------------------------|--------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| **Full-Payload Encryption** |                                              |              | Configuration to encrypt the full payload.                                                                                              |
| `payload.keySecretId`       | [Secret Key Template](#secret-key-templates) |              | Secret key, can be a template for crypto shredding use cases.                                                                           |
| `payload.algorithm`         | [Algorithm](#supported-algorithms)           | `AES128_GCM` | Algorithm to leverage.                                                                                                                  |
| **Field-Level Encryption**  |                                              |              |                                                                                                                                         |
| `fields[].fieldName`        | String                                       |              | Name of the field to encrypt. It can be a nested structure with a dot `.` such as `education.account.username` or `banks[0].accountNo`. |
| `fields[].keySecretId`      | [Secret Key Template](#secret-key-templates) | `AES128_GCM` | Unique identifier for the secret key. It can be a template for crypto shredding use cases.                                              |
| `fields[].algorithm`        | [Algorithm](#supported-algorithms)           |              |                                                                                                                                         |
| **Headers Encryption**      |                                              |              |                                                                                                                                         |
| `header`                    | String                                       |              | Headers that match this regex will be encrypted.<br />_Warning: it can encrypt all headers including gateway headers_                   |

To see an example, please refer to the [Encryption Examples](/gateway/interceptors/data-security/encryption/encryption-snippets) page.

### Schema-Based Encryption - Schema Configuration

In order to encrypt your data, you can set a few constraints in your schema. These constraints are detailed below, assuming you're using the default `namespace` value which is `conduktor.`​. If you have changed the `namespace` value in the interceptor configuration, please change the key name in your schema accordingly.

| key                     | type                                         | default      | description                                                                                                                                                                                                                                                                              |
|-------------------------|----------------------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `conduktor.keySecretId` | [Secret Key Template](#secret-key-templates) |              | Unique identifier for the secret key, and can be a template for crypto shredding use cases.                                                                                                                                                                                              |
| `conduktor.algorithm`   | [Algorithm](#supported-algorithms)           | `AES128_GCM` | Algorithm to use to encrypt this field.                                                                                                                                                                                                                                                  |
| `conduktor.tags`        | List[String]                                 |              | Fields tagged with a matching tag from your interceptor will be encrypted using the `keySecretId` and `algorithm` specified in the schema.<br />If these are not defined in the schema, the `defaultKeySecretId` and `defaultAlgorithm` from the interceptor configuration will be used. |

If your field meets one of these 3 conditions, then it will be encrypted:

1.  This field has a `keySecretId` set in the schema
2.  This field has a `algorithm` set in the schema
3.  This field has a set of `tags` set in the schema, and one of them is part of the `tags` list specified in the interceptors.

To see an example, please refer to the [Encryption Examples](/gateway/interceptors/data-security/encryption/encryption-snippets) page.

### Secret Key templates

#### Mustache Template

In all the encryption plugins, you can use mustache templates for the `keySecretId`. That way, your secret keys will be dynamic.

:::warning
The value of a field will be replaced with the encrypted value. So it is not allowed to use the encryption field as the keyId.
:::

| Pattern                                       | Replaced by                                                                                                                                                                                                                  |
|-----------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `{{record.topic}}`                            | Name of the topic you're encrypting the data of.                                                                                                                                                                             |
| `{{record.key}}`                              | Key of the encrypted record.                                                                                                                                                                                                 |
| `{{record.value.someValueFieldName}}`         | Value of the field called `someValueFieldName`<br />If you're doing field-level encryption, please ensure that `someValueFieldName` is not included in the fields to encrypt. Otherwise, you will not be able to decrypt it. |
| `{{record.value.someList[0].someValueField}}` | Value of the field called `someValueFieldName`, in the first element of the list `someList`                                                                                                                                  |
| `{{record.header.someHeader}}`                | Value of the header called `someHeader`                                                                                                                                                                                      |

Here is a record example:
```
# Header
someHeader=myHeader

# Key
myKey

# Value
{
  "someValueFieldName": "I",
  "someList": [{ "someValueField": "love" }, { "someValueField": "Kafka" }]
}
```

If you want, you can set something like `"keySecretId": "{{record.topic}}-{{record.header.someHeader}}-{{record.key}}"`. This will create an encryption key called `myTopic-myHeader-myKey` in memory.

If you want this key to be stored in your Vault KMS for instance, you can set: `"keySecretId": "vault-kms://vault:8200/transit/keys/{{record.topic}}-{{record.header.someHeader}}-{{record.key}}"`.

#### Key Stored in KMS

By default, any `keySecretId` that doesn't match one of the schemas detailed below, will be stored in-memory.

If you want to make sure the key is well created in your KMS, you have to (1) [make sure you have configured the connection to the KMS](#kms-configuration) , and (2) use the following format as `keySecretId`:

| KMS                 | KMS identifier prefix | Key URI format                                                                                       | Example                                                                                            |
|---------------------|-----------------------|------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| In-Memory (default) |                       | Any string that isn't prefixed by a KMS identifier prefix                                            | `my-password-key-id`                                                                               |
| Vault               | vault-kms://          | `vault-kms://<vault-host>/transit/keys/<key-id>`                                                     | `vault-kms://vault:8200/transit/keys/password-key-id`                                              |
| Azure               | azure-kms://          | `azure-kms://<key-vault-name>.vault.azure.net/keys/<object-name>/<object-version>`                   | `azure-kms://my-key-vault.vault.azure.net/keys/conduktor-gateway/4ceb7a4d1f3e4738b23bea870ae8745d` |
| AWS                 | aws-kms://            | `aws-kms://arn:aws:kms:<region>:<account-id>:key/<key-id>`                                           | `aws-kms://arn:aws:kms:us-east-1:123456789012:key/password-key-id`                                 |
| GCP                 | gcp-kms://            | `gcp-kms://projects/<project-id>/locations/<location-id>/keyRings/<key-ring-id>/cryptoKeys/<key-id>` | `gcp-kms://projects/my-project/locations/us-east1/keyRings/my-key-ring/cryptoKeys/password-key-id` |

:::warning
Keys are string that starts with a letter, followed by a combination of letters, underscores (_), hyphens (-), and numbers. Special characters are not allowed. It also works with the upper [mustache pattern](#mustache-template).
:::

### Supported Algorithms

-   `AES128_GCM` (default)
-   `AES128_EAX`
-   `AES256_EAX`
-   `AES128_CTR_HMAC_SHA256`
-   `AES256_CTR_HMAC_SHA256`
-   `CHACHA20_POLY1305`
-   `XCHACHA20_POLY1305`
-   `AES256_GCM`

## Decryption Configuration - *How to decrypt?*

Now that your fields or payload are encrypted, you can decrypt them using the interceptor `DecryptPlugin`.

| key                    | type                                             | default | description                                                                                                                  |
|------------------------|--------------------------------------------------|---------|------------------------------------------------------------------------------------------------------------------------------|
| `topic`                | String                                           | `.*`    | Topics matching this regex will have the interceptor applied                                                                 |
| `schemaRegistryConfig` | [SchemaRegistry](#schema-registry-configuration) |         | Configuration of your Schema Registry, is needed if you want to decrypt into Avro, JSON or Protobuf schemas.                 |
| `kmsConfig`            | [KMS](#kms-configuration)                        |         | Configuration of one or multiple KMS                                                                                         |
| `recordValueFields`    | List[String]                                     |         | **Only for field-level encryption** - List of fields to decrypt in the value. If empty, we decrypt all the encrypted fields. |
| `recordKeyFields`      | List[String]                                     |         | **Only for field-level encryption** - List of fields to decrypt in the key. If empty, we decrypt all the encrypted fields.   |
| `recordHeaderFields`   | List[String]                                     |         | **Only for field-level encryption** - List of headers to decrypt. If empty, we decrypt all the encrypted headers.            |

## Schema Registry Configuration

As soon as your records are produced using a schema, you must configure these properties in your encryption or decryption interceptors below `schemaRegistryConfig` to be able to (de)serialize them.

| key                 | type   | default | description                                                                                                                                                                                                    |
|---------------------|--------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `host`              | string |         | URL of your schema registry.                                                                                                                                                                                   |
| `cacheSize`         | string | `50`    | Number of schemas that can be cached locally by this interceptor so that it doesn't have to query the schema registry every time.                                                                              |
| `additionalConfigs` | map    |         | Additional properties maps to specific security-related parameters. For enhanced security, you can hide the sensitive values using [environment variables as secrets](#use-environment-variables-as-secrets).​ |

## Use Environment Variables as Secrets

You probably don't want your secrets to appear in your interceptors. In order to make sure this doesn't happen, you can refer to the environment variables you have set in your Gateway container.

For that, you can simply use the format `${MY_ENV_VAR}`.

We recommend you use this for Schema Registry or Vault secrets, and any other values you'd like to hide in the configuration.


## KMS Configuration

This section is detailing how to configure the different KMS within your encrypt & decrypt interceptors.

| key       | type                    | description                                                                                       |
|-----------|-------------------------|---------------------------------------------------------------------------------------------------|
| keyTtlMs  | long                    | Key's time-to-live in milliseconds. The default is 1 hour. Disable the cache by setting it to 0.  |
| in-memory | [In-Memory](#in-memory) | Default KMS that is not persistent, internal to the Gateway.                                      |
| vault     | [Vault KMS](#vault-kms) | [HashiCorp Vault KMS](https://developer.hashicorp.com/vault/docs/secrets/key-management)          |
| azure     | [Azure KMS](#azure-kms) | [Azure Key Vault](https://azure.microsoft.com/en-us/products/key-vault)                           |
| aws       | [AWS KMS](#aws-kms)     | [AWS KMS](https://docs.aws.amazon.com/kms/)                                                       |
| gcp       | [GCP KMS](#gcp-kms)     | [Google Key Management](https://cloud.google.com/security/products/security-key-management?hl=en) |

### In-Memory

This is the default key storage we use, if no external one is set. This is for demos only and should not be used on production data.

The risk of using In-Memory KMS is that the key will not persist. This means that if you restart the Gateway, or change the interceptor configuration, you won't be able to decrypt old records anymore. **You should not use this default KMS in production.**

### Vault KMS

To set your Vault KMS, include this section in your interceptor config, below `vault`.

You can use one of these two authentication methods:

-   Token
-   Username & Password

Make sure you've followed the right method, and that you've provided the correct properties.

For enhanced security, you can hide the sensitive values using [environment variables as secrets](#use-environment-variables-as-secrets).

| key                        | type   | description                                                                   |
|----------------------------|--------|-------------------------------------------------------------------------------|
| `uri`                      | String | Vault URI.                                                                    |
| `version`                  | String | Version.                                                                      |
| **Token**                  |        |                                                                               |
| `token`                    | String | Security token.                                                               |
| **Username & Password**    |        |                                                                               |
| `username`                 | String | Username.                                                                     |
| `password`                 | String | Password.                                                                     |
| **Managed identity**       |        | Load authentication information from the below environment variables.         |
| `VAULT_ENGINE_VERSION_ENV` |        | Vault KV Secrets Engine version.                                              |
| `VAULT_URI_ENV`            |        | Vault server base URI.                                                        |
| `VAULT_TOKEN_ENV`          |        | Token to use for accessing Vault.                                             |
| `VAULT_USERNAME_ENV`       |        | Username for accessing Vault (used with `VAULT_PASSWORD_ENV` to build Token). |
| `VAULT_PASSWORD_ENV`       |        | Password for accessing Vault (used with `VAULT_USERNAME_ENV` to build Token). |

### Azure KMS

To set your Azure KMS, include this section in your interceptor config, below `azure`.

You can use one of these two authentication methods:

-   Token
-   Username & Password

Make sure you've followed the right method, and that you've provided the correct properties.

For enhanced security, you can hide the sensitive values using [environment variables as secrets](#use-environment-variables-as-secrets).

| key                                                                                                                                 | type   | description                                                                                                                                   |
|-------------------------------------------------------------------------------------------------------------------------------------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| **Token**                                                                                                                           |        |                                                                                                                                               |
| `tokenCredential.clientId`                                                                                                          | string | Client ID.                                                                                                                                    |
| `tokenCredential.tenantId`                                                                                                          | string | Tenant ID.                                                                                                                                    |
| `tokenCredential.clientSecret`                                                                                                      | string | Client secret.                                                                                                                                |
| **Username & Password**                                                                                                             |        |                                                                                                                                               |
| `usernamePasswordCredential.clientId`                                                                                               | string | Client ID.                                                                                                                                    |
| `usernamePasswordCredential.tenantId`                                                                                               | string | Tenant ID.                                                                                                                                    |
| `usernamePasswordCredential.username`                                                                                               | string | Username.                                                                                                                                     |
| `usernamePasswordCredential.password`                                                                                               | string | Password.                                                                                                                                     |
| [**Managed Identity**](https://learn.microsoft.com/en-us/java/api/com.azure.identity.defaultazurecredential?view=azure-java-stable) |        | Configure the KMS from the context, and not using variables. This will be overwritten if a specific KMS is configured within the interceptor. |

### AWS KMS

To set your AWS KMS, include this section in your interceptor config, below `aws`.

You can use one of these two authentication methods:

-   Basic authentication
-   Session

Make sure you've followed the right method, and that you've provided the correct properties.

For enhanced security, you can hide the sensitive values using [environment variables as secrets](#use-environment-variables-as-secrets).

| key                                                                                                                      | type   | description                                                                                                                                   |
|--------------------------------------------------------------------------------------------------------------------------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| **Basic Authentication**                                                                                                 |        |                                                                                                                                               |
| `basicCredentials.accessKey`                                                                                             | String | Access Key.                                                                                                                                   |
| `basicCredentials.secretKey`                                                                                             | String | Secret Key.                                                                                                                                   |
| **Session**                                                                                                              |        |                                                                                                                                               |
| `sessionCredentials.accessKey`                                                                                           | String | Access Key.                                                                                                                                   |
| `sessionCredentials.secretKey`                                                                                           | String | Secret Key.                                                                                                                                   |
| `sessionCredentials.sessionToken`                                                                                        | String | Session Token.                                                                                                                                |
| [**Managed Identity**](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html#credentials-default) |        | Configure the KMS from the context, and not using variables. This will be overwritten if a specific KMS is configured within the interceptor. |

### GCP KMS

To set your GCP (Google Cloud Platform) KMS, include this section in your interceptor config, below `gcp`.

You must first configure the [service account key file](https://cloud.google.com/iam/docs/keys-create-delete#creating).

For enhanced security, you can hide the sensitive values using [environment variables as secrets](#use-environment-variables-as-secrets).

| key                                                                                                                                | type   | description                                                                                                                                   |
|------------------------------------------------------------------------------------------------------------------------------------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `serviceAccountCredentialsFilePath`                                                                                                | String | Service account key file in GCP.                                                                                                              |
| [**Managed Identity**](https://github.com/googleapis/google-auth-library-java/blob/main/README.md#application-default-credentials) |        | Configure the KMS from the context, and not using variables. This will be overwritten if a specific KMS is configured within the interceptor. |
