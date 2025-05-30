---
sidebar_position: 70
title: Console
description: Deploy Console
---
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';






## Configure Console logs

<Tabs>
<TabItem  value="Env variables" label="Environment variables">

#### Console-wide log configuration

To configure Conduktor Console logs globally, you can use the following environment variables:

| Environment Variable  | Default value |                                                                          |
| --------------------  | ------------- | ------------------------------------------------------------------------ |
| `CDK_ROOT_LOG_LEVEL`  | `INFO`        | Global Console log level, one of `OFF`, `ERROR`, `WARN`, `INFO`, `DEBUG` |
| `CDK_ROOT_LOG_FORMAT` | `TEXT`        | Log format, one of `TEXT` or `JSON` (sice 1.26.0)                        |
| `CDK_ROOT_LOG_COLOR`  | `true`        | Enable color in logs when possible                                       |

:::info[Compatibility]
For backward compatibility, `CDK_DEBUG: true` is still supported and is equivalent to `CDK_ROOT_LOG_LEVEL: DEBUG`.
:::

#### Per module log configuration

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

</TabItem>

<TabItem  value="Config file" label="Config file">

If you want to further customize your logging at an individual logger-level, you can use a per-module logback configuration file.

By default, all logback configuration files are in **/opt/conduktor/loggers/** with `READ-ONLY` permissions.

At startup, Console will copy all (missing) logback configuration files from `/opt/conduktor/loggers/` to `/var/conduktor/configs/loggers/` directory with `READ-WRITE` permissions.

Because all logback configuration files are set to reload themselves every 15 seconds, you can then edit them inside the container volume in **/var/conduktor/configs/loggers/** to tune log level per logger.

All logback configuration files declare some expected appenders:

| Appender name        | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| `STDOUT`             | Appender that writes logs to stdout                           |
| `STDOUT_COLOR`       | Appender that writes logs to stdout with color                |
| `ASYNC_STDOUT`       | Appender that writes logs to stdout asynchronously            |
| `ASYNC_STDOUT_COLOR` | Appender that writes logs to stdout asynchronously with color |

</TabItem>
</Tabs>

## Structured logging (JSON)

To enable structured logging, simply set `CONSOLE_ROOT_LOG_LEVEL=JSON`. The logs will be structured using following format:

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

:::note[Log encoding]
The log `timestamp` is encoded in [ISO-8601 format](https://en.wikipedia.org/wiki/ISO_8601). When structured logging is enabled, `CDK_ROOT_LOG_COLOR` is always ignored.
:::

## Runtime logger configuration API

From version 1.28.0, Conduktor Console exposes an API to change the log level of a logger at runtime. This API **requires admin privileges** and is available on `/api/public/debug/v1/loggers`.

### Get all loggers and their log level

`GET /api/public/debug/v1/loggers` :

```bash
curl -X GET 'http://localhost:8080/api/public/debug/v1/loggers' \
  -H "Authorization: Bearer $API_KEY" | jq .
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
curl -X GET 'http://localhost:8080/api/public/debug/v1/loggers/io.conduktor.authenticator' \
  -H "Authorization: Bearer $API_KEY" | jq .
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

:::note[Logger name filter]
The `loggerName` filter uses a **contains** so you can either use the fully qualified cardinal name or just a part of it, meaning that the filter `authenticator` will match `io.conduktor.authenticator` and `io.conduktor.authenticator.ConduktorUserProfile` loggers.
:::

### Set a specific logger log level

`PUT /api/public/debug/v1/loggers/{loggerName}/{logLevel}` :

```bash
curl -X PUT 'http://localhost:8080/api/public/debug/v1/loggers/io.conduktor.authenticator/DEBUG' \
  -H "Authorization: Bearer $API_KEY" | jq .
```

That will output the list of loggers impacted by the update:

```json
[
  "io.conduktor.authenticator",
  "io.conduktor.authenticator.ConduktorUserProfile"
  ...
]
```

:::note[Logger name log level]
Like the `GET` endpoint, the `loggerName` filter use a **contains** so you can either use the fully qualified cardinal name or just a part of it. The `logLevel` is **case-insensitive** and can be: `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `OFF`.
:::

### Set multiple loggers log level

`PUT /api/public/debug/v1/loggers` :

```bash
curl -X PUT 'http://localhost:8080/public/debug/v1/loggers' \
   -H "Authorization: Bearer $API_KEY" \
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









## Debug Console

Conduktor Console Docker image runs on Ubuntu Linux. It runs multiple services in a single Docker container. These services are supervised by [supervisord](http://supervisord.org/).

To troubleshoot Console:

1. Verify that Console is up and running.  
1. Manually debug Conduktor Console.
1. Check the logs and send them to our support team if necessary.

### 1. Verify that Conduktor is up and running

<Tabs>
<TabItem  value="Docker" label="From Docker">

First, verify that all the components are running.

```bash title="Get containers status"
docker ps
```

```txt title="Output"
NAME                   IMAGE                                       COMMAND                  SERVICE                CREATED          STATUS                    PORTS
conduktor-console      conduktor/conduktor-console:1.21.0          "/__cacert_entrypoin…"   conduktor-console      10 minutes ago   Up 9 minutes (healthy)    0.0.0.0:8080->8080/tcp
conduktor-monitoring   conduktor/conduktor-console-cortex:1.21.0   "/opt/conduktor/scri…"   conduktor-monitoring   10 minutes ago   Up 10 minutes (healthy)   0.0.0.0:9009-9010->9009-9010/tcp, 0.0.0.0:9090->9090/tcp
postgres               postgres:15.1                               "docker-entrypoint.s…"   postgres               10 minutes ago   Up 10 minutes             0.0.0.0:5432->5432/tcp
```

If you're using an external Kafka installation and external database, you will only need to verify that the `conduktor-console` container is showing `healthy` as the `STATUS`.

If Console is showing an "exited" status, check the Docker logs by running the command (with the appropriate container name):

```bash title="Get container logs"
docker logs conduktor-console
```

You can save these logs in a file:

```bash title="Store logs in a file"
docker logs conduktor-console >& docker-logs-output.txt
```

</TabItem>

<TabItem  value="Kubernetes" label="Kubernetes">

To get the status of the Conduktor Console pod in Kubernetes, you can run the following command (with the correct namespace, if any):

```bash title="Get containers status"
kubectl get pod --namespace conduktor
```

```txt title="Output"
NAME                                         READY   STATUS    RESTARTS   AGE
console-instance-cortex-5d85d5cfb4-qcxhs   1/1     Running   0          2m4s
console-instance-747d5ffc7b-gcpkx          1/1     Running   0          2m4s
```

The pod status is available in the **STATUS** column.

</TabItem>
</Tabs>

### 2. Manually debug Conduktor Console

#### Check services within the conduktor-console container

First, we will need to invoke a shell within the conduktor-console container. For that, you can use the following commands:

<Tabs>
<TabItem value="Based on container name" label="Based on container name">

```sh
docker exec -it conduktor-console bash
```

</TabItem>
<TabItem value="Based on container ID" label="Based on container ID">

```sh
docker exec -it fe4a5d1be98f bash
```

</TabItem>
</Tabs>

From within the container, you can verify that all expected services are started. Conduktor Console uses supervisord inside of the container to ensure various services are started:

```sh title="Check services status"
supervisorctl status
```

```txt title="Output"
console                          FATAL     Exited too quickly (process log may have details)
platform_api                     RUNNING   pid 39, uptime 0:49:39
proxy                            RUNNING   pid 33, uptime 0:49:39
```

In the example mentioned above, the console did not start successfully. This indicates that we need to look at the log files to investigate the issue further.

### 3. Get the logs and send them to support

Logs are kept in `/var/conduktor/log`. You can see them using:

```sh title="List log files"
ls /var/conduktor/log/
```

```txt title="Output"
console-stdout---supervisor-umscgn8w.log       proxy                                   proxy-stdout---supervisor-2gim6er7.log  supervisord.log
platform_api-stdout---supervisor-cqvwnsqi.log  proxy-stderr---supervisor-8i0bjkaz.log  startup.log
```

The best here is to simply bring all the logs to your local machine (in PWD) by running:

```sh
docker compose cp conduktor-console:/var/conduktor/log .
```

Then send these logs to our[support team](https://support.conduktor.io/hc/en-gb/requests/new). If you've contacted us before, [log into your account and create a ticket](https://support.conduktor.io/hc/en-gb/signin?return_to=https%3A%2F%2Fsupport.conduktor.io%2Fhc%2Fen-gb%2Frequests%2Fnew%3Fticket_form_id%3D17438312520209).


## Healthcheck endpoints

### Liveness endpoint

`/api/health/live`

Returns a status HTTP 200 when Console is up.

```shell title="cURL example"
curl -s  http://localhost:8080/api/health/live
```

Could be used to set up probes on Kubernetes or docker-compose.

#### docker-compose probe setup

```yaml
healthcheck:
  test:
    [
      'CMD-SHELL',
      'curl --fail http://localhost:${CDK_LISTENING_PORT:-8080}/api/health/live',
    ]
  interval: 10s
  start_period: 120s # Leave time for the psql init scripts to run
  timeout: 5s
  retries: 3
```

#### Kubernetes liveness probe

```yaml title="Port configuration"
ports:
  - containerPort: 8080
    protocol: TCP
    name: httpprobe
```

```yaml title="Probe configuration"
livenessProbe:
  httpGet:
    path: /api/health/live
    port: httpprobe
  initialDelaySeconds: 5
  periodSeconds: 10
  timeoutSeconds: 5
```

### Readiness/startup endpoint

`/api/health/ready`

Returns readiness of the Console.
Modules status :

- `NOTREADY` (initial state)
- `READY`

This endpoint returns a 200 status code if Console is in a `READY` state. Otherwise, it returns a 503 status code if Console fails to start.

```shell title="cURL example"
curl -s  http://localhost:8080/api/health/ready
# READY
```

#### Kubernetes startup probe

```yaml title="Port configuration"

ports:
  - containerPort: 8080
    protocol: TCP
    name: httpprobe
```

```yaml title="Probe configuration"
startupProbe:
    httpGet:
        path: /api/health/ready
        port: httpprobe
    initialDelaySeconds: 30
    periodSeconds: 10
    timeoutSeconds: 5
    failureThreshold: 30
```

### Console versions

`/api/versions`

This endpoint exposes module versions used to build the Console along with the overall Console version.

```shell title="cURL example"
curl -s  http://localhost:8080/api/versions | jq .
# {
#  "platform": "1.27.0",
#  "platformCommit": "ed849cbd545bb4711985ce0d0c93ca8588a6b31f",
#  "console": "f97704187a7122f78ddc9110c09abdd1a9f9d470",
#  "console_web": "05dea2124c01dfd9479bc0eb22d9f7d8aed6911b"
# }
```
