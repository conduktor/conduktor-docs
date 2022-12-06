---
sidebar_position: 5
title: Kafka Connect
description: Schema Registry in Conduktor Platform handles the distribution and synchronization of schemas to the producer and consumer for Kafka. 
---

# Kafka Connect

Kafka Connect is a tool to stream data between Apache Kafka and other data systems in a reliable & scalable way. Conduktor Platform provides a simple interface for managing all of your source and sink connectors in one place.

## Getting Started

Kafka Connect needs to be enabled on a per-cluster basis before any schemas can be added. To add Kafka Connect to your cluster, head to the [Admin](../admin/managing-clusters) section to learn how. Kafka Connect can be added on creation of clusters or to existing clusters.

## Creating a Connector

Once Kafka Connect is setup, navigate to Conduktor Console, then to the Kafka Connect display from the left-hand menu. Click “New connector” in the top right corner.

![Create a connector](/img/console/create-connector.png)

You will then need to define a Connector name, and paste in the JSON worker configuration for your connector.

### Generating a connector configuration

Creating a connector in Conduktor Platform requires the connectors worker configuration properties.

Once your configuration is entered, click the "Validate" button to check that your connector has been correctly configured. Once your connection is marked as valid, click "Add connector" to complete the process.

## Managing Connectors

You will be able to manage all of your created connectors from the Kafka Connect display. You can pause,restart, and remove connectors; change their configurations; and check for any failed connectors or tasks. You can perform actions one at a time or across multiple connectors.

To pause, restart, or remove a connector, select the menu from the right-hand side of a connector, then choose the option you need. 

Alternatively, click on a connector to adjust all aspects in one place. You will be able to edit the configuration, restart individual tasks, or choose to pause, restart, and delete:

![Connector controls](/img/console/manage-connector.png)
