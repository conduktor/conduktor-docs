---
sidebar_position: 2
title: Consumer Task
description: Consume data from a Kafka topic.
---

# Consumer Task

Use the **Consumer** task to consume data from a Kafka topic.

You can consume data from Kafka with a number of conditions.

| Method         | Description                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------- |
| Single Record  | Consume a single record from a Kafka topic                                                    |
| X Records      | Consume a user-defined number of records from a Kafka topic                                   |
| Time Interval  | Constantly consume records until an elapsed time (ms) is reached                              |
| With filter(s) | Use any of the above methods with additional filter conditions to intercept specific messages |

## Deserialization support

When you consume data from Kafka you must specify the deserialization format for the record keys and values.&#x20;

Currently supported SerDes formats:

- String
- JSON
- Long
- Float
- Double
- Bytes (base64)
- Avro (Custom)&#x20;
- Avro (Schema Registry)
- Protobuf (Schema Registry)
- JSON (Schema Registry)
- MessagePack

## Create a consumer task

For this exercise, we will assume you have already added a [simple Produce task](producer-task#create-a-simple-produce-task) to your test scenario. We will consume the message configured in the Producer task.&#x20;

:::info
**Note: When producing and consuming from the same topic**

To ensure the consumer task is subscribed when the message is produced, these tasks must be configured in **parallel**.&#x20;
:::

From inside the editor view, select the **Scenario Start** button and select **Consumer** from the dropdown menu.

![](<../../../assets/image (164).png>)

Give your task an appropriate name, and select the same **Cluster** and **Topic** that was configured in the Producer task.

![](<../../../assets/image (77).png>)

Navigate to the **Data** tab and define the deserialization format for the **Key** and **Value**. Ensure this matches the serialization format defined in the Producer task.

![](<../../../assets/image (82).png>)

The Consumer task is configured with **default lifecycle rules**. It will stop when **1 record** has been consumed, or **fail after 60,000ms**.&#x20;

However, you can amend these to suit your needs within the **Lifecycle** section.

![](<../../../assets/image (97).png>)

To learn about adding checks (tests) on data consumed from Kafka, move on to [\*\*Test Checks\*\*](../test-checks).&#x20;

## Consumer filters

It's possible to filter messages consumed by your Consumer task. This is useful if you need to intercept a message based on a specific criteria.

There are **multiple filter types**:

| Filter Type | Description                                                                            |
| ----------- | -------------------------------------------------------------------------------------- |
| Headers     | Filter on message headers (metadata)                                                   |
| JSON Query  | Filter on a message key or message value                                               |
| Schema Id   | When using Schema Registry, filter on a schema Id for the message key or message value |

Also, you can configure your filter rules with **two conditions**:

| Filter Condition | Description                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------- |
| All              | Filter messages that obey all filter rules (in cases where there are multiple filters)        |
| Any of           | Filter messages that abide by at least one filter (in cases where there are multiple filters) |

To add filters to your Consumer task, navigate to the **Data** tab when in edit mode. Under the **Filters** header, click the '**+**' button to add a new filter.

![](<../../../assets/image (74).png>)
