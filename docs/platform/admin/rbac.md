---
sidebar_position: 3
title: RBAC
description: Using Conduktor RBAC to enable granular access to Kafka resources
---

# RBAC

:::info
Role-based access control (RBAC) is an Enterprise feature.
:::

## Overview

The Conduktor RBAC system enables you to restrict access to resources and enforce permissions at **User** and **Group** granularity. This is a critical step in ensuring that you have control over your Apache Kafka data.

With RBAC enabled, it's possible to:
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
- [Enable RBAC](#enable-rbac-in-your-organization)
- [How to assign permissions?](#how-to-assign-permissions)
- [Manage Services Permissions](#manage-services-permissions)
- [Manage Resources Permissions](#manage-resources-permissions)
  - [Granular Permissions](#granular-permissions)
  - [Prefixes](#prefixes)
  - [Quick Select](#quick-select)
  - [Example](#example)
---
## Enable RBAC in your Organization

By default, RBAC is disabled within your organization, meaning that everyone has access to everything and permissions are not taken into account. 
Assuming you are an Administrator, you can enable this via the **Settings** tab of Admin. That way, people without any permissions won't see anything, except if they have permissions.

![Cluster admin](/img/admin/admin-rbac.png)

## How to assign permissions?

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

## Manage Services Permissions

Since 1.17.0, you are able to restrict access to Conduktor Console services. The default set of permissions is the one below:

![Services default set](/img/admin/services-default-set.png)

This set of permissions means that the user will have this view of the `Admin` section:

![Default view](/img/admin/bob-no-access.png)

If you check all the boxes, the user will have this view of the `Admin` section:

![Full access user view](/img/admin/alice-full-access.png)

Finally, if you remove their access to Data Masking and/or Topic as a Service, they will still see the modules, but won't be able to access them. Here is an example for Topic as a Service:

![Topic as a Service access denied](/img/admin/taas-access-denied.png)

## Manage Resources Permissions

### Granular Permissions
Since 1.17.0, the RBAC model is way more granular and allows you to go deep into the permissions. Here is a table that recaps the ones you can assign:

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
| Kafka connectors | View task & status    |
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

### Prefixes

When you define a permission, you might want it to be applied to:
- A specific topic, by typing `my-topic` for instance
- All the topics, by using a wildcard `*`
- A subset that starts with a certain prefix, by typing `my-prefix-*`

Here is an example of those three cases within the UI:

![Prefixes examples](/img/admin/prefixes-example.png)

The exact same works for other Kafka resources.

### Quick Select

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

### Example

Here is an example of a set of permissions given to Alice:

![Alice example](/img/admin/alice-example.png)

We can see that this is a recap of all the permissions this user has.

In blue, we have the permissions Alice inherits from the group `Project A`, and in white the ones that are assigned to her directly.

This set of permissions gives her:
- A full access to the topic `alice-private-topic` and to the consumer group `alice-consumers`, on the cluster `Local Kafka`
- Some actions on all the topics and consumer groups that start with the prefix `app-a-`, on all the clusters, that she inherits from the group `Project A`

