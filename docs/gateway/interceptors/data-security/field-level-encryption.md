---
version: 3.0.0
title: Encryption
description: Encrypt data within your Kafka records to ensure the data cannot be read by third parties.
parent: data-security
license: enterprise
---

## Table of Contents

1. [Introduction](#introduction)
2. [Encryption and Decryption Processes](#encryption-and-decryption-processes)
3. [Key Management](#key-management)
4. [Configuration](#configuration)
5. [Examples](#examples)
6. [FAQ](#faq)

## Introduction

This interceptor is designed to provide a robust and flexible solution for encrypting data within your Kafka records.
The primary purpose of this feature is to ensure that sensitive data cannot be read by unauthorized third parties,
thereby enhancing the security of your data both in transit and at rest.

The interceptor supports both field-level and full message encryption. Field-level encryption allows you to encrypt
specific fields within your Kafka records, such as passwords or personal user information. This is particularly useful
when only certain parts of the message are sensitive. Full message encryption, on the other hand, encrypts the entire
Kafka record. This is useful when the entire message needs to be secured.

The encryption process is handled seamlessly by the interceptor, which identifies the data to be encrypted, retrieves the encryption key from the Key Management Service (KMS), encrypts the data, and then sends the encrypted message to its destination. 
The interceptor supports various encryption algorithms and KMS options, providing flexibility to suit your specific requirements.

The interceptor also supports decryption of the encrypted data. This can be done for all fields, specific fields, or the
entire message, depending on your configuration. The decryption process is similar to the encryption process, with the
interceptor identifying the data to be decrypted, retrieving the decryption key from the KMS, decrypting the data, and
then making the decrypted message ready for consumption.

This interceptor is designed to be easy to configure and use, with various examples and detailed configuration options
provided in this document. Whether you need to secure specific fields or entire messages, this interceptor provides a
comprehensive solution for your data encryption needs in Kafka.

## Encryption and Decryption Processes

### How to Encrypt Data

1. Data Identification: The interceptor identifies the data that needs to be encrypted. This could be the entire message
   or specific fields within the message, based on your configuration. For example, if you have specified password as a
   field to be encrypted in the fields configuration, the interceptor will identify this field in the incoming Kafka
   record.
2. Key Retrieval: The interceptor retrieves the encryption key from the Key Management Service (KMS). The KMS could be
   Vault, Azure, AWS, GCP, or an in-memory service, depending on your configuration. The interceptor uses the
   keySecretId specified in the configuration to retrieve the correct key.
3. Encryption: The interceptor encrypts the identified data using the retrieved key and the specified encryption
   algorithm. The encrypted data replaces the original data in the message.
4. Transmission: Encrypted data is converted to json format and sent as a string to the destination.

### How to Decrypt Data

1. Data Identification: The interceptor identifies the data that needs to be decrypted. This could be the entire message
   or specific fields within the message, based on your configuration. The interceptor uses the fields configuration to
   identify which fields need to be decrypted.
2. Key Retrieval: The interceptor retrieves the decryption key from the KMS. This is usually the same key that was used
   for encryption. The interceptor uses the keySecretId specified in the configuration to retrieve the correct key.
3. Decryption: The interceptor decrypts the identified data using the retrieved key and the specified encryption
   algorithm. The decrypted data replaces the encrypted data in the message.
4. Consumption: The decrypted message is then ready for consumption by the end user or application. The interceptor
   ensures that the decrypted data is correctly formatted and compatible with the Kafka record structure.

Please note that the encryption and decryption process is transparent to the end user or application. The interceptor
handles all the operations, allowing you to focus on your core business logic.

## Key Management

### Definitions

| Term | Definition                                                                                                                                       |
|:-----|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| KMS  | Key Management Service                                                                                                                           |
| KEK  | Key Encryption Key, used to encrypt the DEK (Data Encryption Key) and stored in the KMS. Importantly, The KEK is never known to the interceptor. |
| DEK  | Data Encryption Key, used to encrypt the data and was generated by the interceptor.                                                              |
| EDEK | Encrypted Data Encryption Key, the DEK encrypted by the KEK.                                                                                     |

### Envelope Encryption

The interceptor uses the envelope `encryption technique` to encrypt the data. This technique uses two keys, a `KEK` and
a `DEK`. The `KEK` is used to encrypt the `DEK`, which is then used to encrypt the data. The `KEK` is stored in
the `KMS`, while the `DEK` is generated by the interceptor. The `EDEK` is stored alongside the encrypted data then sent
to the destination.

When the data needs to be decrypted, if the `DEK` is not already known to the interceptor is takes the `EDEK` that's
stored with the encrypted data and sends it to the `KMS` to retrieve the `DEK`. The interceptor then uses the `DEK` to
decrypt the data.

To reduce the call to the `KMS`, the interceptor caches the `DEK` in memory. The time to live (TTL) of the cache is
configurable, and the interceptor will call the `KMS` to decrypt the `EDEK` if the `DEK` is not in the cache.

With caching enabled, the interceptor will be able to use old versions of key for encryption when that key is rotated in
the `KMS`. Configuring a low TTL will ensure that the interceptor will use the latest version of the key, but it is a
trade-off between performance (increased calls to `KMS`) and security (using the latest key version).

# Configuration

## Encryption configuration

### Field level encryption configuration

| key                  | type                                              | default | description                                                                                                                                                                                                          |
|:---------------------|:--------------------------------------------------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| topic                | String                                            | `.*`    | Topics that match this regex will have the interceptor applied                                                                                                                                                       |
| schemaRegistryConfig | [SchemaRegistry](#schema-registry)                |         | Schema Registry config                                                                                                                                                                                               |
| recordValue          | [RecordEncryptionConfig](#recordEncryptionConfig) |         | Configuration of encryption record value                                                                                                                                                                             |
| recordKey            | [RecordEncryptionConfig](#recordEncryptionConfig) |         | Configuration of encryption record key                                                                                                                                                                               |
| recordHeader         | [HeaderEncryptionConfig](#headerEncryptionConfig) |         | Configuration of encryption record headers                                                                                                                                                                           |
| externalStorage      | Boolean                                           | false   |  Choose where to store your encryption settings. When set to `false`, encryption settings will be stored within message headers. When set to `true`, encryption settings will be stored in a topic that’s configured at deployment time. |
| kmsConfig            | [KMS](#kms)                                       |         | Define multiple KMS                                                                                                                                                                                                  |

### Schema Based field level encryption configuration

| key                  | type                                      | default      | description                                                                                                    |
|:---------------------|:------------------------------------------|:-------------|:---------------------------------------------------------------------------------------------------------------|
| topic                | String                                    | `.*`         | Topics that match this regex will have the interceptor applied                                                 |
| schemaRegistryConfig | [SchemaRegistry](#schema-registry)        |              | Schema Registry config                                                                                         |
| kmsConfig            | [KMS](#kms)                               |              | Define multiple KMS                                                                                            |                                                                                           
| defaultKeySecretId   | [SecretKeyTemplate](#secret-key-template) |              | default keySecretId is a unique identifier for the secret key, can be a template for crypto shredding usecases |
| defaultAlgorithm     | [Algorithm](#algorithm)                   | AES128_GCM   | default algorithm to leverage                                                                                  |
| tags                 | List[String]                              |              |                                                                                                                |
| namespace            | String                                    | `conduktor.` | Prefix of custom schema constrains for encryption                                                              |

We'll use these custom schema fields for schema based field level encryption, assuming we're using
default namespace (`conduktor.`)

| key                   | type                                      | default    | description                                                                                                                   |
|:----------------------|:------------------------------------------|------------|:------------------------------------------------------------------------------------------------------------------------------|
| conduktor.keySecretId | [SecretKeyTemplate](#secret-key-template) |            | keySecretId is a unique identifier for the secret key, can be a template for crypto shredding usecases                        |
| conduktor.algorithm   | [Algorithm](#algorithm)                   | AES128_GCM | Algorithm                                                                                                                     |
| conduktor.tags        | List[String]                              |            | Field would be encrypted with defaultSecret, defaultAlgorithm when tags has element with is in the interceptor configuration. |

See more about schema based field level encryption [here](#schema-based-rules)

### RecordEncryptionConfig

Use `fields` for field level encryption, use `payload` when encrypting the full message.

| key     | type                   | description                                    |
|:--------|:-----------------------|:-----------------------------------------------|
| fields  | List [Field](#fields) | List of fields to be encrypted                 |
| payload | [Payload](#payload)    | Configuration of encrypting the entire payload |

### HeaderEncryptionConfig

Use `fields` for field level encryption, use `payload` when encrypting the full message.

| key     | type                   | description                                                                                                                           |
|:--------|:-----------------------|:--------------------------------------------------------------------------------------------------------------------------------------|
| header  | String                 | Headers that match this regex will have the interceptor applied.<br/> _Warning: it can encrypt all headers including gateway headers_ |
| fields  | List [Field](#fields) | List of fields to be encrypted                                                                                                        |
| payload | [Payload](#payload)    | Configuration of full payload encryption                                                                                              |

## Decryption configuration

| key                  | type                               | default | description                                                                                                   |
|:---------------------|:-----------------------------------|:--------|:--------------------------------------------------------------------------------------------------------------|
| topic                | String                             | `.*`    | Topics that match this regex will have the interceptor applied                                                |
| schemaRegistryConfig | [SchemaRegistry](#schema-registry) |         | Schema Registry config                                                                                        |
| recordValueFields    | List[String]                       |         | Only for field level encryption. A list of field names for decryption, an empty list would decrypt all fields |
| recordKeyFields      | List[String]                       |         | Only for field level encryption. A list of field names for decryption, an empty list would decrypt all fields |
| recordHeaderFields   | List[String]                       |         | Only for field level encryption. A list of field names for decryption, an empty list would decrypt all fields |
| kmsConfig            | [KMS](#kms)                        |         | Define multiple KMS                                                                                           |

### Fields

For **field level** encryption include this section in your interceptor config.
Encryption interceptor allows encoding to each field (currently only text fields are supported):


| key         | type                                      | default    | description                                                                                                                             |
|:------------|:------------------------------------------|------------|:----------------------------------------------------------------------------------------------------------------------------------------|
| fieldName   | String                                    |            | field name to be encrypted/decrypted. Can be nested structure with dot `.` such as `education.account.username` or `banks[0].accountNo` |
| keySecretId | [SecretKeyTemplate](#secret-key-template) | AES128_GCM | keySecretId is a unique identifier for the secret key, can be a template for crypto shredding usecases                                  |
| algorithm   | [Algorithm](#algorithm)                   |            | Algorithm to leverage                                                                                                                   |

### Payload

For **full message** encryption include this section in your interceptor config, instead of the above `fields`.  
You can choose to ignore or have a blank `fieldName`.
Supported formats are:
* avro/protobuf/json schemas
* string as json
* raw string
* integer

| key         | type                                      | default    | description                                                  |
|:------------|:------------------------------------------|------------|:-------------------------------------------------------------|
| keySecretId | [SecretKeyTemplate](#secret-key-template) |            | Secret key, can be a template for crypto shredding use cases |
| algorithm   | [Algorithm](#algorithm)                   | AES128_GCM | Algorithm to leverage                                        |

### Secret Key template

Secret keys can be dynamic, leveraging mustache patterns like:

- `{{record.topic}}` for inject record topic
- `{{record.key}}` for inject record key
- `{{record.value.someValueFieldName}}` for inject record field value from
  field `someValueFieldName`, `someValueFieldName`, must not be one of field names going to be encrypted/decrypted
- `{{record.value.someList[0].someValueField}}` for inject record field value from field `someValueFieldName` at the
  first element of the list `someList`
- `{{record.value.someList[*].someValueField}}` for inject record field value from all fields `someValueFieldName` of
  the list `someList`
- `{{record.header.someHeaderKey}}` for inject header value with header key is `someHeaderKey`

> **_Note:_** the value of a field will be replaced with the encrypted value. So it is not allowed to use the encryption
> field as the keyId.

If you want to use KMS to manage the secret key, you can use the following format to specify the keySecretId:

| KMS       | KMS identifier prefix | Key URI format                                                                                       | Example                                                                                            |
|:----------|-----------------------|:-----------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------|
| Vault     | vault-kms://          | `vault-kms://<vault-host>/transit/keys/<key-id>`                                                     | `vault-kms://http://vault:8200/transit/keys/password-key-id`                                       |
| Azure     | azure-kms://          | `azure-kms://<key-vault-name>.vault.azure.net/keys/<key-id>`                                         | `azure-kms://my-key-vault.vault.azure.net/keys/password-key-id`                                    |
| AWS       | aws-kms://            | `aws-kms://arn:aws:kms:<region>:<account-id>:key/<key-id>`                                           | `aws-kms://arn:aws:kms:us-east-1:123456789012:key/password-key-id`                                 |
| GCP       | gcp-kms://            | `gcp-kms://projects/<project-id>/locations/<location-id>/keyRings/<key-ring-id>/cryptoKeys/<key-id>` | `gcp-kms://projects/my-project/locations/us-east1/keyRings/my-key-ring/cryptoKeys/password-key-id` |
| In-Memory |                       | any string is permitted as the secret key id                                                         |                                                                                                    |

> **_Note:_**  If you want to use KMS(s) other than In-Memory KMS, you must ensure that the interceptor is configured with the correct KMS configuration.
>
> Keys are string that starts with a letter, followed by a combination of letters, underscores (\_), hyphens (-),
and numbers. Special characters are not allowed. Also, it can work with the upper mustache pattern.

### Algorithm Config

| key  | type                    | description     |
|:-----|:------------------------|:----------------|
| type | [Algorithm](#algorithm) | Algorithm       |
| kms  | [KMS](#kms)             | KMS to levarege |

### Algorithm

- AES128_GCM (default)
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

| key      | type                    | description                                                                                     |
|:---------|:------------------------|:------------------------------------------------------------------------------------------------|
| keyTtlMs | long                    | The key's time to live in milliseconds. Default is 1 hour, disable the cache by setting it to 0 |
| vault    | [Vault KMS](#vault-kms) | Vault kms configuration                                                                         |
| azure    | [Azure KMS](#azure-kms) | Azure kms configuration                                                                         |
| aws      | [AWS KMS](#aws-kms)     | AWS kms configuration                                                                           |
| gcp      | [GCP KMS](#gcp-kms)     | GCP kms configuration                                                                           |

### Managed Identity

By default, all KMS default on managed identity. They will be overwritten if a specific KMS is configured.

| KMS   | Manged Identity                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|:------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AWS   | See [more](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html#credentials-default)                                                                                                                                                                                                                                                                                                                                                           |
| GCP   | See [more](https://github.com/googleapis/google-auth-library-java/blob/main/README.md#application-default-credentials)                                                                                                                                                                                                                                                                                                                                                  |
| AZURE | See [more](https://learn.microsoft.com/en-us/java/api/com.azure.identity.defaultazurecredential?view=azure-java-stable)                                                                                                                                                                                                                                                                                                                                       |
| VAULT | Load authentication information from env <ul><li>`VAULT_ENGINE_VERSION_ENV`: Vault KV Secrets Engine version</li><li>`VAULT_URI_ENV`: Vault server base URI</li><li>`VAULT_TOKEN_ENV`: token to use for accessing Vault</li><li>`VAULT_USERNAME_ENV`: username to use for accessing Vault (used with `VAULT_PASSWORD_ENV` to build Token)</li><li>`VAULT_PASSWORD_ENV`: password to use for accessing Vault (used with `VAULT_USERNAME_ENV` to build Token)</li></ul> |

## Vault KMS

| key      | type   | description                                                                                                                                                                                |
|:---------|:-------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| uri      | String | Vault uri                                                                                                                                                                                  |
| token    | String | Token. For enhanced security, you can use the template `${MY_ENV_VAR}` where `MY_ENV_VAR` is an environment variable   |
| username | String | Username. For enhanced security, you can use the template `${MY_ENV_VAR}` where `MY_ENV_VAR` is an environment variable|
| password | String | Password. For enhanced security, you can use the template `${MY_ENV_VAR}` where `MY_ENV_VAR` is an environment variable|
| version  | String | version                                                                                                                                                                                    |

> **_Note:_** You can select either Token auth method (using a token) or Userpass auth method (using a username and
> password) to access the Vault KMS. Ensure that you follow the appropriate method and provide the required configuration
> parameters accordingly.

## Azure KMS

| key                        | type                                                                         | description         |
|:---------------------------|:-----------------------------------------------------------------------------|:--------------------|
| tokenCredential            | [AzureTokenCredentials](#azure-kms-token-credentials)                        | Token configuration |
| usernamePasswordCredential | [AzureUsernamePasswordCredentials](#azure-kms-username-password-credentials) | Token configuration |

### Azure KMS token credentials

| key          | type   | description                                                                                                               |
|:-------------|:-------|:--------------------------------------------------------------------------------------------------------------------------|
| clientId     | string | Client id. For enhanced security, you can use the template `${MY_ENV_VAR}` where `MY_ENV_VAR` is an environment variable    |     
| tenantId     | string | Tenant id. For enhanced security, you can use the template `${MY_ENV_VAR}` where `MY_ENV_VAR` is an environment variable    |     
| clientSecret | string | Client Secret. For enhanced security, you can use the template `${MY_ENV_VAR}` where `MY_ENV_VAR` is an environment variable| 

### Azure KMS username password credentials

| key      | type   | description                                                                                                           |
|:---------|:-------|:----------------------------------------------------------------------------------------------------------------------|
| clientId | string | Client Id. For enhanced security, you can use the template `${MY_ENV_VAR}` where `MY_ENV_VAR` is an environment variable|
| tenantId | string | Tenant Id. For enhanced security, you can use the template `${MY_ENV_VAR}` where `MY_ENV_VAR` is an environment variable|
| username | string | Username. For enhanced security, you can use the template `${MY_ENV_VAR}` where `MY_ENV_VAR` is an environment variable |
| password | string | Password. For enhanced security, you can use the template `${MY_ENV_VAR}` where `MY_ENV_VAR` is an environment variable |

## AWS KMS

| key                | type                                                  | description                     |
|:-------------------|:------------------------------------------------------|:--------------------------------|
| basicCredentials   | [AWSBasicCredentials](#aws-kms-basic-credentials)     | Basic credentials configuration |
| sessionCredentials | [AWSSessionCredentials](#aws-kms-session-credentials) | Session configuration           |

### AWS KMS basic credentials

| key       | type   | description                                                                                                            |
|:----------|:-------|:-----------------------------------------------------------------------------------------------------------------------|
| accessKey | String | Access Key. For enhanced security, you can use the template `${MY_ENV_VAR}` where `MY_ENV_VAR` is an environment variable|
| secretKey | String | Secret key. For enhanced security, you can use the template `${MY_ENV_VAR}` where `MY_ENV_VAR` is an environment variable|

### AWS KMS session credentials

| key          | type   | description                                                                                                               |
|:-------------|:-------|:--------------------------------------------------------------------------------------------------------------------------|
| accessKey    | String | Access Key. For enhanced security, you can use the template `${MY_ENV_VAR}` where `MY_ENV_VAR` is an environment variable   |
| secretKey    | String | Secret key. For enhanced security, you can use the template `${MY_ENV_VAR}` where `MY_ENV_VAR` is an environment variable   |
| sessionToken | String | Session token. For enhanced security, you can use the template `${MY_ENV_VAR}` where `MY_ENV_VAR` is an environment variable|

## GCP KMS

| key                               | type   | description                                                                                                                                                                                                                               |
|:----------------------------------|:-------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| serviceAccountCredentialsFilePath | String | service account key file in Google Cloud Platform (GCP). For enhanced security, you can use the template `${MY_ENV_VAR}` where `MY_ENV_VAR` is an environment variable|

## Schema Registry

| key               | type   | default | description                                                                                                                                                                                                                                                          |
|:------------------|:-------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| host              | string |         | Url of schema registry                                                                                                                                                                                                                                               |
| cacheSize         | string | `50`    | This interceptor caches schemas locally so that it doesn't have to query the schema registry                                                                                                                                                                         |
| additionalConfigs | map    |         | Additional properties maps to specific security related parameters. For enhanced security, you can use the template `${MY_ENV_VAR}` in `map` values where `MY_ENV_VAR` is an environment variable|

See more about schema
registry [here](https://www.conduktor.io/blog/what-is-the-schema-registry-and-why-do-you-need-to-use-it/)

## Schema Based Rules

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

## Examples

### Simple Encrypt on Produce

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
    "recordValue": {
      "fields": [
        {
          "fieldName": "password",
          "keySecretId": "password-secret",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "visa",
          "keySecretId": "{{record.header.test-header}}-visa-secret-{{record.key}}-{{record.value.username}}-{{record.value.education.account.accountId}}",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "education.account.username",
          "keySecretId": "{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
          "algorithm": "AES128_GCM"
        }
      ]
    }
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
    "recordValue": {
      "fields": [
        {
          "fieldName": "password",
          "keySecretId": "password-secret",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "visa",
          "keySecretId": "{{record.header.test-header}}-visa-secret-{{record.key}}-{{record.value.username}}-{{record.value.education.account.accountId}}",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "education.account.username",
          "keySecretId": "{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
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
      },
      "azure": {
        "tokenCredential": {
          "clientId": "azure_client_id",
          "tenantId": "azure_tenant_id",
          "clientSecret": "azure_client_secret"
        }
      }
    },
    "defaultKeySecretId": "myDefaultKeySecret",
    "defaultAlgorithm": "AES128_EAX",
    "tags": ["PII", "ENCRYPTION"],
    "namespace": "conduktor."
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
    "recordValue": {
      "payload": {
        "keySecretId": "{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
        "algorithm": "AES128_GCM"
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
    "recordValue": {
      "payload": {
        "keySecretId": "{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
        "algorithm": "AES128_GCM"
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
    "recordValue": {
      "fields": [
        {
          "fieldName": "password",
          "keySecretId": "password-secret",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "visa",
          "keySecretId": "vault-kms://{{record.header.test-header}}-visa-secret-{{record.key}}-{{record.value.username}}-{{record.value.education.account.accountId}}",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "education.account.username",
          "keySecretId": "{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
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
      },
      "azure": {
        "tokenCredential": {
          "clientId": "azure_client_id",
          "tenantId": "azure_tenant_id",
          "clientSecret": "azure_client_secret"
        }
      }
    },
    "defaultKeySecretId": "myDefaultKeySecret",
    "defaultAlgorithm": "AES128_EAX",
    "tags": ["PII", "ENCRYPTION"],
    "namespace": "conduktor."
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
    "recordValue": {
      "fields": [
        {
          "fieldName": "password",
          "keySecretId": "password-secret",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "visa",
          "keySecretId": "vault-kms://{{record.header.test-header}}-visa-secret-{{record.key}}-{{record.value.username}}-{{record.value.education.account.accountId}}",
          "algorithm": "AES128_GCM"
        },
        {
          "fieldName": "education.account.username",
          "keySecretId": "{{record.header.test-header}}-secret-key-account-username-{{record.topic}}",
          "algorithm": "AES128_GCM"
        }
      ]
    }
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

Key rotation is an important aspect of cryptographic key management. However, key rotation is not directly supported by
the interceptor. Key rotation is typically handled at the KMS level. When a key is rotated in the KMS, the interceptor
will automatically start using the new key for encryption and decryption.

### Is the KMS called on a per-message basis?

It depends on the configuration. If the interceptor is configured to cache the keys, it will only call the KMS when the
key is not found in the cache. If the interceptor is not configured to cache the keys, it will call the KMS on a
per-message basis. See the [Key Management](#key-management) section for more details.

### What happens if the interceptor is unable to encrypt the message?

If the interceptor is unable to encrypt the message, it will throw an error and the message will not be sent to the
destination. This ensures that sensitive data is always encrypted before it is sent to the destination.

### What happens if the interceptor is unable to decrypt the message?

If the interceptor is unable to decrypt the message, the encrypted message will be returned to the client. It ensures
that sensitive data is not exposed to unauthorized third parties.

### When we talk to the KMS? Do we store the keys in the interceptor?

The interceptor will cache the keys in memory. The time to live (TTL) of the cache is configurable, and the interceptor
will call the KMS to decrypt the key if it is not found in the cache. See the [Key Management](#key-management) section
for more details.

### Can I use encrypted data as the keySecretId?

No, you cannot use encrypted data as the keySecretId. Because the value of a field will be replaced with the encrypted value. So it is not allowed to use the encryption field as the keyId.

### What is the difference between the Encryption on Produce interceptor and the Encryption on Consume interceptor?

The Encryption on Produce interceptor is used to encrypt data before it is sent to the destination. The Encryption on
Consume interceptor is used to decrypt data before it is consumed by the end user or application.
