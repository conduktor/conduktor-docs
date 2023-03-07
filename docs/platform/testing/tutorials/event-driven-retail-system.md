---
title: Event-Driven Retail System
description: Learn how to test the end-to-end flow of an event-driven architecture
---

# Event-Driven Retail System

In this tutorial, we will demonstrate how to compose an end-to-end Test Scenario for an event-driven system composing of multiple topics. This tutorial will demonstrate:

- Testing the **workflow** to validate the integrations
  - _Are messages correctly broadcast to Kafka topics from the external applications?_&#x20;
- Testing the **data integrity** at each step:
  - _Was our message enriched correctly based on the_ `userId`
  - _Was a message received within an agreed SLA?_

## Architecture Reference

The general flow can be described as:

- Message is produced into the `pageviews` topic
- User Service consumes the message, enriches it with additional data and pushes a new message into the `pageviews_enriched` topic
- Promotions Service consumes the enriched message, and assuming certain business rules are met, produces another message into the `upsell_events` topic

![](<../assets/Screenshot 2022-05-24 at 17.35.25 (1).png>)

## Test Scenario

Below demonstrates how to build a Test Scenario representing the above architecture.

:::info Remember, any dependent applications must be running to validate the scenario. In this case, the User and Promotions Services are considered external applications. :::

![](<../assets/image (10) (1) (1).png>)

Note that:

- The first task produces a message into `pageviews` topic
- Once it's been processed by the User Service, the second task consumes the enriched event from `enriched_pageviews`
  - _Note that it's chained onto the `end` _ [_port_](/platform/testing/features/building-tests/tasks/task-ports/) _of the previous task_
- Lastly, the third task will consume any resultant events from `upsell_events`

## Breaking it Down

### Producer Task

This task produces a message into the `pageviews` topic. There are no [Test Checks](/platform/testing/features/building-tests/test-checks/) associated with it.&#x20;

The cluster and topic are configured on the **General** tab. Then, a valid JSON message value is set on the **Data** tab.&#x20;

The User Service will take care of enrichment based on the `userId` present in this message.

![](<../assets/Screenshot 2022-05-24 at 20.02.41.png>)

### Consumer Task - Check Enriched

This Task is used to consume the enriched message and check the data within.

In the **Data** tab, the deserialisation formats for consuming the enriched message are set. In this case, we expect a JSON value format.

Only 1 enriched message is expected from the User Service, therefore the default lifecycle rules _(stop after 1 message is consumed)_ are suitable.

:::info If messages were continuously being produced into this topic, we would need to use a filter to intercept the correct one.&#x20; :::

![](<../assets/Screenshot 2022-05-24 at 20.54.29.png>)

Below shows the expected output for an **enriched** message.&#x20;

```json
// Consumed Message
{
  "TIMESTAMP": 1652012999698,
  "USERID": 12345,
  "PAGEID": 200,
  "PAGENAME": "Checkout",
  "COUNTRY": "US",
  "PLANTYPE": "Free",
  "INTERESTS": "Gaming"
}
```

To validate the User Service is working correctly, we will create a [Test Check](/platform/testing/features/building-tests/test-checks/) on the consumed message.

- Navigate to the **Checks** tab
- The 'Plan Type' attribute is the result of **message enrichment**
- It's accessible via JQ using `.record.value.PLANTYPE`
- Set the type to `string` and Operator to `equals`
- Assert that user `12345` is on a `Free` plan

![](<../assets/Screenshot 2022-05-24 at 20.54.38.png>)

### Consumer Task - Check Upsell

The last task is used to ensure that `Free` members who visit the checkout page are upsold promotional products.&#x20;

If the Promotions Service is working correctly, a message will be produced into the `upsell_events` topic.&#x20;

From a business perspective, it's important this happens within an agreed **SLA.** For this example, the SLA is set at 500ms.

This is addressed via the **Lifecycle** section on the Data tab:

- Set the fail condition to an elapsed time of **500ms**
  - _Meaning, if this process takes > 500ms, the test will be considered a fail_

![](<../assets/Screenshot 2022-05-25 at 17.27.49 (1).png>)

### Execution

With the workflow and checks configured, the only remaining step is to execute the scenario.

Use **Run** to execute the test and observe the result.

![](<../assets/Screenshot 2022-05-25 at 17.35.20.png>)

In the above case, we can see the end-to-end test scenario has **failed**. Hovering over the events will provide more detail.&#x20;

> `Consumer reached the Timeout fail condition`
>
> This means that the business SLA of 500ms was not met.

Navigating to the **Checks** tab will detail the result of any [Test Checks](/platform/testing/features/building-tests/test-checks/). In this case, the check on the enriched data was successful.&#x20;

> userId `12345` was correctly attributed to a `Free` plan by the User Service

![](<../assets/Screenshot 2022-05-25 at 17.50.50.png>)

**Great!** We have our identified the components in our system that are passing, and those that are currently failing. Now we can start to address the reasons for failure!&#x20;
