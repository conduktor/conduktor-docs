---
sidebar_position: 1
title: Application Catalog
description: Kafka Self-service Overview
---

:::tip 
Self-service UI is almost entirely Read-only for now.  
Use the CLI to interact with the product.
:::

## Application Catalog List Page

The Application Catalog lets you search through the Applications deployed in your organization.  

You can search by any element available in the list: Name, Description, Owner.

You can click on an Application to get to its details page.

![Application Catalog](assets/app-catalog.png)

## Manage Topic subscriptions

When users request to subscribe to topics via the Topic Catalog, these requests will appear in the Application catalog page under the **Access requests** tab. 

From this tab, **application owners can approve or deny** incoming subscription requests. During the approval process, administrators can modify the originally requested permissions to align with organizational requirements, adjusting read or write access, as needed.

![Application catalog request approval](/images/changelog/platform/v34/app-catalog-request.png)

For teams managing infrastructure as code, subscription requests can also be approved using the CLI with YAML configuration which automatically closes the request and finalizes the subscription. [Find out more about CLI reference](/platform/reference/cli-reference/).

## Application details

The Application details page summarizes all the information related to the application:
- Application General information
- Application Instances & Ownership
- Subscribed topics
- Shared topics
- Application Groups

Additionally, if you belong to the owner Group of the Application, you can generate Application Instance API Keys to use with the CLI to create resources.

import AppDetails from './assets/app-details.png';

<img src={AppDetails} alt="Application details" style={{ width: 400, display: 'block', margin: 'auto' }} />

### Application Groups

To see a list of Application Groups that belong to an Application, click on the **Groups** tab.

![Application Groups](assets/app-groups.png)

From there, if you want to see the full details of a Group, click on the table row for the Group. This will open a side panel with the Group details in the same YAML format that you can also retrieve via the CLI.

![Application Group Details](assets/app-group-details.png)



