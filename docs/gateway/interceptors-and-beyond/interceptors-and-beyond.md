---
sidebar_position: 1
title: Interceptors and beyond
description: Gateway interceptors and beyond the docs
---

# Interceptors and beyond
So far you have learnt about setting up Gateway as an application and configuring it how you wish to in your environment. Once you have Gateway up, with your applications passing through it to your cluster then what next? Now we get to the interesting part of adding interceptors to inject functionality into your Gateway setup, and multi-tenancy allowing one Kafka cluster to appear as a number of isolated, virtual clusters to clients. Putting this together you can have many clusters/tenants being operated upon separately with no concern of side effects for the others.


For more on Interceptors, including how to configure them, browse the marketplace at [marketplace.conduktor.io](https://marketplace.conduktor.io/).

For more on multi-tenancy and other features where you can try Gateway out yourself [Gateway demos](https://github.com/conduktor/conduktor-gateway-demos).

![multi-tenancy.png](./multi-tenant.png)

