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
* Fixed a problem with `CreateTopics ACLs` in Gateway which previously also required the `Create cluster` permission enabled.
* Addressed a problem with Non Delegated SASL/PLAIN token credential, where it would continue to work after service account is deleted. To enable this feature set the environment variable `GATEWAY_USER_POOL_SERVICE_ACCOUNT_REQUIRED` to `true` (it currently defaults to `false`
* Improved the Encryption Plugin descriptions in the API so that they can be differentiated
* Fixed a problem in the Observability Plugin where it failed to apply configuration changes if optional flush interval was not set
