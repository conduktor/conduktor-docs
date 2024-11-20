---
date: 2024-11-20
title: Chargeback
description: docker pull conduktor/conduktor-console:1.29.0
solutions: console
tags: features,fix
---


import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking Changes 💣](#breaking-changes-)
  - [Changes to Conduktor.io Labels](#changes-to-conduktorio-labels)
- [Features ✨](#features-)
  - [Conduktor Chargeback](#conduktor-chargeback)
  - [Console Homepage](#console-homepage)
  - [Consumer Group pages overhaul](#consumer-group-pages-overhaul)
  - [Self-Service Topic Catalog visibility](#self-service-topic-catalog-visibility)
  - [Self-Service New Topic Policy Allowed Keys](#self-service-new-topic-policy-allowed-keys)
  - [More Audit Log CloudEvents into Kafka](#more-audit-log-cloudevents-into-kafka)
- [Quality of Life improvements](#quality-of-life-improvements)
- [Fixes 🔨](#fixes-)

## Breaking Changes 💣

### Changes to Conduktor.io Labels

We have moved the `conduktor.io` labels previously available on **Connector** and **Topic** resources to new locations. 
:::caution
This change impacts you if you:
- Update the Topic Catalog description of Topic resources via CLI/API.
- Configure Connect automatic restart with the CLI/API.

You are not impacted if you perform these actions through the UI.
:::
We recognize this change breaches the API contract and have carefully considered its implications. Despite this, we’ve opted to move forward **without creating new API versions** to deliver a more consistent and sustainable experience.

As we expand the number of Conduktor-related features, this change enables a **cleaner separation** between:
- Labels used for sorting and filtering throughout the product
- Conduktor-specific annotations used to drive behaviors on the resources

This separation reduces the risk of conflicts, simplifies resource management, and provides flexibility for future improvements.

Topic Resource
- `metadata.labels.'conduktor.io/description'` → `metadata.description`
- `metadata.labels.'conduktor.io/description.editable'` → `metadata.descriptionIsEditable`

Connector Resource
- `metadata.labels.'conduktor.io/auto-restart-enabled'` → `metadata.autoRestart.enabled`
- `metadata.labels.'conduktor.io/auto-restart-frequency'` → `metadata.autoRestart.frequency`

Their associated values have been **automatically migrated** under the new names.


#### Important Note for CLI Users

Applying YAML files with old `conduktor.io` labels will **fail** in Conduktor Console 1.29. Be sure to update your YAML files to reflect the new labels.

Example error for outdated YAML:
```
$ conduktor apply -f topic.yaml
Could not apply resource Topic/click.event-stream.avro: Invalid value for: body (Couldn't decode key. at 'metadata.labels.conduktor.io/description')
```



## Features ✨

***

### Conduktor Chargeback

***

### Console Homepage
The cluster homepage have been redesigned to present you with the most useful information in one single frame:
- The health of your Kafka Cluster with a few key metrics and graphs
- The state of Console Indexing modules for this Kafka Cluster
- Quick access to your most recently viewed resources
![Kafka Connect Wizard](/images/changelog/platform/v29/console-homepage.png)

### Consumer Group pages overhaul

We have redesigned Consumer Group pages to simplify troubleshooting.
Consumer group details page now have 2 tabs to help understand the status of your Consumer Group:
- Topics first tab lets you understand the lag of the consumer group by Topic. 

***

### Self-Service Topic Catalog visibility

You can now choose which Topics should be visible in the Topic Catalog by annotating their YAML
````yaml
---
apiVersion: kafka/v2
kind: Topic
metadata:
  cluster: shadow-it
  name: click.event-stream.avro
  catalog:
    visibility: PUBLIC # or PRIVATE
    description: | 
      multi
      line
      desc
    description-editable-in-ui: true
  catalogVisibility: PUBLIC # or PRIVATE
spec:
  ...
````

It is also possible to change the default Topic Catalog visibility of all Topics of an Application Instance directly
Check the associated [documentation](/platform/reference/resource-reference/self-service/#application-instance)

### Self-Service New Topic Policy Allowed Keys
We have added a new constraint `AllowedKeys` to our Self-Service Topic Policy that restricts the properties that can be configured on a Topic.  
This works in conjunction with existing constraints and ensures your Application Teams will only define properties that are allowed by the Central Team.
Read more about our [Topic Policy constraints](/platform/reference/resource-reference/self-service/#policy-constraints)

***

### More Audit Log CloudEvents into Kafka

We have made more events available for the Audit Log Publisher:
- IAM.User.Logout
- IAM.User.Login
- Kafka.ConsumerGroup.Duplicate
- Kafka.ConsumerGroup.Delete
- Kafka.ConsumerGroup.Update ( when we reset the offset of the consumer group )

A full list of all the exported audit log event types is published on the [Audit Log](/platform/navigation/settings/audit-log/#exportable-audit-log-events) page.


***

## Quality of Life improvements
- Improved the performance of the Automatic deserializer
- Improved the performance of the Schema Registry indexing process
- Added support for Google Cloud Identity group claims



## Fixes 🔨
- Fixed an issue where the ManageClusters permission wasn't working properly
- Fixed an issue that prevented to create a KafkaCluster and a Topic on that newly declared KafkaCluster in a single CLI apply
- Fixed `/health/readiness` endpoint to return HTTP 503 when Postgres DB is down
- Fixed an issue where the Message Count wasn't updated to 0 when emptying a topic
- Fixed an issue where the Pause/Resume button wasn't visible when a connector was in Failed state