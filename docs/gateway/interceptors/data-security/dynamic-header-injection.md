---
version: 3.0.0
title: Dynamic Header Injection
description: Add headers to Kafka records to enhance them with metadata or other information.
parent: governance
license: enterprise
---

## Introduction

Conduktor Gateway's dynamic header injection feature injects headers (such as user ip) to the messages as they are
produced through the gateway.

We support templating such as `X-CLIENT_IP: "{{userIp}} testing"`

Here are the values we can expand

- uuid
- userIp
- vcluster
- user
- clientId
- gatewayIp
- gatewayHost
- gatewayVersion
- apiKey
- apiKeyVersion
- timestampMillis

### Record Content Variables (v3.9+)

- `{{record.key}}` - Extract the entire key payload as a string
- `{{record.value}}` - Extract the entire value payload as a string
- `{{record.key.fieldName}}` - Extract a specific field from the record key
- `{{record.value.fieldName}}` - Extract a specific field from the record value

## Configuration

| config               | type                                             | description                                                                                                                                           |
|:---------------------|:-------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------|
| topic                | String                                           | Regular expression that matches topics from your produce request                                                                                      |
| headers              | Map                                              | Map of header key and header value will be injected, with the header value we can use `{{userIp}}` for the user ip information we want to be injected |
| overrideIfExists     | boolean                                          | Default `false`, configuration to override header on already exist                                                                                    |
| schemaRegistryConfig | [SchemaRegistry](#schema-registry-configuration) | Configuration of your Schema Registry, required if you want to inject headers into data produced using Avro, JSON or Protobuf schemas                 |

## Schema Registry configuration

As soon as your records are produced using a schema, you have to configure these properties in your encryption/decryption interceptors after `schemaRegistryConfig` in order to (de)serialize them. Gateway supports Confluent-like and AWS Glue schema registries.

| Key                   | Type   | Default     | Description                                                                                                                                                                                                  |
|-----------------------|--------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`                | string | `CONFLUENT` | The type of schema registry to use: choose `CONFLUENT` (for Confluent-like schema registries including OSS Kafka) or `AWS` for AWS Glue schema registries.                                                   |
| `additionalConfigs`   | map    |             | Additional properties maps to specific security-related parameters. For enhanced security, you can hide the sensitive values using [environment variables as secrets](#use-environment-variables-as-secrets) |
| **Confluent Like**    |        |             | **Configuration for Confluent-like schema registries**                                                                                                                                                       |
| `host`                | string |             | URL of your schema registry.                                                                                                                                                                                 |
| `cacheSize`           | string | `50`        | Number of schemas that can be cached locally by this interceptor so that it doesn't have to query the schema registry every time.                                                                            |
| **AWS Glue**          |        |             | **Configuration for AWS Glue schema registries**                                                                                                                                                             |
| `region`              | string |             | The AWS region for the schema registry, e.g. `us-east-1`                                                                                                                                                     |
| `registryName`        | string |             | The name of the schema registry in AWS (leave blank for the AWS default of `default-registry`)                                                                                                               |
| `basicCredentials`    | string |             | Access credentials for AWS (see below section for structure)                                                                                                                                                 |
| **AWS Credentials**   |        |             | **AWS Credentials Configuration**                                                                                                                                                                            |
| `accessKey`           | string |             | The access key for the connection to the schema registry.                                                                                                                                                    |
| `secretKey`           | string |             | The secret key for the connection to the schema registry.                                                                                                                                                    |
| `validateCredentials` | bool   | `true`      | `true` / `false` flag to determine whether the credentials provided should be validated when set.                                                                                                            |
| `accountId`           | string |             | The Id for the AWS account to use.                                                                                                                                                                           |


If you do not supply a `basicCredentials` section for the AWS Glue schema registry, the client we use to connect will instead attempt to find the connection information is needs from the environment, and the credentials required can be passed this way to the Gateway as part of its core configuration. More information on the setup for this is found in the [AWS documentation](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html#credentials-default).

## Use environment variables as secrets

You probably don't want your secrets to appear in your interceptors. In order to make sure this doesn't happen, you can refer to the environment variables you have set in your Gateway container.

For that, you can simply use the format `${MY_ENV_VAR}`.

We recommend you use this for Schema Registry or Vault secrets, and any other values you'd like to hide in the configuration.

## Example

### Simple header injection

```json
{
  "name": "myDynamicHeaderInjectionInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.DynamicHeaderInjectionPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "headers": {
      "X-CLIENT_IP": "{{userIp}} testing"
    },
    "overrideIfExists": true
  }
}
```

### Header injection based on the payload fields

```json
{
  "name": "myDynamicHeaderInjectionInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.DynamicHeaderInjectionPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "schemaRegistryConfig": {
      "host": "http://schema-registry:8081",
      "additionalConfigs": {
        "schema.registry.url": "${SR_URL}",
        "basic.auth.credentials.source": "${SR_BASIC_AUTH_CRED_SRC}",
        "basic.auth.user.info": "${SR_BASIC_AUTH_USER_INFO}"
      }
    },
    "headers": {
      "X-CLIENT_IP": "{{userIp}} testing",
      "X-USER-ID": "{{record.key.id}}",
      "X-USER-EMAIL": "{{record.value.email}}"
    },
    "overrideIfExists": true
  }
}
```

Let's produce a simple record to the `injectHeaderTopic` topic.

```bash
echo 'inject_header' | docker-compose exec -T kafka-client \
    kafka-console-producer  \
        --bootstrap-server conduktor-gateway:6969 \
        --producer.config /clientConfig/gateway.properties \
        --topic injectHeaderTopic
```

Let's consume from our `injectHeaderTopic`.

```bash
docker-compose exec kafka-client \
  kafka-console-consumer \
    --bootstrap-server conduktor-gateway:6969 \
    --consumer.config /clientConfig/gateway.properties \
    --topic injectHeaderTopic \
    --from-beginning \
    --max-messages 1 \
    --property print.headers=true
```

You should see the message with headers as below

```
X-USER_IP:172.19.0.3 testing   inject_header
```


