---
date: 2024-10-14
title: Conduktor SQL
description: docker pull conduktor/conduktor-console:1.28.0
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Features ✨](#features-)
  - [Conduktor SQL](#conduktor-sql)
  - [Monitoring improvements](#monitoring-improvements)
  - [New CLI/API resource Alert](#new-cliapi-resource-alert)
  - [Shareable Filters](#shareable-filters)
  - [Tags becomes Labels](#tags-becomes-labels)
  - [Publish Audit Log CloudEvents into Kafka](#publish-auditlog-cloudevents-into-kafkas)
  - [Logging API](#logging-api)
- [Quality of Life improvements](#quality-of-life-improvements)
- [Fixes 🔨](#fixes-)

### Features ✨

***

#### Conduktor SQL

:::info
This feature is in [**Beta**](/platform/guides/configure-sql) and is subject to change as we enhance it further.

It's currently only available to Console **Admins**, and will be made available for all users when integrated with our security model (i.e. RBAC, Data Masking).
:::

Index data from Kafka topics in a database to enable data to be queried from the **UI**, **API** or **CLI** using **SQL**.

This allows you to troubleshoot, sample, analyze, aggregate and join data through:
 - Querying Kafka message data
 - Querying Kafka metadata (such as the offset, partition and timestamp)

Read the [dedicated guide](/platform/guides/configure-sql) on configuring SQL.

**Query through the UI**

![Conduktor SQL](/images/changelog/platform/v28/console-sql-change-log.png)

**Query through the API & CLI**

**CLI (upgrade to v0.3.1):**
```bash
conduktor sql 'select * from "kafka-cluster-dev_customer_orders"' -n 2
```

**API:**
```bash
curl \
 --header "Authorization: $token" \
 --request POST 'localhost:8080/api/public/sql/v1/execute?maxLine=2' \
 --data 'select * from "kafka-cluster-dev_customer_orders"'
```

**Important information regarding SQL**

To use the feature there is a dependency on provisioning a new database. As a user, you have the choice of which topics you wish to index. Learn more about this and how to configure SQL using the [dedicated guide](/platform/guides/configure-sql).

We encourage you to use this feature in non-production environments and give us [feedback](https://conduktor.io/roadmap).

***

#### Monitoring improvements
We are migrating our Monitoring dashboards into their respective resource pages for a more integrated experience.

This migration will happen over the next few releases with our objective to remove the existing, generic Monitoring pages:
- Overview will be refactored into Home page
- **Cluster Health** dashboards and alerts will move under Brokers page
- **Topic monitoring** will be integrated with Topics page
- Apps monitoring will be integrated with Consumer Groups pages
- Alerts will be integrated as tabs in all the resource pages, similar to the recent changes for Kafka Connect

For this 1.28.0 release we are migrating the **Topic monitoring** and **Cluster Health** pages.

#### Topic Monitoring
The 3 existing graphs have been moved to the Topic details.  We have also added a new graph to track the number of records in the topic.
- Produce Rate and Consume Rate
- Disk Usage
- Records (new)

![Kafka Connect Wizard](/images/changelog/platform/v28/topic-monitoring.png)

#### Cluster Health
The charts and alerts are now available under the Brokers page with cleaner graphs.  

- Produce Rate and Consume Rate
- Disk Usage
- Partitions Count
- Offline, Under Replicated and Under Min ISR Partitions


![Kafka Connect Wizard](/images/changelog/platform/v28/broker-monitoring.png)

We have removed two metrics that were not always calculated correctly since the removal of the JMX integration back in release 1.15 (May 2023).
- Active Controller Count
- Unclean Leader Election

***

#### New CLI/API resource Alert

Alerts can now be created via the API or CLI in addition to the UI.  
See below for example config, and check the [Alerts documentation](/platform/reference/resource-reference/console/#alert) for more details.

````yaml
---
apiVersion: console/v2
kind: Alert
metadata:
  cluster: local-julien
  name: my-alert
spec:
  type: TopicAlert
  topicName: wikipedia-parsed-DLQ
  metric: MessageCount
  operator: GreaterThan
  threshold: 0
````

Starting today, we recommend you use the new alerts available under Brokers and Topics pages.

:::caution Deprecation notice
**We do not plan to migrate existing alerts to the new Alert model.**  

Original alerts will be removed in the near future in favor of the new ones.  
We'll let you know a few releases in advance.

If you have a large number of alerts configured and need some help, we're happy to help, please get in touch with our support.
:::

***

#### Shareable Filters
Filters in the Topic Consume view are now shareable. This brings a number of benefits:
- **Improved collaboration**: Share pre-defined views to ensure users are looking at the same subset of data
- **Time savings**: Speed up troubleshooting and analysis with repeatable filters that share the same or similar criteria
- **Consistency and accuracy**: Standardized filters across teams and departments reduce the risk of errors or discrepancies that can occur when individuals manually create filters

After you've finished configuring filters on a topic, you now have an option to save the filter either as a Private or an Organization filter.   
![Kafka Connect Wizard](/images/changelog/platform/v28/shared-filters.png)

Anyone can then load Organization filters from the dedicated section.
![Kafka Connect Wizard](/images/changelog/platform/v28/load-filters.png)

*** 

#### Tags Become Labels

With the introduction of the Self-service resource manifests, we brought customers a means to annotate all their resources with labels. Labels are more structured than the existing Conduktor tags, thereby allowing for more precise filtering capabilities, as can be seen in the Topic Catalog.

In this release, we'll perform an automatic migration from Tags to Labels.

Tags written with the naming convention `<key>/<value>` will automatically be added as similar labels:
- `<key>: <value>`  

If there is a conflict such as; a topic containing tags with the same key, that already has the target label, or is not written with this naming convention, then they will be created with a `tag-` prefix as follows:
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
  tag-wikipedia: true # Because wikipedia is not a key value pair
  tag-non-prod: true # Becuase non-prod is not a key value pair
````

The Topic list and Topic details page have been modified to use labels instead of tags.

![Kafka Connect Wizard](/images/changelog/platform/v28/topic-labels.png)

We plan to bring this capability on all resources (Connectors, Service Accounts, Consumer Groups, ...) over the next few releases.  
Let us know which resource you would like to see covered first.

***

#### Publish AuditLog CloudEvents into Kafka
It is now possible to publish Console Audit Log events into a Kafka topic directly for any further use you may have for them, such as maintaining your own audit trail in other systems.  

The exportable audit log events have more detail compared to the current UI events, providing additional information about the event that has taken place.  

The events conform to the [CloudEvents specification](https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md), a vendor-neutral format that follows the following structure:

```json
{
    "specversion" : "1.0",
    "type" : "com.github.pull_request.opened",
    "source" : "https://github.com/cloudevents/spec/pull",
    "subject" : "123",
    "id" : "A234-1234-1234",
    "time" : "2018-04-05T17:31:00Z",
    "comexampleextension1" : "value",
    "comexampleothervalue" : 5,
    "datacontenttype" : "text/xml",
    "data" : "<much wow=\"xml\"/>"
}
```

An example Conduktor event would look like:
```json
{
	"source": "//kafka/kafkacluster/production/topic/website-orders",
	"data": {
		"eventType": "Kafka.Topic.Create",
		// Additional event specific data...
		"metadata": {
			"name": "website-orders",
			"cluster": "production"
		}
		// Additional event specific metadata...
	},
	"datacontenttype": "application/json",
	"id": "ad85122c-0041-421e-b04b-6bc2ec901e08",
	"time": "2024-10-10T07:52:07.483140Z",
	"type": "AuditLogEventType(Kafka,Topic,Create)",
	"specversion": "1.0"
}
```

Specify the target Kafka cluster and topic using the environment variables `CDK_AUDITLOGPUBLISHER_CLUSTER` & `CDK_AUDITLOGPUBLISHER_TOPICNAME` and events will start being produced to the destination topic.

A full list of all the exported audit log event types is published on the [Audit Log](/platform/navigation/settings/audit-log/#exportable-audit-log-events) page.


***

#### Logging API
Adjust the log level of Console without requiring a restart. We've added a new API endpoint to support targeted changes to log levels dynamically.
Check the [associated documentation](/platform/get-started/troubleshooting/logs-configuration/#runtime-logger-configuration-api) for the full list of capabilities.

```
curl -X PUT 'http://localhost:8080/api/public/debug/v1/loggers/io.conduktor.authenticator/DEBUG' \
  -H "Authorization: Bearer $API_KEY"
```
***

### Quality of Life improvements
- Updated design and color theme
- Added navigation breadcrumb
- Enhanced error messages throughout the product
- Improved the connector 90 days heatmap
- Declaring an ApplicationInstance with resources ending in `*` will now fail with this error message
  - `Could not apply resource ApplicationInstance/my-app-inst: resource name 'appA-*' is not allowed. Use name 'appA-' with patternType PREFIXED instead`

### Fixes 🔨
- Fixed an issue with Topic Policy constraint Range where `max` value wasn't inclusive and `min` could greater than `max`
- Fixed an issue where Topic Policies were not enforced on Topic configuration changes in Console
- Added an error message when using the copy to clipboard button (for API Keys for instance) fails
- Added checks on local user creation emails
- Added new optional environment variable `CDK_SSO_OAUTH2_0_OPENID_METADATADOCUMENT` to modify the default discovery .well-known end-point
- Fixed an issue where Avro messages using logical type UUID couldn't be deserialized properly
- Fixed an issue with Cluster configuration page requiring `platform.certificates.create` permission to perform the TLS check
- Fixed an issue with "Remove user from group" button which is now disabled for users added by external group mapping
- Prevented the deletion of a group when it is owner of an Application
- Fixed an issue with the "New version" button in the banner that was still showing despite being on the latest version
- Fixed an issue where connections to the AWS glue schema registry would disconnect after a certain time and struggle to reconnect
- Fixed an issue where the "Reprocess message" feature was converting empty string headers to null value
- Fixed all critical and high CVE in `console-cortex` image
- Fixed an issue with the metric `under_replicated_partitions` when topics have `confluent.placement.constraints` property