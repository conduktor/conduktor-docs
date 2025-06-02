---
sidebar_position: 60
title: Gateway
description: Deploy Gateway
---
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

## Deployment overview

Conduktor Gateway is deployed between your client applications and existing Kafka clusters. As it's Kafka protocol compliant, there are minimal adjustments required for clients other than pointing to a new bootstrap server.

![Conduktor Gateway](/guides/gateway-integration.png)

## Benefits

This can be used to provide functionality that is not available in Kafka natively, such as:

 - **Centrally configure encryption** at the field-level or full payload, to secure your data during transit and at rest, before the cluster
 - **Mask sensitive data** across topics and set access rules, so users only see what they’re authorized to
 - **Set granular RBAC controls** to manage access and permissions for data at the cluster, team or individual level 
 - **Leverage multi-tenancy** with virtual clusters to optimize resources and reduce operational overheads
 - **Empower development teams** to manage their data within a federated control framework, accelerating project delivery

Conduktor Gateway is vendor-agnostic, meaning it supports all Kafka providers (Confluent, AWS MSK, Redpanda, Aiven, Apache Kafka), both cloud and on-premise.

## How it works

Conduktor Gateway is deployed between your client applications and existing Kafka clusters. As it's Kafka protocol compliant, there are minimal adjustments required for clients other than pointing to a new bootstrap server.

### Authentication

Much like Kafka brokers, Gateway supports multiple security protocols for Kafka client to Gateway authentication, such as PLAINTEXT, SSL, SASL SSL, mTLS. Equally, Gateway supports all Kafka security protocols for Gateway to Kafka authentication.

### Interceptors

Once Gateway is deployed, <GlossaryTerm>Interceptors</GlossaryTerm> are used to add technical and business logic, such as message encryption, inside your Gateway deployment. Interceptors can be deployed and managed through the [API](https://developers.conduktor.io/?product=gateway) and targeted at a different scope (Global, Virtual Cluster, Group, Username). [Find out more about Interceptors](/guides/conduktor-concepts/interceptors).

### Processing flow

Kafka protocol requests, such as Produce requests, pass sequentially through each of the components in the pipeline, before being forwarded to the broker. When the broker returns a response, such as a Produce response, the components in the pipeline are invoked in reverse order, each having the opportunity to inspect and/or manipulate the response. Eventually, a response is returned to the client.

 ```mermaid
flowchart LR
    A[User App]
    subgraph G [Gateway]
        direction LR
        Auth[Authentication & </br> Authorization]
        subgraph I [Dynamic interceptor pipeline]
            direction LR
            I1(Plugin </br> priority: 1 </br> interceptor)
            I2(Plugin </br> priority: 10 </br> interceptor1 & interceptor2)
            I3(Plugin </br> priority: 42 </br> interceptor)
            I1 <--> I2 <--> I3
        end
        subgraph Core [Core features]
            direction TB
            LT(Logical Topics)
            VC(Virtual clusters)
        end
        Auth <--> I
    end
    subgraph K [Main Kafka cluster]
    B1(broker 1)
    B2(broker 2)
    B3(broker 3)
    B1 === B2 === B3
    end
    A <--> Auth
    I <--> Core
    Core <--> K
```

### What about scaling?
The Gateway is stateless and can be scaled horizontally by adding more instances and distributing the incoming traffic using a load balancer.

### What about resilience?
Much like Kafka, if a broker dies it can be restarted whilst Gateway keeps running. As the Gateway is Kafka protocol compliant, your applications remain available.

### What about latency?
By default, the Gateway operates with minimal impact on performance, typically adding only milliseconds of latency. However, if you begin implementing more resource-intensive features, such as encryption utilizing a Key Management Service (KMS), there will naturally be a slight increase in overhead.

## Configure Gateway

Configuring Conduktor Gateway involves making decisions regarding several subjects.

1. [Configure your network](#1-network-configuration).
1. Define [load balancing](#2-define-load-balancing) requirements.
1. [Connect Gateway to Kafka](#3-connect-gateway-to-kafka).
1. Configure [Gateway to accept client connections](#4-configure-gateway-to-accept-client-connections).
1. Decide whether you need [Virtual Clusters](#5-decide-on-virtual-clusters).

We also recommend that you [Configure Gateway for failover](#configure-gateway-for-failover).

## 1. Network configuration

When configuring Conduktor Gateway for the first time, selecting the appropriate routing method is crucial for optimizing your Kafka proxy setup. Pick one of these solutions depending on your requirements:

Choose [port-based routing](#port-based-routing) if your environment:

- doesn't require TLS encryption
- has flexible network port management capabilities
- prefers a simpler, straightforward configuration without DNS complexities

Choose [host-based routing (SNI)](#host-based-routing-sni) if your environment:

- requires TLS encrypted connections for secure communication
- faces challenges with managing multiple network ports
- seeks a scalable solution with easier management of routing through DNS and host names

### Port-Based routing

In port-based Routing, each Kafka broker is assigned a unique port number and clients connect to the appropriate port to access the required broker.

Gateway listens on as many ports as defined by the environment variable `GATEWAY_PORT_COUNT`. The recommended number of ports in production is **double the amount of the Kafka brokers** (to cover the growth of the Kafka cluster).

Configure port-based routing using these environment variables:

- `GATEWAY_ADVERTISED_HOST`
- `GATEWAY_PORT_START`
- `GATEWAY_PORT_COUNT`
- `GATEWAY_MIN_BROKERID`

The default port range values cover the range of the brokerIds with an additional two ports.

The maximum broker ID is requested from the cluster, the min should be set as `GATEWAY_MIN_BROKERID`. E.g., in a three broker cluster with IDs 1, 2, 3, `GATEWAY_MIN_BROKERID` should be set to 1 and the default port count will be 5.

We recommend [SNI routing](#host-based-routing-sni) when not using a sequential and stable broker IDs range to avoid excessive port assignment. E.g., a three broker cluster with IDs 100, 200, 300 with `GATEWAY_MIN_BROKERID`=100 will default to 203 ports and would fail if broker ID 400 is introduced.

### Host-based routing (SNI)

With host-based routing, Gateway listens on a single port and leverages Server Name Indication (SNI) (an extension to the TLS protocol), to route traffic based on the hostname specified in the TLS handshake to determine the target Kafka broker, requiring valid TLS certificates, proper DNS setup, and DNS resolution. [Find out how to set up SNI routing](./tutorials/sni-routing.md).

## 2. Define load balancing

To map the different Gateway nodes sharing the same cluster and your Kafka brokers, you can either use:

- Gateway **internal load balancing** or
- an **external load balancing**

These options are only for the Kafka protocol, as any of the Gateway nodes can manage HTTP calls to their API.

### Internal load balancing

Gateway's ability to distribute the client connections between the different Gateway nodes in the same cluster is what we refer to as internal load balancing. This is done automatically by Gateway and is the default behavior.

To deploy multiple Gateway nodes as part of the same Gateway cluster, you have to set the same `GATEWAY_CLUSTER_ID` in each node's deployment configuration. This configuration ensures that all nodes join the same consumer group, enabling them to consume the internal license topic from your Kafka cluster. This is how the nodes recognize each other as members of the same Gateway cluster.

When a client connects to one of the Gateway nodes to request metadata, the following process occurs (assuming `GATEWAY_FEATURE_FLAGS_INTERNAL_LOAD_BALANCING` is set to `true`, which is the default setting):

1. The client chooses one of the bootstrap servers to ask for metadata.
1. The Gateway node generates a mapping between its cluster nodes and the Kafka brokers.
1. The Gateway node returns this mapping to the client.
1. With the mapping in hand, the client can efficiently route its requests. For instance, if the client needs to produce to a partition where broker 3 is the leader, it knows to forward the request to Gateway 2 on port 9094.

For example, you have a Gateway cluster composed of two Gateway nodes, connected to a Kafka cluster with three brokers. The client's metadata discovery process might look like this:

![Internal load balancing](/guides/internal-lb.png)

This mapping will be made again for every client asking for metadata, and will be made again as soon as a Gateway node is added or removed from the Gateway cluster.

:::note
If you have specified a `GATEWAY_RACK_ID`, then the mapping will take this into consideration and a Gateway node in the same rack as the Kafka broker will be assigned.
:::

Here's the same example but with multiple clients:

![Internal Load Balancing Multiple Clients](/guides/multiple-clients.png)

The process is repeated but will likely result in a different mapping compared to that of Client 1 due to the random assignment performed by the Gateway for the client.

#### Internal load balancing limitations

In a Kubernetes environment, your ingress must point at a single service, which could be an external load balancer as detailed below.

### External load balancing

Alternatively, you can disable the internal load balancing by setting `GATEWAY_FEATURE_FLAGS_INTERNAL_LOAD_BALANCING: false`.

In this case, you would deploy your own load balancer, such as [HAProxy](https://www.haproxy.org/), to manage traffic distribution. This would allow you to configure the stickiness of the load balancer as required.

Here's an example where:

1. All client requests are directed to the external load balancer which acts as the entry point to your Gateway cluster.
1. The load balancer forwards each request to one of the Gateway nodes, regardless of the port.
1. The selected Gateway node, which knows which broker is the leader of each partition, forwards the request to the appropriate Kafka broker.

![External Load Balancing](/guides/external-lb.png)

:::warning
When using an external load balancer, you **must** configure the `GATEWAY_ADVERTISED_LISTENER` of the Gateway nodes to the Load Balancer's hostname. If this isn't done, applications will attempt to connect directly to Gateway, bypassing the Load Balancer.
:::

#### External load balancing limitations

This requires you to handle load balancing manually, as you won't have the advantage of the automatic load balancing offered by Gateway's internal load balancing feature.

## 3. Connect Gateway to Kafka

![Gateway to Kafka security](/guides/gateway-to-kafka-security.png)

Gateway depends on a 'backing' Kafka cluster for its operation.

Configuring the Gateway connection to the backing Kafka cluster closely resembles configuring a standard Kafka client's connection to a cluster.

If you've not done so already, it's best to set the client to Gateway configuration variables, that way the Gateway will know how to interact with Kafka based on how authentication is being provided by the clients, the two are related because Gateway must know whether you wish to use [delegated authentication](#delegated-authentication) or not.

The configuration is done via environment variables, as it is for the other aspects of a Gateway configuration.

All environment variables that start with `KAFKA_` are mapped to configuration properties for connecting Gateway to the Kafka cluster.

As Gateway is based on the Java-based Kafka-clients, it supports all configuration properties that Java-clients do.
Kafka configuration properties are mapped to Gateway environment variables as follows:

- Add a `KAFKA_` prefix
- Replace each dot, `.` , with an underscore, `_`
- Convert to uppercase

For example, `bootstrap.servers` is set by the `KAFKA_BOOTSTRAP_SERVERS` environment variable.

### Supported protocols

You can use all the Kafka security protocols to authenticate Gateway to the Kafka cluster; `PLAINTEXT`, `SASL_PLAINTEXT`, `SASL_SSL` and `SSL`.  

These can be used with all SASL mechanisms supported by Apache Kafka: `PLAIN`, `SCRAM-SHA`, `OAuthBearer`, `Kerberos` etc. In addition, we support IAM authentication for AWS MSK clusters.

In the following examples, we provide blocks of environment variables which can be provided to Gateway, e.g. in a docker-compose file, or a `helm` deployment. 

Information which should be customized is enclosed by `<` and `>`.

#### PLAINTEXT

Kafka cluster without authentication or encryption in transit, `PLAINTEXT`.

In this case you just need the bootstrap servers:

```yaml
KAFKA_BOOTSTRAP_SERVERS: <your.kafka.broker-1:9092>,<your.kafka.broker-2:9092>
```

#### SSL

```yaml
GATEWAY_SECURITY_PROTOCOL: PLAINTEXT # Change to relevant client-side value if known
KAFKA_BOOTSTRAP_SERVERS: <your.kafka.broker-1:9092>,<your.kafka.broker-2:9092>
KAFKA_SECURITY_PROTOCOL: SSL
KAFKA_SASL_MECHANISM: PLAIN
KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required username="<gw-sa-username>" password="<gw-sa-password>";
KAFKA_SSL_TRUSTSTORE_TYPE: <JKS>
KAFKA_SSL_TRUSTSTORE_LOCATION: </path/to/truststore.jks>
KAFKA_SSL_TRUSTSTORE_PASSWORD: <truststore-password>
KAFKA_SSL_KEYSTORE_TYPE: <JKS>
KAFKA_SSL_KEYSTORE_LOCATION: </path/to/keystore.jks>
KAFKA_SSL_KEYSTORE_PASSWORD: <keystore-password>
KAFKA_SSL_KEY_PASSWORD: <key-password>
```

##### mTLS

Kafka cluster with mTLS client authentication.

```yaml
GATEWAY_SECURITY_PROTOCOL: PLAINTEXT # Change to relevant client-side value if known
KAFKA_BOOTSTRAP_SERVERS: <your.kafka.broker-1:9092>,<your.kafka.broker-2:9092>, <your.kafka.broker-3:9092>
KAFKA_SECURITY_PROTOCOL: SSL
KAFKA_SSL_TRUSTSTORE_LOCATION: /security/truststore.jks
KAFKA_SSL_TRUSTSTORE_PASSWORD: conduktor
KAFKA_SSL_KEYSTORE_LOCATION: /security/kafka.gw.keystore.jks
KAFKA_SSL_KEYSTORE_PASSWORD: conduktor
KAFKA_SSL_KEY_PASSWORD: conduktor
```

#### SASL_PLAINTEXT

Kafka cluster with SASL_PLAINTEXT security protocol but no encryption in transit, supporting the following SASL_MECHANISMs.

#### SASL PLAIN

```yaml
GATEWAY_SECURITY_PROTOCOL: PLAINTEXT # Change to relevant client-side value if known
KAFKA_BOOTSTRAP_SERVERS: <your.kafka.broker-1:9092>,<your.kafka.broker-2:9092>
KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
KAFKA_SASL_MECHANISM: PLAIN
KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required username="<gw-sa-username>" password="<gw-sa-password>";
```

#### SASL SCRAM

```yaml
GATEWAY_SECURITY_PROTOCOL: PLAINTEXT # Change to relevant client-side value if known
KAFKA_BOOTSTRAP_SERVERS: <your.kafka.broker-1:9092>,<your.kafka.broker-2:9092>
KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
KAFKA_SASL_MECHANISM: SCRAM-SHA-256 # or SCRAM-SHA-512
KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.scram.ScramLoginModule required username="<gw-sa-username>" password="<gw-sa-password>";
```

#### OAuthbearer

```yaml
GATEWAY_SECURITY_PROTOCOL: PLAINTEXT
KAFKA_BOOTSTRAP_SERVERS: <your.kafka.broker-1:9092>,<your.kafka.broker-2:9092>
KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
KAFKA_SASL_MECHANISM: OAUTHBEARER
KAFKA_SASL_OAUTHBEARER_TOKEN_ENDPOINT_URL: "<https://myidp.example.com/oauth2/default/v1/token>"
KAFKA_SASL_LOGIN_CALLBACK_HANDLER_CLASS: org.apache.kafka.common.security.oauthbearer.secured.OAuthBearerLoginCallbackHandler
KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required clientId=“<>” clientSecret=“<>” scope=“.default”;
```

#### SASL_SSL

Kafka cluster that uses SASL for authentication and TLS (formerly SSL) for encryption in transit.

#### PLAIN

Kafka cluster with SASL_SSL and PLAIN SASL mechanism.

#### Confluent Cloud with API key/secret

This example can be seen as a special case of the above.

```yaml
GATEWAY_SECURITY_PROTOCOL: PLAINTEXT # Change to relevant client-side value if known
KAFKA_BOOTSTRAP_SERVERS: <your.cluster.confluent.cloud:9092>
KAFKA_SECURITY_PROTOCOL: SASL_SSL
KAFKA_SASL_MECHANISM: PLAIN
KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required username="<API_KEY>" password="<API_SECRET>";
```

As Confluent Cloud uses certificates signed by a well-known CA, you normally do not need to specify a trust-store.

Note: In case you are using this in a PoC setting without TLS encryption between *clients* and Gateway, you should set `GATEWAY_SECURITY_PROTOCOL` to `DELEGATED_SASL_PLAINTEXT`. Clients will then be able to authenticate using their own API keys/secrets.

#### SASL SCRAM

```yaml
GATEWAY_SECURITY_PROTOCOL: PLAINTEXT # Change to relevant client-side value if known
KAFKA_BOOTSTRAP_SERVERS: <your.kafka.broker-1:9092>,<your.kafka.broker-2:9092>
KAFKA_SECURITY_PROTOCOL: SASL_SSL
KAFKA_SASL_MECHANISM: SCRAM-SHA-256 # or SCRAM-SHA-512
KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.scram.ScramLoginModule required username="<gw-sa-username>" password="<gw-sa-password>";
KAFKA_SSL_TRUSTSTORE_TYPE: <JKS>
KAFKA_SSL_TRUSTSTORE_LOCATION: </path/to/truststore.jks>
KAFKA_SSL_TRUSTSTORE_PASSWORD: <truststore-password>
```

#### SASL GSSAPI (Kerberos)

```yaml
GATEWAY_SECURITY_PROTOCOL: PLAINTEXT # Change to relevant client-side value if known
KAFKA_BOOTSTRAP_SERVERS: <your.kafka.broker-1:9092>,<your.kafka.broker-2:9092>
KAFKA_SECURITY_PROTOCOL: SASL_SSL
KAFKA_SASL_MECHANISM: GSSAPI
KAFKA_SASL_JAAS_CONFIG: com.sun.security.auth.module.Krb5LoginModule required useKeyTab=true storeKey=true keyTab="<>>" principal="<>";
KAFKA_SASL_KERBEROS_SERVICE_NAME: <kafka>
KAFKA_SSL_TRUSTSTORE_TYPE: <JKS>
KAFKA_SSL_TRUSTSTORE_LOCATION: </path/to/truststore.jks>
KAFKA_SSL_TRUSTSTORE_PASSWORD: <truststore-password>
```

#### OAuthbearer

```yaml
GATEWAY_SECURITY_PROTOCOL: PLAINTEXT
KAFKA_BOOTSTRAP_SERVERS: <your.kafka.broker-1:9092>,<your.kafka.broker-2:9092>
KAFKA_SECURITY_PROTOCOL: SASL_SSL
KAFKA_SASL_MECHANISM: OAUTHBEARER
KAFKA_SASL_OAUTHBEARER_TOKEN_ENDPOINT_URL: "<https://myidp.example.com/oauth2/default/v1/token>"
KAFKA_SASL_LOGIN_CALLBACK_HANDLER_CLASS: org.apache.kafka.common.security.oauthbearer.secured.OAuthBearerLoginCallbackHandler
KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required clientId=“<>” clientSecret=“<>” scope=“.default”;
```

### AWS MSK cluster with IAM

```yaml
GATEWAY_SECURITY_PROTOCOL: PLAINTEXT # Change to relevant client-side value if known
KAFKA_BOOTSTRAP_SERVERS: <b-3-public.****.kafka.eu-west-1.amazonaws.com:9198>
KAFKA_SECURITY_PROTOCOL: SASL_SSL
KAFKA_SASL_MECHANISM: AWS_MSK_IAM
KAFKA_SASL_JAAS_CONFIG: software.amazon.msk.auth.iam.IAMLoginModule required;
KAFKA_SASL_CLIENT_CALLBACK_HANDLER_CLASS: io.conduktor.aws.IAMClientCallbackHandler
KAFKA_AWS_ACCESS_KEY_ID: <access-key-id>
KAFKA_AWS_SECRET_ACCESS_KEY: <secret-access-key>
```

### Service account and ACL requirements

Depending on the client to Gateway authentication method you choose, the service account used to connect the Gateway might need different ACLs to operate properly.

#### Delegated authentication

In delegated authentication, the credentials provided to establish the connection between the client and the Gateway are the same used from Gateway to the backing Kafka. As a result, the client will inherit the ACLs of the service account configured on the backing cluster.

On top of that, Gateway needs its own service account with the following ACLs to operate correctly:

- `Read` on internal topics and they should exist
- Describe consumer group for internal topic
- Describe on cluster
- Describe topics for alias topics creation

#### Non-delegated

In non-delegated authentication (Local, Oauth or mTLS), the connection is using Gateway's service account to connect to the backing Kafka.

This service account must have all the necessary ACLs to perform not only these Gateway operations:

- `Read` on internal topics and they should exist
- Describe consumer group for internal topic
- Describe on cluster
- Describe topics for alias topics creation but also all the permissions necessary to serve all Gateway users.

If necessary, you can enable ACLs for non-delegated authentication.

First, configure `GATEWAY_ACL_STORE_ENABLED=true` and then you can use **AdminClient** to maintain ACLs with any service account declared in `GATEWAY_ADMIN_API_USERS`.

## 4. Configure Gateway to accept client connections

![Client to Gateway security](/guides/client-to-gateway-security.png)

Gateway brokers support multiple security schemes for Kafka clients to connect with. Each section has specific details of the available options, how they work and how to configure them. Pick the most suitable option based on the nature of your system's requirements, design and constraints.

The authentication phase on Gateway is part of the initial communication handling by Gateway to handshake, and authenticate, a Kafka client. This phase manages the encryption of the network communication and how to identify a client.

All open connections in Gateway result in a `Principal` that represents the authenticated identity of the Kafka client.

We can split this authentication and security configuration into two aspects:

- Security protocol: defines how a Kafka client and Gateway broker should communicate and secure the connection.
- Authentication mechanism: defines how a client can authenticate itself when opening the connection.

Supported security protocols:

- **PLAINTEXT**: Brokers don't need client authentication; all communication is exchanged without network security.
- **SSL**: With SSL-only clients don't need any client authentication but communication between the client and Gateway broker will be encrypted.
- **mTLS**: This security protocol is not originally intended to provide authentication, but you can use the mTLS option below to enable an authentication. mTLS leverages SSL mutual authentication to identify a Kafka client.
  `Principal` for mTLS connection can be detected from the subject certificate using the same feature as in Apache Kafka, the [SSL principal mapping](https://docs.confluent.io/platform/current/kafka/configure-mds/mutual-tls-auth-rbac.html#principal-mapping-rules-for-tls-ssl-listeners-extract-a-principal-from-a-certificate).
- **SASL PLAINTEXT**: Brokers don't need any client authentication and all communication is exchanged without any network security.
- **SASL SSL**: Authentication from the client is mandatory against Gateway and communication will be encrypted using TLS.
- **DELEGATED_SASL_PLAINTEXT**: Authentication from the client is mandatory but will be forwarded to Kafka for checking. Gateway will intercept exchanged authentication data to detect authenticated principals:
  - All communication  between the client and gateway broker is exchanged without any network security.
  - All credentials are managed by your backend kafka, we only provide authorization on the Gateway side based on the exchanged principal.

|                                                     | **_Clients ⟶ GW transit in plaintext_**                                                                                                               | **_Clients ⟶ GW transit is encrypted_**                                                                                                         |
|-----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| **_Anonymous access only_**                         | Security protocol: `PLAINTEXT`<br />Authentication mechanism: `None`                                                                                  | Security protocol: `SSL`<br />Authentication mechanism: `None`                                                                                  |
| **_Credentials managed by Gateway_**                | Security protocol: `SASL_PLAINTEXT`<br />Authentication mechanism: `PLAIN`                                                                            | Security protocol: `SASL_SSL`<br />Authentication mechanism: `PLAIN`                                                                            |
| **_Gateway configured with OAuth_**                 | Security protocol: `SASL_PLAINTEXT`<br />Authentication mechanism: `OAUTHBEARER`                                                                      | Security protocol: `SASL_SSL`<br />Authentication mechanism: `OAUTHBEARER`                                                                      |
| **_Clients are identified by certificates (mTLS)_** | Not possible (mTLS means encryption)                                                                                                                  | Security protocol: `SSL`<br />Authentication mechanism: `MTLS`                                                                                  |
| **_Credentials managed by Kafka_**                  | Security protocol: `DELEGATED_SASL_PLAINTEXT`<br />Authentication mechanism: `PLAIN`, `SCRAM-SHA-256`, `SCRAM-SHA-512`, `OAUTHBEARER` or`AWS_MSK_IAM` | Security protocol: `DELEGATED_SASL_SSL`<br />Authentication mechanism: `PLAIN`, `SCRAM-SHA-256`, `SCRAM-SHA-512`, `OAUTHBEARER` or`AWS_MSK_IAM` |

### Security protocol

The Gateway broker security scheme is defined by the `GATEWAY_SECURITY_PROTOCOL` configuration.

Note that you don't set an authentication mechanism on the client to Gateway side of the proxy, i.e. `GATEWAY_SASL_MECHANISM` **does not exist and is never configured by the user**. Instead, Gateway will try to authenticate the client as it presents itself.

For example, if a client is using `OAUTHBEARER`, Gateway will use the OAuth configuration to try authenticate it. If a client arrives using `PLAIN`, Gateway will try use either the SSL configuration or validate the token itself, depending on the security protocol.

In addition to all the security protocols that [Apache Kafka supports](https://kafka.apache.org/documentation/#listener_configuration), Gateway adds two new protocols:`DELEGATED_SASL_PLAINTEXT` and `DELEGATED_SASL_SSL` for delegating to Kafka.

#### PLAINTEXT

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

#### SSL

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

The truststore contains certificates from trusted Certificate Authorities (CAs) used to verify the Gateway's TLS certificate, which is stored in the keystore. [Find out more about jks truststores](https://docs.oracle.com/cd/E19509-01/820-3503/6nf1il6er/index.html).

##### Mutual TLS (mTLS)

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

#### SASL_PLAINTEXT

Authentication from the client is mandatory against Gateway but all communications are exchanged without any network security. Gateway supports Plain and OAuthbearer SASL mechanisms.

##### Plain

Plain mechanism uses Username/Password credentials to authenticate credentials against Gateway. Plain credentials take the form of a JWT token, these are managed in Gateway using the Admin (HTTP) API. See below for the creation of tokens.

Gateway configuration:

```yaml
GATEWAY_SECURITY_PROTOCOL: SASL_PLAINTEXT
GATEWAY_USER_POOL_SECRET_KEY: yourRandom256bitKeyUsedToSignTokens
```

The`GATEWAY_USER_POOL_SECRET_KEY` **has to be** set to a random base64 encoded value of 256bits long to ensure that tokens aren't forged. For example: `openssl rand -base64 32`. Otherwise, a default value for signing tokens will be used.

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

It has to be a token that's obtained by a Gateway admin via the Admin (HTTP) API, as follows:

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
    "spec" : { "type" : "LOCAL" }'
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

1. Generate a token for the service account, the password

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

##### OAuthbearer 

Oauthbearer uses a OAuth2/OIDC security provider to authenticate a token in Gateway. The Oauth credentials base is managed in the configured provider.

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

#### SASL_SSL

Authentication from client is mandatory against Gateway and communication will be encrypted using TLS. Supported authentication mechanisms:

- PLAIN
- OAUTHBEARER

##### Plain

Plain mechanism use Username/Password credentials to authenticate credentials against Gateway. Plain credentials are managed in Gateway using the HTTP API.

Gateway configuration:

```yaml
GATEWAY_SECURITY_PROTOCOL: SASL_SSL
GATEWAY_USER_POOL_SECRET_KEY: yourRandom256bitKeyUsedToSignTokens
GATEWAY_SSL_KEY_STORE_PATH: /path/to/your/keystore.jks        
GATEWAY_SSL_KEY_STORE_PASSWORD: yourKeystorePassword
GATEWAY_SSL_KEY_PASSWORD: yourKeyPassword
```

You have to set `GATEWAY_USER_POOL_SECRET_KEY` to a random value to ensure that tokens cannot be forged. Otherwise, a default value for signing tokens will be used.

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

See the above section for requirements on how to create tokens using the Admin (HTTP) API.

##### OAuthbearer

Oauthbearer uses a OAuth2/OIDC security provider to authenticate a token in Gateway. The Oauth credentials base is managed in the configured provider.

This mechanism will also allow you to verify some claims from your OIDC provider ( `audience` and `issuer` ).

Gateway configuration:

```yaml
GATEWAY_SECURITY_PROTOCOL: SASL_SSL
GATEWAY_OAUTH_JWKS_URL: https://login.microsoftonline.com/common/discovery/keys
GATEWAY_OAUTH_EXPECTED_ISSUER: https://sts.windows.net/xxxxxxxx-df00-48cd-805b-1ebe914e8b11/
GATEWAY_OAUTH_EXPECTED_AUDIENCES: "[00000002-0000-0000-c000-000000000000]"  
GATEWAY_SSL_KEY_STORE_PATH: /path/to/your/keystore.jks        
GATEWAY_SSL_KEY_STORE_PASSWORD: yourKeystorePassword
GATEWAY_SSL_KEY_PASSWORD: yourKeyPassword
```

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

#### DELEGATED_SASL_PLAINTEXT

Authentication from client is mandatory but will be forwarded to Kafka for checking. Gateway will intercept exchanged authentication data to detect an authenticated principal:

- All communication between the client and Gateway broker are exchanged without any network security.
- All credentials are managed by your backing Kafka, we only provide Authorization on the Gateway side based on the exchanged principal.

Supported authentication mechanisms on the backing Kafka are:

- PLAIN
- SCRAM-SHA-256
- SCRAM-SHA-512
- OAUTHBEARER
- AWS_MSK_IAM

Gateway configuration: using PLAIN, as used for example on Confluent Cloud:

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

#### DELEGATED_SASL_SSL

Authentication from the client is mandatory but will be forwarded to Kafka. Gateway will intercept exchanged authentication data to detect an authenticated principal:

- All communication between the client and Gateway broker will be encrypted using TLS.
- All credentials are managed by your backing Kafka, we only provide Authorization on the Gateway side based on the exchanged principal.

Supported authentication mechanisms on the backing Kafka are:

- PLAIN
- SCRAM-SHA-256
- SCRAM-SHA-512
- OAUTHBEARER
- AWS_MSK_IAM

Gateway configuration using PLAIN, as used for example on Confluent Cloud:

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

### Automatic security protocol detection (default behavior)

On startup Gateway will attempt to detect the security protocol to use based on the Kafka configuration if you don't specify any security protocol. If there's also no security protocol on the backing Kafka cluster, then we set the security protocol to `PLAINTEXT` by default.

Here's our mapping from the Kafka cluster's defined protocol:

| Kafka cluster security protocol | Gateway cluster inferred security protocol |
| ------------------------------- | ------------------------------------------ |
| SASL_SSL                        | DELEGATED_SASL_SSL                         |
| SASL_PLAINTEXT                  | DELEGATED_SASL_PLAINTEXT                   |
| SSL                             | SSL                                        |
| PLAINTEXT                       | PLAINTEXT                                  |

Note that you can always see the inferred security protocol on the startup log of Gateway.

```
2025-03-07T15:40:12.260+0100 [      main] [INFO ] [Bootstrap:70] - Computed configuration :
---
gatewayClusterId: "gateway"
...
authenticationConfig:
  securityProtocol: "SASL_PLAINTEXT"
  sslConfig:
...

```

### Re-authentication support

We support Apache Kafka Re authentication as Kafka brokers. [See KIP-368](https://cwiki.apache.org/confluence/display/KAFKA/KIP-368%3A+Allow+SASL+Connections+to+Periodically+Re-Authenticate) for details.

## 5. Decide on Virtual Clusters

A Virtual Cluster in Conduktor Gateway is a logical representation of a Kafka cluster.

This allows you to create multiple virtual clusters while maintaining a single physical Kafka cluster, enabling the simulation of multiple Kafka environments on a single physical infrastructure.

![image.png](/guides/vclusters.png)

:::info[Optional feature]
Virtual Clusters are entirely optional. If you choose to not configure any, Conduktor Gateway will act as a transparent proxy for your backing Kafka Cluster. This is the default mode and all topics/resources will be visible and accessible as usual, without any additional configuration.  
:::

#### Virtual cluster benefits

**Flexibility and scalability**: Virtual Clusters provide the flexibility to simulate multiple independent Kafka clusters without the need for additional physical resources. This is particularly useful for environments where different teams or applications require separate Kafka instances but maintaining multiple physical clusters would be cost-prohibitive or complex.

**Isolation and multitenancy**: By using Virtual Clusters, you can ensure isolation between different logical clusters, similar to enabling multitenancy in Kafka. Each Virtual Cluster can have its own set of topics and consumer groups, and these are managed independently even though they reside on the same physical cluster.

**Resource efficiency**: Instead of deploying and managing multiple physical clusters, which can be resource-intensive and expensive, Virtual Clusters allow you to maximize the utilization of a single physical Kafka cluster. This leads to better resource management and operational efficiency.

#### Example

When you create a Virtual Cluster in Conduktor Gateway, it prefixes all resources (such as topics and consumer groups) associated with that Virtual Cluster on the backing physical Kafka cluster.

This prefixing ensures that there's no overlap or conflict between resources belonging to different Virtual Clusters, thereby maintaining their isolation.

In the example below, we assume a topic `order` has been created on Virtual Cluster `vc-alice`. Let's see how other Virtual Clusters and Backing cluster perceive this:

````shell
# Listing topics on Virtual Cluster vc-alice
$ kafka-topics --bootstrap-server=gateway:6969 --command-config vc-alice.properties --list
orders
# As expected, Alice sees its topic normally. 

# Now let's check what happens if we list the topics with Bob
$ kafka-topics --bootstrap-server=gateway:6969 --command-config vc-bob.properties --list
[]
# Bob doesn't see Alice's topics. 

# Let's try to create the same topic for Bob
$ kafka-topics --bootstrap-server=gateway:6969 --command-config vc-bob.properties --create --topic orders 
$ kafka-topics --bootstrap-server=gateway:6969 --command-config vc-bob.properties --list
orders

# If we contact directly the backing cluster instead of the gateway, 
# we can see both topics under a different name. This is the actual topic name on the Kafka cluster, which is observed when not interacting through the Gateway.
$ kafka-topics.sh --bootstrap-server=backing-kafka:9092  --list
vc-alice.orders
vc-bob.orders

````

## Configure Gateway for failover

In a disaster recovery or business continuity scenario, we want to be able to switch clients from one Kafka cluster (the primary) to another one (the secondary) without having to reconfigure the clients.

Reconfiguring clients would at least involve changing the bootstrap servers of the clients, forcing the clients to refresh the metadata and retry all messages in flight. It might also involve distributing new credentials to the clients. For example, API keys and secrets in Confluent Cloud are tied to a specific cluster. Other Kafka providers might have different restrictions.

Essentially, this implies that the central operations/Kafka team (who would be responsible for initiating the failover-process) would have knowledge about all clients, which in practice is not feasible. The failover capability of Gateway solves this by redirecting client connections from the primary to the secondary cluster. This can be initiated at a central location using the Gateway HTTP API without having to reconfigure/restart each Kafka client individually.

#### Pre-requisites

#### Data replication is already in place

Gateway does not currently provide any mechanism to replicate already written data from the primary to the secondary cluster. Therefore, to make use of our solution, you should already have this mechanism in place. Common solutions for this include:

 - MirrorMaker 2
 - Confluent Replicator
 - Confluent Cluster Linking

Note that none of these solutions (and therefore neither Conduktor's failover solution) can guarantee the absence of data loss during a disaster scenario.

#### Kafka client configuration

No specific client configuration is necessary, besides ensuring that clients have configured enough retries (or that the `delivery.timeout.ms` for JVM-based clients) setting is large enough to cover the time necessary for the operations team to discover failure of the primary cluster and initiate a failover procedure. Especially for JVM-based clients, the default delivery timeout of 2 minutes might be too short.

#### System requirements

 - Gateway version `3.3.0`+
 - Kafka brokers version `2.8.2`+

Note that due to a current limitation in Kafka clients, the primary and secondary Kafka clusters must have some broker id's in common (see [KIP-899](https://cwiki.apache.org/confluence/display/KAFKA/KIP-899%3A+Allow+producer+and+consumer+clients+to+rebootstrap)). This ensures clients can recognize the secondary cluster as a legitimate continuation of the primary one.

#### How it works

Conduktor Gateway acts as a 'hot-switch' to the secondary Kafka cluster, eliminating the need to change any client configurations in a disaster scenario. This is achievable because Gateway de-couples authentication between clients and the backing Kakfa cluster(s).

Note that to initiate failover, it must be triggered through an API request to every Gateway instance. The Conduktor team can support you in finding the best solution for initiating failover, depending on your deployment specifities.

![Failover]assets/failover-docs.png

##### Set up Gateway

To set up Gateway for failover, you should configure the primary and secondary clusters along with their configuration properties. This can be achieved through a **cluster-config file**, or through **environment variables**.

###### Configuring through a cluster-config file

Specify your primary and secondary cluster configurations, along with a `gateway.roles` entry to mark the failover cluster - note that the API keys differ in the Confluent Cloud example below:

```yaml
config:
  main:
    bootstrap.servers: <primary bootstrap address>:9092
    security.protocol: SASL_SSL
    sasl.mechanism: PLAIN
    sasl.jaas.config: org.apache.kafka.common.security.plain.PlainLoginModule required username="<primary-api-key>" password="<primary-api-secret>";
  failover:
    bootstrap.servers: <secondary bootstrap address>:9092
    security.protocol: SASL_SSL
    sasl.mechanism: PLAIN
    sasl.jaas.config: org.apache.kafka.common.security.plain.PlainLoginModule required username="<secondary-api-key>" password="<secondary-api-secret>";
    gateway.roles: failover
```

Mount the cluster config file in the Gateway container using the configuration `GATEWAY_BACKEND_KAFKA_SELECTOR`:

```yaml
GATEWAY_BACKEND_KAFKA_SELECTOR: 'file : { path: /cluster-config.yaml}'
```

##### Configuring through environment variables

Alternatively, you can configure your primary and secondary cluster through environment variables:

```bash
KAFKA_MAIN_BOOTSTRAP_SERVERS='<primary bootstrap address>:9092'
KAFKA_MAIN_SECURITY_PROTOCOL='SASL_SSL'
KAFKA_MAIN_SASL_MECHANISM='PLAIN'
KAFKA_MAIN_SASL_JAAS_CONFIG='org.apache.kafka.common.security.plain.PlainLoginModule required username="<primary-api-key>" password="<primary-api-secret>";'
KAFKA_FAILOVER_BOOTSTRAP_SERVERS='<secondary bootstrap address>:9092'
KAFKA_FAILOVER_SECURITY_PROTOCOL='SASL_SSL'
KAFKA_FAILOVER_SASL_MECHANISM='PLAIN'
KAFKA_FAILOVER_SASL_JAAS_CONFIG='org.apache.kafka.common.security.plain.PlainLoginModule required username="<secondary-api-key>" password="<secondary-api-secret>";'
KAFKA_FAILOVER_GATEWAY_ROLES='failover'
```

##### Initiating failover

To initiate failing over from the primary to the secondary cluster, the following request must be made to all Gateway instances:

```bash
curl \
  --request POST 'http://localhost:8888/admin/pclusters/v1/pcluster/main/switch?to=failover' \
  --user 'admin:conduktor' \
  --silent | jq
```

##### Switching back

To switch back from the secondary cluster to the primary cluster, the following request must be made to all Gateway instances:

```bash
curl \
  --request POST 'http://localhost:8888/admin/pclusters/v1/pcluster/main/switch?to=main' \
  --user 'admin:conduktor' \
  --silent | jq
```

###### Alternative solutions to switchover

Note that Conduktor can recommend alternative solutions for initiating the switchover that does not involve making an API call to every Gateway instance. These alternatives are dependent on your deployment configuration, therefore we recommend [contacting us](https://www.conduktor.io/contact/demo/?utm_source=docs&utm_medium=webpage) to discuss this.

###### Failover limitation

During a failover event, the following functionality will not work:
 - Chargeback: Chargeback will only collect data for the original cluster. During a failover event data is not collected but would resume if failed back to the original cluster.

## Define environment variables

To configure Conduktor Gateway, we recommend setting up environment variables. They can be **set in the Gateway container** or **taken from a file**. To make sure the values were set correctly, check the startup logs.

#### Use the Gateway container

<Tabs>
<TabItem value="First tab" label="Docker">

You can set the environment variables during the docker-run command with `-e` or `--env`:

```shell
docker run -d \
  -e KAFKA_BOOTSTRAP_SERVERS=kafka1:9092,kafka2:9092 \
  -e KAFKA_SECURITY_PROTOCOL=SASL_PLAINTEXT \
  -e KAFKA_SASL_MECHANISM=PLAIN \
  -e KAFKA_SASL_JAAS_CONFIG="org.apache.kafka.common.security.plain.PlainLoginModule required username='usr' password='pwd';" \
  -p 6969:6969 \
  conduktor/conduktor-gateway:latest
```

Or in a `docker-compose.yaml`:

```yaml
services:
  conduktor-gateway:
    image: conduktor/conduktor-gateway:latest
    ports:
      - 6969:6969
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
      KAFKA_SASL_MECHANISM: PLAIN
      KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required username='usr' password='pwd';
```

</TabItem>
<TabItem value="Second tab" label="Kubernetes">

You can set the environment variables in the `values.yaml` of our [Helm chart](https://github.com/conduktor/conduktor-public-charts/blob/main/charts/gateway/README.md):

```yaml
gateway:
  env:
    KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092
    KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
    KAFKA_SASL_MECHANISM: PLAIN
    KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required username='usr' password='pwd';
```

</TabItem>
</Tabs>

#### Use a file

You can mount a file with the key-value pairs into the container and provide its path by setting the environment variable `GATEWAY_ENV_FILE`.

```env title="Example"
KAFKA_BOOTSTRAP_SERVERS=kafka1:9092,kafka2:9092
KAFKA_SECURITY_PROTOCOL=SASL_PLAINTEXT
KAFKA_SASL_MECHANISM=PLAIN
KAFKA_SASL_JAAS_CONFIG=org.apache.kafka.common.security.plain.PlainLoginModule required username='usr' password='pwd';
```

You'll get a confirmation in the logs: `Sourcing environment variables from $GATEWAY_ENV_FILE` (or a warning if the file isn't found: `Warning: GATEWAY_ENV_FILE is set but the file does not exist or is not readable.`).

### Networking

#### Port and SNI routing

| **Environment variable**                                                        | **Description**                                                                                                                                            | **Default value**                                                                                       |
|---------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| **Common properties**                                                           |                                                                                                                                                            |                                                                                                         |
| `GATEWAY_ADVERTISED_HOST`                                                       | The hostname returned in the Gateway’s metadata for clients to connect to.                                                                                 | Your hostname                                                                                           |
| `GATEWAY_ROUTING_MECHANISM`                                                     | Defines the routing method: **`port` for port routing, `host` for SNI routing**.                                                                           | `port`                                                                                                  |
| `GATEWAY_PORT_START`                                                            | The first port the Gateway listens on.                                                                                                                     | `6969`                                                                                                  |
| `GATEWAY_MIN_BROKERID`                                                          | The broker ID associated with the first port (`GATEWAY_PORT_START`). Should match the lowest `broker.id` (or `node.id`) in the Kafka cluster.              | `0`                                                                                                     |
| `GATEWAY_BIND_HOST`                                                             | The network interface the Gateway binds to.                                                                                                                | `0.0.0.0`                                                                                               |
| [**Port routing specific**](/gateway/configuration/network/#port-based-routing) |                                                                                                                                                            |                                                                                                         |
| `GATEWAY_PORT_COUNT`                                                            | The total number of ports used by Gateway.                                                                                                             | `(maxBrokerId - minBrokerId) + 3`                                                                       |
| [**SNI routing specific**](/gateway/how-to/sni-routing)                         |                                                                                                                                                            |                                                                                                         |
| `GATEWAY_ADVERTISED_SNI_PORT`                                                   | The port returned in the Gateway’s metadata for clients to connect to when using SNI routing.                                                              | `GATEWAY_PORT_START`                                                                                    |
| `GATEWAY_ADVERTISED_HOST_PREFIX`                                                | Configures the advertised broker names.                                                                                                                    | `broker`                                                                                                |
| `GATEWAY_SECURITY_PROTOCOL`                                                     | Defines the security protocol that clients should use to connect to Gateway. **Must be set to `SSL`, `SASL_SSL`, or `DELEGATED_SASL_SSL`** for SNI routing. | The default value depends on KAFKA_SECURITY_PROTOCOL. (images/gateway-security-protocol-default.png) |
| `GATEWAY_SNI_HOST_SEPARATOR`                                                    | The separator used to construct returned metadata.                                                                                                         | `-`                                                                                                     |

### Load balancing

| **Environment variable**                        | **Description**                                                                                                           | **Default value** |
|-------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|-------------------|
| `GATEWAY_CLUSTER_ID`                            | A unique identifier for a given Gateway cluster, used to establish Gateway cluster membership for load balancing. | `gateway`         |
| `GATEWAY_FEATURE_FLAGS_INTERNAL_LOAD_BALANCING` | Whether to use Conduktor Gateway's internal load balancer to balance connections between Gateway instances.               | `true`            |
| `GATEWAY_RACK_ID`                               | Similar to `broker.rack`.                                                                                                 |                   |

### HTTP API

| **Environment variable**             | **Description**                                                                                                                    | **Default value**                                       |
|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------|
| `GATEWAY_HTTP_PORT`                  | The port on which Gateway will present the HTTP management API.                                                                | `8888`                                                  |
| `GATEWAY_SECURED_METRICS`            | Determines whether the HTTP management API requires authentication.                                                                | `true`                                                  |
| `GATEWAY_ADMIN_API_USERS`            | Users that can access the API. Admin access is required for *write* operations. To grant *read-only* access, set `admin: true`. | `[{username: admin, password: conduktor, admin: true}]` |
| **HTTPS configuration**              |                                                                                                                                    |                                                         |
| `GATEWAY_HTTPS_KEY_STORE_PATH`       | Enables HTTPS and specifies the keystore to use for TLS connections.                                                               |                                                         |
| `GATEWAY_HTTPS_KEY_STORE_PASSWORD`   | Sets the password for the keystore used in HTTPS TLS connections.                                                                  |                                                         |
| `GATEWAY_HTTPS_CLIENT_AUTH`          | Client authentication configuration for mTLS. Possible values: `NONE`, `REQUEST`, `REQUIRED`.                                      | `NONE`                                                  |
| `GATEWAY_HTTPS_TRUST_STORE_PATH`     | Specifies the truststore used for mTLS.                                                                                            |                                                         |
| `GATEWAY_HTTPS_TRUST_STORE_PASSWORD` | Password for the truststore defined above.                                                                                         |                                                         |

### Upstream connection

| **Environment variable**                | **Description**                                                                                                                      | **Default value** |
|-----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| `GATEWAY_UPSTREAM_CONNECTION_POOL_TYPE` | Upstream connection pool type. Possible values are `NONE` (no connection pool), `ROUND_ROBIN` (Round robin selected connection pool) | `NONE`            |
| `GATEWAY_UPSTREAM_NUM_CONNECTION`       | The number of connections between Conduktor Gateway and Kafka per upstream thread. Used only when `ROUND_ROBIN` is enabled.          | `10`              |

### Licensing

| **Environment variable** | **Description** | **Default value** |
|--------------------------|-----------------|-------------------|
| `GATEWAY_LICENSE_KEY`    | License key     | None              |

### Connect from Gateway to Kafka

Conduktor Gateway's connection to Kafka is configured by the `KAFKA_` environment variables.

When translating Kafka's properties, **use upper case instead** and replace the `.` with `_`. For example:  

When defining Gateway's Kafka property `bootstrap.servers`, declare it as the environment variable `KAFKA_BOOTSTRAP_SERVERS`. Any variable prefixed with `KAFKA_` will be treated as a connection parameter by Gateway. You can [find snippets for each security protocol](/gateway/configuration/kafka-authentication/).

### Connect from clients to Gateway

| **Environment variable**                          | **Description**                                                                                                                                                                                                          | **Default value**                                                                                       |
|---------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| `GATEWAY_SECURITY_PROTOCOL`                       | The type of authentication clients should use to connect to Gateway. Valid values are: `PLAINTEXT`, `SASL_PLAINTEXT`, `SASL_SSL`, `SSL`, `DELEGATED_SASL_PLAINTEXT` and `DELEGATED_SASL_SSL`.                         | The default value depends on KAFKA_SECURITY_PROTOCOL. (gateway-security-protocol-default.png) |
| `GATEWAY_FEATURE_FLAGS_MANDATORY_VCLUSTER`        | If no virtual cluster was detected, the user then automatically falls back into the transparent virtual cluster called `passthrough`. Reject authentication if set to `true` and vcluster isn't configured for a principal. | `false`                                                                                                 |
| `GATEWAY_ACL_ENABLED`                             | Enable/disable ACLs support on the Gateway transparent virtual cluster (`passthrough`) only.                                                                                                                             | `false`                                                                                                 |
| `GATEWAY_SUPER_USERS`                             | Semicolon-separated (`;`) list of service accounts that will be super users on Gateway (**excluding virtual clusters**).<br/> Example: `alice;bob`.                                                                      | Usernames from GATEWAY_ADMIN_API_USERS                                                                  |
| `GATEWAY_ACL_STORE_ENABLED`                       | **Obsolete, use [VirtualCluster](/gateway/reference/resources-reference/#virtualcluster) resource now** <br/>Enable/disable ACLs support for Virtual Clusters only.                                                      | `false`                                                                                                 |
| `GATEWAY_AUTHENTICATION_CONNECTION_MAX_REAUTH_MS` | Force the client re-authentication after this amount of time. If set to 0, we never force the client to re-authenticate until the next connection                                                                                                    | `0`                                                                                                     |

#### SSL authentication

[See client authentication for details](/gateway/configuration/client-authentication/#ssl).

| **Environment variable**                      | **Description**                                                                                                                                                                                                                                                                                                                                                                                       | **Default value**    |
|-----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|
| **Keystore**                                  |                                                                                                                                                                                                                                                                                                                                                                                                       |                      |
| `GATEWAY_SSL_KEY_STORE_PATH`                  | Path to a mounted keystore for SSL connections                                                                                                                                                                                                                                                                                                                                                        |                      |
| `GATEWAY_SSL_KEY_STORE_PASSWORD`              | Password for the keystore defined above                                                                                                                                                                                                                                                                                                                                                               |                      |
| `GATEWAY_SSL_KEY_PASSWORD`                    | Password for the key contained in the store above                                                                                                                                                                                                                                                                                                                                                     |                      |
| `GATEWAY_SSL_KEY_TYPE`                        | `jks`or `pkcs12`                                                                                                                                                                                                                                                                                                                                                                                      | `jks`                |
| `GATEWAY_SSL_UPDATE_CONTEXT_INTERVAL_MINUTES` | Interval in minutes to refresh SSL context                                                                                                                                                                                                                                                                                                                                                            | `5`                  |
| **Truststore (for mTLS)**                     |                                                                                                                                                                                                                                                                                                                                                                                                       |                      |
| `GATEWAY_SSL_TRUST_STORE_PATH`                | Path to a keystore for SSL connections                                                                                                                                                                                                                                                                                                                                                                |                      |
| `GATEWAY_SSL_TRUST_STORE_PASSWORD`            | Password for the truststore defined above                                                                                                                                                                                                                                                                                                                                                             |                      |
| `GATEWAY_SSL_TRUST_STORE_TYPE`                | `jks`, `pkcs12`                                                                                                                                                                                                                                                                                                                                                                                       | `jks`                |
| `GATEWAY_SSL_CLIENT_AUTH`                     | `NONE` will not request client authentication, `OPTIONAL` will request client authentication, `REQUIRE` will require client authentication                                                                                                                                                                                                                                                            | `NONE`               |
| `GATEWAY_SSL_PRINCIPAL_MAPPING_RULES`         | mTLS leverages SSL mutual authentication to identify a Kafka client. Principal for mTLS connection can be detected from the subject certificate using the same feature as in Apache Kafka, the [SSL principal mapping](https://docs.confluent.io/platform/current/kafka/configure-mds/mutual-tls-auth-rbac.html#principal-mapping-rules-for-tls-ssl-listeners-extract-a-principal-from-a-certificate) | Extracts the subject |

#### OAuthbearer

Some of these definitions (e.g. `SASL_OAUTHBEARER_JWKS_ENDPOINT_REFRESH`) are taken from [Kafka documentation](https://kafka.apache.org/35/javadoc/constant-values.html#org.apache.kafka.common.config.SaslConfigs.SASL_OAUTHBEARER_JWKS_ENDPOINT_REFRESH_MS_DOC).

| **Environment variable**           | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_OAUTH_JWKS_URL`           | The OAuth/OIDC provider URL from which the provider's JWKS (JSON Web Key Set) can be retrieved. The URL can be HTTP(S)-based or file-based.                                                                                                                                                                                                                                                                                                                           |
| `GATEWAY_OAUTH_EXPECTED_ISSUER`    | The (optional) setting for the broker to use to verify that the JWT was created by the expected issuer. The JWT will be inspected for the standard OAuth `iss` claim and if this value is set, the broker will match it exactly against what is in the JWT's `iss` claim. If there's no match, the broker will reject the JWT and authentication will fail                                                                                                           |
| `GATEWAY_OAUTH_EXPECTED_AUDIENCES` | The (optional) comma-delimited setting for the broker to use to verify that the JWT was issued for one of the expected audiences. The JWT will be inspected for the standard OAuth `aud` claim and if this value is set, the broker will match the value from JWT's `aud` claim to see if there is an exact match. If there's no match, the broker will reject the JWT and authentication will fail.                                                                 |
| `GATEWAY_OAUTH_JWKS_REFRESH`       | The (optional) value in milliseconds for the broker to wait between refreshing its JWKS (JSON Web Key Set) cache that contains the keys to verify the signature of the JWT.                                                                                                                                                                                                                                                                                           |
| `GATEWAY_OAUTH_JWKS_RETRY`         | The (optional) value in milliseconds for the initial wait between JWKS (JSON Web Key Set) retrieval attempts from the external authentication provider. JWKS retrieval uses an exponential backoff algorithm with an initial wait based on the *sasl.oauthbearer.jwks.endpoint.retry.backoff.ms* setting and will double in wait length between attempts, up to a maximum wait length specified by **sasl.oauthbearer.jwks.endpoint.retry.backoff.max.ms**.       |
| `GATEWAY_OAUTH_JWKS_MAX_RETRY`     | The (optional) value in milliseconds for the maximum wait between attempts to retrieve the JWKS (JSON Web Key Set) from the external authentication provider. JWKS retrieval uses an exponential backoff algorithm with an initial wait based on the *sasl.oauthbearer.jwks.endpoint.retry.backoff.ms* setting and will double in wait length between attempts, up to a maximum wait length specified by **sasl.oauthbearer.jwks.endpoint.retry.backoff.max.ms**. |
| `GATEWAY_OAUTH_SCOPE_CLAIM_NAME`   | The OAuth claim for the scope is often named `scope` but this (optional) setting can provide a different name to use for the scope included in the JWT payload's claims, if the OAuth/OIDC provider uses a different name for that claim.                                                                                                                                                                                                                             |
| `GATEWAY_OAUTH_SUB_CLAIM_NAME`     | The OAuth claim for the subject is often named `sub`, but this (optional) setting can provide a different name to use for the subject included in the JWT payload's claims, if the OAuth/OIDC provider uses a different name for that claim.                                                                                                                                                                                                                           |
| `GATEWAY_OAUTH_USE_CC_POOL_ID`     | Set to `true` to use the Confluent Cloud pool ID as the principal name. This is useful for Confluent Cloud users in Delegated mode who want to use the pool ID as the principal name instead of the `sub` claim.                                                                                                                                                                                                                                                      |

#### Plain authentication

[See client authentication for details](/gateway/configuration/client-authentication/#plain).

| **Environment variable**                     | **Description**                                                                                                                                                                                                                                                                                                                                                           | **Default value**                                                 |
|----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| `GATEWAY_USER_POOL_SECRET_KEY`               | Base64 encoded value of 256bits long (e.g. `openssl rand -base64 32`). If using SASL_PLAIN or SASL_SSL, you have the ability to create local service accounts on Gateway. These service accounts will have credentials generated by Gateway based on the `GATEWAY_USER_POOL_SECRET_KEY`. We strongly recommend that you **change this value for production deployments**. | A default value is used to sign tokens and **has to be changed**. |
| `GATEWAY_USER_POOL_SERVICE_ACCOUNT_REQUIRED` | If true, verify the existence of user mapping for the service account when the user connects in Non-Delegated SASL/PLAIN mode.                                                                                                                                                                                                                                            | `false`                                                           |

### Security provider

| **Environment variable**    | **Description**                                                                                                                                                                             | **Default value** |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| `GATEWAY_SECURITY_PROVIDER` | Specify your security provider. It can be: `DEFAULT` (from your JRE), `BOUNCY_CASTLE`, `BOUNCY_CASTLE_FIPS` and `CONSCRYPT`. Please note that `CONSCRYPT` doesn't support Mac OS with aarch64. | `DEFAULT`         |

### Cluster switching / failover

Setting up your Kafka clusters for [failover](/gateway/how-to/configuring-failover) is similar to the standard setup, but you need to provide two sets of properties: one for your main cluster and one for your failover cluster.

You can define these properties as environment variables or load a [cluster configuration file](/gateway/how-to/configuring-failover/#configuring-through-a-cluster-config-file).

| **Environment variable**           | **Description**                                                                                                  |
|------------------------------------|------------------------------------------------------------------------------------------------------------------|
| `GATEWAY_BACKEND_KAFKA_SELECTOR`   | Indicates the use of a configuration file and provides its path, e.g.: `'file: { path: /cluster-config.yaml }'`. |
| `KAFKA_FAILOVER_GATEWAY_ROLES`     | To turn Gateway into failover mode, set this to `failover`.                                    |
| **Main Cluster**                   |                                                                                                                  |
| `KAFKA_MAIN_BOOTSTRAP_SERVERS`     | Bootstrap server.                                                                                                |
| `KAFKA_MAIN_SECURITY_PROTOCOL`     | Security protocol.                                                                                               |
| `KAFKA_MAIN_SASL_MECHANISM`        | SASL mechanism.                                                                                                  |
| `KAFKA_MAIN_SASL_JAAS_CONFIG`      | SASL JAAS config.                                                                                                |
| **Failover Cluster**               |                                                                                                                  |
| `KAFKA_FAILOVER_BOOTSTRAP_SERVERS` | Bootstrap server.                                                                                                |
| `KAFKA_FAILOVER_SECURITY_PROTOCOL` | Security protocol.                                                                                               |
| `KAFKA_FAILOVER_SASL_MECHANISM`    | SASL mechanism.                                                                                                  |
| `KAFKA_FAILOVER_SASL_JAAS_CONFIG`  | SASL JAAS config.                                                                                                |

### Internal topics

As the Gateway is stateless, it uses Kafka topics to store its internal state. Use the following environment variables to configure these internal topics.

If missing, Gateway will automatically create the topics (if it has the permission to do so). You can also create the topics independently of Gateway, just make sure they are configured as described below.

#### Internal state

Firstly, there are some general configuration settings for Gateway internal state management which apply to all used topics.

| **Environment variable**                        | **Description**                                                                                                                                                                                     | **Default value**                 |
|-------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|
| `GATEWAY_GROUP_ID`                              | Set a consumer group name which will be used by Gateway to consume the internal license topic. This consumer group will be used by Gateways from the same cluster to recognize each other. | `conduktor_${GATEWAY_CLUSTER_ID}` |
| `GATEWAY_STORE_TTL_MS`                          | Time between full refresh.                                                                                                                                                                          | `604800000`                       |
| `GATEWAY_TOPIC_STORE_KCACHE_REPLICATION_FACTOR` | Defaults to the value defined in your cluster settings.                                                                                                                                               | `-1`                              |

#### Topic names

| **Environment variable**            | **Description**                                                                           | **Default value**                                         |
|-------------------------------------|-------------------------------------------------------------------------------------------|-----------------------------------------------------------|
| `GATEWAY_LICENSE_TOPIC`             | Topic where the license is stored.                                                        | `_conduktor_${GATEWAY_CLUSTER_ID}_license`                |
| `GATEWAY_TOPIC_MAPPINGS_TOPIC`      | Topic where the topics aliases are stored.                                                | `_conduktor_${GATEWAY_CLUSTER_ID}_topicmappings`          |
| `GATEWAY_USER_MAPPINGS_TOPIC`       | Topic where the service accounts are stored.                                              | `_conduktor_${GATEWAY_CLUSTER_ID}_usermappings`           |
| `GATEWAY_CONSUMER_OFFSETS_TOPIC`    | Topic where the offsets for concentrated topic consumption are stored.                    | `_conduktor_${GATEWAY_CLUSTER_ID}_consumer_offsets`       |
| `GATEWAY_INTERCEPTOR_CONFIGS_TOPIC` | Topic where the deployed interceptors are stored.                                         | `_conduktor_${GATEWAY_CLUSTER_ID}_interceptor_configs`    |
| `GATEWAY_ENCRYPTION_CONFIGS_TOPIC`  | Topic where the encryption configuration is stored, in specific cases.                    | `_conduktor_${GATEWAY_CLUSTER_ID}_encryption_configs`     |
| `GATEWAY_ACLS_TOPIC`                | Topic where the ACLs managed by Gateway are stored.                                       | `_conduktor_${GATEWAY_CLUSTER_ID}_acls`                   |
| `GATEWAY_AUDIT_LOG_TOPIC`           | Topic where the Gateway audit log is stored.                                              | `_conduktor_${GATEWAY_CLUSTER_ID}_auditlogs`              |
| `GATEWAY_VCLUSTERS_TOPIC`           | Topic where the virtual clusters are stored.                                              | `_conduktor_${GATEWAY_CLUSTER_ID}_vclusters`              |
| `GATEWAY_GROUPS_TOPIC`              | Topic where the service account groups are stored.                                        | `_conduktor_${GATEWAY_CLUSTER_ID}_groups`                 |
| `GATEWAY_ENCRYPTION_KEYS_TOPIC`     | Name of the topic for storing EDEKs when `gateway` KMS enabled in encryption interceptors | `_conduktor_${GATEWAY_CLUSTER_ID}_encryption_keys`        |
| `GATEWAY_DATA_QUALITY_TOPIC`        | Topic where the data quality violation are stored.                                        | `_conduktor_${GATEWAY_CLUSTER_ID}_data_quality_violation` |

#### Required topic configuration

The most important setting is `log.cleanup.policy` which defines the clean up policy for the topic. Most of the topics used by Gateway are compacted, but some use time-based retention. If this isn't set up properly, Gateway will throw an error on startup. Set the following:

- `log.cleanup.policy=compact` for compaction
- `log.cleanup.policy=delete` for time based retention

If Gateway creates the topics for you, it will set the right values.

The second vital setting is the **replication factor**. This should be set to **at least 3 in production environments** to ensure that the data is safe (Gateway will warn you on startup, if it's set to less than three). When creating topics, Gateway uses the default value for your Kafka brokers for this setting.

For partition count, most of the topics are low volume and can operate well with only a single partition. This isn't enforced (Gateway will work with multi partition topics for internal state), however there is no need to have more than one partition.

The exception to this is the audit log topic which can have a lot of events written to it, if enabled for a busy cluster. We recommend starting with 3 partitions for audit logs (this doesn't affect Gateway performance as it is a writer, not a reader), but will impact any other consumers you may run reading from it.

| Topic                                                     | Cleanup policy | Recommended partitions | Other configuration                                                                  |
|-----------------------------------------------------------|----------------|------------------------|--------------------------------------------------------------------------------------|
| `_conduktor_${GATEWAY_CLUSTER_ID}_license`                | compact        | 1                      |                                                                                      |
| `_conduktor_${GATEWAY_CLUSTER_ID}_topicmappings`          | compact        | 1                      |                                                                                      |
| `_conduktor_${GATEWAY_CLUSTER_ID}_usermappings`           | compact        | 1                      |                                                                                      |
| `_conduktor_${GATEWAY_CLUSTER_ID}_consumer_offsets`       | compact        | 1                      |                                                                                      |
| `_conduktor_${GATEWAY_CLUSTER_ID}_interceptor_configs`    | compact        | 1                      |                                                                                      |
| `_conduktor_${GATEWAY_CLUSTER_ID}_encryption_configs`     | compact        | 1                      |                                                                                      |
| `_conduktor_${GATEWAY_CLUSTER_ID}_acls`                   | compact        | 1                      |                                                                                      |
| `_conduktor_${GATEWAY_CLUSTER_ID}_vclusters`              | compact        | 1                      |                                                                                      |
| `_conduktor_${GATEWAY_CLUSTER_ID}_groups`                 | compact        | 1                      |                                                                                      |
| `_conduktor_${GATEWAY_CLUSTER_ID}_encryption_keys`        | compact        | 1                      |                                                                                      |
| `_conduktor_${GATEWAY_CLUSTER_ID}_auditlogs`              | delete         | 3                      | We recommend a retention time of around 7 days for this topic due to its high volume.|
| `_conduktor_${GATEWAY_CLUSTER_ID}_data_quality_violation` | delete         | 1                      |                                                                                      |

### Internal setup

#### Threading

| **Environment variable**    | **Description**                                                                      | **Default value** |
|-----------------------------|--------------------------------------------------------------------------------------|-------------------|
| `GATEWAY_DOWNSTREAM_THREAD` | The number of threads dedicated to handling IO between clients and Conduktor Gateway.| Number of cores   |
| `GATEWAY_UPSTREAM_THREAD`   | The number of threads dedicated to handling IO between Kafka and Conduktor Gateway.  | Number of cores   |

#### Feature flags

| **Environment variable**                        | **Description**                                              | **Default value** |
|-------------------------------------------------|--------------------------------------------------------------|-------------------|
| `GATEWAY_FEATURE_FLAGS_AUDIT`                   | Whether or not to enable the audit feature.                  | `true`            |
| `GATEWAY_FEATURE_FLAGS_INTERNAL_LOAD_BALANCING` | Whether or not to enable the Gateway internal load balancing.| `true`            |

### Monitoring

#### Audit

| **Environment variable**                        | **Description**                                                                                                     | **Default value** |
|-------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|-------------------|
| `GATEWAY_AUDIT_LOG_CONFIG_SPEC_VERSION`         | Version of the log.                                                                                                 | `0.1.0`           |
| `GATEWAY_AUDIT_LOG_SERVICE_BACKING_TOPIC`       | Target topic name.                                                                                                  | `_auditLogs`      |
| `GATEWAY_AUDIT_LOG_REPLICATION_FACTOR_OF_TOPIC` | Replication factor to be used when creating the audit topic, defaults to the one defined in your cluster settings.  | `-1`              |
| `GATEWAY_AUDIT_LOG_NUM_PARTITIONS_OF_TOPIC`     | Number of partitions to be used when creating the audit topic, defaults to the one defined in your cluster settings.| `-1`              |
| `GATEWAY_AUDIT_LOG_KAFKA_`                      | Overrides Kafka Producer configuration for audit logs, i.e.: `GATEWAY_AUDIT_LOG_KAFKA_LINGER_MS=0`                  |                   |

#### Logging

| **Environment variable**                               | **Description**                                                                                                             | **Default value** | **Package**                              |
|--------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------|------------------------------------------|
| `LOG4J2_APPENDER_LAYOUT`                               | The format to output Console logging. Use `json` for json layout or `pattern` for pattern layout.                           | `pattern`         |                                          |
| `LOG4J2_IO_CONDUKTOR_PROXY_NETWORK_LEVEL`              | Low-level networking, connection mapping, authentication, authorization.                                                    | `info`            | io.conduktor.proxy.network               |
| `LOG4J2_IO_CONDUKTOR_UPSTREAM_THREAD_LEVEL`            | Requests processing and forwarding. At `trace`, log requests sent.                                                          | `info`            | io.conduktor.proxy.thread.UpstreamThread |
| `LOG4J2_IO_CONDUKTOR_PROXY_REBUILDER_COMPONENTS_LEVEL` | Requests and responses rewriting. Logs responses payload in `debug` (useful for checking METADATA).                         | `info`            | io.conduktor.proxy.rebuilder.components  |
| `LOG4J2_IO_CONDUKTOR_PROXY_SERVICE_LEVEL`              | Various. Logs ACL checks and interceptor targeting at `debug`. Logs post-interceptor requests/response payload at `trace`.  | `info`            | io.conduktor.proxy.service               |
| `LOG4J2_IO_CONDUKTOR_LEVEL`                            | Get even more logs not covered by specific packages.                                                                        | `info`            | io.conduktor                             |
| `LOG4J2_ORG_APACHE_KAFKA_LEVEL`                        | Kafka log level.                                                                                                            | `warn`            | org.apache.kafka                         |
| `LOG4J2_IO_KCACHE_LEVEL`                               | Kcache log level (our persistence library).                                                                                 | `warn`            | io.kcache                                |
| `LOG4J2_IO_VERTX_LEVEL`                                | Vertx log level (our HTTP API framework).                                                                                   | `warn`            | io.vertx                                 |
| `LOG4J2_IO_NETTY_LEVEL`                                | Netty log level (our network framework).                                                                                    | `error`           | io.netty                                 |
| `LOG4J2_IO_MICROMETER_LEVEL`                           | Micrometer log level (our metrics framework).                                                                               | `error`           | io.micrometer                            |
| `LOG4J2_ROOT_LEVEL`                                    | Root logging level (applies to anything else that hasn't been listed above).                                                | `info`            | (root)                                   |

#### Product analytics

| **Environment variable**          | **Description**                                                                                                                                                                                                                               | **Default value** |
|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| `GATEWAY_FEATURE_FLAGS_ANALYTICS` | Conduktor collects basic user analytics to understand product usage and enhance product development and improvement, such as a Gateway Started event. This is not based on any of the underlying Kafka data which is never sent to Conduktor. | `true`            |

#### Data Quality topic configs

| **Environment variable**                        | **Description**                                                                                                            | **Default value**                                         |
|-------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------|
| `GATEWAY_DATA_QUALITY_TOPIC`                    | Target topic name                                                                                                          | `_conduktor_${GATEWAY_CLUSTER_ID}_data_quality_violation` |
| `GATEWAY_DATA_QUALITY_TOPIC_REPLICATION_FACTOR` | Replication factor to be used when creating the data quality topic, defaults to the one defined in your cluster settings   | cluster default                                           |
| `GATEWAY_DATA_QUALITY_TOPIC_PARTITIONS`         | Number of partitions to be used when creating the data quality topic, defaults to the one defined in your cluster settings | cluster default                                           |
| `GATEWAY_DATA_QUALITY_TOPIC_RETENTION_HOUR`     | Retention period (in hours) to be used when creating the data quality topic                                                | 168 (7 days)                                              |
