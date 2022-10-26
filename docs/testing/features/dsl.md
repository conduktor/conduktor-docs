---
sidebar_position: 6
description: Domain-specific language
---

# DSL

The DSL (Domain-specific language) is a specialized language enabling **rapid test declaration** and **version control** of your [Test Scenarios](building-tests/test-scenarios).&#x20;

When you use the Testing UI, it's possible to toggle between the visual and code-wise representation of a test.&#x20;

Additionally, it's possible to **export** the DSL behind a test scenario, and version control it in a system like Github. You can also **import** the DSL from a file, and create a test scenario from it.

## Introduction

Below shows an example of a simple Test Scenario that:

- Produces a `Hello World` message to a Kafka topic
- Consumes the message
- Checks the data of the consumed record

```
version: '0.1'
name: My first scenario
tasks:
  Produce:
    type: KafkaProducer
    name: Produce
    ref: gcfj
    cluster: wStRZX75LWa1VBRdNkwPs3
    topic:
      type: Plain
      value: pageviews_topic
    value:
      type: Plain
      value: Hello World
    keyFormat: String
    valueFormat: String
    headers:
    - app.name: Conduktor Testing
    acks: All
    idempotent: false
    properties:
      max.block.ms: '5000'
    check:
      checks: []
      operator: ALL
      type: ListCheck
  Consume:
    type: KafkaConsumer
    name: Consume
    ref: 9Gaz
    cluster: wStRZX75LWa1VBRdNkwPs3
    topic:
      type: Plain
      value: pageviews_topic
    keyFormat: String
    valueFormat: String
    filter:
      type: Header
      operator: Equals
      value: Conduktor Testing
      negate: false
    check:
      checks:
      - left:
          type: Jq
          value: .record.value
        right:
          type: Plain
          value: Hello World
        operator: EQUALS
        modifiers: {}
        type: StringComparator
      operator: ALL
      type: ListCheck
    lifecycle:
      stopConditions:
        consumedRecords: 1
      failConditions:
        elapsedMillis: 60000
scenario:
- task: Produce
  startsOn: scenarioStart
- task: Consume
  startsOn: scenarioStart
```

## Toggling the DSL view

When using Conduktor Testing, you can switch between the visual representation and the DSL in multiple ways.&#x20;

You can switch at a:

- Task level
- Scenario level

### **Task Level DSL**

When in **edit** mode for a [Task](building-tests/tasks/), use the **DSL View** button to switch to the code-wise representation of your task.&#x20;

![](<../assets/image (32).png>)

After switching the view, you will see the **DSL representation** of the currently selected task. If preferable, you can edit the task via the **DSL editor.**

![](<../assets/image (55).png>)

### **Scenario Level DSL**

To see your entire test scenario represented via the DSL, access the **DSL tab** from the editor view.

![](<../assets/image (110).png>)

You can **edit** the scenario DSL in this view, and also **export** it if you wish to store it elsewhere.&#x20;

## Restore a DSL version

If you have made changes to your test scenario, but want to rollback to a previous version, it's possible to do this from the **DSL tab**.

When in the DSL view for a test scenario, select the previous version from the **version history.**

_Note you will see a diff comparing the current version against your previously selected version._

![](<../assets/image (83).png>)

To rollback to a previous version, select **Restore version** from the diff comparison view.&#x20;

## Import DSL as a new test scenario

If you prefer to declare tests utilising the DSL, you may want to import a scenario so that:

- It's visually represented inside the UI
- You can export the [CI configuration](ci-cd-automation) for automation&#x20;

From within a [Test Suite](building-tests/test-suites), select the **Import from DSL** option.

![](<../assets/image (99).png>)

In the **DSL import** modal, either **paste** your code into the editor, or **upload** from a file.

![](<../assets/image (144).png>)
