---
title: Using environment variables
description: How to reference environment variables from the scenario editor view.
---
# Using environment variables

Once you have configured environment variables in your workspace, you can reference them in test scenarios. The below details how to reference environment variables from the scenario editor view.

There are multiple ways of referencing environment variables, depending on the [custom input](../custom-inputs) you are using.

- [Field selection (JSON Query)](using-environment-variables#field-selection-json-query)
- [Template selection (Mustache)](using-environment-variables#template-selection-mustache)
- [JavaScript](using-environment-variables#javascript)

## Field selection (JSON Query)

You may reference an environment variable in an input field of type **Field selection (JQ)**.

To do this, you should use the syntax:

`.env.<variable name>`

For example, produce a JSON message value using the below example:

```
{
    "sessionId": "b885d9a3-de57-4b75-bbcf-29df19362642"
}
```

In the consumer task, you could create a check to validate if the `sessionId` in the record equals the value specified in an equal environment variable:&#x20;

_Note to resolve your variable correctly, you **must have an environment selected!**_

![](<../../assets/image (146).png>)

## Template selection (Mustache)

It's also possible to access environment variables if you are using the **Template (mustache)** input type.&#x20;

In this case, you will be provided a helper modal when clicking the **'+'** button.

Within this modal, select from an available list of environment variables.

![](<../../assets/image (118) (1).png>)

## JavaScript

You can access environment variables via the JavaScript input selection.

To do this, you should use the below syntax:

`context.env.`<`variable name>`

![](<../../assets/image (105).png>)
