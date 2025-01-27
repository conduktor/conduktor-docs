---
sidebar_position: 9
title: Partner Zones
description: Securely share your Kafka streaming data with external partners.
---

# Partner Zones

## Overview

Partner Zones enable you to securely share your Kafka streaming data with external partners.

It simplifies the previously complex and manual workflow of granting access to sensitive data by leveraging your Kafka directly without needing to duplicate your data, eliminating the need to keep separate data streams in sync.

:::info
Creating and editing Partner Zones can only be done via the CLI at the moment.
:::

## Partner Zones list

To view a list of Partner Zones, click on the **Partner Zones** tab in the left-hand navigation menu. Note that this page is currently accessible only to admins of Console.

![Partner Zones listing page](assets/partner-zones.png)

## Partner Zone details

To view the details of a Partner Zone, click on the Partner Zone name in the list.

The page consists of multiple sections, including:
- Kafka topics that are being shared
- Credentials used to access the data
- Reason for sharing the data
- Contact information of the person responsible for the Partner Zone

![Partner Zone details](assets/partner-zone-details.png)

## Delete a Partner Zone

To delete a Partner Zone, click on the **Delete** button (with a bin icon) in the top-right corner of the Partner Zone details page. This will bring up a confirmation modal to prevent accidental deletion. Type `DELETE` in the text box and click **Delete** to confirm and delete the Partner Zone.

![Delete Partner Zone](assets/delete-partner-zone.png)
