---
date: 2023-08-18
title: Gateway V2 Major Release
description: The latest version of Conduktor Gateway introduces a host of new featuress & fixes improvements from V1. Including an overhauled API experience, additional encryption features and onboarding enhancements!
solutions: gateway
tags: features
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

## General features ✨

### Passthrough security for a simple setup experience

You have several options when connecting your clients to Gateway. We have added the option for Passthrough security for a simple, quick setup experience. With Passthrough security Gateway passes the existing credentials straight through to the backing cluster with no further checks. This is likely what you will use out of the box.

### API overhaul for an improved developer experience

Our admin API for creating virtual clusters, adding plugins and more has been overhauled for a much simpler and more consistent experience. It is available on your local http server for the version you are running or check it out online! [developers.conduktor.io](https://developers.conduktor.io/).

![api-doc-online](/images/changelog/gateway/v2.0.0/api-doc-online.png)

### Simple OOTB load balancer

A simple load balancer that will randomly select an instance of Gateway as connections are routed, allowing you to get started without having to setup any load balancer from the start.

### Log Datetime format configurable to suit your setup

Date time format of log can now be updated using the `LOG4J2_TIME_FORMAT` env var (Default is set to `yyyy-MM-dd'T'HH:mm:ss.SSSZ`). Options for patterns are available on the [log4j site](https://logging.apache.org/log4j/2.x/manual/layouts.html#PatternDate).

### Troubleshooter & Distroless product variants now available

Gateway is now available with an additional variant of the image, the default image now has enhanced debug tools embedded (`curl / kcat / nc / kafka cli`) to help with your setup and everyday usage. For those who want the top level of security a distroless variant is also available where needed to meet tighter security requirements in production.

## Conduktor Data Security

### Encryption for partners

When working with external partners sharing data can be difficult, time consuming or costly. Gateway now offers a straightfoward solution to this industry problem, encrypting field-level data for certain Kafka consumers only. By creating a username with the 'consume' encryption plugin, it allows you organization to share data with external partners, without the need to duplicate data or make additional architecture changes.

![3rd-party-encryption-miro.png](/images/changelog/gateway/v2.0.0/3rd-party-encryption-miro.png)

### Encryption and Masking support for non-string fields

Gateway encryption now supports values beyond type string, this is available for avro, protobuf and json formats.

### Support for dynamic secret keys

Gateway can now support dynamic secret keys, in this way you can delete keys for decryption thereby cryptographically shredding this data forever.

```json
    "fields": [
    {
        "fieldName": "password",
        "keySecretId": "hcvault://vault:8200/transit/keys/secret-for-{{record.value.name}}"
     }
    ]
```

## Conduktor Governance

### Additional header injection fields

New fields for the header injection plugin including; Virtual cluster name, Username, Client id, Gateway instance ip, Gateway Version, ApiKey version, Timestamp (this is the timestamp of the injection).

### Enhanced error reporting

When interacting with several of the Goverance features to safeguard your Kafka the topic(s) that are affected are returned in the error message back to you. This detail is provided in the topic creation, topic alter, produce and limit join group policies.

`'Request parameters do not satisfy the configured policy. Topic 'cars' with retention.ms is '5184000000', must not be greater than '432000000'`

## Conduktor Optimize

### Reduced costs for multi-az deployments

Kafka clusters are often distributed across multiple availability zones (AZ), especially in Cloud deployments. Kafka offers some facilities to reduce expensive cross-DC traffic. (see [KIP-392](https://cwiki.apache.org/confluence/display/KAFKA/KIP-392%3A+Allow+consumers+to+fetch+from+closest+replica), [KIP-881](https://cwiki.apache.org/confluence/display/KAFKA/KIP-881%3A+Rack-aware+Partition+Assignment+for+Kafka+Consumers)). We've introduced awareness of the, configurable, rack id, allowing you to limit Gateway to only choose nodes in the same rack as the target broker.
