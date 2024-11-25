---
date: 2023-08-21
title: Monitoring and alerting fixes and improvements
description: Conduktor version 1.17.3 introduces fixes and improvements to monitoring and alerting.
solutions: console
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Features ✨

- Replace the alert threshold column with the full underlying query in the 'Alerts' table.
- When creating alerts, you can now type in the dropdown selection of the resource (e.g. topic name, consumer group name) to improve usability when creating/editing alerts.

### Fixes 🔨

- Fix a case whereby saving alert did not preserve the consumer group name filter. Instead, saving or editing an existing alert would default to 'all consumer groups'.
- Fix N/A representation of delay (lag/s) for consumer groups in 'Apps Monitoring' to be more helpful. Lag is now labelled as 'infinite' in cases whereby lag exists in the group, but no new data is being received and no members exist in the consumer group.
- Remove the default alert 'No consumer group should be more than 3 minutes behind' for new clusters added to your environment. This was causing false positives in customers environments (e.g. non-production groups) and therefore it's advised to set alerts on explicit groups you wish to be alerted on. For existing clusters, if the alert is causing you to be notified on groups you do not wish for, then it's recommended to deactivate this alert.

### Known issues ⚙️

- Upon adding a new Kafka Cluster, Built-in Alerts & Custom Alerts are not working. You must restart Conduktor after adding the Kafka Cluster for changes to take effect.
