---
sidebar_position: 5
title: Database Configuration
description: Conduktor require a postgres database to run.
---

# Database Configuration

Conduktor require a postgres database to store it's state.

The embedded database have been deprecated and removed in **1.17.0**.

### Database requirements

- PostgreSQL 14+
- Provided connection role should have grant `ALL PRIVILEGES` on the configured database. Platform should be able to create/update/delete schemas and tables on the database.

### Database Configuration Properties

- `database` : is a key/value configuration consisting of:
- `database.url` : database connection url in the format `[jdbc:]postgresql://[user[:password]@]netloc[:port][/dbname][?param1=value1&...]`
- `database.host` : Postgresql server host name
- `database.port` : Postgresql server port
- `database.name` : Database name
- `database.username` : Database login role
- `database.password` : Database login password
- `database.connection_timeout` : Connection timeout option in seconds

#### SSL support

By default, Conduktor Platform will try to connect to the database using SSL mode `prefer`. 
We plan to make this configurable in the future along with database certificate.

### Setup

There are several options available when configuring an external database:

1. From a single connection url

   - With the `CDK_DATABASE_URL` environment variable.
   - With the `database.url` configuration field.
     In either case, this connection url is using a standard PostgreSQL url in the format `[jdbc:]postgresql://[user[:password]@]netloc[:port][/dbname][?param1=value1&...]`

2. From decomposed configuration fields
   - With the `CDK_DATABASE_*` env vars. (see the [environment variables list](#configuration-using-environment-variables))
   - With the `database.*` on configuration file.

```yaml
database:
  host: 'host'
  port: 5432
  name: 'database'
  username: 'user'
  password: 'password'
  connection_timeout: 30 # in seconds
```

Example :

```shell
docker run \
  -e CDK_DATABASE_URL="postgresql://user:password@host:5432/database" \
  conduktor/conduktor-platform:latest
```

> **Note 1** : If all connection urls **AND** decomposed configuration fields are provided, the decomposed configuration fields take priority.

> **Note 2** : If an invalid connection url or some mandatory configuration fields (`host`, `username` and `name`) are missing, conduktor-platform will crash with meaningful error message.

> **Note 3** : Before **1.2.0** `EMBEDDED_POSTGRES=false` was mandatory to enable external postgresql configuration. If no external database is configured either from url or decompose fields, platform will start using embedded database.

