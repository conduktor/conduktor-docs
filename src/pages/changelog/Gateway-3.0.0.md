---
date: 2024-03-20
title: Targeted interceptors, enhanced data quality, CEL message filtering and more! 
description: docker pull conduktor/conduktor-gateway:3.0.0
solutions: gateway
tags: fix
---

Submit your feedback to us via our [public roadmap](https://product.conduktor.help/?utm_source=changelog&utm_medium=webpage&utm_campaign=).

Visit our [Get Started docs](https://docs.conduktor.io/gateway/?utm_source=changelog&utm_medium=webpage&utm_campaign=) page to learn more and how to try our latest version of Conduktor or [chat with the team](https://www.conduktor.io/contact/sales/?utm_source=changelog&utm_medium=webpage).

`docker pull conduktor/conduktor-gateway:3.0.0`

- [Features](#features)
	- [Interceptor Targeting](#interceptor-targeting)
	- [Data Validation Across Fields](#data-quality-validation-rules-across-fields-using-cel)
	- [Filter Messages on Topics](#filter-messages-on-topics-using-cel)
	- [Topic Multiplexing Enhancements](#topic-multi-plexing-enhancements)
	- [Alias Topic Enhcancements](#alias-topic-enhancements)
	- [Default Vcluster Enhancements](#default-vcluster-rework)
- [General Fixes 🔨](#general-fixes-🔨)


This major release of the Gateway brings functionality around targeting your interceptors more specifically, adding additional data quality & filtering tools and a host of rework under the hood for improved reliability & robustness. This can be seen in the form of reworked authorization to more closely align with what you're used to in the existing Kafka world and a more intuitive experience when working with the enhanced functionality Conduktor brings in concentrated and alias topics.

## Features

### Interceptor Targeting

Interceptors can now target more specifically than the previous scopes of vcluster and username. They can now be targeted at the global, vcluster, group(**new**), or service account level. Below are some areas and examples where targeting interceptors brings great power in their flexibility.


#### Apply interceptors on groups, across several service accounts, without duplicating the interceptor

On a given Kafka cluster, each application may have different policy requirements.

Applications could be part of an organization's domain (finance, HR, Sales, etc.) or grouped by another dimension, such as data sensitivity.
Platform teams will want to manage rules that apply to multiple applications at a "group" level.

#### Override behavior at a more specific service account, or group level

Rather than apply interceptors across a wider domain, they may want to zoom in and target a specific application to override the wider defaults.

Examples: 

A project from a domain is more advanced and doesn't need the safeguarding protections applied to the wider group.
* They know how to size topics correctly and are allowed a higher limit on partitions for topic creation, than the rest of the group
* Everyone is required to have compression enforced by default, but for this specific team they are allowed to remove it to meet a low latency requirement

### Data quality validation rules across fields, using CEL

Validate data across fields using [Common Expression Language](https://github.com/google/cel-spec). Before we could define rules for fields within a schema, a great way to ensure data quality catching the data before it hits the cluster. Now, we can relate fields to each other. We can bring together data quality and business rules within our schema. 

An example for age and email checks in our schema:

```json
{
  "fields": [
    {
      "name": "age",
      "type": "int",
      "minimum": 18
    },
    {
      "name": "email",
      "type": "string",
      "format": "email"
    }
  ],
  "metatadata": {
    "rules": [
      {
        "name": "old people",
        "expression": "age >= 40 && email.endsWith('yahoo.com')",
        "message": "yahoo.com emails are allow only for people older that 40"
      }
    ]
  }
}
```

### Filter messages on topics, using CEL

Topic filtering can now be done with a simple plugin rather than building yet another pipeline. Effortlessly tailor message filtering rules to your use cases, ensuring only the most relevant data reaches your consumers.

Similar to how we allow you to filter data using SQL, you can now use CEL. 
By leveraging CEL expressions, you gain the flexibility to filter messages based on various attributes such as record key, value, partition, timestamp, header, and offset, offering unparalleled control over your data consumption.

Suppose you want to filter messages where the timestamp is greater than a certain threshold and the record key matches a specific pattern. With the enhanced CEL topic filtering feature, achieving this becomes straightforward as posting a plugin with the config:

```json
{
  "virtualTopic": "your-topic-name",
  "expression": "record.timestamp > 1616400000000 && record.key.startsWith('prefix_')"
}
```

### Topic multiplexing enhancements

Several enhancements have been made when working with concentrated topics for topic multiplexing.
Concentration can now be achieved on the default vcluster, `passthrough`.
UX has been adjusted from using patterns only in favor of **concentration rules**, which have a dedicated part of the API.

### Alias topic enhancements

Alias topics (dedicated to referencing another topic within your cluster, see the docs for more) have been reworked for a more intuitive experience.
Alias topics no longer replace the physical topic during interactions, but are seen as another topic.
This will help in use cases related to migration, when applications use different topic names, and when exposing more topics within vclusters.

### Default vcluster rework

The default vcluster, `passthrough`, now has users associated with it by default rather than being rejected. This behavior can be reverted through configuration; see the docs for more.

## General fixes 🔨

* Fixed an issue that was prefixing consumer group names with Gateway in certain virtual clusters
* Simplified the security protocol experience, dropping the need for `GATEWAY_MODE`(s) to be defined, instead using Kafka standard security protocols or `DELEGATED` security protocols. Refer to the docs for more
* Less noisy metrics
* Configuration topics are now prefixed with the clusterID to prevent unintentional
* The PUT HTTP verb is now supported throughout the API
* ARM build is now available for the distro and distro-less images, to provide more flexibility to your deployment machine choices

