---
sidebar_position: 1
title: Clusters
description: How to manage your Kafka clusters in Conduktor Console
---

# Clusters

## Overview

:::tip
Use our [interactive guide](https://conduktor.navattic.com/cluster-configuration) to learn how to connect your Kafka cluster, Schema Registry and Kafka Connect
:::

In the **Clusters** sections of the **Settings**, you can add, update, and delete Kafka cluster configurations.
By default, only users belonging to the **Admin** group, or having the `Can manage Cluster configurations` permission, will be able to view and manage the clusters.

![Cluster admin](assets/clusters-list.png)

To create a new cluster configuration, click on the "Create cluster" button in the top right-hand corner.

To edit an existing cluster configuration, select it from the list. You will then be able to adjust the name & color, technical ID, bootstrap servers, and additional properties. You can also enable Schema Registry and Kafka Connect for the cluster.

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

![Confluent client](assets/confluent-client.png)

Create the **Kafka cluster API key**. You also have the option to create the **Schema Registry API Key** if you are using Schema Registry.

![Confluent snippet](assets/confluent-api-key.png)

**Copy** the configuration to your clipboard.

You can now go back to Conduktor Console to configure your Kafka cluster. You can fill the bootstrap servers, and paste your configuration as Advanced properties.

You can test the connection and if successful, you will see a green **Connected** label.

![Confluent configuration in Console](assets/confluent-config.png)

Click **Create Configuration** to save your cluster.

## Connect to an Aiven cluster

When connecting to an Aiven cluster, you have two options.

### Option 1: With SSL

To connect to your Aiven cluster using SSL, you need to provide the **Access Key**, **Access Certificate**, and **CA Certificate**.
You also need the cluster **Bootstrap server**, labelled as **Service URI** within the Aiven console.

![Aiven certificates](assets/aiven-certs.png)

In the Console, after having filled the bootstrap server, you'll have to upload the CA certificate in order to connect to your Aiven cluster.

Then, simply select **SSL** as authentication method, and paste the **Access Key** and **Access Certificate** in the corresponding fields.

The configuration should look like this:

![Console config with SSL](assets/aiven-with-ssl.png)

### Option 2: With SASL_SSL

To connect to your Aiven cluster using SASL_SSL, you need to provide the **Bootstrap server** labelled as **Service URI**, **User**, and **Password**. You can find these in the Aiven console.

![Aiven SASL](assets/aiven-sasl-ssl.png)

The configuration in the Console should look like this:

![Console config with SASL_SSL](assets/aiven-with-sasl-ssl.png)

## Connect to a MSK cluster

For connecting to MSK, you first need to create an IAM user.

![MSK IAM user](assets/msk-iam-user.png)

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

![MSK Access key](assets/msk-access-key.png)

In the Console, fill the **Bootstrap server** and select **AWS IAM** as an authentication method.
You now have two options: Either you inherit the credentials from your environment (with environment variables) or you can fill the **Access Key** and **Secret Key**.

The configuration should look like this in the Console:

![Consol config with IAM](assets/msk-with-iam.png)

## connect to a Cloudera cluster

Connect to Cloudera Kafka using SASL_SSL

1. To administer the Cloudera Kafka Cluster, you have to have a workload user with **ownership of the Data Hub cluster** configured. Make sure to note the username and password information of this user:

![cloudera-user-management](assets/cloudera-user-management.png "cloudera-user-management")

2. Download the certificates from Cloudera:
![getting_certs_from_cloudera](assets/getting_certs_from_cloudera.png "getting_certs_from_cloudera")

3. Cloudera Certificates are CRT formatted files and need to be converted to a JKS file for console to connect. To convert the file please use the java keytool, command below is an example based on the screenshots above.

```
keytool -import -keystore zeke-test2-cdp-env.jks -alias zeke-test2-cdp-env -file zeke-test2-cdp-env.crt
```

4. In the Cloudera platform, **open the firewalls** for the Kafka brokers and schema registry.

5.  In Conduktor Console, go to **Clusters**, select the newly created Cloudera one and [add the certs to your environment](/platform/get-started/configuration/ssl-tls-configuration/#configure-custom-truststore-on-conduktor-console) or click **Upload certificate** to manually upload them.

6. Once you've added your certs to Console, configure the cluster link in the below screenshot. Use the **workload user and password** from the first step.

![adding cloudera to console](assets/cloudera-console-setup.png "adding cloudera to console")

[Here's a fully automated turnkey example](https://github.com/conduktor/conduktor-cloudera-quickstart-demo?tab=readme-ov-file#cloudera--conduktor).


## connect to a Google Cloud cluster

### Option 1: [SASL_PLAINTEXT using a Service Account](https://cloud.google.com/managed-service-for-apache-kafka/docs/authentication-kafka#sasl-plain)

### Option 2: Connect using an Access Token

First get and access token.

```
gcloud auth login --no-launch-browser
gcloud auth print-access-token 
```

You can use the access token for authentication with the following parameters.

```
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required \
username="PRINCIPAL_EMAIL_ADDRESS" \
password="ACCESS_TOKEN_VALUE";
```

Replace the following:

`PRINCIPAL_EMAIL_ADDRESS`: The email address of the principal that you used to obtain the access token.
`ACCESS_TOKEN_VALUE`: The access token value that you obtained in the previous step.

When authenticating incoming connections to the cluster, Managed Service for Apache Kafka checks the following:

* The access token is valid and has not expired.

* The provided username matches the principal email that the access token is associated with.

* The access token's principal has the permission managedkafka.clusters.connect (included in roles/managedkafka.client) on the cluster.

Example below

![adding google to console](assets/google-console-setup.png "adding google to console")


