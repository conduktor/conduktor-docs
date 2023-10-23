---
sidebar_position: 2
title: LDAPS
description: Configure LDAPS as SSO for Conduktor Console.
---

# Configure LDAPS as SSO

## Certificate Configuration

For LDAP over SSL (LDAPS) connection, you have to provide a trusted certificate using Java JKS TrustStore file. See [SSL/TLS configuration](/platform/configuration/ssl-tls-configuration/) for more details.

LDAPS SSL certificate can also be passed as PEM encoded string using the property `sso.trustedCertificates`.

```yaml title="platform-config.yaml"
sso:
  ignoreUntrustedCertificate: false
  trustedCertificates: |
    -----BEGIN CERTIFICATE-----
    ...
    -----END CERTIFICATE-----
```

## Troubleshooting

To troubleshoot SSO issues, download the script [sso-debug.sh](https://raw.githubusercontent.com/conduktor/conduktor-platform/main/example-sso-ldap/sso-debug.sh) and run it. It will set the SSO logs level of Console at TRACE.

If you see an error that looks like this in the logs:

```log
DEBUG i.m.s.l.LdapAuthenticationProvider - Starting authentication with configuration [default]
DEBUG i.m.s.l.LdapAuthenticationProvider - Attempting to initialize manager context
DEBUG i.m.s.l.LdapAuthenticationProvider - Failed to create manager context. Returning unknown authentication failure. Encountered ldap.conduktor.io:1636
```
You can check if it comes from your SSL certificates. For that, apply the following procedure:

1. Set the property `sso.ignoreUntrustedCertificate` to `true`, like this:

```yaml title="platform-config.yaml"
sso:
  ignoreUntrustedCertificate: true
  ldap:
  - name: default
    server: "ldaps://domain:636"
    ...
```

2. Run the script `sso-debug.sh` again
3. Try to log in Console
4. Confirm that the logs you get look like this:

```log
15:37:03.297 DEBUG i.m.s.l.LdapAuthenticationProvider - Starting authentication with configuration [default]
15:37:03.297 DEBUG i.m.s.l.LdapAuthenticationProvider - Attempting to initialize manager context
15:37:03.336 WARN  nl.altindag.ssl.SSLFactory - UnsafeTrustManager is being used. Client/Server certificates will be accepted without validation.
15:37:03.563 DEBUG i.m.s.l.LdapAuthenticationProvider - Manager context initialized successfully
15:37:03.563 DEBUG i.m.s.l.LdapAuthenticationProvider - Attempting to authenticate with user [test]
15:37:03.586 DEBUG i.m.s.l.LdapAuthenticationProvider - User not found [test]
```

From there, either leave the `ignoreUntrustedCertificate` at `true`, or add the certificate to the truststore.  
See [SSL/TLS configuration](/platform/configuration/ssl-tls-configuration/) for more details.