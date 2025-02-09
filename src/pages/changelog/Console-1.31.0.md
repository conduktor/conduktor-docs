---
date: 2025-02-05
title: Console 1.31
description: docker pull conduktor/conduktor-console:1.31.0
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking Changes](#breaking-changes-)
  - [Removed V1 Alerts](#removed-v1-alerts)
  - [Changes to V2 Alerts](#changes-to-v2-alerts)
  - [Id of Certificates](#id-of-certificates)
- [Scale](#scale-)
  - [Enhanced Alerting with Added Webhooks Support](#enhanced-alerting-with-added-webhooks-support)
  - [View Application-inherited permissions on RBAC screen](#application-group-permissions-now-available-on-users-permissions-page)
  - [API / CLI support for Service Accounts](#api--cli-support-for-service-accounts)
  - [Labels support for Service Accounts](#labels-support-for-service-accounts)
  - [Self-Service support for Application Managed Service Accounts](#self-service-support-for-application-managed-service-accounts)
- [Exchange](#exchange-)
  - [Introducing Partner Zones for Third-Party Data Sharing](#introducing-partner-zones-for-third-party-data-sharing)
- [Quality of Life improvements](#quality-of-life-improvements)
- [Fixes](#fixes-)

### Breaking Changes

#### Removed V1 Alerts
Original alerts created in the Monitoring/Alerts section are no longer available.

#### Changes to V2 Alerts
V2 Alerts, that can be created since Console 1.28 on the dedicated resource page (Topics, Brokers, etc.) are still available and active, but have been migrated with the following rules:
- Alerts have been automatically configured with the previously globally configured channel (Teams or Slack).
- Alerts have been assigned to the individual who created them.

Read [below](#enhanced-alerting-with-added-webhooks-support) for more information about the new alerting functionality.

#### Id of Certificates
The Id of certificates in the ```public/v1/certificates``` API endpoints were modified to represent the fingerprint of the certificate.
It brings a more stable way to identify certificates in audit log and prevent multiple uploads of the same certificate. 

***

### Scale

#### Enhanced Alerting with Added Webhooks Support

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
Alert creation workflow has been updated to allow you to configure the alert destination and ownership in the UI.

![Application permissions on RBAC screen](/images/changelog/platform/v31/alerts.png)


Read [the alerting section of our documentation](/platform/navigation/settings/alerts) for more information about the new alert functionality.

#### API / CLI support for Service Accounts
We have added support for Service Accounts in the API and CLI.  
Declaring ServiceAccount resource lets you manage the ACLs of a service account in Kafka.  
At the moment we only support Kafka ACLs (calls to Kafka APIs) but we plan to add support for Aiven ACLs in ServiceAccount resource in the future. 
````yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  cluster: shadow-it
  name: clickstream-sa
spec:
  authorization:
    type: KAFKA_ACL
    acls:
      - type: TOPIC
        name: click.event-stream.avro
        patternType: PREFIXED
        operations:
          - Write
      - type: CLUSTER
        name: kafka-cluster
        patternType: LITERAL
        operations:
          - DescribeConfigs
      - type: CONSUMER_GROUP
        name: cg-name
        patternType: LITERAL
        operations:
          - Read
````

#### Labels support for Service Accounts
We have added support for labels in the ServiceAccount resource.  
For now you can only edit labels through ServiceAccount resource in the API and CLI.
````yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  cluster: shadow-it
  name: clickstream-sa
  labels:
    domain: payment
    region: EMEA
    application: clickstream
spec:
  ...
````
The labels are used to filter the Service Accounts in the UI. Editing labels in the UI will be available in the next release.
![Application permissions on RBAC screen](/images/changelog/platform/v31/service-account.png)

#### Self-Service support for Application Managed Service Accounts
We have added a new mode for ApplicationInstance that allows Application Teams to have full control over their Service Accounts.  
This mode can be enabled in the ApplicationInstance with the following flag `spec.applicationManagedServiceAccount` set to `true`.  
When enabled, Self-Service will not synchronize the Service Account with the ApplicationInstance and will let the Application Team manage the Service Account directly.
Application Managed Service Accounts can be declared in the API and CLI using the Application API Key.
````yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  appInstance: "clickstream-app-dev" # Mandatory to link the Service Account to the ApplicationInstance
  cluster: shadow-it
  name: clickstream-sa
spec:
  authorization:
    type: KAFKA_ACL
    acls:
...
````

####  Application Group permissions now available on Users Permissions page

The users permissions page has been updated to show the permissions inherited when they belong to an ApplicationGroup.

![Application permissions on RBAC screen](/images/changelog/platform/v31/app-permission-rbac.png)

***

### Exchange

**Exchange** is a new Conduktor Product aimed at helping you share your data securely with your external partners.  
Check the associated [Exchange Product page](https://conduktor.io/exchange) for more information.

#### Introducing Partner Zones for Third-Party Data Sharing

:::info
Partner Zones is currently in **Beta** and is subject to changes as we continue to build out the feature.
:::

Partner Zones enable you to securely share your streaming data with external partners, without needing to replicate the data into a second, physical Kafka cluster.

In the upcoming releases, we will be adding the following:
- Dedicated pages that allows you to manage Partner Zones completely from the UI
- Support for Traffic Control Policies to limit the amount of data that can be consumed or produced by your partners
- Topic renaming capability to avoid leaking internal topic names to your partners

For more information, check out the [Partner Zones documentation](/platform/navigation/settings/partner-zones).

***

### Quality of Life improvements

- Added a "Groups" tab in the Application page which shows all of the Application Groups created via Self-service
- Improved the license plan page to show the start and end date of the license, as well as the packages included in the license
- Added the remaining days left in the sidebar when the license is expiring in less than 30 days
- Improved how a connector's configuration is displayed in the raw JSON view by sorting the properties alphabetically

### Fixes
- Fixed several issues Confluent Cloud Managed Connectors
  - Fixed Pause/Resume connector
  - Fixed Connector and Task Restart
  - Fixed Connector Status (Running, Paused, etc.), previously displayed as "Unknown"
- Fixed a permission check issue when adding partitions to a topic
- Improved the serialization of ```String``` and ```com.fasterxml.jackson.databind.JsonNode``` types returned by custom deserializers
- Fixed an issue parsing masked data when choosing the String format on data that cannot be parsed as JSON
- Added topics ending with ```-subscription-registration-topic``` and ```-subscription-response-topic``` to the Kafka Stream filter
- Fixed the edition of ownership mode of application instances
- Fixed the form for saving producer templates 
- Fixed the navigation to go back to the home page of connectors when switching clusters


### Known issues
- We are aware of more inconsistencies with Confluent Cloud Managed Connector support in Console. We are working on it.
  - Task status is not always correctly displayed
  - Various UI responsiveness issues
