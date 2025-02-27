---
sidebar_position: 4
title: AWS Marketplace and CloudFormation
description: Deploy Conduktor Console on AWS via CloudFormation.
---

# Deployment on AWS Marketplace or with CloudFormation

This page demonstrates how to use our AWS Marketplace offering for a quick deployment of Console using [AWS CloudFormation](https://aws.amazon.com/cloudformation/). If you are looking to deploy Console via CloudFormation then you can follow similar steps to this guide, referencing your own template file, using our [example template](https://conduktor-marketplace.s3.us-east-1.amazonaws.com/templates/full_template/conduktor-console_full-template-latest.yaml) as a guide, with your own values.

## Getting started

This guide contains a brief overview of the Marketplace listing architecture followed by the steps on how to deploy Console in your AWS environment with all mandatory dependencies. It will deploy Conduktor as a Docker container on an ECS service with Fargate and configure it alongside a PostgreSQL database via RDS.

The Conduktor Marketplace offering is the Community Edition. If you are interested in our enterprise offering then [contact us](https://conduktor.io/contact/demo?utm_source=docs&utm_medium=product) for a free demo.

:::info
While this guide helps get you started, you may need to make additional configurations to ensure your deployment is [production-ready](../hardware.md#production-requirements).
:::

The template is designed for a speedy deployment, you'll be deployed in only a few clicks. You may however need to wait a few minutes for AWS to spin up the resources ☕.

## Security

In this configuration all the resources are on a public subnet. However, the DB instance is available on both private and public subnets. Keep this in mind as part of any security concerns for the DB.

## Networking & Architecture

![AWS Deployment](./assets/conduktor.ecs.png)

## Deployment Steps

1. Visit the [Marketplace listing page](https://aws.amazon.com/marketplace/pp/prodview-xjv65ie5rjtxu).

2. Select `View purchase options`.

    ![AWS Marketplace](./assets/aws-marketplace-1.png)

3. Accept the terms of service.

    ![AWS Marketplace](./assets/aws-marketplace-2.png)

4. Select `Continue to Configuration`.

    ![AWS Marketplace](./assets/aws-marketplace-3.png)

5. `Continue to Launch`. There is only one supported Software Version and fulfillment option available.

    ![AWS Marketplace](./assets/aws-marketplace-4.png)

6. You now can choose how you want to deploy the CloudFormation template. We offer a quicklink that will take you directly to the CloudFormation console with the template pre-filled on your last previously used region (What this guide will be covering). We also offer the raw CloudFormation template that you can download and deploy manually.  
Select `Quick launch CloudFormation template`.

    ![AWS Marketplace](./assets/aws-marketplace-5.png)

7. This will open you up to the CloudFormation page with the template pre-filled. Press `Next`.

    ![AWS Marketplace](./assets/aws-marketplace-6.png)

8. You will then be given the option to change the stack name or any of the other default values from our template. You will need to provide values for the missing CIDR properties towards the bottom of the page. Once you are happy with the parameters, press `Next`.

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

12. From the "Resources" tab, click on `${AWS::StackName}-conduktor-ecs-cluster`. From the **Cluster**, navigate to your newly created **Service** , and then to the **Task**. (Be sure to click on the links).  

    ![Alt Cluster](assets/aws-marketplace-11.png)
    ![Alt Service](assets/aws-marketplace-12.png)
    ![Alt Task](assets/aws-marketplace-13.png)

13. Find the `conduktor-console` Container, **not** the `conduktor-console-cortex` container, and navigate to the **Network bindings** tab.

    ![AWS Guide Breadcrumb](./assets/aws-marketplace-14.png)

14. Click on the **External** link to open the Console application.

    ![AWS Guide Network Bindings](./assets/aws-marketplace-15.png)

    > In our example, our application is running at 54.155.197.172:8080.

### Access Conduktor

You will now be greeted with the create admin login, take note of the credentials you're about to create, they are for this instance, Conduktor cannot remotely interact i.e. reset these credentials. From here you can make additional local users if you want to add other users. When you're ready for a production level deployment you will likely want to connect to SSO for importing your organization's existing users and groups.

![onboarding login](./assets/login.png)

You have now deployed Conduktor Console through the AWS Marketplace.
