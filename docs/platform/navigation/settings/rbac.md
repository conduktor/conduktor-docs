---
sidebar_position: 4
title: RBAC
description: Using Conduktor RBAC to enable granular access to Kafka resources
---

# RBAC

## Overview

The Conduktor RBAC system enables you to restrict access to resources and enforce permissions at **User** and **Group** granularity. This is a critical step in ensuring that you have control over your Apache Kafka data.

With Conduktor RBAC, you can:
- Configure access to Conduktor services
- Configure global permissions across **multiple clusters**
- Administer permissions for Kafka resources:
   - Topics
   - Consumer Groups
   - Clusters
   - Subjects
   - Connects

---
**Jump to:**
- [How to assign permissions?](#how-to-assign-permissions)
- [Manage Services Permissions](#manage-services-permissions)
- [Manage Resources Permissions](#manage-resources-permissions)
  - [Granular Permissions](#granular-permissions)
  - [Prefixes](#prefixes)
  - [Quick Select](#quick-select)
  - [Example](#example)

---

### How to assign permissions?

You can assign two kinds of permissions:
- Services permissions: to see and/or manage Conduktor Console services
- Resources permissions: to interact with Kafka resources

And you can assign those permissions to:
- Users
- Groups

To do so, you can either click on the name of the user/group, or click on the `...` icon on the right of their name, like shown below.

![Assign permissions](/img/admin/assign-permissions.png)

:::info
Please note that permissions are additive, meaning that if a user belongs to multiple groups, they will inherit all the permissions given to these groups.
If they have a restricted access to a topic, but belong to a group that has a full access, then they will have a full access too.
:::

### Manage Services Permissions

Here are the available permissions for Conduktor Console services:

| Permission in the API       | Permissions in the UI              | Description                                                   |
|-----------------------------|------------------------------------|---------------------------------------------------------------|
| `auditLogView`              | Can access the Audit log           | Permission to browse audit log                                |
| `datamaskingView`           | Can access Datamasking policies    | Permission to view Data policies                              |
| `datamaskingManage`         | Can manage Datamasking policies    | Permission to manage Data policies (masking rules)            |
| `clusterConnectionsManage`  | Can manage Cluster configurations  | Permission to add / edit / remove Kafka clusters on Console   |
| `certificateManage`         | Can manage Certificates            | Permission to add / edit / remove TLS Certificates on Console |
| `userManage`                | Can manage Users, Groups and Roles | Permission to manage Console users, groups & permissions      |
| `notificationChannelManage` | Can manage Notification channels   | Permission to manage Integration channels                     |
| `taasView`                  | Can view Application Catalog       | Permission to view Integration channels                       |

You are able to restrict access to Conduktor Console services. The default set of permissions is the one below:

![Services default set](/img/admin/services-default-set.png)

This set of permissions means that the user will have this view of the `Admin` section (note the available tabs on the left):

![Default view](/img/admin/bob-no-access.png)

If you check all the boxes, the user will have this view of the `Admin` section (access to additional settings):

![Full access user view](/img/admin/alice-full-access.png)

Finally, if you remove their access to Data Masking and/or Topic as a Service, they will still see the modules, but won't be able to access them. Here is an example for Topic as a Service:

![Topic as a Service access denied](/img/admin/taas-access-denied.png)

### Manage Resources Permissions

#### Granular Kafka Permissions
The RBAC model is very granular and allows you to go deep into the permissions. Here is a table that recaps the ones you can assign:

| Permission in the API        | Permissions in the UI | Description                                                          |
|------------------------------|-----------------------|----------------------------------------------------------------------|
| **Topics**                   |                       |                                                                      |
| `topicViewConfig`            | View config           | Permission to view the topic configuration.                          |
| `topicEditConfig`            | Edit config           | Permission to edit the topic configuration.                          |
| `topicConsume`               | Consume               | Permission to consume messages from the topic.                       |
| `topicProduce`               | Produce               | Permission to produce (write) messages to the topic.                 |
| `topicCreate`                | Create                | Permission to create a new topic.                                    |
| `topicDelete`                | Delete                | Permission to delete the topic.                                      |
| `topicEmpty`                 | Empty                 | Permission to empty (delete all messages from) the topic.            |
| `topicAddPartition`          | Add partitions        | Permission to add partitions to the topic.                           |
| **Consumer groups**          |                       |                                                                      |
| `consumerGroupView`          | View                  | Permission to view the consumer group.                               |
| `consumerGroupReset`         | Reset                 | Permission to reset the consumer group.                              |
| `consumerGroupCreate`        | Create                | Permission to create a new consumer group.                           |
| `consumerGroupDelete`        | Delete                | Permission to delete the consumer group.                             |
| **Subjects**                 |                       |                                                                      |
| `subjectView`                | View                  | Permission to view the subject.                                      |
| `subjectEditCompatibility`   | Edit compatibility    | Permission to edit the compatibility of the subject.                 |
| `subjectCreateUpdate`        | Create / Update       | Permission to create or update the subject.                          |
| `subjectDelete`              | Delete                | Permission to delete the subject.                                    |
| **Kafka connectors**         |                       |                                                                      |
| `kafkaConnectorStatus`       | View task & status    | Permission to view the task and status of the connector.             |
| `kafkaConnectorViewConfig`   | View config           | Permission to view the configuration of the connector.               |
| `kafkaConnectorEditConfig`   | Edit config           | Permission to edit the configuration of the connector.               |
| `kafkaConnectorCreate`       | Deploy                | Permission to deploy a new connector.                                |
| `kafkaConnectorDelete`       | Delete                | Permission to delete the connector.                                  |
| `kafkaConnectRestart`        | Restart               | Permission to restart the connector.                                 |
| `kafkaConnectPauseResume`    | Pause / Resume        | Permission to pause or resume the connector.                         |
| **Clusters**                 |                       |                                                                      |
| `clusterViewAcl`             | View ACL              | Permission to view the ACL of the cluster.                           |
| `clusterManageAcl`           | Manage ACL            | Permission to manage the ACL of the cluster.                         |
| `clusterViewBroker`          | View broker           | Permission to view the broker of the cluster.                        |
| `clusterEditBroker`          | Edit broker           | Permission to edit the broker of the cluster.                        |
| `clusterEditSrCompatibility` | Edit SR compatibility | Permission to edit the schema registry compatibility of the cluster. |
| **ksqlDBs**                  |                       |                                                                      |
| `ksqldbAccess`               | Manage                | Permission to manage the ksqlDB.                                     |

All these permissions can be applied on one specific cluster, or all your clusters.

#### Prefixes

When you define a permission, you might want it to be applied to:
- A specific topic, by typing `my-topic` for instance
- All the topics, by using a wildcard `*`
- A subset that starts with a certain prefix, by typing `my-prefix-*`

Here is an example of those three cases within the UI:

![Prefixes examples](/img/admin/prefixes-example.png)

The exact same works for other Kafka resources.

#### Quick Select

In order to win some time during the permissions creation, you can use the `Quick select` to give a default set of permissions.

![Quick select](/img/admin/quick-select.png)

The screenshots below show the different `Quick select` sets of permissions depending on the resource.

![Topics quick select](/img/admin/topics-quick-select.png)
![Consumer groups quick select](/img/admin/consumer-groups-quick-select.png)
![Subjects quick select](/img/admin/subjects-quick-select.png)
![Kafka connectors](/img/admin/kafka-connectors-quick-select.png)
![Clusters](/img/admin/clusters-quick-select.png)
For the `Clusters` permissions, the first set is for `Viewer`, and the second one is for `Admin`.

If the `Quick select` doesn't fit your need, you can still `Select permissions manually` by checking the exact boxes you need.

#### Example

Here is an example of a set of permissions given to Alice:

![Alice example](/img/admin/alice-example.png)

We can see that this is a recap of all the permissions this user has.

In blue, we have the permissions Alice inherits from the group `Project A`, and in white the ones that are assigned to her directly.

This set of permissions gives her:
- A full access to the topic `alice-private-topic` and to the consumer group `alice-consumers`, on the cluster `Local Kafka`
- Some actions on all the topics and consumer groups that start with the prefix `app-a-`, on all the clusters, that she inherits from the group `Project A`
