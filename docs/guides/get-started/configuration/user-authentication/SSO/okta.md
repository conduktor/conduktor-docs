---
sidebar_position: 8
title: Okta
description: Configure Okta as SSO for Conduktor Console.
---

# Configure Okta as SSO

## Okta Configuration

On Okta side, you'll have to create a new application:

- **Step 1**: Create an **OpenID Connect web application**

import OktaCreateApp from './assets/okta-create-app.png';

<img src={OktaCreateApp} alt="Okta create app" style={{ width: 500, display: 'block', margin: 'auto' }} />

- **Step 2**: Configure the callback URI

The redirect URI can be like: `http(s)://<Console host>(:<Console port>)/oauth/callback/<OAuth2 config name>`. 

For example, if you deployed Console locally using the name `okta` in your configuration file, you can use `http://localhost:8080/oauth/callback/okta`, like in the screenshot below.

For more details on Console redirect URI for OAuth2, you can check the [documentation](/platform/get-started/configuration/user-authentication/SSO/generic-oauth2/#more-details-on-console-external-url).

import OktaCallbackUri from './assets/okta-callback-uri.png';

<img src={OktaCallbackUri} alt="Okta callback URI" style={{ width: 500, display: 'block', margin: 'auto' }} />

- **Step 3**: Configure **app assignments**, and save changes 

import OktaAssignments from './assets/okta-assignments.png';

<img src={OktaAssignments} alt="Okta assignments" style={{ width: 500, display: 'block', margin: 'auto' }} />

- **Step 4**: Get `client ID` and `client secret`, that you'll use in the configuration file of Console

import OktaClientIdSecret from './assets/okta-client-id-secret.png';

<img src={OktaClientIdSecret} alt="Okta client ID secret" style={{ width: 500, display: 'block', margin: 'auto' }} />

- **Step 5**: Find the `issuer URL` in the **Sign On** tab of your application. It's made like `https://<domain>.okta.com`

import OktaIssuer from './assets/okta-issuer.png';

<img src={OktaIssuer} alt="Okta issuer" style={{ width: 500, display: 'block', margin: 'auto' }} />

:::tip
You can find the .well-known at: `https://<domain>.okta.com/.well-known/openid-configuration`.
:::

## Console Configuration

On Console side, you can add the snippet below to your configuration file. You have to replace the `client ID`, `client secret`, and `domain`, with what you got during steps 4 and 5.

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yaml title="platform-config.yaml"
sso:
  oauth2:
    - name: "okta"
      client-id: "<client ID>"
      client-secret: "<client secret>"
      openid:
        issuer: "https://<domain>.okta.com"
```
:::note
Please note that if you are using a custom auth server in Okta, the OPENID_ISSUER should be in the form `https://<yourOktaDomain>/oauth2/<authorizationServerId>/` rather than `https://<domain>.okta.com`
You can find documentation on this [here](https://developer.okta.com/docs/guides/customize-tokens-returned-from-okta/main/).
:::

</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```json title=".env"
CDK_SSO_OAUTH2_0_NAME="okta"
CDK_SSO_OAUTH2_0_DEFAULT=true
CDK_SSO_OAUTH2_0_CLIENT-ID="<client ID>"
CDK_SSO_OAUTH2_0_CLIENT-SECRET="<client secret>"
CDK_SSO_OAUTH2_0_OPENID_ISSUER="https://<domain>.okta.com"
```

</TabItem>
</Tabs>
