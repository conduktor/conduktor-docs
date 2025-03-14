---
sidebar_position: 2
title: Security
description: Security for Kafka Connect
---

# Security

## HTTP Security

We support 3 types of security by headers:

- **None** (!)
- **Basic Auth**: username & password
- **Bearer Token**: you can protect your Kafka Connect REST API through an `Authorization: Bearer xxx` header

## Kafka Connect Certificates / PKIX path building failed

If your Kafka Connect instance is running on HTTPS with a **self-signed** certificate or signed by a **non-trusted issuer**, you will need to trust the Certificate Authority who signed this certificate (ie: your company Certificate Authority generally).

Check this dedicated page for more details:

[Certificates FAQ](/desktop/conduktor-first-steps/login-troubleshooting/certificates-faq)
