---
date: TBD
title: Gateway 3.7.0
description: docker pull conduktor/conduktor-gateway:3.7.0
solutions: gateway
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Breaking Changes 💣

#### Breaking change: separator for superusers 
Superusers in Gateway (specified in the `GATEWAY_SUPER_USERS` environment variable) are now separated by a semicolon `;` instead of a comma `,`. 
This change is to allow superusers identified with mTLS using their full DN form (`CN=writeuser,OU=Unknown,O=Unknown,L=Unknown,ST=Unknown,C=Unknown`), 
and makes Gateway aligned with the Kafka configuration.
Note: This change does not affect the superusers specified in virtual clusters, as they are specified using a YAML array.

### New Features

#### Gateway Native Crypto Shredding (PREVIEW)

This release previews enhancements to the key management capabilities of encryption/decryption interceptors that enable Gateway native crypto shredding use cases.

A new optional `gateway` connection object on each encryption/decryption interceptor KMS configuration allows a single master key to be set. All encrypted data encryption keys (EDEKs) are then stored in a new Kafka backed KV store instead of the associated message headers. This change makes it possible to securely and efficiently delete specific EDEKs and enables cost effective crypto shredding use cases natively with Gateway.

* Reference documentation: [Gateway KMS](/gateway/interceptors/data-security/encryption/encryption-configuration#gateway-KMS)
* Example configuration snippets:
  * [Crypto Shreddable Field level encryption on Produce](/gateway/interceptors/data-security/encryption/encryption-snippets#crypto-shreddable-field-level-encryption-on-produce)
  * [Decryption with support for Crypto Shreddable EDEKs](/gateway/interceptors/data-security/encryption/encryption-snippets#decryption-with-support-for-crypto-shreddable-edeks)

When this feature is enabled EDEKs are stored in a new topic called `_conduktor_gateway_encryption_keys`. This can be overriden by setting the `GATEWAY_ENCRYPTION_KEYS_TOPIC` environment variable.

This preview feature is not ready for production use. 
* When more than one Gateway node is deployed it is possible for a "Lost Update" to cause **data loss** through EDEKs being overwritten.
* The interceptor does not gracefully handle missing EDEKs.

### Feature changes
- Add support for AWS Glue Schema Registry
- Change `Virtual Cluster` APIs to allow `.` in the name
- Improve error reporting when validating interceptor configuration

### Bug fixes
- Add `aws-java-sdk-sts` dependency to allow assume role profiles when using AWS kms
- Add `jcl-over-slf4j` dependency to see logs from AWS SDK