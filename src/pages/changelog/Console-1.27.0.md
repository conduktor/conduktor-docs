---
date: 2024-09-14
title: Kafka Connect Wizard
description: docker pull conduktor/conduktor-console:1.26.0
solutions: console
tags: features,fix
---

## Features ✨

- [Kafka Connect Configuration Wizard](#manage-connectors-using-the-cli)
- [Alerts for Kafka Connect](#alerts-for-kafka-connect)
- [Self-service: Limited Ownership mode](#self-service-limited-ownership-mode)
- [Self-service: External Group Mapping on ApplicationGroup](#self-service-external-group-mapping-on-applicationgroup)



### Kafka Connect Configuration Wizard

### Alerts for Kafka Connect

### Self-service: Limited Ownership mode

### Self-service: External Group Mapping on ApplicationGroup


### Quality of Life improvements
- The checkbox to skip TLS verification is now always visible
- The YAML for Topic object now allows number in `spec.configs`. Previously it was mandatory to quote all numbers.
- Self-service Topic Policies are now visible in the UI

## Fixes 🔨
- Topic Policies from Self-service are now properly enforced from the UI, as well as both the API and CLI
- Fix Kafka Connect Cluster list showing invalid number of running tasks

## Deprecation Warning: Upcoming migration from Tags to Labels 💣
With the introduction of the Self-service resource manifests, we brought customers a means to annotate all their resources with labels. Labels are more structured than the existing Conduktor tags, thereby allowing for more precise filtering capabilities, as can be seen in the Topic Catalog.

In an upcoming release, we'll perform an automatic migration from Tags to Labels.  

Tags written with the naming convention `<key>/<value>` will automatically be added as similar labels:
- `<key>: <value>`  

If there is a conflict such as; a topic containing tags with the same key, that already has the target label, or is not written with this naming convention, then they will be created as follows:
````yaml
tag-<value>: true
````

Here's an example of how tags will be migrated into labels:
````yaml
# Tags:
- format/avro
- project/supplychain
- team/delivery
- color/blue
- color/red
- wikipedia
- non-prod

# Result
labels:
  format: avro
  project: supplychain
  team: delivery
  tag-color/blue: true # Because conflict on "color"
  tag-color/red: true # Because conflict on "color"
  tag-wikipedia: true
  tag-non-prod: true
````

:::warning

We are aware of a critical CVE - [CVE-2024-41110](https://avd.aquasec.com/nvd/2024/cve-2024-41110/) - coming from a dependency of prometheus on the `console-cortex` image. This CVE is related to prometheus docker metric scraping, which is not used by Conduktor.

Regardless, as soon as the prometheus team fix this issue, it will be patched immediately by Conduktor.
:::


⚠️ **Conduktor can help you rename tags through Customer Support**  
Between now and the migration, we can help you rename your tags for a smooth transition to labels.  

[Contact us](https://support.conduktor.io/) as soon as possible if you would like support.