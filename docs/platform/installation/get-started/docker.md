---
sidebar_position: 2
title: Docker
description: Get started with the latest Conduktor Platform Docker image in just a few minutes.
---

# Docker Quick Start

Get started with the latest Conduktor Platform Docker image. The installation and configuration process takes under 30 minutes.

There are two ways to configure Conduktor via Docker:
 - [**Simple Setup**](#simple-setup): Use the embedded database and configure your clusters and certificates inside the Conduktor interface. Great for **demo purposes** and experimenting with the product.

 - [**Advanced Configuration**](#advanced-setup): Use a configuration file to declare an external database and SSO. This is the recommended option for **production environments**.  

## Simple Setup

Launch Conduktor and configure your Kafka cluster, Schema Registry and Kafka Connect from within the Conduktor interface.

### Step 1: Launch Conduktor

Run the below command to launch Conduktor.

If you are a **Conduktor Enterprise** customer, you should start the platform with the `LICENSE_KEY` environment variable. Otherwise, you can remove this line from the command.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="MacOS" label="MacOS">

```bash
docker run --rm --pull always \
  -p 8080:8080 \
  -e LICENSE_KEY="<your-license>" \
  --mount "source=conduktor_data,target=/var/conduktor" \
conduktor/conduktor-platform:latest
```

</TabItem>
<TabItem value="Linux" label="Linux">

```bash
docker run --rm --pull always \
  -p 8080:8080 \
  -e LICENSE_KEY="<your-license>" \
  --add-host=host.docker.internal:host-gateway \
  --mount "source=conduktor_data,target=/var/conduktor" \
conduktor/conduktor-platform:latest
```

</TabItem>
<TabItem value="Windows" label="Windows">

```bash
docker run --rm --pull always `
  -p 8080:8080 `
  -e LICENSE_KEY="<your-license>" `
  --mount "source=conduktor_data,target=/var/conduktor" `
conduktor/conduktor-platform:latest
```

</TabItem>
</Tabs>

### Step 2: Access Conduktor using the default credentials

After a few minutes, **Conduktor will be available at [http://localhost:8080](http://localhost:8080)**

Use the default credentials below to login:

```yaml
User: admin@conduktor.io
Password: admin
```

### Step 3: Configure your first cluster

Once you have authenticated using the default credentials, you should configure your first cluster.

Go to [http://localhost:8080/admin/clusters](http://localhost:8080/admin/clusters) and either **create** a new cluster configuration, or select **'My Local Kafka Cluster'** to edit the configuration.

From within the cluster configuration screen, add the:
 - Bootstrap server
 - Authentication details
 - Additional properties

Configuring an **SSL/TLS** cluster? Use the [Conduktor Certificate Store](../../configuration/ssl-tls-configuration.md#using-the-conduktor-certificate-store)

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

From within the Conduktor interface, connect using the bootstrap server:

```host.docker.internal:19092```

## Advanced Setup

Conduktor can be configured using a configuration file `platform-config.yaml`. This is used to setup your organizations environment. The file can be used to declare:

- Organization name
- External database
- SSO

### Step 1: Create a Configuration File

The below example shows how to configure Conduktor with an external database, SSO and an optional license key (for Enterprise customers).

All configuration properties can also be parsed as [Environment Variables](../../configuration/env-variables) when starting Conduktor.

For more examples, see:
 - [Configuration Properties and Environment Variables](../../configuration/env-variables)
 - [Configuring SSO](../../configuration/user-authentication)

```yaml
organization:
  name: demo

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

license: '<you license key>'
```

### Step 2: Launch Conduktor

Run the below command in the directory containing your `platform-config.yaml` file.

If you are a **Conduktor Enterprise** customer, you can start the platform with the `LICENSE_KEY` environment variable.

<Tabs>
<TabItem value="MacOS" label="MacOS">

```bash
docker run --rm \
  -p "8080:8080" \
  -e LICENSE_KEY="<your-license>" \
  --mount "type=bind,source=$PWD/platform-config.yaml,target=/opt/conduktor/default-platform-config.yaml" \
  --mount "source=conduktor_data,target=/var/conduktor" \
conduktor/conduktor-platform:latest
```

</TabItem>
<TabItem value="Linux" label="Linux">

```bash
docker run --rm \
  -p "8080:8080" \
  -e LICENSE_KEY="<your-license>" \
  --add-host=host.docker.internal:host-gateway \
  --mount "type=bind,source=$PWD/platform-config.yaml,target=/opt/conduktor/default-platform-config.yaml" \
  --mount "source=conduktor_data,target=/var/conduktor" \
conduktor/conduktor-platform:latest
```

</TabItem>
<TabItem value="Windows" label="Windows">

```bash
docker run --rm `
  -p "8080:8080" `
  -e LICENSE_KEY="<your-license>" `
  --mount "type=bind,source=$pwd/platform-config.yaml,target=/opt/conduktor/default-platform-config.yaml" `
  --mount "source=conduktor_data,target=/var/conduktor" `
conduktor/conduktor-platform:latest
```

</TabItem>
</Tabs>


### Step 3: Access Conduktor

After a few minutes, **Conduktor will be available at [http://localhost:8080](http://localhost:8080)**

If using [SSO](../../configuration/user-authentication), you will see an option to login via the relevant identity provider.

![Sign In Azure](/img/get-started/azure-start.png)


### Step 4: Configure your first cluster

See [configuring your first cluster](#step-3-configure-your-first-cluster)
