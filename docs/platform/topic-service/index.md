---
sidebar_position: 1
title: Overview
description: Self Service
---

# Self Service

## Overview

Self Service standardises your foundational processes for creating and managing Kafka resources such as topics, consumer groups and subjects.
Instead of giving free reign to teams and developers, it allows you to bring governance into your enterprise. This is achieved by defining environments, applications and using requests and approval workflows to grant access to the applications. 

:::info
Pre-requisites 

To start using Self Service you need:
* Conduktor Console running
* At least one Kafka cluster to map an environment to
* An enterprise Conduktor license with access to TAAS
* Administrator access on Conduktor Console to do the environment mapping initially.
:::

## Concepts

### Environments

#### What is an Environment?

An environment is a 1-1 mapping with your physical Kafka cluster environments.
Configuring your environments is the first step in enabling self-service use amongst your teams of Topic as a Service.  Note this step must be completed by an administrator.

Examples might be:
If you have development, staging and production Kafka clusters, you should configure 3 environments:
* Development
* Staging
* Production


### Applications
#### What is an Application?

An application represents a streaming app or data pipeline that is responsible for producing, consuming or processing data from Kafka.
Applications give context to Kafka resources (topics, consumer groups & subjects) that directly relate to the functioning of that application or pipeline.

Examples might be:
* StockTradingApp
* FraudDetectionApp
* Clickstream
* CheckoutApp


### Requests
#### What is a Request?
A request represents a user seeking the approval to read/write to specific resources  which do not currently belong to his/her team.
The requests tab will show all previous requests and their state of the user in question.

Examples might be:
* Requesting to read a topic belonging to the BI team, which is subsequently granted.
* Requesting to write to a topic belonging to the Order team, which is subsequently denied.
* Requesting to create a new application within Self Service overall. 

