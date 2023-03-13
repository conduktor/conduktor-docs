---
sidebar_position: 6
title: Schema Registry
description: Learn how to integrate Schema Registry in your Test Scenarios
---

# Schema Registry

Note that this document assumes you have configured Schema Registry when adding a Cluster to your workspace. If you have not done this step, please refer to [this](https://docs.testing.conduktor.io/getting-started/connect-to-a-kafka-cluster#schema-registry) section.

We currently support **Avro**, **Protobuf** and **JSON** schema registry types.&#x20;

It's possible to produce and consume messages with a specified:

- Strategy
- Subject
- Version

Additionally, you can both filter and check messages consumed based on the Schema Id.

## Producing a message with schema registry type

Add a [Producer Task](/platform/testing/features/building-tests/tasks/producer-task) to the canvas editor.&#x20;

On the General tab, specify the cluster and topic relevant to your scenario. Then, progress to the 'Data' tab of the form.

![Specifying schema registry value type](<../../assets/image (8).png>)

For either the key or value, select the format as the appropriate registry type from the dropdown list. You will then need to specify the [Strategy](https://docs.confluent.io/platform/current/schema-registry/serdes-develop/index.html#sr-schemas-subject-name-strategy), Subject and Version for producing a message.

When producing the message, you can either:

- **Generate random data:** This will infer the correct data types from your schema
- **Manually enter data:** Provide a manual input for the message&#x20;

:::tip **Pro Tip!** Use 'Preview Schema' to peek your schema inside the Testing application.
:::

![Preview Schema  ](<../../assets/image (3).png>)

## Consuming a message with schema registry type

Add a corresponding [Consumer Task](/platform/testing/features/building-tests/tasks/consumer-task/) to the canvas editor.&#x20;

On the General tab, specify the cluster and topic relevant to your scenario. Then, progress to the 'Data' tab of the form.

![](<../../assets/image (4).png>)

For either the key or value, select the format as the appropriate registry type from the dropdown list.&#x20;

## Filtering messages on Schema Id

When consuming messages, it's possible to filter messages based on a specified Schema Id.

When on the '**Data**' tab for a Consumer task form, navigate to the **Filters** section.

Select the **+** button to add a new filter, and select **Schema Id Filter.**

![Schema Id Filter](<../../assets/image (1).png>)

Provide the Id in either the Key/Value Schema Id field. This will filter messages consumed that match the specified Id.

## Checking the Schema Id

When making [Test Checks](/platform/testing/features/building-tests/test-checks/) in a scenario, it's possible to check the Key or Value Schema Id.

The syntax for accessing these values in a [Consumer Task](/platform/testing/features/building-tests/tasks/consumer-task/) is outlined below:

**JQ:**

- Key Schema Id: `.record.keySchemaId`
- Value Schema Id: `.record.valueSchemaId`

**JavaScript:**

- Key Schema Id: `context.record.keySchemaId`
- Value Schema Id: `context.record.valueSchemaId`

Belo demonstrates how to use **jq** to create a test check on the Value Schema Id.

![Checking Value Schema Id](<../../assets/image (6).png>)
