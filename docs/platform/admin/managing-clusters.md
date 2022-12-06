---
sidebar_position: 1
title: Managing Clusters
description: How to manage and update your Kafka clusters in Conduktor Platform
---

# Managing Clusters

The Admin section of Conduktor Platform enables you to add, update, and delete Kafka clusters. By default, only users with Admin permissions will be able to view and perform actions relating to Cluster management. You will not be able to add clusters beyond your current organization limit; please use the chat box below or contact us to discuss an increase to this limit.

![Cluster admin](/img/admin/cluster-admin.png)

To create a new cluster, click on the "Create cluster" button in the top right-hand corner, then follow the instructions from the [Get Started](../installation/get-started/cloud#configure-your-first-cluster) section.

To edit an existing cluster, select it from the list. You will then be able to adjust the cluster name & color, technical ID, bootstrap servers, and additional properties. You can also enable Schema Registry and Kafka Connect for the cluster. 

## Schema Registry

To enable Schema Registry, you will need to have it setup for your cluster. This will depend on whether you are using open source Kafka or a managed Kafka service from the likes of [Confluent](https://docs.confluent.io/cloud/current/sr/schemas-manage.html), [Amazon MSK](https://docs.aws.amazon.com/glue/latest/dg/schema-registry.html), or [Aiven](https://docs.aiven.io/docs/products/kafka/karapace/getting-started.html).

You will then need to obtain the address of your Schema Registry, as well as any authentication details.

## Kafka Connect

Setting up Kafka Connect works similarly to Schema Registry; you will need to enable it for your clusters first, then locate the Kafka Connect URL and authentication for entry into Conduktor Platform. Below is an example using Confluent Cloud 

### Confluent Cloud Kafka Connect

### Generate an API key

You need to generate an API key and secret to act as username and password specifically for Kafka Connect. Do not use the Kafka credentials you already have, these won't work. This can be done using the Confluent Cloud CLI tool: `ccloud`. Install it using the official documentation: [https://docs.confluent.io/ccloud-cli/current/install.html](https://docs.confluent.io/ccloud-cli/current/install.html)

- Login and select your environment if you have several of them:

```text
$ ccloud login
$ ccloud environment
```

- Generate a key: write down the key & secret:

```text
$ ccloud api-key create --resource cloud
+---------+------------------------------------------------------------------+
| API Key | ABCDEFKZBF56666                                                  |
| Secret  | ToMaHaWkjQ1bt7BxvdyFjaJ8j3nSokaAd83Nhan739snAiufIAfdk7fFAAnBKxai |
+---------+------------------------------------------------------------------+
```

- The API Key is the username, the Secret is the token

## Kafka Connect URL

- Get the ID of the environment where your cluster is located:

```text
$ ccloud environment list                                                                                                                                                                                   16:49:31
      Id      |    Name
+-------------+------------+
    env-1234 | staging
  * env-6789 | production
```

- Get the ID of the Kafka cluster :

```text
 ccloud environment use env-6789
 ccloud kafka cluster list                                                                    16:21:10
      Id      |         Name         | Type  | Provider |    Region    | Availability | Status
+-------------+----------------------+-------+----------+--------------+--------------+--------+
    lkc-8888 | analytics-production | BASIC | gcp      | europe-west4 | single-zone  | UP

```

- Then build the Kafka connection URL for this env-id cluster-id couple

```text
https://api.confluent.cloud/connect/v1/environments/env-6789/clusters/lkc-8888/
```

## Configure your cluster using this API key

From the Kafka Connect tab of your cluster, configure with these elements, selecting Basic Auth to add the username/password. Click "Test connection" to ensure that everything is working, and you're done!
