---
sidebar_position: 6
title: Deploy Conduktor on AWS CloudAWS CloudFormation
displayed: false
description: Deploy Conduktor on AWS CloudAWS CloudFormation
---

## Overview

You can deploy Console using [AWS CloudFormation](https://aws.amazon.com/cloudformation/).

This guide contains a brief overview of the marketplace listing architecture followed by the steps on how to deploy Console in your AWS environment with all the mandatory dependencies. It will deploy Conduktor as a Docker container on an ECS service with Fargate and configure it alongside a PostgreSQL database via RDS.

:::info[Community version]
This Conduktor marketplace offering is the Community version and this guide is intended to help you get started. Additional configurations might be required to ensure your deployment is production ready.
:::

You can [download a template](https://conduktor-marketplace.s3.us-east-1.amazonaws.com/templates/full_template/conduktor-console_full-template-latest.yaml) to use, just update it with your own values. This template is designed to be deployed in only a few clicks. You may, however, need to wait a few minutes for AWS to spin up the resources.

:::info[Security]
In this configuration, all the resources are on a public subnet. However, the DB instance is available on both private and public subnets. Keep this in mind as part of any security concerns for the database.
:::

![AWS Deployment](/guides/conduktor.ecs.png)

### Deployment steps

1. Visit the [Marketplace listing page](https://aws.amazon.com/marketplace/pp/prodview-xjv65ie5rjtxu).

2. Select `View purchase options`.

    ![AWS Marketplace](/guides/aws-marketplace-1.png)

3. Accept the terms of service.

    ![AWS Marketplace](/guides/aws-marketplace-2.png)

4. Select `Continue to Configuration`.

    ![AWS Marketplace](/guides/aws-marketplace-3.png)

5. `Continue to Launch`. There is only one supported Software Version and fulfillment option available.

    ![AWS Marketplace](/guides/aws-marketplace-4.png)

6. You now can choose how you want to deploy the CloudFormation template. We offer a quicklink that will take you directly to the CloudFormation console with the template pre-filled on your last previously used region (What this guide will be covering). We also offer the raw CloudFormation template that you can download and deploy manually. Select `Quick launch CloudFormation template`.

    ![AWS Marketplace](/guides/aws-marketplace-5.png)

7. This will open you up to the CloudFormation page with the template pre-filled. Press `Next`.

    ![AWS Marketplace](/guides/aws-marketplace-6.png)

8. You will then be given the option to change the stack name or any of the other default values from our template. You will need to provide values for the missing CIDR properties towards the bottom of the page. Once you are happy with the parameters, press `Next`.

    :::warning[Default region]
    The default value for the region is specified in the template as `eu-west-1a` (public subnet) and `eu-west-1b`(private subnet). If you're deploying in a different region, you have to update these values.
    :::

    ![AWS Marketplace](/guides/aws-marketplace-7.png)

9. Configure your stack options and acknowledge that the CloudFormation template will create IAM resources and click **Next**.

    ![AWS Marketplace](/guides/aws-marketplace-8.png)

10. You can then review the CloudFormation stack and then click **Submit**.

    ![AWS Marketplace](/guides/aws-marketplace-9.png)

11. Wait for all resources to be created. This may take some time, about 10 minutes depending how quickly AWS deploys RDS.

    ![AWS Marketplace](/guides/aws-marketplace-10.png)

12. From the **Resources** tab, click on `${AWS::StackName}-conduktor-ecs-cluster`. From **Cluster**, navigate to your newly created **Service** and then to the **Task**. Be sure to click on the links.  

    ![Alt Cluster](/guides/aws-marketplace-11.png)
    ![Alt Service](/guides/aws-marketplace-12.png)
    ![Alt Task](/guides/aws-marketplace-13.png)

13. Find the `conduktor-console` Container and (not the *conduktor-console-cortex* one) and navigate to the **Network bindings** tab.

    ![AWS Guide Breadcrumb](/guides/aws-marketplace-14.png)

14. Click on the **External** link to open the Console application. In this example, our application is running at 54.155.197.172:8080.

    ![AWS Guide Network Bindings](/guides/aws-marketplace-15.png)

### Access Conduktor

You will now be greeted with the create admin login. Create credentials and **make a note/save them** as they are for this instance. If lost, Conduktor cannot remotely reset these credentials.

From here, you can add additional local users if needed. When you're ready for a production level deployment, you'll want to connect to SSO for importing your organization's existing users and groups.

![onboarding login](/guides/login.png)
