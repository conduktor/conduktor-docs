---
sidebar_position: 1
title: Consume Overview
description: The Conduktor Platform enables you to view messages in your Kafka Topics.
---

# Consume Overview

Console enables you to view messages in your Kafka Topics.

In the example below, the topic **wikipedia.parsed** is selected. 

After selecting a topic, you can **[format](../format-data)** the message to keep only the fields you need, **[filter](../filter-messages)** your records according to multiple criteria, and also manually decide on the **[deserialisation](../deserialization)** formats for the messages key and value.

![Format Data](/img/console/console-consumer.png)


### Message DateTime
 
:::info 

Note that the date and time shown on Console is taken from the local timezone of the user in question.

For example, if you are producing a message from Dublin, Ireland Time (UTC+1) at 14:57:38 local , and you then consume this message from your browser (in Dublin), you will see 14:57:38.

If another user consumes the same message from Console but from Paris (France Time (UTC+2)), they will see 15:57:38.

Please be aware that this isnt a mistake from Kafka itself but the fact that you are seeing messages in your local timezone.
:::

// REFACTOR BELOW CONTENT OR REMOVE REDUNDANT INFORMATION //
// REFACTOR BELOW CONTENT OR REMOVE REDUNDANT INFORMATION //

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


## Deserialization

By default, we try to identify the Deserializer automatically for both the Key and the Value.

If the deserialization fails or doesn't represent the data as you expect, you can manually pick which deserializer to use.

<img width="1792" alt="image" src="https://user-images.githubusercontent.com/81160538/212128823-76a9384d-d37d-4c34-b7a8-e704330903c9.png" />

Deserializers are available behind the "More options" button.
