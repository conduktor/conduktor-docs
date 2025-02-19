---
date: 2025-02-18
title: Hotfix for Console 1.31.0
description: docker pull conduktor/conduktor-console:1.31.1
solutions: console
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

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

### Console metrics performance and configuration

This release improves performance and reduces memory consumption of the metrics.
If your Kafka clusters have many topics and partitions, we recommend enabling aggregated metrics to reduce the number of metrics exposed in the metrics endpoint, scraped by Cortex. You can enable this **without de-activating non-aggregated metrics**.

:::warning
Aggregated metrics will be enabled by default in an upcoming release.
:::

:::info
To have metrics visible in the UI, ensure that one of these settings (aggregated or non-aggregated metrics) is enabled.
:::

#### Configuration properties

| Property                                    | Description                                      | Environment variable                         | Mandatory | Type    | Default |
|---------------------------------------------|--------------------------------------------------|----------------------------------------------|-----------|---------|---------|
| `monitoring.use-aggregated-metrics`         | Enables aggregated metrics            | `CDK_MONITORING_USE_AGGREGATED_METRICS`      | No        | Boolean | `false` |
| `monitoring.enable-non-aggregated-metrics`  | Enables non-aggregated metrics     | `CDK_MONITORING_ENABLENONAGGREGATEDMETRICS`  | No        | Boolean | `true`  |

See [metric configuration](platform/get-started/configuration/env-variables/#configure-console-metrics) for details.
