---
date: 2023-10-06
title: Additions to Vault, caching, black/whitelisting safeguards, debugging and error handling
description: The latest version of Conduktor Gateway introduces some fixes & improvements.
solutions: gateway
tags: features,fix
---

## Features ✨

### Support Vault login/password

When configuring the connection to the Vault Key Management System (KMS), you have two options for authentication: using a token, or a username password pair. You can choose one of the following methods based on your security requirements and environment:

- uri
- token (Token auth method)
- username (Userpass auth method)
- password (Userpass auth method)
- version

### Add black/whitelist of properties

Define which properties can or cannot be modified by safeguarding the configuration of the alter topic and alter broker policies. You can now define which parts of the config cannot be modified, and what do to when an attempt to change them happens. e.g. if you want retention time for topics on this virtual cluster to not be modified, you can add them to the blacklist.

### Enhanced Gateway caching

Fixed an issue where part of the [caching functionality](https://marketplace.conduktor.io/interceptors/gateway-cache-interceptor/) available in GW could lead to a memory leak in certain conditions. It can now also support consumption of multiple topics mixing between those that are cached or not cached.

### Improved handling of invalid Kafka properties

Previously, when invalid Kafka properties (variables, including custom, with prefix `KAFKA_`) were detected Gateway may fail to start. Now, they are logged as invalid with a WARN and excluded from the connection properties.

### Additional debugging tools

The Gateway distro image version now runs with a `gateway` user, rather than running as `root`. The recommendation for production where security is required remains the distroless image variant.

An additional debug API documentation is available at `/debug'`, with the same login credentials as the admin API. This proivdes admins with additional debug and maintenance operations such as changing the Java logger level or interacting with topic mappings.

## General fixes 🔨

- Fixed an issue where consumer group policy and limit commit offset policy might not be enforced
- Fixed an issue where some scenarios could lead to inconsistant partitions on concentrated topics
- Improved handling on some Kafka properties to WARN
- Safer SSL Keystore loading. Gateway will now shutdown when provided keystore is invalid. This behavior will apply at startup and when keystore is reloaded over time
- Display username in audit for expired tokens. When a token expires or there is an error, we now set `username` as the `username` rather than `anonymous`
