---
sidebar_position: 3
title: Client to Gateway Configuration
description: Securing Conduktor Gateway
---

![client-to-gateway-excalidraw](./images/gw-security/gateway-security-excalidraw.png)

## Your client to Gateway security
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
    image: conduktor/conduktor-gateway:2.3.0
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
    image: conduktor/conduktor-gateway:2.3.0
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

![tenant-user.png](images/gw-security/tenant-user-london.png)

### Enable virtual clusters with the environment variables
```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.3.0
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
* [SASL_SSL with mTLS, see the section on mTLS](#sasl_ssl)
* [SSL](#ssl-mechanism)

### Plain user/password mechanisms

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
    image: conduktor/conduktor-gateway:2.3.0
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
## SASL_SSL

To enable `mTLS` for the `SASL_SSL` security protocol please set the environment variable `GATEWAY_SSL_CLIENT_AUTH` to `REQUIRE`.  
For `SSL` see [the section below](#ssl-mechanism).

If you are using certificates signed with local authorities authority, you'll need to also setup truststore in the Gateway as described in the  [environment variables](/gateway/configuration/env-variables/#ssl) page and the example below.

```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.3.0
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

### SSL mechanism

#### Configure Gateway to support SSL with environemnt variables

A similar configuration to the [SASL_SSL section](#sasl_ssl), described above, is used for SSL.

If you are using certificates signed with local authorities authority, you'll need to also setup truststore in the Gateway as described in the  [environment variables](/gateway/configuration/env-variables/#ssl) page and the example below.

```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.3.0
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


# Client to Gateway Authentication OLD

![image.png](../medias/clientsauth.png)

As with Kafka brokers, Gateway brokers support multiple security schemes for Kafka clients to connect with. Each section has specific details of the options available, how they work and how to configure them. The nature of your system's requirements, design and constraints will lead you to pick the most suitable option when working with our lovely experts as part of setting up Gateway with you.

The authentication phase on Gateway is part of the initial communication handling by Gateway to handshake, and authenticate, a Kafka client. This phase manages the encryption of the network communication and how to identify a client.

All open connections in Gateway result in a `Principal` that represents the authenticated identity of the Kafka client.

We can split this authentication and security configuration into two aspects

-   Security protocol
-   Authentication mechanism

Security protocol defines how a Kafka client and Gateway broker should communicate and secure the connection. *How do we talk to each other, do we need to authenticate?.*
Authentication mechanism on the other hand is the part defining how a client can authenticate it self when opening the connection. *How do we know each other?*

Here is a quick explanation of each supported security protocol:
* **PLAINTEXT**: Brokers don't need client authentication; all communication is exchanged without network security.
* **SSL**: With SSL-only clients don't need any client authentication but communication between the client and Gateway broker will be encrypted.
* **mTLS**: This security protocol is not originally intended to provide authentication, but you can use the mTLS option below to enable an authentication. mTLS leverages SSL mutual authentication to identify a Kafka client.
  `Principal` for mTLS connection can be detected from the subject certificate using the same feature as in Apache Kafka, the [SSL principal mapping](https://docs.confluent.io/platform/current/kafka/configure-mds/mutual-tls-auth-rbac.html#principal-mapping-rules-for-tls-ssl-listeners-extract-a-principal-from-a-certificate).
* **SASL PLAINTEXT**: Brokers don't need any client authentication and all communication is exchanged without any network security.
* **SASL SSL**: Authentication from the client is mandatory against Gateway and communication will be encrypted using TLS.
* **DELEGATED_SASL_PLAINTEXT**: Authentication from the client is mandatory but will be forwarded to Kafka for checking. Gateway will intercept exchanged authentication data to detect authenticated principals.
  All communication  between the client and gateway broker is exchanged without any network security.
  All credentials are managed by your backend kafka, we only provide authorization on the Gateway side based on the exchanged principal.


## Supported security protocols and authentication mechanisms

|                                                     | **_Clients ⟶ GW transit in plaintext_**                                                                           | **_Clients ⟶ GW transit is encrypted_**                                                               |
| --------------------------------------------------- |-------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| **_Anonymous access only_**                         | Security protocol: `PLAINTEXT`<br />Authentication mechanism: `None`                                                   | Security protocol: `SSL`<br />Authentication mechanism: `None`                                              |
| **_Credentials managed by Gateway_**                | Security protocol: `SASL_PLAINTEXT`<br />Authentication mechanism: `PLAIN`                                             | Security protocol: `SASL_SSL`<br />Authentication mechanism: `PLAIN`                                        |
| **_Gateway configured with Oauth_**                 | Security protocol: `SASL_PLAINTEXT`<br />Authentication mechanism: `OAUTHBEARER`                                       | Security protocol: `SASL_SSL`<br />Authentication mechanism: `OAUTHBEARER`                                  |
| **_Clients are identified by certificates (mTLS)_** | Not possible (mTLS means encryption)                                                                              | Security protocol: `SSL`<br />Authentication mechanism: `MTLS`                                              |
| **_Credentials managed by Kafka_**                  | Security protocol: `DELEGATED_SASL_PLAINTEXT`<br />Authentication mechanism: `PLAIN` or `SCRAM-SHA-256` or `SCRAM-SHA-512` | Security protocol: `DELEGATED_SASL_SSL`<br />Authentication mechanism: `PLAIN` or `SCRAM-SHA-256` or `SCRAM-SHA-512` |

# Security protocol

Gateway broker security scheme is defined by the `GATEWAY_SECURITY_PROTOCOL` configuration.

Gateway supports all the security protocols as Apache Kafka does, you can find further information regarding what they are on the [Apache Kafka documentation](https://kafka.apache.org/documentation/#listener_configuration). In addition, Gateway adds two new security protocols `DELEGATED_SASL_PLAINTEXT` and `DELEGATED_SASL_SSL` , as mentioned for delegating to Kafka.

## Plaintext

Brokers don't need any client authentication and all communication is exchanged without any network security.

Example:

```properties
bootstrap.servers=your.kafka.broker.hostname:9092
security.protocol=PLAINTEXT
```

## SSL

With SSL only clients don't need any client authentication, but communication between client and Gateway broker will be encrypted.

Example:

```properties
bootstrap.servers=your.kafka.broker.hostname:9093
security.protocol=SSL
ssl.truststore.location=/path/to/your/truststore.jks
ssl.truststore.password=yourTruststorePassword
ssl.protocol=TLSv1.3
```

The truststore contains certificates from trusted Certificate Authorities (CAs) used to verify the broker's SSL certificate (more info on jks truststores [here](https://docs.oracle.com/cd/E19509-01/820-3503/6nf1il6er/index.html)).

### mTLS

This security protocol is not originally intended to provide authentication, but you can use the mTLS option below to enable an authentication.

mTLS leverages SSL mutual authentication to identify a Kafka client.

`Principal` for mTLS connection can be detected from the subject certificate using the same feature as Apache Kafka the [SSL principal mapping](https://docs.confluent.io/platform/current/kafka/configure-mds/mutual-tls-auth-rbac.html#principal-mapping-rules-for-tls-ssl-listeners-extract-a-principal-from-a-certificate) .

Example of mTLS configuration:

```properties
bootstrap.servers=your.kafka.broker.hostname:9093
security.protocol=SSL
ssl.keystore.type=PEM
ssl.keystore.key=/path/to/your/client.key
ssl.keystore.certificate.chain=/path/to/your/client.crt
ssl.truststore.type=PEM
ssl.truststore.certificates=/path/to/your/ca.crt
ssl.protocol=TLSv1.3
ssl.client.auth=required
```

The server CA certificate here is provided as a PEM file as well as the client's certificates (_ssl.keystore.xx_ keys). Jks could also be used for both client and server side authentication.

## SASL_PLAINTEXT

Authentication from client is mandatory against Gateway but all communications are exchanged without any network security.

### Plain

Plain mechanism uses Username/Password credentials to authenticate credentials against Gateway.

Plain credentials are managed in Gateway using the HTTP API.

```properties
bootstrap.servers=your.kafka.broker.hostname:9092
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required \
  username="yourUsername" \
  password="yourPassword";
```

<u>_Note on the password :_</u>

It must contain a token that is obtained by a Gateway admin via the HTTP API as follows:

```bash
 curl \                                                                                                   --silent \
    --request POST "http://your.gateway.url:8888/admin/vclusters/v1/vcluster/passthrough/username/jdoe" \
    --user "admin:conduktor" \
    --header 'Content-Type: application/json' \
    --data-raw '{"lifeTimeSeconds": 7776000}' \
    | jq -r ".token"
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Impkb2UiLCJ2Y2x1c3RlciI6InBhc3N0aHJvdWdoIiwiZXhwIjoxNzE3NjY5NTA1fQ.9YXuxZFzMEs_-HZR8t3L39LhAVK8PJsIb5X_bHsfUEA

```

The JWT payload contains the username, the vCluster and the expiration date:

```bash
➜ echo -n 'eyJ1c2VybmFtZSI6Impkb2UiLCJ2Y2x1c3RlciI6InBhc3N0aHJvdWdoIiwiZXhwIjoxNzE3NjY5NDA4fQ' | base64 -di
{"username":"jdoe","vcluster":"passthrough","exp":1717669408}
```

### OAuthbearer

Oauthbearer uses a OAuth2/OIDC security provider to authenticate a token in Gateway.

The Oauth credentials base is managed in the configured provider.

This mechanism will also allow you to verify some claims from your OIDC provider ( `audience` and `issuer` ).

```properties
bootstrap.servers=your.kafka.broker.hostname:9092
security.protocol=SASL_SSL
sasl.mechanism=OAUTHBEARER
sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required \
  oauth.token.endpoint.uri="https://auth.gcn.nasa.gov/oauth2/token" \
  clientId="yourClientId" \
  clientSecret="yourClientSecret" \
  oauth.audience="yourAudience";
sasl.oauthbearer.token.endpoint.url=https://your.oauthserver.url/oauth2/token
sasl.login.callback.handler.class=org.apache.kafka.common.security.oauthbearer.secured.OAuthBearerLoginCallbackHandler
```

## SASL_SSL

Authentication from client is mandatory against Gateway and communication will be encrypted using TLS.

Supported authentication mechanisms

-   Plain
-   OAuthBearer

### Plain

Plain mechanism use Username/Password credentials to authenticate credentials against Gateway.

Plain credentials are managed in Gateway using the HTTP API.

```properties
bootstrap.servers=your.kafka.broker.hostname:9093
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
ssl.truststore.location=/path/to/your/truststore.jks
ssl.truststore.password=yourTruststorePassword
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required \
  username="yourUsername" \
  password="yourPassword";
```

### OAuthbearer

Oauthbearer uses a OAuth2/OIDC security provider to authenticate a token in Gateway.

The Oauth credentials base is managed in the configured provider.

This mechanism will also allow you to verify some claims from your OIDC provider ( `audience` and `issuer` )

```properties
    bootstrap.servers=your.kafka.broker.hostname:9093
    security.protocol=SASL_SSL
    sasl.mechanism=OAUTHBEARER
    sasl.login.callback.handler.class=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule
    ssl.truststore.location=/path/to/your/truststore.jks
    ssl.truststore.password=yourTruststorePassword
    sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required \
      oauth.token.endpoint.uri="https://your.authorization.server/oauth/token" \
      oauth.client.id="yourClientId" \
      oauth.client.secret="yourClientSecret" \
      oauth.scope="requiredScope";
```

## DELEGATED_SASL_PLAINTEXT

Authentication from client is mandatory but will be forwarded to Kafka for checking. Gateway will intercept exchanged authentication data to detect an authenticated principal.

All communication between the client and Gateway broker are exchanged without any network security.

All credentials are managed by your backing Kafka, we only provide Authorization on the Gateway side based on the exchanged principal.

Supported authentication mechanisms on the backing Kafka are:

-   Plain
-   Scram-sha-256
-   Scram-sha-512

## DELEGATED_SASL_SSL

Authentication from the client is mandatory but will be forwarded to Kafka. Gateway will intercept exchanged authentication data to detect an authenticated principal.

All communication between the client and Gateway broker will be encrypted using TLS.

All credentials are managed by your backing Kafka, we only provide Authorization on the Gateway side based on the exchanged principal.

Supported authentication mechanisms on the backing Kafka are:

-   Plain
-   Scram-sha-256
-   Scram-sha-512

# Automatic security protocol detection (Default behavior)

On startup Gateway will attempt to detect the security protocol to use based on the Kafka configuration if you don't specify any security protocol.

If there is also no security protocol on the backing Kafka cluster, then we set the security protocol to `PLAINTEXT` by default.

Here is our mapping from the Kafka cluster's defined protocol:

| Kafka cluster security protocol | Gateway cluster inferred security protocol |
| ------------------------------- | ------------------------------------------ |
| SASL_SSL                        | DELEGATED_SASL_SSL                         |
| SASL_PLAINTEXT                  | DELEGATED_SASL_PLAINTEXT                   |
| SSL                             | SSL                                        |
| PLAINTEXT                       | PLAINTEXT                                  |

For reference you can always see the inferred security protocol on the startup log of Gateway .

```
2024-03-07T15:40:12.260+0100 [      main] [INFO ] [Bootstrap:70] - Computed configuration :
---
gatewayClusterId: "gateway"
...
authenticationConfig:
  securityProtocol: "SASL_PLAINTEXT"
  sslConfig:
...

```

# Re authentication support

We support Apache Kafka Re authentication as Kafka brokers.

See [KIP-368](https://cwiki.apache.org/confluence/display/KAFKA/KIP-368%3A+Allow+SASL+Connections+to+Periodically+Re-Authenticate) for more details

