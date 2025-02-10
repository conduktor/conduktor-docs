---
date: 2025-02-11
title: Hotfix for Gateway 3.6.0
description: docker pull conduktor/conduktor-gateway:3.6.0
solutions: gateway
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Features ✨

#### Kafka Cluster Connection Management

This release includes a set of enhancements to how the gateway manages connectivity to a Kafka Cluster. This provides greater stability and flexibility for how the gateway can be configured regards the Kafka Clusters it is connected to, and is a precursor change for future product releases.

#### Encryption Improvements

##### Encryption Secret Id Mustache Templates

The encryption now allows multiple mustache substitutions in a key sercret Id configuration. Previously, only a single substitution was supported. E.g. This is now allowed:

`"keySecretId": "vault-kms://my-vault:8200/transit/keys/{{record.key}}-{{record.header.someHeader}}"`


##### Decryption Failure Modes

This release adds a new optional configuration option to the decryption plugin to allow different modes of handling errors. There are currently now two supported modes:

* `errorPolicy: "return_encrypted"` Behave as per before, if there is an error during decryption, then the encrypted data is returned
* `errorPolicy: "fail_fetch"` New mode, if there is an error during decryption then the fetch that was reading the data is failed and the client will receive an error

In both cases, we have enhanced the logging so issues during decryption are more fully reported. 

#### Schema Registry Access Improvements

##### Read Only Schema Registry Access

Some of our gateway plugins will deserialise and re-serialise messages in order to perform their functions, and a side effect of this is that the serialiser code would needlessly require write access to the Schema Registry. While there was **no situation** where the gateway would actually casue any updated or additional schema to appear - we have altered the Schema Registry access to be read only. This is avoids having to assign write permission needlessly for our gateway Schema Registry conenctions if you are using ACLs on your Schema Registry.

##### Plugin Validation of Schema Registry Access

All gateway plugins which access the Schema Registry will now validate that the configuration for the Schema Registry is correct at the point the configuration for a plugin is added or updated in the gateway. Previously this behaviour was inconsistent, and a few of our plugins would only detect incorrect configurations when they processed a message rather than when they were setup.


### Quality of Life Improvements

- Added a new CLI command `conduktor run generateServiceAccountToken` to generate the JWT for Local service accounts. Update your CLI to version 0.3.5 or higher.

### Fixes 🔨

* Fix: CreateTopicPolicy and AlterTopicPolicy overrides. There were some edge cases where the desired overrides from the plugin config would not be applied. These plugins now behave consistently in all situations.
* Improvement: Remove some verbose logging log, and updated some logging to be clearer on the problems. A general set of improvements have been made to areas of the logging performed by the gateway in order to make the casue for some errors clearer, or to reduce repeated logging of the same error in some situations.

