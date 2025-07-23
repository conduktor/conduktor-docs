---
date: 2025-07-18
title: Gateway 3.11.0
description: docker pull conduktor/conduktor-gateway:3.11.0
solutions: gateway
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
  - [Deprecated v1 APIs](#deprecated-v1-apis)
- [New features](#new-features)
  - [Use REST to set Virtual Cluster ACLs](#set-virtual-cluster-acls-directly-using-rest)
  - [Auto-create topics](#auto-create-topics)

### Breaking changes

#### Deprecated v1 APIs

The v2 APIs were introduced with Gateway v3.3.0 in September 2024.  

The v1 APIs were deprecated with Gateway v3.8.0 in April 2025.

If you're using the Conduktor CLI to operate Gateway, you're not impacted. [Find out which Gateway APIs are affected](https://developers.conduktor.io/?product=gateway&version=3.6.1&gatewayApiVersion=v1).

:::warning[Migrate to v2 APIs]
**We plan to remove the V1 APIs from the Gateway in two releases (Gateway 3.13.0).** If you're using the v1 APIs, migrate to v2 APIs as soon as possible. [Get in touch](https://support.conduktor.io/hc/en-gb/requests/new?ticket_form_id=17438363566609) for support with the migration.
:::

### New features

#### Set Virtual Cluster ACLs directly using REST

Gateway now supports managing the ACLs for Virtual Clusters directly using the REST API. (This is a backwards compatible change.)

Previously, the only way to set ACLs on a Virtual Cluster was to:

1. create a Virtual Cluster with a Kafka super user defined, then
1. as the Kafka super user, individually create ACLs using the Kafka admin API.

By allowing nearly any Kafka ACL setup to be configured using a single call to the Virtual Cluster REST endpoint (some cluster ACLs are restricted), the overall complexity is greatly simplified for most use cases.

We'll continue to support setting ACLs directly using the Kafka admin API as a super user, since this change won't be useful in all scenarios and use cases.

[Find out more about the new ACLs features in the Virtual Cluster resource reference](/gateway/reference/resources-reference/#virtual-cluster-acls).

#### Auto-create topics

You can now create topics automatically when producing or consuming through Gateway. To enable/disable this, we've added a new `GATEWAY_AUTO_CREATE_TOPICS_ENABLED` environment variable (default: `false`).

- **Kafka property integration**: leverages the Kafka property `auto.create.topics.enable` when the feature is enabled.
- **Concentrated topics limitation**: when this feature is enabled, topics that would normally be concentrated will be created as physical topics instead.
- **ACL authorization**: implements proper access control for auto-create topics:
  - **permission requirements**: requires `CREATE` permission on either the topic or the cluster.
  - **security**: ensures access control while maintaining flexibility for different permission models.

[Find out more about environment variables](/gateway/configuration/env-variables#connect-from-clients-to-gateway) and [auto-create topics authorization](/gateway/how-to/manage-service-accounts-and-acls#auto-create-topics-authorization).
