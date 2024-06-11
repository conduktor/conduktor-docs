---
sidebar_position: 3
title: SQL
description: SQL Overview
---

# SQL

:::caution
This functionality is in preview, we are welcoming all feedback.
Please review the [limitations](#limitations) chapter.
:::

## Overview

At Conduktor, our sole objective is to help organization win with Apache Kafka.

Console helps Kafka experts brilliantly navigate your Kafka resources.

SQL aims to bring more people to the data flowing into Apache Kafka.

Non-Kafka expert can now use SQL within console, or they can leverage their existing tools.

## Functionalities

### Ad-hoc Query

Query any of your indexed topics using SQL.

![Adhoc Query](images/sql.png)

### Recent Queries

Leverage your previous sql queries to go faster.

![Recent Queries](images/recent-queries.png)

### Error Management

Get an understanding of your sql typos.

![Recent Queries](images/error.png)

### Statistics

Know the impact of your queries on the system.

![Statistics](images/statistics.png)

### Data Quality

Get a view on your data quality at a glance.

![Data Quality](images/data-quality.png)


## Indexation

SQL Indexation is done alongside the [Indexer](https://docs.conduktor.io/platform/get-started/configuration/env-variables/#indexer-properties)

* Each cluster having topic indexed will trigger the creation of a corresponding database.
* Each topic selected to be indexed with have its corresponding table created in the adequate database.

### Metadata fields

While indexing your business data, we are also indexing the kafka metadata.

As such, we are adding the following fields

| Field                   | Type                                                              |
|-------------------------|-------------------------------------------------------------------|
| _timestamp_ms           | DateTime64                                                        |
| _partition              | UInt32                                                            |
| _offset                 | UInt64                                                            |
| _key                    | String                                                            |
| _checksum               | String                                                            |
| _batch_checksum         | Int64                                                             |
| _batch_timestamp_type   | Enum8('NO_TIMESTAMP_TYPE' = -1, 'CREATE_TIME', 'LOG_APPEND_TIME') |
| _batch_compression_type | Enum8('NONE' = 0, 'GZIP', 'SNAPPY', 'LZ4', 'ZSTD', 'UNKNOWN')     |
| _batch_base_offset      | UInt64                                                            |
| _batch_records          | UInt32                                                            |
| _batch_size             | UInt32                                                            |
| _batch_transactional    | Boolean                                                           |
| _batch_producer_id      | Int64                                                             |
| _batch_producer_epoch   | Int16                                                             |
| _value_schema_id        | Int32                                                             |


### Limitation

We are currently only support topics that contain `Json` and `Avro` using `TopicNameStrategy`.

As a first version, we are not handling the following elements
* schema change
* data-masking
* field level encryption

## Connectivity

A wonderful property of Clickhouse is its ability to speak multiple protocols.
This makes application and tool adopt it very smoothly: no need to add a specific driver to connect to it, just use what you currently have.

We enabled

* Native
* HTTP
* Postgres
* MySQL

![Drivers](images/drivers.png)


### HTTP

You can hit the following http endpoint of your Conduktor UI: `/clickhouse/?query=QUERY&database=DATABASE&default_format=JSON'`

```
echo "select 1" | \
  curl --user conduktor:change_me \
    'https://conduktor_url:8080/clickhouse/' \
    --data-binary @-
1
```

You can add the following parameters
* `query` to specify your sql statement instead of sending it in the body
* `database` to specify a specific database
* `default_format` can be `JSON`, `parquet`, `csv`, ...

[Clickhouse http endpoint documentation](https://clickhouse.com/docs/en/interfaces/http)


### Clickhouse

Connect your clickhouse clients on the clickhouse host with port `9000`.

```
clickhouse-client  \
  --host localhost \
  --port 9000 \
  --user conduktor \
  --password change_me \
  --format json \
  --query "select 1"
1
```

### Mysql

Connect your mysql clients on the clickhouse host with port `9004`.

```
mysql \
  --host=127.0.0.1 \
  --port=9004 \
  --user=conduktor \
  --password=change_me \
  --execute="select 1"
mysql: [Warning] Using a password on the command line interface can be insecure.
+------+
| 1    |
+------+
|    1 |
+------+

```

[Clickhouse Mysql endpoint documentation](https://clickhouse.com/docs/en/interfaces/mysql#connect-mysql-to-clickhouse)

### Postgresql

Connect your postgres clients on the clickhouse host with port `9005`.

```
PGPASSWORD=change_me \
  psql \
    --host conduktor-sql \
    --port 9005 \
    --username conduktor \
    --dbname default \
    --command "select 1"
 1
---
 1
(1 row)
```

[Clickhouse Postgres endpoint documentation](https://clickhouse.com/docs/en/interfaces/postgresql)

## Authorization

There is a scheduler that created accounts into clickhouse.

This process creates grants that replicates the security model from Conduktor within Clickhouse.

Clickhouse is meant to be a readonly database, therefore only `SELECT` is granted to users.

Only admin users have more privileges (all).

![Authorization flow](images/security.png)

### What if I use OAuth or an IDP?

Your login needs to be your email, and your password needs to be the Bearer in the form `Bearer value`

Example:
```
echo "select 1" | \
  curl --user "admin@demo.com:Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiIsImtpZCI6Imp3a18wIn0.eyJpc3MiOiJhdXRoZW50aWNhdG9yIiwic3ViIjoiYWRtaW5AZGVtby5jb20iLCJleHAiOjE3MTgzNjc2MTYsIm5iZiI6MTcxODEwODQxNiwiaWF0IjoxNzE4MTA4NDE2LCJlbWFpbCI6ImFkbWluQGRlbW8uY29tIiwiaHR0cHM6Ly9jb25kdWt0b3IuaW8vdXNlcklkIjoiOGFiYzVkNjRhYjBhZjQzOGM0ZjdmOTJmOTlkMzc2NDVlMTM0NjQzMjZhY2U0MTM1NjI4OGJhMjViMmVmOTk3YSIsImh0dHBzOi8vY29uZHVrdG9yLmlvL3BsYXRmb3JtRmluZ2VycHJpbnQiOiIyZjg0MmQ1Mi03YmY3LTQ0OTMtYTc2ZC0wMGI3MjYyODZhY2MifQ.pedHFZ0nPtwkOYtchGWJy3dxRM6F7L5k8YcFoIYFOSJG5zPjKRfNuF-ydSD3hVdRmJqjTbCeCu-brGGY4BJYKv_PoM-ltWMf2mV0dsWLSeK6iVjhCIPD0qXkWnk10Ev6J01hRbAdZvlmZ_reP0gwC1yDwjkAYICKa3t0JMoZzvkZ_o0K9CKjTNBSM7I5VK9XD2eRajZxHl43rira432UcKgYLdoHW20Qk7zOkoDajGV6sN46SxwyD_k2r8MDR-5yKvYPjEGnc3Ye68TYl4rfVvvT7Ob8GOpmzVGMCWrV9zNTfxZ-_GE7uvSUfcxueB-xmF6R2kpCl5L_0axFd1xu0Q" \
    'http://localhost:5173/clickhouse/' \
    --data-binary @- 
1
```

Same for the other drivers

```
clickhouse-client  \
  --host localhost --port 9000 \
  --user admin@demo.com \
  --password "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiIsImtpZCI6Imp3a18wIn0.eyJpc3MiOiJhdXRoZW50aWNhdG9yIiwic3ViIjoiYWRtaW5AZGVtby5jb20iLCJleHAiOjE3MTgzNjc2MTYsIm5iZiI6MTcxODEwODQxNiwiaWF0IjoxNzE4MTA4NDE2LCJlbWFpbCI6ImFkbWluQGRlbW8uY29tIiwiaHR0cHM6Ly9jb25kdWt0b3IuaW8vdXNlcklkIjoiOGFiYzVkNjRhYjBhZjQzOGM0ZjdmOTJmOTlkMzc2NDVlMTM0NjQzMjZhY2U0MTM1NjI4OGJhMjViMmVmOTk3YSIsImh0dHBzOi8vY29uZHVrdG9yLmlvL3BsYXRmb3JtRmluZ2VycHJpbnQiOiIyZjg0MmQ1Mi03YmY3LTQ0OTMtYTc2ZC0wMGI3MjYyODZhY2MifQ.pedHFZ0nPtwkOYtchGWJy3dxRM6F7L5k8YcFoIYFOSJG5zPjKRfNuF-ydSD3hVdRmJqjTbCeCu-brGGY4BJYKv_PoM-ltWMf2mV0dsWLSeK6iVjhCIPD0qXkWnk10Ev6J01hRbAdZvlmZ_reP0gwC1yDwjkAYICKa3t0JMoZzvkZ_o0K9CKjTNBSM7I5VK9XD2eRajZxHl43rira432UcKgYLdoHW20Qk7zOkoDajGV6sN46SxwyD_k2r8MDR-5yKvYPjEGnc3Ye68TYl4rfVvvT7Ob8GOpmzVGMCWrV9zNTfxZ-_GE7uvSUfcxueB-xmF6R2kpCl5L_0axFd1xu0Q" \
  --query "select 1"
1
```


## Connecting Your Tools

### Clients

- [DataGrip](https://clickhouse.com/docs/en/integrations/datagrip)
- [DBeaver](https://clickhouse.com/docs/en/integrations/dbeaver)
- [DbVisualizer](https://clickhouse.com/docs/en/integrations/dbvisualizer)
- [Jupyter notebooks](https://clickhouse.com/docs/en/integrations/jupysql)
- [qStudio](https://clickhouse.com/docs/en/integrations/qstudio)
- [TABLUM.IO](https://clickhouse.com/docs/en/integrations/tablumio)

### Business Intelligence

- [Deepnote](https://clickhouse.com/docs/en/integrations/deepnote)
- [Draxlr](https://clickhouse.com/docs/en/integrations/draxlr)
- [Explo](https://clickhouse.com/docs/en/integrations/explo)
- [Hashboard](https://clickhouse.com/docs/en/integrations/hashboard)
- [Looker](https://clickhouse.com/docs/en/integrations/looker)
- [Looker Studio](https://clickhouse.com/docs/en/integrations/lookerstudio)
- [Metabase](https://clickhouse.com/docs/en/integrations/metabase)
- [Mitzu](https://clickhouse.com/docs/en/integrations/mitzu)
- [Omni](https://clickhouse.com/docs/en/integrations/omni)
- [Power BI](https://clickhouse.com/docs/en/integrations/powerbi)
- [QuickSight](https://clickhouse.com/docs/en/integrations/quicksight)
- [Rocket BI](https://clickhouse.com/docs/en/integrations/rocketbi)
- [Superset](https://clickhouse.com/docs/en/integrations/superset)
- [Tableau](https://clickhouse.com/docs/en/integrations/tableau)
- [Tableau Online](https://clickhouse.com/docs/en/integrations/tableau-online)
- [Zing Data](https://clickhouse.com/docs/en/integrations/zingdata)

### Visualization Tools

| Tool                                                                         | Supported via                 |
|------------------------------------------------------------------------------|-------------------------------|
| [Apache Superset](https://clickhouse.com/docs/en/integrations/superset)      | ClickHouse official connector |
| [AWS QuickSight](https://clickhouse.com/docs/en/integrations/quicksight)     | MySQL interface               |
| [Deepnote](https://clickhouse.com/docs/en/integrations/deepnote)             | Native connector              |
| [Explo](https://clickhouse.com/docs/en/integrations/explo)                   | Native connector              |
| [Grafana](https://clickhouse.com/docs/en/integrations/grafana)               | ClickHouse official connector |
| [Hashboard](https://clickhouse.com/docs/en/integrations/hashboard)           | Native connector              |
| [Looker](https://clickhouse.com/docs/en/integrations/looker)                 | Native connector              |
| [Looker Studio](https://clickhouse.com/docs/en/integrations/looker-studio)   | MySQL interface               |
| [Metabase](https://clickhouse.com/docs/en/integrations/metabase)             | ClickHouse official connector |
| [Mitzu](https://clickhouse.com/docs/en/integrations/mitzu)                   | Native connector              |
| [Omni](https://clickhouse.com/docs/en/integrations/omni)                     | Native connector              |
| [Power BI Desktop](https://clickhouse.com/docs/en/integrations/powerbi)      | ClickHouse official connector |
| [Rill](https:/docs.rilldata.com/reference/olap-engines/clickhouse)           | Native connector              |
| [Rocket BI](https://clickhouse.com/docs/en/integrations/rocketbi)            | Native connector              |
| [Tableau Desktop](https://clickhouse.com/docs/en/integrations/tableau)       | ClickHouse official connector |
| [Tableau Online](https://clickhouse.com/docs/en/integrations/tableau-online) | MySQL interface               |
| [Zing Data](https://clickhouse.com/docs/en/integrations/zingdata)            | Native connector              |

## Why Clickhouse

### Performance

ClickHouse utilizes a columnar storage, which is highly efficient for analytical workloads.
Its architecture allows it to execute these queries much faster than Postgres.

_Postgres, while capable of handling analytical queries, it does not match ClickHouse's performance for large-scale,
read-intensive operations._

### Data Compression

ClickHouse employs advanced compression techniques to reduce storage space, leading to cost savings and improved query performance.

_Postgres supports data compression, but it is not as advanced or as central to its design as in ClickHouse_.

### Scalability

ClickHouse is designed to scale horizontally with ease, making it ideal for handling petabytes of data across distributed systems.

_Postgres scales well vertically and can be extended horizontally, but typically requires more effort and additional
tools to achieve the same level of scalability as ClickHouse._

### Built-in Data Replication

ClickHouse includes built-in mechanisms for data replication and distributed query processing, enhancing its ability to handle large datasets across multiple nodes.

_Postgres offers replication features, but setting up and managing replication for large-scale analytical workloads can
be more complex and less efficient compared to ClickHouse._

### External User Authentication

ClickHouse provides built-in support for external user authentication, which is leveraged to keep Conduktor API in control of user authentication.

_While Postgres supports external authentication methods, configuring and managing these integrations can be more
complex and less streamlined compared to ClickHouse._

### Deduplication

ClickHouse includes built-in deduplication features that automatically remove duplicate rows during data insertion, ensuring data integrity and reducing storage costs.

_With Postgres, deduplication must be managed manually or through additional tools and extensions, adding complexity to
data management processes._

## Why not Kafka Connect?

### Requires a Kafka Connect Cluster

In order to rely on a database sink connector of your choice, you will need to setup a Kafka Connect cluster, and to monitor it.

### Requires A Target Database

You will need to ask the creation of database to the DBA team, work out with them the target usage and target security model.

### Requires a Kafka Connector

You will need to choose the right kafka connector and monitor the distribution of the topic in your target database

### Requires a Complex Security Model

#### Authorization

All your user, idp, sso, groups, authorization setup of Conduktor must be replicated in your target database, it is often impracticable.

#### Data Masking

All your data masking rules of Conduktor must be replicated in your target database, it is often impracticable.

#### Data Encryption

All your encryption rules of Conduktor must be replicated in your target database, it is often impracticable.

### It Requires a Synchronization of Security Model

You will need to setup a complex mechanism to reproduce the Conduktor Security Model into your target database.

### Missing the metadata

Our indexing process is adding meta fields that are really helpful to track deficiencies.  

## Configuration

To enable SQL to your existing Console, please add the following property

```
CDK_SQL_CLICKHOUSE-URL: "http://conduktor:some_password@clickhouse:8123"
```
