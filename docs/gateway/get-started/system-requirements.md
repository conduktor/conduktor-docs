---
sidebar_position: 3
title: System Requirements
description: Hardware and Kafka requirements for running Conduktor Gateway.
---

# System Requirements

Conduktor Gateway is provided as a [Docker image](#running-the-gateway) and [Helm chart](../kubernetes).

Below outlines both the Hardware and Kafka Requirements for running Conduktor Gateway.

## Hardware Requirements

**Minimum**

- 1 CPU core
- 2 GB of RAM

**Recommended**

- 2 CPU cores
- 4 GB of RAM

Gateway itself does not use local storage, but certain interceptors, such as [Large message handling](/gateway/interceptors/advanced-patterns-support/large-message-and-batch-handling), might require temporary local storage.

## Kafka Requirements

Conduktor Gateway requires Apache Kafka version 2.5.0 or higher. Conduktor Gateway should connect to Kafka as an admin user. As a minimum this user should have rights to:

- Create/Delete/Alter topics
- Commit offsets
- Create/alter/delete consumer groups
- Describe cluster information