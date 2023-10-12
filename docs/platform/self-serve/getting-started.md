---
sidebar_position: 1
title: Getting Started
description: Self-Serve
---

# Self-Serve

## Introduction

If this is your first time setting up Self-Serve, please ensure you meet the [requirements](/platform/self-serve/#overview) and are familiar with the self-serve [concepts](/platform/self-serve/#concepts).

This guide will outline how to:
* Setup Self-Serve for your organization
* Configure your environments related to your Kafka clusters
* Configure an application
* Demonstrate request and approval workflows
* To get started, navigate to 'Topic as a Service' from the primary navigation.

## Getting Started
To get started, navigate to *'Topic as a Service'* from the primary navigation.

![overview-figure1.png](/img/self-serve/overview-figure1.png)

## Step 1 - Configure your environments
Configuring your environments is the first step in using Topic as a Service. An environment is a 1 to 1 mapping to your Kafka clusters. Note this step must be completed by an administrator.

![overview-figure2.png](/img/self-serve/overview-figure2.png)

You can see we have created three different environments, one for our development cluster, one for our staging cluster and one for our production cluster.

![overview-figure3.png](/img/self-serve/overview-figure3.png)


## Step 2 - Configure an Application
### Create an Application

From the Applications screen, select **Create Application**.

![overview-figure4.png](/img/self-serve/overview-figure4.png)

- **Name:** The name of your streaming app or data pipeline.
- **Description:** Friendly description of the application and what it is responsible for.
- **Prefix:** Prefix pattern used to identify resources relevant to the application.
For example, consider PaymentApp with the following resources:
topic: payments.transactions
subject: payments.transactions-value
consumer group: payments-consumer
The prefix payments should be used to match all resources relevant to the PaymentApp application.
- **Owner:** The owner of the application that will manage access to the underlying resources.
- **Resource Ownership:** By default, the prefix will be used to determine owned resources.
However, you can add additional resources if the application contains resources with multiple resource patterns.
- **Service Account:** The service account used by the application for programmatic access to the cluster and its resources.
  - ***Note:***
    - ACLs will be created against this principal for the resource prefix(es) you have defined.
    - Ensure you provide the correct service account details for each environment the application resides in.

![overview-figure5.png](/img/self-serve/overview-figure5.png)



## Step 3 - Validate ACLs and Permissions
Once you have created your application in Self-Serve,  ACLs are created for the principal ( the service account). You can see this in the Console screen, under the ACL's tab. In the screenshot below we can see the ACL's created for the Orders application and the name of the principal is the one we defined at creation, orders-app. Added to this 
Role Based Access Control (RBAC) permissions are applied within Conduktor related to this application.

![overview-figure6.png](/img/self-serve/overview-figure6.png)

:::Info
Note: RBAC permissions derived from Self-Serve are not currently visible via the RBAC screen from within Admin. This will be available in an upcoming release.

:::






## Step 4 - Create requests
### Request and Approval Workflows
Users have the ability to self-serve by requesting access to **new** Kafka resources which will need to be approved by an admin and by also requesting access to **existing** Kafka resources, which will then need to be approved by the application owners.

:::info
Note: It's currently only possible to see applications whereby the user is part of the owning team, but it is possible to request access to resources of applications where you are not a part of the owning team.
:::

### Requesting access to existing applications

In the screenshot below, a member of the BI application team is requesting access to topic related to the Orders application to read these messages.

![overview-figure7.png](/img/self-serve/overview-figure7.png)

We can then see when a member of the Orders application team or an overall admin logs in they can see the notifications waiting to be granted access or denied on this application, as shown in the screenshot below.
![overview-figure8.png](/img/self-serve/overview-figure8.png)


If you are part of the group that is defined as the owner for an application, you will be able to approve these application requests. After being approved or denied the BI application team can see the external topics which they have access to and the rights to each, whether read/write or not.
![overview-figure9.png](/img/self-serve/overview-figure9.png)


### Requesting resources for a new application
It's possible to request resources for a new application, regardless of whether you are an admin or a non-admin with a subset of permissions.

To request resources for a new application, click create application.
See example below of creating a Sales Orders application as a non admin.
![overview-figure10.png](/img/self-serve/overview-figure10.png)


:::Info
Note: that if you have the RBAC permission: Can manage Topic as a Service Applications and Approve requests , then your request will not go through an approval workflow.
:::



### Approving requests for new applications

To approve a new request, a member of the admin team must approve or deny it.
When the admin logs in they will see, in the Requests tab, a notification symbol to indicate  pending requests.

![overview-figure11.png](/img/self-serve/overview-figure11.png)



The admin can then decide with all of the given information whether to approve or deny this new application. 
![overview-figure12.png](/img/self-serve/overview-figure12.png)

