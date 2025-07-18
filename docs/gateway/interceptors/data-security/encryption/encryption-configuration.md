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
| `schemaDataMode`                                                               | String                                           | `preserve_avro` | As of 3.3, you can decide to preserve the inbound message format when it encrypts the data IF the incoming data is Avro, rather than converting the message to JSON (as per current behavior).<br />To convert the record to JSON and break the link to its schema in the backing topic, you can set this field to `convert_json` (default until 3.3). |
| `externalStorage`                                                              | Boolean                                          | `false`         | Choose where to store your encryption settings.<br />`false` - Encryption settings will be stored within message headers.<br />`true` - Encryption settings will be stored in a topic called `_conduktor_gateway_encryption_configs` by default, this can be renamed using the environment variable `GATEWAY_ENCRYPTION_CONFIGS_TOPIC`.                 |
| `kmsConfig`                                                                    | [KMS](#kms-configuration)                        |                 | Configuration of one or multiple KMS.                                                                                                                                                                                                                                                                                                                   |
| `enableAuditLogOnError`                                                        | Boolean                                          | true            | The audit log will be enabled when an error occurs during encryption/decryption                                                                                                                                                                                                                                                                         |
| `compressionType`                                                             | Enum                             | none            | The data is compressed before encryption (only for data configured with full payload encryption). Available values are: `none`, `gzip`, `snappy`, `lz4` or `zstd`.|
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

Any `keySecretId` that doesn't match one of the schemas detailed below will be **rejected** and the encryption operation will **fail**.

If you want to make sure the key is well created in your KMS, you have to (1) [make sure you have configured the connection to the KMS](#kms-configuration) , and (2) use the following format as `keySecretId`:

| KMS       | KMS identifier prefix | Key URI format                                                                                       | Example                                                                                            |
|-----------|----------------------|------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| In-Memory | in-memory-kms://     | `in-memory-kms://<key-id>`                                                                           | `in-memory-kms://my-password-key-id`                                                               |
| Vault     | vault-kms://         | `vault-kms://<vault-host>/transit/keys/<key-id>`                                                     | `vault-kms://vault:8200/transit/keys/password-key-id`                                              |
| Azure     | azure-kms://         | `azure-kms://<key-vault-name>.vault.azure.net/keys/<object-name>/<object-version>`                   | `azure-kms://my-key-vault.vault.azure.net/keys/conduktor-gateway/4ceb7a4d1f3e4738b23bea870ae8745d` |
| AWS       | aws-kms://           | `aws-kms://arn:aws:kms:<region>:<account-id>:key/<key-id>`                                           | `aws-kms://arn:aws:kms:us-east-1:123456789012:key/password-key-id`                                 |
| GCP       | gcp-kms://           | `gcp-kms://projects/<project-id>/locations/<location-id>/keyRings/<key-ring-id>/cryptoKeys/<key-id>` | `gcp-kms://projects/my-project/locations/us-east1/keyRings/my-key-ring/cryptoKeys/password-key-id` |

Note that In-Memory mode is present for testing and development purposes only - keys stored in this manner do not persist between Gateway restarts.

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

### Supported compression types

- `none`
- `gzip`
- `snappy`
- `lz4`
- `zstd`

## Decryption configuration

Now that your fields or payload are encrypted, you can decrypt them using the interceptor `DecryptPlugin`.

| key                      | type                                             | default             | description                                                                                                                                                                                                                      |
|--------------------------|--------------------------------------------------|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `topic`                  | String                                           | `.*`                | Topics matching this regex will have the interceptor applied                                                                                                                                                                     |
| `schemaRegistryConfig`   | [SchemaRegistry](#schema-registry-configuration) |                     | Configuration of your Schema Registry, is needed if you want to decrypt into Avro, JSON or Protobuf schemas.                                                                                                                     |
| `kmsConfig`              | [KMS](#kms-configuration)                        |                     | Configuration of one or multiple KMS                                                                                                                                                                                             |
| `recordValueFields`      | List[String]                                     |                     | **Only for field-level encryption** - List of fields to decrypt in the value. If empty, we decrypt all the encrypted fields.                                                                                                     |
| `recordKeyFields`        | List[String]                                     |                     | **Only for field-level encryption** - List of fields to decrypt in the key. If empty, we decrypt all the encrypted fields.                                                                                                       |
| `recordHeaderFields`     | List[String]                                     |                     | **Only for field-level encryption** - List of headers to decrypt. If empty, we decrypt all the encrypted headers.                                                                                                                |
| `enableAuditLogOnError`  | Boolean                                          | true                | The audit log will be enabled when an error occurs during encryption/decryption                                                                                                                                                  |
| `errorPolicy`            | String                                           | `return_encrypted`  | Determines the action if there is an error during decryption. The options are `return_encrypted` (the encrypted payload is returned to the client) or `fail_fetch` (the client will receive an error for the fetch and no data). **For crypto shredding, the policy should always be `return_encrypted`**, otherwise the consumer will become permanently blocked by messages that have been deliberately been made un-decryptable. |

## Schema Registry configuration

As soon as your records are produced using a schema, you have to configure these properties in your encryption/decryption interceptors after `schemaRegistryConfig` in order to (de)serialize them. Gateway supports Confluent-like and AWS Glue schema registries.

| Key                   | Type   | Default     | Description                                                                                                                                                                                                         |
|-----------------------|--------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`                | string | `CONFLUENT` | The type of schema registry to use: choose `CONFLUENT` (for Confluent-like schema registries including OSS Kafka) or `AWS` for AWS Glue schema registries.                                                      |
| `additionalConfigs`   | map    |             | Additional properties maps to specific security-related parameters. For enhanced security, you can hide the sensitive values using [environment variables as secrets](#use-environment-variables-as-secrets).​ |
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

## Use environment variables as secrets

You probably don't want your secrets to appear in your interceptors. In order to make sure this doesn't happen, you can refer to the environment variables you have set in your Gateway container.

For that, you can simply use the format `${MY_ENV_VAR}`.

We recommend you use this for Schema Registry or Vault secrets, and any other values you'd like to hide in the configuration.


## KMS Configuration

This section is detailing how to configure the different KMS within your encrypt & decrypt interceptors.

| key       | type                        | description                                                                                       |
|-----------|-----------------------------|---------------------------------------------------------------------------------------------------|
| keyTtlMs  | long                        | Key's time-to-live in milliseconds. The default is 1 hour. Disable the cache by setting it to 0.  |
| in-memory | [In-Memory](#in-memory-kms) | In Memory KMS that is not persistent, internal to the Gateway, for demo purposes only.            |
| gateway   | [Gateway](#gateway-kms)     | Key storage managed by Gateway, but with secret management still delegated to an external KMS     |
| vault     | [Vault KMS](#vault-kms)     | [HashiCorp Vault KMS](https://developer.hashicorp.com/vault/docs/secrets/key-management)          |
| azure     | [Azure KMS](#azure-kms)     | [Azure Key Vault](https://azure.microsoft.com/en-us/products/key-vault)                           |
| aws       | [AWS KMS](#aws-kms)         | [AWS KMS](https://docs.aws.amazon.com/kms/)                                                       |
| gcp       | [GCP KMS](#gcp-kms)         | [Google Key Management](https://cloud.google.com/security/products/security-key-management?hl=en) |

### In-Memory KMS

:::warning
This is for demos only and should not be used on production data.
:::

Keys in In-Memory KMS are not persisted, this means that if you do one of the following, you won't be able to decrypt old records, loosing the data.

* Use a gateway cluster with more than a single node
* Or restart the Gateway
* Or change the interceptor configuration


### Gateway KMS

This KMS type is effectively a delegated storage model and is designed to support encryption use cases which generate unique secret Ids per record or even field (typically via the Mustache template support for a secret Id). This technique is used in crypto-shredding type scenarios e.g. encrypting records per user with their own key.  

It provides the option to leverage your KMS for security via a single master key, but efficiently and securely store many per-record level encryption keys (DEKs) in the Gateway managed store. For some architectures this can provide performance and cost savings for encryption use cases which generate a high volume of secret key Ids.

| Key           | Type   | Description                                                                                                                                                                                       |
|---------------|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `masterKeyId` | String | The master key secret Id used to encrypt any keys stored in Gateway managed storage. This is in the same format as the `keySecretId` that's used for encryption and the valid values are the same.  |
| `maxKeys` | Number | The maximum number of secret Id references to be cached in memory for re-use. To avoid creating new encryption keys (DEKs), this needs to be larger than the total number of expected secret Ids. By default, it's the same as `maxKeys` in cache config or 1000,000, if `maxKeys` isn't set. |

The `masterKeyId` is used to secure every key for this configuration, stored by Gateway. [Find out more about the secret key formats](#key-stored-in-kms). You have to also supply a valid configuration for the KMS type referenced by the master key so this can be used.

If this key is dropped from the backing KMS, then all keys stored by Gateway for that master key will become unreadable.

#### Encryption

Here's a sample configuration for the Gateway KMS using a Vault-based master key:

```
"kmsConfig": {
   "gateway": {
      "masterKeyId": "vault-kms://vault:8200/transit/keys/applicants-1-master-key".
      "maxKeys" : 10000000
   },
   "vault": {
      "uri": "http://vault:8200",
      "token": "my-vault-token",
      "version": 1
   }
}
```

This can then be used to encrypt a field using `gateway-kms://` as the secret key type:

```
"recordValue": {
   "fields": [
      {
         "fieldName": "name",
         "keySecretId": "gateway-kms://fieldKeySecret-name-{{record.key}}"
      }
   ]
}
```

When processing a record for the first time using this configuration, Gateway will 
1. generate a DEK to encrypt the field data with
2. turn it into an EDEK by encrypting it with the `masterKeyId` secret from vault 
3. store the EDEK in Gateway storage. 

If a record key was `123456`, the associated EDEK would be stored on a kafka record with the following key:

```
{"algorithm":"AES128_GCM","keyId":"gateway-kms://fieldKeySecret-name-123456","uuid":"<UNIQUE_PER_EDEK_GENERATED>"}
```

Multiple records produced against this config would cause multiple EDEKs to be saved in the Gateway storage (due to the `{{record.key}}` template giving a unique key for each Kafka record key). 

If there are multiple Gateway nodes running, it's also possible for multiple DEKs/EDEKs to be generated for the same record key. Two nodes processing different records with the same record key at the same time could both assume they were generating a DEK/EDEK for the first time. In this scenario, there would be two EDEKs in the Gateway storage with the same `keyId` but they would each have a different `UUID`. For example.

```
{"algorithm":"AES128_GCM","keyId":"gateway-kms://fieldKeySecret-name-123456","uuid":"2cd8125a-b55f-4214-a528-be3c9b47519b"}
{"algorithm":"AES128_GCM","keyId":"gateway-kms://fieldKeySecret-name-123456","uuid":"d8fcccf3-8480-4634-879a-48deed4e0e72"}
```

Nonetheless, there will **only ever be one master key stored in the vault KMS**, which is used to encrypt every DEK.

This feature provides flexibility for your KMS storage and key management setups - and is particularly useful for high volume crypto shredding.


#### Decryption

When using the `gateway-kms` secret key Id type, the decryption configuration used to decrypt the data has to also specify the `masterKeyId`, so that it can securely decrypt the keys stored in the local Gateway storage. 

Here's a sample setup:

```
"config": {
   "topic": "secure-topic",
   "kmsConfig": {
      "gateway": {
         "masterKeyId": "vault-kms://vault:8200/transit/keys/secure-topic-master-key"
      },
      "vault": {
         "uri": "http://vault:8200",
         "token": "my-token-for-vault",
         "version": 1
      }
   }
}
```

#### Crypto Shredding

When using the `gateway-kms` secret key Id type, you can efficiently crypto shred EDEKs in the Gateway storage, so that anyone using the decryption plugin will immediately lose access to the associated encrypted data. 

To do this, scan the Gateway storage Kafka topic (by default, `_conduktor_gateway_encryption_keys`) for every message matching the associated qualified secret Id.

For example, a qualified secretId of `gateway-kms://fieldKeySecret-name-123456` might have the following keys:
```
{"algorithm":"AES128_GCM","keyId":"gateway-kms://fieldKeySecret-name-123456","uuid":"2cd8125a-b55f-4214-a528-be3c9b47519b"}
{"algorithm":"AES128_GCM","keyId":"gateway-kms://fieldKeySecret-name-123456","uuid":"d8fcccf3-8480-4634-879a-48deed4e0e72"}
```

Publishing a message for each of these keys back to the same topic with a value of `null` (i.e. a tombstone) will effectively perform Crypto Shredding.

This process **won't prevent the creation of new keys** if new messages are sent using the same record key;  it only ensures that messages using the crypto shredded keys remain unrecoverable.

### Vault KMS

To set your Vault KMS, include this section in your interceptor config after `vault`:

You can use one of these two authentication methods:

-   Token
-   Username & Password

Make sure you've followed the right method, and that you've provided the correct properties.

For enhanced security, you can hide the sensitive values using [environment variables as secrets](#use-environment-variables-as-secrets).

| key                    | type   | description                                                                                                                                                                                                                                                                                   |
|------------------------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `uri`                  | String | Vault URI.                                                                                                                                                                                                                                                                                    |
| `version`              | String | Version.                                                                                                                                                                                                                                                                                      |
| `namespace`            | String | Namespace.                                                                                                                                                                                                                                                                                    |
| **Managed identity**   |        | Load authentication information from the below environment variables.                                                                                                                                                                                                                         | 
| `VAULT_URI`            |        | Vault server base URI.                                                                                                                                                                                                                                                                        |
| `VAULT_ENGINE_VERSION` |        | Vault KV Secrets Engine version.                                                                                                                                                                                                                                                              |
| `VAULT_NAMESPACE`      |        | Vault namespace.                                                                                                                                                                                                                                                                              |
| `type`                 | String | **Required for all types of VaultKMSConfig.** Determines the type of authentication to use. <br/>Supported types: <br/>-`TOKEN`<br/>-`USERNAME_PASSWORD`<br/>-`GITHUB`<br/>-`LDAP`<br/>-`APP_ROLE`<br/>-`KUBERNETES`<br/>-`GCP`<br/>-`AWS_EC2_PKCS7`<br/>-`AWS_EC2`<br/>-`AWS_IAM`<br/>-`JWT` |

#### Vault Authentication Types
| Key                                | Type   | Description                                                            |
|------------------------------------|--------|------------------------------------------------------------------------|
| **Token Authentication**           |        | Use Token Authentication.                                              |
| `type`                             | String | **Must be `TOKEN`.** Indicates the type of authentication.             |
| `token`                            | String | Security token for accessing Vault.                                    |
| _**Managed identity**_             |        | Load authentication information from the below environment variables.  |
| `VAULT_AUTH_TYPE`                  | String | **Must be `TOKEN`.** Indicates the type of authentication.             |
| `VAULT_TOKEN`                      |        | Token to use for accessing Vault.                                      |
| **Username & Password**            |        | Use Username & Password Authentication.                                |
| `type`                             | String | **Must be `USERNAME_PASSWORD`.** Indicates the type of authentication. |
| `username`                         | String | Username for accessing Vault.                                          |
| `password`                         | String | Password for accessing Vault.                                          |
| `userpassAuthMount`                | String | (Optional) Mount path for the userpass auth method.                    |
| _**Managed identity**_             |        | Load authentication information from the below environment variables.  |
| `VAULT_AUTH_TYPE`                  | String | **Must be `USERNAME_PASSWORD`.** Indicates the type of authentication. |
| `VAULT_USERNAME`                   |        | Username for accessing Vault.                                          |
| `VAULT_PASSWORD`                   |        | Password for accessing Vault.                                          |
| `VAULT_AUTH_MOUNT`                 |        | (Optional) Mount path for the userpass auth method.                    |
| **GitHub Authentication**          |        | Use GitHub Token Authentication.                                       |
| `type`                             | String | **Must be `GITHUB`.** Indicates the type of authentication.            |
| `token`                            | String | GitHub personal access token.                                          |
| `githubAuthMount`                  | String | (Optional) Mount path for the GitHub auth method.                      |
| _**Managed identity**_             |        | Load authentication information from the below environment variables.  |
| `VAULT_AUTH_TYPE`                  | String | **Must be `GITHUB`.** Indicates the type of authentication.            |
| `VAULT_GITHUB_TOKEN`               |        | GitHub token for accessing Vault.                                      |
| `VAULT_AUTH_MOUNT`                 |        | (Optional) Mount path for the GitHub auth method.                      |
| **LDAP Authentication**            |        | Use LDAP Authentication.                                               |
| `type`                             | String | **Must be `LDAP`.** Indicates the type of authentication.              |
| `username`                         | String | LDAP username.                                                         |
| `password`                         | String | LDAP password.                                                         |
| `ldapAuthMount`                    | String | (Optional) Mount path for the LDAP auth method.                        |
| _**Managed identity**_             |        | Load authentication information from the below environment variables.  |
| `VAULT_AUTH_TYPE`                  | String | **Must be `LDAP`.** Indicates the type of authentication.              |
| `VAULT_LDAP_USERNAME`              |        | LDAP username.                                                         |
| `VAULT_LDAP_PASSWORD`              |        | LDAP password.                                                         |
| `VAULT_AUTH_MOUNT`                 |        | (Optional) Mount path for the LDAP auth method.                        |
| **AppRole Authentication**         |        | Use AppRole Authentication.                                            |
| `type`                             | String | **Must be `APP_ROLE`.** Indicates the type of authentication.          |
| `roleId`                           | String | Role ID for AppRole authentication.                                    |
| `secretId`                         | String | Secret ID for AppRole authentication.                                  |
| `path`                             | String | (Optional) Mount path for the AppRole auth method.                     |
| _**Managed identity**_             |        | Load authentication information from the below environment variables.  |
| `VAULT_AUTH_TYPE`                  | String | **Must be `APP_ROLE`.** Indicates the type of authentication.          |
| `VAULT_APP_ROLE_ID`                |        | Role ID for AppRole authentication.                                    |
| `VAULT_APP_SECRET_ID`              |        | Secret ID for AppRole authentication.                                  |
| `VAULT_APP_PATH`                   |        | (Optional) Mount path for the AppRole auth method.                     |
| **Kubernetes Authentication**      |        | Use Kubernetes Authentication.                                         |
| `type`                             | String | **Must be `KUBERNETES`.** Indicates the type of authentication.        |
| `role`                             | String | Kubernetes role.                                                       |
| `jwt`                              | String | Kubernetes JWT token.                                                  |
| _**Managed identity**_             |        | Load authentication information from the below environment variables.  |
| `VAULT_AUTH_TYPE`                  | String | **Must be `KUBERNETES`.** Indicates the type of authentication.        |
| `VAULT_KUBERNETES_ROLE`            |        | Kubernetes role.                                                       |
| `VAULT_KUBERNETES_JWT`             |        | Kubernetes JWT token.                                                  |
| **GCP Authentication**             |        | Use Google Cloud Platform Authentication.                              |
| `type`                             | String | **Must be `GCP`.** Indicates the type of authentication.               |
| `role`                             | String | GCP role for authentication.                                           |
| `jwt`                              | String | JWT token issued by Google Cloud Platform.                             |
| _**Managed identity**_             |        | Load authentication information from the below environment variables.  |
| `VAULT_AUTH_TYPE`                  | String | **Must be `GCP`.** Indicates the type of authentication.               |
| `VAULT_GCP_ROLE`                   |        | GCP role for authentication.                                           |
| `VAULT_GCP_JWT`                    |        | JWT token for accessing Vault.                                         |
| **AWS EC2 Authentication (PKCS7)** |        | Use AWS EC2 PKCS7 Authentication.                                      |
| `type`                             | String | **Must be `AWS_EC2_PKCS7`.** Indicates the type of authentication.     |
| `role`                             | String | AWS role for EC2 authentication.                                       |
| `pkcs7`                            | String | PKCS7 identity document.                                               |
| `nonce`                            | String | (Optional) Nonce value for EC2 authentication.                         |
| _**Managed identity**_             |        | Load authentication information from the below environment variables.  |
| `VAULT_AUTH_TYPE`                  | String | **Must be `AWS_EC2_PKCS7`.** Indicates the type of authentication.     |
| `VAULT_AWS_ROLE`                   |        | AWS role for EC2 authentication.                                       |
| `VAULT_AWS_PKCS7`                  |        | PKCS7 identity document.                                               |
| `VAULT_AWS_NONCE`                  |        | (Optional) Nonce value for EC2 authentication.                         |
| `VAULT_AUTH_MOUNT`                 |        | (Optional) Mount path for the AWS EC2 PKCS7 auth method.               |
| **AWS EC2 Authentication**         |        | Use AWS EC2 Identity Authentication.                                   |
| `type`                             | String | **Must be `AWS_EC2`.** Indicates the type of authentication.           |
| `role`                             | String | AWS role for EC2 authentication.                                       |
| `identity`                         | String | AWS identity document.                                                 |
| `signature`                        | String | AWS signature for authentication.                                      |
| `nonce`                            | String | Nonce value for EC2 authentication.                                    |
| _**Managed identity**_             |        | Load authentication information from the below environment variables.  |
| `VAULT_AUTH_TYPE`                  | String | **Must be `AWS_EC2`.** Indicates the type of authentication.           |
| `VAULT_AWS_ROLE`                   |        | AWS role for EC2 authentication.                                       |
| `VAULT_AWS_IDENTITY`               |        | AWS identity document.                                                 |
| `VAULT_AWS_SIGNATURE`              |        | AWS signature for authentication.                                      |
| `VAULT_AWS_NONCE`                  |        | (Optional) Nonce value for EC2 authentication.                         |
| `VAULT_AUTH_MOUNT`                 |        | (Optional) Mount path for the AWS EC2 auth method.                     |
| **AWS IAM Authentication**         |        | Use AWS IAM Authentication.                                            |
| `type`                             | String | **Must be `AWS_IAM`.** Indicates the type of authentication.           |
| `role`                             | String | AWS role for IAM authentication.                                       |
| `iamRequestUrl`                    | String | IAM request URL for authentication.                                    |
| `iamRequestBody`                   | String | IAM request body for authentication.                                   |
| `iamRequestHeaders`                | String | IAM request headers for authentication.                                |
| _**Managed identity**_             |        | Load authentication information from the below environment variables.  |
| `VAULT_AUTH_TYPE`                  | String | **Must be `AWS_IAM`.** Indicates the type of authentication.           |
| `VAULT_AWS_ROLE`                   |        | AWS role for IAM authentication.                                       |
| `VAULT_AWS_IAM_REQUEST_URL`        |        | IAM request URL for authentication.                                    |
| `VAULT_AWS_IAM_REQUEST_BODY`       |        | IAM request body for authentication.                                   |
| `VAULT_AWS_IAM_REQUEST_HEADERS`    |        | IAM request headers for authentication.                                |
| **JWT Authentication**             |        | Use JWT Authentication.                                                |
| `type`                             | String | **Must be `JWT`.** Indicates the type of authentication.               |
| `jwt`                              | String | JWT token for authentication.                                          |
| `provider`                         | String | JWT provider for authentication.                                       |
| `role`                             | String | JWT role for authentication.                                           |
| _**Managed identity**_             |        | Load authentication information from the below environment variables.  |
| `VAULT_AUTH_TYPE`                  | String | **Must be `JWT`.** Indicates the type of authentication.               |
| `VAULT_JWT`                        |        | JWT token for authentication.                                          |
| `VAULT_JWT_PROVIDER`               |        | JWT provider for authentication.                                       |

Example:
```json
{
  "type": "APP_ROLE",
  "uri": "http://vault.example.com",
  "version": "1",
  "roleId": "my-role-id",
  "secretId": "my-secret-id"
}
```

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
