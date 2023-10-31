---
sidebar_position: 4
title: Formatting Data (JQ)
description: Export data from Conduktor Console.
---

You can format your Kafka messages so long as they have a JSON-compatible representation (Including Avro and Proto with Schema Registry). Conduktor uses [jq](https://jqlang.github.io/jq/manual/) to create projections over your Kafka data. 

This can be advantageous if you wish to view only select fields in larger messages. 

- From within the consumer view, select a message and toggle the `JSON` view
- Ensure jq is enabled, and add your filter to the input

![Format Data](/img/console/console-jq.png)

## Simple projections

Given a sample message like the following one:

```json
{
  "foo": {
    "bar": "value"
  }
}
```
You can use the following JQ filter on your message:
```json
.foo
// will output
{
  "bar": "value"
}

.foo.bar
// will output
"value"
```

## Advanced projections

Other useful examples include:
```json
// Subset
.data.authorizationInfo

// New JSON from elements
{ id: .source, val: .specversion }

// Functions
.data.authenticationInfo.principal | split(":")[1]

// Concat
.data.authenticationInfo.principal + " granted " + .data.authorizationInfo.operation

// Filter 
[3, 2, 1] | first
```
Check the [JQ Manual](https://stedolan.github.io/jq/manual/) for more details.  