---
sidebar_position: 2
title: Data Privacy
description: Conduktor does not send your data anywhere. Everything stays between your computer and your Apache Kafka clusters / applications.
---

## How are my data and configurations used?

### Configuration: on your disk

Conduktor Console, installed on your infrastructure, stores its configuration either on your disk or in a provided database. It is not stored nor sent anywhere else. 

Console will contain some username & passwords used for connecting to the different technologies e.g. cluster credentials for connecting to the Kafka cluster, Schema Registry connection details...   
It will also store local admin passwords (hashed) that you create as part of the configuration setup.

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
  - We capture information about which pages have been visited and which actions are taken in the product e.g. which buttons are clicked, which features are used. This allows us to enhance the user experience of navigation  
  - We collect error information to provide us visibility of problem areas

## Login / Licenses

To use Conduktor, a login is not provided, it is configured within your organization e.g. using your own IdP (LDAP or OIDC).

## Image Vulnerabilities
As part of our development process our images are scanned for any vulnerabilities that have been identified by the community, we updated any necessary libraries to remove them where available.

We use several tools (Dependabot, Snyk, Docker Scout, Harbor, Grype, etc....) to detect vulnerabilities as part of our engineering pipelines, several of these tests are triggered for every commit. We are constantly upgrading our libraries to rely on the most recent /secured versions. The pipeline prevents us from releasing if there are any Critical or High vulnerabilities.

We also regularly run pen-testing campaigns with third-party companies and always enjoy partnering with customers when they organize similar campaigns on their side.
As part of SOC2 certification, Conduktor has developed clear procedures for incident response and tracking their resolution. This is discussed further on our [blog](https://conduktor.io/blog/what-we-learned-from-soc2-type2-write-what-you-do-do-what-you-write).
