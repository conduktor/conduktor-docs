---
sidebar_position: 5
title: Database Configuration
description: For quickstart purpose platform run with an internal embedded database (default).
---

# Database Configuration

For quickstart purpose platform run with an internal embedded database (default).

For production environmnents conduktor-platform support (since version [**1.1.2**](https://github.com/conduktor/conduktor-platform/blob/main/CHANGELOG.md#112-2022-10-20)) external database configuration.

### Database requirements

- PostgreSQL 13+
- Provided connection role should have grant `ALL PRIVILEGES` on configured database. Platform should be able to create/update/delete schema and tables on database.

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

There is several possibility to configure external database:

1. From a single connection url

   - With `CDK_DATABASE_URL` environment variable.
   - With `database.url` configuration field.
     In either cases, this connection url is using a standard PostgreSQL url in the format `[jdbc:]postgresql://[user[:password]@]netloc[:port][/dbname][?param1=value1&...]`

2. From decomposed configuration fields
   - With `CDK_DATABASE_*` env vars. (see [environment variables list](#configuration-using-environment-variables))
   - With `database.*` on configuration file.

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

> **Note 1** : If all connection url **AND** decomposed configuration fields are provided, the decomposed configuration fields take priority.

> **Note 2** : If an invalid connection url or some mandatory configuration fields (`host`, `username` and `name`) are missing, conduktor-platform will crash with meaningful error message.

> **Note 3** : Before **1.2.0** `EMBEDDED_POSTGRES=false` was mandatory to enable external postgresql configuration. If no external database is configured either from url or decompose fields, platform will start using embedded database.
