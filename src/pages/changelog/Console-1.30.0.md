---
date: 2024-12-16
title: Console 1.30
description: docker pull conduktor/conduktor-console:1.30.0
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Features ✨](#features-)
  - [RBAC support for Conduktor SQL](#rbac-support-for-conduktor-sql)
  - [Add support for multi-hosts database configuration](#add-support-for-multi-hosts-database-configuration)
  - [Alert list redesign](#alert-list-redesign)
  - [Delegating authentication to an identity provider](#delegating-authentication-to-an-identity-provider)
  - [More Audit Log CloudEvents into Kafka](#more-audit-log-cloudevents-into-kafka)
  - [RBAC screen redesign](#rbac-screen-redesign)
  - [Conduktor Chargeback: Data Export](#conduktor-chargeback-data-export)
- [Fixes 🔨](#fixes-)


## Features ✨

### RBAC support for Conduktor SQL

In a previous release, we introduced Conduktor SQL. It was restricted to Admins because it did not apply any permission model.

This new update brings full RBAC support on Conduktor SQL:
- Users & Groups can only see and query the tables for which they have an associated Topic permission in Console
- Data masking policies are applied (with limitations) 

You can now bring SQL to all users within your organization.  

For more detailed information, check out the [SQL security](/platform/guides/configure-sql.md#sql-security) section.

### Add support for multi-hosts database configuration

You can now setup Console's backing database for high availability(HA). If you have a PostgreSQL HA setup with multiple hosts, you can now configure a Console to [JDBC connection](https://jdbc.postgresql.org/documentation/use/#connection-fail-over) to the database using a list of hosts.

```yaml
CDK_DATABASE_URL: jdbc:postgresql://user:password@host1:5432,host2:5433/console_database
CDK_KAFKASQL_DATABASE_URL: jdbc:postgresql://user:password@host1:5432,host2:5433/kafka_sql_database
```
For more information, check out the [Multi-host configuration](/platform/get-started/configuration/database/#multi-host-configuration) section in the Database configuration documentation.

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

### RBAC screen redesign

The RBAC screen displaying resource access has been redesigned to provide a clearer distinction between inherited and user-specific permissions.

![RBAC screen](/images/changelog/platform/v30/RBAC-screen-redesign.png)

### Conduktor Chargeback: Data Export

The tabular data you can see on the Chargeback page can now be exported into a CSV file to enable easier integration with existing organization cost management data.

For more detailed information, check out the [Exporting chargeback data](/platform/navigation/chargeback#exporting-chargeback-data) section in the Chargeback documentation.

![A screenshot of the Chargeback section in the console, showing a graph and a data table with cost and usage metrics over time. The 'Export all' button is highlighted in the top right corner of the graph.](/images/changelog/platform/v30/chargeback-data-export.png)


## Fixes 🔨
- Fixed an issue where pagination was not working as expected in the SQL Indexed Topics table when there are more than 50 topics indexed
