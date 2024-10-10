---
date: 2024-10-14
title: Conduktor SQL
description: docker pull conduktor/conduktor-console:1.28.0
solutions: console
tags: features,fix
---

- [Features ✨](#features-)
  - [Conduktor SQL](#conduktor-sql)
  - [Shareable Filters](#shareable-filters)
  - [Tags becomes Labels](#tags-becomes-labels)
  - [Audit Log events into Kafka](#audit-log-events-into-kafka)
  - [Quality of Life improvements](#quality-of-life-improvements)
- [Fixes 🔨](#fixes-)

## Features ✨

### Conduktor SQL
TODO

### Monitoring improvements
We are migrating our Monitoring dashboards into their respective resource pages.  
This migration will happen over the next few releases with our objective to remove the existing generic Monitoring pages:
- Overview will be refactored into Home page
- **Cluster Health** dashboards and alerts will move under Brokers page
- **Topic monitoring** will be integrated with Topics page
- Apps monitoring will be integrated with Consumer Groups pages
- Alerts will be integrated as tabs in all the resource pages, similar to the recent changes Kafka Connect

For this release 1.25.0, we are migrating **Cluster Health** and **Topic monitoring** pages.

#### Brokers page
The charts and alerts are now available under the Brokers page with cleaner graphs 
We have removed two metrics that were not possible to calculate correctly since the removal of JMX integration back in release 1.15 (May 2023)
- Active Controller Count
- Unclean Leader Election

![Kafka Connect Wizard](/images/changelog/platform/v28/topic-monitoring.png)

#### Topic Monitoring
The 3 existing graphs have been moved on the Topic details and we added a new graph to track the number of records in the topic.  

![Kafka Connect Wizard](/images/changelog/platform/v28/topic-monitoring.png)

#### New Alerts

As part of this improvement, we have also reworked our alert definitions to pave the way to declaring Alerts via API or CLI.

````yaml
---
apiVersion: console/v2
kind: Alert
metadata:
  name: my-alert
  cluster: local-julien
spec:
  type: TopicAlert
  topicName: wikipedia-parsed-DLQ
  metric: MessageCount
  operator: GreaterThan
  threshold: 0
````

Starting today, we recommend you use the new alerts for Broker and Topic pages.

:::caution Deprecation notice
**We do not plan to migrate existing alerts to the new Alert model.**  

We plan to remove those original alerts in the near future in favor of the new ones.  
We'll let you know a few releases in advances.

If you have a large number of alert and need some help, please get in touch with our support as soon as possible.
:::



### Shareable Filters
To increase collaboration between users we've made filters in the Topic view shareable. 
After you've finished configuring filters on a topic, you now have an option to save the filter either as a Private or Organization filter.  
![Kafka Connect Wizard](/images/changelog/platform/v28/shared-filters.png)

Anyone can then load Organization filters from the dedicated section.
![Kafka Connect Wizard](/images/changelog/platform/v28/load-filters.png)

### Tags becomes Labels

With the introduction of the Self-service resource manifests, we brought customers a means to annotate all their resources with labels. Labels are more structured than the existing Conduktor tags, thereby allowing for more precise filtering capabilities, as can be seen in the Topic Catalog.

In this release, we'll perform an automatic migration from Tags to Labels.

Tags written with the naming convention `<key>/<value>` will automatically be added as similar labels:
- `<key>: <value>`  

If there is a conflict such as; a topic containing tags with the same key, that already has the target label, or is not written with this naming convention, then they will be created as follows:
````yaml
tag-<value>: true
````

Here's an example of how tags will be migrated into labels:
````yaml
# Tags defined on topic:
- format/avro
- project/supplychain
- team/delivery
- color/blue
- color/red
- wikipedia
- non-prod

# Resulting topic labels after migration
labels:
  format: avro
  project: supplychain
  team: delivery
  tag-color/blue: true # Because conflict on "color"
  tag-color/red: true # Because conflict on "color"
  tag-wikipedia: true
  tag-non-prod: true
````

The Topic list and Topic details page have been modified to use labels instead of tags.

![Kafka Connect Wizard](/images/changelog/platform/v28/topic-labels.png)

We plan to bring this capability on all resources (Connectors, Service Accounts, Consumer Groups, ...) over the next few releases.  
Let us know which resource you would like to see covered first.

### Audit Log events into Kafka
It is now possible to publish Console Audit Log events into Kafka.  

Configure the target Kafka Cluster and Topic using `CDK_AUDITLOGPUBLISHER_CLUSTER` and `CDK_AUDITLOGPUBLISHER_TOPICNAME` and event will start being produced in the destination Topic.

Check the dedicated Audit Log documentation for the list of supported event and the specification of the audit log event.

### Logging API
We have added a new endpoint to adjust the log level of Console without a need to restart.
```
curl -X PUT 'http://localhost:8080/api/public/debug/v1/loggers/io.conduktor.authenticator/DEBUG' \
  -H "Authorization: Bearer $API_KEY"
```

Check the [associated documentation](/platform/get-started/troubleshooting/logs-configuration/#runtime-logger-configuration-api) for the full list of capabilities.

### Quality of Life improvements
- Updated color theme
- Added navigation breadcrumb
- And many more slight design changes 

## Fixes 🔨
- CONS-1776 Fixed an issue with Topic Policy constraint Range where max value wasn't inclusive
- CUS-415 - Topic policies in Console not enforced when changing settings
- CONS-1828 [bug-cs]-local-user-creation-allows-bad-things
- CONS-1810 dont-allow-to-delete-group-when-its-owner-of-application
- CONS-1774 Fixed an issue with the "New version" button in the banner that was still showing despite being on the latest version
- Fixed error messages in many places where the error message wasn't useful
- CONS-1508/aws-glue-schema-registry-breaking-after-1h-connection-pool-shut-down
- Fixed all critical and high CVE in console-cortex image