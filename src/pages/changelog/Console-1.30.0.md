---
date: 2024-12-12
title: title
description: docker pull conduktor/conduktor-console:1.30.0
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking Changes 💣](#breaking-changes-)
  - [RBAC screen redesign](#rbac-screen-redesign)
- [Depreciation notice 🚨](#depreciation-notice-)
  - [Single-host database configuration](#single-host-database-configuration)
- [Quality of Life improvements](#quality-of-life-improvements)
- [Features ✨](#features-)
  - [Delegating authentication to an identity provider](#delegating-authentication-to-an-identity-provider)
  - [More Audit Log CloudEvents into Kafka](#more-audit-log-cloudevents-into-kafka)
  - [Add support for multi-hosts database configuration](#add-support-for-multi-hosts-database-configuration)
  - [Conduktor Chargeback: Data Export](#conduktor-chargeback-data-export)
  - [SQL security](#sql-security)
- [Fixes 🔨](#fixes-)

## Breaking Changes 💣
?

## Depreciation notice 🚨

### Single-host database configuration

As part of bringing [high availability(HA) support for Console's backing database](#add-support-for-multi-hosts-database-configuration), the single-host configuration is now deprecated in favour of multi-host support.

Whilst single-host is still supported for now, please update your configuration as mapped below for continued support in the future.

Replacements :
- `database.host` -> `database.hosts[0].host`
- `database.port` -> `database.hosts[0].port`
- `kafka_sql.database.host` -> `kafka_sql.hosts[0].host`
- `kafka_sql.database.port` -> `kafka_sql.hosts[0].port`


## Features ✨

### RBAC screen redesign

The RBAC screen displaying resource access has been redesigned to provide a clearer distinction between inherited and user-specific permissions.

![RBAC screen](/images/changelog/platform/v30/RBAC-screen-redesign.png)

### Alert list redesign
Alert lists across the product now provide a more intuitive overview of alert configurations and statuses:

- Query names are now more human readable, we've replaced the Prometheus query column with a friendly metric name & the condition under which it will fire
- Fnd firing alerts easier and those that have never been triggered with the addition of a "Last Triggered Time" column

![New alert list](/images/changelog/platform/v30/new-alert-list.png)

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
- Kafka.Topic.SqlQuery
- Kafka.Connector.Restart
- Kafka.Connector.Pause
- Kafka.Connector.Resume
- Kafka.Connector.RestartTask
- Kafka.Connector.AutoRestartActivate
- Kafka.Connector.AutoRestartStop

A full list of all the exported audit log event types is published on the [Audit Log](/platform/navigation/settings/audit-log/#exportable-audit-log-events) page.

### Add support for multi-hosts database configuration

You can now setup Console's backing database for high availability(HA). If you have a PostgreSQL HA setup with multiple hosts, you can now configure a Console to [JDBC connection](https://jdbc.postgresql.org/documentation/use/#connection-fail-over) to the database using a list of hosts.

```yaml
database:
  url: 'jdbc:postgresql://user:password@host1:5432,host2:5433/console_database'

kafka_sql:
  hosts:
  - host: 'host1'
    port: 5432
  - host: 'host2'
    port: 5432
  name: 'kafka_sql_database'
  username: 'user'
  password: 'password'
```
For more information, check out the [Multi-host configuration](/platform/get-started/configuration/database/#multi-host-configuration) section in the Database configuration documentation.

### Conduktor Chargeback: Data Export

The tabular data you can see on the Chargeback page can now be exported into a CSV file to enable easier integration with existing organization cost management data.

For more detailed information, check out the [Exporting chargeback data](/platform/navigation/chargeback#exporting-chargeback-data) section in the Chargeback documentation.

![A screenshot of the Chargeback section in the console, showing a graph and a data table with cost and usage metrics over time. The 'Export all' button is highlighted in the top right corner of the graph.](/images/changelog/platform/v30/chargeback-data-export.png)

### SQL security

RBAC & data masking policies are now project into SQL database. In consequence every user of the platform can now use Console SQL.

For more detailed information, check out the [SQL security](/platform/guides/configure-sql.md##sql-security) section.

## Fixes 🔨
- Fixed an issue where pagination was not working as expected in the SQL Indexed Topics table when there are more than 50 topics indexed
