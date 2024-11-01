---
sidebar_position: 1
title: Data Privacy
description: Conduktor does not send your sensitive data anywhere
---

## How are my data and configurations used?

### Configuration: on your disk

Conduktor Gateway is installed on your infrastructure and stores its configuration on your disk and Kafka cluster. It is not stored nor sent anywhere else.. 

Conduktor Gateway will store usernames & passwords you supply to connect to different technologies such as Apache Kafka, Schema Registry etc.

### Data: not sent anywhere

The message data only moves between your Conduktor Gateway, on your infrastructure, and your Apache Kafka clusters and ecosystem (Schema Registry, Kafka Connect, Kafka Streams, ksqlDB, ...). This is never sent anywhere else.

## Where is Conduktor installed?

Conduktor Gateway runs as a docker container on the instance of your choice in your own infrastructure.

## Support / Analytics / Error reporting

We collect basic information about authentication mechanism types to better understand and improve how customers can connect to Gateway such as the SASL mechanism and security protocol types used, sensitive data is never collected.


# Image Vulnerabilities
As part of our development process our images are scanned for any vulnerabilities that have been identified by the community, we updated any necessary libraries to remove them where available.

We use several tools (Dependabot, Snyk, Docker Scout, Harbor, Grype, etc....) to detect vulnerabilities as part of our engineering pipelines, several of these tests are triggered for every commit. We are constantly upgrading our libraries to rely on the most recent /secured versions. The pipeline prevents us from releasing if there are any Critical or High vulnerabilities.

We also regularly run pen-testing campaigns with third-party companies and always enjoy partnering with customers when they organize similar campaigns on their side.
As part of SOC2 certification, Conduktor has developed clear procedures for incident response and tracking their resolution. This is discussed further on our [blog](https://conduktor.io/blog/what-we-learned-from-soc2-type2-write-what-you-do-do-what-you-write).