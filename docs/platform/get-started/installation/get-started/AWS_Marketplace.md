---
sidebar_position: 4
title: AWS Marketplace
description: Deploy Conduktor Console on AWS via CloudFormation.
---

# Deployment on AWS Marketplace

## Getting started

This guide demonstrates how to use our AWS Marketplace quick deployment on [AWS CloudFormation](https://aws.amazon.com/cloudformation/).

It contains a brief overview of the architecture followed by the steps on how to deploy Console in your AWS environment with all mandatory dependencies. It will deploy Conduktor as a Docker container on an ECS service with Fargate and configure it alongside a PostgreSQL database via RDS.

The Conduktor Marketplace offering is the Community Edition. If you are interested in our enterprise offering then [contact us](https://conduktor.io/contact/demo?utm_source=docs&utm_medium=product) for a free demo.

:::info
While this guide will help you get started, you may need to make additional configurations to ensure your deployment is [production-ready](/platform/get-started/installation/hardware/#production-requirements).
:::

The template is designed for a speedy deployment, you'll be deployed in only a few clicks. You may however need to wait several minutes for AWS to spin up the resources ☕.

## Security

In this configuration all the resources are on a public subnet. However, the DB instance is available on both private and public subnets. It is important to keep this in mind when using it.

## Networking & Architecture

![AWS Deployment](assets/conduktor.ecs.drawio.svg)

## Deployment Steps

1. Visit the [Marketplace listing page](https://aws.amazon.com/marketplace/pp/prodview-xjv65ie5rjtxu).

1. Select `View purchase options`.

    ![AWS Marketplace](./assets/aws-marketplace-1.png)

1. Accept the terms of service.

    ![AWS Marketplace](./assets/aws-marketplace-2.png)

1. Select `Continue to Configuration`.

    ![AWS Marketplace](./assets/aws-marketplace-3.png)

1. `Continue to Launch`. There is only one supported Software Version and fulfillment option available.

    ![AWS Marketplace](./assets/aws-marketplace-4.png)

1. You now can choose how you want to deploy the CloudFormation template. We offer a quicklink that will take you directly to the CloudFormation console with the template pre-filled on your last previously used region (What this guide will be covering). We also offer the raw CloudFormation template that you can download and deploy manually. Select `Quick launch CloudFormation template`.

1. Choose the `Quick launch CloudFormation template` to be taken directly to the CloudFormation console with the template pre-filled on your last previously used region. If you wish you may instead download the template file, adjust it and manually deploy yourself. The rest of the guide assumes you want to continue with quick launch.

    ![AWS Marketplace](./assets/aws-marketplace-5.png)

1. This will open you up to the CloudFormation page with the template pre-filled. Press `Next`.

    ![AWS Marketplace](./assets/aws-marketplace-6.png)

1. You will then be given the option to change the stack name and insert your values into the parameters. Once you are happy with the parameters, press `Next`.




8.  Give your stack a name and define/ review the parameters.

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
1. Create the default stack by clicking `Next`
![create the stack](./assets/create-stack.png)

1. Change the stack name, it won't accept the `.` from `0.0.1` , if you wish adjust the parameters, otherwise click `Next`.
![choose stack name](./assets/stack-name.png)


    :::warning
    Note the default value for the region is specified in the template as **`eu-west-1a`** (public subnet) and **`eu-west-1b`** (private subnet), if you are deploying in a **different region** you must update these values.
    :::

    ![AWS Marketplace](./assets/aws-marketplace-7.png)

9.  Configure your stack options and acknowledge that the CloudFormation template will create IAM resources. Then press `Next`.

    ![AWS Marketplace](./assets/aws-marketplace-8.png)

10. You can then review the CloudFormation stack and then press `Submit`.

    ![AWS Marketplace](./assets/aws-marketplace-9.png)

11. Wait for all resources to be created. This may take some time, about 10 minutes depending how quickly AWS deploys RDS.

    ![AWS Marketplace](./assets/aws-marketplace-10.png)


12. From the "Resources" tab, click on `${AWS::StackName}-conduktor-ecs-cluster` then navigate to your newly created **Service** and then **Task**. (Be sure to click on the links)  

    ![Alt Cluster](assets/aws-marketplace-11.png)
    ![Alt Service](assets/aws-marketplace-12.png)
    ![Alt Task](assets/aws-marketplace-13.png)

13. Find the `conduktor-console` Container, **not** the `conduktor-console-cortex` container, and navigate to the **Network bindings** tab.

    ![AWS Guide Breadcrumb](./assets/aws-marketplace-14.png)

14. Click on the **External** link to open the Console application.

    ![AWS Guide Network Bindings](./assets/aws-marketplace-15.png)

    > In our example, our application is running at 54.155.197.172:8080.

### Access Conduktor

You will now be greeted with the create admin login, take note of the credentials you're about to create, they are for this instance, Conduktor cannot remotely interact with these. From here you can make additional local users if you want to add others, when ready for a production level deployment you will likely want to connect to SSO for importing your organization's existing users and groups.

![onboarding login](./assets/login.png)
