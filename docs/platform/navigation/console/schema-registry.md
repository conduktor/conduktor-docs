---
sidebar_position: 4
title: Schema Registry
description: Schema Registry in Conduktor Platform handles the distribution and synchronization of schemas to the producer and consumer for Kafka.
---

# Schema Registry

Conduktor provides a visual interface for Schema Registry, allowing you to create and manage schemas with ease. Having Schema Registry ensures there is an automated way of ensuring data verification, schema evolution, and ability for new consumers to emerge without breaking downstream.

Conduktor supports **Confluent**, **Confluent like** (e.g. Karapace) and **AWS Glue** schema registry types.

## Getting Started

Schema Registry needs to be enabled on a per-cluster basis before any schemas can be added. To add Schema Registry to your cluster, head to the [Admin](../../settings/managing-clusters) section to learn how. Add your Schema Registry details on the tab available on an existing cluster configuration.

## Creating a Schema

Once Schema Registry is setup, navigate to Conduktor Console, then to the Schema Registry display from the left-hand menu. Click “Create schema” in the top right corner.

![Create a Schema](/img/console/create-schema.png)

You will then need to choose the configuration details and enter your schema.

### Schema formats

Conduktor Platform supports the [Avro](https://avro.apache.org/docs/current/spec.html), [JSON](https://json-schema.org/), and [Protobuf](https://developers.google.com/protocol-buffers/) formats for Schema Registry.

### Strategy

Schemas can be applied in several ways: To topics, to records, to both topics & records, or through a custom method.

- **Topic Name**: This strategy associates your schema with a specific topic of your choosing. Simply enter the topic name that you want the schema to apply to. You will also need to specify if the schema will apply to the key or value of a message. The topic name field will auto-complete for you, so no need to remember specific spellings!

- **Record Name**: This is set within a message. The schema will only apply to messages with the record name that you define, but it will apply globally across all topics. Note that the field which this will apply to varies based on the format you choose. For Avro, this is set by `{name}`. For JSON, it is `{title}`. For Protobuf, it will be `{message}`.

- **Topic + Record Name**: Choose this option if you want your schema to apply to both a specific topic, and messages with a specific name within that topic.

- **Custom**: For more advanced options, use the Custom strategy. You can define your strategy in the Custom name field.

### Schema

Once you have decided on your format and strategy, you will need to enter your schema in the form provided.

Once it is ready, click Create and the Schema will be complete.

## Managing Schema

You will be able to manage all of your created Schemas from the Schema Registry display. You can update Schemas, change their compatibility, or delete schemas.

### Updating Schema

To update a schema, select it from the display, then in the next window click on the "Update schema" button. You will then be able to add or remove fields from your schema. Before updating, use the "Check compatibility" button. This lets you understand if this change will break anything upstream or downstream on our applications.

![Update a Schema](/img/console/update-schema.png)

### Compatibility

Each Schema has a compatibility type that determines how they should deal with evolution over time. As mentioned above, updating a schema can cause issues upstream or downstream on applications, and choosing the right compatibility type can prevent this from occurring. There are 7 possible compatibility types:

- Backward
- Backward Transitive
- Forward
- Forward Transitive
- Full
- Full Transitive
- None

See the [Schema Registry docs](https://docs.confluent.io/platform/current/schema-registry/avro.html#summary) for a guide to what each type does.

Compatibility can be changed per schema or globally. To change per schema, click on the menu on the right-hand side of your chosen schema, then select the new type. To change globally, select the options button above the schema table.

### Deleting Schema

To delete a schema, select the menu from the right-hand side of each schema, then choose the "Delete" option from the bottom of the list. Schema can be "soft-deleted" or deleted permanently.

On a soft delete, only the version of the schema is deleted and the underlying schema ID is still available for lookup.

## Setting up a Schema Registry Example

To see an example of setting up Schema Registry, head to [Part 3 of this blog post](https://www.conduktor.io/blog/what-is-the-schema-registry-and-why-do-you-need-to-use-it). This example uses an Aiven cluster and Karaspace Schema Registry.
