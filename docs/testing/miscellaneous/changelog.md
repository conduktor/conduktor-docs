---
sidebar_position: 3
title: Changelog
description: Conduktor Testing changelog
---

# Changelog

## 0.19.1 - 08/09/22

This release contains background work to allow on-premise deployment (work in progress)

## 0.19.0 - 05/09/22

This release contains background work to allow on-premise deployment (work in progress)

## 0.18.0 - 02/09/22

**Features:**

- Improving events between proxy and agent making the connection between the 2 more stable

## 0.17.3 - 01/09/22

**Features**:

- You can now skip server SSL check for both the cluster and the registry. \
  This is especially useful when using custom CA or self-signed certificates, or to debug connectivity issues.\
  The checkbox is accessible in both tabs of the Cluster Configuration view. _(this require an agent with version >= 0.17.3)_
- Add the Source entries in the Template (mustache) editor, allowing you to reference the parent task data easily without needing to remember the path or getting the reference

## 0.17.2 - 26/08/22

**Chore:**

- dependencies security update
- UI & design improvements

## 0.17.1 - 24/08/22

**Features:**

- Reduce significantly the Agent and CI Agent image size
- JVM performance and stability improvements

**Fixes:**

- Remove notification on outdated agent

## 0.17.0 - 17/08/22

:::info
This release brings ARM support for the CI and agent docker images.

The sizes have increased significantly, this is temporary while we are optimizing the new multi-arch build. We should be back to normal within the next releases.
:::

**Features:**

- ARM arch support for the agent & agent-ci docker images
- Added a new node type: **Load CSV** ! You can now load records from a CSV file present on the agent host, and chain it with for example a producer to push test data directly in your system.\
  _Make sure to update your agent to 0.17.0 to use this new feature !_&#x20;
- Improved the Variable preview UI
- Detect outdated agent and warn in-app
- Onboarding can now be discarded

**Bug fixes:**

- Fix deleting events from execution in Error
- Fix DSL preview loading infinitely on create
- Fix issue preventing declaring multiple variables at once
- Fix error page layout
- Fix github action for CI runner

**Other notes / Known bugs:**

- We have started to document how to [run our CI Agent for multiple CI/CD providers](../features/ci-cd-automation#using-the-ci-configuration-github-actions), for now on Github Action, GitlabCI and CircleCI. We will add more shortly.&#x20;

## 0.16.0 - 22/07/22

**Features:**

- Greatly simplified how to reference parent task data in child tasks. Check our new documentation [here](../features/building-tests/chaining-tasks#accessing-the-output)
- Extended data redaction to produced data, http responses and variables
- Improved some error messages on outdated agents and unknown commands
- Set Variable task name is now editable

**Bug fixes:**

- Fix cancellation not being propagated to the correct agent when multiple agents are on the same private key
- Fix connectivity check for Aiven clusters
- Fix execution being in "Lost" status for a short time on start
- Various frontend fixes around the new Http task
- Fix "Waiting connectivity" when creating agent not refreshing
- Fix Producer name not saved on create

**Other notes / Known bugs:**

- When setting multiple variables in a single Variable node, only the first one will be available in children nodes

## 0.15.0 - 07/07/22

**Features:**

- HTTP task type added for use in Test Scenarios
- Enable retry of HTTP requests until conditions are met
- Check HTTP response data (Status code, Body, Headers, Response time, Response size)
- New 'Template (Mustache)' editor that improves the UX and also adds support for functions and contextual, macro-generated data. E.g. randomIp, randomEmail, randomTimestamp

**Bug fixes:**

- Fix bug impacting form display when resizing the slideout
- Fix bug causing environment/agent selection showing behind slideout form
- Fix bug causing newly created agent to not show in list
- Fix bug when returning from execution details
- Fix typo on command used to download agent on Windows that caused it to fail
- Onboarding module display bug

**Other notes:**

- Update send feedback link with new URL

## 0.14.0 - 20/06/22

**Features:**

- Add time & offset-based strategies for Consumer tasks (e.g. consume from yesterday, consume from offset x)
- Redesign of Test Suite details page
- Add navigation to run suite history via new 'Runs' tab from within a Test Suite
- Align schema preview header style with topic preview

**Bug fixes:**

- Fix issue impacting cluster configuration updates

**Other notes:**

- Fetch agent connectivity state for focused page only (i.e. restrict if a user has multiple tabs open) &#x20;

## 0.13.3 - 14/06/22

**Bug fixes:**

- Fix freezing of the clusters view introduced in 0.13.2

## 0.13.2 - 13/06/22

**Features:**

- Enable random data generation for Avro (Custom + Schema Registry), JSON, Protobuf and MessagePack

**Bug fixes:**

- Fix white screen on consumer DSL view
- Fix issue when trying to run Test Suites

**Known issues:**

- Release introduced an issue with cluster connections / freezing the cluster screen, so was swiftly rolled back to issue fix

**Other notes:**

- Reduce the number of notifications on network error

  ***

## 0.13.1 - 08/06/22

**Features:**

- Updated variable values are now visible in the execution details
- Produced records data can now be viewed in the execution details
- Improved the Agent creation flow drastically and provide commands to download on run on your OS&#x20;
- Add a log on the Agent when a new version is available

**Bug fixes:**

- Fix some cluster configuration error handling, where the Submit button would do nothing
- Fixed some issues with the Generator
- Fixed some issues when switching to and from DSL view
- Fixed Executions becoming unlisted when the relative agent token is deleted

## 0.13.0 - 01/06/22

**Features:**

- Add an Onboarding module to help you get started !
- Replace menu icons with some easier to recognize
- Disable Cluster refresh if no agent is selected
- Improve notification messages UI
- Migrate Test Suite run details to a dedicated page

**Bug fixes:**

- Fix the sorting of events on the Home view
- Fix JSON registry serde not validating the data

## 0.12.1 - 26/05/22

**Features:**

- Add helper for Schema Registry strategy field
- Check/Uncheck all scenarios when running Test Suite or obtaining CI/CD configuration
- Point releases link to public changelog
- Make agents more discoverable

**Bug fixes:**

- Fix cluster is shown as reachable when agent is disconnected
- Fix issue with cluster configuration form when empty properties are provided

**Other notes:**

- Disabled ability to edit task name in the node itself due to usability issues

## 0.12.0 - 23/05/22

#### Features:

- Improve agent resiliency in case of server disconnection (resume executions)
- Add support for [Schema References](https://docs.confluent.io/platform/current/schema-registry/serdes-develop/index.html#schema-references)&#x20;
- Set execution status to Lost after some time (in case an agent was shut down for example)
- Allow renaming tasks from the Editor view
- Allow returning to configuration from CI/CD run modal

#### Bug Fixes:

- Assertions should not result in error when the value is null
- IsNull operator may fail with null JSON
- Mark executions as error if agent is not reachable
- Platform stability improvements
- Fix Cluster displayed as "connected" when no agent is up
- Fix a bug when converting Producer task DSL to form (causing `Error in Producter: No stop condition selected` on execution)
- Fix conversion from Producer Form to DSL losing schema details
- Fix some UI alignment issues on wide screens
- Remove confusing X in Topic Preview, closing the slideout

## 0.11.0 - 16/05/22

#### Features:

- Agent :&#x20;
  - Add Docker release
  - Accept both environment variables and arguments to start the agent
- UI improvements
  - new Tabs component
  - Scenario name in breadcrumb now leads to Editor
  - Agent selection is now scrollable
  - Add a Manage environment button in environment select

#### Bug Fixes:

- Scenario not using Registry should not fail if registry is unreachable
- Random bytes generation failed with "Illegal character"
- Fix an issue where an assertion failure would sometimes not trigger the execution failure
- Fix agent disconnecting after a period of inactivity
- Fix back navigation in execution always going to Insight view
- Prevent using special characters for variables and environment variables

## 0.10.0 - Public Beta - 09/05/22

Initial public release enabling E2E Kafka testing scenarios. Release inclusive of the Conduktor Testing UI, and the agent micro-application enabling users to reach clusters that the host has access to securely and with isolation.

**Features:**

- \***\*[**Test Scenarios**](../features/building-tests/test-scenarios)\*\***
  - Kafka [Producer](../features/building-tests/tasks/producer-task) task
    - Apply headers
    - Stream messages with elapsed time/record conditions
    - Additional options: chunk size, force partition, compression, idempotence, acks
    - [Check](../features/building-tests/test-checks/) metadata: offset, partition, timestamp, topic
  - Kafka [Consumer](../features/building-tests/tasks/consumer-task) task
    - Apply filters: headers, jq, schema id
    - Lifecycle conditions: x records, elapsed time
    - Check data and metadata: key, value, offset, partition, topic, timestamp
  - &#x20;[Set Variable](../features/building-tests/tasks/set-variable-task) task
    - Set 1 or many variables
    - Pass value from a previous task into variable
  - Task [ports](../features/building-tests/tasks/task-ports)
    - Chain tasks when:
      - Task completes
      - For each record (event) associated with the task
- **Clusters**
  - Reach local, private and public clusters using the [agent](../getting-started/install-the-testing-agent)
  - Add additional properties in your configuration
  - Schema registry support
    - No auth, basic auth, bearer token
- [**Custom Inputs**](../features/custom-inputs)\*\*\*\*
  - Plain
  - Field Selection (JSON Query 'jq')
  - Template (mustache)
  - JavaScript
- \***\*[**DSL**](../features/dsl)\*\***
  - Export/Import DSL code
  - Versioning of DSL inside the application (with restore)
  - Switch between DSL/UI when editing a [task](../features/building-tests/tasks/) or [scenario](../features/building-tests/test-scenarios)
- \***\*[**Environments**](../features/environments/)\*\***
  - Create environments
  - Attach [variables](../features/environments/using-environment-variables) (Types: Cluster, String)
  - [Use](../features/environments/using-environment-variables) variables
- [**Insights**](../features/insights)\*\*\*\*
  - Scenario level insights available
  - Metrics: Pased/Failed executions, E2E execution duration, execution time of each task
- \***\*[**Agent**](../getting-started/install-the-testing-agent)\*\***
  - Local agent for reaching local/private clusters
  - [CI Agent](../features/ci-cd-automation) for executing test scenarios in build pipeline
- **Collaboration**
  - Create an organisation
  - Invite your colleagues (Manage Team)
  - Workspace data in Home dashboard (recently viewed, what's happening, execution activity)

**Bug fixes:**

**Known issues:**

- High throughput scenario executions may fail or be slow, while we are calibrating the platform for the load
- Agents may go stale and become unreachable after some time
- The DSL view of a task is missing a few features relative to the UI view, we suggest that you rely on the UI view or on the Scenario DSL view while we fix this.
