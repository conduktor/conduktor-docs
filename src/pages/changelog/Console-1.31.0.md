---
date: 2025-01-28
title: Console 1.31
description: docker pull conduktor/conduktor-console:1.31.0
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking Changes 💣](#breaking-changes-)
- [Scale ✨](#scale-)
  - [Massive improvements on Alerts](#massive-improvements-on-alerts)
  - [Application permissions on RBAC screen](#application-permissions-on-rbac-screen)
- [Exchange ✨](#exchange-)
  - [Partner Zones](#partner-zones)
- [Quality of Life improvements](#quality-of-life-improvements)
- [Fixes 🔨](#fixes-)

### Breaking Changes 💣

#### Removed V1 Alerts
Original alerts created in the Monitoring/Alerts section are no longer available.

#### Changes to V2 Alerts
V2 Alerts, that can be created since Console 1.28 on the dedicated resource page (Topics, Brokers, etc.) are still available and active, but have been migrated with the following rules:
- Alerts have been automatically configured with the previously globally configured channel (Teams or Slack).
- Alerts have been assigned to the individual who created them.

Read below for more information about the new alert functionality.

#### ID of Certificates
The ID of certificates in the ```public/v1/certificates``` API endpoints were modified to represent the fingerprint of the certificate.
It brings a more stable way to identify certificates in audit log and prevent multiple uploads of the same certificate. 

### Scale ✨

#### Massive improvements on Alerts

We have made significant improvements to the alerting system in Console.  
Here are some of the changes:
- Alerts are now **owned** by individuals, groups, or applications
- We added **Webhook** destination to alerts notifications
- Destinations are now configurable per-alert
- API / CLI support for Alerts is now available

````yaml
apiVersion: console/v3
kind: Alert
metadata:
  name: messages-in-dead-letter-queue
  group: support-team
spec:
  cluster: my-dev-cluster
  type: TopicAlert
  topicName: wikipedia-parsed-DLQ
  metric: MessageCount
  operator: GreaterThan
  threshold: 0
  destination:
    type: Slack
    channel: "alerts-p1"
````
Console UI has been updated to reflect these changes.

![Application permissions on RBAC screen](/images/changelog/platform/v31/alerts-1.png)
![Application permissions on RBAC screen](/images/changelog/platform/v31/alerts-2.png)


Read [the alerting section of our documentation](/platform/navigation/settings/alerts) for more information about the new alert functionality.

####  Application Group permissions now available on Users Permissions page

The users permissions page has been updated to show the permissions inherited when they belong to an ApplicationGroup.

![Application permissions on RBAC screen](/images/changelog/platform/v31/app-permission-rbac.png)

### Exchange ✨

**Exchange** is a new Conduktor Product aimed at helping you share your data securely with your external partners.  
Check the associated [Exchange Product page](https://conduktor.io/exchange) for more information.

#### Partner Zones

:::info
Partner Zones is currently in **Beta** and is subject to changes as we continue to build out the feature.
:::

Partner Zones enable you to securely share your streaming data with external partners, without needing to replicate the data into a second, physical Kafka cluster.

In the upcoming releases, we will be adding the following:
- Dedicated pages that allows you to manage Partner Zones completely from the UI
- Support for Traffic Control Policies to limit the amount of data that can be consumed or produced by your partners
- Topic renaming capability to avoid leaking internal topic names to your partners

For more information, check out the [Partner Zones documentation](/platform/navigation/settings/partner-zones).


### Quality of Life improvements ✨

- Added a "Groups" tab in the Application page which shows all of the Application Groups created via Self-service
- Improved the license plan page to show the start and end date of the license, as well as the packages included in the license
- Added the remaining days left in the sidebar when the license is expiring in less than 30 days
- Improved how a connector's configuration is displayed in the raw JSON view by sorting the properties alphabetically

### Fixes 🔨
- Fixed several issues Confluent Cloud Managed Connectors
  - Fixed Pause/Resume connector
  - Fixed Restart connector (not task)
  - Fixed Connector Status (Running, Paused, etc.), previously displayed as "Unknown"
- Fixed a permission check issue when adding partitions to a topic
- Improved the serialization of ```String``` and ```com.fasterxml.jackson.databind.JsonNode``` types returned by custom deserializers
- Fixed an issue parsing masked data when choosing the String format on data that cannot be parsed as JSON
- Added topics ending with ```-subscription-registration-topic``` and ```-subscription-response-topic``` to the Kafka Stream filter

### Known issues
- We are aware of more inconsistencies with Confluent Cloud Managed Connector support in Console. We are working on it.
  - Task status is not always correctly displayed
  - Individual task restart fails with Internal Server Error
  - Automatic Connector restart doesn't work as it relies on individual task restart
