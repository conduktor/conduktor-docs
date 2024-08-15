---
date: 2024-05-07
title: Hotfix for Gateway 3.0.2
description: docker pull conduktor/conduktor-gateway:3.0.2
solutions: gateway
tags: fix
---

Submit your feedback to us via our [public roadmap](https://product.conduktor.help/?utm_source=changelog&utm_medium=webpage&utm_campaign=).

Visit our [Get Started docs](https://docs.conduktor.io/gateway/?utm_source=changelog&utm_medium=webpage&utm_campaign=) page to learn more and how to try our latest version of Conduktor or [chat with the team](https://www.conduktor.io/contact/sales/?utm_source=changelog&utm_medium=webpage&utm_campaign=data_quality_24).

`docker pull conduktor/conduktor-gateway:3.0.2`  

## General fixes 🔨

- Fixed a race condition when closing connections (i.e. when Gateway detects a broker is removed from the cluster) that was causing restarts/timeouts
- Fix duplicated key exception when rebuilding fetch request with duplicated topics
- FIX NPE when handling expired ApiVersions requests
- Added a check to validate schema registry connection and provide more meaningful errors for schema-based encryption
- Added a check against `defaultAlgorithm` used in the encryption interceptor to ensure it's a valid enum value, and avoid overriding with defaults
- Fixed an issue with `externalStorage` set to `true` in the encryption interceptor that was failing to store headers in a separate internal topic
- Ensure that if the encryption algorithm is changed, a new entry appears in the internal topic used to store headers
- Default namespace is now applied properly on schema-based encryption
- Added support encryption/decryption of AVRO `bytes` and `enums` types
