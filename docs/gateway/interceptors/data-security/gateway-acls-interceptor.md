---
version: 3.0.0
title: ACLs
description: Apply Acls to your gateway resources
parent: data-security
license: enterprise
---

## Introduction

Like in Kafka, you can define ACLs on the Gateway to restrict your applications access. This implies that the authentication is made on Gateway, and that you are **not** using a [delegated mode](/gateway/configuration/kafka-authentication/#delegated-authentication).

:::info
This interceptor is not supported anymore, as of Gateway 3.1.0.

ACLs are now managed as part of Gateway configuration, please refer to this [page](/gateway/concepts/acls/) for more information.
:::