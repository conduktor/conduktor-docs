---
sidebar_position: 5
title: Kafka Connect
description: Schema registry in Conduktor Console handles the distribution and synchronization of schemas to the producer and consumer for Kafka.
---

Kafka Connect is a tool to stream data between Apache Kafka and other data systems in a reliable and scalable way. Conduktor provides a simple interface for managing all of your source and sink connectors in one place.

## Kafka Connect cluster list

The Connect Cluster List is a summary view of all your configured Kafka Connect Clusters attached to your currently selected Kafka Cluster.

You can filter by Connect cluster name and order by:

- number of Connectors
- number of tasks
- connect cluster name

![Connect clusters list](assets/connect-cluster-list.png)

The list is warning you that some tasks have failed and gives you a high level overview by hovering over "Connectors".

![Connect clusters tooltip](assets/connect-cluster-tooltip.png)

## Connector

The Connector list page lets you search for any Connector on your currently selected Kafka Connect cluster.

:::warning
Configure **RBAC** to restrict your users to View, Browse, or perform any operation only to certain topics. [Check the settings](https://docs.conduktor.io/platform/admin/rbac/) for details.
:::

Multiple search capabilities can be combined to help you find the Connector you want faster.

**Filtering** is possible on:

- Connector name
- Connector class
- Connector type (source / sink)
- Connector status

**Sorting** is possible on all columns.

**Active columns** can be picked from a list of Available columns from the side button « ⚙️ Edit columns »

![Connectors list](assets/connector-list.png)

The round arrow icon next to the Connector name indicates whether the connector will be auto-restarted by Conduktor: (Grey: disabled, Green: enabled)

Clicking a Connector in the list brings you to the Connector overview page where you can perform further actions on the selected Connector:

- [Review the Connector Task details and status](/platform/navigation/console/kafka-connect/connector-overview)
- [View and Edit the Connector configuration](/platform/navigation/console/kafka-connect/connector-config)
- [Create and manage Alerts for this Connector](/platform/navigation/console/kafka-connect/connector-alerts)
- [Toggle Auto-restart feature](/platform/navigation/console/kafka-connect/connector-autorestart)

Several actions are also directly available from the Connectors list:

- Add a Connector
- Pause/Resume and Restart
- Delete Connector

All these operations can be applied either on a single Connector, or on multiple Connectors at once:

![Bulk Connectors select](assets/connector-list-multi-select.png)

## Add a Connector

To deploy a new Connector, click "Add a Connector". You will be see all the Connector Plugin classes installed on this Connect Cluster.
![Available plugin classes](assets/connector-add-classes.png)

Next, you will get to our configuration wizard for Kafka Connect, which is taking full advantage of the [Kafka Connect Validate API](https://docs.confluent.io/platform/current/connect/references/restapi.html#put--connector-plugins-(string-name)-config-validate):

- A form is generated with structured configuration groups to be filled out
- Supportive error handling is included with each individual field
- Embedded documentation helps you understand which fields are required and what their expected, and default, values are
- Toggle advanced configuration to visualize only the most important fields
- Switch seamlessly between Form View and JSON View at any time

![Empty Connector form](assets/connector-add-form-initial.png)

Configure your Connector to your convenience and use the **Validate** button to verify that your configuration is valid.

This will highlight the parts of the configuration that are invalid, and give you precise information on how to correct your Connector configuration.

![Invalid Connector form](assets/connector-add-form-invalid.png)

:::warning
While Kafka Connect Validate API generally checks for most configuration inconsistencies, there are some limits:

- It usually doesn't check for external configuration such as URL and user / passwords.
- Some Kafka Connect Plugins classes are notoriously badly implemented and don't take full advantage of Kafka Connect Validate API

When errors happen outside the nominal scope of Kafka Connect Validate API, you will see the errors as Toasts

import InvalidToast from './assets/connector-add-invalid-toast.png';

<img src={InvalidToast} alt="Invalid toast" style={{ width: 400, display: 'block', margin: 'auto' }} />
:::

At any point in time, you can switch to JSON view and edit the JSON payload directly.  
You can switch back and forth between JSON and Form view at your convenience.

![JSON view](assets/connector-add-json.png)

When you're done, click "Next" and you'll be presented with a Review screen where you will be able to copy the YAML associated to your Kafka Connect configuration.

This YAML will help you automate your deployment with the help of [Conduktor CLI](/platform/reference/cli-reference/).  
This is entirely optional and you can just deploy your Connector from the UI by clicking "Submit".

![Connector review](assets/connector-add-review.png)
