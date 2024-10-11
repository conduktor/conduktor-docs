---
sidebar_position: 5
title: Audit Log
description: List of the Audit Log events tracked throughout the Platform
---

# Audit Log Events


- [Overview](#overview)
- [Audit Events](#audit-events)
- [Console](#console)
  - [ResourceType: `Topic`](#resourcetype-topic)
  - [ResourceType: `Subject`](#resourcetype-subject)
  - [ResourceType: `SchemaRegistry`](#resourcetype-schemaregistry)
  - [ResourceType: `ConsumerGroup`](#resourcetype-consumergroup)
  - [ResourceType: `Connector`](#resourcetype-connector)
- [Data Masking](#data-masking)
  - [ResourceType: `DatamaskingPolicy`](#resourcetype-datamaskingpolicy)
- [Self-Service](#self-service)
  - [ResourceType: `Application`](#resourcetype-application)
- [Admin](#admin)
  - [ResourceType: `Cluster`](#resourcetype-cluster)
  - [ResourceType: `Group`](#resourcetype-group)
  - [ResourceType: `User`](#resourcetype-user)
- [Exportable Audit Log Events](#exportable-audit-log-events)
  - [Kafka-Related Events](#kafka-related-events)
  - [IAM-Related Events](#iam-related-events)
  - [SelfService-Related Events](#selfservice-related-events)
  - [Admin-Related Events](#admin-related-events)


# Overview

As you and your team interact with Conduktor, audit events are captured that give a detailed tracking of actions taken against Kafka. This gives you centralized visibility of user-related and resource-related events. Audit log events.

The audit log events can be browsed, filtered and searched directly within Conduktor's UI or exported from a Kafka topic for any further use you may have for them, such as maintaining your own audit trail in other systems.

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

## Exportable Audit Log Events

Audit log events from within the UI are being superceeded by a new set of audit log events that are exportable from a Kafka topic. The exportable audit log events have more detail, providing additional information about the event that has taken place.  

The events conform to the [CloudEvents specification](https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md), a vendor-neutral format that follows the following structure:

```json
{
    "specversion" : "1.0",
    "type" : "com.github.pull_request.opened",
    "source" : "https://github.com/cloudevents/spec/pull",
    "subject" : "123",
    "id" : "A234-1234-1234",
    "time" : "2018-04-05T17:31:00Z",
    "comexampleextension1" : "value",
    "comexampleothervalue" : 5,
    "datacontenttype" : "text/xml",
    "data" : "<much wow=\"xml\"/>"
}
```

An example Conduktor event would look like:
```json
{
	"source": "//kafka/kafkacluster/production/topic/website-orders",
	"data": {
		"eventType": "Kafka.Topic.Create",
		// Additional event specific data...
		"metadata": {
			"name": "website-orders",
			"cluster": "production"
		}
		// Additional event specific metadata...
	},
	"datacontenttype": "application/json",
	"id": "ad85122c-0041-421e-b04b-6bc2ec901e08",
	"time": "2024-10-10T07:52:07.483140Z",
	"type": "AuditLogEventType(Kafka,Topic,Create)",
	"specversion": "1.0"
}
```

Below is the list of all the exported audit log event types, that are currently available. We are expanding the coverage to UI events and more in subsequent releases.  

### Kafka-Related Events

| **Event Type**             | **Description**             |
| -------------------------- | --------------------------- |
| **Kafka.Subject.Create**   | Kafka subject is created.   |
| **Kafka.Subject.Update**   | Kafka subject is updated.   |
| **Kafka.Subject.Delete**   | Kafka subject is deleted.   |
| **Kafka.Topic.Create**     | Kafka topic is created.     |
| **Kafka.Topic.Update**     | Kafka topic is updated.     |
| **Kafka.Topic.Delete**     | Kafka topic is deleted.     |
| **Kafka.Topic.Empty**      | Kafka topic is emptied.     |
| **Kafka.Connector.Create** | Kafka connector is created. |
| **Kafka.Connector.Update** | Kafka connector is updated. |
| **Kafka.Connector.Delete** | Kafka connector is deleted. |

### IAM-Related Events

| **Event Type**       | **Description**       |
| -------------------- | --------------------- |
| **Iam.User.Create**  | IAM user is created.  |
| **Iam.User.Update**  | IAM user is updated.  |
| **Iam.User.Delete**  | IAM user is deleted.  |
| **Iam.Group.Create** | IAM group is created. |
| **Iam.Group.Update** | IAM group is updated. |
| **Iam.Group.Delete** | IAM group is deleted. |

### SelfService-Related Events

| **Event Type**                                       | **Description**                                 |
| ---------------------------------------------------- | ----------------------------------------------- |
| **SelfService.Application.Create**                   | Self-service application is created.            |
| **SelfService.Application.Update**                   | Self-service application is updated.            |
| **SelfService.Application.Upsert**                   | Self-service application is created or updated. |
| **SelfService.Application.Delete**                   | Self-service application is deleted.            |
| **SelfService.ApplicationInstance.Create**           | Self-service application instance is created.   |
| **SelfService.ApplicationInstance.Update**           | Self-service application instance is updated.   |
| **SelfService.ApplicationInstance.Delete**           | Self-service application instance is deleted.   |
| **SelfService.ApplicationGroup.Create**              | Self-service application group is created.      |
| **SelfService.ApplicationGroup.Update**              | Self-service application group is updated.      |
| **SelfService.ApplicationGroup.Delete**              | Self-service application group is deleted.      |
| **SelfService.ApplicationPolicy.Create**             | Self-service application policy is created.     |
| **SelfService.ApplicationPolicy.Update**             | Self-service application policy is updated.     |
| **SelfService.ApplicationPolicy.Delete**             | Self-service application policy is deleted.     |
| **SelfService.ApplicationInstancePermission.Create** | Permissions are created for an app instance.    |
| **SelfService.ApplicationInstancePermission.Delete** | Permissions are deleted for an app instance.    |

### Admin-Related Events

| **Event Type**                | **Description**                         |
| ----------------------------- | --------------------------------------- |
| **Admin.KafkaConnect.Create** | Admin creates a Kafka Connect instance. |
| **Admin.KafkaConnect.Update** | Admin updates a Kafka Connect instance. |
| **Admin.KafkaConnect.Delete** | Admin deletes a Kafka Connect instance. |
| **Admin.KsqlDB.Create**       | Admin creates a KsqlDB instance.        |
| **Admin.KsqlDB.Update**       | Admin updates a KsqlDB instance.        |
| **Admin.KsqlDB.Delete**       | Admin deletes a KsqlDB instance.        |
| **Admin.KafkaCluster.Create** | Admin creates a Kafka cluster.          |
| **Admin.KafkaCluster.Update** | Admin updates a Kafka cluster.          |
| **Admin.KafkaCluster.Delete** | Admin deletes a Kafka cluster.          |
