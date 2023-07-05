---
sidebar_position: 3
title: Connect to a Kafka Cluster
description: You must add a Kafka cluster to your workspace to build tests.
---

# Connect to a Kafka Cluster

You must add a Kafka cluster in your [Workspace](/platform/testing/features/workspace/). This enables you to reference the cluster when building [Test Scenarios](/platform/testing/features/building-tests/test-scenarios/).

The ability to reach your cluster will depend on where you have setup the [Testing Agent](/platform/testing/getting-started/install-the-testing-agent/).

:::info If you started Conduktor via **Docker**, you should have already configured your Kafka Clusters and can skip this. 
:::

## Adding a cluster

To add a Kafka cluster, navigate to the **Clusters** tab from within your [Workspace](/platform/testing/features/workspace/).&#x20;

![](<../assets/image (14).png>)

Select **Create New** and you will be presented with the cluster configuration modal.&#x20;

![](<../assets/image (173).png>)

You will be required to input the following information:

- **Cluster name:** This will enable you to reference your cluster when using it in test scenarios.
- **Bootstrap servers:** The list of host and port pairs used to establish the initial connection to the Kafka cluster
- **Additional properties:** Additional properties that you would usually provide your CLI or Java clients. This is especially important if you have a **secure Kafka cluster**.

Note it's possible to paste the list of additional properties by toggling **Switch view.**

![](<../assets/image (102).png>)

When you have configured the cluster properties, click **refresh** to check the **connection status**.

## Schema Registry

When you configure a cluster, you also have the option to configure Schema Registry. Conduktor supports the Avro, JSON and Protobuf formats.&#x20;

Select the **Schema registry** tab from within the cluster configuration modal to get started.

![](<../assets/image (43).png>)

- **Schema Registry URL:** HTTP or HTTPS endpoint of your schema registry
- **Authentication**: Select your authentication method (None, Basic or Bearer token)
- **Additional Properties**: Any additional properties required for your connection. For example, properties that define your SSL truststore/keystore location and password.

## Connect to a Local Kafka cluster

You are able to connect to a Kafka cluster that is running on your localhost. For example, a cluster that has been started via [Docker](https://github.com/conduktor/kafka-stack-docker-compose), or via the Kafka binaries.&#x20;

**The only pre-requisite** is that the [Testing Agent](/platform/testing/getting-started/install-the-testing-agent/) is running on a host that has access to your cluster.

:::tip **Pro tip!** You can [start a Kafka cluster in seconds](https://docs.conduktor.io/kafka-cluster-connection/starting-a-local-kafka-cluster-in-seconds/) using our other product, Conduktor Desktop 
:::

To connect to Kafka running on localhost:

- Ensure your agent is running, and selected via the dropdown in the navigation
- Provide the host and port like any other cluster, for example: **localhost:9092**

![](<../assets/image (16).png>)

## Connect to a secure Kafka cluster

Conduktor leverages the default Apache Kafka Java Clients, and therefore we use the same [configuration properties](https://kafka.apache.org/documentation/#consumerconfigs).

When the Conduktor Testing application needs to connect to a secure Kafka cluster, you must specify the values from your `config.properties` file.

For example:

```
ssl.truststore.location=/path/to/client.truststore-6597145213355562865.jks
ssl.truststore.password=test5494c04
security.protocol=SSL
ssl.keystore.type=PKCS12
ssl.keystore.location=/path/to/client.keystore-12124676830593951314.p12
ssl.keystore.password=test632ecc3
ssl.key.password=test632ecc3
```

For more detail, visit the [docs](/platform/testing/getting-started/connect-to-a-kafka-cluster/) for our Conduktor Desktop product.

## Connect to a Confluent cluster

Via your Confluent cluster dashboard, select the **Clients** tab within **Data integration.**

Select **Java** as the language.

![](<../assets/image (136).png>)

Create the **Kafka cluster** **API key.** You also have the option to create the **Schema Registry API Key** if you are using Schema Registry.

![](<../assets/image (143).png>)

**Copy** the configuration to your clipboard.

From within the cluster configuration modal of the Testing application, **Paste** your configuration as additional properties.

:::caution **Note:** You will need to **remove any comments from the configuration**, and **move the bootstrap server URL** to the correct form input. If you are not using the schema registry, you can also remove these properties. 
:::

**Refresh** the connection and if successful, you will see the **CONNECTED** label turn green.

![](<../assets/image (24).png>)

Click **Create Cluster** to save your cluster.&#x20;

## Connect to an Aiven cluster

To connect to an Aiven cluster, you must specify the **Access Key**, **Access Certificate**, and **CA Certificate**.

To obtain these files, go to:

[https://console.aiven.io/project/](https://console.aiven.io/project)\&#60;project&#62;/services/\&#60;cluster&#62; \
\
From within the cluster configuration modal, add the Bootstrap server. This is labelled **Service URI** within the Aiven console.&#x20;

Using the **additional properties,** reference the **absolute path** of the files downloaded from the Aiven console.&#x20;

For example:

```
ssl.keystore.location = /path/to/client.keystore.p12
```

It's important that the [Testing Agent](/platform/testing/getting-started/install-the-testing-agent/) is running on a host with access to these files.

![](<../assets/image (138).png>)

:::tip **Pro Tip!** If you are using the Conduktor Desktop GUI, you can use the **Aiven wizard** to setup your cluster configuration and paste the config into Testing.&#x20; 
:::

## Connect to a Red Hat cluster

Select **Connection** from your Red Hat Kafka Instance

![](<../assets/image (11) (1) (1).png>)

From within the slide-out menu, choose **Create service account**

![](<../assets/image (12).png>)

Copy the credentials that are generated in the subsequent modal.

![](<../assets/image (126).png>)

Create a cluster inside Conduktor Testing using the below additional properties.

Note you must replace the **clientId** and **clientSecret** with the service account credentials that were generated in the previous step.

```
sasl.oauthbearer.token.endpoint.url=https://identity.api.openshift.com/auth/realms/rhoas/protocol/openid-connect/token
sasl.login.callback.handler.class=org.apache.kafka.common.security.oauthbearer.secured.OAuthBearerLoginCallbackHandler
sasl.jaas.config=org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule required clientId="YOUR-CLIENT-ID" clientSecret="YOUR-CLIENT-SECRET" ssl.protocol="SSL" ;
sasl.mechanism=OAUTHBEARER
security.protocol=SASL_SSL
```

![](<../assets/image (140).png>)

## Connect to a MSK cluster

For connecting to MSK, we recommend installing the [Testing Agent](/platform/testing/getting-started/install-the-testing-agent/) on an EC2 instance with access to the cluster.&#x20;

:::info Note that you will need to configure **Security Groups** so that the cluster's security group can accept traffic coming from the EC2 instance's security group. See [docs](https://docs.aws.amazon.com/msk/latest/developerguide/create-client-machine.html).&#x20; 
:::

When you create an Agent inside the Testing UI, you will be provided the commands for downloading and running it.&#x20;

Execute these commands on your EC2 instance, and you should see the message:

`Agent <agent name> connected!`

![](../assets/image.png)

From within the Testing UI, you should now be able to see that the Agent is connected:

![](<../assets/image (8) (3).png>)

Navigate to the Clusters tab, and **Create** a new cluster.

- Add the bootstrap servers&#x20;
  - For MSK, you can find this by selecting the Cluster within AWS > MSK and clicking **View client information**
- Add any required configuration properties

![](<../assets/image (2).png>)
