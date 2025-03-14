---
sidebar_position: 3
title: Configure Multi-cluster
description: Configure Gateway to support multiple upstream kafka clusters
---

## Overview

Gateway can be configured to communicate with multiple Kafka clusters and expose their topics to your partners.

This is helpful if you want to **point your partners to a single endpoint**, and have them **access multiple Kafka clusters topics** through it.

On top of it, you can expose these topics with an **alias** that doesn’t necessarily match their name on the physical Kafka clusters.

## 1. Configure Gateway

To set up Gateway for Multi-cluster, you should configure:
- one main cluster, which is used by gateway to store its internal state
- any number of upstream kafka clusters, which are the physical kafka clusters you want to expose through Gateway.

This can be achieved through a **configuration file**, or through **environment variables**.

:::warning
If you're using Partner virtual clusters to share data with external third parties, be aware that cluster IDs (e.g., `clusterA`, `clusterB`) may appear in the bootstrap server address or client logs. To prevent unintended exposure, **avoid using sensitive names or information in cluster IDs**.
:::

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="Using a configuration file" label="Using a configuration file">

Specify your main and upstream cluster configurations, along with a `gateway.roles` entry to mark the upstream clusters.

```yaml title="cluster-config.yaml"
config:
  main:
    bootstrap.servers: '<main_bootstrap_servers>:9092'
    security.protocol: 'SASL_SSL'
    sasl.mechanism: 'PLAIN'
    sasl.jaas.config: 'org.apache.kafka.common.security.plain.PlainLoginModule required username="<main_api_key>" password="<main_api_secret>";'
  clusterA:
    bootstrap.servers: '<clusterA_bootstrap_servers>:9092'
    security.protocol: 'SASL_SSL'
    sasl.mechanism: 'PLAIN'
    sasl.jaas.config: 'org.apache.kafka.common.security.plain.PlainLoginModule required username="<clusterA_api_key>" password="<clusterA_api_secret>";'
    gateway.roles: 'upstream' # Note: may be omitted as upstream is the default (used to differentiate from failover clusters)
  clusterB:
    bootstrap.servers: '<clusterB_bootstrap_servers>:9092'
    security.protocol: 'SASL_SSL'
    sasl.mechanism: 'PLAIN'
    sasl.jaas.config: 'org.apache.kafka.common.security.plain.PlainLoginModule required username="<clusterB_api_key>" password="<clusterB_api_secret>";'
    gateway.roles: 'upstream' # Note: may be omitted as upstream is the default (used to differentiate from failover clusters)
```

Then, mount the cluster config file in the Gateway container using the configuration `GATEWAY_BACKEND_KAFKA_SELECTOR`:

```yaml
GATEWAY_BACKEND_KAFKA_SELECTOR: 'file : { path: /cluster-config.yaml}'
```

</TabItem>
<TabItem value="Using environment variables" label="Using environment variables">

Configure your main and upstreams clusters through environment variables that you define in the Gateway container:

```yaml
KAFKA_MAIN_BOOTSTRAP_SERVERS: '<main_bootstrap_servers>:9092'
KAFKA_MAIN_SECURITY_PROTOCOL: 'SASL_SSL'
KAFKA_MAIN_SASL_MECHANISM: 'PLAIN'
KAFKA_MAIN_SASL_JAAS_CONFIG: 'org.apache.kafka.common.security.plain.PlainLoginModule required username="<main_api_key>" password="<main_api_secret>";'

KAFKA_CLUSTERA_BOOTSTRAP_SERVERS: '<clusterA_bootstrap_servers>:9092'
KAFKA_CLUSTERA_SECURITY_PROTOCOL: 'SASL_SSL'
KAFKA_CLUSTERA_SASL_MECHANISM: 'PLAIN'
KAFKA_CLUSTERA_SASL_JAAS_CONFIG: 'org.apache.kafka.common.security.plain.PlainLoginModule required username="<clusterA_api_key>" password="<clusterA_api_secret>";'
KAFKA_CLUSTERA_GATEWAY_ROLES: 'upstream' # Note: may be omitted as upstream is the default (used to differentiate from failover clusters)

KAFKA_CLUSTERB_BOOTSTRAP_SERVERS: '<clusterB_bootstrap_servers>:9092'
KAFKA_CLUSTERB_SECURITY_PROTOCOL: 'SASL_SSL'
KAFKA_CLUSTERB_SASL_MECHANISM: 'PLAIN'
KAFKA_CLUSTERB_SASL_JAAS_CONFIG: 'org.apache.kafka.common.security.plain.PlainLoginModule required username="<clusterB_api_key>" password="<clusterB_api_secret>";'
KAFKA_CLUSTERB_GATEWAY_ROLES: 'upstream' # Note: may be omitted as upstream is the default (used to differentiate from failover clusters)
```

</TabItem>
</Tabs>

## 2. Create a partner virtual cluster

First, create a new partner virtual cluster.

:::info
For partner virtual clusters, `aclEnabled` must be `true` and `superUsers` must not be empty.
:::

<Tabs>
<TabItem value="CLI" label="CLI">

Create this YAML file:

```yaml title="mypartner.yaml"
---
kind: VirtualCluster
apiVersion: gateway/v2
metadata:
  name: mypartner
spec:
  aclEnabled: true
  superUsers:
    - super-user
  type: Partner
```

Then, apply it:

```shell
conduktor apply -f mypartner.yaml
```

</TabItem>
<TabItem value="API" label="API">

```sh
curl \
  --request PUT \
  --url 'http://localhost:8888/gateway/v2/virtual-cluster' \
  --header 'Authorization: Basic YWRtaW46Y29uZHVrdG9y' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "kind": "VirtualCluster",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "mypartner"
    },
    "spec": {
      "aclEnabled": true,
      "superUsers": [ "super-user" ],
      "type": "Partner"
    }
  }'

```

</TabItem>
</Tabs>

## 3. Alias your topics

Finally, create some alias topics inside the partner virtual cluster. These topics must exist for you to alias them.

:::warning
As of today, inside a partner virtual cluster, **alias topics can only point to topics from the same physical** cluster.
:::

<Tabs>
<TabItem value="CLI" label="CLI">

Create this YAML file:

```yaml title="alias-topics.yaml"
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

Then, apply it:

```sh
conduktor apply -f alias-topics.yaml
```

</TabItem>
<TabItem value="API" label="API">

```sh
curl \
  --request PUT \
  --url 'http://localhost:8888/gateway/v2/alias-topic' \
  --header 'Authorization: Basic YWRtaW46Y29uZHVrdG9y' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "kind": "AliasTopic",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "topic1",
      "vCluster": "mypartner"
    },
    "spec": {
      "physicalName": "internal-topic-name1",
      "physicalCluster": "clusterA"
    }
  }'

curl \
  --request PUT \
  --url 'http://localhost:8888/gateway/v2/alias-topic' \
  --header 'Authorization: Basic YWRtaW46Y29uZHVrdG9y' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "kind": "AliasTopic",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "topic2",
      "vCluster": "mypartner"
    },
    "spec": {
      "physicalName": "internal-topic-name2",
      "physicalCluster": "clusterA"
    }
  }'
```

</TabItem>
</Tabs>

## 4. Create service accounts

Once the virtual cluster is created and contains the topics to expose to your partners, you'll need to create service accounts and configure ACLs.

Create two service accounts for the partner virtual cluster: **one super user and one partner user**.

The super user will manage ACLs and grant permissions to the partner user, who will use their account to access the exposed topics.

<Tabs>
<TabItem value="CLI" label="CLI">

```yaml title="service-accounts.yaml"
---
kind: GatewayServiceAccount
apiVersion: gateway/v2
metadata:
  name: super-user
  vCluster: mypartner
spec:
  type: LOCAL
---
kind: GatewayServiceAccount
apiVersion: gateway/v2
metadata:
  name: partner-user
  vCluster: mypartner
spec:
  type: LOCAL
```

Then, apply it:

```shell
conduktor apply -f service-accounts.yaml
```

In order to connect to the Gateway using these service accounts, you need to get their associated password.

```shell
conduktor run generateServiceAccountToken \
  --username super-user \
  --v-cluster mypartner \
  --life-time-seconds 100000000

conduktor run generateServiceAccountToken \
  --username partner-user \
  --v-cluster mypartner \
  --life-time-seconds 100000000
```

</TabItem>
<TabItem value="API" label="API">

```sh
curl \
  --request PUT \
  --url 'http://localhost:8888/gateway/v2/service-account' \
  --header 'Authorization: Basic YWRtaW46Y29uZHVrdG9y' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "kind": "GatewayServiceAccount",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "super-user",
      "vCluster": "mypartner"
    },
    "spec": {
      "type": "LOCAL"
    }
  }'

curl \
  --request PUT \
  --url 'http://localhost:8888/gateway/v2/service-account' \
  --header 'Authorization: Basic YWRtaW46Y29uZHVrdG9y' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "kind": "GatewayServiceAccount",
    "apiVersion": "gateway/v2",
    "metadata": {
      "name": "partner-user",
      "vCluster": "mypartner"
    },
    "spec": {
      "type": "LOCAL"
    }
  }'
```

In order to connect to the Gateway using these service accounts, you need to get their associated password.

```sh
curl \
  --request POST \
  --url 'http://localhost:8888/gateway/v2/token' \
  --header 'Authorization: Basic YWRtaW46Y29uZHVrdG9y' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "username": "super-user",
    "vCluster": "mypartner",
    "lifeTimeSeconds": 3600000
  }'

curl \
  --request POST \
  --url 'http://localhost:8888/gateway/v2/token' \
  --header 'Authorization: Basic YWRtaW46Y29uZHVrdG9y' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "username": "partner-user",
    "vCluster": "mypartner",
    "lifeTimeSeconds": 3600000
  }'
```

</TabItem>
</Tabs>

Put the admin credentials in a file called `mypartner-super-user.properties`:

```properties title="mypartner-super-user.properties"
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="super-user" password="$SUPER-USER-PASSWORD";
```

And the partner credentials in a file called `mypartner-partner-user.properties`:

```properties title="mypartner-partner-user.properties"
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="partner-user" password="$PARTNER-USER-PASSWORD";
```

## 5. Create ACLs for the service accounts

Before creating ACLs, you need to know how to reach this partner virtual cluster.

For that, make the following request:

```sh
curl \
  --silent \
  --user "admin:conduktor" \
  "http://localhost:8888/gateway/v2/virtual-cluster/mypartner"
```

This will return something like this, with the bootstrap address and client properties:

```json
{
  "kind": "VirtualCluster",
  "apiVersion": "gateway/v2",
  "metadata": {
    "name": "mypartner"
  },
  "spec": {
    "aclEnabled": true,
    "superUsers": [ "super-user" ],
    "type": "Partner",
    "bootstrapServers": "<partner_virtual_cluster_bootstrap_address>",
    "clientProperties": {
      "security.protocol": "SASL_PLAINTEXT",
      "sasl.mechanism": "PLAIN",
      "sasl.jaas.config": "org.apache.kafka.common.security.plain.PlainLoginModule required username={{username}} password={{password}};"
    }
  }
}
```

From there, you have everything you need to create ACLs for the partner service accounts:

```sh
# The partner can consume all the topics of this partner virtual cluster
kafka-acls --bootstrap-server <partner_virtual_cluster_bootstrap_address> \
  --command-config mypartner-super-user.properties \
  --add \
  --allow-principal User:partner-user \
  --consumer \
  --topic "*" \
  --group partner-app

# The partner can produce and consume from the topic1 alias topic
kafka-acls --bootstrap-server <partner_virtual_cluster_bootstrap_address> \
  --command-config mypartner-super-user.properties \
  --add \
  --allow-principal User:partner-user \
  --producer \
  --topic topic1
```

For more information on service accounts and acls, see [here](/gateway/how-to/manage-service-accounts-and-acls/)

## 6. Access the partner virtual cluster as your partner

Now that the partner user has the correct ACLs, you can use their credentials to interact with the alias topics and verify that the permissions are correctly set.

```sh
kafka-console-producer --bootstrap-server localhost:6974 \
  --topic topic1 \
  --producer.config mypartner-partner-user.properties

kafka-console-consumer --bootstrap-server localhost:6974 \
  --topic topic2 \
  --consumer.config mypartner-partner-user.properties \
  --group partner-app \
  --from-beginning
```

Once confirmed, simply share the `mypartner-partner-user.properties` file and the correct bootstrap server details with your partner.