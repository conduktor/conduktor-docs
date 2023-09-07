---
sidebar_position: 1
title: Configuration
description: Configuration for Conduktor Gateway
---

# Configuration Options

The configuration for Conduktor Gateway is set through environment variables.


# Configuring your deployment

Some Conduktor Gateway configurations are deployment specific, please consider these when determining the optimum configuration for your deployment.

# Auto Topic Creation

:::caution

Conduktor Gateway does not apply the upstream Kafka's `auto.create.topics.enable` configuration.

All topics used by Conduktor Gateway must be explicitly created before usage.

:::
