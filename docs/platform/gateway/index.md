---
sidebar_position: 1
title: Overview
description: Kafka is a powerful tool, with many nuances and great flexibility. However, this power and flexibility can lead to challenges around managing and bringing structure to your Kafka ecosystem, especially as it grows.
---

# Overview

## What is the Conduktor Gateway

Kafka is a powerful tool, with great flexibility. This power and flexibility can lead to challenges around managing and bringing structure to your Kafka ecosystem, especially as that ecosystem grows.

Conduktor Gateway aids you on your Kafka journey by adding governance, security, auditability, testability and much more.  When using Conduktor Gateway you can more easily follow the path to a mature Kafka set-up, avoiding the pitfalls and the common challenges that come with this progression.  Conduktor Gateway gives you the power to add structure, organisation, enhanced functionality, and therefore confidence in your Kafka environment.

Conduktor Gateway has two offerings: 

The [open-source](https://github.com/conduktor/conduktor-gateway), free to use Conduktor Gateway.

The [Enterprise](https://github.com/conduktor/conduktor-proxy-demos) ready Conduktor Gateway.

## Getting Started

To start your Conduktor Gateway journey [review the installation options](installation/installation.md).

## Components

The core of Conduktor Gateway is the transport layer between your Kafka client applications and your Kafka clusters. 

This transport layer is enhanced with interceptors and features including:
 - Multi tenancy, which allows you to namespace your Kafka cluster across multiple tenants
 - Encryption, which allows you to encrypt fields within your Kafka records to aid with compliance around use of confidential, personal, or high value data
 - Chaos engineering, which enables you to develop against, and then prove that your Kafka applications can handle failure scenarios
 - Safeguard, which puts structure and guards in place to ensure your Kafka environment is used in the right way


The open source Conduktor Gateway gives a taster of these features which you can run quickly and easily. It has a selection of interceptors available for you to try in your environment.

**Try the source available Conduktor Gateway ** via **[Conduktor Gateway](https://github.com/conduktor/conduktor-gateway)**.

The enterprise Conduktor Gateway is a fully functional, pre-packaged offering, and we will work closely with you to ensure that you get the most from the benefits it will bring to your organisation.

**Try the Enterprise Conduktor Gateway ** via the **[conduktor proxy demos](https://github.com/conduktor/conduktor-proxy-demos)** or [get in touch with us](https://www.conduktor.io/contact).

Both offerings are fully Apache Kafka protocol compliant, and support use of Kafka wherever that Kafka is hosted.

## Compare the offerings

| **Functionality**              | **Source Available** | **Enterprise Ready** |
|:-----------------------------|:----------------:-|:------------------:|
| Cost                         | Free             | Custom pricing   |
| Support                      | Community        | Fully supported  |
| Kafka protocol compliant     | Yes              | Yes              |
| Security                     | [Yes (limited)](./configuration/oss_security.md)| [Yes](./configuration/enterprise_proxy_security.md)
| Multi Tenancy                | -                | Yes              |
| Chaos engineering            | Yes (limited)    | Yes              |
| Safeguard                    | Yes (limited)    | Yes              |
| Schema validation            | Yes (limited)    | Yes              |
| Encryption                   | -                | Yes              |
| Data transforms              | -                | Yes              |
| Data audit                   | -                | Yes              |
| Cold storage                 | -                | Yes              |
| Create your own interceptor  | Yes              | Yes              |
| Community Marketplace        | Yes              | -                |


## Resources

- [Roadmap](https://product.conduktor.help)
- [Support](https://www.conduktor.io/contact/support)
- [Arrange a technical demo](https://www.conduktor.io/contact/demo)
