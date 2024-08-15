---
date: 2023-08-04
title: Consumer Group list screen fix
description: Conduktor version 1.17.2 introduces a fix that was identified on the consumer group list screen.
solutions: console
tags: fix
---

Submit your feedback via our [public roadmap](https://product.conduktor.help/).

Visit our [Get Started](https://www.conduktor.io/get-started/) page to test our latest version of Conduktor.

## Conduktor Console

### Fixes 🔨

- Fixed an issue on the consumer group list screen which could inflate the number of members in a group. This was a result of migrating to the internal 'snapshot' cache for improved performance, and missing a case whereby we did not clean up old consumer group members.

### Known issues ⚙️

- Upon adding a new Kafka Cluster, Built-in Alerts & Custom Alerts are not working. You must restart Conduktor after adding the Kafka Cluster for changes to take effect.
