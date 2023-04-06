---
title: Installation
description: Conduktor Proxy is provided as a Docker image. This can either be deployed in a single container or a number of proxies can be deployed behind a load balancer.
---

## Configuration

Conduktor Gateway requires 2 configuration files, examples found in `/gateway-core/config`

`kafka.config` holds the configuration the gateway should use to connect to the backing Kafka cluster. This should
contain similar information and formatting to any Java client connecting to the backing Kafka. e.g.:

```
bootstrap.servers=localhost:9092
```

`application.yaml` contains gateway specific configuration options, descriptions of these can be found below:
4