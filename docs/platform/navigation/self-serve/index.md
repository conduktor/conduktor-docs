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

### Benefits for Central Platform Team
- Define the general rules of the game
- Enforce naming conventions
- Safeguard from invalid or expensive configurations (wrong replication factor, high partition number, ...)
- Declare the Applications and their rights
- 🍹🏖️
### Benefits for Applications Teams
- Autonomy and responsibility over their resources
- Isolation with Application namespaces
- Collaboration with using Permission Delegation without any help from the Central Platform
- Discoverability through Topic Catalog

## Concepts
Self Service relies on a central concept, the **Application** which embeds with 3 main concerns:
- Application Ownership on the **Kafka** resources
- How **People** interact with the Application
- Self Service **Processes** & Governance rules
  ![Image](img/application-concept.png)


Each concept presented here correlates to a resource that can be deployed on Self Service.  
For the full definition of each resource, check the CLI Reference documentation.

## Administrator Resources

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

Delegating ownership on the Kafka resources grants permissions to
- the Application owner group in Console using RBAC (`Admin` permissions)
- the Service Account using Kafka ACLs (`Read & Write` on Topics, `Read` on ConsumerGroups)

This will evolve as we implement new concepts in Self Serve to better manage People permissions over the application.

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
  service-account: "sa-clickstream-dev"
  resources:
    - resourceType: TOPIC
      resource: "click."
      resourcePatternType: PREFIXED [PREFIX, LITERAL]
    - resourceType: GROUP
      resource: "click."
      resourcePatternType: PREFIXED
````

### Application Instance Policies
:::caution
This concept will be available in a future version
:::
Application Instances Policies restrict the Application Teams to create their resources following certain rules.
The rules can be related to Kafka configs but can also apply to metadata.  
This is what lets Platform Administrators provide a Self Serve experience that doesn't look like the Wild West
**Example**
````yaml
# Policies that restrict the Application to certain range of configurations
# on topic configs, but also on topic metadata
---
apiVersion: v1
kind: "ApplicationInstancePolicies"
metadata:
  appInstance: "clickstream-app-dev"
  name: "clickstream-dev-policies"
spec:
  topicConstraints:
    metadata:
      annotations:
        conduktor.io/topic-visibility:
          validation-type: NonEmptyString
        business-data-classification:
          validation-type: ValidString
          validStrings: ["C1", "C2", "C3", "C4"]  
    spec:
      partitions:
        validation-type: Range
        min: 1
        max: 6
      replication.factor:
        validation-type: Range
        min: 3
        max: 3
      min.insync.replicas:
        validation-type: Range
        min: 2
        max: 2
````


## Application Team Resources
When Application & ApplicationInstance are defined, Application Teams can now organize and structure their application as they see wish.
There are 2 groups of resources where Application Teams are given autonomy:
- Kafka-related resources, allowing teams to define their Topics, Subjects, Connectors, ...
- Console-related resources, in particular ApplicationGroup, allowing them to define internally who can do what within their Team.

### Kafka resources
This is how Application Teams can create the Kafka resources they need for their applications.  

````yaml
# Topic example
---
apiVersion: v1
kind: "Topic"
metadata:
  appInstance: "clickstream-app-dev"
  name: "click.screen-events"
spec:
  replicationFactor: 3
  partitions: 6
  configs:
    min.insync.replicas: "2"
    cleanup.policy: "delete"
    retention.ms: "60000"

# Connector Example
---
apiVersion: v1
kind: "Connector"
metadata:
  appInstance: "clickstream-app-dev"
  name: click.myConnector
spec:
  connectCluster: myConnectCluster
  config:
    connector.class: myConnectorClass
    tasks.max: '1'
    topics: "click.screen-events"
    file: /tmp/output.out
    consumer.override.sasl.jaas.config: o.a.k.s.s.ScramLoginModule required username="<user>" password="<password>";

````

### Cross-Application Instance Permission
Application Instance Permissions lets teams to collaborate with each others.
Deploying this object will grant permission to the `grantedTo` Application Instance:
- To its Service Account (Kafka ACL)
- To the Application Team members in Console

**Example**
````yaml
# Read permission granted to other Heatmap Application on click.screen-events topic
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

### Application Group
:::caution
This concept will be available in a future version
:::
Create Application Group to directly reflect how your Application operates. 
You can create as many Application Group as required to restrict or represent the different population that uses Console on your Application:
- Support Team with only Read Access in Production
- DevOps Team with extended access across all environments
- Developpers with higer permissions in Dev
- ...

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

### Resource labels & annotations

All resources that can be created using the Conduktor CLI can store internal metadata in the form of labels and annotations.
Labels and Annotations are to be used in the same manner as stated in [Kubernetes Concept documentation](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/).
You can use either labels or annotations to attach metadata to resources. Labels can be used to select resources and to find collections of resources that satisfy certain conditions. In contrast, annotations are not used to identify and select resources.

**Labels** will help you filter and sort your resources in Console UI / CLI.  
**Annotations** will help you attach business meaning on your resources & drive some behaviors in Console.

**Example**
````yaml
# Topic annotated with useful metadata
---
apiVersion: v1
kind: "Topic"
metadata:
  appInstance: "clickstream-app-dev"
  name: clickstream.events
  annotations:
    description: "A description for what kind of data this topic contains."
    business-data-classification: C2
    business-doc-url: "https://confluence.company.org/display/CLICK/Kafka"
    conduktor.io/topic-visibility: "public"
  labels:
    application-code: CLK
    environment-code: dev
spec:
  replicationFactor: 3
  partitions: 6
  configs:
    min.insync.replicas: "2"
    cleanup.policy: "delete"
    retention.ms: "60000"
````

#### Driving Console behaviors
Here's a few examples of annotations that can drive Console:
- Topic:
  - `conduktor.io/catalog-access: [true/false]`: Whether to make the topic discoverable in Topic Catalog
  - `conduktor.io/dlq-topic: [true/false]`:
  - `conduktor.io/dlq-main: [<topic>]`:


### Topic Catalog

Noticed the annotation `conduktor.io/catalog-access: "true"` in the previous example?  
That's how you make the topic discoverable in the Topic Catalog in Console.


## User Interface
For now, Self Service relies entirely on the Conduktor CLI. 

This helps us move fast and is more aligned with the opinionated principles we have at Conduktor: we want you to manage all this using GitOps approach.

Having a UI will eventually become necessary as we add more features and connect them with Console & Gateway
The Conduktor UI will be useful as an Application & Topic Catalog.

