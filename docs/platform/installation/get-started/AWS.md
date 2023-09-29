---
sidebar_position: 7
title: AWS
description: Use AWS to deploy a production-ready instance of Conduktor Console on MSK.
---

# Deployment on AWS

## Getting started

This blog contains all the information you should need to configure and deploy Conduktor Console on AWS with MSK. 
https://aws.amazon.com/blogs/big-data/gain-visibility-into-your-amazon-msk-cluster-by-deploying-the-conduktor-platform/

## Resources required 

- An S3 bucket to store our configuration files.
- An ECR repository to store our final Docker image.
- A CodeBuild project to build that Docker image.
- An IAM role and policy to allow CodeBuild to perform the build.

## Security

Note that IAM credentials are stored in S3 and on EFS/EBS.  Permissions limiting access to these should be applied.
 
## Networking & Architecture 
![AWS Deployment](../../configuration/assets/aws_network.png)

## Use AWS RDS / Aurora as database

**Only available starting at version 1.17.0 of the Console**

If you want to use AWS RDS or AWS Aurora as database, please take in 
consideration the following:

- Console will not work with all Postgresql engines within RDS, it will 
  only work with engine version 14.8 / 15.3, other versions are not fully 
  supported.
- Console configuration through our onboarding interface won't work, users 
  should configure the console either with a yaml file or with environment
  variables.