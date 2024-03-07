---
sidebar_position: 3
title: Self Service
description: Kafka Self Serve Overview
---

# Kafka Self-Serve

## Overview

Self Service helps you scale Kafka usage in your organization by facilitating collaboration between the **Central Platform Team** and **Application Teams**.  
It simplifies and automates processes, establishes clear rules and ways of working, and standardizes the creation and management of Kafka resources.  
This approach brings governance into your enterprise through concepts like Ownership and Applications, delegating operations to the Application Teams rather than the Central Platform Team.

### Benefits for Applications Teams
- Autonomy and responsibility over their resources
- Isolation with Application namespaces
- Collaboration with using Permission Delegation without any help from the Central Platform
- Discoverability through Topic Catalog
### Benefits for Central Platform Team
- Define the general rules of the game
- Enforce naming conventions
- Safeguard from invalid or expensive configurations (wrong replication factor, high partition number, ...)
- Declare the Applications and their rights
- 🍹🏖️

Self Service relies on a central concept, the Application which deals with 3 main concerns:
- Ownership of the Application on **Kafka** resources
- How **People** interract with the Application
- Self Service & Governance **Processes**.
  ![Image](img/application-concept.png)

:::info
**Conduktor Self Serve is constantly evolving!**  
We listen to your feedback to build the most awesome Product
:::

## Core Concepts

Each concept presented here correlates to a resource that can be deployed on Self Service.  
For the full definition of each resource, check the CLI Reference documentation

### Application
An application represents a streaming app or data pipeline that is responsible for producing, consuming or processing data from Kafka. 
Applications give context to Kafka resources (topics, consumer groups & subjects) that directly relate to the functioning of that application or pipeline.  

**Example**
````yaml
---
apiVersion: "v1"
kind: "Application"
meta:
  name: "clickstream-app"
spec:
  title: "Clickstream App"
  description: "Clickstream records user’s clicks through their journey on our website"
  owner: "clickstream-group"            # technical-id of Console Group
````

### Application Instance
**Applications** are generally deployed to one or more Kafka clusters, typically to align with the organization's development cycle or environments.
We call this concept **Application Instance**:
- It is linked to a Kafka Cluster and a Service Account
- It has ownership on the Kafka resources (topics, consumer groups, subjects, ...)
- It manages the permissions
  - On the Service Account (Kafka ACL)
  - On the Application Team members in Console

**Example**
````yaml
# Application Instances (environment)
---
apiVersion: "v1"
kind: "AppInstance"
meta:
  application: "clickstream-app"
  name: "clickstream-app-dev"
spec:
  cluster: "shadow-it"
  
  service-account-spec:
    service-account: "sa-clickstream-dev"
    permissions: []
  people-spec:
    maxPermissions: []
  resources:
    - resourceType: TOPIC
      resource: "click."
      resourcePatternType: PREFIXED [PREFIX, LITERAL]
    - resourceType: GROUP
      resource: "click."
      resourcePatternType: PREFIXED
````

Delegating ownership on the Kafka resources grants permissions to
- the Application owner group in Console using RBAC (`Admin` permissions)
- the Service Account using Kafka ACLs (`Read & Write` on Topics, `Read` on ConsumerGroups)

This will evolve as we implement new concepts in Self Serve to better manage People permissions over the application.

## Kafka Concepts

### Cross-Application Instance Permission
While Application Instance grants the ownership on the resources, Application Instance Permissions lets teams to collaborate with each others.  
This resource is managed by the owners of the Application and the  
**Example**
````yaml
# Permission granted to other Applications
---
apiVersion: v1
kind: "AppInstancePermission"
metadata:
  application: "clickstream-app"
  appInstance: "clickstream-app-dev"
  name: "clickstream-app-dev-to-another"
spec:
  resourceType: TOPIC
  resource: "click.screen-events"
  resourcePatternType: LITERAL
  permission: READ
  grantedTo: "heatmap-app-dev"
````

## People Concepts
### Application Teams (Sub Groups/Sub Teams ?)
**Example**
````yaml
# Permissions granted to Console users in the Application
---
apiVersion: v1
kind: "ApplicationGroup"
metadata:
  application: "clickstream-app"
  name: "clickstream-support"
spec:
  title: Support Clickstream
  description: |
    Members of the Support Group are allowed:
      Read access on all the resources
      Can restart owned connectors
      Can reset offsets
  permissions:
    - appInstance: clickstream-app-dev
      resourceType: TOPIC
      resourcePatternType: "LITERAL"
      resourcePattern: "*" # All owned & subscribed topics
      permissions: ["topicViewConfig", "topicConsume"]
    - appInstance: clickstream-app-dev
      resourceType: GROUP
      resourcePatternType: "LITERAL"
      resourcePattern: "*" # All owned consumer groups
      permissions: ["consumerGroupCreate", "consumerGroupReset", "consumerGroupDelete", "consumerGroupView"]
    - appInstance: clickstream-app-dev
      resourceType: CONNECTOR
      resourcePatternType: "LITERAL"
      resourcePattern: "*" # All owned connectors
      permissions: ["kafkaConnectorViewConfig", "kafkaConnectorStatus", "kafkaConnectPauseResume", "kafkaConnectRestart"]
  members:
    - user1@company.org
    - user2@company.org
  externalGroups:
    - GP-COMPANY-CLICKSTREAM-SUPPORT

````
## Process & Governance Concepts

### Resource Policies
### Topic Catalog

## User Interface
For now, Self Service relies heavily on the CLI. This helps us move fast and is more aligned with the opinionated principles we have at Conduktor. We want you to manage all this using GitOps approach.

The Conduktor UI will be useful as an Application & Topic Catalog.

