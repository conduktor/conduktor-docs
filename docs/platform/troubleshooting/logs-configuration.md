---
sidebar_position: 2
title: Log configuration
description: How to setup and tune Conduktor Platform logs 
---
# Conduktor platform log configuration

Before version 1.11.0, Conduktor Platform logs could be configured only with environment variable `CDK_DEBUG` that enables debug logs for startup process and shows modules logs in container stdout.

Since version 1.11.0, Conduktor Platform logs can be configured with more granularity and with a more flexible way. 

## Log configuration environment variables
### Platform wide log configuration
The following environment variables are used to configure Conduktor Platform logs globally.

| ENV                   | Default value |                                            |
|-----------------------|---------------|--------------------------------------------|
| `CDK_ROOT_LOG_LEVEL`  | `INFO`        | Global platform log level                  | 
| `CDK_ROOT_LOG_COLOR`  | `true`        | Flag to enable color in logs when possible | 

### Per module log configuration
The following environment variables are used to configure Conduktor Platform logs per module.

| ENV                                 | Default value        |                                                                                           |
|-------------------------------------|----------------------|-------------------------------------------------------------------------------------------|
| `PLATFORM_STARTUP_LOG_LEVEL`        | `INFO`               | Setup process logs level set to INFO and switch to DEBUG if `CDK_ROOT_LOG_LEVEL` is DEBUG |  
| `CONSOLE_ROOT_LOG_LEVEL`            | `CDK_ROOT_LOG_LEVEL` | Console root log level                                                                    |  
| `SCANNER_ROOT_LOG_LEVEL`            | `CDK_ROOT_LOG_LEVEL` | Topic analyzer root log level                                                             |   
| `GOVERNANCE_ROOT_LOG_LEVEL`         | `CDK_ROOT_LOG_LEVEL` | Governance root log level                                                                 |  
| `ADMIN_API_ROOT_LOG_LEVEL`          | `CDK_ROOT_LOG_LEVEL` | Admin root log level                                                                      |  
| `AUTHENTICATOR_ROOT_LOG_LEVEL`      | `CDK_ROOT_LOG_LEVEL` | Authenticator root log level                                                              |  
| `TESTING_API_ROOT_LOG_LEVEL`        | `CDK_ROOT_LOG_LEVEL` | Testing root log level                                                                    |  
| `TESTING_AGENT_ROOT_LOG_LEVEL`      | `CDK_ROOT_LOG_LEVEL` | Testing agent root log level                                                              |  
| `CORTEX_ROOT_LOG_LEVEL`             | `CDK_ROOT_LOG_LEVEL` | Cortex log level                                                                          |  
| `CORTEX_ALERT_ROOT_LOG_LEVEL`       | `CDK_ROOT_LOG_LEVEL` | Cortex alert manager log level                                                            |  
| `KAFKA_LAG_EXPORTER_ROOT_LOG_LEVEL` | `CDK_ROOT_LOG_LEVEL` | Kafka lag exporter root log level                                                         |  
| `PROMETHEUS_ROOT_LOG_LEVEL`         | `CDK_ROOT_LOG_LEVEL` | Prometheus log level                                                                      |  
| `PLATFORM_API_ROOT_LOG_LEVEL`       | `CDK_ROOT_LOG_LEVEL` | Platform-api root log level                                                               |  

#### Log level inheritance
Each module log level inherits from `CDK_ROOT_LOG_LEVEL` if explicitly not set. 
For example, if `CDK_ROOT_LOG_LEVEL` is set to `DEBUG` and `CONSOLE_ROOT_LOG_LEVEL` is not set, `CONSOLE_ROOT_LOG_LEVEL` will be set to `DEBUG`.
And if `CDK_ROOT_LOG_LEVEL` is set to `INFO` and `CONSOLE_ROOT_LOG_LEVEL` is set to `DEBUG`, `CONSOLE_ROOT_LOG_LEVEL` will be set to `DEBUG`.

## Fine tuning log configuration with configuration file
If you want even more fine-tuning, you can use per module logback configuration file to set log level per loggers.

By default, all logback configuration files are located in `/opt/conduktor/loggers/` directory with **READ-ONLY** permissions.

At startup, the platform will copy all (missing) logback configuration files from `/opt/conduktor/loggers/` to `/var/conduktor/configs/loggers/` directory with **READ-WRITE** permissions.

Because all logback configuration file are set to reload themselves every 15 seconds, you can then edit logback configuration files inside the container volume in `/var/conduktor/configs/loggers/` directory to tune log level per loggers.

All logback configuration files declare some expected appenders named :
- `STDOUT` : Appender that writes logs to stdout
- `STDOUT_COLOR` : Appender that writes logs to stdout with color
- `ASYNC_STDOUT` : Appender that writes logs to stdout asynchronously
- `ASYNC_STDOUT_COLOR` : Appender that writes logs to stdout asynchronously with color

They also use environment variables defined [here](#per-module-log-configuration) to set their root log level.

## Structured logging (JSON)

Currently, platform does not support structured logging (JSON) but it is planned for a future release.
