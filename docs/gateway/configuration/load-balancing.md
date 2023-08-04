---
sidebar_position: 1
title: Configuration
description: Load Balancing
---


Conduktor Gateway should be deployed as a resilient, distributed service.


## Internal Load Balancing

In non-production deployments an inbuilt load balancer is available for ease of use which can balance client connections across running instances. 

This behaviour is configured with [load balancing configurations](./env-variables.md#load-Balancing-configurations). 


## External Load Balancing

For production deployments we recommend an external TCP load balancer (such as [HA-proxy](https://www.haproxy.org/)).

When external load balancing is used, you need to disable the internal load balancing, see [load balancing configurations](./env-variables.md#load-Balancing-configurations). 
