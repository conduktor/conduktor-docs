---
date: 2024-11-20
title: Chargeback
description: docker pull conduktor/conduktor-console:1.29.0
solutions: console
tags: features,fix
---


import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

## Breaking Changes 💣
### Changes to Condukor labels
We have moved the `conduktor.io` labels that were available on Connector and Topic resources.  
As we are increasing the number of Conduktor-related behaviors, we believe this change will
allow for a cleaner separation between user labels and Conduktor behaviors we want to add on to resources.  

Impacted labels:
- Topic
  - `conduktor.io/description` moved to `metadata.topicCatalog.description`
  - `conduktor.io/description.editable` moved to `metadata.topicCatalog.`
- Connector
  - `conduktor.io/auto-restart-enabled` moved to `metadata.autoRestart.enabled`
  - `conduktor.io/auto-restart-frequency` moved to `metadata.autoRestart.frequency`

Their associated values have been automatically migrated under their new names.

<Tabs>
<TabItem value="Before">

````yaml
---
apiVersion: v2
kind: Topic
metadata:
  name: click2.event-stream.avro3
  cluster: local
  labels:
    domain: clickstream
    app-code: CLK
    conduktor.io/description: |
      # Click Event Stream
      Long description
    conduktor.io/description.editable: false
spec:
  ...
---
apiVersion: kafka/v2
kind: Connector
metadata:
  name: my-connector-instance
  cluster: julien-cloud
  connectCluster: superconnect
  labels:
    conduktor.io/auto-restart-enabled: "true"
    conduktor.io/auto-restart-frequency: "6000"
spec:
  ...
````

</TabItem>
<TabItem value="Now">

````yaml
---
apiVersion: v2
kind: Topic
metadata:
  name: click2.event-stream.avro3
  cluster: local
  labels:
    domain: clickstream
    app-code: CLK
  topicCatalog:
    description: |
      # Click Event Stream
      Long description
    descriptionEditable: false
spec:
  ...
---
apiVersion: kafka/v2
kind: Connector
metadata:
  name: my-connector-instance
  cluster: julien-cloud
  connectCluster: superconnect
  autoRestart:
    enabled: true
    frequency: 6000
spec:
  ...  
````

</TabItem>
</Tabs>

Apply yaml files that with `conduktor.io` labels will fail in Console 1.29. Make sure you change your yaml accordingly.
````
$ conduktor apply -f topic.yaml
Could not apply resource Topic/click.event-stream.avro: Invalid value for: body (Couldn't decode key. at 'metadata.labels.conduktor.io/description')
````


- [Features ✨](#features-)
  - [Conduktor Chargeback](#conduktor-chargeback)
  - [Console Homepage](#console-homepage)
  - [Consumer Group pages overhaul](#consumer-group-pages-overhaul)
  - [Self-Service Topic Catalog visibility](#self-service-topic-catalog-visibility)
  - [Self-Service New Topic Policy Allowed Keys](#self-service-new-topic-policy-allowed-keys)
  - [More Audit Log CloudEvents into Kafka](#more-audit-log-cloudevents-into-kafka)
- [Quality of Life improvements](#quality-of-life-improvements)
- [Fixes 🔨](#fixes-)

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