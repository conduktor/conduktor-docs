# Deployment on AWS CloudFormation

## Getting started

This guide will demonstrate how to use [AWS CloudFormation](https://aws.amazon.com/cloudformation/) to deploy Console in your AWS environment with all mandatory dependencies. It will deploy Conduktor as a Docker container on an ECS service with Fargate and configure it alongside a PostgreSQL database via RDS.

> While this guide will help you get started, you may need to make additional configurations to ensure your deployment is production-ready.

The process should take no more than 15 - 30 minutes.

## Security

This template will create all of the resources on a public subnet. It is important to keep this in mind when using it.

## Networking & Architecture

![alt text](assets/conduktor.ecs.drawio.svg)

## Deployment Steps

1. Go to https://\<region>.console.aws.amazon.com/cloudformation. Choose your environment.

1. Decide if you want to deploy console use your own resources (cluster, DB and etc) or if you want us to deploy the extra resources along side console as well.

    To deploy console **only**, you the following template:

    - TODO: insert git link

    To deploy console and extra resources, you the following template:

    - TODO: insert git link

    Make sure to define the following parameters on before executing your template: 

1. Wait until all the resources are created.

1. Go to to your newly created task on your ECS service. 

1. Find your console-container.

1. Go to the Network Bindings tab and click on on the external url.

1. Interact with your recently deployed console! 