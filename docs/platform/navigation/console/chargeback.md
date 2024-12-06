---
sidebar_position: 11
title: Chargeback
description: Chargeback
---

## Overview

Chargeback lets you visualize the cost allocation of Service Accounts on a few key metrics.
:::info
At the moment, the data is aggregated per Service Account and the available metrics collected are the produced and consumed bytes.  
We plan to add more features over time. [Let us know](https://conduktor.io/roadmap) how you want to aggregate your data or which features are important to you.
:::

- Overall Cost tab displays the dollar costs by adding up the dollar cost for each available metric (Ingress + Egress)
- Ingress tab shows the produced bytes of the Service Accounts
- Egress tab shows the consumed bytes of the Service Accounts

The measured period can be changed from 7D, 30D, 6M, 12M, or YTD (Year To Date)

![Kafka Connect Wizard](/images/changelog/platform/v29/chargeback.png)

The configuration button lets you configure the Dollar cost of a Produced GB and a Consumed GB. This allows you to align the chargeback model with your specific infrastructure costs.

![Chargeback Configuration](img/chargeback-configuration.png)

## Exporting Chargeback data

To facilitate external analysis and reporting, the data shown in the table can be exported as a CSV file.

To export the data, click on the "Export all" button located at the top right corner of the graph.

The default exported file name will be `Chargeback_<startDate>_<endDate>_<activeTabName>.csv`.

![A screenshot of the Chargeback section in the console, showing a graph and a data table with cost and usage metrics over time. The 'Export all' button is highlighted in the top right corner of the graph.](/images/changelog/platform/v30/chargeback-data-export.png)

### Filtering and sorting the data

Any filters or sorting applied to the table will be reflected in the exported data. Only the data matching your current view will be included in the CSV file.


### Selecting the data to export

The exported data will depend on the currently selected tab:
- Selecting the **Overall Cost** tab will export the cost values.
- Selecting the **Ingress** or **Egress** tab will export the produced/consumed bytes.


### Exporting data for different time periods

The exported data will be formatted based on the selected time period:
- Selecting **7D** or **30D** will export the relevant data broken down per day.
- Selecting **6M**, **12M** or **YTD** will export the relevant data broken down per month.