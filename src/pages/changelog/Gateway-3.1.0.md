---
date: 2024-06-05
title: Managed Concentrated topic and Azure Managed Identity
description: docker pull conduktor/conduktor-gateway:3.1.0
solutions: gateway
tags: features,fix
---

Submit your feedback to us via our [public roadmap](https://product.conduktor.help/?utm_source=changelog&utm_medium=webpage&utm_campaign=).

Visit our [Get Started docs](https://docs.conduktor.io/gateway/?utm_source=changelog&utm_medium=webpage&utm_campaign=) page to learn more and how to try our latest version of Conduktor or [chat with the team](https://www.conduktor.io/contact/sales/?utm_source=changelog&utm_medium=webpage&utm_campaign=data_quality_24).

`docker pull conduktor/conduktor-gateway:3.1.0`  

- [AclsInterceptorPlugin removed](#aclsinterceptorplugin-removed)
- [Features](#features)
- [General Fixes 🔨](#general-fixes-🔨)

## AclsInterceptorPlugin removed

Kafka ACLs are now fully integrated in the Core Features of Conduktor Gateway.  
If you were using the AclsInterceptorPlugin, make sure to enable ACLs while upgrading the Gateway to 3.1.0.  
To enable ACLs set the environment variable `GATEWAY_ACL_STORE_ENABLED=true`.

## Features

- Concentrated Topics can now be created with auto-managed flag. Backing topics will be automatically created and extended.
- Added support for Azure Managed Identity for Kafka authentication
- Added an optional configuration for SNI routing to define the separator to use when building host domain for brokers
- Added more context relative to interceptors in Audit logs
- Added the client & version (kafka-client, librdkafka, ...) of the client in the Audit logs on CONNECTED event

## General fixes 🔨

- Added Schema Registry validation on encryption plugins
- Fixed an issue where the KMS Key would not be created if it didn't exist
- Fixed an issue with logger API
