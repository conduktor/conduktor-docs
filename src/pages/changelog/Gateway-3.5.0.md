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

## Breaking change: Default SNI Host Separator
In this release we have changed the default value for the separator used in the SNI routing configuration from a period `.` to a dash `-`. This is in order to better allow the use of wild card certificates when certificates are in use.  

The format of the SNI routing host names is now as below:

```properties
 <host_prefix><cluster_id><broker_id>-<advertised_host>
```

Please note that a side effect of this change is that a dash `-` cannot appear in the host prefix or cluster id unless the SNI host separator is overridden.

The previous behaviour of Gateway can be configured by simply adding this to your configuration:

`GATEWAY_SNI_HOST_SEPARATOR=.`

For more information on SNI routing, see [its documentation](/gateway/how-to/sni-routing.md).

## Use of In-memory KMS for Encryption  
Gateway has always supported the use of an in memory KMS for encryption in order to provide an easy-to-use setting for testing and developing your encryption config. This mode is not however meant for production use as the state of the KMS is lost when Gateway restarts, rendering and data encrypted with it unrecoverable.

Before this release, the in memory mode was the default setting and would be used as a fallback if no valid external KMS was detected in the encyrption setup.

From this release, you must now explicitly opt-in to the in-memory mode for encryption using the prefix:

`in-memory-kms://`

If this, or any other valid KMS identifier, is not present the encryption plugin will now fail. This change is a precaution to prevent accidental misconfigurations resulting in the use of in memory mode and subsequent data loss.

See [the encryption configuration docs](/gateway/interceptors/data-security/encryption/encryption-configuration.md) for more information.


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
