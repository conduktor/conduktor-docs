---
sidebar_position: 5
title: Kafka Connect
description: Schema Registry in Conduktor Platform handles the distribution and synchronization of schemas to the producer and consumer for Kafka.
---

Kafka Connect is a tool to stream data between Apache Kafka and other data systems in a reliable & scalable way. Conduktor provides a simple interface for managing all of your source and sink connectors in one place.

## Kafka Connect Cluster List

The Connect Cluster List is a summary view of all your configured Kafka Connect Clusters attached to your currently selected Kafka Cluster.

You can filter by Connect Cluster name and order by 
- Number of Connectors
- Number of Tasks
- Connect Cluster Name

![img.png](img/connect-cluster-list.png)

The list is warning you when some tasks are failed and you can get a high level overview by hovering the "Connectors" count.

![img.png](img/connect-cluster-tooltip.png)

## Connector List

The Connector List page lets you search for any Connector on your currently selected Kafka Connect Cluster.
:::caution
Configure** RBAC** to restrict your users to View, Browse, or perform any operation only to certain topics.  
Check the [Settings](https://docs.conduktor.io/platform/admin/rbac/) for more info.
:::
Multiple search capabilities can be combined to help you find to the Connector you want faster.

**Filtering** is possible on:

- Connector name
- Connector class
- Connector type (source / sink)
- Connector status

**Sorting** is possible on all columns.

**Active columns** can be picked from a list of Available columns from the side button « ⚙️ Edit columns »



![img.png](img/connector-list.png)
The round arrow icon next to the Connector name indicates whether the connector is currently covered by Auto-Restart feature: (Grey: disabled, Green: enabled)

Clicking a Connector in the list brings you to the Connector overview page where you can perform further actions on the selected Connector:
- Review the Connector Task details and status
- View and Edit the Connector configuration
- Create and manage Alerts for this Connector
- Toggle Auto-Restart feature

Several actions are also available from the Connector List: Add a Connector, Pause/Resume, Restart and Delete Connector.


## Operations
In the case of failed tasks, Conduktor can also help to automatically restart them.

 - [Create a Connector](#creating-a-connector)
 - [Managing Connectors](#managing-connectors)
 - [Auto-Restart](#auto-restart)

## Getting Started

Kafka Connect needs to be enabled on a per-cluster basis before any connectors can be added. To add Kafka Connect to your cluster, head to the [Admin](../../settings/managing-clusters) section to learn how. Add your Kafka Connect details on the tab available on an existing cluster configuration.

## Creating a Connector

Once Kafka Connect is setup, navigate to Conduktor Console, then to the Kafka Connect display from the left-hand menu. Select **New connector** in the top right corner.

![Create a connector](/img/console/create-connector.png)

You will then need to define a Connector name, and paste in the JSON worker configuration for your connector.

### Generating a connector configuration

Creating a connector in Conduktor requires the connectors worker configuration properties.

Below shows an example config for elastic search sink connector:

```json
{
  "name": "elasticsearch-ksqldb",
  "connector.class": "io.confluent.connect.elasticsearch.ElasticsearchSinkConnector",
  "connection.url": "ES_CONNECTION_URL",
  "topics": "WIKIPEDIABOT",
  "type.name": "_doc",
  "schema.ignore": "true",
  "key.converter.schema.registry.url": "https://KAFKA_HOST:SCHEMA_REGISTRY_PORT",
  "key.ignore": "true",
  "value.converter.schema.registry.url": "https://KAFKA_HOST:SCHEMA_REGISTRY_PORT",
  "value.converter.basic.auth.user.info": "USER:PASSWORD",
  "consumer.interceptor.classes": "io.confluent.monitoring.clients.interceptor.MonitoringConsumerInterceptor",
  "consumer.override.sasl.jaas.config": "org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required username=\"USER\" password=\"PASSWORD\" metadataServerUrls=\"https://KAFKA1:PORT,https://KAFKA2:PORT\";",
  "value.converter": "io.confluent.connect.avro.AvroConverter",
  "value.converter.basic.auth.credentials.source": "USER_INFO"
}
```

Once your configuration is entered, select the **Validate** button to check that your connector has been correctly configured. Once your connection is marked as valid, click **Add connector** to complete the process.

## Managing Connectors

You will be able to manage all of your created connectors from the Kafka Connect display. You can pause, restart, and remove connectors; change their configurations; and check for any failed connectors or tasks. You can perform actions one at a time or across multiple connectors.

To pause, restart, or remove a connector, select the menu from the right-hand side of a connector, then choose the option you need.

Alternatively, click on a connector to adjust all aspects in one place. You will be able to edit the configuration, restart individual tasks, or choose to pause, restart, and delete:

![Manage connectors](/img/console/manage-connector.png)

