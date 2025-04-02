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
    - [Support of Aiven service accounts](#support-of-aiven-service-accounts)
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
We've added the support of Aiven service accounts in our API and CLI. See [service account resource definition](/platform/reference/resource-reference/kafka.md) for details. 

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

- Add selectors for key and value formats on the single Kafka message page, enabling the use of customer deserializers.

### Fixes

- Glue: improve deserialization of Avro schemas containing a nullable union
- Fixed an issue preventing the use of protobuf schemas with references
- Improved performance of API for applying users and groups with many permissions
- Bypass Self-service topic policies when using an admin API key
- Errors thrown while producing to a topic are now properly displayed in the UI
- Fixed the computation of the controller of a KRaft cluster in the Brokers page
- Fixed an issue that prevented the storage of the NUL character in Kafka Connect error messages
- Log error when failing to create the topic for audit log

### Known issues

In the Topic Consume view, equality filters (`==`) on JSON number fields aren't working correctly when the number exceeds JavaScript's safe integer limit of `2^53-1`. Note that while range operators (`>`, `<`, `>=`, `<=`) still work with large numbers, there's currently no workaround for exact equality filtering. We'll address this in a future release.
