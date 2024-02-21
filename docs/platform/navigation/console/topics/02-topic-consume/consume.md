---
sidebar_position: 1
title: Topic Consume
description: Reference Documentation for Topic related pages
---


- [Configure the Kafka Consumer](#configure-the-kafka-consumer)
- [Filter records](#filter-records)
- [Browse records](#browse-records)
- [Operations](#operations)

:::info
**Checkout our video that presents the most important features of Topic Consume**  

[Filtering and Sorting Techniques for Exploration and Troubleshooting with Console](https://www.youtube.com/watch?v=8fg0VJ3jSFc)
:::info


## Configure the Kafka Consumer

When you access a Topic from the Topic List page for the first time, a consume is automatically triggered with default settings:

-   Show From: `Most recent`
-   Limit: `500 records`
-   Partitions: `All`

This default setup lets you quickly browse through the 500 most recent messages produced in the topic.
![img.png](img/topic-default.png)

There's a good chance this will not correspond to your requirements, so let's explore how you can configure you consumer to give you the records you need.

### Show From

`Show From` defines the starting point for the Kafka Consumer in your topic.

![Capture d’écran 2023-12-12 à 11.05.23.png](img/topic-show-from-choice.png)

The possible values are as follow:

-   `Most Recent` option works differently depending on the **Limit** that you select
    -   With **Number of records** limit (let's say 500), it sets the starting point in your topic backward relative to **Now**, in order to get your the 500 _most recent_ records.
        -   [How Most Recent 500 works?](../most-recent/)
    -   With **None (live consume)**, it simply set the starting point to **Now**. This lets you consume only the messages produced **after** the consumer was started.
-   `Latest Hour`, `Today`, `Yesterday` to start the consumer respectively
    -   60 minute ago,
    -   At the beginning of the day at 00:00:00 (Local Timezone based on your browser)
    -   At the beginning of the day before at 00:00:00 (Local Timezone)
-   `Beginning` to start the consumer from the very beginning of the topic.
-   `Date` and `Timestamp` to start from a specific point in time datetime or an epoch
    -   Date: ISO 8601 DateTime format with offset `2023-12-21T00:00:00+00:00`
    -   Timestamp: Unix timestamp in **milliseconds** `1702312803000`
-   `Offset` to start the consumer at a specific offset. Best when used in conjunction with a single **Partition** setting
-   `Consumer Group` to start the consumer from the last offsets committed by a consumer group on this topic.

### Limit

`Limit` defines when your consumer must stop.

![Capture d’écran 2023-12-12 à 11.06.00.png](img/topic-limit-choice.png)

Possible choices are:

-   `Latest Offset` stop the consumer upon reaching the end of the topic.
    -   ⚠️ The end offsets are calculated when you trigger the search. Records produced after that point **will not appear** in the search results.
-   `None (live consume)` to start a Live Consumer that will look for messages indefinitely
-   `Number of records` stop the consumer after having sent a certain number of records to the browser.
    -   💡 When you have active filters, non-matching records will not count toward this limit.
-   `Date` stop the consumer after reaching the configured date
    -   ISO 8601 DateTime format with offset `2023-12-21T00:00:00+00:00`

### Partitions

`Partitions` lets you restrict the consumer to only consume from certain partitions of your topic. By default, records from **all partitions** are consumed.

![Capture d’écran 2023-12-12 à 11.06.50.png](img/topic-partition-choice.png)

### Key & Value Format

`Key format` and `Value format` lets you force the deserializer for your topic.

![Capture d’écran 2023-12-12 à 11.07.23.png](img/topic-deser.png)

### Automatic Deserializer

This is the default deserializer. **Automatic** infers the correct deserializer in the following order:

-   Schema Registry Deserializers (Avro, Protobuf, Json Schema)
-   JsonDeserializer
-   StringDeserializer
-   ByteDeserializer (fallback)

It also lets you to visualize the binary data in topics `__consumer_offsets` and `__transaction_state`

Automatic deserializer applies independently to each record. If messages have been serialized differently, they will all be presented in the most human readable way.  
The following captures show the same records deserialized using ByteDeserializer, then Automatic Deserializer  
![img.png](img/topic-byte-serdes.png)
![Capture d’écran 2023-12-12 à 11.48.59.png](img/topic-3-deser.png)

#### JSON Deserializer

JSON Deserializer will explicitly fail on records that doesn't match a JSON type.

![Capture d’écran 2023-12-12 à 13.28.57.png](img/topic-json-deser-fail.png)

#### Bytes Deserializer

Bytes Deserializer helps you visualize your records by printing the non-ASCII characters as hexadecimal escape sequences. For instance, the following sequence of bytes:

```undefined
00 00 00 00 07 10 49 27 6D 20 41 56 52 4F
```

corresponding to the [wire format of a Schema Registry AVRO message](https://docs.confluent.io/cloud/current/sr/fundamentals/serdes-develop/index.html#wire-format):

```undefined
00                            0   Magic Byte (0)
00 00 00 07                   1-4 Schema ID (7)
10 49 27 6D 20 41 56 52 4F    5+  serialized AVRO data
```

will be represented like this:

```undefined
\x00\x00\x00\x00\x07\x10I'm AVRO
```

![Capture d’écran 2023-12-12 à 16.04.53.png](img/topic-byte-serdes.png)

## Filter records

Console give you 3 methods to define filters that will be executed on the server and will only return the records that matches. This is a very powerful feature that lets you quickly see the records that matter to you in large topics.

### Global Search

Global Search is the most simple type of filter you can use.

-   Specify whether to look in the Key or in the Value,
-   pick an operator (contains, not contains, equals, not equals)
-   type your search term

:::info
Internally, this will treat the record Key or Value as text to apply the operation (contains, equals, ...).  
This might not be the preferred approach if your record is JSON-ish
:::info

![Capture d’écran 2023-12-13 à 10.07.05.png](img/topic-global-filter.png)

### Search in a Specific Field

You can make your search more fine-grained by activating "Search in a specific field".
![img_1.png](img/topic-search-infield.png)
:::info
Console will generate an autocomplete list by looking at the most recent 50 messages in the topic. If the key you're looking for is not here, you can type it manually.  
Examples:  
`data.event.name`  
`data.event["correlation-id"]`  
`data.clientAddress[0].ip`  
:::info
### JS Search

If you need to construct more advanced filters, you can switch to the advanced view and use plain Javascript to build your filter.  
Check this article on [JS Filters syntax](../js-filter-syntax/) to get examples and syntax around this filter.
:::caution
While it is the option that can potentially address the most complex use-cases, it is not the recommended or the fastest one.
:::caution

### Statistics pop-up

While the consumer is processing, you will see the following statistics window.

This little window present the necessary information to let you decide wether it's worth pursuing the current search or if you should rather refine it further.

Here's how to read it.
![img.png](img/topic-stats-info.png)

## Browse records

### From the main table
Once the search starts, you will see messages appearing in the main table. The table has 3 columns: Timestamp, Key and Value.  
:::info
Note that the Timestamp column takes the **local timezone** of the user.  
For example, if you are producing a message from Dublin, Ireland (UTC+1) at `14:57:38 local time`, and you then consume this message from your browser (in Dublin), you will see `14:57:38`.  
However, if another user consumes the same message in Console but from Paris, France (UTC+2), they will see `15:57:38`.  
Please be aware that this isn't a mistake from Kafka itself, you are simply seeing messages displayed in your local timezone.  
:::info

### Individual records
Upon clicking on a record from the list, a side bar will open on the right to display the entire record.
:::info
Use the arrow keys to navigate between messages: ⬆️ ⬇️
:::info
There are 3 tabs at the top to display different elements of your record: Data, Headers and Metadata.
![img_2.png](img/topic-browse.png)
### Data tab

The Data tab lets you visualize your record's Key and Value.

If your record Value is serialized with JSON or using a Schema Registry it is presented by default using the Table view. You can also switch to the JSON view if necessary.
![img_3.png](img/topic-browse-json-table.png)
The 2 views have different features associated.

#### Table View

The table view lets you visualize your message field by field and also gives you the possibility to restrict your search further by applying more filters on individual fields. Filter types are Include and Exclude.

Filters are available for:

-   **string **fields
-   **number** fields
-   **bool** fields

but disabled for:

-   **null** fields
-   fields contained within **lists**

#### JSON View

The JSON view lets you visualize your message , the "Enable JQ" toggle lets you create a different projection your record value.

The basic syntax lets you focus on sub-elements of your record, as shown in the screenshot below.

```undefined
{ foo: .bar }  // Renders {"foo": "value of .bar"}
.meta.domain // Renders a single String
{ id, meta } // Renders a new JSON with both elements
```
![img_4.png](img/topic-browse-json.png)
Check the [JQ Syntax Reference](https://jqlang.github.io/jq/manual/#object-construction) for more advanced use-cases.

### Headers tab

The headers tab show you all the headers of your Kafka record, and lets you find more messages with the same header value, using the funnel icon.
![img_5.png](img/topic-header-funnel.png)
The resulting filter will be created:
![Capture d’écran 2024-01-12 à 12.12.14.png](img/topic-header-filter.png)
:::caution
While Kafka header values are internally stored as `byte[]`, Console uses StringDeserializer to display and filter them.  
If your producer doesn't write header values as UTF8 String, this tab might not render properly, and header filter might not work as expected.
:::
### Metadata tab

The metadata tab gives you all the other information regarding your record that could be useful under certain circumstances. The informations presented are as follow:

-   Record Partition
-   Record Offset
-   Record Timestamp
-   The Key and Value Serializer inferred by the [Automatic Deserializer](#automatic-deserializer)
-   Key Size and Value Size (how it's serialized on the broker)

![Capture d’écran 2024-01-12 à 12.15.34.png](img/topic-metadata.png)

## Operations

### Export Records in CSV & JSON

You have the ability to export the records in either JSON or CSV format.

CSV particularly useful in particular because you can use Console to re-import them either in a new topic or in the same topic after having modified them (or not)
![img_5.png](img/topic-export.png)
The resulting files will look like this:
![img_5.png](img/topic-export-result.png)
### Reprocess Record

This feature lets you pick a record from the list and reprocess it either in the same or in a different topic, while letting you change its content beforehand.

Upon click the Reprocess message **(1)**, you will be asked to pick a destination topic **(2)**, and then you will end up on the produce tab with your message pre-filled. From there you can either Produce the message directly or make adjusments before **(3)**.
![img_6.png](img/topic-reprocess.png)
### Save & Load Filter Templates

If you are regularly using the same set of Consume Configuration (Show From, Limit, ...) and Filters, you can save your current view as a template for reuse.

Save icon button will prompt you to enter a name to your template:
![img_7.png](img/topic-template-save.png)
And the Load icon button will present you with the available template and you can choose to Load one:
![Capture d’écran 2024-01-12 à 14.13.49.png](img/topic-template-load.png)


          