---
sidebar_position: 1
title: Overview
description: Self Service
---

# Self-Serve

## Overview

Self-Serve standardises your foundational processes for creating and managing Kafka resources such as topics, consumer groups and subjects.
Instead of giving free reign to teams and developers, it allows you to bring governance into your enterprise. This is achieved by defining environments, applications and using requests and approval workflows to grant access to the applications. 

**Pre-requisites**
 
To start using Self-Serve you need:
* Conduktor Console running
* At least one Kafka cluster to map an environment to
* An enterprise Conduktor license with access to TAAS
* Administrator access on Conduktor Console to do the environment mapping initially.

## Concepts

### Environments

#### What is an Environment?

An environment is a 1-1 mapping with your physical Kafka cluster environments.
Configuring your environments is the first step in enabling Self-Serve use amongst your teams. Note this step must be completed by an administrator.

Examples might be:
If you have development, staging and production Kafka clusters, you should configure 3 environments:
* Development
* Staging
* Production

![figure1-concepts.png](/img/self-serve/figure1-concepts.png)

### Applications
#### What is an Application?

An application represents a streaming app or data pipeline that is responsible for producing, consuming or processing data from Kafka.
Applications give context to Kafka resources (topics, consumer groups & subjects) that directly relate to the functioning of that application or pipeline.

Examples might be:
* StockTradingApp
* FraudDetectionApp
* Clickstream
* CheckoutApp

![figure-2-concepts.png](/img/self-serve/figure-2-concepts.png)

### Requests
#### What is a Request?
A request represents a user seeking the approval to create a new application within Conduktor Self-Serve. The requests tab will show the current pending requests, the requests which have been approved/rejecred and the history of all similar previous requests made by users to the administrators of your Conduktor instance(s). Note this tab is only available to those with adiministrator priviliges.

Examples might be:
* Requesting to create a new application within Self Serve is pending.
* Requesting to create a new application within Self Serve is approved or rejected.
* All previous requests whether approved or rejected.

![figure3-concepts.png](/img/self-serve/figure3-concepts.png)
