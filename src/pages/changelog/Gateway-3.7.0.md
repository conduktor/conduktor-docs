---
date: 2025-03-20
title: Gateway 3.7.0
description: docker pull conduktor/conduktor-gateway:3.7.0
solutions: gateway
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Breaking changes

#### New backing topic required for Gateway

The [local KMS feature](#preview-feature-gateway-local-kms) introduced in this release requires a new backing topic to store the keys.

When you upgrade to Gateway 3.7.0, a new topic `_conduktor_gateway_encryption_keys` will be created.

To change this default topic name, use the `GATEWAY_ENCRYPTION_KEYS_TOPIC` variable.

[Find out more about environment variables](https://docs.conduktor.io/gateway/configuration/env-variables/#topics-names).

#### Separator for super users 
Super users in Gateway (specified in the `GATEWAY_SUPER_USERS` environment variable) are now separated by a semicolon `;` instead of a comma `,`. 

This change is to allow super users identified with mTLS using their full DN form (`CN=writeuser,OU=Unknown,O=Unknown,L=Unknown,ST=Unknown,C=Unknown`), and makes Gateway aligned with the Kafka configuration.
:::info
This change doesn't affect super users specified in virtual clusters, as they are specified using the YAML array.
:::

#### Deprecating V1 APIs
V1 APIs are now deprecated in favor of the V2 APIs introduced in Gateway 3.3.0 in September 2024.  
If you are using the Conduktor CLI to operate the Gateway, you are not impacted.
Check the following link to understand which APIs are deprecated: [Gateway API](https://developers.conduktor.io/?product=gateway&version=3.6.1&gatewayApiVersion=v1).
**We plan to remove the V1 APIs from the Gateway in 3 releases: Gateway 3.10.0**.  
If you are using the V1 APIs, please migrate to the V2 APIs as soon as possible.  
If you are heavily invested in V1 APIs and need more time to transition, please let us know.

### Preview feature: Gateway local KMS

This release adds a preview feature 'gateway' KMS type for the encryption plugins provided in Gateway. This new KMS type is effectively a delegated storage model, and is designed to support encryption use cases which generate unique secret ids per record or even field (typically via the mustache template support for a secret id). It provides the option to leverage your KMS for security via a single master key, but efficiently and securely store many per-record level keys in the Gateway managed store. For some architectures this can provide performance and cost savings for encryption use cases which genearte a high volume of secret key ids.


:::warning[Preview functionality]
This feature is currently in **preview mode** and will be available soon. We recommend that you **don't use it in the production workloads**.
:::


The keys stored by Gateway are all encrypted themselves via a configured master key externally held in your KMS - and as such are also secure as they are useless without access to the external KMS.

#### Encryption

A new KMS type `gateway-kms` is available for this feature. E.g. below is the encryption config for the Gateway-based KMS, backed by the master key in an external Vault KMS:

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

:::info
For this feature to work, the external KMS (Vault in the above example) has to also be configured.
:::

The new `gateway-kms://` can be used in any mode of encryption: full payload, field level or schema based. 

For example, the snippet below encrypts a field using `gateway-kms://` as the type for the field secret key:

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


That will generate a specific key for this field and encrypt it, then store it in Gateway storage (under `fieldKeySecret-name-{{record.key}}`). The stored key is also encrypted for security using `masterKeyId` secret in Vault. 

#### Decryption

When using the `gateway-kms` secret key ID type, the decryption configuration has to also specify the `masterKeyId` so that it can securely decrypt the keys stored in the local Gateway storage. Here's a sample setup:
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

:::info
This functionality might be removed or altered in future releases.
:::


### Feature changes
- Add support for AWS Glue Schema Registry
- Change `Virtual Cluster` APIs to allow `.` in the name
- Improve error reporting when validating interceptor configuration

### Bug fixes
- Add `aws-java-sdk-sts` dependency to allow assume role profiles when using AWS KMS
- Add `jcl-over-slf4j` dependency to see logs from AWS SDK
