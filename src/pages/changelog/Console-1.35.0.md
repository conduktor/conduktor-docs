---
date: 2025-06-18
title: Console 1.35
description: docker pull conduktor/conduktor-console:1.35.0
solutions: console
tags: features,fixes
---

_Release date: {frontMatter.date.toISOString().slice(0, 10)}_

- [Conduktor Scale](#conduktor-scale)
- [Conduktor Exchange](#conduktor-exchange)
- [Conduktor Trust](#conduktor-trust)
- [Quality of life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)
- [Known issues](#known-issues)

### Conduktor Scale

#### Resource Policies now covers Subject and ApplicationGroup

Central Platform Teams can further define the ways of working for their Application Teams by assigning resource policies for Subjects and Application Groups.  
A few interesting use cases include:

- Restrict Application Teams to only using Avro, or enforce a specific compatibility mode such as FORWARD_TRANSITIVE.
- Prevent Application Teams from adding members to Application Groups directly, steering them toward External Group Mapping instead.
- Limit the actions that can be performed in the UI by locking some permissions away.

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

### Conduktor Exchange

### Conduktor Trust

### Quality of life improvements

- Leading and trailing white spaces will now be printed as "⎵" for display purposes and to provide more clarity to user. A tooltip will additionally be added to let users know when this is happening and to give them the "raw" value if they need it. The actual value will not be changed, this is just a visual helper.
- Improve container [security context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context) configuration on Conduktor Console and Cortex containers that allow to :
  - **run with differents UID and GID** than default `10001:0`
  - run **unprivileged** with all **linux capabilities dropped**

### Fixes

- Fixed an issue where changing the cluster did not clear the search filter in Consumer Groups / Topics pages.
- Fixed an issue where navigating to a schema registry with a name containing non-escaped characters such as `/` would redirect to the home page.
- Fixed an issue where the equality filter on JSON number fields was not working correctly against large numbers in the Topic Consume view.
- The JSON view of a message in a topic no longer coerces large number fields to a string.
- Fixed an issue where the full message was not displayed correctly in the tooltip when hovering over it in the Topic Consume view table.
- The screenshot showing users how to find the project name and service name in Aiven Cloud is displayed correctly again.
- Fixed an error that would occur when no partitions were selected in Topics page filters.
- Fixed a bug that would cause service accounts with white spaces to not be accessible correctly.
- Cleanup data volume on start to ensure that old data is not re-used when using persistant volume between restarts.

### Known issues

```

```
