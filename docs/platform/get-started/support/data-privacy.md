---
sidebar_position: 2
title: Data Privacy
description: Conduktor does not send your data anywhere. Everything stays between your computer and your Apache Kafka clusters / applications.
---

## How are my data and configurations used?

### Configuration: on your disk

Conduktor Console, installed on your infrastructure, stores its configuration either on your disk or in a provided database. It is not stored nor sent anywhere else. 

Console will contain some username & password used by itself to connect to the different technologies: Apache Kafka, Schema Registry etc.

### Data: not sent anywhere

The data only transits between your Conduktor Console, on your infrastructure, and your Apache Kafka clusters and ecosystem (Schema Registry, Kafka Connect, Kafka Streams, ksqlDB, ...). They are not sent anywhere else.

### Data Flow

Your data stays exclusively in your enterprise network. It flows only between Console and your brokers & applications.

## Where is Conduktor installed?

Conduktor Console runs as a docker container on the instance of your choice in your own infrastructure.

## Support / Analytics / Error reporting

In order to improve our product, we collect some information that allows us to personalize the Console user experience.  

- Segment:
  - We collect your login email address so that we can personalize our [Support](https://support.conduktor.io)  
  - We capture anonymized information about which pages have been seen, or which button was clicked. This allows us to enhance the user experience of navigation  
  - We collect error information to provide us visibility of broken features

## Login / Licenses

To use Conduktor, login is not mandatory, you can use your own IdP (LDAP or OIDC).

