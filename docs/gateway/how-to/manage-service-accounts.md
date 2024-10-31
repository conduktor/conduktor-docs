---
sidebar_position: 6
title: Manage Service Accounts
description: How to manage service accounts on the Gateway
---

## Introduction

In this how-to guide, you will learn how to manage service accounts on the Gateway. We will cover the creation of both **local and external service accounts**, and how to **assign ACLs to them**.

The scenario will use:
- The SASL_PLAINTEXT security protocol for the communication between Clients > Gateway > Kafka.
- The ACLs are enabled on the passthrough virtual cluster (`GATEWAY_ACL_ENABLED: true`).
- The ACLs super-user is called `GATEWAY_SUPER_USERS: local-acl-admin`.
- The Gateway API admin credentials are the default ones.

We will use the [Gateway API](/gateway/reference/api-reference/) to create and manage service accounts, but the following guide works with the [CLI](/gateway/reference/cli-reference/) as well.

:::tip
For local deployments, the Gateway API documentation is available at [`http://localhost:8888`](http://localhost:8888). In this guide, we will use the `service-account` and the `token` endpoints.
:::

In the `service-account` section of the Gateway API documentation, you'll notice that to create a service account on the Gateway, you have to chose between a `local` or `external` service account.

:::info TL;DR
A `local` service account is managed by the Gateway itself, while an `external` service account is managed by an external OIDC identity provider.
:::

Here is a link to our [Service Accounts, Authentication & Authorization](/gateway/concepts/service-accounts-authentication-authorization/) concept page if you need more information.

## Prerequisites

### Start the local deployment

You can find below the docker-compose file to start a local Gateway with the configuration described above.

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="Start the environment" label="Start the environment">

```bash
docker compose -f docker-compose.yaml up -d
```

</TabItem>
<TabItem value="docker-compose.yaml" label="docker-compose.yaml">


```yaml title="docker-compose.yml"
services:
  conduktor-gateway:
    image: conduktor/conduktor-gateway:3.3.0
    hostname: conduktor-gateway
    container_name: conduktor-gateway
    ports:
      - 8888:8888
      - 6969-6971:6969-6971
    environment:
      # Gateway > Kafka connection
      KAFKA_BOOTSTRAP_SERVERS: kafka-1:9092,kafka-2:9092,kafka-3:9092
      KAFKA_SASL_MECHANISM: PLAIN
      KAFKA_SECURITY_PROTOCOL: SASL_PLAINTEXT
      KAFKA_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required  username="admin" password="admin-secret";
      # Clients > Gateway connection
      GATEWAY_SECURITY_PROTOCOL: SASL_PLAINTEXT
      GATEWAY_OAUTH_JWKS_URL: "TO_FILL"
      GATEWAY_OAUTH_EXPECTED_ISSUER: "TO_FILL"
      GATEWAY_OAUTH_EXPECTED_AUDIENCES: "TO_FILL"
      # Gateway configuration
      GATEWAY_MIN_BROKERID: 1
      # Enable ACLs on the passthrough virtual cluster, with the super user
      GATEWAY_ACL_ENABLED: true
      GATEWAY_SUPER_USERS: local-acl-admin
    healthcheck:
      test: curl localhost:8888/health || exit 1
      start_period: 10s
      interval: 5s
      retries: 25
    depends_on:
      kafka-1: { condition: service_healthy }
      kafka-2: { condition: service_healthy }
      kafka-3: { condition: service_healthy }

  zookeeper:
    image: confluentinc/cp-zookeeper
    container_name: zookeeper
    hostname: zookeeper
    ports:
      - 12181:2181
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    healthcheck:
      test: echo srvr | nc zookeeper 2181 || exit 1
      retries: 20
      interval: 10s

  kafka-1:
    image: confluentinc/cp-kafka:7.7.0
    container_name: kafka-1
    hostname: kafka-1
    ports:
      - 19092:19092
    environment:
      KAFKA_LISTENERS: "INTERNAL://kafka-1:9092,EXTERNAL://:19092"
      KAFKA_ADVERTISED_LISTENERS: "INTERNAL://kafka-1:9092,EXTERNAL://localhost:19092"
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "INTERNAL:SASL_PLAINTEXT,EXTERNAL:PLAINTEXT"
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_ZOOKEEPER_CONNECT: "zookeeper:2181"
      KAFKA_BROKER_ID: 1
      KAFKA_SASL_MECHANISM_INTER_BROKER_PROTOCOL: PLAIN
      KAFKA_LISTENER_NAME_INTERNAL_SASL_ENABLED_MECHANISMS: PLAIN
      KAFKA_LISTENER_NAME_INTERNAL_PLAIN_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required username="admin" password="admin-secret" user_admin="admin-secret" ;
    healthcheck:
      test: nc -zv kafka-1 9092 || exit 1
      interval: 10s
      retries: 25
      start_period: 20s
    depends_on:
      zookeeper: { condition: service_healthy }

  kafka-2:
    image: confluentinc/cp-kafka:7.7.0
    container_name: kafka-2
    hostname: kafka-2
    ports:
      - 19093:19093
    environment:
      KAFKA_ZOOKEEPER_CONNECT: "zookeeper:2181"
      KAFKA_LISTENERS: "INTERNAL://kafka-2:9092,EXTERNAL://:19093"
      KAFKA_ADVERTISED_LISTENERS: "INTERNAL://kafka-2:9092,EXTERNAL://localhost:19093"
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "INTERNAL:SASL_PLAINTEXT,EXTERNAL:PLAINTEXT"
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_BROKER_ID: 2
      KAFKA_SASL_MECHANISM_INTER_BROKER_PROTOCOL: PLAIN
      KAFKA_LISTENER_NAME_INTERNAL_SASL_ENABLED_MECHANISMS: PLAIN
      KAFKA_LISTENER_NAME_INTERNAL_PLAIN_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required username="admin" password="admin-secret" user_admin="admin-secret" ;
    healthcheck:
      test: nc -zv kafka-2 9092 || exit 1
      interval: 10s
      retries: 25
      start_period: 20s
    depends_on:
      zookeeper: { condition: service_healthy }

  kafka-3:
    image: confluentinc/cp-kafka:7.7.0
    container_name: kafka-3
    hostname: kafka-3
    ports:
      - 19094:19094
    environment:
      KAFKA_ZOOKEEPER_CONNECT: "zookeeper:2181"
      KAFKA_LISTENERS: "INTERNAL://kafka-3:9092,EXTERNAL://:19094"
      KAFKA_ADVERTISED_LISTENERS: "INTERNAL://kafka-3:9092,EXTERNAL://localhost:19094"
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "INTERNAL:SASL_PLAINTEXT,EXTERNAL:PLAINTEXT"
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "false"
      KAFKA_BROKER_ID: 3
      KAFKA_SASL_MECHANISM_INTER_BROKER_PROTOCOL: PLAIN
      KAFKA_LISTENER_NAME_INTERNAL_SASL_ENABLED_MECHANISMS: PLAIN
      KAFKA_LISTENER_NAME_INTERNAL_PLAIN_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required username="admin" password="admin-secret" user_admin="admin-secret" ;
    healthcheck:
      test: nc -zv kafka-3 9092 || exit 1
      interval: 10s
      retries: 25
      start_period: 20s
    depends_on:
      zookeeper: { condition: service_healthy }
```

</TabItem>
</Tabs>

### Create a few topics on Kafka

Let's create a few topics on Kafka by running the following command from your local machine:

```bash
kafka-topics --create --bootstrap-server localhost:19092 --topic finance-data
kafka-topics --create --bootstrap-server localhost:19092 --topic finance-report
```

## Manage a Local Service Account

### Create a Local Service Account

A local service account is managed by the Gateway itself. This means we have to ask the Gateway to create it for us, by giving it a name.

The first step is to **create a reference to this new service account**. In our case, we will call this service account `local-app-finance-dev`, and we want it to exist in the `passthrough` virtual cluster:

```bash title="Create the service account"
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

Then, we need to **get the secret key of this service account**, that has a limited lifetime:

```bash title="Get the secret key"
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

```json title="Response"
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
```

In this case, the command doesn't return anything because we have enabled the ACLs on this passthrough virtual cluster (`GATEWAY_ACL_ENABLED: true`). It means that my local service account doesn't have the right permissions to see any resources. The next step is then to give it some ACLs so it can see its topics.

## Create ACLs for a Local Service Account

### Create an ACL Admin Local Service Account

In order to give ACLs to your application, we recommend you define an **ACL admin service account**, that will be able to **manage the ACLs of the other service accounts**.
This service account must be defined in the Gateway configuration by the environment variable **`GATEWAY_SUPER_USERS`**. In our case, we will call this service account `local-acl-admin`.

Now we're back to the [creation of a local service account](#create-a-local-service-account), but this time we will create an ACL admin service account named `local-acl-admin`.

<Tabs>
<TabItem value="Create the service account" label="Create the service account">

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
      "name" : "local-acl-admin",
      "vCluster" : "passthrough"
    },
    "spec" : { "type" : "LOCAL" }
  }'
```

</TabItem>
<TabItem value="Get its credentials" label="Get its credentials">

```bash
curl \
  --request POST \
  --url 'http://localhost:8888/gateway/v2/token' \
  --header 'Authorization: Basic YWRtaW46Y29uZHVrdG9y' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "vCluster": "passthrough",
    "username": "local-acl-admin",
    "lifeTimeSeconds": 3600000
  }'
```

</TabItem>
</Tabs>


At the end of this step, we are getting the properties file to interact with the Gateway using this ACL admin service account.

```properties title="local-acl-admin.properties"
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="local-client.properties" password="eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxvY2FsLWFjbC1hZG1pbiIsInZjbHVzdGVyIjoicGFzc3Rocm91Z2giLCJleHAiOjE3MzIxNjEwOTB9.m8U_DVv4MTOY9mKiKY2tHeUGjxsUvhC9ssE6iAI3eJc";
```

As this user is an ACL admin, it has access to all the Gateway topics and can create ACLs for the other service accounts.

### Create ACLs for another Local Service Account, using the ACL Admin Service Account

In order for the `local-app-finance-dev` service account to be able to interact with its topics, we need to give it the `WRITE` permission on its prefix. For that, you can run the following:

```bash title="Give ACLs to local-app-finance-dev"
kafka-acls --bootstrap-server localhost:6969 \
  --command-config local-acl-admin.properties \
  --add \
  --allow-principal User:local-app-finance-dev \
  --operation write \
  --topic finance- \
  --resource-pattern-type prefixed

Adding ACLs for resource `ResourcePattern(resourceType=TOPIC, name=finance-, patternType=PREFIXED)`:
 	(principal=User:local-app-finance-dev, host=*, operation=WRITE, permissionType=ALLOW)

Current ACLs for resource `ResourcePattern(resourceType=TOPIC, name=finance-, patternType=PREFIXED)`:
 	(principal=User:local-app-finance-dev, host=*, operation=WRITE, permissionType=ALLOW)
```

Finally, let's list the topics using the `local-app-finance-dev` service account:

```bash title="List topics as local-app-finance-dev"
kafka-topics --list --bootstrap-server localhost:6969 --command-config local-client.properties

finance-data
finance-report
```

## Manage an External Service Account

An external service account is managed by an external OIDC identity provider. This means we only have to make the Gateway aware of this external service account by giving it its OIDC principal (this is the `externalNames`). The credentials that will be used by this application are already defined in the OIDC identity provider.

In order to create this external service account reference on the Gateway, you can run this command:

```bash title="Create the service account"
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
      "externalNames" : [ "TO_FILL" ]
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
sasl.oauthbearer.token.endpoint.url="TO_FILL"
sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required clientId="TO_FILL" clientSecret="TO_FILL" scope=".default";
```

And here is an example of using the Kafka CLI to list the topics, using this service account:

```bash title="List topics"
kafka-topics --list --bootstrap-server localhost:6969 --command-config external-client.properties
```

In this case, the command doesn't return anything because we have enabled the ACLs on this passthrough virtual cluster (`GATEWAY_ACL_ENABLED: true`). It means that my local service account doesn't have the right permissions to see any resources. The next step is then to give it some ACLs so it can see its topics.

## Create ACLs for an External Service Account

The steps here are exactly the same as the ones for the [local service account](#create-acls-for-a-local-service-account). Please follow them but using the `azure-app-billing-dev` service account instead of `local-app-finance-dev`.

```bash title="Give ACLs to azure-app-billing-dev"
kafka-acls --bootstrap-server localhost:6969 \
  --command-config local-acl-admin.properties \
  --add \
  --allow-principal User:azure-app-billing-dev \
  --operation write \
  --topic finance- \
  --resource-pattern-type prefixed
```