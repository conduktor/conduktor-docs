---
sidebar_position: 1
title: Data Security
description: Conduktor on-premise does not send your data anywhere. Everything stays between your computer and your Apache Kafka clusters / applications.
---

# Data Security : ON-PREMISE

## How are my data and configurations used?

### Configuration: on your disk

Conduktor Platform, installed on your infrastructure, stores its configuration either on your disk or in a provided database. It is not stored nor sent anywhere else. It will contain some username & password used by Conduktor Platform to connect to the different technologies: Apache Kafka, Schema Registry etc.

### Data: not sent anywhere

The data only transits between your Conduktor Platform, on your infrastructure, and your Apache Kafka clusters and ecosystem (Schema Registry, Kafka Connect, Kafka Streams, ksqlDB, ...). They are not sent anywhere else.

### Data Flow

Your data stays exclusively in your enterprise network. It flows only between Conduktor and your brokers & applications.

## Where is Conduktor installed?

Conduktor Platform runs as a docker container on the instance of your choice in your own infrastructure.

## Analytics / Error reporting

In order to improve the Platform experience for our users, we are sending fully anonymized analytics:

- Segment (totally anonymized): about which dialog is opened, which button was clicked etc. This will help us determining some screens are super used or not used at all.
- Sentry: only in case of errors, we send the error to Sentry to provide us visibility, if a feature is broken.

## Login / Licenses

To use Conduktor, login is not mandatory, you can use your own IDP over OIDC with an enterprise license.

