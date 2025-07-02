---
date: 2025-07-16
title: Gateway 3.11.0
description: docker pull conduktor/conduktor-gateway:3.11.0
solutions: gateway
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
- [New features](#new-features)
  - [Decryption Interceptor: Crypto-Shredding Error Policy Validation](#decryption-interceptor-crypto-shredding-error-policy-validation)

### Breaking changes

### New features

#### Decryption Interceptor: Crypto-Shredding Error Policy Validation

- **Enhanced validation for crypto-shredding configurations**: Added validation logic to ensure that when using crypto-shredding capable KMS patterns, the `errorPolicy` must always be set to `return_encrypted`
- **Crypto-shredding KMS validation**: The validation now checks for crypto-shredding capable KMS patterns and enforces the `return_encrypted` policy requirement for:
  - `vault-kms://`
  - `azure-kms://`
  - `aws-kms://`
  - `gcp-kms://`
  - `gateway-kms://`
- **In-memory KMS exclusion**: Fields using `in-memory-kms://` are not considered crypto-shredding capable and therefore don't require the `return_encrypted` policy validation

