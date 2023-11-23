---
sidebar_position: 4
title: Load Balancing
description: Load Balancing
---


Conduktor Gateway should be deployed as a resilient, distributed service.


## Internal Load Balancing

By default Conduktor Gateway proposes an inbuilt load balancer that balance client connections across running instances. 

This behaviour is configured with [load balancing configurations](./env-variables.md#load-balancing). 


## External Load Balancing

For specific use cases, you can also use an external TCP load balancer (such as [HA-proxy](https://www.haproxy.org/)).

When external load balancing is used, you need to disable the internal load balancing, see [load balancing configurations](./env-variables.md#load-balancing). 
