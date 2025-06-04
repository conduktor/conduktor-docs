---
date: 2025-06-14
title: Gateway 3.10.0
description: docker pull conduktor/conduktor-gateway:3.10.0
solutions: gateway
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

- [Breaking changes](#breaking-changes)
  - [Kafka 4.0 Compatibility](#kafka-40-compatibility)
    - [ACL Changes](#acl-changes)
    - [OAuth Authentication Changes](#oauth-authentication-changes)
    - [Deprecated Features](#deprecated-features)
    - [Version Compatibility Notes](#version-compatibility-notes)
- [New features](#new-features)
- [Fixes](#fixes)

### Breaking changes

#### Kafka 4.0 Compatibility

Gateway 3.10.0 adds support for Kafka 4.0 while maintaining backward compatibility with Kafka 2.5+ clients and clusters. However, there are some important changes to be aware of:

##### ACL Changes
Kafka 4.0 removes the following ACLs:
- LeaderAndIsr
- StopReplica
- UpdateMetadata
- ControlledShutdown

If you are using these ACLs in your Gateway configuration, you will need to update your security policies accordingly. These ACLs were primarily used for internal Kafka operations and their removal should not impact most client applications.

##### OAuth Authentication Changes
Kafka 4.0 introduces changes to OAuth authentication:

1. The `org.apache.kafka.sasl.oauthbearer.allowed.urls` property is now required when using OAuth or Delegated OAuth. You must set this in your Gateway/client configuration:
   ```
   JAVA_TOOL_OPTIONS: -Dorg.apache.kafka.sasl.oauthbearer.allowed.urls=https://www.example.com
   ```
   This property helps prevent potential security vulnerabilities by explicitly defining which URLs are allowed for OAuth token validation.

2. The OAuth callback handler has been updated:
   - Old: `org.apache.kafka.common.security.oauthbearer.secured.OAuthBearerLoginCallbackHandler`
   - New: `org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginCallbackHandler`
   
   This change simplifies the OAuth implementation and removes the deprecated "secured" package.

##### Deprecated Features
The following features are no longer supported or may break with Kafka 4.0:
- `message.timestamp.difference.max.ms`: This configuration has been removed as it's no longer needed with the improved timestamp handling in Kafka 4.0
- `message.downconversion.enable`: This feature has been removed as downconversion is now handled differently in Kafka 4.0

##### Version Compatibility Notes
- Gateway 3.10.0 supports Kafka clusters from version 2.5.0 up to 4.0.0
- Clients using Kafka 2.5+ can still connect to Gateway 3.10.0
- Some APIs have raised their minimum supported version to 2.5.0

### New features

### Fixes
