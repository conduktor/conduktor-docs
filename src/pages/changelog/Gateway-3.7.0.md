---
date: TBD
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

### Feature changes
- Add support for AWS Glue Schema Registry
- Change `Virtual Cluster` APIs to allow `.` in the name
- Improve error reporting when validating interceptor configuration

### Bug fixes
- Add `aws-java-sdk-sts` dependency to allow assume role profiles when using AWS KMS
- Add `jcl-over-slf4j` dependency to see logs from AWS SDK