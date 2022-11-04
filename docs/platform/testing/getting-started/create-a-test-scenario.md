---
sidebar_position: 4
title: Create a Test Scenario
description: In this example, we will demonstrate how to create a Test Scenario.
---

# Create a Test Scenario

In this example, we will demonstrate how to create a Test Scenario that will:

- Produce a `Hello World` message into a Kafka topic
- Consume the message from the same topic
- Create a [Test Check](../features/building-tests/test-checks) to validate the consumed data

This tutorial assumes you have installed the [Testing Agent](install-the-testing-agent), and [connected a Kafka cluster](connect-to-a-kafka-cluster).

## Create a Test Suite

From within your [Workspace](../features/workspace), navigate to the **Test Suites** tab and select **Create New.**

Give your test suite a name, for example, 'My First Test Suite'.

![](<../assets/image (34) (1) (1).png>)

## Create a Test Scenario

From within your newly created test suite, select **Create New** to create a **Test Scenario.**

Give your test scenario a name, for example, 'My first test scenario'.

![](<../assets/image (130).png>)

## Add a Produce task&#x20;

From within the editor view, click **Scenario Start** and select **Producer** from the dropdown menu.

![](<../assets/image (175).png>)

In the **General** tab, select a configured **Cluster,** and choose the **Topic** to produce data into.

:::tip
**Pro Tip:** Use the **Topic preview** button to fetch sample records from your Kafka topic
:::

![](<../assets/image (10) (1) (1) (1).png>)

Navigate to the **Data** tab and select the **serialization format** for your message key/value.&#x20;

With **String** selected as the value format, enter the value `Hello World`.

![](<../assets/image (158).png>)

Select **Save** to add your Produce task to the graph.

![](<../assets/image (42).png>)

## Add a Consume task

Next, we will add a **Consume** task that will consume the `Hello World` message.

:::info
**Note:** Kafka is asynchronous**,** so when producing and consuming from the same topic, these tasks should be configured in **parallel**.&#x20;

This ensures the consumer is subscribed when our record is produced.
:::

Select the **Scenario Start** button and select **Consumer** from the dropdown menu.

![](<../assets/image (63).png>)

Navigate to the **Data** tab and select the **deserialization** format for your message key/value.&#x20;

In this case, select **String** for both message key and value.

_Note we will use the default Lifecycle conditions in this example. These assume that we will only consume 1 record._

![](<../assets/image (109).png>)

Navigate to the **Checks** tab so we can assert the data that's consumed.

Select the **+ button** to add a new test check:

- In the **Field Selection (JQ)** input, enter the value `.record.value`
  - _See_ [_this resource_](../features/building-tests/test-checks/accessing-kafka-message-data)_, for more information on accessing data_&#x20;
- Select the **Type** as string
- **Operator** as equals
- **Plain Value** as `Hello World`

![](<../assets/image (80).png>)

Select **Save** to add the Consume task to the editor.

![](<../assets/image (18) (1).png>)

## Execute your Test Scenario

Select the **Run** button to execute your test and observe the result.&#x20;

_Note you must have a connected agent selected via the left navigation menu._

Navigate to the **Checks** tab to see the result of any [Test Checks](../features/building-tests/test-checks).

![](<../assets/image (123).png>)
