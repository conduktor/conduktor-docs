---
date: 2025-01-28
title: Console 1.31
description: docker pull conduktor/conduktor-console:1.31.0
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking Changes 💣](#breaking-changes-)
- [Features ✨](#features-)
  - [Application permissions on RBAC screen](#application-permissions-on-rbac-screen)
  - [Partner Zones](#partner-zones)
  - [More configuration for alert notifications](#more-configuration-for-alert-notifications)
  - [Alert ownership](#alert-ownership)
- [Quality of Life improvements](#quality-of-life-improvements)
- [Fixes 🔨](#fixes-)

### Breaking Changes 💣

#### Changes to alerts

This release added new alert functionality and removed the old data model for alerts.
As mentioned in our changelog for 1.28.0, alerts created in the alerts page with the old data model cannot be migrated but any new alerts created on their dedicated resource page (Topics, Brokers, etc.) will remain visible and active.
Read on for more information about the new alert functionality.

#### ID of Certificates
The ID of certificates in the ```public/v1/certificates``` API endpoints were modified to represent the fingerprint of the certificate.
It brings a more stable way to identify certificates in audit log and prevent multiple uploads of the same certificate. 

### Features ✨

#### Partner Zones

:::info
Partner Zones is currently in **Beta** and is subject to changes as we continue to build out the feature.
:::

We’re excited to introduce Partner Zones, an innovative solution that will revolutionize the process of securely sharing your streaming data with external partners.

In the coming releases, we will be adding support that allows you to manage Partner Zones completely from the UI.

For more information, check out the [Partner Zones documentation](/platform/navigation/settings/partner-zones).

#### More configuration for alert notifications

Alerts can now send notifications to configured webhook urls, and each alert has independent notification settings.
When creating a new alert you will be given the choice of Slack, Teams, and webhook destinations for your notifications.
The Slack channel for alert notifications is also now configurable per-alert.

#### Alert ownership

Alerts are now owned by individuals, groups, or applications.
Different teams can manage their own alerts independently with RBAC protection and use separate destinations for their alerts if needed.
Any migrated existing alerts have been assigned to the individual who created them.
You can read [the alerting section of our documentation](/platform/navigation/settings/alerts) for more information about the new alert functionality.

####  Application Group permissions now available on Users Permissions page

The users permissions page has been updated to show the permissions inherited when they belong to an ApplicationGroup.

![Application permissions on RBAC screen](/images/changelog/platform/v31/app-permission-rbac.png)


### Quality of Life improvements ✨

- Added a "Groups" tab in the Application page which shows all of the Application Groups created via Self-service
- Improved the license plan page to show the start and end date of the license, as well as the packages included in the license
- Added the remaining days left in the sidebar when the license is expiring in less than 30 days
- Improved how a connector's configuration is displayed in the raw JSON view by sorting the properties alphabetically

### Fixes 🔨
- Fixed a connector state mapping issue in the Kafka Connect UI for Confluent Cloud Managed Connector
- Fixed a permission check issue when adding partitions to a topic
- Improved the serialization of ```String``` and ```com.fasterxml.jackson.databind.JsonNode``` types returned by custom deserializers
- Fixed an issue parsing masked data when choosing the String format on data that cannot be parsed as JSON
- Added topics ending with ```-subscription-registration-topic``` and ```-subscription-response-topic``` to the Kafka Stream filter
