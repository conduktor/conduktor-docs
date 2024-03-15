---
sidebar_position: 3
title: Gateway User
description: What a Gateway User is
---

# User

All connections on a Gateway broker will result on a `User` that defines attached information to a connection for core features.

A User is constituted of the following elements :

-   `username` : The name of the user on Gateway, it's this one that will be used for interceptor targeting, audit, ...
-   `vcluster` : The virtual cluster the user is associated to
-   `principal` : The authentication principal identifying this `User`
-   `groups` : Groups the `User`(s)

Since some of this information cannot be detected based on authentication only we have to provide a way for you to be able to set this information associated with a client.

## User mapping

User mapping is the way for you to associate some Gateway information to a `Principal `(the unique identifier of a Kafka client authenticated).

It allows you to set information as an understandable username, the associated virtual clusters or groups for Kafka client.

User mappings are managed using Gateway HTTP APIs and are stored in your configured storage (see storage configuration).

          