---
sidebar_position: 3
title: Filter Messages
description: Use simple filters or JavaScript filters in Conduktor Console.
---

There are numerous mechanisms to help you drill down into a topic to find specific messages.

 - [Standard Filters](#standard-filters)
 - [Custom Filters](#custom-filters)
 - [JavaScript Filters](#javascript-filters)

## Standard Filters

By default, the most recent 500 records are displayed from a topic. However, there are multiple filters available for customizing the results displayed in the topic consume view. 

| Filter | Description |
|:-------:|:-------:|
| Show From | **Time-based** or **offset-based** filter for determining where to start consuming from. |
| Limit | **Time-based** or **offset-based** filter for determing where to limit consumption. Choose 'None (live consume)' for **live consumer mode**.  |
| Partitions | Choose all partitions or specific partition(s) to consume from. |

![Format Data](/img/console/console-standard-filter.png)

## Custom Filters

Console provides a powerful mechanism for filtering on the message **key** and **value**. From within the topic consume view, select **Add filter** to create a new custom filter.

Note you have an array of different operators to build your filter conditions. You can also add multiple filters in parallel to facilitate more advanced filtering requirements. 

:::tip
Toggle **search in a specific field** to directly select a field that is derived from a sample of your messages.
:::

![Format Data](/img/console/console-custom-filter.png)

## JavaScript Filters

JavaScript filters let you perform complex searches on the JSON representation of your kafka record and its metadata.  

Although we recommend using [custom filters](#custom-filters), we acknowledge that JavaScript may be preferable for some users or when there are advanced filtering requirements.

 - [Create a Javascript filter](#create-a-javascript-filter)
 - [Accessing message attributes](#accessing-message-attributes)
 - [Example filters](#example-filters)

### Create a JavaScript filter

- From within the consumer view, select **Add filter** and choose **advanced** from within the filter modal.

![Format Data](/img/console/console-js-1.png)

- Use the **code editor** to write your JavaScript filter before hitting **Apply**

![Format Data](/img/console/console-js-2.png)

### Accessing message attributes

When creating JavaScript filters, you may want to access message data or the metadata. See the parameters in the table below for accessing different message attributes.

| Attribute | Types |
|---|---|
| key | String | Number | Object |
| value | String | Number | Object |
| headers | Object |
| serializedKeySize | Number |
| serializedValueSize | Number |
| keySchemaId | Number |
| valueSchemaId | Number |
| offset | Number |
| partition | Number |

### Example filters

Let's imagine we have the following 2 Records in our topic:

```json
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

```js
return value.totalPrice >= 30;
// Selects all the orders having a total price superior to or equal to 30
```

```js
return value.items.length > 1;
// Selects all the orders containing more than one 1 item
```

```js
return value.orderId == 12345;
// Finds a specific order based in its ID
```

```js
return !value.paid;
// Selects all the orders that aren't paid
```

```js
return !headers.includesKey("trace-id");
// Selects all the records not having a trace-id header
```

```js
const isHighPrice = value.totalPrice >= 30
const moreThanOneItem = value.items.lenght > 1
return isHighPrice && moreThanOneItem
// Selects all the orders having a total price superior to or equal to 30 and having more than one 1 item
```

