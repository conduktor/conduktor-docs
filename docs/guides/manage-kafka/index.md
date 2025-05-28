---
sidebar_position: 250
id: index
title: Manage Kafka
description: Manage your Kafka using Conduktor
---







### Audit log events

  | **Event type**                          | **Description**                                            |
  | --------------------------------------- | ---------------------------------------------------------- |
  | **Kafka.Subject.Create**                | Kafka subject is created.                                  |
  | **Kafka.Subject.Update**                | Kafka subject is updated.                                  |
  | **Kafka.Subject.Delete**                | Kafka subject is deleted.                                  |
  | **Kafka.Subject.ChangeCompatibility**   | Kafka subject compatibility is changed                     |
  | **Kafka.Topic.Create**                  | Kafka topic is created.                                    |
  | **Kafka.Topic.Update**                  | Kafka topic is updated.                                    |
  | **Kafka.Topic.Delete**                  | Kafka topic is deleted.                                    |
  | **Kafka.Topic.Empty**                   | Kafka topic is emptied.                                    |
  | **Kafka.Topic.Browse**                  | Kafka topic is browsed.                                    |
  | **Kafka.Topic.ProduceRecord**           | Kafka topic record is produced.                            |
  | **Kafka.Topic.SqlQuery**                | Kafka topic is requested through Console SQL.              |
  | **Kafka.Connector.Create**              | Kafka connector is created.                                |
  | **Kafka.Connector.Update**              | Kafka connector is updated.                                |
  | **Kafka.Connector.Delete**              | Kafka connector is deleted.                                |
  | **Kafka.Connector.Restart**             | Kafka connector is restarted.                              |
  | **Kafka.Connector.TaskRestart**         | Kafka connector task is restarted.                         |
  | **Kafka.Connector.Pause**               | Kafka connector is paused.                                 |
  | **Kafka.Connector.Resume**              | Kafka connector is resumed.                                |
  | **Kafka.Connector.AutoRestartActivate** | Kafka connector auto-restart is activated.                 |
  | **Kafka.Connector.AutoRestartStop**     | Kafka connector auto-restart is stopped.                   |
  | **Kafka.ConsumerGroup.Duplicate**       | Kafka consumer group is duplicated.                        |
  | **Kafka.ConsumerGroup.Update**          | Kafka consumer group is updated, when the offset is reset. |
  | **Kafka.ConsumerGroup.Delete**          | Kafka consumer group is deleted.                           |
