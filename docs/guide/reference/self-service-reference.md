---
title: Self-service resources
displayed: false
description: Self-service resources
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';
import Label from '@site/src/components/Labels';

## Application

An application represents a streaming app or data pipeline that is responsible for producing, consuming or processing data from Kafka.  

In Self-service, it is used as a means to organize and regroup multiple deployments of the same application (dev, prod) or different microservices that belong to the same team under the same umbrella.

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

- `spec.owner` is a valid Console Group
- Delete MUST fail if there are associated `ApplicationInstance`

**Side effect in Console and Kafka:**

None!cDeploying this object will only create the application in Console. It can be viewed in the Application Catalog.

## ApplicationInstance

Application instance represents an actual deployment of an application on a Kafka cluster for a service account.

This is the core concept of Self-service, as it ties everything together: Kafka cluster, service account, ownership on resources and policies on resources.

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
      ownershipMode: LIMITED # Topics are still maintained by Central Team
      name: "legacy-click."
````

**AppInstance checks:**

- `metadata.application` is a valid Application
- `spec.cluster` is a valid Console Cluster technical id
- `spec.cluster` is immutable (can't update after creation)
- `spec.serviceAccount` is **optional**, and if present not already used by other AppInstance for the same `spec.cluster`
- `spec.applicationManagedServiceAccount` is **optional**, default `false`. 
  - If set to `true`, the service account ACLs will be managed by the Application owners directly instead of being synchronized by the ApplicationInstance component.
  - Check dedicated section [Application-managed Service Account](#application-managed-service-account)
- `spec.topicPolicyRef` is **optional**, and if present must be a valid list of [TopicPolicy](#topic-policy)
- `spec.defaultCatalogVisibility` is **optional**, default `PUBLIC`. Can be `PUBLIC` or `PRIVATE`.
- `spec.resources[].type` can be `TOPIC`, `CONSUMER_GROUP`, `SUBJECT` or `CONNECTOR`
  - `spec.resources[].connectCluster` is **only mandatory** when `type` is `CONNECTOR`
  - `spec.resources[].connectCluster` is a valid Connect Cluster linked to the Kafka Cluster `spec.cluster`
- `spec.resources[].patternType` can be `PREFIXED` or `LITERAL`
- `spec.resources[].name` must not overlap with any other `ApplicationInstance` on the same cluster. I.e.: if there's already an owner for `click.` this is forbidden:
        -   `click.orders.`: Resource is a child-resource of `click`
        -   `cli`: Resource is a parent-resource of `click`
- `spec.resources[].ownershipMode` is **optional**, default `ALL`. Can be `ALL` or `LIMITED`

**Side effect in Console and Kafka:**

- Console
  - Members of the Owner Group can create Application API Keys from the UI
  - Resources with `ownershipMode` to `ALL`: 
    - ApplicationInstance is given **all** permissions in the UI and the CLI over the owned resources
  - Resources with `ownershipMode` to `LIMITED`:
    - ApplicationInstance is restricted the Create/Update/Delete permissions in the UI and the CLI over the owned resources
      - Can't use the CLI apply command
      - Can't Create/Delete the resource in the UI
      - Everything else (restart connector, Browse and Produce from Topic, ...) is still available
  - [Read More about ownershipMode here](/platform/navigation/self-serve/#limited-ownership-mode)
- Kafka
  - Service Account is granted the following ACLs over the declared resources depending on the type:
    - Topic: READ, WRITE, DESCRIBE_CONFIGS
    - ConsumerGroup: READ

## TopicPolicy

Topic policies force application teams to conform to topic rules, set at their `ApplicationInstance` level. Typical use case include:

- Safeguarding from invalid or risky topic configuration
- Enforcing a naming convention
- Enforcing metadata

:::warning[Manual application]
Topic policies are not applied automatically. You have to explicitly link them to an [ApplicationInstance](#application-instance) with `spec.topicPolicyRef`.
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

- `spec.policies` requires YAML paths that are paths to the [Topic resource](/platform/reference/resource-reference/kafka/#topic) YAML. For example:
  - `metadata.name` to create constraints on Topic name
  - `metadata.labels.<key>` to create constraints on Topic label `<key>`
  - `spec.partitions` to create constraints on Partitions number
  - `spec.replicationFactor` to create constraints on Replication Factor
  - `spec.configs.<key>` to create constraints on Topic config `<key>`
- `spec.policies.<key>.constraint` can be `Range`, `OneOf` or `Match`
  - Read the [Policy Constraints](#policy-constraints) section for each constraint's specification

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

## ApplicationInstancePermission

Application instance permissions lets teams collaborate with each other.

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

- `spec` is immutable
    - Once created, you will only be able to update its metadata. **This is to protect you from making a change that could impact an external application**
    - Remember this resource affects target ApplicationInstance's Kafka service account ACLs
    - To edit this resource, delete and recreate it
- `spec.resource.type` can be `TOPIC`
- `spec.resource.patternType` can be `PREFIXED` or `LITERAL`
- `spec.resource.name` must reference any "sub-resource" of `metadata.appInstance`
    - For example, if you are owner of the prefix `click.`, you can grant READ or WRITE access to:
        -   the whole prefix: `click.`
        -   a sub prefix: `click.orders.`
        -   a literal topic name: `click.orders.france`
- `spec.userPermission` can be `READ` or `WRITE` or `NONE`.
- `spec.serviceAccountPermission` can be `READ` or `WRITE` or `NONE`.
- `spec.permission` can be `READ` or `WRITE`. (Deprecated,  use `spec.userPermission` and `spec.serviceAccountPermission` instead)
- `spec.grantedTo` must be an `ApplicationInstance` on the same Kafka cluster as `metadata.appInstance`

**Side effect in Console and Kafka:**

- Console
  - Members of the `grantedTo` ApplicationInstance are given the associated permissions (Read/Write) in the UI over the resources
- Kafka
  - Service Account of the `grantedTo` ApplicationInstance is granted the following ACLs over the `resource` depending on the `spec.permission`:
    - `READ`: READ, DESCRIBE_CONFIGS
    - `WRITE`: READ, WRITE, DESCRIBE_CONFIGS

## ApplicationGroup

Create application group to directly reflect how your application operates. You can create as many application groups as required, to restrict or represent the different teams that use Console. For example:

- support team with only `Read` access in production environment
- devOps team with extended access across all environments
- engineering team with higher permissions in dev environment only

- **API key(s):** <Label type="AdminToken" /> <Label type="AppToken" />
- **Managed with:** <Label type="CLI" /> <Label type="API" />
- **Labels support:** <Label type="MissingLabelSupport" />

### Example

````yaml
# Permissions granted to Console users in the Application
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

- `spec.permissions[].appInstance` must be an Application Instance associated to this Application (`metadata.application`)
- `spec.permissions[].resourceType` can be `TOPIC`, `SUBJECT`, `CONSUMER_GROUP` or `CONNECTOR`
  - When `resourceType` is `CONNECTOR`, additional field `spec.permissions[].connectCluster` is mandatory. Must be a valid KafkaConnectCluster name
- `spec.permissions[].patternType` can be `PREFIXED` or `LITERAL`
- `spec.permissions[].name` must reference any "sub-resource" of `metadata.appInstance` or any subscribed Topic
  - Use `*` to include to all owned and subscribed resources associated to this `appInstance`
- `spec.permissions[].permissions` are valid permissions as defined in [Permissions](/platform/reference/resource-reference/console/#permissions)
- `spec.members` must be email addresses of members you wish to add to this group.
- `spec.externalGroups` is a list of LDAP or OIDC groups to sync with this Console Groups
  - Members added this way will not appear in `spec.members`

**Side effect in Console and Kafka**

- Console
  - Members of the ApplicationGroup are given the associated permissions in the UI over the resources
  - Members of the LDAP or OIDC groups will be automatically added or removed upon login
- Kafka
  - No side-effects

## Application-managed service account

:::info
For the regular (non Self-Service) Service Account, see [Service Account](/platform/reference/resource-reference/kafka/#service-account)
:::

In this mode, the service account is not configured by the central team at the `ApplicationInstance` level.

Instead, the central platform team decides to delegate this responsibility to the application team, which need to declare their own service account(s) and its associated ACLs within the limits of what the `ApplicationInstance` is allowed to do.

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
The checks are the same as the [service account](/platform/reference/resource-reference/kafka/#service-account) resource with additional limitations:

**Limitations**:

- A Service Account is claimed by first Application Team declaring them
- ACL Operations that are not aligned with Self-Service philosophy or would prevent configured Policies to apply are not allowed on Service Account
  - **Topic**: ~~Alter~~, ~~AlterConfigs~~, ~~Create~~, ~~Delete~~, Describe, DescribeConfigs, Read, Write
    - Topic name must refer to a Topic owned by ApplicationInstance or allowed by granted ApplicationInstancePermission
  - **Consumer Group**: ~~Delete~~, Describe, Read
    - Resource name must refer to a Consumer Group owned by ApplicationInstance
  - **Cluster**: ~~Alter~~, ~~AlterConfigs~~, ~~ClusterAction~~, ~~Create~~, Describe, DescribeConfigs
  - **Delegation Token**: 🚫 (Out of scope, must be assigned by Central Team)
  - **Transactional Id**: 🚫 (Out of scope, must be assigned by Central Team)
- When an ApplicationInstancePermission is removed, we don't drop the ACLs on the ServiceAccount.
  - Instead, consecutive CLI calls to apply the resource will fail, forcing the Application Team to fix.

### Topic policy constraints

There are currently 5 available constraints:

- `Range` validates a range of numbers
- `OneOf` validates against a list of predefined options
- `NoneOf` rejects a value if it matches any item in the list
- `Match` validates using Regular Expression
- `AllowedKeys` limits a set of keys in the dictionaries

#### Range

Validates the property belongs to a range of numbers (inclusive):

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

Validates the property is one of the expected values:

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

#### Match

Validates the property against a Regular Expression:

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

Validates the keys are within an allowed key list. Applies to dictionary type (Key/Value maps). Can be used on `spec.configs` and `metadata.labels`.

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

Validation will fail with this input (`min.insync.replicas` not an Allowed Key in `spec.configs`):

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
