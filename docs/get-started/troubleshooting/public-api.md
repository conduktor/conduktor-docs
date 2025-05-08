---
sidebar_position: 1
title: API health endpoints
description: Conduktor API health endpoints
---

# API Healthcheck Endpoints

## Console Endpoints

### Liveness Endpoint

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

### Readiness/startup Endpoint

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



### Console Versions

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

## Cortex Monitoring Endpoints

### Cortex Endpoint

`/ready` on port `9009`

Returns a status 200 with response `ready` if Cortex is running

```shell title="cURL example"
curl -s "http://localhost:9009/ready"
```

### Alertmanager Endpoint

`/ready` on port `9010`

Returns a status 200 with response `ready` if Alertmanager is running

```shell title="cURL example"
curl -s "http://localhost:9010/ready"
```

### Prometheus Endpoint

`/-/healthy` on port `9090`

Returns a status 200 with response `Prometheus Server is Healthy.` if Prometheus is running

```shell title="cURL example"
curl -s "http://localhost:9090/-/healthy"
```
