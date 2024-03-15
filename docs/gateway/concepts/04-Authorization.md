---
sidebar_position: 4
title: Principal to Gateway User 
description: Principal to Gateway User 
---
---

# Gateway User identification

A principal is not enough for Gateway to operate. Due to its features and internals, all connection opened should associate a [User](03-User.md) .

Gateway authorization is the process to go from an authentication `Principal` to a full Gateway `User` using some authentication information, and a [UserMapping](03-User.md#user-mapping) for the `Principal` , if it exists.

### Username

If a `UserMapping` exists for the `Principal` , the username mapping will be used.

If no mapping exists, then `Principal` is used as username.

### Groups

Result groups are an union of groups defined on `UserMapping`if one exist for the `Principal` and those extracted from authentication source.

### Virtual cluster

The user's virtual cluster will be the one from the `UserMapping` , if one exists, for the `Principal` .

If no mapping exists then we try to use one from authentication extraction.

If no virtual cluster was detected then the user is associated to `passthrough` , a transparent virtual cluster.

If you don't want users to automatically fallback into the `passthrough` transparent virtual cluster, and instead fail the connection you can set `GATEWAY_FEATURE_FLAGS_MANDATORY_VCLUSTER` to true.

# Authentication specific extraction

As mentioned below, the authorization process will try to detect information from the authentication source. Each authentication source is different and they can't all provide everything. This section is dedicated to explain which information can be extracted based on you authentication mechanism.

## Plain

-   Virtual Cluster : ✅

When creating a plain user with the HTTP API you can define a virtual cluster property that can be extracted by Gateway.

-   Groups: ❌

## OAuthbearer

-   Virtual Cluster : ✅

If a `gateway.vcluster` claim is detected in the OAuth token sent by a client, it can be extracted as virtual cluster.

-   Groups: ❌

# Mtls

-   Virtual Cluster : ❌
-   Groups: ❌

# Delegated to backend Kafka

-   Virtual Cluster : ❌
-   Groups: ❌

          