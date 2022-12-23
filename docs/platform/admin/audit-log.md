---
sidebar_position: 2
title: Audit Log
description: List of the Audit Log events tracked throughout the Platform
---

# Audit Log Events

:::info
Audit log is an Enterprise feature. Please [contact us](https://www.conduktor.io/contact) to discuss getting access.
:::

When you navigate Conduktor, we capture audit events that give you detailed tracking of actions relating to Kafka. This gives you centralized visibility of user-related and resource-related events. 

Below outlines the audit events currently tracked by Conduktor.

## Console
### ResourceType: `Topic`
CRN: `kafka:/cluster/<uuid>/topic/<topic-name>`  
- cdk.devtools.topic.ProducedRecord
- cdk.devtools.topics.Browsed
- cdk.devtools.topic.Deleted
- cdk.devtools.topic.Created
- cdk.devtools.topic.Updated
- cdk.devtools.topic.Emptied  
### ResourceType: `Subject`
CRN `kafka:/cluster/<uuid>/subject/<subject-name>`
- cdk.devtools.subject.Created
- cdk.devtools.subject.Updated
- cdk.devtools.subject.ChangedCompat
- cdk.devtools.subject.Deleted
- cdk.devtools.subject.DeletedVersions
- cdk.devtools.subject.DeletedVersion
### ResourceType: `SchemaRegistry`
CRN `kafka:/cluster/<uuid>`
- cdk.devtools.registry.ChangedGlobalCompat
### ResourceType: `ConsumerGroup`
CRN `kafka:/cluster/<uuid>/group/<group-name>`
- cdk.devtools.consumergroup.Created
- cdk.devtools.consumergroup.Updated (ResetOffsets)
- cdk.devtools.consumergroup.Deleted
### ResourceType: `Connector`
CRN `kafka:/cluster/<uuid>/connect/<connect-cluster-id>/<connector-name>`
- cdk.devtools.connector.Created
- cdk.devtools.connector.Updated
- cdk.devtools.connector.Deleted
- cdk.devtools.connector.Restarted
- cdk.devtools.connector.RestartedTask
- cdk.devtools.connector.Paused
- cdk.devtools.connector.Resumed
## Data Masking
### ResourceType: `DatamaskingPolicy`
CRN `platform:/datamasking/<uuid>`
- cdk.datamasking.policy.Upserted
- cdk.datamasking.policy.Deleted

## Topic as a Service
### ResourceType: `Application`
CRN `platform:/application/<app-slug>`
- cdk.taas.application.Created
- cdk.taas.application.Deleted
- cdk.taas.application.Updated
- cdk.taas.application.access-request.Approved
from / to
- cdk.taas.application.access-request.Rejected
## Testing
### ResourceType: `Workspace`
CRN: `testing:/workspace/<organization-id>`
- cdk.testing.workspace.Created
- cdk.testing.workspace.Updated
- cdk.testing.workspace.Deleted
### ResourceType: `Test Suite`
CRN: `testing:/testsuite/<workspace-id>`
- cdk.testing.testsuite.Created
- cdk.testing.testsuite.Renamed
- cdk.testing.testsuite.Deleted
### ResourceType: `Test Scenario`
CRN: `testing:/scenario/<test-suite-id>`
- cdk.testing.scenario.Created
- cdk.testing.scenario.Updated
- cdk.testing.scenario.Deleted
- cdk.testing.scenario.Executed
### ResourceType: `Task` 
- CRN: `testing:/task/<scenario-id>`
- cdk.testing.task.Created
- cdk.testing.task.Updated
- cdk.testing.task.Duplicated (missing resource right now)
- cdk.testing.task.Deleted
### ResourceType: `Environment`
CRN: `testing:/environment/<workspace-id>`
- cdk.testing.environment.Created
- cdk.testing.environment.Updated
- cdk.testing.environment.Deleted
### ResourceType: `Environment Variable`
CRN: `testing:/variableDefinition/<workspace-id>`
- cdk.testing.variableDefinition.Created
- cdk.testing.variableDefinition.Updated
- cdk.testing.variableDefinition.Deleted
### ResourceType: `Cluster`
CRN: `testing:/cluster/<workspace-id>`
- cdk.testing.cluster.Created
- cdk.testing.cluster.Updated
- cdk.testing.cluster.Deleted
### ResourceType: `Agent`
CRN: `testing:/agent/<agent-id>`
- cdk.testing.agent.Created
- cdk.testing.agent.Deleted

# Coming Soon

## Admin
### ResourceType: `Cluster`
CRN `kafka:/cluster/<uuid>`
- cdk.admin.cluster.Created
- cdk.admin.cluster.Updated
- cdk.admin.cluster.Deleted
### ResourceType: Group
CRN `platform:/group/<uuid>`
- cdk.admin.group.Created
- cdk.admin.group.AddedMember
- cdk.admin.group.DeletedMember
- cdk.admin.group.permission.Added
- cdk.admin.group.permission.Removed
### ResourceType: User
CRN `platform:/user/<email>`
- cdk.admin.user.permission.Added
- cdk.admin.user.permission.Deleted
- cdk.admin.user.ChangedRole