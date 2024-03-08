---
sidebar_position: 2
title: Gateway Security
description: Securing Conduktor Gateway  
---

This part of our documentation explains Gateway security overall, authentication and authorization. Each section has specific details of the options available, how they work and how to configure them. The nature of your system's requirements, design and constraints will lead you to pick the most suitable option when working with our lovely experts as part of setting up Gateway with you.

Some sections are outlined below or use the Quick nav on the right hand pane of the page.

- [Gateway to your Kafka Security](#gateway-to-your-kafka-security)
- [Your Client to Gateway Security, Authentication](#your-client-to-gateway-security-authentication)
  - [Supported Security Protocols and Authentication Mechanisms](#supported-security-protocols-and-authentication-mechanisms)
  - [Plaintext](#plaintext)
  - [SSL](#ssl)
  - [SASL_PLAINTEXT](#sasl_plaintext)
  - [SASL_SSL](#sasl_ssl)
  - [DELEGATED_SASL_PLAINTEXT](#delegated_sasl_plaintext)
  - [DELEGATED_SASL_SSL](#delegated_sasl_ssl)
  - [Automatic Security Protocol Detection (Default behavior)](#automatic-security-protocol-detection-default-behavior)
- [Your Client to Gateway, Authorization](#your-client-to-gateway-authorization)
  - [Username](#username)
  - [Groups](#groups)
  - [Virtual Cluster](#virtual-cluster)
  - [Authentication Specific Extraction](#authentication-specific-extraction)

There are two stages of security configuration to consider when securing your Gateway.

 - The connection between Kafka clients and the Gateway
 - The connection between the Gateway and the Kafka cluster

![gateway-security-excalidraw](./images/gw-security/gateway-security-excalidraw.png)

## Gateway to your Kafka Security

You can use all the Kafka security protocols; `PLAINTEXT`, `SASL_PLAINTEXT`, `SASL_SSL` and `SSL`.
For these security protocols we support all SASL mechanisms; `PLAIN`, `SCRAM SHA`, `OAuthBearer`, `Kerberos` etc.

There are two ways of providing your configuration on how to connect to Kafka : envrionement variables and properties configuration file.

### Environment Variables

*This is the default mode.*
Provide Gateway with the environment variables to connect to Kafka.
Use the variables that start with a `KAFKA_` prefix as it is Gateway's connection to **Kafka**.

```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:3.0.0
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092
      KAFKA_SASL_MECHANISM: PLAIN
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
      KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required  username="admin" password="admin-secret";
```
### Property File

You can edit the Gateway configuration to point to a property file to use for your Kafka connection.

```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:3.0.0
    environment:
      GATEWAY_BACKEND_KAFKA_SELECTOR: '{ file : { path: /kafka.properties } }'
    volumes:
      - type: bind
        source: "./kafka.properties"
        target: /kafka.properties
        read_only: true
```

With this configuration Gateway will load the mounted configuration file and use it as property source to the Kafka connectivity.

### Delegated Kafka Authentication

A special case for **Gateway to Kafka** connectivity is when you configure **Client to Gateway** security to delegate the authentication to Kafka. See [this section for more](https:broken.broken)

In this case all previous configuration still applies but the authentication set in your provided configuration will not be used outside of Gateway administration tasks ( list nodes on startup, ...).



## Your Client to Gateway Security, Authentication
Gateway, as a Kafka broker, supports various authentication schemes.
![client-to-gateway-security-excalidraw](./images/gw-security/client-to-gateway-security-excalidraw.png)


As with Kafka brokers, Gateway brokers support multiple security schemes for Kafka clients to connect with.  

The authentication phase on Gateway is part of the initial communication handling by Gateway to handshake, and authenticate, a Kafka client. This phase manages the encryption of the network communication and how to identify a client.
All open connections in Gateway result in a Principal that represents the authenticated identity of the Kafka client.  

We can split this authentication and security configuration into two aspects:
* Security protocol
  * Authentication mechanism

Security protocol defines how a Kafka client and Gateway broker should communicate and secure the connection. *How do we talk to each other, do we need to authenticate?.*
Authentication mechanism on the other hand is the part defining how a client can authenticate it self when opening the connection. *How do we know each other?*

![security protocol and auth table](./images/gw-security/secProt-auth-table.png)

### Supported Security Protocols and Authentication Mechanisms

|                            | With App ⟶ GW plaintext data   | With App ⟶ GW encrypted data  |
|----------------------------|---------------------------------|--------------------------------|
| Anonymous access only      | "Security protocol: `PLAINTEXT` Authentication mecanism: `None`"   | "Security protocol: `SSL` Authentication mecanism: `None`"|
| Credentials managed by Gateway | "Security protocol: `SASL_PLAINTEXT` Authentication mecanism: `PLAIN`"  | "Security protocol: `SASL_SSL` Authentication mecanism: `PLAIN`"   |
| Gateway configured with Oauth | "Security protocol: `SASL_PLAINTEXT` Authentication mecanism: `OAUTHBEARER`"  | "Security protocol: SASL_SSL Authentication mecanism: `OAUTHBEARER`"                                                        |
| Clients are identified by certificates (mTLS) | Not possible (mTLS means encryption)                                                                                          | "Security protocol: `SSL` Authentication mecanism: `MTLS`"                                                                     |
| Credentials managed by Kafka | "Security protocol: `DELEGATED_SASL_PLAINTEXT` Authentication mecanism: `PLAIN` or `SCRAM-SHA-256` or `SCRAM-SHA-512`"                 | "Security protocol: `DELEGATED_SASL_SSL` Authentication mecanism: `PLAIN` or `SCRAM-SHA-256` or `SCRAM-SHA-512`"                |


Gateway broker security scheme is defined by the `GATEWAY_SECURITY_PROTOCOL` configuration.
Gateway supports all the security protocols as Apache Kafka does,  you can find further information regarding what they are on the [Apache Kafka documentation](https://kafka.apache.org/documentation/#listener_configuration). In addition, Gateway adds two new security protocols `DELEGATED_SASL_PLAINTEXT` and `DELEGATED_SASL_SSL` , as mentioned for delegating to Kafka.


### Plaintext

Brokers don't need any client authentication and all communication is exchanged without any network security.

Example:

```properties
bootstrap.servers=your.kafka.broker.hostname:9092
security.protocol=PLAINTEXT
```
### SSL

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

#### mTLS
This security protocol is not originally intended to provide authentication, but you can use the mTLS option below to enable an authentication.

mTLS leverages SSL mutual authentication to identify a Kafka client.
`Principal` for mTLS connection can be detected from the subject certificate using the same feature as Apache Kafka the [SSL principal mapping](https://docs.confluent.io/platform/current/kafka/configure-mds/mutual-tls-auth-rbac.html#principal-mapping-rules-for-tls-ssl-listeners-extract-a-principal-from-a-certificate).

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
The server CA certificate here is provided as a PEM file as well as the client's certificates (*ssl.keystore.xx* keys). Jks could also be used for both client and server side authentication.

### SASL_PLAINTEXT

Authentication from client is mandatory against Gateway but all communications are exchanged without any network security.  

#### Plain
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


With the following:  

* yourUsername: your principal (or login)
* yourPassword: a JWT token that the Gateway admin gets via the REST API:

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

#### OAuthbearer

Oauthbearer uses a OAuth2/OIDC security provider to authenticate a token in gateway.  
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

### SASL_SSL
Authentication from client is mandatory against Gateway and communication will be encrypted using TLS.  

Supported authentication mechanisms: 
* Plain
* OAuthBearer

#### Plain
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

#### OAuthbearer
Oauthbearer uses a OAuth2/OIDC security provider to autheticate a token in gateway. 

The Oauth credentials base is managed in the configured provider. 

This mechanism will also allow you to verify some claims from your OIDC provider ( `audience` and `issuer` ).

### DELEGATED_SASL_PLAINTEXT

Authentication from client is mandatory but will be forwarded to Kafka for checking. Gateway will intercept exchanged authentication data to detect an authenticated principal.  

All communication  between the client and Gateway broker are exchanged without any network security.

All credentials are managed by your backing Kafka, we only provide Authorization (see below) on the Gateway side based on the exchanged principal. 

Supported authentication mechanisms on the backing Kafka are:
* Plain
* Scram-sha-256
* Scram-sha-512

### DELEGATED_SASL_SSL
Authentication from the client is mandatory but will be forwarded to Kafka. Gateway will intercept exchanged authentication data to detect an authenticated principal.
All communication between the client and Gateway broker will be encrypted using TLS.

All credentials are managed by your backing Kafka, we only provide Authorization (see below) on the Gateway side based on the exchanged principal.

Supported authentication mechanisms on the backing Kafka are:
* Plain
* Scram-sha-256
* Scram-sha-512

### Automatic Security Protocol Detection (Default behavior)
On startup Gateway will attempt to detect the security protocol to use based on the Kafka configuration if you don't specify any security protocol.

If there is also no security protocol on the backing Kafka cluster, then we set the security protocol to PLAINTEXT by default.
Here is our mapping from the Kafka cluster's defined protocol:

| Kafka cluster security protocol  | Gateway cluster security protocol   |
|----------------------------|---------------------------------|
| SASL_SSL         | DELEGATED_SASL_SSL |
| SASL_PLAINTEXT   | DELEGATED_SASL_PLAINTEXT |
| SSL              | SSL             |
| PLAINTEXT        | PLAINTEXT       |

For reference you can always see the inferred security protocol on the startup log of Gateway.

```bash
2024-03-07T15:40:12.260+0100 [main] [INFO] [Bootstrap:70] - Computed configuration :
---
gatewayClusterId: "gateway"
...
authenticationConfig:
  securityProtocol: "SASL_PLAINTEXT"
  sslConfig:
...
```

We also support Apache Kafka Re authentication as Kafka brokers.
See [KIP-368](https://cwiki.apache.org/confluence/display/KAFKA/KIP-368%3A+Allow+SASL+Connections+to+Periodically+Re-Authenticate) for more details.

## Your client to Gateway, Authorization

A principal is not enough to leverage the feature of Gateway, all connections opened should associate a **User**.

Gateway authorization is the process to go from an authentication `principal` to a full Gateway `user` using some authentication information, and a **User Mapping** for the Principal , if it exists.

For more on a Gateway user and user mapping, see the [user reference doc](/gateway/reference/user).

### Username

If a `UserMapping` exists for the `Principal` , the username mapping will be used.
If no mapping exists, then `Principal` is used as username.

### Groups

Result groups are an union of groups defined on `UserMapping` if one exists for the `Principal` and those extracted from authentication source.

### Virtual Cluster

The user's virtual cluster will be the one from the `UserMapping` , if one exists, for the `Principal`.

If no mapping exists then we try to use one from authentication extraction.

If no virtual cluster was detected then the user is associated to `passthrough`, a transparent virtual cluster.

If you don't want users to automatically fallback into the `passthrough` transparent virtual cluster, and instead fail the connection you can set `GATEWAY_FEATURE_FLAGS_MANDATORY_VCLUSTER` to true.

### Authentication Specific Extraction

As mentioned below, the authorization process will try to detect information from the authentication source. Each authentication source is different and they can't all provide everything. This section is dedicated to explain which information can be extracted based on you authentication mechanism.

**Plain**
Virtual Cluster : ✅
When creating a plain user with the HTTP API you can define a virtual cluster property that can be extracted by Gateway.
Groups: ❌

**OAuthbearer**
Virtual Cluster : ✅
If a gateway.vcluster claim is detected in the OAuth token sent by a client, it can be extracted as virtual cluster.
Groups: ❌

**mTLS**
Virtual Cluster : ❌
Groups: ❌

**Delegated to backend Kafka**
Virtual Cluster : ❌
Groups: ❌



[Jump back to the top](#gateway-to-your-kafka-security)