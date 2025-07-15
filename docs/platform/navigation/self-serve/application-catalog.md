---
sidebar_position: 1
title: Applications Catalog
description: Kafka Self-service Overview
---

:::info[UI]
Self-service UI is currently almost entirely read-only. Use Conduktor CLI to interact with the product.
:::

## Applications Catalog

The **Applications Catalog** page in Console is designed to improve application discovery and team collaboration by providing a comprehensive view of all the applications deployed in your organization.

You can search for an application by any element available in the list (name, description, owner). You can also:

- **filter by ownership**: see only applications you own using the **My applications** tab
- **search using label**: filter applications by labels for better organization and categorization
- **use advanced search**: search across application names, descriptions and metadata

Each application entry displays:

- Application name and description
- Owner group and team member avatars
- Public topics count
- Subscription information (incoming/outgoing)
- Application instances count
- Instance details (hover over an application to see instance details)

Click on an application to view its details.

![Application Catalog](assets/app-catalog.png)

## Manage topic subscriptions

When users request to subscribe to topics via the Topic Catalog page, these requests can be managed using the **Application Catalog** page, the **Access requests** tab.

Using this tab **application owners can approve or deny** incoming subscription requests. During the approval process, administrators can modify the originally requested permissions to align with organizational requirements, adjusting read or write access, as needed.

![Application catalog request approval](/images/changelog/platform/v34/app-catalog-request.png)

For teams managing infrastructure as code, subscription requests can also be approved using the CLI with YAML configuration which automatically closes the request and finalizes the subscription. [Find out more about CLI reference](/platform/reference/cli-reference/).

## Application details

The application details page summarizes all the information related to the application:

- general information,
- list of instances,
- application groups and
- access requests.

For better categorization and organization of applications, you can add and remove labels on this page.

import AppDetails from './assets/app-details.png';

<img src={AppDetails} alt="Application details" style={{ width: '100%', display: 'block', margin: 'auto' }} />

## Application instance details

We've introduced a dedicated **Application instance details** page that consolidates all the instance-specific operational information.

This new page provides a comprehensive view of individual application instances and can be accessed by clicking on the required instance from the **Application details** page.

The application instance details page includes:

- instance configuration: cluster assignment, incoming/outgoing subscriptions and public topics,
- resource ownership: topics, consumer groups and subjects owned by this specific instance,
- granted permissions: a detailed view of permissions granted to/from this instance,
- API key management: ability to generate and manage API keys for CLI operations,
- resource policies: list of instance-specific policies and restrictions.
