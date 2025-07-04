---
date: 2025-07-16
title: Gateway 3.11.0
description: docker pull conduktor/conduktor-gateway:3.11.0
solutions: gateway
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
- [New features](#new-features)

### Breaking changes

### New features

#### Set Virtual Cluster ACLs directly using REST

Gateway now supports managing the ACLs for Virtual Clusters directly using the REST API. (This is a backwards compatible change.)

Previously the only way to set ACLs on a Virtual Cluster was,
1. Create a Virtual Cluster with a Kafka Super User defined
2. Use the Kafka Super User to individually create ACLs using the Kafka Admin API

By allowing nearly any Kafka ACL setup to be configured using a single call to the Virtual Cluster REST endpoint (some cluster ACLs are restricted) the overall complexity is greatly simplified for simple use-cases.

This change will not suit every use-case. We will continue to support setting ACLs directly using the Kafka Admin API as a Super User as well.

[Find out more about the new ACLs features in Virtual Cluster Resource](/gateway/reference/resources-reference/#virtual-cluster-acls)