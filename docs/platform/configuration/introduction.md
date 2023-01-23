---
sidebar_position: 1
title: Introduction
description: Conduktor can be configured using an input yaml file
---

# Introduction
Conduktor depends on a configuration file `platform-config.yaml`. This is used to setup your organization environment. The file is used to declare:

- Organization name
- External database (optional)
- User authentication (Basic or SSO)
- Platform License

:::info
The new **recommended** way to configure Kafka Cluster, Schema Registry and Kafka Connect is using Conduktor Platform UI.  
The Manage Clusters page have several advantages over the YAML configuration:
- Intuitive interface with live update capabilities
- Centralized and secured with RBAC and Audit Logs Events
- Certificate store to help with your Custom certificates needs (no more JKS files and volume mounts)

Need to configure your Kafka Clusters using GitOps processes?   
Contact our [Customer Success](mailto:support@conduktor.io?subject=I%20Want%20GitOps)  
  
If you absolutely need to configure your clusters using YAML, read the [Configuration Properties](./env-variables.md#kafka-clusters-properties) page
:::

## Security notes

The [database](./database.md) as well as the configuration file described in this document may contain sensitive information.

- The configuration file should be protected by file system permissions.
- The database should have at-rest data encryption enabled on the data volume and have limited network connectivity.
 
## Configuration File

_Note that you may omit the database configuration if you wish to use an embedded postgres for testing purposes._

```yaml
# platform-config.yaml
organization:
  name: demo

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
  demo-users:
    - email: admin@demo.dev
      password: adminpwd
      groups:
        - ADMIN

license: '<your license key>'
```

## Binding the File

Below shows how to bind a local file to override `/opt/conduktor/default-platform-config.yaml`.

```bash
 docker run --rm \
   --mount "type=bind,source=$PWD/platform-config.yml,target=/opt/conduktor/default-platform-config.yaml" \
   -e EMBEDDED_POSTGRES="false" \
  conduktor/conduktor-platform:latest
```

Alternatively, use the `CDK_IN_CONF_FILE` environment variable to bind the file frmo another location:

```bash
 docker run --rm \
   --mount "type=bind,source=$PWD/platform-config.yml,target=/etc/platform-config.yaml" \
   -e CDK_IN_CONF_FILE="/etc/platform-config.yaml" \
   -e EMBEDDED_POSTGRES="false" \
  conduktor/conduktor-platform:latest
```

## Container user and permissions

Before platform `1.8.0`, platform was running as root user. 
After `1.8.0`, platform is running as a non-root user `conduktor-platform` with UID `10001` and GID `0`.

All files inside the container volume `/var/conduktor` are owned by `conduktor-platform` user. 

## Environment Override

Starting from Conduktor Platform `1.2.0` input configuration fields can be provided using environment variables.

For more information, see [Environment Variables](./env-variables)
