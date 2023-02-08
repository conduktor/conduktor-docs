---
sidebar_position: 3
title: RBAC
description: Using Conduktor RBAC to enable granular access to Kafka resources
---

# RBAC

:::info
Role-based access control (RBAC) is a Team and Enterprise feature.
:::

## Overview

The Conduktor RBAC system enables you to restrict access to resources and enforce permissions at **User** and **Group** granularity. This is a critical step in ensuring that you have control over your Apache Kafka data.

With RBAC enabled, it's possible to:

- Administer **Topic** level read/write controls
- Configure global permissions across **multiple clusters**

Jump to:

- [Enable RBAC](#enable-rbac-in-your-organization)
- [Roles](#roles)
- [Resoure Conditions](#resource-conditions)
  - [Example: Applying editor role permissions on topic resources](#example-applying-editor-role-permissions-on-topic-resources)
  - [Overlapping Role Assignments](#overlapping-role-assigments)

### Enable RBAC in your Organization

By default, RBAC is disabled within your organization. Assuming you are an Administrator, you can enable this via the **Settings** tab of Admin.

![Cluster admin](/img/admin/admin-rbac.png)

### Roles

There are currently four hard-coded roles in Conduktor. More granular roles and support for custom roles is coming soon, please [contact us](#link) to discuss your needs.

Below outlines what these roles permit **when RBAC is enabled**. You should combine roles with [resource conditions](#resource-conditions) to bind permisisons sets to specific resources.

|  **Role**  | **Description**                                                                                                                                                                                                                                                 |
| :--------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Admin**  | Platform Admin has super user access and no restrictions in regards to platform actions or kafka resources.                                                                                                                                                     |
| **Member** | Platform Member has read-only access in regards to platform entities such as roles, groups, users and settings. By default, **a member has no Kafka resource access**. This must be granted explicitly through the Editor and Viewer roles.                     |
| **Editor** | Editor role provides 'global' edit permissions on all Kafka resources such as consumer groups, kafka connect, ACLs, topics and subjects. Add [resource conditions](#resource-conditions) to this role to provide edit permissions on Kafka resources.           |
| **Viewer** | Viewer role provides 'global' read-only permissions on all Kafka resources such as consumer groups, kafka connect, ACLs, topics and subjects. Add [resource conditions](#resource-conditions) to this role to provide read-only permissions on Kafka resources. |

### Resource Conditions

Resource conditions are used to grant access to resources according to the permissions that the role assumes. Resource conditions can be applied to:

- Users
- Groups

From the **Members** screen in Admin, select the breadcrumb next to either a user or a group. From the dropdown menu, choose **manage permissions**.

![Admin manage permissions](/img/admin/admin-manage-permissions.png)

#### Example: Applying Editor Role Permissions on Topic Resources

From the permissions screen, you should bind resources to the relevant role. The example below demonstrates how to:

- Provide **Editor** role permissions
- On all **Topic** resources in Cluster 'Upstash'
- Where the topic names are prefixed: `sales.ecommerce.*`

Note you can use a wildcard to ensure access is permitted to all topic names within the same domain or context.

![Admin manage permissions](/img/admin/admin-resource-permissions.png)

### Overlapping Role Assigments

If you have overlapping role assignments, your permissions set will be the union of those role assignments. This is because RBAC operates as an additive model.

For example, if you had Editor role with permissions to edit, read and describe on consumer groups, and Viewer role with only read and describe permissions, your complete permissions set would include the superset (i.e. edit, read and describe).
