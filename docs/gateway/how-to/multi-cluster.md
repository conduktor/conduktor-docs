---
sidebar_position: 3
title: Configuring Multi-cluster
description: Configure Gateway to support multiple upstream kafka clusters
---

# How to configure Gateway for Multi-cluster

## How it works

Gateway can be configured to support multiple upstream Kafka clusters, allowing you to expose topics from several physical kafka clusters.

A new type of virtual cluster called a **Partner Virtual cluster** can be created. Inside a Partner Virtual cluster, [Alias topics](/gateway/concepts/logical-topics/alias-topics/)
can be created for exposing topic of the desired kafka cluster.

## Configuring Gateway

To set up Gateway for Multi-cluster, you should configure:
 
- one main cluster, which is used by gateway to store its internal state
- any number of upstream kafka clusters, which are the physical kafka clusters you want to expose through Gateway.

This can be achieved through a **cluster-config file**, or through **environment variables**.

### Configuring through a cluster-config file

Specify your main and upstream cluster configurations, along with a `gateway.roles` entry to mark the upstream
clusters - note that the API keys differ in the Confluent Cloud example below:

```yaml
config:
  main:
    bootstrap.servers: <main bootstrap address>:9092
    security.protocol: SASL_SSL
    sasl.mechanism: PLAIN
    sasl.jaas.config: org.apache.kafka.common.security.plain.PlainLoginModule required username="<main-api-key>" password="<main-api-secret>";
  clusterA:
    bootstrap.servers: <clusterA bootstrap address>:9092
    security.protocol: SASL_SSL
    sasl.mechanism: PLAIN
    sasl.jaas.config: org.apache.kafka.common.security.plain.PlainLoginModule required username="<clusterA-api-key>" password="<clusterA-api-secret>";
    gateway.roles: upstream # Note: may be omitted as upstream is the default (used to differentiate from failover clusters)
  clusterB:
    bootstrap.servers: <clusterB bootstrap address>:9092
    security.protocol: SASL_SSL
    sasl.mechanism: PLAIN
    sasl.jaas.config: org.apache.kafka.common.security.plain.PlainLoginModule required username="<clusterB-api-key>" password="<clusterB-api-secret>";
    gateway.roles: upstream # Note: may be omitted as upstream is the default (used to differentiate from failover clusters)
```

Mount the cluster config file in the Gateway container using the configuration `GATEWAY_BACKEND_KAFKA_SELECTOR`:

```yaml
GATEWAY_BACKEND_KAFKA_SELECTOR: 'file : { path: /cluster-config.yaml}'
```

:::warning
If you are using Partner virtual clusters to share data with third-parties external to the organization, then please note that
the cluster ids (`clusterA`, `clusterB`) may be exposed in the bootstrap-server address (or visible in client logs).
Make sure to not expose sensitive names or information in the cluster ids.
:::

### Configuring through environment variables

Alternatively, you can configure your main and upstreams clusters through environment variables:

```bash
KAFKA_MAIN_BOOTSTRAP_SERVERS='<primary bootstrap address>:9092'
KAFKA_MAIN_SECURITY_PROTOCOL='SASL_SSL'
KAFKA_MAIN_SASL_MECHANISM='PLAIN'
KAFKA_MAIN_SASL_JAAS_CONFIG='org.apache.kafka.common.security.plain.PlainLoginModule required username="<primary-api-key>" password="<primary-api-secret>";'
KAFKA_CLUSTERA_BOOTSTRAP_SERVERS='<clusterA bootstrap address>:9092'
KAFKA_CLUSTERA_SECURITY_PROTOCOL='SASL_SSL'
KAFKA_CLUSTERA_SASL_MECHANISM='PLAIN'
KAFKA_CLUSTERA_SASL_JAAS_CONFIG='org.apache.kafka.common.security.plain.PlainLoginModule required username="<clusterA-api-key>" password="<clusterA-api-secret>";'
KAFKA_CLUSTERB_BOOTSTRAP_SERVERS='<clusterB bootstrap address>:9092'
KAFKA_CLUSTERB_SECURITY_PROTOCOL='SASL_SSL'
KAFKA_CLUSTERB_SASL_MECHANISM='PLAIN'
KAFKA_CLUSTERB_SASL_JAAS_CONFIG='org.apache.kafka.common.security.plain.PlainLoginModule required username="<clusterB-api-key>" password="<clusterB-api-secret>";'
```

:::warning
If you are using Partner virtual clusters to share data with third-parties external to the organization, then please note that
the cluster ids (`CLUSTERA`, `CLUSTERB`) may be exposed in the bootstrap-server address (or visible in client logs).
Make sure to not expose sensitive names or information in the cluster ids.
:::


### Creating a Partner Virtual Cluster and Alias topics

First, deploy a new Partner Virtual Cluster:

```yaml
---
kind: VirtualCluster
apiVersion: gateway/v2
metadata:
    name: mypartner
spec:
    aclEnabled: true
    superUsers:
        - admin
    type: Partner
```

:::info
For Partner virtual clusters `aclEnabled` must be `true` and superUsers must not be empty.
:::

Then deploy some Alias topics inside the Partner Virtual Cluster:

```yaml
---
kind: AliasTopic
apiVersion: gateway/v2
metadata:
    name: topic1
    vCluster: mypartner
spec:
    physicalName: internal-topic-name1
    physicalCluster: clusterA
---
kind: AliasTopic
apiVersion: gateway/v2
metadata:
    name: topic2
    vCluster: mypartner
spec:
    physicalName: internal-topic-name2
    physicalCluster: clusterA
```

:::info
Inside a Partner Virtual Cluster, Alias topics can only point to topics from the same physical cluster.
:::

### Creating a service account and ACLs for the Partner Virtual Cluster

Deploy some service accounts for the Partner Virtual Cluster (one admin and regular user):

```yaml
---
kind: GatewayServiceAccount
apiVersion: gateway/v2
metadata:
    name: admin
    vCluster: mypartner
spec:
    type: LOCAL
---
kind: GatewayServiceAccount
apiVersion: gateway/v2
metadata:
    name: user1
    vCluster: mypartner
spec:
    type: LOCAL
```

Then you can create some ACLS for the service accounts (see section below to get the bootstrap address and connection properties for this virtual cluster):

```shell
kafka-acls --bootstrap-server localhost:6972 \
  --command-config local-acl-admin.properties \
  --add \
  --allow-principal User:user1 \
  --consumer 
  --topic topic1
  --group partner-app
```

(For more information on service accounts and acls, see [here](/gateway/how-to/manage-service-accounts-and-acls/))

### Accessing the Partner Virtual Cluster

Each Partner Virtual Cluster has its own bootstrap address. 
You can read back a deployed vCluster to get the bootstrap address and client properties:

```bash
 curl \
    --silent \
    --user "admin:conduktor" \
    "http://your.gateway.url:8888/gateway/v2/virtual-cluster/mypartner"
```
You will get a response like this, with the bootstrap address and client properties:
```json
{
  "kind": "VirtualCluster",
  "apiVersion": "gateway/v2",
  "metadata": {
    "name": "mypartner"
  },
  "spec": {
    "aclEnabled": true,
    "superUsers": [
      "admin",
    ],
    "type": "Partner",
    "bootstrapServers": "<virtual cluster bootstrap address>",
    "clientProperties": {
      "security.protocol": "SASL_PLAINTEXT",
      "sasl.mechanism": "PLAIN",
      "sasl.jaas.config": "org.apache.kafka.common.security.plain.PlainLoginModule required username={{username}} password={{password}};"
    }
  }
}


```
:::info An alias topic must exist in the virtual cluster before it can be accessed. 
The `bootstrapServers` and `clientProperties` won't be shown on a virtual cluster that doesn't have any alias topics.
:::

