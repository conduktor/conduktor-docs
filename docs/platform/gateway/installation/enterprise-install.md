---
sidebar_position: 1
title: Installation
description: Conduktor Gateway is provided as a Docker image. This can either be deployed in a single container or a number of instances can be deployed behind a load balancer.
---

# System Requirements

Conduktor Gateway is provided as a Docker image. This can either be deployed in a single container or a number of instances can be deployed behind a load balancer.

Jump to:

- [Hardware Requirements](#hardware-requirements)
- [Disabling a Module](#disabling-a-module)

## Hardware Requirements

**Minimum**

- 1 CPU core
- 2 GB of RAM

**Recommended**

- 2 CPU cores
- 4 GB of RAM

## Kafka Requirements

Conduktor Gateway requires Apache Kafka version 2.5.0 or higher. Conduktor Gateway should connect to Kafka as an admin user. As a minimum this user should have rights to:

- Create/Delete/Alter topics
- Commit offsets
- Create/alter/delete consumer groups
- Describe cluster information

# Running the gateway

**Example: Starting Conduktor Gateway with a single node Kafka deployment.**  
 In the below example change the bootstrap server value to your own. If your running Kafka on localhost not inside a Docker container then modify your bootstrap server as below,  
 `-e KAFKA_BOOTSTRAP_SERVERS=host.docker.internal:19092` , in order to reach it.

Alternatively check out our demos which have docker compose examples that run out of the box, [Gateway Demos](https://github.com/conduktor/conduktor-proxy-demos).

```bash
 docker run \
  -e KAFKA_BOOTSTRAP_SERVERS=kafka:9092 \
  -p 6969-6973:6969-6973 \
  -p 8888:8888 \
  conduktor/conduktor-proxy:1.8.2.1-amd64
```

For more control over your deployments you'll want to make use of [environment variables](/platform/gateway/configuration/env-variables/).

# Connecting to secured Kafka

Conduktor Gateway connects to Kafka just like any other client. Any extra configurations (encryption/authentication etc.) can be provided via environment variables using the KAFKA\_ prefix. Security configurations can be provided using this scheme. For example:

```bash
ssl.truststore.location
```

becomes:

```bash
KAFKA_SSL_TRUSTSTORE_LOCATION
```

for more infomation on this see [environment variables](/platform/gateway/configuration/env-variables/).
