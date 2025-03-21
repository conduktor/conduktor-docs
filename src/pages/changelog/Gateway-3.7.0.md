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
Check the following link to understand which APIs are deprecated: [Gateway API Doc](https://developers.conduktor.io/?product=gateway&version=3.6.1&gatewayApiVersion=v1).
**We plan to remove the V1 APIs from the Gateway in three releases time, in Gateway 3.10.0**.  
If you are using the V1 APIs, please migrate to the V2 APIs as soon as possible.  
If you need support with this migration, please [let us know](https://support.conduktor.io/hc/en-gb/requests/new?ticket_form_id=17438363566609).


### Preview feature: Cost-Effective Crypto Shredding with Gateway KMS

This release introduces a a preview feature that significantly reduces the cost and complexity of implementing crypto shredding at scale. The new 'gateway' KMS type allows you to manage granular encryption keys for individual users or records without the prohibitive costs of storing each key in AWS KMS (which costs approximately $1 per key).

With this feature, you can maintain regulatory compliance and honor user deletion requests more efficiently by:

1. Storing only a single master key in your external KMS
1. Securely managing thousands of individual encryption keys in Gateway's internal key store
1. Deleting specific user keys when needed, rendering their data permanently inaccessible

This approach is particularly valuable for organizations that need to implement crypto shredding across large user bases or high-volume data sets, offering both substantial cost savings and improved performance compared to managing individual keys directly in AWS KMS.  

The keys stored by Gateway are all encrypted themselves via a configured master key externally held in your KMS - ensuring they remain secure and useless without access to the external KMS.

:::warning[Preview functionality]
This feature is currently in **preview mode** and will be available soon. We recommend that you **don't use it in the production workloads** until we have migrated to general availability in an upcoming release.
:::

To configure the Gateway KMS refer to the [encryption-configuration](./gateway/interceptors/data-security/encryption/encryption-configuration#gateway-kms) page.


### Feature changes
- Add support for AWS Glue Schema Registry
- Add support for `.` in the name of the `Virtual Cluster` APIs
- More detailed errors that are not to do with interceptor validation

### Bug fixes
- Add `aws-java-sdk-sts` dependency to allow assume role profiles when using AWS KMS
- Add `jcl-over-slf4j` dependency to see logs from AWS SDK
