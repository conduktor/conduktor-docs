---
sidebar_position: 1
title: Conduktor overview
slug: /
description: Conduktor is the Enterprise Data Management Platform for real-time data streaming
---

Conduktor is the Enterprise Data Management Platform for data streaming that integrates with your existing infrastructure to provide centralized visibility and control over real-time data.

To maximize the value of Conduktor, there are two key components to be aware of:
 - [Console](/platform/navigation/): Unified interface to develop, monitor, and manage data streaming operations
 - [Gateway](/gateway): Proxy that simplifies authentication, authorization, and traffic management

![Platform overview](https://framerusercontent.com/images/meFtLvvuqKtvLTZJuKgIV8xMI.png)

Conduktor Console has a powerful UI for Apache Kafka that supports you with many essential tasks when working with Kafka.

 - See [Console UI](/platform/navigation/) for details

![Console home page](assets/home.png)

The Conduktor Gateway is a Kafka proxy deployed between your client applications and existing Kafka clusters. This can be used to provide functionality that is not available in Kafka natively, such as centrally configured encryption, traffic control policies, and failover for disaster recovery.

 - See [Gateway overview](/gateway) for details

![conduktor-gateway](../gateway/medias/conduktor-gateway.svg)

## Next steps
 - [Get started with Console](/platform/get-started/installation/get-started/docker)
 - [Get started with Gateway](/gateway/get-started/docker)

## Resources
- [Release notes](https://conduktor.io/changelog)
- [Roadmap](https://product.conduktor.help)
- [Contact us](https://www.conduktor.io/contact/support)
- [Arrange a technical demo](https://www.conduktor.io/contact/demo)