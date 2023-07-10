---
sidebar_position: 1
title: Browse Data
description: The Conduktor Platform enables you to view messages in your Kafka Topics.
---

# Browse Data

## Overview 
The Conduktor Platform enables you to view messages in your Kafka Topics.

In the example below, the topic **_wikipedia.parsed_** is selected. 

After selecting a topic, you can **format** the message to keep only the fields you need, **filter** your records according to multiple criteria, and also manually decide on the **deserialisation** formats for the messages key and value.

<img width="1792" alt="image" src="https://user-images.githubusercontent.com/81160538/212052836-71c9826d-275b-4576-a8dc-957ed468eaff.png" />




:::info
Each feature is built on top of each another, and the ordering in which they are executed could matter.  
1. Kafka filters (Show From, Partition)
2. Deserialization
3. JS Filters
4. Max Results (Except for Show From Most Recent where the JS Filter is applied after polling the X most recent)
5. Quick Search
6. Formatting  

This means that if you set a Kafka filter to `From Beginning`, `Max Record 1000` and apply a **JS Filter**, it will consume all the records from the topic until either:
1. The topic runs out of records
2. 1000 records match your JS filter
:::

> **_NOTE:_**  The time and date shown on Conduktor Console is taken from the local timezone of the user in question.
> For example if you are producing a message from Dublin, Ireland Time (UTC+1) at 14:57:38 local , and then you consume this message from your browser (from Dublin), you will see 14:57:38.
> If another user consumes the same message from Conduktor Console but from Paris, France Time (UTC+2), he/she will see 15:57:38

![image (14)](https://github.com/conduktor/conduktor-docs/assets/81160538/8b739672-8959-443a-9e79-31d5dba825cf)
User consuming one message from Dublin,Ireland.

![image (15)](https://github.com/conduktor/conduktor-docs/assets/81160538/e6c9b34c-dd19-4125-8860-ce64fe363bcd)
User consuming same message but from Paris, France.

>  Please be aware that this isnt a mistake from Kafka itself but the fact that you are seeing messages in your local timezone.

**Jump to:**
- [Formatting](#formatting)
- [Filtering](#filtering)
- [Deserialization](#deserialization)
- [Exporting Data](#exporting-data)


## Formatting
You can format your message as long as it has a JSON-compatible representation (Including Avro and Proto with Schema Registry).  
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

## Filtering

You can filter your search according to multiple criteria including:

- the time/date or specific offset in "**Show from**"
- the amount of records to display in "**Max results**"
- two separate filtering options, "**Quick search**" and JavaScript using "**Add JS Filter**".
- choose the exact partition to view messages on in "**Partitions**"

By default, the most recent 20 messages of a topic are displayed and all filters are persisted across sessions for each topic.

### Show From

Positions the consumer any given point in time, returning up to `max-records` records to the browser.

<img width="1792" alt="image" src="https://user-images.githubusercontent.com/81160538/212060432-df2a176f-4de9-4c92-9648-7d01178395db.png" />

- **Most Recent**: Consume from the end of the topic to always provide you with the `max-records` most recent records.
  - Each partition is queried equally: Most recent 1000 records in a 5 partitions topics: 200 most recent records of each partition
- **Last Hour / Today / Yesterday**: Starts from a relative time in the past
- **From Specific Date / From Timestamp**: Starts from an absolute time in the past
- **From Beginning**: Starts from the very beginning of the topic
- **From Offset**: Starts from a specified offset (best used combined with [Partitions](#partitions))
- **From Consumer Group**: Starts from the last committed offsets of selected Consumer Group.
  - This is very useful to troubleshoot a stopped application and understand "where" it's stopped.

### Max Results

This filter allows you to change the number of record returned to the browser. You can increase that number from 1 up to a maximum of 5000 records.
These are the records on which you will search when using the "Quick Search" filter.

<img width="1792" alt="image" src="https://user-images.githubusercontent.com/81160538/212128328-7f89c0fe-08c9-46eb-b82e-de52ca085f8d.png" />

### Partitions

If you know the partition you want to browse, this filter will help you reduce the number of records returned to the browser. This filter is available behind the "More options" button.

<img width="1792" alt="image" src="https://user-images.githubusercontent.com/81160538/212129932-563138e6-3a8f-4e04-8b8a-18238495c3bb.png" />

### JS Filters

Using JavaScript Filters lets you perform complex searches on the json representation of your kafka record, including its metadata.  
This lets you search through several thousand records without directly viewing them in your browser.  
This is the recommended way to filter through topics with more than several thousand records per day.

<img width="1792" alt="image" src="https://user-images.githubusercontent.com/81160538/212131081-6b12deb0-39af-4c34-98f7-a950ac6ae4b7.png" />

From the example above:

```js
// Returns records which have a timestamp field equal to 1673541484
return value.timestamp == 1673541484;
```

A few other examples, let's imagine we have the following 2 Records in our Topic:

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

Please check the embedded documentation in Conduktor Platform for further details.

### Quick search

<img width="1792" alt="image" src="https://user-images.githubusercontent.com/81160538/212137236-92fddc6b-10a6-496e-9bfc-1dd8409586cb.png" />

This filter performs a plaintext search on the records already sent to the browser.
It is best used combined with any previous filtering applied.

In the example above, filtering by using 1673541484 and we can see the records that correspond to this within the 20 "Max Results".

## Deserialization

By default, we try to identify the Deserializer automatically for both the Key and the Value.

If the deserialization fails or doesn't represent the data as you expect, you can manually pick which deserializer to use.

<img width="1792" alt="image" src="https://user-images.githubusercontent.com/81160538/212128823-76a9384d-d37d-4c34-b7a8-e704330903c9.png" />

Deserializers are available behind the "More options" button.

## Exporting Data

Since Conduktor 1.15.0, data can be exported from the consumer view. Data can be exported in formats:

  - **CSV**
      - Exported with the **schema**: timestamp, partition, offset, key, value

  - **JSON**
      - Exported as [JSON lines](https://jsonlines.org/)

To export data, click the breadcrumb from within the table and choose the desired export format. All results that are loaded within the Conduktor UI will be exported.

![Create a connector](/img/console/console-export.png)
