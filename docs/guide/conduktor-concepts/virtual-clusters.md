---
title: Virtual clusters
description: Learn Conduktor terminology
---

A virtual cluster in Conduktor Gateway is a logical representation of a Kafka cluster.

This allows you to create multiple virtual clusters while maintaining a single physical Kafka cluster, enabling the simulation of multiple Kafka environments on a single physical infrastructure.

![image.png](/guide/vclusters.png)

## VirtualCluster

A Virtual cluster allows you to isolate one or more service accounts within a logical cluster. Any topic or consumer group created within a Virtual cluster will be accessible only to that specific virtual cluster.

A Virtual cluster acts like a Kafka within a Kafka.

```yaml
---
apiVersion: gateway/v2
kind: VirtualCluster
metadata:
 name: "mon-app-A"
spec:
 aclEnabled: true # defaults to false
 superUsers:
 - username1
 - username2
```

**VirtualCluster checks:**

- `metadata.name` must be a valid topic prefix.
- `spec.aclEnabled` is optional, default `false`.

**VirtualCluster side effects:**

- All topics and consumer groups will be created on the physical Kafka with a prefix `metadata.name`. But, they will appear on the VirtualCluster without the prefix.
- Users can be associated to the VirtualCluster through the GatewayServiceAccount resource.
- When `spec.aclEnabled` is set to `true`, you can configure the superUsers using the `spec.superUsers` list. You will have to manage the ACLs of other service accounts as you would with any other Kafka.

## AliasTopic

An Alias Topic allows a real Kafka topic to appear as a logical topic within the Gateway. This is useful for aliasing topics or making a topic accessible within a Virtual Cluster.

```yaml
---
apiVersion: gateway/v2
kind: AliasTopic
metadata:
  name: name1
  vCluster: vCluster1
spec:
  physicalName: physicalName1
```
