---
date: 2025-05-14
title: Console 1.34
description: docker pull conduktor/conduktor-console:1.34.0
solutions: console
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Conduktor Scale](#conduktor-scale)
  - [Kafka Connect Policies](#kafka-connect-policies)
  - [Subscribe to application topics](#subscribe-to-application-topics)
- [Conduktor Exchange](#conduktor-exchange)
  - [Extended authentication mechanisms for Partner Zones](#extended-authentication-mechanisms-for-partner-zones)
- [Quality of life improvements](#quality-of-life-improvements)
- [Fixes](#fixes)
- [Known issues](#known-issues)

### Conduktor Scale

#### Kafka Connect Policies

Central Teams can now configure Self-service policies targeting Connector resources.  

````yaml
---
apiVersion: self-service/v1
kind: ResourcePolicy
metadata:
  name: "limit-max-tasks"
spec:
  targetKind: Connector
  description: "Limit max tasks to 1"
  rules:
    - condition: spec.configs["tasks.max"] == "1"
      errorMessage: Connector tasks.max must be set to 1
````

The new policies use the [CEL language](https://cel.dev) to express the rule. Supported `targetKind` are `Connector` and `Topic`. [Find out more about the resourcePolicy](https://docs.conduktor.io/platform/reference/resource-reference/self-service/#resource-policy).

### Subscribe to application topics

Application owners now have the ability to manage topic subscriptions across their organization. 

Using the Topic Catalog, owners can subscribe to topics outside of their own application, selecting from their list of applications and focusing only on valid instances that share the same Kafka cluster.

The new interface provides flexible permission configuration, enabling read or write permissions for each subscription, as well as granular control over both user and service account permissions.

![Topic catalog subscribe modal](/images/changelog/platform/v34/topic-catalog-subscribe.png)

Subscription request management has also been enhanced, giving application owners the ability to review pending requests and approve or deny them through both the UI and CLI.

During this process, administrators can modify the originally requested permissions to better align with organizational requirements. For teams preferring infrastructure-as-code approaches, approving requests using YAML configuration automatically closes the request, streamlining the workflow.

![Application catalog request approval](/images/changelog/platform/v34/app-catalog-request.png)

### Conduktor Exchange

#### Extended authentication mechanisms for Partner Zones

Partner applications can now authenticate to your Partner Zones using client IDs & secrets managed by your OAuth/OIDC provider. The Partner Zone schema is changed to reflect the new authentication modes. This is a breaking change which should be updated as below:

```yaml
kind: PartnerZone
metadata:
  name: external-partner-zone
spec:
  cluster: partner1
  displayName: External Partner Zone
  url: https://partner1.com
  # serviceAccount: johndoe # <-- Previously, spec.serviceAccount
  authenticationMode: # New schema. spec.authenticationMode.serviceAccount , and, spec.authenticationMode.type of PLAIN or OAUTHBEARER
        serviceAccount: partner-external-partner
        type: PLAIN
  topics:
    - name: topic-a
      backingTopic: kafka-topic-a
      permission: WRITE
```

For more information see the [reference page](/platform/reference/resource-reference/console/#partner-zone).

### Quality of life improvements

- Added selectors for key and value formats on the single Kafka message page, enabling the use of custom deserializers.
- You can now see clusters referenced by each alert in the **Settings > Alerts** page.

### Fixes

- To avoid timeouts when indexing consumer groups, added a new configuration variable to limit the number of consumer groups requested per describe query.
- Fixed an issue where in Topic Consume page, JQ filters against big numbers loses precision in Safari.
- Fixed an issue where messages with big number fields lose precision when being copied over to be reprocessed in the Topic Produce page.
- Fixed an issue where only the first 1,000 schemas were indexed
- Fixed an issue where opening a message with more than 1MB of data would freeze the UI because of the table view. It now defaults to the JSON view.
- Fixed an issue impacting Kafka Connect sink connectors where providing consumer override values as configuration would lead to a validation failure.
- Fixed an issue where deleted clusters were still present in the RBAC system, causing issues on the CLI api.
- Kafka config on huge numbers is now displayed correctly in the UI.
- Fixed an issue with Partition on topic details was not sorted correctly.
- Fixed an issue where lag wasn't correctly calculated after a topic was deleted and recreated with the same name.
- The list of consumer groups in the topic details page using RBAC is now correctly displayed.

### Known issues

In the Topic Consume view, equality filters (`==`) on JSON number fields aren't working correctly when the number exceeds JavaScript's safe integer limit of `2^53-1`. Note that while range operators (`>`, `<`, `>=`, `<=`) still work with large numbers, there's currently no workaround for exact equality filtering. We'll address this in a future release.
