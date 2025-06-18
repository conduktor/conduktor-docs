---
date: 2024-05-03
title: Self-service, Topic Catalog, customizable Consume screen and much more!
description: docker pull conduktor/conduktor-console:1.23.0
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Future Breaking Changes

#### New Docker image name
We have renamed the Console docker image to `conduktor/conduktor-console` to clarify our product naming.

We will publish newer versions using both names for this release and the **next release** only. Please modify your installation to reflect this change in advance of us deprecating the name `conduktor-platform`.

````shell
docker pull conduktor/conduktor-console:1.23.0
````

### Features

 - [Self-service](#self-service)
      - [Topic](#topic)
      - [TopicPolicy](#topicpolicy)
      - [Topic Catalog](#topic-catalog)
      - [Application API Keys](#application-api-keys)
    - [Editable columns on the Consume Page](#editable-columns-on-the-consume-page)
    - [Quality of Life improvements](#quality-of-life-improvements)
  - [Fixes](#fixes)

---

#### Self-service

There's a host of new functionality available providing our first truly powerful self-service release. This comes from the addition of two new resources (Topic, TopicPolicy), application tokens, a topic catalog and service account synchronization.

Application Teams can now manage their Topic resource lifecycle through IaC with the addition of the [Topic](https://docs.conduktor.io/platform/reference/resource-reference/kafka/#topic) object, and they can do this safely with Platform Teams putting in place a [Topic Policy](https://docs.conduktor.io/platform/reference/resource-reference/self-service/#topic-policy) to restrict expensive configurations and enforce naming standards.  

Checkout the definitions below and find the full list of resource definitions via the [Resource Reference](https://docs.conduktor.io/platform/reference/resource-reference/) documentation.

#### Topic

This creates a Topic in the defined cluster.

```yaml
---
apiVersion: v2
kind: Topic
metadata:
  cluster: shadow-it
  name: click.event-stream.avro
spec:
  replicationFactor: 3
  partitions: 3
  configs:
    min.insync.replicas: '2'
    cleanup.policy: delete
    retention.ms: '60000'
```

#### TopicPolicy

TopicPolicy lets Platform Team define governance rules to restrict Application Teams to create Topics with misconfigurations.
This is also useful to enforce naming convention or metadata annotation by Application Teams.
```yaml
---
apiVersion: "v1"
kind: "TopicPolicy"
metadata:
  name: "click-naming-rule"
spec:
  policies:
    metadata.name:
      constraint: Match
      pattern: ^click\.(?<event>[a-z0-9-]+)\.(avro|json)$
    spec.replication.factor:
      constraint: OneOf
      values: ["3"]
    spec.configs.retention.ms:
      constraint: Range
      max: 604800000  # 7d 
      min: 3600000    # 1h
```

#### Topic Catalog

We've introduced the Topic Catalog, to help teams discover Kafka Topics within your organization. Quickly get visbility on ownership and business metadata on your choice for topics.

Add topics to applications to see them appear within the catalog across all your clusters, searchable by name and labels.

![topic catalog](/images/changelog/platform/v23/TopicCatalog.png)

#### Application API Keys

Generate ApplicationInstance API Keys to create any ApplicationInstance scoped resources.
Only ApplicationInstancePermission and Topic are supported at the moment.

Use this Key with the CLI to use it manually or within CI/CD pipelines.

In addition, Service Account's ACLs are now synchronized with the permissions from ApplicationInstance and ApplicationInstancePermission resources.

[Read More about Self-service](https://docs.conduktor.io/platform/navigation/self-serve/)

#### Editable columns on the Consume Page

You can now customise the columns you want to display in the Consume Page. Let us know if there's any additional metadata you want to see!

![Editable Columns](/images/changelog/platform/v23/qol-consume.png)

#### Quality of Life improvements
**Topic pages**
- SchemaId is now displayed from the Message Viewer panel
- Header count is now displayed from the Message Viewer panel
- The More Options "..." button has been moved so that it's available from every Topic details tab
- Added a check to prevent producing empty keys to a compacted topic
- Added an "Add partitions" button in Partitions tab

**Schema Registry pages**
- The current schema is now inside a read-only area
- Increased the width of the side panel when creating/updating schemas
- Full height is used in the panel to show/edit the schema

**Kafka Connect pages**
- Kafka Connect List can now be sorted by the number of Tasks
- Removing a Connector now properly redirects the user to the Connector list instead of the Configuration tab of the deleted Connector
- Topics column is now sourced from more configuration keys (`kafka.topic`, `kafka.topics`, `topic`, `topics`)

**Settings**
- Permissions on KafkaConnect and ksqlDB now properly display the name instead of the UUID
- Adding Users to Groups can now be done from the User details page directly
- Added the Group name in the UI to be used in the API or CLI

**Other**
- Added Gateway version on the Interceptor List page
- Added a configuration option to toggle OIDC logout when logging out from Console
- Searching in screens now trims whitespace from the text supplied

### Fixes
- Fixed an issue with the Test Connection button that didn't work after a successful response
- Fixed an issue with the indexing of Confluent Cloud Managed Connect
- Fixed an issue with the Kafka Connect List where filter by Connect Cluster wouldn't work in some cases
- Fixed an issue with the Schema Registry indexer not properly handling a retriable HTTP error (GOAWAY)
- Fixed an issue with the timezone selector scrolling when resetting offsets for a Consumer Group by timestamp
- Fixed an issue with SSO in Azure environments for users who are members of a large amount of Azure groups
- The following fixes have also been back-ported in 1.22.1
  - Fixed an issue where two ACLs of the same name but with different pattern types (PREFIXED and LITERAL) were merged to the same group within the UI
  - Fixed an issue with OIDC login that could cause an expired session to become stuck and prevent login attempts
  - Fixed an issue with ksqlDB caused by not escaping the Stream or Table name in the query
