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

We collect basic information about authentication mechanism types to better understand and improve how customers can connect to Gateway such as the SASL mechanism and security protocol types, sensitive data is never collected.
