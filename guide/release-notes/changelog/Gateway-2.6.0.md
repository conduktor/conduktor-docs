---
date: 2024-02-12
title: Schema based encryption, KMS managed identity and Key Caching 
description: docker pull conduktor/conduktor-gateway:2.6.0
solutions: gateway
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Schema based encryption

You can now define your encryption requirement directly within your Schemas.

Here is an example using json schema where we specify that we want to encrypt the `password` and `visa` fields, with their corresponding `keySecretId`.
We also tag the `location` field as `PII` and `GDPR`.

```json
{
  "$id": "https://example.com/person.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Customer",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "username": { "type": "string" },
    "password": { "type": "string", "conduktor.keySecretId": "password-secret"},
    "visa": { "type": "string", "conduktor.keySecretId": "visa-secret" },
    "address": {
      "type": "object",
      "properties": {
        "location": { "type": "string", "conduktor.tags": ["PII", "GDPR"] },
        "town": { "type": "string" },
        "country": { "type": "string" }
      }
    }
  }
}
```

The encryption configuration now supports defaults to simplify your setups

```json
{
    "defaultKeySecretId": "myDefaultKeySecret",
    "defaultAlgorithm": {
      "type": "TINK/AES128_EAX",
      "kms": "IN_MEMORY"
    },
    "tags": [ "PII", "ENCRYPTION", "GDPR" ]
}
```

### KMS now use cloud managed identities by default

To prevent setting up manual connectivity, KMS are now using cloud managed identity by default

* [AWS](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html#credentials-default)
* [AZURE](https://learn.microsoft.com/en-us/java/api/com.azure.identity.defaultazurecredential?view=azure-java-stable)
* [GCP](https://github.com/googleapis/google-auth-library-java/blob/main/README.md#application-default-credentials)


### Cache KMS Time to Live

You can now cache the KMS keys for a certain amount of time. This is useful to reduce the number of calls to your KMS.

`keyTtlMs`: The key's time to live in milliseconds. Default is 1 hour, disable the cache by setting it to 0


### Override Header Injections

Header config can now be further enforced with overrides, the plugin now supports `overrideIfExists` with default set to `false`. When set to `true`, the plugin will override the header if it already exists in the request. This can be useful for if a required piece of metadata is missing in the header, you can add something automatically whilst ignoring the ones that have set the value.


### SSL Principal Extraction

The SSL principal extraction is now configurable with `GATEWAY_SSL_PRINCIPAL_MAPPING_RULES` it will follow the same rules as [Kafka](https://kafka.apache.org/documentation/#brokerconfigs_ssl.principal.mapping.rules). 


### General Fixes 🔨

* Quieter responses to Prometheus by not publishing HTTP quantiles in the response
* Topic configuration is now returned in all Gateway modes
* Additional tools have been added to the base image to help with setup and debug: lsof, iotop, htop, iftop
