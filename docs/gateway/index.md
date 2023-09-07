---
sidebar_position: 1
title: Overview
description: Kafka is a powerful tool, with many nuances and great flexibility. However, this power and flexibility can lead to challenges around managing and bringing structure to your Kafka ecosystem, especially as it grows.
---

# Overview

## What is the Conduktor Gateway
A vendor agnostic Apache Kafka proxy. Adding governance, security, cost-optimisation, and much more!

Kafka is a powerful tool, with great flexibility. This power and flexibility can lead to challenges around managing and bringing structure to your Kafka ecosystem, especially as that ecosystem grows.

 When using Conduktor Gateway you can more easily follow the path to a mature Kafka set-up, avoiding the pitfalls and the common challenges that come with this progression.  Conduktor Gateway gives you the power to add structure, organisation, enhanced functionality, and therefore confidence in your Kafka environment. Gateway is fully Apache Kafka protocol compliant and vendor agnostic, it supports the use of Kafka wherever that Kafka is hosted.


## Components

The core of Conduktor Gateway is the transport layer between your Kafka client applications and your Kafka clusters.

![gateway-overview.png](./Overview.png)

This transport layer is enhanced by interacting with the Kafka, modifying the data or performing logical operations to add value. Gateway itself is made of two conceptual parts, the Gateway core, and interceptors.
There is so much you can do with a Conduktor Gateway, just some of the features include:
 - Virtual clusters for your clients through multi-tenancy
 - Encryption, for encrypting at the field level within your Kafka records, to aid with compliance around use of confidential, personal, or high value data
 - Chaos engineering, which enables you to develop against, and then prove that your Kafka applications can handle failure scenarios
 - Safeguarding, which puts structure and guards in place to ensure your Kafka environment is used in the right way

 ![gateway-so-many-features.png](./so-many-features.png)

## Getting Started

To start your Conduktor Gateway journey [review the installation options](installation/installation.md).
## Resources

- [Support](https://www.conduktor.io/contact/support)
- [Arrange a technical demo from us](https://www.conduktor.io/contact/demo)
- [Try out some demos yourself](https://github.com/conduktor/conduktor-gateway-demos)
- [Roadmap](https://product.conduktor.help)