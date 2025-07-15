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

## New features

### Set Virtual Cluster ACLs directly using REST

Gateway now supports managing the ACLs for Virtual Clusters directly using the REST API. (This is a backwards compatible change.)

Previously, the only way to set ACLs on a Virtual Cluster was to:

1. create a Virtual Cluster with a Kafka super user defined, then
1. as the Kafka super user, individually create ACLs using the Kafka admin API.

By allowing nearly any Kafka ACL setup to be configured using a single call to the Virtual Cluster REST endpoint (some cluster ACLs are restricted), the overall complexity is greatly simplified for most use cases.

We'll continue to support setting ACLs directly using the Kafka admin API as a super user, since this change won't apply to all scenarios and use cases.

[Find out more about the new ACLs features in the Virtual Cluster resource reference](/gateway/reference/resources-reference/#virtual-cluster-acls).
