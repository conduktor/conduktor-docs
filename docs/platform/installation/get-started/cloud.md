---
sidebar_position: 4
title: Conduktor Cloud
description: Use our managed cloud service to get started with Conduktor in just a few minutes. The below guide will show you how to sign up and configure your first cluster.
---

# Conduktor Cloud

Use our managed cloud service to get started with Conduktor in just a few minutes. The below guide will show you how to sign up and configure your first cluster.

## Sign Up

- Navigate to [https://signup.conduktor.io/](https://signup.conduktor.io)
- Underneath **_Don't have an account?_**, select [sign up](https://signup.conduktor.io)
- Follow the onboarding to create your organization

## Configure Your First Cluster

Once you have created your organization, you will land on the **Welcome** screen.

In the top-left of the screen, use the solution switcher to navigate to the **Admin** section.

![Home Screen](/img/get-started/Home-Screen.png)

:::info
By default, only administrators can configure clusters for your organization.
:::

From the **Admin** section, navigate to the **Clusters** tab.

![Clusters](/img/get-started/Clusters.png)

Select **Create cluster** to configure your first cluster.

You will be required to input the following information:

- **Cluster name**: This will enable you to reference your cluster when using Conduktor
- **Bootstrap servers**: The list of host and port pairs used to establish the initial connection to the Kafka cluster
- **Additional properties**: Additional properties that you would usually provide your CLI or Java clients. This is especially important if you have a secure Kafka cluster.

Use the **Test connection** button to validate your cluster is reachable.

![New-Cluster](/img/get-started/New-Cluster.png)

Once you have successfully configured your cluster, head to the **Console** to start exploring your Kafka data.

![Clusters-Console](/img/get-started/Clusters-Console.png)
