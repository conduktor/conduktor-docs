---
sidebar_position: 3
title: Self-service Resources
description: Self-service resources
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Admonition from '@theme/Admonition';

export const Highlight = ({children, color, text}) => (
<span style={{ backgroundColor: color, borderRadius: '4px', color: text, padding: '0.2rem 0.5rem', fontWeight: '500', }}>
{children}
</span>
);

export const CLI = () => (
<Highlight color="#F8F1EE" text="#7D5E54">CLI</Highlight>
);

export const API = () => (
<Highlight color="#E7F9F5" text="#067A6F">API</Highlight>
);

export const TF = () => (
<Highlight color="#FCEFFC" text="#9C2BAD">Terraform</Highlight>
);

export const GUI = () => (
<Highlight color="#F6F4FF" text="#422D84">Console UI</Highlight>
);


export const AppToken = () => (
<Highlight color="#F0F4FF" text="#3451B2">Application Token</Highlight>
);

export const AdminToken = () => (
<Highlight color="#FEEFF6" text="#CB1D63">Admin Token</Highlight>
);



## Self-service Resources

### Application
An application represents a streaming app or data pipeline that is responsible for producing, consuming or processing data from Kafka.  

In Self-service, it is used as a means to organize and regroup multiple deployments of the same application (dev, prod) or different microservices that belong to the same team under the same umbrella.

**API Keys:** <AdminToken />  
**Managed with:** <CLI /> <API />

````yaml
# Application
---
apiVersion: "v1"
kind: "Application"
metadata:
  name: "clickstream-app"
spec:
  title: "Clickstream App"
  description: "FreeForm text, probably multiline markdown"
  owner: "groupA" # technical-id of Console Group
````

**Application checks:**
-   `spec.owner` is a valid Console Group
-   Delete MUST fail if there are associated `ApplicationInstance`

**Side effect in Console & Kafka:**  
None.  
Deploying this object only create the Application in Console. It can be viewed in the Application Catalog

### Application Instance
Application Instance represent an actual deployment of an application on a Kafka Cluster for a Service Account.  
This is the core concept of Self-service as it ties everything together:
- Kafka cluster
- Service Account
- Ownership on resources
- Policies on resources

**API Keys:** <AdminToken />  
**Managed with:** <CLI /> <API />

````yaml
---
apiVersion: "v1"
kind: "ApplicationInstance"
metadata:
  application: "clickstream-app"
  name: "clickstream-microservice1-dev"
  labels:
    conduktor.io/service-account-all-permissions-topics: true # Allows the SA to create/delete internal topics - gateway to validate
    conduktor.io/gitops-only: true # Prevents updates from the UI
spec:
  cluster: "shadow-it"
  serviceAccount: "sa-clicko2"
  topicPolicyRef:
    - "generic-dev-topic"
    - "clickstream-naming-rule"
  resources:
  - type: TOPIC
    name: "click.micro1."
    patternType: PREFIXED
    ownerShipPermission: ["TopicRead", "TopicWrite"] # Impacts the ServiceAccount & Console
  - type: GROUP
    name: "click.micro1."
    patternType: PREFIXED
---
apiVersion: "v1"
kind: "ApplicationInstance"
metadata:
  application: "clickstream-app"
  name: "clickstream-microservice2-dev"
spec:
  cluster: "shadow-it"
  serviceAccount: "sa-clicko2"
  topicPolicyRef:
    - "generic-dev-topic"
    - "clickstream-naming-rule"
  appInstancePermissionPolicy:
    - "must-have-jira"
  resources:
    - type: TOPIC
      name: "click.micro2."
      patternType: PREFIXED
    - type: GROUP
      name: "click.micro2."
      patternType: PREFIXED
````
**AppInstance checks:**
- `metadata.application` is a valid Application
- `spec.cluster` is a valid Console Cluster technical id
- `spec.cluster` is immutable (can't update after creation)
- `spec.serviceAccount` is **optional**, and if present not already used by other AppInstance for the same `spec.cluster`
- `spec.topicPolicyRef` is **optional**, and if present must be a valid list of TopicPolicy
- `spec.resources[].type` can be `TOPIC`, `GROUP`, `SUBJECT`.
- `spec.resources[].patternType` can be `PREFIXED` or `LITERAL`.
- `spec.resources[].name` must no overlap with any other `ApplicationInstance` on the same cluster.
    -   ie: If there is already an owner for `click.` this is forbidden:
        -   `click.orders.`: Resource is a child-resource of `click.`
        -   `cli`: Resource is a parent-resource of `click.`

**Side effect in Console & Kafka:**
- Console
    - Members of the Owner Group are given all permissions in the UI over the owned resources
    - Members of the Owner Group can create Application Token from the UI
- Kafka
    - Service Account is granted the following ACLs over the declared resources depending on the type:
        - Topic: READ, WRITE, DESCRIBE_CONFIGS
        - ConsumerGroup: READ


### Topic Policy
Topic Policies force Application Teams to conform to Topic rules set at their ApplicationInstance level.  
Typical use case include:
- Safeguarding from invalid or risky Topic Configuration
- Enforcing naming convention
- Enforcing metadata

**API Keys:** <AdminToken />  
**Managed with:** <CLI /> <API />  

```yaml
---
apiVersion: "v1"
kind: "TopicPolicy"
metadata:
  name: "generic-dev-topic"
spec:
  policies:
    metadata.labels.conduktor.io/public-visibility:
      constraint: OneOf
      values: ["true", "false"]
    spec.configs.retention.ms: 
      constraint: Range
      max: 42
      min: 3
    spec.replication.factor:
      constraint: OneOf
      values: ["3"]
---
apiVersion: "v1"
kind: "TopicPolicy"
metadata:
  name: "wiki-naming-rule"
spec:
  policies:
    metadata.name:
      constraint: Match
      pattern: ^wikipedia\.(?<event>[a-z0-9]+)\.(avro|json)$
```

#### Available Constraints
**Range**  
Validates the property belongs to a range of numbers (inclusive)
```yaml
spec.configs.retention.ms:
  constraint: "Range"
  min:   3600000 # 1 hour in ms
  max: 604800000 # 7 days in ms
```
Validation will succeed with these inputs:
- 3600000 (min)
- 36000000 (between min & max)
- 604800000 (max)

Validation will fail with these inputs:
- 60000 (below min)
- 999999999 (above max)

**OneOf**  
Validates the property is one of the expected values
```yaml
spec.configs.cleanup.policy:
  constraint: OneOf
  values: ["delete", "compact"]
```
Validation will succeed with these inputs:
- `delete`
- `compact`  

Validation will fail with these inputs:
- `delete, compact` (Valid in Kafka but not allowed by policy)
- `deleet` (typo)

**Match**  
Validates the property against a Regular Expression
```yaml
metadata.name:
  constraint: Match
  pattern: ^wikipedia\.(?<event>[a-z0-9]+)\.(avro|json)$
```
Validation will succeed with these inputs:
- `wikipedia.links.avro`
- `wikipedia.products.json`

Validation will fail with these inputs
- `notwikipedia.products.avro2`: `^` and `$` prevents anything before and after the pattern 
- `wikipedia.all-products.avro`: `(?<event>[a-z0-9]+)` prevents anything else than lowercase letters and digits

**Optional Flag**  
Constraints can be marked as optional. In this scenario, the constraint will only be validated if the field exists.
Example:
```yaml
spec.configs.min.insync.replicas:
  constraint: ValidString
  optional: true
  values: ["2"]
```
This object will pass the validation
````yaml
---
apiVersion: v1
kind: Topic
metadata:
  cluster: shadow-it
  name: click.event-stream.avro
spec:
  replicationFactor: 3
  partitions: 3
  configs:
    cleanup.policy: delete
    retention.ms: '60000'
````
This object will fail the validation
````yaml
---
apiVersion: v1
kind: Topic
metadata:
  cluster: shadow-it
  name: click.event-stream.avro
spec:
  replicationFactor: 3
  partitions: 3
  configs:
    min.insync.replicas: 3
    cleanup.policy: delete
    retention.ms: '60000'
````

### Cross Application Permissions
Application Instance Permissions lets teams to collaborate with each others.

**API Keys:** <AdminToken />  <AppToken />  
**Managed with:** <CLI /> <API />  

````yaml
# Permission granted to other Applications
---
apiVersion: v1
kind: "ApplicationInstancePermission"
metadata:
  application: "clickstream-app"
  appInstance: "clickstream-app-dev"
  name: "clickstream-app-dev-to-another"
spec:
  resource:
    type: TOPIC
    name: "click.event-stream.avro"
    patternType: LITERAL
  permission: READ
  grantedTo: "another-appinstance-dev"
````
**Cross Application permission checks:**
- `spec` is immutable
    - Once created, you will only be able to update its metadata. **This is to protect you from making a change that could impact an external application.**
    - Remember this resource affects target ApplicationInstance's Kafka service account ACLs.
    - To edit this resource, delete and recreate it.
- `spec.resource.type` can be `TOPIC`.
- `spec.resource.patternType` can be `PREFIXED` or `LITERAL`.
- `spec.resource.name` must reference any "sub-resource" of `metadata.appInstance` .
    - For example, if you are owner of the prefix `click.`, you can grant READ or WRITE access to:
        -   the whole prefix: `click.`
        -   a sub prefix: `click.orders.`
        -   a literal topic name: `click.orders.france`
- `spec.permission` can be `READ` or `WRITE`.
- `spec.grantedTo` must be an `ApplicationInstance` on the same Kafka cluster as `metadata.appInstance`.

**Side effect in Console & Kafka:**
- Console
  - Members of the `grantedTo` ApplicationInstance are given the associated permissions (Read/Write) in the UI over the resources
- Kafka
  - Service Account of the `grantedTo` ApplicationInstance is granted the following ACLs over the `resource` depending on the `spec.permission`:
    - `READ`: READ, DESCRIBE_CONFIGS
    - `WRITE`: READ, WRITE, DESCRIBE_CONFIGS

### Application Group
:::caution Not implemented yet
This concept will be available in a future version
:::

**API Keys:** <AdminToken />  <AppToken />  
**Managed with:** <CLI /> <API />

Create Application Group to directly reflect how your Application operates.
You can create as many Application Groups as required to restrict or represent the different teams that use Console on your Application, e.g.:
- Support Team with only Read Access in Production
- DevOps Team with extended access across all environments
- Developers with higher permissions in Dev

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