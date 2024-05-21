---
sidebar_position: 1
title: Alias Topics
description: Alias topics
---

# Alias Topics

Alias topic are logical topics that target a different physical topic.
Reminder, [topic naming convention](/gateway/reference/reference-docs/#topics).

They are a Gateway managed logical topic that act like pointers to another physical topic.

# Why ?

One of Kafka's limitations is that you cannot rename topics.

# How does it work ?

Gateway manage an Alias topic mapping in it's internal configuration where you register a target physical topic.

This topic will be presented to Kafka client like a regular topic but all the request for this topics will be transferred to the real physical topic.

This means that consumer groups, fetch and produce are shared.

Also, the alias topic doesn't replace the original one. If you create an alias `applicationB_orders` pointing to a physical `orders` topic if a client was able to the physical one ( `orders` in our exemple) then the Kafka client will see both topics `applicationB_orders` and `orders`.

# Limitations

* ACLs when using delegated Kafka security ([SASL delegated security protocols](/gateway/concepts/authentication#delegated_sasl_plaintext)) aren't supported on alias topics.
* Alias topics can't reference another alias topic

          