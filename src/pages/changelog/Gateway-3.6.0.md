---
date: 2025-02-07
title: Hotfix for Gateway 3.6.0
description: docker pull conduktor/conduktor-gateway:3.6.0
solutions: gateway
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Features ✨

#### Multiple Kafka Cluster Connections

TBD

#### Encryption Improvements

Several minor improvements have been made to the encryption plugins for gateway.

* Improvement: Encryption mustache templates


* Improvement: Decryption failure modes

This release adds a new optional configuration option to the decryption plugin to allow different modes of handling errors. There are currently now two supported modes:

`errorPolicy: "return_encrypted"`

`errorPolicy: "fail_fetch"`

* Improvement: Encryption add namespace support for vault KMS

### Quality of Life Improvements
- Added a new CLI command `conduktor run generateServiceAccountToken` to generate the JWT for Local service accounts. Update your CLI to version 0.3.5 or higher.

### Fixes 🔨

* Improvement: Read only schema registry access

Some of our gateway plugins will deserialise and re-serialise messages in order to perform their functions, and a side effect of this is that in certain cases the serialiser code will attempt to re-register a schema (Avro, Protobuf). While there was no situation where this would actually casue any updated or additional schema to appear - we have altered the Schema Registry access to be read only. This is primarily to avoid having to assign write permission needlessly for our gateway Schema Registry conenctions if you are using ACLs on your Schema Registry.

* Improvement: CreateTopicPolicy override applications



* Improvement: Remove log spamming, and updated some logging to be clearer on the issue logged

A general set of improvements have been made to areas of the logging performed by the gateway in order to make the casue for some errors clearer, or to reduce repeated logging of the same error in some situations.

* Improvement: Plugin validation of schema registry access

All gatewqy plugins which access the Schema Registry will now validate that the configuration for the Schema REgistry in the plugin is correct at the point the configuration is added or updated in the gateway. Previously this behanviour was in consistent, and a few of our Plugins would only detect incorrect configurations when they processed a message, rather than when they are setup.

