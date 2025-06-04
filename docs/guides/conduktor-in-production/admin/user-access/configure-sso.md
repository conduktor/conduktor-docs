---
sidebar_position: 180
title: Configure SSO
description: Configure SSO in Conduktor
---
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

## Configure LDAP as SSO

[View the list of LDAP properties](#ldap-config-properties). Here's a sample snippet containing server, users and groups to put in your configuration file.

<Tabs>
<TabItem value="YAML  File" label="YAML file">

```yaml title="platform-config.yaml"
sso:
  ldap:
    - name: "LDAP"                                 # Custom name for LDAP connection
      server: "ldap://openldap:1389"               # LDAP server URI with port
      managerDn: "cn=admin,dc=example,dc=org"      # Bind DN
      managerPassword: "adminpassword"             # Bind password
      search-subtree: true                         # Search subtree (default: true)
      search-base: "ou=users,dc=example,dc=org"    # Base DN to search for users
      search-filter: "(uid={0})"                   # Search filter (default: "(uid={0})")
      groups-enabled: true                         # Enable group membership (default: false)
      groups-base: "ou=groups,dc=example,dc=org"   # Base DN to search for groups
      groups-filter: "(member={0})"                # Filter on groups (default: "uniquemember={0}")
      groups-attribute: "cn"                       # Group name entry (default: "cn")
```

</TabItem>
<TabItem value="Environment Variables" label="Environment variables">

```json title=".env"
CDK_SSO_LDAP_0_NAME="LDAP"
CDK_SSO_LDAP_0_SERVER="ldap://openldap:1389"
CDK_SSO_LDAP_0_MANAGERDN="cn=admin,dc=example,dc=org"
CDK_SSO_LDAP_0_MANAGERPASSWORD="adminpassword"
CDK_SSO_LDAP_0_SEARCH-SUBTREE=true
CDK_SSO_LDAP_0_SEARCH-BASE="ou=users,dc=example,dc=org"
CDK_SSO_LDAP_0_SEARCH-FILTER="(uid={0})"
CDK_SSO_LDAP_0_GROUPS-ENABLED=true
CDK_SSO_LDAP_0_GROUPS-BASE="ou=groups,dc=example,dc=org"
CDK_SSO_LDAP_0_GROUPS-FILTER="(member={0})"
CDK_SSO_LDAP_0_GROUPS-ATTRIBUTE="cn"
```

</TabItem>
</Tabs>

:::note
If your LDAP server is **Active Directory** and you get an "invalid user" error when trying to log in, try setting your `search-filter` to `'(sAMAccountName={0})'`.
:::

### Users information

Here is the mapping between LDAP user's information and Conduktor Console:

| LDAP              | Conduktor Console                         |
| ----------------- | ----------------------------------------- |
| `uid`             | User ID, used to log in                   |
| `mail` or `email` | User email (**The only mandatory field**) |
| `cn`              | User name                                 |
| `sn`              | User family name                          |
| `givenName`       | User first name                           |
| `displayName`     | User display name                         |

### Groups

To retrieve the groups each user belongs to, you have to set `groups-enabled` to `true`, and populate the attributes `groups-base` and `groups-filter`. 

Note that depending on your LDAP `objectClass`, the attribute used to filter groups might be changed. For example:

| LDAP `objectClass`   | Conduktor `groups-filter` |
| -------------------- | ------------------------- |
| `groupOfNames`       | `"member={0}"`            |
| `groupOfUniqueNames` | `"uniqueMember={0}"`      |

### Map to external groups

Now that your configuration is finished, you can set up a **mapping** between your LDAP groups and your Console groups. That way, when a user logs in, they will be automatically added to the corresponding Console groups, based on their LDAP groups.

To create this mapping, you have to create a group from Console, and mention the ID of the group on your LDAP (you should find it in the attribute you mentioned as `groups-base`).

![](/guides/external-groups-mapping.png)

After the user logged in, we can see they've been added to the group, without any action:
![](/guides/egm-after-login.png)

## Configure Auth0 as SSO

[View the list of Auth0 properties](#oauth2-config-properties).

On Auth0 side, you'll have to create a new application:

1. Create a regular web application:
    <img src="/guides/auth0-create-app.png" alt="Auth01" style={{maxWidth: '30%'}} />
1. Get the `client ID`, `client secret` and `domain`:
    <img src="/guides/auth0-client-id-secret-domain.png" alt="Auth02" style={{maxWidth: '30%'}} />
1. Configure the callback URI.nThe redirect URI can be something like: `http(s)://<Console host>(:<Console port>)/oauth/callback/<OAuth2 config name>`. For example, if you deployed Console locally using the name `auth0` in your configuration file, you can use `http://localhost:8080/oauth/callback/auth0`.

![](/guides/auth0-callback.png)

:::warning[Define connection]
Remember to specify how you want to connect using the **Connections** tab of your Auth0 application.
:::

### Configure Console

On the Console side, you can add the snippet below to your configuration file. Replace the `client ID`, `client secret` and `domain` with values from step 2 above.

<Tabs>
<TabItem value="YAML  File" label="Configuration file">

```yaml title="platform-config.yaml"
sso:
  oauth2:
    - name: "auth0"
      client-id: "<client ID>"
      client-secret: "<client secret>"
      openid:
        issuer: "https://<domain>"
```

</TabItem>
<TabItem value="Environment Variables" label="Environment variables">

```json title=".env"
CDK_SSO_OAUTH2_0_NAME="auth0"
CDK_SSO_OAUTH2_0_DEFAULT=true
CDK_SSO_OAUTH2_0_CLIENT-ID="<client ID>"
CDK_SSO_OAUTH2_0_CLIENT-SECRET="<client secret>"
CDK_SSO_OAUTH2_0_OPENID_ISSUER="https://<domain>"
```

</TabItem>
</Tabs>

## SSO config properties

| Property                         | Description                                                              | Environment variable                 | Mandatory | Type    | Default |
|----------------------------------|--------------------------------------------------------------------------|--------------------------------------|-----------|---------|---------|
| `sso.ignoreUntrustedCertificate` | Disable SSL checks                                                       | `CDK_SSO_IGNOREUNTRUSTEDCERTIFICATE` | false     | boolean | `false` |
| `sso.trustedCertificates`        | SSL public certificates for SSO authentication (LDAPS and OAuth2) as PEM | `CDK_SSO_TRUSTEDCERTIFICATES`        | false     | string  | ∅       |

#### OAuth2 config properties

| Property                                | Description                                                         | Environment variable                     | Mandatory | Type                                                                                                                                         | Default |
|-----------------------------------------|---------------------------------------------------------------------|------------------------------------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------|---------|
| `sso.oauth2[].name`                     | OAuth2 connection name                                              | `CDK_SSO_OAUTH2_0_NAME`                  | true      | string                                                                                                                                       | ∅       |
| `sso.oauth2[].default`                  | Use as default                                                      | `CDK_SSO_OAUTH2_0_DEFAULT`               | true      | boolean                                                                                                                                      | ∅       |
| `sso.oauth2[].client-id`                | OAuth2 client ID                                                    | `CDK_SSO_OAUTH2_0_CLIENTID`              | true      | string                                                                                                                                       | ∅       |
| `sso.oauth2[].client-secret`            | OAuth2 client secret                                                | `CDK_SSO_OAUTH2_0_CLIENTSECRET`          | true      | string                                                                                                                                       | ∅       |
| `sso.oauth2[].openid.issuer`            | Issuer to check on token                                            | `CDK_SSO_OAUTH2_0_OPENID_ISSUER`         | true      | string                                                                                                                                       | ∅       |
| `sso.oauth2[].scopes`                   | Scopes to be requested in the client credentials request            | `CDK_SSO_OAUTH2_0_SCOPES`                | true      | string                                                                                                                                       | `[]`    |
| `sso.oauth2[].groups-claim`             | Group attribute from your identity provider                         | `CDK_SSO_OAUTH2_0_GROUPSCLAIM`           | false     | string                                                                                                                                       | ∅       |
| `sso.oauth2[].username-claim`           | Email attribute from your identity provider                         | `CDK_SSO_OAUTH2_0_USERNAMECLAIM`         | false     | string                                                                                                                                       | `email` |
| `sso.oauth2[].allow-unsigned-id-tokens` | Allow unsigned ID tokens                                            | `CDK_SSO_OAUTH2_0_ALLOWUNSIGNEDIDTOKENS` | false     | boolean                                                                                                                                      | false   |
| `sso.oauth2[].preferred-jws-algorithm`  | Configure preferred JWS algorithm                                   | `CDK_SSO_OAUTH2_0_PREFERREDJWSALGORITHM` | false     | string one of: "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "ES256", "ES256K", "ES384", "ES512", "PS256", "PS384", "PS512", "EdDSA" | ∅       |
| `sso.oauth2-logout`                     | Wether the central identity provider logout should be called or not | `CDK_SSO_OAUTH2LOGOUT`                   | false     | boolean                                                                                                                                      | true    |

#### LDAP config properties

| Property                             | Description                                                                                                                                                                                        | Environment variable                   | Mandatory | Type         | Default              |
|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|-----------|--------------|----------------------|
| `sso.ldap[].name`                    | Ldap connection name                                                                                                                                                                               | `CDK_SSO_LDAP_0_NAME`                  | true      | string       | ∅                    |
| `sso.ldap[].server`                  | Ldap server host and port                                                                                                                                                                          | `CDK_SSO_LDAP_0_SERVER`                | true      | string       | ∅                    |
| `sso.ldap[].managerDn`               | Sets the manager DN                                                                                                                                                                                | `CDK_SSO_LDAP_0_MANAGERDN`             | true      | string       | ∅                    |
| `sso.ldap[].managerPassword`         | Sets the manager password                                                                                                                                                                          | `CDK_SSO_LDAP_0_MANAGERPASSWORD`       | true      | string       | ∅                    |
| `sso.ldap[].search-subtree`          | Sets if the subtree should be searched.                                                                                                                                                            | `CDK_SSO_LDAP_0_SEARCHSUBTREE`         | false     | boolean      | `true`               |
| `sso.ldap[].search-base`             | Sets the base DN to search.                                                                                                                                                                        | `CDK_SSO_LDAP_0_SEARCHBASE`            | true      | string       | ∅                    |
| `sso.ldap[].search-filter`           | Sets the search filter. By default, the filter is set to `(uid={0})` for users using class type `InetOrgPerson`.                                                                                   | `CDK_SSO_LDAP_0_SEARCHFILTER`          | false     | string       | `"(uid={0})"`        |
| `sso.ldap[].search-attributes`       | Sets the attributes list to return. By default, all attributes are returned. Platform search for `uid`, `cn`, `mail`, `email`, `givenName`, `sn`, `displayName` attributes to map into user token. | `CDK_SSO_LDAP_0_SEARCHATTRIBUTES`      | false     | string array | `[]`                 |
| `sso.ldap[].groups-enabled`          | Sets if group search is enabled.                                                                                                                                                                   | `CDK_SSO_LDAP_0_GROUPSENABLED`         | false     | boolean      | `false`              |
| `sso.ldap[].groups-subtree`          | Sets if the subtree should be searched.                                                                                                                                                            | `CDK_SSO_LDAP_0_GROUPSSUBTREE`         | false     | boolean      | `true`               |
| `sso.ldap[].groups-base`             | Sets the base DN to search from.                                                                                                                                                                   | `CDK_SSO_LDAP_0_GROUPSBASE`            | true      | string       | ∅                    |
| `sso.ldap[].groups-filter`           | Sets the group search filter. If using group class type `GroupOfUniqueNames` use the filter `"uniqueMember={0}"`. For group class `GroupOfNames` use `"member={0}"`.                               | `CDK_SSO_LDAP_0_GROUPSFILTER`          | false     | string       | `"uniquemember={0}"` |
| `sso.ldap[].groups-filter-attribute` | Sets the name of the user attribute to bind to the group search filter. Defaults to the user’s DN.                                                                                                 | `CDK_SSO_LDAP_0_GROUPSFILTERATTRIBUTE` | false     | string       | ∅                    |
| `sso.ldap[].groups-attribute`        | Sets the group attribute name. Defaults to `cn`.                                                                                                                                                   | `CDK_SSO_LDAP_0_GROUPSATTRIBUTE`       | false     | string       | `"cn"`               |
| `sso.ldap[].properties`              | Additional properties that will be passed to identity provider context.                                                                                                                            | `CDK_SSO_LDAP_0_PROPERTIES`            | false     | dictionary   | ∅                    |
