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

The previous behaviour of Gateway can be configured by simply adding this to your configuration:

`GATEWAY_SNI_HOST_SEPARATOR=.`

For more information on SNI routing, see [its documentation](/gateway/how-to/sni-routing).

## Use of In-memory KMS for Encryption  
Gateway has always supported the use of an in memory KMS for encryption in order to provide an easy-to-use setting for testing and developing your encryption config. This mode is not however meant for production use as the state of the KMS is lost when Gateway restarts, rendering any data encrypted with it unrecoverable.

Before this release, the in memory mode was the default setting and would be used as a fallback if no valid external KMS was detected in the encyrption setup.

From this release, you must now explicitly opt-in to the in-memory mode for encryption using the prefix:

`in-memory-kms://`

If this, or any other valid KMS identifier, is not present the encryption plugin will now fail. This change is a precaution to prevent accidental misconfigurations resulting in the use of in memory mode and subsequent data loss.

See [the encryption configuration docs](/gateway/interceptors/data-security/encryption/encryption-configuration) for more information.

## Licence Expiry

We have altered the behaviour of the Gateway when your licence expires to provide a better experience. The behaviour is now as below:

* We have added new metric `gateway.license.remaining_days` which you can monitor to track the time left on your licence
* If the Gateway is currently running, do not automatically exit on license expiry. Rather, Gateway will now log a warning every hour that your licence is expired:

```text
License has expired! You need to add a valid license to continue using Conduktor Gateway. Checkout our documentation if unsure how to set the license
```

* These warnings will start 1 week before expiry occurs as a notification, in the format:

```text
License will expire in less than {N} day(s)! You need to renew your license to continue using Conduktor Gateway
```

* Finally, we now check your license earlier in the bootstrap sequence for Gateway, so it will fail fast with a clear message when your licence is expired.

The key change here is that if your licence does expire, Gateway will not exit automatically anymore. It will continue running, logging warnings. Should you restart the Gateway in this state, it will then fail to start up - but there is no automatic shutdown. 

***

## Quality of Life
- Support for Kafka Clients up to 3.9
- Improved compatibility and logging for dealing with kafka-client versions and version negotiations
- Added support for multiple authentication mechanisms against Vault (AppRole, LDAP, ...)
- Introduced a new configuration `enableAuditLogOnError` (default: `true`) which enhances the errors which are logged when encryption/decryption fails
- Improved error logging for expired tokens on authentication, to replace large stack traces with concise information
- Performance improvements for TLS handshakes, in particular to prevent repeated failed attempts overloading the gateway
- Several improvements to data quality and encryption config validation to provide better error reporting and feedback in the case of problems



## General fixes 🔨
- Fixed an issue in ACL handling which caused an error if no topics were passed for an offset fetch request (being the case where the caller wants to retrieve offsets for all topics). 
- Fixed an issue in Virtual Clusters which in some cases meant the ACLs for the physical Kafka clusters where exposed in error.
- Fixed an issue in the regular expression application in the data quality and SQL plugins, where `.*` would not always match the entire value for a field
- Fix an issue when creating both a service account and a service account group through the cli to ensure the order of operations is always correct, preventing intermittent failures in this case.


## Known issues
- We are aware of an issue with `kcat` when the new environment variable `GATEWAY_MIN_BROKERID` is not aligned with the first BrokerId of your Kafka cluster
  - As a workaround, you can either define `GATEWAY_MIN_BROKERID` to your first Kafka BrokerId or use `kcat` with the `-E` flag
