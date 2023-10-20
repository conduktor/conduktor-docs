---
sidebar_position: 8
title: Auth0
description: Configure Auth0 as SSO for Conduktor Console.
---

# Configure Auth0 as SSO

## Auth0 Configuration

On Auth0 side, you'll have to create a new application:

- **Step 1**: Create a **Regular Web Application** ![](../../assets/auth0-create-app.png)

- **Step 2**: Get the `client ID`, `client secret` and `domain` ![](../../assets/auth0-client-id-secret-domain.png)

- **Step 3**: Configure the callback URI

The redirect URI must be like: `http(s)://<Console host>:<Console port>/oauth/callback/<OAuth2 config name>`. 

For example, if you deployed Console locally using the name `auth0` in your configuration file, you can use `http://localhost:8080/oauth/callback/auth0`, like on the screenshot below.

![](../../assets/auth0-callback.png)

:::tip
You can find the .well-known at: `https://<domain>/.well-known/openid-configuration`.
:::

:::caution
Do not forget to select how you want to connect via the **Connections** tab of your Auth0 application.
:::

## Console Configuration

On Console side, you can add the snippet below to your configuration file. You have to replace the `client ID`, `client secret`, and `domain`, by what you got during the step 2.

```yaml title="platform-config.yaml"
sso:
  oauth2:
    - name: "auth0"
      default: true
      client-id: "<client ID>"
      client-secret: "<client secret>"
      openid:
        issuer: "https://<domain>"
```

Or using environment variables:

```json
CDK_SSO_OAUTH2_0_NAME="auth0"
CDK_SSO_OAUTH2_0_DEFAULT=true
CDK_SSO_OAUTH2_0_CLIENT-ID="<client ID>"
CDK_SSO_OAUTH2_0_CLIENT-SECRET="<client secret>"
CDK_SSO_OAUTH2_0_OPENID_ISSUER="https://<domain>"
```