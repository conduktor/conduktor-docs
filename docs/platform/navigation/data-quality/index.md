---
title: Data quality
description: Data quality allows you to define checks and actions to apply on data produced into Kafka
---
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

## Overview

Bad data breaks customer experiences, drives churn and slows growth.
[Conduktor Trust](https://conduktor.io/trust) helps teams catch and fix data quality issues *before* they impact your business.
You define the rules and we'll enforce them at the streaming layer.

## Prerequisites

Before creating data quality rules and policies, you have to:

- use **Conduktor Console 1.34** or later
- use **Conduktor Gateway 3.9** or later
- be logged in as an admin to Console UI (or use an admin token for the CLI)
- in Console, [configure your Gateway cluster](/platform/navigation/settings/managing-clusters/) and fill in the **Provider** tab with Gateway API credentials

## Rules

You can create Rules with CEL expressions which capture business logic for your data. For example: `value.customerId.matches("[0-9]{8}")`.

:::info[Rules require Policies]
Rules do nothing on their own - you **have to** to attach them to a Policy.
:::

The Rules page lists your Rules, with a preview of their CEL expressions. Open Rule's detail page to see its description, full CEL expression and attached Policies.

### Create a Rule

You can create a data quality rule from the **Console UI**, or the **Conduktor CLI**.

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

### Example Rules

Here are some sample data quality rules.
:::info[Amend values if using these samples]
Make sure you amend the field values to use correct fields, if using these examples.
 :::

<details>
  <summary>Email RegEx validation</summary>
  <p>
    Your requirements may be different from this RegEx, as email validation via RegEx is complex!
    `value.customer.email.matches(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")`
  </p>
</details>
<details>
  <summary>UUID RegEx validation</summary>
  <p>
  `value.customer.id.matches(r"^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$")`
  </p>
</details>
<details>
  <summary>Ensure Header is JSON</summary>
  <p>
  `headers['Content-Type'] == 'application/json'`
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

By default, Policies created using the Console UI don't have any actions enabled. You have to complete the Policy creation first and then enable the required actions. If there are any additional actions you'd like to see, please [get in touch](https://support.conduktor.io/hc/en-gb/requests/new?ticket_form_id=17438365654417).

### Create a Policy

You can create a data quality policy from the **Console UI**, or the **Conduktor CLI**.

<Tabs>
<TabItem value="ui" label="Console UI">
You can create a Policy through the Console UI through the following steps:

1. In the Trust section of the sidebar in Conduktor Console go to **Policies** and click **+New Policy**.
1. Define the Policy details:
   - Add a descriptive **name** for the Policy.
   - The **Technical ID** will be auto-populated as you type in the name. This is used to identify this Policy in CLI/API.
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
2. Review the policy, and if you are happy, confirm by clicking **Create**.
</TabItem>

<TabItem value="cli" label="Conduktor CLI">
You can also use the [Conduktor CLI (Command Line Interface)](/gateway/reference/cli-reference/) to create a Policy:

1. Save this example to file, e.g. `policy.yaml`:

    ```yaml
    apiVersion: v1
    kind: DataQualityPolicy
    metadata:
        name: check-order-payload
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

## Troubleshoot

<details>
  <summary>What does Policy status mean?</summary>
  <p>
  This is the status of a data quality policy:
    - **Pending**: the configuration isn't deployed or refreshed yet
    - **Ready**: the configuration is up-to-date on Gateway
    - **Failed**: something unexpected happened during the deployment. Check that the connected Gateway is active.
  </p>
</details>
<details>
  <summary>How do I handle headers with dashes?</summary>
  <p>
  Use bracket notation instead of dot notation. For example, use the `headers['Content-Type']` format.
  </p>
</details>

## Behaviour when multiple policy target a common topic

Here’s a corrected and polished version of your text:

---

## Behavior When Multiple Policies Target a Common Topic

When multiple policies target the same topic, two scenarios can occur when a record is produced:

* **None of the policies block the record; all are evaluated:**

  * The evaluation count is increased for all of them.
  * The violation count is increased for each violated policy.
  * A report is generated for each violated policy that has reporting enabled.

* **One or more policies would block the record. In this scenario, one of the blocking policies blocks the record first and hides it from the others:**

  * For the first blocking policy, both the violation and evaluation counts are increased. If reporting is enabled for that policy, a report is generated.
  * For the others: no counts are increased, and no reports are generated.

## Related resources

- [Connect to clusters](/platform/navigation/settings/managing-clusters/)
- [Give us feedback/request a feature](https://conduktor.io/roadmap)
