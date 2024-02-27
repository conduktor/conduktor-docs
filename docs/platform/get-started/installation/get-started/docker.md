---
sidebar_position: 1
title: Docker
description: Get started with the latest Conduktor Console Docker image in just a few minutes.
---

# Docker Quick Start

:::info
Pre-requisite: [Docker Compose](https://docs.docker.com/compose/install)
:::

Get started with the latest Conduktor Console Docker image. The installation and configuration process takes only a few minutes.

- [**Simple Setup**](#simple-setup): Start Conduktor with onboarding and configure your environment inside the Conduktor interface. Great for **experimenting** with how Conduktor can help you quickly.
   - [Launch Conduktor with an embedded Kafka (Redpanda)](#launch-conduktor-with-an-embedded-kafka-redpanda)
   - [Launch Conduktor and connect it to your existing Kafka](#or-launch-conduktor-and-connect-it-to-your-existing-kafka)

- [**Advanced Configuration**](#advanced-setup): Configure your environment using a configuration file or using environment variables. This is essential for **production environments**.
   - [Using a configuration file](#configuration-using-a-configuration-file)
   - [Using environment variables](#configuration-using-environment-variables)

## Simple Setup

When launching Conduktor Console for the first time, you will presented with onboarding to help configure your environment.

### Step 1: Launch Conduktor

Run one of the below commands to launch Conduktor.

#### Launch Conduktor with an embedded Kafka (Redpanda)

This option pre-configures Conduktor to connect to the embedded Redpanda and Schema Registry.

```bash
curl -L https://releases.conduktor.io/quick-start -o docker-compose.yml && docker compose up -d --wait && echo "Conduktor started on http://localhost:8080"
```

#### OR, Launch Conduktor and connect it to your existing Kafka

Add your own cluster configuration from within the Conduktor UI.

```bash
curl -L https://releases.conduktor.io/console -o docker-compose.yml && docker compose up -d --wait && echo "Conduktor started on http://localhost:8080"
```

### Step 2: Complete Onboarding

After a few seconds, the Conduktor onboarding wizard will be available at **[http://localhost:8080](http://localhost:8080)**.

![Onboarding](assets/onboarding_console.png)

### Step 3: Configure your existing Kafka cluster

:::tip
Use our [interactive guide](https://conduktor.navattic.com/cluster-configuration) to learn how to connect your Kafka cluster, Schema Registry and Kafka Connect
:::

Conduktor works with all Kafka providers such as Confluent, Aiven, MSK and Redpanda. To see the full value of Conduktor, we recommend configuring it against your own Kafka data. 

Once you complete the onboarding wizard, go to [http://localhost:8080/admin/clusters](http://localhost:8080/settings/clusters) and **add** a new cluster configuration.

From within the cluster configuration screen, add the:

- Bootstrap server
- Authentication details
- Additional properties

Configuring an **SSL/TLS** cluster? Use the [Conduktor Certificate Store](../../configuration/ssl-tls-configuration.md#using-the-conduktor-certificate-store).

![Admin Cluster Config](/img/get-started/admin-cluster-config.png)

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

## Advanced Setup

Conduktor can also be configured using a [configuration file](#configuration-using-a-configuration-file) `platform-config.yaml`, or through [environment variables](#configuration-using-environment-variables). This is used to set up your organization's environment.

:::note
If you use both methods, environment variables will take precedence.
:::

Configuration can be used to declare:
- Organization name
- External database (**required for production environments**)
- User authentication (Basic or SSO)
- Platform license

For production deployments, it's critical that you review the [production requirements](../hardware.md#production-requirements).

### Configuration using a configuration file

#### Step 1: Create a configuration file

The below example shows how to configure Conduktor with the minimum configuration:
- The name of the organization
- An external database
- A local administrator

If you want, you can add more snippets, like [SSO](/platform/category/configure-sso/) or [license key](../../license-management/#into-the-configuration-file).
You can get the list of all the properties supported [here](../../../configuration/env-variables/).

```yaml title="console-config.yaml"
organization:
  name: "conduktor"

database:
  host: 'postgresql'
  port: 5432
  name: 'conduktor-console'
  username: 'conduktor'
  password: 'change_me'
  connection_timeout: 30 # in seconds

admin:
  email: "<name@your_company.io>"
  password: "admin"

auth:
  local-users:
    - email: user@conduktor.io
      password: user

monitoring:
  cortex-url: http://conduktor-monitoring:9009/
  alert-manager-url: http://conduktor-monitoring:9010/
  callback-url: http://conduktor-console:8080/monitoring/api/
  notifications-callback-url: http://localhost:8080

# license: "" license key if Enterprise
```

#### Step 2: Bind the file 

The below docker-compose indicates how to bind your `console-config.yaml` file.

Note that the environment variable `CDK_IN_CONF_FILE` is used to indicate that a configuration file is being used, and the location to find it. The file is also mounted to be used from within the container.

```yaml title="docker-compose.yaml"
version: '3.8'

services:  
  postgresql:
    image: postgres:14
    hostname: postgresql
    environment:
      POSTGRES_DB: "conduktor-console"
      POSTGRES_USER: "conduktor"
      POSTGRES_PASSWORD: "change_me"

  conduktor-console:
    image: conduktor/conduktor-console:1.21.0
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
    image: conduktor/conduktor-console-cortex:1.21.0
    environment:
      CDK_CONSOLE-URL: "http://conduktor-console:8080"
```

#### Step 3: Access Conduktor

You just have to run the following command to launch the PostgreSQL instance and Conduktor Console:
```sh
docker compose up
```

After a few minutes, **Conduktor will be available at [http://localhost:8080](http://localhost:8080)**

You can use the admin email and password to log in.

If using [SSO](/platform/category/user-authentication/), you will see an option to log in via the relevant identity provider.

![Sign In Azure](/img/get-started/azure-start.png)

#### Step 4: Configure your first cluster

See [configuring your first cluster](#step-3-configure-your-existing-kafka-cluster)

### Configuration using environment variables

All configuration properties can be provided using either [environment variables](../../../configuration/env-variables/) or the config file. If you use both, environment variables will take precedence.

If you need some help converting this file into environment variables, feel free to use our [YAML to ENV converter](https://conduktor.github.io/yaml-to-env/).

Below is an example of the same deployment that uses environment variables for the Conduktor Console configuration.

```yaml title="docker-compose.yaml"
version: '3.8'

services:  
  postgresql:
    image: postgres:14
    hostname: postgresql
    environment:
      POSTGRES_DB: "conduktor-console"
      POSTGRES_USER: "conduktor"
      POSTGRES_PASSWORD: "change_me"

  conduktor-console:
    image: conduktor/conduktor-console:1.21.0
    depends_on:
      - postgresql
    ports:
      - "8080:8080"
    environment:
      # CDK_LICENSE: "" license key if Enterprise
      CDK_DATABASE_URL: "postgresql://conduktor:change_me@postgresql:5432/conduktor-console"
      CDK_ORGANIZATION_NAME: "<Your Company>"
      CDK_ADMIN_EMAIL: "<name@your_company.io>"
      CDK_ADMIN_PASSWORD: "admin"
      CDK_MONITORING_CORTEX-URL: http://conduktor-monitoring:9009/
      CDK_MONITORING_ALERT-MANAGER-URL: http://conduktor-monitoring:9010/
      CDK_MONITORING_CALLBACK-URL: http://conduktor-console:8080/monitoring/api/
      CDK_MONITORING_NOTIFICATIONS-CALLBACK-URL: http://localhost:8080

  conduktor-monitoring:
    image: conduktor/conduktor-console-cortex:1.21.0
    environment:
      CDK_CONSOLE-URL: "http://conduktor-console:8080"

volumes:
  pg_data: {}
  conduktor_data: {}
```
