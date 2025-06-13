---
sidebar_position: 140
title: Set up RBAC for Console
description: Set up RBAC for Conduktor Console
---

The Conduktor RBAC (Role Based Access Control) system enables you to restrict access to resources and enforce permissions at **User** and **Group** granularity. This is a critical step in ensuring that you have control over your Apache Kafka data.

With Conduktor RBAC, you can:

- configure access to Conduktor services
- configure global permissions across **multiple clusters**
- administer permissions for Kafka resources (topics, consumer groups, clusters, subjects, connectors)

## Assign permissions

You can assign two types of permissions:

- [services](#manage-services-permissions): view/manage Console services
- [resources](#manage-resources-permissions): interact with Kafka resources

And you can assign those permissions to **users** or **groups**.

To assign user/group permissions, open Console and go to **Settings** > **Users** or **Groups**, as required. Click **...** next to the user/group you want to modify. Here's an example for a user:

![Assign user permissions](/guide/assign-permissions.png)

:::info[User permissions are additive]
If a user belongs to multiple groups, they will **inherit all the permissions** assigned to these groups. If they have restricted access to a topic but belong to a group that has full access, they will have full access to the topic.
:::

## Manage services permissions

You can restrict access to Conduktor Console services such as settings or left menu items (like certificates). For example, you may want to limit the number of users who can generate API keys. By default, you all users can:

- access data masking policies
- view Self-service

## Manage resources permissions

The RBAC model is very granular and allows you to customize the permissions to Kafka resources based on your requirements:

| Resource         | Permissions           |
| ---------------- | --------------------- |
| Topics           | View config           |
| Topics           | Consume               |
| Topics           | Produce               |
| Topics           | Create                |
| Topics           | Delete                |
| Topics           | Empty                 |
| Topics           | Add partitions        |
| Consumer groups  | Viewer                |
| Consumer groups  | Reset                 |
| Consumer groups  | Create                |
| Consumer groups  | Delete                |
| Subjects         | View                  |
| Subjects         | Edit compatibility    |
| Subjects         | Create / Update       |
| Subjects         | Delete                |
| Kafka connectors | View task and status  |
| Kafka connectors | View config           |
| Kafka connectors | Edit config           |
| Kafka connectors | Deploy                |
| Kafka connectors | Delete                |
| Kafka connectors | Restart               |
| Kafka connectors | Pause / Resume        |
| Clusters         | View ACL              |
| Clusters         | Manage ACL            |
| Clusters         | View broker           |
| Clusters         | Edit broker           |
| Clusters         | Edit SR compatibility |

All these permissions can be applied on one specific cluster, or all your clusters.

## Prefixes

When you define a permission, you might want it to be applied to:

- a specific topic, by typing `my-topic` for instance
- all the topics, by using a wildcard `*`
- a subset that starts with a certain prefix, by typing `my-prefix-*`

Here's an example of those three cases in Console:

![Prefixes examples](/guide/prefixes-example.png)

## Quick select

To save time during the permissions creation, you can use the `Quick select` to give a default set of permissions or set this up using the CLI, API or Terraform.

![Quick select](/guide/quick-select.png)

## User permissions example

Here's an example of a set of permissions given to Alice:

![Alice example](/guide/alice-example.png)

We can see that this is a recap of all the permissions this user has. In grey, we have the permissions Alice inherits from the group `Project A`, from the application `support-for-tracker` and in white the ones that are assigned to her directly.

This set of permissions gives her:

- Full access to the topic `alice-private-topic` on the cluster `test`
- Full access on all topics, that start with the prefix `app-a-`, across all clusters and that she inherits this from the group `Project A`
- Partial access to the topic `tracker-click-1` and `tracker-click-2` on the cluster `Cluster-A` and that she inherits this from the application `support-for-tracker`
