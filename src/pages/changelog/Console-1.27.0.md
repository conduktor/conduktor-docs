---
date: 2024-09-14
title: Kafka Connect Wizard
description: docker pull conduktor/conduktor-console:1.27.0
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Features ✨](#features-)
  - [Kafka Connect Configuration Wizard](#kafka-connect-configuration-wizard)
  - [Alerts for Kafka Connect](#alerts-for-kafka-connect)
  - [Self-service: Limited Ownership mode](#self-service-limited-ownership-mode)
  - [Quality of Life improvements](#quality-of-life-improvements)
- [Fixes 🔨](#fixes-)
- [Deprecation Warning: Upcoming migration from Tags to Labels](#deprecation-warning-upcoming-migration-from-tags-to-labels-)
## Features ✨

### Kafka Connect Configuration Wizard

We are very excited to introduce our Configuration Wizard for Kafka Connect which is taking full advantage of the Kafka Connect Validate API:
- Form is generated with structured configuration groups
- Much nicer error handling, attached to each individual field
- Embedded documentation that helps you understand which fields are required and what are their expected and default values
- Ability to toggle advanced configuration to visualize only the most important fields
- Ability to switch seamlessly between Form View and JSON View at any time.

![Kafka Connect Wizard](/images/changelog/platform/v27/kafka-connect-wizard.png)

Give it a try and let us know what you think!

### Alerts for Kafka Connect

On top of the Kafka Connect Graphs we shipped last release, we now have added the ability to create alerts on them.
![Kafka Connect Alerts](/images/changelog/platform/v27/kafka-connect-alerts.png)

### Self-service: Limited Ownership mode
To help organizations transition to Self-service more easily, we have added a new attribute on ApplicationInstance to let Platform Teams decide the level of autonomy to give to Application Teams.  
- ApplicationInstance resources configured with `ownershipMode: ALL`, which is the default, delegates all permissions related to that resource to the Application Team
- ApplicationInstance resources configured with `ownershipMode: LIMITED` delegates only a subset of the available permissions to the Application Team

This is especially useful if you already have a centralized repository and existing workflow for Topic creation. You may want to provide Self-service capabilities while still forcing your Application Teams to go through your pipeline for Topic Creation, instead of Self-service.

 - [Read more about Limited Ownership mode](/platform/navigation/self-serve)
 - [Get Started with Self-service today!](https://docs.conduktor.io/platform/navigation/self-serve#limited-ownership-mode)

### Quality of Life improvements
- Self-service: External Group Mapping is now available for [ApplicationGroup](/platform/reference/resource-reference/self-service/#application-group)
- The Login page now steers users towards their OIDC provider rather than basic auth when OIDC is enabled

## Fixes 🔨
- Fixed an issue on Consumer group reset offset with the ToDatetime strategy
- Fixed an issue with Console indexing that could occur when deleting and recreating subject
- Fixed a recent regression with default replication factor when creating a topic
- Fixed a recent regression with Broker feature "Similar config" calculation
- Fixed a UI issue when Application Instance was created without any resources
- Fixed several issues around Microsoft Teams Integration to support Teams Workflow webhooks ([Step by step guide](https://docs.conduktor.io/platform/navigation/settings/integrations/))
- Fixed Kafka Connect client to use HTTP Proxy JVM configuration
- Switching Kafka cluster from the Topic details page now redirects to the Topic List
- Console doesn't override the client.id property anymore

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

⚠️ **Conduktor can help you rename tags through Customer Support**  
Between now and the migration, we can help you rename your tags for a smooth transition to labels.  

[Contact us](https://support.conduktor.io/) as soon as possible if you would like support.


:::warning

We are aware of a critical CVE - [CVE-2024-41110](https://avd.aquasec.com/nvd/2024/cve-2024-41110/) - coming from a dependency of prometheus on the `console-cortex` image. This CVE is related to prometheus docker metric scraping, which is not used by Conduktor.

Regardless, as soon as the prometheus team fix this issue, it will be patched immediately by Conduktor.
:::