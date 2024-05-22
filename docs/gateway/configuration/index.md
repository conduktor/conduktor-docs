---
sidebar_position: 4
title: Configuration
description: Conduktor Gateway configuration
---

Configuring Conduktor Gateway involves making decisions regarding several subjects.
- Choose your Networking / Load Balancing requirements
  - Port-based routing vs SNI routing
- Configure how the Gateway connects to your Backing Kafka Cluster
  - Minimum Service Account ACLs requirements (even in delegated mode)
    - `_conduktor_<gateway-id>_`
- Configure the Gateway to accept Client connections
  - Oauth
  - mTLS
  - ...
- Decide whether you need Virtual Cluster capabilities

## Network