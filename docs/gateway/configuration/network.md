---
sidebar_position: 1
title: Network configuration
description: Securing Conduktor Gateway
---


When configuring Conduktor Gateway for the first time, selecting the appropriate routing method—Port-Based Routing or Host-Based Routing (SNI)—is crucial for optimizing your Kafka proxy setup. 
This page will help you understand both options and determine which solution best fits your scenario.


## Port-Based Routing
In Port-Based Routing, Gateway listens on as many ports as there are Kafka brokers. Each Kafka broker is assigned a unique port number, and clients connect to the appropriate port to access the desired broker.


## Host-Based Routing (SNI)
Host-Based Routing, Gateway listens on a single port and leverages Server Name Indication (SNI), an extension to the TLS protocol, to route traffic based on the hostname specified in the TLS handshake to determine the target Kafka broker, requiring valid TLS certificates, proper DNS setup, and DNS resolution.


## Conclusion

Choose **Port-Based Routing** if your environment:
- Does not require TLS encryption.
- Has flexible network port management capabilities.
- Prefers a simpler, straightforward configuration without DNS complexities.

Choose **Host-Based Routing (SNI)** if your environment:
- Requires TLS encrypted connections for secure communication.
- Faces challenges with managing multiple network ports.
- Seeks a scalable solution with easier management of routing through DNS and hostnames.