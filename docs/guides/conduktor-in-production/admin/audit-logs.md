---
sidebar_position: 160
title: Audit logs
description: Manage audit logs
---

## Audit log event overview

As you and your team interact with Conduktor, audit events are captured that give a detailed log of actions, providing a centralized visibility of user-related and resource-related events.

The audit log **events can be browsed, filtered and searched** directly within Conduktor's UI or **exported from a Kafka topic** for any further use, such as maintaining your own audit trail in other systems.

![Admin Audit](/guides/admin-audit.png)

Click on an event in the audit log to expose event-specific metadata. Here's an example of an audit event for a new connector which can include metadata such as custom tags, the cluster, connector name and its ID.

![Admin Audit Event](/guides/audit-log-inspect.png)

Once configured with the correct [environment variables](docs/platform/get-started/configuration/env-variables.md#auditlog-export-properties), audit log events are also exported to a Kafka topic, allowing you to leverage the benefits of Conduktor when finding a message.
![kafka message audit log](/guides/audit-log-kafka-message.png)

## View and export audit logs

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="First Tab" label="CloudEvents">

  #### Export audit log events

  You can export audit log events from a Kafka topic using the Console UI. The exportable events have more detail than the legacy events, providing additional information about the event that has taken place.

  Learn how to configure audit events for export via [configuration properties](/platform/get-started/configuration/env-variables/#auditlog-export-properties).

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

  Here's an example of a Conduktor event:
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

  Here's a list of currently available audit log event types.

  ##### Kafka related events

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

  ##### IAM related events

  | **Event type**       | **Description**       |
  | -------------------- | --------------------- |
  | **Iam.User.Create**  | IAM user is created.  |
  | **Iam.User.Update**  | IAM user is updated.  |
  | **Iam.User.Delete**  | IAM user is deleted.  |
  | **Iam.User.Login**   | IAM user logs in.     |
  | **Iam.User.Logout**  | IAM user logs out.    |
  | **Iam.Group.Create** | IAM group is created. |
  | **Iam.Group.Update** | IAM group is updated. |
  | **Iam.Group.Delete** | IAM group is deleted. |

  ##### Self-service related events

  | **Event type**                                       | **Description**                                       |
  | ---------------------------------------------------- | ----------------------------------------------------- |
  | **SelfService.Application.Create**                   | Self-service application is created.                  |
  | **SelfService.Application.Update**                   | Self-service application is updated.                  |
  | **SelfService.Application.Upsert**                   | Self-service application is created or updated.       |
  | **SelfService.Application.Delete**                   | Self-service application is deleted.                  |
  | **SelfService.ApplicationInstance.Create**           | Self-service application instance is created.         |
  | **SelfService.ApplicationInstance.Update**           | Self-service application instance is updated.         |
  | **SelfService.ApplicationInstance.Delete**           | Self-service application instance is deleted.         |
  | **SelfService.ApplicationInstanceApiKey.Create**     | Self-service application instance API key is created. |
  | **SelfService.ApplicationInstanceApiKey.Delete**     | Self-service application instance API key is deleted. |
  | **SelfService.ApplicationGroup.Create**              | Self-service application group is created.            |
  | **SelfService.ApplicationGroup.Update**              | Self-service application group is updated.            |
  | **SelfService.ApplicationGroup.Delete**              | Self-service application group is deleted.            |
  | **SelfService.ApplicationPolicy.Create**             | Self-service application policy is created.           |
  | **SelfService.ApplicationPolicy.Update**             | Self-service application policy is updated.           |
  | **SelfService.ApplicationPolicy.Delete**             | Self-service application policy is deleted.           |
  | **SelfService.ApplicationInstancePermission.Create** | Permissions are created for an app instance.          |
  | **SelfService.ApplicationInstancePermission.Delete** | Permissions are deleted for an app instance.          |
  | **SelfService.ServiceAccount.Create**                | Service account is created.                           |
  | **SelfService.ServiceAccount.Update**                | Service account is updated.                           |
  | **SelfService.ServiceAccount.Delete**                | Service account is deleted.                           |


  ##### Admin related events

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

  ##### Alert related events

  | **Event type**                | **Description**                         |
  | ----------------------------- | --------------------------------------- |
  | **Kafka.Alert.Create**        | An alert is created.                    |
  | **Kafka.Alert.Update**        | An alert is updated.                    |
  | **Kafka.Alert.Delete**        | An alert is deleted.                    |
  | **Kafka.Alert.Trigger**       | An alert is triggered.                  |

  ##### Partner Zone related events

  | **Event type**                    | **Description**                                  |
  | --------------------------------- | ------------------------------------------------ |
  | **Admin.PartnerZone.Create**      | A Partner Zone is created.                       |
  | **Admin.PartnerZone.Update**      | A Partner Zone is updated.                       |
  | **Admin.PartnerZone.Delete**      | A Partner Zone is deleted.                       |
  | **Admin.PartnerZone.TokenCreate** | A token is created for accessing a Partner Zone. |


</TabItem>
<TabItem value="Second Tab" label="Legacy events">

  #### Legacy audit events

  Here's a list of legacy audit events tracked by Conduktor:
    - [Console](#console)
    - [Data masking](#data-masking)
    - [Self-service](#self-service)
    - [Admin](#admin)

  #### Console

  ##### ResourceType: `Topic`

  CRN: `kafka:/cluster/<uuid>/topic/<topic-name>`

  - topic.ProducedRecord
  - topic.Browsed
  - topic.Deleted
  - topic.Created
  - topic.Updated
  - topic.Emptied
  - topic.Tagged
  - topic.Untagged

  ##### ResourceType: `Subject`

  CRN `kafka:/cluster/<uuid>/subject/<subject-name>`

  - subject.Created
  - subject.Updated
  - subject.ChangedCompat
  - subject.Deleted
  - subject.DeletedVersions
  - subject.DeletedVersion

  ##### ResourceType: `SchemaRegistry`

  CRN `kafka:/cluster/<uuid>`

  - registry.ChangedGlobalCompat

  ##### ResourceType: `ConsumerGroup`

  CRN `kafka:/cluster/<uuid>/group/<group-name>`

  - consumergroup.Created
  - consumergroup.Updated (ResetOffsets)
  - consumergroup.Deleted

  ##### ResourceType: `Connector`

  CRN `kafka:/cluster/<uuid>/connect/<connect-cluster-id>/<connector-name>`

  - connector.Created
  - connector.Updated
  - connector.Deleted
  - connector.Restarted
  - connector.RestartedTask
  - connector.Paused
  - connector.Resumed

  #### Data masking

  ##### ResourceType: `DatamaskingPolicy`

  CRN `platform:/datamasking/<uuid>`

  - policy.Upserted
  - policy.Deleted

  #### Self-service

  ##### ResourceType: `Application`

  CRN `platform:/application/<app-slug>`

  - application.Created
  - application.Deleted
  - application.Updated
  - application.access-request.Approved
    from / to
  - application.access-request.Rejected

  #### Admin

  ##### ResourceType: `Cluster`

  CRN `kafka:/cluster/<uuid>`

  - cluster.Created
  - cluster.Updated
  - cluster.Deleted

  ##### ResourceType: `Group`

  CRN `platform:/group/<uuid>`

  - group.Created
  - group.member.Added
  - group.member.Deleted
  - group.permission.Added
  - group.permission.Deleted

  ##### ResourceType: `User`

  CRN `platform:/user/<email>`

  - user.Login
  - user.permission.Added
  - user.permission.Deleted
  - user.platform_role.Updated
</TabItem>
</Tabs>

## Customize logging configuration

If you want to further customize your logging at an individual logger-level, you can use a custom log4j configuration file.

You must bind mount your custom log4j configuration file to the `/app/resources/log4j2.xml` path in the container.

Here is the default configuration file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration status="warn">

    <Properties>
        <Property name="LOG4J2_TIME_FORMAT">yyyy-MM-dd'T'HH:mm:ss.SSSZ</Property>
        <Property name="LOG4J2_APPENDER_LAYOUT">pattern</Property>
        <Property name="LOG4J2_ROOT_LEVEL">info</Property>
        <Property name="LOG4J2_ORG_APACHE_KAFKA_LEVEL">warn</Property>
        <Property name="LOG4J2_IO_KCACHE_LEVEL">warn</Property>
        <Property name="LOG4J2_IO_VERTX_LEVEL">warn</Property>
        <Property name="LOG4J2_IO_NETTY_LEVEL">error</Property>
        <Property name="LOG4J2_IO_CONDUKTOR_LEVEL">info</Property>
        <Property name="LOG4J2_IO_CONDUKTOR_PROXY_AUTHORIZATION_LEVEL">info</Property>
        <Property name="LOG4J2_IO_CONDUKTOR_PROXY_REBUILDER_COMPONENTS_LEVEL">info</Property>
        <Property name="LOG4J2_IO_CONDUKTOR_PROXY_SERVICE_LEVEL">info</Property>
        <Property name="LOG4J2_IO_CONDUKTOR_PROXY_NETWORK_LEVEL">info</Property>
        <Property name="LOG4J2_IO_CONDUKTOR_UPSTREAM_THREAD_LEVEL">warn</Property>
        <Property name="LOG4J2_IO_MICROMETER_LEVEL">error</Property>
        <Property name="LOG4J2_IO_CONFLUENT_LEVEL">warn</Property>
    </Properties>

    <appenders>
        <Console name="json" target="SYSTEM_OUT">
            <JsonLayout complete="false" compact="true" eventEol="true" properties="true"
                        objectMessageAsJsonObject="true">
                <KeyValuePair key="timestamp" value="$${date:${env:LOG4J2_TIME_FORMAT}}"/>
            </JsonLayout>
        </Console>
        <Console name="pattern" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{${env:LOG4J2_TIME_FORMAT}} [%red{%10.25t}] [%green{%-5p}] [%blue{%c{1}:%L}] - %m%n"/>
        </Console>
    </appenders>

    <loggers>
        <logger name="org.apache.kafka" level="${env:LOG4J2_ORG_APACHE_KAFKA_LEVEL}" additivity="false">
            <appender-ref ref="${env:LOG4J2_APPENDER_LAYOUT}"/>
        </logger>
        <logger name="io.kcache" level="${env:LOG4J2_IO_KCACHE_LEVEL}" additivity="false">
            <appender-ref ref="${env:LOG4J2_APPENDER_LAYOUT}"/>
        </logger>
        <logger name="io.vertx" level="${env:LOG4J2_IO_VERTX_LEVEL}" additivity="false">
            <appender-ref ref="${env:LOG4J2_APPENDER_LAYOUT}"/>
        </logger>
        <logger name="io.netty" level="${env:LOG4J2_IO_NETTY_LEVEL}" additivity="false">
            <appender-ref ref="${env:LOG4J2_APPENDER_LAYOUT}"/>
        </logger>
        <logger name="io.conduktor" level="${env:LOG4J2_IO_CONDUKTOR_LEVEL}" additivity="false">
            <appender-ref ref="${env:LOG4J2_APPENDER_LAYOUT}"/>
        </logger>
        <logger name="io.conduktor.proxy.authorization" level="${env:LOG4J2_IO_CONDUKTOR_PROXY_AUTHORIZATION_LEVEL}"
                additivity="false">
            <appender-ref ref="${env:LOG4J2_APPENDER_LAYOUT}"/>
        </logger>
        <logger name="io.conduktor.proxy.rebuilder.components"
                level="${env:LOG4J2_IO_CONDUKTOR_PROXY_REBUILDER_COMPONENTS_LEVEL}" additivity="false">
            <appender-ref ref="${env:LOG4J2_APPENDER_LAYOUT}"/>
        </logger>
        <logger name="io.conduktor.proxy.service" level="${env:LOG4J2_IO_CONDUKTOR_PROXY_SERVICE_LEVEL}"
                additivity="false">
            <appender-ref ref="${env:LOG4J2_APPENDER_LAYOUT}"/>
        </logger>
        <logger name="io.conduktor.proxy.thread.UpstreamThread" level="${env:LOG4J2_IO_CONDUKTOR_UPSTREAM_THREAD_LEVEL}"
                additivity="false">
            <appender-ref ref="${env:LOG4J2_APPENDER_LAYOUT}"/>
        </logger>
        <logger name="io.conduktor.proxy.network" level="${env:LOG4J2_IO_CONDUKTOR_PROXY_NETWORK_LEVEL}"
                additivity="false">
            <appender-ref ref="${env:LOG4J2_APPENDER_LAYOUT}"/>
        </logger>
        <logger name="io.micrometer" level="${env:LOG4J2_IO_MICROMETER_LEVEL}" additivity="false">
            <appender-ref ref="${env:LOG4J2_APPENDER_LAYOUT}"/>
        </logger>
        <logger name="org.hibernate.validator.internal.util" level="ERROR" additivity="false">
            <appender-ref ref="${env:LOG4J2_APPENDER_LAYOUT}"/>
        </logger>
        <logger name="io.confluent" level="${env:LOG4J2_IO_CONFLUENT_LEVEL}" additivity="false">
            <appender-ref ref="${env:LOG4J2_APPENDER_LAYOUT}"/>
        </logger>

        <AsyncRoot level="${env:LOG4J2_ROOT_LEVEL}">
            <appender-ref ref="${env:LOG4J2_APPENDER_LAYOUT}"/>
        </AsyncRoot>
    </loggers>
</configuration>

```

## Related resources

- [Configure audit log topics](/platform/guides/configure-audit-log-topic/)
- [Gateway audit](/gateway/interceptors/data-security/audit/)
- [Give us feedback/request a feature](https://conduktor.io/roadmap)
