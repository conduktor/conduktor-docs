---
sidebar_position: 1
title: Introduction
description: Conduktor can be configured using an input yaml file
---

# Introduction

## Security notes

The [database](./database.md) as well as the configuration file described in this document may contain sensitive information (usernames, passwords, and SSL truststore/keystores).

- The configuration file and SSL files should be protected by file system permissions.
- The database should have at-rest data encryption enabled on the data volume and have limited network connectivity.
 
## Configuration File

Conduktor can be configured using an input yaml file that provides configuration for:

- organization name
- external database
- kafka clusters
- sso (ldap/oauth2)
- license

For example: `platform-config.yaml`

_Note that you may omit the database configuration if you wish to use an embedded postgres for testing purposes._

```yaml
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

clusters:
  - id: local
    name: 'My Local Kafka Cluster'
    color: '#0013E7'
    ignoreUntrustedCertificate: false
    bootstrapServers: 'some-host:9092'

auth:
  demo-users:
    - email: admin@demo.dev
      password: adminpwd
      groups:
        - ADMIN

license: '<you license key>'
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
