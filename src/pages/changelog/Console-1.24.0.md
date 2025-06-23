---
date: 2024-06-19
title: Extended Self-service, Groups and Permissions support in the CLI, and much more!
description: docker pull conduktor/conduktor-console:1.24.0
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Breaking Changes

#### New Docker image name

We have renamed the Console docker image to `conduktor/conduktor-console` to clarify our product naming.

**This is the last version where we publish our images using both names.**

Please modify your installation to reflect this change in advance of us deprecating the name `conduktor/conduktor-platform`.

```shell
docker pull conduktor/conduktor-console:1.24.0
```

#### Change in ApplicationInstance Resource Type from GROUP to CONSUMER_GROUP

We have renamed the resource type in `ApplicationInstance` from `GROUP` to `CONSUMER_GROUP`. This change is intended to prevent confusion with the newly introduced resources `ApplicationGroup` and `Group`.

```yaml
---
kind: ApplicationInstance
spec:
  resources:
    - type: CONSUMER_GROUP        # Previously: GROUP
      name: "click."
      patternType: PREFIXED
```

### Features

- [Breaking Changes](#breaking-changes)
  - [New Docker image name](#new-docker-image-name)
  - [Change in ApplicationInstance Resource Type from GROUP to CONSUMER\_GROUP](#change-in-applicationinstance-resource-type-from-group-to-consumer_group)
- [Features](#features)
  - [Self-service](#self-service)
  - [Subject](#subject)
  - [ApplicationGroup](#applicationgroup)
  - [Topic Catalog](#topic-catalog)
  - [Manage Groups and Users using the CLI](#manage-groups-and-users-using-the-cli)
  - [Topic list columns Produce Rate and Last Activity](#topic-list-columns-produce-rate-and-last-activity)
  - [Active Data Policies in Topic Consume page](#active-data-policies-in-topic-consume-page)
  - [Quality of Life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)

#### Self-service

There's a host of new functionality available providing a truly powerful self-service release. This comes from the addition of two new resources: Subject and ApplicationGroup.

Application Teams can now manage their Subject resource lifecycle through IaC with the addition of the [Subject](https://docs.conduktor.io/platform/reference/resource-reference/kafka/#subject) object.

A new concept, [ApplicationGroup](https://docs.conduktor.io/platform/reference/resource-reference/self-service/#application-group) lets Application Teams fully organize themselves within their Application scope to restrict who can do what over their resources within Console UI. It's a form of delegated RBAC.

Check out the definitions below and find the full list of resource definitions via the [Resource Reference](https://docs.conduktor.io/platform/reference/resource-reference/) documentation.

#### Subject

This creates a Subject in the Schema Registry.

```yaml
---
apiVersion: v1
kind: Subject
metadata:
  cluster: shadow-it
  name: myPrefix.topic-value
spec:
  schemaFile: schemas/topic.avsc # relative to conduktor CLI execution context
  format: AVRO
  compatibility: FORWARD_TRANSITIVE
```

#### ApplicationGroup

Create an Application Group to directly reflect how your Application operates. You can create as many Application Groups as required to restrict or represent the different teams that use Console on your Application, e.g.:

- Support Team with only Read Access in Production
- DevOps Team with extended access across all environments
- Developers with higher permissions in Dev

```yaml
# Permissions granted to Console users in the Application
---
apiVersion: v1
kind: ApplicationGroup
metadata:
  application: "clickstream-app"
  name: "clickstream-support"
spec:
  displayName: Support Clickstream
  description: |
    Members of the Support Group are allowed:
      Read access on all the resources
      Can reset offsets
  permissions:
    - appInstance: clickstream-app-dev
      resourceType: TOPIC
      patternType: "LITERAL"
      name: "*" # All owned & subscribed topics
      permissions: ["topicViewConfig", "topicConsume"]
    - appInstance: clickstream-app-dev
      resourceType: GROUP
      patternType: "LITERAL"
      name: "*" # All owned consumer groups
      permissions: ["consumerGroupReset", "consumerGroupView"]
  members:
    - alice@company.org
    - bob@company.org
```

#### Topic Catalog

We're expanding on the Topic Catalog, to help teams discover Kafka Topics within your organization. You can now filter on all the topics based on user-defined, business [metadata](https://docs.conduktor.io/platform/navigation/self-serve/#resource-labels).

![topic catalog](/images/changelog/platform/v24/topic-catalog-filter.png)

Looking to request access to another applications resources? You can now generate the required `ApplicationInstancePermission` snippet that grants the necessary access to Topics belonging to another Application.

![topic catalog](/images/changelog/platform/v24/topic-catalog-subscribe.png)

#### Manage Groups and Users using the CLI

Manage your Console Group and Permissions lifecycle through IaC with the addition of the **Group** and **User** objects. Check out the example below and find the full definition via the [Resource Reference](https://docs.conduktor.io/platform/reference/resource-reference/) documentation.

```yaml
---
apiVersion: v2
kind: Group
metadata:
  name: developers-a
spec:
  displayName: "Developers Team A"
  description: "Members of the Team A - Developers"
  externalGroups: 
    - "LDAP-GRP-A-DEV"
  members:
    - member1@company.org
    - member2@company.org
  permissions:
    - resourceType: TOPIC
      cluster: shadow-it
      patternType: PREFIXED
      name: toto-
      permissions:
        - topicViewConfig
        - topicConsume
        - topicProduce
```

#### Topic list columns Produce Rate and Last Activity

We added two new columns to the Topic List to help you troubleshoot and understand Kafka better: Produce Rate & Last Activity.

![topic list](/images/changelog/platform/v24/topic-list-columns.png)

Values are computed once per [Indexing](https://docs.conduktor.io/platform/navigation/console/about-indexing/) (i.e. every 30s):

- Produce Rate is calculated from the two most recent offset values provided by our indexer.
- Last Activity is set to `Datetime.now()` if the latest offsets have changed since the last Indexing

#### Active Data Policies in Topic Consume page

When exploring topics, fields masked by active [Data Policies](https://docs.conduktor.io/platform/navigation/settings/data-masking/) are now displayed in a different color, while the policy name is also now visible on hover.

![img.png](/images/changelog/platform/v24/topic-datamasking.png)

#### Quality of Life improvements

**Topic pages**

- You can now see all subjects associated to the Schema Id of the current message from the Message Viewer panel
- Added message Compression Type metadata in the Message Viewer panel
- Added buttons to navigate to previous and next message in the Message Viewer panel. Also works with the arrow keys
- The "Generate once" feature in the Produce tab now generates much more realistic, randomized messages, especially for Registry schemas and JSON

**Other pages**

- Added a button to force re-balance active Consumer Groups in the Consumer Group details page
- Added a "Test connection" button when adding a KsqlDB cluster in Settings
- Added KsqlDB query Start From selector, equivalent to the `SET 'auto.offset.reset'` command
- Added an icon in the Kafka Connect list to inform that auto-restart feature is active

**API**

- When returning a Forbidden error, the missing permissions are listed in the error message
- New endpoint to add user to a group by email

**Conduktor CLI**  

[Update your Conduktor CLI to 0.2.5](https://docs.conduktor.io/platform/reference/cli-reference/).

- Env Variable changed from `CDK_TOKEN` to `CDK_API_KEY` to set your Admin or Application API Key
- Added support for [Subject](https://docs.conduktor.io/platform/reference/resource-reference/kafka/#subject) field `spec.schemaFile`. Previous versions of the CLI will only accept `spec.schema` inlined.

### Fixes

- Clean monitoring metrics related to brokers that are unreachable
- Fix support of Avro byte arrays encoded as base64 when producing messages
- Fix bulk import of users in case a user already exist
- Fix user creation when the user is not admin but has the right permissions
- Fix class name selector when navigating from one interceptor to another
- External group mapping: support extraction of roles from both string array and comma separated string
- Fix preview of consumer group offset reset when selecting a specific offset
- Data masking: trim name of policy and fix encoding for URL
- Monitoring: show error in UI if cortex is unreachable
- Fix schema that disappeared from the form input when schema was invalid
- Prevent the creation of an application instance with resources that overlaps
- Fix permissions when 2 application instances define resources on the same cluster
- Fixed an issue where apiVersion was displayed at the end using the CLI
