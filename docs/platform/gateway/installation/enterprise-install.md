---
sidebar_position: 2
title: Enterprise Installation
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
Conduktor Proxy should connect to Kafka as an admin user. As a minimum this user should have rights to:
* Create/Delete/ALter topics
* Commit offsets
* Create/alter/delete consumer groups
* Describe cluster information

# Running the proxy

**Example: Starting Conduktor Proxy with a single node Kafka deployment **

```bash
 docker run \
  -e KAFKA_BOOTSTRAP_SERVERS=localhost:9092 \
  conduktor/conduktor-proxy:0.5.0-amd64
```

For more complex deployments see [environment variables](../configuration/env-variables.md)

# Connecting to secured Kafka

Conduktor Proxy connects to Kafka just like any other client. Any extra configurations (encryption/authentication etc.) 
can be provided via environment variable using the KAFKA_ prefix. Security configurations can be provided using this 
scheme. For example:

```bash
ssl.truststore.location
```

becomes:

```bash
KAFKA_SSL_TRUSTSTORE_LOCATION
```

for more infomation on this see [environment variables](../configuration/env-variables.md)
