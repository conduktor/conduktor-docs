---
version: 2.5.0
title: Dynamic header injection
description: Add headers to Kafka records to enhance them with metadata or other information.
parent: governance
license: enterprise
---

## Introduction

Conduktor Gateway's dynamic header injection feature injects headers (such as user ip) to the messages as they are
produced through the gateway.

We support templating such as `X-CLIENT_IP: "{{userIp}} testing"`

Here are the values we can expand

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

## Configuration

| config  | type   | description                                                                                                                                           |
|:--------|:-------|:------------------------------------------------------------------------------------------------------------------------------------------------------|
| topic   | String | Regular expression that matches topics from your produce request                                                                                      |
| headers | Map    | Map of header key and header value will be injected, with the header value we can use `{{userIp}}` for the user ip information we want to be injected |

## Example

```json
{
  "name": "myDynamicHeaderInjectionInterceptor",
  "pluginClass": "io.conduktor.gateway.interceptor.DynamicHeaderInjectionPlugin",
  "priority": 100,
  "config": {
    "topic": "topic.*",
    "headers": {
      "X-CLIENT_IP": "{{userIp}} testing"
    }
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


