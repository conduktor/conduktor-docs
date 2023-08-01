---
sidebar_position: 2
title: Docker
description: Get started with the latest Conduktor Platform Docker image in just a few minutes.
---

# Docker Quick Start

Get started with the latest Conduktor Docker image. The installation and configuration process takes only a few minutes.

There are two ways to configure Conduktor via Docker:

- [**Simple Setup**](#simple-setup): Start Conduktor with onboarding and configure your environment inside the Conduktor interface. Great for **experimenting** with how Conduktor can help you quickly.
   - [Launch Conduktor with an embedded Kafka (Redpanda)](#launch-conduktor-with-an-embedded-kafka-redpanda)
   - [Launch Conduktor and connect it to your existing Kafka](#or-launch-conduktor-and-connect-it-to-your-existing-kafka)

- [**Advanced Configuration**](#advanced-setup): Use a configuration file or environment variables to declare an external database and SSO. This is the recommended option for **production environments**.

# Simple Setup

When launching Conduktor for the first time, you will presented with onboarding to help configure your environment.

:::info
Pre-requisite: [Docker Compose](https://docs.docker.com/compose/install)
:::

## Step 1: Launch Conduktor

Run one of the below commands to launch Conduktor.

### Launch Conduktor with an embedded Kafka (Redpanda) 

This option pre-configures Conduktor to connect to the embedded Redpanda and Schema Registry.

```bash
curl -L https://releases.conduktor.io/quick-start -o docker-compose.yml && docker compose up -d --wait && echo "Conduktor started on http://localhost:8080"
```

### OR, Launch Conduktor and connect it to your existing Kafka

Add your own cluster configuration from within the Conduktor UI.

```bash
curl -L https://releases.conduktor.io/console -o docker-compose.yml && docker compose up -d --wait && echo "Conduktor started on http://localhost:8080"
```

### Step 2: Complete Onboarding

After a few seconds, the Conduktor onboarding wizard will be available at **[http://localhost:8080](http://localhost:8080)**.

![Onboarding](./assets/onboarding-console.png)

### Step 3: Configure your existing Kafka cluster

Conduktor works with all Kafka providers such as Confluent, Aiven, MSK and Redpanda. To see the full value of Conduktor, we recommend configuring it against your own Kafka data. 

Once you complete the onboarding wizard, go to [http://localhost:8080/admin/clusters](http://localhost:8080/admin/clusters) and **add** a new cluster configuration.

From within the cluster configuration screen, add the:

- Bootstrap server
- Authentication details
- Additional properties

Configuring an **SSL/TLS** cluster? Use the [Conduktor Certificate Store](../../configuration/ssl-tls-configuration.md#using-the-conduktor-certificate-store).

![Admin Cluster Config](/img/get-started/admin-cluster-config.png)

#### How to connect to Kafka running on localhost:9092?

Add the below to your Kafka **server.properties** file

```
listeners=EXTERNAL://0.0.0.0:19092,PLAINTEXT://0.0.0.0:9092
listener.security.protocol.map=PLAINTEXT:PLAINTEXT,EXTERNAL:PLAINTEXT
advertised.listeners=PLAINTEXT://127.0.0.1:9092,EXTERNAL://host.docker.internal:19092
```

If running Kafka in KRaft mode, add the below to your Kafka **config/kraft/server.properties** file

```
listeners=EXTERNAL://0.0.0.0:19092,PLAINTEXT://0.0.0.0:9092,CONTROLLER://:9093
listener.security.protocol.map=PLAINTEXT:PLAINTEXT,EXTERNAL:PLAINTEXT,CONTROLLER:PLAINTEXT
advertised.listeners=PLAINTEXT://127.0.0.1:9092,EXTERNAL://host.docker.internal:19092
inter.broker.listener.name=PLAINTEXT
```

From within the Conduktor interface, connect using the bootstrap server: `host.docker.internal:19092`

## Advanced Setup

Conduktor can also be configured using a configuration file `platform-config.yaml`, or through **environment variables**. This is used to setup your organizations environment. Configuration can be used to declare:

- Organization name
- External database (**required for production environments**)
- User authentication (Basic or SSO)
- Platform license

For production deployments, it's critical that you review the [production requirements](../hardware.md#production-requirements).

### Step 1: Create a Configuration File

The below example shows how to configure Conduktor with an external database, SSO and an optional license key (for Enterprise customers).

All configuration properties can also be parsed as [Environment Variables](/platform/configuration/env-variables/) when starting Conduktor.
If you need some help converting this file into environment variables, feel free to use our [YAML to ENV converter](https://conduktor.github.io/yaml-to-env/).

For more examples, see:

- [Configuration Properties and Environment Variables](/platform/configuration/env-variables/)
- [Configuring SSO](/platform/category/user-authentication/)

```yaml title="platform-config.yaml"
organization:
  name: demo

admin:
  email: admin@company.io
  password: admin

auth:
  local-users:
    - email: user@conduktor.io
      password: user

database:
  host: 'host'
  port: 5432
  name: 'database'
  username: 'user'
  password: 'password'
  connection_timeout: 30 # in seconds

sso:
  oauth2:
    - name: 'azure'
      default: true
      client-id: ${AZURE_APPLICATION_ID}
      client-secret: ${AZURE_CLIENT_SECRET}
      openid:
        issuer: https://login.microsoftonline.com/{tenantid}/v2.0

license: '<your license key>'
```

### Step 2: Bind file 

The below docker-compose indicates how to bind your `platform-config.yaml` file.

Note that the environment variable `CDK_IN_CONF_FILE` is used to indicate that a configuration file is being used, and the location to find it.

```yaml title="docker-compose.yaml"
version: '3.8'

services:  
  postgresql:
    image: postgres:14
    hostname: postgresql
    volumes:
      - pg_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: "conduktor-platform"
      POSTGRES_USER: "conduktor"
      POSTGRES_PASSWORD: "change_me"
      POSTGRES_HOST_AUTH_METHOD: "scram-sha-256"

  conduktor-platform:
    image: conduktor/conduktor-platform:1.17.0
    depends_on:
      - postgresql
    ports:
      - "8080:8080"
    volumes:
      - conduktor_data:/var/conduktor
      - type: bind
        source: "./platform-config.yaml"
        target: /opt/conduktor/platform-config.yaml
        read_only: true
    environment:
      CDK_IN_CONF_FILE: /opt/conduktor/platform-config.yaml
    healthcheck:
      test: curl -f http://localhost:8080/platform/api/modules/health/live || exit 1
      interval: 10s
      start_period: 10s
      timeout: 5s
      retries: 3

volumes:
  pg_data: {}
  conduktor_data: {}
```

For all configuration properties and environment variables see [Configuration Properties and Environment Variables](/platform/configuration/env-variables/).

### Step 3: Access Conduktor

After a few minutes, **Conduktor will be available at [http://localhost:8080](http://localhost:8080)**

If using [SSO](/platform/category/user-authentication/), you will see an option to login via the relevant identity provider.

![Sign In Azure](/img/get-started/azure-start.png)

### Step 4: Configure your first cluster

See [configuring your first cluster](#step-3-configure-your-first-kafka-cluster)
