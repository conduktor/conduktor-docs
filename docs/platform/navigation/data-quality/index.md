---
title: Data quality
description: Data quality allows you to define checks and actions to apply on data produced into Kafka
---
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

## Overview

You can create rules with CEL expressions which capture business logic for your data.
For example `value.customerId.matches("[0-9]{8}")`.

To make use of rules you need to register them in a policy.
When creating a policy you choose which rules you want to apply, and which topics you want to apply them to.
You're then able to configure actions on the policy which take effect when a rule in the policy is violated by a message in one of your target topics.
These actions are:
- Report: produce events into the audit log of console when violations occur
- Block: prevent the processing or transmission of data

Policies created through the Console UI do not have any actions enabled by default.
On each policy's detail page you can see its description, rules, targets, the number of messages evaluated and the number of violations since the policy was created.
From this page you can also enable (and disable) actions for the policy.

The Policies page lists your policies with their actions and targets.
The Rules page lists your rules with a preview of their CEL expressions.
You can visit a rule's detail page to see its description, full CEL expression, and attached policies.

## Prerequisites

Before using data quality, you have to:

- use **Conduktor Console 1.34** or later
- use **Conduktor Gateway 3.9** or later
- be logged in as an admin to Console UI, or using an admin token for the CLI

## Create a rule

You can create a data quality rule from the **Console UI**, or the **Conduktor CLI**.

<Tabs>
<TabItem value="ui" label="Console UI">
todo
</TabItem>
<TabItem value="cli" label="Conduktor CLI">
You can also use the [Conduktor CLI (Command Line Interface)](/gateway/reference/cli-reference/) to create Partner Zones.

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

## Create a policy

You can create a data quality policy from the **Console UI**, or the **Conduktor CLI**.

<Tabs>
<TabItem value="ui" label="Console UI">
todo
</TabItem>
<TabItem value="cli" label="Conduktor CLI">
You can also use the [Conduktor CLI (Command Line Interface)](/gateway/reference/cli-reference/) to create Partner Zones.

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
    conduktor apply -f rule.yaml
    ```
</TabItem>
</Tabs>

## Troubleshoot

todo

## Related resources

todo
