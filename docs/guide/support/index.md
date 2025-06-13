---
sidebar_position: 600
title: Get support
description: Get help and support with using Conduktor.
---

## Get help or support

- [Contact support](https://support.conduktor.io/hc/en-gb/requests/new)
- [**Already a customer?** Check the status of an open issue or raise a new ticket](https://support.conduktor.io/hc/en-gb/signin?return_to=https%3A%2F%2Fsupport.conduktor.io%2Fhc%2Fen-gb%2Frequests%2Fnew%3Fticket_form_id%3D17438312520209)
- [Join Conduktor on Slack](https://www.conduktor.io/slack)

## Check out other resources

- [Release notes](/changelog)
- [View our version policy](/support)
- [Arrange a technical demo](https://www.conduktor.io/contact/demo)
- [Join Conduktor on GitHub](https://github.com/conduktor)

### Support portal

Conduktor's [support portal](https://support.conduktor.io) lets you:

- report an issue or raise a request - this is the quickest way to get in touch
- check progress and manage your tickets
- Subscribe to get notified about new releases of [Console](https://support.conduktor.io/hc/en-gb/sections/16400553827473-Conduktor-Console) and [Gateway](https://support.conduktor.io/hc/en-gb/sections/16400521075217-Conduktor-Gateway)
- Check out knowledge base articles

![Support Portal](/guide/support-portal.png)

:::info[The more detail, the better!]
When reporting an issue, please give us **as much context and detail as possible**. The more information you provide, the faster we'll diagnose the issue and offer a fix/suggest a workaround.
:::

## Data privacy using Conduktor

### Configuration: on your disk

Conduktor Gateway is installed on your infrastructure and stores its configuration on your disk and Kafka cluster. It is not stored nor sent anywhere else.

Conduktor Gateway will store usernames and passwords you supply to connect to different technologies such as Apache Kafka, Schema Registry etc.

### Data: not sent anywhere

The message data only moves between your Conduktor Gateway and your Apache Kafka clusters and ecosystem (such as schema registry, Kafka Connect, ksqlDB). This is never sent anywhere else.

### Where is Conduktor installed?

Conduktor Gateway runs as a Docker container that you can deploy using on any Docker or Kubernetes type environment, either self-hosted or cloud based.

### Analytics and error reporting

We collect basic information about authentication mechanism types to better understand and improve how customers can connect to Gateway such as the SASL mechanism and security protocol types used. Sensitive data is never collected.

### Image vulnerabilities

As part of our development process, our images are scanned for any vulnerabilities that have been identified by the community, and we update necessary libraries to remove them where available.

We use several tools (Dependabot, Snyk, Docker Scout, Harbor, Grype, etc.) to detect vulnerabilities as part of our engineering pipelines, with several of these tests being triggered for every commit. We are constantly upgrading our libraries to rely on the most recent / secured versions. The pipeline prevents us from releasing if there are any Critical or High vulnerabilities.

We also regularly run pen-testing campaigns with third-party companies and always enjoy partnering with customers when they organize similar campaigns on their side.

As part of SOC2 certification, Conduktor has developed clear procedures for incident response and tracking their resolution.

[Find out more](https://conduktor.io/blog/what-we-learned-from-soc2-type2-write-what-you-do-do-what-you-write).
