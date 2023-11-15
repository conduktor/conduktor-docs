---
sidebar_position: 3
title: Gateway Security
description: Securing Conduktor Gateway  
---

There are two sets of configuration to consider when securing your Gateway.

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

Provide Gateway with the environment variables to connect to Kafka, these start with a `KAFKA_` prefix.

```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.2.4
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092
      KAFKA_SASL_MECHANISM: PLAIN
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
      KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required  username="admin" password="admin-secret";
```

# Your client to Gateway security
You have several options when connecting clients to Gateway.
Passthrough security passes the existing credentials straight through to the backing cluster with no further checks. This is likely what you will use out of the box.

As you start to explore more of Gateway you may want to connect to a virtual cluster where we support the following security mechanisms, note these don't have to match that between Gateway and the backing Kafka.

Depending which mode you are in, Passthrough or Multi-tenancy (virtual clusters) , different security options are supported.

## Passthrough security

By default Conduktor will leverage your `KAFKA_SECURITY_PROTOCOL` and accept the login and password. 

Gateway will then transfer the credentials to your underlying Kafka, thus leveraging your existing security and ACLs.

This is enabled by the default value `GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: false`.

Virtual clusters is disabled by default to get you up and running with Gateway quicker and simpler. When disabled, Gateway will use the existing kafka credentials of the client app to connect to the cluster, allowing it to passthrough the Gateway.

To disable Passthrough mode, and activate virtual clusters, set the environemnt variable as follows, `GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: true`.

:::caution

For Passthrough mode, Conduktor Gateway currently supports:
- Security protocols: `SASL_PLAINTEXT` and `SASL_SSL`
- SASL mechanisms: `PLAIN`, `SCRAM-SHA-256` and `SCRAM-SHA-512`

:::

Gateway only requires the bootstrap servers to get started in Passthrough mode.

```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.2.4
    hostname: conduktor-gateway
    container_name: conduktor-gateway
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9093
```

Interceptors are interacted with through the admin API using a vcluster name of `passthrough`.

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

If you are using certificates signed with local authorities authority, you'll need to also setup truststore in the Gateway.

See the [environment variables](/gateway/configuration/env-variables/#ssl) for more.


## Client to Gateway, with virtual clusters

To work with virtual clusters you need to specify `GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: true` , create a username to connect to the virtual cluster, and update your client to use this username when connecting.

Virtual cluster mode supports;
* `PLAINTEXT`
* `SASL_PLAINTEXT`
* `SASL_SSL` (with `mTLS` option)
* `SSL` (*soon*) (with `mTLS`)

![tenant-user.png](./images/gw-security/tenant-user-london.png)

### Enable virtual clusters with the environment variables
```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.2.4
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092
      KAFKA_SASL_MECHANISM: PLAIN
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
      KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required  username="admin" password="admin-secret";
      GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: true
```

### SASL plain user/password mechanism

#### Create a username
The following command will create a virtual cluster called `london`, it will return the password of the username `sa` to be able to connect to the new cluster. 

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

This token is a JWT, inspecting it from the below command you can see its contents:

```bash
echo "$token" | jq -R 'gsub("-";"+") | gsub("_";"/") | split(".") | .[1] | @base64d | fromjson'
```

```json
{
  "username": "sa",
  "vcluster": "london",
  "exp": 1700053793
}
```

#### Update your client to connect to the virtual cluster

The token should be provided in the password field of the client configuration, such as in a properties file `london-sa.properties`, as follows:

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

Conduktor gateway support OAuth authentification by leveraging OAuthbearer sasl mechanism. For this section you will need a OpenID provider exposing public keys.

#### Configure gateway to support OAuthbearer with environemnt variables

```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.2.2
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092
      KAFKA_SASL_MECHANISM: PLAIN
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
      KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required  username="admin" password="admin-secret";
      GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: true
      GATEWAY_OAUTH_JWKS_URL: <YOUR_OIDC_PROVIDER_JWKS_URL|JWKS_FILE_URL>
      GATEWAY_OAUTH_EXPECTED_ISSUER: <YOUR_OIDC_ISSUER>
```

If the generated token by the provider defines an `aud` header you have to configure a `GATEWAY_OAUTH_EXPECTED_AUDIENCES` with a list of supported audiences.  
Example : `GATEWAY_OAUTH_EXPECTED_AUDIENCES: [audience1, audience2]`

#### Configure your client to connect to Gateway using OAuthbearer

Your client will connect through an OAuth provider using a grant credentials flow to create a token, to be sent to Gateway. This token will be verified based on the configuration below.

```
sasl.mechanism=OAUTHBEARER
sasl.login.callback.handler.class=org.apache.kafka.common.security.oauthbearer.secured.OAuthBearerLoginCallbackHandler
sasl.oauthbearer.token.endpoint.url=<YOUR_OIDC_PROVIDER_TOKEN_URL>
sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required clientId="<CLIENT_ID>" clientSecret="<CLIENT_SECRET>" scope="email";
```

#### Customize the virtual cluster

By default the virtual cluster will be equal to the subject of the token.  
This could be modified by adding specfic claims in the token to be sent to Gateway.

The virtual cluster could be defined for a token using the `gateway.vcluster` claim.
You can also override the user from the subject by defining a `gateway.username` claim.

If you can't specify claims yourself, there is an alternative to map `username` to `vclsuter`. We can instead map the claim through the Gateway API.
Here you are mapping the username, `conduktor` to the vcluster, `my-vcluster`.

```
curl --location 'http://localhost:8888/admin/userMappings/v1/vcluster/my-vcluster' \
--header 'Content-Type: application/json' \
--user "admin:conduktor" \
--data '{
    "username": "conduktor"
}'
```

