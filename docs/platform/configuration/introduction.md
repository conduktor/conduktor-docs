---
sidebar_position: 1
title: Introduction
description: Conduktor can be configured using an input yaml file
---

# Introduction

Conduktor can be configured using either a configuration file `platform-config.yaml` or **environment variables**. This is used to setup your organizations environment. Configuration can be used to declare:

- Organization name
- External database (**required for production environments**)
- User authentication (Basic or SSO)
- Platform license

:::info
The **recommended** way to configure Kafka Cluster, Schema Registry and Kafka Connect is using Conduktor Platform UI.

The Manage Clusters page (`/admin/clusters`) has several advantages over the YAML configuration:

- Intuitive interface with live update capabilities
- Centralized and secured with RBAC and Audit Logs Events
- Certificate store to help with your Custom certificates needs (no more JKS files and volume mounts)

Need to configure your Kafka Clusters using GitOps processes?  
Contact our [Customer Success](https://www.conduktor.io/contact/support) or give us [feedback](https://product.conduktor.help/c/75-public-apis) on this feature.

If you absolutely need to configure your clusters using YAML, read the [Configuration Properties](/platform/configuration/env-variables/#kafka-clusters-properties) page.
:::


## Security notes

The [database](/platform/configuration/database/) as well as the configuration file described in this document may contain sensitive information.

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
  url: postgresql://user:password@host:5432/database
  # OR in a decomposed way
  # host: "host"
  # port: 5432
  # name: "database"
  # username: "user"
  # password: "password"
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
    image: conduktor/conduktor-platform:latest
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

## Environment override

Starting from Conduktor Platform `1.2.0`, input configuration fields can alternatively be provided using environment variables.

For more information, see [Environment Variables](/platform/configuration/env-variables/)

## Container user and permissions

Before platform `1.8.0`, platform was running as root user. After `1.8.0`, platform is running as a non-root user `conduktor-platform` with UID `10001` and GID `0`.

All files inside the container volume `/var/conduktor` are owned by `conduktor-platform` user.
