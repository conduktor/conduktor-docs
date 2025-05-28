---
sidebar_position: 30
id: index
title: Conduktor in production 
description: Deploy Conduktor to production
---

## Deployment overview

Technical diagram, breaking up the main diagram, highlighting main areas.

### Deployment options

Docker, Kubernetes, AWS, how you can deploy each component




### Audit log events

  | **Event type**                               | **Description**                                             |
  | -------------------------------------------- | ----------------------------------------------------------- |
  | **Admin.KafkaConnect.Create**                | A Kafka Connect instance is created.                        |
  | **Admin.KafkaConnect.Update**                | A Kafka Connect instance is updated                         |
  | **Admin.KafkaConnect.Delete**                | A Kafka Connect instance is deleted.                        |
  | **Admin.KsqlDB.Create**                      | A ksqlDB instance is created.                               |
  | **Admin.KsqlDB.Update**                      | A ksqlDB instance is updated.                               |
  | **Admin.KsqlDB.Delete**                      | A ksqlDB instance is deleted.                               |
  | **Admin.KafkaCluster.Create**                | A Kafka cluster is created.                                 |
  | **Admin.KafkaCluster.Update**                | A Kafka cluster is updated.                                 |
  | **Admin.KafkaCluster.Delete**                | A Kafka cluster is deleted.                                 |
  | **Admin.SchemaRegistry.ChangeCompatibility** | The global compatibility of the schema registry is updated. |
  | **Admin.Integration.Update**                 | The alert integration (Slack, MS Teams, Webhook) is updated.|
  | **Admin.AdminApiKey.Create**                 | A new admin API key is created.                             |
  | **Admin.AdminApiKey.Delete**                 | An admin API key is deleted.                                |
  | **Admin.DataMaskingPolicy.Create**           | A data masking policy is created.                           |
  | **Admin.DataMaskingPolicy.Update**           | A data masking policy is updated.                           |
  | **Admin.DataMaskingPolicy.Delete**           | A data masking policy is deleted.                           |
  | **Admin.Certificate.Create**                 | A certificate is created.                                   |
  | **Admin.Certificate.Delete**                 | A certificate is deleted.                                   |
  | **Iam.User.Create**                          | IAM user is created.  |
  | **Iam.User.Update**                          | IAM user is updated.  |
  | **Iam.User.Delete**                          | IAM user is deleted.  |
  | **Iam.User.Login**                           | IAM user logs in.     |
  | **Iam.User.Logout**                          | IAM user logs out.    |
  | **Iam.Group.Create**                         | IAM group is created. |
  | **Iam.Group.Update**                         | IAM group is updated. |
  | **Iam.Group.Delete**                         | IAM group is deleted. |
