---
date: 2025-06-17
title: Console 1.35
description: docker pull conduktor/conduktor-console:1.35.0
solutions: console
tags: features,fixes
---

_Release date: {frontMatter.date.toISOString().slice(0, 10)}_

- [Conduktor Scale](#conduktor-scale)
  - [Resource policies now cover subject and applicationGroup](#resource-policies-now-covers-subject-and-applicationgroup)
  - [Revamped Application Catalog](#revamped-application-catalog)
  - [Topic-level consumer group lag alerts](#topic-level-consumer-group-lag-alerts)
- [Conduktor Exchange](#conduktor-exchange)
- [Conduktor Trust](#conduktor-trust)
- [Quality of life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)
- [Known issues](#known-issues)

### Conduktor Scale

#### Resource policies now covers Subject and ApplicationGroup

Central platform teams can further define the ways of working for their teams by assigning resource policies for subjects and application groups. A few interesting use cases include:

- Restricting application teams to only using Avro or enforce a specific compatibility mode, such as FORWARD_TRANSITIVE.
- Preventing application teams from adding members to application groups directly, directing them to use the external group mapping instead.
- Limiting the actions that can be performed in the UI by locking certain permissions.

```yaml
---
apiVersion: self-service/v1
kind: ResourcePolicy
metadata:
  name: 'applicationgroup-restrictions'
  labels:
    business-unit: delivery
spec:
  targetKind: ApplicationGroup
  description: Enfore External Group Mapping and prevent TopicDelete permission in ApplicationGroup
  rules:
    - condition: size(metadata.members) == 0
      errorMessage: spec.members not allowed. Use external group mapping instead
    - condition: '!spec.permissions.exists(p, p.permissions.exists(x, x == "TopicDelete"))'
      errorMessage: TopicDelete permission is not allowed. Topic must only be deleted via CLI

---
apiVersion: self-service/v1
kind: ResourcePolicy
metadata:
  name: 'subject-format-and-compatibility-policy'
  labels:
    business-unit: delivery
spec:
  targetKind: Subject
  description: Enforces allowed schema formats and compatibility level for subjects
  rules:
    - condition: spec.format in ["AVRO", "PROTOBUF"]
      errorMessage: Only AVRO or PROTOBUF formats are allowed
    - condition: spec.compatibility == "FORWARD_TRANSITIVE"
      errorMessage: compatibility mode must be FORWARD_TRANSITIVE
```

ResourcePolicy that target ApplicationGroup must be defined at the Application level:

```yaml
# Application
---
apiVersion: self-service/v1
kind: Application
metadata:
  name: 'clickstream-app'
spec:
  title: 'Clickstream App'
  description: 'FreeForm text, probably multiline markdown'
  owner: 'groupA' # technical-id of the Conduktor Console Group
  policyRef:
    - 'applicationgroup-restrictions'
```


Additionally, ResourcePolicy targeting `Topic`, `Subject` or `Connector` configured at Application level will be applied to all Application Instances under that Application.

#### Revamped Application Catalog

The **Application Catalog** page has been completely redesigned to improve application discovery and team collaboration.

The new application list page provides a unified view of all accessible applications with advanced search and filtering capabilities, including filtering by ownership and labels. Clear team ownership visibility, topic and subscription information, as well as hover cards showing instance details at a glance will help you find what you need quickly.

![Application Catalog](/images/changelog/platform/v35/app-catalog.png)

The enhanced application details page now supports adding application labels for better categorization and organization. A new dedicated access requests page provides better management of requests specific to each application, making it easier to track and handle permission requests while maintaining clear visibility into application access patterns.

#### Topic-level consumer group lag alerts

Consumer group lag alerts now support topic-level scoping, allowing you to create more focused alerts for specific topics within a consumer group instead of monitoring the entire group.

This makes it easier for teams sharing consumer groups who need topic-specific visibility.

### Conduktor Exchange

### Conduktor Trust

### Quality of life improvements

- Added new fields to the onboarding page.
- CRUD operations for the labels added in the consumer group details page.

### Fixes

- Fixed an issue where changing the cluster did not clear the search filter in consumer groups and topic pages.
- Fixed an issue where navigating to a schema registry with a name containing non-escaped characters such as `/` would redirect to the home page.
- Fixed an issue where the equality filter on JSON number fields wasn't working correctly against large numbers in the topic consume view.
- The JSON view of a message in a topic no longer coerces large number fields to a string.
- Fixed an issue where the full message was not displayed correctly in the tooltip when hovering over it in the topic consume view table.
- Fixed an issue where the UI didn't redirect to the correct cluster when switching Console instances.
- Fixed the logo in the onboarding page dark mode.
- The screenshot showing users how to find the project name and service name in Aiven Cloud is displayed correctly again.
- Fixed an error that would occur when no partitions were selected in Topics page filters.
- Fixed a bug that would cause service accounts with white spaces to not be accessible correctly.

### Known issues

```

```
