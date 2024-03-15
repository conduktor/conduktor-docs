---
title: Client to Gateway Authentication
---

# Client to Gateway Authentication

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
  All credentials are managed by your backend kafka, we only provide [authorization](04-Authorization.md) on the Gateway side based on the exchanged principal.


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

It must contain a token that is obtained by a Gateway admin via the REST API as follows:

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

Note: the password must be filled as already explained [here](01-Clients.md#plain)

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

All credentials are managed by your backing Kafka, we only provide [Authorization](04-Authorization.md) on the Gateway side based on the exchanged principal.

Supported authentication mechanisms on the backing Kafka are:

-   Plain
-   Scram-sha-256
-   Scram-sha-512

## DELEGATED_SASL_SSL

Authentication from the client is mandatory but will be forwarded to Kafka. Gateway will intercept exchanged authentication data to detect an authenticated principal.

All communication between the client and Gateway broker will be encrypted using TLS.

All credentials are managed by your backing Kafka, we only provide [Authorization](04-Authorization.md) on the Gateway side based on the exchanged principal.

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

          