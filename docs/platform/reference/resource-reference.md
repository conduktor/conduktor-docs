---
sidebar_position: 4
title: Resources Reference
description: All Conduktor resources
---

import Admonition from '@theme/Admonition';

export const Highlight = ({children, color}) => (
<span
style={{
backgroundColor: color,
borderRadius: '4px',
color: '#fff',
padding: '0.2rem',
}}>
{children}
</span>
);

The resources presented here can be managed from the CLI, the Public API, or the Console UI.  
- CLI and Public API uses an API Key to validate permissions.
- Console UI relies on RBAC model to validate what the user can do.

:::caution Work In Progress...
We're working hard to bring consistent experience using the CLI, API, and Console UI, but it is not the case today.
:::
We'll inform you about the compatibility matrix for each resource using the following labels: <Highlight color="#edb009">CLI</Highlight> <Highlight color="#098aed">API</Highlight> <Highlight color="#8157ff">Console UI</Highlight>  


There are two kind of API Key to use with the API or CLI:
- <Highlight color="#25c2a0">Admin Token</Highlight> have all permissions over all resources in Console
- <Highlight color="#1877F2">Application Token</Highlight> permission are scoped to Application instances defined in Self Serve

In general, <Highlight color="#25c2a0">Admin Token</Highlight> can bypass Application owners and "act" as an <Highlight color="#1877F2">Application Token</Highlight>

## Self Serve Resources

### Application
This resource defines a Self Serve Application.  
**API Keys:** <Highlight color="#25c2a0">Admin Token</Highlight>  
**Managed with:** <Highlight color="#edb009">CLI</Highlight> <Highlight color="#098aed">API</Highlight>

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
**API Keys:** <Highlight color="#25c2a0">Admin Token</Highlight>  
**Managed with:** <Highlight color="#edb009">CLI</Highlight> <Highlight color="#098aed">API</Highlight>

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
- Kafka
  - Service Account is granted the following ACLs over the declared resources depending on the type:
    - Topic: READ, WRITE, DESCRIBE_CONFIGS
    - ConsumerGroup: READ


### Topic Policy
**API Keys:** <Highlight color="#25c2a0">Admin Token</Highlight>  
**Managed with:** <Highlight color="#edb009">CLI</Highlight> <Highlight color="#098aed">API</Highlight>

Topic Policies force Application Teams to conform to Topic rules set at their ApplicationInstance level.  
Typical use case include:
- Safeguarding from invalid or risky Topic Configuration
- Enforcing naming convention
- Enforcing metadata

```yaml
---
apiVersion: "v1"
kind: "TopicPolicy"
metadata:
  name: "generic-dev-topic"
spec:
  policies:
    metadata.labels.conduktor.io/public-visibility:
      constraint: ValidString
      values: ["true", "false"]
    spec.configs.retention.ms: 
      constraint: "Range"
      max: 42,
      min: 3,
      required: false
    spec.replication.factor:
      constraint: ValidString
      values: ["3"]
    spec.cleanup.policy: 
      constraint: NonEmpty
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

### Cross Application Permission Policy
:::caution Not implemented yet
This concept will be available in a future version
:::
**API Keys:** <Highlight color="#25c2a0">Admin Token</Highlight>  
**Managed with:** <Highlight color="#edb009">CLI</Highlight> <Highlight color="#098aed">API</Highlight>

ApplicationInstancePermission Policies force Application Teams to respect a set of rules when they declare ApplicationInstancePermission resources.  

Typical use case include:
  - Enforcing metadata to track the intention or justification behind the cross application permission

```yaml
---
apiVersion: "v1"
kind: "ApplicationInstancePermissionPolicy"
metadata:
  name: "must-have-jira"
spec:
  policies:
    metadata.labels.bankart.si/jira-ticket:
      constraint: NonEmpty
```

### Cross Application Permissions
**API Keys:** <Highlight color="#25c2a0">Admin Token</Highlight>  <Highlight color="#1877F2">Application Token</Highlight>

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
    name: "click."
    patternType: PREFIXED
  permission: READ
  grantedTo: "another-appinstance-dev"
````
**Cross Application permission checks:**
- `spec` is immutable
    - Once created, you will only be able to update its metadata. **This is to protect you from making a change that could impact an external application.**
    - Remember this resource affects target ApplicationInstance's Kafka service account ACLs.
    - To edit this resource, delete and recreate it.
- `spec.resource.type` can be `TOPIC`, `GROUP`, `SUBJECT`.
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
    - Service Account of the `grantedTo` ApplicationInstance is granted the following ACLs over the `resource` depending on the permission:
        - READ: READ, DESCRIBE_CONFIGS
        - WRITE: READ, WRITE, DESCRIBE_CONFIGS

### Application Group
:::caution Not implemented yet
This concept will be available in a future version
:::

**API Keys:** <Highlight color="#25c2a0">Admin Token</Highlight>  <Highlight color="#1877F2">Application Token</Highlight>  
**Managed with:** <Highlight color="#edb009">CLI</Highlight> <Highlight color="#098aed">API</Highlight>

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

## Kafka Resources

At the moment, Kafka resources are only managed through <Highlight color="#8157ff">Console UI</Highlight>

### Topic
:::caution Not implemented yet
This concept will be available in a future version
:::
**API Keys:** <Highlight color="#25c2a0">Admin Token</Highlight>  <Highlight color="#1877F2">Application Token</Highlight>  
**Managed with:** <Highlight color="#edb009">CLI</Highlight> <Highlight color="#098aed">API</Highlight> <Highlight color="#8157ff">Console UI</Highlight>  


````yaml
---
apiVersion: v1
kind: Topic
metadata:
  name: click.event-stream.avro
spec:
  replicationFactor: 3
  partitions: 3
  configs:
    min.insync.replicas: '2'
    cleanup.policy: delete
    retention.ms: '60000'
````
**Topic checks:**
- `metadata.name` must belong to the Application Instance.
- `spec.replicationFactor` and `spec.partitions` are immutable and cannot be modified once the topic is created.
- All other properties are validated if Application Instance has [TopicPolicies](#topic-policy) attached.

**Side effect in Console & Kafka:**
- Kafka
  - Topic is created / updated.

### Subject
:::caution Not implemented yet
This concept will be available in a future version
:::

**API Keys:** <Highlight color="#25c2a0">Admin Token</Highlight>  <Highlight color="#1877F2">Application Token</Highlight>  
**Managed with:** <Highlight color="#edb009">CLI</Highlight> <Highlight color="#098aed">API</Highlight> <Highlight color="#8157ff">Console UI</Highlight>

**Local file**

```yaml
---
apiVersion: v1
kind: Subject
metadata:
  name: myPrefix.topic-value
spec:
  schemaFile: schemas/topic.avsc # relative to conduktor CLI execution context
```

**Inline**

```yaml
---
apiVersion: v1
kind: Subject
metadata:
  name: myPrefix.topic-value
spec:
  schema: |
    {
      "type": "long"
    }
```

**Schema Reference**

```yaml
---
apiVersion: v1
kind: Subject
metadata:
  name: myPrefix.topic-value
spec:
  schema: |
    {
      "type": "record",
      "namespace": "com.schema.avro",
      "name": "Client",
      "fields": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "address",
          "type": "com.schema.avro.Address"
        }
      ]
    }
  references:
    - name: com.schema.avro.Address
      subject: commons.address-value
      version: 1
```

### Connector
:::caution Not implemented yet
This concept will be available in a future version
:::
**API Keys:** <Highlight color="#25c2a0">Admin Token</Highlight>  <Highlight color="#1877F2">Application Token</Highlight>  
**Managed with:** <Highlight color="#edb009">CLI</Highlight> <Highlight color="#098aed">API</Highlight> <Highlight color="#8157ff">Console UI</Highlight>  

```yaml
---
apiVersion: v1
kind: Connector
metadata:
  name: myPrefix.myConnector
spec:
  connectCluster: myConnectCluster
  config:
    connector.class: io.connect.jdbc.JdbcSourceConnector
    tasks.max: '1'
    topics: myPrefix.myTopic
    connection.url: "jdbc:mysql://127.0.0.1:3306/sample?verifyServerCertificate=false&useSSL=true&requireSSL=true"
    consumer.override.sasl.jaas.config: o.a.k.s.s.ScramLoginModule required username="<user>" password="<password>";

```

## Console Resources
**API Keys:** <Highlight color="#25c2a0">Admin Token</Highlight>  
**Managed with:** <Highlight color="#098aed">API</Highlight> <Highlight color="#8157ff">Console UI</Highlight>

### KafkaCluster
### KafkaConnectCluster
### KsqlDBCluster
### ConsoleGroup
### ConsoleUser
### Alert
### MaskingRule