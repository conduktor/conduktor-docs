---
sidebar_position: 1
title: Installation
description: Conduktor Gateway is provided as a Docker image. This can be deployed however you wish within your environment.
---

# System Requirements

Conduktor Gateway is provided as a Docker image and should be deployed and managed how is best for your organisation and use case. This can either be deployed in a single container, or more likely a number of Gateway instances can be deployed behind a load balancer and scaled appropriately to meet your needs.

Jump to:

- [Hardware Requirements](#hardware-requirements)
- [Kafka Requirements](#kafka-requirements)
- [Running the Gateway](#running-the-gateway)
- [Connecting to a secured Kafka](#connecting-to-secured-kafka)

## Hardware Requirements

**Minimum**

- 1 CPU core
- 2 GB of RAM

**Recommended**

- 2 CPU cores
- 4 GB of RAM

Gateway itself does not use local storage, but certain interceptors, such as [Large message handling](/gateway/interceptors/optimize/large-message-and-batch-handling), might require temporary local storage.

## Kafka Requirements

Conduktor Gateway requires Apache Kafka version 2.5.0 or higher. Conduktor Gateway should connect to Kafka as an admin user. As a minimum this user should have rights to:

- Create/Delete/Alter topics
- Commit offsets
- Create/alter/delete consumer groups
- Describe cluster information

## Running the Gateway
In its most simple form Gateway can be run from a simple Docker run command with the credentials to connect to your Kafka cluster. However, Gateway needs to interact with your clients and your Kafka to get the most from it.

```bash
 docker run \
  -e KAFKA_BOOTSTRAP_SERVERS=kafka1:9092,kafka2:9092,kafka3:9092 \
  -e KAFKA_SASL_MECHANISM=PLAIN \
  -e KAFKA_SECURITY_PROTOCOL=SASL_PLAINTEXT \
  -e KAFKA_SASL_JAAS_CONFIG='org.apache.kafka.common.security.plain.PlainLoginModule required username="admin" password="admin-secret";' \
  conduktor/conduktor-gateway:3.0.5
```

If you're interested in trying out Gateway yourself go checkout the [demos](https://github.com/conduktor/conduktor-gateway-demos).
No matter how you deploy Gateway the finer configuration details required are described on the [environment variables](/gateway/configuration/env-variables/) page.

### Helm
Conduktor products can be deployed using [helm charts](https://helm.conduktor.io), specifically the chart for the Gateway artefact can be found on [Github](https://github.com/conduktor/conduktor-public-charts/blob/main/charts/gateway/README.md).

## Connecting to secured Kafka

Conduktor Gateway connects to Kafka just like any other client. Variables are prefixed with either `KAFKA_` or `GATEWAY_`, extra configurations (encryption/authentication etc.) can be provided via environment variables, as you can see in the above command. 
Here, environment variables prefixed by `KAFKA_` govern the connection to the upstream Kafka cluster.
Environment variables prefixed by `GATEWAY_` govern Gateway internals or the connections to the downstream Kafka clients.
Security configurations can be provided using this scheme. For example:

```bash
ssl.truststore.location
```

would become:

```bash
KAFKA_SSL_TRUSTSTORE_LOCATION
```

for more infomation on this see [environment variables](/gateway/configuration/env-variables/).
