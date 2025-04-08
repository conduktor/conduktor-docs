---
date: 2025-04-08
title: Gateway 3.8.0
description: docker pull conduktor/conduktor-gateway:3.8.0
solutions: gateway
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
   - [New backing topic for Gateway](#new-backing-topic-required-for-gateway)
   - [Deprecating v1 APIs](#deprecating-v1-apis)
- Conduktor Shield:
   - [General availability: a cost-effective Crypto Shredding with Gateway KMS](#general-availability-cost-effective-crypto-shredding-with-gateway-kms)
- [New features](#new-features)
   - [Support for delegated authentication using OAUTHBEARER](support-for-delegated-authentication-using-oauthbearer-mechanism) 
   - [Support for delegated authentication using AWS_MSK_IAM](support-for-delegated-authentication-using-aws_msk_iam-mechanism)

### Breaking changes

#### New backing topic required for Gateway
An upcoming data quality feature requires a new backing topic in Gateway.

When you upgrade to Gateway 3.8.0, a new topic `_conduktor_$gateway_data_quality_violation` will be created.

To change this default topic name, use the `GATEWAY_DATA_QUALITY_TOPIC` variable. [Find out more about environment variables](https://docs.conduktor.io/gateway/configuration/env-variables/#topics-names).

#### Deprecating v1 APIs
The v1 APIs are now deprecated in favor of v2, introduced in Gateway v3.3.0 in September 2024.  

If you're using the Conduktor CLI to operate Gateway, you're not impacted. [Find out which Gateway APIs are affected](https://developers.conduktor.io/?product=gateway&version=3.6.1&gatewayApiVersion=v1).

:::warning[Migrate to v2 APIs]
We plan to remove the v1 APIs from in the upcoming Gateway release (v3.10). If you're using the v1 APIs, migrate to v2 APIs as soon as possible. [Get in touch](https://support.conduktor.io/hc/en-gb/requests/new?ticket_form_id=17438363566609) for support with the migration.
:::

#### General Availability: cost-effective Crypto Shredding with Gateway KMS

This release makes the Gateway native crypto shredding feature available for general use. The 'gateway' KMS type on Encryption/Decryption interceptors allows you to manage granular encryption keys for individual users or records without the prohibitive costs of storing each key in AWS KMS (which costs approximately $1 per key).

Changes since [3.7.0](/changelog/#preview-feature-introducing-cost-effective-crypto-shredding-with-gateway-kms),
* It is now possible for there to be multiple gateway keys stored per secret Id. This can happen when multiple Gateway nodes are simultaneously processing the secret Id for the first time. Crypto shredding requires that every one of these keys are deleted. In order to do so the key store topic needs to be read message keys can be determined (each will have a separate `UUID`). More detail in the [reference documentation](/gateway/interceptors/data-security/encryption/encryption-configuration/#crypto-shredding).
* In order to efficiently reuse gateway kms keys for secret Ids a new configuration option called `maxKeys` has been added to `config/kmsConfig/gateway/`. It should be set to a number larger than the expected number of secret Ids.
* `masterKeyId` on `config/kmsConfig/gateway/` is now validated and can not use template variables.

These are breaking changes. Any messages encryted with 'gateway' KMS type in the preview version (Gateway 3.7.0) will not be decryptable in version 3.8.0.

[Find out how to configure the Gateway KMS](/gateway/interceptors/data-security/encryption/encryption-configuration#gateway-kms).

### New features

#### Support for Delegated authentication using OAUTHBEARER mechanism 
It's now possible to use `GATEWAY_SECURITY_PROTOCOL=DELEGATED_SASL_xxx` when using the `OAUTHBEARER` mechanism.
By default, Gateway will use the `sub` claim as the principal name. 
You can override this by setting the `GATEWAY_OAUTH_SUB_CLAIM_NAME` environment variable to the claim you want to use as the principal name.
If you are using OAuth support on Confluent Cloud, as another option you can set the `GATEWAY_OAUTH_USE_CC_POOL_ID` environment variable to `true` to use the identity pool ID as the principal name.

#### Support for Delegated authentication using AWS_MSK_IAM mechanism
It's now possible to use `GATEWAY_SECURITY_PROTOCOL=DELEGATED_SASL_xxx` when using the `AWS_MSK_IAM` mechanism.
Gateway will use the AWS access key ID as the principal name.
