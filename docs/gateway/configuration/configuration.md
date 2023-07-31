---
sidebar_position: 1
title: Configuration
description: Configuration for Conduktor Gateway
---

# Configuration Options

The configuration for Conduktor Gateway is set through environment variables.

The [environment variable settings](./env-variables.md) are advised for the Enterprise version of Conduktor Gateway.


# Configuring your deployment

Some Conduktor Gateway configurations are deployment specific, please consider these when determining the optimum 
configuration for your deployment.

## Internal Load Balancing

Conduktor Gateway should be deployed as a resilient, distributed service. For production deployments we recommend an external TCP load balancer (such as [HA-proxy](https://www.haproxy.org/)). 
In non-production deployments we offer an inbuilt load balancer for ease of use which can balance client connections across running instances. This behaviour is configured with [load balancing configurations](./env-variables.md#load-Balancing-configurations).

## Auto Topic Creation

:::caution

Conduktor Gateway does not apply the upstream Kafka's `auto.create.topics.enable` configuration. All topics used by 
Conduktor Gateway must be explicitly created before usage. 

:::
