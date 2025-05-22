---
sidebar_position: 130
title: Configure Kafka clusters
description: Configure Kafka clusters with Conduktor
---

## Managing clusters in Console overview

:::note
Use our [interactive guide](https://conduktor.navattic.com/cluster-configuration) to learn how to connect your Kafka cluster, Schema Registry and Kafka Connect
:::

In the **Clusters** sections of the **Settings**, you can add, update, and delete Kafka cluster configurations.
By default, only users belonging to the **Admin** group, or having the `Can manage Cluster configurations` permission, will be able to view and manage the clusters.

![Cluster admin](/guides/clusters-list.png)

To create a new cluster configuration, click on the "Create cluster" button in the top right-hand corner.

To edit an existing cluster configuration, select it from the list. You will then be able to adjust the name and color, technical ID, bootstrap servers, and additional properties. You can also enable Schema Registry and Kafka Connect for the cluster.

## Connect to a secure Kafka cluster

Conduktor leverages the default Apache Kafka Java Clients, and therefore we use the same [configuration properties](https://kafka.apache.org/documentation/#consumerconfigs).

When the Conduktor Console needs to connect to a secure Kafka cluster, you must specify the values from your `config.properties` file.

For example:

```
security.protocol=SASL_SSL
sasl.mechanism=SCRAM-SHA-512
sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required username='<username>' password='<password>';
```

:::info
If your configuration references keystore or truststore path, check the [Client Certificate Authentication](https://docs.conduktor.io/platform/configuration/ssl-tls-configuration/#client-certificate-authentication) documentation.
:::

## Connect to a Confluent cluster

Via your Confluent cluster dashboard, select the **Clients** tab within **Data integration.**

Select **Java** as the language.

![Confluent client](/guides/confluent-client.png)

Create the **Kafka cluster API key**. You also have the option to create the **Schema Registry API Key** if you are using Schema Registry.

![Confluent snippet](/guides/confluent-api-key.png)

**Copy** the configuration to your clipboard.

You can now go back to Conduktor Console to configure your Kafka cluster. You can fill the bootstrap servers, and paste your configuration as Advanced properties.

You can test the connection and if successful, you will see a green **Connected** label.

![Confluent configuration in Console](/guides/confluent-config.png)

Click **Create Configuration** to save your cluster.

## Connect to an Aiven cluster

When connecting to an Aiven cluster, you have two options.

### Option 1: With SSL

To connect to your Aiven cluster using SSL, you need to provide the **Access Key**, **Access Certificate**, and **CA Certificate**.
You also need the cluster **Bootstrap server**, labelled as **Service URI** within the Aiven console.

![Aiven certificates](/guides/aiven-certs.png)

In the Console, after having filled the bootstrap server, you'll have to upload the CA certificate in order to connect to your Aiven cluster.

Then, simply select **SSL** as authentication method, and paste the **Access Key** and **Access Certificate** in the corresponding fields.

The configuration should look like this:

![Console config with SSL](/guides/aiven-with-ssl.png)

### Option 2: With SASL_SSL

To connect to your Aiven cluster using SASL_SSL, you need to provide the **Bootstrap server** labelled as **Service URI**, **User**, and **Password**. You can find these in the Aiven console.

![Aiven SASL](/guides/aiven-sasl-ssl.png)

The configuration in the Console should look like this:

![Console config with SASL_SSL](/guides/aiven-with-sasl-ssl.png)

## Connect to a MSK cluster

For connecting to MSK, you first need to create an IAM user.

![MSK IAM user](/guides/msk-iam-user.png)

After that, you have to give it permissions to connect to your MSK cluster.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["kafka:*", "kafka-cluster:*"],
      "Resource": "*"
    }
  ]
}
```

Finally, generate an access key.

![MSK Access key](/guides/msk-access-key.png)

In the Console, fill the **Bootstrap server** and select **AWS IAM** as an authentication method.
You now have two options: Either you inherit the credentials from your environment (with environment variables) or you can fill the **Access Key** and **Secret Key**.

The configuration should look like this in the Console:

![Consol config with IAM](/guides/msk-with-iam.png)

## Connect to a Cloudera cluster

:::info
These instructions are for a setup with **SASL_SSL** and **PLAIN** mechanisms.
:::

1. To administer the Cloudera Kafka Cluster, you have to have a workload user with **ownership of the Data Hub cluster** configured. Make sure to note the username and password information of this user:

![cloudera-user-management](/guides/cloudera-user-management.png "cloudera-user-management")

1. Download the certificates from Cloudera:
![getting_certs_from_cloudera](/guides/getting_certs_from_cloudera.png "getting_certs_from_cloudera")

1. Cloudera Certificates are CRT formatted files and need to be converted to a JKS file for console to connect. To convert the file please use the java keytool, command below is an example based on the screenshots above.

```
keytool -import -keystore zeke-test2-cdp-env.jks -alias zeke-test2-cdp-env -file zeke-test2-cdp-env.crt
```

1. In the Cloudera platform, **open the firewalls** for the Kafka brokers and schema registry.

1. In Conduktor Console, go to **Clusters**, select the newly created Cloudera one and [add the certs to your environment](/platform/get-started/configuration/ssl-tls-configuration/#configure-custom-truststore-on-conduktor-console) or click **Upload certificate** to manually upload them.

1. Once you've added your certs to Console, configure the cluster in the below screenshot. Use the **workload user and password** from the first step. 

![adding cloudera to console](/guides/cloudera-console-setup.png "adding cloudera to console")

[Here's a fully automated turnkey example](https://github.com/conduktor/conduktor-cloudera-quickstart-demo?tab=readme-ov-file#cloudera--conduktor).

## Connect to a Google Cloud cluster

You can connect to Google Cloud Managed Service for Apache Kafka using the **SASL_SSL protocol** or the **PLAIN mechanism** with one of the following options.

### Option 1: Use a service account

 [Go to Google Cloud docs for instructions](https://cloud.google.com/managed-service-for-apache-kafka/docs/authentication-kafka#sasl-plain).

### Option 2: Use an access token

First, get an access token:

```
gcloud auth login --no-launch-browser
gcloud auth print-access-token 
```

Then, use that token with the following parameters:

```
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required \
username="PRINCIPAL_EMAIL_ADDRESS" \
password="ACCESS_TOKEN_VALUE";
```

When authenticating incoming connections to the cluster, managed service for Apache Kafka checks that:

- the access token is valid and has not expired
- the provided username matches the principal email that the access token is associated with
- the access token's principal has the `managedkafka.clusters.connect` permission (included in roles/managedkafka.client) on the cluster





## Configure Gateway for multi-clusters

Gateway can be configured to communicate with multiple Kafka clusters and expose their topics to your partners. 

- direct partners to a **single endpoint**
- provide them with **access to topics in multiple Kafka clusters**
- expose topics using **aliases** that can be different from topic names

### 1. Configure Gateway

To set up Gateway to support multi-clusters, you should:
- configure one main cluster which will be used by Gateway to store its internal state
- set up any number of upstream physical Kafka clusters that you want to expose through Gateway

This can be achieved through a **configuration file**, or **environment variables**.

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

Configure your main and upstream clusters through environment variables, defined in the Gateway container:

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

### 2. Create a partner virtual cluster

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

### 3. Alias your topics

Finally, create aliases for existing topics in the partner virtual cluster.

:::warning
Alias topics within a partner virtual cluster **can only point to topics from the same physical cluster**.
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

### 4. Create service accounts

Once the virtual cluster is created and contains the topics to expose to your partners, you'll need to create service accounts and configure ACLs (Access Control Lists).

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

In order to connect to Gateway using these service accounts, you need to get their associated password.

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

In order to connect to Gateway using these service accounts, you need to get the associated password.

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

### 5. Create ACLs for the service accounts

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

[Find out more about service accounts and ACLs](/gateway/how-to/manage-service-accounts-and-acls/).

### 6. Test partner virtual cluster access

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

### Related resources
- [Manage service accounts](/gateway/how-to/manage-service-accounts-and-acls/)
- [Give us feedback/request a feature](https://conduktor.io/roadmap)
