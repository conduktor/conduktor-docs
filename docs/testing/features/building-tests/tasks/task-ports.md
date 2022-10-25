---
sidebar_position: 4
---

# Task Ports

When you add a task to a scenario, you will notice there are **ports** which can be used for **chaining** tasks together. Depending on the task, you will have different ports available.

The ports act as event triggers that behave in different ways.&#x20;

| Task Type           | Port          | Definition                                                                                                                                                                                                                                                                                                |
| ------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Producer / Consumer | `END`         | Chained tasks will be triggered **once**, when the entire task has **finished executing**. For example, tasks chained to the `END` port of a [Producer](./features/building-tests/tasks/producer-task) that's producing 10 messages will only be executed once (when all 10 messages have been produced). |
| Producer / Consumer | `ON RECORD`   | Chained tasks will be executed **for each record** that's either produced or consumed. For example, a task chained to the `ON RECORD` port of a [Consumer](./features/building-tests/tasks/consumer-task) that's consuming 10 messages will be executed 10 times (for each record).                       |
| HTTP                | `ON RESPONSE` | Chained tasks will be executed after the HTTP response has been received.                                                                                                                                                                                                                                 |
| Variables           | `VARIABLES`   | Chained tasks will be executed after the variable condition has been set.                                                                                                                                                                                                                                 |
