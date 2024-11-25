---
date: 2023-09-22
title: Better expired token handling, shared passthrough vcluster name, consumer group policy
description: The latest version of Conduktor Gateway introduces some fixes & improvements.
solutions: gateway
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

## Features ✨

### Addition of a consumer group policy

You can now ensure smooth Kafka consumer group operation by enforcing naming policies on groupId, clientId and policies on timeouts.

### Consistent vcluster name in passthrough mode

Historically when running in Passthrough mode, we had a unique vcluster for each user. Now all users will share the same vcluster named `passthrough`.

### Expired token error includes username

When a token was expired or another token error, we always set `username` as `anonymous`. Now, if a token has expired, we'll set `username` with it's `username` claim info.

## General fixes 🔨

- Fix a bug where we could surface internal headers on concentrated topics which would confuse Kafka streams
- Fix a bug in `CreateTopics` verb handling when `validate_only` = `true`, we would create the actual topic
- `ProducerRateLimitingPolicy` now requires `maximumBytesPerSecond` to be explicitly set
- `Caching` interceptor now better handles transaction markers
- When creating interceptors with empty config this is now surfaced as an error
