---
date: 2025-04-18
title: Gateway 3.8.1
description: docker pull conduktor/conduktor-gateway:3.8.1
solutions: gateway
tags: fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Conduktor Shield](#conduktor-shield)
   - [Optional compression before encryption when using full payload encryption](#optional-compression-before-encryption-when-using-full-payload-encryption)
- [Bug fixes](#bug-fixes)

### Conduktor Shield

#### Optional compression before encryption when using full payload encryption

Kafka supports compression out of the box, but with limited effect when the data is already encrypted. In order to improve this when the encryption interceptor is configured Gateway now supports compressing full payload data before it is encrypted.

This new functionality is not enabled by default. You can enable it by setting the new `compressionType` entry in the encryption interceptor configuration to one of 'gzip', 'snappy', 'lz4' or 'zstd'. If full payload encryption is configured for headers, record keys or record values the respective data will now be compressed before it is encrypted.

[Find out more about encryption configuration](https://docs.conduktor.io/gateway/interceptors/data-security/encryption/encryption-configuration/#encryption-configuration---how-to-encrypt)

### Bug fixes

- When using the alter topic policy interceptor, allow updating only a subset of the enforced configurations.
- Correctly camel case capitalise upsertResult properties in APIV2 responses