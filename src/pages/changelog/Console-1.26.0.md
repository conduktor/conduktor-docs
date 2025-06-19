---
date: 2024-08-14
title: Console High Availability, Self-service Kafka Connect and more!
description: docker pull conduktor/conduktor-console:1.26.0
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

:::warning

We are aware of a critical CVE - [CVE-2024-41110](https://avd.aquasec.com/nvd/2024/cve-2024-41110/) - coming from a dependency of prometheus on the `console-cortex` image. This CVE is related to prometheus docker metric scraping, which is not used by Conduktor. 

Regardless, as soon as the prometheus team fix this issue, it will be patched immediately by Conduktor. 
:::

### Features

- [Manage Connectors using the CLI](#manage-connectors-using-the-cli)
- [Self-service support for Connectors](#self-service-support-for-connectors)
- [Enhanced UI and graphs for Kafka Connect](#enhanced-ui-and-graphs-for-kafka-connect)
- [Quality of life improvements](#quality-of-life-improvements)
- [Deprecation warning: Upcoming migration from Tags to Labels](#deprecation-warning-upcoming-migration-from-tags-to-labels)

#### Manage Connectors using the CLI

Continuing with the Infra-as-code approach, we are happy to introduce [CLI support](https://docs.conduktor.io/platform/reference/cli-reference/) for [Connectors](https://docs.conduktor.io/platform/reference/resource-reference/kafka/#connector), providing an efficient and automated way to manage your Kafka Connect resources.

````yaml
---
apiVersion: kafka/v2
kind: Connector
metadata:
  connectCluster: kafka-connect
  name: click.my-connector
  labels:
    conduktor.io/auto-restart-enabled: true
    conduktor.io/auto-restart-frequency: 600
spec:
  config:
    connector.class: 'org.apache.kafka.connect.tools.MockSourceConnector'
    tasks.max: '1'
    topic: click.pageviews
````

#### Self-service support for Connectors

Application Teams can now manage their Connectors with Self-service.  
From now on, you can grant ownership to connectors on Self-service [application instance](https://docs.conduktor.io/platform/reference/resource-reference/self-service/#application-instance).
````yaml
---
apiVersion: self-service/v1
kind: ApplicationInstance
metadata:
  application: "clickstream-app"
  name: "clickstream-dev"
spec:
  cluster: "shadow-it"
  serviceAccount: "sa-clicko"
  resources:
    - type: CONNECTOR
      connectCluster: shadow-connect
      patternType: PREFIXED
      name: "click."
````

#### Enhanced UI and graphs for Kafka Connect

We have revisited the Kafka Connect UI in multiple ways to improve your experience:

- Connect Cluster selection screen with a preview of Connector status
- New graphs demonstrating the state of your Connector over time

![Kafka Connect Graphs](/images/changelog/platform/v26/console-connect-graphs.png)

#### Support for High Availability (HA) Console

Multiple Console instances can now be deployed in parallel to achieve high availability. 

This applies to the deployment of `conduktor-console`, while `conduktor-console-cortex` is currently limited to a single instance. The design ensures minimal impact on the cluster by assigning only one instance to handle the indexing of Kafka data used for performance monitoring.

#### Quality of life improvements

- The checkbox to skip TLS verification is now always visible
- The YAML for Topic object now allows number in `spec.configs`. Previously it was mandatory to quote all numbers.
- Self-service Topic Policies are now visible in the UI

### Fixes

- Topic Policies from Self-service are now properly enforced from the UI, as well as both the API and CLI
- Fix Kafka Connect Cluster list showing invalid number of running tasks

#### Deprecation warning: upcoming migration from Tags to Labels

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
