# Alias topics

Alias topic are logical topics that target a different physical topic.

They are gateway managed logical topics that act like pointers to another physical topic.

# Why ?

One of Kafka limitation is that you cannot rename topics.

# How does it work ?

Gateway manage an Alias topic mapping in it's internal configuration where you register a target physical topic.

This topic will be presented to Kafka client like a regular topic but all the request for this topics will be transferred to the real physical topic.

This means that consumer groups, fetch and produce are shared.

Also, the alias topic doesn't replace the original one. If you create an alias `applicationB_orders` pointing to a physical `orders` topic if a client was able to the physical one ( `orders` in our exemple) then the Kafka client will see both topics `applicationB_orders` and `orders`.

# Limitations

ACL in delegated Kafka security (cf [SASL delegated security protocols](../02-Clients.md#delegated_sasl_plaintext)) aren't supported on alias topics

Alias topic can't reference another alias topic

          