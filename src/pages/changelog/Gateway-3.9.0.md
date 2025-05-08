---
date: 2025-05-08
title: Gateway 3.9.0
description: docker pull conduktor/conduktor-gateway:3.9.0
solutions: gateway
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
- [New features](#new-features)
  - [Dynamic Header Injection from Record Values](#dynamic-header-injection-from-record-values)


### Breaking changes

### New features

#### Dynamic Header Injection from Record Payloads

The Header Injection Interceptor has been enhanced to support deriving header values directly from record payloads.
This powerful feature allows you to extract:
- The entire record key or value and inject it as a header
- Specific fields from record keys or values inject them as headers

You can now reference record fields using mustache syntax:
```json
{
  "config": {
    "topic": "topic.*",
    "headers": {
      "X-CLIENT_IP": "{{userIp}} testing",
      "X-USER-ID": "{{record.key.id}}",
      "X-USER-EMAIL": "{{record.value.email}}"
    },
    "overrideIfExists": true
  }
}
```

This feature supports:
- Extracting values from JSON, AVRO, PROTOBUF serialized records
- Accessing record fields using dot notation
- Referencing the entire key or value payload
- Using mustache syntax for dynamic header values