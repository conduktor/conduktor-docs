---
sidebar_position: 3
title: Service Accounts
description: What a Gateway Service Accounts is
---

# User

All connections on a Gateway broker will apply to a `User` that defines the information used in the connection for core features.

A User is constituted of the following elements :

-   `username` : The name of the user on Gateway, it's this one that will be used for interceptor targeting, audit, ...
-   `vcluster` : The virtual cluster the user is associated to
-   `principal` : The authentication principal identifying this `User`
-   `groups` : Groups the `User`(s)

Since some of this information cannot be detected based on authentication only we have to provide a way for you to be able to set this information associated with a client.


### Username

If a `UserMapping` exists for the `Principal` , the `username` mapping will be used.

If no mapping exists, then `Principal` is used as `username`.

### Groups

Result groups are an union of groups defined on `UserMapping`, if one exists for the `Principal`, and those extracted from authentication source.

### Virtual cluster

The user's virtual cluster will come from the `UserMapping`, if one exists, for the `Principal` .

If no mapping exists then we try to use one from authentication extraction.

If no virtual cluster was detected then the user automatically falls back into the transparent virtual cluster, named `passthrough`. If you don't want users to automatically fallback into this mode, and instead fail the connection, you can set `GATEWAY_FEATURE_FLAGS_MANDATORY_VCLUSTER` to true.

## Authentication specific extraction

As mentioned below, the authorization process will try to detect information from the authentication source. Each authentication source is different and they can't all provide everything. This section is dedicated to explain which information can be extracted based on you authentication mechanism.

### Plain

-   Virtual Cluster : ✅

When creating a plain user with the HTTP API you can define a virtual cluster property that can be extracted by Gateway.

-   Groups: ❌

### OAuthbearer

-   Virtual Cluster : ✅

If a `gateway.vcluster` claim is detected in the OAuth token sent by a client, it can be extracted as virtual cluster.

-   Groups: ❌

### Mtls

-   Virtual Cluster : ❌
-   Groups: ❌

### Delegated to backend Kafka

-   Virtual Cluster : ❌
-   Groups: ❌

## User mapping

User mapping is the way for you to associate some Gateway information to a `Principal `(the unique identifier of a Kafka client authenticated).

It allows you to set information as an understandable username, the associated virtual clusters or groups for Kafka client.

User mappings are managed using Gateway HTTP APIs and are stored in your configured storage (see storage configuration).
          