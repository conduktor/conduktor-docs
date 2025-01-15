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
  - TODO
- [Quality of Life improvements](#quality-of-life-improvements)
- [Fixes 🔨](#fixes-)

### Breaking Changes 💣

#### Changes to alerts

This release added new alert functionality and removed the old data model for alerts.
As mentioned in our changelog for 1.28.0, alerts created in the alerts page with the old data model cannot be migrated but any new alerts created on their dedicated resource page (Topics, Brokers, etc.) will remain visible and active.
Read on for more information about the new alert functionality.

### Features ✨

#### More configuration for alert notifications

Alerts can now send notifications to configured webhook urls, and each alert has independent notification settings.
When creating a new alert you will be given the choice of Slack, Teams, and webhook destinations for your notifications.
The Slack channel for alert notifications is also now configurable per-alert.

#### Alert ownership

Alerts are now owned by individuals, groups, or applications.
Different teams can manage their own alerts independently with RBAC protection and use separate destinations for their alerts if needed.
Any migrated existing alerts have been assigned to the individual who created them.
You can read [the alerting section of our documentation](/platform/navigation/settings/alerts) for more information about the new alert functionality.

#### Feat 2
TODO

### Quality of Life improvements ✨

- Added a "Groups" tab in the Application page which shows all of the Application Groups created via Self-service
- Improved the license plan page to show the start and end date of the license, as well as the packages included in the license
- Added the remaining days left in the sidebar when the license is expiring in less than 30 days

### Fixes 🔨
- TODO
- TODO
