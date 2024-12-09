---
sidebar_position: 5
title: Database Configuration
description: Conduktor require a postgres database to run.
---

# Database configuration

Conduktor **requires** a postgres database to store its state.

:::info
Until version 1.18, Conduktor supported an embedded database. This is deprecated from 1.18 onwards to ensure your Console deployment is production ready. Please contact [support](https://support.conduktor.io/) if you are having difficulty migrating.
:::

- [Database configuration](#database-configuration)
    - [Database requirements](#database-requirements)
    - [Database configuration properties](#database-configuration-properties)
      - [URL format](#url-format)
    - [SSL support](#ssl-support)
    - [Use AWS RDS / Aurora as database](#use-aws-rds--aurora-as-database)
    - [Setup](#setup)
    - [Multi-host configuration](#multi-host-configuration)


### Database requirements

- PostgreSQL 13+
- Provided connection role should have grant `ALL PRIVILEGES` on the configured database. Console should be able to create/update/delete schemas and tables on the database.
- For your Postgres deployment please use at least 1-2 vCPU, 1 GB of Ram, and 10 GB of disk.

### Database configuration properties

- `database` : is a key/value configuration consisting of:
   - `database.url` : database connection url in the format `[jdbc:]postgresql://[user[:password]@][[netloc][:port],...][/dbname][?param1=value1&...]`
   - `database.hosts[].host` : Postgresql server hosts name
   - `database.hosts[].port` : Postgresql server ports
   - `database.host` : Postgresql server host name (Deprecated. Use `database.hosts` instead)
   - `database.port` : Postgresql server port (Deprecated. Use `database.hosts` instead)
   - `database.name` : Database name
   - `database.username` : Database login role
   - `database.password` : Database login password
   - `database.connection_timeout` : Connection timeout option in seconds

#### URL format

Console supports both standard [PostgreSQL](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING-URIS) url and [JDBC PostgreSQL](https://jdbc.postgresql.org/documentation/use/#connecting-to-the-database) url formats.

Connection username and password can be provided in the URL as basic authentication or as parameters.

```yaml
database:
  url: 'jdbc:postgresql://user:password@host:5432/database' # or 'postgresql://host:5432/database?user=user&password=password'
```

### SSL support

By default, Conduktor will try to connect to the database using SSL mode `prefer`. 
We plan to make this configurable in the future along with database certificate.


### Use AWS RDS / Aurora as database

If you want to use AWS RDS or AWS Aurora as a database with Conduktor Console, please take into consideration the following:

Console will not work with all Postgresql engines within RDS, it will only work with engine versions 14.8+ / 15.3+, other versions are not fully supported.


### Setup

There are several options available when configuring an external database:

1. From a single connection url

   - With the `CDK_DATABASE_URL` environment variable.
   - With the `database.url` configuration field.
     In either case, this connection url is using a standard PostgreSQL url in the format `[jdbc:]postgresql://[user[:password]@][[netloc][:port],...][/dbname][?param1=value1&...]`

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
 docker run --rm \
  -p "8080:8080" \
  -e CDK_DATABASE_URL="postgresql://user:password@host:5432/database" \
  -e LICENSE_KEY="<your-license>" \
  conduktor/conduktor-console:latest
```

> **Note 1** : If all connection urls **AND** decomposed configuration fields are provided, the decomposed configuration fields take priority.

> **Note 2** : If an invalid connection url or other mandatory configuration field (`host`, `username` and `name`) is missing, Conduktor will fail gracefully with a meaningful error message.

> **Note 3** : Before **1.2.0** `EMBEDDED_POSTGRES=false` was mandatory to enable external postgresql configuration.

### Multi-host configuration

If you have a multi-host setup, you can configure the database connection with a list of hosts. 
Conduktor uses a PostgreSQL JDBC driver to connect to the database that supports [multiple hosts in the connection url](https://jdbc.postgresql.org/documentation/use/#connection-fail-over).

To configure a multi-host setup, you can use the `database.url` configuration field with a list of hosts separated by commas.
```yaml
database:
  url: 'jdbc:postgresql://user:password@host1:5432,host2:5432/database'
```

or with decomposed configuration fields
```yaml
database:
  hosts: 
   - host: 'host1'
     port: 5432
   - host: 'host2' 
     port: 5432
  name: 'database'
  username: 'user'
  password: 'password'
  connection_timeout: 30 # in seconds
```

You can also provide [JDBC connection parameter](https://jdbc.postgresql.org/documentation/use/#connection-parameters) `targetServerType` to specify the target server type for the connection.
```yaml
database:
  url: 'jdbc:postgresql://user:password@host1:5432,host2:5432/database?targetServerType=primary'
```
