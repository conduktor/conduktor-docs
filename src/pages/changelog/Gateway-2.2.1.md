---
date: 2023-11-07
title: Support for ACLs, additional metrics for auditing, and performance improvements
description: ''
solutions: gateway
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Features ✨

#### ACL Support

We now support ACL in virtual clusters, just enable `AclsInterceptorPlugin` and you're in an ACL protected world! All your acl pipeline will work out of the box.

You can follow our [ACL Demo](https://github.com/conduktor/conduktor-gateway-demos/tree/main/acls-gateway-security)

#### Aditional metrics for auditing

Additional metrics for Kafka API keys to aid in auditing and debugging applications. Two new metrics are available via the Prometheus endpoint, the total errors per API key and the current inflight API keys, both are available on virtual cluster and username level. Checkout the [monitoring docs](https://docs.conduktor.io/gateway/reference/monitoring/) for more!

`gateway_current_inflight_apiKeys_total{apiKeys="Metadata",username="anonymous",vcluster="passthrough",} 10598.0`

#### Cache

Cache moved from core to the `CacheInterceptorPlugin` plugin

### General fixes 🔨

- There are some request types with fire and forget pattern. In such scenarios Gateway now behaves better
- Various performance and memory improvements from; threading model, task queue and cache refinements
- Less verbose logging
