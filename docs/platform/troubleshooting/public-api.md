---
sidebar_position: 1
title: API health endpoints
description: Conduktor API health endpoints
---

# API Healthcheck endpoints

### Liveness endpoint

`/platform/api/modules/health/live`

Return a status 200 when platform-api http server is up.

Curl example :

```shell
$ curl -s  http://localhost:8080/platform/api/modules/health/live | jq .
#"Ok"
```

Could be used to setup probes on kubernetes or docker-compose.

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

Port configuration

```yaml
ports:
  - containerPort: 8080
    protocol: TCP
    name: httpprobe
```

Probe configuration

```yaml
livenessProbe:
  httpGet:
    path: /platform/api/modules/health/live
    port: httpprobe
  initialDelaySeconds: 5
  periodSeconds: 10
  timeoutSeconds: 5
```

### Readyness/startup endpoint

`/platform/api/modules/health/ready`

Return readiness of the platform and each module.
Modules status :

- `STARTING` (initial state)
- `UP`
- `DOWN`
- `DISABLED` (disabled modules by license or manually)

This endpoint return 200 statusCode if all modules are in `UP` or `DISABLED` state.
Otherwise, return 503 ("Service Unavailable") if at least one module is in `STARTING` or `DOWN` state.

Curl example :

```shell
$ curl -s  http://localhost:8080/platform/api/modules/health/ready | jq .
#{
#  "console": "DOWN",
#  "monitoring": "UP",
#  "governance": "UP",
#  "is_ready": true
#}
```

#### Kubernetes startup probe

Port configuration

````yaml
ports:
  - containerPort: 8080
    protocol: TCP
    name: httpprobe

```yaml
startupProbe:
    httpGet:
        path: /platform/api/modules/health/ready
        port: httpprobe
    initialDelaySeconds: 30
    periodSeconds: 10
    timeoutSeconds: 5
    failureThreshold: 30
````

## Console Information

### Console versions

`/platform/api/modules/versions`

This endpoint expose module versions used to build the Console along with the overall Console version.

Curl example :

```shell
curl -s  http://localhost:8080/platform/api/modules/versions | jq .
# {
#  "platform": "1.19.0",
#  "console": "39db3b4b8a968b54549ce29194947c10697961aa",
#  "console_web": "8c3693ac3b32fa2bf5f2e9177951732fec8c1bac",
#  "monitoring": "0.72.0"
# }
```
