---
sidebar_position: 3
title: Log configuration
description: How to setup and tune Conduktor logs
---
# Conduktor Console log configuration
## Log configuration environment variables
### Console-wide log configuration

To configure Conduktor Console logs globally, you can use the following environment variables:

| Environment Variable  | Default value |                                                                          |
| --------------------  | ------------- | ------------------------------------------------------------------------ |
| `CDK_ROOT_LOG_LEVEL`  | `INFO`        | Global Console log level, one of `OFF`, `ERROR`, `WARN`, `INFO`, `DEBUG` |
| `CDK_ROOT_LOG_FORMAT` | `TEXT`        | Log format, one of `TEXT` or `JSON` (sice 1.26.0)                        |
| `CDK_ROOT_LOG_COLOR`  | `true`        | Enable color in logs when possible                                       |

:::info
For backward compatibility, `CDK_DEBUG: true` is still supported, and is equivalent to `CDK_ROOT_LOG_LEVEL: DEBUG`.
:::

### Per module log configuration
To configure Conduktor Console logs on a per-module basis, you can use the environment variables detailed below.

Possible values for all of them are: `OFF`, `ERROR`, `WARN`, `INFO`, `DEBUG`, and `TRACE`.

| Environment Variable          | Default value        | Description                                                                                                                             |
| ----------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `PLATFORM_STARTUP_LOG_LEVEL`  | `INFO`               | Set the setup/configuration process logs level. By default, it is set to `INFO`, but switches to `DEBUG` if `CDK_ROOT_LOG_LEVEL: DEBUG`. |
| `CONSOLE_ROOT_LOG_LEVEL`      | `CDK_ROOT_LOG_LEVEL` | Logs related to any actions done in the Console UI                                                                                      |
| `PLATFORM_API_ROOT_LOG_LEVEL` | `CDK_ROOT_LOG_LEVEL` | Internal platform API logs (health endpoints)                                                                                           |                                                                                       |

#### Log level inheritance

If you don't explicitly set the log level for a module, it will inherit the `CDK_ROOT_LOG_LEVEL`.

For instance, if you only set
```yaml
CDK_ROOT_LOG_LEVEL: DEBUG
# CONSOLE_ROOT_LOG_LEVEL isn't set
```
Then, `CONSOLE_ROOT_LOG_LEVEL` will be automatically set to `DEBUG`.

Similarly, if you set:
```yaml
CDK_ROOT_LOG_LEVEL: INFO
CONSOLE_ROOT_LOG_LEVEL: DEBUG
```

Then, `CONSOLE_ROOT_LOG_LEVEL` will still be set to `DEBUG`, and isn't overridden.

## Fine-tuning log configuration with configuration file

If you want to further customize your logging at an individual logger-level, you can use a per-module logback configuration file.

By default, all logback configuration files are located in `/opt/conduktor/loggers/` directory with **READ-ONLY** permissions.

At startup, the Console will copy all (missing) logback configuration files from `/opt/conduktor/loggers/` to `/var/conduktor/configs/loggers/` directory with **READ-WRITE** permissions.

Because all logback configuration files are set to reload themselves every 15 seconds, you can then edit logback configuration files inside the container volume in the `/var/conduktor/configs/loggers/` directory, to tune log level per logger.

All logback configuration files declare some expected appenders named :

| Appender name        | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| `STDOUT`             | Appender that writes logs to stdout                           |
| `STDOUT_COLOR`       | Appender that writes logs to stdout with color                |
| `ASYNC_STDOUT`       | Appender that writes logs to stdout asynchronously            |
| `ASYNC_STDOUT_COLOR` | Appender that writes logs to stdout asynchronously with color |

They also use environment variables defined [here](#per-module-log-configuration) to set their root log level.

## Structured logging (JSON)

To enable structured logging, simply set `CONSOLE_ROOT_LOG_LEVEL=JSON`.

The logs will be structured using following format :

```json
{
 "timestamp": "2024-06-14T10:09:25.802542476+00:00",
 "level": "<log level>",
 "message": "<log message>",
 "logger": "<logger name>",
 "thread": "<logger thread>",
 "stack_trace": "<throwable>",
 "mdc": {
   "key": "value"
 }
}
```


:::tip
The log `timestamp` is encoded in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) format.
:::


:::info
In case of structured logging enabled, `CDK_ROOT_LOG_COLOR` is always ignored.
:::


## Runtime logger configuration API

Since version 1.28.0, Conduktor Console exposes an API to change the log level of a logger at runtime.

This API **requires admin privileges** and is available on `/api/public/debug/v1/loggers`.

### Get all loggers and their log level

`GET /api/public/debug/v1/loggers` :

```bash
curl -X GET -H "Authorization: Bearer $API_KEY" 'http://localhost:8080/api/public/debug/v1/loggers' | jq .
```
That will output :

```json
[
  {
    "name": "io",
    "level": "INFO"
  },
  {
    "name": "io.conduktor",
    "level": "INFO"
  },
  {
    "name": "io.conduktor.authenticator",
    "level": "INFO"
  },
  {
    "name": "io.conduktor.authenticator.ConduktorUserProfile",
    "level": "INFO"
  },
  {
    "name": "org",
    "level": "INFO"
  },
  {
    "name": "org.apache",
    "level": "INFO"
  },
  {
    "name": "org.apache.avro",
    "level": "INFO"
  },
  ...
]
```

### Get a specific logger and its log level

`GET /api/public/debug/v1/loggers/{loggerName}` :

```bash
curl -X GET -H "Authorization: Bearer $API_KEY" 'http://localhost:8080/api/public/debug/v1/loggers/io.conduktor.authenticator' | jq .
```
That will output :

```json
[
  {
    "name": "io.conduktor.authenticator",
    "level": "INFO"
  },
  {
    "name": "io.conduktor.authenticator.ConduktorUserProfile",
    "level": "INFO"
  }
  ...
]
```

:::tip
The `loggerName` filter use a **contains** so you can either use the fully qualified cardinal name or just a part of it.
Meaning that filter `authenticator` will match `io.conduktor.authenticator` and `io.conduktor.authenticator.ConduktorUserProfile` loggers.
:::

### Set a specific logger log level

`PUT /api/public/debug/v1/loggers/{loggerName}/{logLevel}` :

```bash
curl -X PUT -H "Authorization: Bearer $API_KEY" 'http://localhost:8080/api/public/debug/v1/loggers/io.conduktor.authenticator/DEBUG' | jq .
```

That will output the list of loggers impacted by the update:

```json
[
  "io.conduktor.authenticator",
  "io.conduktor.authenticator.ConduktorUserProfile"
  ...
]
```

:::tip
Like the `GET` endpoint, the `loggerName` filter use a **contains** so you can either use the fully qualified cardinal name or just a part of it.
The `logLevel` is **case-insensitive** and can be one of `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `OFF`.
:::

### Set multiple loggers log level

`PUT /api/public/debug/v1/loggers` :

```bash
curl -X PUT -H "Authorization: Bearer $API_KEY" 'http://localhost:8080/public/debug/v1/loggers' \
  --data '[
      {
          "name": "io.conduktor.authenticator.ConduktorUserProfile",
          "level": "TRACE"
      },
      {
          "name": "io.conduktor.authenticator.adapter",
          "level": "DEBUG"
      }
  ]' | jq .
```

That will output the list of loggers impacted by the update:

```json
[
  "io.conduktor.authenticator.ConduktorUserProfile",
  "io.conduktor.authenticator.ConduktorUserProfile$LocalUserProfile",
  "io.conduktor.authenticator.adapter",
  "io.conduktor.authenticator.adapter.Http4sCacheSessionStore",
  ...
]
```
