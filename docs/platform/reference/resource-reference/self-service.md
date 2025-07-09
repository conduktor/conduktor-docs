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
<Highlight color="#F0F4FF" text="#3451B2">Application API Key</Highlight>
);

export const AdminToken = () => (
<Highlight color="#FEEFF6" text="#CB1D63">Admin API Key</Highlight>
);

export const MissingLabelSupport = () => (
<Highlight color="#F5F5F5" text="#666666">Label Support Incoming</Highlight>
);

export const FullLabelSupport = () => (
<Highlight color="#E6F4EA" text="#1B7F4B">Full Label Support</Highlight>
);

export const PartialLabelSupport = () => (
<Highlight color="#FFF8E1" text="#B26A00">Partial Label Support (No UI yet)</Highlight>
);

## Self-service resources

There are many different resources within Self Service.

### Application

An application represents a streaming app or data pipeline that is responsible for producing, consuming or processing data from Kafka.

In Self-service, it is used as a means to organize and regroup multiple deployments of the same application (dev, prod) or different microservices that belong to the same team under the same umbrella.

**API Keys:** <AdminToken />
**Managed with:** <CLI /> <API /> <TF />
**Labels support:** <MissingLabelSupport />

<Tabs>
<TabItem  value="CLI" label="CLI">

```yaml
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
  policyRef:
    - "global-topic-policy"
    - "application-group-policy"
```

</TabItem>
<TabItem value="Terraform" label="Terraform">

```hcl
resource "conduktor_console_application_v1" "clickstream-app" {
  name = "clickstream-app"
  spec = {
    title       = "Clickstream App"
    description = "FreeForm text, probably multiline markdown"
    # technical-id of the Conduktor Console Group.
    # Could also reference existing resource in Terraform state with conduktor_console_group_v2.groupa.name
    owner       = "groupA"
  }
}
```

</TabItem>
</Tabs>

**Application checks:**

- `spec.owner` is a valid Console Group
- Delete MUST fail if there are associated `ApplicationInstance`
- `spec.policyRef` is **optional**, and if present must be a valid list of [SelfServicePolicy](#resource-policy)
- Rules defined at the Application level will apply across all ApplicationInstances of the same Application.

**Side effect in Console & Kafka:**
None.
Deploying this object will only create the Application in Console. It can be viewed in the Application Catalog.

### Application Instance

Application Instance represent an actual deployment of an application on a Kafka Cluster for a Service Account.
This is the core concept of Self-service as it ties everything together:

- Kafka cluster
- Service Account
- Ownership on resources
- Policies on resources

**API Keys:** <AdminToken />
**Managed with:** <CLI /> <API /> <TF />
**Labels support:** <MissingLabelSupport />

<Tabs>
<TabItem  value="CLI" label="CLI">

```yaml
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
  policyRef:
    - "generic-dev-topic"
    - "clickstream-naming-rule"
    - "generic-dev-connector"
  defaultCatalogVisibility: PUBLIC # makes all owned topics visible in the Topic Catalog by default
  applicationManagedServiceAccount: false
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
```

</TabItem>
<TabItem value="Terraform" label="Terraform">

```hcl
resource "conduktor_console_application_instance_v1" "clickstream-dev" {
  name        = "clickstream-dev"
  application = "clickstream-app"
  spec = {
    cluster   = "shadow-it"
    service_account = "my-service-account"
    topic_policy_ref = [
      "generic-dev-topic",
      "clickstream-naming-rule"
    ]
    policy_ref = [
      "generic-resource-policy"
    ]
    default_catalog_visibility = "PUBLIC"
    resources = [
      {
        type         = "TOPIC"
        name         = "click."
        pattern_type = "PREFIXED"
      },
      {
        type         = "CONSUMER_GROUP"
        name         = "click."
        pattern_type = "PREFIXED"
      },
      {
        type         = "SUBJECT"
        name         = "click."
        pattern_type = "PREFIXED"
      },
      {
        type            = "CONNECTOR"
        connect_cluster = "shadow-connect"
        name            = "click."
        pattern_type    = "PREFIXED"
      },
      {
        type           = "TOPIC"
        name           = "legacy-click."
        pattern_type   = "PREFIXED"
        ownership_mode = "LIMITED" # Topics are still maintained by Central Team
      }
    ]
    application_managed_service_account = false
  }
}
```

</TabItem>
</Tabs>

**AppInstance checks:**

- `metadata.application` is a valid Application
- `spec.cluster` is a valid Console Cluster technical id
- `spec.cluster` is immutable (can't update after creation)
- `spec.serviceAccount` is **optional**, and if present not already used by other AppInstance for the same `spec.cluster`
- `spec.applicationManagedServiceAccount` is **optional**, default `false`.
  - If set to `true`, the service account ACLs will be managed by the Application owners directly instead of being synchronized by the ApplicationInstance component.
  - Check dedicated section [Application-managed Service Account](#application-managed-service-account)
- `spec.topicPolicyRef` is **optional**, and if present must be a valid list of [Topic Policy](#topic-policy)
- `spec.policyRef` is **optional**, and if present must be a valid list of [SelfServicePolicy](#resource-policy)
- `spec.defaultCatalogVisibility` is **optional**, default `PUBLIC`. Can be `PUBLIC` or `PRIVATE`.
- `spec.resources[].type` can be `TOPIC`, `CONSUMER_GROUP`, `SUBJECT` or `CONNECTOR`
  - `spec.resources[].connectCluster` is **only mandatory** when `type` is `CONNECTOR`
  - `spec.resources[].connectCluster` is a valid Connect Cluster linked to the Kafka Cluster `spec.cluster`
- `spec.resources[].patternType` can be `PREFIXED` or `LITERAL`
- `spec.resources[].name` must not overlap with any other `ApplicationInstance` on the same cluster
  - ie: If there is already an owner for `click.` this is forbidden:
    - `click.orders.`: Resource is a child-resource of `click`
    - `cli`: Resource is a parent-resource of `click`
- `spec.resources[].ownershipMode` is **optional**, default `ALL`. Can be `ALL` or `LIMITED`

**Side effect in Console & Kafka:**

- Console
  - Members of the Owner Group can create Application API Keys from the UI
  - Resources with `ownershipMode` to `ALL`:
    - ApplicationInstance is given **all** permissions in the UI and the CLI over the owned resources
  - Resources with `ownershipMode` to `LIMITED`:
    - ApplicationInstance is restricted the Create/Update/Delete permissions in the UI and the CLI over the owned resources
      - Can't use the CLI apply command
      - Can't Create/Delete the resource in the UI
      - Everything else (restart connector, Browse & Produce from Topic, ...) is still available
  - [Read More about ownershipMode here](/platform/navigation/self-serve/#limited-ownership-mode)
- Kafka
  - Service Account is granted the following ACLs over the declared resources depending on the type:
    - Topic: READ, WRITE, DESCRIBE_CONFIGS
    - ConsumerGroup: READ

### Topic Policy

:::info
Deprecated. Consider using the more advanced [ResourcePolicy](#resource-policy) resource instead.
:::

Topic Policies force Application Teams to conform to Topic rules set at their ApplicationInstance level.
Typical use case include:

- Safeguarding from invalid or risky Topic configuration
- Enforcing naming convention
- Enforcing metadata

:::caution
Topic policies are not applied automatically.
You must explicitly link them to [ApplicationInstance](#application-instance) with `spec.topicPolicyRef`.
:::

**API Keys:** <AdminToken />
**Managed with:** <CLI /> <API /> <TF />
**Labels support:** <MissingLabelSupport />

<Tabs>
<TabItem  value="CLI" label="CLI">

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

</TabItem>
<TabItem value="Terraform" label="Terraform">

```hcl
resource "conduktor_console_topic_policy_v1" "generic-dev-topic" {
  name = "generic-dev-topic"
  spec = {
    policies = {
      "metadata.labels.data-criticality" = {
        one_of = {
          values = [ "C0", "C1", "C2" ]
        }
      },
      "spec.configs.retention.ms" = {
        range = {
          optional = false
          max      = 3600000
          min      = 60000
        }
      },
      "spec.replicationFactor" = {
        none_of = {
          optional = true
          values = [ "3" ]
        }
      }
    }
  }
}

resource "conduktor_console_topic_policy_v1" "clickstream-naming-rule" {
  name = "clickstream-naming-rule"
  spec = {
    policies = {
      "metadata.name" = {
        match = {
          pattern = "^click\.(?<event>[a-z0-9-]+)\.(avro|json)$"
        }
      },
    }
  }
}
```

</TabItem>
</Tabs>

**TopicPolicy checks:**

- `spec.policies` requires YAML paths that are paths to the [Topic resource](/platform/reference/resource-reference/kafka/#topic) YAML. For example:
  - `metadata.name` to create constraints on Topic name
  - `metadata.labels.<key>` to create constraints on Topic label `<key>`
  - `spec.partitions` to create constraints on Partitions number
  - `spec.replicationFactor` to create constraints on Replication Factor
  - `spec.configs.<key>` to create constraints on Topic config `<key>`
- `spec.policies.<key>.constraint` can be `Range`, `OneOf` or `Match`
  - Read the [Policy Constraints](#topic-policy-constraints) section for each constraint's specification

With the two Topic policies declared above, the following Topic resource would succeed validation:


<Tabs>
<TabItem  value="CLI" label="CLI">

```yaml
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
```

</TabItem>
<TabItem value="Terraform" label="Terraform">

```hcl
resource "conduktor_console_topic_v2" "click-event-steam-avro" {
  cluster = "shadow-it"
  name    = "click.event-stream.avro"  # Checked by Match ^click\.(?<event>[a-z0-9-]+)\.(avro|json)$ on `metadata.name`
  labels  = {
    "data-criticality" = "C2"          # Checked by OneOf ["C0", "C1", "C2"] on `metadata.labels.data-criticality`
  }
  spec = {
    replication_factor = 3              # Checked by OneOf ["3"] on `spec.replicationFactor`
    partitions        = 3
    configs           = {
      "cleanup.policy" = "delete"
      "retention.ms"   = "60000"       # Checked by Range(60000, 3600000) on `spec.configs.retention.ms`
    }
  }
}
```

</TabItem>
</Tabs>

### Resource policy

Resource policies are used to enforce rules on the ApplicationInstance level. Typical use case include:

- Safeguarding from invalid or risky topic or connector configuration
- Enforcing naming convention
- Enforcing metadata

:::caution
Resource policies are not applied automatically.
You must explicitly link them to [ApplicationInstance](#application-instance) or [Application](#application) with `spec.policyRef`.
:::

**API Keys:** <AdminToken />
**Managed with:** <CLI /> <API /> <TF />
**Labels support:** <PartialLabelSupport />

<Tabs>
<TabItem  value="CLI" label="CLI">

```yaml
---
apiVersion: self-service/v1
kind: ResourcePolicy
metadata:
    name: "generic-dev-topic"
    labels:
        business-unit: delivery
spec:
    targetKind: Topic
    description: A policy to check some basic rule for a topic
    rules:
        - condition: spec.replicationFactor == 3
          errorMessage: replication factor should be 3
        - condition: int(string(spec.configs["retention.ms"])) >= 60000 && int(string(spec.configs["retention.ms"])) <= 3600000
          errorMessage: retention should be between 1m and 1h
---
apiVersion: self-service/v1
kind: ResourcePolicy
metadata:
    name: "clickstream-naming-rule"
    labels:
        business-unit: delivery
spec:
    targetKind: Topic
    description: A policy to check some basic rule for a topic
    rules:
        - condition: metadata.name.matches("^click\\.[a-z0-9-]+\\.(avro|json)$")
          errorMessage: topic name should match ^click\.(?<event>[a-z0-9-]+)\.(avro|json)$
        - condition: metadata.labels["data-criticality"] in ["C0", "C1", "C2"]
          errorMessage: data-criticality should be one of C0, C1, C2
```

</TabItem>
<TabItem value="Terraform" label="Terraform">

```hcl
resource "conduktor_console_resource_policy_v1" "generic-dev-topic" {
  name    = "generic-dev-topic"
  labels  = {
    "business-unit" = "delivery"
  }
  spec = {
    target_kind = "Topic"
    description = "A policy to check some basic rule for a topic"
    rules = [
      {
        condition     = "spec.replicationFactor == 3"
        error_message = "replication factor should be 3"
      },
      {
        condition     = "int(string(spec.configs[\"retention.ms\"])) >= 60000 && int(string(spec.configs[\"retention.ms\"])) <= 3600000"
        error_message = "retention should be between 1m and 1h"
      }
    ]
  }
}

resource "conduktor_console_resource_policy_v1" "clickstream-naming-rule" {
  name    = "clickstream-naming-rule"
  labels  = {
    "business-unit" = "delivery"
  }
  spec = {
    target_kind = "Topic"
    description = "A policy to check some basic rule for a topic"
    rules = [
      {
        condition     = "metadata.name.matches(\"^click\\\\.[a-z0-9-]+\\\\.(avro|json)$\")" # Note: \\\\ to escape in Terraform string to end up as \\ in api call
        error_message = "topic name should match ^click\\.(?<event>[a-z0-9-]+)\\.(avro|json)$"
      },
      {
        condition     = "metadata.labels[\"data-criticality\"] in [\"C0\", \"C1\", \"C2\"]"
        error_message = "data-criticality should be one of C0, C1, C2"
      }
    ]
  }
}
```

</TabItem>
</Tabs>

**SelfServicePolicy checks:**

- `spec.targetKind` can be `Topic`, `Connector`, `Subject` or `ApplicationGroup`.
- `spec.rules[].condition` is a valid CEL expression, see [CEL documentation](https://cel.dev) for more information, it will be evaluated against the resource
- `spec.rules[].errorMessage` is a string that will be displayed when the condition is not met

:::info
Use the following CEL playground to test your expressions: [CEL Playground](https://playcel.undistro.io/)
:::

With the two policies declared above, the following Topic resource would succeed validation:

<Tabs>
<TabItem  value="CLI" label="CLI">

```yaml
---
apiVersion: kafka/v2
kind: Topic
metadata:
  cluster: shadow-it
  name: click.event-stream.avro  # Checked by metadata.name.matches("^click\\.[a-z0-9-]+\\.(avro|json)$")
  labels:
    data-criticality: C2         # Checked by metadata.labels["data-criticality"] in ["C0", "C1", "C2"]
spec:
  replicationFactor: 3           # Check by spec.replicationFactor == 3
  partitions: 3
  configs:
    cleanup.policy: delete
    retention.ms: '60000'        # Check int(string(spec.configs["retention.ms"])) >= 60000 && int(string(spec.configs["retention.ms"])) <= 3600000
```

</TabItem>
<TabItem value="Terraform" label="Terraform">

```hcl
resource "conduktor_console_topic_v2" "click-event-steam-avro" {
  cluster = "shadow-it"
  name    = "click.event-stream.avro"  # Checked by metadata.name.matches("^click\\.[a-z0-9-]+\\.(avro|json)$")
  labels  = {
    "data-criticality" = "C2"          # Checked by metadata.labels["data-criticality"] in ["C0", "C1", "C2"]
  }
  spec = {
    replication_factor = 3              # Check by spec.replicationFactor == 3
    partitions        = 3
    configs           = {
      "cleanup.policy" = "delete"
      "retention.ms"   = "60000"       # Check int(string(spec.configs["retention.ms"])) >= 60000 && int(string(spec.configs["retention.ms"])) <= 3600000
    }
  }
}
```

</TabItem>
</Tabs>

#### Moving from TopicPolicy to ResourcePolicy

If you want to replicate the behavior of the TopicPolicy with the ResourcePolicy, here is how you can transform the different policies:

**Range Constraint**
Before:

  ```yaml
  spec.configs.retention.ms:
    constraint: Range
    max: 3600000
    min: 60000
  ```

Now: [(Open in Playground)](https://playcel.undistro.io/?content=H4sIAAAAAAAAA4VTXWvcMBD8K1s%2FJDmIfSGBPpimEMoVWq5t6FcodR%2F25D2fOGklJNmXo%2FS%2Fd6UzpH0otV%2FEzs7s7Fj%2BWSkyVVstl%2FBARjlLkBykHcGr1RruDR6H4Ebun3UsLX%2FXQEdABs2JAqqkJxKNzV2MZDfmCN4dKFAPxJMOji1xytr06I0LJMw%2Bnynoghx02p3mOmsdw%2BrRB4pRy3GNPIw4EFzI%2FEWTnRQ3NTwEnQiObgzFGj1xdjJ6bvoSqQhjIASB8jnqnmDrgpj3Y4IeE17KGb7dvVuDlN9%2B%2BvA%2B4xbTrHKfleH848jnZYsJzYj%2FGI4Dao6pTHoaMAut5v0zTzljSJITjtuKAlpvKM7GotcBM9bJKyFfRE%2BqUY63eojfuypQkuAEb2zsqh8LeHkLz6%2FkgbMzKP0paB7%2BR1vAi1u4KcSr6rLKTt9kz3Ip6rruGL3%2BSiHv1cIet3tcTtcd7zX3LXx2XqtOPm3CzGs7BlBmjHIhWog77N2h1ilXGS21gmm1b2gSA7W4I7QNTsHlBoMbMrEoAPTOSoJz%2F6nxBKD3yvVFad9x3qwwAnnpLGG9lpvoZPpNrnsMSedqnAtzDPMYq7mRnI%2BsmllB%2BrrquqtOuDKEPPrGO8GOLfRkJLwT9meMmVQCzETJ0IpFiS%2F%2FWb9%2BA%2Bwuz6hhAwAA)

  ```yaml
  - condition: int(string(spec.configs["retention.ms"])) >= 60000 && int(string(spec.configs["retention.ms"])) <= 3600000
    errorMessage: retention should be between 1m and 1h
  ```

**Value Constraint**
Before:

  ```yaml
  spec.replicationFactor:
    constraint: OneOf
    values: ["3"]
  ```

Now: [(Open in Playground)](https://playcel.undistro.io/?content=H4sIAAAAAAAAA3VTTWvcMBD9K1Nf0kLsLQn0YMghlC20bNvQr1DwZVae9QpLIyHJ3iyl%2F70j2W0oIdZlmDfvvfnAvypFpmqrzQbuyShnCZKDdCR4u93BncHzENzE%2FYuOpeT%2FHOgIyKA5UUCV9Eyisb%2BNkezenMG7EwXqgXjWwbElTlmbHrxxgYTZ55iCLshJp%2BPi66x1DNsHHyhGLeEOeZhwIHgp%2Fq%2Ba3Enppob7oBPB2U2htEaPnKNYr0XfIxVhDIQgUI6j7gkOLkjzfkrQY8JLieHn7ccdSPrD18%2BfMm4xrSp3WRkuvkx8UaaY0Uz4jDkOqDmm4vRosApt1%2FkzTzljSDYnHHcQBbTeUFwbi14HzFgnL3pSTSBvtCq5d7Jwqbq5gevqssry77ORXLKu647R6x8UcjMtjHgYcTNfdTxq7lv45rxWndwjYea1HQMoM0W5YgvxiL071TrlLKOlVjCtxoZmuVIdkyzRNjgHlwsM7snEogDQOytjr%2FVL4QKg98r1RWlcJimMJ9O0cJ3zHkPSORvXhHJ80MNfG6u5keWc%2Bd8%2BpK6rrrpqwZUh5Mk33gl2bqEnQ4kWLEjEWbqxhfTmtXyZKDu00qKsL%2F8Ov%2F8A22by1BYDAAA%3D)

  ```yaml
  - condition: spec.replicationFactor == 3
    errorMessage: replication factor should be 3
  ```

**In List Constraint**
Before:

  ```yaml
  metadata.labels.data-criticality:
    constraint: OneOf
    values: ["C0", "C1", "C2"]
  ```

Now: [(Open in Playground)](https://playcel.undistro.io/?content=H4sIAAAAAAAAA3VTTY%2FTQAz9KyaXBalJl0XikNtqVSRQgRUfu0KEgztxU6vzpZlJuhXiv%2BOZBFUgkRzi%2BNnPz2%2BSn5UiXbXVeg2PpJUzBMlBOhDcbbZwr%2FE8BDfa%2FllnpeTvHHAEtMA2UUCVeCLh2N3GSGanz%2BDdiQL1QHbi4KwhmzI3PXntAklnn2MKXJATp8M81xnjLGyefKAYWcIt2mHEgeC5zH%2FRZCVFTQ2PgRPB2Y2hSKNLz0FGL0VfIxViDIQgUI4j9wR7F0S8HxP0mHAlMXy7fb8FSb%2F7%2FPFDxg2mheU%2BM8PVp9FelS0m1CP%2BZzgOyDamMukyYCHaLPvnPuW0JnFOetxeGNB4TXERFj0HzFgnt6GEmaTRuCMdv3dVfquVGMAKNadzV%2F3IGwhyd91VK5Dny%2BV5I1i1Kh1vsxw577quO4ueHyhkyS0ccX%2FE9XTT2SPbvoUvzrO6zG07C6D0GOWsW4gH7N2p5pSzFg21grE6NjTJWdYxidWmwSm4XDBLLgwAvTNizlI%2FF84Aeq9cX5iOS%2Bk%2FG7Ygm4ktpApXIC8cxaE38vk50fUq5z2GxDkbl4Ryds%2FDHwGGbSPmnq1qFgap6yrxaMaVJrSjb7wTTGb2pCnRjAWJbKZuTGl6fS1XbhR3jYgXY%2FPv9Os311aOeVYDAAA%3D)

  ```yaml
  - condition: metadata.labels["data-criticality"] in ["C0", "C1", "C2"]
    errorMessage: data-criticality should be one of C0, C1, C2
  ```

**Regex Constraint**
Before:

  ```yaml
  metadata.name:
    constraint: Match
    pattern: ^click\.(?<event>[a-z0-9-]+)\.(avro|json)$
  ```

Now: [(Open in Playground)](https://playcel.undistro.io/?content=H4sIAAAAAAAAA3VTbYsTMRD%2BK%2BMiXIu32%2BMEwf12SAWl6uHbIa7CNDttY5NJSLLb66n%2F3Um6Uvzg7pfpPPO8ZLL9WSkyVVstFnBHRjlLkBykHcGL5QpuDR63wQ3cP%2BpYRv7tgY6ADJoTBVRJjyQa65sYya7NEbw7UKAeiEcdHFvilLXp3hsXSJh9rinoghx02p18nbWOYXnvA8WopVwhbwfcEszEf97kJCVNDXdBJ4KjG0KJRmfOTqynoU%2BRijAGQhAo11H3BBsXJLwfEvSY8FJq%2BHLzZgXSfv3h3duMW0yTym1Whov3A1%2BUU4xoBvyPOW5Rc0zF6WwwCS2n82eecsaQbE44biMKaL2hOAWLXgfMWCevpYRZpGG01EgstaM466rvymi17%2BRpvmL9cFU%2Fr789KT9nOAb360d0PH%2FcVfPqssr8VzmO3Hdd1x2j158p5Mgt7HGzx8V43fFec9%2FCR%2Be1Ovu2HQMoM0S56xbiDnt3qHXK3ZyohZKjoVHuso5JVm2bHCAPGFyTiUUBoHdWljPNnwZPAHqvXF%2BU9p0cnlRhBPIyWfbwUj4yJ%2B5Pc99jSDp349RQjjd6%2B9fGam5khUdWzaQgc1113VUnXBlCHnzjnWDHFnoylOiEBak4Sze2kJ5dyZOJskMrEWV9%2BU%2Fz%2Bw9HD%2BgYPAMAAA%3D%3D)

  ```yaml
  - condition: metadata.name.matches("^click\\.[a-z0-9-]+\\.(avro|json)$")
    errorMessage: topic name should match ^click\.(?<event>[a-z0-9-]+)\.(avro|json)$
  ```

#### Tips for CEL expressions

There are multiple things you should consider when writing your CEL expressions in the context of resource policies:

- For field like configuration value/label value, that you don't know the type of, so if you want to compare it to a number, you need to convert it to a string and then to an int like this: `int(string(spec.configs["retention.ms"]))`

- For field key that contains dots `.` or dashes `-`, you need to access them with the `[]` operator: `metadata.labels["data-criticality"]`

- For field like label key/config key that can be absent, we recommend adding a check to see if the field is present: `has(metadata.labels.criticality) && {your condition}`. If the field has a dot or dash, use `"retention.ms" in spec.configs && {your condition}`.

### Application instance permissions

Application instance permissions lets teams collaborate with each other.

**API Keys:** <AdminToken />  <AppToken />
**Managed with:** <CLI /> <API />
**Labels support:** <MissingLabelSupport />


<Tabs>
<TabItem  value="CLI" label="CLI">

```yaml
# Permission granted to other Applications
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
```

</TabItem>
<TabItem value="Terraform" label="Terraform">

```hcl
# Permission granted to other Applications
resource "conduktor_console_application_instance_permission_v1" "clickstream-app-dev-to-another" {
  application  = "clickstream-app"
  app_instance = "clickstream-app-dev"
  name         = "clickstream-app-dev-to-another"
  spec = {
    resource = {
      type         = "TOPIC"
      name         = "click.event-stream.avro"
      pattern_type = "LITERAL"
    }
    user_permission            = "NONE"
    service_account_permission = "READ"
    granted_to                 = "another-appinstance-dev"
  }
}
```

</TabItem>
</Tabs>

**Application instance permission checks:**

- `spec` is immutable
  - Once created, you will only be able to update its metadata. **This is to protect you from making a change that could impact an external application**
  - Remember this resource affects target ApplicationInstance's Kafka service account ACLs
  - To edit this resource, delete and recreate it
- `spec.resource.type` can be `TOPIC`
- `spec.resource.patternType` can be `PREFIXED` or `LITERAL`
- `spec.resource.name` must reference any "sub-resource" of `metadata.appInstance`
  - For example, if you are owner of the prefix `click.`, you can grant READ or WRITE access to:
    - the whole prefix: `click.`
    - a sub prefix: `click.orders.`
    - a literal topic name: `click.orders.france`
- `spec.userPermission` can be `READ` or `WRITE` or `NONE`.
- `spec.serviceAccountPermission` can be `READ` or `WRITE` or `NONE`.
- `spec.permission` can be `READ` or `WRITE`. (Deprecated,  use `spec.userPermission` and `spec.serviceAccountPermission` instead)
- `spec.grantedTo` must be an `ApplicationInstance` on the same Kafka cluster as `metadata.appInstance`

**Side effect in Console & Kafka:**

- Console
  - Members of the `grantedTo` ApplicationInstance are given the associated permissions (Read/Write) in the UI over the resources
- Kafka
  - Service Account of the `grantedTo` ApplicationInstance is granted the following ACLs over the `resource` depending on the `spec.permission`:
    - `READ`: READ, DESCRIBE_CONFIGS
    - `WRITE`: READ, WRITE, DESCRIBE_CONFIGS

### Application Group

**API Keys:** <AdminToken />  <AppToken />
**Managed with:** <CLI /> <API />
**Labels support:** <MissingLabelSupport />

Create Application Group to directly reflect how your Application operates.
You can create as many Application Groups as required to restrict or represent the different teams that use Console on your Application, e.g.:

- Support Team with only Read Access in Production
- DevOps Team with extended access across all environments
- Developers with higher permissions in Dev

**Example**

<Tabs>
<TabItem  value="CLI" label="CLI">

```yaml
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
      name: "*" # All owned & subscribed topics
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
      permissions: ["kafkaConnectorViewConfig", "kafkaConnectorStatus", "kafkaConnectRestart"]
  members:
    - user1@company.org
    - user2@company.org
  externalGroups:
    - GP-COMPANY-CLICKSTREAM-SUPPORT
```

</TabItem>
<TabItem value="Terraform" label="Terraform">

```hcl
resource "conduktor_console_application_group_v1" "clickstream-support" {
  application = "clickstream-app"
  name        = "clickstream-support"
  spec = {
    display_name = "Support Clickstream"
    description  = <<EOT
      Members of the Support Group are allowed:
        Read access on all the resources
        Can restart owned connectors
        Can reset offsets
      EOT
    permissions = [
      {
        app_instance  = "clickstream-app-dev"
        resource_type = "TOPIC"
        pattern_type  = "LITERAL"
        name          = "*" # All owned & subscribed topics
        permissions   = ["topicViewConfig", "topicConsume"]
      },
      {
        app_instance  = "clickstream-app-dev"
        resource_type = "CONSUMER_GROUP"
        pattern_type  = "LITERAL"
        name          = "*" # All owned consumer groups
        permissions   = ["consumerGroupCreate", "consumerGroupReset", "consumerGroupDelete", "consumerGroupView"]
      },
      {
        app_instance    = "clickstream-app-dev"
        resource_type   = "CONNECTOR"
        pattern_type    = "LITERAL"
        name            = "*" # All owned connectors
        connect_cluster = "local-connect"
        permissions     = ["kafkaConnectorViewConfig", "kafkaConnectorStatus", "kafkaConnectRestart"]
      },
    ]
    members = [
      "user1@company.org",
      "user2@company.org"
    ]
    external_groups = ["GP-COMPANY-CLICKSTREAM-SUPPORT"]
  }
}
```

</TabItem>
</Tabs>
**Application instance permission checks:**

- `spec.permissions[].appInstance` must be an Application Instance associated to this Application (`metadata.application`)
- `spec.permissions[].resourceType` can be `TOPIC`, `SUBJECT`, `CONSUMER_GROUP` or `CONNECTOR`
  - When `resourceType` is `CONNECTOR`, additional field `spec.permissions[].connectCluster` is mandatory. Must be a valid KafkaConnectCluster name
- `spec.permissions[].patternType` can be `PREFIXED` or `LITERAL`
- `spec.permissions[].name` must reference any "sub-resource" of `metadata.appInstance` or any subscribed Topic
  - Use `*` to include to all owned & subscribed resources associated to this `appInstance`
- `spec.permissions[].permissions` are valid permissions as defined in [Permissions](/platform/reference/resource-reference/console/#permissions)
- `spec.members` must be email addresses of members you wish to add to this group.
- `spec.externalGroups` is a list of LDAP or OIDC groups to sync with this Console Groups
  - Members added this way will not appear in `spec.members`

**Side effect in Console & Kafka:**

- Console
  - Members of the ApplicationGroup are given the associated permissions in the UI over the resources
  - Members of the LDAP or OIDC groups will be automatically added or removed upon login
- Kafka
  - No side effect

<hr />

### Application-managed Service Account

:::info info
For the regular (non Self-Service) Service Account, see [Service Account](/platform/reference/resource-reference/kafka/#service-account)
:::

In this mode, the Service Account is not configured by the Central Team at the ApplicationInstance level.
Instead, the Central Platform Team decides to delegate this responsibility to the Application Team, which need to declare their own Service Account(s) and its associated ACLs within the limits of what the ApplicationInstance is allowed to do.

**API Keys:**  <AppToken />
**Managed with:** <CLI /> <API />
**Labels support:** <MissingLabelSupport />

```yaml
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
```

**Service Account checks:**
The checks are the same as the [Service Account](/platform/reference/resource-reference/kafka/#service-account) resource with additional limitations:

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

#### OneOf

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

#### Match

Validates the property against a Regular Expression

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

Validates the keys are within an allowed key list. Applies to dictionary type (Key/Value maps).
Can be used on `spec.configs` and `metadata.labels`.

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

Validation will fail with this input (`min.insync.replicas` not an Allowed Key in `spec.configs`)

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

#### Optional Flag

Constraints can be marked as optional. In this scenario, the constraint will only be validated if the field exists.
Example:

```yaml
spec.configs.min.insync.replicas:
  constraint: ValidString
  optional: true
  values: ["2"]
```

This object will pass the validation

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

This object will fail the validation due to a new incorrect definition of `insync.replicas`

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
    min.insync.replicas: 3
    cleanup.policy: delete
    retention.ms: '60000'
```
