---
sidebar_position: 3
title: Log configuration
description: How to setup and tune Conduktor logs 
---
# Conduktor Console log configuration
## Log configuration environment variables
### Console-wide log configuration

To configure Conduktor Console logs globally, you can use the following environment variables:

| Environment Variable | Default value |                                                                          |
| -------------------- | ------------- | ------------------------------------------------------------------------ |
| `CDK_ROOT_LOG_LEVEL` | `INFO`        | Global Console log level, one of `OFF`, `ERROR`, `WARN`, `INFO`, `DEBUG` |
| `CDK_ROOT_LOG_COLOR` | `true`        | Enable color in logs when possible                                       |

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

Currently, Console does not support structured logging (JSON), but it is planned for a future release.
