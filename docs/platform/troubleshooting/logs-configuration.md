---
sidebar_position: 3
title: Log configuration
description: How to setup and tune Conduktor logs 
---
# Conduktor Console log configuration

Before version 1.11.0, Conduktor Console logs could be configured only with environment variable `CDK_DEBUG` that enables debug logs for startup process and shows modules logs in container stdout.

Since version 1.11.0, Conduktor Console logs can be configured with more granularity and with a more flexible way. 

## Log configuration environment variables
### Console wide log configuration
The following environment variables are used to configure Conduktor Console logs globally.

| ENV                   | Default value |                                            |
|-----------------------|---------------|--------------------------------------------|
| `CDK_ROOT_LOG_LEVEL`  | `INFO`        | Global Console log level                  | 
| `CDK_ROOT_LOG_COLOR`  | `true`        | Flag to enable color in logs when possible | 

:::info
For backward compatibility, `CDK_DEBUG` is still supported.

If `CDK_ROOT_LOG_LEVEL` is set to `DEBUG`, then `CDK_DEBUG` is also set to `true`.
And if `CDK_DEBUG` is set to `true`, then `CDK_ROOT_LOG_LEVEL` is set to `DEBUG`.
:::

### Per module log configuration
The following environment variables are used to configure Conduktor Console logs per module.

| ENV                                 | Default value        |                                                                                                                              |
|-------------------------------------|----------------------|------------------------------------------------------------------------------------------------------------------------------|
| `PLATFORM_STARTUP_LOG_LEVEL`        | `INFO`               | Set the setup/configuration process logs level. By default, set to INFO and switch to DEBUG if `CDK_ROOT_LOG_LEVEL` is DEBUG |  
| `CONSOLE_ROOT_LOG_LEVEL`            | `CDK_ROOT_LOG_LEVEL` | Logs related to any actions done in the Console UI                                                                           |   
| `PLATFORM_API_ROOT_LOG_LEVEL`       | `CDK_ROOT_LOG_LEVEL` | Internal platform api logs (health endpoints)                                                                                |  

#### Log level inheritance
Each module log level inherits from `CDK_ROOT_LOG_LEVEL` if explicitly not set.     

For example, if `CDK_ROOT_LOG_LEVEL` is set to `DEBUG` and `CONSOLE_ROOT_LOG_LEVEL` is not set, `CONSOLE_ROOT_LOG_LEVEL` will be set to `DEBUG`.   

And if `CDK_ROOT_LOG_LEVEL` is set to `INFO` and `CONSOLE_ROOT_LOG_LEVEL` is set to `DEBUG`, `CONSOLE_ROOT_LOG_LEVEL` will be set to `DEBUG`.   

## Fine tuning log configuration with configuration file
If you want even more fine-tuning, you can use per module logback configuration file to set log level per loggers.

By default, all logback configuration files are located in `/opt/conduktor/loggers/` directory with **READ-ONLY** permissions.

At startup, the Console will copy all (missing) logback configuration files from `/opt/conduktor/loggers/` to `/var/conduktor/configs/loggers/` directory with **READ-WRITE** permissions.

Because all logback configuration file are set to reload themselves every 15 seconds, you can then edit logback configuration files inside the container volume in `/var/conduktor/configs/loggers/` directory to tune log level per loggers.

All logback configuration files declare some expected appenders named :
- `STDOUT` : Appender that writes logs to stdout
- `STDOUT_COLOR` : Appender that writes logs to stdout with color
- `ASYNC_STDOUT` : Appender that writes logs to stdout asynchronously
- `ASYNC_STDOUT_COLOR` : Appender that writes logs to stdout asynchronously with color

They also use environment variables defined [here](#per-module-log-configuration) to set their root log level.

## Structured logging (JSON)

Currently, Console does not support structured logging (JSON) but it is planned for a future release.
