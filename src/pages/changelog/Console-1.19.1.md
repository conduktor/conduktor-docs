---
date: 2023-11-09
title: Bug Fixes and Performance Improvements
description: Conduktor version 1.19.1
solutions: console
tags: fix
---

Remember, you can always:

- Submit your feedback via our [public roadmap](https://product.conduktor.help/)
- Visit our [Get Started](https://www.conduktor.io/get-started/) page to test our latest version of Conduktor
- Receive updates on our future Releases via our [Support Portal](https://support.conduktor.io/hc/en-gb/sections/16400521075217-Releases) and selecting **follow**

# Conduktor Console

## Fixes 🔨

- Massive improvement over the indexing time of your cluster. This is especially notable if you have a large number of consumer groups (> 200) on your Kafka cluster.
- Fixed an issue where Gateway Interceptors could be created/deleted by all users instead of Admin group members.
- Fixed an issue where Monitoring didn't work for non-Admin group members.
- Fixed an issue that occurred when deleting a user from Console.
- Fixed a UI issue where ACLs were not editable by non-Admin group members.
- Fixed a UI issue where user could not pick the Kafka Connect cluster when creating a new Connector.
