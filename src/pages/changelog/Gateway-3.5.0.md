---
date: 2024-12-12
title: Gateway 3.5.0
description: docker pull conduktor/conduktor-gateway:3.5.0
solutions: gateway
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

## Breaking change: Local Users 💣
:::info
This breaking change only impacts Local Gateway service accounts generated through our token endpoints:
- `POST /admin/username/{username}`
- `POST /admin/vclusters/v1/vcluster/{vcluster}/username/{username}`

If you are using Gateway services accounts from OIDC, mTLS, Delegated Kafka, you are **not** impacted.
:::
Today, the token as the password for local Gateway service accounts contains all the necessary information. As a result, the SASL username is not used during the authentication phase.  

This will help reduce inconsistencies and avoid unexpected behavior.

## Breaking change: default SNI host separator
TODO

***

## Quality of Life
- Support for Kafka Clients up to 3.9
- PXY-1515/encryption-plugin-in-memory-mode-opt-in-only
- CUS-424/pluralsight-change-default-snihostseparator-from-to
  - Breaking change
- PXY-1617/resolve-gw-service-account-security-issue
  - Breaking change


## General fixes 🔨

- PXY-1539/acl-issue-when-data-are-null
- CUS-438/adidas-filtering-with-sql-doesnt-work-with-topics-having-symbols
- CUS-404/sainsburys-kafka-acls-visible-from-vcluster
- PXY-1619/vaults-approle-authentication-support
- PXY-1600/license-expiry-warn-on-expiry-instead-of-shutdown
- CUS-448/internal-sql-topic-filter-avro-doesnt-support-projections-and-fails
- PXY-1515/encryption-plugin-in-memory-mode-opt-in-only


## Known issues
- We are aware of an issue with `kcat` when the new environment variable `GATEWAY_MIN_BROKERID` is not aligned with the first BrokerId of your Kafka cluster
  - As a workaround, you can either define `GATEWAY_MIN_BROKERID` to your first Kafka BrokerId or use `kcat` with the `-E` flag
