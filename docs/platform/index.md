---
sidebar_position: 1
title: Conduktor overview
slug: /
description: Conduktor is the Enterprise Data Management Platform for real-time data streaming
---

Conduktor is the Enterprise Data Management Platform for Kafka data streaming that integrates with your existing infrastructure to provide centralized visibility and control over real-time data. It's a fully self-hosted solution that depends on Docker to run. You can [get started for free](https://www.conduktor.io/get-started) using the Conduktor Community version. 

To maximize the value of Conduktor, use these two key components:
 - [Console](/platform/navigation/): the unified interface to develop, monitor, and manage data streaming operations
 - [Gateway](/gateway): a vendor-agnostic Kafka proxy that provides organizations greater control over traffic management, data security, authentication and more

![Platform overview](https://framerusercontent.com/images/meFtLvvuqKtvLTZJuKgIV8xMI.png)

Conduktor Console provides a [powerful UI](/platform/navigation/) that supports you with many essential tasks when working with Kafka:
![Console home page](assets/home.png)

Conduktor Gateway is a vendor-agnostic [Kafka proxy](/gateway), deployed between your client applications and existing Kafka clusters. It can be used to provide functionality that is not available in Kafka natively, such as centrally configured encryption, traffic control policies and failover for disaster recovery.
![conduktor-gateway](../gateway/medias/conduktor-gateway.svg)

## Next steps
 - [Get started with Console](/platform/get-started/installation/get-started/docker)
 - [Get started with Gateway](/gateway/get-started/docker)

## Resources
- [Release notes](https://conduktor.io/changelog)
- [Roadmap](https://product.conduktor.help)
- [Contact us](https://www.conduktor.io/contact/support)
- [Arrange a technical demo](https://www.conduktor.io/contact/demo)