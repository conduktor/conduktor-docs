---
sidebar_position: 4
title: Create a Test Scenario
description: In this example, we will demonstrate how to create a Test Scenario.
---

# Create a Test Scenario

In this example, we will demonstrate how to create a Test Scenario that will:

- Produce a `Hello World` message into a Kafka topic
- Consume the message from the same topic
- Create a [Test Check](/platform/testing/features/building-tests/test-checks/) to validate the consumed data

This tutorial assumes you have setup the [Testing Agent](/platform/testing/getting-started/install-the-testing-agent/) already.

## Create a Test Suite

From within your [Workspace](/platform/testing/features/workspace/), navigate to the **Test Suites** tab and select **Create New.**

Give your test suite a name, for example, 'My First Test Suite'.

![testing-scenario-1.png](/img/testing/hello-world/testing-scenario-1.png)

## Create a Test Scenario

From within your newly created test suite, select **Create New** to create a **Test Scenario.**

Give your test scenario a name, for example, 'Hello World'.

![testing-hello-world.png](/img/testing/hello-world/testing-hello-world.png)

## Add a Produce task

From within the editor view, click **Scenario Start** and select **Producer** from the dropdown menu.

![testing-canvas.png](/img/testing/hello-world/testing-canvas.png)

In the **General** tab, select a configured **Cluster,** and choose the **Topic** to produce data into.

:::tip **Pro Tip:** Use the **Topic preview** button to fetch sample records from your Kafka topic.
:::

![testing-producer.png](/img/testing/hello-world/testing-producer.png)

Navigate to the **Data** tab and select the **serialization format** for your message key/value.

With **String** selected as the value format, enter the value `Hello World`.

![testing-produce-hello-world.png](/img/testing/hello-world/testing-produce-hello-world.png)

Select **Save** to add your Produce task to the graph.

![testing-canvas-2.png](/img/testing/hello-world/testing-canvas-2.png)

## Add a Consume task

Next, we will add a **Consume** task that will consume the `Hello World` message.

Select the **Scenario Start** button and select **Consumer** from the dropdown menu.

![testing-consume.png](/img/testing/hello-world/testing-consume.png)

Navigate to the **Data** tab and select the **deserialization** format for your message key/value.&#x20;

In this case, select **String** for both message key and value.

_Note we will use the default Lifecycle conditions in this example. These assume that we will only consume 1 record._

![testing-consume-data.png](/img/testing/hello-world/testing-consume-data.png)

Navigate to the **Checks** tab so we can assert the data that's consumed.

Select the **+ button** to add a new test check:

- Select message **Value** from the Source dropdown
  - _In this case, it's not necessary to select a field as our message value is a string. However, the jq field selection can be used to access fields within JSON records._
- Select the **Type** as string
- **Operator** as equals
- **Plain Value** as `Hello World`

![testing-consume-checks.png](/img/testing/hello-world/testing-consume-checks.png)

Select **Save** to add the Consume task to the editor.

![testing-canvas-3.png](/img/testing/hello-world/testing-canvas-3.png)

## Execute your Test Scenario

Select the **Run** button to execute your test and observe the result.&#x20;

_Note you must have a connected agent selected via the left navigation menu._

Navigate to the **Checks** tab to see the result of any [Test Checks](/platform/testing/features/building-tests/test-checks/).

![testing-checks.png](/img/testing/hello-world/testing-checks.png)
