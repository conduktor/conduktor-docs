---
sidebar_position: 5
title: Audit Log
description: List of the Audit Log events tracked throughout the Platform
---

# Audit Log Events

# Overview

As you and your team interact with Conduktor, audit events are captured that give a detailed tracking of actions taken against Kafka. This gives you centralized visibility of user-related and resource-related events. Audit log events.

The audit log events can be browsed, filtered and searched directly within Conduktor's UI or exported from a Kafka topic for any further use you may for them, such as maintaining your own audit trail in other systems.

![Admin Audit](images/admin-audit.png)

Clicking on an event in the audit log exposes event-specific metadata. The below example demonstrates an audit event for a new connector added, which can include metadata such as custom tags, the cluster, connector name and its ID.

![Admin Audit Event](images/audit-log-inspect.png)

Audit log events are also exported to a Kafka topic once configured with the right [environemnt variables](docs/platform/get-started/configuration/env-variables.md#auditlog-export-properties), here you can leverage all the benefits of Conduktor when finding a message.
![kafka message audit log](images/audit-log-kafka-message.png)

## Audit Events

Below outlines the audit events currently tracked by Conduktor.

  - [Console](#console)
  - [Data Masking](#data-masking)
  - [Topic as a Service](#topic-as-a-service)
  - [Admin](#admin)

## Console

### ResourceType: `Topic`

CRN: `kafka:/cluster/<uuid>/topic/<topic-name>`

- topic.ProducedRecord
- topic.Browsed
- topic.Deleted
- topic.Created
- topic.Updated
- topic.Emptied
- topic.Tagged
- topic.Untagged

### ResourceType: `Subject`

CRN `kafka:/cluster/<uuid>/subject/<subject-name>`

- subject.Created
- subject.Updated
- subject.ChangedCompat
- subject.Deleted
- subject.DeletedVersions
- subject.DeletedVersion

### ResourceType: `SchemaRegistry`

CRN `kafka:/cluster/<uuid>`

- registry.ChangedGlobalCompat

### ResourceType: `ConsumerGroup`

CRN `kafka:/cluster/<uuid>/group/<group-name>`

- consumergroup.Created
- consumergroup.Updated (ResetOffsets)
- consumergroup.Deleted

### ResourceType: `Connector`

CRN `kafka:/cluster/<uuid>/connect/<connect-cluster-id>/<connector-name>`

- connector.Created
- connector.Updated
- connector.Deleted
- connector.Restarted
- connector.RestartedTask
- connector.Paused
- connector.Resumed

## Data Masking

### ResourceType: `DatamaskingPolicy`

CRN `platform:/datamasking/<uuid>`

- policy.Upserted
- policy.Deleted

## Self-Service

### ResourceType: `Application`

CRN `platform:/application/<app-slug>`

- application.Created
- application.Deleted
- application.Updated
- application.access-request.Approved
  from / to
- application.access-request.Rejected

## Admin

### ResourceType: `Cluster`

CRN `kafka:/cluster/<uuid>`

- cluster.Created
- cluster.Updated
- cluster.Deleted

### ResourceType: `Group`

CRN `platform:/group/<uuid>`

- group.Created
- group.member.Added
- group.member.Deleted
- group.permission.Added
- group.permission.Deleted

### ResourceType: `User`

CRN `platform:/user/<email>`

- user.Login
- user.permission.Added
- user.permission.Deleted
- user.platform_role.Updated
