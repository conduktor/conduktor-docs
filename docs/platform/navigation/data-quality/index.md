---
title: Data quality
description: Data quality allows you to define checks and actions to apply on data produced into Kafka
---
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';
import CopyableCode from '@site/src/components/CopyableCode';

## Overview

Bad data breaks customer experiences, drives churn and slows growth.
[Conduktor Trust](https://conduktor.io/trust) helps teams catch and fix data quality issues *before* they impact your business. You define the Rules and we'll enforce them at the streaming layer.

## Prerequisites

Before creating data quality Rules and Policies, you have to:

- use **Conduktor Console 1.34** or later
- use **Conduktor Gateway 3.9** or later
- be logged in as an admin to Console UI or use an admin token for the Conduktor Command Line Interface (CLI)
- in Console, [configure your Gateway cluster](/platform/navigation/settings/managing-clusters/) and fill in the **Provider** tab with Gateway API credentials

## Rules

You can create Rules with the Common Expression Language (CEL) expressions which capture business logic for your data. For example: `value.customerId.matches("[0-9]{8}")`.

:::info[Rules require Policies]
Rules do nothing on their own - you **have to** to attach them to a Policy.
:::

The Rules page lists your Rules, with a preview of their CEL expressions. Open Rule's detail page to see its description, full CEL expression and attached Policies.

### Create a Rule

You can create a data quality Rule from the **Console UI**, or the **Conduktor CLI**.

<Tabs>
<TabItem value="ui" label="Console UI">
To create a Rule using the Console UI:

1. In the Trust section of the sidebar of Conduktor Console go to **Rules** and click **+New Rule**.
1. Define the Rule details:
   - Add a descriptive **name** for the Rule.
   - The **Technical ID** will be auto-populated as you type in the name. This is used to identify this Rule in CLI/API.
   - (Optional) Enter a **Description** to explain your Rule.
1. Define the CEL expression for your Rule:
   - Common Expression Language (CEL) is an expression language supporting common operators like `==` and `>` as well as macros like `has()` to check for the presence of fields. See [the CEL language definition](https://github.com/google/cel-spec/blob/master/doc/intro.md) for more details.
1. Click **Create**.
</TabItem>

<TabItem value="cli" label="Conduktor CLI">
You can also use the [Conduktor CLI](/gateway/reference/cli-reference/) to create a Rule:

1. Save this example to file, e.g. `rule.yaml`:

    ```yaml
    apiVersion: v1
    kind: DataQualityRule
    metadata:
        name: check-customer-email
    spec:
        celExpression: value.customer.email.matches(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
        displayName: check customer email
        description: Verify the customer's email format.
        type: Cel
    ```

2. Use [Conduktor CLI](/gateway/reference/cli-reference/) to apply the configuration:

    ```bash
    conduktor apply -f rule.yaml
    ```

</TabItem>
</Tabs>

### Built-in Rules

We provide built-in validation Rules that can't be achieved with CEL.

:::info[Supported schema registries]
We currently only support **Confluent** and **Confluent like** (e.g. Redpanda) schema registries.
:::

#### EnforceAvro

`EnforceAvro` ensures that:

- Your messages have a schema ID prepended to the message content.
- The schema ID exists within your schema registry.
- The schema it references is of type `avro`.

### Sample Rules

Here are some examples of data quality rules.

:::info[Adjust values]
Make sure you amend these examples to use your values.
:::

<details>
  <summary>Email RegEx validation</summary>
  <p>
    Your requirements may be different from this RegEx, as email validation via RegEx is complex.
    <CopyableCode language="bash">{`value.customer.email.matches(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")`}</CopyableCode>
  </p>
</details>
<details>
  <summary>UUID RegEx validation</summary>
  <p>
    <CopyableCode language="bash">{`value.customer.id.matches(r"^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$")`}</CopyableCode>
  </p>
</details>

<details>
  <summary>Ensure Header is JSON</summary>
  <p>
    <CopyableCode language="bash">{`headers['Content-Type'] == 'application/json'`}</CopyableCode>
  </p>
</details>

## Policies

A Policy is made up of Rules that are applied to topics/prefixes.

Once created, Policies can be assigned [actions](#actions) to take effect when certain criteria is met (e.g., a Rule in the Policy is violated).

The Policy's detail page shows its description, linked Rules, targets, the number of messages evaluated and the number of violations since the Policy was created. You can also enable (and disable) actions for the Policy from this page.

The Policies page lists your Policies with their actions and targets.

### Actions

The available actions to enable for a Policy are:

- **Report**: when violations occur, log these as events in the Policy's history
- **Block**: when a violation occurs, prevent data from being processed or transmitted

By default, Policies created using the Console UI don't have any actions enabled. You have to complete the Policy creation first and then enable the required actions. If there are any additional actions you'd like to see, [get in touch](https://support.conduktor.io/hc/en-gb/requests/new?ticket_form_id=17438365654417).

### Create a Policy

You can create a data quality Policy from the **Console UI**, or the **Conduktor CLI**.

<Tabs>
<TabItem value="ui" label="Console UI">
You can create a Policy through the Console UI through the following steps:

1. In the Trust section of the sidebar in Conduktor Console go to **Policies** and click **+New Policy**.
1. Define the Policy details:
   - Add a descriptive **name** for the Policy.
   - The **Technical ID** will be auto-populated as you type in the name. This is used to identify this Policy in CLI/API.
   - Select a group to own the Policy. This controls who can view and manage the Policy, and which resources can be targeted.
   - (Optional) Enter a **Description** to explain your Rule.
1. Select Rules to be used in the Policy:
   - Every Policy must have at least one Rule
   - You can also create new Rules from this page
   - Click **Continue** to move to the next step.
1. Select targets for the Policy:
   - Every Policy must have at least one target
   - A target consists of one or more topics on a specified Gateway
   - You can either select specific topics, or specify a prefix like `orders-*`
   - Click **Continue** to move to the next step.
2. Review the Policy, and if you are happy, confirm by clicking **Create**.
</TabItem>

<TabItem value="cli" label="Conduktor CLI">
You can also use the [Conduktor CLI (Command Line Interface)](/gateway/reference/cli-reference/) to create a Policy:

1. Save this example to file, e.g. `policy.yaml`:

    ```yaml
    apiVersion: v1
    kind: DataQualityPolicy
    metadata:
        name: check-order-payload
        group: orders-team
    spec:
        displayName: Verify the order items
        description: Verify the order items payloads on purchase-pipeline topic.
        rules:
          - check-customer-email
        targets:
          - cluster: gateway
            topic: purchase-pipeline
            patternType: LITERAL
        actions:
          block:
            enabled: false
          report:
            enabled: true
    ```

1. Use [Conduktor CLI](/gateway/reference/cli-reference/) to apply the configuration:

    ```bash
    conduktor apply -f policy.yaml
    ```

</TabItem>
</Tabs>

### Manage a Policy

Once a Policy is created, you are able to view the linked Rule(s), the target(s) of the Policy and change the [actions](#actions) of the Policy. You can also view the violations as they have occurred if you have reporting enabled, otherwise you will only have the counts available.

:::info[Enabling block action]
Since the **block** action has the ability to **stop data from being sent** to the requested topic, you have to confirm this by entering 'BLOCK' when prompted. Conversely, to disable the blocking, enter 'UNBLOCK' when prompted.
:::

### Assign permissions

Policies are owned by user groups and can be created by admin users or groups with the `Manage data quality` permission enabled.

To apply this permission to a group, go to **Settings** > **Groups** and in the **Resource access** tab tick the `Manage data quality` checkbox for the relevant resources, as required.

Modifying group permissions won't affect any Policies associated with the group.

![The 'manage data quality' permission is the final column in the topics table in resource access tab of the group settings page](/docs/platform/navigation/data-quality/assets/topic-dq-manage-permission.png)

Note: make sure to allow the permission on the gateway cluster (not the underlying Kafka cluster).

### Set up Policy violation alerts

You can create alerts that are triggered when a Policy violation happens. Data quality alerts can be owned by groups or individual users.

<Tabs>
<TabItem value="ui" label="Console UI">

To create a data quality policy alert via the UI, go to the details page of a Policy (click on the button next to the violations graph) or from the alert tab on the Policies list page.

A data quality policy alert needs to specify a Policy and a threshold: trigger after X violations within Y minutes/hours/days. This threshold replaces the combination of metric, operator and value used in other alerts.

[Find out more about alerts](/platform/navigation/settings/alerts).

</TabItem>

<TabItem value="cli" label="Conduktor CLI">

You can use the CLI to create a data quality policy alert:

1. Save this example to file, e.g. `alert.yaml`:

    ```yaml
    apiVersion: v3
    kind: Alert
    metadata:
      name: alert
      group: my-group
    spec:
      type: DataQualityPolicyAlert
      policyName: my-policy
      triggerAfter: 1
      withinInSeconds: 30
    ```

2. Use [Conduktor CLI](/gateway/reference/cli-reference/) to apply the configuration:

    ```bash
    conduktor apply -f alert.yaml
    ```

</TabItem>
</Tabs>

### Using multiple Policies

When multiple Policies target the same topic, there are two scenarios that can occur when a record is produced:

- **None** of the Policies block the record and all are evaluated

  - The evaluation count is increased for all of the Policies.
  - The violation count is increased for each violated Policy.
  - A report is generated for each violated Policy (that has reporting enabled).

- **One or more** of the Policies block the record production. In this scenario, one of the Policies blocks the record first and then hides it from others

  - For the first blocking Policy, both the violation and evaluation counts are increased. If reporting is enabled for that policy, a report is generated.
  - For the other Policies: no counts are increased and no reports are generated.

## Troubleshoot

<details>
  <summary>What does Policy status mean?</summary>
  <p>
  This is the status of a data quality Policy:
    - **Pending**: the configuration isn't deployed or refreshed yet
    - **Ready**: the configuration is up-to-date on Gateway
    - **Failed**: something unexpected happened during the deployment. Check that the connected Gateway is active.
  </p>
</details>
<details>
  <summary>How do I handle headers with dashes?</summary>
  <p>
  Use bracket notation instead of dot notation. For example: <CopyableCode language="bash">{`headers['Content-Type']`}</CopyableCode>
  </p>
</details>

## Related resources

- [Connect to clusters](/platform/navigation/settings/managing-clusters/)
- [Give us feedback/request a feature](https://conduktor.io/roadmap)
