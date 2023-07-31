---
sidebar_position: 3
title: Gateway Security
description: Securing Conduktor Gateway with JWT 
---

There are two sets of configuration to consider when securing your gateway.

 - The connection between Kafka clients and the gateway
 - The connection between the gateway and the Kafka cluster

![img.png](img.png)

# Securing client access to Gateway

Jump to:

- [Access Control](#access-control)
- [Generating Tokens](#generating-tokens)
- [Using the token](#using-the-token)

## Access control

Conduktor Gateway supports SASL authentication with clients the same as base Kafka. The PLAIN SASL mechanism is used to 
communicate user information to the server via the usual username and password fields.

The gateway uses encrypted JWT tokens in the password field to encode metadata required by the gateway (tenant 
information etc.).

To configure access control it is best practice to configure the shared secret that will encrypt the JWT tokens.

```bash
      GATEWAY_USER_POOL_SECRET_KEY: secret
```

## Generating tokens

Tokens are generated using an admin REST API. This is secured with a set of administrator 
credentials that are configured with environment variables and should be set to not use the default values.
The example below sets username and password to `superUser`: 

```bash
      JWT_AUTH_MASTER_USERNAME: superUser
      JWT_AUTH_MASTER_PASSWORD: superUser
```

Conduktor Gateway is designed for multi-tenacy but by default is turned off so you can connect straightaway with your existing client credentials. This means that tokens must contain more than a username and secret, they 
must also encode tenant metadata. For convenience a token can be generated through the API by providing the following:

1. An organisation id - an integer valuing indicating the tenant's organisation
2. A cluster id - some tenants may have multiple clusters, this is a further string identifier to differentiate these.
3. A user id

Note: A tenant name in Conduktor Gateway is formed of [organisation id]-[cluster id]
```bash
curl \
    --silent \
    --request POST conduktor-proxy:8888/auth/tenant/[organisation id]-[cluster id]/user/[user id]/token \
    --data-raw \{\"username\":\"[master username]\",\"password\":\"[master password]\"\}'
```

This will respond with a token similar to this:

```bash
{
  "data" : "eyJhbGciOiJIUzI1NiJ9.eyJvcmdJZCI6MSwiY2x1c3RlcklkIjoiY2x1c3RlcjEiLCJ1c2VybmFtZSI6InRlc3RAY29uZHVrdG9yLmlvIn0.XhB1e_ZXvgZ8zIfr28UQ33S8VA7yfWyfdM561Em9lrM"
}
```

## Using the token

The token should be provided in the password field of the client configuration as follows:

```bash
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="test@conduktor.io" password="eyJhbGciOiJIUzI1NiJ9.eyJvcmdJZCI6MSwiY2x1c3RlcklkIjoiY2x1c3RlcjEiLCJ1c2VybmFtZSI6InRlc3RAY29uZHVrdG9yLmlvIn0.XhB1e_ZXvgZ8zIfr28UQ33S8VA7yfWyfdM561Em9lrM";
```

