---
sidebar_position: 3
title: Produce Data
description: Conduktor Platform can help you to send messages into your topic. It's a useful feature for testing something without having to write a complete application.
---

# Produce Data

Conduktor Platform can help you to send messages into your topic. It's a useful feature for testing something without having to write a complete application.

- [Serializers](#serializers)
- [Random Data Generation](#random-data-generator)
- [Automated Flow Mode](#flow-mode)

## Serializers

Conduktor supports common Kafka **serializers** to produce data:

- String or JSON
- Avro, Protobuf and JSON-Schema
  - As of today, only Confluent or Confluent-like Schema Registry is supported
  - As of today, only [TopicNameStrategy](https://docs.confluent.io/platform/current/schema-registry/serdes-develop/index.html#subject-name-strategy) is supported
- Binary (using b64 representation)

## Random Data Generator

The Random Data Generator will quickly let you produce a valid sample message for your serializer. Just click the **Generate once** button next to the Serializer dropdown.

Random Data Generator supports all Serializers, and is possible for records Key and record Value.

![random-generator.png](/img/console/console-random-gen.png)

## Flow mode

Using the Flow mode, you can produce multiple events in a row.

In the following example, the producer is configured like this:

- Produce 1 messages per batch
- Reuse the same Key for all records
- Generate a random Value (using the associated Serializer)

You also have options to configure the **interval (ms)** between each event, and the **stop conditions** such as the **number of records produced** or the **elapsed time (ms)**

![flow-mode.png](/img/console/console-flow.png)
