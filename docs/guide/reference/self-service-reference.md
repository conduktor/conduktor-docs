---
title: Self-service resources
displayed: false
description: Self-service resources
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';
import Label from '@site/src/components/Labels';

## Application

An application represents a streaming app or data pipeline that's responsible for producing, consuming or processing data in Kafka.  

In <GlossaryTerm>Self-service</GlossaryTerm>, it's used as a method to organize and re-group multiple deployments of the same application (dev, prod) or different microservices that belong to the same team under one umbrella.

- **API key(s):** <Label type="AdminToken" /> 
- **Managed with:** <Label type="CLI" /> <Label type="API" /> <Label type="TF" />
- **Labels support:** <Label type="MissingLabelSupport" />

````yaml
# Application
---
apiVersion: self-service/v1
kind: Application
metadata:
  name: "clickstream-app"
spec:
  title: "Clickstream App"
  description: "FreeForm text, probably multiline markdown"
  owner: "groupA" # technical-id of the Conduktor Console Group
````

**Application checks:**

- `spec.owner` is a valid Console group
- Delete **has to fail** if there are associated `ApplicationInstance`

**Side effects:**

- None - deploying this object will only create the application in Console that can be managed on the **Application Catalog** page.

## ApplicationInstance

Application instance represents an actual deployment of an application on a Kafka cluster for a service account.

This is the core concept of Self-service, as it **ties everything together**: Kafka cluster, service account, ownership of resources and policies.

- **API key(s):** <Label type="AdminToken" /> 
- **Managed with:** <Label type="CLI" /> <Label type="API" /> <Label type="TF" />
- **Labels support:** <Label type="MissingLabelSupport" />

````yaml
---
apiVersion: self-service/v1
kind: ApplicationInstance
metadata:
  application: "clickstream-app"
  name: "clickstream-dev"
spec:
  cluster: "shadow-it"
  serviceAccount: "sa-clicko"
  topicPolicyRef:
    - "generic-dev-topic"
    - "clickstream-naming-rule"
  defaultCatalogVisibility: PUBLIC # makes all owned topics visible in the Topic Catalog by default
  resources:
    - type: TOPIC
      patternType: PREFIXED
      name: "click."
    - type: CONSUMER_GROUP
      patternType: PREFIXED
      name: "click."
    - type: SUBJECT
      patternType: PREFIXED
      name: "click."
    - type: CONNECTOR
      connectCluster: shadow-connect
      patternType: PREFIXED
      name: "click."
    - type: TOPIC
      patternType: PREFIXED
      ownershipMode: LIMITED # Topics are still maintained by central team
      name: "legacy-click."
````

**AppInstance checks:**

- `metadata.application` is a valid application.
- `spec.cluster` is a valid Console cluster technical Id.
- `spec.cluster` is immutable (can't be updated after creation).
- `spec.serviceAccount` (optional). If already used by another *AppInstance* on the the same `spec.cluster`, it can't be set.
- `spec.applicationManagedServiceAccount` (optional), default is `false`. If set to `true`, the service account ACLs will be managed by the application owners directly instead of being synchronized by the *ApplicationInstance*. [Find out more about managed service account](#application-managed-service-account).
- `spec.topicPolicyRef` (optional), if defined, has to be a valid list of [TopicPolicy](#topicpolicy).
- `spec.policyRef` (optional), if set, has to be a valid list of [ResourcePolicy](#resourcepolicy).
- `spec.defaultCatalogVisibility` (optional), default is `PUBLIC`. Can be `PUBLIC` or `PRIVATE`.
- `spec.resources[].type` can be `TOPIC`, `CONSUMER_GROUP`, `SUBJECT` or `CONNECTOR`:
  - `spec.resources[].connectCluster` is **only mandatory** when `type` is `CONNECTOR`;
  - `spec.resources[].connectCluster` is a valid Connect cluster linked to the Kafka cluster `spec.cluster`.
- `spec.resources[].patternType` can be `PREFIXED` or `LITERAL`.
- `spec.resources[].name` has to not overlap with any other *ApplicationInstance* on the same cluster. I.e.: if there's already an owner for `click`, this is forbidden:
      - `click.orders.`: resource is a child-resource of `click`
      - `cli`: resource is a parent-resource of `click`
- `spec.resources[].ownershipMode` (optional), default is `ALL`. Can be `ALL` or `LIMITED`.

**Side effects:**

- Console
  - Members of the owner group can create application API keys from the UI.
  - Resources with `ownershipMode` set to `ALL`: *ApplicationInstance* is given **all permissions** in the UI and the CLI over the owned resources.
  - Resources with `ownershipMode` set to `LIMITED`: *ApplicationInstance* is restricted the **create/update/delete permissions** in the UI and the CLI over the owned resources:
    - can't use the CLI `apply` command
    - can't create/delete the resource in the UI
    - everything else (restart connector, browse and produce from topic, etc.) is still available. [Find out more about ownership](/guide/use-cases/self-service/#limited-ownership-mode).
- Kafka
  - Service account is granted the following ACLs over the declared resources depending on the type:
    - Topic: `READ`, `WRITE` and `DESCRIBE_CONFIGS`
    - ConsumerGroup: `READ`

### ApplicationInstancePermission

Define permissions for the application instance to enable collaboration between teams.

- **API key(s):** <Label type="AdminToken" /> <Label type="AppToken" />
- **Managed with:** <Label type="CLI" /> <Label type="API" /> 
- **Labels support:** <Label type="MissingLabelSupport" />

````yaml
# Permission granted to other applications
---
apiVersion: self-service/v1
kind: ApplicationInstancePermission
metadata:
  application: "clickstream-app"
  appInstance: "clickstream-app-dev"
  name: "clickstream-app-dev-to-another"
spec:
  resource:
    type: TOPIC
    name: "click.event-stream.avro"
    patternType: LITERAL
  userPermission: NONE
  serviceAccountPermission: READ
  grantedTo: "another-appinstance-dev"
````

**Application instance permission checks:**

- `spec` is immutable:
  - once created, you'll only be able to update its metadata. **This is to protect you from making a change that could impact an external application**.
  - this resource affects target *ApplicationInstance*'s Kafka service account ACLs.
  - to edit this resource, delete and re-create it.
- `spec.resource.type` can be `TOPIC`.
- `spec.resource.patternType` can be `PREFIXED` or `LITERAL`.
- `spec.resource.name` has to reference any 'sub-resource' of `metadata.appInstance`. For example, if you're the owner of the `click.` prefix, you can grant `READ` or `WRITE` access to:
  - the whole `click.` prefix,
  - a sub prefix `click.orders.`,
  - a literal topic name `click.orders.france`.
- `spec.userPermission` can be `READ`, `WRITE` or `NONE`.
- `spec.serviceAccountPermission` can be `READ`, `WRITE` or `NONE`.
- `spec.userPermission` can be `READ` or `WRITE`.
- `spec.serviceAccountPermission` can be `READ` or `WRITE`.
- `spec.grantedTo` has to be an *ApplicationInstance* on the same Kafka cluster as `metadata.appInstance`.

**Side effects:**

- Console
  - Members of the `grantedTo` *ApplicationInstance* are given the associated permissions (`Read`/`Write`) in the UI over the resources.
- Kafka
  - Service account of the `grantedTo` *ApplicationInstance* is granted to the following ACLs over the `resource`, depending on the `spec.permission`:
    - `READ`: READ, DESCRIBE_CONFIGS
    - `WRITE`: READ, WRITE, DESCRIBE_CONFIGS

## ApplicationGroup

Creates an application group to directly reflect how your application operates. You can create as many application groups as required - to restrict or enable the different teams that use Console. For example:

- the support team can only have `Read` access in production environment,
- the devOps team has extended access across all environments,
- the engineering team is granted higher permissions in dev environment only.

- **API key(s):** <Label type="AdminToken" /> <Label type="AppToken" />
- **Managed with:** <Label type="CLI" /> <Label type="API" />
- **Labels support:** <Label type="MissingLabelSupport" />

#### Example

````yaml
# Permissions granted to Console users in the application
---
apiVersion: self-service/v1
kind: ApplicationGroup
metadata:
  application: "clickstream-app"
  name: "clickstream-support"
spec:
  displayName: Support Clickstream
  description: |
    Members of the Support Group are allowed:
      Read access on all the resources
      Can restart owned connectors
      Can reset offsets
  permissions:
    - appInstance: clickstream-app-dev
      resourceType: TOPIC
      patternType: "LITERAL"
      name: "*" # All owned and subscribed topics
      permissions: ["topicViewConfig", "topicConsume"]
    - appInstance: clickstream-app-dev
      resourceType: CONSUMER_GROUP
      patternType: "LITERAL"
      name: "*" # All owned consumer groups
      permissions: ["consumerGroupCreate", "consumerGroupReset", "consumerGroupDelete", "consumerGroupView"]
    - appInstance: clickstream-app-dev
      connectCluster: local-connect
      resourceType: CONNECTOR
      patternType: "LITERAL"
      name: "*" # All owned connectors
      permissions: ["kafkaConnectViewConfig", "kafkaConnectStatus", "kafkaConnectRestart"]
  members:
    - user1@company.org
    - user2@company.org
  externalGroups:
    - GP-COMPANY-CLICKSTREAM-SUPPORT
````

**Application instance permission checks:**

- `spec.permissions[].appInstance` has to be an application instance associated with this application (`metadata.application`).
- `spec.permissions[].resourceType` can be `TOPIC`, `SUBJECT`, `CONSUMER_GROUP` or `CONNECTOR`. When set to `CONNECTOR`, an additional field `spec.permissions[].connectCluster` is mandatory and has to be a valid *KafkaConnectCluster* name.
- `spec.permissions[].patternType` can be `PREFIXED` or `LITERAL`.
- `spec.permissions[].name` has to reference any 'sub-resource' of `metadata.appInstance` or any subscribed topic. Use `*` to include to all owned and subscribed resources associated to this *appInstance*.
- `spec.permissions[].permissions` are valid permissions.
- `spec.members` has to be an email addresses of members that you want to add to this group.
- `spec.externalGroups` a list of LDAP or OIDC groups to sync with this Console group. Members added this way will not appear in `spec.members` list.

**Side effects:**

- Console
  - Members of the *ApplicationGroup* are given the associated permissions in the UI over the resources.
  - Members of the LDAP or OIDC groups will be automatically added or removed upon login.

## Application-managed service account

The Self-service service account is not configured by the central team at the `ApplicationInstance` level.

Instead, the central platform team decides to delegate this responsibility to the application team, which needs to declare their own service account(s) and associated ACLs within the limits of what the `ApplicationInstance` is allowed to do.

- **API key(s):** <Label type="AppToken" />
- **Managed with:** <Label type="CLI" /> <Label type="API" />
- **Labels support:** <Label type="MissingLabelSupport" />

````yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  appInstance: "clickstream-app-dev"
  cluster: shadow-it
  name: clickstream-sa
spec:
  authorization:
    type: KAFKA_ACL
    acls:
      - type: TOPIC
        name: click.event-stream.avro
        patternType: PREFIXED
        operations:
          - Write
          - Read
      - type: CLUSTER
        name: kafka-cluster
        patternType: LITERAL
        operations:
          - DescribeConfigs
      - type: CONSUMER_GROUP
        name: cg-name
        patternType: LITERAL
        operations:
          - Read
````

**Service account checks:**
The checks are the same as the [service account](/guide/reference/kafka-reference/#service-account) resource with additional **limitations**:

- a service account is claimed by the first application team declaring it.
- ACL operations that are not aligned with Self-service approach or would prevent configured policies to apply, are not allowed on service account:
  - **Topic**: topic name has to refer to a topic owned by *ApplicationInstance* or allowed by granted *ApplicationInstancePermission*: `Describe`, `DescribeConfigs`, `Read`, `Write`.
  - **Consumer group**: resource name has to refer to a consumer group owned by *ApplicationInstance* with `Describe` and `Read`.
  - **Cluster**: `Describe` and `DescribeConfigs`.
  - **Delegation token** and **Transactional Id**: both are out of scope, have to be assigned by a central team.
- When an *ApplicationInstancePermission* is removed, we don't drop the ACLs on the *ServiceAccount*. Instead, consecutive CLI calls to apply the resource will fail.

## TopicPolicy

Topic policies force application teams to conform to topic rules, set at their `ApplicationInstance` level. Typical use cases include:

- safeguarding from invalid or risky topic configuration
- enforcing a naming convention
- enforcing metadata

:::warning[Manual application]
Topic policies are not applied automatically. You have to explicitly link them to an [ApplicationInstance](#applicationinstance) with `spec.topicPolicyRef`.
:::

- **API key(s):** <Label type="AdminToken" />
- **Managed with:** <Label type="CLI" /> <Label type="API" /> <Label type="TF" />
- **Labels support:** <Label type="MissingLabelSupport" />

```yaml
---
apiVersion: self-service/v1
kind: TopicPolicy
metadata:
  name: "generic-dev-topic"
spec:
  policies:
    metadata.labels.data-criticality:
      constraint: OneOf
      values: ["C0", "C1", "C2"]
    spec.configs.retention.ms: 
      constraint: Range
      max: 3600000
      min: 60000
    spec.replicationFactor:
      constraint: OneOf
      values: ["3"]
---
apiVersion: self-service/v1
kind: TopicPolicy
metadata:
  name: "clickstream-naming-rule"
spec:
  policies:
    metadata.name:
      constraint: Match
      pattern: ^click\.(?<event>[a-z0-9-]+)\.(avro|json)$
```

**TopicPolicy checks:**

- `spec.policies` require YAML paths that are paths to the [topic resource YAML](/guide/reference/kafka-reference/#topic). For example:
  - `metadata.name` to create constraints on topic name
  - `metadata.labels.<key>` to create constraints on topic label `<key>`
  - `spec.partitions` to create constraints on partitions number
  - `spec.replicationFactor` to create constraints on replication factor
  - `spec.configs.<key>` to create constraints on topic config `<key>`
- `spec.policies.<key>.constraint` can be `Range`, `OneOf` or `Match`

With the two topic policies declared above, the following topic resource would succeed validation:

````yaml
---
apiVersion: kafka/v2
kind: Topic
metadata:
  cluster: shadow-it
  name: click.event-stream.avro  # Checked by Match ^click\.(?<event>[a-z0-9-]+)\.(avro|json)$ on `metadata.name`
  labels:
    data-criticality: C2         # Checked by OneOf ["C0", "C1", "C2"] on `metadata.labels.data-criticality`
spec:
  replicationFactor: 3           # Checked by OneOf ["3"] on `spec.replicationFactor`
  partitions: 3
  configs:
    cleanup.policy: delete
    retention.ms: '60000'        # Checked by Range(60000, 3600000) on `spec.configs.retention.ms`
````

### Topic policy constraints

There are currently five available constraints:

- `Range` validates a range of numbers
- `OneOf` validates against a list of predefined options
- `NoneOf` rejects a value if it matches any item in the list
- `Match` validates using a regex (regular expression)
- `AllowedKeys` limits a set of keys in the dictionaries

#### Range

Validates whether the property belongs to a range of numbers (inclusive):

```yaml
spec.configs.retention.ms:
  constraint: "Range"
  min:   3600000 # 1 hour in ms
  max: 604800000 # 7 days in ms
```

Validation will succeed with these inputs:

- 3600000 (min)
- 36000000 (between min and max)
- 604800000 (max)

Validation will fail with these inputs:

- 60000 (below min)
- 999999999 (above max)

#### OneOf

Validates whether the property is one of the expected values:

```yaml
spec.configs.cleanup.policy:
  constraint: OneOf
  values: ["delete", "compact"]
```

Validation will succeed with these inputs:

- `delete`
- `compact`

Validation will fail with these inputs:

- `delete, compact` (valid in Kafka but not allowed by policy)
- `deleet` (typo)

#### Match

Validates the property against a regex:

```yaml
metadata.name:
  constraint: Match
  pattern: ^wikipedia\.(?<event>[a-z0-9]+)\.(avro|json)$
```

Validation will succeed with these inputs:

- `wikipedia.links.avro`
- `wikipedia.products.json`

Validation will fail with these inputs:

- `notwikipedia.products.avro2`: `^` and `$` prevents anything before and after the pattern
- `wikipedia.all-products.avro`: `(?<event>[a-z0-9]+)` prevents anything else than lowercase letters and digits

#### AllowedKeys

Validates whether the keys are within an allowed key list. Applies to dictionary type (Key/Value maps). Can be used on `spec.configs` and `metadata.labels`.

```yaml
spec.configs:
  constraint: AllowedKeys
  keys:
    - retention.ms
    - cleanup.policy
```

Validation will succeed with this input:

```yaml
---
apiVersion: kafka/v2
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
```

Validation will fail with this input (`min.insync.replicas` is not an allowed key in `spec.configs`):

```yaml
---
apiVersion: kafka/v2
kind: Topic
metadata:
  cluster: shadow-it
  name: click.event-stream.avro
spec:
  replicationFactor: 3
  partitions: 3
  configs:
    min.insync.replicas: '2' # Not in AllowedKeys
    cleanup.policy: delete
    retention.ms: '60000'
```

#### Optional flag

Constraints can be marked as optional. In this scenario, the constraint will only be validated if the field exists. E.g.:

```yaml
spec.configs.min.insync.replicas:
  constraint: ValidString
  optional: true
  values: ["2"]
```

This object will pass the validation:

````yaml
---
apiVersion: kafka/v2
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

This object will fail the validation due to a new incorrect definition of `insync.replicas`:

````yaml
---
apiVersion: kafka/v2
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

## ResourcePolicy
