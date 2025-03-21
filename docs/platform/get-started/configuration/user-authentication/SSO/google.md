---
sidebar_position: 5
title: Google
description: Configure Google as SSO for Conduktor Console.
---

# Configure Google as SSO

## Google Configuration

On Google side, you'll have to follow these steps:

- **Step 1**: Create an application on the **OAuth consent screen** tab

The scopes needed are `email`, `profile`, and `openid`.
Optionally, you need `https://www.googleapis.com/auth/cloud-identity.groups.readonly` for External Group Mapping.

import GoogleScopes from './assets/google-scopes.png';

<img src={GoogleScopes} alt="Google Scopes" style={{ width: 500, display: 'block', margin: 'auto' }} />


- **Step 2**: Restrict access to your internal workspace by checking the `Internal` user type in the **OAuth consent screen**.

import GoogleUserTypeInternal from './assets/google-user-type-internal.png';

<img src={GoogleUserTypeInternal} alt="Google Users type internal" style={{ width: 300, display: 'block', margin: 'auto' }} />

- **Step 3**: Create a new `OAuth client ID`

You can select the name you want, shown here as `Conduktor Console`, and enter the redirect URI as the following: `http(s)://<Console host>(:<Console port>)/oauth/callback/<OAuth2 config name>`. 

For example, if you deployed Console locally using the name `google` in your configuration file, you can use `http://localhost:8080/oauth/callback/google`, like on the screenshot below.

For more details on Console redirect URI for OAuth2, you can check the [documentation](generic-oauth2.md#more-details-on-console-external-url).

import GoogleCreateClient from './assets/google-create-client.png';

<img src={GoogleCreateClient} alt="Google Create Client" style={{ width: 500, display: 'block', margin: 'auto' }} />

- **Step 4**: Get the `client ID` and the `secret ID`

After the creation, the pop-up below appears. You can save the client ID and secret as JSON if you want.

import GoogleClientIdSecret from './assets/google-client-id-secret.png';

<img src={GoogleClientIdSecret} alt="Google Client ID Secret" style={{ width: 500, display: 'block', margin: 'auto' }} />

:::tip
You can find the .well-known at: [`https://accounts.google.com/.well-known/openid-configuration`](https://accounts.google.com/.well-known/openid-configuration).
:::

:::info
If you need to add an **authorized domain** to your Google account, you can follow [this guide](https://support.google.com/cloud/answer/6158849?hl=en-GB#authorized-domains&zippy=%2Cauthorized-domains).
:::

## Console Configuration

On Console side, you can add the snippet below to your configuration file. You have to replace the client ID and secret with what you got during the step 4.

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yaml title="platform-config.yaml"
sso:
  oauth2:
    - name: "google"
      client-id: "<client ID>"
      client-secret: "<client secret>"
      scopes: "openid,email,profile"
      openid:
        issuer: "https://accounts.google.com"
```

</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```json title=".env"
CDK_SSO_OAUTH2_0_NAME="google"
CDK_SSO_OAUTH2_0_CLIENT-ID="<client ID>"
CDK_SSO_OAUTH2_0_CLIENT-SECRET="<client secret>"
CDK_SSO_OAUTH2_0_SCOPES="openid,email,profile"
CDK_SSO_OAUTH2_0_OPENID_ISSUER="https://accounts.google.com"
```

</TabItem>
</Tabs>

## Groups Configuration

An additional scope `https://www.googleapis.com/auth/cloud-identity.groups.readonly` is required if you want to sync Google Group with Conduktor Groups.

<Tabs>
<TabItem value="YAML  File" label="YAML File">

```yaml title="platform-config.yaml"
sso:
  oauth2:
    - name: "google"
      client-id: "<client ID>"
      client-secret: "<client secret>"
      scopes: "openid,email,profile,https://www.googleapis.com/auth/cloud-identity.groups.readonly"
      openid:
        issuer: "https://accounts.google.com"
```

</TabItem>
<TabItem value="Environment Variables" label="Environment Variables">

```json title=".env"
CDK_SSO_OAUTH2_0_NAME="google"
CDK_SSO_OAUTH2_0_CLIENT-ID="<client ID>"
CDK_SSO_OAUTH2_0_CLIENT-SECRET="<client secret>"
CDK_SSO_OAUTH2_0_SCOPES="openid,email,profile,https://www.googleapis.com/auth/cloud-identity.groups.readonly"
CDK_SSO_OAUTH2_0_OPENID_ISSUER="https://accounts.google.com"
```

</TabItem>
</Tabs>

### External Groups Mapping

Now that your configuration is finished, you can [set up the mapping](/platform/get-started/configuration/user-authentication/external-group-sync/#create-an-external-group-mapping) between Google Groups and Console groups. That way, when a user logs in, they will be automatically added to the corresponding Console groups, based on the groups they belong to in Google.

The value you need to put as an external group is the `email` address of the Google Group.
