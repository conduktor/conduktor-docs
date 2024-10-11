---
sidebar_position: 1
title: Alias Topics
description: Alias topics
---

# Alias Topics

Alias topics are logical topics that target a different physical topic.

They act like pointers to another physical topic.

# Why ?

One of Kafka's limitations is that you cannot rename topics.

# How does it work ?

Gateway manages an Alias topic mapping in it's internal configuration, whereby you register a target physical topic. This topic will be presented to Kafka clients like a regular topic would. However, all requests for this topic will be forwarded to the physical topic.

This means that consumer groups, fetch and produce are shared.

Also, the alias topic will not replace the original one. For example, if you create an alias topic, `applicationB_orders`, pointing to a physical topic `orders`, then a client that's also able to access the physical one would be able to see both topics.

# Limitations

* ACLs when using delegated Kafka security ([SASL delegated security protocols](/gateway/concepts/service-accounts-and-authentication#delegated-sasl-authentication)) aren't supported on alias topics.
* Alias topics can't reference another alias topic.