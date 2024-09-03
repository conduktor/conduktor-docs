---
sidebar_position: 1
title: Network Configuration
description: Securing Conduktor Gateway
---


When configuring Conduktor Gateway for the first time, selecting the appropriate routing method, Port-Based Routing or Host-Based Routing (SNI), is crucial for optimizing your Kafka proxy setup. 
This page will help you understand both options and determine which solution best fits your scenario.


## Port-Based Routing
In Port-Based Routing, each Kafka broker is assigned a unique port number, and clients connect to the appropriate port to access the desired broker. Gateway listens on as many ports as defined by the environment variable `GATEWAY_PORT_COUNT`. The recommended number of ports in production is double the amount of the Kafka brokers, to cover the growth of the Kafka cluster.

Configure port-based routing using the [environment variables](../configuration/env-variables.md#hostport):
 - `GATEWAY_ADVERTISED_HOST` 
 - `GATEWAY_PORT_START`
 - `GATEWAY_PORT_COUNT`
 - `GATEWAY_MIN_BROKERID`

The default port range values cover the range of the brokerIds with an additional 3 ports. The max broker ID is requested from the cluster, the min should be set as `GATEWAY_MIN_BROKERID` e.g. in a 3-broker cluster with IDs 1, 2, 3 the default port count will be 5. Note [SNI routing](#host-based-routing-sni) (see below) should be used when not using a sequential & stable port range, to avoid excessive port assignment, e.g. a 3-broker cluster with IDs, 100, 200, 300 would default to 203 ports and would fail if broker ID 400 was introduced.

## Host-Based Routing (SNI)
With Host-Based Routing, Gateway listens on a single port and leverages Server Name Indication (SNI), an extension to the TLS protocol, to route traffic based on the hostname specified in the TLS handshake to determine the target Kafka broker, requiring valid TLS certificates, proper DNS setup, and DNS resolution.

If this is your chosen option then read how to [set up SNI routing](../how-to/sni-routing.md#setting-up-sni-routing).

## Conclusion

Choose **Port-Based Routing** if your environment:
- Does not require TLS encryption
- Has flexible network port management capabilities
- Prefers a simpler, straightforward configuration without DNS complexities

Choose **Host-Based Routing (SNI)** if your environment:
- Requires TLS encrypted connections for secure communication
- Faces challenges with managing multiple network ports
- Seeks a scalable solution with easier management of routing through DNS and hostnames
