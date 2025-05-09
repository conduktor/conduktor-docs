---
title: Data quality
description: Data quality allows you to define checks and actions to apply on data produced into Kafka
---
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

## Overview

Bad data breaks customer experiences, drives churn, and slows growth. Trust helps teams catch and fix data quality issues before they impact your business.
You define the rules and we enforce them at the streaming layer.

## Prerequisites

Before using data quality, you have to:

- use **Conduktor Console 1.34** or later
- use **Conduktor Gateway 3.9** or later
- be logged in as an admin to Console UI, or using an admin token for the CLI
- in Console, [configure your Gateway cluster](/platform/navigation/settings/managing-clusters/) and fill in the **Provider** tab with Gateway API credentials

## Rules

You can create Rules with CEL expressions which capture business logic for your data.
For example `value.customerId.matches("[0-9]{8}")`.

:::info
Rules do nothing on their own - you **need** to attach them to a Policy.
:::

The Rules page lists your Rules with a preview of their CEL expressions.
You can visit a Rule's detail page to see its description, full CEL expression, and attached Policies.

### Create a Rule

You can create a data quality rule from the **Console UI**, or the **Conduktor CLI**.

<Tabs>
<TabItem value="ui" label="Console UI">
You can create a Rule through the Console UI through the following steps.

1. In the Trust section of the sidebar in Conduktor Console go to **Rules** and click **+New Rule**.
1. Define the Rule details:
   - Add a descriptive **name** for the Rule.
   - The **Technical ID** will be auto-populated as you type in the name. This is used to identify this Rule in CLI/API.
   - (Optional) Enter a **Description** to explain your Rule.
1. Define the CEL expression for your Rule:
   - Common Expression Language (CEL) is an expression language supporting common operators like `==` and `>` as well as macros like `has()` to check for the presence of fields. See [the CEL language definition](https://github.com/google/cel-spec/blob/master/doc/intro.md) for more details.
</TabItem>

<TabItem value="cli" label="Conduktor CLI">
You can also use the [Conduktor CLI (Command Line Interface)](/gateway/reference/cli-reference/) to create a Rule.

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

1. Use [Conduktor CLI](/gateway/reference/cli-reference/) to apply the configuration:

    ```bash
    conduktor apply -f rule.yaml
    ```

</TabItem>
</Tabs>

### Example Rules

Provided below are a number of example rules you may choose to set up within your system. **Note:** you need to ensure that your rules are looking at the correct field. Here we have provided examples.

<details>
  <summary>Email RegEx Validation</summary>
  <p>
    `value.customer.email.matches(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")`
  </p>
</details>
<details>
  <summary>UUID RegEx Validation</summary>
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

**Policies** define which *Rules* you want to apply, and where (the topics or prefixes) you want to apply them to.
You're then able to configure actions on the Policy which take effect when a Rule in the Policy is violated by a message in one of your target topics.

On each Policy's detail page you can see its description, Rules, targets, the number of messages evaluated and the number of violations since the Policy was created.
From this page you can also enable (and disable) actions for the Policy.

The Policies page lists your Policies with their actions and targets.

### Actions

The available actions for a policy are:

- **Report**: produce events into the Policy's history logs when violations occur
- **Block**: prevent the processing or transmission of data

Policies created through the Console UI do not have any actions enabled by default. If there are any additional actions you'd like to see, please [get in touch](https://support.conduktor.io/hc/en-gb/requests/new?ticket_form_id=17438365654417).

### Create a Policy

You can create a data quality policy from the **Console UI**, or the **Conduktor CLI**.

<Tabs>
<TabItem value="ui" label="Console UI">
You can create a Policy through the Console UI through the following steps.

1. In the Trust section of the sidebar in Conduktor Console go to **Policies** and click **+New Policy**.
1. Define the Policy details:
   - Add a descriptive **name** for the Policy.
   - The **Technical ID** will be auto-populated as you type in the name. This is used to identify this Policy in CLI/API.
   - (Optional) Enter a **Description** to explain your Rule.
1. Select Rules to be used in the Policy:
   - Every Policy must have at least one Rule
   - You can also create new Rules from this page
1. Select targets for the Policy:
   - Every Policy must have at least one target
   - A target consists of one or more topics on a specified Gateway
   - You can either select specific topics, or specify a prefix like `orders-*`
</TabItem>

<TabItem value="cli" label="Conduktor CLI">
You can also use the [Conduktor CLI (Command Line Interface)](/gateway/reference/cli-reference/) to create a Policy.

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

Once a policy is created, you are able to view the linked rule(s), the target(s) of the policy and change the [actions](#actions) of the policy. You can also view the violations as they have occurred if you have reporting enabled, otherwise you will only have the counts available.

:::info Toggling Block Action
As the Block action has the ability to stop data from being sent to the requested topic, the user **must** confirm that that this is what they desire by entering `"BLOCK"` when prompted by the modal.

The inverse is also true, and as such the user must enter `"UNBLOCK"` when attempting to disable this action.
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
  Header names often have dashes (e.g. `Content-Type`) and as such cannot be accessed using dot notation. Instead you need to use bracket notation and access via the `headers['Content-Type']` format instead.
  </p>
</details>

## Related resources

- [Connect to clusters](/platform/navigation/settings/managing-clusters/)
- [Give us feedback/request a feature](https://conduktor.io/roadmap)
