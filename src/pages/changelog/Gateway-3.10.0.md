---
date: 2025-06-14
title: Gateway 3.10.0
description: docker pull conduktor/conduktor-gateway:3.10.0
solutions: gateway
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
- [New features](#new-features)
- [Fixes](#fixes)

### Breaking changes

### New features

#### Set Virtual Cluster ACLs directly using REST

Gateway now supports managing the ACLs for Virtual Clusters directly using the REST API.

Previously the only way to set ACLs on a Virtual Cluster was,
1. Create a Virtual Cluster with a Kafka Super User defined
2. Use the Kafka Super User to individually create ACLs using the Kafka Admin API

By allowing all of the ACLs to be set using a single call to the Virtual Cluster REST endpoint the setup required is simplified for simple use-cases.

This change will not suit every use-case because the ACLs specified in the REST PUT will replace all existing ACLs in the Virtual Cluster. We will continue to support setting ACLs directly using the Kafka Admin API as the Super User as well.

[Find out more about the ACL changes to the Virtual Cluster Resource](/gateway/reference/resources-reference/#virtual-cluster-acls)


### Fixes
