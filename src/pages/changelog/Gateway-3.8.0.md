---
date: 2025-04-08
title: Gateway 3.8.0
description: docker pull conduktor/conduktor-gateway:3.8.0
solutions: gateway
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Breaking changes

#### New backing topic required for Gateway

#### Deprecating V1 APIs
V1 APIs are now deprecated in favor of the V2 APIs introduced in Gateway 3.3.0 in September 2024.  
If you are using the Conduktor CLI to operate the Gateway, you are not impacted.
Check the following link to understand which APIs are deprecated: [Gateway API Doc](https://developers.conduktor.io/?product=gateway&version=3.6.1&gatewayApiVersion=v1).
**We plan to remove the V1 APIs from the Gateway in three releases time, in Gateway 3.10.0**.  
If you are using the V1 APIs, please migrate to the V2 APIs as soon as possible.  
If you need support with this migration, please [let us know](https://support.conduktor.io/hc/en-gb/requests/new?ticket_form_id=17438363566609).


### Support for Delegated authentication using OAUTHBEARER mechanism 
It's now possible to use `GATEWAY_SECURITY_PROTOCOL=DELEGATED_SASL_xxx` when using the `OAUTHBEARER` mechanism.
By default, Gateway will use the `sub` claim as the principal name. 
You can override this by setting the `GATEWAY_OAUTH_SUB_CLAIM_NAME` environment variable to the claim you want to use as the principal name.
If you are using OAuth support on Confluent Cloud, as another option you can set the `GATEWAY_OAUTH_USE_CC_POOL_ID` environment variable to `true` to use the identity pool ID as the principal name.

### Support for Delegated authentication using AWS_MSK_IAM mechanism
It's now possible to use `GATEWAY_SECURITY_PROTOCOL=DELEGATED_SASL_xxx` when using the `AWS_MSK_IAM` mechanism.
Gateway will use the AWS access key ID as the principal name.

### Feature changes
- ATODO

### Bug fixes
- TODO
