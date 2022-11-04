---
title: Test Checks
description: Learn how to apply different types of validation on your Kafka data
---

# Test Checks

To ensure your applications that integrate Apache Kafka are working correctly, you can apply checks to **validate functionality** and **test your Kafka data**.&#x20;

You might also run tests to validate how your application handles a specific scenario. For example, to understand how your application responds to an erroneous or missing message value.

Test checks are added to tasks within your test scenario. You can test the data within a message consumed from Kafka, or test the metadata (e.g. offset, partition) received when you produce to Kafka.

## Add a test check

To add a check to a task, open it in edit mode and navigate to the **Checks** tab within the slide-out component.

![](<../../../assets/image (100).png>)

When you create a check, you need to **reference an attribute** **to test in your expression**.&#x20;

That attribute could be a:

- Message key
- Message value
- Some metadata associated with the record (e.g. partition, offset)

To see how to access these attributes, please continue to [**Accessing Kafka message data**](/platform/testing/features/building-tests/test-checks/accessing-kafka-message-data).&#x20;

&#x20;
