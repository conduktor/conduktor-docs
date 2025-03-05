---
date: 2025-03-05
title: Hotfix for Gateway 3.6.1
description: docker pull conduktor/conduktor-gateway:3.6.1
solutions: gateway
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Features

* Fixed a problem with the Create Topic Policy plugin which would not apply overrides to default configurations from the underlying Kafka setup.
* Fixed a problem with CreateTopics ACLs in the gateway, which previously would also require Create cluster permission to be enabled
* Addressed a problem with Non Delegated SASL/PLAIN token credential, where it would continue to work after service account is deleted
* Improved the Plugin descriptions on the API to differntiate the various supportes modes of Encryption
