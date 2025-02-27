---
sidebar_position: 3
title: Generic OIDC provider
description: Configure OpenID Connect as SSO for Conduktor Console.
---

# Configure OIDC provider as SSO

There are many OIDC (OpenID Connect) providers available, we already have guides for some of them:
- [Azure AD](/platform/get-started/configuration/user-authentication/SSO/azure/)
- [Google](/platform/get-started/configuration/user-authentication/SSO/google/)
- [Amazon Cognito](/platform/get-started/configuration/user-authentication/SSO/amazon-cognito/)
- [Keycloak](/platform/get-started/configuration/user-authentication/SSO/keycloak/)
- [Okta](/platform/get-started/configuration/user-authentication/SSO/okta/)
- [Auth0](/platform/get-started/configuration/user-authentication/SSO/auth0/)

For other providers, you can follow this guide which will explain the general steps to follow.

## OAuth2 Provider Configuration

### 1. Create an OIDC application in your chosen provider.   
This application should use standard OAuth2/OIDC [authorization code flow](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth) with `CLIENT_SECRET_BASIC` authentication method.

### 2. Set OAuth2 authorized redirect URI in your application

For the OAuth2 authorization code flow to work, the OAuth2 provider needs to know; and authorize; where to redirect the user after the authentication process. 
This is called the `redirect URI` or `callback URI`. 

The redirect URI will look like this:    
`http(s)://<Console host>(:<Console port>)/oauth/callback/<OAuth2 config name>`

Where `<Console host>` and `<Console port>` depend on the Console external URL used and/or configured, and `<OAuth2 config name>` is the name of the OAuth2 configuration in your Console configuration file see [Console configuration](#console-configuration) step.

#### More details on Console external URL
When Console initiate the OAuth2 authorization code flow, it tells the OIDC provider where to redirect the user after the authentication process.

But to forge this redirect URI, Console has several choices: 

##### Console external URL is configured

If the Console external URL is configured using environment variable `CDK_PLATFORM_EXTERNAL_URL` or configuration `platform.external.url`, it will use it.    
**But SSO will work ONLY if Console is accessed using this URL.** 
If you try to log in from the second URL you will be redirected to the first URL and then lose browser authentication cookies meaning the SSO will not work.

##### Console external URL is NOT configured

When no external Console URL is enforced, Console will use requests headers to resolve this external URL.
This is recommended if Console is accessed using multiple URLs (internal, external, etc) and have SSO on each of them.

The resolution strategy is the following:
1. Use the [`Forwarded`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded) header. This is the preferred method if you are using a **reverse proxy in front of Console**. 
It uses the `host` and `proto` directives (if set) of `Forwarded` header to determine the external URL.
2. Use the `X-Forwarded-*` headers. Support for the non-standard forwarded headers coming from some **reverse proxy** implementations.    
It uses the `X-Forwarded-Proto`, `X-Forwarded-Host` and `X-Forwarded-Port` headers to determine the external URL.
3. Use the `Host` header. Used if you access to Console directly, without a reverse proxy.   
In this case, the `Host` header (generally set by the browser) will be used to determine the external URL. 
:::note
**Port** will be guessed depending on the content of the `Host` header and fallback to Console configured port using environment variable `CDK_LISTENING_PORT` (default to `8080`).   
**Scheme** (http/https) will be guessed depending on the current TLS configuration of Console. See [TLS configuration](/platform/get-started/configuration/ssl-tls-configuration/) for more details. (default to `http`).
:::

### 3. Get the client ID & secret from application settings

## Console Configuration

On Console side, you need to configure several properties to enable OIDC SSO.

Required properties are:
- `sso.oauth2.name`: the name of the OAuth2 configuration. This name will be used in the redirect URI defined on your provider in the steps before. It must be unique.
- `sso.oauth2.client-id`: the client ID of your OAuth2 application.
- `sso.oauth2.client-secret`: the client secret of your OAuth2 application.
- `sso.oauth2.openid.issuer`: the issuer URL of your OpenID Connect provider. This url is used to discover the provider configuration using the `.well-known/openid-configuration` path.

Optionally, you can configure the following properties:
- `sso.oauth2.scopes`: the list of scopes to request during the authorization code flow.

For a detailed list of OAuth2 configurations supported by Console please refer to [this page](/platform/get-started/configuration/env-variables/#oauth2-properties).

### Example
Here is an example of a configuration file for a generic OIDC provider:

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yaml title="platform-config.yaml"
sso:
  oauth2:
    - name: "oidc-provider"
      client-id: "<client ID>"
      client-secret: "<client ID>"
      openid:
        issuer: "https://<oidc domain>/"
```

</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```json title=".env"
CDK_SSO_OAUTH2_0_NAME="oidc-provider"
CDK_SSO_OAUTH2_0_DEFAULT=true
CDK_SSO_OAUTH2_0_CLIENT-ID="<client ID>"
CDK_SSO_OAUTH2_0_CLIENT-SECRET="<client secret>"
CDK_SSO_OAUTH2_0_OPENID_ISSUER="https://<oidc domain>/"
```

</TabItem>
</Tabs>

The provider exposes its configuration using the well-known endpoint: `https://<oidc domain>/.well-known/openid-configuration`.
