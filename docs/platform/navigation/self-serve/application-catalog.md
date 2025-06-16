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

The Application Catalog provides a comprehensive view of all Applications deployed in your organization, designed to improve application discovery and team collaboration.


You can search applications by any element available in the list: Name, Description, Owner. The enhanced filtering capabilities include:

- **Ownership Filter**: Filter to see only applications you own using the "My applications" tab
- **Label Filtering**: Filter applications by labels for better organization and categorization
- **Advanced Search**: Search across application names, descriptions, and metadata


Each application entry displays:
- Application name and description
- Owner group information with team member avatars
- Public topics count
- Subscription information (incoming/outgoing)
- Application instances count
- Instance Details - Hover over any application to see instance details in a convenient hover card

You can click on an Application to navigate to its detailed page.

![Application Catalog](assets/app-catalog.png)


## Manage Topic subscriptions

When users request to subscribe to topics via the Topic Catalog, these requests will appear in the Application catalog page under the **Access requests** tab. 

From this tab, **application owners can approve or deny** incoming subscription requests. During the approval process, administrators can modify the originally requested permissions to align with organizational requirements, adjusting read or write access, as needed.


![Application catalog request approval](/images/changelog/platform/v34/app-catalog-request.png)

For teams managing infrastructure as code, subscription requests can also be approved using the CLI with YAML configuration which automatically closes the request and finalizes the subscription. [Find out more about CLI reference](/platform/reference/cli-reference/).

## Application Details

The Application details page summarizes all the information related to the application:
- Application General information
- Application Instances & Ownership
- Subscribed topics
- Shared topics
- Application Groups
- Access Requests

You can add and edit labels to applications for better categorization and organization.

Additionally, if you belong to the owner Group of the Application, you can generate Application Instance API Keys to use with the CLI to create resources.

import AppDetails from './assets/app-details.png';

<img src={AppDetails} alt="Application details" style={{ width: 400, display: 'block', margin: 'auto' }} />

### Application Groups Tab

To see a list of Application Groups that belong to an Application, click on the **Groups** tab.

![Application Groups](assets/app-groups.png)

From there, if you want to see the full details of a Group, click on the table row for the Group. This will open a side panel with the Group details in the same YAML format that you can also retrieve via the CLI.

![Application Group Details](assets/app-group-details.png)


