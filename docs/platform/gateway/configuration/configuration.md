---
sidebar_position: 1
title: Configuration
description: Configuration for Conduktor Gateway
---

# Configuration Options

The configuration for Conduktor Gateway can be set via a yaml based configuration file or through environment variables.

The [environment variable settings](./env-variables.md) are advised for the Enterprise version of Conduktor Gateway.

The [yaml file based configuration](./opensource-yaml-config.md) is advised for the Open Source version of Conduktor Gateway.

# Configuring your deployment

Some Conduktor Gateway configurations are deployment specific, please consider these when determining the optimum 
configuration for your deployment.

## Internal Load Balancing

Conduktor Gateway should be deployed as a resilient, distributed service. To enable this Conduktor Gateway will, by 
default, balance client connections across running instances. This behaviour is configured with [load balancing 
configurations](./env-variables.md#load-Balancing-configurations).

:::caution

Load balancing of this type is not suitable for production deployments. We recommend that, for these deployments, 
internal load balancing is disabled and an external TCP load balancer (such as [HA-proxy](https://www.haproxy.org/)) is 
used.

:::

## Auto Topic Creation

:::caution

Conduktor Gateway does not apply the upstream Kafka's `auto.topic.create.enable` configuration. All topics used by 
Conduktor Gateway must be explicitly created before usage. 

:::
