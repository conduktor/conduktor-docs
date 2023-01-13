---
title: Security
description: Securing Conduktor Proxy with JWT 
---

# Securing client access to proxy

Jump to:

- [Access Control](#access-control)
- [Generating Tokens](#generating-tokens)
- [Using the token](#using-the-token)

## Access control

Conduktor proxy supports SASL authentication with clients the same as base Kafka. The PLAIN sasl mechanism is used to 
communicate user information to the server via the usual username and password fields.

The Proxy uses encrypted JWT tokens in the password field to encode metadata required by the proxy (tenant 
information etc.). These tokens are encrypted by a shared secret that is also used to provide access control so that 
tokens that were not created with this secret will be denied access.

To configure access control first we must enable JWT based authentication. This can be done with the following 
environment variables:

```bash
      USER_POOL_TYPE: JWT
      USER_POOL_CLASSNAME: io.conduktor.proxy.service.userPool.JwtUserPoolService
```

We then configure the shared secret that will encrypt the JWT tokens.

```bash
      USER_POOL_SECRET_KEY: secret
```

Now 

## Generating tokens

Tokens are generated using an admin REST API. This is not exposed by default and is secured with a set of administrator 
credentials that are also configured with environment variables. This interface can be enabled by setting the 
following: 

```bash
      FEATURE_FLAGS_JWT_TOKEN_ENDPOINT: true
      JWT_AUTH_MASTER_USERNAME: superUser
      JWT_AUTH_MASTER_PASSWORD: superUser
```

Conduktor Proxy is natively multi tenant. This means that tokens must contain more than a username and secret, they 
must also encode tenant metadata. For convenience a token can be generated through the API by providing the following:

1. An organisation id - an integer valuing indicating the tenant's organisation
2. A cluster id - some tenants may have multiple clusters, this is a further string identifier to differentiate these.
3. A user id

Note: A tenant name in Conduktor Proxy is formed of [organisation id]-[cluster id]

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

