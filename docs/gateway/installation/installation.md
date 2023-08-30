---
sidebar_position: 1
title: Installation
description: Conduktor Gateway is provided as a Docker image. This can either be deployed in a single container or a number of proxies can be deployed behind a load balancer.
---

# System Requirements

Conduktor Gateway is provided as a Docker image and should be deployed and managed how is best for your organisation and use case. This can either be deployed in a single container, or more likely a number of Gateway instances can be deployed behind a load balancer and scaled appropriately to meet your needs.

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
In its most simple form GW can be run from a simple Docker run command with the credentials to connect to you Kafka cluster. However, Gateway needs to interact with your clients and your Kafka to get the most from it.

```bash
 docker run \
  -e KAFKA_BOOTSTRAP_SERVERS=kafka1:9092 \
  -e KAFKA_SASL_MECHANISM=SCRAM-SHA-256 \
  -e KAFKA_SECURITY_PROTOCOL=SASL_SSL \
  -e KAFKA_SASL_JAAS_CONFIG="org.apache.kafka.common.security.scram.ScramLoginModule required username='usr' password='pwd';"\
  conduktor/conduktor-gateway:2.0.0-amd64
```
If you're interested in trying out Gateway yourself go checkout the [demos](https://github.com/conduktor/conduktor-gateway-demos).
For more control over your deployments see the [environment variables](/gateway/configuration/env-variables/).

# Connecting to secured Kafka

Conduktor Gateway connects to Kafka just like any other client. Variables are prefixed with either KAFKA or GATEWAY, extra configurations (encryption/authentication etc.) can be provided via environment variables, as you can see in the above command. 
Security configurations can be provided using this scheme. For example:

```bash
ssl.truststore.location
```

would become:

```bash
KAFKA_SSL_TRUSTSTORE_LOCATION
```

for more infomation on this see [environment variables](/gateway/configuration/env-variables/).
