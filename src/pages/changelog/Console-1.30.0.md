---
date: 2024-12-12
title: title
description: docker pull conduktor/conduktor-console:1.30.0
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

**TOC**

## Breaking Changes 💣
?


***

## Quality of Life improvements

### Alert list redesign
We’ve redesigned our alert lists across the product to provide a more intuitive overview of alert configurations and statuses:

- The Prometheus query column is replaced with a more friendly metric and condition row.
- Added the "Last Triggered Time" column to make filtering and finding firing alerts easier.


![New alert list](/images/changelog/platform/v30/new-alert-list.png)


### RBAC screen redesign

The RBAC screen displaying resource access has been redesigned to provide a clearer distinction between inherited and user-specific permissions.

![RBAC screen](/images/changelog/platform/v30/RBAC-screen-redesign.png)

***

## Features ✨

### Delegating authentication to an identity provider
Console can now be configured to accept a JWT token from an external identity provider.
It allows you to directly use your identity provider for managing access to Console.
A common use case of this feature is to delegate authentication to your API gateway.

For the full configuration details, check out the [documentation](/platform/get-started/configuration/user-authentication/jwt-auth).

### More Audit Log CloudEvents into Kafka

We have made more events available for the Audit Log Publisher:
- Kafka.Subject.ChangeCompatibility
- Kafka.Topic.Browse
- Kafka.Topic.ProduceRecord
- Kafka.Connector.Restart
- Kafka.Connector.Pause
- Kafka.Connector.Resume
- Kafka.Connector.RestartTask
- Kafka.Connector.AutoRestartActivate
- Kafka.Connector.AutoRestartStop

A full list of all the exported audit log event types is published on the [Audit Log](/platform/navigation/settings/audit-log/#exportable-audit-log-events) page.

***

### Conduktor Chargeback: Data Export

The tabular data you can see on the Chargeback page can now be exported into a CSV file to enable easier integration with existing organization cost management data.

For more detailed information, check out the [Exporting chargeback data](/platform/navigation/chargeback#exporting-chargeback-data) section in the Chargeback documentation.

***

## Fixes 🔨
- Fixed an issue where pagination was not working as expected in the SQL Indexed Topics table when there are more than 50 topics indexed