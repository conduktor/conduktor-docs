---
sidebar_position: 2
title: Docker Quick Start
description: Get started with the latest Conduktor Platform Docker image in just a few minutes.
---

# Docker Quick Start

Get started with the latest Conduktor Platform Docker image in just a few minutes.

Conduktor depends on a configuration file `platform-config.yaml`. This is used to setup your oganizations environment. The file is used to declare:

- Organization name
- Kafka clusters
- External database (optional)
- User authentication (Basic or SSO)

## Create a Configuration File

The below example shows how to configure Conduktor with a `SASL_SSL` Kafka cluster and Schema Registry.

Update the **bootstrap server**, **cluster configuration properties**, **organization name** and **user credentials**.

For more examples, see [YAML snippets](../../configuration/configuration-snippets.md).

```yaml
organization:
  name: default

clusters:
  - id: cluster-id
    name: My Kafka Cluster
    color: '#E70000'
    ignoreUntrustedCertificate: false
    bootstrapServers: 'your-bootstrap-server:9092'
    properties: |
      security.protocol=SASL_SSL
      sasl.mechanism=PLAIN
      sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule   required username='username'   password='password';
    schemaRegistry:
      id: confluent-sr
      url: 'http://your-schema-registry:8081'
      ignoreUntrustedCertificate: false
      security:
        username: 'username'
        password: 'password'
    labels: {}

auth:
  demo-users:
    - email: admin@conduktor.io
      password: admin
      groups:
        - ADMIN
```

## Launch Conduktor

Run the below command in the directory containing your `platform-config.yaml` file.

If you are a **Conduktor Enterprise** customer, you can start the platform with the `LICENSE_KEY` environment variable.

### MacOS / Linux

```bash
docker run --rm \
  -p "8080:8080" \
  -e LICENSE_KEY="<your-license>" \
  --mount "type=bind,source=$PWD/platform-config.yaml,target=/opt/conduktor/default-platform-config.yaml" \
  --mount "source=conduktor_data,target=/var/conduktor" \
conduktor/conduktor-platform:latest
```

### Windows

```bash
docker run --rm `
  -p "8080:8080" `
  -e LICENSE_KEY="<your-license>" `
  --mount "type=bind,source=$pwd/platform-config.yaml,target=/opt/conduktor/default-platform-config.yaml" `
  --mount "source=conduktor_data,target=/var/conduktor" `
conduktor/conduktor-platform:latest
```

## Access Conduktor

After a few minutes, **Conduktor will be available at [http://localhost:8080](http://localhost:8080)**

Use the credentials **specified in the YAML** file to login. If you did not change the default credentials, you should use:

```yaml
User: admin@conduktor.io
Password: admin
```
