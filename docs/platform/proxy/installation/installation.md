---
title: System Requirements
description: Conduktor Proxy is provided as a Docker image. This can either be deployed in a single container or a number of proxies can be deployed behind a load balancer.
---

# System Requirements

Conduktor Proxy is provided as a Docker image. This can either be deployed in a single container or a number of proxies can be deployed behind a load balancer.

Jump to:

- [Hardware Requirements](#hardware-requirements)
- [Disabling a Module](#disabling-a-module)

## Hardware Requirements

**Minimum**

- 4 CPU cores
- 8 GB of RAM
- 5 GB of disk space

**Recommended**

- 4+ CPU cores
- 16+ GB of RAM
- 10+ GB of disk space

## Kafka Requirements

Conduktor Proxy requires Apache Kafka version 2.5.0 or higher.

# Running the proxy

**Example: Starting Conduktor Proxy with a single node Kafka deployment **

```bash
 docker run \
  -e KAFKA_BOOTSTRAP_SERVERS=localhost:9092 \
  conduktor/conduktor-proxy:0.3.0-amd64
```

For more complex deployments see [environment variables](../configuration/env-variables)
