---
date: 2023-08-04
title: Consumer Group list screen fix
description: Conduktor version 1.17.2 introduces a fix that was identified on the consumer group list screen.
solutions: console
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

#### Fixes 🔨

- Fixed an issue on the consumer group list screen which could inflate the number of members in a group. This was a result of migrating to the internal 'snapshot' cache for improved performance, and missing a case whereby we did not clean up old consumer group members.

#### Known issues ⚙️

- Upon adding a new Kafka Cluster, Built-in Alerts & Custom Alerts are not working. You must restart Conduktor after adding the Kafka Cluster for changes to take effect.
