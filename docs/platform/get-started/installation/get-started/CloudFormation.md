---
sidebar_position: 4
title: AWS Marketplace - CloudFormation
description: Deploy an instance of Conduktor Console on AWS via CloudFormation.
---

# Deployment on AWS CloudFormation

## Getting started

This guide will demonstrate how to use [AWS CloudFormation](https://aws.amazon.com/cloudformation/) to deploy Console in your AWS environment with all mandatory dependencies. It will deploy Conduktor as a Docker container on an ECS service with Fargate and configure it alongside a PostgreSQL database via RDS.

:::info
While this guide will help you get started, you may need to make additional configurations to ensure your deployment is [production-ready](/platform/get-started/installation/hardware/#production-requirements).
:::

The process should take no more than 15 - 30 minutes.

## Security

This template will create all the resources on a public subnet. However, the DB instance is available on private and public subnets. It is important to keep this in mind when using it.

## Networking & Architecture

![AWS Deployment](assets/conduktor.ecs.drawio.svg)

## Deployment Steps

1. Go to `https://<region>.console.aws.amazon.com/cloudformation`.

1. Click on "Create stack" button and choose the "With new resources" option.

    ![Alt Cloudformation](assets/cloudformation-guide-1.png)

1. Choose the following options.

    ![Alt Cloudformation](assets/cloudformation-guide-2.png)

1. Upload one of our templates:

    > Decide if you want to deploy Console using your own resources (cluster, DB, etc.) or if you want us to deploy all resource dependencies alongside Console as well.

    To deploy Console **only**, you can use the following template:

    - [CDK-lite-template](https://github.com/conduktor/quickstart-conduktor-cloudformation/blob/main/templates/CDK-lite-template.yaml)

    To deploy Console and all resources needed (e.g. DB), you can use the following template:

    - [CDK-Full-template](https://github.com/conduktor/quickstart-conduktor-cloudformation/blob/main/templates/CDK-full-template.yaml)

1. Click "next".

1. Give your stack a name and define/ review the parameters.

    - If you have chosen the [CDK-lite-template](https://github.com/conduktor/quickstart-conduktor-cloudformation/blob/main/templates/CDK-lite-template.yaml), then you will have to supply the following values before you can continue.

    | Parameter | Value |
    | -------- | ------- |
    | `Subnet` | The ARN of the subnet you want to deploy your ECS service on. |
    | `SecurityGroup` |  The Security group that will have access to your ECS service. |
    | `ClusterArn` | The ARN of the cluster you want to deploy your ECS service on. |
    | `DatabaseEndpoint` | The endpoint of your DB instance. |
    | `DatabaseName` | The name of your DB instance. |
    | `DatabaseUsername` | The username for the above DB instance. |
    | `DatabasePassword` | The password for the above DB instance. |

    ![Alt Config](assets/cloudformation-guide-3.png)

    - If you have chosen the [CDK-Full-template](https://github.com/conduktor/quickstart-conduktor-cloudformation/blob/main/templates/CDK-full-template.yaml), then you **won't** have to supply any parameter values, but you may override the default ones.

    :::warning
    Note the default value for the region is specified in the template as **`eu-west-1a`** (public subnet) and **`eu-west-1b`** (private subnet), if you are deploying in a **different region** you must update these values.
    :::

    ![Alt Config](assets/cloudformation-guide-4.png)

1. Click "next".

1. Acknowledge the tick box. *This will ensure we have the right permissions to access our ECS instance!*

    ![Alt Tickbox](assets/cloudformation-guide-5.png)

1. Click "submit".

1. Wait for all resources to be created. *This may take some time!*

1. From the "Resources" tab, click on `conduktor-ecs` then navigate to your newly created **Service** and then **Task**.  

    ![Alt Cluster](assets/cloudformation-guide-6.png)
    ![Alt Service](assets/cloudformation-guide-7.png)
    ![Alt Task](assets/cloudformation-guide-8.png)

1. Find the `conduktor-console` Container and navigate to the **Network bindings** tab.

    ![AWS Guide Breadcrumb](assets/aws-guide-8.png)

1. Click on the **External** link to open the Console application.

    ![AWS Guide Network Bindings](assets/aws-guide-9.png)

    > In our example, our application is running at 3.122.113.99:8080.

### Access Conduktor

You can now log in as admin with the credentials previously defined in the environment variables:

- e.g. `bob@conduktor.io` / `admin`

![AWS Guide Breadcrumb](assets/aws-guide-10.png)

Select the **Configure clusters** option and start adding your Kafka cluster configurations.

### Onboard your team

Now that you have an up-and-running deployment of Console, it's time to invite your team!

 - [Configure SSO](/platform/category/configure-sso/) to easily onboard users
 - Configure [local users](/platform/get-started/configuration/user-authentication/local-admin-and-users/) if you are not using SSO
