---
version: 2.6.0
title: Unlimited Topics
description: Manage over-use of Kafka resources by hosting multiple topics on a single Kafka topic.
parent: optimize
license: enterprise
---

## Why

There are situations that call for the creation of a number of topics for logical rather than technical reasons (e.g. separation of business units), this may result in considerable overuse of Kafka resources in such cases. Topic Concentration allows the data from a set of topics to be represented on a single underlying topic.

Clients connecting through Conduktor Gateway can use concentrated topics as they would any other topic and require no extra configuration to use this feature.

For example, let's say we have the following topics:

- us_east_orders - 100 partitions
- us_west_orders - 100 partitions
- emea_orders - 100 partitions
- latam_orders - 100 partitions

The total Kafka resource requirement is 400 partitions. With topic concentration all of these topics can be concentrated to a single topic:

- concentrated_orders - 100 partitions

Using 1/4 of the Kafka resources.

## Configuration

Topic concentration is configured via Conduktor Gateway Enterprise Edition's admin REST API.

| Property Name | Type | Description |
| :-- | --- | :-- |
| logicalTopicRegex | string | A regular expression to match all topic names that will be concentrated, specified as a URL parameter |
| topicName | string | The name of the underlying topic to concentrate to |

For an example configuration please see the [Conduktor Gateway Demos](https://github.com/conduktor/conduktor-proxy-demos)

## Example

```bash
curl
  -u "superUser:superUser"
  --request POST 'conduktor-gateway:8888/topicMappings/someTenant/.*orders'
  --header 'Content-Type: application/json'
  --data-raw '{
    "topicName": "concentrated_orders",
    "isConcentrated": true
  }'
```

This example configuration matches all topics that end with `orders` and concentrates them to `concentrated_orders`.


## Consumer offsets

When consuming from a concentrated topic any metadata calculations, primarily lag and message count are unlikely to be as expected. This is because the associated metadata is that of the backing Kafka topic, rather than the concentrated topic seen from the perspective of the consumer. This is a current known limitation of concentrated topics. Messages and ordering are always preserved.

## Running this interceptor

This interceptor requires the Enterprise Conduktor Gateway.

Contact us using the button above to find out more, or choose one of the free interceptors instead to try out the open-source Conduktor Gateway.
