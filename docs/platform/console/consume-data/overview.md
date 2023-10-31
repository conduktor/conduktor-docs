---
sidebar_position: 1
title: Consume Overview
description: The Conduktor Platform enables you to view messages in your Kafka Topics.
---

# Consume Overview

Console enables you to view messages in your Kafka Topics.

In the example screenshot below, the topic **wikipedia.parsed** is selected. 

After selecting a topic, you can **[format](../format-data)** the message to keep only the fields you need, **[filter](../filter-messages)** your records according to multiple criteria, and also manually decide on the **[deserialisation](../deserialization)** formats for the messages key and value.

![Format Data](/img/console/console-consumer.png)


### Message DateTime 

:::info
Note that the date and time shown on Console are taken from the **local timezone** of the user.
:::

For example, if you are producing a message from Dublin, Ireland Time (UTC+1) at 14:57:38 local , and you then consume this message from your browser (in Dublin), you will see 14:57:38.

However, if another user consumes the same message in Console but from Paris (France Time (UTC+2)), they will see 15:57:38.

Please be aware that this isnt a mistake from Kafka itself, you are simply seeing messages displayed in your local timezone.

