---
sidebar_position: 6
title: Manage Service Accounts
description: How to manage service accounts on the Gateway
---

## Introduction

In this how-to guide, you will learn how to manage service accounts on the Gateway. We will cover the creation of both local and external service accounts, and how to assign ACLs to them.

We consider that your Gateway is already available and that you know the API admin credentials in order to interact with it.

We will use the [Gateway API](/gateway/reference/api-reference/) to create and manage service accounts, but the following guide works with the [CLI](/gateway/reference/cli-reference/) as well.

:::tip
You can find all the API endpoints documented in the [API Gateway endpoint](/gateway/reference/api-reference/). For local deployments, the default API URL is [`http://localhost:8888`](http://localhost:8888).
:::

In the Gateway API documentation, you can find in the `service-account` section how to create a service account. You'll then notice that you have to chose between a `local` or `external` service account.

Basically, a `local` service account is managed by the Gateway itself, while an `external` service account is managed by an external OIDC identity provider.

Here is a link to our [Service Account concept page] if you need more information.


## Manage a Local Service Account

### Create a Local Service Account

A local service account is managed by the Gateway itself. This means we have to ask the Gateway to create it for us, by giving it a name.

The first step is to **create a reference to this new service account**. In our case, we will call this service account `local-app-finance-dev`, and we want it to exist in the `passthrough` virtual cluster:

```bash
curl \
  --request PUT \
  --url 'http://localhost:8888/gateway/v2/service-account' \
  --header 'Authorization: Basic YWRtaW46Y29uZHVrdG9y' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "kind" : "GatewayServiceAccount",
    "apiVersion" : "gateway/v2",
    "metadata" : {
      "name" : "local-app-finance-dev",
      "vCluster" : "passthrough"
    },
    "spec" : { "type" : "LOCAL" }
  }'
```

And then, we need to **get the secret key of this service account**, that has a limited lifetime:

```bash
curl \
  --request POST \
  --url 'http://localhost:8888/gateway/v2/token' \
  --header 'Authorization: Basic YWRtaW46Y29uZHVrdG9y' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "vCluster": "passthrough",
    "username": "local-app-finance-dev",
    "lifeTimeSeconds": 3600000
  }'
```

This will return a JSON object with the `token` field containing the secret key.

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxvY2FsLWFwcC1maW5hbmNlLWRldiIsInZjbHVzdGVyIjoicGFzc3Rocm91Z2giLCJleHAiOjE3MzIwOTUzNjN9.-rivmwcI-zvTTqLPeO_0l3xUALz5mKtopp1YMaTswFk"
}
```

This means that, as of now, we can connect to the Gateway passthrough virtual cluster using the `local-app-finance-dev` service account and its secret key.

### Connect to the Gateway with a Local Service Account

You can now connect to the Gateway using the `local-app-finance-dev` service account and its secret key.

Here is the properties file you can use to connect to the Gateway:

```properties title="local-client.properties"
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="local-app-finance-dev" password="eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxvY2FsLWFwcC1maW5hbmNlLWRldiIsInZjbHVzdGVyIjoicGFzc3Rocm91Z2giLCJleHAiOjE3MzIwOTUzNjN9.-rivmwcI-zvTTqLPeO_0l3xUALz5mKtopp1YMaTswFk";
```

And here is an example of using the Kafka CLI to list the topics, using this service account:

```bash title="List topics"
kafka-topics --list --bootstrap-server localhost:6969 --command-config local-client.properties

__consumer_offsets
_conduktor_gateway_acls
_conduktor_gateway_auditlogs
_conduktor_gateway_consumer_offsets
_conduktor_gateway_consumer_subscriptions
_conduktor_gateway_encryption_configs
_conduktor_gateway_groups
_conduktor_gateway_interceptor_configs
_conduktor_gateway_license
_conduktor_gateway_topicmappings
_conduktor_gateway_usermappings
_conduktor_gateway_vclusters
```


## Manage an External Service Account

An external service account is managed by an external OIDC identity provider. This means we only have to make the Gateway aware of this external service account by giving it its OIDC principal (this is the `externalNames`). The credentials that will be used by this application are already defined in the OIDC identity provider.

In order to create this external service account reference on the Gateway, you can run this command:

```bash
curl \
  --request PUT \
  --url 'http://localhost:8888/gateway/v2/service-account?dryMode=false' \
  --header 'Authorization: Basic YWRtaW46Y29uZHVrdG9y' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "kind" : "GatewayServiceAccount",
    "apiVersion" : "gateway/v2",
    "metadata" : {
      "name" : "azure-app-billing-dev",
      "vCluster" : "passthrough"
    },
    "spec" : {
      "type" : "EXTERNAL",
      "externalNames" : [ "124c98bb-59be-41a1-94bb-4ed387007acf" ]
    }
  }'
```

As of now, you can apply some interceptors to this service account, by refering to the service account name `azure-app-billing-dev`.

### Connect to the Gateway with an External Service Account

You can now connect to the Gateway using the `azure-app-billing-dev` service account.

Here is the properties file you can use to connect to the Gateway:

```properties title="external-client.properties"
security.protocol=SASL_PLAINTEXT
sasl.mechanism=OAUTHBEARER
sasl.login.callback.handler.class=org.apache.kafka.common.security.oauthbearer.secured.OAuthBearerLoginCallbackHandler
sasl.oauthbearer.token.endpoint.url=https://login.microsoftonline.com/38755287-df00-48cd-805b-1ebe914e8b11/oauth2/token
sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required clientId="a986bf61-7838-4ca8-a7b2-4f9787de9231" clientSecret="~kU8Q~DOSK3OyWWbTIM5fdPKmmm6HLlx38Osba77" scope=".default";
```

And here is an example of using the Kafka CLI to list the topics, using this service account:

```bash title="List topics"
kafka-topics --list --bootstrap-server localhost:6969 --command-config external-client.properties

__consumer_offsets
_conduktor_gateway_acls
_conduktor_gateway_auditlogs
_conduktor_gateway_consumer_offsets
_conduktor_gateway_consumer_subscriptions
_conduktor_gateway_encryption_configs
_conduktor_gateway_groups
_conduktor_gateway_interceptor_configs
_conduktor_gateway_license
_conduktor_gateway_topicmappings
_conduktor_gateway_usermappings
_conduktor_gateway_vclusters
```