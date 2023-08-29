---
sidebar_position: 3
title: Gateway Security
description: Securing Conduktor Gateway  
---

There are two sets of configuration to consider when securing your gateway.

 - The connection between Kafka clients and the gateway
 - The connection between the gateway and the Kafka cluster

![client-to-gateway-excalidraw](./images/gw-security/client-to-gateway-excalidraw.png)

# Gateway to your Kafka security

You can use all the Kafka mechanisms, NONE, SASL, OAuthBearer, Kerberos etc. 

```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.0.0-amd64
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092
      KAFKA_SASL_MECHANISM: PLAIN
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
      KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required  username="admin" password="admin-secret";
```

# Securing Client access to your Gateway
You have several options when connecting clients to Gateway. Passthrough security where it passes the existing credentials straight through to the backing cluster with no further checks, this is likely what you will use out of the box. Passthrough supports;

Security Protocols
* NONE
* SASL_PLAINTEXT

SASL Mechanisms
* NONE
* PLAINTEXT

As you start to explore more of Gateway you may want to connect to a virtual cluster where we support the following security mechanisms, note these don't have to match that between Gateway and the backing Kafka. Virtual clusters support;

Security Protocols
* NONE
* PLAINTEXT
* SASL_SSL
* SASL_PLAINTEXT

SASL Mechanisms
* NONE
* PLAIN
* mTLS

OAUTHBEARER is under development.
## Passthrough security

By default Conduktor will leverage your `KAFKA_SECURITY_PROTOCOL` and accept the login and password. 

Gateway will then transfer the credentials to your underlying Kafka, thus leveraging your existing security and ACLs.

This is enabled by the default value `GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: false`.

Virtual clusters is disabled by default to get you up and running with Gateway quicker and simpler. When disabled Gateway will use the existing kafka credentials of the client app to connect to the cluster, allowing it to passthrough the Gateway. To get the most out of Conduktor Gateway multi-tenancy should later be activated.

To disable this Passthrough, and activate virtual clusters, set the environemnt variable as follows, `GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: true`

:::caution

Conduktor Gateway does not currently support `OAuthBearer` or `Kerberos` for passthrough identity.

:::


## Client to Gateway, additional security

Gateway enables you to adapt the security protocol to your liking.

For example, you may want to add `SSL` on top on a `SASL_PLAINTEXT` Kafka. Compare the Gateway security protocol to the Kafka security protocol. 

```yaml
conduktor-gateway:
    image: conduktor/conduktor-proxy:distro
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


Gateway supports the addition of the following security protocols;
* NONE
* SASL_SSL
* SASL_PLAINTEXT

`OAuth` and `mTLS` are under development.


## Client to Gateway with virtual clusters

To work with virtual clusters you need to specify `GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: true` , create a username to connect to the virtual cluster, update your client to use this username on connecting.

![tenant-user.png](./images/gw-security/tenant-user-london.png)


```yaml
conduktor-gateway:
    image: conduktor/conduktor-gateway:2.0.0-amd64
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092
      KAFKA_SASL_MECHANISM: PLAIN
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
      KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required  username="admin" password="admin-secret";
      GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: true
```

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

This token is a JWT, inspecting it from the below command you can see it contains:

```bash
echo "$token" | jq -R 'gsub("-";"+") | gsub("_";"/") | split(".") | .[1] | @base64d | fromjson'
{
  "username": "sa",
  "vcluster": "london",
  "exp": 1700053793
}

```

### Connecting to a virtual cluster

The token should be provided in the password field of the client configuration as follows:

```properties
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="sa" password="eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidmNsdXN0ZXIiOiJsb25kb24iLCJleHAiOjE3MDAwNTM3OTN9.Db7Yrml__sU9LFApHCx2S5WG3IVhqbCM-Yu4wLcmSl0";
```

You are then connecting to the virtual cluster with that username and can perform commands as you please e.g.
listing topics in the virtual cluster `london` from the username sa.

```bash
kafka-topics \
  --bootstrap-server conduktor-gateway:6969 \
  --command-config /clientConfig/london-sa.properties \
  --list
```
