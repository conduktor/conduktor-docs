---
date: 2025-03-05
title: Hotfix for Gateway 3.6.1
description: docker pull conduktor/conduktor-gateway:3.6.1
solutions: gateway
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### New Features

- New metric `gateway.apiKeys.throttle_ms` : The throttling time in Kafka responses per apiKey in milliseconds
- Metric `gateway.apiKeys.latency.request_response` : The latency to process a request and generate a response for each ApiKey
  - Updated to track latency for all verbs (eg CONNECTION) not just FETCH/PRODUCE

### Feature Changes

- Limit Commit Offset Plugin
  - accuracy of rate limiting has been improved
  - `action`/`throttleTimeInMs` properties did not work correctly and are now ignored
- Cluster ACLs
  - When creating cluster ACLs using a programmatic API, only allow `kafka-cluster` for the name part of the resource. This makes  Gateway consistent with Kafka. (Previously you could create an ACL on any cluster name but it would be re-written to `*`)

### Fixes

- Fixed a problem with the Create Topic Policy plugin which would not apply overrides to default configurations from the underlying Kafka setup.
- Fixed a problem with `CreateTopics ACLs` in Gateway which previously also required the `Create cluster` permission enabled.
- Addressed a problem with Non Delegated SASL/PLAIN token credentials, where Gateway would continue to work after service account has been deleted. To enable this feature set the environment variable `GATEWAY_USER_POOL_SERVICE_ACCOUNT_REQUIRED` to `true` (it currently defaults to `false`).
- Fixed a problem in `AddPartitionsToTxnRequest` where ACLs on transactionIds in new location were not being checked when Kafka API version was >= 4.
- An un-autorized idempotent producer will now throw a `ClusterAuthorizationException` instead of a `TransactionalIdAuthorizationException` (making gateway consistent with Kafka)


