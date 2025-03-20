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

This release adds a preview feature 'local' KMS type for the encryption plugins provided in gateway. This fetaure still ultimately delegates encryption to an external KMS, but securely stores the keys used for indivual record or field level encryption in a Kafka topic managed by the Gateway.

This feature is designed to support encryption use cases which generate unique secret ids per record or even field (typically via the mustache template support for a secret id), and allows you to leverage your KMS for security but efficiently store the many keys this type of configuration will generate in Gateway managed storage.

The keys stored by gateway are all encrypted themselves via a configured master key externally held in your KMS - and as such are also secure as they are useless without access to the external KMS.

A new KMS type `gateway-kms` is available for use for this feature. E.g. below is the config for the Gaterway based KMS, backed by an external Vault KMS for the actual encryption:

```
"kmsConfig": {
   "gateway": {
      "masterKeyId": "vault-kms://vault:8200/transit/keys/applicants-1-master-key"
   },
   "vault": {
      "uri": "http://vault:8200",
      "token": "my-vault-token",
      "version": 1
   }
}
```

Note that for this feature to work, the external KMS must also be configured (Vault in the example above).

This can then be used to encrypt a field, using `gateway-kms://` as the type for the field secret key:

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




### Feature changes
- Add support for AWS Glue Schema Registry
- Change `Virtual Cluster` APIs to allow `.` in the name
- Improve error reporting when validating interceptor configuration

### Bug fixes
- Add `aws-java-sdk-sts` dependency to allow assume role profiles when using AWS KMS
- Add `jcl-over-slf4j` dependency to see logs from AWS SDK
