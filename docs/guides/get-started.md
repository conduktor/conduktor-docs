---
sidebar_position: 20
title: Get started
description: Get started with Conduktor
---

You can [get started for free](https://www.conduktor.io/get-started) using the Conduktor Community version.

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="First Tab" label="Docker">

:::info
Pre-requisite: [Docker Compose](https://docs.docker.com/compose/install)
:::

Get started in a few minutes with the latest Conduktor Console Docker image.

- [**Simple Setup**](#simple-setup): Get started with the Conduktor Console through its user-friendly interface - Perfect to **quickly** see its value.
   - [Option 1: Start with an embedded Kafka cluster](#option-1-start-with-an-embedded-kafka-cluster)
   - [Option 2: Use your existing Kafka cluster](#option-2-use-your-existing-kafka-cluster)

- [**Advanced Setup**](#advanced-setup): For customized **production environments** or more complex setups.
   - [Option 1: Configure using a configuration file](#option-1-using-a-configuration-file)
   - [Option 2: Configure using environment variables](#option-2-using-environment-variables)

:::note
As the **Conduktor Playground**, also known as **Conduktor Cloud**, does not exist anymore, we recommend using the [embedded Kafka option](#option-1-start-with-an-embedded-kafka-cluster) to get started quickly.
:::

## Simple Setup

When launching Conduktor Console for the first time, an onboarding guide will walk you through configuring your environment.

### Step 1: Start the Console

Let's start by running one of the commands below to launch Conduktor. Choose the option that best fits your setup: use an embedded Kafka cluster, or connect to your own Kafka cluster.

#### Option 1: Start with an embedded Kafka cluster

Start Conduktor Console with 2 clusters pre-configured:
- a Redpanda Kafka cluster and Schema Registry
- a Conduktor Gateway connected to the Redpanda cluster

```bash
curl -L https://releases.conduktor.io/quick-start -o docker-compose.yml && docker compose up -d --wait && echo "Conduktor started on http://localhost:8080"
```

:::info
If you have an M4 Mac the above command will fail because of a [JDK/Docker interopability bug](https://github.com/adoptium/adoptium-support/issues/1223). Use the following work-around until a JDK fix is released in April: 

`curl -L https://releases.conduktor.io/quick-start-m4 -o docker-compose.yml && docker compose up -d --wait && echo "Conduktor started on http://localhost:8080"`
:::

#### Option 2: Use your existing Kafka cluster

Start Conduktor Console without any cluster pre-configured.

```bash
curl -L https://releases.conduktor.io/console -o docker-compose.yml && docker compose up -d --wait && echo "Conduktor started on http://localhost:8080"
```

### Step 2: Complete the onboarding wizard

After a few seconds, the onboarding wizard will be available at **[http://localhost:8080](http://localhost:8080)**. Here, you can set the admin credentials to use to log in.

### Step 3: Connect to your existing Kafka cluster

Conduktor Console is compatible with all the Kafka providers, such as Confluent, Aiven, MSK or Redpanda. To see the full value of Conduktor, we recommend configuring it against your own Kafka data. 

In that regard, after having completed the onboarding wizard, go to the [**Clusters**](http://localhost:8080/settings/clusters) page, and click on **Add cluster**.

:::note
Use our [interactive guide](https://conduktor.navattic.com/cluster-configuration) to learn how to connect your Kafka cluster, Schema Registry and Kafka Connect!
:::

From within the cluster configuration screen, fill the:

- Bootstrap servers
- Authentication details
- Additional properties

:::note
Configuring an **SSL/TLS** cluster? Use the [Conduktor Certificates Store](/guides/get-started/configuration/ssl-tls-configuration/#using-the-conduktor-certificate-store).
:::

#### How to connect to Kafka running on localhost:9092?

Add the below to your Kafka **server.properties** file

```env
listeners=EXTERNAL://0.0.0.0:19092,PLAINTEXT://0.0.0.0:9092
listener.security.protocol.map=PLAINTEXT:PLAINTEXT,EXTERNAL:PLAINTEXT
advertised.listeners=PLAINTEXT://127.0.0.1:9092,EXTERNAL://host.docker.internal:19092
```

If running Kafka in KRaft mode, add the below to your Kafka **config/kraft/server.properties** file

```env
listeners=EXTERNAL://0.0.0.0:19092,PLAINTEXT://0.0.0.0:9092,CONTROLLER://:9093
listener.security.protocol.map=PLAINTEXT:PLAINTEXT,EXTERNAL:PLAINTEXT,CONTROLLER:PLAINTEXT
advertised.listeners=PLAINTEXT://127.0.0.1:9092,EXTERNAL://host.docker.internal:19092
inter.broker.listener.name=PLAINTEXT
```

From within the Conduktor interface, connect using the bootstrap server: `host.docker.internal:19092`

### Step 4: Add additional users

If you have deployed Conduktor on a central server, you can add new users to collaborate with you inside the Console.

For that, go to the [**Users**](http://localhost:8080/settings/members) screen and select **Create Members** to set the credentials of a new local user.

:::info
You can configure your [SSO](/guides/category/configure-sso/) using the free Console!
:::

## Advanced Setup

:::warning
For **production deployments**, please make sure you respect the [production requirements](/guides/get-started/installation/hardware/#production-requirements).
:::

### Step 1: Configure the Console

To configure the Conduktor Console during deployment, you have two options:
  - [Option 1: Using a configuration file](#option-1-using-a-configuration-file) - You define the configuration in a file and bind it to the Console container in the Docker Compose file.
    - Easier to manage and update
  - [Option 2: Using environment variables](#option-2-using-environment-variables) - You define the configuration directly in the Docker Compose file.
    - Gathers everything in one place

:::important
If both methods are used, **environment variables will take precedence** over the configuration file.
:::

Here’s what you can configure:
- External database (**required**)
- User authentication (Local or SSO/LDAP)
- Kafka clusters configurations
- Conduktor enterprise license key

:::note
Some objects, such as groups or Self-service resources, can't be initiated before the Console has started. To automate their creation, you can either use our [API](/guides/reference/api-reference/), [CLI](/guides/reference/cli-reference/) or [Terraform provider](/guides/reference/terraform-reference/).
:::

#### Option 1: Using a configuration file

**Create a configuration file**

The below example shows how to configure Conduktor with the following configuration:
- The external database configuration
- The local administrator credentials
- The connection to the Monitoring container called `conduktor-console-cortex`

If you want, you can add more snippets, like [SSO](/guides/category/configure-sso/) or [license key](/guides/get-started/installation/license-management/#into-the-configuration-file).
You can get the list of all the properties supported [here](/guides/get-started/configuration/env-variables/).

```yaml title="console-config.yaml"
database:         # External database configuration
  hosts: 
   - host: 'postgresql'
     port: 5432
  name: 'conduktor-console'
  username: 'conduktor'
  password: 'change_me'
  connection_timeout: 30 # in seconds

admin:            # Local admin credentials
  email: "<name@your_company.io>"
  password: "adminP4ss!"

monitoring:       # Connection to the Cortex Monitoring container
  cortex-url: http://conduktor-monitoring:9009/
  alert-manager-url: http://conduktor-monitoring:9010/
  callback-url: http://conduktor-console:8080/monitoring/api/
  notifications-callback-url: http://localhost:8080

# license: ""     # Enterprise license key
```

**Bind the file to the Console container**

The below docker-compose indicates how to bind your `console-config.yaml` file.

Note that the environment variable `CDK_IN_CONF_FILE` is used to indicate that a configuration file is being used, and the location to find it. The file is also mounted to be used from within the container.

```yaml title="docker-compose.yaml"
services:  
  postgresql:
    image: postgres:14
    hostname: postgresql
    environment:
      POSTGRES_DB: "conduktor-console"
      POSTGRES_USER: "conduktor"
      POSTGRES_PASSWORD: "change_me"

  conduktor-console:
    image: conduktor/conduktor-console:1.30.0
    depends_on:
      - postgresql
    ports:
      - "8080:8080"
    volumes:
      - type: bind
        source: "./console-config.yaml"
        target: /opt/conduktor/console-config.yaml
        read_only: true
    environment:
      CDK_IN_CONF_FILE: /opt/conduktor/console-config.yaml

  conduktor-monitoring:
    image: conduktor/conduktor-console-cortex:1.30.0
    environment:
      CDK_CONSOLE-URL: "http://conduktor-console:8080" # Connection to the Console container
```

#### Option 2: Using environment variables

The same configuration can be achieved using environment variables. 

You can use our [YAML to ENV converter](https://conduktor.github.io/yaml-to-env/) to easily convert the configuration file into environment variables.

```yaml title="docker-compose.yaml"
services:  
  postgresql:
    image: postgres:14
    hostname: postgresql
    environment:
      POSTGRES_DB: "conduktor-console"
      POSTGRES_USER: "conduktor"
      POSTGRES_PASSWORD: "change_me"

  conduktor-console:
    image: conduktor/conduktor-console:1.30.0
    depends_on:
      - postgresql
    ports:
      - "8080:8080"
    environment:
      # Enterprise license key
      # CDK_LICENSE: ""
      # External database configuration
      CDK_DATABASE_URL: "postgresql://conduktor:change_me@postgresql:5432/conduktor-console"
      # Local admin credentials
      CDK_ADMIN_EMAIL: "<name@your_company.io>"
      CDK_ADMIN_PASSWORD: "adminP4ss!"
      # Connection to the Cortex Monitoring container
      CDK_MONITORING_CORTEX-URL: http://conduktor-monitoring:9009/
      CDK_MONITORING_ALERT-MANAGER-URL: http://conduktor-monitoring:9010/
      CDK_MONITORING_CALLBACK-URL: http://conduktor-console:8080/monitoring/api/
      CDK_MONITORING_NOTIFICATIONS-CALLBACK-URL: http://localhost:8080

  conduktor-monitoring:
    image: conduktor/conduktor-console-cortex:1.30.0
    environment:
      # Connection to the Console container
      CDK_CONSOLE-URL: "http://conduktor-console:8080"

volumes:
  pg_data: {}
  conduktor_data: {}
```

### Step 2: Deploy the Console

Last step to start the containers is to run the following command.
It will start:
- An external PostgreSQL database
- The Conduktor Console and Cortex containers

```sh
docker compose up
```

After a few minutes, **Conduktor will be available at [http://localhost:8080](http://localhost:8080)**

You can use the admin email and password to log in.

If using [SSO](/guides/category/configure-sso/), you will see an option to log in via the relevant identity provider.


### Step 3: Connect to your existing Kafka cluster

See [connecting to your existing Kafka cluster](#step-3-connect-to-your-existing-kafka-cluster)

### Step 4: Add additional users

See [adding additional users](#step-4-add-additional-users)


```yaml title="first-tab.yaml"
myFirstTab: "content"
```
Conduktor Gateway is provided as a Docker image and [Helm chart](../kubernetes).

It should be deployed and managed in the best way for your organization and use case(s). This could be a single container, or more likely, multiple Gateway instances should be deployed and scaled to meet your needs. Optionally, the instances could be deployed behind a [load balancer](../reference/load-balancing.md).

Use this quick start guide to help you get started.

Jump to:

- [Running the Gateway](#running-the-gateway)
   - [Connecting to secured Kafka](#connecting-to-secured-kafka)
   - [Confluent Cloud example](#confluent-cloud-example)
- [Docker Compose](#docker-compose)

## Running the Gateway

:::info
For a fully self-contained quick-start, see the [Docker Compose](#docker-compose).
:::

In its simplest form, Gateway can be run from a simple Docker run command with the credentials to connect to your existing Kafka cluster. 

#### Start a local Kafka 

Create a new directory (note the docker network will be derived from the directory name):
```sh
mkdir gateway-quick-start && cd gateway-quick-start
```

Run the below command to start a single node Kafka and ZooKeeper:

```sh
curl -L https://releases.conduktor.io/single-kafka -o docker-compose.yml && docker compose up -d 
```

#### Start Conduktor Gateway 

Run the below command to start Conduktor Gateway and configure Docker networking between the two containers:

```sh
  docker run \
  --network gateway-quick-start_default \
  -e KAFKA_BOOTSTRAP_SERVERS=kafka1:29092 \
  -e GATEWAY_ADVERTISED_HOST=localhost \
  -e GATEWAY_PORT_START=9099 \
  -p 9099:9099 \
  -d \
  conduktor/conduktor-gateway:3.5.1
```

By default, the Gateway uses [port-based routing](../configuration/network.md) and listens on as many ports as there are Kafka brokers. In this case, we started a single-node Kafka cluster and opened 1 port. 

At this stage you have:
 - Kafka running and its brokers available on `localhost:9092`
 - Gateway acting as a proxy to the backing Kafka cluster, accessible at `loalhost:9099`

#### Connecting your clients 

Your clients can now interact with Conduktor Gateway like any other Kafka cluster.

Example: creating a topic via Gateway using the Apache Kafka command line client:

```sh
bin/kafka-topics.sh --create --topic orders --bootstrap-server localhost:9099
```

#### Next Steps

This quick start shows the basics, demonstrating Conduktor Gateway acting as a network proxy for Kafka. However, the real value comes with configuring [interceptors](../concepts/interceptors.md), which are pluggable components that augment Kafka by intercepting specific requests of the Kafka protocol and applying operations to it.

View [demos](../demos/demos.md) that demonstrate how interceptors are used to satisfy specific use cases such as encryption, data quality and safeguarding your cluster with technical and business rules. 

### Connecting to secured Kafka

Your Kafka's bootstrap server, along with its [authentication method](../configuration/kafka-authentication.md) should be configured using [environment variables](../configuration/env-variables.md).

Conduktor Gateway connects to Kafka just like any other client. 

 - Environment variables prefixed by `KAFKA_` dictate the connection between Gateway and the [backing Kafka cluster](../configuration/kafka-authentication.md).
 - Environment variables prefixed by `GATEWAY_` dictate the connection between [clients and the Gateway](../configuration/client-authentication.md).

Security configurations are provided using this scheme. For example:

```bash
ssl.truststore.location
```

becomes:

```bash
KAFKA_SSL_TRUSTSTORE_LOCATION
```

### Confluent Cloud Example

Below shows the most simple way to get started with Confluent Cloud. 

:::info
By default, Gateway assumes you want the same security protocol between your clients and Gateway, as between your Gateway and Kafka.

However, this example uses `DELEGATED_SASL_PLAINTEXT` for the `GATEWAY_SECURITY_PROTOCOL`. For quick start purposes, this avoids needing to configure SSL certificates when connecting to Conduktor Gateway. 
:::

```bash
  docker run \
  -e KAFKA_BOOTSTRAP_SERVERS=$CONFLUENT_CLOUD_KAFKA_BOOTSTRAP_SERVER \
  -e KAFKA_SASL_MECHANISM=PLAIN \
  -e KAFKA_SECURITY_PROTOCOL=SASL_SSL \
  -e KAFKA_SASL_JAAS_CONFIG='org.apache.kafka.common.security.plain.PlainLoginModule required username="$CONFLUENT_CLOUD_API_KEY" password="$CONFLUENT_CLOUD_API_SECRET' \
  -e GATEWAY_SECURITY_PROTOCOL=DELEGATED_SASL_PLAINTEXT \
  -e GATEWAY_ADVERTISED_HOST=localhost \
  -e GATEWAY_CLUSTER_ID=test \
  -p 6969-6999:6969-6999 \
  -d \
  conduktor/conduktor-gateway:3.5.1
```

Note that if you wish to maintain the SSL/TLS connection between clients and Conduktor Gateway, see [Client to Gateway Configuration](../configuration/client-authentication.md).

By default, the Gateway uses [port-based routing](../configuration/network.md) and listens on as many ports as there are Kafka brokers. In this case, we open 30 ports to account for Confluent Cloud clusters with many brokers. However, you may need to open more ports depending on the size of your cluster. 

If you need support with your configuration, please [contact us](https://support.conduktor.io/) for support.

## Docker Compose

The below example demonstrates an environment consisting of:
 - Zookeeper and a 3-node Kafka cluster
 - Schema registry
 - Conduktor Gateway using [delegated authentication](/gateway/concepts/service-accounts-authentication-authorization/#delegated-sasl-authentication)
 - Kafka client

<Tabs>
<TabItem value="Command">

```sh
cat docker-compose.yaml
```

</TabItem>
<TabItem value="File Content">

```yaml
 # Gateway Quick Start 
 # Docker Compose

version: '3.7'
services:

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    hostname: zookeeper
    container_name: zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2801
      ZOOKEEPER_TICK_TIME: 2000
    healthcheck:
      test: nc -zv 0.0.0.0 2801 || exit 1
      interval: 5s
      retries: 25
    labels:
      tag: conduktor

  kafka1:
    hostname: kafka1
    container_name: kafka1
    image: confluentinc/cp-kafka:latest
    ports:
    - 19092:19092
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2801
      KAFKA_LISTENERS: INTERNAL://:9092,EXTERNAL_SAME_HOST://:19092
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka1:9092,EXTERNAL_SAME_HOST://localhost:19092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL_SAME_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_LOGGERS: kafka.authorizer.logger=INFO
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
    depends_on:
      zookeeper:
        condition: service_healthy
    healthcheck:
      test: nc -zv kafka1 9092 || exit 1
      interval: 5s
      retries: 25
    labels:
      tag: conduktor

  kafka2:
    hostname: kafka2
    container_name: kafka2
    image: confluentinc/cp-kafka:latest
    ports:
    - 19093:19093
    environment:
      KAFKA_BROKER_ID: 2
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2801
      KAFKA_LISTENERS: INTERNAL://:9093,EXTERNAL_SAME_HOST://:19093
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka2:9093,EXTERNAL_SAME_HOST://localhost:19093
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL_SAME_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_LOGGERS: kafka.authorizer.logger=INFO
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
    depends_on:
      zookeeper:
        condition: service_healthy
    healthcheck:
      test: nc -zv kafka2 9093 || exit 1
      interval: 5s
      retries: 25
    labels:
      tag: conduktor

  kafka3:
    image: confluentinc/cp-kafka:latest
    hostname: kafka3
    container_name: kafka3
    ports:
    - 19094:19094
    environment:
      KAFKA_BROKER_ID: 3
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2801
      KAFKA_LISTENERS: INTERNAL://:9094,EXTERNAL_SAME_HOST://:19094
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka3:9094,EXTERNAL_SAME_HOST://localhost:19094
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL_SAME_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_LOG4J_LOGGERS: kafka.authorizer.logger=INFO
      KAFKA_LOG4J_ROOT_LOGLEVEL: WARN
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: false
    depends_on:
      zookeeper:
        condition: service_healthy
    healthcheck:
      test: nc -zv kafka3 9094 || exit 1
      interval: 5s
      retries: 25
    labels:
      tag: conduktor

  schema-registry:
    image: confluentinc/cp-schema-registry:latest
    hostname: schema-registry
    container_name: schema-registry
    ports:
    - 8081:8081
    environment:
      SCHEMA_REGISTRY_HOST_NAME: schema-registry
      SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9093,kafka3:9094
      SCHEMA_REGISTRY_LOG4J_ROOT_LOGLEVEL: WARN
      SCHEMA_REGISTRY_LISTENERS: http://0.0.0.0:8081
      SCHEMA_REGISTRY_KAFKASTORE_TOPIC: _schemas
      SCHEMA_REGISTRY_SCHEMA_REGISTRY_GROUP_ID: schema-registry
    volumes:
    - type: bind
      source: .
      target: /clientConfig
      read_only: true
    depends_on:
      kafka1:
        condition: service_healthy
      kafka2:
        condition: service_healthy
      kafka3:
        condition: service_healthy
    healthcheck:
      test: nc -zv schema-registry 8081 || exit 1
      interval: 5s
      retries: 25
    labels:
      tag: conduktor

  conduktor-gateway-delegated:
    image: conduktor/conduktor-gateway:3.0.4
    hostname: conduktor-gateway-delegated
    container_name: conduktor-gateway-delegated
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka1:9092,kafka2:9093,kafka3:9094
      GATEWAY_ADVERTISED_HOST: localhost
      GATEWAY_SECURITY_PROTOCOL: PLAINTEXT
      GATEWAY_FEATURE_FLAGS_ANALYTICS: false
    depends_on:
      kafka1:
        condition: service_healthy
      kafka2:
        condition: service_healthy
      kafka3:
        condition: service_healthy
    ports:
    - 6969:6969
    - 6970:6970
    - 6971:6971
    - 8888:8888
    healthcheck:
      test: curl localhost:8888/health
      interval: 5s
      retries: 25   

  kafka-client:
    image: confluentinc/cp-kafka:latest
    hostname: kafka-client
    container_name: kafka-client
    command: sleep infinity
    volumes:
    - type: bind
      source: .
      target: /clientConfig
      read_only: true
    labels:
      tag: conduktor
networks:
  demo: null
```
</TabItem>
</Tabs>

### 1. Start the Docker environment

Start all your docker services, wait for them to be up and ready, then run in background:

* `--wait`: Wait for services to be `running|healthy`. Implies detached mode.
* `--detach`: Detached mode: Run containers in the background

```sh
docker compose up --detach --wait
```

### 2. Create a topic via Conduktor Gateway

<Tabs>
<TabItem value="Kafka Client (Docker Compose)">

```sh
kafka-topics \
    --bootstrap-server localhost:6969 \
    --replication-factor 1 \
    --partitions 1 \
    --create --if-not-exists \
    --topic orders
```

</TabItem>
<TabItem value="Apache Kafka Client">

```sh
bin/kafka-topics.sh --create --topic orders --bootstrap-server localhost:6969
```

</TabItem>
</Tabs>

### 3. Produce a message to your topic

<Tabs>
<TabItem value="Kafka Client (Docker Compose)">

```sh
echo '{"orderId":"12345","customerId":"67890","price":10000}' | \
    kafka-console-producer \
        --bootstrap-server localhost:6969 \
        --topic orders
```

</TabItem>
<TabItem value="Apache Kafka Client">

```sh
echo '{"orderId":"12345","customerId":"67890","price":10000}' | bin/kafka-console-producer.sh --topic my_topic --bootstrap-server localhost:6969
```

</TabItem>
</Tabs>

### 4. Consume a message from your topic

<Tabs>
<TabItem value="Kafka Client (Docker Compose)">

```sh
kafka-console-consumer \
    --bootstrap-server localhost:6969 \
    --topic cars \
    --from-beginning \
    --max-messages 1 \
    --timeout-ms 10000 | jq
```

</TabItem>
<TabItem value="Apache Kafka Client">

```sh
bin/kafka-console-consumer.sh --topic my_topic --from-beginning --bootstrap-server localhost:6969
```

</TabItem>
</Tabs>

### 5. Next Steps: Configure an interceptor

This quick start shows the basics, demonstrating Conduktor Gateway can be interacted with like any other Kafka cluster. 

However, the real value comes with configuring [interceptors](../concepts/interceptors.md), which are pluggable components that augment Kafka by intercepting specific requests of the Kafka protocol and applying operations to it.

View [demos](../demos/demos.md) that demonstrate how interceptors are used to satisfy specific use cases such as encryption, data quality and safeguarding your cluster with technical and business rules. 

</TabItem>
<TabItem value="Second Tab" label="Kubernetes">

Deploy a production-ready instance of Conduktor on Kubernetes.

:::info
We welcome contributions and feedback. If you have issues, you can either open an issue on our [GitHub repository](https://github.com/conduktor/conduktor-public-charts/issues) or [contact support](https://www.conduktor.io/contact/support/).
:::

# Helm chart installation

Conduktor provides a [Helm repository](https://helm.conduktor.io) containing a chart that will deploy Conduktor Platform on your Kubernetes cluster.

### Overview

We don't provide any relational database dependency, you will have to provide your own database. See the [production requirements](#production-requirements) for details.

Check out the [snippets](#snippets) section for more examples.

```shell
# Setup Helm repository
helm repo add conduktor https://helm.conduktor.io
helm repo update

export ADMIN_EMAIL="<your_admin_email>"
export ADMIN_PASSWORD="<your_admin_password>"
export ORG_NAME="<your_org_name>"
export NAMESPACE="<your_kubernetes_namespace>"

# Deploy Helm chart
helm install console conduktor/console \
  --create-namespace -n ${NAMESPACE} \
  --set config.organization.name="${ORG_NAME}" \
  --set config.admin.email="${ADMIN_EMAIL}" \
  --set config.admin.password="${ADMIN_PASSWORD}" \
  --set config.database.password="<your_postgres_password>" \
  --set config.database.username="<your_postgres_user>" \
  --set config.database.host="<your_postgres_host>" \
  --set config.database.port="5432" \
  --set config.license="${LICENSE}" # can be omitted if deploying the free tier
    
# Port forward to access Conduktor
kubectl port-forward deployment/console -n ${NAMESPACE} 8080:8080
open http://localhost:8080
```

## Compatibility matrix
Find out which versions of Conduktor Platform work on which version of our Conduktor Platform Helm chart.

> We recommend you use the version of Platform that comes pre-configured with the Helm chart. You can adjust the version in your values property according to the supported Platform version, if required.

> Breaking changes column only lists **changes in the Helm chart**. See Conduktor [release notes](https://docs.conduktor.io/changelog/) to determine whether there are breaking changes within the artifacts.

### Helm chart compatibility

Breaking changes:

🟡 - Breaks additional services (e.g. Grafana dashboard changes)

🔴 - Breaks overall deployment of the product (e.g. renaming variables in .values, major product releases)

| Chart version | Supported Platform version | Breaking changes |
| ------------- | ------------------------- | ---------------- |
| [console-1.18.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.18.0)  |**1.33.0**, 1.32.1, 1.32.0, 1.31.2, 1.31.1, 1.31.0, 1.30.0, 1.29.2, 1.29.1, 1.29.0, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.17.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.17.1) | **1.32.1**, 1.32.0, 1.31.2, 1.31.1, 1.31.0, 1.30.0, 1.29.2, 1.29.1, 1.29.0, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.17.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.17.0) | **1.32.0**, 1.31.2, 1.31.1, 1.31.0, 1.30.0, 1.29.2, 1.29.1, 1.29.0, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.16.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.16.2) | **1.31.2**, 1.31.1, 1.31.0, 1.30.0, 1.29.2, 1.29.1, 1.29.0, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.16.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.16.1) | **1.31.1**, 1.31.0, 1.30.0, 1.29.2, 1.29.1, 1.29.0, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.16.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.16.0) | **1.31.0**, 1.30.0, 1.29.2, 1.29.1, 1.29.0, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.15.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.15.0) | **1.30.0**, 1.29.2, 1.29.1, 1.29.0, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.14.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.14.2) | **1.29.2**, 1.29.1, 1.29.0, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.14.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.14.1) | **1.29.1**, 1.29.0, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.14.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.14.0) | **1.29.0**, 1.28.0, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.13.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.13.0) | **1.28.0**, 1.27.1, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.12.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.12.1) | **1.27.1**, 1.27.0, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.12.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.12.0) | **1.27.0**, 1.26.0, 1.25.1, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.11.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.11.0) | **1.26.0**, 1.25.1, 1.25.0, 1.24.1, 1.24.0 |
| [console-1.10.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.10.0) | **1.25.1**, 1.25.0, 1.24.1, 1.24.0 | |
| [console-1.9.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.9.1)   | **1.24.1**, 1.24.0 | |
| [console-1.9.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.9.0)   | **1.24.0** | 🔴 Changed liveness and readiness probe path [see here](https://github.com/conduktor/conduktor-public-charts/pull/80) |
| [console-1.8.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.8.1)   | **1.23.0**, 1.22.1, 1.22.0 | |
| [console-1.8.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.8.0)   | **1.23.0**, 1.22.1, 1.22.0 | |
| [console-1.7.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.7.2)   | **1.22.1**, 1.22.0 | 🔴 Service Monitor endpoint changes, Grafana template changes [see here](https://github.com/conduktor/conduktor-public-charts/pull/65) |
| [console-1.6.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.6.2)   | **1.21.3**, 1.21.2, 1.21.1, 1.21.0 | |
| [console-1.6.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.6.1)   | **1.21.1**, 1.21.0 | |
| [console-1.6.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.6.0)   | **1.21.0** | 🔴 Paths and folder changed [see here](https://github.com/conduktor/conduktor-public-charts/pull/54) |
| [console-1.5.5](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.5.5)   | **1.20.0**, 1.19.2, 1.19.1, 1.19.0, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.5.4](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.5.4)   | **1.20.0**, 1.19.2, 1.19.1, 1.19.0, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | 🟡 Updated Grafana template [see here](https://github.com/conduktor/conduktor-public-charts/pull/49) |
| [console-1.5.3](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.5.3)   | **1.20.0**, 1.19.2, 1.19.1, 1.19.0, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | 🟡 Updated Grafana template [see here](https://github.com/conduktor/conduktor-public-charts/pull/47) |
| [console-1.5.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.5.2)   | **1.20.0**, 1.19.2, 1.19.1, 1.19.0, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | 🟡 Updated Grafana template [see here](https://github.com/conduktor/conduktor-public-charts/pull/44) |
| [console-1.5.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.5.1)   | **1.20.0**, 1.19.2, 1.19.1, 1.19.0, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.5.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.5.0)   | **1.20.0**, 1.19.2, 1.19.1, 1.19.0, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.4.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.4.2)   | **1.19.2**, 1.19.1, 1.19.0, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.4.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.4.1)   | **1.19.1**, 1.19.0, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.4.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.4.0)   | **1.19.0**, 1.18.4, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.3.9](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.9)   | **1.18.4**, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.3.8](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.8)   | **1.18.4**, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.3.7](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.7)   | **1.18.3**, 1.18.2, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.3.6](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.6)   | **1.18.2**, 1.18.1, 1.18.0, 1.17.3 | |
| [console-1.3.5](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.5)   | **1.18.1**, 1.18.0, 1.17.3 | |
| [console-1.3.4](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.4)   | **1.18.1**, 1.18.0, 1.17.3 | |
| [console-1.3.3](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.3)   | **1.18.1**, 1.18.0, 1.17.3 | |
| [console-1.3.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.2)   | **1.18.0**, 1.17.3 | |
| [console-1.3.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.1)   | **1.18.0**, 1.17.3 | |
| [console-1.3.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.3.0)   | **1.18.0**, 1.17.3 | |
| [console-1.2.4](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.2.4)   | **1.17.3** | |
| [console-1.2.3](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.2.3)   | **1.17.3** | |
| [console-1.2.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.2.2)   | **1.17.3** | |
| [console-1.2.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.2.1)   | **1.17.3** | |
| [console-1.2.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.2.0)   | **1.17.3** | |
| [console-1.1.4](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.1.4)   | **1.17.3** | 🔴 Fixed issue with license checksum [see here](https://github.com/conduktor/conduktor-public-charts/pull/14) |
| [console-1.1.3](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.1.3)   | **1.17.3**, 1.17.2 | |
| [console-1.1.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.1.2)   | **1.17.3**, 1.17.2 | |
| [console-1.1.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.1.1)   | **1.17.3**, 1.17.2 | |
| [console-1.1.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.1.0)   | **1.17.3**, 1.17.2 | |
| [console-1.0.3](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.0.3)   | **1.17.3**, 1.17.2 | |
| [console-1.0.2](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.0.2)   | **1.17.3**, 1.17.2 | |
| [console-1.0.1](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.0.1)   | **1.17.3**, 1.17.2 | |
| [console-1.0.0](https://github.com/conduktor/conduktor-public-charts/releases/tag/console-1.0.0)   | **1.17.2** | |

## General requirements
* Basic knowledge of Kubernetes
* Kubernetes cluster 1.19+ ([set up a local cluster](https://k3d.io/#installation))[^1]
* Kubectl ([install](https://kubernetes.io/docs/tasks/tools/#kubectl)) with proper kube context configured
* Helm 3.1.0+ ([install](https://helm.sh/docs/intro/install/))


## Production requirements
**Mandatory for production environments**:
* To set up an [external PostgreSQL (13+) database](../../configuration/database.md) with an appropriate backup policy
* To set up an [external S3 Bucket](../../configuration/env-variables.md#monitoring-properties)
* Enough resources to run Conduktor with the [recommended configuration](../hardware.md#hardware-requirements)

### A note on TLS and URL forwarding
For production environments, we recommend to run with TLS enabled from your ingress controller and terminating on Platform.  This creates a more secure connection, while also telling Platform that it should use TLS when forwarding on any URL requests (e.g. requests to SSO providers).

Without TLS terminating on Platform itself, requests between the ingress controller and Platform will be in plain text, as will URL forwarding to your SSO provider which can lead to rejection of the request for not being secure.

## Getting started

### Setup Helm repository

```shell
helm repo add conduktor https://helm.conduktor.io
helm repo update
```

### Install the Platform chart

Configure Platform with the following values:

```yaml title="values.yaml"
config:
  organization:
    name: "<your_org_name>"

  admin:
    email: "<your_admin_email>"
    password: "<your_admin_password>"

  database:
    host: '<postgres_host>'
    port: 5432
    name: '<postgres_database>'
    username: '<postgres_username>'
    password: '<postgres_password>'
    
  # HERE you can paste the console configuration (under the config key)
```

Install the chart on your cluster:

```shell
helm install console conduktor/console \
  --create-namespace -n conduktor \
  --values values.yaml \
  --set config.license="${LICENSE}" # can be omitted if deploying the free tier
``` 

Once deployed, you will be able to access Conduktor on 
[localhost:8080](localhost:8080) by using a port-forward. You can also configure an ingress to make Platform available externally, check out our [snippets](#snippets).

```bash
kubectl port-forward deployment/console -n ${NAMESPACE} 8080:8080
```

## Configure Platform

### Fresh install

You can configure Platform by inserting it into the `config` section of the
`values.yaml` file. Find available configurations in the [configuration section](../../configuration/env-variables.md).


### Based on a Docker configuration

If you're already using a config file within Docker,you can use it by giving it to the Helm chart with the following command:

```yaml title="values.yaml"
config:
  organization:
    name: "<your_org_name>"

  admin:
    email: "<your_admin_email>"
    password: "<your_admin_password>"
    
  database:
    host: '<postgres_host>'
    port: 5432
    name: '<postgres_database>'
    username: '<postgres_username>'
    password: '<postgres_password>'
    
  # HERE you can paste the console configuration (under the config key)
```

### Configure with an enterprise license

```yaml title="values.yaml"
config:
  organization:
    name: "<your_org_name>"

  admin:
    email: "<your_admin_email>"
    password: "<your_admin_password>"
    
  database:
    host: '<postgres_host>'
    port: 5432
    name: '<postgres_database>'
    username: '<postgres_username>'
    password: '<postgres_password>'

  license: "<your_license>"

  # HERE you can paste the console configuration (under the config key)
```

## Snippets

For coding snippets, see our [README](https://github.com/conduktor/conduktor-public-charts/blob/main/charts/console/README.md#snippets).

</TabItem>
</Tabs>





## Related resources

- [Arrange a technical demo](https://www.conduktor.io/contact/demo)
- [Contact support](https://www.conduktor.io/contact/support)