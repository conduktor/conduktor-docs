---
sidebar_position: 3
title: Gateway Security
description: Securing Conduktor Gateway  
---

There are two stages of security configuration to consider when securing your Gateway.

 - The connection between Kafka clients and the Gateway
 - The connection between the Gateway and the Kafka cluster

![client-to-gateway-excalidraw](./images/gw-security/client-to-gateway-excalidraw.png)

Jump to:

- [Gateway to your Kafka security](#gateway-to-your-kafka-security)
- [Your client to Gateway security](#your-client-to-gateway-security)
  - [Passthrough security](#passthrough-security)
  - [Client to Gateway, additional security](#client-to-gateway-additional-security)
  - [mTLS](#mtls)
  - [Client to Gateway, with virtual clusters](#client-to-gateway-with-virtual-clusters)
    - [Enable virtual clusters](#enable-virtual-clusters-with-the-environment-variables)
    - [Create a username](#create-a-username)
    - [Update your client to connect to the virtual cluster](#update-your-client-to-connect-to-the-virtual-cluster)

# Gateway to your Kafka security

You can use all the Kafka security protocols; `PLAINTEXT`, `SASL_PLAINTEXT`, `SASL_SSL` and `SSL`.
For these security protocols we support all SASL mechanisms; `PLAIN`, `SCRAM SHA`, `OAuthBearer`, `Kerberos` etc.

Provide Gateway with the environment variables to connect to Kafka.
Use the variables that start with a `KAFKA_` prefix as it is Gateway's connection to **Kafka**.

```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.2.2
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092
      KAFKA_SASL_MECHANISM: PLAIN
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
      KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required  username="admin" password="admin-secret";
```

# Your client to Gateway security
You have several options when connecting clients to Gateway depending on your security requirements or design requirements.

If you are connecting to Gateway in Passthrough mode, or multitenancy mode (with virtual clusters) will provide different options.
**Passthrough** security passes the existing Kafka credentials of the client straight through to the backing cluster with no further checks. This is great to use out of the box, or if you do not need virtual clusters.

**Multi-tenancy** or virtual cluster mode. Depending on your design requirements, you may want clients to connect to a virtual cluster on Gateway.

Depending which mode you are in, Passthrough or Multi-tenancy (virtual clusters) , different security options are supported. Note these don't have to match that between Gateway and the backing Kafka, you could have simpler security for clients to Gateway and a more advanced method from Gateway to Kafka if you wished.

## Passthrough security

By default Conduktor will leverage your `KAFKA_SECURITY_PROTOCOL` and accept the login and password. 

Gateway will then transfer the credentials to your underlying Kafka, thus leveraging your existing security and ACLs.

This is the default Gateway mode, `GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: false`.

:::caution

For Passthrough mode, Conduktor Gateway currently supports:
- Security protocols: `SASL_PLAINTEXT` and `SASL_SSL`
- SASL mechanisms: `PLAIN`, `SCRAM-SHA-256` and `SCRAM-SHA-512`

:::

Gateway can be started with minimal changes in Passthrough mode, only requiring the bootstrap servers, e.g.:  

```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.2.2
    hostname: conduktor-gateway
    container_name: conduktor-gateway
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9093
```

Interceptors are interacted with through the admin API using a vcluster name of `passthrough`. See the [API documentation](https://developers.conduktor.io/) for more information.

## Client to Gateway, additional security

Gateway enables you to adapt the security protocol to your liking.

For example, you may want to encrypt on top on a `SASL_PLAINTEXT` Kafka. Compare the Gateway security protocol to the Kafka security protocol. 

```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.2.2
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092
      KAFKA_SASL_MECHANISM: PLAIN
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
      KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required  username="x" password="y";
      GATEWAY_SECURITY_PROTOCOL: SASL_SSL
      GATEWAY_SSL_KEY_STORE_PATH: /keystores/gateway.keystore.jks
      GATEWAY_SSL_KEY_STORE_PASSWORD: 123456
      GATEWAY_SSL_KEY_PASSWORD: 123456
      GATEWAY_SSL_KEY_TYPE: jks
      volumes:
        - type: bind
          source: "./jks"
          target: /jks
          read_only: true
```

:::caution

Don't forget to add a volume bind, so Conduktor Gateway can access your `jks` files

:::


## mTLS

To enable `mTLS` for the `SASL_SSL` security protocol please set the environment variable `GATEWAY_SSL_CLIENT_AUTH` to `REQUIRE`.  
For `SSL` see [the section below](#ssl-mechanism).

If you are using certificates signed with local authorities authority, you'll need to also setup truststore in the Gateway as described in the  [environment variables](/gateway/configuration/env-variables/#ssl) page and the example below.

```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.2.2
    environment:
      GATEWAY_SECURITY_PROTOCOL: SASL_SSL
      GATEWAY_SSL_CLIENT_AUTH: REQUIRE
      GATEWAY_SSL_KEY_STORE_PATH: /config/keystore.jks
      GATEWAY_SSL_KEY_STORE_PASSWORD: 123456
      GATEWAY_SSL_KEY_PASSWORD: 123456
      GATEWAY_SSL_KEY_TYPE: pkcs12
      GATEWAY_SSL_TRUST_STORE_PATH: /config/truststore.jks
      GATEWAY_SSL_TRUST_STORE_PASSWORD: 123456
      GATEWAY_SSL_TRUST_STORE_TYPE: pkcs12
```


## Client to Gateway, with virtual clusters

To put Gateway in multi-tenancy mode, and to work with virtual clusters;
1. Set the environemnt variable `GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: true`
1. Create a username to connect to the virtual cluster, through the admin API
1. Update your client to use this username when connecting

These steps are detailed below, with the username creation being dependent on your security requirements.

Virtual cluster mode supports;
* `PLAINTEXT`
* `SASL_PLAINTEXT`
* `SASL_SSL` (with `mTLS` option)
* `SSL`

![tenant-user.png](./images/gw-security/tenant-user-london.png)

### Enable virtual clusters with the environment variables
```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.2.2
    environment:
      GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: true
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092
      KAFKA_SASL_MECHANISM: PLAIN
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
      KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required  username="admin" password="admin-secret";
```
Scroll or jump to which type of setup you have for creating a username;
* [Plain user/password mechanisms](#sasl-plain-userpassword-mechanism)
* [SASL oauthbearer mechanism](#sasl-oauthbearer-mechanism)
* [SASL_SSL with mTLS, see the above section on mTLS](#mtls)
* [SSL](#ssl-mechanism)

### Plain user/password mechanism

SASL PLAIN or PLAINTEXT.

#### Create a username
A `POST` call to the admin API creates a username for a virtual cluster, the response is the credentials. e.g. Creating a username `sa` for vcluster `london`. See the [API documentation](https://developers.conduktor.io/) for more information.

```bash
curl \
    --request POST "conduktor-gateway:8888/admin/vclusters/v1/vcluster/london/username/sa" \
    --user 'admin:conduktor' \
    --header 'Content-Type: application/json' \
    --data-raw '{"lifeTimeSeconds": 7776000}'
```

This will respond with a token similar to this:

```json
{
  "token" : "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJsb25kb24iLCJleHAiOjE3MDAwNTM3OTN9.Db7Yrml__sU9LFApHCx2S5WG3IVhqbCM-Yu4wLcmSl0"
}
```
Which contains:

```json
{
  "username": "sa",
  "vcluster": "london",
  "exp": 1700053793
}
```

#### Update your client to connect to the virtual cluster

The token should be provided in the **password** field of the client configuration, such as in a properties file `london-sa.properties`, as follows:

```properties
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="sa" password="eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJsb25kb24iLCJleHAiOjE3MDAwNTM3OTN9.Db7Yrml__sU9LFApHCx2S5WG3IVhqbCM-Yu4wLcmSl0";
```

You are then connecting to the virtual cluster with that username and can perform commands as you please e.g.
listing topics in the virtual cluster `london` from the username `sa`.

```bash
kafka-topics \
  --bootstrap-server conduktor-gateway:6969 \
  --command-config /clientConfig/london-sa.properties \
  --list
```

### SASL OAuthbearer mechanism

Conduktor gateway support OAuth authentification by leveraging OAuthbearer SASL mechanism. For this type of connection you will need a OpenID provider exposing public keys.

Configuration instructions are provided for Gateway and for the client.

#### Configure Gateway to support OAuthbearer with environemnt variables

```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.2.2
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092
      KAFKA_SASL_MECHANISM: PLAIN
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
      KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required  username="admin" password="admin-secret";
      GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: true
      GATEWAY_OAUTH_JWKS_URL: <YOUR_OIDC_PROVIDER_JWKS_URL|YOUR+JWKS_FILE_URL>
      GATEWAY_OAUTH_EXPECTED_ISSUER: <YOUR_OIDC_ISSUER>
```

If the generated token by the provider defines an `aud` header, provide the list of supported audiences with the environment variable `GATEWAY_OAUTH_EXPECTED_AUDIENCES`.  
Example :`GATEWAY_OAUTH_EXPECTED_AUDIENCES: [audience1, audience2]`

#### Configure your client to connect to Gateway using OAuthbearer

Your client will connect through an OAuth provider using a grant credentials flow to create a token, to be sent to Gateway. This token will be verified based on the configuration below.

```
sasl.mechanism=OAUTHBEARER
sasl.login.callback.handler.class=org.apache.kafka.common.security.oauthbearer.secured.OAuthBearerLoginCallbackHandler
sasl.oauthbearer.token.endpoint.url=<YOUR_OIDC_PROVIDER_TOKEN_URL>
sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required clientId="<CLIENT_ID>" clientSecret="<CLIENT_SECRET>" scope="email";
```

#### Customize the virtual cluster, OAuth

By default the virtual cluster will be equal to the subject of the token.  
This could be modified by adding specific claims in the token to be sent to Gateway.

The virtual cluster could be defined for a token using the `gateway.vcluster` claim.
You can also override the user from the subject by defining a `gateway.username` claim.

If you can't specify claims yourself, there is an alternative to map `username` to `vcluster`. We can instead map the claim through the Gateway API, user mappings.
In the below example you are mapping the username, `conduktor` to the vcluster, `my-vcluster`. See the [API documentation](https://developers.conduktor.io/) for more information.

```
curl --location 'http://localhost:8888/admin/userMappings/v1/vcluster/my-vcluster' \
--header 'Content-Type: application/json' \
--user "admin:conduktor" \
--data '{
    "username": "conduktor"
}'
```

### SSL mechanism

#### Configure Gateway to support OAuthbearer with environemnt variables

A similar configuration to the [mTLS, SASL_SSL section](#mtls), described above, is used for SSL.

If you are using certificates signed with local authorities authority, you'll need to also setup truststore in the Gateway as described in the  [environment variables](/gateway/configuration/env-variables/#ssl) page and the example below.

```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.2.2
    environment:
      GATEWAY_SECURITY_PROTOCOL: SSL
      GATEWAY_SSL_CLIENT_AUTH: REQUIRE
      GATEWAY_SSL_KEY_STORE_PATH: /config/keystore.jks
      GATEWAY_SSL_KEY_STORE_PASSWORD: 123456
      GATEWAY_SSL_KEY_PASSWORD: 123456
      GATEWAY_SSL_KEY_TYPE: pkcs12
      GATEWAY_SSL_TRUST_STORE_PATH: /config/truststore.jks
      GATEWAY_SSL_TRUST_STORE_PASSWORD: 123456
      GATEWAY_SSL_TRUST_STORE_TYPE: pkcs12
```
#### Configure your client to connect to Gateway using SSL

Configure as you typically would your client, for example:

```properties
  bootstrap.servers=localhost:6969
  security.protocol=SSL
  ssl.truststore.location=.../truststore.jks
  ssl.truststore.password=123456
  ssl.keystore.location=.../keystore.jks
  ssl.keystore.password=123456
```

#### Customize the virtual cluster, SSL

Similar to the OAuth setup described [above](#customize-the-virtual-cluster-oauth) but using the Common Name(CN) as the username.
