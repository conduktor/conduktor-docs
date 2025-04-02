---
date: 2025-04-08
title: Console 1.33
description: docker pull conduktor/conduktor-console:1.33.0
solutions: console
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
- [Scale](#scale)
    - [Kafka Chargeback: Group by labels](#kafka-chargeback-group-by-labels)
    - [Self-service: Improved cross-team access control](#self-service-improved-cross-team-access-control)
    - [Support of Aiven service acocunts](#support-of-aiven-service-accounts)
- [Exchange](#exchange)
    - [Change/fix for Exchange](#changes-for-exchange)
- [Quality of life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)
- [Known issues](#known-issues)

### Breaking changes

TODO

### Scale

#### Kafka Chargeback: group by labels

TODO

#### Self-service: Improved cross-team access control

We've enhanced permission management for cross-team access. You can now assign different permissions to users in the UI from the Kafka service accounts, allowing for more precise access control.

Here's an example granting READ access to the service account and denying access to members of the application through Console:

````yaml
# Permission granted to other applications
---
apiVersion: self-service/v1
kind: ApplicationInstancePermission
metadata:
  application: "clickstream-app"
  appInstance: "clickstream-app-dev"
  name: "clickstream-app-dev-to-another"
spec:
  resource:
    type: TOPIC
    name: "click.event-stream.avro"
    patternType: LITERAL
  userPermission: NONE
  serviceAccountPermission: READ
  grantedTo: "another-appinstance-dev"
````

#### Support of Aiven service accounts
We've added the support of Aiven service accounts in our API and CLI. For more information, please refer to the [Service account resource definition](/platform/reference/resource-reference/kafka.md). 

Here's an example granting read and write access to the `click.event-stream.avro` topic and its schema.

````yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  cluster: aiven
  name: clickstream-sa
spec:
  authorization:
    type: AIVEN_ACL
    acls:
      - resourceType: TOPIC
        name: 'click.event-stream.avro'
        permission: readwrite
      - type: SCHEMA
        name: 'Subject:click.event-stream.avro'
        permission: schema_registry_write
````

### Exchange

#### Changes for Exchange

TO DO

### Quality of life improvements

- TODO

### Fixes

- TODO

### Known issues

In the Topic Consume view, equality filters (`==`) on JSON number fields aren't working correctly when the number exceeds JavaScript's safe integer limit of `2^53-1`. Note that while range operators (`>`, `<`, `>=`, `<=`) still work with large numbers, there's currently no workaround for exact equality filtering. We'll address this in a future release.
