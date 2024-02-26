---
sidebar_position: 2
title: LDAPS
description: Configure LDAPS as SSO for Conduktor Console.
---

# Configure LDAPS as SSO

## Certificate Configuration

For LDAP over SSL (LDAPS) connection, you have to provide a trusted certificate using Java JKS TrustStore file. See [SSL/TLS configuration](../../../ssl-tls-configuration/) for more details.

LDAPS SSL certificate can also be passed as PEM encoded string using the property `sso.trustedCertificates`.

```yaml title="platform-config.yaml"
sso:
  ignoreUntrustedCertificate: false
  trustedCertificates: |
    -----BEGIN CERTIFICATE-----
    ...
    -----END CERTIFICATE-----
```