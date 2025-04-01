---
date: 2025-04-08
title: Console 1.33
description: docker pull conduktor/conduktor-console:1.33.0
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
- [Scale](#scale)
    - [Kafka Chargeback: Grouping by Labels](#kafka-chargeback-grouping-by-labels)
    - [Improved Cross-Team Access Control in Self-service](#improved-cross-team-access-control-in-self-service)
- [Exchange](#exchange)
- [Quality of life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)
- [Known issues](#known-issues)

### Breaking changes

TODO

### Scale

#### Kafka Chargeback: Grouping by Labels

TODO

#### Improved Cross-Team Access Control in Self-service

We've enhanced permission management for cross-team access. Previously, the permissions was granted simultaneously to both users in the UI and the Kafka service account. 
Now, permissions can be assigned separately, allowing for more precise access control.

This permissions grants the target application instance READ access to the Service Account while denying access to the members of the Application through Console:
````yaml
# Permission granted to other Applications
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


### Exchange


### Quality of life improvements

- TODO

### Fixes

- TODO

### Known issues
In the Topic Consume view, equality filters (`==`) on JSON number fields isn't working correctly when the number exceeds JavaScript's safe integer limit of `2^53-1`. Note that while range operators (`>`, `<`, `>=`, `<=`) still work with large numbers, there's currently no workaround for exact equality filtering. We'll address this in a future release.
