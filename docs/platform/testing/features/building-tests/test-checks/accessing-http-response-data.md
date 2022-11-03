---
sidebar_position: 2
title: Accessing Http response data
description: When you do Http calls, you may need to access the data for checks,
---

# Accessing Http response data

When you do Http calls, you may need to **access the data for checks**.&#x20;

:::info
Looking for how to access or extract the **previous** task data ? Here is the [documentation](../chaining-tasks#accessing-the-output)
:::

For example:

- to validate if an attribute inside a JSON response is correct
- to validate the status code of the response

There are two methods of selecting data for a check:

- Field selection (JSON Query)
- JavaScript

The below table indicates the different object identifiers that can be used to access attributes.

_Note the information you are able to access depends on the task you are making the check on._

## Http Call

It's possible to make checks on the metadata collected when you produce to Kafka.

| Attribute | Type            | How to access: Field selection (JQ) | How to access: JavaScript    |
| --------- | --------------- | ----------------------------------- | ---------------------------- |
| Body      | User-defined    | .httpResponse.body                  | context.httpResponse.body    |
| Code      | User-defined    | .httpResponse.code                  | context.httpResponse.code    |
| Headers   | {key, value}\[] | .httpResponse.headers               | context.httpResponse.headers |

---
