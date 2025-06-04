---
sidebar_position: 2
title: Client to Gateway Configuration
description: Securing Conduktor Gateway
toc_min_heading_level: 2
toc_max_heading_level: 5
---

![Client to Gateway security](images/client-to-gateway-security.png)

Gateway brokers support multiple security schemes for Kafka clients to connect with. Each section has specific details of the available options, how they work and how to configure them. 

Pick the most suitable option based on the nature of your system's requirements, design and constraints.

The authentication phase on Gateway is part of the initial communication handling by Gateway to handshake, and authenticate, a Kafka client. This phase manages the encryption of the network communication and how to identify a client.

All open connections in Gateway result in a `Principal` that represents the authenticated identity of the Kafka client.

We can split this authentication and security configuration into three aspects

- Security mode
- Security protocol
- Authentication mechanism

Security Mode defines who is responsible for handling the authentication process in your system. *Who is managing credentials, your backend Kafka or Gateway?*

Security protocol defines how a Kafka client and Gateway broker should communicate and secure the connection. *How do we talk to each other, do we need to authenticate?.*

Authentication mechanism on the other hand is the part defining how a client can authenticate itself when opening the connection. *How do we know each other?*

Here is a quick explanation of each supported security mode and security protocol:

**GATEWAY MANAGED**

* **PLAINTEXT**: Brokers don't need client authentication; all communication is exchanged without network security.
* **SSL**: With SSL-only clients don't need any client authentication but communication between the client and Gateway broker will be encrypted.
* **mTLS**: This security protocol is not originally intended to provide authentication, but you can use the mTLS option below to enable an authentication. mTLS leverages SSL mutual authentication to identify a Kafka client.
  `Principal` for mTLS connection can be detected from the subject certificate using the same feature as in Apache Kafka, the [SSL principal mapping](https://docs.confluent.io/platform/current/kafka/configure-mds/mutual-tls-auth-rbac.html#principal-mapping-rules-for-tls-ssl-listeners-extract-a-principal-from-a-certificate).
* **SASL PLAINTEXT**: Brokers don't need any client authentication and all communication is exchanged without any network security.
* **SASL SSL**: Authentication from the client is mandatory against Gateway and communication will be encrypted using TLS.

**KAFKA MANAGED**
* **SASL_PLAINTEXT**: Authentication from the client is mandatory but will be forwarded to the back end Kafka for validation. Gateway will intercept exchanged authentication data to detect authenticated principals.
  All communication  between the client and gateway broker is exchanged without any network security.
  All credentials are managed by your backend kafka, we only provide authorization on the Gateway side based on the exchanged principal.
* **SASL_SSL**: Authentication from the client is mandatory and will be forwarded to the backend Kafka cluster for validation. All communication between the client and the Gateway broker is encrypted using TLS. The Gateway will intercept the SASL authentication exchange to detect authenticated principals. 
All credentials are managed by your backend Kafka.

## Overview

|                                                     | **_Clients ⟶ GW transit in plaintext_**                                                                                                                                              | **_Clients ⟶ GW transit is encrypted_**                                                                                                                              |
|-----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **_Anonymous access only_**                         | Security Mode: `GATEWAY_MANAGED` Security protocol: `PLAINTEXT`<br />Authentication mechanism: `None`                                                                                | Security Mode: `GATEWAY_MANAGED` Security protocol: `SSL`<br />Authentication mechanism: `None`                                                                      |
| **_Credentials managed by Gateway_**                | Security Mode: `GATEWAY_MANAGED` Security protocol: `SASL_PLAINTEXT`<br />Authentication mechanism: `PLAIN`                                                                          | Security Mode: `GATEWAY_MANAGED` Security protocol: `SASL_SSL`<br />Authentication mechanism: `PLAIN`                                                                |
| **_Gateway configured with OAuth_**                 | Security Mode: `GATEWAY_MANAGED` Security protocol: `SASL_PLAINTEXT`<br />Authentication mechanism: `OAUTHBEARER`                                                                    | Security Mode: `GATEWAY_MANAGED` Security protocol: `SASL_SSL`<br />Authentication mechanism: `OAUTHBEARER`                                                          |
| **_Clients are identified by certificates (mTLS)_** | Not possible (mTLS means encryption)                                                                                                                                                 | Security Mode: `GATEWAY_MANAGED` Security protocol: `SSL`<br />Authentication mechanism: `MTLS`                                                                      |
| **_Credentials managed by Kafka_**                  | Security Mode: `KAFKA_MANAGED` Security protocol: `SASL_PLAINTEXT`<br />Authentication mechanism: `PLAIN`, `SCRAM-SHA-256`, `SCRAM-SHA-512`, `OAUTHBEARER` or`AWS_MSK_IAM` | Security mode: `KAFKA_MANAGED` Security protocol: `SASL_SSL`<br />Authentication mechanism: `PLAIN`, `SCRAM-SHA-256`, `SCRAM-SHA-512`, `OAUTHBEARER` or`AWS_MSK_IAM` |

## Security Mode

:::info
As of [Gateway 3.10.0](/changelog/Gateway-3.10.0)
:::

The Gateway security mode is defined by the `GATEWAY_SECURITY_MODE` configuration. This will define whether the Gateway will manage your credentials, `GATEWAY_MANAGED`, or your back end kafka cluster, `KAFKA_MANAGED`.

## Security protocol

The Gateway broker security scheme is defined by the `GATEWAY_SECURITY_PROTOCOL` configuration.  

Note that you don't set an authentication mechanism on the client to Gateway side of the proxy, i.e. `GATEWAY_SASL_MECHANISM` **does not exist and is never configured by the user**. 

Instead, Gateway will try to authenticate the client as it presents itself. For example, if a client is using `OAUTHBEARER`, Gateway will use the OAuth configuration to try to authenticate it.  
If a client arrives using `PLAIN` then Gateway will try to use either the SSL configuration or validate the token itself, depending on the security protocol.

⚠️In addition to all the security protocols that [Apache Kafka supports](https://kafka.apache.org/documentation/#listener_configuration), Gateway adds two new protocols:`DELEGATED_SASL_PLAINTEXT` and `DELEGATED_SASL_SSL` for delegating to Kafka.⚠️

> ⚠️ As of [Gateway 3.10.0](/changelog/Gateway-3.10.0), the `DELEGATED_XXX` security protocols have been deprecated in favour of additional environment variable `GATEWAY_SECURITY_MODE`.
>
> These values remain supported for backward compatibility but are no longer recommended for new configurations.
>
> If you are using DELEGATED security protocols review the [Security Mode Migration Guide](/gateway/how-to/migration-guide-to-security-mode) before proceeding.

### PLAINTEXT

There is no client authentication to Gateway and all communication is exchanged without any network security.

Gateway configuration:

```yaml
GATEWAY_SECURITY_PROTOCOL: PLAINTEXT
```

Client configuration:

```properties
bootstrap.servers=your.gateway.hostname:9092
security.protocol=PLAINTEXT
```

### SSL

With SSL only, there is no client authentication, but communication between the client and Gateway broker will be encrypted.

Gateway configuration:

```yaml
GATEWAY_SECURITY_PROTOCOL: SSL
GATEWAY_SSL_KEY_STORE_PATH: /path/to/your/keystore.jks        
GATEWAY_SSL_KEY_STORE_PASSWORD: yourKeystorePassword
GATEWAY_SSL_KEY_PASSWORD: yourKeyPassword
```


Client configuration:

```properties
bootstrap.servers=your.gateway.hostname:9092
security.protocol=SSL
ssl.truststore.location=/path/to/your/truststore.jks
ssl.truststore.password=yourTruststorePassword
ssl.protocol=TLSv1.3
```

The truststore contains certificates from trusted Certificate Authorities (CAs) used to verify the Gateway's TLS certificate, which is stored in the keystore. 
More info on jks truststores [here](https://docs.oracle.com/cd/E19509-01/820-3503/6nf1il6er/index.html).

#### Mutual TLS (mTLS)

Mutual TLS leverages client side certificates to authenticate a Kafka client.

`Principal` for an mTLS connection can be detected from the subject of the certificate using the same feature as Apache Kafka, the [SSL principal mapping](https://docs.confluent.io/platform/current/kafka/configure-mds/mutual-tls-auth-rbac.html#principal-mapping-rules-for-tls-ssl-listeners-extract-a-principal-from-a-certificate) .

Gateway configuration:

```yaml
GATEWAY_SECURITY_PROTOCOL: SSL
GATEWAY_SSL_CLIENT_AUTH: REQUIRE
GATEWAY_SSL_KEY_STORE_PATH: /path/to/your/keystore.jks        
GATEWAY_SSL_KEY_STORE_PASSWORD: yourKeystorePassword
GATEWAY_SSL_KEY_PASSWORD: yourKeyPassword
GATEWAY_SSL_TRUST_STORE_PATH: /path/to/your/truststore.jks
GATEWAY_SSL_TRUST_STORE_PASSWORD: yourTrustStorePassword
```

Client configuration:

```properties
bootstrap.servers=your.gateway.hostname:9093
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

### SASL_PLAINTEXT

Authentication from the client is mandatory against Gateway but all communications are exchanged without any network security.
Gateway supports Plain and OAuthbearer SASL mechanisms.

#### Plain

Plain mechanism uses Username/Password credentials to authenticate credentials against Gateway.

Plain credentials take the form of a JWT token, these are managed in Gateway using the Admin (HTTP) API. See below for the creation of tokens.

Gateway configuration:

```yaml
GATEWAY_SECURITY_PROTOCOL: SASL_PLAINTEXT
GATEWAY_USER_POOL_SECRET_KEY: yourRandom256bitKeyUsedToSignTokens
```

The`GATEWAY_USER_POOL_SECRET_KEY` **has to be** set to a random base64 encoded value of 256bits long to ensure that tokens aren't forged. For example: `openssl rand -base64 32`. This must be set, a default value will not be provided.

Client configuration:

```properties
bootstrap.servers=your.gateway.hostname:9092
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required \
  username="yourUsername" \
  password="yourToken";
```

<u>_Note on the password :_</u>

It must be a token that is obtained by a Gateway admin via the Admin (HTTP) API as follows.

1. Create the service account, the username

Request:

```bash
curl \
  --request PUT \
  --url 'http://localhost:8888/gateway/v2/service-account' \
  --user admin:conduktor \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "kind" : "GatewayServiceAccount",
    "apiVersion" : "gateway/v2",
    "metadata" : {
      "name" : "jdoe",
      "vCluster" : "passthrough"
    },
    "spec" : { "type" : "LOCAL" }
  }'
```

Response:

```json
{
  "resource" : {
    "kind" : "GatewayServiceAccount",
    "apiVersion" : "gateway/v2",
    "metadata" : {
      "name" : "jdoe",
      "vCluster" : "passthrough"
    },
    "spec" : {
      "type" : "LOCAL"
    }
  },
  "upsertResult" : "CREATED"
}
```

2. Generate a token for the service account, the password
Request:

```bash
curl \
  --silent \
  --request POST \
  --url 'http://localhost:8888/gateway/v2/token' \
  --header 'Authorization: Basic YWRtaW46Y29uZHVrdG9y' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "username": "jdoe",
    "vCluster": "passthrough",
    "lifeTimeSeconds": 3600000
  }'
```

```json
{"token":"eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Impkb2UiLCJ2Y2x1c3RlciI6InBhc3N0aHJvdWdoIiwiZXhwIjoxNzQ1MzY1OTcxfQ.zPPiD17MiRnXyHJw07Cx4SKPySDi_ErJrXmi5BycR04"}
```

The token conforms to the JWT token specification.
The JWT payload contains the username, the vCluster and the expiration date:

```bash
jwt decode eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Impkb2UiLCJ2Y2x1c3RlciI6InBhc3N0aHJvdWdoIiwiZXhwIjoxNzQ1MzY1OTcxfQ.zPPiD17MiRnXyHJw07Cx4SKPySDi_ErJrXmi5BycR04

Token claims
------------
{
  "exp": 1745365971,
  "username": "jdoe",
  "vcluster": "passthrough"
}
```

#### OAuthbearer

Oauthbearer uses a OAuth2/OIDC security provider to authenticate a token in Gateway.

The Oauth credentials base is managed in the configured provider.

This mechanism will also allow you to verify some claims from your OIDC provider ( `audience` and `issuer` ).

Gateway configuration:

```yaml
GATEWAY_SECURITY_PROTOCOL: SASL_PLAINTEXT
GATEWAY_OAUTH_JWKS_URL: https://login.microsoftonline.com/common/discovery/keys
GATEWAY_OAUTH_EXPECTED_ISSUER: https://sts.windows.net/xxxxxxxx-df00-48cd-805b-1ebe914e8b11/
GATEWAY_OAUTH_EXPECTED_AUDIENCES: "[00000002-0000-0000-c000-000000000000]"    
```

Client configuration:

```properties
bootstrap.servers=your.gateway.hostname:9092
security.protocol=SASL_PLAINTEXT
sasl.mechanism=OAUTHBEARER
sasl.login.callback.handler.class=org.apache.kafka.common.security.oauthbearer.secured.OAuthBearerLoginCallbackHandler
sasl.oauthbearer.token.endpoint.url=https://login.microsoftonline.com/xxxxxxxx-df00-48cd-805b-1ebe914e8b11/oauth2/token
sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required \
 clientId="yourClientID" \
  clientSecret="yourClientSecret" \
  scope=".default";
```

### SASL_SSL

Authentication from client is mandatory against Gateway and communication will be encrypted using TLS.

Supported authentication mechanisms:

- PLAIN
- OAUTHBEARER

#### Plain

Plain mechanism use Username/Password credentials to authenticate credentials against Gateway.

Plain credentials are managed in Gateway using the HTTP API.

Gateway configuration:

```yaml
GATEWAY_SECURITY_PROTOCOL: SASL_SSL
GATEWAY_USER_POOL_SECRET_KEY: yourRandom256bitKeyUsedToSignTokens
GATEWAY_SSL_KEY_STORE_PATH: /path/to/your/keystore.jks        
GATEWAY_SSL_KEY_STORE_PASSWORD: yourKeystorePassword
GATEWAY_SSL_KEY_PASSWORD: yourKeyPassword
```

You must set `GATEWAY_USER_POOL_SECRET_KEY` to a random value to ensure that tokens cannot be forged.

Client configuration:

```properties
bootstrap.servers=your.gateway.hostname:9093
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
ssl.truststore.location=/path/to/your/truststore.jks
ssl.truststore.password=yourTruststorePassword
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required \
  username="yourUsername" \
  password="yourToken";
```

See section above for requirements on how to create tokens using the Admin (HTTP) API.

#### OAuthbearer

Oauthbearer uses a OAuth2/OIDC security provider to authenticate a token in Gateway.

The Oauth credentials base is managed in the configured provider.

This mechanism will also allow you to verify some claims from your OIDC provider ( `audience` and `issuer` )

Gateway configuration:

```yaml
GATEWAY_SECURITY_PROTOCOL: SASL_SSL
GATEWAY_OAUTH_JWKS_URL: https://login.microsoftonline.com/common/discovery/keys
GATEWAY_OAUTH_EXPECTED_ISSUER: https://sts.windows.net/xxxxxxxx-df00-48cd-805b-1ebe914e8b11/
GATEWAY_OAUTH_EXPECTED_AUDIENCES: "[00000002-0000-0000-c000-000000000000]"  
GATEWAY_SSL_KEY_STORE_PATH: /path/to/your/keystore.jks        
GATEWAY_SSL_KEY_STORE_PASSWORD: yourKeystorePassword
GATEWAY_SSL_KEY_PASSWORD: yourKeyPassword
````

Client configuration:

```properties
bootstrap.servers=your.gateway.hostname:9092
security.protocol=SASL_SSL
sasl.mechanism=OAUTHBEARER
ssl.truststore.location=/path/to/your/truststore.jks
ssl.truststore.password=yourTruststorePassword
sasl.login.callback.handler.class=org.apache.kafka.common.security.oauthbearer.secured.OAuthBearerLoginCallbackHandler
sasl.oauthbearer.token.endpoint.url=https://login.microsoftonline.com/xxxxxxxx-df00-48cd-805b-1ebe914e8b11/oauth2/token
sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required \
  clientId="yourClientID" \
  clientSecret="yourClientSecret" \
  scope=".default";
```

### ⚠️ DELEGATED_SASL_PLAINTEXT (Deprecated)

> As of [Gateway 3.10.0](/changelog/Gateway-3.10.0), the `DELEGATED_XXX` security protocols have been deprecated in favour of additional environment variable `GATEWAY_SECURITY_MODE`.
>
> These values remain supported for backward compatibility but are no longer recommended for new configurations.
>
> If you are using DELEGATED security protocols review the [Security Mode Migration Guide](/gateway/how-to/migration-guide-to-security-mode) before proceeding.



Authentication from client is mandatory but will be forwarded to Kafka for checking. Gateway will intercept exchanged authentication data to detect an authenticated principal.

All communication between the client and Gateway broker are exchanged without any network security.

All credentials are managed by your backing Kafka, we only provide Authorization on the Gateway side based on the exchanged principal.

Supported authentication mechanisms on the backing Kafka are:

- PLAIN
- SCRAM-SHA-256
- SCRAM-SHA-512
- OAUTHBEARER
- AWS_MSK_IAM

Gateway configuration:
Using PLAIN, as used for example on Confluent Cloud:

```yaml
GATEWAY_SECURITY_PROTOCOL: DELEGATED_SASL_PLAINTEXT
```

Client configuration:

```properties
bootstrap.servers=your.gateway.hostname:9092
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="yourKafkaUser" password="yourKafkaPassword";
```

### ⚠️ DELEGATED_SASL_SSL (Deprecated)

> As of [Gateway 3.10.0](/changelog/Gateway-3.10.0), the `DELEGATED_XXX` security protocols have been deprecated in favour of additional environment variable `GATEWAY_SECURITY_MODE`.
>
> These values remain supported for backward compatibility but are no longer recommended for new configurations.
>
> If you are using DELEGATED security protocols review the [Security Mode Migration Guide](/gateway/how-to/migration-guide-to-security-mode) before proceeding.

Authentication from the client is mandatory but will be forwarded to Kafka. Gateway will intercept exchanged authentication data to detect an authenticated principal.

All communication between the client and Gateway broker will be encrypted using TLS.

All credentials are managed by your backing Kafka, we only provide Authorization on the Gateway side based on the exchanged principal.

Supported authentication mechanisms on the backing Kafka are:

- PLAIN
- SCRAM-SHA-256
- SCRAM-SHA-512
- OAUTHBEARER
- AWS_MSK_IAM

Gateway configuration:
Using PLAIN, as used for example on Confluent Cloud:

```yaml
GATEWAY_SECURITY_PROTOCOL: DELEGATED_SASL_SSL
GATEWAY_SSL_KEY_STORE_PATH: /path/to/your/keystore.jks        
GATEWAY_SSL_KEY_STORE_PASSWORD: yourKeystorePassword
GATEWAY_SSL_KEY_PASSWORD: yourKeyPassword
```

Client configuration:

```properties
bootstrap.servers=your.gateway.hostname:9092
security.protocol=SASL_SSL
ssl.truststore.location=/path/to/your/truststore.jks
ssl.truststore.password=yourTruststorePassword
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="yourKafkaUser" password="yourKafkaPassword";
```

### Principal resolver

When using Confluent Cloud with Kafka managing authentication, Gateway automatically resolves API keys to their associated service account. This enhances security and improves usability by working with the service account principals instead of raw API keys.

[See principal resolver environment variables for details](/gateway/configuration/env-variables#principal-resolver).

Use environment variables:

```yaml
GATEWAY_PRINCIPAL_RESOLVER: CONFLUENT
GATEWAY_CONFLUENT_CLOUD_API_KEY: your-api-key
GATEWAY_CONFLUENT_CLOUD_API_SECRET: your-api-secret
GATEWAY_CONFLUENT_CLOUD_CACHE_SIZE: 1000 # default
GATEWAY_CONFLUENT_CLOUD_CACHE_EXPIRY_MS: 86400000 # 1 day default
```

Use configuration file:

```yaml
authenticationConfig:
  principalResolver: CONFLUENT_CLOUD
  confluentCloud:
    apiKey: ${GATEWAY_CONFLUENT_CLOUD_API_KEY}
    apiSecret: ${GATEWAY_CONFLUENT_CLOUD_API_SECRET}
    cacheConfig:
      maxSize: ${GATEWAY_CONFLUENT_CLOUD_CACHE_SIZE|1000}
      ttlMs: ${GATEWAY_CONFLUENT_CLOUD_CACHE_EXPIRY_MS|86400000} # 1 day
```

When enabled, Gateway will automatically resolve API keys (like XIGMNERQXOUKXDQU) to their associated Service Accounts (like sa-72839j).

#### Authentication flow

```mermaid
sequenceDiagram
  autonumber
  participant A as Application
  box "Gateway cluster"
    participant GW as Gateway
    participant GPR as Gateway Principal Resolver
  end
  participant K as Backing Kafka Cluster
  participant CC as Confluent Cloud

  Note over A,GW: Application uses credentials `apiKey:apiSecret`
  A  ->> GW: Connect to Gateway using application credentials
  GW ->> K : Gateway forward authentication to Kafka

  alt Authentication failed
    K  -->> GW: AUTH_FAILED
    GW -->> A : AUTH_FAILED
  else Authentication successful (principalToken)
    K  -->> GW: AUTH_OK(principalToken)
    GW ->> GW: extractPrincipal(principalToken)
    GW ->> GPR: isConfluentCloudResolverEnabled()

    alt Opt‑in=true
      GW ->> CC: GET /iam/v2/api-keys/{apiKeyId}
      CC -->> GW: { service_account: "sa-72839j", ... }
      GW ->> GW: cacheMapping(apiKeyId -> serviceAccount)
      Note over GW,K: Principal resolved to Service Account sa‑72839j
    else Opt‑in = false
      Note over GW,K: Principal remains apiKeyId
    end

    GW -->> A : CONNECTED
  end
```

## Automatic security protocol detection

By default, on startup Gateway will attempt to detect the security protocol to use based on Kafka configuration, if no protocols are specified.

If there is also no security protocol on the backing Kafka cluster, then we set the security protocol to `PLAINTEXT` by default.

Here is our mapping from the Kafka cluster's defined protocol:

| Kafka cluster security protocol | Gateway cluster inferred security mode | Gateway cluster inferred security protocol |
|---------------------------------|----------------------------------------|--------------------------------------------|
| SASL_SSL                        | KAFKA_MANAGED                          | SASL_SSL                                   |
| SASL_PLAINTEXT                  | KAFKA_MANAGED                          | SASL_PLAINTEXT                             |
| SSL                             | GATEWAY_MANAGED                        | SSL                                        |
| PLAINTEXT                       | GATEWAY_MANAGED                        | PLAINTEXT                                  |

For reference, you can always see the inferred security protocol on the startup log of Gateway .

```
2024-03-07T15:40:12.260+0100 [      main] [INFO ] [Bootstrap:70] - Computed configuration :
---
gatewayClusterId: "gateway"
...
authenticationConfig:
  securityProtocol: "SASL_PLAINTEXT"
  securityMode: "KAFKA_MANAGED"
  sslConfig:
...

```

## Re authentication support

We support Apache Kafka Re authentication as Kafka brokers.

See [KIP-368](https://cwiki.apache.org/confluence/display/KAFKA/KIP-368%3A+Allow+SASL+Connections+to+Periodically+Re-Authenticate) for more details
