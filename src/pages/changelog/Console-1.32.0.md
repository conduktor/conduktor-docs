---
date: 2025-03-11
title: Console 1.32
description: docker pull conduktor/conduktor-console:1.32.0
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
  - [Partner Zone](#partner-zone)
- [Scale](#scale)
  - [Alert history](#alert-history)
  - [Audit Log](#audit-log)
  - [Service account labels](#service-account-labels)
  - [RBAC-aware sidebar menu](#rbac-aware-sidebar-menu)
- [Exchange](#exchange)
  - [Partner Zone](#partner-zone-1)
- [Quality of life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)

### Breaking changes

#### Partner Zone
Gateway 3.6.1 is required for this release.

### Scale

#### Alert history

In the alert details page you now can also see the history of an alert's status, and notifications which may have failed to send. Find out [more about alerts](/platform/navigation/settings/alerts).

![Alert details page. The left-hand side lists alert properties like name and description. The right-hand side displays a heatmap-style chart with red and grey squares indicating alert health and a table below listing recent alert notifications.](/images/changelog/platform/v32/alert-details.png)


#### Audit Log

You can now view the new CloudEvents-based audit log events with enhanced filtering capabilities for the new resource and event types. While legacy audit log events will stop being captured in this release, existing legacy events will remain accessible through a dedicated page. Find out [more about the audit log](/platform/navigation/settings/audit-log).

![The audit log settings page shows a list of audit log events, with a drawer showing details of an event](/images/changelog/platform/v32/audit-log-settings.png)

#### Service account labels

You can now edit labels on service accounts in plain Kafka clusters through the UI, in addition to the existing CLI & API support.

Support for service accounts in Aiven and Confluent Cloud clusters is coming soon.

![The service account details page shows labels underneath the service account name heading. Next to existing labels there is an edit button which you can click to open a drawer with a form to add and edit labels](/images/changelog/platform/v32/edit-service-account-labels.png)

#### RBAC-aware sidebar menu

On Enterprise Tier, the sidebar now dynamically shows/hides menu items based on the user's permissions. This helps reduce confusion by hiding functionality that users don't have access to, making onboarding easier for Platform Teams introducing users to Kafka. Find out [more about RBAC](/platform/navigation/settings/rbac).

For the console menu, items are shown based on the user's `Resource access` permissions on individual clusters, while Settings menu items are shown according to their `Service access` permissions. 

### Exchange

#### Partner Zone



***

### Quality of life improvements

- Enabled the confirmation of resource deletion using the Enter key
- Updated connector restart button labels and toast messages to accurately reflect their behaviour for Confluent Cloud connectors
- Removed a legacy option to disable monitoring.

### Fixes

- Fixed an issue where editing a schema registry subject would overwrite its compatibility mode with the global compatibility setting
- Fixed an issue where creating an ACL for a service account with a duplicate name could override the existing ACL
- Fixed an issue where the Kafka Connect failed task heatmap did not display data for days in 2025
- Fixed an issue where the CLI would report incorrect actions taken (although teh correct actions were shown when the `--dry-run` flag was used)
- When Azure Active Directory is used as an LDAP server, the `userPrincipalName` field can now be set as the field containing the email address.
- Fixed an issue where very large numbers would show rounded in the details view of a topic message (e.g. `7777705807840271771` would display as `7777705807840271000`)
- Fixed a UI issue where the option to reset a consumer group offset would disappear off the screen if the partition count was too large.
