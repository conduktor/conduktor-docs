---
sidebar_position: 1
title: How Most Recent 500 works?
description: Reference Documentation for Topic related pages
---

When you first land on a topic consume page, the default search is configured with **Most Recent 500 messages.**

:::tip WHY
The intention is to show you the most relevant messages, split across the partitions. This algorithm guarantees to return some messages irrespective of **when** the records were produced, which we believe is a good starting point when browsing a topic for the first time.
:::

:::info HOW
In most cases, it will give you `500 / num_partitions` messages, per partition.  
If your topic has:  
**10** partitions, Most Recent **500** will give you **50** messages per partition.  
**2** partitions, Most Recent **500** will give you **250** messages per partition.  

Edge cases might occur and the algorithm will account for it seamlessly.  
See image below 👇  
:::

import MostRecent500 from './img/most-recent-500.png'

<img src={MostRecent500} alt="Most recent 500 explained" style={{ width: 600, display: 'block', margin: 'auto' }} />

:::caution
Most Recent N messages doesn't work well with filters. This is because the filters will only be applied to those 500 messages instead of a large number of records. Prefer switching to a time-based ShowFrom when using filters
:::
