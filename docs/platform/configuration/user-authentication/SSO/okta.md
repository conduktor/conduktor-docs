---
sidebar_position: 7
title: Okta
description: Configure Okta as SSO for Conduktor Console.
---

# Configure Okta as SSO

## Okta Configuration

On Okta side, you'll have to create a new application:

- **Step 1**: Create an `OpenID Connect` web application

![](../../assets/okta-create-app.png)

- **Step 2**: Configure the callback URI with the format `http(s)://<Console host>:<Console port>/oauth/callback/okta` 

![](../../assets/okta-callback-uri.png)


- **Step 3**: Configure app assignment and save changes 

![](../../assets/okta-assignments.png)

- **Step 4**: Get client ID and secret, that you'll use in the configuration file of Console

![](../../assets/okta-client-id-secret.png)

- **Step 5**: Find the issuer URL in the `Sign On` tab of your application. It's made like `https://<your domain>.okta.com`

![](../../assets/okta-issuer.png)

## Console Configuration

On Console side, you can add the snippet below to your configuration file. You have to replace the client ID, client secret, and domain, by what you got during the previous steps.

```yaml title="platform-config.yaml"
sso:
  oauth2:
    - name: "okta"
      default: true
      client-id: "<client ID>" # from step 4
      client-secret: "<client secret>" # from step 4
      openid:
        issuer: "https://<domain>.okta.com" # from step 5
```

Or using environment variables :

```json
CDK_SSO_OAUTH2_0_NAME="okta"
CDK_SSO_OAUTH2_0_DEFAULT=true
CDK_SSO_OAUTH2_0_CLIENT-ID="<client ID>"
CDK_SSO_OAUTH2_0_CLIENT-SECRET="<client secret>"
CDK_SSO_OAUTH2_0_OPENID_ISSUER="https://<domain>.okta.com"
```