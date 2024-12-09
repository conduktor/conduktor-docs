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

From this release, we will now strictly enforce that the username and the token matches in requests made to the Gateway where local service accounts are used. This will help reduce inconsistencies and avoid unexpected behaviors. If they do not match, requests will fail to authenticate.


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
- The encryption plugin now requires explicit opt-in for its in memory KMS mode, to safeguard against production misconfigurations 
- The default SNI host separator is now a dash `-`, to avoid issues with wild card certificates.
  - Breaking change
- Enforce that the username and the token matches in calls to the Gateway when local service accounts are used.
  - Breaking change
- Added support for Approle authentication against Vault


## General fixes 🔨
TBD - replace with proper descriptions
- Fixed a bug in ACL handling which caused an error if no topics were passed for an offset fetch request (being the case where the caller wants to retrieve offsets for all topics). 
- Fixed a bug in Virtual Clusters which in some cases meant the ACLs for the physical Kafka clusters where exposed in error.
- Changed the behaviour when your licence expires, such that the Gateway will now warn in its logs but not shutdown.


## Known issues
- We are aware of an issue with `kcat` when the new environment variable `GATEWAY_MIN_BROKERID` is not aligned with the first BrokerId of your Kafka cluster
  - As a workaround, you can either define `GATEWAY_MIN_BROKERID` to your first Kafka BrokerId or use `kcat` with the `-E` flag
