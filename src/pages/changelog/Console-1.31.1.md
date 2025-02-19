---
date: 2025-02-18
title: Hotfix for Console 1.31.0
description: docker pull conduktor/conduktor-console:1.31.1
solutions: console
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*


### Console metrics performance and configuration

To address a growing number of issues related to monitoring graph timing out and OutOfMemory issues when Console is connected with large Kafka clusters, 
we have introduced a change to the metrics collection in Console.

This feature is opt-in for now and will be enabled by default in an upcoming release.

If you experience graph timeouts or OutOfMemory issues, upgrade to 1.31.1 and configure the following additional environment variables as follows:

```
CDK_MONITORING_ENABLENONAGGREGATEDMETRICS: false
CDK_MONITORING_USEAGGREGATEDMETRICS: true
```

This configuration will 1. disable the collection of obsolete granular metrics and 2. use the new aggregated metrics in the Console graphs.

See [metric configuration](platform/get-started/configuration/env-variables/#configure-console-metrics) for details.


### Fixes
- Fixed dependencies vulnerable to the following CVEs:
  - [CVE-2024-57699](https://nvd.nist.gov/vuln/detail/CVE-2024-57699)
  - [CVE-2025-24970](https://nvd.nist.gov/vuln/detail/CVE-2025-24970)
  - [CVE-2024-45337](https://avd.aquasec.com/nvd/2024/cve-2024-45337/)
  - [CVE-2024-45338](https://avd.aquasec.com/nvd/2024/cve-2024-45338/)
- Resolved an issue related to SSL checks between the Console and Cortex where bad certificates caused communication issues
- Fixed an issue with user email addresses containing a `'` character that blocked database migrations
- Reduced the memory consumption and improved the performance of metrics under heavy load that prevented them from displaying
- Partner Zones: configuration updates are now applied correctly
- Partner Zones: partners can now utilize consumer groups
