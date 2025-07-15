---
date: 2025-07-16
title: Gateway 3.11.0
description: docker pull conduktor/conduktor-gateway:3.11.0
solutions: gateway
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [New features](#new-features)
  - [Use REST to set Virtual Cluster ACLs](#set-virtual-cluster-acls-directly-using-rest)
  -  [Auto-Create Topics Feature](#auto-create-topics-feature)

## New features

### Set Virtual Cluster ACLs directly using REST

Gateway now supports managing the ACLs for Virtual Clusters directly using the REST API. (This is a backwards compatible change.)

Previously, the only way to set ACLs on a Virtual Cluster was to:

1. create a Virtual Cluster with a Kafka super user defined, then
1. as the Kafka super user, individually create ACLs using the Kafka admin API.

By allowing nearly any Kafka ACL setup to be configured using a single call to the Virtual Cluster REST endpoint (some cluster ACLs are restricted), the overall complexity is greatly simplified for most use cases.

We'll continue to support setting ACLs directly using the Kafka admin API as a super user, since this change won't apply to all scenarios and use cases.

[Find out more about the new ACLs features in the Virtual Cluster resource reference](/gateway/reference/resources-reference/#virtual-cluster-acls).

### Auto-Create Topics Feature

- **New auto-create topics configuration**: Added support for automatically creating topics when producing or consuming through the Gateway
- **Environment variable control**: New `GATEWAY_AUTO_CREATE_TOPICS_ENABLED` environment variable (default: `false`) to enable/disable the feature
- **Kafka property integration**: Leverages the Kafka property `auto.create.topics.enable` when the feature is enabled
- **Concentrated topics limitation**: When auto-create topics is enabled, topics that would normally be concentrated will be created as physical topics instead
- **ACL authorization**: Implements proper access control for auto-create topics:
  - **Permission requirements**: Requires either `CREATE` permission on the topic or `CREATE` permission on the cluster
  - **Security**: Ensures proper access control while maintaining flexibility for different permission models

[Find out more about environment variables](/gateway/configuration/env-variables#connect-from-clients-to-gateway) and [auto-create topics authorization](/gateway/how-to/manage-service-accounts-and-acls#auto-create-topics-authorization). 
