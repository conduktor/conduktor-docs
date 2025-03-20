---
date: 2025-03-20
title: Gateway 3.7.0
description: docker pull conduktor/conduktor-gateway:3.7.0
solutions: gateway
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Breaking changes

#### Breaking change: separator for super users 
Super users in Gateway (specified in the `GATEWAY_SUPER_USERS` environment variable) are now separated by a semicolon `;` instead of a comma `,`. 

This change is to allow super users identified with mTLS using their full DN form (`CN=writeuser,OU=Unknown,O=Unknown,L=Unknown,ST=Unknown,C=Unknown`), and makes Gateway aligned with the Kafka configuration.
:::info
This change doesn't affect super users specified in virtual clusters, as they are specified using the YAML array.
:::

### Preview Feature: Gateway Local KMS

This release adds a preview feature 'local' KMS type for the encryption plugins provided in gateway. This new KMS type is effectively a delegated storage model, and is designed to support encryption use cases which generate unique secret ids per record or even field (typically via the mustache template support for a secret id). It allows you to leverage your KMS for security via a single master key, but efficiently and securely store many per-record keys this type of configuration will generate in Gateway managed storage.

:::info
_Preview Feature_ - this feature is currently in preview mode and will be fully available soon. While we make every effort to ensure correct operation, during preview this feature is not recommended for production workloads. 
:::

The keys stored by gateway are all encrypted themselves via a configured master key externally held in your KMS - and as such are also secure as they are useless without access to the external KMS.

#### Encryption

A new KMS type `gateway-kms` is available for use for this feature. E.g. below is the encryption config for the Gaterway based KMS, backed by an external Vault KMS for the actual encryption:

```
"kmsConfig": {
   "gateway": {
      "masterKeyId": "vault-kms://vault:8200/transit/keys/secure-topic-master-key"
   },
   "vault": {
      "uri": "http://vault:8200",
      "token": "my-vault-token",
      "version": 1
   }
}
```

Note that for this feature to work, the external KMS must also be configured (Vault in the example above).

The new `gateway-kms://` can be used in any mode of encryption - full payload, field level or schema based. For example the below snippet encrypts a field, using `gateway-kms://` as the type for the field secret key:

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


This would generate a specific key for this field and encrypt it - and then store this key in the gateway storage (under the key `fieldKeySecret-name-{{record.key}}`). The key stored is also encrypted for security - and the secret in Vault under the `masterKeyId` is used for this.

#### Decryption

When using the `gateway-kms` secret key id type, the decryption configuration used to decrypt the data must also specify the `masterKeyId`, so that it can securely decrypt the keys stored in the local gateway storage. An example setup is shown below:

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

In future releases we may remove or alter this requirement, as part of the final work to move this new KMS storage type out of preview.


### Feature changes
- Add support for AWS Glue Schema Registry
- Change `Virtual Cluster` APIs to allow `.` in the name
- Improve error reporting when validating interceptor configuration

### Bug fixes
- Add `aws-java-sdk-sts` dependency to allow assume role profiles when using AWS KMS
- Add `jcl-over-slf4j` dependency to see logs from AWS SDK
