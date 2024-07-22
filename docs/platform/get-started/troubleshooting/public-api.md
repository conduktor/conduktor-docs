---
sidebar_position: 1
title: API health endpoints
description: Conduktor API health endpoints
---

# API Healthcheck Endpoints

## Console Endpoints

### Liveness Endpoint

`/platform/api/modules/health/live`

Returns a status 200 when platform-api HTTP server is up.

```shell title="cURL example"
curl -s  http://localhost:8080/platform/api/modules/health/live
# "Ok"
```

Could be used to set up probes on Kubernetes or docker-compose.

#### docker-compose probe setup

```yaml
healthcheck:
  test:
    [
      'CMD-SHELL',
      'curl --fail http://localhost:${CDK_LISTENING_PORT:-8080}/platform/api/modules/health/live',
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
    path: /platform/api/modules/health/live
    port: httpprobe
  initialDelaySeconds: 5
  periodSeconds: 10
  timeoutSeconds: 5
```

### Readiness/startup Endpoint

`/platform/api/modules/health/ready`

Returns readiness of the platform and each module.
Modules status :

- `STARTING` (initial state)
- `UP`
- `DOWN`
- `DISABLED` (disabled modules by license or manually)

This endpoint returns a 200 status code if all modules are in `UP` or `DISABLED` state.

Otherwise, it returns 503 ("Service Unavailable") if at least one module is in `STARTING` or `DOWN` state.

```shell title="cURL example"
curl -s  http://localhost:8080/platform/api/modules/health/ready | jq .
# {
#   "console": "UP",
#   "is_ready": true
# }
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
        path: /platform/api/modules/health/ready
        port: httpprobe
    initialDelaySeconds: 30
    periodSeconds: 10
    timeoutSeconds: 5
    failureThreshold: 30
```



### Console Versions

`/platform/api/modules/versions`

This endpoint exposes module versions used to build the Console along with the overall Console version.

```shell title="cURL example"
curl -s  http://localhost:8080/platform/api/modules/versions | jq .
# {
#  "platform": "1.21.0",
#  "console": "059af990fff39541c76c0187edb5ea4e9f9ff69a",
#  "console_web": "4786261ab99e5048d997b4ff2538c4747f285a2b",
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
