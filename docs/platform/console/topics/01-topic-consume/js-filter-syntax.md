---
sidebar_position: 1
title: JS Filters Syntax Reference
description: Reference Documentation for Topic related pages
---

## Introduction

JS filter is used to filter Kafka records. The filter is evaluated on each record on the server. It's powerful and can handle complex filters, but requires writing JavaScript code.

:::caution
This filter is not the preferred method.  
We recommend that you use the simpler and more performant filters: [Global Search](../consume/#global-search) and [Search in a Specific field](../consume/#search-in-a-specific-field) .
:::caution

The code has to return a boolean.

If your code returns `true`, the record will be included in the results.

Otherwise the record will be skipped.

    return value.totalPrice >= 30;
    // Selects all the orders having a total price superior to or equal to 30

## Record attributes[​](https://docs.conduktor.io/platform/console/consume-data/filter-messages/#accessing-message-attributes)

When creating JavaScript filters, you may want to access message data or the metadata. See the parameters in the table below for accessing different message attributes.

| Attribute           | Types  |
| ------------------- | ------ |
| key                 | Object |
| value               | Object |
| headers             | Object |
| serializedKeySize   | Number |
| serializedValueSize | Number |
| keySchemaId         | Number |
| valueSchemaId       | Number |
| offset              | Number |
| partition           | Number |

## Example filters[​](https://docs.conduktor.io/platform/console/consume-data/filter-messages/#example-filters)

Let's imagine we have the following 2 Records in our topic:

```
Record 1:

{
  "key": "order",
  "value": {
    "orderId": 12345,
    "paid": true,
    "totalPrice": 50,
    "items": [
      {
        "id": "9cb5cb81-b678-4f96-84dc-70096038eca9",
        "name": "beers pack"
      },
      {
        "id": "507b5045-eafd-41a6-afb5-1890f08cfd8e",
        "name": "baby diapers pack"
      }
    ]
  },
  "headers": {
    "app": "orders-microservice",
    "trace-id": "9f0f004a-70c5-4301-9d28-bf5d7ebf238d"
  }
}

Record 2:

{
  "key": "order",
  "value": {
    "orderId": 12346,
    "paid": false,
    "totalPrice": 10,
    "items": [
      {
        "id": "7f55662e-5ba2-4ab4-9546-45fdd1ca60ca",
        "name": "shampoo bottle"
      }
    ]
  },
  "headers": {
    "app": "orders-microservice",
    "trace-id": "1076c6dc-bd6c-4d5e-8a11-933b10bd77f5"
  }
}

```

Here are some examples of filters related to these records:

```
return value.totalPrice >= 30;
// Selects all the orders having a total price superior to or equal to 30

return value.items.length > 1;
// Selects all the orders containing more than one 1 item

return value.orderId == 12345;
// Finds a specific order based in its ID

return !value.paid;
// Selects all the orders that aren't paid

return !headers.includesKey("trace-id");
// Selects all the records not having a trace-id header

const isHighPrice = value.totalPrice >= 30
const moreThanOneItem = value.items.lenght > 1
return isHighPrice && moreThanOneItem
// Selects all the orders having a total price superior to or equal to 30 and having more than one 1 item

```

          