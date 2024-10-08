---
date: 2024-10-14
title: Conduktor SQL
description: docker pull conduktor/conduktor-console:1.28.0
solutions: console
tags: features,fix
---

- [Features ✨](#features-)
  - [Conduktor SQL](#conduktor-sql)
  - [Shareable Filters](#shareable-filters)
  - [Tags becomes Labels](#tags-becomes-labels)
  - [Audit Log events into Kafka](#audit-log-events-into-kafka)
  - [Quality of Life improvements](#quality-of-life-improvements)
- [Fixes 🔨](#fixes-)

## Features ✨

### Conduktor SQL

### Monitoring improvements
We are migrating our Monitoring dashboards into each individual resource pages.  
This migration will happen over the next few releases and our objective is to remove the existing Monitoring pages by integrating them into the dedicated resource pages in Console:
- Overview will be refactored into Home page
- **Cluster Health** dashboards and alerts will move under Brokers page
- **Topic monitoring** will be integrated with Topics page
- Apps monitoring will be integrated with Consumer Groups pages
- Alerts will be integrated as tabs in all the resource pages, similar to the recent changes Kafka Connect

For this release 1.25.0, we are migrating **Cluster Health** and **Topic monitoring** pages.

#### Brokers page
The charts and alerts are now available under the Brokers page. We have cleaned the graphs 
We have removed two metrics that were not possible to calculate correctly since the removal of JMX integration back in release 1.15 (May 2023)
- Active Controller Count
- Unclean Leader Election

![Kafka Connect Wizard](/images/changelog/platform/v28/topic-monitoring.png)

#### Topic Monitoring
![Kafka Connect Wizard](/images/changelog/platform/v28/topic-monitoring.png)

#### New Alerts
As part of this improvement, we have also reimagined our alert definitions to pave the way to declaring Alerts via API or CLI.  
Unfortunately, the existing alerts will not be migrated to the new Alert model.  
The existing alerts are still working properly but the new recommendation is to create Broker and Topic alerts using the new V2 Alerts.


### Shareable Filters

### Tags becomes Labels

First topics, but we'll extend this to all resources.

### Audit Log events into Kafka

### Quality of Life improvements
- TODO

## Fixes 🔨
- CONS-1776 Fixed an issue with Topic Policy constraint Range where max value wasn't inclusive
- CONS-1774 Fixed an issue with the "New version" button in the banner that was still showing despite being on the latest version
- 


:::warning

We are aware of a critical CVE - [CVE-2024-41110](https://avd.aquasec.com/nvd/2024/cve-2024-41110/) - coming from a dependency of prometheus on the `console-cortex` image. This CVE is related to prometheus docker metric scraping, which is not used by Conduktor.

Regardless, as soon as the prometheus team fix this issue, it will be patched immediately by Conduktor.
:::