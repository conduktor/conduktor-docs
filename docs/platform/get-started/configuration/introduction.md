---
sidebar_position: 1
title: Introduction
description: Conduktor can be configured using an input YAML file
---

# Introduction

Conduktor can be configured using either a configuration file `platform-config.yaml` or **environment variables**. This is used to set up your organization's environment. Configuration can be used to declare:

- Organization name
- External database (**required**)
- User authentication (Basic or SSO)
- Console license

:::info
The **recommended** way to configure Kafka Cluster, Schema Registry and Kafka Connect is using Conduktor Console UI.

The Manage Clusters page (`/settings/clusters`) has several advantages over the YAML configuration:

- Intuitive interface with live update capabilities
- Centralized and secured with RBAC and Audit Logs Events
- Certificate store to help with your Custom certificates needs (no more JKS files and volume mounts)

Need to configure your Kafka Clusters using GitOps processes?  
Contact our [Customer Success](https://www.conduktor.io/contact/support) or give us [feedback](https://conduktor.io/roadmap) on this feature.

If you absolutely need to configure your clusters using YAML, read the [Configuration Properties](/platform/get-started/configuration/env-variables/#kafka-clusters-properties) page.
:::


## Security notes

The [database](/platform/get-started/configuration/database/) as well as the configuration file described in this document may contain sensitive information.

- The configuration file should be protected by file system permissions.
- The database should have at-rest data encryption enabled on the data volume and have limited network connectivity.

## Configuration file

```yaml title="platform-config.yaml"
organization:
  name: demo

admin:
  email: admin@company.io
  password: admin

database:
  url: postgresql://conduktor:change_me@host:5432/conduktor
  # OR in a decomposed way
  # host: "host"
  # port: 5432
  # name: "conduktor"
  # username: "conduktor"
  # password: "change_me"
  # connection_timeout: 30 # in seconds

auth:
  local-users:
    - email: user@conduktor.io
      password: user

license: '<your license key>'
```

## Bind file

The below docker-compose indicates how to bind your `platform-config.yaml` file. Alternatively, you can use environment variables.

Note that the environment variable `CDK_IN_CONF_FILE` is used to indicate that a configuration file is being used, and the location to find it.

```yaml title="docker-compose.yaml"
services:  
  postgresql:
    image: postgres:14
    hostname: postgresql
    volumes:
      - pg_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: "conduktor"
      POSTGRES_USER: "conduktor"
      POSTGRES_PASSWORD: "change_me"
      POSTGRES_HOST_AUTH_METHOD: "scram-sha-256"

  conduktor-console:
    image: conduktor/conduktor-console
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

For all configuration properties and environment variables see [Configuration Properties and Environment Variables](../env-variables/).

## Environment override

Input configuration fields can also be provided using environment variables.

For more information, see [Environment Variables](../env-variables/).

Below is an example of docker-compose that uses environment variables for configuration.

```yaml title="docker-compose.yaml
services:  
  postgresql:
    image: postgres:14
    hostname: postgresql
    volumes:
      - pg_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: "conduktor"
      POSTGRES_USER: "conduktor"
      POSTGRES_PASSWORD: "change_me"
      POSTGRES_HOST_AUTH_METHOD: "scram-sha-256"

  conduktor-console:
    image: conduktor/conduktor-console
    depends_on:
      - postgresql
    ports:
      - "8080:8080"
    volumes:
      - conduktor_data:/var/conduktor
    healthcheck:
      test: curl -f http://localhost:8080/platform/api/modules/health/live || exit 1
      interval: 10s
      start_period: 10s
      timeout: 5s
      retries: 3
    environment:
      CDK_DATABASE_URL: "postgresql://conduktor:change_me@postgresql:5432/conduktor"
      CDK_LICENSE: "<your license key>"
      CDK_ORGANIZATION_NAME: "demo"
      CDK_ADMIN_EMAIL: "admin@company.io"
      CDK_ADMIN_PASSWORD: "admin"

volumes:
  pg_data: {}
  conduktor_data: {}
```

## Container user and permissions

Console is running as a non-root user `conduktor-platform` with UID `10001` and GID `0`.

All files inside the container volume `/var/conduktor` are owned by `conduktor-platform` user.
