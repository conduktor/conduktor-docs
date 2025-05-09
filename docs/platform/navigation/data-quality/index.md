---
title: Data quality
description: Data quality allows you to define checks and actions to apply on data produced into Kafka
---
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

## Overview

You can create Rules with CEL expressions which capture business logic for your data.
For example `value.customerId.matches("[0-9]{8}")`.

To make use of Rules you need to attach them to a Policy.
When creating a Policy you choose which Rules you want to apply, and which topics you want to apply them to.
You're then able to configure actions on the Policy which take effect when a Rule in the Policy is violated by a message in one of your target topics.
These actions are:
- Report: produce events into the Policy's history logs when violations occur
- Block: prevent the processing or transmission of data

Policies created through the Console UI do not have any actions enabled by default.
On each Policy's detail page you can see its description, Rules, targets, the number of messages evaluated and the number of violations since the Policy was created.
From this page you can also enable (and disable) actions for the Policy.

The Policies page lists your Policies with their actions and targets.
The Rules page lists your Rules with a preview of their CEL expressions.
You can visit a Rule's detail page to see its description, full CEL expression, and attached Policies.

## Prerequisites

Before using data quality, you have to:

- use **Conduktor Console 1.34** or later
- use **Conduktor Gateway 3.9** or later
- be logged in as an admin to Console UI, or using an admin token for the CLI
- in Console, [configure your Gateway cluster](/platform/navigation/settings/managing-clusters/) and fill in the **Provider** tab with Gateway API credentials

## Create a Rule

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

## Create a Policy

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

## Manage a Policy

todo (report and block actions)

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

## Related resources

- [Connect to clusters](/platform/navigation/settings/managing-clusters/)
- [Give us feedback/request a feature](https://conduktor.io/roadmap)
