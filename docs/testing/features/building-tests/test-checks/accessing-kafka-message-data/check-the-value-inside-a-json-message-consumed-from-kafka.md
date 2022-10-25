---
sidebar_position: 2
---

# Check the value inside a JSON message consumed from Kafka

First, add a [Producer](../../tasks/producer-task) task to your test scenario.&#x20;

Navigate to the **Data** tab and select the **Value format** = **JSON**.

Produce a JSON message that looks like the below example:

![](<../../../../assets/image (113).png>)

Click the **Scenario Start** button, and in parallel, add \***\* a **Consumer\*\* task to your test scenario.

![](<../../../../assets/image (50).png>)

Open the task in edit mode and:

- Navigate to the data tab and set the **Value format** = **JSON**
- Navigate to the **Checks** tab in the slide-out component \*\*\*\*&#x20;

With \***\* the input type **Field selection (JQ)\*\* selected:

- add `.record.value.id` as the field selection
- Select `type` = `string` and `operator` =`equals`&#x20;
- With `Plain value` selected as the input field, add `abc-123` as the value to compare

![](<../../../../assets/image (28).png>)

Save your consumer task and **Run** your scenario. ** Navigate to the **Checks** tab to observe the result of the test check. **&#x20;

_Note you must have the_ [_Testing Agent_](../../../../getting-started/install-the-testing-agent) _installed to run test scenarios._

![](<../../../../assets/image (104).png>)

In this case our test was successful, as the expression validated true against the record that was consumed.&#x20;

Continue to read more about [Check Operators](../check-operators).
