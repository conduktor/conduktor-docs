---
sidebar_position: 4
title: SQL Quickstart
description: Getting Started with Conduktor SQL
---

## Getting Started with SQL

Give autonomy to users to index data from Kafka topics in SQL database. Then the users can query the data from the console API.

## Console configuration

By default, the SQL feature is disabled. The user need to add an extra configuration about the database where the data will be stored.
This can be done by settings the following ENV var:

```
CDK_KAFKASQL_DATABASE_URL
CDK_KAFKASQL_DATABASE_HOST
CDK_KAFKASQL_DATABASE_PORT
CDK_KAFKASQL_DATABASE_NAME
CDK_KAFKASQL_DATABASE_USERNAME
CDK_KAFKASQL_DATABASE_PASSWORD
CDK_KAFKASQL_DATABASE_CONNECTIONTIMEOUT
```

> **_IMPORTANT:_**  The storage database should absolutely be different from the one used by console backend.

## Deploy indexed topic configuration

To create a new indexed topic, you can use the conduktor CLI:

```yaml
apiVersion: "v1"
kind: "IndexedTopic"
metadata:
  name: "confluent-audit-log-events"
  cluster: "shadow-julien"
spec:
  retentionTimeInSecond: "86400" # 1 day of retention
```

```bash
❯ CDK_BASE_URL=https://console-enterprise.teleport-01.prd.tooling.cdkt.dev/  conduktor apply -f test/
IndexedTopic/confluent-audit-log-events: Created
```

Then...its done, the console backend will scrape the topic catching up the present data and listening for new records.

## Database storage format

Each indexed topic will have its dedicated SQL table. The name of the table will apply the following convention `${cluster-slug}_${topic-name}`.

The table will contain special columns type, each of those columns are indexed:
* `__timestamp`
* `__partition`
* `__offset`


The content of each records is flattenned. Given the following record:

```json
{
    "a": {
        "b": {
            "c": "Michel Barnier is beautiful"
        },
        "other_field": "bonjour"
    }
}
```

Then, you'll have the following table structure:

| __timestamp | __partition | __offset | a.b.c                       | other_field |
|-------------|-------------|----------|-----------------------------|-------------|
| 123456789   | 0           | 42       | Michel Barnier is beautiful | bonjour     |


If a records with a different shape come later, the table schema will be update:
```json
{
    "something_else": "oups"
}
```

| __timestamp | __partition | __offset | a.b.c                       | other_field | something_else |
|-------------|-------------|----------|-----------------------------|-------------|----------------|
| 123456789   | 0           | 42       | Michel Barnier is beautiful | bonjour     | NULL           |
| 123456790   | 0           | 43       | NULL                        | NULL        | oups           |

### Shrinker

As column names are limited in size (63 characters). The field name can be shrink in some cases. We try do to that in a smart way so its still meaningful for the users.
The heads characters are removed first:

`my.reaaaally.loooooooooooooooooooooooooooooong.path.to.michel.barnier` will give `m.r.oong.path.to.michel.barnier`

### Collision solver

In some cases, table name or column name can be the same for two differents topics or fields. To resolve the conflict, we suffix the name by `_${inc}` (e.g. `my.field` & `my.field_2`).

Relation between a table/column and a topic/field is tracked in special metadata tables:
* `_table_mappings`
* `_table_fields_mappings`

## Querying the data

* Using the API:
```bash
curl -XPOST  -H "Authorization: $token" 'localhost:8080/api/public/sql/v1/execute?maxLine=2' --data 'select * from "julien-cloud_sql_test"'
```

* Using the CLI:
```bash
conduktor sql 'select * from "julien-cloud_sql_test"' -n 2
```

## Limitation

* To efficiently import data in Postgres, we didn't set any primary key, so a record can be there more than once