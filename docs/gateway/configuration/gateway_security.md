---
sidebar_position: 3
title: Gateway Security
description: Securing Conduktor Gateway  
---

There are two sets of configuration to consider when securing your gateway.

 - The connection between Kafka clients and the gateway
 - The connection between the gateway and the Kafka cluster

![img.png](img.png)

# Securing Gateway access to your Kafka

You can use all the kafka mechanisms, NONE, SASL, OAuthBearer, Kerberos etc. 

```yaml
conduktor-gateway:
    image: conduktor/conduktor-proxy:distro
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092
      KAFKA_SASL_MECHANISM: PLAIN
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
      KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required  username="admin" password="admin-secret";
```


# Securing Client access to your Gateway

## Passthrough security

By default Conduktor will leverage your `KAFKA_SECURITY_PROTOCOL` and accept the login and password. 

Gateway will then transfer the credentials to your underlying Kafka, thus leveraging your existing security and ACLs.

:::caution

Conduktor Gateway does not currently support `OAuthBearer` or `Kerberos` for passthrough identity.

:::

## Gateway internal security

Gateway enables you to adapt the security protocol to your liking.

For example, you may want to change security on a given target Kafka from `SASL_PLAINTEXT` to `NONE`

```yaml
conduktor-gateway:
    image: conduktor/conduktor-proxy:distro
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092
      KAFKA_SASL_MECHANISM: PLAIN
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
      KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required  username="x" password="y";
      GATEWAY_SECURITY_PROTOCOL: NONE
```

For `SASL_SSL` you will need to create keystore

```yaml
gateway-confluent-cloud:
  image: conduktor/conduktor-proxy:distro
  environment:
    KAFKA_BOOTSTRAP_SERVERS: pkc-ymrq7.us-east-2.aws.confluent.cloud:9092
    KAFKA_SASL_MECHANISM: PLAIN
    KAFKA_SECURITY_PROTOCOL: SASL_SSL
    KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required username="xxxx" password="yyyyyy";
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


Gateway supports
* NONE
* SSL
* SASL_SSL
* SASL_PLAINTEXT

`OAuth` and `mTLS` are currently being worked on.


## Gateway internal Security with virtual clusters

To work with virtual clusters you need to specify `GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: true` 

```yaml
conduktor-gateway:
    image: conduktor/conduktor-proxy:distro
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9092
      KAFKA_SASL_MECHANISM: PLAIN
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
      KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required  username="admin" password="admin-secret";
      GATEWAY_FEATURE_FLAGS_MULTI_TENANCY: true
```

The following command will create a virtual cluster called `london`, it will return the password of the account `sa` to be able to connect to the new cluster. 

```bash
curl \
    --request POST "conduktor-gateway:888/admin/auth/v1/cluster/london/account/sa" \
    --user 'admin:conduktor' \
    --header 'Content-Type: application/json' \
    --data-raw '{"lifeTimeSeconds": 7776000}'
```

This will respond with a token similar to this:

```json
{
  "token" : "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidGVuYW50IjoibG9uZG9uIiwiZXhwIjoxNjk4NzQ0OTgxfQ.9f0htbb0s1Qgy4J0WGoDNHLZCBwbcr1BWPhkvDJgVz8"
}
```

This token is a JWT, inspecting it from the below commans you can see it contains

```bash
echo "$token" | jq -R 'gsub("-";"+") | gsub("_";"/") | split(".") | .[1] | @base64d | fromjson'
{
  "username": "sa",
  "tenant": "london",
  "exp": 1698744981
}

```

### Connecting to a virtual cluster

The token should be provided in the password field of the client configuration as follows:

```properties
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="sa" password="eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNhIiwidGVuYW50IjoibG9uZG9uIiwiZXhwIjoxNjk4NzQ0OTgxfQ.9f0htbb0s1Qgy4J0WGoDNHLZCBwbcr1BWPhkvDJgVz8";
```

and then list topics `london` topics using its `sa` account 

```bash
kafka-topics \
  --bootstrap-server conduktor-gateway:6969 \
  --command-config /clientConfig/london-sa.properties \
  --list
```
