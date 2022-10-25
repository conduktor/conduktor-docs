---
sidebar_position: 1
---

# Check the partition of a message produced to Kafka

Add a 'Producer' task to your test scenario

Open the task in edit mode and navigate to the 'Checks' tab in the slide-out component.

![](<../../../../assets/image (5) (1).png>)

Select the **+ button** to create a new check

![](<../../../../assets/image (49).png>)

With \***\* the [custom input](../../../custom-inputs) type **Field selection (JQ)\*\* selected:

- add `.record.partition` as the field selection
- Select `type` = `any` and `operator` =`equals`&#x20;
- With `Plain value` selected as the input field for the value, add the expected partition.&#x20;

![](<../../../../assets/image (135).png>)

**Run** your test, and navigate to the **Checks** tab when the execution is complete to observe the result of your check.

_Note to run tests you must have the_ [_Testing Agent_](../../../../getting-started/install-the-testing-agent) _installed_&#x20;

![](<../../../../assets/image (111).png>)

In this case, our test failed as the message was not produced into partition 0. Instead, the record was produced into partition 2.

Continue to see how to [check the value of an attribute inside a JSON message](check-the-value-inside-a-json-message-consumed-from-kafka).
