---
sidebar_position: 8
title: Auth0
description: Configure Auth0 as SSO for Conduktor Console.
---

# Configure Auth0 as SSO

## Auth0 Configuration

On Auth0 side, you'll have to create a new application:

- **Step 1**: Create regular web application ![](../../assets/auth0-app-step1.png)

- **Step 2**: Get client ID, client secret and domain ![](../../assets/auth0-app-step2.png)

- **Step 3**: Configure callback URL using the following pattern: `http(s)://<Console hostname>/oauth/callback/auth0` ![](../../assets/auth0-app-step3.png)

- **Step 4**: Save changes

## Console Configuration

On Console side, you can add the snippet below to your configuration file. You have to replace the client ID, client secret, and domain, by what you got during the step 2.

```yaml title="platform-config.yaml"
sso:
  oauth2:
    - name: "auth0"
      default: true
      client-id: "<client ID>"
      client-secret: "<client secret>"
      openid:
        issuer: "<domain>.auth0.com"
```

Or using environment variables :

```json
CDK_SSO_OAUTH2_0_NAME="auth0"
CDK_SSO_OAUTH2_0_DEFAULT=true
CDK_SSO_OAUTH2_0_CLIENT-ID="<client ID>"
CDK_SSO_OAUTH2_0_CLIENT-SECRET="<client secret>"
CDK_SSO_OAUTH2_0_OPENID_ISSUER="<domain>.auth0.com"
```